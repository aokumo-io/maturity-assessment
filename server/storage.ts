import {
  users,
  type User,
  type InsertUser,
  type Organization,
  type InsertOrganization,
  type Assessment,
  type AssessmentQuestion,
  type AssessmentResponse,
  type InsertAssessmentResponse,
  type CategoryScore,
  type ImplementationRecommendation,
  type FeedbackData
} from "@shared/schema";
import { ASSESSMENT_CATEGORIES, MATURITY_LEVELS } from "../client/src/lib/constants";
import { logger } from './utils/logger';
import { questionBank } from "./questions/index.js";
import { evaluateCriticalIssues, limitIssuesPerCategory } from "./rules/rule-evaluation-service";
import path from "path";
import { fileURLToPath } from 'url';
import { issueRules } from "./rules/issue-rules";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { randomUUID } from "crypto"; // Use Node.js native crypto for more secure UUIDs
import { SESSION_CONFIG } from "./config";
import { TIMING } from "./constants/timing";
import { RateLimitChecker, RateLimitUpdater } from './services/rate-limit-service';

// Add this near the top of the file to create an equivalent to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample questions for the assessment based on the comprehensive mindmap structure
const sampleQuestions: Record<string, AssessmentQuestion[]> = questionBank;

const s3 = new S3Client({
  region: process.env.AWS_REGION!, // e.g., 'us-east-1'
});

// Define session type
export type SessionType = 'SHORT' | 'MEDIUM' | 'LONG';

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods (existing)
  getUser(id: number, sessionId?: string): Promise<User | undefined>;
  getUserByUsername(username: string, sessionId?: string): Promise<User | undefined>;
  createUser(user: InsertUser, sessionId?: string): Promise<User>;

  // Organization methods
  createOrganization(organization: any, sessionId?: string): Promise<Organization>;
  getOrganization(id: number, sessionId?: string): Promise<Organization | undefined>;

  // Assessment methods
  getCurrentAssessment(sessionId?: string): Promise<Assessment | undefined>;
  selectAssessmentType(type: "quick" | "standard" | "comprehensive", language?: string, sessionId?: string): Promise<Assessment>;
  getQuestionsByCategory(categoryId: string, language?: string, sessionId?: string): Promise<AssessmentQuestion[]>;
  saveAssessmentResponses(responses: InsertAssessmentResponse[], sessionId?: string): Promise<AssessmentResponse[]>;
  getAssessmentResponses(sessionId?: string): Promise<AssessmentResponse[]>;
  processAssessment(language?: string, sessionId?: string): Promise<{ success: boolean; resultId?: string }>;
  getCategoryScores(sessionId?: string): Promise<CategoryScore[]>;
  resetAssessment(sessionId?: string): Promise<{ success: boolean }>;
  getResult(sessionId?: string): Promise<string>;
  processResultId(language: string, resultId: string): Promise<{ success: boolean }>;
  
  // Executive Summary methods
  saveExecutiveSummary(executiveSummary: string, sessionId?: string): Promise<void>;
  getExecutiveSummary(sessionId?: string): Promise<string | null>;
  
  // Executive Summary generation tracking methods
  getExecutiveSummaryGenerationCount(sessionId?: string): Promise<number>;
  incrementExecutiveSummaryGenerationCount(sessionId?: string): Promise<number>;
  canGenerateExecutiveSummary(sessionId?: string): Promise<boolean>;
  getOriginalSessionId(sessionId?: string): Promise<string | null>;
  
  // Result session linking for rate limiting
  linkResultSessionToUserSession(resultSessionId: string, userSessionId: string): Promise<void>;
  
  // New session-related methods
  createSession(sessionType?: SessionType): Promise<string>; // Returns a session ID
  validateSession(sessionId: string): Promise<boolean>; // Validate session exists and isn't expired
  getExpiredSessionIds(): Promise<string[]>; // Get list of expired session IDs for cleanup
  getSessionId(sessionId: string): Promise<{ success: boolean }>; // Check if session ID is valid

  /**
   * フィードバックデータをS3に保存
   * 
   * @param feedbackData - 保存するフィードバックデータ
   * @returns 成功の可否とフィードバックID
   */
  saveFeedback(feedbackData: FeedbackData): Promise<{ success: boolean; feedbackId?: string; error?: string }>;
}

interface SessionData {
  users: Map<number, User>;
  organizations: Map<number, Organization>;
  assessments: Map<number, Assessment>;
  responses: AssessmentResponse[];
  categoryScores: CategoryScore[];
  recommendations: ImplementationRecommendation[];

  currentId: number;
  currentOrgId: number;
  currentAssessmentId: number;
  currentResponseId: number;

  result: string;
  originalSessionId?: string; // Track the original user session ID that created this result
  executiveSummary?: string; // Cache for AI-generated executive summary
  executiveSummaryGenerations: number; // Track number of executive summary generations
  
  // Add timestamps for security and lifecycle management
  createdAt: Date;
  expiresAt: Date;
  lastAccessedAt: Date;
}

export class MemStorage implements IStorage, RateLimitChecker, RateLimitUpdater {
  private users: Map<number, User>;
  private organizations: Map<number, Organization>;
  private assessments: Map<number, Assessment>;
  private responses: AssessmentResponse[];
  private categoryScores: CategoryScore[];
  private recommendations: ImplementationRecommendation[];

  private currentId: number;
  private currentOrgId: number;
  private currentAssessmentId: number;
  private currentResponseId: number;

  private result: string;

  private sessions: Map<string, SessionData>;

  constructor() {
    this.users = new Map();
    this.organizations = new Map();
    this.assessments = new Map();
    this.responses = [];
    this.categoryScores = [];
    this.recommendations = [];

    this.currentId = 1;
    this.currentOrgId = 1;
    this.currentAssessmentId = 1;
    this.currentResponseId = 1;
    this.result = '';
    this.sessions = new Map<string, SessionData>();
    // Create assessments for all three types (but we'll only use one at a time)
    this.createSampleAssessment("comprehensive");
    
    // Set up session cleanup interval (every hour)
    setInterval(() => this.cleanupExpiredSessions(), TIMING.CLEANUP_INTERVAL_MS);
  }

  // Helper method to clean up expired sessions
  private async cleanupExpiredSessions(): Promise<number> {
    const now = new Date();
    let cleanedCount = 0;
    
    // Convert Map entries to array first to avoid iterator issues
    const sessionEntries = Array.from(this.sessions.entries());
    
    for (const [sessionId, session] of sessionEntries) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }
    
    logger.info(`Cleaned up ${cleanedCount} expired sessions`);
    return cleanedCount;
  }

  // User methods (existing)
  async getUser(id: number, sessionId?: string): Promise<User | undefined> {
    if (sessionId) {
      try {
        const { users } = await this.getSessionData(sessionId);
        return users.get(id);
      } catch (error) {
        logger.error(`Error getting user with ID ${id} from session ${sessionId}:`, error);
        return undefined;
      }
    }
    
    // Fall back to global state if no sessionId provided
    return this.users.get(id);
  }

  async getUserByUsername(username: string, sessionId?: string): Promise<User | undefined> {
    if (sessionId) {
      try {
        const { users } = await this.getSessionData(sessionId);
        return Array.from(users.values()).find(
          (user) => user.username === username
        );
      } catch (error) {
        logger.error(`Error getting user with username ${username} from session ${sessionId}:`, error);
        return undefined;
      }
    }
    
    // Fall back to global state if no sessionId provided
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser, sessionId?: string): Promise<User> {
    if (sessionId) {
      try {
        // Get session data
        const sessionData = await this.getSessionData(sessionId);
        
        // Create user with session-specific ID counter
        const id = sessionData.currentId++;
        const user: User = { ...insertUser, id };
        
        // Update session's users map and currentId counter
        const updatedUsers = new Map(sessionData.users);
        updatedUsers.set(id, user);
        
        await this.updateSessionData(sessionId, {
          users: updatedUsers,
          currentId: sessionData.currentId
        });
        
        logger.debug(`Created user with ID ${id} in session ${sessionId}`);
        return user;
      } catch (error) {
        logger.error(`Error creating user in session ${sessionId}:`, error);
        throw error;
      }
    }
    
    // Fall back to global state if no sessionId provided
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Organization methods
  async createOrganization(insertOrganization: any, sessionId?: string): Promise<Organization> {
    if (sessionId) {
      try {
        // Get session data
        const sessionData = await this.getSessionData(sessionId);
        
        // Create organization with session-specific ID counter
        const id = sessionData.currentOrgId++;
        const createdAt = new Date();
        const organization: Organization = {
          ...insertOrganization,
          id,
          createdAt,
          // Ensure userRole is string | null
          userRole: insertOrganization.userRole || null,
          businessObjectives: insertOrganization.businessObjectives || null
        };
        
        // Update session's organizations map and currentOrgId counter
        const updatedOrgs = new Map(sessionData.organizations);
        updatedOrgs.set(id, organization);
        
        await this.updateSessionData(sessionId, {
          organizations: updatedOrgs,
          currentOrgId: sessionData.currentOrgId
        });
        
        // Link the organization to the current assessment in this session
        const assessment = await this.getCurrentAssessment(sessionId);
        if (assessment) {
          const updatedAssessment = { ...assessment, organizationId: id };
          const updatedAssessments = new Map(sessionData.assessments);
          updatedAssessments.set(updatedAssessment.id, updatedAssessment);
          
          await this.updateSessionData(sessionId, {
            assessments: updatedAssessments
          });
        }
        
        logger.debug(`Created organization with ID ${id} in session ${sessionId}`);
        return organization;
      } catch (error) {
        logger.error(`Error creating organization in session ${sessionId}:`, error);
        throw error;
      }
    }
    
    // Fall back to global state if no sessionId provided
    const id = this.currentOrgId++;
    const createdAt = new Date();
    const organization: Organization = {
      ...insertOrganization,
      id,
      createdAt,
      // Ensure userRole is string | null
      userRole: insertOrganization.userRole || null,
      businessObjectives: insertOrganization.businessObjectives || null
    };
    this.organizations.set(id, organization);

    // Link the organization to the current assessment
    const assessment = await this.getCurrentAssessment();
    if (assessment) {
      const updatedAssessment = { ...assessment, organizationId: id };
      this.assessments.set(updatedAssessment.id, updatedAssessment);
    }

    return organization;
  }

  async getOrganization(id: number, sessionId?: string): Promise<Organization | undefined> {
    if (sessionId) {
      try {
        const { organizations } = await this.getSessionData(sessionId);
        return organizations.get(id);
      } catch (error) {
        logger.error(`Error getting organization with ID ${id} from session ${sessionId}:`, error);
        return undefined;
      }
    }
    
    // Fall back to global state if no sessionId provided
    return this.organizations.get(id);
  }

  // Create a sample assessment with categories and questions
  private createSampleAssessment(assessmentType: string = "comprehensive", language: string = "en") {
    // This determines which categories to include based on assessment type
    const allCategories = ASSESSMENT_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.title,
      description: cat.description
    }));

    // Get the categories to include based on assessment type
    const categoriesToInclude = this.getCategoriesForAssessmentType(assessmentType);

    // Filter categories to only include those for this assessment type
    const categories = allCategories.filter(cat => categoriesToInclude.includes(cat.id));

    // Get questions for the selected categories
    let relevantQuestions: AssessmentQuestion[] = [];
    categoriesToInclude.forEach(categoryId => {
      if (sampleQuestions[categoryId]) {
        // Use base questions from sampleQuestions but we'll translate text and options later when requested
        relevantQuestions.push(...sampleQuestions[categoryId]);
      }
    });

    // Title and description based on assessment type
    let title = "Cloud Native Maturity Assessment";
    let description = "Evaluate your organization's cloud native maturity";

    switch (assessmentType) {
      case "quick":
        title = "Quick Cloud Native Maturity Assessment";
        description = "Quickly evaluate your organization's cloud native maturity across 4 core areas";
        break;
      case "standard":
        title = "Standard Cloud Native Maturity Assessment";
        description = "Evaluate your organization's cloud native maturity across 7 key areas";
        break;
      case "comprehensive":
        title = "Comprehensive Cloud Native Maturity Assessment";
        description = "In-depth evaluation of your organization's cloud native maturity across all 15 key areas";
        break;
    }

    const assessment: Assessment = {
      id: this.currentAssessmentId++,
      organizationId: null,
      title,
      description,
      assessmentType,
      completedAt: null,
      createdAt: new Date(),
      categories: categories.filter(cat => categoriesToInclude.includes(cat.id)),
      questions: relevantQuestions,
      language // Store the selected language in the assessment object
    };

    this.assessments.set(assessment.id, assessment);
  }

  // Assessment methods
  async getCurrentAssessment(sessionId?: string): Promise<Assessment | undefined> {
    if (sessionId) {
      try {
        const { assessments } = await this.getSessionData(sessionId);
        const assessment = Array.from(assessments.values())[0];
        
        if (assessment) {
          logger.debug(`getCurrentAssessment (session ${sessionId}): assessment.language=${assessment.language}`);
        } else {
          logger.debug(`No assessment found in session ${sessionId}`);
        }
        
        return assessment;
      } catch (error) {
        logger.error(`Error getting current assessment from session ${sessionId}:`, error);
        return undefined;
      }
    }
    
    // Fall back to global state if no sessionId provided
    const assessment = Array.from(this.assessments.values())[0];
    if (assessment) {
      logger.debug(`getCurrentAssessment (global): assessment.language=${assessment.language}`);
    }
    return assessment;
  }

  async selectAssessmentType(type: "quick" | "standard" | "comprehensive", language: string = "en", sessionId?: string): Promise<Assessment> {
    if (sessionId) {
      try {
        // Get session data
        const sessionData = await this.getSessionData(sessionId);
        
        // Clear existing assessments and responses in this session
        await this.updateSessionData(sessionId, {
          assessments: new Map(),
          responses: [],
          categoryScores: [],
          recommendations: []
        });
        
        logger.debug(`selectAssessmentType called with type=${type}, language=${language}, sessionId=${sessionId}`);
        
        // Create a new assessment with the selected type for this session
        const assessmentId = sessionData.currentAssessmentId++;
        const newAssessment = this.createAssessmentObject(type, assessmentId, language);
        
        // Update session with the new assessment
        const updatedAssessments = new Map();
        updatedAssessments.set(assessmentId, newAssessment);
        
        await this.updateSessionData(sessionId, {
          assessments: updatedAssessments,
          currentAssessmentId: sessionData.currentAssessmentId
        });
        
        logger.debug(`Created ${type} assessment with ID ${assessmentId} for session ${sessionId}`);
        return newAssessment;
      } catch (error) {
        logger.error(`Error selecting assessment type for session ${sessionId}:`, error);
        throw error;
      }
    }
    
    // Fall back to global state if no sessionId provided
    // Clear existing assessments and responses
    this.assessments.clear();
    this.responses = [];
    this.categoryScores = [];
    this.recommendations = [];

    logger.debug(`selectAssessmentType called with type=${type}, language=${language} (global)`);

    // Create a new assessment with the selected type
    this.createSampleAssessment(type, language);

    // Return the newly created assessment
    return Array.from(this.assessments.values())[0];
  }

  async getQuestionsByCategory(categoryId: string, language: string = "en", sessionId?: string): Promise<AssessmentQuestion[]> {
    // Pass the sessionId parameter to ensure we're working with the correct session's assessment
    const assessment = await this.getCurrentAssessment(sessionId);
    if (!assessment) return [];

    logger.debug(`===== QUESTION SOURCE DEBUGGING =====`);
    logger.debug(`Request for category: ${categoryId}, sessionId: ${sessionId || 'none'}`);
    logger.debug(`Assessment type: ${assessment.assessmentType}`);
    logger.debug(`Requested language: ${language}`);
    logger.debug(`Assessment language: ${assessment.language || 'not set'}`);
    logger.debug(`Language priority: explicit request > assessment language > default (en)`);

    // Check if this category should be included based on the assessment type
    const assessmentType = assessment.assessmentType;
    const categoriesToInclude = this.getCategoriesForAssessmentType(assessmentType);

    // If the category is not included in the current assessment type, return empty array
    if (!categoriesToInclude.includes(categoryId)) {
      logger.debug(`Category ${categoryId} is not included in assessment type ${assessmentType}`);
      return [];
    }

    // Prioritize explicitly requested language parameter, then fall back to assessment language
    // This allows switching languages mid-assessment while maintaining consistency
    const preferredLanguage = language || assessment.language || "en";

    logger.debug(`Fetching questions for category: ${categoryId}, using language: ${preferredLanguage}`);

    // Get all responses to check dependencies
    const allResponses = await this.getAssessmentResponses(sessionId);

    // Get base questions from the assessment
    const filteredQuestions = (assessment.questions as AssessmentQuestion[]).filter(
      (q: AssessmentQuestion) => q.category === categoryId
    );

    // Use base questions from sampleQuestions if not found in assessment
    let baseQuestions = filteredQuestions.length > 0
      ? filteredQuestions
      : (sampleQuestions[categoryId] || []);

    logger.debug(`Found ${baseQuestions.length} questions for category ${categoryId}`);
    logger.debug(`Question IDs found: ${baseQuestions.map(q => q.id).join(', ')}`);

    // Log baseQuestion values for debugging
    baseQuestions.forEach(q => {
      logger.debug(`Question ${q.id}: baseQuestion=${q.baseQuestion}, assessmentType=${q.assessmentType}, maturityLevel=${q.maturityLevel}`);
    });

    // Filter questions based on:
    // 1. Assessment type
    // 2. Dependencies (check previous responses)
    logger.debug(`Filtering questions for assessment type: ${assessmentType}`);
    const filteredByAssessmentAndDeps = baseQuestions.filter(question => {
      // Filter by assessment type if specified
      if (question.assessmentType) {
        if (assessmentType === 'quick' && question.assessmentType !== 'quick') {
          logger.debug(`Question ${question.id} filtered out: assessment type ${question.assessmentType} != 'quick'`);
          return false;
        }
        if (assessmentType === 'standard' &&
          question.assessmentType === 'comprehensive') {
          logger.debug(`Question ${question.id} filtered out: assessment type ${question.assessmentType} = 'comprehensive'`);
          return false;
        }
      }

      // Check dependencies
      if (question.dependencies && question.dependencies.length > 0) {
        const dependenciesSatisfied = question.dependencies.every(dependency => {
          const dependencyQuestionExists = baseQuestions.some(
            q => q.id === dependency.questionId
          );
          if (!dependencyQuestionExists) {
            logger.debug(`Question ${question.id} filtered out: dependency question ${dependency.questionId} does not exist in baseQuestions`);
            return false;
          }
          return true;
        });

        if (!dependenciesSatisfied) {
          return false;
        }
      }

      // Include if no dependencies or all dependencies satisfied
      logger.debug(`Question ${question.id} passed assessment type and dependency filters`);
      return true;
    });

    logger.debug(`After assessment type and dependency filters: ${filteredByAssessmentAndDeps.length} questions remain`);
    logger.debug(`Remaining question IDs: ${filteredByAssessmentAndDeps.map(q => q.id).join(', ')}`);

    // Sort questions by:
    // 1. Base questions first (if baseQuestion = true)
    // 2. Then by maturity level (beginner, intermediate, advanced)
    // 3. Then by id to ensure stable ordering
    const sortedQuestions = [...filteredByAssessmentAndDeps].sort((a, b) => {
      // Base questions always come first
      if (a.baseQuestion && !b.baseQuestion) return -1;
      if (!a.baseQuestion && b.baseQuestion) return 1;

      // Then sort by maturity level
      const maturityOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      const aLevel = a.maturityLevel || 'beginner';
      const bLevel = b.maturityLevel || 'beginner';

      if (maturityOrder[aLevel] !== maturityOrder[bLevel]) {
        return maturityOrder[aLevel] - maturityOrder[bLevel];
      }

      // Finally sort by id for stable ordering
      return a.id.localeCompare(b.id);
    });

    logger.debug(`After sorting: ${sortedQuestions.length} questions in sorted order`);
    logger.debug(`Sorted question IDs: ${sortedQuestions.map(q => q.id).join(', ')}`);

    // Apply limits based on assessment type while avoiding duplicates
    let limitedQuestions;
    if (assessmentType === 'quick') {
      // Quick assessment: only include base questions, up to 4
      limitedQuestions = sortedQuestions.filter(q => q.baseQuestion === true).slice(0, 4);
      logger.debug(`For 'quick' assessment: selected ${limitedQuestions.length} base questions`);
    } else if (assessmentType === 'standard') {
      // Standard assessment: get up to 8 questions total, prioritizing base questions
      const baseQuestions = sortedQuestions.filter(q => q.baseQuestion === true).slice(0, 4);

      // For intermediate questions, exclude any IDs already in base questions
      const baseQuestionIds = new Set(baseQuestions.map(q => q.id));
      const intermediateQuestions = sortedQuestions
        .filter(q => q.maturityLevel === 'intermediate' && !baseQuestionIds.has(q.id))
        .slice(0, 4);

      limitedQuestions = [...baseQuestions, ...intermediateQuestions];

      // If we don't have enough questions, add more from the sorted list that we haven't included yet
      if (limitedQuestions.length < 8) {
        const existingIds = new Set(limitedQuestions.map(q => q.id));
        const additionalQuestions = sortedQuestions
          .filter(q => !existingIds.has(q.id))
          .slice(0, 8 - limitedQuestions.length);

        limitedQuestions = [...limitedQuestions, ...additionalQuestions];
      }

      logger.debug(`For 'standard' assessment: ${baseQuestions.length} base + ${intermediateQuestions.length} intermediate + ${limitedQuestions.length - baseQuestions.length - intermediateQuestions.length} additional questions`);
    } else {
      // Comprehensive assessment: max 15 questions
      limitedQuestions = sortedQuestions.slice(0, 15);
      logger.debug(`For 'comprehensive' assessment: taking first ${limitedQuestions.length} questions`);
    }

    logger.debug(`After applying assessment type limits: ${limitedQuestions.length} questions remain`);
    logger.debug(`Final question IDs: ${limitedQuestions.map(q => q.id).join(', ')}`);

    // Default language if requested language not available
    const fallbackLanguage = "en";

    // Process questions for the client
    const processedQuestions = limitedQuestions.map(question => {
      // Deep clone to avoid modifying original
      const processedQuestion = JSON.parse(JSON.stringify(question));

      // Handle multilingual text
      if (typeof processedQuestion.text === 'object') {
        // Use requested language or fall back to English
        processedQuestion.text =
          processedQuestion.text[preferredLanguage] ||
          processedQuestion.text[fallbackLanguage] ||
          `[Missing text for ${question.id}]`;
      }

      // Handle multilingual options
      if (Array.isArray(processedQuestion.options)) {
        processedQuestion.options = processedQuestion.options.map((option: any) => {
          const processedOption = { ...option };

          // Handle multilingual label
          if (typeof processedOption.label === 'object') {
            processedOption.label =
              processedOption.label[preferredLanguage] ||
              processedOption.label[fallbackLanguage] ||
              `[Missing label for option ${option.value}]`;
          }

          // Handle multilingual description if present
          if (processedOption.description && typeof processedOption.description === 'object') {
            processedOption.description =
              processedOption.description[preferredLanguage] ||
              processedOption.description[fallbackLanguage] ||
              '';
          }

          return processedOption;
        });
      }

      // Extract knowledge resources for the selected language
      if (processedQuestion.hasKnowledgeResource && processedQuestion.knowledge) {
        // Multilingual knowledge resources
        const languageKnowledge =
          processedQuestion.knowledge[preferredLanguage] ||
          processedQuestion.knowledge[fallbackLanguage];

        if (languageKnowledge) {
          // Format knowledge for client 
          processedQuestion.knowledgeSummary = languageKnowledge.summary;

          // Convert links array to legacy URLs if needed
          if (languageKnowledge.links && languageKnowledge.links.length > 0) {
            // Use the first link as the main resource
            processedQuestion.knowledgeResourceUrl = languageKnowledge.links[0].url;

            // Map additional links to legacy URLs if appropriate
            for (const link of languageKnowledge.links) {
              if (link.text.toLowerCase().includes('official') ||
                link.text.toLowerCase().includes('documentation')) {
                processedQuestion.officialDocUrl = link.url;
              } else if (link.text.toLowerCase().includes('tutorial')) {
                processedQuestion.tutorialUrl = link.url;
              }
            }
          }
        }

        // Remove original multilingual knowledge object to reduce payload size
        delete processedQuestion.knowledge;
      }

      return processedQuestion;
    });

    logger.info(`Returning ${processedQuestions.length} fully processed questions for category ${categoryId}`);

    return processedQuestions;
  }

  // Helper method to get categories for a specific assessment type
  private getCategoriesForAssessmentType(assessmentType: string): string[] {
    switch (assessmentType) {
      case "quick":
        return [
          "foundations_culture",
          "business_value_strategy",
          "application_architecture",
          "cicd_practices",
          "security_compliance"
        ];

      case "standard":
        return [
          "foundations_culture",
          "business_value_strategy",
          "application_architecture",
          "app_migration_modernization",
          "container_infrastructure",
          "cicd_practices",
          "dora_metrics",
          "security_compliance",
          "observability",
          "finops_cost_management"
        ];

      case "comprehensive":
      default:
        return [
          "foundations_culture",
          "business_value_strategy",
          "application_architecture",
          "app_migration_modernization",
          "container_infrastructure",
          "cicd_practices",
          "dora_metrics",
          "security_compliance",
          "infrastructure_platform",
          "data_management",
          "observability",
          "finops_cost_management",
          "operations_resilience",
          "multicloud_hybrid_governance",
          "ai_ml_integration"
        ];
    }
  }

  async saveAssessmentResponses(insertResponses: InsertAssessmentResponse[], sessionId?: string): Promise<AssessmentResponse[]> {
    if (sessionId) {
      try {
        // Get session data
        const sessionData = await this.getSessionData(sessionId);
        const assessment = await this.getCurrentAssessment(sessionId);
        
        if (!assessment) {
          throw new Error(`No active assessment found for session ${sessionId}`);
        }
        
        // Create new responses with session-specific ID counter
        const newResponses: AssessmentResponse[] = insertResponses.map(response => {
          const id = sessionData.currentResponseId++;
          return {
            ...response,
            id,
            assessmentId: assessment.id,
            createdAt: new Date(),
            // Ensure dontKnow is set properly for the database
            dontKnow: response.dontKnow === true ? true : null
          };
        });
        
        // Add new responses, replacing any existing ones with the same questionId
        const updatedResponses = [
          ...sessionData.responses.filter(r => !newResponses.some(nr => nr.questionId === r.questionId)),
          ...newResponses
        ];
        
        // Update session data
        await this.updateSessionData(sessionId, {
          responses: updatedResponses,
          currentResponseId: sessionData.currentResponseId
        });
        
        logger.debug(`Saved ${newResponses.length} responses for session ${sessionId}`);
        return newResponses;
      } catch (error) {
        logger.error(`Error saving assessment responses for session ${sessionId}:`, error);
        throw error;
      }
    }
    
    // Fall back to global state if no sessionId provided
    const assessment = await this.getCurrentAssessment();
    if (!assessment) throw new Error("No active assessment found");

    const newResponses: AssessmentResponse[] = insertResponses.map(response => {
      const id = this.currentResponseId++;
      return {
        ...response,
        id,
        assessmentId: assessment.id,
        createdAt: new Date(),
        // Ensure dontKnow is set properly for the database
        dontKnow: response.dontKnow === true ? true : null
      };
    });

    // Add new responses, replacing any existing ones with the same questionId
    this.responses = [
      ...this.responses.filter(r => !newResponses.some(nr => nr.questionId === r.questionId)),
      ...newResponses
    ];

    return newResponses;
  }

  async getAssessmentResponses(sessionId?: string): Promise<AssessmentResponse[]> {
    if (sessionId) {
      try {
        const { responses } = await this.getSessionData(sessionId);
        if (!responses || responses.length === 0) {
          logger.debug(`No assessment responses found for session ${sessionId}`);
        }
        return responses;
      } catch (error) {
        logger.error(`Error getting assessment responses for session ${sessionId}:`, error);
        return [];
      }
    }
    
    // Fall back to global state if no sessionId provided
    return this.responses;
  }

  async processAssessment(language: string = "en", sessionId?: string): Promise<{ success: boolean; resultId?: string }> {
    try {
      logger.debug(`Processing assessment with language: ${language}${sessionId ? ` for session ${sessionId}` : ' (global)'}`);
      
      // Get assessment and data from the proper session or global state
      const assessment = await this.getCurrentAssessment(sessionId);
      if (!assessment) {
        throw new Error(`No active assessment found${sessionId ? ` for session ${sessionId}` : ''}`);
      }
      
      const sessionData = sessionId ? await this.getSessionData(sessionId) : null;
      const responses = sessionId ? sessionData!.responses : this.responses;

    // Calculate category scores
    const responsesByCategoryId: Record<string, number[]> = {};
    const totalResponsesByCategory: Record<string, number> = {};
    const dontKnowResponsesByCategory: Record<string, number> = {};

    // Get categories for this assessment type
    const categoriesToInclude = this.getCategoriesForAssessmentType(assessment.assessmentType);
    logger.debug("Categories to include for assessment type", { 
      assessmentType: assessment.assessmentType, 
      categories: categoriesToInclude 
    });

    // Initialize only categories that are included in this assessment type
    ASSESSMENT_CATEGORIES.forEach(cat => {
      if (categoriesToInclude.includes(cat.id)) {
        responsesByCategoryId[cat.id] = [];
        totalResponsesByCategory[cat.id] = 0;
        dontKnowResponsesByCategory[cat.id] = 0;
      }
    });

    // Log all responses for debugging
      logger.debug(`All responses (${responses.length})`, JSON.stringify(responses));

    // Group responses by category
      responses.forEach(response => {
      // First try to find in assessment.questions
      let question = (assessment.questions as AssessmentQuestion[]).find((q: AssessmentQuestion) => q.id === response.questionId);

      // If not found, check in sampleQuestions based on question ID prefix
      if (!question) {
        // Get the category prefix from the questionId (e.g., "c_" for containerization)
        const prefix = response.questionId.split('_')[0] + '_';

        // Map prefixes to category IDs
        const prefixMap: Record<string, string> = {
          'fc_': 'foundations_culture',         // Includes Cloud Native Team Operating Model
          'aa_': 'application_architecture',
          'cicd_': 'cicd_practices',
          'dora_': 'dora_metrics',
          'bvs_': 'business_value_strategy',    // New category
          'ci_': 'container_infrastructure',    // Container orchestration and platform
          'sc_': 'security_compliance',
          'obs_': 'observability',
          'finops_': 'finops_cost_management',     // New category
          'mod_': 'app_migration_modernization', // New category
          'ip_': 'infrastructure_platform',
          'dm_': 'data_management',
          'ops_': 'operations_resilience',      // Combined DR + Sustainability
          'mch_': 'multicloud_hybrid_governance', // New category
          'aiml_': 'ai_ml_integration'            // New category
        };

        // Find the category based on the prefix
        for (const [prefix, categoryId] of Object.entries(prefixMap)) {
          if (response.questionId.startsWith(prefix)) {
            // Look in the sample questions for this category
            question = sampleQuestions[categoryId]?.find(q => q.id === response.questionId);
            break;
          }
        }
      }

      if (question) {
        if (!responsesByCategoryId[question.category]) {
          responsesByCategoryId[question.category] = [];
          totalResponsesByCategory[question.category] = 0;
          dontKnowResponsesByCategory[question.category] = 0;
        }

        totalResponsesByCategory[question.category]++;

        // Only include scores that are not "I don't know" (-1) in our averages
        if (response.score >= 0) {
          responsesByCategoryId[question.category].push(response.score);
        } else {
          dontKnowResponsesByCategory[question.category]++;
          logger.debug(`Skipping 'I don't know' response (score = -1) for question ${response.questionId} in category averages`);
        }
      }
    });

    // Get the organization data for use in critical issues evaluation
      const organizations = sessionId ? sessionData!.organizations : this.organizations;
    const organization = assessment.organizationId 
        ? organizations.get(assessment.organizationId) 
      : undefined;

    // Use the new rule-based critical issues evaluation
      const allCriticalIssues = evaluateCriticalIssues(responses, organization, language);
    logger.debug(`Evaluated ${allCriticalIssues.length} critical issues using rule engine`);

    // Limit to a maximum number of issues per category
    const limitedCriticalIssues = limitIssuesPerCategory(allCriticalIssues, 3);
    logger.debug(`Limited to ${limitedCriticalIssues.length} critical issues after category filtering`);

    // Calculate average score for each category
      const categoryScores = Object.entries(responsesByCategoryId).map(([categoryId, scores]) => {
      // Calculate knowledge gap percentage
      const totalResponses = totalResponsesByCategory[categoryId] || 0;
      const dontKnowCount = dontKnowResponsesByCategory[categoryId] || 0;
      const knowledgeGapPercentage = totalResponses > 0 ? Math.round((dontKnowCount / totalResponses) * 100) : 0;

      // If all responses were "I don't know", set score to -1 with a special flag
      const allDontKnow = totalResponses > 0 && dontKnowCount === totalResponses;

      // Calculate average score only if there are valid responses
      const avgScore = scores.length
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : -1; // Set to -1 (not started) for knowledge gaps

      // Determine maturity level
      let maturityLevel;
      if (allDontKnow) {
        maturityLevel = "knowledge_gap";
      } else if (avgScore < 0) {
        maturityLevel = "not_started";
      } else if (avgScore <= MATURITY_LEVELS.BEGINNER.range[1]) {
        maturityLevel = "beginner";
      } else if (avgScore <= MATURITY_LEVELS.INTERMEDIATE.range[1]) {
        maturityLevel = "intermediate";
      } else {
        maturityLevel = "advanced";
      }

      // Determine risk level based on score and knowledge gap
      let riskLevel: "HIGH" | "MEDIUM" | "LOW" | "NONE" = "NONE";
      if (allDontKnow) {
        // Knowledge gaps represent an unknown risk - mark as NONE
        riskLevel = "NONE";
      } else if (avgScore >= 0) {
        if (avgScore <= 35) riskLevel = "HIGH";
        else if (avgScore <= 65) riskLevel = "MEDIUM";
        else riskLevel = "LOW";
      }

      // Filter critical issues for this category
      const categoryIssues = limitedCriticalIssues
        .filter(issue => issue.categoryId === categoryId)
        .map(issue => {
          // Find the original rule to get the multilingual text
          const originalRule = issueRules.find(rule => rule.id === issue.id);
          
          return {
            id: issue.id,
            // Store the full text object or a fallback with the current text
            text: originalRule?.text || { [language]: issue.text },
            severity: issue.severity
          };
        });

      // Calculate cost saving potential (this is an example formula, should be refined)
      const costSavingPotential = avgScore < 50 ? 30 : avgScore < 75 ? 20 : 10; // percentage

      // Business impact - higher for foundational categories with low scores
      let businessImpact: "HIGH" | "MEDIUM" | "LOW" = "LOW";
      const highImpactCategories = ["foundations_culture", "cicd_practices", "security_compliance", "business_value_strategy"];
      const mediumImpactCategories = ["application_architecture", "container_infrastructure", "observability"];

      if (highImpactCategories.includes(categoryId) && avgScore < 50) {
        businessImpact = "HIGH";
      } else if (mediumImpactCategories.includes(categoryId) && avgScore < 60 ||
        highImpactCategories.includes(categoryId) && avgScore < 70) {
        businessImpact = "MEDIUM";
      }

      // Updated return object to explicitly match CategoryScore type
      return {
        categoryId,
        score: avgScore,
        maturityLevel,
        riskLevel,
        criticalIssues: categoryIssues as any, // Type cast to resolve incompatibility
        costSavingPotential,
        businessImpact,
        knowledgeGapPercentage
      };
    });

      // Generate recommendations based on category scores
      const recommendations = this.generateRecommendationsForScores(categoryScores, language);

      // If using a specific session, update session data
      if (sessionId) {
        // Mark the assessment as completed
        const assessments = new Map(sessionData!.assessments);
        assessments.set(assessment.id, {
          ...assessment,
          completedAt: new Date()
        });
        
        await this.updateSessionData(sessionId, {
          assessments,
          categoryScores,
          recommendations
        });
        
        logger.debug(`Updated session ${sessionId} with new assessment scores and recommendations`);
      } else {
        // Otherwise update global state
        this.categoryScores = categoryScores;
        this.recommendations = recommendations;

    // Mark the assessment as completed
    this.assessments.set(assessment.id, {
      ...assessment,
      completedAt: new Date()
    });
        
        logger.debug('Updated global state with new assessment scores and recommendations');
      }

    // Try to store results in S3, but don't fail the entire operation if S3 storage fails
    try {
      // If sessionId is provided, use it as the resultId for simplicity
      // Otherwise generate a new UUID for the result
      const resultId = sessionId || randomUUID();
      logger.info(`Generated result ID: ${resultId}`);
      
      // If using an existing session, update it with the result ID
      if (sessionId) {
        await this.updateSessionData(sessionId, { 
          result: resultId,
          categoryScores,
          recommendations
        });
        logger.debug(`Updated session ${sessionId} with result ID: ${resultId}`);
      }
      
      // Create or update a dedicated result session (may be the same as user session)
      const now = new Date();
      const type: SessionType = 'LONG'; // Results should have longer expiration
      const expirationMs = SESSION_CONFIG.EXPIRATION[type];
      
      // Always create/update a session with the resultId as the key
      // This ensures we can always look up a result directly
      const existingSession = this.sessions.get(resultId);
      const existingGenerationCount = existingSession?.executiveSummaryGenerations || 0;
      
      this.sessions.set(resultId, {
        users: sessionId ? (await this.getSessionData(sessionId)).users : this.users,
        organizations: sessionId ? (await this.getSessionData(sessionId)).organizations : this.organizations,
        assessments: sessionId ? (await this.getSessionData(sessionId)).assessments : this.assessments,
        responses: sessionId ? (await this.getSessionData(sessionId)).responses : this.responses,
        categoryScores: categoryScores,
        recommendations: recommendations,
        currentId: sessionId ? (await this.getSessionData(sessionId)).currentId : this.currentId,
        currentOrgId: sessionId ? (await this.getSessionData(sessionId)).currentOrgId : this.currentOrgId,
        currentAssessmentId: sessionId ? (await this.getSessionData(sessionId)).currentAssessmentId : this.currentAssessmentId,
        currentResponseId: sessionId ? (await this.getSessionData(sessionId)).currentResponseId : this.currentResponseId,
        result: resultId, // CRITICAL: The result session points to itself
        executiveSummaryGenerations: existingGenerationCount, // CRITICAL FIX: Preserve existing generation count
        createdAt: now,
        expiresAt: new Date(now.getTime() + expirationMs),
        lastAccessedAt: now
      });
      
      // Set global result reference (fallback)
      this.result = resultId;
      logger.info(`Created/updated result session with ID: ${resultId}`);
      
      // Try to store in S3 if configured
      if (process.env.AWS_REGION && process.env.S3_BUCKET) {
        try {
          const bucketName = process.env.S3_BUCKET;
          const key = `results/${resultId}.json`;
          
          // Generate result data
          const resultData = {
            id: resultId,
            assessment,
            categoryScores,
            recommendations,
            responses: sessionId ? (await this.getSessionData(sessionId)).responses : this.responses,
            timestamp: new Date().toISOString()
          };
          
          await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: JSON.stringify(resultData),
            ContentType: "application/json"
          }));
          
          logger.info(`Stored assessment result to S3: ${bucketName}/${key}`);
        } catch (s3Error) {
          logger.error("Failed to store result in S3:", s3Error);
        }
      } else {
        logger.warn("AWS_REGION or S3_BUCKET not configured for S3 storage");
      }
      
      // Link the original session and result session bidirectionally
      if (sessionId && sessionId !== resultId) {
        logger.debug(`Creating bidirectional link between session ${sessionId} and result ${resultId}`);
        
        // The user session points to the result session
        await this.updateSessionData(sessionId, { 
          result: resultId,
          categoryScores,
          recommendations
        });
        
        // The result session knows it's linked to the user session
        // This helps with recovery if needed
        const resultSessionData = this.sessions.get(resultId);
        if (resultSessionData) {
          resultSessionData.originalSessionId = sessionId;
          this.sessions.set(resultId, resultSessionData);
        }
      }
      
      return { success: true, resultId };
    } catch (error) {
      // If S3 storage fails, generate a temporary UUID for the result
      const tempResultId = randomUUID();
      logger.error(`Failed to store assessment to S3. Using temporary result ID: ${tempResultId}`, error);
      
      // Create a basic session for the temporary result
      const now = new Date();
      const type: SessionType = 'MEDIUM';
      const expirationMs = SESSION_CONFIG.EXPIRATION[type];
      const expiresAt = new Date(now.getTime() + expirationMs);
      
        if (sessionId) {
          // If already using a session, just update the result field
          await this.updateSessionData(sessionId, { result: tempResultId });
        } else {
          // Otherwise store session data using the temporary ID with global state
          // Preserve existing generation count if session already exists
          const existingTempSession = this.sessions.get(tempResultId);
          const existingTempGenerationCount = existingTempSession?.executiveSummaryGenerations || 0;
          
      this.sessions.set(tempResultId, {
        users: this.users,
        organizations: this.organizations,
        assessments: this.assessments,
        responses: this.responses,
        categoryScores: this.categoryScores,
        recommendations: this.recommendations,
        currentId: this.currentId,
        currentOrgId: this.currentOrgId,
        currentAssessmentId: this.currentAssessmentId,
        currentResponseId: this.currentResponseId,
        result: tempResultId,
        executiveSummaryGenerations: existingTempGenerationCount, // CRITICAL FIX: Preserve existing generation count
        createdAt: now,
        expiresAt: expiresAt,
        lastAccessedAt: now
      });
      
          // Set the global result ID for retrieval
      this.result = tempResultId;
    }

        logger.debug(`Created temporary session ${tempResultId} for storing assessment result`);
        
        // Return the result ID in the success response
        return { success: true, resultId: tempResultId };
      }
    } catch (error) {
      logger.error(`Error processing assessment ${sessionId ? `for session ${sessionId}` : '(global)'}:`, error);
      throw error;
    }
  }
  
  // Helper method to generate recommendations based on category scores
  private generateRecommendationsForScores(categoryScores: CategoryScore[], language: string = "en"): ImplementationRecommendation[] {
    logger.debug(`Generating recommendations with language: ${language}`);
    
    // This method is deprecated - recommendations are now generated from the capability matrix
    // via the /api/roadmap endpoint. Returning empty array.
    logger.info('generateRecommendationsForScores is deprecated. Use /api/roadmap endpoint instead.');
    return [];
  }

  async getResult(sessionId?: string): Promise<string> {
    try {
      if (sessionId) {
        // First try to get result directly from this session
        const session = this.sessions.get(sessionId);
        if (session && session.result) {
          logger.debug(`Found result ID ${session.result} in session ${sessionId}`);
          return session.result;
        }
        
        // If this session doesn't have a result, maybe this IS a result ID
        // Check if there's a session with this ID that contains itself as result
        const resultSession = this.sessions.get(sessionId);
        if (resultSession && resultSession.result === sessionId) {
          logger.debug(`Session ${sessionId} is itself a result ID`);
          return sessionId;
        }
        
        // Check if this session ID matches the global result
        if (this.result === sessionId) {
          logger.debug(`Session ID ${sessionId} matches global result ID`);
          return sessionId;
        }
        
        // Search for any session that has this sessionId as its result
        const sessionEntries = Array.from(this.sessions.entries());
        for (const [sid, sessionData] of sessionEntries) {
          if (sessionData.result === sessionId) {
            logger.debug(`Found session ${sid} with result ID ${sessionId}`);
            return sessionId;
          }
          
          // Also check if this session is linked to the requested sessionId
          if (sessionData.originalSessionId === sessionId) {
            logger.debug(`Found result session ${sid} linked to user session ${sessionId}`);
            return sid;
          }
        }
        
        logger.warn(`No result found for session ${sessionId}`);
      }
      
      // Fall back to global result if no sessionId provided or no result found
      logger.debug(`Returning global result ID: ${this.result}`);
      return this.result;
    } catch (error) {
      logger.error(`Error in getResult for ${sessionId}:`, error);
      return this.result;
    }
  }

  async getSessionId(sessionId: string): Promise<{ success: boolean }> {
    try {
      logger.debug(`Checking session validity for: ${sessionId}`);
      
      // First try direct validation
      try {
        const isValid = await this.validateSession(sessionId);
        logger.debug(`Session ${sessionId} is valid`);
        return { success: isValid };
      } catch (validationError: any) {
        logger.debug(`Session validation failed: ${validationError.message}, attempting recovery`);
        
        // Session doesn't exist or expired, try recovery
        try {
          // Check if result exists with this ID
          if (this.result === sessionId) {
            logger.debug(`Found matching global result ID: ${sessionId}`);
            
            // Create a new session using global state
            const now = new Date();
            const type: SessionType = 'MEDIUM';
            const expirationMs = SESSION_CONFIG.EXPIRATION[type];
            
            this.sessions.set(sessionId, {
              users: this.users,
              organizations: this.organizations,
              assessments: this.assessments,
              responses: this.responses,
              categoryScores: this.categoryScores,
              recommendations: this.recommendations,
              currentId: this.currentId,
              currentOrgId: this.currentOrgId,
              currentAssessmentId: this.currentAssessmentId,
              currentResponseId: this.currentResponseId,
              result: sessionId,
              executiveSummaryGenerations: 0, // Initialize generation counter
              createdAt: now,
              expiresAt: new Date(now.getTime() + expirationMs),
              lastAccessedAt: now
            });
            
            logger.info(`Created new session from global state with ID: ${sessionId}`);
            return { success: true };
          }
          
          // Try to recover from S3
          const recovered = await this.processResultId("en", sessionId);
          if (recovered.success) {
            logger.info(`Successfully recovered session ${sessionId} from S3`);
            return { success: true };
          }
          
          logger.warn(`Failed to recover session ${sessionId}`);
          return { success: false };
        } catch (recoveryError: any) {
          logger.error(`Session recovery failed for ${sessionId}:`, recoveryError);
          throw new Error(`Cannot recover session: ${recoveryError.message}`);
        }
      }
    } catch (error) {
      logger.error(`Error in getSessionId for ${sessionId}:`, error);
      throw error;
    }
  }

  async getCategoryScores(sessionId?: string): Promise<CategoryScore[]> {
    try {
      // Get category scores from the proper context
      const allScores = sessionId ? 
        (await this.getSessionData(sessionId)).categoryScores : 
        this.categoryScores;
      
      // If no scores are available, return empty array
      if (!allScores || allScores.length === 0) {
        return [];
      }
      
      // Get current assessment to determine type
      const assessment = await this.getCurrentAssessment(sessionId);
      if (!assessment) {
        // If no assessment is found, return all scores
        logger.debug("No assessment found when getting category scores, returning all scores");
        return allScores;
      }
      
      // DEBUGGING: Log assessment type
      logger.info(`getCategoryScores: Assessment type is "${assessment.assessmentType}" for session ${sessionId || 'global'}`);
      
      // Get the categories for this assessment type
      const relevantCategories = this.getCategoriesForAssessmentType(assessment.assessmentType);
      logger.debug(`Filtering scores to only include categories for assessment type: ${assessment.assessmentType}`, {
        assessmentType: assessment.assessmentType,
        relevantCategories,
        beforeCount: allScores.length
      });
      
      // Filter scores to only include categories for this assessment type
      const filteredScores = allScores.filter(score => 
        relevantCategories.includes(score.categoryId)
      );
      
      logger.debug(`Returning ${filteredScores.length} category scores out of ${allScores.length} total scores`);
      return filteredScores;
    } catch (error) {
      logger.error(`Error getting category scores for session ${sessionId}:`, error);
      return [];
    }
  }

  private generateRecommendations(language: string = "en") {
    // This method is deprecated - recommendations are now generated from the capability matrix
    // via the /api/roadmap endpoint. This method should no longer be called.
    logger.info('generateRecommendations is deprecated. Use /api/roadmap endpoint instead.');
    
    // Clear recommendations to ensure no hardcoded values persist
    this.recommendations = [];
  }

  async resetAssessment(sessionId?: string): Promise<{ success: boolean }> {
    try {
      // Clear responses
      this.responses = [];

      // Clear category scores
      this.categoryScores = [];

      // Clear recommendations
      this.recommendations = [];

      // Reset response ID counter to ensure clean state
      this.currentResponseId = 1;

      // Reset assessment (keep the current one but reset its data)
      const currentAssessment = this.assessments.get(this.currentAssessmentId);
      if (currentAssessment) {
        const resetAssessment: Assessment = {
          ...currentAssessment,
          organizationId: null,
          completedAt: null,
          createdAt: new Date(),
          questions: [],
        };
        this.assessments.set(this.currentAssessmentId, resetAssessment);
      }

      logger.info("Assessment data reset successfully");
      return { success: true };
    } catch (error) {
      logger.error("Error resetting assessment data:", error);
      return { success: false };
    }
  }

  async createSession(sessionType?: SessionType): Promise<string> {
    const sessionId = randomUUID();
    
    // Get the expiration time based on the provided session type
    const type = sessionType || SESSION_CONFIG.DEFAULT_TYPE;
    const expirationMs = SESSION_CONFIG.EXPIRATION[type];
    
    // Calculate expiration date
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expirationMs);
    
    logger.info(`Creating ${type} session (expires in ${expirationMs/1000/60} minutes)`); 
    
    // Initialize with clean empty collections instead of copying global state
    // This is essential for true multi-tenancy
    this.sessions.set(sessionId, {
      users: new Map(),
      organizations: new Map(),
      assessments: new Map(),
      responses: [],
      categoryScores: [],
      recommendations: [],
      currentId: 1,
      currentOrgId: 1,
      currentAssessmentId: 1,
      currentResponseId: 1,
      result: '',
      executiveSummaryGenerations: 0, // Initialize generation counter
      createdAt: now,
      expiresAt: expiresAt,
      lastAccessedAt: now
    });
    
    // Remove automatic standard assessment creation - client will explicitly set type
    
    return sessionId;
  }

  async validateSession(sessionId: string): Promise<boolean> {
    // Verify the session exists
    if (!this.sessions.has(sessionId)) {
      throw new Error(`Cannot load session for id=${sessionId}`);
    }
    
    // Get session data
    const session = this.sessions.get(sessionId)!;
    
    // Check if session has expired
    const now = new Date();
    if (session.expiresAt < now) {
      // Clean up expired session
      this.sessions.delete(sessionId);
      throw new Error(`Session has expired for id=${sessionId}`);
    }
    
    // Update last accessed timestamp
    session.lastAccessedAt = now;
    this.sessions.set(sessionId, session);
    
    return true;
  }

  async getExpiredSessionIds(): Promise<string[]> {
    const now = new Date();
    const expiredSessionIds: string[] = [];
    
    // Use Array.from to convert Map entries to a regular array
    const sessionEntries = Array.from(this.sessions.entries());
    
    for (const [sessionId, session] of sessionEntries) {
      if (session.expiresAt < now) {
        expiredSessionIds.push(sessionId);
      }
    }
    
    return expiredSessionIds;
  }

  // Helper method to get session data for the provided session ID
  // If no session ID is provided, it will use the global state
  private async getSessionData(sessionId?: string): Promise<{
    users: Map<number, User>;
    organizations: Map<number, Organization>;
    assessments: Map<number, Assessment>;
    responses: AssessmentResponse[];
    categoryScores: CategoryScore[];
    recommendations: ImplementationRecommendation[];
    currentId: number;
    currentOrgId: number;
    currentAssessmentId: number;
    currentResponseId: number;
    executiveSummary?: string;
    executiveSummaryGenerations: number;
  }> {
    // No session ID provided, use global state
    if (!sessionId) {
      logger.debug('Using global state as no sessionId was provided');
      return {
        users: this.users,
        organizations: this.organizations,
        assessments: this.assessments,
        responses: this.responses,
        categoryScores: this.categoryScores,
        recommendations: this.recommendations,
        currentId: this.currentId,
        currentOrgId: this.currentOrgId,
        currentAssessmentId: this.currentAssessmentId,
        currentResponseId: this.currentResponseId,
        executiveSummary: undefined,
        executiveSummaryGenerations: 0,
      };
    }

    try {
      // Validate the session exists and isn't expired
      await this.validateSession(sessionId);

      // Return the session-specific state
      const session = this.sessions.get(sessionId)!;
      logger.debug(`Retrieved session data for ${sessionId} (expires: ${session.expiresAt.toISOString()})`);
      
      return {
        users: session.users,
        organizations: session.organizations,
        assessments: session.assessments,
        responses: session.responses,
        categoryScores: session.categoryScores,
        recommendations: session.recommendations,
        currentId: session.currentId,
        currentOrgId: session.currentOrgId,
        currentAssessmentId: session.currentAssessmentId,
        currentResponseId: session.currentResponseId,
        executiveSummary: session.executiveSummary,
        executiveSummaryGenerations: session.executiveSummaryGenerations,
      };
    } catch (error) {
      logger.error(`Error getting session data for ${sessionId}:`, error);
      throw new Error(`Cannot access session data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async updateSessionData(sessionId: string, data: {
    users?: Map<number, User>;
    organizations?: Map<number, Organization>;
    assessments?: Map<number, Assessment>;
    responses?: AssessmentResponse[];
    categoryScores?: CategoryScore[];
    recommendations?: ImplementationRecommendation[];
    currentId?: number;
    currentOrgId?: number;
    currentAssessmentId?: number;
    currentResponseId?: number;
    result?: string;
    executiveSummary?: string;
    executiveSummaryGenerations?: number;
  }): Promise<void> {
    if (!sessionId || !sessionId.trim()) {
      logger.warn('Attempted to update session data with invalid sessionId');
      throw new Error('Cannot update session: Invalid sessionId provided');
    }
    
    try {
      // Validate the session exists and isn't expired
      await this.validateSession(sessionId);
      
      // Get current session data
      const session = this.sessions.get(sessionId)!;
      
      // Update the session with the provided data
      this.sessions.set(sessionId, {
        users: data.users || session.users,
        organizations: data.organizations || session.organizations,
        assessments: data.assessments || session.assessments,
        responses: data.responses || session.responses,
        categoryScores: data.categoryScores || session.categoryScores,
        recommendations: data.recommendations || session.recommendations,
        currentId: data.currentId || session.currentId,
        currentOrgId: data.currentOrgId || session.currentOrgId,
        currentAssessmentId: data.currentAssessmentId || session.currentAssessmentId,
        currentResponseId: data.currentResponseId || session.currentResponseId,
        result: data.result || session.result,
        executiveSummary: data.executiveSummary !== undefined ? data.executiveSummary : session.executiveSummary,
        executiveSummaryGenerations: data.executiveSummaryGenerations !== undefined ? data.executiveSummaryGenerations : session.executiveSummaryGenerations,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        lastAccessedAt: new Date() // Update the last accessed timestamp
      });
      
      logger.debug(`Updated session data for ${sessionId}`);
    } catch (error) {
      logger.error(`Error updating session data for ${sessionId}:`, error);
      throw new Error(`Cannot update session data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private createAssessmentObject(
    assessmentType: "quick" | "standard" | "comprehensive", 
    id: number, 
    language: string = "en"
  ): Assessment {
    // This determines which categories to include based on assessment type
    const allCategories = ASSESSMENT_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.title,
      description: cat.description
    }));

    // Get the categories to include based on assessment type
    const categoriesToInclude = this.getCategoriesForAssessmentType(assessmentType);

    // Filter categories to only include those for this assessment type
    const categories = allCategories.filter(cat => categoriesToInclude.includes(cat.id));

    // Get questions for the selected categories
    let relevantQuestions: AssessmentQuestion[] = [];
    categoriesToInclude.forEach(categoryId => {
      if (sampleQuestions[categoryId]) {
        // Use base questions from sampleQuestions but we'll translate text and options later when requested
        relevantQuestions.push(...sampleQuestions[categoryId]);
      }
    });

    // Title and description based on assessment type
    let title = "Cloud Native Maturity Assessment";
    let description = "Evaluate your organization's cloud native maturity";

    switch (assessmentType) {
      case "quick":
        title = "Quick Cloud Native Maturity Assessment";
        description = "Quickly evaluate your organization's cloud native maturity across 4 core areas";
        break;
      case "standard":
        title = "Standard Cloud Native Maturity Assessment";
        description = "Evaluate your organization's cloud native maturity across 7 key areas";
        break;
      case "comprehensive":
        title = "Comprehensive Cloud Native Maturity Assessment";
        description = "In-depth evaluation of your organization's cloud native maturity across all 15 key areas";
        break;
    }

    return {
      id,
      organizationId: null,
      title,
      description,
      assessmentType,
      completedAt: null,
      createdAt: new Date(),
      categories: categories.filter(cat => categoriesToInclude.includes(cat.id)),
      questions: relevantQuestions,
      language // Store the selected language in the assessment object
    };
  }

  async generateResult(sessionId?: string): Promise<string> {
    try {
      // If sessionId is provided, use it as the resultId, otherwise generate a new UUID
      let resultId = sessionId || randomUUID();
      logger.debug(`Generating result with ID: ${resultId}`);
      
      // Get assessment data from the proper context
      const sessionData = sessionId ? await this.getSessionData(sessionId) : null;
      const assessment = await this.getCurrentAssessment(sessionId);
      const categoryScores = sessionId ? sessionData!.categoryScores : this.categoryScores;
      const recommendations = sessionId ? sessionData!.recommendations : this.recommendations;
      const responses = sessionId ? sessionData!.responses : this.responses;
      
      // Generate result data
      const resultData = {
        id: resultId,
        assessment,
        categoryScores,
        recommendations,
        responses,
        timestamp: new Date().toISOString()
      };
      
      // Ensure we have a session with this result ID
      if (!sessionId || sessionId !== resultId) {
        const now = new Date();
        const type: SessionType = 'LONG'; // LONG expiration for results
        const expirationMs = SESSION_CONFIG.EXPIRATION[type];
        
        this.sessions.set(resultId, {
          users: sessionId ? sessionData!.users : this.users,
          organizations: sessionId ? sessionData!.organizations : this.organizations,
          assessments: sessionId ? sessionData!.assessments : this.assessments,
          responses: responses,
          categoryScores: categoryScores,
          recommendations: recommendations,
          currentId: sessionId ? sessionData!.currentId : this.currentId,
          currentOrgId: sessionId ? sessionData!.currentOrgId : this.currentOrgId,
          currentAssessmentId: sessionId ? sessionData!.currentAssessmentId : this.currentAssessmentId,
          currentResponseId: sessionId ? sessionData!.currentResponseId : this.currentResponseId,
          result: resultId,
          executiveSummaryGenerations: 0, // Initialize generation counter
          createdAt: now,
          expiresAt: new Date(now.getTime() + expirationMs),
          lastAccessedAt: now
        });
        
        logger.info(`Created result session with ID: ${resultId} (expires in ${expirationMs/1000/60/60} hours)`);
      } else {
        // Update the existing session with the result ID
        await this.updateSessionData(sessionId, {
          result: resultId
        });
        logger.debug(`Updated existing session ${sessionId} with result ID: ${resultId}`);
      }
      
      // Always update global result reference
      this.result = resultId;
      
      // Try to store in S3 if configured
      if (process.env.AWS_REGION && process.env.S3_BUCKET) {
        try {
          const bucketName = process.env.S3_BUCKET;
          const key = `results/${resultId}.json`;
          
          await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: JSON.stringify(resultData),
            ContentType: "application/json"
          }));
          
          logger.info(`Stored assessment result to S3: ${bucketName}/${key}`);
        } catch (s3Error) {
          logger.error("Failed to store result in S3:", s3Error);
        }
      } else {
        logger.warn("AWS_REGION or S3_BUCKET not configured for S3 storage");
      }
      
      return resultId;
    } catch (error) {
      logger.error("Error generating result:", error);
      const fallbackId = randomUUID();
      logger.info(`Using fallback result ID: ${fallbackId}`);
      return fallbackId;
    }
  }

  async processResultId(language: string, resultId: string): Promise<{ success: boolean }> {
    try {
      logger.info(`Processing result ID: ${resultId}`);
      
      // Check if this is already a valid session
      try {
        await this.validateSession(resultId);
        logger.info(`Result ID ${resultId} is already a valid session`);
        return { success: true };
      } catch (error) {
        // Not a valid session, continue with recovery
        logger.debug(`Result ID ${resultId} is not a valid session, attempting recovery`);
      }
      
      // First check if we have a global result that matches
      if (this.result === resultId) {
        logger.info(`Found matching global result ID: ${resultId}, creating session`);
        
        // Create a new session with global state
        const now = new Date();
        const type: SessionType = 'MEDIUM';
        const expirationMs = SESSION_CONFIG.EXPIRATION[type];
        
        this.sessions.set(resultId, {
          users: this.users,
          organizations: this.organizations,
          assessments: this.assessments,
          responses: this.responses,
          categoryScores: this.categoryScores,
          recommendations: this.recommendations,
          currentId: this.currentId,
          currentOrgId: this.currentOrgId,
          currentAssessmentId: this.currentAssessmentId,
          currentResponseId: this.currentResponseId,
          result: resultId,
          executiveSummaryGenerations: 0, // Initialize generation counter
          createdAt: now,
          expiresAt: new Date(now.getTime() + expirationMs),
          lastAccessedAt: now
        });
        
        logger.info(`Created session from global state with ID: ${resultId}`);
        return { success: true };
      }
      
      // Try to fetch result from S3 if configured
      if (process.env.AWS_REGION && process.env.S3_BUCKET) {
        try {
          const bucketName = process.env.S3_BUCKET;
          const key = `results/${resultId}.json`;
          
          logger.debug(`Attempting to fetch result from S3: ${bucketName}/${key}`);
          const response = await s3.send(new GetObjectCommand({
            Bucket: bucketName,
            Key: key
          }));
          
          if (response.Body) {
            // Convert stream to string
            const streamToString = (stream: Readable): Promise<string> => {
              return new Promise((resolve, reject) => {
                const chunks: any[] = [];
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('error', reject);
                stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
              });
            };
            
            const bodyContents = await streamToString(response.Body as Readable);
            const resultData = JSON.parse(bodyContents);
            
            // Store the result data in the session
            const now = new Date();
            const sessionData: SessionData = {
              users: new Map(),
              organizations: new Map(),
              assessments: new Map(),
              responses: resultData.responses || [],
              categoryScores: resultData.categoryScores || [],
              recommendations: resultData.recommendations || [],
              currentId: 1,
              currentOrgId: 1,
              currentAssessmentId: 1,
              currentResponseId: 1,
              result: resultId, // Critical: store the result ID in the session
              executiveSummaryGenerations: 0, // Initialize generation counter
              createdAt: now,
              expiresAt: new Date(now.getTime() + SESSION_CONFIG.EXPIRATION.MEDIUM),
              lastAccessedAt: now
            };
            
            // If there's an assessment, add it
            if (resultData.assessment) {
              const assessment = resultData.assessment;
              sessionData.assessments.set(assessment.id, assessment);
              sessionData.currentAssessmentId = assessment.id + 1;
            }
            
            // Store the session with the result ID as the session ID
            this.sessions.set(resultId, sessionData);
            logger.info(`Successfully processed and created session from result ID ${resultId}`);
            
            // Also update the global result for additional recovery options
            this.result = resultId;
            
            return { success: true };
          } else {
            logger.warn(`No body in S3 response for result ID ${resultId}`);
          }
        } catch (s3Error) {
          logger.error(`Failed to retrieve result ${resultId} from S3:`, s3Error);
        }
      } else {
        logger.warn("AWS_REGION or S3_BUCKET not configured for result recovery");
        
        // If we don't have S3 configured, create a fallback dummy session
        const now = new Date();
        const expiresAt = new Date(now.getTime() + SESSION_CONFIG.EXPIRATION.MEDIUM);
        
        // Create a new empty session as a fallback
        this.sessions.set(resultId, {
          users: new Map(),
          organizations: new Map(),
          assessments: new Map(),
          responses: [],
          categoryScores: [],
          recommendations: [],
          currentId: 1,
          currentOrgId: 1,
          currentAssessmentId: 1,
          currentResponseId: 1,
          result: resultId,
          executiveSummaryGenerations: 0, // Initialize generation counter
          createdAt: now,
          expiresAt: expiresAt,
          lastAccessedAt: now
        });
        
        // Don't automatically create an assessment - wait for client to specify type
        logger.info(`Created fallback session with ID ${resultId} due to missing S3 configuration`);
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      logger.error(`Error processing result ID ${resultId}:`, error);
      return { success: false };
    }
  }

  async saveExecutiveSummary(executiveSummary: string, sessionId?: string): Promise<void> {
    if (sessionId) {
      try {
        // Get session data
        const sessionData = await this.getSessionData(sessionId);
        
        // Update session data with executive summary
        await this.updateSessionData(sessionId, { executiveSummary });
        
        logger.debug(`Executive summary saved for session ${sessionId}`);
      } catch (error) {
        logger.error(`Error saving executive summary for session ${sessionId}:`, error);
        throw error;
      }
    }
  }

  async getExecutiveSummary(sessionId?: string): Promise<string | null> {
    if (sessionId) {
      try {
        // Get session data
        const sessionData = await this.getSessionData(sessionId);
        
        // Return executive summary from session data, convert undefined to null
        return sessionData.executiveSummary || null;
      } catch (error) {
        logger.error(`Error getting executive summary for session ${sessionId}:`, error);
        return null;
      }
    }
    return null;
  }

  // Executive Summary generation tracking methods - simplified for clean architecture
  async getExecutiveSummaryGenerationCount(sessionId?: string): Promise<number> {
    if (sessionId) {
      try {
        const sessionData = await this.getSessionData(sessionId);
        return sessionData.executiveSummaryGenerations;
      } catch (error) {
        logger.error(`Error getting executive summary generation count for session ${sessionId}:`, error);
        throw error;
      }
    }
    return 0; // Default to 0 if no sessionId provided
  }

  async incrementExecutiveSummaryGenerationCount(sessionId?: string): Promise<number> {
    if (sessionId) {
      try {
        const sessionData = await this.getSessionData(sessionId);
        const currentCount = sessionData.executiveSummaryGenerations;
        const newCount = currentCount + 1;
        await this.updateSessionData(sessionId, { executiveSummaryGenerations: newCount });
        return newCount;
      } catch (error) {
        logger.error(`Error incrementing executive summary generation count for session ${sessionId}:`, error);
        throw error;
      }
    }
    return 0; // Default to 0 if no sessionId provided
  }

  async canGenerateExecutiveSummary(sessionId?: string): Promise<boolean> {
    if (sessionId) {
      try {
        const sessionData = await this.getSessionData(sessionId);
        const currentCount = sessionData.executiveSummaryGenerations;
        const limit = SESSION_CONFIG.MAX_EXECUTIVE_SUMMARY_GENERATIONS;
        return currentCount < limit;
      } catch (error) {
        logger.error(`Error checking if executive summary can be generated for session ${sessionId}:`, error);
        throw error;
      }
    }
    return false; // Default to false if no sessionId provided
  }

  // Get the original user session ID for rate limiting purposes
  // This prevents rate limit resets when users reprocess results
  async getOriginalSessionId(sessionId?: string): Promise<string | null> {
    if (sessionId) {
      try {
        const session = this.sessions.get(sessionId);
        if (session && session.originalSessionId) {
          return session.originalSessionId;
        }
        // If no original session ID, return the current session ID (it might be the original)
        return sessionId;
      } catch (error) {
        logger.error(`Error getting original session ID for session ${sessionId}:`, error);
        return sessionId; // Fallback to current session ID
      }
    }
    return null;
  }

  // Public method to link a result session to its original user session
  async linkResultSessionToUserSession(resultSessionId: string, userSessionId: string): Promise<void> {
    try {
      // Get user session data
      const userSessionData = await this.getSessionData(userSessionId);
      
      // Copy the assessment data from user session to result session
      await this.updateSessionData(resultSessionId, {
        users: userSessionData.users,
        organizations: userSessionData.organizations,
        assessments: userSessionData.assessments,
        responses: userSessionData.responses,
        result: resultSessionId,
        executiveSummaryGenerations: userSessionData.executiveSummaryGenerations || 0
      });
      
      // Set the originalSessionId to link back to the user session for rate limiting
      const resultSession = this.sessions.get(resultSessionId);
      if (resultSession) {
        resultSession.originalSessionId = userSessionId;
        this.sessions.set(resultSessionId, resultSession);
      }
    } catch (error) {
      logger.error(`Error linking result session ${resultSessionId} to user session ${userSessionId}:`, error);
      throw error;
    }
  }

  // RateLimitChecker interface implementation
  async getGenerationCount(sessionId: string): Promise<number> {
    return this.getExecutiveSummaryGenerationCount(sessionId);
  }

  // RateLimitUpdater interface implementation  
  async incrementGenerationCount(sessionId: string): Promise<number> {
    return this.incrementExecutiveSummaryGenerationCount(sessionId);
  }

  /**
   * フィードバックデータをS3に保存
   * 
   * @param feedbackData - 保存するフィードバックデータ
   * @returns 成功の可否とフィードバックID
   */
  async saveFeedback(feedbackData: FeedbackData): Promise<{ success: boolean; feedbackId?: string; error?: string }> {
    try {
      const feedbackId = randomUUID();
      logger.debug(`Saving feedback with ID: ${feedbackId}`, { 
        rating: feedbackData.rating,
        hasEmail: !!feedbackData.email,
        resultId: feedbackData.resultId 
      });

      // Prepare feedback data for storage
      const feedback: FeedbackData = {
        id: feedbackId,
        rating: feedbackData.rating,
        workingWell: feedbackData.workingWell?.trim() || undefined,
        needsImprovement: feedbackData.needsImprovement?.trim() || undefined,
        featureRequests: feedbackData.featureRequests?.trim() || undefined,
        email: feedbackData.email?.trim() || undefined,
        resultId: feedbackData.resultId || undefined,
        userAgent: feedbackData.userAgent || undefined,
        ip: feedbackData.ip || undefined,
        timestamp: new Date().toISOString()
      };

      // Try to store in S3 if configured
      if (process.env.AWS_REGION && process.env.S3_BUCKET) {
        try {
          const bucketName = process.env.S3_BUCKET;
          const key = `feedback/${feedbackId}.json`;
          
          await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: JSON.stringify(feedback, null, 2),
            ContentType: "application/json",
            Metadata: {
              'rating': feedback.rating.toString(),
              'has-email': feedback.email ? 'true' : 'false',
              'result-id': feedback.resultId || 'none'
            }
          }));
          
          logger.info(`Stored feedback to S3: ${bucketName}/${key}`, { 
            feedbackId,
            rating: feedback.rating 
          });
          
          return { success: true, feedbackId };
        } catch (s3Error) {
          logger.error(`Failed to store feedback ${feedbackId} in S3:`, s3Error);
          return { 
            success: false, 
            error: "Failed to store feedback in S3" 
          };
        }
      } else {
        logger.warn("AWS_REGION or S3_BUCKET not configured for feedback storage");
        return { 
          success: false, 
          error: "S3 storage not configured" 
        };
      }
    } catch (error) {
      logger.error("Error saving feedback:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }
}

export const storage = new MemStorage();