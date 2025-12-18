/**
 * @file feedback-modal.tsx
 * @description フィードバックモーダルコンポーネント
 * 
 * ユーザーからのフィードバックを収集するためのモーダルダイアログ。
 * 5段階評価、改善点、機能要望、連絡先メールの入力をサポートし、
 * 日本語と英語の両方に対応している。
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import type { FeedbackData } from '@shared/schema';

/**
 * フィードバックモーダルのプロパティ
 */
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackData) => void;
  isLoading?: boolean;
  resultId?: string;
}

/**
 * 星評価コンポーネント
 */
interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

function StarRating({ value, onChange, label }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl transition-colors ${
              star <= (hoverValue || value)
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-400'
            }`}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            onClick={() => onChange(star)}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <i className="ri-star-fill"></i>
          </button>
        ))}
        <span className="ml-3 text-sm text-gray-600">
          {value > 0 && `${value}/5`}
        </span>
      </div>
    </div>
  );
}

/**
 * テキストフィールドコンポーネント
 */
interface QuickFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  type?: 'text' | 'email';
  required?: boolean;
}

function QuickField({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  maxLength = 100, 
  type = 'text',
  required = false 
}: QuickFieldProps) {
  const isNearLimit = value.length > maxLength * 0.8;
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'email' ? (
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          rows={2}
          maxLength={maxLength}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      )}
      {isNearLimit && type !== 'email' && (
        <div className="text-xs text-gray-500 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

/**
 * フィードバックモーダルコンポーネント
 */
export function FeedbackModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  resultId 
}: FeedbackModalProps) {
  const { t } = useTranslation(['feedback', 'common']);
  
  const [formData, setFormData] = useState<FeedbackData>({
    rating: 0,
    workingWell: '',
    needsImprovement: '',
    featureRequests: '',
    email: '',
    resultId
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      return; // Rating is required
    }

    try {
      await onSubmit(formData);
      setSubmitted(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        // Reset form
        setFormData({
          rating: 0,
          workingWell: '',
          needsImprovement: '',
          featureRequests: '',
          email: '',
          resultId
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const isValid = formData.rating > 0;

  if (!isOpen) return null;

  // Success state
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('feedback:success.title', 'Thank you!')}
            </h3>
            <p className="text-gray-600">
              {t('feedback:success.message', 'Your feedback helps us improve the assessment experience.')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💬</span>
              <div>
                <CardTitle className="text-lg">
                  {t('feedback:title', 'Quick Feedback')}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {t('feedback:subtitle', 'Help us improve (30 seconds)')}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* 1. Star Rating */}
            <StarRating
              value={formData.rating}
              onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
              label={t('feedback:fields.rating.label', 'How was your experience?')}
            />

            {/* 2. What's Working Well */}
            <QuickField
              label={`💚 ${t('feedback:fields.workingWell.label', "What's working well?")}`}
              placeholder={t('feedback:fields.workingWell.placeholder', 'What did you find most helpful?')}
              value={formData.workingWell || ''}
              onChange={(workingWell) => setFormData(prev => ({ ...prev, workingWell }))}
              maxLength={100}
            />

            {/* 3. What Needs Improvement */}
            <QuickField
              label={`🔧 ${t('feedback:fields.needsImprovement.label', 'What needs improvement?')}`}
              placeholder={t('feedback:fields.needsImprovement.placeholder', 'What was confusing or frustrating?')}
              value={formData.needsImprovement || ''}
              onChange={(needsImprovement) => setFormData(prev => ({ ...prev, needsImprovement }))}
              maxLength={100}
            />

            {/* 4. Feature Requests */}
            <QuickField
              label={`💡 ${t('feedback:fields.featureRequests.label', 'Feature ideas?')}`}
              placeholder={t('feedback:fields.featureRequests.placeholder', 'What features would you like to see?')}
              value={formData.featureRequests || ''}
              onChange={(featureRequests) => setFormData(prev => ({ ...prev, featureRequests }))}
              maxLength={100}
            />

            {/* 5. Optional Email */}
            <QuickField
              label={`📧 ${t('feedback:fields.email.label', 'Email (optional)')}`}
              placeholder={t('feedback:fields.email.placeholder', 'your@email.com (for follow-up)')}
              value={formData.email || ''}
              onChange={(email) => setFormData(prev => ({ ...prev, email }))}
              type="email"
            />
          </CardContent>

          <div className="px-6 pb-6">
            <div className="flex justify-between items-center space-x-3">
              <Button 
                type="button"
                variant="ghost" 
                onClick={handleSkip}
                disabled={isLoading}
              >
                {t('common:actions.skip', 'Skip')}
              </Button>
              
              <Button 
                type="submit"
                disabled={!isValid || isLoading}
                className="bg-primary-500 hover:bg-primary-600"
              >
                {isLoading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {t('common:actions.sending', 'Sending...')}
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line mr-2"></i>
                    {t('feedback:actions.submit', 'Send Feedback')}
                  </>
                )}
              </Button>
            </div>
            
            {!isValid && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                {t('feedback:validation.ratingRequired', 'Please rate your experience to submit feedback')}
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default FeedbackModal; 