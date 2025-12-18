import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/layout/app-layout";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getStoredAssessmentType } from "@/lib/assessmentFlowService";
import { persistenceManager, STORAGE_KEYS } from "@/lib/assessmentUtils";
import { useTranslation } from "react-i18next";
import { logger } from '@/lib/logger';

export default function Processing() {
  const [, navigate] = useLocation();
  const [progress, setProgress] = useState(5);
  const { toast } = useToast();
  const { t, i18n } = useTranslation(['common', 'assessment', 'results']);
  const [processingStep, setProcessingStep] = useState(t('results:processing.steps.collectingData', 'Collecting assessment data'));
  const { id } = useParams<{ id?: string }>();

  // Use the improved validation with the persistenceManager
  const validateAssessmentData = () => {
    try {
      // Perform comprehensive validation using the persistence manager
      const validationResult = persistenceManager.validateAssessmentState();
      
      if (!validationResult.valid) {
        logger.debug("Assessment validation failed:", validationResult.message);
        toast({
          title: t('error'),
          description: t('assessment:errors.incompleteData', 'Incomplete assessment data: {{message}}', 
            { message: validationResult.message }),
          variant: "destructive",
        });
        
        // Redirect back to welcome after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
        
        return false;
      }
      
      logger.debug("Assessment data validation completed successfully");
      return true;
    } catch (error) {
      logger.error("Error validating assessment data:", error);
      toast({
        title: t('error'),
        description: 'An error occurred while processing your assessment. Please try again.',
        variant: "destructive",
      });
      
      // Redirect back to welcome after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
      return false;
    }
  };

  const { mutate: processAssessment } = useMutation({
    mutationFn: async () => {
      // Use apiRequest which automatically handles CSRF tokens
      const res = await apiRequest('POST', '/api/assessment/process', { id });
      const processData = await res.json();

      // 2. Fetch result using the sessionId from processData
      const sessionId = processData.sessionId;
      const resultRes = await apiRequest('GET', `/api/assessment/results/${sessionId}`);
      const resultData = await resultRes.json();
      
      return { processData, resultData };
    },
    onSuccess: ({ processData, resultData }) => {
      logger.debug("Processing successful, response:", processData);
      try {
        persistenceManager.saveFormData(STORAGE_KEYS.ORGANIZATION_DATA, processData);
      } catch (error) {
        logger.error("Error saving form data to localStorage:", error);
      }
      // Delay navigation to show completion
      setTimeout(() => {
        navigate(`/results/${resultData}`);
      }, 1000);
    },
    onError: (error: any) => {
      logger.error("Error processing assessment:", error);
      
      // Specially handle session expired errors by redirecting to welcome page
      if (error?.message === "SESSION_EXPIRED") {
        toast({
          title: t('error'),
          description: t('results:processing.sessionExpired', 'Your session has expired. Please start a new assessment.'),
          variant: "destructive",
        });
        
        // Navigate to welcome page immediately
        navigate("/");
        return;
      }
      
      toast({
        title: t('error'),
        description: 'Network request failed. Please check your connection and try again.',
        variant: "destructive",
      });
      
      // Even if there's an error, we'll still redirect to results
      setTimeout(() => {
        // Navigate using the ID parameter if available
        if (id) {
          navigate(`/results/${id}`);
        } else {
          navigate("/results");
        }
      }, 1500);
    }
  });

  useEffect(() => {
    // Log the assessment type for debugging
    const assessmentType = getStoredAssessmentType();
    logger.debug("Processing page mounted - assessment type:", assessmentType);
    
    // Add a retry counter to prevent infinite loops
    let retryCount = 0;
    const MAX_RETRIES = 2;
    
    // Validate that we have the minimum required data
    if (!id && !validateAssessmentData()) {
      return; // Stop processing if validation fails
    }

    // Simulate processing steps with progress updates
    const steps = [
      { progress: 10, text: t('results:processing.steps.collectingData', 'Collecting assessment data') },
      { progress: 30, text: t('results:processing.steps.calculatingScores', 'Calculating category scores') },
      { progress: 50, text: t('results:processing.steps.analyzingLevels', 'Analyzing maturity levels') },
      { progress: 65, text: t('results:processing.steps.comparingBenchmarks', 'Comparing with industry benchmarks') },
      { progress: 80, text: t('results:processing.steps.generatingRecommendations', 'Generating recommendations') },
      { progress: 90, text: t('results:processing.steps.preparingRoadmap', 'Preparing implementation roadmap') },
      { progress: 100, text: t('results:processing.steps.finalizing', 'Finalizing assessment results') }
    ];
    
    let currentStepIndex = 0;
    let isProcessing = false;
    
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const { progress, text } = steps[currentStepIndex];
        setProgress(progress);
        setProcessingStep(text);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        
        // Only call processAssessment if we're not already processing and haven't exceeded retry limit
        if (!isProcessing && retryCount < MAX_RETRIES) {
          logger.debug(`Processing animation complete, calling API to process assessment (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          isProcessing = true;
          retryCount++;
          
          try {
            // Call processAssessment
            processAssessment();
          } catch (error) {
            logger.error("Error during processAssessment call:", error);
          } finally {
            // Reset the processing flag
            isProcessing = false;
          }
        } else if (retryCount >= MAX_RETRIES) {
          logger.error(`Exceeded maximum retry attempts (${MAX_RETRIES}), redirecting to welcome page`);
          toast({
            title: t('error'),
            description: t('results:processing.maxRetriesExceeded', 'Unable to process your assessment. Please start a new one.'),
            variant: "destructive",
          });
          navigate("/");
        }
      }
    }, 800);
    
    // Force navigate to results after 15 seconds as a safety fallback (extended from 10s)
    const safetyTimeout = setTimeout(() => {
      logger.warn("Safety timeout triggered - forcing navigation to results");
      // Navigate using the ID parameter if available
      if (id) {
        navigate(`/results/${id}`);
      } else {
        navigate("/results");
      }
    }, 15000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, [processAssessment, navigate, t, id]);

  const action = <></>;
  return (
    <AppLayout 
      title={t('results:processing.title', 'Processing Assessment')}
      subtitle={t('results:processing.subtitle', 'Please wait while we analyze your responses')}
      hideSidebar
      actions={action}
      classHeader="max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin"></div>
              </div>
              <h2 className="text-2xl font-medium text-primary-700 mb-2">
                {t('results:processing.analyzing', 'Analyzing Your Responses')}
              </h2>
              <p className="text-gray-600">
                {t('results:processing.pleaseWait', 'Please wait while we process your assessment and prepare your personalized results.')}
              </p>
            </div>
            
            <div className="mb-6">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500">{t('results:processing.progress', 'Progress')}: {progress}%</span>
                <span className="text-sm font-medium text-primary-600">{processingStep}</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>{t('results:processing.takeMoments', 'This should only take a few moments.')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
