import { Router } from 'express';
import { logger } from '../utils/logger';
import { storage } from '../storage';
import { requireValidSession } from '../middleware/session';
import { csrfTokenGenerator } from '../middleware/csrf';
import { handleApiError } from '../utils/errorHandler';
import type { AssessmentQuestion } from '@shared/schema';

const router = Router();

/**
 * 回答確認データ取得エンドポイント
 * ユーザーの評価回答を質問と一緒に返す
 * 
 * @route GET /api/assessment/review
 * @description 現在の評価セッションの回答データを質問情報と共に返す
 * @returns ReviewData 回答データ（カテゴリ別の質問と回答）
 */
router.get('/review', requireValidSession, csrfTokenGenerator, async (req, res) => {
  try {
    const sessionId = (req as any).sessionId;
    const language = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
    
    logger.debug(`Getting review data for session ${sessionId} with language ${language}`);
    
    // Get the current assessment 
    const assessment = await storage.getCurrentAssessment(sessionId);
    if (!assessment) {
      return res.status(404).json({ message: "No assessment found" });
    }
    
    logger.debug(`Assessment type: ${assessment.assessmentType}`);
    
    // Get category scores to determine which categories are valid for this assessment type
    // This uses the same logic as the /api/assessment/scores endpoint that works correctly
    const categoryScores = await storage.getCategoryScores(sessionId);
    const validCategoryIds = categoryScores.map(score => score.categoryId);
    logger.debug(`Valid categories from scores for ${assessment.assessmentType} assessment:`, validCategoryIds);
    
    // Get all responses for this session
    const responses = await storage.getAssessmentResponses(sessionId);
    logger.debug(`Found ${responses.length} responses`);
    
    // Create a map of responses by question ID for quick lookup
    const responseMap = new Map(responses.map(r => [r.questionId, r]));
    
    // Build categories with questions and responses
    const reviewCategories = [];
    let totalQuestions = 0;
    
    for (const categoryId of validCategoryIds) {
      try {
        // Get questions for this category in the current language
        const questions = await storage.getQuestionsByCategory(categoryId, language, sessionId);
        logger.debug(`Category ${categoryId}: ${questions.length} questions`);
        
        // Build review questions with responses
        const reviewQuestions = questions.map(question => {
            const response = responseMap.get(question.id) || null;
            if (response) {
              totalQuestions++;
              return {
                id: question.id,
                category: categoryId,
                text: question.text,
                description: question.description,
                options: question.options || [],
                response: response
              };
            }
            return null;
          })
          .filter(q => q !== null);
        
        if (reviewQuestions.length > 0) {
          reviewCategories.push({
            categoryId,
            questions: reviewQuestions
          });
        }
      } catch (error) {
        logger.error(`Error getting questions for category ${categoryId}:`, error);
        // Continue with other categories instead of failing completely
      }
    }
    
    // Count unique answered questions from the responseMap
    const answeredQuestions = responseMap.size;
    logger.debug(`Final counts - Total: ${totalQuestions}, Answered: ${answeredQuestions}, Categories: ${reviewCategories.length}`);
    
    const reviewData = {
      assessmentType: assessment.assessmentType,
      language,
      categories: reviewCategories,
      totalQuestions,
      answeredQuestions
    };
    
    logger.debug(`Review data prepared: ${reviewCategories.length} categories, ${answeredQuestions}/${totalQuestions} questions answered`);
    
    res.json(reviewData);
  } catch (error: any) {
    logger.error('Error in review endpoint:', error);
    handleApiError(res, error);
  }
});

export default router; 