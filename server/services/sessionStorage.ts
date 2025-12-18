/**
 * セッションストレージサービス
 * 
 * セッション管理のためのユーティリティとオプションを提供します。
 * セッションの作成、検証、有効期限の管理を担当します。
 */

import { randomUUID } from 'crypto';

// セッションの型定義
export interface Session {
  id: string;
  createdAt: Date;
  lastAccessedAt: Date;
  expiresAt: Date;
  type: string;
  data?: Record<string, any>;
}

export class SessionStorage {
  private sessions: Map<string, Session> = new Map();
  private readonly SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24時間（ミリ秒）
  
  /**
   * 新しいセッションを作成します
   * 
   * @param type セッションタイプ（例: "assessment", "admin"）
   * @param initialData セッションに関連付ける初期データ
   * @returns 作成されたセッションID
   */
  createSession(type: string, initialData?: Record<string, any>): string {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_EXPIRY_MS);
    const sessionId = randomUUID();
    
    this.sessions.set(sessionId, {
      id: sessionId,
      createdAt: now,
      lastAccessedAt: now,
      expiresAt,
      type,
      data: initialData || {}
    });
    
    return sessionId;
  }
  
  /**
   * 指定されたセッションIDの有効性を確認します
   * 
   * @param sessionId 検証するセッションID
   * @returns セッションが有効な場合はtrue
   * @throws セッションが無効または期限切れの場合はエラー
   */
  validateSession(sessionId: string): boolean {
    if (!this.sessions.has(sessionId)) {
      throw new Error(`セッションが見つかりません: ${sessionId}`);
    }
    
    const session = this.sessions.get(sessionId)!;
    const now = new Date();
    
    // 期限切れかチェック
    if (now > session.expiresAt) {
      this.sessions.delete(sessionId);
      throw new Error(`セッションの期限が切れています: ${sessionId}`);
    }
    
    // 最終アクセス時間を更新
    session.lastAccessedAt = now;
    
    // セッション有効期限を延長
    session.expiresAt = new Date(now.getTime() + this.SESSION_EXPIRY_MS);
    this.sessions.set(sessionId, session);
    
    return true;
  }
  
  /**
   * セッション内のデータを取得します
   * 
   * @param sessionId セッションID
   * @returns セッションデータまたはnull（セッションが無効な場合）
   */
  getSessionData(sessionId: string): Record<string, any> | null {
    try {
      this.validateSession(sessionId);
      return this.sessions.get(sessionId)?.data || null;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * セッション内のデータを更新します
   * 
   * @param sessionId セッションID
   * @param data 更新するデータ（既存のデータとマージされます）
   * @returns 更新が成功した場合はtrue
   */
  updateSessionData(sessionId: string, data: Record<string, any>): boolean {
    try {
      this.validateSession(sessionId);
      const session = this.sessions.get(sessionId)!;
      session.data = { ...session.data, ...data };
      this.sessions.set(sessionId, session);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * セッションを削除します
   * 
   * @param sessionId 削除するセッションID
   * @returns 削除が成功した場合はtrue
   */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }
  
  /**
   * 期限切れのセッションをすべて削除します
   * 
   * @returns 削除されたセッション数
   */
  cleanupExpiredSessions(): number {
    const now = new Date();
    let deletedCount = 0;
    
    // Array.fromを使用してMapのエントリーを配列に変換し、Iterator問題を回避
    Array.from(this.sessions.entries()).forEach(([sessionId, session]) => {
      if (now > session.expiresAt) {
        this.sessions.delete(sessionId);
        deletedCount++;
      }
    });
    
    return deletedCount;
  }
}

// シングルトンインスタンスをエクスポート
export const sessionStorage = new SessionStorage(); 