/**
 * @file maturityPercentile.ts
 * @description インダストリー比較ランキングの計算ユーティリティ
 * 組織のスコアをパーセンタイルに変換するロジックを提供します。
 */

import type { CategoryScore } from '@shared/schema';
import { categoryBenchmarks } from './benchmarkData';

/**
 * @function calculateCategoryPercentile
 * @description カテゴリーごとのパーセンタイルを計算する
 * @param {number} score - 組織のスコア
 * @param {number} median - 業界の中央値
 * @param {number} leader - 業界のリーダースコア
 * @param {number} pLeader - リーダーのパーセンタイル (デフォルト: 0.80)
 * @returns {number} 計算されたパーセンタイル (1-99)
 */
export function calculateCategoryPercentile(
  score: number, 
  median: number, 
  leader: number, 
  pLeader = 0.80
): number {
  if (score <= median) {
    return Math.max(1, (score / median) * 50);  // below median
  }
  const above = (score - median) / (leader - median);
  const p = 50 + (pLeader * 100 - 50) * above;  // 50 → 80
  return Math.min(99, Math.round(p));
}

/**
 * @function calculateOverallPercentile
 * @description 全体のパーセンタイルを計算する
 * @param {CategoryScore[]} categoryScores - カテゴリースコアの配列
 * @returns {number} 全体のパーセンタイル
 */
export function calculateOverallPercentile(categoryScores: CategoryScore[]): number {
  if (!categoryScores || categoryScores.length === 0) return 0;
  
  const scoreMap: Record<string, number> = {};
  const medianMap: Record<string, number> = {};
  const leaderMap: Record<string, number> = {};
  
  // Valid scores only
  const validScores = categoryScores.filter(cat => cat.score >= 0);
  if (validScores.length === 0) return 0;
  
  // Create mapping for calculation
  validScores.forEach(cat => {
    const categoryId = cat.categoryId;
    const benchmarkInfo = categoryBenchmarks.find(benchmark => benchmark.categoryId === categoryId);
    
    if (benchmarkInfo) {
      scoreMap[categoryId] = cat.score;
      medianMap[categoryId] = benchmarkInfo.median;
      leaderMap[categoryId] = benchmarkInfo.leader;
    } else {
      // Default values if no matching benchmark found
      scoreMap[categoryId] = cat.score;
      medianMap[categoryId] = 50; // Default industry median
      leaderMap[categoryId] = 75; // Default leader score
    }
  });
  
  // Calculate percentiles for each category
  const percentiles = Object.keys(scoreMap).map(categoryId => 
    calculateCategoryPercentile(
      scoreMap[categoryId], 
      medianMap[categoryId], 
      leaderMap[categoryId]
    )
  );
  
  // Return average percentile
  return Math.round(percentiles.reduce((sum, p) => sum + p, 0) / percentiles.length);
}

/**
 * @function generatePositionText
 * @description パーセンタイルに基づいたポジションテキストを生成する
 * @param {number} percentile - パーセンタイル値
 * @param {string} language - 言語コード (デフォルト: 'en')
 * @returns {object} ポジションテキストを含むオブジェクト
 */
export function generatePositionText(percentile: number, language: string = 'en'): {
  percentile: number;
  ahead: string;
  top: string;
  isAboveMedian: boolean;
} {
  const top = 100 - percentile;
  const isAboveMedian = percentile >= 50;
  
  // Define translations for both languages
  const translations = {
    en: {
      ahead: `You're ahead of ${percentile}% of organisations in your industry`,
      topPerformer: `(top ${top}% performer)`,
      belowMedian: `(below industry median)`
    },
    ja: {
      ahead: `あなたは業界内の${percentile}%の組織より進んでいます`,
      topPerformer: `(上位${top}%のパフォーマー)`,
      belowMedian: `(業界中央値以下)`
    }
  };
  
  // Use the requested language or fall back to English
  const lang = language === 'ja' ? 'ja' : 'en';
  
  return {
    percentile,
    ahead: translations[lang].ahead,
    top: isAboveMedian ? translations[lang].topPerformer : translations[lang].belowMedian,
    isAboveMedian
  };
} 