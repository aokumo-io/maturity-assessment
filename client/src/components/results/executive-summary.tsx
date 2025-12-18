import React, { useState, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Copy, ChevronRight, Clock, Zap } from 'lucide-react';
import { AIProvider, generateExecutiveSummary } from '@/lib/ai-service';
import { Organization, CategoryScore } from '@/../../shared/schema';
import { useToast } from '@/hooks/use-toast';
import { persistenceManager } from '@/lib/assessmentUtils';
import { useTranslation } from 'react-i18next';
import { fetchCostAnalysisFromServer } from '@/lib/costAnalysisService';
import { 
  extractAndValidateExecutiveSummary, 
  validatePartialExecutiveSummary,
  parseExecutiveSummaryJSON,
  extractAndParseJson,
  type ExecutiveSummaryData 
} from '@/lib/jsonUtils';
import { apiRequest } from '@/lib/queryClient';

// Clean JSON parsing function
function sanitizeHtml(html: string): string {
  // Remove potentially dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/data:/gi, ''); // Remove data: URLs for extra safety
}

// Safe array validation helper
function isValidArray(value: any): value is any[] {
  return Array.isArray(value) && value.length > 0;
}

// Safe string validation helper
function isValidString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

// Helper function to process markdown content into formatted HTML
function formatSummaryContent(content: string, t: any): string {
  if (!isValidString(content)) {
    return '<p class="text-gray-600">No content available</p>';
  }

  // Process paragraphs first - look for text blocks that aren't headings, lists, etc.
  let formattedContent = content;
  
  // Process headings - add special handling for Japanese format with #### 
  // Use more robust regex patterns that handle edge cases
  formattedContent = formattedContent
    .replace(/^#{4}\s*(.+)$/gm, '<h4 class="text-base font-semibold text-gray-800 mt-4 mb-2">$1</h4>')
    .replace(/^#{3}\s*(.+)$/gm, '<h3 class="text-base font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
    .replace(/^#{2}\s*(.+)$/gm, '<h2 class="text-lg font-semibold text-gray-800 mt-4 mb-3">$1</h2>')
    .replace(/^#{1}\s*(.+)$/gm, '<h1 class="text-xl font-bold text-gray-800 mt-1 mb-3">$1</h1>');
  
  // Fix the first heading to have no top margin
  formattedContent = formattedContent.replace(
    /^<h2 class="text-lg font-semibold text-gray-800 mt-4 mb-3">/m, 
    '<h2 class="text-lg font-semibold text-gray-800 mb-3">'
  );
  
  // Process list items with safer regex patterns
  formattedContent = formattedContent
    .replace(/^[-•]\s+(.+)$/gm, '<li class="flex mb-1"><span class="mr-2 text-blue-600">•</span><span>$1</span></li>')
    .replace(/^(\d+)[\.\)]\s+(.+)$/gm, '<li class="flex mb-1"><span class="mr-2 text-gray-700 font-medium">$1.</span><span>$2</span></li>');
  
  // Format text styling with safer patterns
  formattedContent = formattedContent
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>');
  
  // Wrap adjacent list items in ul/ol tags
  formattedContent = wrapListItems(formattedContent);
  
  // Convert remaining plain paragraphs (text that's not wrapped in tags)
  formattedContent = processParagraphs(formattedContent);
  
  // Sanitize the final HTML
  return sanitizeHtml(formattedContent);
}

// Helper to wrap list items in proper ul/ol tags
function wrapListItems(content: string): string {
  // First, identify blocks of list items
  let inList = false;
  let listType = "";
  const lines = content.split('\n');
  const result: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line is a bullet list item
    if (line.includes('<li class="flex mb-1"><span class="mr-2 text-blue-600">•</span>')) {
      if (!inList || listType !== 'ul') {
        // Start a new unordered list
        if (inList) result.push('</ol>'); // Close previous ordered list if any
        result.push('<ul class="my-2 space-y-1">');
        inList = true;
        listType = 'ul';
      }
      result.push(line);
    } 
    // Check if this line is a numbered list item
    else if (line.includes('<li class="flex mb-1"><span class="mr-2 text-gray-700 font-medium">')) {
      if (!inList || listType !== 'ol') {
        // Start a new ordered list
        if (inList) result.push('</ul>'); // Close previous unordered list if any
        result.push('<ol class="my-2 space-y-1">');
        inList = true;
        listType = 'ol';
      }
      result.push(line);
    } 
    // Not a list item
    else {
      if (inList) {
        // Close the current list
        result.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
      result.push(line);
    }
  }
  
  // Close any open list at the end
  if (inList) {
    result.push(listType === 'ul' ? '</ul>' : '</ol>');
  }
  
  return result.join('\n');
}

// Process regular paragraphs
function processParagraphs(content: string): string {
  let inTag = false;
  let currentParagraph = "";
  const lines = content.split('\n');
  const result: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line === "") {
      if (currentParagraph) {
        result.push(`<p class="my-2 leading-relaxed text-gray-600">${currentParagraph}</p>`);
        currentParagraph = "";
      }
      continue;
    }
    
    // Special handling for lines that start with #### (Japanese format)
    if (line.startsWith('####')) {
      // If we have a paragraph in progress, finish it
      if (currentParagraph) {
        result.push(`<p class="my-2 leading-relaxed text-gray-600">${currentParagraph}</p>`);
        currentParagraph = "";
      }
      // Add the heading with proper formatting
      result.push(`<h4 class="text-base font-semibold text-gray-800 mt-4 mb-2">${line.substring(5)}</h4>`);
      continue;
    }
    
    // Skip lines that are already wrapped in HTML tags
    if (line.startsWith('<') && !line.startsWith('</')) {
      // If we have a paragraph in progress, finish it
      if (currentParagraph) {
        result.push(`<p class="my-2 leading-relaxed text-gray-600">${currentParagraph}</p>`);
        currentParagraph = "";
      }
      
      result.push(line);
      
      // Check if this is a self-closing tag or has a closing tag on the same line
      inTag = !line.endsWith('/>') && !line.includes('</');
    } 
    // Check if this line is closing a tag
    else if (line.startsWith('</')) {
      result.push(line);
      inTag = false;
    }
    // Part of a tag's content
    else if (inTag) {
      result.push(line);
    }
    // Regular text - add to current paragraph
    else {
      if (currentParagraph) {
        currentParagraph += " " + line;
      } else {
        currentParagraph = line;
      }
    }
  }
  
  // Add any remaining paragraph
  if (currentParagraph) {
    result.push(`<p class="my-2 leading-relaxed text-gray-600">${currentParagraph}</p>`);
  }
  
  return result.join('\n');
}

// Add executive summary styling 
const executiveSummaryStyles = `
.executive-summary p {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.executive-summary ul, 
.executive-summary ol {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
}

.executive-summary hr {
  margin: 1rem 0;
  border-color: #e5e7eb;
}

.executive-summary section {
  margin-bottom: 1.5rem;
}
`;

interface ExecutiveSummaryProps {
  categoryScores: CategoryScore[];
  organizationInfo: Organization | null;
  userRole?: string;
  className?: string;
}

// Progress steps for enhanced loading animation
const PROGRESS_STEPS = {
  en: [
    { step: 1, messageKey: "executiveSummary.loadingSteps.step1", duration: 2000 },
    { step: 2, messageKey: "executiveSummary.loadingSteps.step2", duration: 3000 },
    { step: 3, messageKey: "executiveSummary.loadingSteps.step3", duration: 8000 },
    { step: 4, messageKey: "executiveSummary.loadingSteps.step4", duration: 2000 }
  ],
  ja: [
    { step: 1, messageKey: "executiveSummary.loadingSteps.step1", duration: 2000 },
    { step: 2, messageKey: "executiveSummary.loadingSteps.step2", duration: 3000 },
    { step: 3, messageKey: "executiveSummary.loadingSteps.step3", duration: 8000 },
    { step: 4, messageKey: "executiveSummary.loadingSteps.step4", duration: 2000 }
  ]
};

// Enhanced loading animation component
function EnhancedLoadingAnimation({ language = 'en' }: { language?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(15);
  const { t } = useTranslation(['results']);
  
  const steps = PROGRESS_STEPS[language as keyof typeof PROGRESS_STEPS] || PROGRESS_STEPS.en;
  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
  
  useEffect(() => {
    const startTime = Date.now();
    let stepStartTime = startTime;
    let currentStepIndex = 0;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const stepElapsed = now - stepStartTime;
      
      setTimeElapsed(Math.floor(elapsed / 1000));
      
      // Calculate progress based on current step
      const currentStepDuration = steps[currentStepIndex]?.duration || 1000;
      const stepProgress = Math.min(stepElapsed / currentStepDuration, 1);
      
      // Calculate overall progress
      const completedStepsTime = steps.slice(0, currentStepIndex).reduce((sum, step) => sum + step.duration, 0);
      const currentStepTime = stepProgress * currentStepDuration;
      const totalProgress = Math.min((completedStepsTime + currentStepTime) / totalDuration * 100, 95);
      
      setProgress(totalProgress);
      
      // Update estimated time remaining
      const remaining = Math.max(0, Math.ceil((totalDuration - elapsed) / 1000));
      setEstimatedTimeRemaining(remaining);
      
      // Move to next step if current step is complete
      if (stepElapsed >= currentStepDuration && currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        setCurrentStep(currentStepIndex + 1);
        stepStartTime = now;
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [language]);
  
  const currentStepData = steps[currentStep - 1] || steps[0];
  
  return (
    <div className="p-6 space-y-4">
      {/* Progress header */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          <span>{t('executiveSummary.loadingProgress.stepIndicator', 'Step {{current}} of {{total}}', { 
            current: currentStep, 
            total: steps.length 
          })}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>{t('executiveSummary.loadingProgress.timeElapsed', '{{seconds}}s elapsed', { 
            seconds: timeElapsed 
          })}</span>
          {estimatedTimeRemaining > 0 && (
            <span className="text-gray-400">• {t('executiveSummary.loadingProgress.timeRemaining', '~{{seconds}}s remaining', { 
              seconds: estimatedTimeRemaining 
            })}</span>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Current step message */}
      <div className="text-center">
        <p className="text-gray-700 font-medium">{t(currentStepData.messageKey)}</p>
        <p className="text-sm text-gray-500 mt-1">
          {t('executiveSummary.loadingProgress.poweredByAI', 'Usually takes 10-15 seconds • Powered by AI')}
        </p>
      </div>
      
      {/* Skeleton content preview */}
      <div className="space-y-3 mt-6 opacity-50">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
        <div className="space-y-2 mt-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

export function ExecutiveSummary({ 
  categoryScores, 
  organizationInfo, 
  userRole = 'executive',
  className = ''
}: ExecutiveSummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [formattedSummary, setFormattedSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAllSummary, setShowAllSummary] = useState<boolean>(false);
  const [costAnalysisData, setCostAnalysisData] = useState<any>(null);
  const [costDataLoading, setCostDataLoading] = useState(false);
  const [rawResponsesCache, setRawResponsesCache] = useState<any>(null);
  const [rawResponsesLoading, setRawResponsesLoading] = useState<boolean>(false);
  const [generationCount, setGenerationCount] = useState<number>(0);
  const [maxGenerations, setMaxGenerations] = useState<number>(3);
  const summaryRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { t, i18n } = useTranslation(['results']);
  
  // Apply custom CSS styles
  useEffect(() => {
    // Check if styles already exist before creating new element
    if (!document.getElementById('executive-summary-styles')) {
      // Create style element
      const styleEl = document.createElement('style');
      styleEl.id = 'executive-summary-styles';
      styleEl.innerHTML = executiveSummaryStyles;
      document.head.appendChild(styleEl);
    }
    
    // Cleanup on unmount
    return () => {
      const existingStyle = document.getElementById('executive-summary-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);
  
  // Fetch cost analysis data first
  useEffect(() => {
    if (categoryScores.length > 0 && organizationInfo && !costAnalysisData && !costDataLoading) {
      fetchCostData();
    }
  }, [categoryScores, organizationInfo]);
  
  // Load cached summary on component mount
  useEffect(() => {
    const loadCachedSummary = async () => {
      try {
        const cached = persistenceManager.loadExecutiveSummary();
        if (cached) {
          setSummary(cached);
          logger.debug("Loaded cached executive summary");
        } else if (categoryScores.length > 0 && organizationInfo && !isLoading) {
          // Generate summary automatically if we don't have one cached
          logger.debug("No cached summary found, generating automatically");
          generateSummary();
        }
      } catch (error) {
        logger.debug("Error loading cached summary:", error);
      }
    };
    
    loadCachedSummary();
  }, [categoryScores, organizationInfo]); // Add dependencies so it triggers when data is available

  // Fetch cost analysis data
  const fetchCostData = async () => {
    if (costDataLoading || costAnalysisData) return; // Prevent duplicate calls
    
    try {
      setCostDataLoading(true);
      logger.debug("Fetching cost analysis data for executive summary");
      const analysis = await fetchCostAnalysisFromServer(categoryScores, i18n.language);
      setCostAnalysisData(analysis);
      logger.debug("Cost analysis data loaded for executive summary", analysis);
      return analysis;
    } catch (error) {
      logger.error("Error fetching cost data for executive summary:", error);
    } finally {
      setCostDataLoading(false);
    }
  };

  // Update formatted summary when raw summary changes
  useEffect(() => {
    if (summary) {
      try {
        // Use the new robust JSON extraction and validation
        const validationResult = extractAndValidateExecutiveSummary(summary, i18n.language);
        
        if (validationResult.success && validationResult.data) {
          // Successfully parsed and validated JSON - use enhanced display
          const formatted = buildEnhancedSummaryDisplay(validationResult.data, t, i18n.language);
          setFormattedSummary(formatted);
        } else {
          // Primary validation failed, try partial validation for graceful degradation
          logger.warn('Full validation failed, attempting partial validation:', validationResult.error);
          
          // Try to extract JSON without strict validation
          const partialResult = validatePartialExecutiveSummary(
            extractAndParseJson(summary) || parseExecutiveSummaryJSON(summary)
          );
          
          if (partialResult.success && partialResult.data) {
            const formatted = buildEnhancedSummaryDisplay(partialResult.data, t, i18n.language);
            setFormattedSummary(formatted);
          } else {
            // Both validations failed - treat as plain text
            logger.warn('All JSON parsing attempts failed, treating as plain text:', partialResult.error);
            const formatted = formatSummaryContent(summary, t);
            setFormattedSummary(formatted);
          }
        }
        
      } catch (error) {
        logger.error('Error in summary processing pipeline:', error);
        // Final fallback to plain text formatting
        const formatted = formatSummaryContent(summary, t);
        setFormattedSummary(formatted);
      }
    } else {
      setFormattedSummary('');
    }
  }, [summary, t, i18n.language]); // Added i18n.language as dependency for language-specific processing

  const generateSummary = async () => {
    if (!organizationInfo) {
      toast({
        title: "Missing organization information",
        description: "Organization information is required to generate a summary",
        variant: "destructive"
      });
      return;
    }

    if (categoryScores.length === 0) {
      toast({
        title: "Missing assessment data",
        description: "Assessment scores are required to generate a summary",
        variant: "destructive"
      });
      return;
    }

    if (isLoading) {
      logger.debug("Summary generation already in progress, skipping");
      return;
    }

    setIsLoading(true);
    
    try {
      // Get cost analysis data if not already loaded
      let costData = costAnalysisData;
      if (!costData && !costDataLoading) {
        costData = await fetchCostData();
      }
      
      // Get raw assessment responses (cached)
      const rawResponses = await fetchRawAssessmentResponses();
      
      logger.debug("Generating executive summary with enhanced data", { 
        hasRawResponses: !!rawResponses,
        hasCostData: !!costData,
        categoryScoresCount: categoryScores.length
      });
      
      // Prepare enhanced data for LLM validation
      const enhancedRequestData = {
        // Option C: Raw answered questions for independent analysis
        assessmentResponses: rawResponses,
        
        // Our rule-based analysis for validation
        ruleBasedAnalysis: {
          categoryScores,
          maturityLevels: categoryScores.reduce((acc, cat) => {
            acc[cat.categoryId] = cat.maturityLevel;
            return acc;
          }, {} as Record<string, string>),
          riskAssessments: categoryScores.reduce((acc, cat) => {
            if (cat.riskLevel) acc[cat.categoryId] = cat.riskLevel;
            return acc;
          }, {} as Record<string, string>)
        },
        
        // Cost analysis for validation (if available)
        calculatedCostAnalysis: costData ? {
          quickWins: costData.quickWins,
          totalSavings: costData.formattedTotal,
          savingsPercentage: costData.savingsPercentage,
          assumptions: {
            calculationMethod: "industry-benchmark-with-org-profile",
            confidence: "medium"
          }
        } : null,
        
        // Organization context
        organizationInfo,
        userRole: userRole || 'executive',
        language: i18n.language
      };
      
      // Send enhanced data separately to the API if we have it
      if (rawResponses) {
        // Make a direct API call with enhanced data
        const apiResponse = await apiRequest('POST', '/api/ai/executive-summary', enhancedRequestData);
        
        if (apiResponse.ok) {
          const enhancedResult = await apiResponse.json();
          if (enhancedResult && typeof enhancedResult === 'object' && 'content' in enhancedResult) {
            // enhancedResult.content contains the full JSON string with executiveSummary and detailedAnalysis
            const enhancedJsonContent = enhancedResult.content;
            setSummary(enhancedJsonContent);
            persistenceManager.saveExecutiveSummary(enhancedJsonContent);
            
            // Increment generation count in UI
            setGenerationCount(prev => prev + 1);
            
            return;
          }
        } else if (apiResponse.status === 429) {
          // Handle generation limit exceeded
          const errorData = await apiResponse.json();
          
          // Update generation count from error response
          if (errorData.currentCount !== undefined) {
            setGenerationCount(errorData.currentCount);
          }
          if (errorData.maxGenerations !== undefined) {
            setMaxGenerations(errorData.maxGenerations);
          }
          
          toast({
            title: t('executiveSummary.rateLimitTitle', 'Generation limit reached'),
            description: t('executiveSummary.rateLimitMessage', 
              'You have reached the maximum number of regenerations (3) for this session. Please start a new assessment to generate more summaries.'
            ),
            variant: "destructive"
          });
          return; // Don't fallback to regular generation
        } else {
          const errorText = await apiResponse.text();
        }
      }

      // Fallback to original AI service call if enhanced call failed or no raw responses
      try {
        const result = await generateExecutiveSummary(
          categoryScores, // Keep for backward compatibility
          organizationInfo,
          userRole || 'executive',
          undefined,
          i18n.language,
          [] // Pass empty array for backward compatibility with recommendations parameter
        );
        
        // Process the fallback result
        if (result && typeof result === 'string') {
          setSummary(result);
          persistenceManager.saveExecutiveSummary(result);
          // Increment generation count in UI
          setGenerationCount(prev => prev + 1);
        } else if (result && typeof result === 'object' && 'content' in result) {
          setSummary((result as any).content);
          persistenceManager.saveExecutiveSummary((result as any).content);
          // Increment generation count in UI
          setGenerationCount(prev => prev + 1);
        } else {
          throw new Error("Failed to generate summary");
        }
      } catch (fallbackError) {
        // Check if the fallback error is a 429 error (generation limit exceeded)
        if (fallbackError instanceof Error && fallbackError.message.includes('429')) {
          // Simple 429 handling without complex JSON parsing
          toast({
            title: t('executiveSummary.rateLimitTitle', 'Generation limit reached'),
            description: t('executiveSummary.rateLimitMessage', 
              'You have reached the maximum number of regenerations (3) for this session. Please start a new assessment to generate more summaries.'
            ),
            variant: "destructive"
          });
          return;
        }
        
        // Re-throw other errors to be handled by the outer catch block
        throw fallbackError;
      }
    } catch (error) {
      logger.error("Error generating summary:", error);
      toast({
        title: "Error generating summary",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized function to fetch raw assessment responses (prevents duplicate calls)
  const fetchRawAssessmentResponses = async () => {
    // Return cached responses if available
    if (rawResponsesCache) {
      logger.debug("Using cached raw assessment responses");
      return rawResponsesCache;
    }

    // If already loading, wait for the existing request
    if (rawResponsesLoading) {
      logger.debug("Raw responses already loading, waiting...");
      return new Promise((resolve) => {
        const checkCache = () => {
          if (rawResponsesCache) {
            resolve(rawResponsesCache);
          } else if (!rawResponsesLoading) {
            resolve(null);
          } else {
            setTimeout(checkCache, 100);
          }
        };
        checkCache();
      });
    }

    setRawResponsesLoading(true);
    
    try {
      logger.debug("Fetching raw assessment responses");
      const response = await apiRequest('GET', '/api/assessment/responses', null);
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessment responses');
      }
      
      const responses = await response.json();
      
      // Group responses by category and include question details
      const responsesByCategory: Record<string, any[]> = {};
      
      for (const resp of responses) {
        // Skip "don't know" responses for analysis, but track them separately
        if (resp.score === -1 || resp.dontKnow) continue;
        
        // Find the question details (you might want to adjust this based on your data structure)
        const questionCategory = resp.questionId.split('_')[0] + '_';
        const categoryMap: Record<string, string> = {
          'fc_': 'foundations_culture',
          'aa_': 'application_architecture',
          'cicd_': 'cicd_practices',
          'dora_': 'dora_metrics',
          'bvs_': 'business_value_strategy',
          'ci_': 'container_infrastructure',
          'sc_': 'security_compliance',
          'obs_': 'observability',
          'finops_': 'finops_cost_management',
          'mod_': 'app_migration_modernization',
          'ip_': 'infrastructure_platform',
          'dm_': 'data_management',
          'ops_': 'operations_resilience',
          'mch_': 'multicloud_hybrid_governance',
          'aiml_': 'ai_ml_integration'
        };
        
        const categoryId = Object.entries(categoryMap).find(([prefix]) => 
          resp.questionId.startsWith(prefix)
        )?.[1] || 'unknown';
        
        if (!responsesByCategory[categoryId]) {
          responsesByCategory[categoryId] = [];
        }
        
        responsesByCategory[categoryId].push({
          questionId: resp.questionId,
          score: resp.score,
          // You might want to include question text here if available
        });
      }
      
      // Count knowledge gaps separately
      const knowledgeGaps = responses.filter((r: any) => r.score === -1 || r.dontKnow);
      
      const processedResponses = {
        answeredQuestions: responsesByCategory,
        knowledgeGaps: knowledgeGaps.length,
        knowledgeGapsByCategory: knowledgeGaps.reduce((acc: Record<string, number>, gap: any) => {
          const questionCategory = gap.questionId.split('_')[0] + '_';
          const categoryMap: Record<string, string> = {
            'fc_': 'foundations_culture',
            'aa_': 'application_architecture',
            'cicd_': 'cicd_practices',
            'dora_': 'dora_metrics',
            'bvs_': 'business_value_strategy',
            'ci_': 'container_infrastructure',
            'sc_': 'security_compliance',
            'obs_': 'observability',
            'finops_': 'finops_cost_management',
            'mod_': 'app_migration_modernization',
            'ip_': 'infrastructure_platform',
            'dm_': 'data_management',
            'ops_': 'operations_resilience',
            'mch_': 'multicloud_hybrid_governance',
            'aiml_': 'ai_ml_integration'
          };
          
          const categoryId = Object.entries(categoryMap).find(([prefix]) => 
            gap.questionId.startsWith(prefix)
          )?.[1] || 'unknown';
          
          acc[categoryId] = (acc[categoryId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      // Cache the responses
      setRawResponsesCache(processedResponses);
      logger.debug("Cached raw assessment responses");
      return processedResponses;
      
    } catch (error) {
      logger.warn("Could not fetch raw assessment responses, falling back to scores only:", error);
      return null;
    } finally {
      setRawResponsesLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (summaryRef.current) {
      // Get the text content without HTML tags
      const text = summaryRef.current.innerText || summaryRef.current.textContent || '';
      
      navigator.clipboard.writeText(text)
        .then(() => {
          toast({
            title: "Copied to clipboard",
            variant: "default"
          });
        })
        .catch((err) => {
          logger.debug("Could not copy text: ", err);
          toast({
            title: "Failed to copy",
            description: "Please try again",
            variant: "destructive"
          });
        });
    }
  };

  const toggleShowAllSummary = () => {
    setShowAllSummary(!showAllSummary);
  };

  // Skip rendering if no organization info
  if (!organizationInfo) {
    return null;
  }

  const summaryRoleLabel = userRole ? 
    t(`roles.${userRole.toLowerCase()}`, userRole) : 
    t('roles.executive', 'Executive');

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md h-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          {t('sections.executiveSummary', 'Executive Summary')}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {t('executiveSummary.tailoredFor', 'Tailored for {{role}}', { role: summaryRoleLabel })}
          </div>
          {generationCount > 0 && (
            <div className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {t('executiveSummary.generationCount', '{{current}}/{{max}} generations', { 
                current: generationCount, 
                max: maxGenerations 
              })}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <EnhancedLoadingAnimation language={i18n.language} />
      ) : summary ? (
        <div className={`executive-summary overflow-hidden ${showAllSummary ? '' : 'max-h-60'}`}>
          <div 
            ref={summaryRef}
            className="text-gray-600 px-4 py-2"
            dangerouslySetInnerHTML={{ __html: formattedSummary }} 
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500 mb-3" />
          <p className="text-gray-600 px-4">
            {t('executiveSummary.noSummary', 'No executive summary available. Generate one to get insights tailored for your role.')}
          </p>
          <Button 
            onClick={generateSummary}
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('executiveSummary.generate', 'Generate Summary')}
          </Button>
        </div>
      )}

      {summary && (
        <div className="text-sm flex justify-between items-center mt-4 pt-4">
          <button 
            onClick={toggleShowAllSummary} 
            className="text-blue-600 hover:text-blue-700 flex items-center font-semibold"
          >
            {showAllSummary 
              ? t('executiveSummary.showLess', 'Show less') 
              : t('executiveSummary.viewAll', 'View all summary')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={generateSummary}
              disabled={isLoading}
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              {t('executiveSummary.regenerate', 'Regenerate')}
            </button>
            <button 
              onClick={copyToClipboard}
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded text-sm"
            >
              <Copy className="h-4 w-4 mr-1" />
              {t('executiveSummary.copy', 'Copy to clipboard')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to build enhanced summary display for new JSON format
function buildEnhancedSummaryDisplay(jsonData: any, t: any, language: string = 'en'): string {
  const parts: string[] = [];
  
  // Language-aware period handling helper
  const addPeriodIfNeeded = (text: string): string => {
    const trimmed = text.trim();
    // Don't add periods for Japanese content
    if (language === 'ja') return trimmed;
    return trimmed + (trimmed.endsWith('.') ? '' : '.');
  };
  
  // Ensure we have the basic structure
  if (!jsonData || (!jsonData.executiveSummary && !jsonData.detailedAnalysis)) {
    logger.warn("buildEnhancedSummaryDisplay: Invalid JSON structure", jsonData);
    return `<p class="text-red-600">Invalid executive summary format received</p>`;
  }
  
  // Overall Maturity
  if (isValidString(jsonData.executiveSummary?.overallMaturityLevel)) {
    const maturityLevel = sanitizeHtml(jsonData.executiveSummary.overallMaturityLevel);
    parts.push(`<div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-3">${t('executiveSummary.overallMaturity', 'Overall Maturity')}</h2>
      <div class="bg-blue-50 border-l-4 border-blue-400 p-2 rounded-r-lg flex items-center">
        <p class="text-blue-800 font-medium text-lg m-0">${maturityLevel}</p>
      </div>
    </div>`);
  }
  
  // Key Findings
  if (isValidArray(jsonData.executiveSummary?.keyFindings)) {
    const findings = jsonData.executiveSummary.keyFindings
      .filter((finding: any) => isValidString(finding))
      .map((finding: string) => sanitizeHtml(finding));
    
    if (findings.length > 0) {
      parts.push(`<div class="mb-6">
        <h3 class="text-base font-semibold text-gray-800 mt-4 mb-2">${t('executiveSummary.keyFindings', 'Key Findings')}</h3>
        <ul class="my-2 space-y-1">
          ${findings.map((finding: string) => 
            `<li class="flex mb-1"><span class="mr-2 text-blue-600">•</span><span>${finding}</span></li>`
          ).join('')}
        </ul>
      </div>`);
    }
  }
  
  // Strengths (moved up for better executive flow)
  if (isValidArray(jsonData.detailedAnalysis?.strengths)) {
    const strengths = jsonData.detailedAnalysis.strengths
      .filter((strength: any) => isValidString(strength))
      .map((strength: string) => sanitizeHtml(strength));
    
    if (strengths.length > 0) {
      parts.push(`<div class="mb-6">
        <h3 class="text-base font-semibold text-gray-800 mt-4 mb-2">${t('executiveSummary.strengths', 'Strengths')}</h3>
        <ul class="my-2 space-y-1">
          ${strengths.map((strength: string) => 
            `<li class="flex mb-1"><span class="mr-2 text-green-600">✓</span><span>${strength}</span></li>`
          ).join('')}
        </ul>
      </div>`);
    }
  }
  
  // Areas for Improvement (moved up for better executive flow)
  if (isValidArray(jsonData.detailedAnalysis?.areasForImprovement)) {
    const areas = jsonData.detailedAnalysis.areasForImprovement
      .filter((area: any) => isValidString(area))
      .map((area: string) => sanitizeHtml(area));
    
    if (areas.length > 0) {
      parts.push(`<div class="mb-6">
        <h3 class="text-base font-semibold text-gray-800 mt-4 mb-2">${t('executiveSummary.areasForImprovement', 'Areas for Improvement')}</h3>
        <ul class="my-2 space-y-1">
          ${areas.map((area: string) => 
            `<li class="flex mb-1"><span class="mr-2 text-amber-600">⚠</span><span>${area}</span></li>`
          ).join('')}
        </ul>
      </div>`);
    }
  }
  
  // Strategic Recommendations (moved up for better executive flow)
  if (isValidArray(jsonData.detailedAnalysis?.strategicRecommendations)) {
    const recommendations = jsonData.detailedAnalysis.strategicRecommendations
      .filter((rec: any) => isValidString(rec))
      .map((rec: string) => sanitizeHtml(rec));
    
    if (recommendations.length > 0) {
      parts.push(`<div class="mb-6">
        <h3 class="text-base font-semibold text-gray-800 mt-4 mb-2">${t('executiveSummary.recommendations', 'Strategic Recommendations')}</h3>
        <ol class="my-2 space-y-1">
          ${recommendations.map((rec: string, index: number) => 
            `<li class="flex mb-1"><span class="mr-2 text-gray-700 font-medium">${index + 1}.</span><span>${rec}</span></li>`
          ).join('')}
        </ol>
      </div>`);
    }
  }
  
  // Business Impact (moved up for better executive flow)
  if (isValidString(jsonData.detailedAnalysis?.businessImpact)) {
    // Extract key metrics and format for better readability
    let businessImpactText = sanitizeHtml(jsonData.detailedAnalysis.businessImpact);
    
    // Try to extract and highlight dollar amounts and percentages with safer regex
    businessImpactText = businessImpactText
      .replace(/\$[\d,]+(?:\.\d{2})?/g, '<strong class="text-green-900 font-bold">$&</strong>')
      .replace(/(\d+(?:\.\d+)?%)/g, '<strong class="text-green-900 font-bold">$1</strong>');
    
    // Break into paragraphs for better readability with safer splitting
    const impactParagraphs = businessImpactText
      .split(/\.\s+(?=[A-Z\u4e00-\u9fff])/) // Include Unicode range for Japanese/Chinese characters
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => addPeriodIfNeeded(p));
    
    const formattedImpactParagraphs = impactParagraphs
      .map((paragraph: string) => `<p class="mb-3 leading-relaxed text-green-800">${paragraph}</p>`)
      .join('');
    
    parts.push(`<div class="mb-6">
      <h3 class="text-base font-semibold text-gray-800 mt-4 mb-2">${t('executiveSummary.businessImpact', 'Business Impact')}</h3>
      <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
        ${formattedImpactParagraphs}
      </div>
    </div>`);
  }
  
  // Implementation Guidance (moved up for better executive flow)
  if (isValidString(jsonData.detailedAnalysis?.implementationGuidance)) {
    let guidanceText = sanitizeHtml(jsonData.detailedAnalysis.implementationGuidance);
    
    // Improved detection: only detect actual numbered lists, not timeline references
    // Look for patterns like "1. Action" or "1) Step" at the start of lines/sentences
    const hasNumberedSteps = /(?:^|\.\s+)(\d+)[\)\.]?\s+[A-Z\u4e00-\u9fff]/.test(guidanceText);
    
    if (hasNumberedSteps) {
      // Split by actual numbered list items (more precise pattern)
      const steps = guidanceText
        .split(/(?=(?:^|\.\s+)\d+[\)\.]?\s+[A-Z\u4e00-\u9fff])/) // Split before actual list items
        .filter((step: string) => step.trim().length > 0)
        .map((step: string) => {
          // Match actual list items with more precise pattern
          const match = step.match(/(?:^|\.\s+)(\d+)[\)\.]?\s+([A-Z\u4e00-\u9fff][\s\S]*)/);
          if (match) {
            const [, number, content] = match;
            // Highlight timeframes and percentages in the content with safer patterns
            const formattedContent = content
              .replace(/(\d+\s*(?:months?|quarters?|weeks?|days?|ヶ月|週間|日))/gi, '<strong class="text-indigo-900">$1</strong>')
              .replace(/(\d+(?:\.\d+)?%)/g, '<strong class="text-indigo-900">$1</strong>')
              .replace(/(Month\s+\d+)/gi, '<strong class="text-indigo-900">$1</strong>'); // Highlight "Month X" references
            return `<li class="flex mb-3"><span class="mr-3 text-indigo-700 font-bold text-sm">${number}.</span><span class="leading-relaxed">${formattedContent}</span></li>`;
          }
          // If it doesn't match the list pattern, treat as regular content
          const formattedStep = step
            .replace(/(\d+\s*(?:months?|quarters?|weeks?|days?|ヶ月|週間|日))/gi, '<strong class="text-indigo-900">$1</strong>')
            .replace(/(\d+(?:\.\d+)?%)/g, '<strong class="text-indigo-900">$1</strong>')
            .replace(/(Month\s+\d+)/gi, '<strong class="text-indigo-900">$1</strong>');
          return `<li class="mb-2 leading-relaxed">${formattedStep.trim()}</li>`;
        });
      
      parts.push(`<div class="mb-6">
        <h3 class="text-base font-semibold text-gray-800 mt-4 mb-2">${t('executiveSummary.implementationGuidance', 'Implementation Guidance')}</h3>
        <div class="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
          <ol class="space-y-2 text-indigo-800">
            ${steps.join('')}
          </ol>
        </div>
      </div>`);
    } else {
      // No numbered steps, break into paragraphs and highlight key terms
      guidanceText = guidanceText
        .replace(/(\d+\s*(?:months?|quarters?|weeks?|days?|ヶ月|週間|日))/gi, '<strong class="text-indigo-900">$1</strong>')
        .replace(/(\d+(?:\.\d+)?%)/g, '<strong class="text-indigo-900">$1</strong>')
        .replace(/(Month\s+\d+)/gi, '<strong class="text-indigo-900">$1</strong>'); // Highlight "Month X" references
      
      const guidanceParagraphs = guidanceText
        .split(/\.\s+(?=[A-Z\u4e00-\u9fff])/) // Include Unicode range for Japanese/Chinese characters
        .filter((p: string) => p.trim().length > 0)
        .map((p: string) => addPeriodIfNeeded(p));
      
      const formattedGuidanceParagraphs = guidanceParagraphs
        .map((paragraph: string) => `<p class="mb-3 leading-relaxed text-indigo-800">${paragraph}</p>`)
        .join('');
      
      parts.push(`<div class="mb-6">
        <h3 class="text-base font-semibold text-gray-800 mt-4 mb-2">${t('executiveSummary.implementationGuidance', 'Implementation Guidance')}</h3>
        <div class="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
          ${formattedGuidanceParagraphs}
        </div>
      </div>`);
    }
  }
  
  // Detailed Analysis Content (moved to bottom and improved formatting)
  if (isValidString(jsonData.detailedAnalysis?.content)) {
    // Break the content into paragraphs for better readability
    const contentParagraphs = sanitizeHtml(jsonData.detailedAnalysis.content)
      .split(/\.\s+(?=[A-Z\u4e00-\u9fff])/) // Include Unicode range for Japanese/Chinese characters
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => addPeriodIfNeeded(p));
    
    const formattedParagraphs = contentParagraphs
      .map((paragraph: string) => `<p class="mb-3 leading-relaxed text-gray-600">${paragraph}</p>`)
      .join('');
    
    parts.push(`<div class="mb-6">
      <h3 class="text-base font-semibold text-gray-800 mt-6 mb-3">${t('executiveSummary.detailedAnalysis', 'Detailed Analysis')}</h3>
      <div class="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-lg">
        ${formattedParagraphs}
      </div>
    </div>`);
  }
  
  // AI Validation Insights (kept at bottom) - HIDDEN PER USER REQUEST
  /*
  if (jsonData.validation) {
    const validationParts: string[] = [];
    
    if (isValidString(jsonData.validation.additionalInsights)) {
      validationParts.push(`<p class="my-2 leading-relaxed text-gray-600"><strong>${t('executiveSummary.additionalInsights', 'Additional Insights')}:</strong> ${sanitizeHtml(jsonData.validation.additionalInsights)}</p>`);
    }
    
    if (isValidString(jsonData.validation.costAnalysisValidation)) {
      validationParts.push(`<p class="my-2 leading-relaxed text-gray-600"><strong>${t('executiveSummary.costAnalysisValidation', 'Cost Analysis Validation')}:</strong> ${sanitizeHtml(jsonData.validation.costAnalysisValidation)}</p>`);
    }
    
    if (isValidString(jsonData.validation.ruleBasedAgreement)) {
      validationParts.push(`<p class="my-2 leading-relaxed text-gray-600"><strong>${t('executiveSummary.ruleBasedAgreement', 'Rule-Based Agreement')}:</strong> ${sanitizeHtml(jsonData.validation.ruleBasedAgreement)}</p>`);
    }
    
    if (isValidString(jsonData.validation.confidenceLevel)) {
      validationParts.push(`<p class="my-2 leading-relaxed text-gray-600"><strong>${t('executiveSummary.aiConfidence', 'AI Confidence')}:</strong> ${sanitizeHtml(jsonData.validation.confidenceLevel)}</p>`);
    }
    
    if (validationParts.length > 0) {
      parts.push(`<div class="mb-6">
        <h3 class="text-base font-semibold text-gray-800 mt-4 mb-2">${t('executiveSummary.aiValidation', 'AI Validation')}</h3>
        <div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
          ${validationParts.join('')}
        </div>
      </div>`);
    }
  }
  */
  
  // If no parts were generated, provide a fallback
  if (parts.length === 0) {
    logger.warn("buildEnhancedSummaryDisplay: No valid content sections found", {
      hasExecutiveSummary: !!jsonData.executiveSummary,
      hasDetailedAnalysis: !!jsonData.detailedAnalysis,
      hasValidation: !!jsonData.validation,
      jsonKeys: Object.keys(jsonData)
    });
    return `<div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <p class="text-amber-800">Executive summary data received but no recognizable content structure found. Please regenerate the summary.</p>
    </div>`;
  }
  
  logger.debug("buildEnhancedSummaryDisplay: Generated content parts", { partsCount: parts.length });
  return parts.join('');
}
