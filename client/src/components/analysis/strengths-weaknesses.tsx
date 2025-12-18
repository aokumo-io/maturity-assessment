import React from "react";
import { sortCategoriesByScore, getCategoryById } from "@/lib/assessmentUtils";
import { MATURITY_LEVELS } from "@/lib/constants";
import type { CategoryScore } from "@shared/schema";

interface StrengthsWeaknessesProps {
  categoryScores: CategoryScore[];
  strengthsCount?: number;
  weaknessesCount?: number;
}

export function StrengthsWeaknesses({ 
  categoryScores, 
  strengthsCount = 3, 
  weaknessesCount = 3 
}: StrengthsWeaknessesProps) {
  // Get top strengths (highest scores)
  const strengths = sortCategoriesByScore(categoryScores, 'desc').slice(0, strengthsCount);
  
  // Get top weaknesses (lowest scores)
  const weaknesses = sortCategoriesByScore(categoryScores, 'asc').slice(0, weaknessesCount);
  
  // Sample strength/weakness analysis text (in a real app, this would be more sophisticated)
  const getStrengthAnalysis = (categoryId: string): string => {
    const analyses: Record<string, string> = {
      cicd: "Strong automation pipeline with integrated testing",
      containerization: "Consistent container standards and practices",
      team_culture: "Strong DevOps culture with cross-functional teams",
      kubernetes: "Well-configured clusters with proper resource management",
      observability: "Comprehensive monitoring with proactive alerting",
      security: "Established security policies and practices",
      networking: "Well-designed network architecture and policies",
      storage: "Effective storage management and backup strategies"
    };
    
    return analyses[categoryId] || "Good practices and implementation";
  };
  
  const getWeaknessAnalysis = (categoryId: string): string => {
    const analyses: Record<string, string> = {
      security: "Lacking runtime security monitoring and response",
      storage: "Basic storage provisioning with limited automation",
      networking: "Limited service mesh implementation and network policies",
      observability: "Insufficient tracing and correlation capabilities",
      kubernetes: "Minimal multi-cluster management strategies",
      cicd: "Limited automated testing in deployment pipeline",
      team_culture: "Siloed teams with limited collaboration",
      containerization: "Inconsistent container image management"
    };
    
    return analyses[categoryId] || "Needs improvement in key areas";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Strengths & Improvement Areas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Top Strengths</h3>
          
          {strengths.map((strength) => {
            const category = getCategoryById(strength.categoryId);
            const maturityLevel = strength.score <= MATURITY_LEVELS.BEGINNER.range[1] 
              ? MATURITY_LEVELS.BEGINNER 
              : strength.score <= MATURITY_LEVELS.INTERMEDIATE.range[1] 
                ? MATURITY_LEVELS.INTERMEDIATE 
                : MATURITY_LEVELS.ADVANCED;
            
            return (
              <div key={strength.categoryId} className="mb-4 bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="ri-check-line text-green-600 mr-2"></i>
                    <span className="text-gray-800 font-semibold">{category?.title || strength.categoryId}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{strength.score}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{getStrengthAnalysis(strength.categoryId)}</p>
              </div>
            );
          })}
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Top Improvement Areas</h3>
          
          {weaknesses.map((weakness) => {
            const category = getCategoryById(weakness.categoryId);
            const maturityLevel = weakness.score <= MATURITY_LEVELS.BEGINNER.range[1] 
              ? MATURITY_LEVELS.BEGINNER 
              : weakness.score <= MATURITY_LEVELS.INTERMEDIATE.range[1] 
                ? MATURITY_LEVELS.INTERMEDIATE 
                : MATURITY_LEVELS.ADVANCED;
            
            return (
              <div key={weakness.categoryId} className="mb-4 bg-amber-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line text-amber-600 mr-2"></i>
                    <span className="text-gray-800 font-semibold">{category?.title || weakness.categoryId}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">{weakness.score}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{getWeaknessAnalysis(weakness.categoryId)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StrengthsWeaknesses;
