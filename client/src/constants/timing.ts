/**
 * @file timing.ts
 * @description アプリケーション全体で使用する時間関連の定数
 * 時間単位の定数を一元管理して、コード全体での整合性を確保します
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
  
  // トースト通知の表示時間
  TOAST_DURATION_SHORT_MS: 3000,      // 3秒
  TOAST_DURATION_MEDIUM_MS: 5000,     // 5秒
  TOAST_DURATION_LONG_MS: 10000,      // 10秒
};

// 時間を分単位に変換
export const msToMinutes = (ms: number): number => Math.round(ms / TIMING.MINUTE_MS);

// 時間を時間単位に変換
export const msToHours = (ms: number): number => Math.round(ms / TIMING.HOUR_MS);

// 時間を日単位に変換
export const msToDays = (ms: number): number => Math.round(ms / TIMING.DAY_MS);

// 特定の時間文字列を提供する便利なユーティリティ関数
export const getSessionDurationText = (sessionType: 'SHORT' | 'MEDIUM' | 'LONG'): string => {
  switch (sessionType) {
    case 'SHORT':
      return `${msToMinutes(TIMING.SESSION_SHORT_MS)}分`;
    case 'MEDIUM':
      return `${msToHours(TIMING.SESSION_MEDIUM_MS)}時間`;
    case 'LONG':
      return `${msToDays(TIMING.SESSION_LONG_MS)}日`;
    default:
      return '不明';
  }
};

// 同じタイミング定数をサーバーと共有するためのエクスポート
export default TIMING; 