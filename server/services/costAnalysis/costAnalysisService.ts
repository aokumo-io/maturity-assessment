/**
 * @file costAnalysisService.ts
 * @description コスト分析サービス
 * 組織データを変換し、コスト削減の計算を行うアダプターサービスを提供します。
 */

import { 
  OrgProfile,
  calcSavings,
  calcQuickWins,
  CostSavings,
  QuickWin,
  formatCurrency,
  convertCurrency,
  calcBaselines
} from './costUtils';
import type { CategoryScore } from '../../../shared/schema';
import { logger } from '../../utils/logger';
import { categoryImpact, CostImpactAreas } from './costImpactData';

/**
 * 組織データをOrgProfileに変換する
 * @param orgData 保存された組織データ
 * @param language 使用言語
 * @returns 変換されたOrgProfile
 */
export function mapToOrgProfile(orgData: any = {}, language: string = 'en'): OrgProfile {
  // 従業員数のマッピング（会社規模の範囲から中間値を使用）
  let employees = 100; // デフォルト値
  if (orgData.companySize) {
    switch (orgData.companySize) {
      case '1-10': employees = 5; break;
      case '11-50': employees = 30; break;
      case '51-100': employees = 75; break;
      case '101-250': employees = 175; break;
      case '251-500': employees = 375; break;
      case '501-2000': employees = 1250; break;
      case '2001-5000': employees = 3500; break;
      case '5001+': employees = 7500; break;
    }
  }
  
  // クラウド展開状況のマッピング
  let cloudFootprint = 'hybrid'; // デフォルト値
  if (orgData.deploymentModel) {
    switch (orgData.deploymentModel) {
      case 'public_cloud': cloudFootprint = 'cloud-native'; break;
      case 'hybrid_cloud': cloudFootprint = 'hybrid'; break;
      case 'traditional_on_premise': cloudFootprint = 'on-prem'; break;
      case 'multi_cloud': cloudFootprint = 'cloud-native'; break;
    }
  }
  
  // クラウド戦略シグナルの検出
  // マルチクラウド複雑性: 2つ以上のクラウドプロバイダーを使用
  const cloudProviders = orgData.cloudProviders || [];
  const isMultiCloud = Array.isArray(cloudProviders) && cloudProviders.length >= 2;
  
  // ハイブリッド/オンプレミス重視: オンプレミスの選択あり、またはデプロイメントモデルがハイブリッド/プライベート
  const hasOnPrem = Array.isArray(cloudProviders) && 
    cloudProviders.some(cp => typeof cp === 'string' && cp.toLowerCase().includes('on-prem'));
  const isHybridDeploy = orgData.deploymentModel === 'hybrid_cloud' || 
    orgData.deploymentModel === 'traditional_on_premise';
  const isHybridOnPrem = hasOnPrem || isHybridDeploy;
  
  // モダンクラウド: ハイパースケーラー(AWS/Azure/GCP)のみを使用し、デプロイメントモデルがクラウドネイティブ
  const isHyperscalerOnly = Array.isArray(cloudProviders) && 
    cloudProviders.length > 0 &&
    cloudProviders.every(cp => 
      typeof cp === 'string' && 
      (cp.toLowerCase().includes('aws') || 
       cp.toLowerCase().includes('azure') || 
       cp.toLowerCase().includes('gcp'))
    );
  const isCloudNative = orgData.deploymentModel === 'public_cloud' || 
    orgData.deploymentModel === 'multi_cloud';
  const isModernCloud = isHyperscalerOnly && isCloudNative;
  
  // 目標の抽出 - 拡張版
  const objectives: string[] = [];
  if (orgData.businessObjectives) {
    try {
      // まずbusinessObjectivesが配列であることを確認
      const businessObjArray = Array.isArray(orgData.businessObjectives) 
        ? orgData.businessObjectives 
        : [String(orgData.businessObjectives)];
      
      // 配列の各要素を処理
      for (const objective of businessObjArray) {
        // 各要素を文字列に変換してから処理
        let objString = '';
        try {
          objString = String(objective).toLowerCase();
        } catch (e) {
          logger.error('目標の文字列変換中にエラーが発生しました', e);
          continue; // この目標はスキップしてループを続行
        }
        
        // コスト削減関連
        if (objString.includes('cost') || objString.includes('expense') || 
            objString.includes('saving') || objString.includes('コスト') || 
            objString.includes('費用') || objString.includes('削減')) {
          if (!objectives.includes('cost_reduction')) {
            objectives.push('cost_reduction');
          }
        }
        
        // 開発者生産性関連
        if (objString.includes('developer') || objString.includes('productivity') || 
            objString.includes('efficiency') || objString.includes('開発者') || 
            objString.includes('生産性') || objString.includes('効率')) {
          if (!objectives.includes('dev_productivity')) {
            objectives.push('dev_productivity');
          }
        }
        
        // セキュリティ関連
        if (objString.includes('security') || objString.includes('compliance') || 
            objString.includes('セキュリティ') || objString.includes('コンプライアンス')) {
          if (!objectives.includes('security_improvements')) {
            objectives.push('security_improvements');
          }
        }
        
        // 信頼性関連
        if (objString.includes('reliability') || objString.includes('stable') || 
            objString.includes('resilience') || objString.includes('信頼性') || 
            objString.includes('安定性') || objString.includes('レジリエンス')) {
          if (!objectives.includes('reliability')) {
            objectives.push('reliability');
          }
        }
        
        // イノベーション関連
        if (objString.includes('innovation') || objString.includes('transform') || 
            objString.includes('disrupt') || objString.includes('イノベーション') || 
            objString.includes('革新') || objString.includes('変革')) {
          if (!objectives.includes('innovation')) {
            objectives.push('innovation');
          }
        }
        
        // スピード・市場投入時間関連
        if (objString.includes('speed') || objString.includes('faster') || 
            objString.includes('time') || objString.includes('market') || 
            objString.includes('スピード') || objString.includes('時間')) {
          if (!objectives.includes('speed_to_market')) {
            objectives.push('speed_to_market');
          }
        }
      }
    } catch (error) {
      logger.error('目標の抽出中にエラーが発生しました', { error });
      // エラーが発生しても処理を継続する
    }
  }
  
  // 業界はそのまま使用
  const industry = orgData.industry || 'technology';
  
  // 基本のプロファイル
  const profile: OrgProfile = {
    employees,
    industry,
    cloudFootprint,
    objectives,
    isMultiCloud,
    isHybridOnPrem,
    isModernCloud
  };
  
  // 言語/地域に応じた通貨の設定
  profile.currency = language === 'ja' ? 'JPY' : 'USD';
  
  // オンプレミスとマルチクラウドの両方がある場合は強制的にhybridとする
  if (isMultiCloud && isHybridOnPrem) {
    profile.cloudFootprint = 'hybrid';
    logger.debug('Both multi-cloud and on-prem detected, forcing hybrid footprint', { 
      orgData, 
      profile 
    });
  }
  
  logger.debug('Mapped organization profile', { profile, orgData });
  
  return profile;
}

/**
 * カテゴリースコアからインパクト領域ごとの平均スコアを計算
 * @param categoryScores カテゴリースコアレコード
 * @returns 領域ごとの平均スコア
 */
export function calculateAreaAverages(categoryScores: Record<string, number>): Record<string, number> {
  // 各インパクト領域のスコア合計と数を追跡
  const areaTotals: Record<string, { sum: number; count: number }> = {
    IC: { sum: 0, count: 0 },
    OE: { sum: 0, count: 0 },
    DP: { sum: 0, count: 0 },
    IM: { sum: 0, count: 0 },
    TM: { sum: 0, count: 0 }
  };
  
  // 各カテゴリーのスコアを対応するインパクト領域に加算
  for (const [categoryId, score] of Object.entries(categoryScores)) {
    const impact = categoryImpact[categoryId];
    if (!impact) continue;
    
    // スコアが-1（未評価）の場合は除外
    if (score === -1) continue;
    
    // 各領域に影響度を加味してスコアを分配
    for (const area of Object.keys(impact) as Array<keyof CostImpactAreas>) {
      const percentage = impact[area];
      if (percentage > 0) {
        areaTotals[area].sum += score * (percentage / 100);
        areaTotals[area].count += percentage / 100;
      }
    }
  }
  
  // 平均値を計算
  const areaAverages: Record<string, number> = {};
  for (const [area, data] of Object.entries(areaTotals)) {
    areaAverages[area] = data.count > 0 ? Math.round(data.sum / data.count) : 0;
  }
  
  return areaAverages;
}

/**
 * クラウドコスト最適化の潜在的削減率を計算
 * @param orgProfile 組織プロファイル
 * @param categoryScores カテゴリースコア
 * @returns 削減率の推定値 (0-1の範囲)
 */
export function estimateCloudCostReduction(
  orgProfile: OrgProfile,
  categoryScores: Record<string, number>
): number {
  // カテゴリースコアから平均値を計算
  const areaAverages = calculateAreaAverages(categoryScores);
  
  // FinOpsスコアが60未満の場合は、大きな削減可能性がある
  const finopsScore = categoryScores['finops_cost_management'] || 0;
  
  // 基本削減率 = (100 - finopsScore) / 100 * 0.3
  let baseReduction = (100 - finopsScore) / 100 * 0.3;
  
  // インフラスコアが低い場合も削減余地が大きい
  const infraScore = areaAverages['IC'] || 0;
  let infraFactor = (100 - infraScore) / 100 * 0.2;
  
  // 最終削減率 = 基本削減率 + インフラ削減率 (最大50%)
  let estimatedReduction = Math.min(0.5, baseReduction + infraFactor);
  
  // 業界特性による調整
  const industry = orgProfile.industry || 'technology';
  const isHighTech = ['technology', 'media', 'retail'].includes(industry);
  
  if (isHighTech) {
    // ハイテク業界は最適化余地が大きい
    estimatedReduction *= 1.2;
  } else if (['finance', 'healthcare', 'government'].includes(industry)) {
    // 規制産業は削減が難しい場合がある
    estimatedReduction *= 0.9;
  }
  
  // 範囲内に収める
  return Math.max(0, Math.min(0.5, estimatedReduction));
}

/**
 * コスト分析データを計算する
 * @param orgData 組織データ
 * @param categoryScores カテゴリースコアの配列
 * @param language 言語コード
 * @returns コスト分析結果
 */
export function calculateCostAnalysis(
  orgData: any = {},
  categoryScores: CategoryScore[] = [],
  language: string = 'en'
): {
  costSavings: CostSavings;
  quickWins: QuickWin[];
  formattedTotal: string;
  currency: string;
  savingsPercentage: string;
} {
  logger.debug('Calculating cost analysis', { 
    orgDataKeys: Object.keys(orgData), 
    categoryScoresCount: categoryScores.length,
    language
  });
  
  // カテゴリースコアをRecord<string, number>形式に変換
  const scores: Record<string, number> = {};
  categoryScores.forEach(cat => {
    // スコアが-1（未評価）の場合は除外
    if (cat.score !== -1) {
      scores[cat.categoryId] = cat.score;
    }
  });
  
  // 組織プロファイルを取得
  const profile = mapToOrgProfile(orgData, language);
  
  // コスト削減を計算 (すべて円(JPY)ベース)
  const costSavings = calcSavings(profile, scores);
  
  // 基準額の合計を計算
  const baselines = calcBaselines(profile);
  const totalBaseline = Object.values(baselines).reduce((sum, value) => sum + value, 0);
  
  // 削減額の割合を計算（パーセンテージ）
  const savingsPercentage = totalBaseline > 0 
    ? Math.round((costSavings.total / totalBaseline) * 1000) / 10 
    : 0;
  
  // クイックウィンを計算
  const quickWins = calcQuickWins(profile, scores, 5);
  
  // 通貨に応じて金額をフォーマット
  const currency = profile.currency || 'JPY';
  const formattedTotal = formatCurrency(costSavings.total, currency);
  
  logger.debug('Cost analysis results', { 
    profile,
    totalSavings: costSavings.total, 
    savingsPercentage,
    currency,
    quickWinsCount: quickWins.length
  });
  
  return {
    costSavings,
    quickWins,
    formattedTotal,
    currency,
    savingsPercentage: `${savingsPercentage}%`
  };
}

/**
 * コスト削減額をフォーマットする
 * @param amount 金額
 * @param currency 通貨コード
 * @param language 言語コード
 * @returns フォーマットされた金額
 */
export function formatCostSaving(amount: number, currency: string = 'JPY', language: string = 'en'): string {
  // 大きな金額の場合は、適切な単位に変換してフォーマット
  if (Math.abs(amount) >= 1_000_000_000) {
    // 10億以上の場合
    const billions = Math.round(amount / 10_000_000) / 100;
    return currency === 'JPY' 
      ? `${billions}${language === 'ja' ? '十億円' : ' B¥'}`
      : `${currency === 'USD' ? '$' : '€'}${billions}B`;
  } else if (Math.abs(amount) >= 1_000_000) {
    // 100万以上の場合
    const millions = Math.round(amount / 10_000) / 100;
    return currency === 'JPY'
      ? `${millions}${language === 'ja' ? '百万円' : ' M¥'}`
      : `${currency === 'USD' ? '$' : '€'}${millions}M`;
  } else {
    // それ以外は標準フォーマット
    return formatCurrency(amount, currency);
  }
} 