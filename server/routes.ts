import type { Express } from "express";
import { logger } from './utils/logger';
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertOrganizationSchema, 
  insertAssessmentResponseSchema,
  assessmentQuestionSchema,
  categoryScoreSchema,
  cloudProvidersEnum,
  deploymentModelEnum,
  organizationRolesEnum,
  type Organization,
  type AssessmentQuestion
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import aiRoutes from "./routes/ai-routes";
import implementationRoutes from "./routes/implementation";
import knowledgeRoutes from "./routes/knowledge";
import reviewRoutes from "./routes/review";
import { buildRoadmap } from "./services/roadmap-builder";
import { PhaseBand, Recommendation, RoadmapItem } from "./models/roadmap-types";
import type { CategoryId } from "./rules/issue-rule-model";
import { requireValidSession, validateOptionalSession } from "./middleware/session";
import { csrfTokenGenerator, csrfProtection } from "./middleware/csrf";
import { handleApiError } from "./utils/errorHandler";
import { generateAssessmentPDF, generatePDFFilename, generatePDFQuestionFilename } from "./services/pdf/pdfService";
import { calculateCostAnalysis } from './services/costAnalysis/costAnalysisService';
import { TIMING } from './constants/timing';
import { generateAnswerTemplatePDF } from "./services/pdf/templatePdfAnswerGenerator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register AI routes
  app.use("/api/ai", aiRoutes);
  
  // Register implementation routes (for recommendation details only)
  app.use("/api/implementation", implementationRoutes);
  
  // Register knowledge routes
  app.use("/api/knowledge", knowledgeRoutes);
  app.use("/api/assessment", reviewRoutes);
  
  // ========================================
  // 公開エンドポイント (認証不要)
  // ========================================
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date(),
    });
  });
  
  // ========================================
  // セッション作成 (認証は選択的)
  // ========================================
  
  // Create organization
  app.post("/api/assessment/organization", requireValidSession, csrfProtection, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      // Log the request body for debugging
      logger.debug("Organization request body:", JSON.stringify(req.body));
      
      // Basic validation to ensure required fields are present
      const { industry, companySize, region, cloudProviders, deploymentModel, userRole } = req.body;
      
      if (!industry || !companySize || !region || !cloudProviders || !deploymentModel) {
        return res.status(400).json({ 
          message: "Validation error: Missing required fields. Required: industry, companySize, region, cloudProviders, deploymentModel" 
        });
      }
      
      // Ensure cloudProviders is an array
      if (!Array.isArray(cloudProviders) || cloudProviders.length === 0) {
        return res.status(400).json({ 
          message: "Validation error: cloudProviders must be a non-empty array" 
        });
      }
      
      // Create organization with manually validated data
      const organizationData = {
        industry,
        companySize,
        region,
        cloudProviders,
        deploymentModel,
        businessObjectives: req.body.businessObjectives || "",
        userRole: userRole || null,
      };
      
      // Pass the sessionId to the storage method
      const organization = await storage.createOrganization(organizationData, sessionId);
      res.status(201).json(organization);
    } catch (error) {
      logger.error("Error in /api/assessment/organization:", error);
      handleApiError(res, error);
    }
  });
  
  // Get current organization
  app.get("/api/assessment/organization", requireValidSession, csrfTokenGenerator, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      // First get the current assessment to find the organization ID
      const assessment = await storage.getCurrentAssessment(sessionId);
      if (!assessment) {
        return res.status(404).json({ message: "No assessment found" });
      }
      
      // If the assessment doesn't have an organization ID, return a 404 error
      if (!assessment.organizationId) {
        return res.status(404).json({ 
          message: "Organization not found",
          code: "ORGANIZATION_NOT_FOUND" 
        });
      }
      
      // Then get the organization by ID, passing the sessionId
      const organization = await storage.getOrganization(assessment.organizationId, sessionId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      res.json(organization);
    } catch (error: any) {
      handleApiError(res, error);
    }
  });

  // Get current assessment
  app.get("/api/assessment/current", requireValidSession, csrfTokenGenerator, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      let assessment = await storage.getCurrentAssessment(sessionId);
      
      // If no assessment exists, create one
      if (!assessment) {
        logger.debug(`No assessment found for session ${sessionId}, creating new assessment`);
        await storage.resetAssessment(sessionId);
        assessment = await storage.getCurrentAssessment(sessionId);
      }
      
      res.json(assessment);
    } catch (error: any) {
      handleApiError(res, error);
    }
  });
  
  // Select assessment type (quick, standard, comprehensive) - legacy endpoint
  app.post("/api/assessment/select-type", validateOptionalSession, csrfTokenGenerator, async (req, res) => {
    try {
      const schema = z.object({
        type: z.enum(["quick", "standard", "comprehensive"]),
        language: z.string().optional() // Add optional language parameter in request body
      });
      
      const { type, language } = schema.parse(req.body);
      
      // Get language from request body, accept-language header, or use 'en' as default
      const selectedLanguage = language || 
        req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 
        'en';
      
      // Get the existing session ID if available
      const existingSessionId = (req as any).sessionId;
      
      logger.info(`Client explicitly setting assessment type ${type} with language ${selectedLanguage} for session ${existingSessionId || 'new'}`);
      
      // Create a new session if we don't have one already
      let sessionId = existingSessionId;
      if (!sessionId) {
        sessionId = await storage.createSession("SHORT");
        logger.debug(`Created new session ${sessionId} for assessment type ${type}`);
        
        // Set session ID in cookie
        res.cookie('sessionId', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: TIMING.SESSION_SHORT_MS // Use the correct expiration time
        });
      } else {
        logger.debug(`Reusing existing session ${sessionId} for assessment type ${type}`);
      }
      
      // Always explicitly set the assessment type on the session
      const assessment = await storage.selectAssessmentType(type, selectedLanguage, sessionId);
      
      // ENHANCEMENT: Get all questions for each category in this assessment type
      const categories = assessment.categories || [];
      logger.debug(`Categories from assessment: ${JSON.stringify(categories)}`);
      const allQuestions: Record<string, AssessmentQuestion[]> = {};
      
      // Log assessment details to diagnose the issue
      logger.debug(`Assessment details: type=${assessment.assessmentType}, language=${assessment.language}, categoryCount=${Array.isArray(categories) ? categories.length : 0}`);
      
      // For each category, get its questions
      if (Array.isArray(categories)) {
        for (const category of categories) {
          // Ensure we have the category ID
          if (typeof category === 'object' && category.id) {
            logger.debug(`Getting questions for category ${category.id}`);
            const categoryQuestions = await storage.getQuestionsByCategory(
              category.id, 
              selectedLanguage, 
              sessionId
            );
            logger.debug(`Retrieved ${categoryQuestions.length} questions for category ${category.id}. Question IDs: ${categoryQuestions.map(q => q.id).join(', ')}`);
            allQuestions[category.id] = categoryQuestions;
          }
        }
      }
      
      // Log summary of all questions
      const totalQuestionCount = Object.values(allQuestions).reduce((sum, questions) => sum + questions.length, 0);
      const categoriesWithQuestions = Object.keys(allQuestions).length;
      logger.info(`Returning assessment with ${categoriesWithQuestions} categories containing a total of ${totalQuestionCount} questions`);
      
      // Return both assessment and session ID, plus all questions by category
      res.json({
        ...assessment,
        sessionId,
        questionsByCategory: allQuestions
      });
    } catch (error) {
      const validationError = fromZodError(error as z.ZodError);
      res.status(400).json({ message: validationError.message });
    }
  });

  // Reset assessment
  app.post("/api/assessment/reset", validateOptionalSession, csrfProtection, async (req, res) => {
    try {
      // Get the session ID from the request if available
      const sessionId = (req as any).sessionId;
      
      // Reset assessment data but maintain the same session
      await storage.resetAssessment(sessionId);
      
      // Return success but don't create a new session
      res.json({ 
        success: true,
        message: "Assessment data has been reset while maintaining the same session"
      });
    } catch (error: any) {
      logger.error("Error in reset assessment:", error);
      handleApiError(res, error);
    }
  });

  // Get questions by category
  app.get("/api/assessment/questions/:categoryId", requireValidSession, csrfTokenGenerator, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      const { categoryId } = req.params;

      // Prefer ?language=... query param, fallback to Accept-Language header, then 'en'
      let language = 'en';
      if (typeof req.query.language === 'string') {
        language = req.query.language;
      } else if (req.headers['accept-language']) {
        language = req.headers['accept-language'].split(',')[0].split('-')[0];
      }

      const questions = await storage.getQuestionsByCategory(categoryId, language, sessionId);
      res.json(questions);
    } catch (error: any) {
      handleApiError(res, error);
    }
  });

  // Save assessment responses
  app.post("/api/assessment/responses", requireValidSession, csrfProtection, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      const responsesData = req.body;
      if (!Array.isArray(responsesData)) {
        return res.status(400).json({ message: "Expected an array of responses" });
      }
      
      // Create a new array with the responses that include a questionId
      const validResponses = responsesData.filter(response => response.questionId);
      if (validResponses.length === 0) {
        return res.status(400).json({ message: "No valid responses provided" });
      }

      const savedResponses = await storage.saveAssessmentResponses(validResponses, sessionId);
      res.status(201).json(savedResponses);
    } catch (error: any) {
      handleApiError(res, error);
    }
  });

  // Get all responses for current assessment
  app.get("/api/assessment/responses", requireValidSession, csrfTokenGenerator, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      const responses = await storage.getAssessmentResponses(sessionId);
      res.json(responses);
    } catch (error: any) {
      handleApiError(res, error);
    }
  });

  // Process assessment
  app.post("/api/assessment/process", requireValidSession, csrfProtection, async (req, res) => {
    try {
      // Get the session ID from the request
      const userSessionId = (req as any).sessionId;
      
      if (!userSessionId) {
        logger.warn('No user session ID found in process assessment request');
        return res.status(400).json({ 
          message: "Session ID not found in request",
          code: "SESSION_NOT_FOUND"
        });
      }
      
      // Get language from accept-language header or use 'en' as default
      const language = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
      const { id, sessionType } = req.body;

      // Debug: Log current assessment type before processing
      const currentAssessment = await storage.getCurrentAssessment(userSessionId);
      logger.info(`Processing assessment of type: ${currentAssessment?.assessmentType || 'unknown'} for session ${userSessionId}`);

      let resultSessionId;
      
      try {
        if (id) {
          // If ID is provided, process from S3
          logger.debug(`Processing from S3 with ID ${id}`);
          await storage.processResultId(language, id);
          resultSessionId = id;
        } else {
          // Otherwise, process current in-memory data with the user session ID
          logger.debug(`Processing in-memory data for session ${userSessionId}`);
          const result = await storage.processAssessment(language, userSessionId);
          
          if (!result.success) {
            logger.error(`Failed to process assessment for session ${userSessionId}`);
            return res.status(500).json({ 
              message: "Failed to process assessment",
              code: "PROCESS_FAILED" 
            });
          }
          
          // Create a new session for this result with the provided session type
          resultSessionId = await storage.createSession(sessionType);
          logger.info(`Created new result session ${resultSessionId} for user session ${userSessionId}`);
          
          // CRITICAL FIX: Link the result session to the original user session for rate limiting
          // This ensures rate limiting works correctly across result reprocessing
          await storage.linkResultSessionToUserSession(resultSessionId, userSessionId);
        }
        
        // Get assessment and organization data for the response
        const assessment = await storage.getCurrentAssessment(userSessionId);
        
        let organization = null;
        if (assessment?.organizationId) {
          try { 
            organization = await storage.getOrganization(assessment.organizationId, userSessionId);
          } catch (orgError) {
            logger.warn(`Error retrieving organization for assessment ${assessment.id}:`, orgError);
          }
        }
        
        res.json({
          ...(organization || {}),
          sessionId: resultSessionId
        });
      } catch (processError: any) {
        logger.error(`Error in assessment processing:`, processError);
        return res.status(500).json({ 
          message: processError.message || "Failed to process assessment",
          code: "PROCESS_ERROR" 
        });
      }
    } catch (error: any) {
      logger.error(`Unexpected error in /api/assessment/process:`, error);
      handleApiError(res, error);
    }
  });

  // Get category scores
  app.get("/api/assessment/scores", requireValidSession, csrfTokenGenerator, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      const scores = await storage.getCategoryScores(sessionId);
      res.json(scores);
    } catch (error: any) {
      handleApiError(res, error);
    }
  });

  // Get critical issues based on assessment rules
  app.get("/api/assessment/critical-issues", requireValidSession, csrfTokenGenerator, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      // Get language from Accept-Language header
      const language = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
      
      // Get current assessment and organization
      const assessment = await storage.getCurrentAssessment(sessionId);
      if (!assessment) {
        return res.status(404).json({ message: "No assessment found" });
      }
      
      // Get organization data (if available)
      let organizationProfile = {};
      if (assessment.organizationId) {
        const organization = await storage.getOrganization(assessment.organizationId, sessionId);
        if (organization) {
          organizationProfile = organization;
        }
      }
      
      // Get all assessment responses
      const responses = await storage.getAssessmentResponses(sessionId);
      
      // Convert responses to the format expected by evaluateIssues
      const answers: Record<string, number> = {};
      responses.forEach(response => {
        answers[response.questionId] = response.score;
      });
      
      // Use the evaluateIssues function from issue-rules
      const { evaluateIssues } = await import('./rules/issue-rules');
      const criticalIssues = evaluateIssues(answers, organizationProfile, language);
      
      res.json(criticalIssues);
    } catch (error: any) {
      logger.error("Error generating critical issues:", error);
      handleApiError(res, error);
    }
  });

  // Get result - require and validate sessionId
  app.get("/api/assessment/results/:sessionId", requireValidSession, csrfTokenGenerator, async (req, res) => {
    try {
      // Get the user session ID from the URL parameter
      const userSessionId = req.params.sessionId;
      logger.debug(`Getting result for session ID: ${userSessionId}`);
      
      // Use the user session ID to get the result session ID
      const resultSessionId = await storage.getResult(userSessionId);
      
      if (!resultSessionId || resultSessionId.trim() === '') {
        logger.warn(`No result found for session ${userSessionId}`);
        return res.status(404).json({ 
          message: "No result found for this session", 
          code: "RESULT_NOT_FOUND" 
        });
      }
      
      // Validate the result session exists
      try {
        await storage.validateSession(resultSessionId);
        logger.debug(`Validated result session ${resultSessionId} for user session ${userSessionId}`);
      } catch (validationError) {
        // If result session doesn't exist, try to recover it
        logger.debug(`Result session ${resultSessionId} not found in memory, attempting recovery`);
        const recovered = await storage.processResultId(
          req.headers["accept-language"] as string || "en", 
          resultSessionId
        );
        
        if (!recovered.success) {
          logger.error(`Failed to recover result session ${resultSessionId}`);
          return res.status(404).json({
            message: "Assessment result no longer available",
            code: "RESULT_EXPIRED"
          });
        }
        
        logger.info(`Successfully recovered result session ${resultSessionId}`);
      }
      
      res.json(resultSessionId);
    } catch (error: any) {
      logger.error(`Error retrieving result for session ${req.params.sessionId}:`, error);
      handleApiError(res, error);
    }
  });

  // Get sessionId
  app.get("/api/assessment/session/:sessionId", requireValidSession, csrfTokenGenerator, async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const result = await storage.getSessionId(sessionId);
      res.json(result);
    } catch (error: any) {
      handleApiError(res, error);
    }
  });

  // Legacy compatibility endpoint - returns the result session ID for the current user session
  app.get("/api/assessment/results", requireValidSession, csrfTokenGenerator, async (req, res) => {
    try {
      // Get the user session ID from the request
      const userSessionId = (req as any).sessionId;
      
      if (!userSessionId) {
        logger.warn('No user session ID found in request');
        return res.status(400).json({ 
          message: "Session ID not found in request",
          code: "SESSION_NOT_FOUND"
        });
      }
      
      // Get the result session ID associated with this user session
      const resultSessionId = await storage.getResult(userSessionId);
      
      // If we have a result session ID, validate it
      if (resultSessionId && resultSessionId.trim() !== '') {
        try {
          // Make sure the result session still exists and is valid
          await storage.validateSession(resultSessionId);
          logger.debug(`Successfully validated result session ${resultSessionId}`);
          return res.json(resultSessionId);
        } catch (error) {
          // If validation fails, return 401
          logger.warn(`Result session validation failed for ${resultSessionId}:`, error);
          return res.status(401).json({ 
            message: "The result session is invalid or expired",
            code: "RESULT_SESSION_EXPIRED"
          });
        }
      }
      
      // If no result session ID was found, return 404
      logger.warn(`No result session found for user session ${userSessionId}`);
      return res.status(404).json({ 
        message: "No result found for this session", 
        code: "RESULT_NOT_FOUND" 
      });
    } catch (error: any) {
      logger.error(`Error in /api/assessment/results:`, error);
      handleApiError(res, error);
    }
  });

  // ========================================
  // AI API routes - All PROTECTED
  // ----------------------------------------
  
  // AI endpoints are now handled through the aiRoutes module registered above
  // via app.use("/api/ai", aiRoutes)

  // Add the new roadmap endpoint
  app.get("/api/roadmap", requireValidSession, csrfTokenGenerator, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      // Get current assessment organization
      const assessment = await storage.getCurrentAssessment(sessionId);
      if (!assessment || !assessment.organizationId) {
        return res.status(400).json({ message: "Assessment with organization data is required" });
      }
      
      // Get organization to determine size
      const organization = await storage.getOrganization(assessment.organizationId, sessionId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      // Map the company size to the expected format for the roadmap builder
      const sizeMap: Record<string, "xs" | "sm" | "md" | "lg"> = {
        "1-10": "xs",
        "11-50": "xs",
        "51-100": "sm",
        "101-250": "sm",
        "251-500": "md",
        "501-2000": "md",
        "2001-5000": "lg",
        "5001+": "lg"
      };
      
      // Default to medium if size is not recognized
      const orgSize = sizeMap[organization.companySize] || "md";
      
      // Get category scores
      const categoryScores = await storage.getCategoryScores(sessionId);
      if (!categoryScores || categoryScores.length === 0) {
        return res.status(400).json({ message: "Assessment must be completed first" });
      }
      
      // Get individual question responses for more precise validation
      const questionResponses = await storage.getAssessmentResponses(sessionId);
      logger.debug(`Retrieved ${questionResponses.length} individual question responses`);
      
      // Create a validation map: categoryId -> count of answered questions (score >= 0)
      const categoryQuestionCounts: Record<string, number> = {};
      questionResponses.forEach(response => {
        // Find the category for this question by checking question prefix patterns
        const questionPrefix = response.questionId.split('_')[0] + '_';
        const categoryMap: Record<string, string> = {
          'fc_': 'foundations_culture',
          'bvs_': 'business_value_strategy', 
          'aa_': 'application_architecture',
          'mod_': 'app_migration_modernization',
          'ci_': 'container_infrastructure',
          'cicd_': 'cicd_practices',
          'dora_': 'dora_metrics',
          'sc_': 'security_compliance',
          'ip_': 'infrastructure_platform',
          'dm_': 'data_management',
          'obs_': 'observability',
          'finops_': 'finops_cost_management',
          'ops_': 'operations_resilience',
          'mch_': 'multicloud_hybrid_governance',
          'aiml_': 'ai_ml_integration'
        };
        
        const categoryId = categoryMap[questionPrefix];
        if (categoryId && response.score >= 0) { // Only count actual answers, not "don't know"
          categoryQuestionCounts[categoryId] = (categoryQuestionCounts[categoryId] || 0) + 1;
        }
      });
      
      logger.debug('Category question counts:', categoryQuestionCounts);
      
      // Convert to the format expected by buildRoadmap with enhanced validation
      const scoreMap: Record<string, number> = {};
      categoryScores.forEach(score => {
        // Only include categories that have:
        // 1. Valid score >= 0 (not knowledge gaps)
        // 2. At least 1 answered question (not just theoretical)
        if (score.score >= 0 && (categoryQuestionCounts[score.categoryId] || 0) > 0) {
          scoreMap[score.categoryId] = score.score;
          logger.debug(`Including category ${score.categoryId}: score=${score.score}, answeredQuestions=${categoryQuestionCounts[score.categoryId]}`);
        } else {
          logger.debug(`Excluding category ${score.categoryId}: score=${score.score}, answeredQuestions=${categoryQuestionCounts[score.categoryId] || 0}`);
        }
      });
      
      logger.info(`Final scoreMap includes ${Object.keys(scoreMap).length} categories out of ${categoryScores.length} total`);
      
      // Build the roadmap - this returns a flat array of RoadmapItem
      const roadmapItems = buildRoadmap(
        scoreMap, 
        orgSize, 
        assessment.assessmentType,
        questionResponses.map(response => ({
          questionId: response.questionId,
          score: response.score
        }))
      );
      
      // ---------------------------------------------
      // Phase assignment (ensure ALL quick wins go to Phase 1)
      // ---------------------------------------------
      
      // Use original quick_win flags from the data without modification
      logger.debug(`Original quick wins: ${roadmapItems.filter(item => item.quick_win).length} out of ${roadmapItems.length}`);
      
      // 1) Separate quick wins and considerations-only from other items
      const quickWinItems = roadmapItems.filter(item => item.quick_win && !item.considerations_only);
      const considerationsOnlyItems = roadmapItems.filter(item => item.considerations_only);
      const regularItems = roadmapItems.filter(item => !item.quick_win && !item.considerations_only);
      
      // 2) Sort both arrays by priority (highest first)
      quickWinItems.sort((a, b) => b.priority - a.priority);
      regularItems.sort((a, b) => b.priority - a.priority);
      
      // 3) Calculate distribution for remaining items using 30/40/30 split
      const totalRegularItems = quickWinItems.length + regularItems.length;
      
      // Calculate target size for each phase
      const shortTermTarget = Math.ceil(totalRegularItems * 0.3); // 30% for short-term
      const mediumTermTarget = Math.ceil(totalRegularItems * 0.4); // 40% for medium-term
      const longTermTarget = totalRegularItems - shortTermTarget - mediumTermTarget; // Remaining ~30% for long-term
      
      // Ensure all quick wins go into short-term phase
      const shortTermNonQuickWinsNeeded = Math.max(0, shortTermTarget - quickWinItems.length);
      
      // Distribute remaining non-quick win items
      const shortTermItems = [
        ...quickWinItems, 
        ...regularItems.slice(0, shortTermNonQuickWinsNeeded)
      ];
      
      const mediumTermItems = regularItems.slice(
        shortTermNonQuickWinsNeeded, 
        shortTermNonQuickWinsNeeded + mediumTermTarget
      );
      
      const longTermItems = regularItems.slice(
        shortTermNonQuickWinsNeeded + mediumTermTarget
      );
      
      // Add considerations-only items to the short-term phase (for high visibility)
      const allShortTermItems = [...shortTermItems, ...considerationsOnlyItems];
      
      // Log the distribution
      logger.info(`Items distribution:
        - Quick wins total: ${quickWinItems.length}
        - Considerations-only: ${considerationsOnlyItems.length}
        - Short-term: ${allShortTermItems.length} (including ${quickWinItems.length} quick wins and ${considerationsOnlyItems.length} considerations-only)
        - Medium-term: ${mediumTermItems.length}
        - Long-term: ${longTermItems.length}
        - Phase targets: Short ${shortTermTarget}, Medium ${mediumTermTarget}, Long ${longTermTarget}
      `);
      
      // Import considerations map to add stretch goals
      const { considerationMap } = await import("./data/stretch-goals");
      
      // Create a properly typed recommendationsById object
      const recommendationsById: Record<string, Recommendation> = {};
      
      // Build the final roadmap with phases
      const roadmap = {
        assessmentId: assessment.id || 0,
        phases: [
          {
            index: 0,
            band: 'short' as PhaseBand,
            recommendations: allShortTermItems.map((item, idx) => {
              const rec = {
                id: item.id,
                stepRef: item.id,
                category: item.category as CategoryId,
                impactArea: item.impact_area,
                priorityRank: idx + 1,
                impactLevel: mapImpactLevel(item.impact_area),
                effortLevel: mapEffortLevel(item.effort_points),
                roiScore: item.priority,
                timeline: {
                  min: Math.max(1, Math.floor(item.duration_weeks * 0.8)),
                  max: Math.ceil(item.duration_weeks * 1.2),
                  unit: 'weeks' as const
                },
                quickWin: item.quick_win || false,
                // Include localized labels and descriptions
                label: item.label,
                description: item.description,
                // Include phase information from the original capability matrix item
                phase: item.phase
              };
              
              // Add considerations for high-maturity categories or considerations-only items
              if (item.considerations_only && considerationMap[item.category]) {
                // Get current language (using 'en' as default)
                const lang = req.headers['accept-language']?.includes('ja') ? 'ja' : 'en';
                // Add considerations from our map
                (rec as any).considerations = considerationMap[item.category][lang];
              }
              
              return rec;
            })
          },
          {
            index: 1,
            band: 'medium' as PhaseBand,
            recommendations: mediumTermItems.map((item, idx) => ({
              id: item.id,
              stepRef: item.id,
              category: item.category as CategoryId,
              impactArea: item.impact_area,
              priorityRank: allShortTermItems.length + idx + 1,
              impactLevel: mapImpactLevel(item.impact_area),
              effortLevel: mapEffortLevel(item.effort_points),
              roiScore: item.priority,
              timeline: {
                min: Math.max(1, Math.floor(item.duration_weeks * 0.8)),
                max: Math.ceil(item.duration_weeks * 1.2),
                unit: 'weeks' as const
              },
              quickWin: item.quick_win || false,
              // Include localized labels and descriptions
              label: item.label,
              description: item.description,
              // Include phase information from the original capability matrix item
              phase: item.phase
            }))
          },
          {
            index: 2,
            band: 'long' as PhaseBand,
            recommendations: longTermItems.map((item, idx) => ({
              id: item.id,
              stepRef: item.id,
              category: item.category as CategoryId,
              impactArea: item.impact_area,
              priorityRank: allShortTermItems.length + mediumTermItems.length + idx + 1,
              impactLevel: mapImpactLevel(item.impact_area),
              effortLevel: mapEffortLevel(item.effort_points),
              roiScore: item.priority,
              timeline: {
                min: Math.max(1, Math.floor(item.duration_weeks * 0.8)),
                max: Math.ceil(item.duration_weeks * 1.2),
                unit: 'weeks' as const
              },
              quickWin: item.quick_win || false,
              // Include localized labels and descriptions
              label: item.label,
              description: item.description,
              // Include phase information from the original capability matrix item
              phase: item.phase
            }))
          }
        ],
        recommendationsById
      };
      
      // Fill in the recommendationsById lookup table
      for (const phase of roadmap.phases) {
        for (const rec of phase.recommendations) {
          recommendationsById[rec.id] = rec;
        }
      }
      
      // Log final roadmap phases distribution
      logger.info(`Final roadmap phases:
        - Short-term: ${roadmap.phases[0]?.recommendations?.length || 0}
        - Medium-term: ${roadmap.phases[1]?.recommendations?.length || 0}
        - Long-term: ${roadmap.phases[2]?.recommendations?.length || 0}
      `);
      
      res.json(roadmap);
    } catch (error: any) {
      handleApiError(res, error);
    }
  });

  // Add the PDF export endpoint
  app.post("/api/assessment/export-pdf", requireValidSession, csrfProtection, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID not found" });
      }
      
      // Enhanced language detection from Accept-Language header with more logging
      const acceptLanguageHeader = req.headers['accept-language'];
      logger.debug(`PDF export - Accept-Language header: ${acceptLanguageHeader}`, { 
        sessionId, 
        headers: req.headers 
      });
      
      // More precise language detection
      let language = 'en';
      
      if (acceptLanguageHeader) {
        // Check for exact 'ja' or if it starts with 'ja-'
        if (acceptLanguageHeader === 'ja' || acceptLanguageHeader.startsWith('ja-') || acceptLanguageHeader.includes('ja')) {
          language = 'ja';
        }
      }
      
      // Support explicit language override via query parameter
      if (req.query.lang === 'ja') {
        language = 'ja';
      } else if (req.query.lang === 'en') {
        language = 'en';
      }
      
      // Get enhanced mode from query parameter (default to true for enhanced PDF)
      const enhanced = req.query.enhanced !== 'false';
      
      // Get template mode from query parameter (default to true for template-based PDF)
      const useTemplate = req.query.template !== 'false';
      
      logger.info(`Generating PDF with language: ${language}, enhanced: ${enhanced}, template: ${useTemplate}`, { sessionId });
      
      // Generate the PDF with the appropriate language
      const pdfBuffer = await generateAssessmentPDF(sessionId, language, useTemplate);
      
      // Get organization name for filename
      let orgName = 'assessment';
      try {
        const assessment = await storage.getCurrentAssessment(sessionId);
        if (assessment && assessment.organizationId) {
          const organization = await storage.getOrganization(assessment.organizationId, sessionId);
          if (organization) {
            orgName = organization.industry;
          }
        }
      } catch (error) {
        logger.warn('Error getting organization name for PDF filename, using default', error);
      }
      
      // Generate filename with language preference
      const filename = generatePDFFilename(sessionId, orgName, language);
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      
      // Proper handling of filenames with UTF-8 support
      const dateStr = new Date().toISOString().slice(0, 10);
      const asciiFallback = `Cloud-Native-Assessment-Report-${dateStr}.pdf`;
      
      // For all cases, use proper RFC 6266 format with both filename and filename*
      const encodedFilename = encodeURIComponent(filename);
      const contentDisposition = `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodedFilename}`;
      
      res.setHeader('Content-Disposition', contentDisposition);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Send PDF directly
      res.send(pdfBuffer);
    } catch (error) {
      handleApiError(res, error, "PDF_EXPORT_ERROR");
    }
  });

  // Add the cost analysis endpoint
  app.post("/api/assessment/cost-analysis", requireValidSession, csrfProtection, async (req, res) => {
    try {
      // Get the session ID from the request
      const sessionId = (req as any).sessionId;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID not found" });
      }
      
      // Get language from Accept-Language header
      const acceptLanguageHeader = req.headers['accept-language'];
      let language = 'en';
      
      if (acceptLanguageHeader && typeof acceptLanguageHeader === 'string') {
        // Extract primary language code (e.g., "ja-JP" -> "ja")
        const primaryLang = acceptLanguageHeader.split(',')[0].trim().split('-')[0].toLowerCase();
        if (primaryLang === 'ja') {
          language = 'ja';
        }
      }
      
      logger.debug('Cost analysis request', { 
        sessionId, 
        language 
      });
      
      // Verify the session exists
      const sessionResult = await storage.getSessionId(sessionId);
      
      if (!sessionResult || !sessionResult.success) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Get current assessment - must await the promise
      const assessment = await storage.getCurrentAssessment(sessionId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      // Get organization data
      let organizationData = {};
      
      if (assessment.organizationId) {
        try {
          // Get organization from the database
          const organization = await storage.getOrganization(assessment.organizationId, sessionId);
          if (organization) {
            organizationData = organization;
          }
        } catch (e) {
          logger.warn("Could not retrieve organization data, using defaults", { error: e });
        }
      } else {
        logger.warn("Assessment doesn't have an organization ID, using defaults");
      }
      
      // Set the currency based on language
      // This ensures formatCurrency uses the right format when language is Japanese
      if (language === 'ja') {
        organizationData = {
          ...organizationData,
          currency: 'JPY'
        };
        logger.debug('Setting currency to JPY for Japanese language', { language });
      }
      
      // Get category scores - must await the promise
      const categoryScores = await storage.getCategoryScores(sessionId);
      
      // Calculate cost analysis
      const costAnalysis = calculateCostAnalysis(organizationData, categoryScores, language);
      
      logger.info('Cost analysis calculated successfully', { 
        sessionId,
        totalSavings: costAnalysis.costSavings.total,
        quickWinsCount: costAnalysis.quickWins.length
      });
      
      // Return the cost analysis
      return res.json(costAnalysis);
    } catch (error) {
      logger.error("Error in /api/assessment/cost-analysis:", error);
      return res.status(500).json({ message: "Error calculating cost analysis" });
    }
  });

  app.post(
    "/api/assessment/export-pdf-review",
    requireValidSession,
    csrfProtection,
    async (req, res) => {
      try {
        // Get the session ID from the request
        const sessionId = (req as any).sessionId;

        if (!sessionId) {
          return res.status(400).json({ message: "Session ID not found" });
        }

        // Enhanced language detection from Accept-Language header with more logging
        const acceptLanguageHeader = req.headers["accept-language"];

        // More precise language detection
        let language = "en";

        if (acceptLanguageHeader) {
          // Check for exact 'ja' or if it starts with 'ja-'
          if (
            acceptLanguageHeader === "ja" ||
            acceptLanguageHeader.startsWith("ja-") ||
            acceptLanguageHeader.includes("ja")
          ) {
            language = "ja";
          }
        }

        // Support explicit language override via query parameter
        if (req.query.lang === "ja") {
          language = "ja";
        } else if (req.query.lang === "en") {
          language = "en";
        }
        const assessment = await storage.getCurrentAssessment(sessionId);
        if (!assessment) {
          return res.status(404).json({ message: "No assessment found" });
        }

        logger.debug(`Assessment type: ${assessment.assessmentType}`);

        // Get category scores to determine which categories are valid for this assessment type
        const categoryScores = await storage.getCategoryScores(sessionId);
        const validCategoryIds = categoryScores.map((score) => score.categoryId);
        logger.debug(`Valid categories from scores for ${assessment.assessmentType} assessment:`, validCategoryIds);

        // Get all responses for this session
        const responses = await storage.getAssessmentResponses(sessionId);
        logger.debug(`Found ${responses.length} responses`);

        // Create a map of responses by question ID for quick lookup
        const responseMap = new Map(responses.map((r) => [r.questionId, r]));

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
            }).filter(q => q !== null);
            
            if (reviewQuestions.length > 0) {
              reviewCategories.push({
                categoryId,
                questions: reviewQuestions,
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
          answeredQuestions,
        };
        
        // Generate the PDF with the appropriate language
        const pdfBuffer = await generateAnswerTemplatePDF({
          assessmentResponse: reviewData,
          sessionId,
          language,
        });

        // Generate filename with language preference
        const filename = generatePDFQuestionFilename(language);

        // Set headers for PDF download
        res.setHeader("Content-Type", "application/pdf");

        // Proper handling of filenames with UTF-8 support
        const dateStr = new Date().toISOString().slice(0, 10);
        const asciiFallback = `Cloud-Native-Assessment-Report-${dateStr}.pdf`;

        // For all cases, use proper RFC 6266 format with both filename and filename*
        const encodedFilename = encodeURIComponent(filename);
        const contentDisposition = `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodedFilename}`;

        res.setHeader("Content-Disposition", contentDisposition);
        res.setHeader("Content-Length", pdfBuffer.length);

        // Send PDF directly
        res.send(pdfBuffer);
      } catch (error) {
        handleApiError(res, error, "PDF_EXPORT_ERROR");
      }
    }
  );

  // Feedback submission endpoint
  app.post("/api/feedback", requireValidSession, csrfProtection, async (req, res) => {
    try {
      logger.debug("Received feedback submission", { 
        rating: req.body.rating,
        hasEmail: !!req.body.email,
        resultId: req.body.resultId 
      });

      // Add metadata from request headers
      const userAgent = req.headers['user-agent'];
      const rawIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || 'unknown';
      
      // Import sanitization service
      const { validateAndSanitizeFeedback, sanitizeIpAddress } = await import('./utils/sanitization');
      
      // Prepare raw data with metadata
      const rawFeedbackData = {
        ...req.body,
        userAgent,
        ip: sanitizeIpAddress(rawIp)
      };

      // Validate and sanitize all input data
      const validationResult = validateAndSanitizeFeedback(rawFeedbackData);
      
      if (!validationResult.success) {
        logger.warn("Feedback validation failed", { 
          errors: validationResult.errors 
        });
        return res.status(400).json({ 
          message: "Invalid input data",
          errors: validationResult.errors 
        });
      }

      // Save the validated and sanitized feedback
      const result = await storage.saveFeedback(validationResult.data!);
      
      if (result.success) {
        logger.info("Feedback saved successfully", { 
          feedbackId: result.feedbackId,
          rating: validationResult.data!.rating 
        });
        
        return res.json({ 
          message: "Feedback submitted successfully",
          feedbackId: result.feedbackId 
        });
      } else {
        logger.error("Failed to save feedback", { error: result.error });
        return res.status(500).json({ 
          message: result.error || "Failed to save feedback" 
        });
      }
    } catch (error) {
      logger.error("Error processing feedback:", error);
      return res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Utility functions for roadmap building
function mapImpactLevel(impactArea: string): 'Low' | 'Medium' | 'High' {
  const impactMap: Record<string, 'Low' | 'Medium' | 'High'> = {
    // Higher weights = higher impact
    'DP': 'High',    // Developer Productivity
    'TM': 'High',    // Time to Market
    'IM': 'Medium',  // Incident Management
    'OE': 'Medium',  // Operational Efficiency
    'IC': 'Low'      // Infrastructure Cost
  };
  return impactMap[impactArea] || 'Medium';
}

function mapEffortLevel(effortPoints: number): 'Low' | 'Medium' | 'High' {
  if (effortPoints <= 2) return 'Low';
  if (effortPoints <= 5) return 'Medium';
  return 'High';
}