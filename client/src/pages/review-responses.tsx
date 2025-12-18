/**
 * レスポンス確認ページ
 * アセスメントの質問と回答を確認するためのページコンポーネント
 * 
 * @description ユーザーがアセスメントで行った回答を質問ごとに確認できるページ
 * @features
 * - カテゴリ別に質問を表示
 * - 各質問に対するユーザーの回答とスコアを表示
 * - 結果ダッシュボードへの戻るボタン
 * - レスポンシブデザイン対応
 * 
 * @limitations
 * - 有効なセッションが必要
 * - アセスメントが完了している必要がある
 */

import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import api from "@/lib/axios-config";

// レビューデータの型定義
interface ReviewResponse {
  questionId: string;
  score: number;
  dontKnow?: boolean;
  createdAt: string;
}

interface ReviewQuestion {
  id: string;
  category: string;
  text: string | Record<string, string>;
  description?: string;
  options: Array<{
    value: number;
    label: string | Record<string, string>;
    description?: string | Record<string, string>;
    isDontKnow?: boolean;
  }>;
  response: ReviewResponse | null;
}

interface ReviewCategory {
  categoryId: string;
  questions: ReviewQuestion[];
}

interface ReviewData {
  assessmentType: string;
  language: string;
  categories: ReviewCategory[];
  totalQuestions: number;
  answeredQuestions: number;
}

/**
 * 質問テキストの取得ヘルパー関数
 * @param text 多言語対応のテキストオブジェクトまたは文字列
 * @param language 言語コード
 * @returns ローカライズされたテキスト
 */
const getLocalizedText = (text: string | Record<string, string>, language: string): string => {
  if (typeof text === 'string') return text;
  return text[language] || text['en'] || Object.values(text)[0] || '';
};

/**
 * カテゴリ名の取得ヘルパー関数
 * @param categoryId カテゴリID
 * @param t 翻訳関数
 * @returns カテゴリ名
 */
const getCategoryName = (categoryId: string, t: any): string => {
  return t(`categories:${categoryId}.title`, categoryId);
};

/**
 * スコアに基づく回答レベルの決定
 * @param score スコア値 (0-100スケール)
 * @param dontKnow 「わからない」フラグ
 * @returns レベル情報
 */
const getAnswerLevel = (score: number, dontKnow?: boolean) => {
  if (dontKnow) {
    return { level: 'knowledge_gap', color: 'bg-purple-100 text-purple-700', label: 'Knowledge Gap' };
  }
  
  if (score >= 80) {
    return { level: 'high', color: 'bg-green-100 text-green-700', label: 'Advanced' };
  } else if (score >= 60) {
    return { level: 'medium', color: 'bg-yellow-100 text-yellow-700', label: 'Intermediate' };
  } else if (score >= 20) {
    return { level: 'low', color: 'bg-blue-100 text-blue-700', label: 'Beginner' };
  } else {
    return { level: 'basic', color: 'bg-red-100 text-red-700', label: 'Basic' };
  }
};

export default function ReviewResponses() {
  const [, navigate] = useLocation();
  const { t, i18n } = useTranslation(['common', 'categories', 'assessment', 'results']);
  const { id } = useParams<{ id?: string }>();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // レビューデータの取得
  const { data: reviewData, isLoading, error } = useQuery<ReviewData>({
    queryKey: ["/api/assessment/review"],
    queryFn: async () => {
      const response = await fetch("/api/assessment/review", {
        credentials: 'include',
        headers: {
          'Accept-Language': i18n.language
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch review data');
      }
      return response.json();
    },
  });

  /**
   * 結果ダッシュボードへの戻り処理
   */
  const handleBackToResults = () => {
    if (id) {
      navigate(`/results/${id}`);
    } else {
      // Fall back to non-UUID route for backward compatibility
      navigate("/results");
    }
  };

  /**
   * カテゴリの展開/折りたたみ切り替え
   * @param categoryId カテゴリID
   */
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleExportPDF = async () => {
      if (isExportingPDF) return; // Prevent multiple clicks
      
      try {
        setIsExportingPDF(true);
        
        // Call the new PDF export endpoint with the current language in headers
        // and enhanced=true query parameter
        const response = await api.post('/api/assessment/export-pdf-review?enhanced=true', {}, {
          responseType: 'blob', // Important for binary data like PDFs
          headers: {
            'Accept-Language': i18n.language // Pass current language (ja or en)
          }
        });
        
        // Create a blob URL for the PDF data
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        
        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'assessment-report.pdf';
        
        if (contentDisposition) {
          // RFC 6266: Try to extract UTF-8 filename first (filename*=UTF-8''...)
          const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
          if (utf8Match) {
            // Decode the UTF-8 encoded filename
            filename = decodeURIComponent(utf8Match[1]);
          } else {
            // Fallback to regular filename="..." 
            const regularMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (regularMatch) {
              filename = regularMatch[1];
            }
          }
        }
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        alert(t('pdfExportError', 'An error occurred while exporting the PDF. Please try again.'));
      } finally {
        setIsExportingPDF(false);
      }
    };

  // ヘッダーアクション
  const actions = (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-primary-500 bg-primary-50 hover:bg-primary-100 border-primary-100"
        onClick={handleExportPDF}
        disabled={isExportingPDF}
        aria-label={
          isExportingPDF
            ? t("results:generating", "Generating...")
            : t("results:dashboard.exportPDF")
        }
        aria-describedby="export-pdf-desc"
      >
        <div className="sr-only" id="export-pdf-desc">
          Export assessment results as PDF document
        </div>
        {isExportingPDF ? (
          <>
            <i
              className="ri-loader-2-line animate-spin mr-1"
              aria-hidden="true"
            ></i>{" "}
            {t("results:generating", "Generating...")}
          </>
        ) : (
          <>
            <i className="ri-download-line mr-1" aria-hidden="true"></i>{" "}
            {t("results:dashboard.exportPDF")}
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={handleBackToResults}
        className="flex items-center"
      >
        <i className="ri-arrow-left-line mr-2"></i>
        {t("common:navigation.backToResults", "Back to Results")}
      </Button>
    </>
  );

  // ローディング状態
  if (isLoading) {
    return (
      <AppLayout 
        title={t('assessment:review.title', 'Review Your Responses')}
        subtitle={t('assessment:review.loading', 'Loading your assessment responses...')}
        actions={actions}
      >
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-md border-0">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="p-4 rounded-lg">
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  // エラー状態
  if (error || !reviewData) {
    return (
      <AppLayout 
        title={t('assessment:review.title', 'Review Your Responses')}
        subtitle={t('assessment:review.error', 'Error loading responses')}
        actions={actions}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <Card className="shadow-md border-0">
            <CardContent className="p-10 text-center">
              <div className="text-5xl text-gray-300 mb-4">
                <i className="ri-error-warning-line"></i>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                {t('assessment:review.errorTitle', 'Unable to Load Responses')}
              </h2>
              <p className="text-gray-500 mb-6">
                {t('assessment:review.errorMessage', 'There was an error loading your assessment responses. Please try again.')}
              </p>
              <Button onClick={handleBackToResults}>
                {t('common:navigation.backToResults', 'Back to Results')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title={t('assessment:review.title', 'Review Your Responses')}
      subtitle={t('assessment:review.subtitle', 'Review all your assessment answers and scores')}
      actions={actions}
    >
      <div className="p-6 bg-gray-50">
        {/* サマリー情報 */}
        <Card className="shadow-md border-0 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600">
                  {t(`assessment:types.${reviewData.assessmentType}`, reviewData.assessmentType.toUpperCase())}
                </div>
                <div className="text-sm text-gray-600">
                  {t('assessment:review.assessmentType', 'Assessment Type')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {reviewData.answeredQuestions}
                </div>
                <div className="text-sm text-gray-600">
                  {t('assessment:review.answeredQuestions', 'Answered Questions')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600">
                  {reviewData.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">
                  {t('assessment:review.totalQuestions', 'Total Questions')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((reviewData.answeredQuestions / reviewData.totalQuestions) * 100)}%
                </div>
                <div className="text-sm text-gray-600">
                  {t('assessment:review.completionRate', 'Completion Rate')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* カテゴリ別の質問と回答 */}
        <div className="space-y-6">
          {reviewData.categories.map((category) => (
            <Card key={category.categoryId} className="shadow-md border-0">
              <Collapsible
                open={expandedCategories.has(category.categoryId)}
                onOpenChange={() => toggleCategory(category.categoryId)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CardTitle className="text-lg">
                          {getCategoryName(category.categoryId, t)}
                        </CardTitle>
                        <Badge variant="secondary">
                          {category.questions.filter(q => q.response).length} / {category.questions.length}
                        </Badge>
                      </div>
                      {expandedCategories.has(category.categoryId) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {category.questions.map((question) => {
                        const selectedOption = question.response 
                          ? question.options.find(opt => opt.value === question.response!.score)
                          : null;
                        
                        const answerLevel = question.response 
                          ? getAnswerLevel(question.response.score, question.response.dontKnow)
                          : null;

                        return (
                          <div 
                            key={question.id} 
                            className={`p-4 rounded-lg ${question.response ? 'bg-white' : 'bg-gray-50'}`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-medium text-gray-900 flex-1 pr-4">
                                {getLocalizedText(question.text, i18n.language)}
                              </h4>
                              {answerLevel && (
                                <Badge className={answerLevel.color}>
                                  {answerLevel.label}
                                </Badge>
                              )}
                            </div>
                            
                            {question.response ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">
                                    {t('assessment:review.yourAnswer', 'Your Answer')}:
                                  </span>
                                  <span className="text-sm font-semibold text-primary-600">
                                    {t('assessment:review.score', 'Score')}: {question.response.score}
                                  </span>
                                </div>
                                {selectedOption && (
                                  <div className="p-3 bg-blue-50 rounded">
                                    <div className="text-sm text-blue-800">
                                      {getLocalizedText(selectedOption.label, i18n.language)}
                                    </div>
                                    {selectedOption.description && (
                                      <div className="text-xs text-blue-600 mt-1">
                                        {getLocalizedText(selectedOption.description, i18n.language)}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 italic">
                                {t('assessment:review.notAnswered', 'Not answered')}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
} 