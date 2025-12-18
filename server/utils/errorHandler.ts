/**
 * エラーハンドリングユーティリティ
 * 
 * クライアントに公開するエラーメッセージを安全にサニタイズし、
 * 内部実装の詳細が漏洩しないようにする機能を提供します。
 */

import { Response } from 'express';
import { logger } from './logger';

// エラータイプのマッピング
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}

// HTTPステータスコードのマッピング
const errorStatusCodes: Record<ErrorType, number> = {
  [ErrorType.VALIDATION]: 400,
  [ErrorType.AUTHENTICATION]: 401,
  [ErrorType.AUTHORIZATION]: 403,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.CONFLICT]: 409,
  [ErrorType.INTERNAL]: 500,
  [ErrorType.SERVICE_UNAVAILABLE]: 503
};

// クライアント向けのエラーメッセージマッピング
const clientErrorMessages: Record<ErrorType, string> = {
  [ErrorType.VALIDATION]: 'リクエストデータが無効です',
  [ErrorType.AUTHENTICATION]: '認証に失敗しました',
  [ErrorType.AUTHORIZATION]: 'このリソースへのアクセス権がありません',
  [ErrorType.NOT_FOUND]: '要求されたリソースが見つかりません',
  [ErrorType.CONFLICT]: 'リソースの競合が発生しました',
  [ErrorType.INTERNAL]: '内部サーバーエラーが発生しました',
  [ErrorType.SERVICE_UNAVAILABLE]: 'サービスは一時的に利用できません'
};

/**
 * エラーメッセージをサニタイズする
 * 
 * 内部エラーメッセージをクライアントに適したものに変換します
 */
export function sanitizeErrorMessage(error: any): string {
  // ZodエラーとValidationエラーは詳細を表示しても問題ない
  if (error?.name === 'ZodError' || error?.message?.includes('Validation')) {
    return error.message;
  }
  
  // セッション関連のエラーは特別扱い
  if (error?.message?.includes('Session has expired') || 
      error?.message?.includes('Cannot load session')) {
    return 'セッションが無効または期限切れです';
  }
  
  // エラーの種類に基づいて安全なメッセージを返す
  const errorType = determineErrorType(error);
  return clientErrorMessages[errorType];
}

/**
 * エラーの種類を判断する
 */
function determineErrorType(error: any): ErrorType {
  const message = error?.message?.toLowerCase() || '';
  
  if (message.includes('validation') || message.includes('invalid')) {
    return ErrorType.VALIDATION;
  } else if (message.includes('not found') || message.includes('doesn\'t exist')) {
    return ErrorType.NOT_FOUND;
  } else if (message.includes('unauthorized') || message.includes('unauthenticated')) {
    return ErrorType.AUTHENTICATION;
  } else if (message.includes('forbidden') || message.includes('permission')) {
    return ErrorType.AUTHORIZATION;
  } else if (message.includes('conflict') || message.includes('duplicate')) {
    return ErrorType.CONFLICT;
  } else if (message.includes('unavailable') || message.includes('temporarily')) {
    return ErrorType.SERVICE_UNAVAILABLE;
  }
  
  // デフォルトは内部エラー
  return ErrorType.INTERNAL;
}

/**
 * 標準化されたエラーレスポンスを送信する
 * 
 * エラーを適切に処理し、クライアントへの応答を標準化します
 */
export function handleApiError(res: Response, error: any, code?: string, redirectTo?: string): void {
  // サーバーログには詳細なエラー情報を記録
  logger.error('[ERROR]', error);
  
  // エラーの種類を判断
  const errorType = determineErrorType(error);
  const statusCode = errorStatusCodes[errorType];
  
  // クライアント向けの安全なメッセージを取得
  const safeMessage = sanitizeErrorMessage(error);
  
  // エラーレスポンスを構築
  const errorResponse: Record<string, any> = {
    message: safeMessage
  };
  
  // オプションのコードとリダイレクト情報を追加
  if (code) {
    errorResponse.code = code;
  }
  
  if (redirectTo) {
    errorResponse.redirectTo = redirectTo;
  }
  
  // JSONレスポンスとして送信
  res.status(statusCode).json(errorResponse);
} 