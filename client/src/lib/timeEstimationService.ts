/**
 * @file timeEstimationService.ts
 * @description データ駆動型の「次のレベルまでの時間」予測ロジック
 * 組織情報、カテゴリースコア、ロードマップアイテムに基づいて、次の成熟度レベルに到達するための時間を推定します。
 */

import { MATURITY_LEVELS, BASE_CATEGORY_BOOSTS } from "./constants";
import type { CategoryScore } from "@shared/schema";

// Define types needed for the function
interface RoadmapItem {
  id: string;
  category: string;
  priority: number;
  effort_points: number;
  currentCategoryScore?: number; // May be provided or calculated
  impact_level?: 'high' | 'medium' | 'low';
  dependencies?: string[];
}

interface VelocityTable {
  pointsPerIdealDay: number;
  idealDaysPerSprint: number;
  parallelStreams: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
}

interface OrganizationInfo {
  industry?: string;
  companySize?: string;
  region?: string;
  userRole?: string;
  cloudProviders?: string[];
  deploymentModel?: string;
  businessObjectives?: string[];
}

interface TimeEstimate {
  weeks: number;
  months: number;
  confidence: 'high' | 'medium' | 'low';
  keyFactors: string[];
  topRecommendations: RoadmapItem[];
}

/**
 * Get the threshold percentage for the next maturity level
 * @param currentPct Current maturity percentage
 * @returns Percentage threshold for next level
 */
function getNextThreshold(currentPct: number): number {
  if (currentPct < 0) return 25; // For knowledge gaps, start with beginner target
  if (currentPct < MATURITY_LEVELS.BEGINNER.range[1]) {
    return MATURITY_LEVELS.INTERMEDIATE.range[0]; // Beginner to Intermediate
  } else if (currentPct < MATURITY_LEVELS.INTERMEDIATE.range[1]) {
    return MATURITY_LEVELS.ADVANCED.range[0]; // Intermediate to Advanced
  } else {
    return currentPct < MATURITY_LEVELS.ADVANCED.range[1]
      ? MATURITY_LEVELS.ADVANCED.range[1]
      : 100; // Advanced to Expert (use 100% as max target)
  }
}

/**
 * Get the human-readable name of the next maturity level
 * @param currentPct Current maturity percentage
 * @returns ID of the next maturity level
 */
export function getNextLevelName(currentPct: number): string {
  if (currentPct < 0) return MATURITY_LEVELS.BEGINNER.id; // For knowledge gaps
  if (currentPct < MATURITY_LEVELS.BEGINNER.range[1]) {
    return MATURITY_LEVELS.INTERMEDIATE.id;
  } else if (currentPct < MATURITY_LEVELS.INTERMEDIATE.range[1]) {
    return MATURITY_LEVELS.ADVANCED.id;
  } else {
    return "expert"; // Beyond the defined levels
  }
}

/**
 * Enhanced time estimation function that incorporates organizational context
 * @param currentPct Current overall maturity percentage
 * @param categoryScores Scores for all categories
 * @param items Roadmap implementation items
 * @param vel Velocity table with implementation speed data
 * @param orgInfo Organization information
 * @returns Detailed time estimate with confidence and factors
 */
export function enhancedTimeToNextMaturity(
  currentPct: number,
  categoryScores: CategoryScore[],
  items: RoadmapItem[],
  vel: VelocityTable,
  orgInfo: OrganizationInfo
): TimeEstimate {
  // Input validation
  if (!vel || vel.pointsPerIdealDay <= 0 || vel.idealDaysPerSprint <= 0) {
    throw new Error('Invalid velocity table: pointsPerIdealDay and idealDaysPerSprint must be positive');
  }
  
  if (!categoryScores || categoryScores.length === 0) {
    throw new Error('Category scores are required');
  }
  
  // 1. Determine next threshold
  const nextThreshold = getNextThreshold(currentPct);
  const gapNeeded = nextThreshold - currentPct;
  
  // BUG FIX: Handle zero or negative gaps (already at maximum maturity)
  if (gapNeeded <= 0) {
    return {
      weeks: 0,
      months: 0,
      confidence: 'high',
      keyFactors: ['Already at maximum maturity level'],
      topRecommendations: []
    };
  }
  
  // BUG FIX: Handle empty or invalid roadmap items
  if (!items || items.length === 0) {
    // Return a fallback estimate based on gap size
    const fallbackMonths = Math.ceil(gapNeeded / 10); // ~1 month per 10% gap
    return {
      weeks: fallbackMonths * 4,
      months: Math.min(fallbackMonths, 12), // Cap at 12 months
      confidence: 'low',
      keyFactors: ['No specific roadmap items available', 'Estimate based on gap size only'],
      topRecommendations: []
    };
  }
  
  // Create a map of category scores for easy lookup
  const categoryScoreMap: Record<string, number> = {};
  categoryScores.forEach(cat => {
    categoryScoreMap[cat.categoryId] = cat.score >= 0 ? cat.score : 0; // Handle knowledge gaps
  });

  // 2. Calculate industry factor (some industries adopt faster than others)
  const industryFactors: Record<string, number> = {
    "finance": 1.1,     // Financial services have regulatory considerations
    "healthcare": 1.2,  // Healthcare typically has longer adoption cycles
    "technology": 0.85, // Technology companies often adopt faster
    "retail": 0.95,     // Retail can move quickly
    "manufacturing": 1.15,
    "government": 1.25,
    "education": 1.15,
    "telecom": 0.9,
    "media": 0.9,
    "professional_services": 0.9,
    "energy": 1.1,
    "transportation": 1.05,
    "hospitality": 1.0,
    "nonprofit": 1.1,
    // default
    "other": 1.0
  };
  
  const industryFactor = orgInfo.industry && industryFactors[orgInfo.industry] 
    ? industryFactors[orgInfo.industry] 
    : 1.0;
  
  // 3. Calculate company size factor
  const companySizeFactors: Record<string, string> = {
    "1-10": "xs",
    "11-50": "xs",
    "51-100": "sm",
    "101-250": "sm",
    "251-500": "md",
    "501-2000": "md",
    "2001-5000": "lg",
    "5001+": "lg"
  };
  
  const orgSize = orgInfo.companySize && companySizeFactors[orgInfo.companySize]
    ? companySizeFactors[orgInfo.companySize] as "xs" | "sm" | "md" | "lg"
    : "md" as const; // Default to medium if not specified
  
  // 4. Calculate user role factor - certain roles can drive adoption more effectively
  const userRoleFactors: Record<string, number> = {
    "executive": 0.9,    // Executive sponsorship speeds things up
    "manager": 0.95,     // Management support helps
    "architect": 0.95,   // Technical leadership
    "developer": 1.05,   // May need management buy-in
    "operations": 1.0,   // Mixed impact
    "security": 1.05,    // May need cross-team support
    "business": 1.1      // Might need technical support
  };
  
  const userRoleFactor = orgInfo.userRole && userRoleFactors[orgInfo.userRole]
    ? userRoleFactors[orgInfo.userRole]
    : 1.0;
  
  // 5. Get business objectives to help prioritize items
  const businessObjectives = orgInfo.businessObjectives || [];

  // 6. Process roadmap items with enhanced lift calculation
  let accumulatedLift = 0;
  let totalEffort = 0;
  let selectedItems: RoadmapItem[] = [];
  
  // Clone and sort items by priority
  const prioritizedItems = [...items]
    .filter(item => item.effort_points > 0) // Filter out invalid items
    .sort((a, b) => b.priority - a.priority);
  
  // Apply additional prioritization based on business objectives and org context
  const weightedItems = prioritizedItems.map(item => {
    // Get or calculate current score for this category
    const currentCategoryScore = item.currentCategoryScore !== undefined
      ? item.currentCategoryScore
      : categoryScoreMap[item.category] || 0;
    
    // Calculate gap - ensure it's not negative
    const catGap = Math.max(0, 100 - currentCategoryScore);
    
    // Calculate weighted priority based on various factors
    let priorityBoost = 1.0;
    
    // Boost items that align with business objectives
    if (businessObjectives.length > 0) {
      // Match categories to business objectives (simplified mapping)
      const categoryToObjectiveMap: Record<string, string[]> = {
        "cicd_practices": ["faster_time_to_market", "developer_productivity"],
        "security_compliance": ["security"],
        "finops_cost_management": ["cost_reduction"],
        "application_architecture": ["scalability", "reliability", "technical_debt"],
        "operations_resilience": ["reliability"],
        "observability": ["reliability"],
        "container_infrastructure": ["scalability"],
        "foundations_culture": ["innovation", "developer_productivity"],
        // Add other mappings as needed
      };
      
      // Check if this item's category relates to any business objectives
      const relatedObjectives = categoryToObjectiveMap[item.category] || [];
      const matchingObjectives = relatedObjectives.filter(obj => businessObjectives.includes(obj));
      
      if (matchingObjectives.length > 0) {
        priorityBoost += 0.1 * matchingObjectives.length; // Reduced from 0.2 to 0.1 for more realistic impact
      }
    }
    
    // Apply category-specific boosts from BASE_CATEGORY_BOOSTS
    const categoryBoost = BASE_CATEGORY_BOOSTS[item.category] || 0;
    priorityBoost += categoryBoost / 20; // Reduced impact: was /10, now /20 for more realistic calculations
    
    // Calculate final lift - ensure it's positive and finite
    // Reduced lift multiplier for more realistic time estimates that show organizational differences
    const lift = Math.max(0, (item.priority / 100) * catGap * priorityBoost * 0.15); // Added 0.15 multiplier for realistic scale
    
    return {
      ...item,
      weightedPriority: item.priority * priorityBoost,
      estimatedLift: isFinite(lift) ? lift : 0,
      currentCategoryScore
    };
  }).sort((a, b) => b.weightedPriority - a.weightedPriority);
  
  // Calculate accumulated lift to reach next threshold
  const topRecommendations: RoadmapItem[] = [];
  
  for (const item of weightedItems) {
    // Skip items if we have enough lift already
    if (accumulatedLift >= gapNeeded) break;
    
    accumulatedLift += item.estimatedLift;
    totalEffort += item.effort_points;
    selectedItems.push(item);
    
    // Add to top recommendations if this is one of the most impactful items
    if (topRecommendations.length < 3) {
      topRecommendations.push(item);
    }
  }
  
  // BUG FIX: Handle insufficient lift scenario
  if (accumulatedLift < gapNeeded && selectedItems.length > 0) {
    // Scale up effort proportionally to meet the gap
    const scaleFactor = gapNeeded / accumulatedLift;
    totalEffort = Math.ceil(totalEffort * scaleFactor);
  }
  
  // BUG FIX: Ensure minimum effort for very small gaps
  if (totalEffort < 1) {
    totalEffort = Math.max(1, Math.ceil(gapNeeded / 5)); // Minimum 1 point, or 1 point per 5% gap
  }
  
  // Execute the original time calculation logic
  const ptsPerDay = vel.pointsPerIdealDay;
  const rawDays = totalEffort / ptsPerDay;
  
  // Apply context factors
  const adjustedDays = rawDays * industryFactor * userRoleFactor;
  
  const sprints = Math.ceil(adjustedDays / vel.idealDaysPerSprint);
  const streams = vel.parallelStreams[orgSize] || 1; // Default to 1 stream if invalid
  const weeks = Math.ceil((sprints * 2) / streams); // 2-week sprints
  const months = Math.ceil(weeks / 4.33); // Convert weeks to months
  
  // BUG FIX: Cap unrealistic estimates
  const cappedMonths = Math.min(months, 24); // Cap at 24 months maximum
  const cappedWeeks = cappedMonths === 24 ? 24 * 4 : weeks;
  
  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  
  // Lower confidence if we're extrapolating far into the future
  if (cappedMonths > 12) {
    confidence = 'low';
  } else if (cappedMonths < 6 && selectedItems.length > 0) {
    confidence = 'high';
  }
  
  // Lower confidence if the gap is very large
  if (gapNeeded > 30) {
    confidence = confidence === 'low' ? 'low' : 'medium';
  }
  
  // Lower confidence if we had insufficient lift
  if (accumulatedLift < gapNeeded) {
    confidence = 'low';
  }
  
  // Prepare key factors that influenced the estimate
  const keyFactors: string[] = [];
  
  if (industryFactor > 1.05) {
    keyFactors.push(`Industry adoption patterns`);
  } else if (industryFactor < 0.95) {
    keyFactors.push(`Fast-moving industry`);
  }
  
  if (businessObjectives.length > 0) {
    keyFactors.push(`Business priorities alignment`);
  }
  
  if (streams < 2) {
    keyFactors.push(`Limited implementation capacity`);
  } else if (streams > 2) {
    keyFactors.push(`Multiple parallel workstreams`);
  }
  
  // If we have few recommendations but need significant improvement
  if (selectedItems.length < 3 && gapNeeded > 20) {
    keyFactors.push(`Limited high-impact recommendations`);
    confidence = 'low';
  }
  
  // If we had to scale up effort due to insufficient lift
  if (accumulatedLift < gapNeeded && selectedItems.length > 0) {
    keyFactors.push(`Estimate extrapolated from available recommendations`);
  }
  
  // If estimate was capped
  if (months > 24) {
    keyFactors.push(`Estimate capped at maximum timeframe`);
  }
  
  return {
    weeks: cappedWeeks,
    months: cappedMonths,
    confidence,
    keyFactors,
    topRecommendations
  };
}

/**
 * Helper function to convert enhanced estimate to a simple string
 * Compatible with existing UI expectations
 */

/**
 * Helper function to convert enhanced estimate to a localized string
 * @param estimate The time estimate object
 * @param language The language code ('en' or 'ja')
 * @param t Translation function (optional, for client-side use)
 * @returns Formatted time string with proper localization
 */
export function formatTimeEstimate(estimate: TimeEstimate, language: string = 'en', t?: (key: string, fallback?: string) => string): string {
  // Translation mappings
  const translations = {
    en: {
      lessThanMonth: "Less than a month",
      months: "months",
      monthsPlus: "months+"
    },
    ja: {
      lessThanMonth: "1ヶ月未満",
      months: "ヶ月",
      monthsPlus: "ヶ月以上"
    }
  };
  
  const locale = translations[language as keyof typeof translations] || translations.en;
  
  // Use translation function if provided (client-side), otherwise use direct translations
  const monthsUnit = t ? t('timeUnits.months', locale.months) : locale.months;
  const lessThanMonth = t ? t('timeUnits.lessThanMonth', locale.lessThanMonth) : locale.lessThanMonth;
  
  if (estimate.months === 0) {
    return lessThanMonth;
  } else if (estimate.months <= 3) {
    return `${estimate.months}-${estimate.months + 1} ${monthsUnit}`;
  } else if (estimate.months <= 6) {
    return `${estimate.months}-${estimate.months + 2} ${monthsUnit}`;
  } else if (estimate.months <= 12) {
    return `${estimate.months}-${estimate.months + 3} ${monthsUnit}`;
  } else {
    return language === 'ja' ? `12${locale.monthsPlus}` : `12+ ${locale.months}`;
  }
}

/**
 * Simple wrapper to make the enhanced function compatible with existing code
 * This allows us to maintain backward compatibility while adding new features
 */
export function timeToNextMaturity(
  currentPct: number,
  nextThreshold: number,
  items: RoadmapItem[],
  vel: VelocityTable,
  orgSize: "xs"|"sm"|"md"|"lg"
): number {
  const gapNeeded = nextThreshold - currentPct;
  let accumulatedLift = 0;
  let totalEffort = 0;

  // naive per-item "lift" = (category gapPct) × (item.priority / 100)
  for (const itm of items.sort((a,b)=>b.priority-a.priority)) {
    const catGap = 100 - (itm.currentCategoryScore || 0);  // e.g. 100−41=59
    const lift   = (itm.priority / 100) * catGap;          // scale by priority
    accumulatedLift += lift;
    totalEffort += itm.effort_points;
    if (accumulatedLift >= gapNeeded) break;
  }

  const ptsPerDay = vel.pointsPerIdealDay;
  const days      = totalEffort / ptsPerDay;
  const sprints   = Math.ceil(days / vel.idealDaysPerSprint);
  const weeks     = (sprints * 2) / vel.parallelStreams[orgSize];

  return weeks;
} 