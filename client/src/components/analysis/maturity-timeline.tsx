import React from "react";
import { getMaturityLevel, calculateOverallScore } from "@/lib/assessmentUtils";
import type { Assessment, CategoryScore } from "@shared/schema";

interface MaturityTimelineProps {
  assessment: Assessment;
  categoryScores: CategoryScore[];
  previousAssessment?: {
    date: string;
    score: number;
  };
  onViewTrendAnalysis?: () => void;
}

// Helper function to format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function MaturityTimeline({ 
  assessment, 
  categoryScores, 
  previousAssessment,
  onViewTrendAnalysis
}: MaturityTimelineProps) {
  const overallScore = calculateOverallScore(categoryScores);
  const currentMaturityLevel = getMaturityLevel(overallScore);
  
  // Determine next target level
  const nextLevel = currentMaturityLevel.id === 'beginner' 
    ? 'Intermediate' 
    : currentMaturityLevel.id === 'intermediate' 
      ? 'Advanced' 
      : 'Expert';
  
  const nextTargetScore = currentMaturityLevel.id === 'beginner' 
    ? 75 
    : currentMaturityLevel.id === 'intermediate' 
      ? 90 
      : 95;
  
  // Calculate target date (in a real app, this would be more sophisticated)
  const currentDate = new Date();
  const targetDate = new Date();
  targetDate.setMonth(currentDate.getMonth() + (currentMaturityLevel.id === 'beginner' ? 6 : 4));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Maturity Evolution Timeline</h2>
        {onViewTrendAnalysis && (
          <button 
            onClick={onViewTrendAnalysis}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center"
          >
            View trend analysis <i className="ri-arrow-right-line ml-1"></i>
          </button>
        )}
      </div>
      
      {/* Timeline */}
      <div className="relative border-l-2 border-gray-200 pl-6 ml-3 mt-8">
        {/* Previous milestone (if exists) */}
        {previousAssessment && (
          <div className="relative mb-8 flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center absolute -left-[42px] z-10">
              <i className="ri-check-line text-white"></i>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-gray-800 font-semibold">First Cloud Native Assessment</h3>
                <span className="text-sm text-gray-500">{previousAssessment.date}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <p>
                  Initial assessment with a score of {previousAssessment.score}% ({getMaturityLevel(previousAssessment.score).label}). 
                  Key focus was establishing containerization practices.
                </p>
              </div>
              <div className="mt-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-maturity-${getMaturityLevel(previousAssessment.score).id} text-white">
                  {getMaturityLevel(previousAssessment.score).label} ({previousAssessment.score}%)
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Current milestone */}
        <div className="relative mb-8 flex items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center absolute -left-[42px] z-10">
            <i className="ri-star-fill text-white"></i>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 font-semibold">Current Assessment</h3>
              <span className="text-sm text-gray-500">{formatDate(new Date())}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <p>
                {previousAssessment 
                  ? `Improved to ${overallScore}% (${currentMaturityLevel.label}). Significant progress in CI/CD and Kubernetes orchestration.`
                  : `Current maturity score is ${overallScore}% (${currentMaturityLevel.label}).`
                }
              </p>
            </div>
            <div className="mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-maturity-${currentMaturityLevel.id} text-white">
                {currentMaturityLevel.label} ({overallScore}%)
              </span>
            </div>
          </div>
        </div>
        
        {/* Future milestone */}
        <div className="relative flex items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center absolute -left-[42px] z-10">
            <i className="ri-flag-line text-gray-600"></i>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 font-semibold">Target: {nextLevel} Maturity</h3>
              <span className="text-sm text-gray-500">{formatDate(targetDate)}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <p>
                Expected to reach {nextTargetScore}%+ ({nextLevel}) by implementing security improvements and service mesh adoption.
              </p>
            </div>
            <div className="mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {nextLevel} ({nextTargetScore}%+)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaturityTimeline;
