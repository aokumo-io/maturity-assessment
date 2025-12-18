import React, { useState, useEffect } from "react";
import { logger } from '@/lib/logger';

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/logo";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { ASSESSMENT_TYPES } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/language-switcher";
import { persistenceManager, STORAGE_KEYS } from "@/lib/assessmentUtils";
import { useSession } from "@/hooks/use-session";
import { saveSessionToCookie } from "@/lib/session-service";
import { applyCardStyle, applyHeadingStyle, applyBodyStyle } from "@/styles/card-styles";
import { apiRequest } from "@/lib/queryClient";
import { usePageMeta } from "@/hooks/use-meta";

export default function Welcome() {
  const [, navigate] = useLocation();
  const [assessmentType, setAssessmentType] = useState<string>("quick");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { t, i18n, ready } = useTranslation(["common", "assessment"]);
  const { setSession } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);

  // Enable dynamic meta tags that update with language changes
  usePageMeta();

  // Ensure translations are loaded before rendering
  useEffect(() => {
    const loadNamespaces = async () => {
      try {
        await i18n.loadNamespaces(["common", "assessment"]);
        setIsInitialized(true);
      } catch (error) {
        logger.error("Failed to load namespaces:", error);
      }
    };
    
    if (!ready) {
      loadNamespaces();
    } else {
      setIsInitialized(true);
    }
  }, [i18n, ready]);

  // Show loading state if i18next is not initialized yet
  if (!ready || !isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-full mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              <div className="mt-4 text-gray-600">Loading...</div>
            </div>
          </CardContent>
        </div>
      </div>
    );
  }

  const handleStartAssessment = async () => {
    setIsSubmitting(true);
    try {
      // Clear all previous assessment data using the persistence manager
      persistenceManager.clearAllAssessmentData();
      
      // Clear any previous responses from the server
      try {
        await apiRequest("POST", "/api/assessment/reset", {});
      } catch (err) {
        logger.error("Error resetting assessment data on server:", err);
        // Continue even if this fails
      }
      
      // Store selected assessment type using the persistence manager
      persistenceManager.saveAssessmentType(assessmentType as 'quick' | 'standard' | 'comprehensive');
      
      // Get current language from i18n
      const currentLanguage = i18n.language?.split('-')[0] || 'en';
      
      // Select assessment type on the server
      const response = await apiRequest("POST", "/api/assessment/select-type", { 
        type: assessmentType,
        language: currentLanguage
      });
      
      // Check for session ID in response
      const data = await response.json();
      
      // Add detailed logging of the API response
      logger.debug(`API Response structure keys: ${Object.keys(data).join(', ')}`);
      
      if (data && data.sessionId) {
        // Store session ID in cookie and context
        logger.debug("Received session ID:", data.sessionId);
        saveSessionToCookie(data.sessionId);
        setSession(data.sessionId);
        
        // Store questions with language-specific cache key
        if (data.questionsByCategory) {
          const categoryCount = Object.keys(data.questionsByCategory).length;
          const totalQuestions = Object.values(data.questionsByCategory)
            .reduce((sum: number, questions: any) => sum + (Array.isArray(questions) ? questions.length : 0), 0);
          logger.debug(`Received questions for ${categoryCount} categories, total ${totalQuestions} questions in ${currentLanguage}`);
          
          // Use consistent language-aware cache key format
          const languageAwareCacheKey = `${STORAGE_KEYS.ASSESSMENT_QUESTIONS_BY_CATEGORY}_${currentLanguage}`;
          persistenceManager.saveFormData(languageAwareCacheKey, data.questionsByCategory);
          
          // Verify the cache was saved correctly
          const verifyCache = persistenceManager.loadFormData(languageAwareCacheKey, null);
          logger.debug(`✅ Cached questions for ${currentLanguage}: ${verifyCache ? 'Success' : 'Failed'}`);
          if (verifyCache) {
            const cachedCategories = Object.keys(verifyCache);
            logger.debug(`📦 Cached categories: ${cachedCategories.join(', ')}`);
          }
        } else {
          logger.warn("API response missing questionsByCategory data");
        }
      }
      
      // Navigate to instructions page
      navigate("/instructions");
    } catch (error) {
      logger.error("Error selecting assessment type:", error);
      toast({
        title: t('error'),
        description: t('assessment:errors.typeSelectionFailed', 'Unable to select assessment type. Please try again.'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get benefits as a string array with proper error handling
  let benefits: string[] = [];
  try {
    const translatedBenefits = t('assessment:welcome.benefits', { returnObjects: true });
    benefits = Array.isArray(translatedBenefits) ? translatedBenefits : [];
    
    // Fallback benefits in case the translation doesn't return an array
    if (benefits.length === 0) {
      logger.debug("Translation for 'assessment:welcome.benefits' didn't return an array");
    }
  } catch (error) {
    logger.error("Error getting benefits translation:", error);
  }

  return (
    <div className="min-h-screen gradient-secondary flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-end mb-2">
            <LanguageSwitcher />
          </div>
          <Logo className="items-center inline-flex mb-6" />
          <h1 className="text-[3rem] font-[700] leading-[3.25rem] mb-4 text-primary-800">
            {t('app.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('app.subtitle')}
          </p>
        </div>

        <div className={applyCardStyle("mb-8")}>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className={applyHeadingStyle()}>
                {t('assessment:welcome.whatYoullDiscover')}
              </h3>
              <ul className="space-y-2">
                {benefits.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-2 mt-1 text-accent-500">
                      <i className="ri-check-line"></i>
                    </div>
                    <span className="text-base text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <h3 className={applyHeadingStyle()}>
                {t('assessment:types.default', { defaultValue: 'Assessment Types' })}
              </h3>
              <RadioGroup 
                value={assessmentType} 
                onValueChange={setAssessmentType}
                className="space-y-4"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="quick" id="quick" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="quick" className="font-medium text-sm">{t('assessment:types.quick')}</Label>
                    <p className="text-sm text-gray-600">
                      {t('assessment:welcome.timeTaken.quick')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="standard" id="standard" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="standard" className="font-medium text-sm">{t('assessment:types.standard')}</Label>
                    <p className="text-sm text-gray-600">
                      {t('assessment:welcome.timeTaken.standard')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="comprehensive" id="comprehensive" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="comprehensive" className="font-medium text-sm">{t('assessment:types.comprehensive')}</Label>
                    <p className="text-sm text-gray-600">
                      {t('assessment:welcome.timeTaken.comprehensive')}
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-4 flex justify-center">
            <Button 
              onClick={handleStartAssessment}
              disabled={isSubmitting}
              className="bg-accent-500 hover:bg-accent-600 text-white font-medium text-lg shadow h-11"
            >
              {isSubmitting ? (
                <><i className="ri-loader-4-line animate-spin mr-2"></i> {t('common:loading', 'Loading...')}</>
              ) : (
                <>{t('actions.start')} <i className="ri-arrow-right-line ml-2"></i></>
              )}
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            {t('app.copyright')}
          </p>
        </div>
      </div>
    </div>
  );
}
