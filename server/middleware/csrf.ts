/**
 * CSRF保護ミドルウェア
 * 
 * クロスサイトリクエストフォージェリ（CSRF）攻撃からアプリケーションを保護します。
 * セッションごとに一意のトークンを生成し、すべてのPOST/PUT/DELETE要求で検証します。
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { storage } from '../storage';
import { logger } from '../utils/logger';

// CSRFトークンを保存するためのMap（sessionId -> token）
const csrfTokens = new Map<string, string>();

/**
 * 特定のセッションに対してCSRFトークンを生成または取得します
 * 
 * @param sessionId セッションID
 * @returns 生成されたCSRFトークン
 */
export const generateCsrfToken = (sessionId: string): string => {
  // 既存のトークンがあれば返す
  const existingToken = csrfTokens.get(sessionId);
  if (existingToken) {
    return existingToken;
  }
  
  // 新しいトークンを生成
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.set(sessionId, token);
  return token;
};

/**
 * CSRFトークン生成ミドルウェア
 * GETリクエストでCSRFトークンをレスポンスヘッダーに追加します
 */
export const csrfTokenGenerator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // セッションIDの取得
    let sessionId = (req as any).sessionId;
    
    // セッションIDがあればCSRFトークンを生成・設定
    if (sessionId) {
      const token = generateCsrfToken(sessionId);
      res.setHeader('X-CSRF-Token', token);
    }
    
    next();
  } catch (error) {
    logger.error('CSRF token generation error:', error);
    next();
  }
};

/**
 * CSRFトークン検証ミドルウェア
 * POST/PUT/DELETEリクエストでCSRFトークンを検証します
 */
export const csrfProtection = async (req: Request, res: Response, next: NextFunction) => {
  // GETリクエストとPublicエンドポイントはスキップ
  if (req.method === 'GET' || req.path === '/api/health' || req.path === '/api/ai/status') {
    return next();
  }
  
  try {
    // セッションIDの取得
    const sessionId = (req as any).sessionId;
    if (!sessionId) {
      // セッションがない場合はスキップ
      return next();
    }
    
    // リクエストからCSRFトークンを取得
    const token = req.headers['x-csrf-token'] as string;
    
    // トークンが存在しない場合
    if (!token) {
      return res.status(403).json({
        message: 'CSRFトークンがありません',
        code: 'CSRF_TOKEN_MISSING'
      });
    }
    
    // トークンの検証
    const expectedToken = csrfTokens.get(sessionId);
    if (!expectedToken || token !== expectedToken) {
      return res.status(403).json({ 
        message: 'CSRFトークンが無効です',
        code: 'CSRF_TOKEN_INVALID'
      });
    }
    
    next();
  } catch (error) {
    logger.error('CSRF validation error:', error);
    return res.status(500).json({ message: 'CSRFトークン検証中にエラーが発生しました' });
  }
};

/**
 * セッションの期限切れに合わせてCSRFトークンをクリーンアップする関数
 * 定期的に実行する必要があります
 */
export const cleanupCsrfTokens = async () => {
  try {
    // 期限切れのセッションに関連するトークンを削除
    const expiredSessions = await storage.getExpiredSessionIds();
    for (const sessionId of expiredSessions) {
      csrfTokens.delete(sessionId);
    }
    
    logger.debug(`Cleaned up ${expiredSessions.length} expired CSRF tokens`);
  } catch (error) {
    logger.error('Error cleaning up CSRF tokens:', error);
  }
};

// 5分ごとにクリーンアップを実行
setInterval(cleanupCsrfTokens, 5 * 60 * 1000); 