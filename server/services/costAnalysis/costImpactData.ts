/**
 * @file costImpactData.ts
 * @description クラウドネイティブ成熟度のコスト影響領域の定義
 * 各カテゴリーがコスト領域に与える影響の割合と、その根拠を定義します。
 */

/**
 * コスト影響領域の型定義
 * IC: インフラストラクチャコスト
 * OE: 運用効率
 * DP: 開発生産性
 * IM: インシデント管理
 * TM: 市場投入時間
 */
export interface CostImpactAreas {
  IC: number; // 割合（%）
  OE: number;
  DP: number;
  IM: number;
  TM: number;
}

/**
 * カテゴリーごとのコスト影響領域の説明
 */
export interface CostImpactExplanation {
  primaryArea: keyof CostImpactAreas;
  description: string;
  evidenceSource?: string;
  evidenceUrl?: string;
}

/**
 * カテゴリーごとのコスト影響領域のインパクト割合（%）
 * 各行の合計は100%になります
 */
export const categoryImpact: Record<string, CostImpactAreas> = {
  foundations_culture:         { IC: 10, OE: 30, DP: 40, IM:  5, TM: 15 },
  business_value_strategy:     { IC: 20, OE: 25, DP:  5, IM:  0, TM: 50 },
  application_architecture:    { IC: 35, OE:  5, DP: 25, IM: 20, TM: 15 },
  app_migration_modernization: { IC: 30, OE: 20, DP: 15, IM: 15, TM: 20 },
  container_infrastructure:    { IC: 40, OE: 20, DP: 20, IM:  5, TM: 15 },
  cicd_practices:              { IC:  5, OE: 15, DP: 40, IM: 20, TM: 20 },
  dora_metrics:                { IC:  0, OE: 10, DP: 30, IM: 35, TM: 25 },
  security_compliance:         { IC:  5, OE: 20, DP:  0, IM: 60, TM: 15 },
  infrastructure_platform:     { IC: 30, OE: 30, DP: 10, IM: 10, TM: 20 },
  data_management:             { IC: 15, OE: 25, DP: 20, IM: 25, TM: 15 },
  observability:               { IC:  5, OE: 25, DP: 10, IM: 40, TM: 20 },
  finops_cost_management:      { IC: 60, OE: 15, DP:  5, IM:  0, TM: 20 },
  operations_resilience:       { IC:  5, OE: 20, DP:  0, IM: 55, TM: 20 },
  multicloud_hybrid_governance:{ IC: 25, OE: 25, DP: 10, IM: 20, TM: 20 },
  ai_ml_integration:           { IC: 10, OE:  5, DP: 40, IM: 15, TM: 30 }
};

/**
 * 各カテゴリーの主要コスト影響領域と根拠の説明
 */
export const impactExplanations: Record<string, CostImpactExplanation> = {
  foundations_culture: {
    primaryArea: "DP",
    description: "Productivity + team efficiency gains dominate.",
    evidenceSource: "Google Cloud",
    evidenceUrl: "https://cloud.google.com/devops/state-of-devops"
  },
  business_value_strategy: {
    primaryArea: "TM",
    description: "Strategy clarity mainly accelerates release cadence & priorities.",
    evidenceSource: "Google Cloud",
    evidenceUrl: "https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report"
  },
  application_architecture: {
    primaryArea: "IC",
    description: "Good design cuts infra waste and incidents (resilience patterns).",
    evidenceSource: "Technavio Newsroom",
    evidenceUrl: "https://newsroom.technavio.org/application-container-market-analysis"
  },
  app_migration_modernization: {
    primaryArea: "IC",
    description: "Legacy modernisation frees infra $, but also boosts speed."
  },
  container_infrastructure: {
    primaryArea: "IC",
    description: "Containers + serverless drive infra efficiency.",
    evidenceSource: "Technavio Newsroom",
    evidenceUrl: "https://newsroom.technavio.org/application-container-market-analysis"
  },
  cicd_practices: {
    primaryArea: "DP",
    description: "MTTR + developer velocity are the pay-offs.",
    evidenceSource: "Harness.io",
    evidenceUrl: "https://www.harness.io/blog/what-is-mttr-dora-metric"
  },
  dora_metrics: {
    primaryArea: "IM",
    description: "Direct link to failure recovery & lead-time.",
    evidenceSource: "Google Cloud",
    evidenceUrl: "https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report"
  },
  security_compliance: {
    primaryArea: "IM",
    description: "Breach-cost delta with AI/automation.",
    evidenceSource: "IBM",
    evidenceUrl: "https://www.ibm.com/reports/data-breach"
  },
  infrastructure_platform: {
    primaryArea: "IC",
    description: "IaC + platform SRE cut Ops toil and infra waste."
  },
  data_management: {
    primaryArea: "IM",
    description: "Poor data governance drives breach & incident costs.",
    evidenceSource: "IBM",
    evidenceUrl: "https://www.ibm.com/reports/data-breach"
  },
  observability: {
    primaryArea: "IM",
    description: "Faster detection → MTTR ↓ ; NR survey shows 2× ROI.",
    evidenceSource: "New Relic",
    evidenceUrl: "https://newrelic.com/press-release/20230912"
  },
  finops_cost_management: {
    primaryArea: "IC",
    description: "Direct infra spend cuts (Gartner 15% median).",
    evidenceSource: "Gartner",
    evidenceUrl: "https://www.gartner.com/peer-community/poll/biggest-advantages-cloud-computing"
  },
  operations_resilience: {
    primaryArea: "IM",
    description: "PagerDuty & Splunk show big outage-cost delta.",
    evidenceSource: "PagerDuty",
    evidenceUrl: "https://www.pagerduty.com/resources/insights/learn/cost-of-downtime/"
  },
  multicloud_hybrid_governance: {
    primaryArea: "IC",
    description: "Prevents cloud sprawl costs and cross-cloud incidents."
  },
  ai_ml_integration: {
    primaryArea: "DP",
    description: "25% AI adoption lifts productivity and job-satisfaction (DORA 2024).",
    evidenceSource: "Google Cloud",
    evidenceUrl: "https://cloud.google.com/devops/state-of-devops"
  }
};

/**
 * コスト領域ごとのデフォルト効率係数範囲
 * コスト領域によって削減効果の実現しやすさが異なる
 */
export const costAreaEfficiencyRanges = {
  IC: { min: 0.50, max: 0.70 }, // インフラコスト削減は比較的早く効果が出る
  OE: { min: 0.40, max: 0.60 }, // 運用効率は自動化の採用度合いに依存
  DP: { min: 0.30, max: 0.50 }, // 開発生産性は文化や人の要素が大きく時間がかかる
  IM: { min: 0.50, max: 0.70 }, // インシデント管理は直接コスト削減に繋がりやすい
  TM: { min: 0.30, max: 0.50 }  // 市場投入時間は確率的な要素が大きい
};

/**
 * 業界ごとの開発者比率（保守的な低位推定版）
 * 全従業員に対する開発者の割合 - 業界調査の低位範囲を採用
 */
export const industryDevRatio: Record<string, number> = {
  // ハイテク企業（保守的推定）
  technology: 0.30,           // テクノロジー企業（0.30-0.50の低位）
  media: 0.15,               // メディア・エンターテイメント（0.15-0.30の低位）
  
  // 金融・専門サービス（保守的推定）
  finance: 0.10,             // 金融・銀行（0.10-0.25の低位、伝統的銀行）
  finance_banking: 0.10,     // 銀行業（0.10-0.25の低位）
  professional_services: 0.10, // 専門サービス（0.10-0.20の低位）
  telecom: 0.10,             // 通信（0.10-0.15の低位、伝統的通信会社）
  
  // 小売・製造業など（保守的推定）
  retail: 0.05,              // 小売・Eコマース（0.05-0.10の低位）
  manufacturing: 0.05,       // 製造業（0.05-0.10の低位）
  energy: 0.05,              // エネルギー・公益事業（0.05-0.12の低位）
  transportation: 0.05,      // 運輸・物流（0.05-0.10の低位）
  hospitality: 0.03,         // ホスピタリティ・観光（0.03-0.06の低位）
  
  // 規制業界・公共機関（保守的推定）
  healthcare: 0.05,          // ヘルスケア・ライフサイエンス（0.05-0.15の低位、病院等）
  government: 0.05,          // 政府・公共機関（0.05-0.10の低位）
  education: 0.05,           // 教育（0.05-0.15の低位、伝統的大学等）
  nonprofit: 0.05,           // 非営利団体（0.05-0.10の低位）
  
  // デフォルト（保守的推定）
  other: 0.10               // その他（0.10-0.15の低位）
};

/**
 * クラウド構成ごとの従業員1人あたりのインフラコスト（円/年）
 */
export const infraPerEmployeeJPY: Record<string, number> = {
  "cloud-native": 600_000,  // クラウドネイティブ環境
  "hybrid": 450_000,        // ハイブリッド環境
  "on-prem": 300_000        // オンプレミス中心
};

/**
 * 業界ごとの遅延ペナルティ係数（収益に対する割合）
 * 市場投入の遅れが収益に与える影響の割合
 */
export const industryDelayPenalty: Record<string, number> = {
  retail: 0.02, technology: 0.02, media: 0.02,       // 高影響
  finance: 0.01, finance_banking: 0.01, telecom: 0.01, transportation: 0.01, // 中影響
  manufacturing: 0.008, energy: 0.008,               // 低～中影響
  healthcare: 0.008, government: 0.005,              // 低影響
  professional_services: 0.008, hospitality: 0.008,
  nonprofit: 0.005, education: 0.005, other: 0.008
};

/**
 * 業界ごとの調整係数（規制やガバナンスの複雑さに基づく）
 */
export const industryAdjustment: Record<string, number> = {
  finance: -0.05, finance_banking: -0.05, healthcare: -0.05, government: -0.05,  // 規制が厳しい
  energy: -0.03, manufacturing: -0.03, telecom: -0.03, transportation: -0.03, // 比較的規制が厳しい
  retail: 0.02, technology: 0.02, media: 0.02, hospitality: 0.01, // 変化が速い
  professional_services: 0, education: 0, nonprofit: 0, other: 0  // 中立
};

/**
 * 企業規模ごとのベースライン効率係数
 * クライアントドロップダウンの実際のサイズカテゴリに対応
 */
export const sizeBaselineEfficiency: Record<string, number> = {
  "1-10": 0.65,        // スタートアップ、非常に素早い変化、リソース制約あり
  "11-50": 0.60,       // 小規模、素早い変化、リソース制約あり
  "51-100": 0.55,      // 小〜中規模、比較的素早い変化
  "101-250": 0.50,     // 中規模、スケールアップ段階
  "251-500": 0.45,     // 中規模、プロセス確立段階
  "501-2000": 0.40,    // 中堅企業、プロセスあり、変化に時間
  "2001-5000": 0.35,   // 大企業、変化が遅い、複雑な承認プロセス
  "5001+": 0.30        // 非常に大規模、変化が最も遅い、重い承認プロセス
};

/**
 * クラウド戦略シグナルごとの効率係数調整値
 * 組織のクラウド環境によってコスト削減の実現難易度が変わる
 */
export const cloudStrategyAdjustment = {
  multiCloudComplexity: -0.03,    // 複数クラウドプロバイダーの利用 (≥ 2 cloud providers)
  hybridOnPremFocus: -0.04,       // ハイブリッド/オンプレミス重視
  modernCloud: 0.05               // モダンクラウド環境（AWS/Azure/GCPのみでcloud-native）
};

/**
 * ビジネス目標ごとの効率係数調整値
 * 組織の目標によってコスト削減の実現しやすさが変わる
 */
export const objectiveEfficiencyAdjustment = {
  cost_reduction: 0.04,      // コスト削減
  dev_productivity: 0.04,    // 開発者生産性
  security_improvements: 0.02, // セキュリティ改善
  reliability: 0.02,         // 信頼性
  innovation: 0.02,          // イノベーション
  speed_to_market: 0.02,     // 市場投入速度
  other: 0                   // その他
};

/**
 * 地域/通貨ごとのコスト係数
 * 異なる地域での給与やコスト基準を定義します。
 */
export const regionSpecificCosts = {
  'ja': {
    currency: 'JPY',
    // 開発者/エンジニアの給与
    devSalary: 7_000_000,  // 技術職は比較的高め
    // 運用スタッフの給与
    opsSalary: 6_200_000,  // 開発職より通常低め
    // インフラコスト
    infraCostPerEmployee: {
      'cloud-native': 600_000,
      'hybrid': 450_000,
      'on-prem': 300_000
    },
    // その他の日本特有のパラメータ
    hourlyDowntimeCost: 10000, // 従業員1人あたり（収益データがない場合）
    incidentParams: {
      avgResolutionHours: 4,
      regulated: { incidentsPerYear: 12 },
      standard: { incidentsPerYear: 8 }
    }
  },
  'en': {
    currency: 'USD',
    // 開発者/エンジニアの給与
    devSalary: 120_000,
    // 運用スタッフの給与
    opsSalary: 90_000,
    // インフラコスト
    infraCostPerEmployee: {
      'cloud-native': 6_000,
      'hybrid': 3_000, 
      'on-prem': 2_000
    },
    // その他の米国/国際的なパラメータ
    hourlyDowntimeCost: 100, // 従業員1人あたり（収益データがない場合）
    incidentParams: {
      avgResolutionHours: 4,
      regulated: { incidentsPerYear: 12 },
      standard: { incidentsPerYear: 8 }
    }
  }
}; 