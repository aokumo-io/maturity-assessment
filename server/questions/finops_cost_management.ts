/**
 * FinOps・コスト管理に関する質問モジュール
 *
 * このモジュールは、クラウドリソースの費用対効果、コスト最適化、
 * 予算管理、コスト配分に関する成熟度を評価する質問を提供します。
 *
 * FinOpsの実践、コスト可視化、リソース最適化、タグ付けポリシー、
 * および予算管理に関する質問が含まれています。
 */

import { AssessmentQuestion } from "@shared/schema";

/**
 * FinOps・コスト管理カテゴリの質問リスト
 */
export const finopsCostManagementQuestions: AssessmentQuestion[] = [
  {
    id: "finops_1",
    category: "finops_cost_management",
    text: {
      ja: "クラウドコストの可視性とレポートはどの程度確立されていますか？",
      en: "How well-established are cloud-cost visibility and reporting?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドコストの可視性は効果的なコスト管理の基盤です。ダッシュボードとレポートにより支出を把握し、最適化機会を特定できます。",
        links: [
          {
            text: "クラウド使用量とコストの理解",
            url: "https://learn.microsoft.com/ja-jp/cloud-computing/finops/framework/understand/understand-cloud-usage-cost",
          },
          {
            text: "Cost Reporting Best Practices",
            url: "https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/",
          },
        ],
      },
      en: {
        summary:
          "Cost visibility is the foundation of cloud-cost management. Proper dashboards and reports let stakeholders understand spend and spot optimisation opportunities.",
        links: [
          {
            text: "Understand Cloud Usage and Cost",
            url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/understand/understand-cloud-usage-cost",
          },
          {
            text: "Cost Reporting Best Practices",
            url: "https://aws.amazon.com/aws-cost-management/aws-cost-and-usage-reporting/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "可視性はほとんどなく月次請求書のみ確認",
          en: "Virtually no visibility—only monthly invoices reviewed.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的レポートはあるが詳細分析や定期レビューなし",
          en: "Basic reports exist, but no deep analysis or routine reviews.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的ツールとダッシュボードを用い定期レビュー実施",
          en: "Comprehensive tools/dashboards with regular cost reviews.",
        },
      },
      {
        value: 100,
        label: {
          ja: "リアルタイムレポート、カスタムダッシュボード、自動アラートが完全実装",
          en: "Realtime reports, custom dashboards and automated alerts fully implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if you are unfamiliar with this topic.",
        },
      },
    ],
  },

  {
    id: "finops_2",
    category: "finops_cost_management",
    text: {
      ja: "コスト最適化のプラクティスはどの程度成熟していますか？",
      en: "How mature are your cost-optimisation practices?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: { executive: "high", manager: "high", practitioner: "high" },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なコスト最適化戦略により、パフォーマンスを損なわずに支出を削減しリソース効率を高めます。",
        links: [
          {
            text: "クラウド使用量とコストの最適化",
            url: "https://learn.microsoft.com/ja-jp/cloud-computing/finops/framework/optimize/optimize-cloud-usage-cost",
          },
          {
            text: "FinOps Optimization",
            url: "https://www.finops.org/framework/domains/optimize-usage-cost/",
          },
        ],
      },
      en: {
        summary:
          "Effective optimisation strategies cut spend without harming performance, ensuring efficient resource use.",
        links: [
          {
            text: "Optimize Cloud Usage and Cost",
            url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/optimize/optimize-cloud-usage-cost",
          },
          {
            text: "FinOps Optimization",
            url: "https://www.finops.org/framework/domains/optimize-usage-cost/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的プラクティスなく反応的にコスト削減",
          en: "No systematic practice—cost cutting is reactive.",
        },
      },
      {
        value: 33,
        label: {
          ja: "未使用リソース削除など基礎施策のみ実施",
          en: "Basic actions (e.g., removing idle resources) only.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括戦略があり定期レビューと自動ツールを活用",
          en: "Comprehensive strategy with reviews & automation tools.",
        },
      },
      {
        value: 100,
        label: {
          ja: "継続最適化・自動スケーリング・ROI分析が完全統合",
          en: "Continuous optimisation, auto-scaling and ROI analysis fully integrated.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_3",
    category: "finops_cost_management",
    text: {
      ja: "リソースのタグ付けと配分はどのように管理されていますか？",
      en: "How are resource tagging and cost allocation managed?",
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
          "適切なタグ付けはコスト帰属を明確化し、部門やプロジェクト別の分析を可能にします。",
        links: [
          {
            text: "Resource Tagging Strategy",
            url: "https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/tagging-best-practices.html",
          },
          {
            text: "Cost Allocation",
            url: "https://cloud.google.com/billing/docs/how-to/cost-breakdown",
          },
        ],
      },
      en: {
        summary:
          "Robust tagging clarifies cost ownership and enables analysis by department, project, environment, etc.",
        links: [
          {
            text: "Resource Tagging Strategy",
            url: "https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/tagging-best-practices.html",
          },
          {
            text: "Cost Allocation",
            url: "https://cloud.google.com/billing/docs/how-to/cost-breakdown",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的タグ付けなし、一貫性も低い",
          en: "No systematic tagging; low consistency.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本ポリシーはあるが強制力・品質に課題",
          en: "Basic policy exists; enforcement/quality vary.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括戦略＋自動強制＋定期チェックを実装",
          en: "Comprehensive strategy with auto-enforcement & audits.",
        },
      },
      {
        value: 100,
        label: {
          ja: "自動タグ、継続検証、動的配分を完全実装",
          en: "Automated tagging, continuous validation and dynamic allocation fully implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_4",
    category: "finops_cost_management",
    text: {
      ja: "予算管理と予測はどのように実施されていますか？",
      en: "How are budgeting and forecasting carried out?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的な予算管理と予測は、計画通りの支出と財務整合性を確保し、予期せぬ超過を防ぎます。",
        links: [
          {
            text: "クラウド予算と自動化",
            url: "https://cloud.google.com/billing/docs/how-to/budgets?hl=ja",
          },
          {
            text: "Cost Forecasting",
            url: "https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/cost-mgt-best-practices#budget-and-forecast",
          },
        ],
      },
      en: {
        summary:
          "Solid budgeting & forecasting keep spend within plan, prevent surprises and align finance with reality.",
        links: [
          {
            text: "Using Budgets to Automate Cost Controls",
            url: "https://cloud.google.com/blog/topics/developers-practitioners/using-budgets-automate-cost-controls",
          },
          {
            text: "Cost Forecasting",
            url: "https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/cost-mgt-best-practices#budget-and-forecast",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的予算管理なく支出は事後確認",
          en: "No systematic budgeting; spend reviewed post-facto.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本予算設定はあるが予測精度低く超過管理限定",
          en: "Basic budgets; low forecast accuracy; limited overrun control.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括フレームワークで予測・アラート・トレンド分析実装",
          en: "Comprehensive framework with forecasts, alerts & trend analysis.",
        },
      },
      {
        value: 100,
        label: {
          ja: "AI予測、リアルタイム監視、自動抑制を完全実装",
          en: "AI-driven forecasts, realtime monitoring & automatic controls fully implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  /* ─────────────────────── INTERMEDIATE QUESTIONS (depends on finops_2) ─────────────────────── */
  {
    id: "finops_5",
    category: "finops_cost_management",
    text: {
      ja: "リソースの適正化（ライトサイジング）はどのように実施されていますか？",
      en: "How is resource right-sizing performed?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [{ questionId: "finops_2", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ライトサイジングは過剰プロビジョニングを削減し、実使用に合わせてリソースを調整してコストを削減します。",
        links: [
          {
            text: "Resource Right-sizing",
            url: "https://aws.amazon.com/aws-cost-management/aws-cost-optimization/right-sizing/",
          },
          {
            text: "Instance Optimization",
            url: "https://cloud.google.com/compute/docs/instances/apply-sizing-recommendations-for-instances",
          },
        ],
      },
      en: {
        summary:
          "Right-sizing removes over-provisioning by adjusting resources to real usage, cutting costs while meeting performance.",
        links: [
          {
            text: "Resource Right-sizing",
            url: "https://aws.amazon.com/aws-cost-management/aws-cost-optimization/right-sizing/",
          },
          {
            text: "Instance Optimization",
            url: "https://cloud.google.com/compute/docs/instances/apply-sizing-recommendations-for-instances",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的ライトサイジングなし、サイズ選択は推測",
          en: "No systematic right-sizing; instance sizes guessed.",
        },
      },
      {
        value: 33,
        label: {
          ja: "使用率分析はあるが継続プロセス未確立",
          en: "Usage analysed but no continuous process established.",
        },
      },
      {
        value: 66,
        label: {
          ja: "定期分析と推奨適用で包括プログラム実装",
          en: "Comprehensive program with periodic analysis & recommendations.",
        },
      },
      {
        value: 100,
        label: {
          ja: "AI駆動自動分析と継続最適化を完全実装",
          en: "AI-driven auto-analysis and continuous optimisation fully implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_6",
    category: "finops_cost_management",
    text: {
      ja: "予約/コミットメントインスタンスの活用はどの程度進んでいますか？",
      en: "How extensively are reserved/commitment instances used?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [{ questionId: "finops_2", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "予約やコミットメントは前払いで大幅割引を得て予測可能なワークロードコストを最適化します。",
        links: [
          {
            text: "Reserved Instances",
            url: "https://aws.amazon.com/ec2/pricing/reserved-instances/",
          },
          {
            text: "Commitment Discounts",
            url: "https://cloud.google.com/compute/docs/instances/committed-use-discounts-overview",
          },
        ],
      },
      en: {
        summary:
          "Reservations/commitments provide deep discounts for predictable workloads by committing usage upfront.",
        links: [
          {
            text: "Reserved Instances",
            url: "https://aws.amazon.com/ec2/pricing/reserved-instances/",
          },
          {
            text: "Commitment Discounts",
            url: "https://cloud.google.com/compute/docs/instances/committed-use-discounts-overview",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "ほぼ未活用でオンデマンド依存",
          en: "Hardly used—mainly on-demand instances.",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部ワークロードで使用も包括戦略なし",
          en: "Used for some workloads; no comprehensive strategy.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括戦略で分析・最適化・モニタリング実施",
          en: "Comprehensive strategy with analysis, optimisation & monitoring.",
        },
      },
      {
        value: 100,
        label: {
          ja: "自動分析と継続調整で高度管理を実装",
          en: "Advanced management with automated analysis and continuous adjustments.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_7",
    category: "finops_cost_management",
    text: {
      ja: "クラウドコストガバナンスをどのように実装していますか？",
      en: "How is cloud-cost governance implemented?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "finops_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "コストガバナンスフレームワークはポリシーと責任を定義し、一貫性と説明責任を確保します。",
        links: [
          {
            text: "FinOps管理フレームワーク",
            url: "https://learn.microsoft.com/ja-jp/cloud-computing/finops/framework/manage/manage-finops",
          },
          {
            text: "Governance Framework",
            url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/govern/cost-management/",
          },
        ],
      },
      en: {
        summary:
          "A governance framework defines policies & accountability, ensuring consistent cost management.",
        links: [
          {
            text: "Manage FinOps Framework",
            url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/manage/manage-finops",
          },
          {
            text: "Governance Framework",
            url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/govern/cost-management/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "枠組みなく責任・プロセスが不明確",
          en: "No framework; responsibilities & processes unclear.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本ポリシーと役割はあるが実施・監視限定",
          en: "Basic policies/roles defined; limited execution & monitoring.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括フレームワークで標準プロセスとレビュー実行",
          en: "Comprehensive framework with standard processes and reviews.",
        },
      },
      {
        value: 100,
        label: {
          ja: "自動強制・継続モニタリング・経営可視性を実装",
          en: "Automated enforcement, continuous monitoring & exec-level visibility implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_8",
    category: "finops_cost_management",
    text: {
      ja: "コスト管理の自動化はどの程度実装されていますか？",
      en: "To what extent is cost-management automation implemented?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: { executive: "low", manager: "high", practitioner: "high" },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "finops_2", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "自動化は手動プロセスを削減し、継続的最適化を可能にします（例: 未使用リソース停止、自動スケーリング）。",
        links: [
          {
            text: "予算による自動コスト制御",
            url: "https://cloud.google.com/billing/docs/how-to/budgets?hl=ja",
          },
          {
            text: "Automated Cost Control",
            url: "https://cloud.google.com/blog/products/management-tools/control-cloud-costs-with-budgets-automate-actions",
          },
        ],
      },
      en: {
        summary:
          "Automation cuts manual effort and enables continuous optimisation (e.g., shut down idle resources, auto-scaling).",
        links: [
          {
            text: "Using Budgets to Automate Cost Controls",
            url: "https://cloud.google.com/blog/topics/developers-practitioners/using-budgets-automate-cost-controls",
          },
          {
            text: "Automated Cost Control",
            url: "https://cloud.google.com/blog/products/management-tools/control-cloud-costs-with-budgets-automate-actions",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "自動化ほぼなし、手動プロセスに依存",
          en: "Little automation; relies on manual processes.",
        },
      },
      {
        value: 33,
        label: {
          ja: "未使用停止など一部自動化は実装",
          en: "Some automation (e.g., idle shutdown) implemented.",
        },
      },
      {
        value: 66,
        label: {
          ja: "スケジュール管理・自動タグ付け等を標準化",
          en: "Standardised scheduling, auto-tagging, auto-scaling etc.",
        },
      },
      {
        value: 100,
        label: {
          ja: "AI予測に基づく自動調整と継続最適化を実装",
          en: "AI-based auto-adjustments and continuous optimisation across the org.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  /* ─────────── ADVANCED QUESTIONS (dependencies in description) ─────────── */
  {
    id: "finops_9",
    category: "finops_cost_management",
    text: {
      ja: "ユニットエコノミクスの追跡はどのように実施されていますか？",
      en: "How is unit-economics tracking performed?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "optional",
    dependencies: [{ questionId: "finops_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ユニットエコノミクスは、コストをビジネス価値と結び付け、価値基準の意思決定を可能にします。",
        links: [
          {
            text: "IBM Cloudability ユニットメトリクス",
            url: "https://global.apptio.com/ja/products/ibm-cloudability/",
          },
          {
            text: "Cost per Business Metric",
            url: "https://www.apptio.com/topics/cloud-unit-economics//",
          },
        ],
      },
      en: {
        summary:
          "Unit economics link cost to business value, enabling value-driven decisions rather than pure cost cuts.",
        links: [
          {
            text: "Cloud Unit Economics",
            url: "https://www.apptio.com/topics/cloud-unit-economics/",
          },
          {
            text: "Cost per Business Metric",
            url: "https://www.apptio.com/topics/cloud-unit-economics//",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "追跡なし、コストはビジネスメトリクスと無関係",
          en: "No tracking; costs not tied to business metrics.",
        },
      },
      {
        value: 33,
        label: {
          ja: "指標定義はあるが継続追跡・詳細分析は限定",
          en: "Metrics defined but limited ongoing tracking/analysis.",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要メトリクスとコストを定期追跡し分析",
          en: "Key metrics linked to costs with regular tracking & analysis.",
        },
      },
      {
        value: 100,
        label: {
          ja: "多次元・AI分析と自動データ収集を実装",
          en: "Multi-dimensional AI analysis with automated data collection.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_10",
    category: "finops_cost_management",
    text: {
      ja: "コスト異常検出はどのように実装されていますか？",
      en: "How is cost-anomaly detection implemented?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "finops_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary: "異常検出は支出急増を早期特定し、大問題化前に対処します。",
        links: [
          {
            text: "Cost Anomaly Detection",
            url: "https://aws.amazon.com/aws-cost-management/aws-cost-anomaly-detection/",
          },
          {
            text: "Spend Variance Alerting",
            url: "https://cloud.google.com/billing/docs/how-to/budgets",
          },
        ],
      },
      en: {
        summary:
          "Anomaly detection spots unexpected spikes early, allowing quick remediation before costs balloon.",
        links: [
          {
            text: "Cost Anomaly Detection",
            url: "https://aws.amazon.com/aws-cost-management/aws-cost-anomaly-detection/",
          },
          {
            text: "Spend Variance Alerting",
            url: "https://cloud.google.com/billing/docs/how-to/budgets",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "仕組みなし、急増は月次レビューまで気付かない",
          en: "No mechanism; spikes only seen in monthly review.",
        },
      },
      {
        value: 33,
        label: {
          ja: "予算アラートのみで高度検出や原因分析なし",
          en: "Budget alerts only; limited detection/root-cause.",
        },
      },
      {
        value: 66,
        label: {
          ja: "自動アラートとしきい値検出で迅速通知を実装",
          en: "Auto-alerts with threshold detection and fast notifications.",
        },
      },
      {
        value: 100,
        label: {
          ja: "AIパターン認識と自動原因分析/修復を実装",
          en: "AI pattern recognition with auto root-cause & remediation implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_11",
    category: "finops_cost_management",
    text: {
      ja: "マルチクラウドのコスト管理はどのように実装されていますか？",
      en: "How is multi-cloud cost management implemented?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "finops_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "マルチクラウドでは統合可視化と管理が最適化と意思決定に不可欠です。",
        links: [
          {
            text: "IBM Cloudability マルチクラウド管理",
            url: "https://global.apptio.com/ja/products/ibm-cloudability/",
          },
          {
            text: "Unified Cloud Cost Visibility",
            url: "https://www.apptio.com/products/cloudability//",
          },
        ],
      },
      en: {
        summary:
          "Multi-cloud environments require unified visibility & management for optimisation and strategic decisions.",
        links: [
          {
            text: "Cloudability Multi-cloud Management",
            url: "https://www.apptio.com/products/cloudability/",
          },
          {
            text: "Unified Cloud Cost Visibility",
            url: "https://www.apptio.com/products/cloudability//",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "仕組みなし、各クラウドを個別管理",
          en: "No mechanism; each cloud managed separately.",
        },
      },
      {
        value: 33,
        label: {
          ja: "コスト集約はあるが統一可視化・戦略限定",
          en: "Basic aggregation; limited unified view/strategy.",
        },
      },
      {
        value: 66,
        label: {
          ja: "統合ダッシュボードと比較分析を実装",
          en: "Integrated dashboard with cross-cloud comparison.",
        },
      },
      {
        value: 100,
        label: {
          ja: "最適配置・自動化・統一ガバナンスを完全実装",
          en: "Optimal workload placement, automation & unified governance fully implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_12",
    category: "finops_cost_management",
    text: {
      ja: "ショーバック/チャージバックの仕組みはどのように実装されていますか？",
      en: "How are showback/chargeback mechanisms implemented?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "finops_3", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ショーバックとチャージバックはコスト配分を明確にし説明責任を促進します。",
        links: [
          {
            text: "チャージバック・ショーバック解説",
            url: "https://www.itmedia.co.jp/enterprise/",
          },
          {
            text: "Cost Allocation Best Practices",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html",
          },
        ],
      },
      en: {
        summary:
          "Showback/chargeback allocate costs to owners, driving accountability and cost awareness.",
        links: [
          {
            text: "Invoicing and Chargeback",
            url: "https://www.finops.org/framework/capabilities/invoicing-chargeback/",
          },
          {
            text: "Cost Allocation Best Practices",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "仕組みなし、コストは中央ITで一元管理",
          en: "No mechanism; costs managed as central IT expense.",
        },
      },
      {
        value: 33,
        label: {
          ja: "ショーバックレポートのみで正式チャージバックなし",
          en: "Showback reports only; no formal chargeback.",
        },
      },
      {
        value: 66,
        label: {
          ja: "配分ルールと定期レポートで包括仕組み実装",
          en: "Comprehensive mechanism with allocation rules & regular reports.",
        },
      },
      {
        value: 100,
        label: {
          ja: "自動配分・リアルタイムレポート・価値連携を実装",
          en: "Automated allocation, realtime reports & value linkage fully implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_13",
    category: "finops_cost_management",
    text: {
      ja: "FinOpsの文化とトレーニングはどの程度確立されていますか？",
      en: "How established are FinOps culture and training?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: { executive: "high", manager: "high", practitioner: "high" },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "finops_7", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "全社的なコスト意識・教育・責任共有モデルがFinOps文化を支えます。",
        links: [
          {
            text: "Linux Foundation FinOps認定",
            url: "https://training.linuxfoundation.org/ja/certification/certified-finops/",
          },
          {
            text: "Cloud Cost Training",
            url: "https://www.finops.org/resource/what-is-finops-training-and-certification/",
          },
        ],
      },
      en: {
        summary:
          "Company-wide cost awareness, education and shared responsibility underpin a strong FinOps culture.",
        links: [
          {
            text: "FinOps Culture",
            url: "https://www.finops.org/framework/previous-capabilities/establish-finops-culture//",
          },
          {
            text: "Cloud Cost Training",
            url: "https://www.finops.org/resource/what-is-finops-training-and-certification/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "文化/トレーニングなし、コスト管理はIT/財務任せ",
          en: "No culture/training; IT/finance handle costs.",
        },
      },
      {
        value: 33,
        label: {
          ja: "意識向上はあるが包括トレーニングや浸透不足",
          en: "Some awareness; no comprehensive training/culture.",
        },
      },
      {
        value: 66,
        label: {
          ja: "役割別トレーニングと経営支援で文化醸成中",
          en: "Role-based training and exec support building culture.",
        },
      },
      {
        value: 100,
        label: {
          ja: "教育・認定・コミュニティで高度文化が定着",
          en: "Advanced culture with continuous education, certification & communities.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_14",
    category: "finops_cost_management",
    text: {
      ja: "サステナビリティとカーボンフットプリントの管理はどのように実施されていますか？",
      en: "How are sustainability and carbon-footprint management handled?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "finops_2", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "環境負荷最小化と経済効率を両立させることがクラウド戦略の鍵となります。",
        links: [
          {
            text: "FinOps持続可能性コラボレーション",
            url: "https://www.finops.org/insights/finops-sustainability-collaborate/",
          },
          {
            text: "Carbon Footprint Management",
            url: "https://cloud.google.com/carbon-footprint",
          },
        ],
      },
      en: {
        summary:
          "Balancing environmental impact and economic efficiency is key to sustainable cloud strategy.",
        links: [
          {
            text: "Sustainability Optimization",
            url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/optimize/sustainability",
          },
          {
            text: "Carbon Footprint Management",
            url: "https://cloud.google.com/carbon-footprint",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "管理なし、環境影響は未考慮",
          en: "No management; environmental impact not considered.",
        },
      },
      {
        value: 33,
        label: {
          ja: "認識あるが測定や統合は限定的",
          en: "Awareness exists; limited measurement or strategy.",
        },
      },
      {
        value: 66,
        label: {
          ja: "カーボン測定と最適化戦略を実施し定期報告",
          en: "Carbon measurement, optimisation strategy and regular reporting.",
        },
      },
      {
        value: 100,
        label: {
          ja: "詳細分析と自動最適化、意思決定統合を実装",
          en: "Detailed analysis, automated optimisation and decision integration implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "finops_15",
    category: "finops_cost_management",
    text: {
      ja: "高度な最適化手法（スポット, Graviton/AMD等）はどのように実装されていますか？",
      en: "How are advanced optimisation techniques (Spot, Graviton/AMD, automation) implemented?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: { executive: "low", manager: "high", practitioner: "high" },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "finops_5", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "スポット利用やプロセッサ最適化はコスト削減と性能向上を両立させる高度手法です。",
        links: [
          { text: "Spot Instances", url: "https://aws.amazon.com/ec2/spot/" },
          {
            text: "Advanced Cost Optimization",
            url: "https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-leveraging-ec2-spot-instances/cost-optimization-leveraging-ec2-spot-instances.html",
          },
        ],
      },
      en: {
        summary:
          "Techniques like Spot instances or CPU-optimised types cut costs and boost performance as part of sophisticated optimisation.",
        links: [
          { text: "Spot Instances", url: "https://aws.amazon.com/ec2/spot/" },
          {
            text: "Advanced Cost Optimization",
            url: "https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-leveraging-ec2-spot-instances/cost-optimization-leveraging-ec2-spot-instances.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "高度手法ほぼ未使用、標準インスタンス依存",
          en: "Advanced techniques rarely used—depend on standard instances.",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部ワークロードで試験的に使用する程度",
          en: "Trial use for some workloads; no broad strategy.",
        },
      },
      {
        value: 66,
        label: {
          ja: "複数高度手法が主要ワークロードに採用",
          en: "Several advanced techniques adopted for core workloads.",
        },
      },
      {
        value: 100,
        label: {
          ja: "混合戦略・AI最適化・自動スポット管理を実装",
          en: "Mixed strategies, AI optimisation and fully automated Spot management implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select if unfamiliar.",
        },
      },
    ],
  },
];
