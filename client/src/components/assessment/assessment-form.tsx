import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProgressBar } from "./progress-bar";
import { QuestionSection } from "./question-section";
import { KnowledgeGapGuidance } from "./knowledge-gap-guidance";
import { KnowledgeResourcesModal } from "./knowledge-resources-modal";
import { ASSESSMENT_STEPS, ASSESSMENT_CATEGORIES, ASSESSMENT_MODULES } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { AssessmentQuestion, AssessmentResponse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  getStoredAssessmentType, 
  isLastCategory, 
  getNextStep,
  getCategoriesForAssessmentType,
  getTotalCategoriesCount,
  getCategoryPosition,
  type AssessmentType,
  getPreviousStep
} from "@/lib/assessmentFlowService";
import { useTranslation } from "react-i18next";
import { persistenceManager, STORAGE_KEYS } from "@/lib/assessmentUtils";
import { VerticalProgress } from "./vertical-progress";
import { useQuestionDependencyFilter } from "@/hooks/useQuestionDependencyFilter";
import { logger } from '@/lib/logger';
import { useAssessmentQuestions } from "@/hooks/useAssessmentQuestions";
import { useKnowledgeGapGuidance } from "@/hooks/useKnowledgeGapGuidance";

/**
 * @interface FormData
 * @description フォームデータの型定義
 */
interface FormData {
  formattedResponses?: Array<{
    questionId: string;
    score: number;
    dontKnow?: boolean;
  }>;
}

/**
 * @function useFormData
 * @description ローカルストレージを使用したフォームデータの保存と読み込みを行うフック
 * アセスメントフォームのデータをローカルストレージに永続化します。
 * @returns {{data: FormData, update: Function}} データと更新関数を含むオブジェクト
 */
function useFormData() {
  /**
   * @function saveData
   * @description データをローカルストレージに保存します
   * @param {FormData} data - 保存するデータ
   */
  const saveData = (data: FormData) => {
    try {
      // Use the persistenceManager utility instead of direct localStorage access
      persistenceManager.saveFormData(STORAGE_KEYS.ASSESSMENT_FORM_DATA, data);
    } catch (error) {
      logger.error("Error saving form data:", error);
    }
  };
  
  /**
   * @function loadData
   * @description ローカルストレージからデータを読み込みます
   * @returns {FormData} 保存されていたデータまたは空のオブジェクト
   */
  const loadData = (): FormData => {
    try {
      // Use the persistenceManager utility instead of direct localStorage access
      return persistenceManager.loadFormData(STORAGE_KEYS.ASSESSMENT_FORM_DATA, {}) as FormData;
    } catch (error) {
      logger.error("Error loading form data:", error);
      return {};
    }
  };
  
  return {
    data: loadData(),
    update: saveData
  };
}

interface AssessmentFormProps {
  categoryId: string;
  setResponse: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setQuestion: (data: any) => void;
}

export function AssessmentForm({ categoryId, setResponse, setQuestion}: AssessmentFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation(['common', 'assessment']);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [dontKnowResponses, setDontKnowResponses] = useState<Record<string, boolean>>({});
  const [isFormComplete, setIsFormComplete] = useState(false);
  // State to manage knowledge resources modal - moved to top level
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const { data, update } = useFormData();
  const [questionIdChoose, setQuestionIdChoose] = useState<string>('');

  const category = ASSESSMENT_CATEGORIES.find(cat => cat.id === categoryId);
  if (!category) {
    navigate("/");
    return null;
  }

  // Get all assessment category steps (excluding welcome, instructions, org info, processing, results)
  const assessmentCategorySteps = [
    { id: "organization", label: "Organization", path: "/organization-info" },
    ...ASSESSMENT_STEPS.filter(
      step => ASSESSMENT_CATEGORIES.some(cat => cat.id === step.id)
    )
  ];


  // Get the currently selected assessment type using our flow service
  const assessmentType = getStoredAssessmentType();
  
  // Add debug logging for the assessment type
  logger.debug("AssessmentForm - Assessment Type", { 
    assessmentType, 
    categoriesForType: getCategoriesForAssessmentType(assessmentType as AssessmentType),
    securityIncluded: getCategoriesForAssessmentType(assessmentType as AssessmentType).includes("security_compliance")
  });

  // Add the first step "organization" to the relevant categories
  const relevantCategories = [
    "organization",
    ...getCategoriesForAssessmentType(assessmentType as AssessmentType)
  ];

  // Get the current step index among assessment categories
  const currentStepIndex = assessmentCategorySteps.findIndex(step => step.id === categoryId);
  const currentCategoryIndex = assessmentCategorySteps.findIndex(step => step.id === categoryId);
  

  // Calculate progress based on the categories using our flow service
  const totalCategories = getTotalCategoriesCount(assessmentType);

  // Get the actual category position (1-based index) using the flow service
  const categoryPosition = getCategoryPosition(categoryId, assessmentType as AssessmentType);

  // Calculate progress to reach 100% on the last category
  const progress = Math.min(100, Math.round((categoryPosition / totalCategories) * 100));

  // Calculate total steps including organization form
  const totalSteps = totalCategories + 1; // +1 for organization step

  // Add debug for progress calculation
  logger.debug(`Progress calculation: Assessment type=${assessmentType}, Category=${categoryId}, Position=${categoryPosition}/${totalCategories}, Progress=${progress}%`);
  
  
  // Fetch questions for this category
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language?.split('-')[0] || 'en';
  
  // Use our new hook to get questions with local storage priority
  const {
    questions: filteredQuestions,
    isLoading,
    fromLocalStorage
  } = useAssessmentQuestions(categoryId, currentLanguage);

  // Debug comments for diagnosis
  logger.debug(`Category: ${categoryId}, Questions loaded: ${filteredQuestions.length}, From local storage: ${fromLocalStorage}`);
  
  // Get count of "I don't know" responses
  const dontKnowCount = Object.values(responses).filter(value => value === -1).length;
  
  // Use the clean knowledge gap guidance hook - MUST be called at top level
  const knowledgeGapGuidance = useKnowledgeGapGuidance(
    dontKnowCount,
    filteredQuestions?.length || 1, // Safe default to avoid division by zero
    categoryId
  );

  // Save responses mutation
  const { mutate: saveResponses, isPending } = useMutation({
    mutationFn: async (responses: AssessmentResponse[]) => {
      logger.debug("Sending responses to server", { count: responses.length });
      const res = await apiRequest("POST", "/api/assessment/responses", responses);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessment/responses"] });
      // Always navigate to processing on final submission
      navigate("/processing");
    },
    onError: (error) => {
      toast({
        title: t('error'),
        description: t('assessment:errors.failedToSave', { 
          defaultValue: 'Failed to save responses: {{message}}',
          message: error.message || 'Unknown error'
        }),
        variant: "destructive",
      });
      
      // Even on error, try to navigate to processing
      navigate("/processing");
    },
  });

  // Check if all questions have been answered whenever responses change
  useEffect(() => {
    if (!filteredQuestions || filteredQuestions.length === 0) return;
    
    // Check if all questions have been answered
    const allQuestionsAnswered = filteredQuestions.every(question => {
        const isDependencyMet = question.dependencies?.every(dep => {
          const responseValue = responses[dep.questionId];
          return responseValue !== undefined && responseValue >= dep.minValue;
        }) ?? true; // true if no dependencies
    
        // If dependencies are met, check that this question has been answered
        if (isDependencyMet) {
          return responses[question.id] !== undefined;
        }
    
        // If dependencies not met, we consider this question as "not required"
        return true;
      }
    );
    setIsFormComplete(allQuestionsAnswered);
  }, [filteredQuestions, responses]);

  // Separate useEffect for loading saved responses - only runs on initial load
  useEffect(() => {
    if (!filteredQuestions || filteredQuestions.length === 0 || !data.formattedResponses) return;
    
    // Skip if we already have responses loaded (prevents update loops)
    if (Object.keys(responses).length > 0) return;
    
    logger.debug(`Loading saved responses for category: ${categoryId}`);
    
    const updatedResponses: Record<string, number> = {};
    const categoryQuestionIds = filteredQuestions.map(q => q.id);
    
    // First, try to load from localStorage (client-side persistence)
    data.formattedResponses.forEach(({ questionId, score }: { questionId: string, score: number }) => {
      // Only restore responses for questions in the current category
      if (categoryQuestionIds.includes(questionId)) {
        updatedResponses[questionId] = score;
      }
    });
    
    // Only update state if we actually have restored responses
    if (Object.keys(updatedResponses).length > 0) {
      logger.debug(`Setting restored responses, count: ${Object.keys(updatedResponses).length}`);
      setResponses(updatedResponses);
      setResponse(updatedResponses);
    }
    
  // Only depend on loaded data and filtered questions - NOT responses
  }, [categoryId, filteredQuestions, data.formattedResponses]);

  // Use the custom hook to filter questions based on dependencies
  const visibleQuestions = useQuestionDependencyFilter(filteredQuestions, responses);
  
  // Update visible questions in useEffect to avoid setState during render
  useEffect(() => {
    setQuestion(visibleQuestions);
  }, [visibleQuestions, setQuestion]);

  const handleResponseChange = (questionId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    setResponse(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Helper function to determine if current category is the last in the assessment
  const isLastCategoryForAssessmentType = (categoryId: string, assessmentType: string) => {
    // Add detailed debug logging
    logger.debug(`Checking if ${categoryId} is last category for ${assessmentType} assessment`);
    
    // Get the categories for this assessment type
    const categoriesForType = getCategoriesForAssessmentType(assessmentType as AssessmentType);
    
    // Find the current category's position
    const currentIndex = categoriesForType.indexOf(categoryId);
    
    // Determine if this is the last category
    const isLast = currentIndex === categoriesForType.length - 1;
    logger.debug(`Category ${categoryId} is ${isLast ? '' : 'not '}the last for ${assessmentType}`);
    
    return isLast;
  };

  const handleSubmit = () => {
    if (!filteredQuestions) return;

    if (!isFormComplete) {
      toast({
        title: t('warning'),
        description: t('assessment:responses.submitWarning', 'Please answer all questions before proceeding'),
        variant: "destructive",
      });
      return;
    }
    
    // Use the helper function to merge responses
    const allResponses = mergeWithPreviousResponses();
    
    logger.debug(`Saving ${allResponses.length} responses to localStorage`);
    
    // Save all merged responses to localStorage
    update({ formattedResponses: allResponses });
    // Check if current category is the last one for this assessment type
    const isLastForType = isLastCategoryForAssessmentType(categoryId, assessmentType);
    
    if (isLastForType) {
      // FINAL SUBMISSION: Send all responses to the server
      saveResponses(allResponses as any); 
      // Navigation is handled in the mutation's onSuccess/onError
    } else {
      // MID-ASSESSMENT: Just navigate to next step, no server saving
      logger.debug("Moving to next category");
      const nextStep = getNextStep(categoryId, assessmentType as AssessmentType);
      if (nextStep) {
        setResponse({});
        setQuestion([]);
        navigate(nextStep.path);
      }
    }
  };

  const handlePrevious = () => {
    // Save current responses before navigating away
    if (filteredQuestions && filteredQuestions.length > 0) {
      // Format current responses for saving
      const formattedResponses = Object.entries(responses).map(([questionId, score]) => ({
        questionId,
        score,
        dontKnow: score === -1 ? true : false,
      }));
      
      // Get previous saved responses and merge with current
      const previousResponses = data.formattedResponses || [];
      
      // Keep responses from other categories and add current responses
      const updatedFormattedResponses = [
        ...previousResponses.filter((r: any) => !filteredQuestions.some(q => q.id === r.questionId)),
        ...formattedResponses
      ];
      
      logger.debug("Saving responses before navigating to previous page");
      update({ formattedResponses: updatedFormattedResponses });
      
      // No backend saving on navigation - only localStorage
    }
    
    // Use the assessmentFlowService for consistent navigation
    const previousStep = getPreviousStep(categoryId, assessmentType as AssessmentType);
    
    if (previousStep) {
      logger.debug(`Navigating to previous step: ${previousStep.id}`);
      navigate(previousStep.path);
    } else {
      logger.debug(`No previous step found for ${categoryId}`);
    }
  };

  // Helper function to merge current responses with previously saved ones
  const mergeWithPreviousResponses = () => {
    if (!filteredQuestions || filteredQuestions.length === 0) return [];
    
    // Format current responses for saving
    const formattedResponses = Object.entries(responses).map(([questionId, score]) => ({
      questionId,
      score,
      dontKnow: score === -1 ? true : false,
    }));
    
    // Get previously saved responses
    const previousResponses = data.formattedResponses || [];
    
    // Get current category question IDs
    const categoryQuestionIds = filteredQuestions.map(q => q.id);
    
    // Keep responses from other categories and add current responses
    const updatedFormattedResponses = [
      ...previousResponses.filter((r: any) => !categoryQuestionIds.includes(r.questionId)),
      ...formattedResponses
    ];
    
    logger.debug(`Merged responses count: ${updatedFormattedResponses.length}`);
    return updatedFormattedResponses;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mb-4"></div>
              <div className="mt-4 text-gray-600">{t('loading')}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If there are no questions for this category, automatically proceed to the next category
  if (!filteredQuestions || filteredQuestions.length === 0) {
    // Check if category should be included in this assessment type using our flow service
    const categoriesForType = getCategoriesForAssessmentType(assessmentType);
    const categoryIsIncluded = categoriesForType.includes(categoryId);
    
    logger.debug(`Category ${categoryId} included in assessment type ${assessmentType}: ${categoryIsIncluded}`);
    
    if (!categoryIsIncluded) {
      // Check if current category is the last one for FULL assessment
      const isLastFullCategory = categoryId === "data_management";
      
      // Check if we're reaching the last relevant category for this assessment type
      const isLastRelevantCategory = isLastCategoryForAssessmentType(categoryId, assessmentType);
      
      // If it's the last relevant category or we've reached the end of all categories
      if (isLastRelevantCategory || isLastFullCategory) {
        setTimeout(() => {
          navigate("/processing");
        }, 50);
      } else {
        // Otherwise, navigate to the next step using our flow service
        setTimeout(() => {
          const nextStep = getNextStep(categoryId, assessmentType as AssessmentType);
          if (nextStep) {
            navigate(nextStep.path);
          }
        }, 50);
      }
      
      // Show loading state briefly
      return (
        <div className="p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                <div className="mt-4 text-gray-600">{t('assessment:navigation.navigating', 'Navigating to the next relevant category...')}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // For categories that should be included but have no questions (possible server error)
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <div className="text-red-500 text-5xl mb-4">
                <i className="ri-error-warning-line"></i>
              </div>
              <h2 className="text-xl font-medium text-gray-800 mb-2">
                {t('assessment:errors.noQuestions.title', 'No questions found')}
              </h2>
              <p className="text-gray-600">
                {t('assessment:errors.noQuestions.message', 'There are no questions available for this category. Please try a different category or contact support.')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get the translated category title
  const categoryTitle = t(`assessment:categories.${category.id}`, category.title);
  const dontKnowPercentage = Math.round((dontKnowCount / filteredQuestions.length) * 100);
  const showKnowledgeGapGuidance = dontKnowCount > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="mb-6 bg-white shadow-md border-0">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">{categoryTitle} {t('assessment:assessment')}</h2>
          <p className="text-gray-600">
            {t(`assessment:categoryDescriptions.${category.id}`, category.description)}
          </p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{t('assessment:progress.current', 'Progress: {{percent}}%', { percent: Math.round(progress) })}</span>
              <span>{t('assessment:progress.stepCount', '{{current}} of {{total}} steps', { 
                current: categoryId === "organization" ? 1 : categoryPosition + 1,
                total: totalSteps
              })}</span>
            </div>
            <ProgressBar currentCategoryId={categoryId} progress={progress} />
          </div>
        </CardContent>
      </Card>
      
      {/* Knowledge Gap Guidance Component */}
      {/* Clean implementation using custom hook */}
      {knowledgeGapGuidance.shouldShowGuidance && (
        <div className="fixed bottom-6 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[320px]">
          <KnowledgeGapGuidance 
            dontKnowCount={dontKnowCount}
            totalQuestions={filteredQuestions.length}
            onViewResources={() => setIsKnowledgeModalOpen(true)}
            onDismiss={knowledgeGapGuidance.dismissGuidance}
          />
        </div>
      )}

      {/* Two-column layout with vertical progress on left and questions on right */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 min-h-0" 
        style={{ height: 0 }}
      >
        {/* Left column: Vertical progress */}
        <div className="lg:col-span-1">
          <VerticalProgress 
            questions={visibleQuestions}
            responses={responses}
            categoryId={categoryId}
            isFormComplete={isFormComplete}
            isPending={isPending}
            onSubmit={handleSubmit}
            onQuestionClick={(id) => setQuestionIdChoose(id)}
            isLastCategory={isLastCategoryForAssessmentType(categoryId, assessmentType)}
          />
        </div>
        
        {/* Right column: Questions */}
        <div className="lg:col-span-6">
          <QuestionSection 
            questionIdChoose={questionIdChoose}
            setQuestionIdChoose={setQuestionIdChoose}
            questions={filteredQuestions} 
            responses={responses} 
            onResponseChange={handleResponseChange}
            onDontKnowResponse={(questionId, isDontKnow) => {
              setDontKnowResponses(prev => ({
                ...prev,
                [questionId]: isDontKnow
              }));
              
              // If a user selects "I don't know", log this for debugging
              if (isDontKnow) {
                logger.debug(`User selected "I don't know" for question`, { questionId });
              }
            }}
          />
          
          {/* Navigation buttons */}
          <Card className="mt-6 bg-white shadow-md border-0">
            <CardContent className="pt-4 pb-2">
              {!isFormComplete && (
                <p className="text-sm text-amber-600 italic">
                  <i className="ri-error-warning-line mr-1"></i>
                  {t('assessment:instructions.allQuestionsRequired', 'Please answer all questions to enable the Next button.')}
                </p>
              )}
            </CardContent>
            <CardFooter className="justify-between pt-2">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStepIndex === 0 || isPending}
                className="border-[#294364] text-[#294364] hover:bg-gray-100"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                {t("actions.back", 'Back')}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!isFormComplete || isPending}
                className={`${!isFormComplete 
                  ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#FF8015] hover:bg-[#E66700]'} text-white`}
              >
                {isPending ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {t('assessment:navigation.saving', 'Saving...')}
                  </>
                ) : (
                  <>
                    {isLastCategoryForAssessmentType(categoryId, assessmentType) 
                      ? t('assessment:navigation.completeAssessment', 'Complete Assessment') 
                      : t('assessment:navigation.next', 'Next')}
                    <i className="ri-arrow-right-line ml-2"></i>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Knowledge Resources Modal */}
      <KnowledgeResourcesModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
        categoryId={categoryId}
        assessmentType={assessmentType as AssessmentType}
        categories={ASSESSMENT_CATEGORIES.map(cat => ({
          id: cat.id,
          name: cat.title,
          description: cat.description
        }))}
      />
    </div>
  );
}

export default AssessmentForm;
