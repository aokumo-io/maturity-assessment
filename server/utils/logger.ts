/**
 * @file logger.ts
 * @description サーバーサイドロガー実装
 * ログレベルとタイムスタンプを含む構造化ログを提供します。環境に基づいて出力を調整します。
 */

import { createLogger, format, transports } from 'winston';
import { Request } from 'express';
import { nanoid } from 'nanoid';

// 環境変数からログレベルを取得、デフォルトは 'info'
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const NODE_ENV = process.env.NODE_ENV || 'development';

// ログレベルの型定義
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// リクエストコンテキストの型定義
interface LogContext {
  requestId?: string;
  path?: string;
  method?: string;
  [key: string]: any;
}

// エラーオブジェクトを安全にシリアライズする関数
const formatError = (error: Error): object => {
  if (!error) return { message: 'Unknown error' };
  
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(error as any)
  };
};

// 循環参照を処理する関数
const handleCircularReferences = () => {
  const visited = new WeakSet();
  return (key: string, value: any) => {
    // nullやプリミティブ値はそのまま返す
    if (value === null || typeof value !== 'object') {
      return value;
    }
    
    // Errorオブジェクトの場合は特別に処理
    if (value instanceof Error) {
      return formatError(value);
    }
    
    // 循環参照を検出
    if (visited.has(value)) {
      return '[Circular Reference]';
    }
    
    // オブジェクトを訪問済みとしてマーク
    visited.add(value);
    return value;
  };
};

// Winston ロガーのインスタンスを作成
const winstonLogger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'assessment-api' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...rest }) => {
          const reqId = rest.requestId ? ` [${rest.requestId}]` : '';
          let contextStr = '';
          
          try {
            // エラーの場合はスタックトレースを表示
            if (rest.error) {
              const errorStr = typeof rest.error === 'string' 
                ? rest.error 
                : JSON.stringify(rest.error, handleCircularReferences());
              contextStr = ` ${errorStr}`;
            } 
            // それ以外の場合は残りのコンテキストを表示
            else if (Object.keys(rest).length > 0) {
              contextStr = ` ${JSON.stringify(rest, handleCircularReferences())}`;
            }
          } catch (e) {
            contextStr = ' [Error serializing log context]';
          }
          
          return `${timestamp} ${level}${reqId}: ${message}${contextStr}`;
        })
      )
    })
  ]
});

// ロガークラス
class Logger {
  /**
   * リクエストからコンテキスト情報を抽出
   * @param req Expressリクエストオブジェクト
   * @returns ログコンテキスト
   */
  static getRequestContext(req: Request): LogContext {
    const requestId = req.headers['x-request-id'] as string || nanoid(8);
    
    return {
      requestId,
      path: req.path,
      method: req.method
    };
  }

  /**
   * エラーレベルのメッセージをログに記録
   * @param message ログメッセージ
   * @param context 追加コンテキスト（オプション）
   */
  static error(message: string, context?: any): void {
    // エラーオブジェクトを特別に処理
    if (context instanceof Error) {
      winstonLogger.error(message, { error: formatError(context) });
      return;
    }
    winstonLogger.error(message, context);
  }

  /**
   * 警告レベルのメッセージをログに記録
   * @param message ログメッセージ
   * @param context 追加コンテキスト（オプション）
   */
  static warn(message: string, context?: any): void {
    winstonLogger.warn(message, context);
  }

  /**
   * 情報レベルのメッセージをログに記録
   * @param message ログメッセージ
   * @param context 追加コンテキスト（オプション）
   */
  static info(message: string, context?: any): void {
    winstonLogger.info(message, context);
  }

  /**
   * デバッグレベルのメッセージをログに記録
   * @param message ログメッセージ
   * @param context 追加コンテキスト（オプション）
   */
  static debug(message: string, context?: any): void {
    winstonLogger.debug(message, context);
  }
  
  /**
   * リクエスト開始時のログを記録
   * @param req Expressリクエストオブジェクト
   * @returns リクエストID
   */
  static logRequestStart(req: Request): string {
    const context = this.getRequestContext(req);
    const requestId = context.requestId as string;
    
    this.info(`Request started: ${req.method} ${req.path}`, context);
    
    return requestId;
  }
  
  /**
   * リクエスト完了時のログを記録
   * @param req リクエストオブジェクト
   * @param statusCode HTTPステータスコード
   * @param duration 処理時間（ミリ秒）
   * @param requestId リクエストID
   */
  static logRequestEnd(req: Request, statusCode: number, duration: number, requestId?: string): void {
    const context = {
      ...this.getRequestContext(req),
      statusCode,
      durationMs: duration
    };
    
    if (requestId) {
      context.requestId = requestId;
    }
    
    const level = statusCode >= 400 ? 'warn' : 'info';
    winstonLogger[level](`Request completed: ${req.method} ${req.path} ${statusCode} in ${duration}ms`, context);
  }
  
  /**
   * リクエスト処理中のエラーをログに記録
   * @param req リクエストオブジェクト
   * @param error エラーオブジェクト
   * @param requestId リクエストID
   */
  static logRequestError(req: Request, error: Error, requestId?: string): void {
    const context = {
      ...this.getRequestContext(req),
      error: formatError(error)
    };
    
    if (requestId) {
      context.requestId = requestId;
    }
    
    this.error(`Request error: ${req.method} ${req.path} - ${error.message}`, context);
  }

  /**
   * 現在のログレベルを数値で返す
   * 0: debug, 1: info, 2: warn, 3: error
   */
  static getLogLevel(): number {
    switch (LOG_LEVEL) {
      case 'debug': return 0;
      case 'info': return 1;
      case 'warn': return 2;
      case 'error': return 3;
      default: return 1; // Default to info
    }
  }
}

export const logger = Logger; 