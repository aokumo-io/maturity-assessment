/**
 * @file useFeedback.ts
 * @description フィードバック送信フック
 * 
 * ユーザーからのフィードバックをAPIに送信するためのReact Queryフック。
 * CSRFトークンによるセキュリティ保護と包括的なエラーハンドリングを提供する。
 */

import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { useTranslation } from 'react-i18next';
import type { FeedbackData } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

/**
 * フィードバック送信のAPIコール関数
 * CSRFトークン認証とセッション保護を含む
 * 
 * @param feedbackData - 送信するフィードバックデータ
 * @returns サーバーレスポンス
 */
async function submitFeedbackToAPI(feedbackData: FeedbackData): Promise<{ message: string; feedbackId: string }> {
  logger.debug('Submitting feedback', { 
    rating: feedbackData.rating,
    hasEmail: !!feedbackData.email,
    resultId: feedbackData.resultId 
  });

  // Use apiRequest which automatically handles CSRF tokens
  const response = await apiRequest('POST', '/api/feedback', feedbackData);
  const result = await response.json();
  
  logger.info('Feedback submitted successfully', { feedbackId: result.feedbackId });
  return result;
}

/**
 * フィードバック送信フック
 * 
 * @returns React Query mutation object with enhanced error handling
 */
export function useFeedback() {
  const { toast } = useToast();
  const { t } = useTranslation(['feedback', 'common']);

  const submitFeedback = useMutation({
    mutationFn: submitFeedbackToAPI,
    onSuccess: (data) => {
      logger.info('Feedback submission successful', { feedbackId: data.feedbackId });
      
      toast({
        title: t('feedback:success.title', 'Thank you!'),
        description: t('feedback:success.message', 'Your feedback helps us improve.'),
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      logger.error('Feedback submission error', { error: error.message });
      
      // ユーザーフレンドリーなエラーメッセージ
      let userMessage = t('feedback:error.submitFailed', 'Failed to submit feedback. Please try again.');
      
      if (error.message.includes('CSRF')) {
        userMessage = t('feedback:error.securityError', 'Security validation failed. Please refresh and try again.');
      } else if (error.message.includes('session') || error.message.includes('expired')) {
        userMessage = t('feedback:error.sessionExpired', 'Your session has expired. Please refresh the page.');
      } else if (error.message.includes('Network')) {
        userMessage = t('feedback:error.networkError', 'Network error. Please check your connection.');
      }
      
      toast({
        title: t('common:error.title', 'Error'),
        description: userMessage,
        variant: 'destructive',
      });
    },
  });

  return { submitFeedback };
}

export default useFeedback; 