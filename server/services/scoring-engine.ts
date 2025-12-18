export interface GapInfo {
    gapPct: number;            // 0-100
    costImpactY: number;       // ¥/$
    complexity: number;        // 1-10
  }
  
  // Import the category boost constants
  import { BASE_CATEGORY_BOOSTS } from "../../client/src/lib/constants";
  
  export function priorityScore(
    { gapPct, costImpactY, complexity }: GapInfo,
    categoryId?: string
  ) {
    const gapWeight   = 0.45;
    const costWeight  = 0.35;
    const complWeight = 0.20;
  
    // normalise costImpactY to 0-100 (log-scale helps)
    const normalisedCost = Math.min(100, Math.log10(costImpactY + 1) * 20);
  
    let score =
      gapWeight   * gapPct +
      costWeight  * normalisedCost +
      complWeight * (10 - complexity) * 10;   // low complexity = higher priority
  
    // Apply category boost if provided
    if (categoryId && BASE_CATEGORY_BOOSTS[categoryId]) {
      score += BASE_CATEGORY_BOOSTS[categoryId];
    }
  
    return Math.round(score);                 // 0-100
  }
  