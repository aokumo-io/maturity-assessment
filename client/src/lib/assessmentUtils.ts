/**
 * @file assessmentUtils.ts
 * @description アセスメントユーティリティライブラリー
 * スコア計算、データ永続化、リスク評価などのユーティリティ関数を提供します。
 */

import { MATURITY_LEVELS, RISK_RATINGS, ASSESSMENT_CATEGORIES } from './constants';
import { categoryBenchmarks } from './benchmarkData';
import type { Assessment, AssessmentResponse, CategoryScore, AssessmentQuestion } from '@shared/schema';
import { logger } from './logger';

/**
 * ローカルストレージのキー名定義
 */
export const STORAGE_KEYS = {
  ASSESSMENT_TYPE: "selectedAssessmentType",
  ASSESSMENT_FORM_DATA: "assessment_form_data",
  ASSESSMENT_RESPONSES: "assessment_responses",
  ASSESSMENT_RESULTS: "assessment_results", 
  ORGANIZATION_DATA: "organization_form_data_info",
  SIDEBAR_COLLAPSED: "sidebarCollapsed",
  EXECUTIVE_SUMMARY: "executive_summary_data",
  TRAIL_MAP_MILESTONES: "trail_map_milestones_data",
  TRAIL_MAP_PRIORITIES: "trail_map_priorities_data",
  ASSESSMENT_QUESTIONS_BY_CATEGORY: "assessment_questions_by_category",
  COST_ANALYSIS_DATA: "cost_analysis_data"
};

/**
 * @function persistenceManager
 * @description アセスメントデータの永続化と読み込みを一元管理する
 * ローカルストレージの操作を抽象化し、一貫したインターフェースを提供します。
 */
export const persistenceManager = {
  /**
   * @function clearAllAssessmentData
   * @description すべてのアセスメント関連データをクリアする
   */
  clearAllAssessmentData: () => {
    try {
      // 基本的なストレージキーをクリア
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // 動的に生成された可能性のあるキーを検索してクリア
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('assessment_') || key.includes('organization_') || key.includes('executive_'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      return true;
    } catch (error) {
      logger.debug("ローカルストレージのクリア中にエラーが発生しました:", error);
      return false;
    }
  },
  
  /**
   * @function saveAssessmentType
   * @description アセスメントタイプを保存する
   * @param {string} type - アセスメントタイプ
   */
  saveAssessmentType: (type: 'quick' | 'standard' | 'comprehensive') => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_TYPE, JSON.stringify(type));
      return true;
    } catch (error) {
      logger.debug("アセスメントタイプの保存中にエラーが発生しました:", error);
      return false;
    }
  },
  
  /**
   * @function saveFormData
   * @description フォームデータを保存する
   * @param {string} key - ストレージキー
   * @param {any} data - 保存するデータ
   */
  saveFormData: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      logger.debug(`データの保存中にエラーが発生しました (${key}):`, error);
      return false;
    }
  },
  
  /**
   * @function loadFormData
   * @description フォームデータを読み込む
   * @param {string} key - ストレージキー
   * @param {any} defaultValue - デフォルト値
   */
  loadFormData: <T>(key: string, defaultValue: T): T => {
    try {
      const savedData = localStorage.getItem(key);
      return savedData ? JSON.parse(savedData) : defaultValue;
    } catch (error) {
      logger.debug(`データの読み込み中にエラーが発生しました (${key}):`, error);
      return defaultValue;
    }
  },
  
  /**
   * @function saveExecutiveSummary
   * @description エグゼクティブサマリーを保存する
   * @param {string} summary - 保存するサマリーテキスト
   */
  saveExecutiveSummary: (summary: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXECUTIVE_SUMMARY, summary);
      logger.debug("エグゼクティブサマリーが保存されました");
      return true;
    } catch (error) {
      logger.debug("エグゼクティブサマリーの保存中にエラーが発生しました:", error);
      return false;
    }
  },
  
  /**
   * @function loadExecutiveSummary
   * @description 保存されたエグゼクティブサマリーを読み込む
   * @returns {string} 保存されたサマリーテキストまたは空文字列
   */
  loadExecutiveSummary: (): string => {
    try {
      const savedSummary = localStorage.getItem(STORAGE_KEYS.EXECUTIVE_SUMMARY);
      return savedSummary || '';
    } catch (error) {
      logger.debug("エグゼクティブサマリーの読み込み中にエラーが発生しました:", error);
      return '';
    }
  },
  
  /**
   * @function validateAssessmentState
   * @description アセスメントの状態を検証する
   * @returns {object} エラーステータスとメッセージ
   */
  validateAssessmentState: () => {
    try {
      // 1. アセスメントタイプの確認
      const assessmentType = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_TYPE);
      if (!assessmentType) {
        return { valid: false, message: "アセスメントタイプが選択されていません" };
      }
      
      // 2. 組織データの確認
      const organizationData = localStorage.getItem(STORAGE_KEYS.ORGANIZATION_DATA);
      if (!organizationData) {
        return { valid: false, message: "組織情報が入力されていません" };
      }
      
      // 3. 回答データの検証
      const formData = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_FORM_DATA);
      if (!formData) {
        return { valid: false, message: "アセスメント回答が見つかりません" };
      }
      
      return { valid: true, message: "アセスメントデータは有効です" };
    } catch (error) {
      logger.debug("アセスメント状態の検証中にエラーが発生しました:", error);
      return { valid: false, message: "アセスメントデータの検証中にエラーが発生しました" };
    }
  },
  
  /**
   * @function saveTrailMapMilestones
   * @description トレイルマップマイルストーンを保存する
   * @param {object} milestones - 保存するマイルストーン
   */
  saveTrailMapMilestones: (milestones: Record<string, any>) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRAIL_MAP_MILESTONES, JSON.stringify(milestones));
      logger.debug("トレイルマップマイルストーンが保存されました");
      return true;
    } catch (error) {
      logger.debug("トレイルマップマイルストーンの保存中にエラーが発生しました:", error);
      return false;
    }
  },
  
  /**
   * @function loadTrailMapMilestones
   * @description 保存されたトレイルマップマイルストーンを読み込む
   * @returns {object} 保存されたマイルストーンまたは空のオブジェクト
   */
  loadTrailMapMilestones: (): Record<string, any> => {
    try {
      const savedMilestones = localStorage.getItem(STORAGE_KEYS.TRAIL_MAP_MILESTONES);
      return savedMilestones ? JSON.parse(savedMilestones) : {};
    } catch (error) {
      logger.debug("トレイルマップマイルストーンの読み込み中にエラーが発生しました:", error);
      return {};
    }
  },
  
  /**
   * @function saveTrailMapPriorities
   * @description トレイルマップの優先事項を保存する
   * @param {array} priorities - 保存する優先事項の配列
   */
  saveTrailMapPriorities: (priorities: any[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRAIL_MAP_PRIORITIES, JSON.stringify(priorities));
      logger.debug("トレイルマップの優先事項が保存されました");
      return true;
    } catch (error) {
      logger.debug("トレイルマップの優先事項の保存中にエラーが発生しました:", error);
      return false;
    }
  },
  
  /**
   * @function loadTrailMapPriorities
   * @description 保存されたトレイルマップの優先事項を読み込む
   * @returns {array} 保存された優先事項の配列または空の配列
   */
  loadTrailMapPriorities: (): any[] => {
    try {
      const savedPriorities = localStorage.getItem(STORAGE_KEYS.TRAIL_MAP_PRIORITIES);
      return savedPriorities ? JSON.parse(savedPriorities) : [];
    } catch (error) {
      logger.debug("トレイルマップの優先事項の読み込み中にエラーが発生しました:", error);
      return [];
    }
  }
};

/**
 * Calculate overall score from category scores
 * @param scores Array of category scores
 * @returns Overall score as a number between 0-100
 */
export function calculateOverallScore(scores: CategoryScore[]): number {
  if (!scores || scores.length === 0) return 0;
  
  // Filter out knowledge gaps (score -1)
  const validScores = scores.filter(score => score.score >= 0);
  
  if (validScores.length === 0) return 0;
  
  // Calculate average of valid scores
  const total = validScores.reduce((sum, score) => sum + score.score, 0);
  return Math.round(total / validScores.length);
}

/**
 * Determine maturity level based on score
 * @param score Score value between 0-100
 * @returns Maturity level object with id and label
 */
export function getMaturityLevel(score: number) {
  if (score < 0) {
    return MATURITY_LEVELS.KNOWLEDGE_GAP;
  } else if (score <= MATURITY_LEVELS.BEGINNER.range[1]) {
    return MATURITY_LEVELS.BEGINNER;
  } else if (score <= MATURITY_LEVELS.INTERMEDIATE.range[1]) {
    return MATURITY_LEVELS.INTERMEDIATE;
  } else {
    return MATURITY_LEVELS.ADVANCED;
  }
}

/**
 * Calculate risk rating based on category scores and critical issues
 * @param scores Array of category scores
 * @returns Risk rating object with label, icon and color
 */
export function calculateRiskRating(scores: CategoryScore[]) {
  if (!scores.length) return RISK_RATINGS.MEDIUM;
  
  // Find the lowest scoring category
  const lowestScore = Math.min(...scores.filter(cat => cat.score >= 0).map(cat => cat.score));
  
  // Count critical issues (categories with very low scores)
  const criticalIssuesCount = scores.filter(score => score.score < 40).length;
  
  // Use the same logic as PDF generator for consistency
  if (criticalIssuesCount > 5 || lowestScore < 30) return RISK_RATINGS.HIGH;
  if (criticalIssuesCount > 2 || lowestScore < 50) return RISK_RATINGS.MEDIUM;
  return RISK_RATINGS.LOW;
}

/**
 * Sort categories by score (descending or ascending)
 */
export function sortCategoriesByScore(
  categoryScores: CategoryScore[], 
  direction: 'asc' | 'desc' = 'desc'
): CategoryScore[] {
  return [...categoryScores].sort((a, b) => {
    return direction === 'desc' ? b.score - a.score : a.score - b.score;
  });
}

/**
 * Get category information by ID
 */
export function getCategoryById(categoryId: string) {
  return ASSESSMENT_CATEGORIES.find(cat => cat.id === categoryId);
}

/**
 * Process assessment responses into category scores
 */

export function processAssessmentResponses(
  assessment: Assessment,
  responses: AssessmentResponse[]
): CategoryScore[] {
  const categoryScores: { [key: string]: number[] } = {};
  
  // Initialize categories
  ASSESSMENT_CATEGORIES.forEach(cat => {
    categoryScores[cat.id] = [];
  });
  
  // Group response scores by category
  responses.forEach(response => {
    const question = (assessment.questions as AssessmentQuestion[]).find((q: AssessmentQuestion) => q.id === response.questionId);
    if (question) {
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = [];
      }
      categoryScores[question.category].push(response.score);
    }
  });
  
  // Calculate average score for each category
  return Object.entries(categoryScores).map(([category, scores]) => {
    const avgScore = scores.length 
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) 
      : -1;
    
    return { 
      categoryId: category, 
      score: avgScore,
      maturityLevel: getMaturityLevel(avgScore).id
    };
  });
}

/**
 * Compare organization scores with industry benchmarks
 * @param {CategoryScore[]} categoryScores - Array of category scores
 * @returns {object} Comparison data for overall and each category
 */
export function compareWithIndustry(
  categoryScores: CategoryScore[]
): { 
  overallComparison: { org: number, avg: number, leaders: number },
  categoryComparisons: { [key: string]: { org: number, avg: number, leaders: number } }
} {
  const overallScore = calculateOverallScore(categoryScores);
  const categoryComparisons: { [key: string]: { org: number, avg: number, leaders: number } } = {};
  
  // Create a mapping from category IDs to names
  const categoryIdToNameMap: Record<string, string> = {};
  ASSESSMENT_CATEGORIES.forEach(cat => {
    categoryIdToNameMap[cat.id] = cat.title;
  });
  
  // Process each category score
  categoryScores.forEach(cat => {
    // Convert -1 scores (not assessed) to 0
    const score = cat.score === -1 ? 0 : cat.score;
    
    // Get the corresponding benchmark data
    const benchmarkData = categoryBenchmarks.find(benchmark => 
      benchmark.categoryId === cat.categoryId
    );
    
    if (benchmarkData) {
      categoryComparisons[cat.categoryId] = {
        org: score,
        avg: benchmarkData.median,
        leaders: benchmarkData.leader
      };
    } else {
      // Default values if no benchmark data exists
      categoryComparisons[cat.categoryId] = {
        org: score,
        avg: 50, // Default industry average
        leaders: 75 // Default industry leaders score
      };
    }
  });
  
  // Calculate overall benchmark data by averaging all benchmark data
  let avgSum = 0;
  let leaderSum = 0;
  let count = 0;
  
  Object.values(categoryComparisons).forEach(comp => {
    avgSum += comp.avg;
    leaderSum += comp.leaders;
    count++;
  });
  
  return {
    overallComparison: {
      org: overallScore,
      avg: count > 0 ? Math.round(avgSum / count) : 50,
      leaders: count > 0 ? Math.round(leaderSum / count) : 75
    },
    categoryComparisons
  };
}
