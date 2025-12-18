/**
 * セッション管理サービス
 * 
 * アプリケーション全体でセッションを管理するための中央サービス。
 * セッションIDの保存、取得、検証を行います。
 */

import { logger } from './logger';
import { TIMING } from '../constants/timing';

/**
 * セッションタイプの定義
 */
export type SessionType = 'SHORT' | 'MEDIUM' | 'LONG';

// セッションIDとその有効期限を保存
interface SessionData {
  id: string;
  expiresAt?: Date;
  type?: SessionType;
}

// HTTPOnly Cookieに保存されるセッションIDを
// メモリにもキャッシュして使いやすくする
let currentSession: SessionData | null = null;

// クッキーに保存する名前
const SESSION_COOKIE_NAME = 'sessionId';

// CSRFトークンを格納するヘッダー名
export const CSRF_HEADER = 'X-CSRF-Token';

/**
 * セッションIDをクッキーから読み込む
 * 
 * @returns 取得したセッションID、存在しない場合はnullを返す
 */
export const loadSessionFromCookie = (): string | null => {
  // HTTPOnly Cookieは直接アクセスできないため、
  // ここではセッションの存在確認のみを行い、
  // 実際の認証はAPIリクエスト時にサーバー側で行われる
  
  // セッションが既にメモリに存在するか確認
  if (currentSession?.id) {
    return currentSession.id;
  }
  
  // クッキーを取得できないので、null を返す
  // APIリクエスト時にはcredentials: 'include'を使用することで
  // HTTPOnly Cookieが自動的に送信される
  return null;
};

/**
 * セッションIDをクッキーに保存する
 * 
 * @param sessionId 保存するセッションID
 * @param sessionType セッションタイプ（SHORT, MEDIUM, LONG）
 */
export const saveSessionToCookie = (sessionId: string, sessionType: SessionType = 'MEDIUM'): void => {
  if (!sessionId) {
    logger.warn('Attempted to save empty session ID');
    return;
  }
  
  // セッションタイプに基づいて期間を決定
  const expirationMs = getSessionDurationMs(sessionType);
  
  // メモリ内セッションを更新
  currentSession = {
    id: sessionId,
    expiresAt: new Date(Date.now() + expirationMs),
    type: sessionType
  };
  
  logger.debug(`Session saved to memory: ${sessionId.substring(0, 8)}..., type: ${sessionType}, expires in: ${expirationMs/1000/60} minutes`);
  
  // 注: HTTPOnly CookieはクライアントJSから直接設定できない
  // サーバーからのレスポンスで設定されるため、ここでは何もしない
};

/**
 * セッションをリセットする
 */
export const resetSession = (): void => {
  currentSession = null;
  logger.debug('Session reset');
  
  // サーバー側でセッションを無効化するAPIを呼び出す - removed as endpoint doesn't exist
  // fetch('/api/session/logout', {
  //   method: 'POST',
  //   credentials: 'include',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }).catch(err => {
  //   logger.error('Error logging out session on server:', err);
  // });
};

/**
 * セッションが存在するか確認する
 * 
 * @returns セッションが存在すればtrue、そうでなければfalse
 */
export const hasSession = (): boolean => {
  return !!currentSession?.id;
};

/**
 * 現在のセッションIDを取得する
 * @returns 現在のセッションID、存在しない場合はnullを返す
 */
export const getSessionId = (): string | null => {
  // まずメモリから確認
  if (currentSession?.id) {
    return currentSession.id;
  }
  
  // メモリにない場合はクッキーから読み込み
  return loadSessionFromCookie();
};

/**
 * セッションの期間をミリ秒で取得する
 * @param type セッションタイプ
 * @returns セッション期間（ミリ秒）
 */
export const getSessionDurationMs = (type: SessionType = 'MEDIUM'): number => {
  switch (type) {
    case 'SHORT':
      return TIMING.SESSION_SHORT_MS;
    case 'LONG':
      return TIMING.SESSION_LONG_MS;
    case 'MEDIUM':
    default:
      return TIMING.SESSION_MEDIUM_MS;
  }
};

/**
 * セッションが期限切れに近づいているか確認する
 * @returns 期限切れに近づいていればtrue、そうでなければfalse
 */
export const isSessionNearingExpiration = (): boolean => {
  if (!currentSession?.expiresAt) return false;
  
  const now = new Date();
  const expiresAt = currentSession.expiresAt;
  
  // セッションタイプに基づいて適切な期間を取得
  const sessionDuration = getSessionDurationMs(currentSession.type);
  
  // 警告表示の閾値を計算
  const warningThreshold = sessionDuration * TIMING.WARNING_THRESHOLD;
  
  // 残り時間が閾値以下ならtrue
  return (expiresAt.getTime() - now.getTime()) <= warningThreshold;
};

/**
 * セッションの残り時間（ミリ秒）を取得する
 * @returns 残り時間（ミリ秒）、セッションがない場合は0
 */
export const getSessionRemainingTime = (): number => {
  if (!currentSession?.expiresAt) return 0;
  
  const now = new Date();
  const expiresAt = currentSession.expiresAt;
  
  return Math.max(0, expiresAt.getTime() - now.getTime());
};

/**
 * セッションタイプを取得する
 * @returns セッションタイプ、セッションがない場合は'MEDIUM'
 */
export const getSessionType = (): SessionType => {
  return currentSession?.type || 'MEDIUM';
};

/**
 * CSRFトークンを取得する
 * @returns CSRFトークン、存在しない場合はnullを返す
 */
export const getCsrfToken = (): string | null => {
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag ? metaTag.getAttribute('content') : null;
};

/**
 * CSRF保護されたフェッチリクエストを作成する
 * @param url リクエストURL
 * @param options フェッチオプション
 * @returns フェッチレスポンス
 */
export const fetchWithCsrf = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const csrfToken = getCsrfToken();
  const headers = new Headers(options.headers || {});
  
  if (csrfToken) {
    headers.set(CSRF_HEADER, csrfToken);
  }
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include' // 常にクッキーを送信
  });
}; 