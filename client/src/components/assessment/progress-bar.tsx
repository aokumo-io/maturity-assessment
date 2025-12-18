import React, { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { ASSESSMENT_STEPS, ASSESSMENT_CATEGORIES, ASSESSMENT_MODULES } from "@/lib/constants";
import { getStoredAssessmentType, getTotalCategoriesCount, getCategoryPosition, getCategoriesForAssessmentType } from "@/lib/assessmentFlowService";
import type { AssessmentType } from "@/lib/assessmentFlowService";
import { useTranslation } from "react-i18next";
import { logger } from "@/lib/logger";

interface ProgressBarProps {
  currentCategoryId: string;
  progress: number;
}

export function ProgressBar({ currentCategoryId, progress }: ProgressBarProps) {
  const { t } = useTranslation(['assessment', 'common']);
  
  // Memoize calculations to prevent unnecessary re-renders
  const {
    assessmentType,
    relevantSteps,
    currentStepIndex,
    currentCategoryPosition,
    totalCategoryCount,
    safeProgress,
    currentCategoryName
  } = useMemo(() => {
    // Get the currently selected assessment type using our flow service
    const assessmentType = getStoredAssessmentType();
    
    // Get categories relevant to the current assessment type
    const categoriesForType = [
      "organization", // Always include organization
      ...getCategoriesForAssessmentType(assessmentType as AssessmentType)
    ];
    
    // Filter steps to only include categories relevant to the current assessment type
    const relevantSteps = [
      { id: "organization", label: "Organization" },
      ...ASSESSMENT_STEPS.filter(
        step => ASSESSMENT_CATEGORIES.some(cat => cat.id === step.id) && 
                categoriesForType.includes(step.id)
      )
    ];
    
    // Find the current step index in relevant steps
    const currentStepIndex = relevantSteps.findIndex(step => step.id === currentCategoryId);
    
    // For the progress bar, we want to show actual categories (not including organization)
    // If we're on the organization step, show 0 of X categories
    let currentCategoryPosition = 0;
    let totalCategoryCount = getTotalCategoriesCount(assessmentType as AssessmentType);
    
    if (currentCategoryId !== "organization") {
      currentCategoryPosition = getCategoryPosition(currentCategoryId, assessmentType as AssessmentType);
    }
    
    // Ensure progress is never over 100%
    const safeProgress = Math.min(100, progress);
    
    const currentCategoryName = ASSESSMENT_CATEGORIES.find(cat => cat.id === currentCategoryId)?.title || "";
    
    logger.debug(`Progress Bar component values`, {
      assessmentType,
      currentCategory: currentCategoryId,
      currentStepIndex,
      totalSteps: relevantSteps.length,
      relevantSteps: relevantSteps.map(s => s.id).join(', ')
    });
    
    return {
      assessmentType,
      relevantSteps,
      currentStepIndex,
      currentCategoryPosition,
      totalCategoryCount,
      safeProgress,
      currentCategoryName
    };
  }, [currentCategoryId, progress]); // Only recompute when these values change
  
  return (
    <div className="space-y-2">
      <Progress value={safeProgress} className="h-2" />
    </div>
  );
}

export default ProgressBar;
