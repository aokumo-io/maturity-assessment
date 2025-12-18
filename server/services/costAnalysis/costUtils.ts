/**
 * @file costUtils.ts
 * @description コスト影響の計算ユーティリティ
 * 組織プロファイルと成熟度評価スコアに基づいてコスト削減の可能性を計算します。
 */

import type { CostImpactAreas } from './costImpactData';
import { 
  categoryImpact, 
  costAreaEfficiencyRanges,
  industryDevRatio,
  infraPerEmployeeJPY,
  industryDelayPenalty,
  industryAdjustment,
  sizeBaselineEfficiency,
  cloudStrategyAdjustment,
  objectiveEfficiencyAdjustment,
  regionSpecificCosts
} from './costImpactData';
import { categoryBenchmarks, CategoryBenchmarkData, getCategoryBenchmarkById } from './benchmarkData';
import { logger } from '../../../server/utils/logger';

/**
 * 組織プロファイルの型定義
 */
export interface OrgProfile {
  employees: number;           // 従業員数
  industry: string;            // 業界
  cloudFootprint?: string;     // クラウド展開状況
  revenue?: number;            // 年間売上（円）
  objectives?: string[];       // 組織の目標
  currency?: string;           // 通貨
  isMultiCloud?: boolean;      // 複数クラウドプロバイダーの利用
  isHybridOnPrem?: boolean;    // ハイブリッド/オンプレミス重視
  isModernCloud?: boolean;     // モダンクラウド環境
  companySize?: string;         // 会社規模
}

/**
 * コスト領域ごとの削減額
 */
export interface CostSavings extends CostImpactAreas {
  total: number;               // 総削減額
  confidence: number;          // 信頼度スコア（0-100）
  confidenceFactors: {         // 信頼度に影響する要因
    dataCompleteness: number;  // データの完全性
    industryMatch: number;     // 業界マッチング精度
    organizationSize: number;  // 組織規模の適合性
    scoreReliability: number;  // スコアの信頼性
  };
}

/**
 * クイックウィン（すぐに効果が出る施策）の情報
 */
export interface QuickWin {
  category: string;            // カテゴリーID (Category ID for translation)
  score: number;               // 現在のスコア
  targetScore: number;         // ターゲットスコア
  impact: number;              // インパクト（削減額）
  complexity: number;          // 複雑さ（1-10）
  roi: number;                 // 投資対効果
  percentileRank: number;      // ROIのパーセンタイルランク（0-100）
  primaryArea: keyof CostImpactAreas; // 主な影響領域
}

/**
 * 効率係数を計算
 * 組織のプロファイルに基づいて、どれだけ効率的にコスト削減を実現できるかの係数を算出
 */
export function calcEfficiency(profile: OrgProfile): Record<keyof CostImpactAreas, number> {
  const industry = profile?.industry ?? 'technology';
  const objectives = profile?.objectives ?? [];
  const companySize = profile?.companySize ?? '101-250'; // デフォルトを中規模に設定

  // 組織規模による基準効率（実際のクライアントフォームの値を使用）
  const baseEfficiency = sizeBaselineEfficiency[companySize] ?? 0.4;
  
  // 業界による調整
  const industryAdj = industryAdjustment[industry] ?? 0;
  
  // クラウド戦略による調整
  let cloudStrategyAdj = 0;
  if (profile.isMultiCloud) {
    cloudStrategyAdj += cloudStrategyAdjustment.multiCloudComplexity;
  }
  if (profile.isHybridOnPrem) {
    cloudStrategyAdj += cloudStrategyAdjustment.hybridOnPremFocus;
  }
  if (profile.isModernCloud) {
    cloudStrategyAdj += cloudStrategyAdjustment.modernCloud;
  }
  
  // 目標からの全体的な効率調整を計算
  // 目標ごとの調整値から最大のものを選択
  let maxObjectiveAdj = 0;
  for (const objective of objectives) {
    const adjValue = objectiveEfficiencyAdjustment[objective as keyof typeof objectiveEfficiencyAdjustment] ?? 0;
    maxObjectiveAdj = Math.max(maxObjectiveAdj, adjValue);
  }
  
  const efficiencies = {} as Record<keyof CostImpactAreas, number>;
  
  // 目標と影響領域のマッピング
  const objectiveAreaMap: Record<string, Array<keyof CostImpactAreas>> = {
    cost_reduction: ['IC'],
    dev_productivity: ['DP'],
    security_improvements: ['IM'],
    reliability: ['IM'],
    innovation: ['TM'],
    speed_to_market: ['TM']
  };
  
  for (const area of Object.keys(costAreaEfficiencyRanges) as Array<keyof CostImpactAreas>) {
    const { min, max } = costAreaEfficiencyRanges[area];
    
    // 基本効率 = 基準値 + 業界調整 + クラウド戦略調整 + 目標調整
    let eff = baseEfficiency + industryAdj + cloudStrategyAdj + maxObjectiveAdj;
    
    // 領域特有の目標調整
    // 各目標について、その目標が適用される領域かどうかをチェック
    for (const objective of objectives) {
      const targetAreas = objectiveAreaMap[objective] || [];
      if (targetAreas.some(targetArea => targetArea === area)) {
        // 目標が該当領域に影響する場合、調整値を使用
        const adjValue = objectiveEfficiencyAdjustment[objective as keyof typeof objectiveEfficiencyAdjustment] ?? 0;
        eff += adjValue / 2; // 全体的な効果の半分を追加的に適用（特に関連する領域への強化）
      }
    }
    
    // 範囲内に収める
    efficiencies[area] = Math.max(min, Math.min(max, eff));
  }
  
  logger.debug('Calculated efficiencies', { efficiencies, profile });
  return efficiencies;
}

/**
 * コスト基準値を計算
 * 組織のプロファイルに基づいてコスト影響領域ごとの基準値を算出
 */
export function calcBaselines(profile: OrgProfile): Record<keyof CostImpactAreas, number> {
  const employees = profile?.employees || 100;
  const industry = profile?.industry || 'technology';
  
  // 業界別のベースライン乗数
  const industryMultipliers: Record<string, Record<keyof CostImpactAreas, number>> = {
    finance: { IC: 1.4, OE: 1.3, DP: 1.2, IM: 1.5, TM: 1.3 }, // 金融は規制とセキュリティで高コスト
    finance_banking: { IC: 1.4, OE: 1.3, DP: 1.2, IM: 1.5, TM: 1.3 },
    healthcare: { IC: 1.3, OE: 1.4, DP: 1.1, IM: 1.6, TM: 1.2 }, // ヘルスケアはコンプライアンスで高コスト
    government: { IC: 1.2, OE: 1.5, DP: 1.3, IM: 1.4, TM: 1.4 }, // 政府は運用効率が低い
    energy: { IC: 1.3, OE: 1.2, DP: 1.1, IM: 1.3, TM: 1.2 }, // エネルギーはインフラ重視
    manufacturing: { IC: 1.2, OE: 1.1, DP: 1.0, IM: 1.2, TM: 1.1 }, // 製造業は比較的効率的
    retail: { IC: 1.0, OE: 1.0, DP: 1.1, IM: 1.1, TM: 1.0 }, // 小売は標準的
    technology: { IC: 0.9, OE: 0.9, DP: 0.8, IM: 0.9, TM: 0.8 }, // テクノロジー企業は効率的
    media: { IC: 1.0, OE: 1.0, DP: 0.9, IM: 1.0, TM: 0.9 }, // メディアは比較的効率的
    telecom: { IC: 1.1, OE: 1.1, DP: 1.0, IM: 1.2, TM: 1.1 } // 通信は中程度
  };
  
  const multipliers = industryMultipliers[industry] || { IC: 1.0, OE: 1.0, DP: 1.0, IM: 1.0, TM: 1.0 };
  
  // 従業員数に基づく基本ベースライン計算
  let baseIC = 0, baseOE = 0, baseDP = 0, baseIM = 0, baseTM = 0;
  
  // 無効なデータに対するデフォルト値
  const cloudFootprint = profile?.cloudFootprint || 'hybrid';
  const revenue = profile?.revenue || 0;
  
  // 地域/通貨の設定を取得
  const userCurrency = profile.currency || 'JPY';
  const userLang = userCurrency === 'JPY' ? 'ja' : 'en';
  const regionCosts = regionSpecificCosts[userLang as keyof typeof regionSpecificCosts];
  
  // 開発者数の見積もり
  const devRatio = industryDevRatio[industry] || 0.2;
  const devCount = Math.round(employees * devRatio);
  
  // インフラコスト基準値
  const infraCostPerEmployee = regionCosts.infraCostPerEmployee[cloudFootprint as keyof typeof regionCosts.infraCostPerEmployee] || 
                               regionCosts.infraCostPerEmployee['hybrid'];
  const totalInfraCost = infraCostPerEmployee * employees;
  
  // 運用効率のコスト（運用担当者の人件費などから概算）
  const opsStaffRatio = 0.15; // 運用担当者の割合
  const opsStaffCount = Math.round(employees * opsStaffRatio);
  const opsCosts = opsStaffCount * regionCosts.opsSalary;
  
  // 開発生産性のコスト
  const devProductivityCost = devCount * regionCosts.devSalary * 1.2; // 開発者コスト + 20%のツール・環境コスト
  
  // インシデント管理のコスト
  // 平均ダウンタイムコスト: 年間インシデント数 × 平均解決時間 × 時間あたりコスト
  const isRegulatedIndustry = ['finance', 'healthcare'].includes(industry);
  const incidentsPerYear = isRegulatedIndustry 
    ? regionCosts.incidentParams.regulated.incidentsPerYear 
    : regionCosts.incidentParams.standard.incidentsPerYear;
  const avgResolutionHours = regionCosts.incidentParams.avgResolutionHours;
  const hourlyDowntimeCost = revenue > 0 
    ? (revenue * 0.05) / (240 * 8) // 年間売上の5%をダウンタイムコストと仮定し、営業時間で割る
    : employees * regionCosts.hourlyDowntimeCost; // 売上がない場合は従業員数ベースで概算
  
  const incidentCosts = incidentsPerYear * avgResolutionHours * hourlyDowntimeCost;
  
  // 市場投入時間のコスト（機会損失）
  const delayPenalty = industryDelayPenalty[industry] || 0.01;
  const timeToMarketCosts = revenue > 0 
    ? revenue * delayPenalty 
    : devProductivityCost * 0.5; // 売上がない場合は開発コストから概算
  
  logger.debug('Calculated cost baselines', { 
    profile, 
    baselines: {
      IC: totalInfraCost,
      OE: opsCosts,
      DP: devProductivityCost,
      IM: incidentCosts,
      TM: timeToMarketCosts
    } 
  });
  
  // 業界別乗数を適用
  const adjustedBaselines = {
    IC: totalInfraCost * multipliers.IC,
    OE: opsCosts * multipliers.OE,
    DP: devProductivityCost * multipliers.DP,
    IM: incidentCosts * multipliers.IM,
    TM: timeToMarketCosts * multipliers.TM
  };
  
  // 売上規模に基づく現実的なスケーリング
  let revenueScalingFactor = 1.0;
  if (revenue > 0) {
    // 売上規模に基づく調整（小規模企業の過大評価を防ぐ）
    const revenueInBillions = revenue / 1_000_000_000; // 10億円単位
    if (revenueInBillions < 0.1) { // 1億円未満
      revenueScalingFactor = 0.3;
    } else if (revenueInBillions < 1) { // 10億円未満
      revenueScalingFactor = 0.5;
    } else if (revenueInBillions < 10) { // 100億円未満
      revenueScalingFactor = 0.8;
    } else if (revenueInBillions < 100) { // 1兆円未満
      revenueScalingFactor = 1.0;
    } else { // 1兆円以上
      revenueScalingFactor = 1.2;
    }
  } else {
    // 売上データがない場合はより保守的なスケーリングを適用
    if (employees < 50) {
      revenueScalingFactor = 0.3;
    } else if (employees < 250) {
      revenueScalingFactor = 0.4;
    } else if (employees < 1000) {
      revenueScalingFactor = 0.5;
    } else if (employees < 5000) {
      revenueScalingFactor = 0.6; // 大企業でも売上データなしは保守的に
    } else {
      revenueScalingFactor = 0.7; // 超大企業でも最大70%
    }
  }
  
  // 最終的なベースライン（売上スケーリング適用）
  const finalBaselines = {
    IC: adjustedBaselines.IC * revenueScalingFactor,
    OE: adjustedBaselines.OE * revenueScalingFactor,
    DP: adjustedBaselines.DP * revenueScalingFactor,
    IM: adjustedBaselines.IM * revenueScalingFactor,
    TM: adjustedBaselines.TM * revenueScalingFactor
  };
  
  // 現実性チェック：異常に高いベースラインを制限
  const maxReasonableBaselines = {
    IC: employees * 1_000_000, // 従業員1人あたり最大100万円のインフラコスト
    OE: employees * 2_000_000, // 従業員1人あたり最大200万円の運用コスト
    DP: employees * 5_000_000, // 従業員1人あたり最大500万円の開発コスト
    IM: employees * 500_000,   // 従業員1人あたり最大50万円のインシデントコスト
    TM: employees * 3_000_000  // 従業員1人あたり最大300万円の機会損失
  };
  
  // ベースラインを現実的な範囲に制限
  const cappedBaselines = {
    IC: Math.min(finalBaselines.IC, maxReasonableBaselines.IC),
    OE: Math.min(finalBaselines.OE, maxReasonableBaselines.OE),
    DP: Math.min(finalBaselines.DP, maxReasonableBaselines.DP),
    IM: Math.min(finalBaselines.IM, maxReasonableBaselines.IM),
    TM: Math.min(finalBaselines.TM, maxReasonableBaselines.TM)
  };
  
  logger.debug('Applied industry multipliers and caps', { 
    industry, 
    multipliers, 
    revenueScalingFactor,
    originalBaselines: {
      IC: totalInfraCost,
      OE: opsCosts,
      DP: devProductivityCost,
      IM: incidentCosts,
      TM: timeToMarketCosts
    },
    adjustedBaselines,
    finalBaselines,
    cappedBaselines
  });
  
  return cappedBaselines;
}

/**
 * 成熟度のギャップに基づいて削減可能なコストを計算
 */
export function calcSavings(
  profile: OrgProfile,
  categoryScores: Record<string, number>
): CostSavings {
  // データがない場合はゼロを返す
  if (!profile || !categoryScores || Object.keys(categoryScores || {}).length === 0) {
    return {
      IC: 0, OE: 0, DP: 0, IM: 0, TM: 0, total: 0, confidence: 0, confidenceFactors: { dataCompleteness: 0, industryMatch: 0, organizationSize: 0, scoreReliability: 0 }
    };
  }
  
  try {
    // 効率係数とコスト基準値を計算
    const efficiencies = calcEfficiency(profile);
    const baselines = calcBaselines(profile);
    
    // カテゴリーごとのギャップを計算
    const gapReductions: Record<keyof CostImpactAreas, number> = {
      IC: 0, OE: 0, DP: 0, IM: 0, TM: 0
    };
    
    // カテゴリーごとに、ギャップとインパクト割合に基づく削減ポテンシャルを計算
    for (const category of Object.keys(categoryScores)) {
      const score = categoryScores[category];
      // スコアが無効な場合はスキップ
      if (typeof score !== 'number' || isNaN(score)) continue;
      
      const benchmark = getCategoryBenchmarkById(category);
      
      // ベンチマークが見つからない場合はスキップ
      if (!benchmark) continue;
      
      // カテゴリーの目標スコア
      const targetScore = benchmark.leader;
      
      // ギャップの計算：正規化されたスケールを使用
      // 0-100スケールでの改善ポテンシャルを計算
      const maxPossibleGap = 100 - score; // 現在のスコアから100までの改善余地
      const actualGap = Math.max(0, targetScore - score); // 実際のギャップ
      
      // 正規化されたギャップ（0-1の範囲）
      const normalizedGap = maxPossibleGap > 0 ? actualGap / maxPossibleGap : 0;
      
      // このカテゴリーのコスト影響領域の配分
      const impact = categoryImpact[category];
      
      if (!impact) continue;
      
      // 各コスト領域への影響を加算
      for (const area of Object.keys(impact) as Array<keyof CostImpactAreas>) {
        // ギャップ × 影響割合 × 効率係数
        const areaImpact = impact[area] / 100; // パーセントを小数に変換
        const efficiencyFactor = efficiencies[area];
        
        // このカテゴリーのこの領域への貢献率
        const contribution = normalizedGap * areaImpact * efficiencyFactor;
        
        // 貢献率を基に削減額を計算
        gapReductions[area] += baselines[area] * contribution;
      }
    }
    
    // 総削減額
    const totalSavings = Object.values(gapReductions).reduce((sum, val) => sum + val, 0);
    
    // 信頼度スコアの計算
    const confidenceFactors = calculateConfidenceFactors(profile, categoryScores);
    const overallConfidence = Math.round(
      (confidenceFactors.dataCompleteness + 
       confidenceFactors.industryMatch + 
       confidenceFactors.organizationSize + 
       confidenceFactors.scoreReliability) / 4
    );
    
    const result = {
      ...gapReductions,
      total: totalSavings,
      confidence: overallConfidence,
      confidenceFactors
    };
    
    logger.debug('Calculated savings', { profile, categoryScores, savings: result });
    
    return result;
  } catch (error) {
    logger.error('Error calculating cost savings', { error, profile });
    return {
      IC: 0, OE: 0, DP: 0, IM: 0, TM: 0, total: 0, confidence: 0, confidenceFactors: { dataCompleteness: 0, industryMatch: 0, organizationSize: 0, scoreReliability: 0 }
    };
  }
}

/**
 * カテゴリーの複雑性インデックスを計算
 * 
 * @param category カテゴリーID
 * @param profile 組織プロファイル
 * @returns 複雑性インデックス（1-10）
 */
export function calcComplexityIndex(
  category: string, 
  profile: OrgProfile
): number {
  // 基本的な複雑性マッピング（カテゴリーごとの固有の複雑さ）
  const baseComplexity: Record<string, number> = {
    foundations_culture: 7,         // 文化は複雑（人的要素が多い）
    business_value_strategy: 6,     // 戦略の変更は複数の関係者の合意が必要
    application_architecture: 8,    // アーキテクチャ変更は技術的に複雑
    app_migration_modernization: 9, // 最も複雑な変更の一つ
    container_infrastructure: 7,    // インフラ変更は技術的に複雑だが標準化されている
    cicd_practices: 5,              // ツール導入は比較的容易
    dora_metrics: 4,                // 測定は比較的容易
    security_compliance: 8,         // セキュリティは複雑で規制要件がある
    infrastructure_platform: 8,     // プラットフォーム導入は大規模な変更
    data_management: 7,             // データガバナンス変更は複雑
    observability: 4,               // ツール導入は比較的容易
    finops_cost_management: 5,      // コスト管理プロセス導入は中程度
    operations_resilience: 6,       // 運用改善は中程度
    multicloud_hybrid_governance: 8, // 複数クラウド管理は複雑
    ai_ml_integration: 9            // AI/ML統合は特に複雑
  };
  
  // デフォルト値
  const defaultComplexity = 5;
  
  // 基本の複雑性
  const complexity = baseComplexity[category] || defaultComplexity;
  
  // 組織規模による補正（大きい組織ほど複雑）
  const companySize = profile?.companySize || '101-250';
  
  // 会社規模による複雑性調整
  const sizeComplexityFactors: Record<string, number> = {
    "1-10": 0,           // 非常に小規模、変化は容易
    "11-50": 0.5,        // 小規模、比較的容易
    "51-100": 1,         // 小〜中規模、標準的
    "101-250": 1.5,      // 中規模、やや複雑
    "251-500": 2,        // 中規模、複雑
    "501-2000": 2.5,     // 中堅企業、非常に複雑
    "2001-5000": 3,      // 大企業、極めて複雑
    "5001+": 3.5         // 非常に大規模、最大の複雑性
  };
  
  const sizeFactor = sizeComplexityFactors[companySize] || 1.5;
  
  // 業界による補正（規制の厳しい業界は変更が複雑）
  const industryComplexity: Record<string, number> = {
    finance: 1.5, finance_banking: 1.5, healthcare: 1.5, government: 1.5, // 規制厳格
    energy: 1, manufacturing: 1, telecom: 1,                             // 規制あり
    retail: 0, technology: 0, media: 0                                   // 比較的自由
  };
  
  const industry = profile?.industry || 'technology';
  const industryFactor = industryComplexity[industry] || 0;
  
  // 最終的な複雑性スコア（1-10のスケール）
  let finalComplexity = complexity + sizeFactor + industryFactor;
  
  // 範囲内に収める
  finalComplexity = Math.max(1, Math.min(10, finalComplexity));
  
  return finalComplexity;
}

/**
 * 各カテゴリーのクイックウィンを計算
 * 
 * @param profile 組織プロファイル
 * @param categoryScores カテゴリースコア
 * @param limit 結果の上限数
 * @returns クイックウィンのリスト
 */
export function calcQuickWins(
  profile: OrgProfile,
  categoryScores: Record<string, number>,
  limit: number = 3
): QuickWin[] {
  // 必要なデータがない場合は空の配列を返す
  if (!profile || !categoryScores) {
    return [];
  }
  
  try {
    // 各カテゴリーのROIを計算
    const wins: QuickWin[] = [];
    
    for (const [categoryId, score] of Object.entries(categoryScores)) {
      // 無効なスコアの場合はスキップ
      if (typeof score !== 'number' || isNaN(score)) continue;
      
      // ベンチマークを取得
      const benchmark = getCategoryBenchmarkById(categoryId);
      if (!benchmark) continue;
      
      // カテゴリーのインパクト情報を取得
      const impact = categoryImpact[categoryId];
      if (!impact) continue;
      
      // 主な影響領域を特定（最大のインパクト割合を持つ領域）
      let primaryArea: keyof CostImpactAreas = 'IC';
      let maxImpact = 0;
      
      for (const [area, percentage] of Object.entries(impact) as [keyof CostImpactAreas, number][]) {
        if (percentage > maxImpact) {
          maxImpact = percentage;
          primaryArea = area;
        }
      }
      
      // このカテゴリーに対する効率係数
      const efficiencies = calcEfficiency(profile);
      const efficiency = efficiencies[primaryArea];
      
      // ターゲットスコアの計算
      // リーダーとの中間点を目標に設定（これより高いスコアは実現が難しくなる）
      const targetScore = Math.min(
        score + 15, // 最大15ポイントの改善
        benchmark.leader
      );
      
      // このカテゴリーがリーダースコアに達している場合はスキップ
      if (score >= benchmark.leader) continue;
      
      // ギャップの計算：正規化されたスケールを使用
      // 0-100スケールでの改善ポテンシャルを計算
      const maxPossibleGap = 100 - score; // 現在のスコアから100までの改善余地
      const actualGap = Math.max(0, targetScore - score); // 実際のギャップ
      
      // 正規化されたギャップ（0-1の範囲）
      const normalizedGap = maxPossibleGap > 0 ? actualGap / maxPossibleGap : 0;
      
      // カテゴリーのインパクト情報とギャップに基づいて削減ポテンシャルを計算
      const baselines = calcBaselines(profile);
      let potentialSavings = 0;
      
      for (const area of Object.keys(impact) as Array<keyof CostImpactAreas>) {
        const areaImpact = impact[area] / 100;
        const contribution = normalizedGap * areaImpact * efficiencies[area];
        potentialSavings += baselines[area] * contribution;
      }
      
      // 複雑性インデックスを計算
      const complexity = calcComplexityIndex(categoryId, profile);
      
      // ROI = インパクト / 複雑性
      const roi = potentialSavings / complexity;
      
      wins.push({
        category: categoryId,
        score,
        targetScore,
        impact: potentialSavings,
        complexity,
        roi,
        percentileRank: 0, // 一時的に0をセット（後で計算）
        primaryArea
      });
    }
    
    // ROIによるクイックウィンのランク付け
    wins.sort((a, b) => b.roi - a.roi);
    
    // ROIのパーセンタイルランクを計算
    const maxRoi = wins.length > 0 ? wins[0].roi : 0;
    
    for (const win of wins) {
      win.percentileRank = maxRoi > 0 ? (win.roi / maxRoi) * 100 : 0;
    }
    
    // 上位N件を返す
    return wins.slice(0, limit);
    
  } catch (error) {
    logger.error('Error calculating quick wins', { error, profile });
    return [];
  }
}

/**
 * 通貨を変換する
 * 
 * @param amount 変換する金額
 * @param fromCurrency 元の通貨
 * @param toCurrency 変換先の通貨
 * @returns 変換後の金額
 */
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  type SupportedCurrency = 'JPY' | 'USD' | 'EUR';
  
  // 簡易的な為替レート
  const rates: Record<SupportedCurrency, Record<SupportedCurrency, number>> = {
    JPY: { JPY: 1, USD: 0.0067, EUR: 0.0062 },
    USD: { JPY: 150, USD: 1, EUR: 0.92 },
    EUR: { JPY: 162, USD: 1.09, EUR: 1 }
  };
  
  // サポートされている通貨に変換
  const from = (fromCurrency || 'JPY') as SupportedCurrency;
  const to = (toCurrency || 'JPY') as SupportedCurrency;
  
  if (from === to) return amount;
  
  return amount * (rates[from]?.[to] || 1);
}

/**
 * 通貨を適切なフォーマットで表示する
 * 
 * @param amount 金額
 * @param currency 通貨コード
 * @returns フォーマットされた金額
 */
export function formatCurrency(amount: number, currency: string = 'JPY'): string {
  logger.debug(`[formatCurrency] Input details`, { amount, currency });
  
  if (!amount || isNaN(amount)) amount = 0;
  
  // Normalize currency code
  const currencyCode = (currency || 'JPY').toUpperCase();
  logger.debug(`[formatCurrency] Normalized currencyCode: ${currencyCode}`);
  
  // For JPY, always use direct formatting with yen symbol
  if (currencyCode === 'JPY') {
    // For very large amounts (>=100,000,000 JPY = 10,000万円), use 億円 units
    if (amount >= 100_000_000) {
      const inOkuYen = amount / 100_000_000;
      // Round to one decimal place for readability
      const roundedOkuYen = Math.round(inOkuYen * 10) / 10;
      // Format with Japanese locale
      const formattedOkuYen = roundedOkuYen.toLocaleString('ja-JP');
      const result = `${formattedOkuYen}億円`;
      logger.debug(`[formatCurrency] Using 億円 units for very large amount: ${result}`);
      return result;
    }
    
    // For large amounts (>=10,000), use 万円 (10,000 yen) units which is common in Japan
    if (amount >= 10000) {
      const inManYen = amount / 10000;
      // Round to whole number
      const roundedManYen = Math.round(inManYen);
      // Format with Japanese locale
      const formattedManYen = roundedManYen.toLocaleString('ja-JP');
      const result = `${formattedManYen}万円`;
      logger.debug(`[formatCurrency] Using 万円 units for large amount: ${result}`);
      return result;
    }
    
    // For smaller amounts, use regular formatting
    const formattedNumber = amount.toLocaleString('ja-JP');
    const result = `¥${formattedNumber}`;
    logger.debug(`[formatCurrency] Direct JPY formatting result: ${result}`);
    return result;
  }
  
  // For all other currencies, use Intl API
  const locale = currencyCode === 'EUR' ? 'de-DE' : 'en-US';
  logger.debug(`[formatCurrency] Using locale: ${locale} for currency: ${currencyCode}`);
  
  try {
    const result = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(amount);
    logger.debug(`[formatCurrency] Intl API result: ${result}`);
    return result;
  } catch (error) {
    logger.error('[formatCurrency] Error', error);
    // Fallback formatting
    const fallbackResult = currencyCode === 'USD' 
      ? `$${amount.toLocaleString('en-US')}` 
      : `${currencyCode} ${amount.toLocaleString()}`;
    logger.debug(`[formatCurrency] Fallback result: ${fallbackResult}`);
    return fallbackResult;
  }
}

/**
 * 信頼度要因を計算
 * 既存のデータ品質と精度に基づいて信頼度スコアを算出
 */
function calculateConfidenceFactors(
  profile: OrgProfile, 
  categoryScores: Record<string, number>
): {
  dataCompleteness: number;
  industryMatch: number;
  organizationSize: number;
  scoreReliability: number;
} {
  // データ完全性の評価
  let dataCompletenessScore = 0;
  const requiredFields = ['employees', 'industry'];
  const optionalFields = ['revenue', 'cloudFootprint', 'objectives'];
  
  // 必須フィールドの確認
  let requiredFieldsPresent = 0;
  for (const field of requiredFields) {
    if (profile[field as keyof OrgProfile]) {
      requiredFieldsPresent++;
    }
  }
  dataCompletenessScore += (requiredFieldsPresent / requiredFields.length) * 50; // 必須フィールドで50%（70%→50%に修正）
  
  // 売上データの有無による重要な調整
  if (profile.revenue && profile.revenue > 0) {
    dataCompletenessScore += 30; // 売上データがある場合は大幅なボーナス
  } else {
    dataCompletenessScore += 5;  // 売上データがない場合は最小限のスコア
  }
  
  // その他のオプションフィールドの確認
  let otherOptionalFieldsPresent = 0;
  const otherOptionalFields = ['cloudFootprint', 'objectives'];
  for (const field of otherOptionalFields) {
    if (profile[field as keyof OrgProfile]) {
      otherOptionalFieldsPresent++;
    }
  }
  dataCompletenessScore += (otherOptionalFieldsPresent / otherOptionalFields.length) * 20; // その他のオプションフィールドで20%
  
  // 業界マッチング精度（既存の業界データとの照合）
  let industryMatchScore = 50; // ベースライン
  const industry = profile.industry || '';
  
  // industryDevRatio, industryDelayPenalty, industryAdjustment に業界データがあるかチェック
  if (industryDevRatio[industry] !== undefined) industryMatchScore += 15;
  if (industryDelayPenalty[industry] !== undefined) industryMatchScore += 15;
  if (industryAdjustment[industry] !== undefined) industryMatchScore += 20;
  
  // 組織規模の適合性
  const employees = profile.employees || 100;
  let organizationSizeScore = 100; // 全ての規模に対応
  
  // 極端に小さいまたは大きい組織は精度が下がる可能性
  if (employees < 10) {
    organizationSizeScore = 60; // 非常に小規模
  } else if (employees > 100000) {
    organizationSizeScore = 80; // 非常に大規模
  }
  
  // スコアの信頼性（カテゴリースコアの品質評価）
  let scoreReliabilityScore = 0;
  const scores = Object.values(categoryScores).filter(score => typeof score === 'number' && !isNaN(score));
  
  if (scores.length === 0) {
    scoreReliabilityScore = 0;
  } else {
    // スコア数による評価
    const totalCategories = Object.keys(categoryImpact).length;
    const scoreCompletenessRatio = scores.length / totalCategories;
    scoreReliabilityScore += scoreCompletenessRatio * 50;
    
    // スコアの妥当性チェック（0-100の範囲内）
    const validScores = scores.filter(score => score >= 0 && score <= 100);
    const validityRatio = validScores.length / scores.length;
    scoreReliabilityScore += validityRatio * 30;
    
    // スコアの分散チェック（全て同じ値でないか）
    const uniqueScores = new Set(scores);
    if (uniqueScores.size > 1) {
      scoreReliabilityScore += 20; // スコアに適切な分散がある
    }
  }
  
  return {
    dataCompleteness: Math.round(Math.min(100, dataCompletenessScore)),
    industryMatch: Math.round(Math.min(100, industryMatchScore)),
    organizationSize: Math.round(organizationSizeScore),
    scoreReliability: Math.round(Math.min(100, scoreReliabilityScore))
  };
} 