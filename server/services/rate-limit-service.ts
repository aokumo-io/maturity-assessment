/**
 * @file rate-limit-service.ts
 * @description レート制限サービス - クリーンアーキテクチャに従った実装
 * ドメインロジックをストレージから分離し、単一責任の原則に従います
 */

import { logger } from '../utils/logger';
import { SESSION_CONFIG } from '../config';

/**
 * レート制限の結果を表すインターフェース
 */
export interface RateLimitResult {
  allowed: boolean;
  currentCount: number;
  maxCount: number;
  rateLimitSessionId: string;
}

/**
 * レート制限チェック用のインターフェース
 */
export interface RateLimitChecker {
  getGenerationCount(sessionId: string): Promise<number>;
  getOriginalSessionId(sessionId: string): Promise<string | null>;
}

/**
 * レート制限更新用のインターフェース
 */
export interface RateLimitUpdater {
  incrementGenerationCount(sessionId: string): Promise<number>;
}

/**
 * エグゼクティブサマリー生成のレート制限サービス
 * 
 * このサービスは以下の責任を持ちます：
 * - レート制限の判定ロジック
 * - オリジナルセッションIDの解決
 * - レート制限カウンターの管理
 */
export class ExecutiveSummaryRateLimitService {
  private readonly maxGenerations: number;

  constructor(
    private readonly checker: RateLimitChecker,
    private readonly updater: RateLimitUpdater,
    maxGenerations?: number
  ) {
    this.maxGenerations = maxGenerations || SESSION_CONFIG.MAX_EXECUTIVE_SUMMARY_GENERATIONS;
  }

  /**
   * レート制限をチェックし、生成が許可されているかを判定
   * 
   * @param sessionId - チェック対象のセッションID
   * @returns レート制限の結果
   */
  async checkRateLimit(sessionId: string): Promise<RateLimitResult> {
    try {
      // オリジナルセッションIDを解決（結果セッションから元のユーザーセッションへ）
      const originalSessionId = await this.checker.getOriginalSessionId(sessionId);
      const rateLimitSessionId = originalSessionId || sessionId;

      // 現在の生成回数を取得
      const currentCount = await this.checker.getGenerationCount(rateLimitSessionId);

      // レート制限の判定
      const allowed = currentCount < this.maxGenerations;

      return {
        allowed,
        currentCount,
        maxCount: this.maxGenerations,
        rateLimitSessionId
      };
    } catch (error) {
      logger.error(`Error checking rate limit for session ${sessionId}:`, error);
      throw new Error(`Rate limit check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 生成カウンターをインクリメント
   * 
   * @param sessionId - 対象のセッションID
   * @returns 新しい生成回数
   */
  async incrementGenerationCount(sessionId: string): Promise<number> {
    try {
      // オリジナルセッションIDを解決
      const originalSessionId = await this.checker.getOriginalSessionId(sessionId);
      const rateLimitSessionId = originalSessionId || sessionId;

      // カウンターをインクリメント
      const newCount = await this.updater.incrementGenerationCount(rateLimitSessionId);

      return newCount;
    } catch (error) {
      logger.error(`Error incrementing generation count for session ${sessionId}:`, error);
      throw new Error(`Generation count increment failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 現在の生成回数を取得
   * 
   * @param sessionId - 対象のセッションID
   * @returns 現在の生成回数
   */
  async getCurrentCount(sessionId: string): Promise<number> {
    try {
      // オリジナルセッションIDを解決
      const originalSessionId = await this.checker.getOriginalSessionId(sessionId);
      const rateLimitSessionId = originalSessionId || sessionId;

      return await this.checker.getGenerationCount(rateLimitSessionId);
    } catch (error) {
      logger.error(`Error getting current count for session ${sessionId}:`, error);
      throw new Error(`Get current count failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 