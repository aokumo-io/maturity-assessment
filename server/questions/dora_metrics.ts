/**
 * DORAメトリクス質問モジュール
 *
 * DevOpsリサーチ・アセスメント（DORA）メトリクスに関する質問を定義するモジュールです。
 * デプロイ頻度、リードタイム、変更失敗率、復旧時間などの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const doraMetricsQuestions: AssessmentQuestion[] = [
  // Base Questions (Always shown first)
  {
    id: "dora_1",
    category: "dora_metrics",
    text: {
      ja: "デプロイ頻度：どのくらいの頻度でアプリケーションを本番環境にデプロイしていますか？",
      en: "Deployment Frequency: How often do you deploy applications to production?",
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
          "デプロイ頻度は、組織がどれだけ迅速にコード変更を本番環境に提供できるかを示す重要な指標です。高頻度のデプロイは、小さな変更の継続的なデリバリーを意味し、リスクの低減とフィードバックループの短縮につながります。",
        links: [
          {
            text: "DORAメトリクス",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "Accelerate DevOpsの状態",
            url: "https://cloud.google.com/devops/state-of-devops/",
          },
        ],
      },
      en: {
        summary:
          "Deployment frequency is a key indicator of how quickly an organization can deliver code changes to production. High-frequency deployments indicate continuous delivery of small changes, leading to reduced risk and shorter feedback loops.",
        links: [
          {
            text: "DORA Metrics",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "Accelerate State of DevOps",
            url: "https://cloud.google.com/devops/state-of-devops/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "月に1回未満（四半期ごと、半年ごと、またはそれ以下の頻度）",
          en: "Less than once per month (quarterly, biannually, or less frequently)",
        },
      },
      {
        value: 33,
        label: {
          ja: "月に1～3回程度",
          en: "Between once per month and once per week",
        },
      },
      {
        value: 66,
        label: {
          ja: "週に1～3回程度",
          en: "Between once per week and once per day",
        },
      },
      {
        value: 100,
        label: {
          ja: "1日に複数回（継続的デリバリーを実現）",
          en: "Multiple times per day (achieving continuous delivery)",
        },
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know",
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },
  {
    id: "dora_2",
    category: "dora_metrics",
    text: {
      ja: "変更のリードタイム：コードが変更されてから本番環境にデプロイされるまでにかかる時間はどのくらいですか？",
      en: "Lead Time for Changes: How long does it take for code changes to be deployed to production?",
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
          "変更のリードタイムは、コミットから本番環境へのデプロイまでの時間を測定します。この指標は、組織がどれだけ迅速に新機能やバグ修正を提供できるかを示します。",
        links: [
          {
            text: "変更のリードタイム",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          { text: "DORA調査", url: "https://dora.dev/" },
        ],
      },
      en: {
        summary:
          "Lead time for changes measures the time from commit to deployment in production. This metric indicates how quickly an organization can deliver new features or bug fixes.",
        links: [
          {
            text: "Lead Time for Changes",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          { text: "DORA Research", url: "https://dora.dev/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "1ヶ月以上",
          en: "More than one month",
        },
      },
      {
        value: 33,
        label: {
          ja: "1週間～1ヶ月",
          en: "Between one week and one month",
        },
      },
      {
        value: 66,
        label: {
          ja: "1日～1週間",
          en: "Between one day and one week",
        },
      },
      {
        value: 100,
        label: {
          ja: "1日未満（数時間以内）",
          en: "Less than one day (within hours)",
        },
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know",
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },
  {
    id: "dora_3",
    category: "dora_metrics",
    text: {
      ja: "障害復旧時間：本番環境で問題が発生してから復旧するまでにかかる平均時間はどのくらいですか？",
      en: "Mean Time to Recovery: How long does it take to recover from failures in the production environment?",
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
          "障害復旧時間（MTTR）は、サービス中断からの回復にかかる時間を測定します。この指標は、組織の運用レジリエンスと障害対応能力を示します。",
        links: [
          {
            text: "障害復旧時間",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "インシデント管理",
            url: "https://sre.google/sre-book/managing-incidents/",
          },
        ],
      },
      en: {
        summary:
          "Mean Time to Recovery (MTTR) measures the time it takes to recover from service disruptions. This metric indicates an organization's operational resilience and incident response capability.",
        links: [
          {
            text: "Mean Time to Recovery",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "Incident Management",
            url: "https://sre.google/sre-book/managing-incidents/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "1週間以上",
          en: "More than one week",
        },
      },
      {
        value: 33,
        label: {
          ja: "1日～1週間",
          en: "Between one day and one week",
        },
      },
      {
        value: 66,
        label: {
          ja: "1時間～1日",
          en: "Between one hour and one day",
        },
      },
      {
        value: 100,
        label: {
          ja: "1時間未満",
          en: "Less than one hour",
        },
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know",
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },
  {
    id: "dora_4",
    category: "dora_metrics",
    text: {
      ja: "変更失敗率：本番環境へのデプロイが失敗する、または直後に問題が発生する割合はどのくらいですか？",
      en: "Change Failure Rate: What percentage of deployments to production fail or cause issues immediately after?",
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
          "変更失敗率は、本番環境へのデプロイが失敗するか、修正が必要な問題を引き起こす割合を測定します。この指標は、デリバリープロセスの品質と安定性を反映しています。",
        links: [
          {
            text: "変更失敗率",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "デプロイメント失敗の削減",
            url: "https://www.thoughtworks.com/en-us/insights/blog/kickstart-cd-deployment-automation",
          },
        ],
      },
      en: {
        summary:
          "Change failure rate measures the percentage of deployments that fail in production or cause issues requiring remediation. This metric reflects the quality and stability of the delivery process.",
        links: [
          {
            text: "Change Failure Rate",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "Reducing Deployment Failures",
            url: "https://www.thoughtworks.com/en-us/insights/blog/kickstart-cd-deployment-automation",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "46%以上（半分近くのデプロイで問題が発生する）",
          en: "46% or more (nearly half of deployments cause issues)",
        },
      },
      {
        value: 33,
        label: {
          ja: "31～45%",
          en: "31-45%",
        },
      },
      {
        value: 66,
        label: {
          ja: "16～30%",
          en: "16-30%",
        },
      },
      {
        value: 100,
        label: {
          ja: "0～15%（デプロイの大部分が問題なく完了する）",
          en: "0-15% (most deployments complete without issues)",
        },
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know",
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  // Adaptive Questions (Shown based on previous answers and maturity level)
  {
    id: "dora_5",
    category: "dora_metrics",
    text: {
      ja: "DORAメトリクスをどのように収集し可視化していますか？",
      en: "How do you collect and visualize DORA metrics?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "standard",
    dependencies: [
      { questionId: "dora_1", minValue: 33 }, // Only show if dora_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "DORAメトリクスの効果的な収集と可視化は、パフォーマンスの追跡と改善に不可欠です。自動化されたデータ収集と分かりやすいダッシュボードにより、チームはデータドリブンな意思決定を行うことができます。",
        links: [
          {
            text: "DevOpsの測定",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "DORAメトリクスダッシュボード",
            url: "https://github.com/GoogleCloudPlatform/fourkeys",
          },
        ],
      },
      en: {
        summary:
          "Effective collection and visualization of DORA metrics are essential for tracking and improving performance. Automated data collection and clear dashboards enable teams to make data-driven decisions.",
        links: [
          {
            text: "Measuring DevOps",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "DORA Metrics Dashboard",
            url: "https://github.com/GoogleCloudPlatform/fourkeys",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "DORAメトリクスの体系的な収集や可視化は行われていない",
          en: "No systematic collection or visualization of DORA metrics",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なメトリクスが手動で収集され、単純なレポートが作成されている",
          en: "Basic metrics are manually collected and simple reports are created",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なDORAメトリクスが自動的に収集され、ダッシュボードで可視化されている",
          en: "Key DORA metrics are automatically collected and visualized in dashboards",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的なDORAメトリクスが自動収集され、リアルタイムダッシュボード、傾向分析、ベンチマーク比較などが実装されている",
          en: "Comprehensive DORA metrics are automatically collected with real-time dashboards, trend analysis, and benchmark comparisons implemented",
        },
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know",
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },
  {
    id: "dora_6",
    category: "dora_metrics",
    text: {
      ja: "組織内の改善を推進するためにDORAメトリクスをどのように活用していますか？",
      en: "How do you utilize DORA metrics to drive improvements within your organization?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "low",
    },
    assessmentType: "standard",
    dependencies: [
      { questionId: "dora_1", minValue: 33 }, // Only show if dora_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "DORAメトリクスは単なる測定ツール以上のものです。これらを継続的改善プロセスに統合することで、組織はボトルネックを特定し、優先順位付けされた改善活動を実施することができます。",
        links: [
          {
            text: "DevOps改善",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "DORA能力",
            url: "https://cloud.google.com/devops/state-of-devops/",
          },
        ],
      },
      en: {
        summary:
          "DORA metrics are more than just measurement tools. By integrating them into continuous improvement processes, organizations can identify bottlenecks and implement prioritized improvement activities.",
        links: [
          {
            text: "DevOps Improvement",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "DORA Capabilities",
            url: "https://cloud.google.com/devops/state-of-devops/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "DORAメトリクスは組織的な改善活動には活用されていない",
          en: "DORA metrics are not utilized for organizational improvement activities",
        },
      },
      {
        value: 33,
        label: {
          ja: "DORAメトリクスが限定的に参照されているが、体系的な改善活動への統合は不十分",
          en: "DORA metrics are referenced in a limited way, but integration into systematic improvement activities is insufficient",
        },
      },
      {
        value: 66,
        label: {
          ja: "DORAメトリクスが定期的なレビューや改善活動に活用され、目標設定の基準になっている",
          en: "DORA metrics are utilized in regular reviews and improvement activities, serving as a basis for goal setting",
        },
      },
      {
        value: 100,
        label: {
          ja: "DORAメトリクスが組織全体の継続的改善サイクルに完全に統合され、データドリブンな意思決定や施策の効果測定に広く活用されている",
          en: "DORA metrics are fully integrated into the organization-wide continuous improvement cycle, widely used for data-driven decision making and measuring the effectiveness of initiatives",
        },
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know",
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  // Advanced Questions (For Comprehensive Assessment or High Maturity)
  {
    id: "dora_7",
    category: "dora_metrics",
    text: {
      ja: "DORAメトリクスに基づいて、組織のソフトウェアデリバリーパフォーマンスの目標をどのように設定していますか？",
      en: "How do you set goals for your organization's software delivery performance based on DORA metrics?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "low",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "dora_5", minValue: 66 }, // Only show if dora_5 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "DORAメトリクスに基づく明確な目標設定は、チームに方向性を与え、進捗を測定するための基準を提供します。これらの目標は、業界ベンチマークと組織の現状を考慮して設定する必要があります。",
        links: [
          {
            text: "DevOps目標設定",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "DORAパフォーマンスクラスター",
            url: "https://cloud.google.com/devops/state-of-devops/",
          },
        ],
      },
      en: {
        summary:
          "Clear goal setting based on DORA metrics provides direction to teams and benchmarks for measuring progress. These goals should be set considering industry benchmarks and the organization's current state.",
        links: [
          {
            text: "DevOps Goal Setting",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "DORA Performance Clusters",
            url: "https://cloud.google.com/devops/state-of-devops/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "DORAメトリクスに基づく明確な目標設定は行われていない",
          en: "No clear goal setting based on DORA metrics",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なDORAメトリクスの目標が設定されているが、体系的なアプローチや定期的な見直しは行われていない",
          en: "Basic DORA metrics goals are set, but without a systematic approach or regular review",
        },
      },
      {
        value: 66,
        label: {
          ja: "DORAメトリクスに基づく具体的な目標が設定され、定期的に進捗が評価され、目標が更新されている",
          en: "Specific goals based on DORA metrics are set, with progress regularly evaluated and goals updated",
        },
      },
      {
        value: 100,
        label: {
          ja: "DORAメトリクスに基づく包括的な目標設定フレームワークが確立され、業界ベンチマーク比較、チーム固有の目標設定、段階的な改善計画が実装されている",
          en: "A comprehensive goal-setting framework based on DORA metrics is established, with industry benchmark comparisons, team-specific goal setting, and phased improvement plans implemented",
        },
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know",
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },
  {
    id: "dora_8",
    category: "dora_metrics",
    text: {
      ja: "DORAメトリクス以外の補完的なソフトウェアデリバリーメトリクスをどのように活用していますか？",
      en: "How do you utilize complementary software delivery metrics beyond the DORA metrics?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "dora_5", minValue: 66 }, // Only show if dora_5 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "DORAの4つの主要メトリクスは重要な基準を提供しますが、プルリクエスト統計、コード品質メトリクス、技術的負債指標などの補完的なメトリクスも、ソフトウェアデリバリープロセスの包括的な理解に役立ちます。",
        links: [
          {
            text: "DORA以外のメトリクス",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "エンジニアリングメトリクス",
            url: "https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/4-key-metrics-automotive",
          },
        ],
      },
      en: {
        summary:
          "While DORA's four key metrics provide important benchmarks, complementary metrics like pull request statistics, code quality metrics, and technical debt indicators also help in comprehensive understanding of the software delivery process.",
        links: [
          {
            text: "Beyond DORA Metrics",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "Engineering Metrics",
            url: "https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/4-key-metrics-automotive",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "DORAメトリクス以外の補完的なメトリクスはほとんど活用されていない",
          en: "Complementary metrics beyond DORA metrics are barely utilized",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な補完メトリクス（プルリクエスト統計、コードカバレッジなど）は収集されているが、体系的な分析や活用は限定的",
          en: "Basic complementary metrics (pull request statistics, code coverage, etc.) are collected, but systematic analysis and utilization are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "DORAメトリクスと補完的なメトリクスを組み合わせた分析が行われ、より包括的なソフトウェアデリバリーの評価に活用されている",
          en: "Analysis combining DORA metrics and complementary metrics is conducted and used for more comprehensive evaluation of software delivery",
        },
      },
      {
        value: 100,
        label: {
          ja: "DORAメトリクスと高度な補完メトリクスを統合したカスタムフレームワークが確立され、技術的負債、開発者体験、ビジネス成果との関連付けなど多面的な分析が実装されている",
          en: "A custom framework integrating DORA metrics and advanced complementary metrics is established, with multifaceted analysis including technical debt, developer experience, and business outcome correlations implemented",
        },
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know",
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },
  {
    id: "dora_9",
    category: "dora_metrics",
    text: {
      ja: "チームや製品間でのDORAメトリクスの違いをどのように分析し、対応していますか？",
      en: "How do you analyze and address differences in DORA metrics across teams and products?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "dora_5", minValue: 66 }, // Only show if dora_5 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "異なるチームや製品間でのDORAメトリクスの差異を理解することは、組織全体のパフォーマンス向上のための重要な洞察を提供します。これにより、ベストプラクティスの共有や特定のチームへの支援が可能になります。",
        links: [
          {
            text: "チームパフォーマンス分析",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "DevOpsベンチマーキング",
            url: "https://cloud.google.com/devops/state-of-devops/",
          },
        ],
      },
      en: {
        summary:
          "Understanding variations in DORA metrics across different teams and products provides crucial insights for improving organization-wide performance. This enables sharing of best practices and targeted support for specific teams.",
        links: [
          {
            text: "Team Performance Analysis",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
          {
            text: "DevOps Benchmarking",
            url: "https://cloud.google.com/devops/state-of-devops/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "チームや製品間のDORAメトリクスの違いはほとんど分析されていない",
          en: "Differences in DORA metrics across teams and products are barely analyzed",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なチーム間比較は行われているが、体系的な分析や対応策の実施は限定的",
          en: "Basic comparisons between teams are conducted, but systematic analysis and implementation of countermeasures are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "定期的にチーム間のメトリクス比較が行われ、差異の根本原因分析やベストプラクティスの共有が実施されている",
          en: "Regular comparisons of metrics between teams are conducted, with root cause analysis of differences and sharing of best practices implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なチーム間分析フレームワークが確立され、コンテキスト考慮型の比較、ベストプラクティスの体系的共有、チーム固有の改善計画が実装されている",
          en: "Advanced cross-team analysis framework is established, with context-aware comparisons, systematic sharing of best practices, and team-specific improvement plans implemented",
        },
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know",
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },
  {
    id: "dora_10",
    category: "dora_metrics",
    text: {
      ja: "DORAメトリクスとビジネス成果（収益、顧客満足度など）の関連をどのように分析し活用していますか？",
      en: "How do you analyze and utilize the relationship between DORA metrics and business outcomes (revenue, customer satisfaction, etc.)?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "low",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "dora_6", minValue: 66 }, // Only show if dora_6 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "DORAメトリクスの本当の価値は、ビジネス成果との関連を理解することにあります。デリバリーパフォーマンスの向上が収益、顧客満足度、市場シェアなどのビジネス指標にどのように影響するかを分析することで、技術的な改善の戦略的価値を明確にすることができます。",
        links: [
          {
            text: "DevOpsビジネスインパクト",
            url: "https://cloud.google.com/blog/products/devops-sre/the-2019-accelerate-state-of-devops-elite-performance-productivity-and-scaling",
          },
          {
            text: "DORAビジネス成果",
            url: "https://cloud.google.com/devops/state-of-devops/",
          },
        ],
      },
      en: {
        summary:
          "The true value of DORA metrics lies in understanding their relationship to business outcomes. By analyzing how improved delivery performance affects business indicators like revenue, customer satisfaction, and market share, the strategic value of technical improvements can be clarified.",
        links: [
          {
            text: "DevOps Business Impact",
            url: "https://cloud.google.com/blog/products/devops-sre/the-2019-accelerate-state-of-devops-elite-performance-productivity-and-scaling",
          },
          {
            text: "DORA Business Outcomes",
            url: "https://cloud.google.com/devops/state-of-devops/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "DORAメトリクスとビジネス成果の関連はほとんど分析されていない",
          en: "The relationship between DORA metrics and business outcomes is barely analyzed",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な関連性の認識はあるが、体系的な分析や定量化は行われていない",
          en: "Basic recognition of the relationship exists, but systematic analysis or quantification is not conducted",
        },
      },
      {
        value: 66,
        label: {
          ja: "DORAメトリクスとビジネス成果の関連が定期的に分析され、技術的改善の優先順位付けに活用されている",
          en: "The relationship between DORA metrics and business outcomes is regularly analyzed and utilized for prioritizing technical improvements",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な分析フレームワークが確立され、DORAメトリクスとビジネスKPIの相関分析、ROI計算、戦略的投資判断への活用が実装されている",
          en: "Advanced analysis framework is established, with correlation analysis between DORA metrics and business KPIs, ROI calculations, and utilization for strategic investment decisions implemented",
        },
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know",
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },
];
