/**
 * Axiosのグローバル設定
 * 
 * すべてのAPIリクエストに対する共通の設定とインターセプターを提供します。
 * セッション関連のエラーを処理し、必要に応じてリダイレクトします。
 */

import axios from 'axios';
import { addCsrfTokenToHeaders, extractAndSaveCsrfToken } from './csrf-service';
import { logger } from './logger';
import { resetSession } from './session-service';
import { TIMING } from '../constants/timing';

// Simple circuit breaker to prevent infinite API request loops
let networkErrorCount = 0;
let lastErrorTime = 0;
const MAX_CONSECUTIVE_ERRORS = 5;
const ERROR_COOLDOWN_MS = 5000; // 5 seconds between retries after hitting max errors

// Axiosのデフォルトインスタンスを作成
const api = axios.create({
  baseURL: '/',
  timeout: 30000, // 30秒タイムアウト
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // HTTPOnly CookieをAPIリクエストに含める
});

// リクエストインターセプターを追加
api.interceptors.request.use(
  (config) => {
    // If we've hit too many consecutive errors, block requests temporarily
    if (networkErrorCount >= MAX_CONSECUTIVE_ERRORS) {
      const now = Date.now();
      const timeSinceLastError = now - lastErrorTime;
      
      // Only allow new requests after the cooldown period
      if (timeSinceLastError < ERROR_COOLDOWN_MS) {
        return Promise.reject(new Error('Too many failed requests. Trying again later.'));
      }
      
      // Reset counter after cooldown
      networkErrorCount = 0;
    }
    
    // POST, PUT, DELETEリクエストにCSRFトークンを追加
    if (config.headers) {
      addCsrfTokenToHeaders(config.method || 'get', config.headers as Record<string, string>);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// グローバルでのナビゲーション関数
let navigate: (path: string) => void = () => {
  logger.warn('Navigation function not initialized');
};

/**
 * ナビゲーション関数を設定
 * アプリケーションの起動時に呼び出す必要があります
 */
export const setNavigate = (navigateFn: (path: string) => void) => {
  navigate = navigateFn;
};

// レスポンスインターセプターを追加
api.interceptors.response.use(
  // 成功レスポンスの処理
  (response) => {
    // Success - reset error counter
    networkErrorCount = 0;
    
    // レスポンスヘッダーからCSRFトークンを取得して保存
    extractAndSaveCsrfToken(response.headers);
    return response;
  },
  // エラーレスポンスを処理
  async (error) => {
    if (!error.response) {
      // Network error (server down or unreachable)
      networkErrorCount++;
      lastErrorTime = Date.now();
      
      logger.error(`Network error (${networkErrorCount}/${MAX_CONSECUTIVE_ERRORS}):`, 
        error.message || 'Server unreachable');
      
      // If we've reached the maximum errors, log a warning
      if (networkErrorCount >= MAX_CONSECUTIVE_ERRORS) {
        logger.warn(`Too many consecutive network errors (${networkErrorCount}). Pausing requests temporarily.`);
      }
      
      return Promise.reject({
        ...error,
        message: 'サーバーに接続できません。時間をおいてもう一度お試しください。'
      });
    }
    
    const { status, data, config } = error.response;
    
    // セッション関連のエラー処理
    if (status === 401) {
      // セッション切れの可能性あり
      const errorCode = data?.error;
      
      // 既に認証エラー処理中かどうかをチェック
      const isHandlingAuth = sessionStorage.getItem('handling_auth_error');
      
      if (!isHandlingAuth) {
        // 認証エラー処理中フラグをセット（重複処理を防止）
        sessionStorage.setItem('handling_auth_error', 'true');
        
        if (errorCode === 'SESSION_EXPIRED') {
          logger.warn('Session expired');
          resetSession();
          
          // エラー解決を遅延させて、ユーザーに通知を見せる時間を与える
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // welcomeページへリダイレクト
          navigate('/welcome');
          
          // 認証エラー処理完了後、フラグをクリア
          setTimeout(() => {
            sessionStorage.removeItem('handling_auth_error');
          }, 1000);
          
          return Promise.reject({
            ...error,
            handled: true,
            message: 'セッションの有効期限が切れました。再度ログインしてください。'
          });
        }
        
        if (errorCode === 'SESSION_REQUIRED') {
          logger.warn('Session required for this endpoint');
          
          // welcomeページへリダイレクト
          navigate('/welcome');
          
          // 認証エラー処理完了後、フラグをクリア
          setTimeout(() => {
            sessionStorage.removeItem('handling_auth_error');
          }, 1000);
          
          return Promise.reject({
            ...error,
            handled: true,
            message: 'このアクションにはログインが必要です。'
          });
        }
        
        // 認証エラー処理完了後、フラグをクリア
        setTimeout(() => {
          sessionStorage.removeItem('handling_auth_error');
        }, 1000);
      }
    }
    
    // 他のエラー処理
    if (status === 429) {
      logger.warn('Rate limited', { path: config.url });
      return Promise.reject({
        ...error,
        message: 'リクエストの頻度が高すぎます。しばらく時間を空けてから再試行してください。'
      });
    }
    
    if (status >= 500) {
      logger.error('Server error', { 
        status,
        url: config.url,
        method: config.method,
        response: data
      });
      return Promise.reject({
        ...error,
        message: 'サーバーエラーが発生しました。後でもう一度お試しください。'
      });
    }
    
    // その他のエラー（4xx）
    logger.warn('API request failed', { 
      status,
      url: config.url,
      method: config.method,
      response: data
    });
    
    return Promise.reject(error);
  }
);

export default api; 