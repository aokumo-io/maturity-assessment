/**
 * AI/ML統合質問モジュール
 *
 * AI/MLソリューションのクラウドネイティブ環境への統合に関する質問を定義するモジュールです。
 * AI/MLモデルのデプロイ、MLOps、モデルモニタリングなどの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const aiMlIntegrationQuestions: AssessmentQuestion[] = [
  // Base Questions (Always shown first)
  {
    id: "aiml_1",
    category: "ai_ml_integration",
    text: {
      en: "How would you describe your organization's AI/ML strategy?",
      ja: "組織のAI/ML戦略をどのように表現しますか？",
    },
    weight: 1,
    maturityImportance: "high",
    maturityLevel: "beginner",
    assessmentType: "comprehensive", // Visible in all assessment types
    baseQuestion: true, // Always shown first
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No formal AI/ML strategy",
          ja: "正式なAI/ML戦略がない",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic AI/ML initiatives without clear alignment to business goals",
          ja: "ビジネス目標との明確な整合性のない基本的なAI/MLイニシアチブ",
        },
      },
      {
        value: 66,
        label: {
          en: "Defined AI/ML strategy with some cloud integration and business alignment",
          ja: "クラウド統合とビジネス整合性を持つ明確なAI/ML戦略",
        },
      },
      {
        value: 100,
        label: {
          en: "Comprehensive AI/ML strategy fully integrated with cloud native and business goals",
          ja: "クラウドネイティブとビジネス目標に完全に統合された包括的なAI/ML戦略",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "An AI/ML strategy aligns machine learning initiatives with business goals and outlines implementation approaches in cloud environments.",
        links: [
          {
            text: "AI Strategy Overview",
            url: "https://cloud.google.com/transform/how-to-build-an-effective-ai-strategy",
          },
          {
            text: "AWS ML Best Practices",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/best-practices.html",
          },
        ],
      },
      ja: {
        summary:
          "AI/ML戦略は、機械学習の取り組みをビジネス目標と整合させ、クラウド環境での実装アプローチを概説します。",
        links: [
          {
            text: "AI戦略の概要",
            url: "https://cloud.google.com/transform/how-to-build-an-effective-ai-strategy",
          },
          {
            text: "AWS MLベストプラクティス",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/best-practices.html",
          },
        ],
      },
    },
  },
  {
    id: "aiml_2",
    category: "ai_ml_integration",
    text: {
      en: "How mature is your ML development lifecycle?",
      ja: "ML開発ライフサイクルの成熟度はどの程度ですか？",
    },
    weight: 1,
    maturityImportance: "high",
    maturityLevel: "beginner",
    assessmentType: "comprehensive", // Visible in all assessment types
    baseQuestion: true, // Always shown first
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No formal ML development process",
          ja: "正式なML開発プロセスがない",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic ML development with manual steps and minimal versioning",
          ja: "手動のステップと最小限のバージョン管理による基本的なML開発",
        },
      },
      {
        value: 66,
        label: {
          en: "Structured ML lifecycle with version control and some automation",
          ja: "バージョン管理と一部の自動化を備えた構造化されたMLライフサイクル",
        },
      },
      {
        value: 100,
        label: {
          en: "Comprehensive MLOps with automated pipelines and governance",
          ja: "自動化されたパイプラインとガバナンスを備えた包括的なMLOps",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "The ML development lifecycle encompasses data preparation, model training, evaluation, deployment, and monitoring phases in a structured workflow.",
        links: [
          {
            text: "ML Lifecycle Overview",
            url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
          },
          {
            text: "ML Development Workflow",
            url: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-ml-pipelines",
          },
        ],
      },
      ja: {
        summary:
          "ML開発ライフサイクルは、構造化されたワークフローでのデータ準備、モデルトレーニング、評価、デプロイメント、モニタリングフェーズを包含します。",
        links: [
          {
            text: "MLライフサイクルの概要",
            url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
          },
          {
            text: "ML開発ワークフロー",
            url: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-ml-pipelines",
          },
        ],
      },
    },
  },
  {
    id: "aiml_3",
    category: "ai_ml_integration",
    text: {
      en: "How do you manage infrastructure for AI/ML workloads?",
      ja: "AI/MLワークロードのインフラストラクチャをどのように管理していますか？",
    },
    weight: 1,
    maturityImportance: "medium",
    maturityLevel: "beginner",
    assessmentType: "comprehensive", // Visible in all assessment types
    baseQuestion: true, // Always shown first
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "Manual provisioning with no specialized ML infrastructure",
          ja: "特殊なMLインフラストラクチャのない手動プロビジョニング",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic ML-specific resources with manual scaling",
          ja: "手動スケーリングを伴う基本的なML専用リソース",
        },
      },
      {
        value: 66,
        label: {
          en: "Infrastructure-as-Code for ML environments with some auto-scaling",
          ja: "一部の自動スケーリングを備えたML環境のためのInfrastructure-as-Code",
        },
      },
      {
        value: 100,
        label: {
          en: "Fully automated elastic infrastructure optimized for ML workloads",
          ja: "MLワークロード向けに最適化された完全自動化された弾力的インフラストラクチャ",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "AI/ML infrastructure encompasses specialized computing resources like GPUs/TPUs, scalable storage, and networking optimized for machine learning workloads.",
        links: [
          {
            text: "ML Infrastructure Fundamentals",
            url: "https://cloud.google.com/ai-infrastructure",
          },
          {
            text: "AWS ML Infrastructure",
            url: "https://aws.amazon.com/blogs/architecture/field-notes-choosing-the-right-instance-type-for-machine-learning-workloads/",
          },
        ],
      },
      ja: {
        summary:
          "AI/MLインフラストラクチャは、GPU/TPUなどの特殊なコンピューティングリソース、スケーラブルなストレージ、機械学習ワークロード向けに最適化されたネットワークを包含します。",
        links: [
          {
            text: "MLインフラストラクチャの基礎",
            url: "https://cloud.google.com/ai-infrastructure",
          },
          {
            text: "AWS MLインフラストラクチャ",
            url: "https://aws.amazon.com/blogs/architecture/field-notes-choosing-the-right-instance-type-for-machine-learning-workloads/",
          },
        ],
      },
    },
  },
  {
    id: "aiml_4",
    category: "ai_ml_integration",
    text: {
      en: "How do you deploy and serve ML models?",
      ja: "MLモデルをどのようにデプロイして提供していますか？",
    },
    weight: 1,
    maturityImportance: "high",
    maturityLevel: "beginner",
    assessmentType: "comprehensive", // Visible in all assessment types
    baseQuestion: true, // Always shown first
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "Manual deployment with no standardized serving approach",
          ja: "標準化された提供アプローチのない手動デプロイメント",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic containerized model deployment with manual scaling",
          ja: "手動スケーリングを伴う基本的なコンテナ化モデルデプロイメント",
        },
      },
      {
        value: 66,
        label: {
          en: "Automated deployment pipelines with cloud-native serving options",
          ja: "クラウドネイティブな提供オプションを備えた自動化されたデプロイメントパイプライン",
        },
      },
      {
        value: 100,
        label: {
          en: "Fully integrated deployment with canary releases, A/B testing, and auto-scaling",
          ja: "カナリアリリース、A/Bテスト、自動スケーリングを備えた完全統合されたデプロイメント",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "ML model deployment involves packaging models for production, serving predictions through APIs, and managing infrastructure to ensure performance and reliability.",
        links: [
          {
            text: "ML Model Deployment Guide",
            url: "https://cloud.google.com/vertex-ai/docs/predictions/getting-predictions",
          },
          {
            text: "Model Serving Best Practices",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-deployment.html",
          },
        ],
      },
      ja: {
        summary:
          "MLモデルのデプロイメントは、本番用のモデルパッケージング、APIを通じた予測の提供、パフォーマンスと信頼性を確保するためのインフラストラクチャ管理を含みます。",
        links: [
          {
            text: "MLモデルデプロイメントガイド",
            url: "https://cloud.google.com/vertex-ai/docs/predictions/getting-predictions",
          },
          {
            text: "モデル提供のベストプラクティス",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-deployment.html",
          },
        ],
      },
    },
  },
  // Intermediate Questions (Shown if Base Question Scores ≥ 33)
  {
    id: "aiml_5",
    category: "ai_ml_integration",
    text: {
      en: "How mature are your data pipelines for AI/ML workloads?",
      ja: "AI/MLワークロード用のデータパイプラインの成熟度はどの程度ですか？",
    },
    weight: 1,
    maturityImportance: "medium",
    maturityLevel: "intermediate",
    assessmentType: "comprehensive", // Only visible in standard and comprehensive
    dependencies: [{ questionId: "aiml_2", minValue: 33 }],
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "Manual data preparation and processing",
          ja: "手動のデータ準備と処理",
        },
      },
      {
        value: 33,
        label: {
          en: "Semi-automated data pipelines with basic validation",
          ja: "基本的な検証を備えた半自動化データパイプライン",
        },
      },
      {
        value: 66,
        label: {
          en: "Automated data pipelines with quality checks and monitoring",
          ja: "品質チェックとモニタリングを備えた自動化データパイプライン",
        },
      },
      {
        value: 100,
        label: {
          en: "Fully orchestrated data pipelines with quality enforcement and lineage tracking",
          ja: "品質強制とリネージトラッキングを備えた完全にオーケストレーションされたデータパイプライン",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "Data pipelines for AI/ML automate the collection, transformation, and movement of data to support machine learning processes.",
        links: [
          {
            text: "ML Data Pipeline Design",
            url: "https://cloud.google.com/blog/products/ai-machine-learning/pre-processing-tensorflow-pipelines-tftransform-google-cloud",
          },
          {
            text: "Data Engineering for ML",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/data-wrangler.html",
          },
        ],
      },
      ja: {
        summary:
          "AI/ML用のデータパイプラインは、機械学習プロセスをサポートするためのデータの収集、変換、移動を自動化します。",
        links: [
          {
            text: "MLデータパイプライン設計",
            url: "https://cloud.google.com/blog/products/ai-machine-learning/pre-processing-tensorflow-pipelines-tftransform-google-cloud",
          },
          {
            text: "ML向けデータエンジニアリング",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/data-wrangler.html",
          },
        ],
      },
    },
  },
  {
    id: "aiml_6",
    category: "ai_ml_integration",
    text: {
      en: "How do you monitor ML models in production?",
      ja: "本番環境のMLモデルをどのようにモニタリングしていますか？",
    },
    weight: 1,
    maturityImportance: "medium",
    maturityLevel: "intermediate",
    assessmentType: "comprehensive", // Only visible in standard and comprehensive
    dependencies: [{ questionId: "aiml_4", minValue: 33 }],
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No formal monitoring of deployed models",
          ja: "デプロイされたモデルの正式なモニタリングなし",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic operational metrics with manual checks",
          ja: "手動チェックを伴う基本的な運用メトリクス",
        },
      },
      {
        value: 66,
        label: {
          en: "Automated performance monitoring with alerts and dashboards",
          ja: "アラートとダッシュボードを備えた自動パフォーマンスモニタリング",
        },
      },
      {
        value: 100,
        label: {
          en: "Comprehensive monitoring including drift detection, explainability, and automated retraining triggers",
          ja: "ドリフト検出、説明可能性、自動再トレーニングトリガーを含む包括的なモニタリング",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "ML model monitoring involves tracking performance, data drift, and operational metrics to ensure models remain effective in production.",
        links: [
          {
            text: "ML Monitoring Best Practices",
            url: "https://cloud.google.com/vertex-ai/docs/model-monitoring/overview",
          },
          {
            text: "Model Performance Monitoring",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor.html",
          },
        ],
      },
      ja: {
        summary:
          "MLモデルのモニタリングには、モデルが本番環境で効果的であり続けることを確保するためのパフォーマンス、データドリフト、運用メトリクスの追跡が含まれます。",
        links: [
          {
            text: "MLモニタリングのベストプラクティス",
            url: "https://cloud.google.com/vertex-ai/docs/model-monitoring/overview",
          },
          {
            text: "モデルパフォーマンスモニタリング",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor.html",
          },
        ],
      },
    },
  },
  {
    id: "aiml_7",
    category: "ai_ml_integration",
    text: {
      en: "How do you manage versioning for ML models and datasets?",
      ja: "MLモデルとデータセットのバージョン管理をどのように行っていますか？",
    },
    weight: 1,
    maturityImportance: "medium",
    maturityLevel: "intermediate",
    assessmentType: "comprehensive", // Only visible in standard and comprehensive
    dependencies: [{ questionId: "aiml_2", minValue: 33 }],
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No formal versioning for models or datasets",
          ja: "モデルやデータセットの正式なバージョン管理なし",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic manual versioning with naming conventions",
          ja: "命名規則を使用した基本的な手動バージョン管理",
        },
      },
      {
        value: 66,
        label: {
          en: "Version control systems with metadata tracking",
          ja: "メタデータ追跡を備えたバージョン管理システム",
        },
      },
      {
        value: 100,
        label: {
          en: "Comprehensive model and data versioning with lineage tracking and reproducibility guarantees",
          ja: "リネージ追跡と再現性保証を備えた包括的なモデルとデータのバージョン管理",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "ML model and dataset versioning ensures reproducibility, traceability, and compliance by tracking changes to models and the data used to train them.",
        links: [
          {
            text: "ML Versioning Guide",
            url: "https://neptune.ai/blog/ml-platform-guide",
          },
          {
            text: "Model Registry Best Practices",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/model-registry.html",
          },
        ],
      },
      ja: {
        summary:
          "MLモデルとデータセットのバージョン管理は、モデルとそれらのトレーニングに使用されるデータへの変更を追跡することで、再現性、追跡可能性、コンプライアンスを確保します。",
        links: [
          {
            text: "MLバージョン管理ガイド",
            url: "https://neptune.ai/blog/ml-platform-guide",
          },
          {
            text: "モデルレジストリのベストプラクティス",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/model-registry.html",
          },
        ],
      },
    },
  },
  {
    id: "aiml_8",
    category: "ai_ml_integration",
    text: {
      en: "How do you address security and compliance for AI/ML systems?",
      ja: "AI/MLシステムのセキュリティとコンプライアンスにどのように対処していますか？",
    },
    weight: 1,
    maturityImportance: "high",
    maturityLevel: "intermediate",
    assessmentType: "comprehensive", // Only visible in standard and comprehensive
    dependencies: [{ questionId: "aiml_1", minValue: 33 }],
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No specialized security measures for AI/ML workflows",
          ja: "AI/MLワークフロー向けの特殊なセキュリティ対策なし",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic security controls and some compliance documentation",
          ja: "基本的なセキュリティコントロールといくつかのコンプライアンス文書",
        },
      },
      {
        value: 66,
        label: {
          en: "Comprehensive security framework with regular auditing",
          ja: "定期的な監査を伴う包括的なセキュリティフレームワーク",
        },
      },
      {
        value: 100,
        label: {
          en: "Complete security and governance framework with privacy-preserving techniques and regulatory compliance",
          ja: "プライバシー保護技術と規制遵守を備えた完全なセキュリティとガバナンスフレームワーク",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "Security and compliance for AI/ML addresses data protection, model security, privacy concerns, and regulatory requirements specific to machine learning systems.",
        links: [
          {
            text: "ML Security Framework",
            url: "https://cloud.google.com/architecture/framework/perspectives/ai-ml/security",
          },
          {
            text: "AI Compliance Guide",
            url: "https://aws.amazon.com/blogs/machine-learning/responsible-ai-governance/",
          },
        ],
      },
      ja: {
        summary:
          "AI/MLのセキュリティとコンプライアンスは、データ保護、モデルセキュリティ、プライバシー問題、機械学習システム固有の規制要件に対処します。",
        links: [
          {
            text: "MLセキュリティフレームワーク",
            url: "https://cloud.google.com/architecture/framework/perspectives/ai-ml/security",
          },
          {
            text: "AIコンプライアンスガイド",
            url: "https://aws.amazon.com/blogs/machine-learning/responsible-ai-governance/",
          },
        ],
      },
    },
  },
  // Advanced Questions (Shown if Previous Question Scores ≥ 66)
  {
    id: "aiml_9",
    category: "ai_ml_integration",
    text: {
      en: "How advanced are your MLOps practices?",
      ja: "MLOpsの実践はどの程度進んでいますか？",
    },
    weight: 1,
    maturityImportance: "high",
    maturityLevel: "advanced",
    assessmentType: "comprehensive", // Only visible in comprehensive
    dependencies: [{ questionId: "aiml_2", minValue: 66 }],
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No formal MLOps practices",
          ja: "正式なMLOpsの実践なし",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic CI/CD pipelines for ML with some automation",
          ja: "いくつかの自動化を備えたML向けの基本的なCI/CDパイプライン",
        },
      },
      {
        value: 66,
        label: {
          en: "Mature MLOps with automated testing, deployment, and monitoring",
          ja: "自動テスト、デプロイメント、モニタリングを備えた成熟したMLOps",
        },
      },
      {
        value: 100,
        label: {
          en: "Fully mature MLOps with continuous training, experiment tracking, and governance",
          ja: "継続的トレーニング、実験追跡、ガバナンスを備えた完全に成熟したMLOps",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "MLOps applies DevOps principles to machine learning systems, automating the ML lifecycle from data preparation to model deployment and monitoring.",
        links: [
          {
            text: "MLOps Maturity Model",
            url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
          },
          {
            text: "MLOps Best Practices",
            url: "https://ml-ops.org/content/mlops-principles",
          },
        ],
      },
      ja: {
        summary:
          "MLOpsはDevOpsの原則を機械学習システムに適用し、データ準備からモデルデプロイとモニタリングまでのMLライフサイクルを自動化します。",
        links: [
          {
            text: "MLOps成熟度モデル",
            url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
          },
          {
            text: "MLOpsベストプラクティス",
            url: "https://ml-ops.org/content/mlops-principles",
          },
        ],
      },
    },
  },
  {
    id: "aiml_10",
    category: "ai_ml_integration",
    text: {
      en: "How do you utilize feature stores in your ML infrastructure?",
      ja: "MLインフラストラクチャでフィーチャーストアをどのように活用していますか？",
    },
    weight: 1,
    maturityImportance: "medium",
    maturityLevel: "advanced",
    assessmentType: "optional", // Only visible in comprehensive
    dependencies: [{ questionId: "aiml_5", minValue: 66 }],
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No feature store capability",
          ja: "フィーチャーストア機能なし",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic feature repositories with limited reusability",
          ja: "限られた再利用性を持つ基本的なフィーチャリポジトリ",
        },
      },
      {
        value: 66,
        label: {
          en: "Dedicated feature store with metadata and sharing capabilities",
          ja: "メタデータと共有機能を備えた専用フィーチャーストア",
        },
      },
      {
        value: 100,
        label: {
          en: "Enterprise feature platform with feature serving, sharing, and governance",
          ja: "フィーチャー提供、共有、ガバナンスを備えたエンタープライズフィーチャープラットフォーム",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "Feature stores centralize the storage, management, and serving of ML features, enabling reuse, consistency, and efficiency in machine learning pipelines.",
        links: [
          {
            text: "Feature Store Introduction",
            url: "https://www.tecton.ai/blog/what-is-a-feature-store/",
          },
          {
            text: "Feature Management Best Practices",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/feature-store.html",
          },
        ],
      },
      ja: {
        summary:
          "フィーチャーストアはML特徴量の保存、管理、提供を一元化し、機械学習パイプラインでの再利用、一貫性、効率性を可能にします。",
        links: [
          {
            text: "フィーチャーストア入門",
            url: "https://www.tecton.ai/blog/what-is-a-feature-store/",
          },
          {
            text: "特徴量管理のベストプラクティス",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/feature-store.html",
          },
        ],
      },
    },
  },
  {
    id: "aiml_11",
    category: "ai_ml_integration",
    text: {
      en: "How do you handle distributed training for large ML models?",
      ja: "大規模MLモデルの分散トレーニングをどのように処理していますか？",
    },
    weight: 1,
    maturityImportance: "medium",
    maturityLevel: "advanced",
    assessmentType: "comprehensive", // Only visible in comprehensive
    dependencies: [{ questionId: "aiml_3", minValue: 66 }],
    roleRelevance: {
      executive: "low",
      manager: "low",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No distributed training capabilities",
          ja: "分散トレーニング機能なし",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic parallelization on a single machine",
          ja: "単一マシンでの基本的な並列化",
        },
      },
      {
        value: 66,
        label: {
          en: "Multi-node distributed training with manual configuration",
          ja: "手動設定によるマルチノード分散トレーニング",
        },
      },
      {
        value: 100,
        label: {
          en: "Advanced distributed training with auto-scaling and hybrid cloud capabilities",
          ja: "自動スケーリングとハイブリッドクラウド機能を備えた高度な分散トレーニング",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "Distributed training enables processing large ML models across multiple compute nodes, reducing training time and handling models too large for a single machine.",
        links: [
          {
            text: "Distributed Training Guide",
            url: "https://www.tensorflow.org/guide/distributed_training",
          },
          {
            text: "Scaling ML Training",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training.html",
          },
        ],
      },
      ja: {
        summary:
          "分散トレーニングは、複数のコンピュートノードにわたって大規模MLモデルを処理し、トレーニング時間を短縮し、単一マシンには大きすぎるモデルを扱うことを可能にします。",
        links: [
          {
            text: "分散トレーニングガイド",
            url: "https://www.tensorflow.org/guide/distributed_training",
          },
          {
            text: "MLトレーニングのスケーリング",
            url: "https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-training.html",
          },
        ],
      },
    },
  },
  {
    id: "aiml_12",
    category: "ai_ml_integration",
    text: {
      en: "How do you address responsible AI and ethical considerations?",
      ja: "責任あるAIと倫理的考慮にどのように対処していますか？",
    },
    weight: 1,
    maturityImportance: "high",
    maturityLevel: "advanced",
    assessmentType: "comprehensive", // Only visible in comprehensive
    dependencies: [{ questionId: "aiml_1", minValue: 66 }],
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No formal processes for ethical AI considerations",
          ja: "倫理的AI考慮事項のための正式なプロセスなし",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic awareness of ethical issues with some guidelines",
          ja: "いくつかのガイドラインを持つ倫理的問題の基本的な認識",
        },
      },
      {
        value: 66,
        label: {
          en: "Formal responsible AI framework with fairness testing",
          ja: "公平性テストを伴う正式な責任あるAIフレームワーク",
        },
      },
      {
        value: 100,
        label: {
          en: "Comprehensive ethical AI governance with ongoing monitoring and bias mitigation",
          ja: "継続的なモニタリングとバイアス軽減を伴う包括的な倫理的AIガバナンス",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "Responsible AI encompasses fairness, transparency, privacy, and ethical considerations in machine learning systems to ensure equitable and trustworthy outcomes.",
        links: [
          {
            text: "Responsible AI Framework",
            url: "https://cloud.google.com/blog/products/ai-machine-learning/responsible-ai-practices",
          },
          {
            text: "Ethics in ML Guide",
            url: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-fairness-ml",
          },
        ],
      },
      ja: {
        summary:
          "責任あるAIは、公平で信頼できる結果を確保するために、機械学習システムにおける公平性、透明性、プライバシー、倫理的考慮事項を包含します。",
        links: [
          {
            text: "責任あるAIフレームワーク",
            url: "https://cloud.google.com/blog/products/ai-machine-learning/responsible-ai-practices",
          },
          {
            text: "MLにおける倫理ガイド",
            url: "https://docs.microsoft.com/en-us/azure/machine-learning/concept-fairness-ml",
          },
        ],
      },
    },
  },
  {
    id: "aiml_13",
    category: "ai_ml_integration",
    text: {
      en: "How are you implementing AI automation in your cloud applications?",
      ja: "クラウドアプリケーションでAI自動化をどのように実装していますか？",
    },
    weight: 1,
    maturityImportance: "medium",
    maturityLevel: "advanced",
    assessmentType: "comprehensive", // Only visible in comprehensive
    dependencies: [{ questionId: "aiml_4", minValue: 66 }],
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No AI automation in applications",
          ja: "アプリケーションにAI自動化なし",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic AI-powered features in isolated applications",
          ja: "孤立したアプリケーションにおける基本的なAI駆動機能",
        },
      },
      {
        value: 66,
        label: {
          en: "Integrated AI capabilities across multiple applications",
          ja: "複数のアプリケーションにわたる統合されたAI機能",
        },
      },
      {
        value: 100,
        label: {
          en: "Comprehensive AI platform that enables automation across the entire application portfolio",
          ja: "アプリケーションポートフォリオ全体にわたる自動化を可能にする包括的なAIプラットフォーム",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "AI automation integrates machine learning capabilities into applications to automate decision-making, improve user experiences, and enhance operational efficiency.",
        links: [
          {
            text: "AI Automation Patterns",
            url: "https://cloud.google.com/use-cases/ai-for-developers",
          },
          {
            text: "Intelligent Application Design",
            url: "https://aws.amazon.com/blogs/machine-learning/building-ai-powered-applications/",
          },
        ],
      },
      ja: {
        summary:
          "AI自動化は、意思決定の自動化、ユーザー体験の改善、運用効率の向上のために、機械学習機能をアプリケーションに統合します。",
        links: [
          {
            text: "AI自動化パターン",
            url: "https://cloud.google.com/use-cases/ai-for-developers",
          },
          {
            text: "インテリジェントアプリケーション設計",
            url: "https://aws.amazon.com/blogs/machine-learning/building-ai-powered-applications/",
          },
        ],
      },
    },
  },
  {
    id: "aiml_14",
    category: "ai_ml_integration",
    text: {
      en: "How do you optimize costs for AI/ML workloads?",
      ja: "AI/MLワークロードのコストをどのように最適化していますか？",
    },
    weight: 1,
    maturityImportance: "medium",
    maturityLevel: "advanced",
    assessmentType: "optional", // Only visible in comprehensive
    dependencies: [{ questionId: "aiml_3", minValue: 66 }],
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No specific cost optimization for ML workloads",
          ja: "MLワークロードに特化したコスト最適化なし",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic resource management with some cost tracking",
          ja: "いくつかのコスト追跡を伴う基本的なリソース管理",
        },
      },
      {
        value: 66,
        label: {
          en: "Systematic cost optimization with resource scheduling and rightsizing",
          ja: "リソーススケジューリングと適切なサイジングを伴う体系的なコスト最適化",
        },
      },
      {
        value: 100,
        label: {
          en: "Comprehensive ML-specific cost management with automated optimization",
          ja: "自動最適化を伴う包括的なML特化型コスト管理",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "Cost optimization for AI/ML involves managing compute resources, storage, and model deployment efficiently to reduce expenses while maintaining performance.",
        links: [
          {
            text: "ML Cost Optimization Guide",
            url: "https://cloud.google.com/vertex-ai/generative-ai/docs/image/responsible-ai-imagen",
          },
          {
            text: "AI Cost Management",
            url: "https://aws.amazon.com/blogs/machine-learning/optimizing-costs-for-machine-learning-with-amazon-sagemaker/",
          },
        ],
      },
      ja: {
        summary:
          "AI/MLのコスト最適化には、パフォーマンスを維持しながら費用を削減するための、コンピュートリソース、ストレージ、モデルデプロイメントの効率的な管理が含まれます。",
        links: [
          {
            text: "MLコスト最適化ガイド",
            url: "https://cloud.google.com/vertex-ai/generative-ai/docs/image/responsible-ai-imagen",
          },
          {
            text: "AIコスト管理",
            url: "https://aws.amazon.com/blogs/machine-learning/optimizing-costs-for-machine-learning-with-amazon-sagemaker/",
          },
        ],
      },
    },
  },
  {
    id: "aiml_15",
    category: "ai_ml_integration",
    text: {
      en: "How mature is your AI/ML talent development strategy?",
      ja: "AI/ML人材開発戦略の成熟度はどの程度ですか？",
    },
    weight: 1,
    maturityImportance: "high",
    maturityLevel: "advanced",
    assessmentType: "optional", // Only visible in comprehensive
    dependencies: [{ questionId: "aiml_1", minValue: 66 }],
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    options: [
      {
        value: 0,
        label: {
          en: "No specific AI/ML talent development strategy",
          ja: "特定のAI/ML人材開発戦略なし",
        },
      },
      {
        value: 33,
        label: {
          en: "Basic training opportunities for existing staff",
          ja: "既存スタッフのための基本的なトレーニング機会",
        },
      },
      {
        value: 66,
        label: {
          en: "Formal AI/ML learning paths and role definitions",
          ja: "正式なAI/ML学習パスと役割定義",
        },
      },
      {
        value: 100,
        label: {
          en: "Comprehensive AI/ML talent strategy with training, hiring, and knowledge sharing",
          ja: "トレーニング、採用、知識共有を含む包括的なAI/ML人材戦略",
        },
      },
    ],
    hasKnowledgeResource: true,
    knowledge: {
      en: {
        summary:
          "AI/ML talent development focuses on building skills, roles, and capabilities within an organization to create, deploy, and manage machine learning systems effectively.",
        links: [
          {
            text: "Building ML Teams",
            url: "https://cloud.google.com/blog/products/ai-machine-learning/building-the-ai-ml-team",
          },
          {
            text: "AI Skills Framework",
            url: "https://aws.amazon.com/machine-learning/mlu/",
          },
        ],
      },
      ja: {
        summary:
          "AI/ML人材開発は、機械学習システムを効果的に作成、展開、管理するために、組織内でスキル、役割、能力を構築することに焦点を当てています。",
        links: [
          {
            text: "MLチームの構築",
            url: "https://cloud.google.com/blog/products/ai-machine-learning/building-the-ai-ml-team",
          },
          {
            text: "AIスキルフレームワーク",
            url: "https://aws.amazon.com/machine-learning/mlu/",
          },
        ],
      },
    },
  },
];
