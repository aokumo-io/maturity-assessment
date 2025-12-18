/**
 * レート制限ミドルウェア
 * 
 * 短時間に多数のリクエストを行うことによる乱用からAPIを保護します。
 * IPアドレスとパスの組み合わせに基づいてリクエストを制限します。
 */

import { Request, Response, NextFunction } from 'express';

// レート制限用のストレージ（IPとルートごとにリクエストをカウント）
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// キーはIP:path形式
const rateLimitStore = new Map<string, RateLimitEntry>();

// レート制限の設定をパスごとに定義
const rateConfig: Record<string, { windowMs: number; max: number }> = {
  // パブリックエンドポイント
  '/api/health': { windowMs: 60 * 1000, max: 30 }, // 1分あたり30リクエスト
  '/api/ai/status': { windowMs: 60 * 1000, max: 20 }, // 1分あたり20リクエスト
  
  // セッション作成関連エンドポイント（乱用防止）
  '/api/assessment/organization': { windowMs: 60 * 1000, max: 10 }, // 1分あたり10リクエスト
  '/api/assessment/select': { windowMs: 60 * 1000, max: 10 }, // 1分あたり10リクエスト
  '/api/assessment/select-type': { windowMs: 60 * 1000, max: 10 }, // 1分あたり10リクエスト
};

// 定期的にレート制限ストアをクリーンアップする（メモリリーク防止）
const cleanupInterval = 5 * 60 * 1000; // 5分ごと
setInterval(() => {
  const now = Date.now();
  // Array.fromを使用してエントリを配列に変換してからイテレーション
  Array.from(rateLimitStore.entries()).forEach(([key, entry]) => {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  });
}, cleanupInterval);

/**
 * レート制限ミドルウェア
 * 特定のエンドポイントへのリクエスト数を制限します
 */
export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  
  // このパスにレート制限設定があるか確認
  const config = rateConfig[path];
  if (!config) {
    return next(); // 設定がなければ制限なし
  }
  
  // クライアントIPを取得（プロキシ対応）
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const key = `${clientIp}:${path}`;
  
  const now = Date.now();
  let entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetAt) {
    // 新規エントリーか期限切れの場合はリセット
    entry = {
      count: 1,
      resetAt: now + config.windowMs
    };
    rateLimitStore.set(key, entry);
    
    // レスポンスヘッダーの設定
    setRateLimitHeaders(res, config.max, config.max - 1, entry.resetAt);
    return next();
  }
  
  // 制限値を超えた場合
  if (entry.count >= config.max) {
    // レスポンスヘッダーの設定
    setRateLimitHeaders(res, config.max, 0, entry.resetAt);
    return res.status(429).json({
      message: 'リクエスト回数が多すぎます。しばらく待ってから再試行してください。',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((entry.resetAt - now) / 1000) // 秒単位で再試行までの時間を返す
    });
  }
  
  // カウントを増やす
  entry.count++;
  rateLimitStore.set(key, entry);
  
  // レスポンスヘッダーの設定
  setRateLimitHeaders(res, config.max, config.max - entry.count, entry.resetAt);
  next();
};

/**
 * レート制限関連のヘッダーをレスポンスに設定
 */
function setRateLimitHeaders(
  res: Response, 
  limit: number, 
  remaining: number, 
  resetAt: number
) {
  res.setHeader('X-RateLimit-Limit', limit.toString());
  res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining).toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(resetAt / 1000).toString()); // Unix timestamp (seconds)
} 