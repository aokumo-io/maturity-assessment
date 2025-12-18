/**
 * @file timing.ts
 * @description サーバー側で使用する時間関連の定数
 * クライアント側と整合性を保つために使用します
 */

export const TIMING = {
  // 基本時間単位（ミリ秒）
  MINUTE_MS: 60 * 1000,
  HOUR_MS: 60 * 60 * 1000,
  DAY_MS: 24 * 60 * 60 * 1000,
  
  // セッション期間
  SESSION_SHORT_MS: 12 * 60 * 60 * 1000,  // 12時間
  SESSION_MEDIUM_MS: 24 * 60 * 60 * 1000, // 24時間
  SESSION_LONG_MS: 30 * 24 * 60 * 60 * 1000, // 30日間
  
  // 警告閾値（セッション残り時間の割合）
  WARNING_THRESHOLD: 0.2, // セッション時間の20%が残ったら警告を表示
  
  // クリーンアップ間隔
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // 1時間
  
  // リトライ関連の定数
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000, // 1秒
};

// 時間を分単位に変換
export const msToMinutes = (ms: number): number => Math.round(ms / TIMING.MINUTE_MS);

// 時間を時間単位に変換
export const msToHours = (ms: number): number => Math.round(ms / TIMING.HOUR_MS);

// 時間を日単位に変換
export const msToDays = (ms: number): number => Math.round(ms / TIMING.DAY_MS);

// セッションタイプに基づいて時間を取得するヘルパー関数
export const getSessionDuration = (sessionType: 'SHORT' | 'MEDIUM' | 'LONG'): number => {
  switch (sessionType) {
    case 'SHORT':
      return TIMING.SESSION_SHORT_MS;
    case 'MEDIUM':
      return TIMING.SESSION_MEDIUM_MS;
    case 'LONG':
      return TIMING.SESSION_LONG_MS;
    default:
      return TIMING.SESSION_MEDIUM_MS;
  }
};

export default TIMING; 