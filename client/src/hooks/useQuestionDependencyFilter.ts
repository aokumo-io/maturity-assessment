import { useMemo } from 'react';
import type { AssessmentQuestion } from '@shared/schema';
import { logger } from '@/lib/logger';

/**
 * @function useQuestionDependencyFilter
 * @description 質問の依存関係に基づいて表示すべき質問をフィルタリングするカスタムフック
 * 依存関係を持つ質問は、その依存関係が満たされた場合にのみ表示されます
 * 
 * @param questions - フィルタリングする質問の配列
 * @param responses - すべての質問に対する現在の回答値
 * @returns 依存関係の条件を満たす質問の配列
 */
export function useQuestionDependencyFilter(
  questions: AssessmentQuestion[],
  responses: Record<string, number>
): AssessmentQuestion[] {
  // Use useMemo to compute filtered questions only when dependencies change
  // This prevents unnecessary recalculations and avoids update loops
  return useMemo(() => {
    if (!questions || questions.length === 0) {
      return [];
    }

    const filteredQuestions = questions.filter(question => {
      // If question has no dependencies, it's always visible
      if (!question.dependencies || question.dependencies.length === 0) {
        return true;
      }
      
      // Check if all dependencies are met
      return question.dependencies.every(dep => {
        const responseValue = responses[dep.questionId];
        // Dependency is met if the response exists and is greater than or equal to the minimum value
        return responseValue !== undefined && responseValue >= dep.minValue;
      });
    });

    // Log only when necessary (avoid excessive logging)
    if (filteredQuestions.length !== questions.length) {
      logger.debug(`Filtered questions based on dependencies: showing ${filteredQuestions.length} of ${questions.length}`);
    }

    return filteredQuestions;
  }, [questions, responses]);
}