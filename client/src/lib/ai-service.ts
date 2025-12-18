import { apiRequest } from '@/lib/queryClient';
import { logger } from '@/lib/logger';
import { persistenceManager } from './assessmentUtils';

import React from 'react';

export type AIProvider = 'openai' | 'anthropic';

export interface AIRequestOptions {
  provider?: AIProvider;
  prompt: string;
  includeImageAnalysis?: boolean;
  imageUrl?: string;
  maxTokens?: number;
  language?: string;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  status: 'success' | 'error';
  error?: string;
}

/**
 * Generate AI response using either OpenAI or Anthropic
 */
export async function generateAIResponse(options: AIRequestOptions): Promise<AIResponse> {
  try {
    // Get the current language from localStorage if not explicitly provided
    const language = options.language || localStorage.getItem('i18nextLng') || 'en';
    
    const requestPayload: any = { // Use any to avoid type errors with dynamic properties
      provider: options.provider || 'openai',
      prompt: options.prompt,
      maxTokens: options.maxTokens || 1000,
      language
    };
    
    if (options.includeImageAnalysis && options.imageUrl) {
      requestPayload.imageUrl = options.imageUrl;
    }
    
    const response = await apiRequest('POST', '/api/ai/prompt', requestPayload);
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        content: '',
        provider: options.provider || 'openai',
        status: 'error',
        error: errorData.error || 'Failed to generate AI response'
      };
    }
    
    const data = await response.json();
    return {
      content: data.content,
      provider: options.provider || 'openai',
      status: 'success'
    };
  } catch (error: any) {
    return {
      content: '',
      provider: options.provider || 'openai', // Default to openai if provider not specified
      status: 'error',
      error: error.message || 'Failed to connect to AI service'
    };
  }
}

/**
 * Generate an educational explanation for a topic using AI
 */
export async function generateEducationalContent(
  category: string,
  topic: string,
  skillLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  provider: AIProvider = 'openai',
  userRole?: string
): Promise<AIResponse> {
  try {
    // Get the current language from localStorage
    const currentLanguage = localStorage.getItem('i18nextLng') || 'en';
    
    // Get user role if not provided
    const currentUserRole = userRole || localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || 'practitioner';
    
    const response = await apiRequest('POST', '/api/ai/educational-content', {
      provider,
      category,
      topic,
      skillLevel,
      language: currentLanguage,
      userRole: currentUserRole
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        content: '',
        provider,
        status: 'error',
        error: errorData.error || 'Failed to generate educational content'
      };
    }
    
    const data = await response.json();
    return {
      content: data.content,
      provider,
      status: 'success'
    };
  } catch (error: any) {
    return {
      content: '',
      provider,
      status: 'error',
      error: error.message || 'Failed to connect to AI service'
    };
  }
}

/**
 * Generate implementation recommendations based on assessment results
 */
export async function generateImplementationRecommendations(
  categoryScores: any[],
  organizationInfo: any,
  provider: AIProvider = 'openai'
): Promise<AIResponse> {
  const prompt = `
Generate practical implementation recommendations for a cloud native maturity assessment.

Organization Information:
${JSON.stringify(organizationInfo, null, 2)}

Assessment Results:
${JSON.stringify(categoryScores, null, 2)}

Please provide specific, actionable recommendations for improving cloud native maturity.
Focus on the areas with the lowest scores first, and provide at least one immediate action item
and one longer-term goal for each category. Include specific technologies, practices, or resources
where appropriate.
`;

  return generateAIResponse({
    provider,
    prompt,
    maxTokens: 2000
  });
}

/**
 * Check if both OpenAI and Anthropic API keys are available
 * This is a React hook - must be used inside a functional component
 */
export function useAIApiKeysAvailable(): {
  openai: boolean;
  anthropic: boolean;
  loading: boolean;
} {
  const [status, setStatus] = React.useState({
    openai: false,
    anthropic: false,
    loading: true
  });

  React.useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await apiRequest('GET', '/api/ai/status');
        if (response.ok) {
          const data = await response.json();
          setStatus({
            openai: !!data.openai,
            anthropic: !!data.anthropic,
            loading: false
          });
        } else {
          setStatus({
            openai: false,
            anthropic: false,
            loading: false
          });
        }
      } catch (error) {
        setStatus({
          openai: false,
          anthropic: false,
          loading: false
        });
      }
    };

    checkApiStatus();
  }, []);

  return status;
}

/**
 * Synchronous check for API keys - used when you don't need to render UI based on status
 */
export async function checkAIApiKeys(): Promise<{openai: boolean; anthropic: boolean}> {
  try {
    const response = await apiRequest('GET', '/api/ai/status');
    if (!response.ok) {
      return { openai: false, anthropic: false };
    }
    const data = await response.json();
    return {
      openai: !!data.openai,
      anthropic: !!data.anthropic
    };
  } catch (error) {
    return { openai: false, anthropic: false };
  }
}

// Cache mechanism to prevent multiple API calls
let executiveSummaryCacheData: {
  data: string;
  timestamp: number;
  language: string;
  userRole: string;
} | null = null;

// Cache expiration time - 15 minutes
const EXECUTIVE_SUMMARY_CACHE_EXPIRATION_MS = 15 * 60 * 1000;

// Global in-flight request tracker
let currentExecutiveSummaryRequest: Promise<any> | null = null;
let currentExecSummaryRequestKey: string | null = null;

export async function generateExecutiveSummary(
  categoryScores: any[],
  organizationInfo: any,
  userRole: string = 'executive',
  provider?: string,
  language: string = 'en',
  recommendations?: any[]
): Promise<string | { content: string }> {
  try {
    // Generate a unique key for this request based on role and language
    const requestKey = `${userRole}-${language}`;
    
    // First check if we have a saved executive summary in localStorage
    const savedSummary = persistenceManager.loadExecutiveSummary();
    
    // If we have a saved summary and it's not older than 15 minutes, return it
    const now = Date.now();
    if (executiveSummaryCacheData && 
        executiveSummaryCacheData.language === language &&
        executiveSummaryCacheData.userRole === userRole &&
        now - executiveSummaryCacheData.timestamp < EXECUTIVE_SUMMARY_CACHE_EXPIRATION_MS &&
        savedSummary) {
      logger.debug("[generateExecutiveSummary] Using cached executive summary");
      return savedSummary;
    }
    
    // If there's already an in-flight request for the same role and language, return it
    if (currentExecutiveSummaryRequest && currentExecSummaryRequestKey === requestKey) {
      logger.debug("[generateExecutiveSummary] Using in-flight executive summary request");
      return currentExecutiveSummaryRequest;
    }
    
    // Log detailed info about why we're making a new request
    logger.debug("[generateExecutiveSummary] Making new request", {
      hasCache: !!executiveSummaryCacheData,
      cacheLanguage: executiveSummaryCacheData?.language,
      cacheUserRole: executiveSummaryCacheData?.userRole,
      currentLanguage: language,
      currentUserRole: userRole,
      cacheAge: executiveSummaryCacheData ? now - executiveSummaryCacheData.timestamp : null,
      hasInFlightRequest: !!currentExecutiveSummaryRequest,
      inFlightRequestKey: currentExecSummaryRequestKey
    });
    
    // Build request payload
    const requestPayload = {
      categoryScores,
      organizationInfo,
      userRole,
      provider,
      language,
      recommendations
    };
    
    // Create the request and store it globally
    currentExecSummaryRequestKey = requestKey;
    currentExecutiveSummaryRequest = (async () => {
      try {
        logger.debug(`[generateExecutiveSummary] Requesting executive summary for ${userRole}`, { 
          language, 
          hasRecommendations: !!recommendations?.length
        });
        
        const response = await apiRequest('POST', '/api/ai/executive-summary', requestPayload);
        
        if (!response.ok) {
          if (response.status === 429) {
            // Handle generation limit exceeded - include the full error response
            const errorData = await response.json();
            throw new Error(`Failed to generate executive summary: ${JSON.stringify(errorData)}`);
          } else {
            const errorText = await response.text();
            throw new Error(`Failed to generate executive summary: ${errorText}`);
          }
        }
        
        const result = await response.json();
        
        // Save the result to our cache
        executiveSummaryCacheData = {
          data: typeof result === 'string' ? result : result.content,
          timestamp: now,
          language,
          userRole
        };
        
        // Also save to localStorage
        if (typeof result === 'string') {
          persistenceManager.saveExecutiveSummary(result);
        } else if (result && typeof result === 'object' && 'content' in result) {
          persistenceManager.saveExecutiveSummary(result.content);
        }
        
        return result;
      } catch (error) {
        logger.error("[generateExecutiveSummary] Error generating executive summary:", error);
        throw error;
      } finally {
        // Clear the current request when done or on error
        setTimeout(() => {
          currentExecutiveSummaryRequest = null;
          currentExecSummaryRequestKey = null;
        }, 100);
      }
    })();
    
    return currentExecutiveSummaryRequest;
  } catch (error) {
    logger.error("[generateExecutiveSummary] Error in request handling:", error);
    throw error;
  }
}

/**
 * Generate AI-assisted trail map milestones
 */
export async function generateTrailMapMilestones(
  categoryId: string,
  assessmentData: any,
  maturityLevel: 'beginner' | 'intermediate' | 'advanced',
  provider?: AIProvider
): Promise<AIResponse> {
  try {
    // Get the current language from localStorage
    const currentLanguage = localStorage.getItem('i18nextLng') || 'en';
    
    // Prepare the assessment data with category context
    const requestData = {
      categoryId,
      assessmentData,
      maturityLevel
    };
    
    // If provider is not explicitly set, we'll let the server use its default
    const requestPayload: any = {
      assessmentData: requestData,
      language: currentLanguage
    };
    
    // Only set provider in the request if it's explicitly provided
    if (provider) {
      requestPayload.provider = provider;
    }
    
    const response = await apiRequest('POST', '/api/ai/trail-map-milestones', requestPayload);
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        content: '',
        provider: provider || 'openai', // Fallback for error reporting
        status: 'error',
        error: errorData.error || 'Failed to generate trail map milestones'
      };
    }
    
    const data = await response.json();
    return {
      content: data.content,
      provider: provider || data.provider || 'openai',
      status: 'success'
    };
  } catch (error: any) {
    logger.error('Error generating trail map milestones:', error);
    return {
      content: '',
      provider: provider || 'openai',
      status: 'error',
      error: error.message || 'Failed to connect to AI service'
    };
  }
}

/**
 * Generate prioritized focus areas for improvement
 */
export async function generatePrioritizedFocusAreas(
  categoryScores: any[],
  organizationInfo: any,
  provider?: AIProvider
): Promise<AIResponse> {
  const prompt = `
You are a cloud‐native advisor. Given the org profile, assessment scores, cost/ROI data, and cultural context below, pick the top 5 focus areas.

Organization Information:
${JSON.stringify(organizationInfo, null, 2)}

Cultural Context:
- Region: ${organizationInfo.region || 'global'}
- Note: In Japan, decisions tend to be consensus-driven, risk-averse, and emphasize longevity and stability.

Assessment Results (with cost/ROI):
${JSON.stringify(categoryScores, null, 2)}

Please consider:
1. Company size & industry constraints  
2. Current environment (on-prem, cloud, hybrid)  
3. Business objectives & risk appetite  
4. Maturity level, gaps, and dependencies  
5. Cost-saving potential and estimated ROI  
6. Cultural & regional norms (e.g. Japanese teams may prioritize stability over rapid change, require multi-stakeholder sign-off)

Return **exact** JSON:
[
  {
    "categoryId": "string",
    "priority": 1–10,       // 1 is highest
    "reason": "string",     
    "timeframe": "immediate" | "near-term" | "long-term",
    "quickWin": true|false,
    "estimatedROI": "string" // e.g. "High (>30% Y1)"
  }
]
Limit to top 5 items. No extra commentary.
`;

  const options: AIRequestOptions = {
    prompt,
    maxTokens: 1500,
    ...(provider && { provider })
  };

  return generateAIResponse(options);
}
