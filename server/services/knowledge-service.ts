/**
 * @file knowledge-service.ts
 * @description スマート知識サービス
 * 静的知識を優先し、AIフォールバック、メモリキャッシュを実装した知識コンテンツ管理サービス
 */

import { getKnowledgeContent } from '../knowledge/index';
import AIService from './ai-service';
import { logger } from '../utils/logger';

/**
 * @interface CachedKnowledgeEntry
 * @description キャッシュされた知識エントリの型定義
 */
interface CachedKnowledgeEntry {
  content: string;
  provider: 'static' | 'openai' | 'anthropic';
  language: string;
  skillLevel: string;
  userRole: string;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * @interface KnowledgeRequest
 * @description 知識リクエストの型定義
 */
interface KnowledgeRequest {
  category: string;
  questionId: string;
  topic: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  userRole: 'executive' | 'manager' | 'practitioner';
  language: string;
  provider?: 'openai' | 'anthropic';
}

/**
 * @interface KnowledgeResponse
 * @description 知識レスポンスの型定義
 */
interface KnowledgeResponse {
  content: string;
  source: 'static' | 'ai-cached' | 'ai-generated';
  provider: 'static' | 'openai' | 'anthropic';
  language: string;
  cached: boolean;
}

/**
 * @class SmartKnowledgeService
 * @description 静的知識とAI生成知識を組み合わせたスマート知識サービス
 */
export class SmartKnowledgeService {
  private cache: Map<string, CachedKnowledgeEntry> = new Map();
  private readonly CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24時間
  private readonly MAX_CACHE_SIZE = 1000; // 最大キャッシュエントリ数

  /**
   * @method getKnowledge
   * @description 知識コンテンツを取得（静的優先、AIフォールバック）
   * @param {KnowledgeRequest} request - 知識リクエスト
   * @returns {Promise<KnowledgeResponse>} 知識レスポンス
   */
  async getKnowledge(request: KnowledgeRequest): Promise<KnowledgeResponse> {
    const { category, questionId, topic, skillLevel, userRole, language, provider = 'openai' } = request;

    try {
      // 1. 静的知識を最初に確認
      const staticContent = this.getStaticKnowledge(category, questionId, language);
      if (staticContent) {
        logger.debug(`Static knowledge found for ${category}:${questionId}`);
        return {
          content: staticContent,
          source: 'static',
          provider: 'static',
          language,
          cached: false
        };
      }

      // 2. キャッシュされたAI知識を確認
      const cacheKey = this.generateCacheKey(category, questionId, skillLevel, userRole, language);
      const cachedEntry = this.getCachedKnowledge(cacheKey);
      if (cachedEntry) {
        logger.debug(`Cached AI knowledge found for ${category}:${questionId}`);
        return {
          content: cachedEntry.content,
          source: 'ai-cached',
          provider: cachedEntry.provider,
          language,
          cached: true
        };
      }

      // 3. AI生成知識（最後の手段）
      logger.debug(`Generating AI knowledge for ${category}:${questionId}`);
      const aiContent = await this.generateAIKnowledge(category, topic, skillLevel, userRole, language, provider);
      
      // キャッシュに保存
      this.cacheKnowledge(cacheKey, aiContent, provider, skillLevel, userRole, language);

      return {
        content: aiContent,
        source: 'ai-generated',
        provider,
        language,
        cached: false
      };

    } catch (error) {
      logger.error(`Error getting knowledge for ${category}:${questionId}:`, error);
      
      // フォールバック: 基本的な説明を提供
      return {
        content: this.getFallbackContent(topic, language),
        source: 'static',
        provider: 'static',
        language,
        cached: false
      };
    }
  }

  /**
   * @method getStaticKnowledge
   * @description 静的知識コンテンツを取得
   * @param {string} category - カテゴリ
   * @param {string} questionId - 質問ID
   * @param {string} language - 言語
   * @returns {string | null} 静的知識コンテンツまたはnull
   */
  private getStaticKnowledge(category: string, questionId: string, language: string): string | null {
    try {
      const content = getKnowledgeContent(category, questionId);
      if (!content) return null;

      const languageContent = content[language as 'en' | 'ja'] || content.en;
      if (!languageContent) return null;

      // 静的知識を整形
      let formattedContent = `## ${languageContent.explanation}\n\n`;
      
      if (languageContent.examples && languageContent.examples.length > 0) {
        formattedContent += `### ${language === 'ja' ? '例' : 'Examples'}:\n`;
        languageContent.examples.forEach(example => {
          formattedContent += `- ${example}\n`;
        });
        formattedContent += '\n';
      }

      if (languageContent.resources && languageContent.resources.length > 0) {
        formattedContent += `### ${language === 'ja' ? 'リソース' : 'Resources'}:\n`;
        languageContent.resources.forEach(resource => {
          formattedContent += `- ${resource}\n`;
        });
      }

      return formattedContent;
    } catch (error) {
      logger.error(`Error getting static knowledge for ${category}:${questionId}:`, error);
      return null;
    }
  }

  /**
   * @method generateAIKnowledge
   * @description AI知識を生成
   * @param {string} category - カテゴリ
   * @param {string} topic - トピック
   * @param {string} skillLevel - スキルレベル
   * @param {string} userRole - ユーザーロール
   * @param {string} language - 言語
   * @param {string} provider - AIプロバイダー
   * @returns {Promise<string>} AI生成知識コンテンツ
   */
  private async generateAIKnowledge(
    category: string,
    topic: string,
    skillLevel: string,
    userRole: string,
    language: string,
    provider: 'openai' | 'anthropic'
  ): Promise<string> {
    try {
      const response = await AIService.generateEducationalContent({
        category,
        topic,
        skillLevel: skillLevel as 'beginner' | 'intermediate' | 'advanced',
        userRole,
        language,
        provider
      });

      return response.content || this.getFallbackContent(topic, language);
    } catch (error) {
      logger.error(`Error generating AI knowledge:`, error);
      throw error;
    }
  }

  /**
   * @method generateCacheKey
   * @description キャッシュキーを生成
   * @param {string} category - カテゴリ
   * @param {string} questionId - 質問ID
   * @param {string} skillLevel - スキルレベル
   * @param {string} userRole - ユーザーロール
   * @param {string} language - 言語
   * @returns {string} キャッシュキー
   */
  private generateCacheKey(
    category: string,
    questionId: string,
    skillLevel: string,
    userRole: string,
    language: string
  ): string {
    return `${category}:${questionId}:${skillLevel}:${userRole}:${language}`;
  }

  /**
   * @method getCachedKnowledge
   * @description キャッシュされた知識を取得
   * @param {string} cacheKey - キャッシュキー
   * @returns {CachedKnowledgeEntry | null} キャッシュエントリまたはnull
   */
  private getCachedKnowledge(cacheKey: string): CachedKnowledgeEntry | null {
    const entry = this.cache.get(cacheKey);
    if (!entry) return null;

    // 期限切れチェック
    if (new Date() > entry.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }

    return entry;
  }

  /**
   * @method cacheKnowledge
   * @description 知識をキャッシュに保存
   * @param {string} cacheKey - キャッシュキー
   * @param {string} content - コンテンツ
   * @param {string} provider - プロバイダー
   * @param {string} skillLevel - スキルレベル
   * @param {string} userRole - ユーザーロール
   * @param {string} language - 言語
   */
  private cacheKnowledge(
    cacheKey: string,
    content: string,
    provider: 'openai' | 'anthropic',
    skillLevel: string,
    userRole: string,
    language: string
  ): void {
    // キャッシュサイズ制限チェック
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldestEntries();
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.CACHE_DURATION_MS);

    this.cache.set(cacheKey, {
      content,
      provider,
      language,
      skillLevel,
      userRole,
      createdAt: now,
      expiresAt
    });

    logger.debug(`Cached knowledge entry: ${cacheKey}`);
  }

  /**
   * @method evictOldestEntries
   * @description 古いキャッシュエントリを削除
   */
  private evictOldestEntries(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].createdAt.getTime() - b[1].createdAt.getTime());
    
    // 古い25%のエントリを削除
    const toRemove = Math.floor(entries.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }

    logger.debug(`Evicted ${toRemove} old cache entries`);
  }

  /**
   * @method getFallbackContent
   * @description フォールバックコンテンツを取得
   * @param {string} topic - トピック
   * @param {string} language - 言語
   * @returns {string} フォールバックコンテンツ
   */
  private getFallbackContent(topic: string, language: string): string {
    if (language === 'ja') {
      return `## ${topic}について\n\n申し訳ございませんが、この項目の詳細な説明は現在準備中です。\n\n### 一般的な情報:\n- ${topic}はクラウドネイティブ環境において重要な概念です\n- 実装方法や最適化については、公式ドキュメントをご参照ください\n- より詳細な情報が必要な場合は、後ほど再度お試しください`;
    } else {
      return `## About ${topic}\n\nWe apologize, but detailed information for this topic is currently being prepared.\n\n### General Information:\n- ${topic} is an important concept in cloud native environments\n- For implementation methods and optimization, please refer to official documentation\n- Please try again later if you need more detailed information`;
    }
  }

  /**
   * @method getCacheStats
   * @description キャッシュ統計を取得
   * @returns {object} キャッシュ統計
   */
  getCacheStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    oldestEntry: Date | null;
    newestEntry: Date | null;
  } {
    const entries = Array.from(this.cache.values());
    const dates = entries.map(e => e.createdAt);
    
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      hitRate: 0, // TODO: Implement hit rate tracking
      oldestEntry: dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null,
      newestEntry: dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null
    };
  }

  /**
   * @method clearCache
   * @description キャッシュをクリア
   */
  clearCache(): void {
    this.cache.clear();
    logger.info('Knowledge cache cleared');
  }
}

// シングルトンインスタンス
export const smartKnowledgeService = new SmartKnowledgeService(); 