import { useState, useEffect } from 'react';

/**
 * @enum KnowledgeGapSeverity
 * @description 知識ギャップの重要度レベル
 */
enum KnowledgeGapSeverity {
  NONE = 'none',           // 0-2 don't know
  MODERATE = 'moderate',   // 3-5 don't know  
  SEVERE = 'severe'        // 6+ don't know
}

/**
 * @enum DismissalLevel
 * @description 解除レベル
 */
enum DismissalLevel {
  NONE = 'none',
  MODERATE = 'moderate',
  SEVERE = 'severe'
}

/**
 * @interface KnowledgeGapGuidanceConfig
 * @description 知識ギャップガイダンスの設定
 */
interface KnowledgeGapGuidanceConfig {
  moderateThreshold: number;  // 通常のガイダンス表示閾値
  severeThreshold: number;    // 重要ガイダンス表示閾値
  percentageThreshold: number; // パーセンテージ閾値
}

/**
 * @interface UseKnowledgeGapGuidanceResult
 * @description フックの戻り値の型定義
 */
interface UseKnowledgeGapGuidanceResult {
  shouldShowGuidance: boolean;
  severity: KnowledgeGapSeverity;
  dismissGuidance: () => void;
  resetDismissal: () => void;
}

/**
 * @constant DEFAULT_CONFIG
 * @description デフォルト設定
 */
const DEFAULT_CONFIG: KnowledgeGapGuidanceConfig = {
  moderateThreshold: 3,
  severeThreshold: 6,
  percentageThreshold: 30
};

/**
 * @function useKnowledgeGapGuidance
 * @description 知識ギャップガイダンスの表示ロジックを管理するカスタムフック
 * クリーンアーキテクチャに基づいて、ビジネスロジックをUIから分離します。
 * 
 * @param {number} dontKnowCount - "わからない"回答の数
 * @param {number} totalQuestions - 総質問数
 * @param {string} categoryId - カテゴリID（リセット用）
 * @param {KnowledgeGapGuidanceConfig} config - 設定オプション
 * @returns {UseKnowledgeGapGuidanceResult} ガイダンス状態と制御関数
 */
export function useKnowledgeGapGuidance(
  dontKnowCount: number,
  totalQuestions: number,
  categoryId: string,
  config: KnowledgeGapGuidanceConfig = DEFAULT_CONFIG
): UseKnowledgeGapGuidanceResult {
  
  const [dismissalLevel, setDismissalLevel] = useState<DismissalLevel>(DismissalLevel.NONE);

  /**
   * @function getSeverity
   * @description 現在の重要度レベルを計算します
   * @returns {KnowledgeGapSeverity} 重要度レベル
   */
  const getSeverity = (): KnowledgeGapSeverity => {
    if (dontKnowCount >= config.severeThreshold) {
      return KnowledgeGapSeverity.SEVERE;
    } else if (dontKnowCount >= config.moderateThreshold) {
      return KnowledgeGapSeverity.MODERATE;
    }
    return KnowledgeGapSeverity.NONE;
  };

  /**
   * @function shouldShow
   * @description ガイダンスを表示すべきかどうかを判定します
   * @returns {boolean} 表示すべきかどうか
   */
  const shouldShow = (): boolean => {
    const severity = getSeverity();
    const percentage = Math.round((dontKnowCount / totalQuestions) * 100);
    
    // 基本条件: 閾値を超えている
    if (severity === KnowledgeGapSeverity.NONE || percentage < config.percentageThreshold) {
      return false;
    }

    // 解除レベルに基づく表示判定
    switch (severity) {
      case KnowledgeGapSeverity.MODERATE:
        return dismissalLevel !== DismissalLevel.MODERATE && dismissalLevel !== DismissalLevel.SEVERE;
      
      case KnowledgeGapSeverity.SEVERE:
        return dismissalLevel !== DismissalLevel.SEVERE;
      
      default:
        return false;
    }
  };

  /**
   * @function dismissGuidance
   * @description 現在の重要度レベルに応じてガイダンスを解除します
   */
  const dismissGuidance = (): void => {
    const severity = getSeverity();
    
    switch (severity) {
      case KnowledgeGapSeverity.MODERATE:
        setDismissalLevel(DismissalLevel.MODERATE);
        break;
      
      case KnowledgeGapSeverity.SEVERE:
        setDismissalLevel(DismissalLevel.SEVERE);
        break;
    }
  };

  /**
   * @function resetDismissal
   * @description 解除状態をリセットします
   */
  const resetDismissal = (): void => {
    setDismissalLevel(DismissalLevel.NONE);
  };

  // カテゴリ変更時に解除状態をリセット
  useEffect(() => {
    resetDismissal();
  }, [categoryId]);

  return {
    shouldShowGuidance: shouldShow(),
    severity: getSeverity(),
    dismissGuidance,
    resetDismissal
  };
} 