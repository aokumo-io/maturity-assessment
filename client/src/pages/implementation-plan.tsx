import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ImplementationRoadmap from "@/components/analysis/implementation-roadmap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ASSESSMENT_CATEGORIES } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import type { CategoryScore } from "@shared/schema";
import { getStoredAssessmentType, getCategoriesForAssessmentType } from "@/lib/assessmentFlowService";
import { logger } from '@/lib/logger';
import { apiRequest } from '@/lib/queryClient';

// Import interfaces from trail-map.tsx for compatibility
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

// Legacy interface for backward compatibility
interface ImplementationRecommendation {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  effort: "HIGH" | "MEDIUM" | "LOW";
  timeline: string;
  priority: number;
  phase: string;
}

// Add interface for detailed recommendation from API
interface DetailedRecommendation {
  id: string;
  category: string;
  label: {
    en: string;
    ja: string;
  };
  description: {
    en: string;
    ja: string;
  };
  dependencies: Array<{
    id: string;
    label: { en: string; ja: string };
    description: { en: string; ja: string };
  }>;
  considerations?: {
    en: string[];
    ja: string[];
  };
  implementationSteps: {
    en: string[];
    ja: string[];
  };
  successCriteria: {
    en: string[];
    ja: string[];
  };
  effort_points: number;
  duration_weeks: number;
  impact_area: string;
  quick_win: boolean;
  phase: string;
}

// Hook to fetch recommendation details
function useRecommendationDetails(recommendationId: string | null) {
  const [details, setDetails] = useState<DetailedRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!recommendationId) {
      setDetails(null);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiRequest('GET', `/api/implementation/recommendation/${recommendationId}`, null);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Recommendation not found');
          }
          throw new Error(`Failed to fetch recommendation details: ${response.status}`);
        }

        const data = await response.json();
        setDetails(data);
        logger.debug('Fetched recommendation details:', { recommendationId, data });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error('Error fetching recommendation details:', { recommendationId, error: errorMessage });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [recommendationId, i18n.language]);

  return { details, loading, error };
}

export default function ImplementationPlan() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation(['results', 'categories'], { nsMode: 'fallback' });
  const currentLang = i18n.language?.startsWith('ja') ? 'ja' : 'en';
  const [, navigate] = useLocation();
  // Extract UUID from URL if present
  const { id } = useParams<{ id?: string }>();
  
  // Normalize language for consistent queryKey
  const normalizedLang = i18n.language || 'en';
  const queryClient = useQueryClient();
  
  // Get the current assessment type
  const assessmentType = getStoredAssessmentType();
  
  // Determine which categories should be considered "scored" based on assessment type
  const scoredCategories = getCategoriesForAssessmentType(assessmentType);
  
  // // Get roadmap data from cache
  const { data: roadmap, isLoading: isLoadingRoadmap } = useQuery({
    queryKey: ["/api/roadmap", normalizedLang],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/roadmap', null, {
        'Accept-Language': normalizedLang,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch roadmap: ${response.status}`);
      }
      return await response.json();
    },
    initialData: () => queryClient.getQueryData(["/api/roadmap", normalizedLang])
  });
  
  // Fetch assessment scores to identify scored categories
  const { data: resultId } = useQuery<string>({
    queryKey: ["/api/assessment/results", id],
    queryFn: async () => {
      if (!id) throw new Error('No session ID available');
      const response = await apiRequest('GET', `/api/assessment/results/${id}`, null);
      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!id
  });
  
  // Convert roadmap data to the legacy format for backward compatibility
  const convertToLegacyFormat = (roadmap: Roadmap | undefined): ImplementationRecommendation[] => {
    if (!roadmap || !roadmap.phases) return [];
    
    const allRecommendations: ImplementationRecommendation[] = [];
    
    // Map phase band to legacy phase name
    const bandToPhase: Record<string, string> = {
      'short': 'short_term',
      'medium': 'medium_term',
      'long': 'long_term'
    };
    
    roadmap.phases.forEach(phase => {
      if (!phase || !phase.recommendations) return;
      
      const phaseName = bandToPhase[phase.band] || 'short_term';
      
      const recommendations = phase.recommendations.map(rec => {
        // Skip invalid recommendations
        if (!rec) return null;
        
        // Get translated time unit
        const timeUnit = t(`timeUnits.${rec.timeline?.unit || 'weeks'}`, rec.timeline?.unit || 'weeks');
        
        return {
          id: rec.id || `rec-${Math.random().toString(36).substring(2, 9)}`,
          categoryId: rec.category || '',
          title: (rec.label && (rec.label[currentLang] || rec.label.en)) || 'Recommendation',
          description: (rec.description && (rec.description[currentLang] || rec.description.en)) || '',
          impact: (rec.impactLevel?.toUpperCase() as "HIGH" | "MEDIUM" | "LOW") || "MEDIUM",
          effort: (rec.effortLevel?.toUpperCase() as "HIGH" | "MEDIUM" | "LOW") || "MEDIUM",
          timeline: `${rec.timeline?.min || 1}-${rec.timeline?.max || 4} ${timeUnit}`,
          priority: rec.priorityRank || 999,
          phase: phaseName
        };
      }).filter(Boolean) as ImplementationRecommendation[]; // Filter out null values
      
      allRecommendations.push(...recommendations);
    });
    
    return allRecommendations;
  };
  
  // Get converted recommendations
  const recommendations = convertToLegacyFormat(roadmap);
  
  const handlePhaseSelect = (phase: string) => {
    setSelectedPhase(phase);
    setSelectedRecommendation(null); // Clear selected recommendation when changing phase
    setActiveTab("phase");
  };
  
  const handleRecommendationSelect = (recommendationId: string) => {
    setSelectedRecommendation(recommendationId);
    setActiveTab("recommendation");
  };
  
  const tabs = [
    { id: "overview", label: t('results:implementationRoadmap.title') },
    { id: "phase", label: t('results:phases.details', 'Phase Details') },
    { id: "recommendation", label: t('results:recommendations.details', 'Recommendation Details') },
  ];
  
  const headerTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    active: activeTab === tab.id,
    onClick: () => setActiveTab(tab.id)
  }));
  
  const getRecommendation = (id: string | null) => {
    if (!id || !recommendations) return null;
    return recommendations.find(rec => rec.id === id);
  };
  
  const getPhaseRecommendations = (phase: string | null) => {
    if (!phase || !recommendations) return [];
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
  
  // Get original recommendation from roadmap for additional data
  const getOriginalRecommendation = (id: string | null) => {
    if (!id || !roadmap) return null;
    return roadmap.recommendationsById[id];
  };
  
  // Custom function to select top priority recommendations
  const getTopPriorityRecommendations = (allRecommendations: ImplementationRecommendation[], limit = 3): ImplementationRecommendation[] => {
    if (!allRecommendations || allRecommendations.length === 0) return [];
    
    // Filter to only include recommendations from scored categories
    const scoredRecommendations = allRecommendations.filter(rec => 
      scoredCategories.includes(rec.categoryId)
    );
    
    if (scoredRecommendations.length === 0) return [];
    
    // 1. Get quick wins in Security & Compliance
    const securityQuickWins = scoredRecommendations.filter(rec => 
      rec.categoryId === 'security_compliance' && 
      getOriginalRecommendation(rec.id)?.quickWin === true
    );
    
    // 2. Get other quick wins
    const otherQuickWins = scoredRecommendations.filter(rec => 
      rec.categoryId !== 'security_compliance' && 
      getOriginalRecommendation(rec.id)?.quickWin === true
    );
    
    // 3. Get high impact, low effort recommendations
    const highImpactLowEffort = scoredRecommendations.filter(rec => 
      rec.impact === 'HIGH' && rec.effort === 'LOW' && 
      !getOriginalRecommendation(rec.id)?.quickWin
    );
    
    // 4. Get high impact, medium effort recommendations
    const highImpactMediumEffort = scoredRecommendations.filter(rec => 
      rec.impact === 'HIGH' && rec.effort === 'MEDIUM' && 
      !getOriginalRecommendation(rec.id)?.quickWin
    );
    
    // 5. Get medium impact, low effort recommendations
    const mediumImpactLowEffort = scoredRecommendations.filter(rec => 
      rec.impact === 'MEDIUM' && rec.effort === 'LOW' && 
      !getOriginalRecommendation(rec.id)?.quickWin
    );
    
    // Combine all groups in priority order
    const prioritized = [
      ...securityQuickWins,
      ...otherQuickWins,
      ...highImpactLowEffort,
      ...highImpactMediumEffort,
      ...mediumImpactLowEffort,
      // Add remaining recommendations as fallback
      ...scoredRecommendations.filter(rec => 
        !securityQuickWins.includes(rec) && 
        !otherQuickWins.includes(rec) && 
        !highImpactLowEffort.includes(rec) &&
        !highImpactMediumEffort.includes(rec) &&
        !mediumImpactLowEffort.includes(rec)
      )
    ];
    
    // Return the top N unique recommendations
    const uniqueRecs = Array.from(new Set(prioritized));
    return uniqueRecs.slice(0, limit);
  };
  
  const isLoading = isLoadingRoadmap;
  
  // Handle navigation back to results
  const handleBackToResults = () => {
    if (id) {
      navigate(`/results/${id}`);
    } else {
      // Fall back to non-UUID route for backward compatibility
      navigate("/results");
    }
  };
  
  // Add back button to actions
  const actions = (
    <Button 
      variant="outline" 
      onClick={handleBackToResults}
      className="flex items-center"
    >
      <i className="ri-arrow-left-line mr-2"></i>
      {t('navigation.backToResults', 'Back to Results')}
    </Button>
  );
  
  // Fetch recommendation details when a recommendation is selected
  const { details: recommendationDetails, loading: detailsLoading, error: detailsError } = useRecommendationDetails(selectedRecommendation);
  
  if (isLoading) {
    return (
      <AppLayout 
        title={t('implementationRoadmap.title')}
        subtitle={t('loading', 'Loading implementation roadmap data...')}
        actions={actions}
      >
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-80 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) {
    return (
      <AppLayout 
        title={t('implementationRoadmap.title')}
        subtitle={t('implementationRoadmap.noData', 'No implementation roadmap available')}
        actions={actions}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">
            <div className="text-5xl text-gray-300 mb-4">
              <i className="ri-route-line"></i>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t('noRoadmapTitle', 'No Implementation Roadmap Available')}</h2>
            <p className="text-gray-500">{t('noRoadmapMessage', 'Please complete the assessment to view your personalized implementation roadmap.')}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title={t('implementationRoadmap.title')} 
      subtitle={t('implementationRoadmap.subtitle')}
      tabs={headerTabs}
      actions={actions}
    >
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6">
              {/* SECTION 1: Implementation Phases */}
              <Card className="shadow-sm border-0">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold text-primary-800 mb-4">{t('phases.title', 'Implementation Phases')}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div 
                      className="p-4 border-0 shadow-sm rounded-lg bg-primary-50 cursor-pointer hover:bg-primary-100 transition-colors"
                      onClick={() => handlePhaseSelect("short_term")}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center text-primary-800">
                          <i className="ri-timer-line text-lg"></i>
                        </div>
                        <h3 className="ml-2 font-semibold text-primary-800">{t('implementationRoadmap.phase1')}</h3>
                      </div>
                      <p className="text-sm text-primary-700">
                        {t('phases.short_term.description', 'Quick wins and immediate improvements with high impact and low to medium effort.')}
                      </p>
                    </div>
                    
                    <div 
                      className="p-4 border-0 shadow-sm rounded-lg bg-secondary-50 cursor-pointer hover:bg-secondary-100 transition-colors"
                      onClick={() => handlePhaseSelect("medium_term")}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center text-secondary-800">
                          <i className="ri-calendar-line text-lg"></i>
                        </div>
                        <h3 className="ml-2 font-semibold text-secondary-800">{t('implementationRoadmap.phase2')}</h3>
                      </div>
                      <p className="text-sm text-secondary-700">
                        {t('phases.medium_term.description', 'Strategic improvements with significant impact that require more planning and resources.')}
                      </p>
                    </div>
                    
                    <div 
                      className="p-4 border-0 shadow-sm rounded-lg bg-accent-50 cursor-pointer hover:bg-accent-100 transition-colors"
                      onClick={() => handlePhaseSelect("long_term")}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-accent-200 rounded-full flex items-center justify-center text-accent-800">
                          <i className="ri-flight-takeoff-line text-lg"></i>
                        </div>
                        <h3 className="ml-2 font-semibold text-accent-800">{t('implementationRoadmap.phase3')}</h3>
                      </div>
                      <p className="text-sm text-accent-700">
                        {t('phases.long_term.description', 'Transformational initiatives with high impact that require significant investment and cultural change.')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* SECTION 2: Top Priority Recommendations */}
              <Card className="shadow-sm border-0">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold text-primary-800 mb-4">{t('topRecommendations.title', 'Top Priority Recommendations')}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getTopPriorityRecommendations(recommendations).map((rec, index) => {
                      const category = getCategoryInfo(rec.categoryId);
                      const originalRec = getOriginalRecommendation(rec.id);
                      
                      return (
                        <div 
                          key={rec.id}
                          className="p-4 shadow-sm border-0 rounded-lg hover:bg-primary-50 transition-colors cursor-pointer h-full"
                          onClick={() => handleRecommendationSelect(rec.id)}
                        >
                          <div className="flex items-start">
                            <div className="mr-3 mt-1">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white text-sm font-semibold">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-gray-800 font-semibold">{rec.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">{category?.title}</span> | {rec.timeline} | {currentLang === 'ja' ? `${t('implementationRoadmap.impact')} ${t(`impactLevels.${rec.impact.toLowerCase()}`, rec.impact.charAt(0) + rec.impact.slice(1).toLowerCase())}` : `${t(`impactLevels.${rec.impact.toLowerCase()}`, rec.impact.charAt(0) + rec.impact.slice(1).toLowerCase())} ${t('implementationRoadmap.impact')}`}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                              
                              {originalRec?.quickWin && (
                                <div className="mt-2">
                                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                                    {t('implementationRoadmap.quickWin')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* SECTION 3: Implementation Roadmap */}
              <Card className="shadow-sm border-0">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-primary-800 mb-2">{t('implementationRoadmap.title')}</h2>
                    <p className="text-gray-600">
                      {t('implementationRoadmap.subtitle')}
                    </p>
                  </div>
                  
                  <ImplementationRoadmap 
                    recommendations={recommendations}
                    onPhaseSelect={handlePhaseSelect}
                    onRecommendationSelect={handleRecommendationSelect}
                    roadmap={roadmap}
                    scoredCategories={scoredCategories}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="phase">
            <Card className="shadow-sm border-0">
              <CardContent className="pt-6">
                {selectedPhase ? (
                  <div>
                    <h2 className="text-xl font-semibold text-primary-800 mb-4">
                      {selectedPhase === "short_term" 
                        ? t('implementationRoadmap.phase1') + " (" + t('implementationRoadmap.timeframe.short') + ")"
                        : selectedPhase === "medium_term" 
                          ? t('implementationRoadmap.phase2') + " (" + t('implementationRoadmap.timeframe.medium') + ")"
                          : t('implementationRoadmap.phase3') + " (" + t('implementationRoadmap.timeframe.long') + ")"}
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                      {selectedPhase === "short_term" 
                        ? t('phases.short_term.detailedDescription', 'These recommendations focus on quick wins and immediate improvements that will establish the foundation for your cloud native journey.')
                        : selectedPhase === "medium_term" 
                          ? t('phases.medium_term.detailedDescription', 'These recommendations build on the short-term improvements and focus on expanding cloud native adoption across the organization.')
                          : t('phases.long_term.detailedDescription', 'These recommendations represent transformational changes that will elevate your organization to advanced cloud native maturity.')}
                    </p>
                    
                    <div className="space-y-4 mt-6">
                      {/* Scored recommendations */}
                      {getPhaseRecommendations(selectedPhase).filter(rec => scoredCategories.includes(rec.categoryId)).length > 0 ? (
                        getPhaseRecommendations(selectedPhase)
                          .filter(rec => scoredCategories.includes(rec.categoryId))
                          .map((rec) => {
                            const category = getCategoryInfo(rec.categoryId);
                            const isScored = true;
                            const borderClass = 'border-0 hover:bg-primary-50';
                            const bgClass = 'bg-white shadow-sm';
                            
                            return (
                              <div 
                                key={rec.id}
                                className={`p-4 rounded-lg transition-colors cursor-pointer ${borderClass} ${bgClass}`}
                                onClick={() => handleRecommendationSelect(rec.id)}
                              >
                                <div className="flex items-start">
                                  <div className="mr-3 mt-1">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white text-sm font-semibold`}>
                                      {rec.priority}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <h3 className="text-gray-800 font-semibold">{rec.title}</h3>
                                      <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-600`}>
                                        {category?.title}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      <span className="text-xs font-medium text-primary-800 bg-primary-100 px-2 py-0.5 rounded-full">
                                        {rec.timeline}
                                      </span>
                                      <span className={`text-xs font-medium text-${rec.impact === 'HIGH' ? 'accent' : rec.impact === 'MEDIUM' ? 'secondary' : 'green'}-800 bg-${rec.impact === 'HIGH' ? 'accent' : rec.impact === 'MEDIUM' ? 'secondary' : 'green'}-100 px-2 py-0.5 rounded-full`}>
                                        {currentLang === 'ja' ? `${t('implementationRoadmap.impact')} ${t(`impactLevels.${rec.impact.toLowerCase()}`, rec.impact.charAt(0) + rec.impact.slice(1).toLowerCase())}` : `${t(`impactLevels.${rec.impact.toLowerCase()}`, rec.impact.charAt(0) + rec.impact.slice(1).toLowerCase())} ${t('implementationRoadmap.impact')}`}
                                      </span>
                                      <span className={`text-xs font-medium text-${rec.effort === 'HIGH' ? 'red' : rec.effort === 'MEDIUM' ? 'yellow' : 'green'}-800 bg-${rec.effort === 'HIGH' ? 'red' : rec.effort === 'MEDIUM' ? 'yellow' : 'green'}-100 px-2 py-0.5 rounded-full`}>
                                        {currentLang === 'ja' ? `${t('implementationRoadmap.effort')} ${t(`effortLevels.${rec.effort.toLowerCase()}`, rec.effort.charAt(0) + rec.effort.slice(1).toLowerCase())}` : `${t(`effortLevels.${rec.effort.toLowerCase()}`, rec.effort.charAt(0) + rec.effort.slice(1).toLowerCase())} ${t('implementationRoadmap.effort')}`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      ) : null}
                      
                      {/* Separator and unscored recommendations */}
                      {getPhaseRecommendations(selectedPhase).some(rec => !scoredCategories.includes(rec.categoryId)) && (
                        <div className="py-2 px-1 text-xs text-gray-500 font-semibold border-t border-dashed border-gray-200 mt-3 pt-3">
                          {t('phases.needs_more_input', 'Needs more input to prioritise')}
                        </div>
                      )}
                      
                      {getPhaseRecommendations(selectedPhase)
                        .filter(rec => !scoredCategories.includes(rec.categoryId))
                        .map((rec) => {
                          const category = getCategoryInfo(rec.categoryId);
                          const isScored = false;
                          const borderClass = 'border-0 hover:bg-gray-50';
                          const bgClass = 'bg-gray-50 shadow-sm';
                          
                          return (
                            <div 
                              key={rec.id}
                              className={`p-4 rounded-lg transition-colors cursor-pointer ${borderClass} ${bgClass}`}
                              onClick={() => handleRecommendationSelect(rec.id)}
                            >
                              <div className="flex items-start">
                                <div className="mr-3 mt-1">
                                  <span className={`flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-sm font-semibold`}>
                                    {rec.priority}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="text-gray-800 font-semibold">{rec.title}</h3>
                                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-600`}>
                                      {category?.title}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="text-xs font-medium text-primary-800 bg-primary-100 px-2 py-0.5 rounded-full">
                                      {rec.timeline}
                                    </span>
                                    <span className={`text-xs font-medium text-${rec.impact === 'HIGH' ? 'accent' : rec.impact === 'MEDIUM' ? 'secondary' : 'green'}-800 bg-${rec.impact === 'HIGH' ? 'accent' : rec.impact === 'MEDIUM' ? 'secondary' : 'green'}-100 px-2 py-0.5 rounded-full`}>
                                      {currentLang === 'ja' ? `${t('implementationRoadmap.impact')} ${t(`impactLevels.${rec.impact.toLowerCase()}`, rec.impact.charAt(0) + rec.impact.slice(1).toLowerCase())}` : `${t(`impactLevels.${rec.impact.toLowerCase()}`, rec.impact.charAt(0) + rec.impact.slice(1).toLowerCase())} ${t('implementationRoadmap.impact')}`}
                                    </span>
                                    <span className={`text-xs font-medium text-${rec.effort === 'HIGH' ? 'red' : rec.effort === 'MEDIUM' ? 'yellow' : 'green'}-800 bg-${rec.effort === 'HIGH' ? 'red' : rec.effort === 'MEDIUM' ? 'yellow' : 'green'}-100 px-2 py-0.5 rounded-full`}>
                                      {currentLang === 'ja' ? `${t('implementationRoadmap.effort')} ${t(`effortLevels.${rec.effort.toLowerCase()}`, rec.effort.charAt(0) + rec.effort.slice(1).toLowerCase())}` : `${t(`effortLevels.${rec.effort.toLowerCase()}`, rec.effort.charAt(0) + rec.effort.slice(1).toLowerCase())} ${t('implementationRoadmap.effort')}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      
                      {getPhaseRecommendations(selectedPhase).length === 0 && (
                        <div className="text-center py-10">
                          <div className="text-4xl text-gray-300 mb-3">
                            <i className="ri-file-list-3-line"></i>
                          </div>
                          <p className="text-gray-600">{t('implementationRoadmap.noRecommendations')}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 p-3 bg-gray-50 shadow-sm border-0 rounded-lg text-sm text-gray-600">
                      <div className="flex items-center">
                        <i className="ri-information-line text-gray-500 mr-1"></i>
                        <span className="italic">{t('implementationRoadmap.categoriesNote')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-4xl text-gray-300 mb-3">
                      <i className="ri-calendar-line"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('phases.no_phase_selected.title', 'No Phase Selected')}</h2>
                    <p className="text-gray-500">{t('phases.no_phase_selected.description', 'Please select a phase from the roadmap to view detailed recommendations.')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommendation">
            <Card className="shadow-sm border-0">
              <CardContent className="pt-6">
                {(() => {
                  const recommendation = getRecommendation(selectedRecommendation);
                  if (!recommendation) {
                    return (
                      <div className="text-center py-10">
                        <div className="text-4xl text-gray-300 mb-3">
                          <i className="ri-file-list-3-line"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('recommendations.no_recommendation_selected.title', 'No Recommendation Selected')}</h2>
                        <p className="text-gray-500">{t('recommendations.no_recommendation_selected.description', 'Please select a recommendation to view detailed information.')}</p>
                      </div>
                    );
                  }
                  
                  const categoryInfo = getCategoryInfo(recommendation.categoryId);
                  const currentLanguage = i18n.language?.startsWith('ja') ? 'ja' : 'en';
                  
                  return (
                    <div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-primary-800">{recommendation.title}</h2>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-primary-600">{categoryInfo?.title}</span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-sm text-gray-600">{recommendation.phase === 'short_term' ? t('implementationRoadmap.timeframe.short') : recommendation.phase === 'medium_term' ? t('implementationRoadmap.timeframe.medium') : t('implementationRoadmap.timeframe.long')}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${recommendation.impact === 'HIGH' ? 'bg-accent-100 text-accent-800' : recommendation.impact === 'MEDIUM' ? 'bg-secondary-100 text-secondary-800' : 'bg-green-100 text-green-800'}`}>
                            {currentLang === 'ja' ? `${t('implementationRoadmap.impact')} ${t(`impactLevels.${recommendation.impact.toLowerCase()}`, recommendation.impact.charAt(0) + recommendation.impact.slice(1).toLowerCase())}` : `${t(`impactLevels.${recommendation.impact.toLowerCase()}`, recommendation.impact.charAt(0) + recommendation.impact.slice(1).toLowerCase())} ${t('implementationRoadmap.impact')}`}
                          </span>
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${recommendation.effort === 'HIGH' ? 'bg-red-100 text-red-800' : recommendation.effort === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {currentLang === 'ja' ? `${t('implementationRoadmap.effort')} ${t(`effortLevels.${recommendation.effort.toLowerCase()}`, recommendation.effort.charAt(0) + recommendation.effort.slice(1).toLowerCase())}` : `${t(`effortLevels.${recommendation.effort.toLowerCase()}`, recommendation.effort.charAt(0) + recommendation.effort.slice(1).toLowerCase())} ${t('implementationRoadmap.effort')}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border-0 mb-6">
                        <p className="text-gray-600">
                          {recommendation.description}
                        </p>
                      </div>

                      {/* Loading state for recommendation details */}
                      {detailsLoading && (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                            <span className="text-gray-600">{t('recommendations.loadingDetails', 'Loading implementation details...')}</span>
                          </div>
                        </div>
                      )}

                      {/* Error state for recommendation details */}
                      {detailsError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                          <div className="flex items-center">
                            <i className="ri-error-warning-line text-red-500 mr-2"></i>
                            <span className="text-red-700">{t('recommendations.errorLoading', 'Failed to load implementation details')}: {detailsError}</span>
                          </div>
                        </div>
                      )}

                      {/* Show detailed content when available */}
                      {!detailsLoading && !detailsError && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Implementation Steps */}
                          <div>
                            <h3 className="text-lg font-semibold text-primary-800 mb-3">{t('recommendations.implementation', 'Implementation Details')}</h3>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <ol className="list-decimal pl-5 space-y-2">
                                {(recommendationDetails?.implementationSteps?.[currentLanguage] || [
                                  t('recommendations.fallbackSteps.research', 'Research and evaluate appropriate tools and approaches'),
                                  t('recommendations.fallbackSteps.plan', 'Create detailed implementation plan with stakeholders'),
                                  t('recommendations.fallbackSteps.implement', 'Implement solution in a controlled environment'),
                                  t('recommendations.fallbackSteps.test', 'Test and validate functionality and performance'),
                                  t('recommendations.fallbackSteps.rollout', 'Roll out to broader organization with appropriate training'),
                                  t('recommendations.fallbackSteps.document', 'Document processes and create operational procedures')
                                ]).map((step: string, index: number) => (
                                  <li key={index} className="text-gray-600">{step}</li>
                                ))}
                              </ol>
                            </div>
                          </div>
                          
                          {/* Success Criteria */}
                          <div>
                            <h3 className="text-lg font-semibold text-primary-800 mb-3">{t('recommendations.successCriteria', 'Success Criteria')}</h3>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <ul className="list-disc pl-5 space-y-2">
                                {(recommendationDetails?.successCriteria?.[currentLanguage] || [
                                  t('recommendations.fallbackCriteria.timeline', 'Implementation is completed within the specified timeline'),
                                  t('recommendations.fallbackCriteria.adoption', 'The solution is adopted by relevant teams and stakeholders'),
                                  t('recommendations.fallbackCriteria.metrics', 'Key metrics show improvement in the target area'),
                                  t('recommendations.fallbackCriteria.documentation', 'Documentation and operational procedures are in place'),
                                  t('recommendations.fallbackCriteria.scores', 'Relevant assessment scores improve by at least 15 points')
                                ]).map((criteria: string, index: number) => (
                                  <li key={index} className="text-gray-600">{criteria}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Dependencies (if available) */}
                          {recommendationDetails?.dependencies && recommendationDetails.dependencies.length > 0 && (
                            <div className="md:col-span-2">
                              <h3 className="text-lg font-semibold text-primary-800 mb-3">{t('recommendations.prerequisites', 'Prerequisites')}</h3>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="space-y-3">
                                  {recommendationDetails.dependencies.map((dep: any, index: number) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <i className="ri-link text-blue-600 text-sm"></i>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-blue-900">{dep.label[currentLanguage]}</h4>
                                        <p className="text-sm text-blue-700 mt-1">{dep.description[currentLanguage]}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Additional Considerations (if available) */}
                          {recommendationDetails?.considerations && recommendationDetails.considerations[currentLanguage] && recommendationDetails.considerations[currentLanguage].length > 0 && (
                            <div className="md:col-span-2">
                              <h3 className="text-lg font-semibold text-primary-800 mb-3">{t('recommendations.additionalConsiderations', 'Additional Considerations')}</h3>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <ul className="list-disc pl-5 space-y-2">
                                  {recommendationDetails.considerations[currentLanguage].map((consideration: string, index: number) => (
                                    <li key={index} className="text-gray-600">{consideration}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

