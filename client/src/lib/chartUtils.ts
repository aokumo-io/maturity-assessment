import { MATURITY_LEVELS, ASSESSMENT_CATEGORIES } from './constants';
import type { CategoryScore } from '@shared/schema';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    pointBackgroundColor?: string;
    pointRadius?: number;
    barPercentage?: number;
    categoryPercentage?: number;
    order?: number;
  }[];
  medianData?: number[];
  categoryIds?: string[];
}

/**
 * Generate chart data for category bar chart
 */
export function generateCategoryBarChartData(
  categoryScores: CategoryScore[],
  industryData?: { 
    overallComparison: { org: number, avg: number, leaders: number },
    categoryComparisons: { [key: string]: { org: number, avg: number, leaders: number } }
  }
): ChartData {
  // Include all categories, including those marked as knowledge_gap
  // Sort from highest to lowest score
  const sortedScores = [...categoryScores].sort((a, b) => {
    // Handle knowledge gap categories (they should appear at the bottom)
    if (a.maturityLevel === "knowledge_gap" && b.maturityLevel !== "knowledge_gap") return 1;
    if (a.maturityLevel !== "knowledge_gap" && b.maturityLevel === "knowledge_gap") return -1;
    
    // For normal scores, sort normally
    return b.score - a.score;
  });
  
  const labels: string[] = [];
  const data: number[] = [];
  const backgroundColor: string[] = [];
  const medianData: number[] = [];
  const categoryIds: string[] = [];
  
  sortedScores.forEach(category => {
    const categoryInfo = ASSESSMENT_CATEGORIES.find(c => c.id === category.categoryId);
    if (categoryInfo) {
      // Store the category ID for translation in the component
      labels.push(categoryInfo.title); // Use title for display, we'll translate in the component
      categoryIds.push(categoryInfo.id); // Save ID for translation
      
      // Use a default low value for knowledge gap categories for visualization
      const displayScore = category.maturityLevel === "knowledge_gap" 
        ? 10 // Use a small value to show a visible bar
        : category.score;
      
      data.push(displayScore);
      
      // Get industry median if available
      if (industryData && industryData.categoryComparisons[category.categoryId]) {
        medianData.push(industryData.categoryComparisons[category.categoryId].avg);
      } else {
        // Use default median value if no data available
        medianData.push(55); 
      }
      
      // Determine color based on maturity level
      let maturityLevel;
      if (category.maturityLevel === "knowledge_gap") {
        maturityLevel = MATURITY_LEVELS.KNOWLEDGE_GAP;
      } else {
        maturityLevel = category.score <= MATURITY_LEVELS.BEGINNER.range[1]
          ? MATURITY_LEVELS.BEGINNER
          : category.score <= MATURITY_LEVELS.INTERMEDIATE.range[1]
            ? MATURITY_LEVELS.INTERMEDIATE
            : MATURITY_LEVELS.ADVANCED;
      }
      
      backgroundColor.push(maturityLevel.color);
    }
  });
  
  return {
    labels,
    datasets: [
      {
        label: 'Maturity Score',
        data,
        backgroundColor,
        borderWidth: 0,
        borderRadius: 4
      }
    ],
    // Add custom properties for the custom background drawing
    medianData,
    categoryIds
  };
}

/**
 * Generate chart data for radar chart
 */
export function generateRadarChartData(categoryScores: CategoryScore[]): ChartData {
  const labels: string[] = [];
  const data: number[] = [];
  const knowledgeGapData: number[] = [];
  
  // Ensure all categories are represented in the radar chart
  ASSESSMENT_CATEGORIES.forEach(category => {
    labels.push(category.title);
    
    // Find the category score
    const categoryScore = categoryScores.find(c => c.categoryId === category.id);
    
    // Handle different types of responses
    if (categoryScore) {
      if (categoryScore.maturityLevel === "knowledge_gap") {
        // For knowledge gap, use small value but with different color in separate dataset
        data.push(0);
        knowledgeGapData.push(10); // Small but visible value
      } else if (categoryScore.score >= 0) {
        data.push(categoryScore.score);
        knowledgeGapData.push(0); // No knowledge gap for this one
      } else {
        // Default case (not answered)
        data.push(0);
        knowledgeGapData.push(0);
      }
    } else {
      // Category not in scores at all
      data.push(0);
      knowledgeGapData.push(0);
    }
  });
  
  return {
    labels,
    datasets: [
      {
        label: 'Your Organization',
        data,
        backgroundColor: 'rgba(30, 64, 175, 0.2)', // Blue to match #1e40af
        borderColor: 'rgba(30, 64, 175, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#1e40af',
        pointRadius: 4
      },
      {
        label: 'Industry Median',
        data: Array(labels.length).fill(55), // Example median value
        backgroundColor: 'rgba(75, 85, 99, 0.2)', // Gray to match #4b5563
        borderColor: 'rgba(75, 85, 99, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#4b5563',
        pointRadius: 4
      },
      {
        label: 'Industry Leaders',
        data: Array(labels.length).fill(80), // Example leader value
        backgroundColor: 'rgba(5, 150, 105, 0.2)', // Green to match #059669
        borderColor: 'rgba(5, 150, 105, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#059669',
        pointRadius: 4
      },
      {
        label: 'Knowledge Gaps',
        data: knowledgeGapData,
        backgroundColor: 'rgba(148, 112, 220, 0.2)', // Knowledge gap purple
        borderColor: 'rgba(148, 112, 220, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#a855f7',
        pointRadius: 4
      }
    ]
  };
}

/**
 * Generate chart data for industry comparison chart
 */
export function generateIndustryComparisonChartData(
  categoryScores: CategoryScore[],
  industryData: { 
    overallComparison: { org: number, avg: number, leaders: number },
    categoryComparisons: { [key: string]: { org: number, avg: number, leaders: number } }
  }
): ChartData {
  const labels = ['Overall'];
  const yourOrgData = [industryData.overallComparison.org];
  const industryAvgData = [industryData.overallComparison.avg];
  const industryLeadersData = [industryData.overallComparison.leaders];
  
  // Add category comparisons
  ASSESSMENT_CATEGORIES.forEach(category => {
    const categoryComparison = industryData.categoryComparisons[category.id];
    if (categoryComparison) {
      labels.push(category.title);
      yourOrgData.push(categoryComparison.org);
      industryAvgData.push(categoryComparison.avg);
      industryLeadersData.push(categoryComparison.leaders);
    }
  });
  
  return {
    labels,
    datasets: [
      {
        label: 'Your Organization',
        data: yourOrgData,
        backgroundColor: '#294364', // Primary
        borderWidth: 0,
        borderRadius: 4
      },
      {
        label: 'Industry Average',
        data: industryAvgData,
        backgroundColor: '#9ca3af', // Gray
        borderWidth: 0,
        borderRadius: 4
      },
      {
        label: 'Industry Leaders',
        data: industryLeadersData,
        backgroundColor: '#10b981', // Green
        borderWidth: 0,
        borderRadius: 4
      }
    ]
  };
}

/**
 * Generate chart data for doughnut chart (overall score)
 */
export function generateOverallScoreChartData(score: number): ChartData {
  // Special case for knowledge gap or not started (-1)
  if (score < 0) {
    return {
      labels: ['Knowledge Gap'],
      datasets: [
        {
          label: 'Knowledge Gap',
          data: [100], // Full circle
          backgroundColor: [
            MATURITY_LEVELS.KNOWLEDGE_GAP.color // Purple
          ],
          borderWidth: 0
        }
      ]
    };
  }
  
  // Normal score visualization
  return {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        label: 'Overall Score',
        data: [score, 100 - score],
        backgroundColor: [
          getScoreColor(score),
          '#e5e7eb' // Light gray
        ],
        borderWidth: 0
      }
    ]
  };
}

/**
 * Get color based on score
 */
function getScoreColor(score: number): string {
  if (score < 0) {
    // Score -1 is considered "not started" or "knowledge gap"
    return MATURITY_LEVELS.KNOWLEDGE_GAP.color; // Use purple for knowledge gaps
  } else if (score <= MATURITY_LEVELS.BEGINNER.range[1]) {
    return MATURITY_LEVELS.BEGINNER.color;
  } else if (score <= MATURITY_LEVELS.INTERMEDIATE.range[1]) {
    return MATURITY_LEVELS.INTERMEDIATE.color;
  } else {
    return MATURITY_LEVELS.ADVANCED.color;
  }
}

/**
 * Generate chart data for simplified radar chart (dashboard version with only user score)
 */
export function generateSimplifiedRadarChartData(categoryScores: CategoryScore[]): ChartData {
  const labels: string[] = [];
  const data: number[] = [];
  const knowledgeGapData: number[] = [];
  
  // Ensure all categories are represented in the radar chart
  ASSESSMENT_CATEGORIES.forEach(category => {
    labels.push(category.title);
    
    // Find the category score
    const categoryScore = categoryScores.find(c => c.categoryId === category.id);
    
    // Handle different types of responses
    if (categoryScore) {
      if (categoryScore.maturityLevel === "knowledge_gap") {
        // For knowledge gap, use small value but with different color in separate dataset
        data.push(0);
        knowledgeGapData.push(10); // Small but visible value
      } else if (categoryScore.score >= 0) {
        data.push(categoryScore.score);
        knowledgeGapData.push(0); // No knowledge gap for this one
      } else {
        // Default case (not answered)
        data.push(0);
        knowledgeGapData.push(0);
      }
    } else {
      // Category not in scores at all
      data.push(0);
      knowledgeGapData.push(0);
    }
  });
  
  return {
    labels,
    datasets: [
      {
        label: 'Your Organization',
        data,
        backgroundColor: 'rgba(41, 67, 100, 0.2)',
        borderColor: 'rgba(41, 67, 100, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#294364',
        pointRadius: 3 // Slightly smaller points for dashboard
      },
      {
        label: 'Knowledge Gaps',
        data: knowledgeGapData,
        backgroundColor: 'rgba(148, 112, 220, 0.2)', // Knowledge gap purple
        borderColor: 'rgba(148, 112, 220, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#a855f7',
        pointRadius: 3
      }
    ]
  };
}
