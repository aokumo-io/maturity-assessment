import { CategoryId } from "../rules/issue-rule-model";

/**
 * ストレッチゴール - すでに高いマチュリティレベルを持つカテゴリーのための追加の考慮事項
 * Stretch goals - additional considerations for categories that already have high maturity levels
 */
export interface StretchGoal {
  en: string[];
  ja: string[];
}

/**
 * 各カテゴリーのストレッチゴールマップ
 * Map of stretch goals for each category
 */
export const considerationMap: Record<string, StretchGoal> = {
  // Foundation & Culture
  'foundations_culture': {
    en: [
      'Hosting a company-wide hack day',
      'Contributing back to CNCF projects',
      'Building your internal CCoE playbook',
    ],
    ja: [
      '社内全体のハックデーを開催する',
      'CNCFプロジェクトへの貢献',
      '社内クラウドセンターオブエクセレンスのプレイブックを構築',
    ]
  },
  
  // Business Value & Strategy
  'business_value_strategy': {
    en: [
      'Developing advanced value stream metrics',
      'Creating industry-specific benchmarks', 
      'Building an innovation investment framework',
    ],
    ja: [
      '高度なバリューストリームメトリクスの開発',
      '業界特有のベンチマーク作成',
      'イノベーション投資フレームワークの構築',
    ]
  },
  
  // Application Architecture
  'application_architecture': {
    en: [
      'Implement service mesh for advanced traffic management',
      'Create a framework for measuring architectural quality',
      'Establish a microservices maturity model',
    ],
    ja: [
      '高度なトラフィック管理のためのサービスメッシュの実装',
      'アーキテクチャ品質測定のためのフレームワーク作成',
      'マイクロサービス成熟度モデルの確立',
    ]
  },
  
  // App Migration & Modernization
  'app_migration_modernization': {
    en: [
      'Creating a custom cloud-native pattern library',
      'Building a modernization factory process',
      'Developing automated migration assessment tools',
    ],
    ja: [
      'カスタムクラウドネイティブパターンライブラリの作成',
      'モダナイゼーションファクトリープロセスの構築',
      '自動化された移行評価ツールの開発',
    ]
  },
  
  // Container Infrastructure
  'container_infrastructure': {
    en: [
      'Building custom Kubernetes operators',
      'Implementing advanced multi-cluster federation',
      'Creating custom schedulers for specialized workloads',
    ],
    ja: [
      'カスタムKubernetesオペレーターの構築',
      '高度なマルチクラスターフェデレーションの実装',
      '特殊なワークロード向けのカスタムスケジューラの作成',
    ]
  },
  
  // CI/CD Practices
  'cicd_practices': {
    en: [
      'Implementing progressive delivery practices',
      'Building AI-assisted testing strategies and automated quality gates',
      'Creating custom CI/CD metrics dashboards',
    ],
    ja: [
      'プログレッシブデリバリープラクティスの実装',
      'AI支援のテスト戦略と自動品質ゲートの構築',
      'カスタムCI/CDメトリクスダッシュボードの作成',
    ]
  },
  
  // DORA Metrics
  'dora_metrics': {
    en: [
      'Creating team-specific DORA metric goals',
      'Building correlation models with business outcomes',
      'Implementing SPACE framework metrics alongside DORA',
    ],
    ja: [
      'チーム固有のDORAメトリック目標の設定',
      'ビジネス成果との相関モデルの構築',
      'DORAメトリクスと併せてSPACEフレームワークメトリクスの導入',
    ]
  },
  
  // Security & Compliance
  'security_compliance': {
    en: [
      'Building a secure-by-design patterns library',
      'Implementing GitOps for security policy management',
      'Creating integrated threat modeling processes',
    ],
    ja: [
      'セキュア・バイ・デザインパターンライブラリの構築',
      'セキュリティポリシー管理のためのGitOpsの実装',
      '統合された脅威モデリングプロセスの作成',
    ]
  },
  
  // Infrastructure & Platform
  'infrastructure_platform': {
    en: [
      'Creating a site reliability engineering playbook',
      'Building a self-service developer portal with automated resource provisioning',
      'Implementing infrastructure as code generators',
    ],
    ja: [
      'サイト信頼性エンジニアリングプレイブックの作成',
      '自動リソースプロビジョニングを備えたセルフサービス開発者ポータルの構築',
      'インフラストラクチャアズコードジェネレータの実装',
    ]
  },
  
  // Data Management
  'data_management': {
    en: [
      'Implementing a data mesh architecture',
      'Building real-time data streaming pipelines',
      'Creating data quality governance frameworks',
    ],
    ja: [
      'データメッシュアーキテクチャの実装',
      'リアルタイムデータストリーミングパイプラインの構築',
      'データ品質ガバナンスフレームワークの作成',
    ]
  },
  
  // Observability
  'observability': {
    en: [
      'Building business-aligned observability metrics',
      'Creating custom SLO/SLI frameworks',
      'Implementing AIOps for anomaly detection',
    ],
    ja: [
      'ビジネスに連携した可観測性メトリクスの構築',
      'カスタムSLO/SLIフレームワークの作成',
      '異常検知のためのAIOpsの実装',
    ]
  },
  
  // FinOps & Cost Management
  'finops_cost_management': {
    en: [
      'Building predictive cost optimization models',
      'Creating customized FinOps reporting by business unit',
      'Implementing real-time spending controls',
    ],
    ja: [
      '予測コスト最適化モデルの構築',
      '事業部門別のカスタマイズされたFinOpsレポートの作成',
      'リアルタイム支出管理の実装',
    ]
  },
  
  // Operations & Resilience
  'operations_resilience': {
    en: [
      'Creating chaos engineering frameworks',
      'Building resilience modeling simulations',
      'Implementing platform-level failover automation',
    ],
    ja: [
      'カオスエンジニアリングフレームワークの作成',
      'レジリエンスモデリングシミュレーションの構築',
      'プラットフォームレベルのフェイルオーバー自動化の実装',
    ]
  },
  
  // Multi-cloud & Hybrid Governance
  'multicloud_hybrid_governance': {
    en: [
      'Implementing dynamic workload placement optimization',
      'Building cross-cloud service catalogs',
      'Implementing cloud-agnostic policy frameworks',
    ],
    ja: [
      '動的ワークロード配置の最適化の実装',
      'クロスクラウドサービスカタログの構築',
      'クラウドに依存しないポリシーフレームワークの実装',
    ]
  },
  
  // AI/ML Integration
  'ai_ml_integration': {
    en: [
      'Building MLOps deployment pipelines',
      'Creating model governance frameworks',
      'Implementing federated learning systems',
    ],
    ja: [
      'MLOpsデプロイメントパイプラインの構築',
      'モデルガバナンスフレームワークの作成',
      '連合学習システムの実装',
    ]
  },
}; 