import { capabilityService }   from "./capability-service";
import { logger } from '../utils/logger';
import { priorityScore }       from "./scoring-engine";
import { RoadmapItem }         from "../models/roadmap-types";
import { considerationMap }    from "../data/stretch-goals";
import { ASSESSMENT_MODULES }  from "../../client/src/lib/constants";
import type { QuestionDependency } from "../models/capability-step";

type ScoreMap = Record<string, number>; // categoryId -> 0-100

// Type for individual question responses
interface QuestionResponse {
  questionId: string;
  score: number;
}

// Helper function to get categories for a specific assessment type (copied from storage.ts)
function getCategoriesForAssessmentType(assessmentType: string): string[] {
  switch (assessmentType) {
    case "quick":
      return ASSESSMENT_MODULES.CORE;
    case "standard":
      return ASSESSMENT_MODULES.STANDARD;
    case "comprehensive":
    default:
      return ASSESSMENT_MODULES.COMPREHENSIVE;
  }
}

export function buildRoadmap(
  categoryScores: ScoreMap,
  orgSize: "xs" | "sm" | "md" | "lg",
  assessmentType: string = "comprehensive",
  questionResponses: QuestionResponse[] = [] // NEW: Individual question responses for smart filtering
): RoadmapItem[] {
  const items: RoadmapItem[] = [];
  // Track high-performing categories (85%+) for special handling
  const highPerformingCategories = new Set<string>();
  
  // Get the categories for the current assessment type
  const assessedCategories = getCategoriesForAssessmentType(assessmentType);

  // NEW: Build question score map for smart dependency checking
  const questionScoreMap: Record<string, number> = {};
  questionResponses.forEach(response => {
    questionScoreMap[response.questionId] = response.score;
  });
  
  logger.debug(`Smart roadmap: Processing ${questionResponses.length} question responses`);

  // Identify high-performing categories
  Object.entries(categoryScores).forEach(([category, score]) => {
    // Only process categories that are part of the current assessment type
    if (assessedCategories.includes(category) && score >= 85) {
      highPerformingCategories.add(category);
    }
  });

  const vel = capabilityService.velocityTable();
  const streamCount = vel.parallelStreams[orgSize];
  
  logger.debug(`Building roadmap with org size: ${orgSize}, stream count: ${streamCount}`);
  logger.debug(`Total capability steps: ${capabilityService.listAll().length}`);

  capabilityService.listAll().forEach(step => {
    // Only process steps for categories in the current assessment type
    if (!assessedCategories.includes(step.category)) return;
    
    // CRITICAL: Only process categories that are actually in the scoreMap
    // This means they have been assessed AND have answered questions (not just theoretical)
    if (!(step.category in categoryScores)) {
      logger.debug(`Skipping capability ${step.id}: category ${step.category} not in scoreMap (not assessed or no answered questions)`);
      return;
    }
    
    // NEW: Smart dependency checking based on question scores
    if (step.questionDependencies && step.questionDependencies.length > 0) {
      const depsSatisfied = step.questionDependencies.every(dep => {
        const qScore = questionScoreMap[dep.questionId] ?? 0;
        const satisfied = qScore >= dep.minValue;
        
        if (satisfied) {
          logger.debug(`Smart skip: ${step.id} dependency satisfied - question ${dep.questionId} scored ${qScore} >= ${dep.minValue}`);
        }
        
        return satisfied;
      });
      
      if (depsSatisfied) {
        logger.debug(`Skipping capability ${step.id}: all question dependencies satisfied`);
        return; // Skip this step entirely - it's already implemented
      }
    }
    
    const categoryScore = categoryScores[step.category]; // Now guaranteed to exist
    const gap = 100 - categoryScore;
    
    // Skip if already performing well OR if it's a high-performing category
    if (gap < 10 || highPerformingCategories.has(step.category)) {
      logger.debug(`Skipping capability ${step.id}: category ${step.category} performing well (score=${categoryScore}%, gap=${gap}%, isHighPerforming=${highPerformingCategories.has(step.category)})`);
      return;
    }

    const costImpact = Math.min(2_000_000, 1_000_000 * capabilityService.impactWeight(step));

    const prio = priorityScore({
      gapPct: gap,
      costImpactY: costImpact,
      complexity: step.effort_points
    }, step.category);

    // naive scheduling: effort_points / pointsPerIdealDay
    const idealDays = step.effort_points / vel.pointsPerIdealDay;
    const sprints   = Math.ceil(idealDays / vel.idealDaysPerSprint);
    const calendarW = Math.ceil(sprints / streamCount) * 2;

    items.push({
      ...step,
      priority: prio,
      duration_weeks: calendarW
    });
    
    // Log every 10th item to avoid excessive output
    if (items.length % 10 === 0) {
      logger.debug(`Roadmap item sample: id=${step.id}, category=${step.category}, score=${categoryScore}, gap=${gap}%, duration_weeks=${calendarW}`);
    }
  });
  
  // Add considerations-only items for high-performing categories that don't have regular recommendations
  for (const category of Array.from(highPerformingCategories)) {
    // Check if this high-performing category already has any recommendations
    const hasRecommendations = items.some(item => item.category === category);
    
    // If the category has no recommendations but we have considerations for it, add a special item
    if (!hasRecommendations && considerationMap[category]) {
      logger.debug(`Adding considerations-only item for high-performing category: ${category}`);
      
      items.push({
        id: `consideration-${category}`,
        category: category,
        phase: 'advanced' as const,
        order: 1,
        label: { 
          en: 'You\'re at the top of the trail!', 
          ja: 'トレイルの頂点に到達しました！' 
        },
        description: { 
          en: 'No more core milestones—consider new horizons.', 
          ja: 'これ以上のコアマイルストーンはありません - 新たな地平線を検討してください。' 
        },
        effort_points: 1,
        impact_area: 'TM',
        priority: 0,  // Low priority since it's just informational
        duration_weeks: 0,
        quick_win: false,
        dependencies: [],
        considerations_only: true // Flag this as a considerations-only item
      });
    }
  }

  logger.info(`Total roadmap items generated: ${items.length}`);
  
  // Log histogram of duration_weeks to see distribution
  const durationCounts = items.reduce((acc, item) => {
    const key = item.duration_weeks <= 12 ? 'short' : 
                item.duration_weeks <= 24 ? 'medium' : 'long';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  logger.debug('Duration weeks distribution:', durationCounts);
  
  // Count quick wins
  const quickWinCount = items.filter(item => item.quick_win).length;
  logger.debug(`Items marked as quick wins: ${quickWinCount}`);
  
  // Count considerations-only items
  const considerationsOnlyCount = items.filter(item => item.considerations_only).length;
  logger.debug(`Items marked as considerations-only: ${considerationsOnlyCount}`);

  // sort: high prio first, break ties by impact_area weighting
  return items.sort((a, b) => {
    if (b.priority === a.priority) {
      // Tie-break by impact weight (higher impact weight wins)
      return capabilityService.impactWeight(b) - capabilityService.impactWeight(a);
    }
    return b.priority - a.priority;
  });
}
