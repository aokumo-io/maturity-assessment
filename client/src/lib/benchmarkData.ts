/**
 * @file benchmarkData.ts
 * @description インダストリーベンチマークデータ
 * 各カテゴリーの業界中央値、リーダー値、およびリファレンス情報を提供します。
 */

export interface CategoryBenchmarkData {
  id: number;
  category: string;
  categoryId: string;
  leader: number;
  median: number;
  japanLeader: string;
  globalLeader: string;
  description: string;
  keyInsight: string;
  icon?: string; // アイコン表現（リッチアイコンのクラス名）
}

/**
 * 詳細なベンチマークデータ
 */
export const categoryBenchmarks: CategoryBenchmarkData[] = [
  { 
    id: 1, 
    category: "Foundations & Culture", 
    categoryId: "foundations_culture",
    leader: 80, 
    median: 58, 
    japanLeader: "Mercari", 
    globalLeader: "Spotify",
    description: "DevOps culture & micro-teams running >800 micro-services",
    keyInsight: "2024 State-of-DevOps: high-performers score 0.8 on culture index; median sits just under 0.6",
    icon: "ri-building-line"
  },
  { 
    id: 2, 
    category: "Business Value Strategy", 
    categoryId: "business_value_strategy",
    leader: 78, 
    median: 55, 
    japanLeader: "Rakuten Group", 
    globalLeader: "DBS Bank",
    description: "Cloud value road-mapping for edge-AI services",
    keyInsight: "Hackett Group: only 42% have value-roadmap; top quartile show 25% faster release cadence",
    icon: "ri-line-chart-line"
  },
  { 
    id: 3, 
    category: "Application Architecture", 
    categoryId: "application_architecture",
    leader: 77, 
    median: 53, 
    japanLeader: "LINE", 
    globalLeader: "Netflix",
    description: "Large-scale mobile super-app on micro-services & gRPC",
    keyInsight: "~50% of orgs still monolithic; leaders hit 75–80% micro-/service-mesh adoption",
    icon: "ri-layout-line"
  },
  { 
    id: 4, 
    category: "App Migration & Modernisation", 
    categoryId: "app_migration_modernization",
    leader: 75, 
    median: 50, 
    japanLeader: "Rakuten Cloud", 
    globalLeader: "Capital One",
    description: "Lift-and-shift → Kubernetes & serverless across 700+ services",
    keyInsight: "< 45% of workloads modernised by 2024; cloud leaders cross 70%",
    icon: "ri-recycle-line"
  },
  { 
    id: 5, 
    category: "Container Infrastructure", 
    categoryId: "container_infrastructure",
    leader: 80, 
    median: 60, 
    japanLeader: "Rakuten Mobile / Cloud", 
    globalLeader: "Spotify",
    description: "Runs 10,000+ K8s nodes incl. stateful edge clusters",
    keyInsight: "60% production K8s today; top cohort fully containerised",
    icon: "ri-archive-line"
  },
  { 
    id: 6, 
    category: "CI/CD Practices", 
    categoryId: "cicd_practices",
    leader: 82, 
    median: 57, 
    japanLeader: "CyberAgent (PipeCD)", 
    globalLeader: "Etsy",
    description: "GitOps CD tool OSS-ed; internal unified pipeline",
    keyInsight: "57% automate > half of pipeline; elite automate ≈ 80%",
    icon: "ri-loop-line"
  },
  { 
    id: 7, 
    category: "DORA Metrics", 
    categoryId: "dora_metrics",
    leader: 85, 
    median: 60, 
    japanLeader: "Mercari", 
    globalLeader: "Google Chrome team",
    description: "Publishes lead-time / MTTR in engineering blog ('Golden Path')",
    keyInsight: "Elite performers (26%) hit 85-plus composite, median is 'medium' (≈60)",
    icon: "ri-bar-chart-line"
  },
  { 
    id: 8, 
    category: "Security & Compliance", 
    categoryId: "security_compliance",
    leader: 78, 
    median: 52, 
    japanLeader: "NTT DATA", 
    globalLeader: "HSBC",
    description: "Zero-Trust deployment with Zscaler across global workforce",
    keyInsight: "AI-driven/shift-left orgs slash risk; majority still reactive (≈50)",
    icon: "ri-shield-check-line"
  },
  { 
    id: 9, 
    category: "Infrastructure Platform", 
    categoryId: "infrastructure_platform",
    leader: 80, 
    median: 55, 
    japanLeader: "Mercari Platform Eng.", 
    globalLeader: "Netflix",
    description: "Internal developer platform on GKE + Spanner",
    keyInsight: "IaC adoption ~55%; platform-engineering leaders report > 75% IaC coverage",
    icon: "ri-server-line"
  },
  { 
    id: 10, 
    category: "Data Management", 
    categoryId: "data_management",
    leader: 77, 
    median: 54, 
    japanLeader: "Mercari / Merpay", 
    globalLeader: "Airbnb",
    description: "Spanner + Data-mesh for payments",
    keyInsight: "Median data-classification maturity at ~0.54",
    icon: "ri-database-2-line"
  },
  { 
    id: 11, 
    category: "Observability", 
    categoryId: "observability",
    leader: 78, 
    median: 56, 
    japanLeader: "Yahoo Japan", 
    globalLeader: "LinkedIn",
    description: "Centralised Grafana + OpenTelemetry",
    keyInsight: "76% have central observability; only 25% rate practices 'advanced' (> 0.75)",
    icon: "ri-eye-line"
  },
  { 
    id: 12, 
    category: "FinOps / Cost-Mgmt", 
    categoryId: "finops_cost_management",
    leader: 80, 
    median: 58, 
    japanLeader: "CyberAgent", 
    globalLeader: "Atlassian",
    description: "K8s cost-insights via open-source Kubecost fork",
    keyInsight: "58% automate anomaly detection; high-performers score ~0.8 in FinOps maturity index",
    icon: "ri-money-dollar-circle-line"
  },
  { 
    id: 13, 
    category: "Operations Resilience", 
    categoryId: "operations_resilience",
    leader: 78, 
    median: 55, 
    japanLeader: "Mercari SRE", 
    globalLeader: "Netflix",
    description: "GameDay chaos drills; MTTR < 5 min avg",
    keyInsight: "Incident automation still sub-60%; leaders with chaos-engineering score ~0.78",
    icon: "ri-refresh-line"
  },
  { 
    id: 14, 
    category: "Multicloud & Hybrid Gov.", 
    categoryId: "multicloud_hybrid_governance",
    leader: 75, 
    median: 50, 
    japanLeader: "NTT DATA", 
    globalLeader: "Adobe",
    description: "Managed hybrid governance for Toyota-Woven Planet",
    keyInsight: "Only 48% have unified policy controls; mature orgs hit mid-70s",
    icon: "ri-cloud-line"
  },
  { 
    id: 15, 
    category: "AI/ML Integration", 
    categoryId: "ai_ml_integration",
    leader: 77, 
    median: 52, 
    japanLeader: "Rakuten AI Edge", 
    globalLeader: "Uber",
    description: "In-cluster inferencing for edge retail cameras",
    keyInsight: "55% pilot AI in ≤3 functions; 'AI high-performers' (12%) score > 0.75 on adoption + ROI",
    icon: "ri-brain-line"
  }
];

/**
 * @function getCompanyIconName
 * @description 会社名に基づいてアイコン表現を取得する
 * @param {string} company - 会社名
 * @returns {string} アイコン表現
 */
export function getCompanyIconName(company: string): string {
  // Function to return an emoji/icon representation of the company
  const companyIcons: Record<string, string> = {
    "Mercari": "🇯🇵 メルカリ",
    "Rakuten Group": "🇯🇵 楽天",
    "Rakuten Cloud": "🇯🇵 楽天クラウド",
    "Rakuten Mobile": "🇯🇵 楽天モバイル",
    "LINE": "🇯🇵 LINE",
    "CyberAgent": "🇯🇵 サイバーエージェント",
    "Yahoo Japan": "🇯🇵 ヤフージャパン",
    "NTT DATA": "🇯🇵 NTTデータ",
    "Rakuten AI Edge": "🇯🇵 楽天AIエッジ",
    "Spotify": "🎧",
    "DBS Bank": "🏦",
    "Netflix": "📺",
    "Capital One": "💳",
    "Etsy": "🛍️",
    "Google Chrome team": "🌐",
    "HSBC": "🏦",
    "Airbnb": "🏠",
    "LinkedIn": "💼",
    "Atlassian": "⚙️",
    "Adobe": "🎨",
    "Uber": "🚗"
  };
  
  return companyIcons[company] || company;
}

/**
 * カテゴリIDから詳細ベンチマークデータを取得する
 * @param {string} categoryId - カテゴリID
 * @param {Record<string, string>} categoryIdToNameMap - カテゴリIDから名前へのマッピング
 * @returns {CategoryBenchmarkData | undefined} - ベンチマークデータ
 */
export function getBenchmarkByCategory(
  categoryId: string, 
  categoryIdToNameMap: Record<string, string>
): CategoryBenchmarkData | undefined {
  // First try to find a direct match by categoryId
  const directMatch = categoryBenchmarks.find(benchmark => benchmark.categoryId === categoryId);
  if (directMatch) return directMatch;
  
  // Fall back to the original name-based matching if needed
  const categoryName = categoryIdToNameMap[categoryId];
  if (!categoryName) return undefined;
  
  return categoryBenchmarks.find(
    benchmark => benchmark.category.toLowerCase() === categoryName.toLowerCase()
  );
}

/**
 * @function getCategoryBenchmarkById
 * @description カテゴリIDに基づいてベンチマークデータを取得する
 * @param {string} categoryId - カテゴリID
 * @returns {CategoryBenchmarkData | undefined} - ベンチマークデータ
 */
export function getCategoryBenchmarkById(categoryId: string): CategoryBenchmarkData | undefined {
  return categoryBenchmarks.find(benchmark => benchmark.categoryId === categoryId);
}

/**
 * @function getAllCategoryBenchmarks
 * @description すべてのカテゴリベンチマークデータを取得する
 * @returns {CategoryBenchmarkData[]} - すべてのベンチマークデータ
 */
export function getAllCategoryBenchmarks(): CategoryBenchmarkData[] {
  return [...categoryBenchmarks];
}

/**
 * @function getBenchmarkDataForDisplay
 * @description 表示用にベンチマークデータを変換する
 * @param {CategoryBenchmarkData} benchmark - ベンチマークデータ
 * @param {number} [yourScore] - ユーザーのスコア（オプション）
 * @returns {Object} 表示用のデータ
 */
export function getBenchmarkDataForDisplay(benchmark: CategoryBenchmarkData, yourScore?: number) {
  const displayData = {
    id: benchmark.categoryId,
    title: benchmark.category,
    icon: benchmark.icon,
    description: benchmark.description,
    leader: benchmark.leader,
    median: benchmark.median,
    japanLeader: benchmark.japanLeader,
    japanLeaderIcon: getCompanyIconName(benchmark.japanLeader),
    globalLeader: benchmark.globalLeader,
    globalLeaderIcon: getCompanyIconName(benchmark.globalLeader),
    keyInsight: benchmark.keyInsight
  };

  // スコアが提供されている場合は、ギャップ分析データを追加
  if (yourScore !== undefined) {
    const gap = benchmark.leader - yourScore;
    const gapPercentage = parseFloat(((gap / benchmark.leader) * 100).toFixed(1));
    
    return {
      ...displayData,
      yourScore,
      gap,
      gapPercentage
    };
  }

  return displayData;
}

/**
 * @function calculateOverallBenchmarks
 * @description カテゴリベンチマークデータから全体的な業界ベンチマークを計算する
 * @param {CategoryScore[]} [categoryScores] - カテゴリスコア（オプション、重み付けに使用）
 * @returns {Object} 全体的なベンチマーク値
 */
export function calculateOverallBenchmarks(categoryScores?: any[]): {
  median: number;
  leader: number;
} {
  if (!categoryBenchmarks.length) {
    return { median: 55, leader: 80 }; // Fallback values
  }

  // If category scores are provided, use them for weighted calculation
  if (categoryScores && categoryScores.length > 0) {
    const validScores = categoryScores.filter(score => score.score >= 0);
    
    if (validScores.length > 0) {
      let totalMedian = 0;
      let totalLeader = 0;
      let count = 0;

      validScores.forEach(categoryScore => {
        const benchmark = getCategoryBenchmarkById(categoryScore.categoryId);
        if (benchmark) {
          totalMedian += benchmark.median;
          totalLeader += benchmark.leader;
          count++;
        }
      });

      if (count > 0) {
        return {
          median: Math.round(totalMedian / count),
          leader: Math.round(totalLeader / count)
        };
      }
    }
  }

  // Default calculation: average of all category benchmarks
  const totalMedian = categoryBenchmarks.reduce((sum, benchmark) => sum + benchmark.median, 0);
  const totalLeader = categoryBenchmarks.reduce((sum, benchmark) => sum + benchmark.leader, 0);
  
  return {
    median: Math.round(totalMedian / categoryBenchmarks.length),
    leader: Math.round(totalLeader / categoryBenchmarks.length)
  };
}