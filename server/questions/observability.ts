/**
 * オブザーバビリティ質問モジュール
 *
 * クラウドネイティブシステムのオブザーバビリティに関する質問を定義するモジュールです。
 * モニタリング、ロギング、トレーシング、アラート管理などの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const observabilityQuestions: AssessmentQuestion[] = [
  {
    id: "obs_1",
    category: "observability",
    text: {
      ja: "アプリケーションとそれを支えるインフラストラクチャの状態を監視し(モニタリング)、発生したイベントを記録し(ロギング)、システム内のリクエストの流れを追跡する(トレーシング)ためのツールや仕組みが導入されており、システムの動作状況を理解し問題を分析するための可観測性(Observability)が確保されていますか？",
      en: "Do you have monitoring, logging, and tracing in place so that your teams can observe system behaviour and analyse issues across applications and infrastructure?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "可観測性はモニタリング・ロギング・トレーシングの3本柱で構成され、外部シグナルから内部状態を把握する能力を提供します。これにより問題の迅速検出と診断が可能になります。",
        links: [
          {
            text: "Observability Basics",
            url: "https://opentelemetry.io/docs/concepts/observability-primer/",
          },
          {
            text: "Three Pillars of Observability",
            url: "https://www.dynatrace.com/news/blog/what-is-observability-2/",
          },
        ],
      },
      en: {
        summary:
          "Observability rests on three pillars—monitoring, logging, and tracing—allowing teams to infer internal state from external signals and quickly detect or diagnose issues.",
        links: [
          {
            text: "Observability Basics",
            url: "https://opentelemetry.io/docs/concepts/observability-primer/",
          },
          {
            text: "Three Pillars of Observability",
            url: "https://www.dynatrace.com/news/blog/what-is-observability-2/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "基本的なログ収集以外の可観測性ツールは導入されていない",
          en: "No observability tooling beyond basic log collection.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なモニタリングとログ集約が実装されているが、分散トレーシングはなく、アラートは最小限",
          en: "Basic monitoring and log aggregation exist, but no distributed tracing and only minimal alerting.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なモニタリング、ロギング、基本的なトレーシングが実装され、主要メトリクスに対するアラートが設定されている",
          en: "Comprehensive monitoring and logging with basic tracing and alerts on key metrics.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な可観測性が実現され、相関分析可能なモニタリング、ロギング、分散トレーシングが統合され、異常検知や予測分析も活用している",
          en: "Advanced observability with correlated monitoring, logging, distributed tracing, anomaly detection, and predictive analytics.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  {
    id: "obs_2",
    category: "observability",
    text: {
      ja: "クラウドネイティブアプリケーションのモニタリングレベルはどの程度ですか？",
      en: "How mature is your monitoring of cloud-native applications?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドネイティブのモニタリングでは、インフラ、アプリケーション、ビジネスの各メトリクスを多層で収集し、リアルタイムで健全性と性能を把握します。",
        links: [
          {
            text: "Cloud Monitoring",
            url: "https://www.datadoghq.com/ja/",
          },
          {
            text: "Prometheus",
            url: "https://prometheus.io/docs/introduction/overview/",
          },
        ],
      },
      en: {
        summary:
          "Effective monitoring spans infrastructure, application, and business metrics to provide real-time visibility into health and performance.",
        links: [
          {
            text: "Cloud Monitoring",
            url: "https://www.datadoghq.com/monitoring/cloud-monitoring/",
          },
          {
            text: "Prometheus",
            url: "https://prometheus.io/docs/introduction/overview/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "主に基本的なインフラメトリクスのみを収集している",
          en: "Collecting only basic infrastructure metrics.",
        },
      },
      {
        value: 33,
        label: {
          ja: "インフラとアプリケーションメトリクスを収集するが、包括的なカバレッジや高度な分析はない",
          en: "Infra and app metrics collected, but coverage and advanced analytics are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "インフラ、アプリケーション、ビジネスメトリクスを収集・分析する包括的フレームワークがある",
          en: "Comprehensive framework captures and analyses infra, app, and business metrics.",
        },
      },
      {
        value: 100,
        label: {
          ja: "カスタムメトリクス、異常検知、予測分析、自動最適化など高度なモニタリングを実装",
          en: "Advanced monitoring with custom metrics, anomaly detection, predictive analytics, and auto-optimisation.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  {
    id: "obs_3",
    category: "observability",
    text: {
      ja: "アラートとインシデント検出をどのように処理していますか？",
      en: "How do you handle alerting and incident detection?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "適切な閾値設定、ノイズ削減、エスカレーションパスを備えたアラートは、迅速なインシデント対応に不可欠です。",
        links: [
          {
            text: "Alert Management",
            url: "https://grafana.com/docs/grafana/latest/alerting/",
          },
          {
            text: "Incident Detection",
            url: "https://sre.google/sre-book/monitoring-distributed-systems/",
          },
        ],
      },
      en: {
        summary:
          "Well-tuned thresholds, noise reduction, and clear escalation paths are essential for rapid incident response.",
        links: [
          {
            text: "Alert Management",
            url: "https://grafana.com/docs/grafana/latest/alerting/",
          },
          {
            text: "Incident Detection",
            url: "https://sre.google/sre-book/monitoring-distributed-systems/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "アラートは最小限で手動検出に依存",
          en: "Minimal alerts; detection mainly manual.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本アラートはあるが誤検知が多くプロセスが未整備",
          en: "Basic alerts exist but noisy; response process is immature.",
        },
      },
      {
        value: 66,
        label: {
          ja: "閾値調整された包括フレームワークと確立されたインシデント対応",
          en: "Tuned framework with established incident response.",
        },
      },
      {
        value: 100,
        label: {
          ja: "異常検知・コンテキストアラート・自動修復・事後分析を備えた高度システム",
          en: "Advanced system with anomaly detection, context alerts, auto-remediation, and post-mortems.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_4",
    category: "observability",
    text: {
      ja: "環境内でのログ管理はどのように行われていますか？",
      en: "How is log management handled in your environment?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "集中ログ管理は多様なソースのログを統合し検索・分析を容易にします。クラウドネイティブではスケーラビリティが鍵です。",
        links: [
          {
            text: "Log Management",
            url: "https://www.datadoghq.com/ja/",
          },
          {
            text: "Logging Best Practices",
            url: "https://cloud.google.com/logging/docs/audit/best-practices?hl=ja",
          },
        ],
      },
      en: {
        summary:
          "Centralised log management unifies diverse logs for easy search and analysis; scalability is critical in cloud-native setups.",
        links: [
          {
            text: "Log Management",
            url: "https://learn.datadoghq.com/bundles/log-management-fundamentals",
          },
          {
            text: "Logging Best Practices",
            url: "https://cloud.google.com/logging/docs/audit/best-practices",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "ログはローカル保存で集中管理されていない",
          en: "Logs stored locally; no central management.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なログ集約はあるが検索・分析は限定的",
          en: "Basic aggregation exists, but search/analysis limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "集中収集・検索・基本分析を提供",
          en: "Central collection with search and basic analytics.",
        },
      },
      {
        value: 100,
        label: {
          ja: "構造化ロギング、異常検知、ログメトリクス生成など高度機能を活用",
          en: "Advanced features—structured logs, anomaly detection, log-derived metrics—fully utilised.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  /* ───────────────────────────── Intermediate ───────────────────────────── */
  {
    id: "obs_5",
    category: "observability",
    text: {
      ja: "分散トレーシングに対するアプローチはどの程度成熟していますか？",
      en: "How mature is your approach to distributed tracing?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [{ questionId: "obs_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "分散トレーシングはリクエストの流れを可視化し、パフォーマンスボトルネックや障害の根本原因を特定するのに役立ちます。",
        links: [
          {
            text: "Distributed Tracing",
            url: "https://opentelemetry.io/docs/concepts/signals/traces/",
          },
          {
            text: "Jaeger Tracing",
            url: "https://www.jaegertracing.io/docs/1.36/architecture/",
          },
        ],
      },
      en: {
        summary:
          "Distributed tracing visualises request flows, helping pinpoint performance bottlenecks and root causes in microservice systems.",
        links: [
          {
            text: "Distributed Tracing",
            url: "https://opentelemetry.io/docs/concepts/signals/traces/",
          },
          {
            text: "Jaeger Tracing",
            url: "https://www.jaegertracing.io/docs/1.36/architecture/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "トレーシング未実装", en: "No tracing implemented." },
      },
      {
        value: 33,
        label: {
          ja: "一部重要サービスで基本トレーシング",
          en: "Basic tracing on some key services.",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要サービスで標準トレーシングを実装",
          en: "Standard tracing on most key services.",
        },
      },
      {
        value: 100,
        label: {
          ja: "全サービスで包括トレーシングと高度分析",
          en: "End-to-end tracing on all services with advanced analytics.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_6",
    category: "observability",
    text: {
      ja: "サービスレベル目標（SLO）とエラーバジェットをどのように実装していますか？",
      en: "How do you implement Service Level Objectives (SLOs) and error budgets?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "standard",
    dependencies: [{ questionId: "obs_2", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "SLOとエラーバジェットは信頼性とイノベーションのバランスを取る定量的手法であり、リスク管理に役立ちます。",
        links: [
          {
            text: "SLO Implementation",
            url: "https://sre.google/sre-book/service-level-objectives/",
          },
          {
            text: "Error Budgets",
            url: "https://cloud.google.com/blog/products/management-tools/sre-error-budgets-and-maintenance-windows",
          },
        ],
      },
      en: {
        summary:
          "SLOs and error budgets provide a quantitative way to balance reliability and innovation, aiding risk management.",
        links: [
          {
            text: "SLO Implementation",
            url: "https://sre.google/sre-book/service-level-objectives/",
          },
          {
            text: "Error Budgets",
            url: "https://cloud.google.com/blog/products/management-tools/sre-error-budgets-and-maintenance-windows",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "SLO/エラーバジェットなし",
          en: "No SLOs or error budgets.",
        },
      },
      {
        value: 33,
        label: {
          ja: "SLAはあるがSLO計測やエラーバジェット管理なし",
          en: "SLAs exist, but no SLO measurement or error-budget practice.",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要サービスでSLOとエラーバジェットを導入",
          en: "SLOs and error budgets for key services.",
        },
      },
      {
        value: 100,
        label: {
          ja: "全サービスに包括的SLO/エラーバジェットフレームワーク",
          en: "Comprehensive SLO & error-budget framework for all services.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_7",
    category: "observability",
    text: {
      ja: "ダッシュボードと可視化をどのように実装していますか？",
      en: "How do you implement dashboards and visualisations?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "obs_2", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "役割に応じたダッシュボードは複雑なデータを理解しやすく提示し、意思決定を支援します。",
        links: [
          {
            text: "Dashboard Design",
            url: "https://docs.datadoghq.com/ja/dashboards/",
          },
          {
            text: "Data Visualization",
            url: "https://www.datadoghq.com/ja/",
          },
        ],
      },
      en: {
        summary:
          "Role-oriented dashboards turn complex data into actionable insights, aiding decision-making.",
        links: [
          {
            text: "Dashboard Design",
            url: "https://www.datadoghq.com/blog/dash-2024-new-feature-roundup-infrastructure/",
          },
          {
            text: "Data Visualization",
            url: "https://www.datadoghq.com/blog/dashboard-design-patterns/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "標準化ダッシュボードほぼなし",
          en: "Few standardised dashboards.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本ダッシュボードはあるが自動更新や一貫性限定",
          en: "Basic dashboards; limited auto-update or consistency.",
        },
      },
      {
        value: 66,
        label: {
          ja: "役割ベースのリアルタイムダッシュボードを実装",
          en: "Role-based real-time dashboards implemented.",
        },
      },
      {
        value: 100,
        label: {
          ja: "カスタムビュー・予測分析・自動インサイトを備えた高度プラットフォーム",
          en: "Advanced platform with custom views, predictive analytics, and auto-insights.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_8",
    category: "observability",
    text: {
      ja: "集中ログ管理システムを導入し、横断検索・分析で可観測性を確保していますか？",
      en: "Have you deployed a centralised logging system that enables cross-search and analysis to ensure observability?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "obs_4", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "集中ログ管理は全ログを一元収集・検索・分析し、全体状況把握とトラブルシューティングを効率化します。",
        links: [
          {
            text: "Centralized Logging",
            url: "https://www.elastic.co/jp/getting-started/observability/collect-and-analyze-logs",
          },
          {
            text: "Log Analysis",
            url: "https://www.datadoghq.com/ja/",
          },
        ],
      },
      en: {
        summary:
          "Centralised logging platforms gather, store, search, and analyse all logs, simplifying system-wide visibility and troubleshooting.",
        links: [
          {
            text: "Centralized Logging",
            url: "https://www.elastic.co/guide/en/observability/index.html",
          },
          {
            text: "Log Analysis",
            url: "https://docs.datadoghq.com/logs//",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "ログはローカル保存のみ", en: "Logs kept locally only." },
      },
      {
        value: 33,
        label: {
          ja: "一部ログ集約だが検索・分析限定",
          en: "Some aggregation; limited search/analysis.",
        },
      },
      {
        value: 66,
        label: {
          ja: "大部分集中管理だが高度相関分析は未実装",
          en: "Most logs centralised; advanced correlation not yet.",
        },
      },
      {
        value: 100,
        label: {
          ja: "全ログ一元化しリアルタイム検索・高度分析を実装",
          en: "All logs centralised with real-time search and advanced analytics.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  /* ───────────────────────────── Advanced (obs_9-obs_18) ───────────────────────────── */
  {
    id: "obs_9",
    category: "observability",
    text: {
      ja: "可観測性データをどのように相関分析していますか？",
      en: "How do you correlate observability data (metrics, logs, traces)?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "obs_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "メトリクス・ログ・トレースを相関させると、根本原因特定と依存関係理解が迅速化します。共通識別子とコンテキストが鍵です。",
        links: [
          {
            text: "Data Correlation",
            url: "https://www.dynatrace.com/news/blog/what-is-distributed-tracing/",
          },
          {
            text: "Observability Correlation",
            url: "https://opentelemetry.io/docs/concepts/signals/",
          },
        ],
      },
      en: {
        summary:
          "Correlating metrics, logs, and traces speeds root-cause isolation and dependency understanding; shared identifiers and context are critical.",
        links: [
          {
            text: "Data Correlation",
            url: "https://www.dynatrace.com/news/blog/what-is-distributed-tracing/",
          },
          {
            text: "Observability Correlation",
            url: "https://opentelemetry.io/docs/concepts/signals/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "相関分析ほぼなし", en: "Little to no correlation." },
      },
      {
        value: 33,
        label: {
          ja: "手動相関が中心で包括ビュー限定",
          en: "Mainly manual correlation; limited holistic view.",
        },
      },
      {
        value: 66,
        label: {
          ja: "統合プラットフォームで共通ID相関",
          en: "Integrated platform with shared IDs for correlation.",
        },
      },
      {
        value: 100,
        label: {
          ja: "AIで自動根本原因分析・依存関係マップ",
          en: "AI-assisted RCA and dependency mapping.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_10",
    category: "observability",
    text: {
      ja: "クラウドネイティブ環境での異常検出とAI駆動型パフォーマンス管理をどのように実装していますか？",
      en: "How have you implemented anomaly detection and AI-driven observability/performance management?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "obs_2", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "AI/MLベースの異常検出は複雑なパターンを学習し、予測・早期発見で信頼性と性能を向上させます。",
        links: [
          {
            text: "AI Observability",
            url: "https://www.dynatrace.com/news/blog/what-is-aiops/",
          },
          {
            text: "Anomaly Detection",
            url: "https://docs.datadoghq.com/monitors/types/anomaly//",
          },
        ],
      },
      en: {
        summary:
          "AI/ML-powered anomaly detection learns complex patterns, predicts issues early, and boosts reliability and performance.",
        links: [
          {
            text: "AI Observability",
            url: "https://www.dynatrace.com/news/blog/what-is-aiops/",
          },
          {
            text: "Anomaly Detection",
            url: "https://docs.datadoghq.com/monitors/types/anomaly/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "AIベース異常検出ほぼなし",
          en: "Little or no AI-based detection.",
        },
      },
      {
        value: 33,
        label: {
          ja: "統計的検知のみでAIモデル限定",
          en: "Only statistical detection; limited AI models.",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要システムでパターン学習とリアルタイムアラート",
          en: "Pattern learning and real-time alerts on key systems.",
        },
      },
      {
        value: 100,
        label: {
          ja: "予測分析・自動RCA・自己修復を備えたAIプラットフォーム",
          en: "AI platform with predictive analytics, auto-RCA, and self-healing.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_11",
    category: "observability",
    text: {
      ja: "カオスエンジニアリングと復元力テストをどのように実施していますか？",
      en: "How do you conduct chaos engineering and resilience testing?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "obs_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "カオスエンジニアリングは制御された障害を導入しシステム復元力を検証し、予期しない障害への備えを強化します。",
        links: [
          { text: "Chaos Engineering", url: "https://principlesofchaos.org/" },
          {
            text: "Resilience Testing",
            url: "https://www.hitachids.com/blog/new-help-arrives-for-getting-cloud-migrations-right/",
          },
        ],
      },
      en: {
        summary:
          "Chaos engineering injects controlled faults to validate resilience, boosting preparedness for unexpected failures.",
        links: [
          { text: "Chaos Engineering", url: "https://principlesofchaos.org/" },
          {
            text: "Resilience Testing",
            url: "https://www.gremlin.com/community/tutorials/chaos-engineering-tools-comparison",
          },
        ],
      },
    },
    options: [
      { value: 0, label: { ja: "実施なし", en: "Not practiced." } },
      {
        value: 33,
        label: {
          ja: "限定環境で基本テスト",
          en: "Basic tests in limited environments.",
        },
      },
      {
        value: 66,
        label: {
          ja: "フレームワーク確立し定期テスト",
          en: "Framework established with regular tests.",
        },
      },
      {
        value: 100,
        label: {
          ja: "自動化・ゲームデイなど高度カオス文化",
          en: "Automated chaos with game days and continuous resilience validation.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_12",
    category: "observability",
    text: {
      ja: "ユーザーエクスペリエンスとビジネスインパクトの監視をどのように実施していますか？",
      en: "How do you monitor user experience and business impact?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "obs_2", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "技術メトリクスだけでなくユーザー体験とビジネス成果を監視することで、技術パフォーマンスとビジネス目標の整合が取れます。",
        links: [
          {
            text: "User Experience Monitoring",
            url: "https://www.dynatrace.com/news/press-release/dynatrace%E3%80%812024%E5%B9%B4gartner-magic-quadrant%E3%81%AE/",
          },
          {
            text: "Business Metrics",
            url: "https://www.appdynamics.com/solutions/business-observability",
          },
        ],
      },
      en: {
        summary:
          "Monitoring real user experience and business outcomes aligns technical performance with business goals.",
        links: [
          {
            text: "User Experience Monitoring",
            url: "https://www.dynatrace.com/knowledge-base/digital-experience-monitoring/",
          },
          {
            text: "Business Metrics",
            url: "https://www.appdynamics.com/solutions/business-observability",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "技術メトリクスのみ監視",
          en: "Only technical metrics monitored.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本ユーザー体験メトリクスのみ",
          en: "Basic UX metrics (e.g., page load) collected.",
        },
      },
      {
        value: 66,
        label: {
          ja: "UX監視とビジネスメトリクス関連付け",
          en: "Comprehensive UX monitoring tied to business metrics.",
        },
      },
      {
        value: 100,
        label: {
          ja: "リアルユーザーモニタリングと収益影響分析を統合",
          en: "Integrated RUM and revenue-impact analysis.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_13",
    category: "observability",
    text: {
      ja: "コスト最適化のための可観測性データの活用をどのように行っていますか？",
      en: "How do you use observability data for cost optimisation?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "obs_2", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "可観測性データはリソース使用状況とコストドライバーを可視化し、効率的な割り当てと支出最適化を支援します。",
        links: [
          {
            text: "Cost Observability",
            url: "https://www.datadoghq.com/ja/product/cloud-cost-management/",
          },
          {
            text: "FinOps Practices",
            url: "https://www.finops.org/introduction/what-is-finops/",
          },
        ],
      },
      en: {
        summary:
          "Observability data reveals resource usage and cost drivers, enabling efficient allocation and spend optimisation.",
        links: [
          {
            text: "Cost Observability",
            url: "https://docs.datadoghq.com/cloud_cost_management/",
          },
          {
            text: "FinOps Practices",
            url: "https://www.finops.org/introduction/what-is-finops/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コスト最適化に活用せず",
          en: "Not used for cost optimisation.",
        },
      },
      {
        value: 33,
        label: {
          ja: "リソース使用メトリクスを一部コスト分析に使用",
          en: "Some usage metrics inform cost analysis.",
        },
      },
      {
        value: 66,
        label: {
          ja: "データ統合し無駄検出・効率スケーリングに利用",
          en: "Integrated data used to spot waste and scale efficiently.",
        },
      },
      {
        value: 100,
        label: {
          ja: "予測型最適化とワークロード別コスト配分を自動化",
          en: "Automated predictive optimisation and workload cost allocation.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_14",
    category: "observability",
    text: {
      ja: "サービスマップとトポロジー可視化をどのように実装していますか？",
      en: "How do you implement service-map and topology visualisation?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "optional",
    dependencies: [{ questionId: "obs_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "サービスマップは依存関係と通信パターンを可視化し、アーキテクチャ理解と診断を容易にします。",
        links: [
          {
            text: "Service Maps",
            url: "https://www.dynatrace.com/ja/platform/application-topology-discovery/smartscape/",
          },
          {
            text: "Topology Visualization",
            url: "https://www.hitachids.com/blog/new-help-arrives-for-getting-cloud-migrations-right/",
          },
        ],
      },
      en: {
        summary:
          "Service maps visualise dependencies and traffic flows, simplifying architectural understanding and troubleshooting.",
        links: [
          {
            text: "Service Maps",
            url: "https://docs.datadoghq.com/tracing/services/services_map/",
          },
          {
            text: "Topology Visualization",
            url: "https://www.hitachids.com/blog/new-help-arrives-for-getting-cloud-migrations-right/",
          },
        ],
      },
    },
    options: [
      { value: 0, label: { ja: "マップ未実装", en: "No service maps." } },
      {
        value: 33,
        label: {
          ja: "静的マップはあるが動的更新なし",
          en: "Static maps; no dynamic updates.",
        },
      },
      {
        value: 66,
        label: {
          ja: "自動検出・リアルタイム更新マップ",
          en: "Auto-discovered, real-time updating maps.",
        },
      },
      {
        value: 100,
        label: {
          ja: "異常ハイライト・What-If分析等高度機能",
          en: "Advanced maps with anomaly highlighting and what-if analysis.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_15",
    category: "observability",
    text: {
      ja: "オブザーバビリティツールと実践のガバナンスをどのように管理していますか？",
      en: "How do you govern observability tools and practices?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "optional",
    dependencies: [{ questionId: "obs_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ツール標準化・メトリクス命名規則・データ保持ポリシーなどのガバナンスは一貫性と効率を高めます。",
        links: [
          {
            text: "Observability Governance",
            url: "https://docs.newrelic.com/jp/docs/new-relic-solutions/observability-maturity/introduction/",
          },
          {
            text: "Standards Development",
            url: "https://openobserve.ai//",
          },
        ],
      },
      en: {
        summary:
          "Governance—tool standards, metric naming, retention policies—drives consistency and efficiency in observability.",
        links: [
          {
            text: "Observability Governance",
            url: "https://docs.newrelic.com/docs/new-relic-solutions/observability-maturity/introduction/",
          },
          {
            text: "Standards Development",
            url: "https://openobserve.ai//",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "ガバナンスほぼなし", en: "Little to no governance." },
      },
      {
        value: 33,
        label: {
          ja: "ガイドラインあるが採用限定",
          en: "Guidelines exist; adoption limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "標準化フレームワークで命名規則・保持ポリシー定義",
          en: "Standard framework defines naming and retention.",
        },
      },
      {
        value: 100,
        label: {
          ja: "自動インストルメンテーションと成熟度評価を含む高度プログラム",
          en: "Advanced program with auto-instrumentation and maturity assessment.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_16",
    category: "observability",
    text: {
      ja: "OpenTelemetryなどの標準化されたフレームワークをどのように採用していますか？",
      en: "How do you adopt standard observability frameworks such as OpenTelemetry?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "obs_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "OpenTelemetryはベンダー非依存で一貫したインストルメンテーションを提供し、相互運用性を向上します。",
        links: [
          {
            text: "OpenTelemetry",
            url: "https://opentelemetry.io/docs/concepts/what-is-opentelemetry/",
          },
          {
            text: "Observability Standards",
            url: "https://www.cncf.io/projects/opentelemetry/",
          },
        ],
      },
      en: {
        summary:
          "OpenTelemetry delivers vendor-agnostic instrumentation, improving interoperability and data consistency.",
        links: [
          {
            text: "OpenTelemetry",
            url: "https://opentelemetry.io/docs/concepts/what-is-opentelemetry/",
          },
          {
            text: "Observability Standards",
            url: "https://www.cncf.io/projects/opentelemetry/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "標準フレームワーク未採用",
          en: "No standard framework adopted.",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部サービスで試験採用",
          en: "Pilot adoption on some services.",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要サービスにOpenTelemetry採用",
          en: "OpenTelemetry on key services.",
        },
      },
      {
        value: 100,
        label: {
          ja: "全社で完全採用・自動インストルメンテーション",
          en: "Organisation-wide adoption with auto-instrumentation.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_17",
    category: "observability",
    text: {
      ja: "セキュリティ監視と可観測性の統合をどのように実装していますか？",
      en: "How do you integrate security monitoring with observability?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "obs_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "運用データとセキュリティイベントを相関させることで、脅威検出と対応能力が向上します。",
        links: [
          {
            text: "SecOps Integration",
            url: "https://www.splunk.com/en_us/blog/platform/building-digital-resilience-for-secops-itops-and-devops.html",
          },
          {
            text: "Security Observability",
            url: "https://snyk.io/learn/cloud-security-monitoring/",
          },
        ],
      },
      en: {
        summary:
          "Correlating operational data with security events enhances visibility and response to threats.",
        links: [
          {
            text: "SecOps Integration",
            url: "https://www.splunk.com/en_us/blog/learn/secops-security-operations.html",
          },
          {
            text: "Security Observability",
            url: "https://snyk.io/blog/2024-open-source-security-report-slowing-progress-and-new-challenges-for/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "統合ほぼなし", en: "Little to no integration." },
      },
      {
        value: 33,
        label: {
          ja: "セキュリティログを一部取り込み",
          en: "Some security logs ingested.",
        },
      },
      {
        value: 66,
        label: {
          ja: "統合プラットフォームで相関分析",
          en: "Integrated platform with correlation analysis.",
        },
      },
      {
        value: 100,
        label: {
          ja: "完全統合でリアルタイム脅威検出と自動対応",
          en: "Full integration with real-time detection and auto-response.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },

  {
    id: "obs_18",
    category: "observability",
    text: {
      ja: "モニタリングとアラートの自動化をどのように実装していますか？",
      en: "How do you automate monitoring and alerting?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "obs_3", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "自動スケーリング、自己修復、動的閾値調整などの自動化により、人的介入なしで問題検出と対応が可能になります。",
        links: [
          {
            text: "Monitoring Automation",
            url: "https://www.dynatrace.com/ja/services-support/autonomous-cloud-enablement/",
          },
          {
            text: "Self-healing Systems",
            url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/",
          },
        ],
      },
      en: {
        summary:
          "Automation—auto-scaling, self-healing, dynamic thresholds—enables detection and response without human intervention.",
        links: [
          {
            text: "Monitoring Automation",
            url: "https://www.dynatrace.com/services-support/autonomous-cloud-enablement/",
          },
          {
            text: "Self-healing Systems",
            url: "https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "自動化ほぼなし", en: "Little to no automation." },
      },
      {
        value: 33,
        label: {
          ja: "基本通知のみ自動化",
          en: "Basic notifications automated.",
        },
      },
      {
        value: 66,
        label: {
          ja: "動的閾値・自己修復を一部導入",
          en: "Some dynamic thresholds and self-healing actions.",
        },
      },
      {
        value: 100,
        label: {
          ja: "AIによる予測アラートと自動修復オーケストレーション",
          en: "AI-driven predictive alerts and orchestrated self-healing.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Select if unfamiliar." },
      },
    ],
  },
];
