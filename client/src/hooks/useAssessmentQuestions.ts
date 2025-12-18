/**
 * @file useAssessmentQuestions.ts
 * @description 言語対応のアセスメント質問キャッシングシステム
 * 言語ごとに独立したキャッシュを管理し、言語切り替え時の一貫性を保証します
 */

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { persistenceManager, STORAGE_KEYS } from '@/lib/assessmentUtils';
import { logger } from '@/lib/logger';
import { apiRequest } from '@/lib/queryClient';
import type { AssessmentQuestion } from '@shared/schema';

/**
 * @function useAssessmentQuestions
 * @description 言語対応の質問取得フック
 * 各言語ごとに独立したキャッシュを管理し、常に現在の言語に対応した質問を返します
 * 
 * @param {string} categoryId カテゴリID
 * @param {string} language 言語コード (en, ja)
 * @returns {object} 質問データとステート
 */
export function useAssessmentQuestions(categoryId: string, language: string) {
  const [localQuestions, setLocalQuestions] = useState<AssessmentQuestion[]>([]);
  const [useCache, setUseCache] = useState<boolean | null>(null);
  const queryClient = useQueryClient();
  
  // 言語対応キャッシュキーを生成
  const getCacheKey = (lang: string) => `${STORAGE_KEYS.ASSESSMENT_QUESTIONS_BY_CATEGORY}_${lang}`;
  
  // 言語またはカテゴリ変更時にキャッシュをチェック
  useEffect(() => {
    const cacheKey = getCacheKey(language);
    logger.debug(`🔍 [${categoryId}] Checking cache for language: ${language} (key: ${cacheKey})`);
    
    try {
      const cachedData = persistenceManager.loadFormData(cacheKey, null);
      
      if (cachedData && cachedData[categoryId] && Array.isArray(cachedData[categoryId])) {
        const questions = cachedData[categoryId] as AssessmentQuestion[];
        if (questions.length > 0) {
          logger.debug(`✅ [${categoryId}] Found ${questions.length} cached questions for ${language}`);
          setLocalQuestions(questions);
          setUseCache(true);
          return;
        }
      }
      
      logger.debug(`❌ [${categoryId}] No cache found for ${language}, will fetch from API`);
      setUseCache(false);
    } catch (error) {
      logger.error(`Error checking cache for ${language}:`, error);
      setUseCache(false);
    }
  }, [categoryId, language]);
  
  // React Query のキャッシュを言語変更時にクリア
  useEffect(() => {
    queryClient.invalidateQueries({ 
      queryKey: ['assessment-questions', categoryId, language] 
    });
  }, [language, categoryId, queryClient]);
  
  // APIから質問を取得（キャッシュがない場合のみ）
  const { data: apiQuestions, isLoading: apiLoading, error } = useQuery<AssessmentQuestion[]>({
    queryKey: ['assessment-questions', categoryId, language],
    queryFn: async () => {
      logger.debug(`🌐 [${categoryId}] Fetching questions from API for language: ${language}`);
      
      const response = await apiRequest('GET', `/api/assessment/questions/${categoryId}?language=${language}`, null);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }
      
      const questions = await response.json();
      logger.debug(`📥 [${categoryId}] Received ${questions.length} questions from API for ${language}`);
      
      // 取得した質問を言語対応キャッシュに保存
      const cacheKey = getCacheKey(language);
      try {
        const existingCache = persistenceManager.loadFormData(cacheKey, {});
        const updatedCache = {
          ...existingCache,
          [categoryId]: questions
        };
        persistenceManager.saveFormData(cacheKey, updatedCache);
        logger.debug(`💾 [${categoryId}] Cached questions for ${language}`);
      } catch (error) {
        logger.warn(`Failed to cache questions for ${language}:`, error);
      }
      
      return questions;
    },
    enabled: useCache === false,
  });
  
  // 現在のカテゴリに属する質問のみをフィルタリング
  const questions = useMemo(() => {
    const sourceQuestions = useCache === true ? localQuestions : (apiQuestions || []);
    const filtered = sourceQuestions.filter(q => q.category === categoryId);
    logger.debug(`🗂️ [${categoryId}] Using ${filtered.length} questions from ${useCache ? 'cache' : 'API'} for ${language}`);
    return filtered;
  }, [localQuestions, apiQuestions, categoryId, useCache, language]);
  
  const isLoading = useCache === null || (useCache === false && apiLoading);
  
  return {
    questions,
    isLoading,
    error,
    fromLocalStorage: useCache === true
  };
} 