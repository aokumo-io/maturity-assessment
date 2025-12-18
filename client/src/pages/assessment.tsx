import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { AssessmentForm } from "@/components/assessment/assessment-form";
import AppLayout from "@/components/layout/app-layout";
import { ASSESSMENT_CATEGORIES, ASSESSMENT_MODULES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { getStoredAssessmentType } from "@/lib/assessmentFlowService";
import { logger } from '@/lib/logger';
import { ProgressiveAssessmentPreview } from "@/components/assessment/progressive-assessment-preview";
import { Progress } from "@/components/ui/progress";
import { useCategoryMeta } from "@/hooks/use-meta";

export default function Assessment() {
  const params = useParams<{ categoryId: string }>();
  const categoryId = params.categoryId;
  const [, navigate] = useLocation();
  const { t, i18n } = useTranslation(['common', 'assessment']);
  
  // Check for optimized testing parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const useOptimized = urlParams.get('optimized') === 'true';
  const useProgressive = urlParams.get('progressive') === 'true';
  
  // Check if we're in the Quick Assessment DORA Metrics scenario
  const assessmentType = getStoredAssessmentType();
  
  // Debug Assessment Information
  logger.debug(`Current Page Information:
    - Category ID: ${categoryId}
    - Assessment Type: ${assessmentType}
    - User Language: ${i18n.language}
    - Use Optimized: ${useOptimized}
    - Use Progressive: ${useProgressive}`);
  
  // Create a special mutation for processing assessment
  const { mutate: processAssessment, isPending: isProcessing } = useMutation({
    mutationFn: async () => {
      // Use apiRequest which automatically handles CSRF tokens
      const res = await apiRequest('POST', '/api/assessment/process', {});
      const processData = await res.json();
      
      // 2. Fetch result ID using the sessionId from processData
      const sessionId = processData.sessionId;
      const resultRes = await apiRequest('GET', `/api/assessment/results/${sessionId}`);
      const resultId = await resultRes.json();
      
      return { processData, resultId };
    },
    onSuccess: ({ processData, resultId }) => {
      if (resultId) {
        navigate(`/results/${resultId}`);
      } else {
        // Fallback to the home page if no ID is available
        navigate("/");
      }
    },
    onError: (error) => {
      logger.error("Error processing assessment:", error);
      // Display an error message to the user
      alert("There was an error processing your assessment. Redirecting to home page.");
      // Redirect to the home page
      navigate("/");
    }
  });
  
  // Removed special case for Quick Assessment DORA Metrics
  // Now all assessment types will use the standard question format for DORA metrics
  
  const category = ASSESSMENT_CATEGORIES.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <AppLayout 
        title={t('error')}
        subtitle={t('assessment:invalidCategory.subtitle', 'The requested assessment category does not exist.')}
        hideSidebar
      >
        <div className="p-6 flex justify-center">
          <div className="max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {t('assessment:invalidCategory.title', 'Invalid Assessment Category')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('assessment:invalidCategory.message', 'The assessment category you requested does not exist. Please go back and try again.')}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Get translated category title from assessment:categories namespace
  const categoryTitle = t(`assessment:categories.${category.id}`, category.title);
  const action = <></>;
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  // Calculate progress
  const calculateProgress = (responses: Record<string, number>, questions: any[]): number => {
    const answeredCount = Object.keys(responses).length;
    const totalCount = questions.length;
    if (totalCount === 0) return 0;
    const percent = Math.round((answeredCount / totalCount) * 100);
    return Math.min(100, Math.max(0, percent));
  };

  useEffect(() => {
    setProgressPercentage(calculateProgress(responses, questions));
  }, [responses, questions, categoryId]); // Add dependencies

  const elementProgress = (
    <div>
      <div
        className="bg-blue-600 h-1 transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );

  // Show optimized indicator if testing
  if (useOptimized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-yellow-800 mr-3">🧪</div>
              <div>
                <h3 className="font-semibold text-yellow-800">Testing Mode: Optimized Questions</h3>
                <p className="text-yellow-700 text-sm">You're viewing the optimized question set with CNCF maturity mapping.</p>
              </div>
            </div>
          </div>
          
          <AssessmentForm 
            key={categoryId}
            categoryId={categoryId}
            setResponse={setResponses}
            setQuestion={setQuestions}
            useOptimized={useOptimized}
          />
        </div>
      </div>
    );
  }

  // Show progressive assessment if testing
  if (useProgressive) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-400 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-blue-800 mr-3">🚀</div>
              <div>
                <h3 className="font-semibold text-blue-800">Progressive Assessment Mode</h3>
                <p className="text-blue-700 text-sm">CNCF-aligned smart assessment that adapts to your maturity level.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ProgressiveAssessmentPreview 
              onClose={() => window.location.href = window.location.pathname}
            />
          </div>
        </div>
      </div>
    );
  }

  // Enable dynamic meta tags for category pages
  useCategoryMeta(categoryId, categoryTitle);

  return (
    <AppLayout 
      title={`${t('assessment:title')}`}
      subtitle={t('assessment:subtitle', 'Please answer the following questions about your practices')}
      hideSidebar
      actions={action}
      classHeader="max-w-[105rem] mx-auto"
      isHideScollbar
      element={elementProgress}
    >
      <AssessmentForm 
        key={categoryId}
        categoryId={categoryId}
        setResponse={setResponses}
        setQuestion={setQuestions}
      />
    </AppLayout>
  );
}
