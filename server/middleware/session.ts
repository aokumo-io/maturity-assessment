/**
 * セッション検証ミドルウェア
 * 
 * リクエストのセッションIDを検証し、無効または期限切れの場合は専用のレスポンスを返す。
 * このミドルウェアは保護されたルートに適用される。
 */

import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { logger } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

// Define public API routes that don't require session validation
// These routes should be accessible without a session, such as endpoints for
// initial app loading, session creation, and public information
const PUBLIC_API_ROUTES = [
  '/api/health',
  '/api/ai/status',
  '/api/assessment/select-type',
  '/api/assessment/reset',
];

/**
 * Check if a request path matches any of the public routes
 * 
 * @param path The request path to check
 * @returns boolean Whether the path is public
 */
function isPublicRoute(path: string): boolean {
  return PUBLIC_API_ROUTES.some(route => {
    // Handle exact matches and routes with parameters
    return path === route || path.startsWith(`${route}/`);
  });
}

/**
 * S3から保存されたセッションの復元を試みる
 * 
 * @param sessionId 復元するセッションID
 * @returns 復元が成功したかどうか
 */
async function attemptSessionRecovery(sessionId: string): Promise<boolean> {
  try {
    logger.info(`Attempting to recover session ${sessionId} from S3`);
    const result = await storage.processResultId("en", sessionId);
    return result.success;
  } catch (error) {
    logger.error(`Failed to recover session ${sessionId} from S3:`, error);
    return false;
  }
}

/**
 * セッションを必須とするミドルウェア
 * 有効なセッションがない場合は特定のエラーコードを含む401エラーを返す
 */
export const requireValidSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if this is a public route that doesn't require session validation
    if (isPublicRoute(req.path)) {
      logger.debug(`Skipping session validation for public route: ${req.path}`);
      return next();
    }

    // セッションIDをリクエストパラメータから取得（特定のエンドポイント用）
    let sessionId = req.params.sessionId;
    
    // パラメータにセッションIDがない場合はCookieから取得
    if (!sessionId && req.cookies && req.cookies.sessionId) {
      sessionId = req.cookies.sessionId;
    }
    
    // Remove global session fallback - this is the critical security fix
    // Security issue: if we don't find a session in cookies or params,
    // we should NOT use the global server-side session
    // if (!sessionId) {
    //   sessionId = await storage.getResult();
    // }
    
    // セッションIDがない場合は認証エラーとリダイレクト情報を返す
    if (!sessionId) {
      logger.debug('Session missing in protected route');
      return res.status(401).json({ 
        message: 'セッションが見つかりません。アセスメントを開始してください。',
        code: "SESSION_REQUIRED",
        redirectTo: "/welcome"
      });
    }
    
    // セッションの検証
    try {
      await storage.validateSession(sessionId);
      
      // リクエストオブジェクトにセッションIDを追加（後続の処理で使用可能に）
      (req as any).sessionId = sessionId;
      
      next();
    } catch (error: any) {
      // セッションが無効またはメモリ上に見つからない場合、S3からの復元を試みる
      if (error.message?.includes('Cannot load session for id=')) {
        logger.debug(`Session ${sessionId} not found in memory, attempting recovery from S3`);
        
        // S3からの復元を試みる
        const recovered = await attemptSessionRecovery(sessionId);
        
        if (recovered) {
          logger.info(`Session ${sessionId} successfully recovered from S3`);
          
          // 再度セッションを検証
          await storage.validateSession(sessionId);
          
          // リクエストオブジェクトにセッションIDを追加
          (req as any).sessionId = sessionId;
          
          next();
          return;
        }
      }
      
      // 復元に失敗した場合または期限切れの場合、リダイレクト情報を含めて返す
      logger.debug(`Invalid or expired session: ${sessionId}`);
      return res.status(401).json({ 
        message: '無効または期限切れのセッションです。アセスメントを再開始してください。',
        code: "SESSION_EXPIRED", 
        redirectTo: "/welcome"
      });
    }
  } catch (error: any) {
    logger.error('Session validation error:', error);
    handleApiError(res, error, "SESSION_ERROR");
  }
};

/**
 * オプショナルセッションミドルウェア
 * セッションがある場合は検証するが、ない場合もリクエストを続行する
 */
export const validateOptionalSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip session validation entirely for public routes
    if (isPublicRoute(req.path)) {
      logger.debug(`Skipping optional session validation for public route: ${req.path}`);
      return next();
    }

    // セッションIDをリクエストパラメータから取得（特定のエンドポイント用）
    let sessionId = req.params.sessionId;
    
    // パラメータにセッションIDがない場合はCookieから取得
    if (!sessionId && req.cookies && req.cookies.sessionId) {
      sessionId = req.cookies.sessionId;
    }
    
    // Remove global session fallback - match the behavior with requireValidSession
    // if (!sessionId) {
    //   sessionId = await storage.getResult();
    // }
    
    // セッションIDがある場合のみ検証
    if (sessionId) {
      try {
        await storage.validateSession(sessionId);
        // リクエストオブジェクトにセッションIDを追加
        (req as any).sessionId = sessionId;
      } catch (error: any) {
        // セッションがメモリ上に見つからない場合、S3からの復元を試みる
        if (error.message?.includes('Cannot load session for id=')) {
          logger.debug(`Session ${sessionId} not found in memory, attempting recovery from S3`);
          
          // S3からの復元を試みる
          const recovered = await attemptSessionRecovery(sessionId);
          
          if (recovered) {
            logger.info(`Session ${sessionId} successfully recovered from S3`);
            
            // 再度セッションを検証
            try {
              await storage.validateSession(sessionId);
              // リクエストオブジェクトにセッションIDを追加
              (req as any).sessionId = sessionId;
            } catch (secondError) {
              logger.warn(`Recovered session ${sessionId} failed validation:`, secondError);
            }
          }
        }
        
        // セッションが無効な場合も続行するが、リクエストオブジェクトにはセッションIDを設定しない
        else if (error.message?.includes('Session has expired for id=')) {
          logger.debug(`Session expired: ${sessionId}. Request will continue without session context.`);
        } else {
          logger.warn('Invalid session detected but continuing:', error);
        }
      }
    }
    
    next();
  } catch (error: any) {
    logger.error('Optional session validation error:', error);
    handleApiError(res, error, "SESSION_ERROR");
  }
}; 