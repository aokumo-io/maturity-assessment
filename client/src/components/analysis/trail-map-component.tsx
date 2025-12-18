import React from "react";
import { ASSESSMENT_CATEGORIES, ASSESSMENT_STEPS, MATURITY_LEVELS } from "@/lib/constants";
import type { CategoryScore } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoriesForAssessmentType, getStoredAssessmentType } from "@/lib/assessmentFlowService";

// Type definition for prioritized focus areas
interface PrioritizedFocusArea {
  categoryId: string;
  priority: number;
  reason: string;
  timeframe: string;
  quickWin: boolean;
}

// Type definitions for roadmap data
interface Timeline {
  min: number;
  max: number;
  unit: 'weeks' | 'months';
}

// Localized text structure to match server-side model
interface LocalizedText {
  en: string;
  ja: string;
}

interface RoadmapRecommendation {
  id: string;
  stepRef: string;
  category: string;
  impactArea: string;
  priorityRank: number;
  impactLevel: 'Low' | 'Medium' | 'High';
  effortLevel: 'Low' | 'Medium' | 'High';
  roiScore: number;
  timeline: Timeline;
  quickWin: boolean;
  // Add localized label and description
  label: LocalizedText;
  description: LocalizedText;
  // Add phase information
  phase?: 'beginner' | 'intermediate' | 'advanced';
  // Add considerations for high-maturity categories
  considerations?: string[];
}

interface RoadmapPhase {
  index: number;
  band: 'short' | 'medium' | 'long';
  recommendations: RoadmapRecommendation[];
}

interface Roadmap {
  assessmentId: number;
  phases: RoadmapPhase[];
  recommendationsById: Record<string, RoadmapRecommendation>;
}

interface TrailMapComponentProps {
  categoryScores: CategoryScore[];
  onCategorySelect?: (categoryId: string) => void;
  prioritizedFocusAreas?: PrioritizedFocusArea[];
}

export default function TrailMapComponent({ 
  categoryScores, 
  onCategorySelect,
  prioritizedFocusAreas = []
}: TrailMapComponentProps) {
  const { t, i18n } = useTranslation('results');
  const currentLang = i18n.language?.startsWith('ja') ? 'ja' : 'en';
  
  // Normalize language for consistent queryKey
  const normalizedLang = i18n.language || 'en';
  const queryClient = useQueryClient();
  
  // Get roadmap data from cache (already fetched by results-dashboard)
  const roadmap = queryClient.getQueryData<Roadmap>(["/api/roadmap", normalizedLang]);
  const loading = roadmap === undefined;
  const roadmapError = null; // Remove error state since we're just reading from cache
  
  const getCategoryScore = (categoryId: string) => {
    const score = categoryScores.find(score => score.categoryId === categoryId)?.score;
    // Return 0 if the score is -1 (unassessed) or not found
    return (score === -1 || score === undefined) ? 0 : score;
  };
  
  // Determine if a category was actually assessed
  const isCategoryAssessed = (categoryId: string) => {
    const scoreObj = categoryScores.find(score => score.categoryId === categoryId);
    return scoreObj !== undefined && scoreObj.score !== -1;
  };
  
  const getCategoryMaturityLevel = (categoryId: string) => {
    return categoryScores.find(score => score.categoryId === categoryId)?.maturityLevel || "not_started";
  };
  
  // Determine milestone color based on score threshold
  const getMilestoneColor = (categoryId: string, threshold: number) => {
    const score = getCategoryScore(categoryId);
    if (score >= threshold) return `bg-[${MATURITY_LEVELS.ADVANCED.color}]`;
    if (score >= threshold - 30) return `bg-[${MATURITY_LEVELS.INTERMEDIATE.color}]`;
    if (score >= threshold - 60) return `bg-[${MATURITY_LEVELS.BEGINNER.color}]`;
    return "bg-gray-300";
  };
  
  // Determine if a milestone is a focus area
  const isFocusArea = (categoryId: string) => {
    const level = getCategoryMaturityLevel(categoryId);
    return level === "beginner";
  };
  
  // Get priority for a category (if it's a prioritized focus area)
  const getCategoryPriority = (categoryId: string): number | null => {
    // Check if category is part of the current assessment type
    const assessmentType = getStoredAssessmentType();
    const assessedCategories = getCategoriesForAssessmentType(assessmentType);
    
    // If category is not in current assessment type, return null (no priority)
    if (!assessedCategories.includes(categoryId)) {
      return null;
    }
    
    const focusArea = prioritizedFocusAreas.find(area => area.categoryId === categoryId);
    return focusArea ? focusArea.priority : null;
  };

  // Get category details by ID
  const getCategoryById = (categoryId: string) => {
    return ASSESSMENT_CATEGORIES.find(category => category.id === categoryId);
  };

  // Get translated category title - use the translated title if available, or fall back to the original title
  const getTranslatedCategoryTitle = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    if (!category) return "";
    
    return t(`trailMap.milestoneCategories.${categoryId}.title`, {
      defaultValue: category.title // Fallback to hardcoded title if translation not found
    });
  };

  // Create a Set of valid category IDs for efficient lookup
  const validCategoryIds = new Set(ASSESSMENT_CATEGORIES.map(category => category.id));
  
  const orderedCategoryIds = ASSESSMENT_STEPS
    // Only include steps that are valid assessment categories
    .filter(step => validCategoryIds.has(step.id))
    // Exclude special navigation steps
    .filter(step => step.id !== 'trail_map' && step.id !== 'maturity_analysis' && step.id !== 'implementation_plan')
    .map(step => step.id);
    
  // Function to sort category IDs by priority
  const getSortedCategoryIds = () => {
    // Create a map of categoryId to priority
    const priorityMap = new Map<string, number>();
    
    // Populate with priorities from prioritizedFocusAreas
    prioritizedFocusAreas.forEach(area => {
      priorityMap.set(area.categoryId, area.priority);
    });
    
    // Create a new array to avoid mutating the original
    return [...orderedCategoryIds].sort((a, b) => {
      const priorityA = priorityMap.get(a);
      const priorityB = priorityMap.get(b);
      
      // If both have priorities, sort by priority (lower is better)
      if (priorityA && priorityB) {
        return priorityA - priorityB;
      }
      
      // If only A has priority, it comes first
      if (priorityA) return -1;
      
      // If only B has priority, it comes first
      if (priorityB) return 1;
      
      // If neither has priority, maintain original order
      return orderedCategoryIds.indexOf(a) - orderedCategoryIds.indexOf(b);
    });
  };

  // Get roadmap recommendations for a specific category
  const getCategoryRecommendations = (categoryId: string, limit = 9) => {
    if (!roadmap || !roadmap.phases) return [];
    
    // Flatten all recommendations from all phases
    const allRecommendations = roadmap.phases.flatMap(phase => phase.recommendations);
    
    // Find recommendations for this category, sorted by priority rank
    return allRecommendations
      .filter(rec => rec.category === categoryId)
      .sort((a, b) => a.priorityRank - b.priorityRank)
      .slice(0, limit);
  };

  // Get roadmap recommendations for a specific category filtered by maturity level
  const getCategoryRecommendationsByMaturityLevel = (categoryId: string, maturityLevel: string) => {
    if (!roadmap || !roadmap.phases) return [];
    
    // Get all recommendations
    const allRecommendations = getCategoryRecommendations(categoryId);
    
    // Check if we can determine maturity level from stepRef
    // Format is typically: "category_name-something" where category_name contains phase info
    const filterByMaturityLevel = (rec: RoadmapRecommendation): boolean => {
      // Get the capability step from capability-matrix.json
      const stepRef = rec.stepRef;
      
      // First try to directly extract phase from stepRef format
      const parts = stepRef.split('_');
      if (parts.length > 1) {
        const capabilityId = parts[0]; // e.g. "fc" from "fc_team-alignment"
        const recommendationKey = parts.slice(1).join('_'); // e.g. "team-alignment"
        
        // Try to match with phase in recommendationsById
        if (roadmap.recommendationsById && roadmap.recommendationsById[rec.id]) {
          const recommendationInfo = roadmap.recommendationsById[rec.id];
          // Get the original phase if it exists in the data
          // Use type assertion to access the phase property that might not be in the interface
          const phase = (recommendationInfo as any).phase;
          if (phase && phase.toLowerCase() === maturityLevel.toLowerCase()) {
            return true;
          }
        }
      }
      
      // If we couldn't determine the phase directly, use priorityRank as a fallback
      // Lower rank means higher priority, so early recommendations are beginner, etc.
      if (maturityLevel === "beginner") {
        return rec.priorityRank <= 3; // Top 3 recommendations
      } else if (maturityLevel === "intermediate") {
        return rec.priorityRank > 3 && rec.priorityRank <= 6; // Middle 3 recommendations
      } else if (maturityLevel === "advanced") {
        return rec.priorityRank > 6; // Remaining recommendations
      }
      
      return false;
    };
    
    // Filter and return up to 3 recommendations matching the maturity level
    return allRecommendations
      .filter(filterByMaturityLevel)
      .slice(0, 3);
  };

  // Render milestones from roadmap data
  const renderRoadmapMilestones = (categoryId: string, score: number, recommendations: RoadmapRecommendation[]) => {
    // Check if category was actually assessed
    const wasAssessed = isCategoryAssessed(categoryId);
    
    // Check if we have any recommendations with considerations
    const considerationsRec = recommendations.find(rec => rec.considerations && rec.considerations.length > 0);
    
    // For high-scoring categories (85%+) with considerations, show the special view
    if (wasAssessed && score >= 85 && considerationsRec?.considerations) {
      return (
        <div>
          <div className="mb-3">
            <div className="text-sm font-medium text-green-600">You're at the top of the trail!</div>
            <div className="text-xs text-gray-600">No more core milestones—consider:</div>
          </div>
          <div className="space-y-2">
            {considerationsRec.considerations.map((consideration, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="mt-1 text-green-500">•</div>
                <div className="text-sm text-gray-700">{consideration}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Get representative capabilities for each phase (beginner, intermediate, advanced)
    // Find the first milestone from each phase for this category
    const getMilestoneForPhase = (phase: 'beginner' | 'intermediate' | 'advanced'): RoadmapRecommendation | null => {
      // Sort by priorityRank to get them in the right order
      const phaseMilestones = recommendations
        .filter(rec => rec.phase === phase && rec.category === categoryId)
        .sort((a, b) => a.priorityRank - b.priorityRank);
      
      return phaseMilestones.length > 0 ? phaseMilestones[0] : null;
    };
    
    // Get milestone for each phase
    const beginnerMilestone = getMilestoneForPhase('beginner');
    const intermediateMilestone = getMilestoneForPhase('intermediate');
    const advancedMilestone = getMilestoneForPhase('advanced');
    
    // Create milestone array with fallbacks for missing phases
    const milestones = [
      beginnerMilestone || createPlaceholderMilestone(categoryId, 'beginner', 1),
      intermediateMilestone || createPlaceholderMilestone(categoryId, 'intermediate', 2),
      advancedMilestone || createPlaceholderMilestone(categoryId, 'advanced', 3)
    ];
    
    // Determine status for each milestone based on score and phase boundaries
    const getMilestoneStatus = (phase: 'beginner' | 'intermediate' | 'advanced'): 'completed' | 'current' | 'future' => {
      // First check if category was assessed
      if (!wasAssessed) {
        return 'future'; // All milestones should be 'future' if category wasn't assessed
      }
      
      // Get phase boundaries from MATURITY_LEVELS
      const beginnerUpperBound = MATURITY_LEVELS.BEGINNER.range[1]; // 50
      const intermediateUpperBound = MATURITY_LEVELS.INTERMEDIATE.range[1]; // 75
      const advancedUpperBound = MATURITY_LEVELS.ADVANCED.range[1]; // 100
      
      if (phase === 'beginner') {
        if (score > beginnerUpperBound) return 'completed';
        if (score <= beginnerUpperBound) return 'current';
      } else if (phase === 'intermediate') {
        if (score > intermediateUpperBound) return 'completed';
        if (score > beginnerUpperBound && score <= intermediateUpperBound) return 'current';
        return 'future';
      } else { // advanced
        if (score > advancedUpperBound) return 'completed';
        if (score > intermediateUpperBound && score <= advancedUpperBound) return 'current';
        return 'future';
      }
      
      return 'future'; // Default fallback
    };
    
    // Get status for each milestone
    const beginnerStatus = getMilestoneStatus('beginner');
    const intermediateStatus = getMilestoneStatus('intermediate');
    const advancedStatus = getMilestoneStatus('advanced');
    const statuses = [beginnerStatus, intermediateStatus, advancedStatus];
    
    // Helper to create placeholder milestone
    function createPlaceholderMilestone(categoryId: string, phase: 'beginner' | 'intermediate' | 'advanced', index: number): RoadmapRecommendation {
      const phaseLabels = {
        beginner: { en: 'Foundation milestone', ja: '基礎マイルストーン' },
        intermediate: { en: 'Growth milestone', ja: '成長マイルストーン' },
        advanced: { en: 'Optimization milestone', ja: '最適化マイルストーン' }
      };
      
      return {
        id: `placeholder-${categoryId}-${phase}-${index}`,
        stepRef: '',
        category: categoryId,
        impactArea: '',
        priorityRank: 999,
        impactLevel: 'Low' as const,
        effortLevel: 'Low' as const,
        roiScore: 0,
        timeline: { min: 0, max: 0, unit: 'weeks' as const },
        quickWin: false,
        label: phaseLabels[phase],
        description: { en: '', ja: '' },
        phase: phase
      };
    }
    
    // Render the milestone path with the three milestones
    return (
      <div className="space-y-2">
        {milestones.map((milestone, index) => {
          const status = statuses[index];
          const phase = milestone.phase || (index === 0 ? 'beginner' : index === 1 ? 'intermediate' : 'advanced');
          const milestoneLabel = milestone.label ? milestone.label[currentLang] : `Milestone ${index + 1}`;
          
          // Determine style based on status and phase
          let milestoneStyle = '';
          let textStyle = '';
          let iconClass = '';
          
          // Define colors based on phase
          const phaseColor = 
            phase === 'beginner' ? MATURITY_LEVELS.BEGINNER.color :
            phase === 'intermediate' ? MATURITY_LEVELS.INTERMEDIATE.color :
            MATURITY_LEVELS.ADVANCED.color;
          
          // Apply styles based on status
          if (status === 'completed') {
            // Keep the actual maturity color for completed milestones
            milestoneStyle = `bg-[${phaseColor}] text-white`;
            textStyle = 'text-green-600 font-medium';
            // No longer need iconClass since we don't show checkmark in the circle
            iconClass = '';
          } else if (status === 'current') {
            milestoneStyle = `bg-[${phaseColor}] text-white`;
            textStyle = 'text-gray-900 font-medium';
            iconClass = '';
          } else { // future
            milestoneStyle = `bg-white border-2 border-[${phaseColor}] text-[${phaseColor}]`;
            textStyle = 'text-gray-500';
            iconClass = '';
          }
          
          // Add connector line between milestones (except for the last one)
          const showConnector = index < milestones.length - 1;
          const connectorStyle = status === 'completed' ? 
            `border-l-2 border-[${phaseColor}] h-2 ml-3 my-0.5` : 
            'border-l-2 border-gray-200 h-2 ml-3 my-0.5';
          
          return (
            <div key={milestone.id || `milestone-${index}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${milestoneStyle}`}>
                    {/* Always show the milestone number, never replace with checkmark */}
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className={`text-sm ${textStyle}`}>
                      {milestoneLabel}
                    </div>
                    {status === 'completed' && (
                      <span className="ml-2 text-green-500 text-xs flex items-center">
                        <i className="ri-check-line mr-1"></i> {t('trailMap.completed')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {milestone.quickWin ? t('trailMap.quickWin') : ''}
                    {milestone.quickWin && milestone.timeline.min > 0 ? ' • ' : ''}
                    {milestone.timeline.min > 0 ? 
                      (milestone.quickWin ? 
                        t('trailMap.quickWinTip', { 
                          min: milestone.timeline.min, 
                          max: milestone.timeline.max, 
                          unit: t(`timeUnits.${milestone.timeline.unit}`)
                        }) : 
                        t('trailMap.timeEstimateTip', { 
                          min: milestone.timeline.min, 
                          max: milestone.timeline.max, 
                          unit: t(`timeUnits.${milestone.timeline.unit}`)
                        })
                      )
                      : ''}
                  </div>
                </div>
              </div>
              
              {/* Connector line between milestones */}
              {showConnector && (
                <div className={connectorStyle}></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to get localized milestones from translation files (used as fallback)
  const getLocalizedMilestones = (categoryId: string, score: number, t: any) => {
    // Check if category was actually assessed
    const wasAssessed = isCategoryAssessed(categoryId);
    
    // Get the current maturity level for this category
    const categoryMaturityLevel = getCategoryMaturityLevel(categoryId);
    
    // Define thresholds for milestones based on maturity level
    let thresholds;
    if (categoryMaturityLevel === "beginner") {
      const maxBeginner = MATURITY_LEVELS.BEGINNER.range[1];
      thresholds = [Math.round(maxBeginner * 0.6), Math.round(maxBeginner * 0.8), maxBeginner]; // Relative thresholds within beginner level
    } else if (categoryMaturityLevel === "intermediate") {
      const minIntermediate = MATURITY_LEVELS.INTERMEDIATE.range[0];
      const maxIntermediate = MATURITY_LEVELS.INTERMEDIATE.range[1];
      const range = maxIntermediate - minIntermediate;
      thresholds = [minIntermediate, minIntermediate + Math.round(range * 0.5), maxIntermediate]; // Distributed thresholds within intermediate level
    } else {
      const minAdvanced = MATURITY_LEVELS.ADVANCED.range[0];
      thresholds = [minAdvanced, minAdvanced + 9, 95]; // Thresholds for advanced level
    }
    
    // Create an array of 3 milestones for each category
    return thresholds.map((threshold, index) => {
      const milestoneNumber = index + 1;
      
      // Get translated milestone data based on maturity level
      const label = t(`trailMap.milestoneCategories.${categoryId}.${categoryMaturityLevel}.milestone${milestoneNumber}.label`, {
        // Fallback to beginner if translation not found for current level
        defaultValue: t(`trailMap.milestoneCategories.${categoryId}.beginner.milestone${milestoneNumber}.label`, {
          defaultValue: `Milestone ${milestoneNumber}` // Final fallback if no translation found
        })
      });
      
      const description = t(`trailMap.milestoneCategories.${categoryId}.${categoryMaturityLevel}.milestone${milestoneNumber}.description`, {
        // Fallback to beginner if translation not found for current level
        defaultValue: t(`trailMap.milestoneCategories.${categoryId}.beginner.milestone${milestoneNumber}.description`, {
          defaultValue: '' // Final fallback if no translation found
        })
      });
      
      // Determine milestone style based on maturity level and score
      let milestoneStyle = 'bg-gray-100 text-gray-400';
      
      // Only apply colored milestones if the category was actually assessed
      if (wasAssessed) {
        if (score >= threshold) {
          if (categoryMaturityLevel === "beginner") {
            milestoneStyle = `bg-[${MATURITY_LEVELS.BEGINNER.color}] text-white`;
          } else if (categoryMaturityLevel === "intermediate") {
            milestoneStyle = `bg-[${MATURITY_LEVELS.INTERMEDIATE.color}] text-white`;
          } else {
            milestoneStyle = `bg-[${MATURITY_LEVELS.ADVANCED.color}] text-white`;
          }
        } else if (score >= MATURITY_LEVELS.INTERMEDIATE.range[0] && score <= MATURITY_LEVELS.INTERMEDIATE.range[1]) {
          // Special case for intermediate score range
          milestoneStyle = `bg-[${MATURITY_LEVELS.INTERMEDIATE.color}] text-white`;
        } else if (score >= threshold - 15) {
          // For scores just below threshold, use outlined style matching maturity level
          if (categoryMaturityLevel === "beginner") {
            milestoneStyle = `bg-white border-2 border-[${MATURITY_LEVELS.BEGINNER.color}] text-[${MATURITY_LEVELS.BEGINNER.color}]`;
          } else if (categoryMaturityLevel === "intermediate") {
            milestoneStyle = `bg-white border-2 border-[${MATURITY_LEVELS.INTERMEDIATE.color}] text-[${MATURITY_LEVELS.INTERMEDIATE.color}]`;
          } else {
            milestoneStyle = `bg-white border-2 border-[${MATURITY_LEVELS.ADVANCED.color}] text-[${MATURITY_LEVELS.ADVANCED.color}]`;
          }
        }
      }
      
      return (
        <div key={index} className="flex items-center gap-3">
          <div className="relative">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${milestoneStyle}`}>
              {/* Always show the milestone number, never replace with checkmark */}
              {index + 1}
            </div>
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${
              wasAssessed && score >= threshold 
                ? 'text-green-600' 
                : wasAssessed && score >= threshold - 15 
                  ? 'text-gray-700' 
                  : 'text-gray-500'
            }`}>
              {label}
              {wasAssessed && score >= threshold && (
                <span className="ml-2 text-green-500 text-xs flex items-center">
                  <i className="ri-check-line mr-1"></i> {t('trailMap.completed')}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </div>
      );
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading roadmap data...</div>;
  }

  if (roadmapError) {
    // Fallback to the original milestone rendering if we can't load the roadmap
    logger.debug('Using fallback milestone rendering due to roadmap loading error:', roadmapError);
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getSortedCategoryIds().map((categoryId) => {
          const category = getCategoryById(categoryId);
          if (!category) return null;
          
          const score = getCategoryScore(categoryId);
          const maturityLevel = getCategoryMaturityLevel(categoryId);
          const isFocusAreaCategory = isFocusArea(categoryId);
          const translatedTitle = getTranslatedCategoryTitle(categoryId);
          const priority = getCategoryPriority(categoryId);
          const wasAssessed = isCategoryAssessed(categoryId);
          if (!wasAssessed) return;
          
          // Get the milestones based on category's score
          const recommendations = getCategoryRecommendations(categoryId);
          
          // Set card style based on maturity level
          let progressColor, cardClasses, backgroundClass;
          
          // Default style for unassessed categories
          progressColor = "bg-gray-400";
          cardClasses = "";
          backgroundClass = "bg-white";
          
          // Only apply maturity-specific colors if the category was actually assessed
          if (wasAssessed) {
            // Adjust by maturity level
            if (maturityLevel === "beginner") {
              progressColor = "bg-orange-500";
              backgroundClass = "bg-orange-50";
            } else if (maturityLevel === "intermediate") {
              progressColor = "bg-blue-500";
              cardClasses = "border-blue-100";
              backgroundClass = "bg-blue-50";
            } else if (maturityLevel === "advanced") {
              progressColor = "bg-green-500";
              cardClasses = "border-green-100";
              backgroundClass = "bg-green-50";
            }
            
            // Special highlight for focus areas (always orange border in design)
            if (isFocusAreaCategory) {
              cardClasses = "border-orange-100";
            }
            
            // Intermediate level cards (56-75% score) should always use the blue styling, regardless of focus area
            if (score >= MATURITY_LEVELS.INTERMEDIATE.range[0] && score <= MATURITY_LEVELS.INTERMEDIATE.range[1]) {
              progressColor = "bg-blue-500";
              backgroundClass = "bg-blue-50";
            }
          }
          
          return (
            <Card 
              key={categoryId} 
              className={`shadow-md border-0 hover:shadow-lg transition-shadow duration-300 ${backgroundClass} cursor-pointer relative group`}
              onClick={() => onCategorySelect?.(categoryId)}
            >
              {/* Clickable indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="ri-arrow-right-circle-line text-gray-500"></i>
              </div>
              
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`min-w-10 min-h-10 w-10 h-10 rounded-full flex items-center justify-center 
                      ${wasAssessed ? 
                          (maturityLevel === "beginner" ? "bg-orange-500 text-white" : 
                          maturityLevel === "intermediate" ? "bg-blue-500 text-white" : 
                          maturityLevel === "advanced" ? "bg-green-500 text-white" : 
                          "bg-gray-500 text-white") 
                        : "bg-gray-500 text-white"}`}>
                      <i className={`${categoryId === "cicd_practices" ? "ri-git-branch-line" : category.icon} text-lg`}></i>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {translatedTitle}
                      </CardTitle>
                      {priority !== null && (
                        <div className="mt-1 text-xs font-medium text-gray-500">
                          {t('trailMap.priority', { priority })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className={`text-3xl font-bold 
                      ${wasAssessed ? 
                          (maturityLevel === "beginner" ? "text-orange-500" : 
                          maturityLevel === "intermediate" ? "text-blue-500" : 
                          maturityLevel === "advanced" ? "text-green-500" : 
                          "text-gray-400") 
                        : "text-gray-400"}`}>
                      {score}%
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                      {t(`maturityLevels.${maturityLevel}`)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                {/* Progress bar */}
                <div className="mb-4">
                  <Progress
                    value={score}
                    className={`h-2 bg-gray-100 ${progressColor}`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{t('maturityLevels.beginner')}</span>
                    <span>{t('maturityLevels.intermediate')}</span>
                    <span>{t('maturityLevels.advanced')}</span>
                  </div>
                </div>
                
                {/* Milestones */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{t('trailMap.milestones')}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Use roadmap data if available, otherwise fall back to the original milestone rendering */}
                    {roadmap && !roadmapError 
                      ? renderRoadmapMilestones(categoryId, score, getCategoryRecommendations(categoryId))
                      : getLocalizedMilestones(categoryId, score, t)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}