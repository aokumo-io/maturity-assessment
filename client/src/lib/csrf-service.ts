/**
 * CSRF トークン管理サービス
 * 
 * アプリケーション全体でCSRFトークンを管理するための中央サービス。
 * メモリ内でトークンを保存し、すべてのAPIリクエストで使用できるようにします。
 */

import { logger } from "./logger";

// アプリケーション全体で使用する単一のCSRFトークン
let csrfToken: string | null = null;

/**
 * 現在のCSRFトークンを取得する
 * @returns 保存されているCSRFトークン、またはトークンがない場合はnull
 */
export const getCsrfToken = (): string | null => {
  return csrfToken;
};

/**
 * CSRFトークンを設定する
 * @param token 保存するCSRFトークン
 */
export const setCsrfToken = (token: string | null): void => {
  if (token && token !== csrfToken) {
    csrfToken = token;
  }
};

/**
 * レスポンスヘッダーからCSRFトークンを抽出して保存する
 * @param headers レスポンスヘッダー（Response.headers または AxiosResponse.headers）
 */
export const extractAndSaveCsrfToken = (headers: any): void => {
  let token: string | null = null;
  
  // Response.headers (fetch APIの場合)
  if (typeof headers.get === 'function') {
    token = headers.get('x-csrf-token');
  }
  // AxiosResponse.headers (Axiosの場合)
  else if (headers['x-csrf-token']) {
    token = headers['x-csrf-token'];
  }
  
  if (token) {
    setCsrfToken(token);
  }
};

/**
 * リクエストヘッダーにCSRFトークンを追加する
 * @param method HTTPメソッド
 * @param headers ヘッダーオブジェクト
 */
export const addCsrfTokenToHeaders = (method: string, headers: Record<string, string>): void => {
  // POST、PUT、DELETEリクエストの場合のみトークンを追加
  if (
    csrfToken && 
    (method.toLowerCase() === 'post' || 
     method.toLowerCase() === 'put' || 
     method.toLowerCase() === 'delete')
  ) {
    headers['X-CSRF-Token'] = csrfToken;
  } else if (!csrfToken && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put' || method.toLowerCase() === 'delete')) {
    logger.warn(`No CSRF token available for ${method} request - this will likely fail`);
  }
}; 