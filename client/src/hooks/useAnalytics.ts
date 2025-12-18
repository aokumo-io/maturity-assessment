/**
 * アナリティクス操作用Reactカスタムフック
 * 
 * このフックは以下の機能を提供します：
 * - ページビュー追跡の簡単な実行
 * - イベント追跡の簡単な実行
 * - アセスメント固有のイベント追跡
 * - ユーザープロパティの設定
 * - アナリティクスの状態確認
 * 
 * 使用例：
 * ```tsx
 * const analytics = useAnalytics();
 * 
 * // ページビューを追跡
 * analytics.trackPage('/assessment/start');
 * 
 * // イベントを追跡
 * analytics.trackEvent('button_click', 'navigation', 'start_assessment');
 * 
 * // アセスメントイベントを追跡
 * analytics.trackAssessment('question_answered', { questionId: 'q1', responseValue: 3 });
 * ```
 */

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  trackPageView,
  trackEvent,
  trackAssessmentEvent,
  setUserProperties,
  isAnalyticsReady,
  type AnalyticsEvent,
  type AssessmentEvent
} from '../lib/analytics';

interface UseAnalyticsReturn {
  // ページビュー追跡
  trackPage: (path?: string, title?: string) => void;
  
  // イベント追跡（簡単なインターフェース）
  trackClick: (elementName: string, category?: string) => void;
  trackEvent: (action: string, category: string, label?: string, value?: number) => void;
  
  // アセスメント固有のイベント追跡
  trackAssessment: (eventName: AssessmentEvent['eventName'], data?: Partial<AssessmentEvent>) => void;
  
  // ユーザープロパティ設定
  setUserProperties: (properties: Record<string, any>) => void;
  
  // 状態確認
  isReady: boolean;
  
  // 言語設定の自動追跡
  trackLanguageChange: (newLanguage: string) => void;
}

/**
 * アナリティクス操作用カスタムフック
 * @returns アナリティクス操作メソッドとステータス
 */
export function useAnalytics(): UseAnalyticsReturn {
  const { i18n } = useTranslation();
  
  // アナリティクスの準備状態をメモ化
  const isReady = useMemo(() => isAnalyticsReady(), []);
  
  // ページビュー追跡
  const trackPage = useCallback((path?: string, title?: string) => {
    trackPageView(path, title);
  }, []);
  
  // クリックイベント追跡（簡単なインターフェース）
  const trackClick = useCallback((elementName: string, category: string = 'engagement') => {
    const event: AnalyticsEvent = {
      action: 'click',
      category,
      label: elementName,
      customParameters: {
        language: i18n.language,
        timestamp: new Date().toISOString()
      }
    };
    trackEvent(event);
  }, [i18n.language]);
  
  // カスタムイベント追跡
  const trackCustomEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    const event: AnalyticsEvent = {
      action,
      category,
      label,
      value,
      customParameters: {
        language: i18n.language,
        timestamp: new Date().toISOString()
      }
    };
    trackEvent(event);
  }, [i18n.language]);
  
  // アセスメント固有のイベント追跡
  const trackAssessment = useCallback((eventName: AssessmentEvent['eventName'], data: Partial<AssessmentEvent> = {}) => {
    const assessmentEvent: AssessmentEvent = {
      eventName,
      language: i18n.language,
      ...data,
      customParameters: {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        ...data.customParameters
      }
    };
    trackAssessmentEvent(assessmentEvent);
  }, [i18n.language]);
  
  // ユーザープロパティ設定（言語情報を自動で含める）
  const setAnalyticsUserProperties = useCallback((properties: Record<string, any>) => {
    const enrichedProperties = {
      language: i18n.language,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...properties
    };
    setUserProperties(enrichedProperties);
  }, [i18n.language]);
  
  // 言語変更の追跡
  const trackLanguageChange = useCallback((newLanguage: string) => {
    trackAssessment('language_changed', {
      language: newLanguage,
      customParameters: {
        previous_language: i18n.language,
        change_method: 'manual_selection'
      }
    });
  }, [i18n.language, trackAssessment]);
  
  return {
    trackPage,
    trackClick,
    trackEvent: trackCustomEvent,
    trackAssessment,
    setUserProperties: setAnalyticsUserProperties,
    isReady,
    trackLanguageChange
  };
}

// 一般的なアセスメントイベントのヘルパー関数
export const useAssessmentTracking = () => {
  const analytics = useAnalytics();
  
  return {
    // アセスメント開始
    trackAssessmentStart: (assessmentType: string) => {
      analytics.trackAssessment('assessment_started', { assessmentType });
    },
    
    // アセスメント完了
    trackAssessmentComplete: (assessmentType: string, completionData?: Record<string, any>) => {
      analytics.trackAssessment('assessment_completed', { 
        assessmentType, 
        customParameters: completionData 
      });
    },
    
    // 質問回答
    trackQuestionAnswer: (questionId: string, responseValue: string | number, categoryId?: string) => {
      analytics.trackAssessment('question_answered', {
        questionId,
        responseValue,
        categoryId
      });
    },
    
    // 知識リソース閲覧
    trackKnowledgeResourceView: (resourceUrl: string, categoryId?: string) => {
      analytics.trackAssessment('knowledge_resource_viewed', {
        resourceUrl,
        categoryId
      });
    },
    
    // 結果共有
    trackAssessmentShare: (shareMethod: string, assessmentType?: string) => {
      analytics.trackAssessment('assessment_shared', {
        shareMethod,
        assessmentType
      });
    }
  };
}; 