/**
 * @file ai-controller.ts
 * @description AIリクエストを処理するコントローラー
 * エンドポイントへのリクエストを処理し、AIサービスを呼び出します。
 */

import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import AIService from '../services/ai-service';
import {
  PromptRequest,
  EducationalContentRequest,
  ExecutiveSummaryRequest,
  TrailMapMilestonesRequest,
  PrioritizedFocusAreasRequest
} from '../types/ai-types';
import { storage } from '../storage';
import config from '../config';
import { ExecutiveSummaryRateLimitService } from '../services/rate-limit-service';

/**
 * AIコントローラークラス
 * AIリクエストの受け取りと応答を処理します
 */
export default class AIController {
  // Rate limiting service instance - follows dependency injection pattern
  private static readonly rateLimitService = new ExecutiveSummaryRateLimitService(
    storage, // implements RateLimitChecker
    storage  // implements RateLimitUpdater
  );

  /**
   * プロンプトリクエストを処理
   */
  static async handlePrompt(req: Request, res: Response) {
    try {
      logger.debug('AI Prompt request body:', JSON.stringify(req.body));
      
      const { provider, prompt, maxTokens = 1000, language = 'en' } = req.body as PromptRequest;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      
      const response = await AIService.generateResponse({
        provider,
        prompt,
        maxTokens,
        language
      });
      
      return res.status(200).json(response);
      
    } catch (error: any) {
      logger.error('AI API Error:', error);
      return res.status(500).json({ 
        error: 'Error generating AI response',
        details: error.message || String(error)
      });
    }
  }

  /**
   * 教育コンテンツリクエストを処理
   */
  static async handleEducationalContent(req: Request, res: Response) {
    try {
      const { category, topic, skillLevel = 'beginner', provider, language = 'en', userRole = 'practitioner' } = req.body as EducationalContentRequest;
      
      if (!category) {
        return res.status(400).json({ error: 'Category is required' });
      }
      
      const response = await AIService.generateEducationalContent({
        category,
        topic,
        skillLevel,
        provider,
        language,
        userRole
      });
      
      return res.json(response);
    } catch (error: any) {
      logger.error('Error generating educational content:', error);
      return res.status(500).json({ 
        error: 'Failed to generate educational content',
        details: error.message || String(error)
      });
    }
  }

  /**
   * エグゼクティブサマリーリクエストを処理
   */
  static async handleExecutiveSummary(req: Request, res: Response) {
    try {
      logger.debug('Executive Summary request body:', JSON.stringify(req.body, null, 2));
      
      // Check if this is the new enhanced request format
      const hasEnhancedData = req.body.assessmentResponses || req.body.ruleBasedAnalysis;
      
      if (hasEnhancedData) {
        // Handle enhanced request format with validation capabilities
        const { 
          assessmentResponses,
          ruleBasedAnalysis,
          calculatedCostAnalysis,
          organizationInfo, 
          userRole, 
          provider, 
          language = 'en'
        } = req.body;

        if (!organizationInfo) {
          return res.status(400).json({ error: 'Organization info is required' });
        }

        // Get session ID from request - follows existing pattern
        const sessionId = (req as any).sessionId;
        
        if (!sessionId) {
          return res.status(401).json({ error: 'Valid session required' });
        }
        
        // Basic validation: ensure session has assessment data - follows existing pattern
        const currentAssessment = await storage.getCurrentAssessment(sessionId);
        if (!currentAssessment) {
          logger.warn(`No assessment found for session ${sessionId} in enhanced executive summary request`);
          return res.status(404).json({ error: 'No assessment found for current session' });
        }
        
        // Check generation limit before proceeding using clean architecture
        const rateLimitResult = await AIController.rateLimitService.checkRateLimit(sessionId);
        if (!rateLimitResult.allowed) {
          logger.warn(`Executive summary generation limit exceeded for session ${sessionId}. Current count: ${rateLimitResult.currentCount}`);
          return res.status(429).json({ 
            error: 'Executive summary generation limit exceeded',
            details: `You have reached the maximum number of executive summary generations for this session. Current count: ${rateLimitResult.currentCount}`,
            currentCount: rateLimitResult.currentCount,
            maxGenerations: rateLimitResult.maxCount
          });
        }
        
        logger.debug(`Processing enhanced executive summary request for session ${sessionId}`);
        
        // Create enhanced assessment data for AI services
        const enhancedAssessmentData = {
          assessmentResponses,
          ruleBasedAnalysis,
          calculatedCostAnalysis,
          organizationInfo,
          userRole: userRole || 'executive',
          language
        };
        
        const response = await AIService.generateExecutiveSummary({
          assessmentData: enhancedAssessmentData,
          categoryScores: ruleBasedAnalysis?.categoryScores || [],
          organizationInfo,
          userRole: userRole || 'executive',
          provider,
          language,
          maxTokens: 4000
        });
        
        // Cache the generated executive summary in session storage
        if (sessionId && response.content) {
          try {
            await storage.saveExecutiveSummary(response.content, sessionId);
            // Increment generation counter using clean architecture service
            await AIController.rateLimitService.incrementGenerationCount(sessionId);
            logger.debug(`Enhanced executive summary cached for session ${sessionId}`);
          } catch (error) {
            logger.warn(`Error caching enhanced executive summary for session ${sessionId}:`, error);
            // Continue even if caching fails
          }
        }
        
        return res.json(response);
      } else {
        // Handle legacy request format for backward compatibility
        const { 
          assessmentData, 
          categoryScores, 
          organizationInfo, 
          userRole, 
          provider, 
          language = 'en'
        } = req.body as ExecutiveSummaryRequest;

        // Check if either assessmentData or the combination of categoryScores and organizationInfo is provided
        if (!assessmentData && (!categoryScores || !organizationInfo)) {
          return res.status(400).json({ error: 'Assessment data is required' });
        }
        
        // Get session ID from request if available
        const sessionId = (req as any).sessionId;
        
        // Check generation limit before proceeding (if session exists)
        if (sessionId) {
          const rateLimitResult = await AIController.rateLimitService.checkRateLimit(sessionId);
          if (!rateLimitResult.allowed) {
            logger.warn(`Executive summary generation limit exceeded for session ${sessionId}. Current count: ${rateLimitResult.currentCount}`);
            return res.status(429).json({ 
              error: 'Executive summary generation limit exceeded',
              details: `You have reached the maximum number of executive summary generations for this session. Current count: ${rateLimitResult.currentCount}`,
              currentCount: rateLimitResult.currentCount,
              maxGenerations: rateLimitResult.maxCount
            });
          }
        }
        
        // Check if we already have a cached executive summary for this session
        if (sessionId) {
          try {
            const cachedSummary = await storage.getExecutiveSummary(sessionId);
            if (cachedSummary) {
              logger.debug(`Returning cached executive summary for session ${sessionId}`);
              return res.json({ content: cachedSummary, provider: 'cached', language });
            }
          } catch (error) {
            logger.warn(`Error checking cached executive summary for session ${sessionId}:`, error);
            // Continue with generation if cache check fails
          }
        }
        
        const response = await AIService.generateExecutiveSummary({
          assessmentData,
          categoryScores,
          organizationInfo,
          userRole,
          provider,
          language,
          maxTokens: 4000
        });
        
        // Cache the generated executive summary in session storage
        if (sessionId && response.content) {
          try {
            await storage.saveExecutiveSummary(response.content, sessionId);
            // Increment generation counter using clean architecture service
            await AIController.rateLimitService.incrementGenerationCount(sessionId);
            logger.debug(`Executive summary cached for session ${sessionId}`);
          } catch (error) {
            logger.warn(`Error caching executive summary for session ${sessionId}:`, error);
            // Continue even if caching fails
          }
        }
        
        return res.json(response);
      }
    } catch (error: any) {
      logger.error('Error generating executive summary:', error);
      return res.status(500).json({ 
        error: 'Failed to generate executive summary',
        details: error.message || String(error)
      });
    }
  }

  /**
   * トレイルマップマイルストーンリクエストを処理
   */
  static async handleTrailMapMilestones(req: Request, res: Response) {
    try {
      logger.debug('Trail Map request body:', JSON.stringify(req.body));
      
      const { assessmentData, provider, language = 'en' } = req.body as TrailMapMilestonesRequest;
      
      if (!assessmentData) {
        return res.status(400).json({ error: 'Assessment data is required' });
      }
      
      const response = await AIService.generateTrailMapMilestones({
        assessmentData,
        provider,
        language
      });
      
      return res.json(response);
    } catch (error: any) {
      logger.error('Error generating trail map milestones:', error);
      return res.status(500).json({ 
        error: 'Failed to generate trail map milestones',
        details: error.message || String(error)
      });
    }
  }

  /**
   * 優先フォーカスエリアリクエストを処理
   */
  static async handlePrioritizedFocusAreas(req: Request, res: Response) {
    try {
      logger.debug('Prioritized Focus Areas request body:', JSON.stringify(req.body));
      
      const { assessmentData, provider, language = 'en' } = req.body as PrioritizedFocusAreasRequest;
      
      if (!assessmentData) {
        return res.status(400).json({ error: 'Assessment data is required' });
      }
      
      const response = await AIService.generatePrioritizedFocusAreas({
        assessmentData,
        provider,
        language
      });
      
      return res.json(response);
    } catch (error: any) {
      logger.error('Error generating prioritized focus areas:', error);
      return res.status(500).json({ 
        error: 'Failed to generate prioritized focus areas',
        details: error.message || String(error)
      });
    }
  }

  /**
   * APIキーのステータスを確認
   */
  static async checkAPIKeys(req: Request, res: Response) {
    try {
      const status = AIService.checkAPIKeys();
      return res.status(200).json(status);
    } catch (error: any) {
      logger.error('Error checking API keys:', error);
      return res.status(500).json({ 
        error: 'Failed to check API keys',
        details: error.message || String(error)
      });
    }
  }
}