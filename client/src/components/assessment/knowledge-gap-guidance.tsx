import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MATURITY_LEVELS } from "@/lib/constants"; 
import { useTranslation } from "react-i18next";

interface KnowledgeGapGuidanceProps {
  dontKnowCount: number;
  totalQuestions: number;
  onContinue?: () => void;
  onViewResources: () => void;
  onDismiss?: () => void;
}

export function KnowledgeGapGuidance({
  dontKnowCount,
  totalQuestions,
  onContinue,
  onViewResources,
  onDismiss
}: KnowledgeGapGuidanceProps) {
  const { t } = useTranslation(['common', 'assessment']);
  
  // Calculate percentage of "I don't know" responses
  const dontKnowPercentage = Math.round((dontKnowCount / totalQuestions) * 100);
  
  // Only show when the user has answered at least 3 questions with "I don't know"
  // and it represents at least 30% of questions
  if (dontKnowCount < 3 || dontKnowPercentage < 30) {
    return null;
  }
  
  return (
    <Card className="mb-6 bg-purple-50 border-none relative">
      <CardContent className="pt-6">
        {/* Close button */}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-purple-100 text-purple-500 hover:text-purple-700"
            aria-label="Dismiss guidance"
          >
            <i className="ri-close-line text-lg"></i>
          </Button>
        )}
        
        <div className="flex items-start flex-col">
          <div className="flex-shrink-0 mr-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <i className="ri-question-mark text-xl text-purple-500" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-purple-700">
              {t('assessment:knowledge.frequentDontKnow', "We notice you're selecting \"I don't know\" frequently")}
            </h3>
            <p className="mt-1 text-sm text-purple-600">
              {t('assessment:knowledge.explanation', "This might indicate you're not familiar with cloud native concepts, or you might not be the right person to complete this specific section of the assessment.")}
            </p>
            
            <div className="mt-4 space-y-2">
              <p className="text-sm text-purple-600 font-medium">
                {t('assessment:knowledge.suggestion', 'Would you like to:')}
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {onContinue && (
                  <Button 
                    onClick={onContinue}
                    variant="outline"
                    className="border-purple-200 text-purple-700 hover:bg-purple-100"
                  >
                    {t('assessment:knowledge.continue', 'Continue the assessment')}
                  </Button>
                )}
                
                <Button
                  onClick={onViewResources}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <i className="ri-book-open-line mr-1"></i>
                  {t('assessment:knowledge.viewResources', 'View educational resources')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default KnowledgeGapGuidance;