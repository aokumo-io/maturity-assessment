import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ASSESSMENT_CATEGORIES, IMPACT_LEVELS, EFFORT_LEVELS } from "@/lib/constants";
import type { ImplementationRecommendation } from "@shared/schema";
import { useTranslation } from "react-i18next";

// New interfaces for roadmap data
interface Timeline {
  min: number;
  max: number;
  unit: 'weeks' | 'months';
}

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
  label: LocalizedText;
  description: LocalizedText;
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

interface ImplementationRoadmapProps {
  recommendations: ImplementationRecommendation[];
  onPhaseSelect?: (phase: string) => void;
  onRecommendationSelect?: (recommendationId: string) => void;
  roadmap?: Roadmap; // Optional roadmap data for enhanced UI
  scoredCategories?: string[]; // Array of category IDs that have been scored in the assessment
}

export default function ImplementationRoadmap({ 
  recommendations, 
  onPhaseSelect,
  onRecommendationSelect,
  roadmap,
  scoredCategories = [] // Default to empty array if not provided
}: ImplementationRoadmapProps) {
  const { t, i18n } = useTranslation(['results', 'categories'], { nsMode: 'fallback' });
  const currentLang = i18n.language.startsWith('ja') ? 'ja' : 'en';
  
  // State to track expanded status of unscored recommendations for each phase
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    short_term: false,
    medium_term: false,
    long_term: false
  });
  
  // Toggle expansion state for a specific phase
  const togglePhaseExpansion = (phase: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent phase selection when clicking the toggle
    setExpandedPhases(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };
  
  // Filter recommendations by phase
  const getPhaseRecommendations = (phase: string) => {
    const recs = recommendations.filter(rec => rec.phase === phase);
    
    // Sort recommendations: scored categories first, then unscored
    return recs.sort((a, b) => {
      const aIsScored = scoredCategories.includes(a.categoryId);
      const bIsScored = scoredCategories.includes(b.categoryId);
      
      if (aIsScored && !bIsScored) return -1; // a comes first
      if (!aIsScored && bIsScored) return 1;  // b comes first
      
      // If both are scored or both are unscored, sort by priority
      return a.priority - b.priority;
    });
  };
  
  const shortTermRecs = getPhaseRecommendations("short_term");
  const mediumTermRecs = getPhaseRecommendations("medium_term");
  const longTermRecs = getPhaseRecommendations("long_term");
  
  const getCategoryInfo = (categoryId: string) => {
    const category = ASSESSMENT_CATEGORIES.find(cat => cat.id === categoryId);
    
    if (category) {
      // Return the category with translated title from categories namespace
      return {
        ...category,
        title: t(`categories:${categoryId}.title`, category.title)
      };
    }
    
    return category;
  };
  
  // Get RoadmapRecommendation data if available
  const getOriginalRecommendation = (id: string) => {
    if (!roadmap) return null;
    return roadmap.recommendationsById[id];
  };
  
  // Check if a category has been scored in the assessment
  const isCategoryScored = (categoryId: string) => {
    return scoredCategories.includes(categoryId);
  };
  
  // Map category IDs to color classes
  const getCategoryColor = (categoryId: string): string => {
    const colorMap: Record<string, string> = {
      foundations_culture: 'indigo',
      business_value_strategy: 'emerald',
      application_architecture: 'amber',
      app_migration_modernization: 'violet',
      container_infrastructure: 'orange',
      cicd_practices: 'green',
      dora_metrics: 'purple',
      security_compliance: 'red',
      infrastructure_platform: 'sky',
      data_management: 'cyan',
      observability: 'fuchsia',
      finops_cost_management: 'lime',
      operations_resilience: 'rose',
      multicloud_hybrid_governance: 'blue',
      ai_ml_integration: 'teal'
    };
    
    return colorMap[categoryId] || 'gray';
  };
  
  // Choose colors based on impact and score levels
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };
  
  const getScoreIndicator = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  // Render a recommendation card with appropriate styling
  const renderRecommendationCard = (rec: ImplementationRecommendation, phase: 'short_term' | 'medium_term' | 'long_term') => {
    const originalRec = getOriginalRecommendation(rec.id);
    const isScored = isCategoryScored(rec.categoryId);
    
    // Define border styles based on phase and scoring status
    const borderClass = isScored 
      ? (phase === 'short_term' 
          ? 'hover:border-primary-300' 
          : phase === 'medium_term' 
            ? 'hover:border-secondary-300' 
            : 'hover:border-accent-300')
      : 'hover:border-gray-300 border-dashed';
      
    const bgClass = isScored ? 'bg-white' : 'bg-gray-50';
    
    // Use consistent light blue styling for all category labels (both scored and unscored)
    const categoryClass = 'bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium';
    
    return (
      <div 
        key={rec.id}
        className={`p-3 rounded border-0 ${borderClass} ${bgClass} cursor-pointer hover:shadow-md transition-all shadow-sm`}
        onClick={(e) => {
          e.stopPropagation();
          onRecommendationSelect?.(rec.id);
        }}
      >
        <div className="flex items-start">
          <div className="w-full">
            <div className="font-semibold text-gray-800">{rec.title}</div>
            <p className="text-xs mt-1.5 flex items-center flex-wrap">
              <span className={categoryClass}>
                {getCategoryInfo(rec.categoryId)?.title}
              </span>
              <span className="mx-1">|</span>
              <span className={getImpactColor(rec.impact)}>
                {i18n.language?.startsWith('ja') 
                  ? `${t('implementationRoadmap.impact')} ${t(`impactLevels.${rec.impact.toLowerCase()}`, rec.impact.charAt(0) + rec.impact.slice(1).toLowerCase())}`
                  : `${t(`impactLevels.${rec.impact.toLowerCase()}`, rec.impact.charAt(0) + rec.impact.slice(1).toLowerCase())} ${t('implementationRoadmap.impact')}`
                }
              </span>
              <span className="mx-1">|</span>
              <span className="text-gray-600">
                {i18n.language?.startsWith('ja') 
                  ? `${t('implementationRoadmap.effort')} ${t(`effortLevels.${rec.effort.toLowerCase()}`, rec.effort.charAt(0) + rec.effort.slice(1).toLowerCase())}`
                  : `${t(`effortLevels.${rec.effort.toLowerCase()}`, rec.effort.charAt(0) + rec.effort.slice(1).toLowerCase())} ${t('implementationRoadmap.effort')}`
                }
              </span>
              {originalRec && (
                <>
                  <span className="mx-1">|</span>
                  <span className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${getScoreIndicator(originalRec.roiScore)} mr-1`}></span>
                    <span className="font-medium">{t('implementationRoadmap.roi')} {originalRec.roiScore}</span>
                  </span>
                </>
              )}
            </p>
            
            {originalRec?.quickWin && (
              <div className="mt-2">
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                  {t('implementationRoadmap.quickWin')}
                </span>
                <span className="ml-1 text-xs text-gray-600">
                  {(() => {
                    // Parse the timeline string format (e.g., "1-3 weeks") to extract numerical range and unit
                    const match = rec.timeline.match(/(\d+-\d+)\s+(\w+)/);
                    if (match) {
                      const range = match[1]; // e.g., "1-3"
                      const unit = match[2]; // e.g., "weeks"
                      // Apply translation to the unit part only
                      return `${range} ${t(`timeUnits.${unit}`, unit)}`;
                    }
                    return rec.timeline;
                  })()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Phase 1: Short-term (0-3 months) */}
        <div 
          className="flex-1 border-0 rounded-lg bg-primary-50 p-5 cursor-pointer hover:bg-primary-100 transition-colors shadow-md hover:shadow-lg"
          onClick={() => onPhaseSelect?.("short_term")}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-800">
              <i className="ri-timer-line text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-primary-800">{t('implementationRoadmap.phase1')}</h3>
              <div className="text-sm text-primary-600">{t('implementationRoadmap.timeframe.short')}</div>
            </div>
          </div>
          
          <div className="space-y-4 mb-4">
            {/* Scored recommendations section */}
            {shortTermRecs.filter(rec => scoredCategories.includes(rec.categoryId)).length > 0 ? (
              shortTermRecs
                .filter(rec => scoredCategories.includes(rec.categoryId))
                .map(rec => renderRecommendationCard(rec, 'short_term'))
            ) : null}
            
            {/* Unscored recommendations with chevron toggle */}
            {shortTermRecs.some(rec => !scoredCategories.includes(rec.categoryId)) && (
              <>
                <button 
                  onClick={(e) => togglePhaseExpansion('short_term', e)}
                  className="w-full flex items-center justify-between py-2 px-3 text-xs font-medium text-gray-600 border-t border-dashed border-gray-200 mt-4 pt-3 hover:bg-gray-50 rounded"
                >
                  <span>
                    <i className={`ri-arrow-${expandedPhases.short_term ? 'down' : 'right'}-s-line mr-1`}></i>
                    {shortTermRecs.filter(rec => !scoredCategories.includes(rec.categoryId)).length} {t('implementationRoadmap.otherRecommendations')}
                  </span>
                </button>
                
                {expandedPhases.short_term && (
                  <div className="pt-2 space-y-4">
                    {shortTermRecs
                      .filter(rec => !scoredCategories.includes(rec.categoryId))
                      .map(rec => renderRecommendationCard(rec, 'short_term'))}
                  </div>
                )}
              </>
            )}
            
            {shortTermRecs.length === 0 && (
              <div className="p-3 bg-white rounded border-0 text-center text-gray-500 shadow-sm">
                {t('implementationRoadmap.noRecommendations')}
              </div>
            )}
          </div>
          
          <button 
            className="w-full py-2 text-sm font-semibold text-primary-700 bg-primary-100 rounded hover:bg-primary-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPhaseSelect?.("short_term");
            }}
          >
            {t('implementationRoadmap.viewPhaseDetails')}
          </button>
        </div>
        
        {/* Phase 2: Medium-term (3-6 months) */}
        <div 
          className="flex-1 border-0 rounded-lg bg-secondary-50 p-5 cursor-pointer hover:bg-secondary-100 transition-colors shadow-md hover:shadow-lg"
          onClick={() => onPhaseSelect?.("medium_term")}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-800">
              <i className="ri-calendar-line text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-secondary-800">{t('implementationRoadmap.phase2')}</h3>
              <div className="text-sm text-secondary-600">{t('implementationRoadmap.timeframe.medium')}</div>
            </div>
          </div>
          
          <div className="space-y-4 mb-4">
            {/* Scored recommendations section */}
            {mediumTermRecs.filter(rec => scoredCategories.includes(rec.categoryId)).length > 0 ? (
              mediumTermRecs
                .filter(rec => scoredCategories.includes(rec.categoryId))
                .map(rec => renderRecommendationCard(rec, 'medium_term'))
            ) : null}
            
            {/* Unscored recommendations with chevron toggle */}
            {mediumTermRecs.some(rec => !scoredCategories.includes(rec.categoryId)) && (
              <>
                <button 
                  onClick={(e) => togglePhaseExpansion('medium_term', e)}
                  className="w-full flex items-center justify-between py-2 px-3 text-xs font-medium text-gray-600 border-t border-dashed border-gray-200 mt-4 pt-3 hover:bg-gray-50 rounded"
                >
                  <span>
                    <i className={`ri-arrow-${expandedPhases.medium_term ? 'down' : 'right'}-s-line mr-1`}></i>
                    {mediumTermRecs.filter(rec => !scoredCategories.includes(rec.categoryId)).length} {t('implementationRoadmap.otherRecommendations')}
                  </span>
                </button>
                
                {expandedPhases.medium_term && (
                  <div className="pt-2 space-y-4">
                    {mediumTermRecs
                      .filter(rec => !scoredCategories.includes(rec.categoryId))
                      .map(rec => renderRecommendationCard(rec, 'medium_term'))}
                  </div>
                )}
              </>
            )}
            
            {mediumTermRecs.length === 0 && (
              <div className="p-3 bg-white rounded border-0 text-center text-gray-500 shadow-sm">
                {t('implementationRoadmap.noRecommendations')}
              </div>
            )}
          </div>
          
          <button 
            className="w-full py-2 text-sm font-semibold text-secondary-700 bg-secondary-100 rounded hover:bg-secondary-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPhaseSelect?.("medium_term");
            }}
          >
            {t('implementationRoadmap.viewPhaseDetails')}
          </button>
        </div>
        
        {/* Phase 3: Long-term (6+ months) */}
        <div 
          className="flex-1 border-0 rounded-lg bg-accent-50 p-5 cursor-pointer hover:bg-accent-100 transition-colors shadow-md hover:shadow-lg"
          onClick={() => onPhaseSelect?.("long_term")}
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center text-accent-800">
              <i className="ri-flight-takeoff-line text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-accent-800">{t('implementationRoadmap.phase3')}</h3>
              <div className="text-sm text-accent-600">{t('implementationRoadmap.timeframe.long')}</div>
            </div>
          </div>
          
          <div className="space-y-4 mb-4">
            {/* Scored recommendations section */}
            {longTermRecs.filter(rec => scoredCategories.includes(rec.categoryId)).length > 0 ? (
              longTermRecs
                .filter(rec => scoredCategories.includes(rec.categoryId))
                .map(rec => renderRecommendationCard(rec, 'long_term'))
            ) : null}
            
            {/* Unscored recommendations with chevron toggle */}
            {longTermRecs.some(rec => !scoredCategories.includes(rec.categoryId)) && (
              <>
                <button 
                  onClick={(e) => togglePhaseExpansion('long_term', e)}
                  className="w-full flex items-center justify-between py-2 px-3 text-xs font-medium text-gray-600 border-t border-dashed border-gray-200 mt-4 pt-3 hover:bg-gray-50 rounded"
                >
                  <span>
                    <i className={`ri-arrow-${expandedPhases.long_term ? 'down' : 'right'}-s-line mr-1`}></i>
                    {longTermRecs.filter(rec => !scoredCategories.includes(rec.categoryId)).length} {t('implementationRoadmap.otherRecommendations')}
                  </span>
                </button>
                
                {expandedPhases.long_term && (
                  <div className="pt-2 space-y-4">
                    {longTermRecs
                      .filter(rec => !scoredCategories.includes(rec.categoryId))
                      .map(rec => renderRecommendationCard(rec, 'long_term'))}
                  </div>
                )}
              </>
            )}
            
            {longTermRecs.length === 0 && (
              <div className="p-3 bg-white rounded border-0 text-center text-gray-500 shadow-sm">
                {t('implementationRoadmap.noRecommendations')}
              </div>
            )}
          </div>
          
          <button 
            className="w-full py-2 text-sm font-semibold text-accent-700 bg-accent-100 rounded hover:bg-accent-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPhaseSelect?.("long_term");
            }}
          >
            {t('implementationRoadmap.viewPhaseDetails')}
          </button>
        </div>
      </div>
      
      <div className="mt-5 p-4 bg-insights rounded-lg text-sm text-tip shadow-sm">
        <div className="flex items-center mb-2">
          <i className="ri-information-line text-primary-500 mr-2"></i>
          <span className="font-semibold">{t('implementationRoadmap.implementationApproach')}</span>
        </div>
        <p>
          {t('implementationRoadmap.approachDescription')}
          <span className="block mt-2">
            <i className="ri-information-line text-gray-500 mr-1"></i>
            <span className="italic">{t('implementationRoadmap.categoriesNote')}</span>
          </span>
        </p>
      </div>
    </div>
  );
}
