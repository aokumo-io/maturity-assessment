/**
 * @file knowledge.ts
 * @description 知識コンテンツを提供するAPIルート
 * 特定のカテゴリと質問IDに基づいて、説明、例、およびリソースを含む知識コンテンツを返します。
 */

import { Router } from 'express';
import { getKnowledgeContent } from '../knowledge/index';
import { smartKnowledgeService } from '../services/knowledge-service';
import { logger } from '../utils/logger';
import { requireValidSession } from '../middleware/session';
import { csrfProtection, csrfTokenGenerator } from '../middleware/csrf';
import { handleApiError } from '../utils/errorHandler';

const router = Router();

/**
 * @route GET /api/knowledge/categories
 * @description 利用可能な知識カテゴリのリストを取得します
 * @returns {object} 利用可能なカテゴリのリスト
 */
router.get('/categories', requireValidSession, csrfTokenGenerator, (_, res) => {
  // カテゴリ名と日英での表示名のマッピング
  const categories = {
    application_architecture: {
      en: 'Application Architecture',
      ja: 'アプリケーションアーキテクチャ'
    },
    ai_ml_integration: {
      en: 'AI/ML Integration',
      ja: 'AI/ML統合'
    },
    app_migration_modernization: {
      en: 'App Migration & Modernization',
      ja: 'アプリ移行とモダナイゼーション'
    },
    business_value_strategy: {
      en: 'Business Value & Strategy',
      ja: 'ビジネス価値と戦略'
    },
    cicd_practices: {
      en: 'CI/CD Practices',
      ja: 'CI/CD実践'
    },
    container_infrastructure: {
      en: 'Container Infrastructure',
      ja: 'コンテナインフラストラクチャ'
    },
    data_management: {
      en: 'Data Management',
      ja: 'データ管理'
    },
    dora_metrics: {
      en: 'DORA Metrics',
      ja: 'DORAメトリクス'
    },
    finops_cost_management: {
      en: 'FinOps & Cost Management',
      ja: 'FinOpsとコスト管理'
    },
    foundations_culture: {
      en: 'Foundations & Culture',
      ja: '基盤と文化'
    },
    infrastructure_platform: {
      en: 'Infrastructure & Platform',
      ja: 'インフラストラクチャとプラットフォーム'
    },
    multicloud_hybrid_governance: {
      en: 'Multicloud & Hybrid Governance',
      ja: 'マルチクラウドとハイブリッドガバナンス'
    },
    observability: {
      en: 'Observability',
      ja: '可観測性'
    },
    operations_resilience: {
      en: 'Operations & Resilience',
      ja: '運用と回復力'
    },
    security_compliance: {
      en: 'Security & Compliance',
      ja: 'セキュリティとコンプライアンス'
    }
  };
  
  return res.json({ categories });
});

/**
 * @route GET /api/knowledge/:category/:questionId
 * @description 特定のカテゴリと質問IDの知識コンテンツを取得します（従来の静的知識のみ）
 * @param {string} category - 知識カテゴリ（例：dora_metrics, observability）
 * @param {string} questionId - 質問ID（例：dora_001, observability_002）
 * @returns {object} 知識コンテンツ（説明、例、リソースを含む）
 */
router.get('/:category/:questionId', requireValidSession, csrfTokenGenerator, (req, res) => {
  const { category, questionId } = req.params;
  
  const content = getKnowledgeContent(category, questionId);
  
  if (!content) {
    return res.status(404).json({ 
      error: 'Knowledge content not found',
      message: `No content found for category '${category}' and question ID '${questionId}'`
    });
  }
  
  return res.json({ content });
});

/**
 * @route POST /api/knowledge/smart
 * @description スマート知識コンテンツを取得します（静的優先、AIフォールバック、キャッシュ付き）
 * @body {object} request - 知識リクエスト
 * @returns {object} 知識コンテンツとメタデータ
 */
router.post('/smart', requireValidSession, csrfProtection, async (req, res) => {
  try {
    const {
      category,
      questionId,
      topic,
      skillLevel = 'beginner',
      userRole = 'practitioner',
      language = 'en',
      provider = 'openai'
    } = req.body;

    // 必須パラメータの検証
    if (!category || !questionId || !topic) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'category, questionId, and topic are required'
      });
    }

    // スマート知識サービスを使用してコンテンツを取得
    const result = await smartKnowledgeService.getKnowledge({
      category,
      questionId,
      topic,
      skillLevel,
      userRole,
      language,
      provider
    });

    // キャッシュ統計も含めてレスポンス
    const cacheStats = smartKnowledgeService.getCacheStats();

    return res.json({
      ...result,
      cacheStats: {
        size: cacheStats.size,
        maxSize: cacheStats.maxSize
      }
    });

  } catch (error: any) {
    logger.error('Error in smart knowledge endpoint:', error);
    return res.status(500).json({
      error: 'Failed to get knowledge content',
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @route GET /api/knowledge/cache/stats
 * @description キャッシュ統計を取得します
 * @returns {object} キャッシュ統計
 */
router.get('/cache/stats', requireValidSession, csrfTokenGenerator, (_, res) => {
  try {
    const stats = smartKnowledgeService.getCacheStats();
    return res.json(stats);
  } catch (error: any) {
    logger.error('Error getting cache stats:', error);
    return res.status(500).json({
      error: 'Failed to get cache stats',
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @route DELETE /api/knowledge/cache
 * @description キャッシュをクリアします
 * @returns {object} 成功メッセージ
 */
router.delete('/cache', requireValidSession, csrfProtection, (_, res) => {
  try {
    smartKnowledgeService.clearCache();
    return res.json({ message: 'Cache cleared successfully' });
  } catch (error: any) {
    logger.error('Error clearing cache:', error);
    return res.status(500).json({
      error: 'Failed to clear cache',
      message: error.message || 'Internal server error'
    });
  }
});

export default router; 