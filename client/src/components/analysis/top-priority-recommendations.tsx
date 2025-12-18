/**
 * @file top-priority-recommendations.tsx
 * @description トップ優先度の実装推奨事項コンポーネント
 * ダッシュボード上に表示する主要な実装推奨事項を表示します。
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ASSESSMENT_CATEGORIES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

// Interfaces for recommendations data structure
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

// Interface for legacy format recommendations
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

interface TopPriorityRecommendationsProps {
  onViewImplementationPlan?: () => void;
}

export function TopPriorityRecommendations({ onViewImplementationPlan }: TopPriorityRecommendationsProps) {
  const { t, i18n } = useTranslation(['results', 'categories'], { nsMode: 'fallback' });
  const currentLang = i18n.language?.startsWith('ja') ? 'ja' : 'en';
  const [recommendations, setRecommendations] = useState<ImplementationRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Normalize language for consistent queryKey
  const normalizedLang = i18n.language || 'en';
  const queryClient = useQueryClient();

  // Get roadmap data from cache (already fetched by results-dashboard)
  const roadmapData = queryClient.getQueryData<Roadmap>(["/api/roadmap", normalizedLang]);
  const isLoading = roadmapData === undefined;

  // Process roadmap data when it changes
  useEffect(() => {
    if (roadmapData) {
      const convertedRecommendations = convertToLegacyFormat(roadmapData);
      const topRecommendations = getTopPriorityRecommendations(convertedRecommendations, 3);
      setRecommendations(topRecommendations);
      setError(null);
    }
  }, [roadmapData]);

  // Convert roadmap data to the legacy format for compatibility
  const convertToLegacyFormat = (roadmap: Roadmap): ImplementationRecommendation[] => {
    if (!roadmap || !roadmap.phases) return [];
    
    const allRecommendations: ImplementationRecommendation[] = [];
    
    // Map phase band to legacy phase name
    const bandToPhase: Record<string, string> = {
      'short': 'short_term',
      'medium': 'medium_term',
      'long': 'long_term'
    };
    
    roadmap.phases.forEach(phase => {
      const phaseName = bandToPhase[phase.band] || 'short_term';
      
      const phaseRecommendations = phase.recommendations.map(rec => {
        // Get translated time unit
        const timeUnit = t(`timeUnits.${rec.timeline.unit}`, rec.timeline.unit);
        
        return {
          id: rec.id,
          categoryId: rec.category,
          title: rec.label[currentLang] || rec.label.en,
          description: rec.description[currentLang] || rec.description.en,
          impact: rec.impactLevel.toUpperCase() as "HIGH" | "MEDIUM" | "LOW",
          effort: rec.effortLevel.toUpperCase() as "HIGH" | "MEDIUM" | "LOW",
          timeline: `${rec.timeline.min}-${rec.timeline.max} ${timeUnit}`,
          priority: rec.priorityRank,
          phase: phaseName
        };
      });
      
      allRecommendations.push(...phaseRecommendations);
    });
    
    return allRecommendations;
  };

  // Helper function to get top priority recommendations
  const getTopPriorityRecommendations = (allRecommendations: ImplementationRecommendation[], limit = 3): ImplementationRecommendation[] => {
    if (!allRecommendations || allRecommendations.length === 0) return [];
    
    // First prioritize quick wins from "short_term" phase
    const shortTermRecs = allRecommendations.filter(rec => rec.phase === "short_term");
    
    // Sort by priority rank (lower number = higher priority)
    const sortedRecs = shortTermRecs.sort((a, b) => a.priority - b.priority);
    
    // Return top N recommendations
    return sortedRecs.slice(0, limit);
  };

  // Helper function to get category info
  const getCategoryInfo = (categoryId: string) => {
    const category = ASSESSMENT_CATEGORIES.find(cat => cat.id === categoryId);
    
    if (category) {
      // Return the category with translated title
      return {
        ...category,
        title: t(`categories.${categoryId}`, category.title)
      };
    }
    
    return null;
  };

  // Loading state
  if (roadmapData === undefined) {
    return (
      <Card className="bg-white border-0 shadow">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold">{t('topRecommendations.title', 'Top Priority Recommendations')}</h2>
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse space-y-4 w-full">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-gray-200 mr-3"></div>
                  <div className="w-full">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-white border-0 shadow">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold">{t('topRecommendations.title', 'Top Priority Recommendations')}</h2>
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <i className="ri-error-warning-line text-3xl mb-2"></i>
              <p>{t('errors.loadingFailed', 'Failed to load recommendations')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (recommendations.length === 0) {
    return (
      <Card className="bg-white border-0 shadow">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold">{t('topRecommendations.title', 'Top Priority Recommendations')}</h2>
          <div className="flex justify-between items-center mb-4">
            {onViewImplementationPlan && (
              <button 
                onClick={onViewImplementationPlan}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center"
              >
                {t('navigation.viewAllRecommendations', 'View all')} <i className="ri-arrow-right-line ml-1"></i>
              </button>
            )}
          </div>
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <i className="ri-route-line text-3xl text-gray-300 mb-2"></i>
              <p className="text-gray-500">{t('noRecommendations', 'No recommendations available')}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4" 
                onClick={onViewImplementationPlan}
              >
                {t('navigation.implementationPlan', 'View Implementation Plan')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-0 shadow">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold">{t('topRecommendations.title', 'Top Priority Recommendations')}</h2>
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const category = getCategoryInfo(rec.categoryId);
            
            return (
              <div 
                key={rec.id}
                className="flex items-start"
              >
                <div className="mr-3 mt-1">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white text-sm font-semibold">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="text-gray-800 font-semibold">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">{category?.title}</span> | {rec.timeline} | {currentLang === 'ja' ? `${t('trailMap.impactEffort.impact', 'Impact')} ${t(`impactLevels.${rec.impact.toLowerCase()}`, rec.impact)}` : `${t(`impactLevels.${rec.impact.toLowerCase()}`, rec.impact)} ${t('trailMap.impactEffort.impact', 'Impact')}`}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{rec.description}</p>
                  
                  {rec.phase === 'short_term' && (
                    <div className="mt-2">
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                        {t('implementationRoadmap.quickWin', 'Quick win!')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopPriorityRecommendations; 