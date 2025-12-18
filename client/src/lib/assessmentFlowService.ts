import { ASSESSMENT_STEPS, ASSESSMENT_MODULES } from './constants';
import { logger } from './logger';

/**
 * Assessment Flow Service
 * 
 * This service manages the assessment flow based on assessment type.
 * It provides navigation information and helps determine when an assessment is complete.
 */

// Define assessment types
export type AssessmentType = 'quick' | 'standard' | 'comprehensive';

/**
 * Get the next step in the assessment process
 * @param currentStepId Current step ID
 * @param assessmentType Type of assessment being taken
 * @returns Next step object or null if at the end
 */
export function getNextStep(currentStepId: string, assessmentType: AssessmentType) {
  // Special case for Quick Assessment - CI/CD should go straight to processing
  // if (assessmentType === 'quick' && currentStepId === 'cicd_practices') {
  //   return ASSESSMENT_STEPS.find(step => step.id === 'processing') || null;
  // }
  
  // Get current step index
  const currentStepIndex = ASSESSMENT_STEPS.findIndex(step => step.id === currentStepId);
  
  // If we can't find the current step or we're at the end, return null
  if (currentStepIndex === -1 || currentStepIndex >= ASSESSMENT_STEPS.length - 1) {
    return null;
  }
  
  // Get categories for this assessment type
  const categoriesForType = getCategoriesForAssessmentType(assessmentType);
  
  // Find the next valid step based on assessment type
  for (let i = currentStepIndex + 1; i < ASSESSMENT_STEPS.length; i++) {
    const nextStep = ASSESSMENT_STEPS[i];
    
    // Pre-assessment steps (welcome, instructions, org info) are always included
    if (i < 4) {
      return nextStep;
    }
    
    // Processing and result steps are always included
    if (i >= ASSESSMENT_STEPS.length - 4) {
      return nextStep;
    }
    
    // For assessment category steps, check if they're included in this assessment type
    if (categoriesForType.includes(nextStep.id)) {
      return nextStep;
    }
  }
  
  // If we've gone through all steps and found nothing, go to processing
  return ASSESSMENT_STEPS.find(step => step.id === 'processing') || null;
}

/**
 * Get the previous step in the assessment process
 * @param currentStepId Current step ID
 * @param assessmentType Type of assessment being taken
 * @returns Previous step object or null if at the beginning
 */
export function getPreviousStep(currentStepId: string, assessmentType: AssessmentType) {
  // Get current step index
  const currentStepIndex = ASSESSMENT_STEPS.findIndex(step => step.id === currentStepId);
  
  // If we can't find the current step or we're at the beginning, return null
  if (currentStepIndex <= 0) {
    return null;
  }
  
  // Get categories for this assessment type
  const categoriesForType = getCategoriesForAssessmentType(assessmentType);
  
  // Find the previous valid step based on assessment type
  for (let i = currentStepIndex - 1; i >= 0; i--) {
    const prevStep = ASSESSMENT_STEPS[i];
    
    // Pre-assessment steps (welcome, instructions, org info) are always included
    if (i < 4) {
      return prevStep;
    }
    
    // For assessment category steps, check if they're included in this assessment type
    if (categoriesForType.includes(prevStep.id)) {
      return prevStep;
    }
  }
  
  // If we've gone through all previous steps and found nothing, go to welcome
  return ASSESSMENT_STEPS.find(step => step.id === 'welcome') || null;
}

/**
 * Check if the current step is the last category in the assessment
 * @param currentStepId Current step ID
 * @param assessmentType Type of assessment being taken
 * @returns Boolean indicating if this is the last category
 */
export function isLastCategory(currentStepId: string, assessmentType: AssessmentType): boolean {
  // Get categories for this assessment type
  const categoriesForType = getCategoriesForAssessmentType(assessmentType);
  
  logger.debug(`Checking if ${currentStepId} is last category in ${assessmentType} assessment`);
  
  // If the current step isn't a category in this assessment type, return false
  if (!categoriesForType.includes(currentStepId)) {
    logger.debug(`Category ${currentStepId} is not included in ${assessmentType} assessment`);
    return false;
  }
  
  // Find the index of the current category
  const currentCategoryIndex = categoriesForType.indexOf(currentStepId);
  
  // If it's the last category in the list, return true
  const isLast = currentCategoryIndex === categoriesForType.length - 1;
  logger.debug(`Category ${currentStepId} is${isLast ? '' : ' not'} the last category for ${assessmentType}`);
  return isLast;
}

/**
 * Get all categories for a specific assessment type
 * @param assessmentType Type of assessment
 * @returns Array of category IDs for this assessment type
 */
export function getCategoriesForAssessmentType(assessmentType: AssessmentType): string[] {
  switch (assessmentType) {
    case 'quick':
      return ASSESSMENT_MODULES.CORE;
    case 'standard':
      return ASSESSMENT_MODULES.STANDARD;
    case 'comprehensive':
      return ASSESSMENT_MODULES.COMPREHENSIVE;
    default:
      return ASSESSMENT_MODULES.COMPREHENSIVE;
  }
}

/**
 * Get the human-readable name for an assessment type
 * @param assessmentType Type of assessment
 * @returns Display name for the assessment type
 */
export function getAssessmentTypeName(assessmentType: AssessmentType): string {
  switch (assessmentType) {
    case 'quick':
      return 'Quick Assessment';
    case 'standard':
      return 'Standard Assessment';
    case 'comprehensive':
      return 'Comprehensive Assessment';
    default:
      return 'Assessment';
  }
}

/**
 * Get the total number of categories for an assessment type
 * @param assessmentType Type of assessment
 * @returns Number of categories
 */
export function getTotalCategoriesCount(assessmentType: AssessmentType): number {
  return getCategoriesForAssessmentType(assessmentType).length;
}

/**
 * Get the current category position in the assessment
 * @param currentStepId Current step ID
 * @param assessmentType Type of assessment
 * @returns Position (1-based) or 0 if not a category
 */
export function getCategoryPosition(currentStepId: string, assessmentType: AssessmentType): number {
  const categoriesForType = getCategoriesForAssessmentType(assessmentType);
  const position = categoriesForType.indexOf(currentStepId);
  return position === -1 ? 0 : position + 1;
}

/**
 * Get the stored assessment type from localStorage
 * @returns AssessmentType or 'comprehensive' as default
 */
export function getStoredAssessmentType(): AssessmentType {
  try {
    const storedType = localStorage.getItem('selectedAssessmentType');
    if (storedType) {
      // Parse the stored value and validate it's a valid assessment type
      const parsedType = JSON.parse(storedType);
      if (['quick', 'standard', 'comprehensive'].includes(parsedType)) {
        return parsedType as AssessmentType;
      }
    }
  } catch (e) {
    logger.error('Error reading assessment type from localStorage:', e);
  }
  
  return 'comprehensive'; // Default fallback
}