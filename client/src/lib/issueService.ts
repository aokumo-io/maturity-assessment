/**
 * @file issueService.ts
 * @description 重要な問題に関連するサービス関数
 * サーバーからアセスメントの重要な問題を取得します
 */

import { logger } from './logger';
import { apiRequest } from './queryClient';

/**
 * 問題インターフェイス
 */
export interface CriticalIssue {
  id: string;
  text: string;
  severity: number;
  categoryId: string;
}

/**
 * サーバーからルールベースの重要な問題を取得する
 * @returns 重要な問題の配列
 */
export async function fetchCriticalIssues(): Promise<CriticalIssue[]> {
  try {
    const response = await apiRequest('GET', '/api/assessment/critical-issues', null);
    
    if (!response.ok) {
      throw new Error('Failed to fetch critical issues');
    }
    
    return await response.json();
  } catch (error) {
    logger.error('[issueService] Error fetching critical issues:', error);
    return [];
  }
} 