/**
 * @file implementation.ts
 * @description 実装ロードマップAPIルート
 * Implementation roadmap API routes for serving dynamic recommendations
 */

import express from 'express';
import { buildRoadmap } from '../services/roadmap-builder';
import { capabilityService } from '../services/capability-service';
import { considerationMap } from '../data/stretch-goals';
import { logger } from '../utils/logger';
import { storage } from '../storage';
import { requireValidSession } from '../middleware/session';
import { handleApiError } from '../utils/errorHandler';
import type { ImplementationRoadmap, RoadmapPhase, Recommendation } from '../models/roadmap-types';
import type { CategoryId } from '../rules/issue-rule-model';

const router = express.Router();

// Apply authentication middleware to all implementation routes
router.use(requireValidSession);

/**
 * GET /api/implementation/:assessmentId
 * 指定された評価IDに基づいて実装ロードマップを生成
 * Generate implementation roadmap based on assessment ID
 */
router.get('/:assessmentId', async (req, res) => {
  try {
    // Get the session ID from the request (added by requireValidSession middleware)
    const sessionId = (req as any).sessionId;
    
    const { assessmentId } = req.params;
    const { orgSize = 'md', assessmentType = 'comprehensive' } = req.query;
    
    // Get language from Accept-Language header
    const language = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
    
    logger.info(`Generating implementation roadmap for assessment ${assessmentId} with language ${language}`, { sessionId });
    
    // Get current assessment to verify it exists and belongs to this session
    const assessment = await storage.getCurrentAssessment(sessionId);
    if (!assessment) {
      return res.status(404).json({ message: "No assessment found" });
    }
    
    // Verify the assessment ID matches (if provided as number)
    const numericAssessmentId = parseInt(assessmentId);
    if (!isNaN(numericAssessmentId) && assessment.id !== numericAssessmentId) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    
    // Get organization data to determine size
    let organizationSize = orgSize as "xs" | "sm" | "md" | "lg";
    if (assessment.organizationId) {
      try {
        const organization = await storage.getOrganization(assessment.organizationId, sessionId);
        if (organization) {
          // Map the company size to the expected format for the roadmap builder
          const sizeMap: Record<string, "xs" | "sm" | "md" | "lg"> = {
            "1-10": "xs",
            "11-50": "xs", 
            "51-100": "sm",
            "101-250": "sm",
            "251-500": "md",
            "501-2000": "md",
            "2001-5000": "lg",
            "5001+": "lg"
          };
          organizationSize = sizeMap[organization.companySize] || "md";
        }
      } catch (error) {
        logger.warn('Error getting organization data, using default size', { error, sessionId });
      }
    }
    
    // Get category scores from the actual assessment
    const categoryScores = await storage.getCategoryScores(sessionId);
    if (!categoryScores || categoryScores.length === 0) {
      return res.status(400).json({ message: "Assessment must be completed first" });
    }
    
    // Convert to the format expected by buildRoadmap
    const scoreMap: Record<string, number> = {};
    categoryScores.forEach(score => {
      // Only include scores that are >= 0 (not knowledge gaps)
      if (score.score >= 0) {
        scoreMap[score.categoryId] = score.score;
      }
    });
    
    // Build roadmap using the sophisticated backend logic
    const roadmapItems = buildRoadmap(
      scoreMap,
      organizationSize,
      assessment.assessmentType || assessmentType as string
    );
    
    // Transform roadmap items into structured phases
    const phases: RoadmapPhase[] = [
      { index: 0, band: 'short', recommendations: [] },
      { index: 1, band: 'medium', recommendations: [] },
      { index: 2, band: 'long', recommendations: [] }
    ];
    
    const recommendationsById: Record<string, Recommendation> = {};
    
    // Categorize items into phases based on duration and priority
    roadmapItems.forEach((item, index) => {
      const recommendation: Recommendation = {
        id: item.id,
        stepRef: item.id,
        category: item.category as CategoryId,
        impactArea: item.impact_area,
        priorityRank: index + 1,
        impactLevel: mapImpactLevel(item.impact_area),
        effortLevel: mapEffortLevel(item.effort_points),
        roiScore: item.priority,
        timeline: {
          min: Math.max(1, Math.floor(item.duration_weeks * 0.8)),
          max: Math.ceil(item.duration_weeks * 1.2),
          unit: 'weeks' as const
        },
        quickWin: item.quick_win || false,
        label: item.label,
        description: item.description,
        phase: item.phase
      };
      
      // Add considerations for high-maturity categories or considerations-only items
      if (item.considerations_only && considerationMap[item.category as CategoryId]) {
        (recommendation as any).considerations = considerationMap[item.category as CategoryId][language as 'en' | 'ja'];
      }
      
      // Assign to phase based on duration and quick win status
      let phaseIndex = 0;
      if (item.quick_win) {
        phaseIndex = 0; // All quick wins go to short-term
      } else if (item.duration_weeks > 12) {
        phaseIndex = 1; // Medium-term
      } else if (item.duration_weeks > 24) {
        phaseIndex = 2; // Long-term
      }
      
      phases[phaseIndex].recommendations.push(recommendation);
      recommendationsById[item.id] = recommendation;
    });
    
    // Sort recommendations within each phase by priority
    phases.forEach(phase => {
      phase.recommendations.sort((a, b) => a.priorityRank - b.priorityRank);
    });
    
    const roadmap: ImplementationRoadmap = {
      assessmentId: assessment.id || 0,
      phases,
      recommendationsById
    };
    
    logger.info(`Generated roadmap with ${roadmapItems.length} recommendations across ${phases.length} phases`, { 
      sessionId,
      shortTerm: phases[0].recommendations.length,
      mediumTerm: phases[1].recommendations.length,
      longTerm: phases[2].recommendations.length
    });
    
    res.json(roadmap);
    
  } catch (error) {
    logger.error('Error generating implementation roadmap:', error);
    handleApiError(res, error, "ROADMAP_GENERATION_ERROR");
  }
});

/**
 * GET /api/implementation/recommendation/:id
 * 特定の推奨事項の詳細を取得
 * Get detailed information for a specific recommendation
 */
router.get('/recommendation/:id', async (req, res) => {
  try {
    // Get the session ID from the request (added by requireValidSession middleware)
    const sessionId = (req as any).sessionId;
    
    const { id } = req.params;
    
    // Get language from Accept-Language header
    const language = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
    
    logger.debug(`Fetching recommendation details for ID: ${id} with language ${language}`, { sessionId });
    
    // Find the capability step by ID
    const capabilityStep = capabilityService.listAll().find(step => step.id === id);
    
    if (!capabilityStep) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }
    
    // Get dependencies details
    const dependencies = capabilityStep.dependencies.map(depId => {
      const dep = capabilityService.listAll().find(step => step.id === depId);
      return dep ? {
        id: dep.id,
        label: dep.label,
        description: dep.description
      } : null;
    }).filter(Boolean);
    
    // Check if this is a high-maturity category with considerations
    const considerations = considerationMap[capabilityStep.category as CategoryId];
    
    const detailedRecommendation = {
      ...capabilityStep,
      dependencies,
      considerations: considerations || undefined,
      implementationSteps: getImplementationSteps(capabilityStep, language as 'en' | 'ja'),
      successCriteria: getSuccessCriteria(capabilityStep, language as 'en' | 'ja')
    };
    
    res.json(detailedRecommendation);
    
  } catch (error) {
    logger.error('Error fetching recommendation details:', error);
    handleApiError(res, error, "RECOMMENDATION_FETCH_ERROR");
  }
});

// Utility functions for roadmap building (matching main routes.ts patterns)
function mapImpactLevel(impactArea: string): 'Low' | 'Medium' | 'High' {
  const impactMap: Record<string, 'Low' | 'Medium' | 'High'> = {
    // Higher weights = higher impact
    'DP': 'High',    // Developer Productivity
    'TM': 'High',    // Time to Market
    'IM': 'Medium',  // Incident Management
    'OE': 'Medium',  // Operational Efficiency
    'IC': 'Low'      // Infrastructure Cost
  };
  return impactMap[impactArea] || 'Medium';
}

function mapEffortLevel(effortPoints: number): 'Low' | 'Medium' | 'High' {
  if (effortPoints <= 2) return 'Low';
  if (effortPoints <= 5) return 'Medium';
  return 'High';
}

// Helper functions to generate specific implementation steps and success criteria
function getImplementationSteps(capabilityStep: any, language: 'en' | 'ja'): { en: string[]; ja: string[] } {
  const category = capabilityStep.category;
  const effortPoints = capabilityStep.effort_points;
  const impactArea = capabilityStep.impact_area;
  const isQuickWin = capabilityStep.quick_win;

  // Category-specific implementation patterns
  const categorySteps: Record<string, { en: string[]; ja: string[] }> = {
    foundations_culture: {
      en: [
        "Assess current team culture and communication patterns",
        "Identify key stakeholders and change champions",
        "Design cultural change program with clear milestones",
        "Implement pilot program with selected teams",
        "Gather feedback and iterate on the approach",
        "Scale successful practices across the organization",
        "Establish ongoing measurement and reinforcement mechanisms"
      ],
      ja: [
        "現在のチーム文化とコミュニケーションパターンを評価",
        "主要ステークホルダーと変革推進者を特定",
        "明確なマイルストーンを持つ文化変革プログラムを設計",
        "選択されたチームでパイロットプログラムを実装",
        "フィードバックを収集しアプローチを改善",
        "成功した実践を組織全体に拡大",
        "継続的な測定と強化メカニズムを確立"
      ]
    },
    security_compliance: {
      en: [
        "Conduct security assessment and gap analysis",
        "Research and select appropriate security tools and frameworks",
        "Design security policies and compliance procedures",
        "Implement security controls in development environment",
        "Test security measures and validate compliance",
        "Deploy security solutions to production with monitoring",
        "Establish ongoing security review and audit processes"
      ],
      ja: [
        "セキュリティ評価とギャップ分析を実施",
        "適切なセキュリティツールとフレームワークを調査・選択",
        "セキュリティポリシーとコンプライアンス手順を設計",
        "開発環境でセキュリティ制御を実装",
        "セキュリティ対策をテストしコンプライアンスを検証",
        "監視付きで本番環境にセキュリティソリューションを展開",
        "継続的なセキュリティレビューと監査プロセスを確立"
      ]
    },
    cicd_practices: {
      en: [
        "Analyze current development and deployment workflows",
        "Design CI/CD pipeline architecture and tool selection",
        "Implement automated build and test processes",
        "Set up deployment automation with proper gates",
        "Test pipeline with sample applications",
        "Train development teams on new CI/CD processes",
        "Monitor pipeline performance and continuously optimize"
      ],
      ja: [
        "現在の開発・デプロイワークフローを分析",
        "CI/CDパイプラインアーキテクチャとツール選択を設計",
        "自動ビルドとテストプロセスを実装",
        "適切なゲートを持つデプロイ自動化を設定",
        "サンプルアプリケーションでパイプラインをテスト",
        "開発チームに新しいCI/CDプロセスをトレーニング",
        "パイプラインパフォーマンスを監視し継続的に最適化"
      ]
    },
    observability: {
      en: [
        "Assess current monitoring and observability gaps",
        "Select and configure monitoring, logging, and tracing tools",
        "Implement instrumentation in applications and infrastructure",
        "Set up dashboards and alerting rules",
        "Test observability stack with synthetic scenarios",
        "Train teams on using observability tools effectively",
        "Establish SLI/SLO framework and incident response procedures"
      ],
      ja: [
        "現在の監視と可観測性のギャップを評価",
        "監視・ログ・トレーシングツールを選択・設定",
        "アプリケーションとインフラにインストルメンテーションを実装",
        "ダッシュボードとアラートルールを設定",
        "合成シナリオで可観測性スタックをテスト",
        "チームに可観測性ツールの効果的な使用方法をトレーニング",
        "SLI/SLOフレームワークとインシデント対応手順を確立"
      ]
    }
  };

  // Get category-specific steps or fall back to generic
  const specificSteps = categorySteps[category];
  if (specificSteps) {
    return specificSteps;
  }

  // Generic steps based on effort level and impact area
  const baseSteps = {
    en: [
      "Assess current state and identify gaps",
      "Research and evaluate appropriate tools and approaches",
      "Create detailed implementation plan with stakeholders",
      "Implement solution in a controlled environment",
      "Test and validate functionality and performance",
      "Roll out to broader organization with appropriate training",
      "Document processes and create operational procedures"
    ],
    ja: [
      "現状を評価し、ギャップを特定する",
      "適切なツールとアプローチを調査・評価する",
      "ステークホルダーと詳細な実装計画を作成する",
      "制御された環境でソリューションを実装する",
      "機能とパフォーマンスをテストし検証する",
      "適切なトレーニングとともに組織全体に展開する",
      "プロセスを文書化し運用手順を作成する"
    ]
  };

  // Modify steps based on characteristics
  if (isQuickWin) {
    // For quick wins, emphasize rapid implementation
    baseSteps.en[0] = "Quickly assess current state and identify immediate opportunities";
    baseSteps.en[2] = "Create focused implementation plan for rapid deployment";
    baseSteps.ja[0] = "現状を迅速に評価し即座の機会を特定する";
    baseSteps.ja[2] = "迅速な展開のための集中的な実装計画を作成する";
  }

  if (effortPoints >= 8) {
    // For high-effort items, add more planning steps
    baseSteps.en.splice(2, 0, "Conduct detailed risk assessment and mitigation planning");
    baseSteps.en.splice(4, 0, "Implement in phases with regular checkpoints");
    baseSteps.ja.splice(2, 0, "詳細なリスク評価と軽減計画を実施");
    baseSteps.ja.splice(4, 0, "定期的なチェックポイントを持つ段階的実装");
  }

  return baseSteps;
}

function getSuccessCriteria(capabilityStep: any, language: 'en' | 'ja'): { en: string[]; ja: string[] } {
  const category = capabilityStep.category;
  const impactArea = capabilityStep.impact_area;
  const isQuickWin = capabilityStep.quick_win;

  // Impact area specific success criteria
  const impactCriteria: Record<string, { en: string[]; ja: string[] }> = {
    DP: { // Developer Productivity
      en: [
        "Development velocity increases by measurable percentage",
        "Developer satisfaction scores improve in surveys",
        "Time to deploy new features is reduced",
        "Code quality metrics show improvement",
        "Developer onboarding time is reduced"
      ],
      ja: [
        "開発速度が測定可能な割合で向上する",
        "開発者満足度スコアがサーベイで改善する",
        "新機能のデプロイ時間が短縮される",
        "コード品質メトリクスが改善を示す",
        "開発者のオンボーディング時間が短縮される"
      ]
    },
    IM: { // Incident Management
      en: [
        "Mean time to detection (MTTD) is reduced",
        "Mean time to recovery (MTTR) improves significantly",
        "Number of critical incidents decreases",
        "Incident response procedures are followed consistently",
        "System availability and reliability metrics improve"
      ],
      ja: [
        "平均検知時間（MTTD）が短縮される",
        "平均復旧時間（MTTR）が大幅に改善する",
        "重大インシデント数が減少する",
        "インシデント対応手順が一貫して実行される",
        "システム可用性と信頼性メトリクスが改善する"
      ]
    },
    IC: { // Infrastructure Cost
      en: [
        "Infrastructure costs are reduced by target percentage",
        "Resource utilization efficiency improves",
        "Cost per transaction or user decreases",
        "Waste and over-provisioning are eliminated",
        "Cost visibility and allocation accuracy increases"
      ],
      ja: [
        "インフラコストが目標割合で削減される",
        "リソース利用効率が改善する",
        "トランザクションまたはユーザーあたりのコストが減少する",
        "無駄と過剰プロビジョニングが排除される",
        "コストの可視性と配分精度が向上する"
      ]
    },
    OE: { // Operational Efficiency
      en: [
        "Manual operational tasks are reduced significantly",
        "Operational team productivity increases",
        "System maintenance overhead decreases",
        "Automation coverage expands across operations",
        "Operational errors and toil are minimized"
      ],
      ja: [
        "手動運用タスクが大幅に削減される",
        "運用チームの生産性が向上する",
        "システムメンテナンスのオーバーヘッドが減少する",
        "自動化カバレッジが運用全体に拡大する",
        "運用エラーと雑務が最小化される"
      ]
    },
    TM: { // Time to Market
      en: [
        "Feature delivery time is reduced measurably",
        "Release frequency increases without quality degradation",
        "Time from idea to production deployment decreases",
        "Business agility and responsiveness improve",
        "Customer feedback loop time is shortened"
      ],
      ja: [
        "機能提供時間が測定可能に短縮される",
        "品質低下なしにリリース頻度が向上する",
        "アイデアから本番デプロイまでの時間が短縮される",
        "ビジネスの俊敏性と応答性が改善する",
        "顧客フィードバックループ時間が短縮される"
      ]
    }
  };

  // Base success criteria
  const baseCriteria = {
    en: [
      "Implementation is completed within the specified timeline",
      "The solution is adopted by relevant teams and stakeholders",
      "Key metrics show improvement in the target area",
      "Documentation and operational procedures are in place",
      "Relevant assessment scores improve by at least 15 points"
    ],
    ja: [
      "指定されたタイムライン内で実装が完了する",
      "関連するチームとステークホルダーがソリューションを採用する",
      "主要メトリクスが対象領域で改善を示す",
      "文書化と運用手順が整備される",
      "関連する評価スコアが少なくとも15ポイント改善する"
    ]
  };

  // Add impact-specific criteria
  const impactSpecific = impactCriteria[impactArea];
  if (impactSpecific) {
    // Replace the generic "key metrics" criterion with specific ones
    baseCriteria.en[2] = impactSpecific.en[0]; // Replace with first specific criterion
    baseCriteria.en.push(...impactSpecific.en.slice(1, 3)); // Add 2 more specific criteria
    
    baseCriteria.ja[2] = impactSpecific.ja[0];
    baseCriteria.ja.push(...impactSpecific.ja.slice(1, 3));
  }

  // Adjust for quick wins
  if (isQuickWin) {
    baseCriteria.en[0] = "Quick win is delivered within 2-4 weeks";
    baseCriteria.en.push("Immediate value is demonstrated to stakeholders");
    baseCriteria.ja[0] = "クイックウィンが2-4週間以内に提供される";
    baseCriteria.ja.push("ステークホルダーに即座の価値が実証される");
  }

  return baseCriteria;
}

export default router; 