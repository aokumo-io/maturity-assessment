/**
 * @file vertical-progress.tsx
 * @description 左側に配置される質問の進捗状況を示す垂直プログレスバーコンポーネント
 */

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { ASSESSMENT_CATEGORIES } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface VerticalProgressProps {
  questions: Array<{ id: string; category: string }>;
  responses: Record<string, number>;
  currentQuestionId?: string;
  categoryId: string;
  onQuestionClick?: (questionId: string) => void;
  isFormComplete?: boolean;
  isPending?: boolean;
  onSubmit?: () => void;
  isLastCategory?: boolean;
}

export function VerticalProgress({
  questions,
  responses,
  currentQuestionId,
  categoryId,
  onQuestionClick,
  isFormComplete = false,
  isPending = false,
  onSubmit,
  isLastCategory = false
}: VerticalProgressProps) {
  const { t } = useTranslation(["assessment", "common"]);
  const category = ASSESSMENT_CATEGORIES.find(cat => cat.id === categoryId);

  return (
    <div
      className={`transition-transform duration-300 sticky top-16 self-start bg-white rounded-lg shadow-md p-5`}
      style={{ width: "auto" }}
    >
      {/* Category info */}
      <div className="aspect-square w-full flex flex-col items-center justify-center text-center">
        <div className="mb-4 relative group">
          <i
            className={`${
              category?.icon || "ri-question-line"
            } text-[#2563eb] text-5xl cursor-pointer`}
          />
          
          {/* Tooltip for category name */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-md border border-gray-200">
            {t(
              `assessment:categories.${categoryId}`,
              category?.title || "Category"
            )}
          </div>
        </div>
        
        {/* Question circles only - inside the square */}
        {questions.length > 0 && (
          <div className="flex flex-col items-center space-y-2 mt-4">
            {questions.map((question, index) => {
              const isAnswered = responses[question.id] !== undefined;
              const isCurrent = question.id === currentQuestionId;
              
              return (
                <div
                  key={question.id}
                  className={`${
                    onQuestionClick ? "cursor-pointer" : ""
                  } transition-transform hover:scale-110 relative group`}
                  onClick={() => onQuestionClick?.(question.id)}
                >
                  {isAnswered ? (
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Circle
                      className={`w-6 h-6 ${
                        isCurrent ? "text-orange-500" : "text-gray-400"
                      }`}
                    />
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-md border border-gray-200">
                    {t("assessment:progress.questionNumber", "Question {{number}}", { number: index + 1 })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Button */}
      {questions.length > 0 && onSubmit && (
        <div className="mt-4 flex justify-center">
          <Button 
            onClick={onSubmit}
            disabled={!isFormComplete || isPending}
            className={`text-sm ${
              !isFormComplete 
                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                : 'bg-[#FF8015] hover:bg-[#E66700]'
            } text-white`}
          >
            {isPending ? (
              <>
                <div className="inline-block animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-2"></div>
                {t('assessment:navigation.saving', 'Saving...')}
              </>
            ) : (
              <>
                {isLastCategory 
                  ? t('assessment:navigation.completeAssessment', 'Complete Assessment') 
                  : t('common:actions.next', 'Next')}
                <i className="ri-arrow-right-line ml-2"></i>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default VerticalProgress;
