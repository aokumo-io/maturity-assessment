/**
 * クライアントサイドログユーティリティ
 * 
 * コンソールラッパーを提供し、一貫したログフォーマットと環境に基づいた
 * 条件付きロギングをサポートします。
 */

// ログレベルを定義
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// 開発環境ではデバッグも表示、本番環境では情報レベル以上のみ
const LOG_LEVEL = process.env.NODE_ENV === 'production' 
  ? LogLevel.INFO 
  : LogLevel.WARN;

// 現在のタイムスタンプを生成（実際のログ時間を記録するため）
const getTimestamp = (): string => new Date().toISOString();

// ログを構造化するためのヘルパー関数
const formatLogEntry = (level: string, message: any, meta?: any): string => {
  try {
    // メタデータの安全な文字列化
    const metaString = meta ? JSON.stringify(meta, replacer) : '';
    
    // ベースとなるログエントリを構築
    const baseEntry = {
      timestamp: getTimestamp(),
      level: level,
      message: typeof message === 'string' ? message : JSON.stringify(message, replacer)
    };
    
    // メタデータがある場合のみ追加
    const logEntry = meta 
      ? { ...baseEntry, meta: metaString } 
      : baseEntry;
      
    return JSON.stringify(logEntry);
  } catch (e) {
    // ログのフォーマットに失敗した場合でもクラッシュしないよう、
    // 基本的なフォーマットで出力
    return `[${level.toUpperCase()}] ${message} ${meta ? JSON.stringify(meta) : ''}`;
  }
};

// 循環参照を解決するための置換関数
function replacer(key: string, value: any): any {
  // 既に処理されたオブジェクトを追跡するためのセット
  const seen = new Set();
  
  return (function replaceValue(this: any, k: string, v: any): any {
    // 配列や基本型ではない場合の巡回チェック
    if (v !== null && typeof v === 'object') {
      if (seen.has(v)) {
        return '[Circular]';
      }
      seen.add(v);
    }
    return v;
  })(key, value);
}

/**
 * クライアントサイドロガー
 * さまざまなログレベルに対応するメソッドを提供します
 */
export const logger = {
  /**
   * エラーメッセージをログに記録します
   * @param message エラーメッセージ
   * @param meta 追加メタデータ（エラーオブジェクトなど）
   */
  error: (message: any, meta?: any): void => {
    if (LOG_LEVEL >= LogLevel.ERROR) {
      console.error(formatLogEntry('error', message, meta));
    }
  },
  
  /**
   * 警告メッセージをログに記録します
   * @param message 警告メッセージ
   * @param meta 追加メタデータ
   */
  warn: (message: any, meta?: any): void => {
    if (LOG_LEVEL >= LogLevel.WARN) {
      console.warn(formatLogEntry('warn', message, meta));
    }
  },
  
  /**
   * 情報メッセージをログに記録します
   * @param message 情報メッセージ
   * @param meta 追加メタデータ
   */
  info: (message: any, meta?: any): void => {
    if (LOG_LEVEL >= LogLevel.INFO) {
      console.info(formatLogEntry('info', message, meta));
    }
  },
  
  /**
   * デバッグメッセージをログに記録します（開発環境のみ）
   * @param message デバッグメッセージ
   * @param meta 追加メタデータ
   */
  debug: (message: any, meta?: any): void => {
    if (LOG_LEVEL >= LogLevel.DEBUG) {
      console.debug(formatLogEntry('debug', message, meta));
    }
  },
  
  /**
   * コンポーネントライフサイクルイベントを記録するためのヘルパー
   * @param component コンポーネント名
   * @param event ライフサイクルイベント（mount, update, unmountなど）
   * @param props コンポーネントのプロパティ
   */
  component: (component: string, event: string, props?: any): void => {
    if (LOG_LEVEL >= LogLevel.DEBUG) {
      console.debug(formatLogEntry('component', `${component}:${event}`, props));
    }
  }
};

export default logger; 