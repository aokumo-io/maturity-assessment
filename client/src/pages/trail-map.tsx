import React, { useState, useEffect } from "react";
import { logger } from '@/lib/logger';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AppLayout from "@/components/layout/app-layout";
import TrailMapComponent from "@/components/analysis/trail-map-component";
import { ASSESSMENT_CATEGORIES, MATURITY_LEVELS } from "@/lib/constants";
import { Assessment, CategoryScore } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { persistenceManager } from "@/lib/assessmentUtils";
import { useTranslation } from "react-i18next";
import { generatePrioritizedFocusAreas } from "@/lib/ai-service";
import { getCategoriesForAssessmentType, getStoredAssessmentType } from "@/lib/assessmentFlowService";
import { apiRequest } from '@/lib/queryClient';
import { ChevronRight } from "lucide-react";


// Type definition for milestone data
interface Milestone {
  title: string;
  description: string;
  implementationTip?: string;
  impact?: 'High' | 'Medium' | 'Low';
  effort?: 'High' | 'Medium' | 'Low';
  roiScore?: number;
  timeline?: Timeline;
  quickWin?: boolean;
}

// Type for the milestone map storage
type MilestoneMap = Record<string, Milestone[]>;

// Type definition for prioritized focus areas
interface PrioritizedFocusArea {
  categoryId: string;
  priority: number;
  reason: string;
  timeframe: string;
  quickWin: boolean;
}

// Roadmap data types from TrailMapComponent
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
  label: LocalizedText;
  description: LocalizedText;
  phase?: 'beginner' | 'intermediate' | 'advanced';
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

export default function TrailMap() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [aiMilestones, setAiMilestones] = useState<MilestoneMap>({});
  const [isLoadingMilestones, setIsLoadingMilestones] = useState<boolean>(false);
  const [activeCategoryLevel, setActiveCategoryLevel] = useState<string>("");
  const [prioritizedFocusAreas, setPrioritizedFocusAreas] = useState<PrioritizedFocusArea[]>([]);
  const [isLoadingPriorities, setIsLoadingPriorities] = useState<boolean>(false);
  const [showJourneyInsights, setShowJourneyInsights] = useState<boolean>(true);
  const { toast } = useToast();
  const { t, i18n } = useTranslation('results');
  const [, navigate] = useLocation();
  const [panelVisible, setPanelVisible] = useState(false);
  const [animationState, setAnimationState] = useState<'enter' | 'exit' | 'switch' | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCategory && !currentCategory) {
      setPanelVisible(true);
      setCurrentCategory(selectedCategory);
      setAnimationState('enter');
    } else if (selectedCategory && selectedCategory !== currentCategory) {
      setCurrentCategory(selectedCategory);
      setAnimationState('enter');
    }
  }, [selectedCategory]);

  const handleClose = () => {
    setAnimationState('exit');
    setTimeout(() => {
      setPanelVisible(false);
      setCurrentCategory(null);
      setSelectedCategory(null);
    }, 400);
  };

  // Extract UUID from URL if present
  const { id } = useParams<{ id?: string }>();
  
  // Normalize language for consistent queryKey
  const normalizedLang = i18n.language || 'en';
  const queryClient = useQueryClient();
  
  // Fetch assessment data
  const { data: assessment, isLoading: isLoadingAssessment } = useQuery<Assessment>({
    queryKey: ["/api/assessment/current"]
  });

  // Get roadmap data from cache
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

  // Get category scores from cache
  const { data: categoryScores, isLoading: isLoadingScores } = useQuery({
    queryKey: ["/api/assessment/scores"],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/assessment/scores');
      if (!response.ok) {
        throw new Error(`Failed to fetch category scores: ${response.status}`);
      }
      return await response.json();
    },
    initialData: () => queryClient.getQueryData(["/api/assessment/scores"]),
  });
  
  // Load saved milestone data when component mounts and process roadmap data
  useEffect(() => {
    if (!isLoadingAssessment && !isLoadingScores && assessment && categoryScores && categoryScores.length > 0) {
      // Load saved priorities from localStorage
      const savedPriorities = persistenceManager.loadTrailMapPriorities();
      if (savedPriorities && savedPriorities.length > 0) {
        setPrioritizedFocusAreas(savedPriorities);
      }
      
      // Extract prioritized focus areas from roadmap if available and needed
      if (!prioritizedFocusAreas.length && roadmap) {
        const extractedPriorities = extractPrioritiesFromRoadmap(roadmap);
        if (extractedPriorities.length > 0) {
          setPrioritizedFocusAreas(extractedPriorities);
          persistenceManager.saveTrailMapPriorities(extractedPriorities);
        }
      }
    }
  }, [isLoadingAssessment, isLoadingScores, assessment?.id, categoryScores?.length, roadmap, prioritizedFocusAreas.length]);
  
  // Extract prioritized focus areas from roadmap data
  const extractPrioritiesFromRoadmap = (roadmapData: Roadmap): PrioritizedFocusArea[] => {
    if (!roadmapData || !roadmapData.phases || !roadmapData.phases.length) {
      return [];
    }
    
    // Get categories for current assessment type
    const assessmentType = getStoredAssessmentType();
    const assessedCategories = getCategoriesForAssessmentType(assessmentType);
    
    // Get top recommendations from the first (short-term) phase
    const shortTermPhase = roadmapData.phases.find(phase => phase.band === 'short');
    if (!shortTermPhase || !shortTermPhase.recommendations) {
      return [];
    }
    
    // Group recommendations by category
    const categoriesMap: Record<string, RoadmapRecommendation[]> = {};
    shortTermPhase.recommendations.forEach(rec => {
      // Only include categories that are part of the current assessment type
      if (!assessedCategories.includes(rec.category)) return;
      
      if (!categoriesMap[rec.category]) {
        categoriesMap[rec.category] = [];
      }
      categoriesMap[rec.category].push(rec);
    });
    
    // Get top recommendation from each category
    const topCategoryRecs = Object.entries(categoriesMap)
      .map(([category, recs]) => {
        // Sort by priority rank (lower is better)
        const sortedRecs = [...recs].sort((a, b) => a.priorityRank - b.priorityRank);
        return sortedRecs[0]; // Take the highest priority one
      })
      .sort((a, b) => a.priorityRank - b.priorityRank)
      .slice(0, 5); // Limit to top 5
    
    // Convert to PrioritizedFocusArea format
    return topCategoryRecs.map((rec, index) => ({
      categoryId: rec.category,
      priority: index + 1,
      reason: `${rec.impactLevel} impact, ${rec.effortLevel} effort implementation with ROI score ${rec.roiScore}`,
      timeframe: rec.timeline.max <= 4 ? "immediate" : rec.timeline.max <= 8 ? "near-term" : "long-term",
      quickWin: rec.quickWin
    }));
  };
  
  const getCategoryInfo = (categoryId: string) => {
    const category = ASSESSMENT_CATEGORIES.find(cat => cat.id === categoryId);
    const score = categoryScores?.find(score => score.categoryId === categoryId);
    return { category, score };
  };
  
  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory) {
      if (selectedCategory !== categoryId) {
        setAnimationState('switch');
        setTimeout(() => {
          setSelectedCategory(categoryId);
          setActiveTab("details");
        }, 400);
      }
    } else {
      setSelectedCategory(categoryId);
      setActiveTab("details");
    }
  };
  
  // Get roadmap recommendations for a specific category
  const getCategoryRecommendations = (categoryId: string): RoadmapRecommendation[] => {
    if (!roadmap) return [];
    
    // Flatten all recommendations from all phases
    const allRecommendations = roadmap.phases.flatMap(phase => phase.recommendations);
    
    // Find recommendations for this category, sorted by priority rank
    return allRecommendations
      .filter(rec => rec.category === categoryId)
      .sort((a, b) => a.priorityRank - b.priorityRank);
  };
  
  // Modified fetchPrioritizedFocusAreas function - now used only as fallback
  const fetchPrioritizedFocusAreas = async () => {
    if (!categoryScores || !Array.isArray(categoryScores) || categoryScores.length === 0) return;
    
    // Load saved priorities from localStorage first
    const savedPriorities = persistenceManager.loadTrailMapPriorities();
    if (savedPriorities && savedPriorities.length > 0) {
      setPrioritizedFocusAreas(savedPriorities);
      return; // Exit early if we have saved data
    }
    
    // If we already have prioritized focus areas in state, no need to regenerate
    if (prioritizedFocusAreas.length > 0) return;
    
    // Get organization info - use real API data
    const organizationInfoResponse = await apiRequest('GET', '/api/assessment/organization', null);
    let organizationInfo = null;
    
    if (organizationInfoResponse.ok) {
      organizationInfo = await organizationInfoResponse.json();
    } else {
      // Use minimal fallback only if API fails - no hardcoded business values
      organizationInfo = {
        industry: "other",
        companySize: "101-250", 
        region: "global",
        cloudProviders: ["other"],
        deploymentModel: "other",
        userRole: null
      };
      logger.warn('Trail Map: Failed to fetch organization data, using minimal fallback');
    }
    
    setIsLoadingPriorities(true);
    
    try {
      const response = await generatePrioritizedFocusAreas(categoryScores, organizationInfo, 'anthropic');
      
      if (response.status === 'success' && response.content) {
        try {
          const parsedResponse = JSON.parse(response.content);
          if (Array.isArray(parsedResponse) && parsedResponse.length > 0) {
            // Get current assessment type and filter priorities by assessed categories
            const assessmentType = getStoredAssessmentType();
            const assessedCategories = getCategoriesForAssessmentType(assessmentType);
            
            // Filter out priorities for categories not in the current assessment type
            const filteredPriorities = parsedResponse.filter(priority => 
              assessedCategories.includes(priority.categoryId)
            );
            
            setPrioritizedFocusAreas(filteredPriorities);
            // Save priorities to localStorage
            persistenceManager.saveTrailMapPriorities(filteredPriorities);
            return;
          }
        } catch (e) {
          logger.error("Failed to parse AI priorities response:", e);
        }
      }
      
      // Fallback to generated priorities
      const fallbackPriorities = generateFallbackPriorities();
      setPrioritizedFocusAreas(fallbackPriorities);
      // Save fallback priorities to localStorage
      persistenceManager.saveTrailMapPriorities(fallbackPriorities);
      
    } catch (error) {
      logger.error("Error generating prioritized focus areas:", error);
      // Fallback to generated priorities
      const fallbackPriorities = generateFallbackPriorities();
      setPrioritizedFocusAreas(fallbackPriorities);
      // Save fallback priorities to localStorage
      persistenceManager.saveTrailMapPriorities(fallbackPriorities);
    } finally {
      setIsLoadingPriorities(false);
    }
  };
  
  // Generate fallback priorities based on maturity levels
  const generateFallbackPriorities = () => {
    if (!categoryScores || !categoryScores.length) {
      return [] as PrioritizedFocusArea[];
    }
    
    // Get current assessment type and filter by assessed categories
    const assessmentType = getStoredAssessmentType();
    const assessedCategories = getCategoriesForAssessmentType(assessmentType);
    
    // Sort categories by score (ascending) to prioritize the lowest ones
    // First filter by assessment type, then by score
    const sortedCategories = [...categoryScores]
      .filter(cat => assessedCategories.includes(cat.categoryId)) // Filter by assessment type
      .filter(cat => cat.score >= 0) // Filter out categories with no data
      .sort((a, b) => a.score - b.score);
    
    const fallbackPriorities: PrioritizedFocusArea[] = sortedCategories.slice(0, 5).map((cat, idx) => {
      // Find matching category
      const category = ASSESSMENT_CATEGORIES.find(c => c.id === cat.categoryId);
      
      return {
        categoryId: cat.categoryId,
        priority: idx + 1,
        reason: `Low maturity score (${cat.score}%) indicates need for immediate focus`,
        timeframe: cat.score < 30 ? "immediate" : cat.score < 60 ? "near-term" : "long-term",
        quickWin: cat.score > 10 && cat.score < 40 // Quick wins are possible in partially started areas
      };
    });
    
    return fallbackPriorities;
  };
  
  // Helper function to get milestone data for each category and level
  const getMilestones = (categoryId: string, level: "beginner" | "intermediate" | "advanced"): Milestone[] => {
    // Get the score for the current category
    const score = categoryScores?.find((s: CategoryScore) => s.categoryId === categoryId);
    if (!score) return [];
    
    // Get current language for localization
    const currentLang = i18n.language.startsWith('ja') ? 'ja' : 'en';
    
    // If we have roadmap data, use it
    if (roadmap && !isLoadingRoadmap) {
      // Get all recommendations for this category
      const recommendations = getCategoryRecommendations(categoryId);
      if (recommendations.length > 0) {
        // Filter recommendations by maturity level based on their phase or position
        let filteredRecommendations: RoadmapRecommendation[] = [];
        
        // Try to filter recommendations by their phase property if available
        const filteredByPhase = recommendations.filter(rec => {
          const recommendationInfo = roadmap.recommendationsById[rec.id];
          // Use type assertion to access the phase property
          const phase = (recommendationInfo as any).phase;
          return phase && phase.toLowerCase() === level.toLowerCase();
        });
        
        if (filteredByPhase.length > 0) {
          // Use phase-based filtering if available
          filteredRecommendations = filteredByPhase;
        } else {
          // Fallback to position-based filtering
          // Different levels get different recommendations based on priority ranking
          if (level === "beginner") {
            // Top 3 recommendations for beginner
            filteredRecommendations = recommendations
              .sort((a, b) => a.priorityRank - b.priorityRank)
              .slice(0, 3);
          } else if (level === "intermediate") {
            // Middle 3 recommendations for intermediate
            filteredRecommendations = recommendations
              .sort((a, b) => a.priorityRank - b.priorityRank)
              .slice(3, 6);
          } else if (level === "advanced") {
            // Remaining recommendations for advanced
            filteredRecommendations = recommendations
              .sort((a, b) => a.priorityRank - b.priorityRank)
              .slice(6, 9);
          }
        }
        
        // Map to milestone format with proper localization
        return filteredRecommendations.map(rec => ({
          title: rec.label[currentLang as keyof LocalizedText] || 
                 rec.stepRef.replace(/^[a-z]+_/, '').split('-').map(word => 
                   word.charAt(0).toUpperCase() + word.slice(1)
                 ).join(' '),
          description: rec.description?.[currentLang as keyof LocalizedText] || '',
          impact: rec.impactLevel,
          effort: rec.effortLevel,
          roiScore: rec.roiScore,
          timeline: rec.timeline,
          quickWin: rec.quickWin,
          implementationTip: rec.quickWin 
            ? `Quick win! Can be completed in ${rec.timeline.min}-${rec.timeline.max} ${rec.timeline.unit}`
            : `Estimated timeline: ${rec.timeline.min}-${rec.timeline.max} ${rec.timeline.unit}`
        }));
      }
    }
    
    // Return empty placeholders if no roadmap data is available
    return Array(3).fill(null).map((_, index) => ({
      title: isLoadingRoadmap 
        ? t('trailMap.loadingRecommendation', 'Loading recommendation...')
        : t('trailMap.noRecommendation', 'No recommendation available'),
      description: isLoadingRoadmap
        ? t('trailMap.loadingDescription', 'Please wait while we load recommendations...')
        : t('trailMap.noRecommendationDescription', 'No recommendation data is available for this category.'),
      impact: 'Medium' as const,
      effort: 'Medium' as const,
      roiScore: 70,
      timeline: { min: 1, max: 3, unit: 'weeks' as const },
      quickWin: false
    }));
  };
  
  const tabs = [
    { id: "overview", label: t('trailMap.overview') },
    { id: "details", label: t('trailMap.details') },
  ];
  
  const headerTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    active: activeTab === tab.id,
    onClick: () => setActiveTab(tab.id)
  }));
  
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
  
  if (isLoadingAssessment || isLoadingScores) {
    return (
      <AppLayout 
        title={t('trailMap.title')} 
        subtitle={t('trailMap.loading', 'Loading trail map data...')}
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
  
  if (!assessment || !categoryScores || categoryScores.length === 0) {
    return (
      <AppLayout 
        title={t('trailMap.title')} 
        subtitle={t('trailMap.noData', 'No assessment data available')}
        actions={actions}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">
            <div className="text-5xl text-gray-300 mb-4">
              <i className="ri-roadmap-line"></i>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t('trailMap.noTrailMapAvailable', 'No Cloud Native Trail Map Available')}</h2>
            <p className="text-gray-500">{t('trailMap.pleaseCompleteAssessment', 'Please complete the assessment to view your personalized trail map.')}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Get categories for the current assessment type
  const assessmentType = getStoredAssessmentType();
  // Use safe default for categoryScores
  const safeScores = categoryScores || [];

  const allCategories = getCategoriesForAssessmentType(assessmentType);
  
  // Create tabs for each category
  const categoryTabs = allCategories.map(catId => {
    const categoryInfo = getCategoryInfo(catId);
    if (!categoryInfo) return null;
    
    // Find score info
    const scoreInfo = safeScores.find(score => score.categoryId === catId);
    const maturityLevel = scoreInfo ? scoreInfo.maturityLevel : 'beginner';
    
    return {
      id: catId,
      label: categoryInfo.category?.title || catId,
      active: selectedCategory === catId,
      onClick: () => handleCategorySelect(catId),
      indicator: maturityLevel
    };
  }).filter(Boolean);

  return (
    <AppLayout 
      title={t('trailMap.title')}
      subtitle={t('trailMap.subtitle')}
      actions={actions}
    >
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 min-h-0 gap-6" style={{ alignItems: "start", height: 0 }}>
          <div id="overview" className={`${selectedCategory ? 'lg:col-span-7' : 'lg:col-span-10'}`}>
            <div className="grid grid-cols-1 gap-6">
              {/* Journey Insights Panel */}
              <Collapsible
                open={showJourneyInsights}
                onOpenChange={setShowJourneyInsights}
                className="rounded-lg border-0 shadow bg-insights overflow-hidden"
              >
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <i className="ri-map-pin-line text-[#294364] text-xl"></i>
                    <h2 className="text-xl font-bold text-primary-800">{t('trailMap.journeyInsights', 'Journey Insights')}</h2>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <i className={`ri-arrow-${showJourneyInsights ? 'up' : 'down'}-s-line`}></i>
                      <span className="sr-only">{showJourneyInsights ? 'Hide' : 'Show'} journey insights</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent>
                  <div className="px-6 pb-4">
                    {isLoadingPriorities ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    ) : prioritizedFocusAreas.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          {t('trailMap.insightsDescription')}
                        </p>
                        <div className="space-y-3">
                          {prioritizedFocusAreas.slice(0, 5).map((area, index) => {
                            const category = ASSESSMENT_CATEGORIES.find(cat => cat.id === area.categoryId);
                            const categoryScore = categoryScores?.find(s => s.categoryId === area.categoryId);
                            const maturityLevel = categoryScore?.maturityLevel || "beginner";
                            
                            // Safely get maturity level color
                            let maturityColor = "#294364"; // Default color
                            if (maturityLevel === "beginner") {
                              maturityColor = MATURITY_LEVELS.BEGINNER.color;
                            } else if (maturityLevel === "intermediate") {
                              maturityColor = MATURITY_LEVELS.INTERMEDIATE.color;
                            } else if (maturityLevel === "advanced") {
                              maturityColor = MATURITY_LEVELS.ADVANCED.color;
                            }
                            
                            const borderColor = index === 0 
                              ? MATURITY_LEVELS.BEGINNER.color 
                              : maturityColor;
                            
                            return (
                              <div 
                                key={area.categoryId} 
                                className="flex items-start space-x-3 border-l-2 pl-3" 
                                style={{ borderColor }}
                              >
                                <div 
                                  className="flex-shrink-0 w-6 h-6 text-white rounded-full flex items-center justify-center font-bold"
                                  style={{ backgroundColor: index === 0 
                                    ? MATURITY_LEVELS.BEGINNER.color 
                                    : maturityColor
                                  }}
                                >
                                  {area.priority}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {t(`trailMap.milestoneCategories.${area.categoryId}.title`, {
                                      defaultValue: category?.title || area.categoryId
                                    })}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {area.reason.includes('impact') && area.reason.includes('effort') ? (
                                      <>
                                        {t('trailMap.impactEffort.impact')}：{t(`trailMap.impactEffort.${area.reason.match(/(\w+) impact/)?.[1] || 'Medium'}`, {
                                          defaultValue: area.reason.match(/(\w+) impact/)?.[1] || 'Medium'
                                        })}, {' '}
                                        {t('trailMap.impactEffort.effort')}：{t(`trailMap.impactEffort.${area.reason.match(/(\w+) effort/)?.[1] || 'Medium'}`, {
                                          defaultValue: area.reason.match(/(\w+) effort/)?.[1] || 'Medium'
                                        })}, {t('implementationRoadmap.roi', 'ROI')}: {area.reason.match(/score (\d+)/)?.[1] || ''}
                                      </>
                                    ) : (
                                      area.reason
                                    )}
                                  </div>
                                  <div className="mt-1 flex items-center gap-3">
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                      {t(`trailMap.timeframes.${area.timeframe}`, {
                                        defaultValue: area.timeframe
                                      })}
                                    </span>
                                    {area.quickWin && (
                                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                        {t('trailMap.quickWin')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        <p>{t('trailMap.waitingInsights')}</p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Card className="bg-white border-0 shadow">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-primary-800 mb-2">{t('trailMap.journeyTitle')}</h2>
                    <p className="text-gray-600">
                      {t('trailMap.journeyDescription')}
                    </p>
                  </div>
                  
                  <TrailMapComponent 
                    categoryScores={categoryScores} 
                    onCategorySelect={handleCategorySelect}
                    prioritizedFocusAreas={prioritizedFocusAreas}
                  />
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium text-primary-800 mb-4">{t('trailMap.legendTitle')}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MATURITY_LEVELS.ADVANCED.color }}></div>
                      <span className="text-sm">{t('trailMap.legendCompleted')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MATURITY_LEVELS.INTERMEDIATE.color }}></div>
                      <span className="text-sm">{t('trailMap.legendInProgress')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MATURITY_LEVELS.BEGINNER.color }}></div>
                      <span className="text-sm">{t('trailMap.legendNextSteps')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                      <span className="text-sm">{t('trailMap.legendFuture')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded border-2" style={{ borderColor: MATURITY_LEVELS.BEGINNER.color }}></div>
                      <span className="text-sm">{t('trailMap.legendFocusArea')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0 w-5 h-5 bg-[#294364] text-white text-xs rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <span className="text-sm">{t('trailMap.legendPriority')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{t('trailMap.immediate')}</span>
                      <span className="text-sm">{t('trailMap.legendImmediate')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">{t('trailMap.nearTerm')}</span>
                      <span className="text-sm">{t('trailMap.legendNearTerm')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">{t('trailMap.quickWin')}</span>
                      <span className="text-sm">{t('trailMap.legendQuickWin')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {selectedCategory && panelVisible && (
            <div 
              className={`lg:col-span-3 h-full ${
                animationState === 'enter'
                  ? 'animate-fade-slide-in'
                  : animationState === 'exit'
                  ? 'animate-slide-out-left'
                  : animationState === 'switch'
                  ? 'animate-fade-slide-out'
                  : ''
              }`} id="details">
              <div
                className={`transition-transform duration-300 sticky self-start bg-white rounded-lg shadow-md top-3`}
                style={{ width: "auto" }}
              >
                  <Card className="border-0 shadow max-h-[90vh] overflow-y-auto hide-scrollbar">
                  <CardContent className="pt-6">
                    {(() => {
                      const { category, score } = getCategoryInfo(selectedCategory);
                      if (!category || !score) return null;
                      
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div className="top-6 right-10 absolute z-40" >
                              <button onClick={handleClose}>
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-primary-800">
                                {t(`trailMap.milestoneCategories.${selectedCategory}.title`, {
                                  defaultValue: category.title
                                })} {t('trailMap.pathSuffix')}
                              </h2>
                              <p className="text-gray-600 mt-1">
                                {t(`categories:${selectedCategory}.description`, {
                                  defaultValue: category.description
                                })}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className={`px-4 py-2 text-lg rounded-full font-bold bg-maturity-${score.maturityLevel} text-white`}>
                                {score.score}% {t('trailMap.complete')}
                              </div>
                              <span className="font-medium text-gray-600 mt-2">
                                {t(`maturityLevels.${score.maturityLevel}`)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="relative mt-8">
                            {/* Timeline line with progress indicators */}
                            <div className="absolute left-12 top-0 h-full w-0.5 bg-gray-200"></div>
                            
                            {/* Completed section (beginner) */}
                            {score.score > MATURITY_LEVELS.BEGINNER.range[1] && (
                              <div 
                                className="absolute left-12 top-0 w-0.5" 
                                style={{ 
                                  backgroundColor: MATURITY_LEVELS.BEGINNER.color,
                                  height: '33%'  // Adjust as needed to cover beginner section
                                }}
                              ></div>
                            )}
                            
                            {/* Completed section (intermediate) */}
                            {score.score > MATURITY_LEVELS.INTERMEDIATE.range[1] && (
                              <div 
                                className="absolute left-12 top-[33%] w-0.5" 
                                style={{ 
                                  backgroundColor: MATURITY_LEVELS.INTERMEDIATE.color,
                                  height: '33%'  // Adjust as needed to cover intermediate section
                                }}
                              ></div>
                            )}
                            
                            {/* Completed section (advanced) */}
                            {score.score > MATURITY_LEVELS.ADVANCED.range[1] && (
                              <div 
                                className="absolute left-12 top-[66%] w-0.5" 
                                style={{ 
                                  backgroundColor: MATURITY_LEVELS.ADVANCED.color,
                                  height: '34%'  // Adjust as needed to cover advanced section
                                }}
                              ></div>
                            )}
                            
                            {/* Beginner milestones */}
                            <div className="relative mb-10">
                              <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-800 font-medium z-10 ml-7">1</div>
                                <h3 className="ml-4 text-xl font-bold text-primary-800">{t('trailMap.beginnerMilestones')}</h3>
                              </div>
                              
                              <div className="ml-24 space-y-5">
                                {isLoadingMilestones && activeCategoryLevel === "beginner" ? (
                                  <div className="text-center py-6">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2"></div>
                                    <p className="text-sm text-gray-500">{t('trailMap.generatingRecommendations')}</p>
                                  </div>
                                ) : (
                                  <>
                                    {getMilestones(selectedCategory, "beginner").map((milestone: Milestone, idx: number) => {
                                      // Determine milestone status based on score and maturity level boundaries
                                      const beginnerUpperBound = MATURITY_LEVELS.BEGINNER.range[1]; // 50
                                      let status: 'completed' | 'current' | 'future' = 'future';
                                      
                                      if (score.score > beginnerUpperBound) {
                                        status = 'completed';
                                      } else {
                                        status = 'current';
                                      }
                                      
                                      // Determine style based on status
                                      const dotColor = status === 'completed' 
                                        ? MATURITY_LEVELS.BEGINNER.color
                                        : status === 'current'
                                          ? MATURITY_LEVELS.BEGINNER.color
                                          : '#d1d5db'; // gray-300
                                          
                                      const textStyle = status === 'completed'
                                        ? 'text-green-600 font-medium'
                                        : status === 'current'
                                          ? 'text-gray-800 font-medium'
                                          : 'text-gray-500';
                                      
                                      return (
                                        <div key={idx} className="flex items-start">
                                          <div className="relative ml-7">
                                            <div className="w-6 h-6 rounded-full mt-1 flex items-center justify-center" 
                                              style={{ backgroundColor: dotColor }}
                                            >
                                              {status === 'completed' && (
                                                <i className="ri-check-line text-[8px] text-white"></i>
                                              )}
                                            </div>
                                          </div>
                                          <div className="ml-3">
                                            <div className="flex items-center">
                                              <p className={`text-sm font-medium ${textStyle}`}>{milestone.title}</p>
                                              {status === 'completed' && (
                                                <span className="ml-2 text-green-500 text-xs">
                                                  <i className="ri-check-line"></i> {t('trailMap.completed')}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-sm text-gray-600">{milestone.description}</p>
                                            {milestone.implementationTip && (
                                              <p className="text-xs text-[#294364] mt-1 italic">
                                                <span className="font-medium">{t('trailMap.implementationTip')}:</span> {milestone.implementationTip}
                                              </p>
                                            )}
                                            {milestone.quickWin && (
                                              <span className="inline-block text-xs mt-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                                {t('trailMap.quickWin')}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Intermediate milestones */}
                            <div className="relative mb-10">
                              <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-800 font-medium z-10 ml-7">2</div>
                                <h3 className="ml-4 text-xl font-bold text-primary-800">{t('trailMap.intermediateMilestones')}</h3>
                              </div>
                              
                              <div className="ml-24 space-y-5">
                                {isLoadingMilestones && activeCategoryLevel === "intermediate" ? (
                                  <div className="text-center py-6">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2"></div>
                                    <p className="text-sm text-gray-500">{t('trailMap.generatingRecommendations')}</p>
                                  </div>
                                ) : (
                                  <>
                                    {getMilestones(selectedCategory, "intermediate").map((milestone: Milestone, idx: number) => {
                                      // Determine milestone status based on score and maturity level boundaries
                                      const beginnerUpperBound = MATURITY_LEVELS.BEGINNER.range[1]; // 50
                                      const intermediateUpperBound = MATURITY_LEVELS.INTERMEDIATE.range[1]; // 75
                                      let status: 'completed' | 'current' | 'future' = 'future';
                                      
                                      if (score.score > intermediateUpperBound) {
                                        status = 'completed';
                                      } else if (score.score > beginnerUpperBound && score.score <= intermediateUpperBound) {
                                        status = 'current';
                                      } else {
                                        status = 'future';
                                      }
                                      
                                      // Determine style based on status
                                      const dotColor = status === 'completed' 
                                        ? MATURITY_LEVELS.INTERMEDIATE.color
                                        : status === 'current'
                                          ? MATURITY_LEVELS.INTERMEDIATE.color
                                          : '#d1d5db'; // gray-300
                                          
                                      const textStyle = status === 'completed'
                                        ? 'text-green-600 font-medium'
                                        : status === 'current'
                                          ? 'text-gray-800 font-medium'
                                          : 'text-gray-500';
                                      
                                      return (
                                        <div key={idx} className="flex items-start">
                                          <div className="relative ml-7">
                                            <div className="w-6 h-6 rounded-full mt-1 flex items-center justify-center" 
                                              style={{ backgroundColor: dotColor }}
                                            >
                                              {status === 'completed' && (
                                                <i className="ri-check-line text-[8px] text-white"></i>
                                              )}
                                            </div>
                                          </div>
                                          <div className="ml-3">
                                            <div className="flex items-center">
                                              <p className={`text-sm font-medium ${textStyle}`}>{milestone.title}</p>
                                              {status === 'completed' && (
                                                <span className="ml-2 text-green-500 text-xs">
                                                  <i className="ri-check-line"></i> {t('trailMap.completed')}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-sm text-gray-600">{milestone.description}</p>
                                            {milestone.implementationTip && (
                                              <p className="text-xs text-[#294364] mt-1 italic">
                                                <span className="font-medium">{t('trailMap.implementationTip')}:</span> {milestone.implementationTip}
                                              </p>
                                            )}
                                            {milestone.quickWin && (
                                              <span className="inline-block text-xs mt-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                                {t('trailMap.quickWin')}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Advanced milestones */}
                            <div className="relative">
                              <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-800 font-medium z-10 ml-7">3</div>
                                <h3 className="ml-4 text-xl font-bold text-primary-800">{t('trailMap.advancedMilestones')}</h3>
                              </div>
                              
                              <div className="ml-24 space-y-5">
                                {isLoadingMilestones && activeCategoryLevel === "advanced" ? (
                                  <div className="text-center py-6">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2"></div>
                                    <p className="text-sm text-gray-500">{t('trailMap.generatingRecommendations')}</p>
                                  </div>
                                ) : (
                                  <>
                                    {getMilestones(selectedCategory, "advanced").map((milestone: Milestone, idx: number) => {
                                      // Determine milestone status based on score and maturity level boundaries
                                      const intermediateUpperBound = MATURITY_LEVELS.INTERMEDIATE.range[1]; // 75
                                      const advancedUpperBound = MATURITY_LEVELS.ADVANCED.range[1]; // 100
                                      let status: 'completed' | 'current' | 'future' = 'future';
                                      
                                      if (score.score > advancedUpperBound) {
                                        status = 'completed';
                                      } else if (score.score > intermediateUpperBound && score.score <= advancedUpperBound) {
                                        status = 'current';
                                      } else {
                                        status = 'future';
                                      }
                                      
                                      // Determine style based on status
                                      const dotColor = status === 'completed' 
                                        ? MATURITY_LEVELS.ADVANCED.color
                                        : status === 'current'
                                          ? MATURITY_LEVELS.ADVANCED.color
                                          : '#d1d5db'; // gray-300
                                          
                                      const textStyle = status === 'completed'
                                        ? 'text-green-600 font-medium'
                                        : status === 'current'
                                          ? 'text-gray-800 font-medium'
                                          : 'text-gray-500';
                                      
                                      return (
                                        <div key={idx} className="flex items-start">
                                          <div className="relative ml-7">
                                            <div className="w-6 h-6 rounded-full mt-1 flex items-center justify-center" 
                                              style={{ backgroundColor: dotColor }}
                                            >
                                              {status === 'completed' && (
                                                <i className="ri-check-line text-[8px] text-white"></i>
                                              )}
                                            </div>
                                          </div>
                                          <div className="ml-3">
                                            <div className="flex items-center">
                                              <p className={`text-sm font-medium ${textStyle}`}>{milestone.title}</p>
                                              {status === 'completed' && (
                                                <span className="ml-2 text-green-500 text-xs">
                                                  <i className="ri-check-line"></i> {t('trailMap.completed')}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-sm text-gray-600">{milestone.description}</p>
                                            {milestone.implementationTip && (
                                              <p className="text-xs text-[#294364] mt-1 italic">
                                                <span className="font-medium">{t('trailMap.implementationTip')}:</span> {milestone.implementationTip}
                                              </p>
                                            )}
                                            {milestone.quickWin && (
                                              <span className="inline-block text-xs mt-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                                {t('trailMap.quickWin')}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
         {/* <Card className="border-0 shadow">
           <CardContent className="pt-6 text-center">
             <div className="py-12">
               <div className="text-5xl text-gray-300 mb-4">
                 <i className="ri-route-line"></i>
               </div>
               <h2 className="text-xl font-medium text-gray-700 mb-2">{t('trailMap.noPathSelected')}</h2>
               <p className="text-gray-500 mb-6">{t('trailMap.selectCategoryPrompt')}</p>
               <Button onClick={() => setActiveTab("overview")}>
                 {t('trailMap.goToTrailMap')}
               </Button>
             </div>
           </CardContent>
         </Card> */}
        </div>
      </div>
    </AppLayout>
  );
}