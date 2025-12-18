/**
 * @file templatePdfGenerator.ts
 * @description テンプレートベースのPDFジェネレーター
 * Handlebarsテンプレートとpuppeteerを使用してPDFレポートを生成します。
 */

import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../../utils/logger';
import { Assessment, CategoryScore, Organization } from '@shared/schema';
import { calculateCostAnalysis } from '../costAnalysis/costAnalysisService';
import { t, getCategoryName } from './pdfHelpers';
import { MATURITY_LEVELS, ASSESSMENT_CATEGORIES } from '../../../client/src/lib/constants';
import { getMaturityLevel, calculateOverallScore } from '../../../client/src/lib/assessmentUtils';
import { formatCurrency } from '../costAnalysis/costUtils';
import { enhancedTimeToNextMaturity, formatTimeEstimate } from '../../../client/src/lib/timeEstimationService';
import { calculateOverallBenchmarks, categoryBenchmarks } from '../../../client/src/lib/benchmarkData';

// テンプレートパスの定数
const TEMPLATE_DIR = path.resolve(process.cwd(), 'server/services/pdf/templates');
const MAIN_TEMPLATE = path.join(TEMPLATE_DIR, 'template.hbs');
const FONTS_DIR = path.resolve(process.cwd(), 'server/services/pdf/fonts');
const JS_DIR = path.join(TEMPLATE_DIR, 'js');

// EXACT same velocity table as dashboard
const DEFAULT_VELOCITY_TABLE = {
  pointsPerIdealDay: 1.5,
  idealDaysPerSprint: 8,
  parallelStreams: {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 3
  }
};

// EXACT same roadmap items function as dashboard
function deriveRoadmapItems(categoryScores: CategoryScore[]): any[] {
  return categoryScores.map(cat => ({
    id: `item-${cat.categoryId}`,
    category: cat.categoryId,
    priority: (100 - cat.score) * 2, // Higher priority for lower scores
    effort_points: Math.max(5, Math.round((100 - cat.score) / 2)), // More effort for lower scores
    currentCategoryScore: cat.score >= 0 ? cat.score : 0, // Handle knowledge gaps
    impact_level: cat.score < 30 ? 'high' : cat.score < 60 ? 'medium' : 'low'
  }));
}

// Handlebarsヘルパーを登録する
function registerHelpers() {
  // 等価比較ヘルパー
  Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });
  
  // 大なり比較ヘルパー
  Handlebars.registerHelper('gt', function(a, b) {
    return a > b;
  });
  
  // 小なりイコール比較ヘルパー
  Handlebars.registerHelper('lte', function(a,b) {
    return a <= b;
  });
  
  // 配列インデックス取得ヘルパー
  Handlebars.registerHelper('index_of', function(array, value) {
    return array.indexOf(value);
  });
  
  // 数値フォーマットヘルパー
  Handlebars.registerHelper('format_number', function(value) {
    return new Intl.NumberFormat().format(value);
  });
  
  // JSONシリアライズヘルパー
  Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
  });
  
  // 算術ヘルパー: 減算
  Handlebars.registerHelper('subtract', function(a, b) {
    return (Number(a) || 0) - (Number(b) || 0);
  });
  
  // 算術ヘルパー: 乗算
  Handlebars.registerHelper('multiply', function(a, b) {
    return (Number(a) || 0) * (Number(b) || 0);
  });
  
  // 算術ヘルパー: 加算
  Handlebars.registerHelper('add', function(a, b) {
    return (Number(a) || 0) + (Number(b) || 0);
  });
  
  // 算術ヘルパー: 除算
  Handlebars.registerHelper('divide', function(a, b) {
    const divisor = Number(b) || 1;
    return (Number(a) || 0) / divisor;
  });
  
  // 論理ヘルパー: AND
  Handlebars.registerHelper('and', function(a, b) {
    return a && b;
  });
  
  // 論理ヘルパー: NOT
  Handlebars.registerHelper('not', function(a) {
    return !a;
  });
  
  // 比較ヘルパー: 未満
  Handlebars.registerHelper('lt', function(a, b) {
    return (Number(a) || 0) < (Number(b) || 0);
  });
  
  // 比較ヘルパー: 以上
  Handlebars.registerHelper('gte', function(a, b) {
    return (Number(a) || 0) >= (Number(b) || 0);
  });
  
  // 算術ヘルパー: 絶対値
  Handlebars.registerHelper('abs', function(a) {
    return Math.abs(Number(a) || 0);
  });
}

/**
 * テンプレートをロードして準備する
 * @returns コンパイルされたHandlebarsテンプレート
 */
async function loadTemplates() {
  try {
    // メインテンプレートを読み込む
    const templateContent = await fs.readFile(MAIN_TEMPLATE, 'utf-8');
    
    // パーシャルを登録（存在する場合）
    const partialsDir = path.join(TEMPLATE_DIR, 'partials');
    try {
      const files = await fs.readdir(partialsDir);
      for (const file of files) {
        if (file.endsWith('.hbs')) {
          const partialName = path.basename(file, '.hbs');
          const partialContent = await fs.readFile(path.join(partialsDir, file), 'utf-8');
          Handlebars.registerPartial(partialName, partialContent);
        }
      }
    } catch (err) {
      logger.warn('No partials directory found or error loading partials', err);
    }
    
    // テンプレートをコンパイル
    return Handlebars.compile(templateContent);
  } catch (error) {
    logger.error('Error loading templates:', error);
    throw error;
  }
}

/**
 * レーダーチャートスクリプトをロードする
 * @returns レーダーチャートスクリプトのコンテンツ
 */
async function loadRadarChartScript() {
  try {
    const scriptPath = path.join(JS_DIR, 'radarChart.js');
    return await fs.readFile(scriptPath, 'utf-8');
  } catch (error) {
    logger.error('Error loading radar chart script:', error);
    return ''; // 失敗した場合は空文字列を返す
  }
}

/**
 * Count critical issues by severity level (same logic as dashboard)
 * @param categoryScores Array of category scores with critical issues
 * @returns Object with counts by severity level
 */
function countCriticalIssuesBySeverity(categoryScores: CategoryScore[]): {
  total: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
} {
  const allCriticalIssues = categoryScores.flatMap(cat => {
    if (!cat.criticalIssues) return [];
    
    // Handle both old format (string[]) and new format (object[])
    return cat.criticalIssues.filter(issue => 
      typeof issue === 'object' && 
      issue !== null && 
      'severity' in issue &&
      typeof issue.severity === 'number'
    ) as Array<{ id: string; text: string | Record<string, string>; severity: number; }>;
  });
  
  return {
    total: allCriticalIssues.length,
    highSeverity: allCriticalIssues.filter(issue => issue.severity === 3).length,
    mediumSeverity: allCriticalIssues.filter(issue => issue.severity === 2).length,
    lowSeverity: allCriticalIssues.filter(issue => issue.severity === 1).length
  };
}

/**
 * 業界内の位置を推定する（百分位）
 * @param score スコア
 * @returns 業界内の位置（百分位）
 */
function estimateIndustryPercentile(score: number): number {
  // シンプルな推定: スコアが高いほど、より多くの組織よりも先行
  if (score < 20) return 10;
  if (score < 40) return 30;
  if (score < 60) return 50;
  if (score < 80) return 70;
  return 90;
}

/**
 * カテゴリースコアに概要を追加する
 * @param categoryScores カテゴリースコアの配列
 * @param language 言語
 * @returns 概要付きのカテゴリースコア配列
 */
function addCategorySummaries(categoryScores: CategoryScore[], language: string): CategoryScore[] {
  // スコアでソート（高い順）
  const sortedScores = [...categoryScores].sort((a, b) => {
    // スコアが-1（知識ギャップ）のカテゴリーは最後に配置
    if (a.score < 0) return 1;
    if (b.score < 0) return -1;
    return b.score - a.score;
  });
  
  // 各カテゴリーに概要を追加
  return sortedScores.map(category => {
    let summary = '';
    const categoryName = getCategoryName(category.categoryId, language);
    
    if (category.score >= 80) {
      summary = language === 'ja' 
        ? `${categoryName}の優れた実践。組織全体での採用が進んでいます。` 
        : `Excellent practices in ${categoryName} with organization-wide adoption.`;
    } else if (category.score >= 60) {
      summary = language === 'ja'
        ? `${categoryName}の良好な実践。さらなる最適化の余地があります。`
        : `Strong practices in ${categoryName} with room for further optimization.`;
    } else if (category.score >= 40) {
      summary = language === 'ja'
        ? `${categoryName}の基本的な実践が確立。一貫性を高める必要があります。`
        : `Established baseline practices in ${categoryName} that need more consistency.`;
    } else if (category.score >= 20) {
      summary = language === 'ja'
        ? `${categoryName}の初期段階の実践。体系的なアプローチが必要です。`
        : `Early stage practices in ${categoryName} requiring a more systematic approach.`;
    } else if (category.score >= 0) {
      summary = language === 'ja'
        ? `${categoryName}の実践は限定的。基盤構築が必要です。`
        : `Limited practices in ${categoryName}. Foundation needs to be established.`;
    } else {
      summary = language === 'ja'
        ? `${categoryName}の評価データが不足しています。`
        : `Insufficient assessment data for ${categoryName}.`;
    }
    
    return {
      ...category,
      summary
    };
  });
}

/**
 * すべてのコスト削減フィールドをフォーマットする
 * @param costSavings コスト削減データオブジェクト
 * @param currency 通貨コード（JPY/USD）
 * @returns フォーマット済みのコスト削減データ
 */
function formatAllCostSavings(costSavings: Record<string, any>, currency: string): Record<string, any> {
  const formatted: Record<string, any> = { ...costSavings };
  
  // すべての数値フィールドをフォーマット
  for (const key of Object.keys(costSavings)) {
    if (typeof costSavings[key] === 'number') {
      formatted[`formatted_${key}`] = formatCurrency(costSavings[key], currency);
    }
  }
  
  return formatted;
}

/**
 * テンプレート用のデータを準備する
 * @param params PDFに必要なパラメータ
 * @returns テンプレートに渡すデータ
 */
async function prepareTemplateData(params: {
  assessment: Assessment;
  organization?: Organization;
  categoryScores: CategoryScore[];
  sessionId: string;
  language: string;
}) {
  const { assessment, categoryScores, sessionId, language } = params;
  
  // 有効なカテゴリースコアのみを使用（-1のスコアは除外）
  const validCategoryScores = categoryScores.filter(cat => cat.score >= 0);
  
  // アセスメントからスコアを取得、ない場合は計算
  // assessmentにoverallScoreプロパティが存在する可能性がある（拡張された型）
  const assessmentScore = (assessment as any).overallScore;
  let score = typeof assessmentScore === 'number' ? assessmentScore : -1;
  
  if (score < 0) {
    // スコアが設定されていない場合、ダッシュボードと同じ関数を使用
    score = calculateOverallScore(categoryScores);
  }
  
  // 成熟度レベルを取得（既存のユーティリティ関数を使用）
  const maturityLevelObj = getMaturityLevel(score);
  const maturityLevel = language === 'ja' ? 
    t(maturityLevelObj.id, language, {}, 'results') : 
    maturityLevelObj.label;
  
  // クリティカルな問題の数を取得（常に適切な重要度分析を使用）
  // FIXED: Always use proper severity breakdown, never rely on just a total count
  const criticalIssuesData = countCriticalIssuesBySeverity(categoryScores);
  
  // リスクレベルを取得（重要度分析に基づく適切なロジック）
  let riskLevel = 'Low Risk'; // デフォルト値
  const { highSeverity, mediumSeverity } = criticalIssuesData;
  
  // Use proper risk calculation logic with severity consideration
  if (highSeverity > 5 || score < 30) {
    riskLevel = 'High Risk';
  } else if (highSeverity > 0 || mediumSeverity > 2 || score < 50) {
    riskLevel = 'Medium Risk';
  } else {
    riskLevel = 'Low Risk';
  }
  
  // 成熟度に基づいて色を設定（既存の定数を使用）
  const maturityColor = maturityLevelObj.color;
  
  // コスト分析データの取得（API endpoint と同じロジックを使用）
  let costAnalysis: {
    costSavings: any;
    quickWins: any[];
    formattedTotal: string;
    currency: string;
    savingsPercentage: string;
  } = { costSavings: { total: 0 }, formattedTotal: '$0', savingsPercentage: '0%', quickWins: [], currency: 'USD' };
  
  // Get organization data from storage (same as API endpoint)
  let organizationData: any = {};
  
  try {
    // Import storage here to avoid circular dependencies
    const { storage } = await import('../../storage');
    
    if (assessment.organizationId) {
      try {
        const organization = await storage.getOrganization(assessment.organizationId, sessionId);
        if (organization) {
          organizationData = organization;
        }
      } catch (e) {
        logger.warn("Could not retrieve organization data, using defaults", { error: e });
      }
    } else {
      logger.warn("Assessment doesn't have an organization ID, using defaults");
    }
    
    // Set the currency based on language (same as API endpoint)
    if (language === 'ja') {
      organizationData = {
        ...organizationData,
        currency: 'JPY'
      };
      logger.debug('Setting currency to JPY for Japanese language', { language });
    }
    
    // Calculate cost analysis using the same service as API endpoint
    const { calculateCostAnalysis } = await import('../costAnalysis/costAnalysisService');
    costAnalysis = calculateCostAnalysis(organizationData, categoryScores, language);
    
    logger.debug('Cost analysis calculated for PDF', { 
      sessionId,
      totalSavings: costAnalysis.costSavings.total,
      currency: costAnalysis.currency,
      quickWinsCount: costAnalysis.quickWins.length
    });
  } catch (error) {
    logger.error('Error calculating cost analysis for PDF:', error);
    // Use fallback values if cost analysis fails
  }
  
  // 通貨の決定（costAnalysis.currencyを優先、なければ言語に基づいて設定）
  const currency = costAnalysis.currency || (language === 'ja' ? 'JPY' : 'USD');
  
  // すべてのコスト削減フィールドをフォーマット
  const formattedCostSavings = formatAllCostSavings(costAnalysis.costSavings || {}, currency);
  
  // 互換性のために従来のフォーマットも維持
  const formattedCostSavingsTotal = costAnalysis.formattedTotal || formatCurrency(costAnalysis.costSavings?.total || 0, currency);
  
  // 産業内位置の計算（アセスメントにある場合はそれを使用）
  const assessmentIndustryPercentile = (assessment as any).industryPercentile;
  const industryPosition = typeof assessmentIndustryPercentile === 'number'
    ? assessmentIndustryPercentile
    : estimateIndustryPercentile(score);
  
  // Calculate "top X%" for display (same as dashboard)
  const topPercentage = 100 - industryPosition;
  const isAboveMedian = industryPosition >= 50;
  
  // Industry benchmark values (dynamic based on organization or defaults)
  const industryBenchmarks = calculateOverallBenchmarks(categoryScores);
  const industryMedian = industryBenchmarks.median;
  const industryLeaderScore = industryBenchmarks.leader;
  
  // 次のレベルまでの時間を取得（アセスメントにある場合はそれを使用）
  const assessmentTimeToNextLevel = (assessment as any).timeToNextLevel;
  let timeToNextLevel: string;
  
  if (typeof assessmentTimeToNextLevel === 'string') {
    timeToNextLevel = assessmentTimeToNextLevel;
  } else {
    // EXACT same logic as dashboard
    const isAllKnowledgeGap = categoryScores.length > 0 && 
      categoryScores.every(cat => 
        cat.score === -1 || cat.maturityLevel === "knowledge_gap"
      );
    
    if (isAllKnowledgeGap || !categoryScores || categoryScores.length === 0) {
      timeToNextLevel = language === 'ja' ? 'アセスメントデータが必要' : 'Need assessment data';
    } else {
      // Create organization info (same as dashboard)
      const organizationInfo = {
        industry: organizationData.industry || "technology",
        companySize: organizationData.companySize || "51-250",
        region: organizationData.region || "north_america",
        userRole: "architect",
        businessObjectives: ["faster_time_to_market", "scalability"],
        cloudProviders: ["aws"],
        deploymentModel: "public_cloud"
      };
      
      // Generate derived roadmap items (same as dashboard)
      const derivedRoadmapItems = deriveRoadmapItems(categoryScores);
      
      // Enhanced time to next level calculation (same as dashboard)
      const enhancedTimeEstimate = enhancedTimeToNextMaturity(
        score,
        categoryScores,
        derivedRoadmapItems,
        DEFAULT_VELOCITY_TABLE,
        organizationInfo
      );
      
      // Format time to next level for display (same as dashboard)
      timeToNextLevel = formatTimeEstimate(enhancedTimeEstimate, language);
    }
  }
  
  // Fetch implementation roadmap data with Journey Insights (same as Trail Map)
  let implementationRoadmap: any = null;
  let journeyInsights: any[] = [];
  
  try {
    // Import buildRoadmap function to generate roadmap data
    const { buildRoadmap } = await import('../roadmap-builder');
    
    // Map organization size for roadmap builder
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
    const organizationSize = sizeMap[organizationData.companySize] || "md";
    
    // Convert category scores to score map
    const scoreMap: Record<string, number> = {};
    categoryScores.forEach(score => {
      if (score.score >= 0) {
        scoreMap[score.categoryId] = score.score;
      }
    });
    
    // Build roadmap using the same logic as the API endpoint
    const roadmapItems = buildRoadmap(
      scoreMap,
      organizationSize,
      assessment.assessmentType || 'comprehensive'
    );
    
    // *** EXACT SAME PHASE DISTRIBUTION LOGIC AS API ENDPOINT ***
    // Use original quick_win flags from the data without modification
    logger.debug(`PDF: Original quick wins: ${roadmapItems.filter(item => item.quick_win).length} out of ${roadmapItems.length}`, { sessionId });
    
    // 1) Separate quick wins and considerations-only from other items
    const quickWinItems = roadmapItems.filter(item => item.quick_win && !item.considerations_only);
    const considerationsOnlyItems = roadmapItems.filter(item => item.considerations_only);
    const regularItems = roadmapItems.filter(item => !item.quick_win && !item.considerations_only);
    
    // 2) Sort both arrays by priority (highest first)
    quickWinItems.sort((a, b) => b.priority - a.priority);
    regularItems.sort((a, b) => b.priority - a.priority);
    
    // 3) Calculate distribution for remaining items using 30/40/30 split
    const totalRegularItems = quickWinItems.length + regularItems.length;
    
    // Calculate target size for each phase
    const shortTermTarget = Math.ceil(totalRegularItems * 0.3); // 30% for short-term
    const mediumTermTarget = Math.ceil(totalRegularItems * 0.4); // 40% for medium-term
    const longTermTarget = totalRegularItems - shortTermTarget - mediumTermTarget; // Remaining ~30% for long-term
    
    // Ensure all quick wins go into short-term phase
    const shortTermNonQuickWinsNeeded = Math.max(0, shortTermTarget - quickWinItems.length);
    
    // Distribute remaining non-quick win items
    const shortTermItems = [
      ...quickWinItems, 
      ...regularItems.slice(0, shortTermNonQuickWinsNeeded)
    ];
    
    const mediumTermItems = regularItems.slice(
      shortTermNonQuickWinsNeeded, 
      shortTermNonQuickWinsNeeded + mediumTermTarget
    );
    
    const longTermItems = regularItems.slice(
      shortTermNonQuickWinsNeeded + mediumTermTarget
    );
    
    // Add considerations-only items to the short-term phase (for high visibility)
    const allShortTermItems = [...shortTermItems, ...considerationsOnlyItems];
    
    // Log the distribution (same as API endpoint)
    logger.debug(`PDF: Items distribution:
      - Quick wins total: ${quickWinItems.length}
      - Considerations-only: ${considerationsOnlyItems.length}
      - Short-term: ${allShortTermItems.length} (including ${quickWinItems.length} quick wins and ${considerationsOnlyItems.length} considerations-only)
      - Medium-term: ${mediumTermItems.length}
      - Long-term: ${longTermItems.length}
      - Phase targets: Short ${shortTermTarget}, Medium ${mediumTermTarget}, Long ${longTermTarget}
    `, { sessionId });
    
    // Import considerations map to add stretch goals
    const { considerationMap } = await import('../../data/stretch-goals');
    
    // Helper functions (same as API endpoint)
    const mapImpactLevel = (impactArea: string): 'Low' | 'Medium' | 'High' => {
      const impactMap: Record<string, 'Low' | 'Medium' | 'High'> = {
        'DP': 'High',    // Development Productivity
        'TM': 'High',    // Time-to-Market
        'OE': 'Medium',  // Operational Efficiency
        'IM': 'Medium',  // Incident Management
        'IC': 'Low'      // Infrastructure Cost
      };
      return impactMap[impactArea] || 'Medium';
    };
    
    const mapEffortLevel = (effortPoints: number): 'Low' | 'Medium' | 'High' => {
      if (effortPoints <= 3) return 'Low';
      if (effortPoints <= 7) return 'Medium';
      return 'High';
    };
    
    // Helper function to safely access localized text
    const getLocalizedText = (localizedText: any, language: string): string => {
      if (!localizedText) return '';
      if (language === 'ja' && localizedText.ja) return localizedText.ja;
      if (localizedText.en) return localizedText.en;
      return '';
    };
    
    // Transform roadmap items into structured phases (EXACT same as API endpoint)
    const phases = [
      {
        index: 0,
        band: 'short' as const,
        recommendations: allShortTermItems.map((item, idx) => {
          const rec = {
            id: item.id,
            stepRef: item.id,
            category: item.category,
            impactArea: item.impact_area,
            priorityRank: idx + 1,
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
            phase: item.phase,
            // Add display properties for template
            categoryName: getCategoryName(item.category, language),
            title: getLocalizedText(item.label, language) || 'Recommendation',
            descriptionText: getLocalizedText(item.description, language) || '',
            timelineText: `${Math.max(1, Math.floor(item.duration_weeks * 0.8))}-${Math.ceil(item.duration_weeks * 1.2)} ${language === 'ja' ? '週' : 'weeks'}`
          };
          
          // Add considerations for high-maturity categories or considerations-only items
          if (item.considerations_only && considerationMap[item.category]) {
            (rec as any).considerations = considerationMap[item.category][language as 'en' | 'ja'];
          }
          
          return rec;
        })
      },
      {
        index: 1,
        band: 'medium' as const,
        recommendations: mediumTermItems.map((item, idx) => ({
          id: item.id,
          stepRef: item.id,
          category: item.category,
          impactArea: item.impact_area,
          priorityRank: allShortTermItems.length + idx + 1,
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
          phase: item.phase,
          // Add display properties for template
          categoryName: getCategoryName(item.category, language),
          title: getLocalizedText(item.label, language) || 'Recommendation',
          descriptionText: getLocalizedText(item.description, language) || '',
          timelineText: `${Math.max(1, Math.floor(item.duration_weeks * 0.8))}-${Math.ceil(item.duration_weeks * 1.2)} ${language === 'ja' ? '週' : 'weeks'}`
        }))
      },
      {
        index: 2,
        band: 'long' as const,
        recommendations: longTermItems.map((item, idx) => ({
          id: item.id,
          stepRef: item.id,
          category: item.category,
          impactArea: item.impact_area,
          priorityRank: allShortTermItems.length + mediumTermItems.length + idx + 1,
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
          phase: item.phase,
          // Add display properties for template
          categoryName: getCategoryName(item.category, language),
          title: getLocalizedText(item.label, language) || 'Recommendation',
          descriptionText: getLocalizedText(item.description, language) || '',
          timelineText: `${Math.max(1, Math.floor(item.duration_weeks * 0.8))}-${Math.ceil(item.duration_weeks * 1.2)} ${language === 'ja' ? '週' : 'weeks'}`
        }))
      }
    ];
    
    // *** JOURNEY INSIGHTS LOGIC (same as Trail Map) ***
    // Extract prioritized focus areas from roadmap data
    const extractPrioritiesFromRoadmap = async (roadmapData: any): Promise<any[]> => {
      if (!roadmapData || !roadmapData.phases || !roadmapData.phases.length) {
        return [];
      }
      
      // Get categories for current assessment type
      const { getCategoriesForAssessmentType } = await import('../../../client/src/lib/assessmentFlowService');
      const assessedCategories = getCategoriesForAssessmentType(assessment.assessmentType as any || 'comprehensive');
      
      // Get top recommendations from the first (short-term) phase
      const shortTermPhase = roadmapData.phases.find((phase: any) => phase.band === 'short');
      if (!shortTermPhase || !shortTermPhase.recommendations) {
        return [];
      }
      
      // Group recommendations by category
      const categoriesMap: Record<string, any[]> = {};
      shortTermPhase.recommendations.forEach((rec: any) => {
        // Only include categories that are part of the current assessment type
        if (!assessedCategories.includes(rec.category)) return;
        
        if (!categoriesMap[rec.category]) {
          categoriesMap[rec.category] = [];
        }
        categoriesMap[rec.category].push(rec);
      });
      
      // Get top recommendation from each category
      const topCategoryRecs = Object.entries(categoriesMap)
        .map(([category, recs]) => {
          // Sort by priority rank (lower is better)
          const sortedRecs = [...recs].sort((a, b) => a.priorityRank - b.priorityRank);
          return sortedRecs[0]; // Take the highest priority one
        })
        .sort((a, b) => a.priorityRank - b.priorityRank)
        .slice(0, 5); // Limit to top 5
      
      // Convert to PrioritizedFocusArea format
      return topCategoryRecs.map((rec, index) => ({
        categoryId: rec.category,
        categoryName: getCategoryName(rec.category, language),
        priority: index + 1,
        reason: language === 'ja' 
          ? `影響度：${rec.impactLevel === 'High' ? '大' : rec.impactLevel === 'Medium' ? '中' : '低'}, 工数：${rec.effortLevel === 'High' ? '大' : rec.effortLevel === 'Medium' ? '中' : '低'}, ROI: ${rec.roiScore}`
          : `${rec.impactLevel} impact, ${rec.effortLevel} effort implementation with ROI score ${rec.roiScore}`,
        timeframe: rec.timeline.max <= 4 ? "immediate" : rec.timeline.max <= 8 ? "near-term" : "long-term",
        quickWin: rec.quickWin,
        title: rec.title,
        description: rec.descriptionText,
        impactLevel: rec.impactLevel,
        effortLevel: rec.effortLevel,
        roiScore: rec.roiScore,
        timelineText: rec.timelineText
      }));
    };
    
    // Create roadmap data structure
    const roadmapData = { phases };
    
    // Extract Journey Insights (prioritized focus areas)
    journeyInsights = await extractPrioritiesFromRoadmap(roadmapData);
    
    implementationRoadmap = {
      phases,
      totalRecommendations: roadmapItems.length,
      shortTermCount: phases[0].recommendations.length,
      mediumTermCount: phases[1].recommendations.length,
      longTermCount: phases[2].recommendations.length,
      journeyInsights, // Add Journey Insights to roadmap data
      // Add quick win statistics
      totalQuickWins: roadmapItems.filter(item => item.quick_win).length,
      shortTermQuickWins: phases[0].recommendations.filter(rec => rec.quickWin).length,
      mediumTermQuickWins: phases[1].recommendations.filter(rec => rec.quickWin).length,
      longTermQuickWins: phases[2].recommendations.filter(rec => rec.quickWin).length,
      // Add phase statistics for better display
      phaseStats: {
        short: {
          total: phases[0].recommendations.length,
          quickWins: phases[0].recommendations.filter(rec => rec.quickWin).length,
          highImpact: phases[0].recommendations.filter(rec => rec.impactLevel === 'High').length
        },
        medium: {
          total: phases[1].recommendations.length,
          quickWins: phases[1].recommendations.filter(rec => rec.quickWin).length,
          highImpact: phases[1].recommendations.filter(rec => rec.impactLevel === 'High').length
        },
        long: {
          total: phases[2].recommendations.length,
          quickWins: phases[2].recommendations.filter(rec => rec.quickWin).length,
          highImpact: phases[2].recommendations.filter(rec => rec.impactLevel === 'High').length
        }
      }
    };
    
    logger.debug('Implementation roadmap with Journey Insights generated for PDF', {
      sessionId,
      totalRecommendations: implementationRoadmap.totalRecommendations,
      shortTerm: implementationRoadmap.shortTermCount,
      mediumTerm: implementationRoadmap.mediumTermCount,
      longTerm: implementationRoadmap.longTermCount,
      journeyInsightsCount: journeyInsights.length
    });
    
  } catch (error) {
    logger.error('Error generating implementation roadmap for PDF:', error);
    // Continue without roadmap data - template will show fallback content
  }
  
  // カテゴリースコアを強み順にソート
  const enrichedCategoryScores = addCategorySummaries(categoryScores, language)
    .sort((a, b) => {
      // スコアが-1（知識ギャップ）のカテゴリーは最後に配置
      if (a.score < 0) return 1;
      if (b.score < 0) return -1;
      return b.score - a.score;
    });
  
  // カテゴリースコアの詳細なデータを作成
  const detailedCategoryScores = enrichedCategoryScores.map(category => {
    // 成熟度レベルを決定（既存のユーティリティ関数を使用）
    const categoryMaturityObj = getMaturityLevel(category.score);
    const categoryMaturityLevel = categoryMaturityObj.label;
    const categoryMaturityLevelJa = language === 'ja' ? 
      t(categoryMaturityObj.id, language, {}, 'results') : 
      categoryMaturityObj.label;
    
    // 成熟度に基づいて色を設定（既存の定数を使用）
    const categoryColor = categoryMaturityObj.color;
    
    return {
      ...category,
      categoryId: category.categoryId, // Keep original ID
      categoryName: getCategoryName(category.categoryId, language), // Add display name using existing helper
      maturityLevel: categoryMaturityLevel,
      maturityLevelJa: categoryMaturityLevelJa,
      color: categoryColor,
      percentage: category.score // 進捗バー用の割合
    };
  });
  
  // レーダーチャートデータの準備
  const formattedCategoryScores = validCategoryScores.map(cat => ({
    category: getCategoryName(cat.categoryId, language), // Use existing helper for chart
    score: cat.score
  }));
  
  // クイックウィンの処理
  const quickWins = (costAnalysis.quickWins || []).map((win: any) => {
    // 対応するカテゴリースコアを探す
    const categoryScore = validCategoryScores.find(cat => cat.categoryId === win.category);
    const categoryMaturityObj = categoryScore ? getMaturityLevel(categoryScore.score) : getMaturityLevel(0);
    const categoryColor = categoryMaturityObj.color;
    
    // complexity を difficulty にマッピング
    let difficulty = 'medium';
    if (win.complexity <= 3) {
      difficulty = 'low';
    } else if (win.complexity >= 7) {
      difficulty = 'high';
    }
    
    // 通貨に応じて金額をフォーマット
    const impactFormatted = formatCurrency(win.impact || 0, currency);
    
    return {
      ...win,
      categoryName: getCategoryName(win.category, language), // Add display name using existing helper
      categoryScore: categoryScore ? categoryScore.score : 0, // Add actual category score
      color: categoryColor,
      percentage: Math.min(100, Math.max(0, (win.impact || 0) / 1000 * 100)), // Convert impact to percentage for progress bar
      difficulty: difficulty, // Map complexity to difficulty
      impactFormatted: impactFormatted, // Use proper currency formatting
      description: language === 'ja' ? 
        `${getCategoryName(win.category, language)}の最適化により効率性を向上させます。` : 
        `Optimize ${getCategoryName(win.category, language)} to improve efficiency.`
    };
  });
  
  // エグゼクティブサマリーの準備
  // 1. First check if there's a cached executive summary in storage
  // 2. Then check assessment for explicit executive summary
  // 3. Fall back to generic summary
  let executiveSummaryText = '';
  let aiGeneratedSections = {
    strengths: [],
    areasForImprovement: [],
    strategicRecommendations: [],
    businessImpact: ''
  };
  
  try {
    // Import storage here to avoid circular dependencies
    const { storage } = await import('../../storage');
    // Try to get cached executive summary first
    const cachedSummary = await storage.getExecutiveSummary(sessionId);
    if (cachedSummary) {
      logger.debug('Using cached executive summary for PDF', {
        cachedSummaryLength: cachedSummary.length,
        startsWithBrace: cachedSummary.trim().startsWith('{'),
        endsWithBrace: cachedSummary.trim().endsWith('}'),
        cachedPreview: cachedSummary.substring(0, 200)
      });
      
      // Check if this is the new enhanced JSON format
      if (cachedSummary.trim().startsWith('{') && cachedSummary.trim().endsWith('}')) {
        try {
          const jsonData = JSON.parse(cachedSummary);
          logger.debug('PDF: Successfully parsed cached JSON data:', {
            hasExecutiveSummary: !!jsonData.executiveSummary,
            hasDetailedAnalysis: !!jsonData.detailedAnalysis,
            hasValidation: !!jsonData.validation,
            jsonKeys: Object.keys(jsonData)
          });
          
          // If we have the new enhanced format, use the concise version for PDF
          if (jsonData.executiveSummary && jsonData.executiveSummary.content) {
            executiveSummaryText = jsonData.executiveSummary.content;
            logger.debug('PDF: Using concise executive summary from enhanced format', {
              conciseSummaryLength: executiveSummaryText.length,
              concisePreview: executiveSummaryText.substring(0, 150)
            });
          }
          
          // Extract AI-generated sections from detailedAnalysis (same as dashboard)
          if (jsonData.detailedAnalysis) {
            if (Array.isArray(jsonData.detailedAnalysis.strengths)) {
              aiGeneratedSections.strengths = jsonData.detailedAnalysis.strengths;
            }
            if (Array.isArray(jsonData.detailedAnalysis.areasForImprovement)) {
              aiGeneratedSections.areasForImprovement = jsonData.detailedAnalysis.areasForImprovement;
            }
            if (Array.isArray(jsonData.detailedAnalysis.strategicRecommendations)) {
              aiGeneratedSections.strategicRecommendations = jsonData.detailedAnalysis.strategicRecommendations;
            }
            if (typeof jsonData.detailedAnalysis.businessImpact === 'string') {
              aiGeneratedSections.businessImpact = jsonData.detailedAnalysis.businessImpact;
            }
            
            logger.debug('PDF: Extracted AI-generated sections:', {
              strengthsCount: aiGeneratedSections.strengths.length,
              improvementsCount: aiGeneratedSections.areasForImprovement.length,
              recommendationsCount: aiGeneratedSections.strategicRecommendations.length,
              hasBusinessImpact: !!aiGeneratedSections.businessImpact
            });
          }
          
          if (!executiveSummaryText) {
            logger.warn('PDF: Enhanced JSON format detected but no executiveSummary.content found');
          }
        } catch (parseError) {
          logger.debug('PDF: Executive summary is not in enhanced JSON format, using as-is', parseError);
          // Use the summary as-is if it's not parseable JSON
          executiveSummaryText = cachedSummary;
        }
      } else {
        logger.debug('PDF: Cached summary is not JSON format, using as-is');
        executiveSummaryText = cachedSummary;
      }
    } else {
      logger.debug('PDF: No cached executive summary found');
    }
  } catch (error) {
    logger.warn('Could not retrieve cached executive summary:', error);
  }
  
  // If no cached summary, fall back to generic summary
  if (!executiveSummaryText) {
    if (language === 'ja') {
      executiveSummaryText = `このアセスメントは、あなたの組織のクラウドネイティブ成熟度を評価し、
デジタル変革を加速するための実用的な洞察を提供します。結果は、現在の能力を特定し、
戦略的改善のための優先順位付けされた推奨事項を提供します。`;
    } else {
      executiveSummaryText = `This assessment evaluates your organization's cloud native maturity and provides 
actionable insights to accelerate your digital transformation journey. The results identify current capabilities 
and provide prioritized recommendations for strategic improvement.`;
    }
  }
  
  // Calculate gap analysis (same logic as dashboard's improvementOpportunities)
  const gapAnalysis = validCategoryScores
    .map(cat => {
      const categoryInfo = ASSESSMENT_CATEGORIES.find(c => c.id === cat.categoryId);
      const benchmark = categoryBenchmarks.find(b => b.categoryId === cat.categoryId);
      const leaderScore = benchmark?.leader || industryBenchmarks.leader; // Use category-specific or overall leader score
      const gap = leaderScore - cat.score;
      const gapPercentage = Math.round((gap / leaderScore) * 100);
      
      return {
        categoryId: cat.categoryId,
        categoryName: getCategoryName(cat.categoryId, language),
        score: cat.score,
        leaderScore,
        gap,
        gapPercentage,
        referenceModel: benchmark ? 
          `${benchmark.globalLeader}` : 
          'Industry Leader'
      };
    })
    .sort((a, b) => b.gap - a.gap); // Sort by gap size (largest gaps first)
  
  // デバッグログ出力
  logger.debug('Template data prepared:', {
    score,
    maturityLevel,
    criticalIssuesCount: criticalIssuesData.total,
    riskLevel,
    categoryCount: categoryScores.length,
    validCategoryCount: validCategoryScores.length,
    costSavingsTotal: costAnalysis.costSavings.total,
    costSavingsPercentage: costAnalysis.savingsPercentage,
    quickWinsCount: quickWins.length,
    hasExecutiveSummary: !!executiveSummaryText,
    hasImplementationRoadmap: !!implementationRoadmap
  });
  
  // テンプレートに渡すデータを返す
  return {
    title: `Cloud Native Assessment - ${sessionId}`,
    score,
    maturityLevel,
    maturityColor,
    criticalIssuesCount: criticalIssuesData.total,
    riskLevel,
    costAnalysis: {
      ...costAnalysis,
      formattedTotal: formattedCostSavingsTotal,
      formattedCostSavings, // すべてのフォーマット済みフィールドを含む
      quickWins
    },
    industryPosition,
    topPercentage,
    isAboveMedian,
    industryBenchmarks: {
      median: industryMedian,
      leader: industryLeaderScore
    },
    categoryScores: detailedCategoryScores,
    formattedCategoryScores: JSON.stringify(formattedCategoryScores),
    categoryDetails: JSON.stringify(detailedCategoryScores),
    timeToNextLevel,
    executiveSummaryText,
    base64Font: '', // 本番環境ではフォントをBase64で埋め込む
    base64FontBold: '', // 本番環境ではフォントをBase64で埋め込む
    language,
    // 型安全のためassessmentはそのまま渡さない
    assessmentType: assessment.assessmentType,
    assessmentId: assessment.id,
    aiGeneratedSections,
    gapAnalysis,
    implementationRoadmap // Add dynamic roadmap data
  };
}

/**
 * PDFのヘッダーHTMLを生成する
 * @param language 言語コード（'ja'または'en'）
 * @returns ヘッダーのHTML
 */
function getHeaderHtml(language: string): string {
  const title = language === 'ja' 
    ? '評価レポート'
    : 'Assessment Report';
  
  const pageLabel = language === 'ja'
    ? 'ページ <span class="pageNumber"></span>/<span class="totalPages"></span>'
    : 'Page <span class="pageNumber"></span> of <span class="totalPages"></span>';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
      </style>
    </head>
    <body>
      <div style="width:100%; font-size:12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; padding-bottom:12px; border-bottom:1px solid #e5e7eb; padding: 0 1cm; font-family: Arial, sans-serif;">
        <span style="font-size: 20px; font-weight: 700; color: #3b82f6;">Aokumo AI</span>
        <div style="font-size: 12px; color: #6b7280; text-align: right; line-height: 1.3;">
          <div><strong>${title}</strong></div>
          <div>${pageLabel}</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * テンプレートベースのPDFを生成する
 * @param params PDF生成に必要なパラメータ
 * @returns 生成されたPDFのBuffer
 */
export async function generateTemplatePDF(params: {
  assessment: Assessment;
  organization?: Organization;
  categoryScores: CategoryScore[];
  sessionId: string;
  language: string;
}): Promise<Buffer> {
  try {
    logger.info(`Generating template-based PDF in ${params.language} language`);
    
    // ヘルパーを登録
    registerHelpers();
    
    // テンプレートをロードしてコンパイル
    const template = await loadTemplates();
    
    // データを準備
    const templateData = await prepareTemplateData(params);
    
    // HTMLをレンダリング
    const html = template(templateData);
    
    // デバッグ用にHTMLを保存（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      const debugDir = path.resolve(process.cwd(), 'debug');
      try {
        await fs.mkdir(debugDir, { recursive: true });
        await fs.writeFile(path.join(debugDir, 'template-output.html'), html);
        logger.debug(`Template HTML saved to ${path.join(debugDir, 'template-output.html')}`);
      } catch (err) {
        logger.warn('Could not save debug HTML:', err);
      }
    }
    
    // Puppeteerを起動
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      protocolTimeout: 60000, // 60 seconds
      timeout: 60000 // 60 seconds
    });
    
    try {
      // ページを作成してコンテンツを設定
      const page = await browser.newPage();
      
      // リソースのロードを待機するために長めのタイムアウトを設定
      await page.setDefaultNavigationTimeout(60000);
      await page.setDefaultTimeout(60000);
      
      // HTMLコンテンツを設定
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 60000
      });
      
      // ヘッダーHTMLを生成
      const headerHtml = getHeaderHtml(params.language);
      
      // PDFを生成
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '60px', right: '1cm', bottom: '40px', left: '1cm' },
        displayHeaderFooter: true,
        headerTemplate: headerHtml, // 空のヘッダー
        footerTemplate: `
          <div style="width: 100%; font-size: 8px; text-align: center; color: #666;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `
      });
      
      logger.info('Template-based PDF generation completed successfully');
      return Buffer.from(pdfBuffer);
    } finally {
      // ブラウザを閉じる（try-finallyで確実にクローズ）
      await browser.close();
    }
  } catch (error) {
    logger.error('Error in template-based PDF generation:', error);
    throw error;
  }
} 
