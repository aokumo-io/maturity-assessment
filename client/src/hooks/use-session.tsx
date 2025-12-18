/**
 * セッション管理フック
 * 
 * Reactコンポーネントでセッションの状態を利用するためのコンテキストフック
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSessionId, hasSession, saveSessionToCookie, resetSession } from '@/lib/session-service';
import { logger } from '@/lib/logger';

// セッションコンテキストの型定義
interface SessionContextType {
  sessionId: string | null;
  isAuthenticated: boolean;
  setSession: (id: string) => void;
  clearSession: () => void;
}

// デフォルト値
const defaultContext: SessionContextType = {
  sessionId: null,
  isAuthenticated: false,
  setSession: () => {},
  clearSession: () => {},
};

// コンテキストの作成
const SessionContext = createContext<SessionContextType>(defaultContext);

/**
 * セッションプロバイダーコンポーネント
 */
export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 初期化時にセッションを確認
  useEffect(() => {
    const currentSessionId = getSessionId();
    setSessionId(currentSessionId);
    setIsAuthenticated(!!currentSessionId);
    
    logger.debug(`Session initialized: ${currentSessionId ? 'Active' : 'None'}`);
  }, []);

  // セッションIDを設定
  const setSession = (id: string) => {
    saveSessionToCookie(id);
    setSessionId(id);
    setIsAuthenticated(true);
    logger.debug(`Session set: ${id}`);
  };

  // セッションをクリア
  const clearSession = () => {
    resetSession();
    setSessionId(null);
    setIsAuthenticated(false);
    logger.debug('Session cleared');
  };

  return (
    <SessionContext.Provider value={{ sessionId, isAuthenticated, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * セッション状態へアクセスするためのフック
 */
export const useSession = () => {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
};

/**
 * 保護されたルートに使用する高階コンポーネント
 * セッションがない場合は指定されたパスにリダイレクト
 */
export const withSessionGuard = (
  Component: React.ComponentType<any>,
  redirectTo: string = '/'
) => {
  return (props: any) => {
    const { isAuthenticated } = useSession();
    const [, navigate] = require('wouter').useLocation();
    
    useEffect(() => {
      if (!isAuthenticated) {
        logger.debug(`No active session, redirecting to ${redirectTo}`);
        navigate(redirectTo);
      }
    }, [isAuthenticated, navigate]);
    
    // 認証されていない場合はnullを返すことでレンダリングを防止
    if (!isAuthenticated) {
      return null;
    }
    
    return <Component {...props} />;
  };
}; 