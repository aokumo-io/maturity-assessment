/**
 * アプリケーション移行とモダナイゼーション質問モジュール
 *
 * クラウドネイティブへのアプリケーション移行と近代化に関する質問を定義するモジュールです。
 * リフト＆シフト、リファクタリング、リプラットフォーム戦略などの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const appMigrationModernizationQuestions: AssessmentQuestion[] = [
  {
    id: "mod_1",
    category: "app_migration_modernization",
    text: {
      ja: "レガシーアプリケーションのクラウドネイティブへの移行戦略をどのように策定・実行していますか？",
      en: "How do you develop and execute your strategy for migrating legacy applications to cloud native?",
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
          "アプリケーション移行戦略は、レガシーシステムからクラウドネイティブ環境への効果的な移行パスを提供します。リフト＆シフト、リファクタリング、リアーキテクト、リプラットフォーム、リプレイスなどの選択肢があります。",
        links: [
          {
            text: "アプリケーション移行パターン",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/6-strategies-for-migrating-applications-to-the-cloud/",
          },
          {
            text: "クラウド移行戦略",
            url: "https://cloud.google.com/architecture/migrations",
          },
        ],
      },
      en: {
        summary:
          "Application migration strategies provide effective paths from legacy systems to cloud-native environments. Options include lift & shift, refactoring, rearchitecting, replatforming, and replacing.",
        links: [
          {
            text: "Application Migration Patterns",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/6-strategies-for-migrating-applications-to-the-cloud/",
          },
          {
            text: "Cloud Migration Strategy",
            url: "https://cloud.google.com/architecture/migrations",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的な移行戦略はなく、アプリケーション移行は個別プロジェクトとして計画されている",
          en: "No systematic migration strategy exists; application migrations are planned as individual projects",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な移行フレームワーク（6Rなど）は採用されているが、包括的な評価や優先順位付けプロセスは不十分",
          en: "Basic migration frameworks (such as 6R) are adopted, but comprehensive evaluation and prioritization processes are insufficient",
        },
      },
      {
        value: 66,
        label: {
          ja: "詳細な評価基準に基づく体系的な移行戦略が確立され、ビジネス価値、技術的複雑性、リスクなどを考慮した優先順位付けが行われている",
          en: "A systematic migration strategy based on detailed evaluation criteria is established, with prioritization considering business value, technical complexity, and risks",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に最適化された移行戦略が実装され、自動化されたアプリケーション評価、パターン化された移行アプローチ、継続的な価値測定など、包括的なモダナイゼーションプログラムが確立されている",
          en: "A highly optimized migration strategy is implemented with automated application assessment, patterned migration approaches, and continuous value measurement in a comprehensive modernization program",
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
    id: "mod_2",
    category: "app_migration_modernization",
    text: {
      ja: "クラウドネイティブとレガシーシステムの共存環境をどのように管理していますか？",
      en: "How do you manage the coexistence of cloud native and legacy systems?",
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
          "移行期間中は、クラウドネイティブとレガシーシステムが共存することが一般的です。効果的な統合、データ同期、一貫した運用管理が重要です。",
        links: [
          {
            text: "ハイブリッドアーキテクチャ",
            url: "https://docs.microsoft.com/en-us/azure/architecture/hybrid/",
          },
          {
            text: "レガシー統合",
            url: "https://www.redhat.com/en/topics/ai/ai-ml-use-cases",
          },
        ],
      },
      en: {
        summary:
          "During migration periods, cloud-native and legacy systems commonly coexist. Effective integration, data synchronization, and consistent operational management are essential.",
        links: [
          {
            text: "Hybrid Architecture",
            url: "https://docs.microsoft.com/en-us/azure/architecture/hybrid/",
          },
          {
            text: "Legacy Integration",
            url: "https://www.redhat.com/en/topics/ai/ai-ml-use-cases",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラウドネイティブとレガシーシステムは別々に管理され、統合戦略や共通の運用アプローチがない",
          en: "Cloud-native and legacy systems are managed separately with no integration strategy or common operational approach",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な統合ポイントは確立されているが、一貫した運用モデルや可観測性の統合は限定的",
          en: "Basic integration points are established, but consistent operational models and observability integration are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "APIゲートウェイやサービスメッシュなどを活用した体系的な統合アプローチが確立され、一貫した運用モデルと監視が実装されている",
          en: "A systematic integration approach using API gateways and service meshes is established with consistent operational models and monitoring",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なハイブリッド運用モデルが確立され、統合されたデプロイパイプライン、一貫した可観測性、自動化された障害検出と回復など、シームレスな管理が実現されている",
          en: "An advanced hybrid operational model is established with integrated deployment pipelines, consistent observability, and automated fault detection and recovery for seamless management",
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
    id: "mod_3",
    category: "app_migration_modernization",
    text: {
      ja: "アプリケーションの現状評価と移行の優先順位付けをどのように行っていますか？",
      en: "How do you assess the current state of applications and prioritize migration?",
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
          "アプリケーションポートフォリオの評価と優先順位付けは、ビジネス価値、技術的複雑性、リスク、依存関係などの要素を考慮して、最も効果的な移行順序を決定します。",
        links: [
          {
            text: "アプリケーションポートフォリオ評価",
            url: "https://cloud.google.com/solutions/modernize-traditional-applications",
          },
          {
            text: "移行優先順位付け",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/the-art-of-the-possible-a-practical-guide-to-application-migration/",
          },
        ],
      },
      en: {
        summary:
          "Application portfolio assessment and prioritization determine the most effective migration sequence by considering business value, technical complexity, risks, and dependencies.",
        links: [
          {
            text: "Application Portfolio Assessment",
            url: "https://cloud.google.com/solutions/modernize-traditional-applications",
          },
          {
            text: "Migration Prioritization",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/the-art-of-the-possible-a-practical-guide-to-application-migration/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的な評価フレームワークはなく、移行の優先順位は主に直感や単純な要因に基づいて決定されている",
          en: "No systematic assessment framework exists; migration priorities are determined mainly by intuition or simple factors",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な評価基準は存在するが、包括的なポートフォリオ分析や明確な優先順位付けメカニズムは限定的",
          en: "Basic assessment criteria exist, but comprehensive portfolio analysis and clear prioritization mechanisms are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なアプリケーション評価フレームワークが確立され、ビジネス価値、技術的適合性、リスク、依存関係などの多面的な基準に基づいて優先順位付けが行われている",
          en: "A comprehensive application assessment framework is established with prioritization based on multifaceted criteria including business value, technical fit, risks, and dependencies",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なポートフォリオ評価と優先順位付けシステムが標準化され、自動化されたアセスメント、データドリブンな分析、複合的なスコアリングモデル、継続的な再評価などが実装されている",
          en: "An advanced portfolio assessment and prioritization system is standardized with automated assessment, data-driven analysis, composite scoring models, and continuous reassessment",
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
    id: "mod_4",
    category: "app_migration_modernization",
    text: {
      ja: "クラウドネイティブアーキテクチャへのアプリケーションの移行と再設計をどのように進めていますか？",
      en: "How do you approach application migration and redesign for cloud-native architecture?",
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
          "クラウドネイティブアーキテクチャへの移行は、マイクロサービス、コンテナ化、DevOps実践、自動スケーリングなどの原則と技術を採用して、アプリケーションの俊敏性、スケーラビリティ、信頼性を向上させます。",
        links: [
          {
            text: "クラウドネイティブアーキテクチャ",
            url: "https://www.redhat.com/en/topics/cloud-native-apps",
          },
          {
            text: "アプリケーションモダナイゼーション",
            url: "https://cloud.google.com/solutions/application-modernization",
          },
        ],
      },
      en: {
        summary:
          "Migration to cloud-native architecture adopts principles and technologies such as microservices, containerization, DevOps practices, and auto-scaling to improve application agility, scalability, and reliability.",
        links: [
          {
            text: "Cloud Native Architecture",
            url: "https://www.redhat.com/en/topics/cloud-native-apps",
          },
          {
            text: "Application Modernization",
            url: "https://cloud.google.com/solutions/application-modernization",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラウドネイティブアーキテクチャへの移行はほとんど行われておらず、主にリフト＆シフトアプローチに留まっている",
          en: "Little migration to cloud-native architecture is occurring; approaches remain primarily lift-and-shift",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションでクラウドネイティブ原則に基づく再設計が行われているが、体系的なアプローチや標準化されたパターンは限定的",
          en: "Some applications are being redesigned based on cloud-native principles, but systematic approaches and standardized patterns are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なクラウドネイティブ移行フレームワークが確立され、マイクロサービス、コンテナ化、DevOps実践などの原則に基づく再設計が体系的に行われている",
          en: "A comprehensive cloud-native migration framework is established with systematic redesign based on principles of microservices, containerization, and DevOps practices",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なアプリケーションモダナイゼーション戦略が標準化され、ドメイン駆動設計、イベント駆動アーキテクチャ、自動化された移行ツール、パターン化された再設計アプローチなどが完全に実装されている",
          en: "An advanced application modernization strategy is standardized with domain-driven design, event-driven architecture, automated migration tools, and patterned redesign approaches fully implemented",
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
    id: "mod_5",
    category: "app_migration_modernization",
    text: {
      ja: "移行とモダナイゼーションプロセスにおけるリスク管理をどのように行っていますか？",
      en: "How do you manage risks in the migration and modernization process?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "standard",
    dependencies: [{ questionId: "mod_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "移行とモダナイゼーションには、データ損失、サービス中断、性能低下、予期せぬ依存関係などのリスクが伴います。効果的なリスク管理戦略が成功の鍵です。",
        links: [
          {
            text: "移行リスク管理",
            url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/migrate/migration-considerations/assess/risk",
          },
          {
            text: "モダナイゼーションリスク軽減",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/addressing-common-challenges-in-cloud-adoption-managing-risk/",
          },
        ],
      },
      en: {
        summary:
          "Migration and modernization involve risks such as data loss, service disruption, performance degradation, and unexpected dependencies. Effective risk management strategies are key to success.",
        links: [
          {
            text: "Migration Risk Management",
            url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/migrate/migration-considerations/assess/risk",
          },
          {
            text: "Modernization Risk Mitigation",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/addressing-common-challenges-in-cloud-adoption-managing-risk/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "移行とモダナイゼーションに特化したリスク管理は最小限で、主にリアクティブな対応に留まっている",
          en: "Risk management specific to migration and modernization is minimal and primarily reactive",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なリスク識別と軽減策は計画されているが、包括的なリスク管理フレームワークや継続的なリスク評価プロセスは限定的",
          en: "Basic risk identification and mitigation measures are planned, but comprehensive risk management frameworks and continuous risk assessment processes are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なリスク管理フレームワークが確立され、体系的なリスク識別、評価、軽減、モニタリングが実施されている",
          en: "A comprehensive risk management framework is established with systematic risk identification, assessment, mitigation, and monitoring",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なリスク管理戦略が標準化され、予測的リスク分析、自動化されたリスク検出、継続的なリスク監視、データドリブンな意思決定などが実装されている",
          en: "An advanced risk management strategy is standardized with predictive risk analysis, automated risk detection, continuous risk monitoring, and data-driven decision-making",
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
    id: "mod_6",
    category: "app_migration_modernization",
    text: {
      ja: "データ移行と統合をどのように管理していますか？",
      en: "How do you manage data migration and integration?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [{ questionId: "mod_2", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "データ移行と統合は、クラウド移行の重要な側面です。データの整合性、完全性、セキュリティを確保しながら、効率的にデータを移行し、異なるシステム間でのデータフローを確立することが重要です。",
        links: [
          {
            text: "データ移行戦略",
            url: "https://cloud.google.com/database-migration/docs",
          },
          {
            text: "データ統合パターン",
            url: "https://www.redhat.com/en/topics/ai/ai-ml-use-cases",
          },
        ],
      },
      en: {
        summary:
          "Data migration and integration are critical aspects of cloud migration. It's important to migrate data efficiently and establish data flows between different systems while ensuring data integrity, completeness, and security.",
        links: [
          {
            text: "Data Migration Strategies",
            url: "https://cloud.google.com/database-migration/docs",
          },
          {
            text: "Data Integration Patterns",
            url: "https://www.redhat.com/en/topics/ai/ai-ml-use-cases",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データ移行と統合に特化した戦略はほとんどなく、主にアドホックなアプローチに依存している",
          en: "Little strategy specific to data migration and integration exists; approaches are primarily ad hoc",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なデータ移行計画と統合ポイントは確立されているが、包括的なデータ管理戦略や自動化されたプロセスは限定的",
          en: "Basic data migration plans and integration points are established, but comprehensive data management strategies and automated processes are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なデータ移行と統合フレームワークが確立され、データマッピング、変換ルール、検証プロセス、フェイルバック計画などが整備されている",
          en: "A comprehensive data migration and integration framework is established with data mapping, transformation rules, validation processes, and fallback plans",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデータ移行と統合戦略が標準化され、自動化されたデータマイグレーション、リアルタイム同期、データ品質モニタリング、ゼロダウンタイム移行などが実装されている",
          en: "An advanced data migration and integration strategy is standardized with automated data migration, real-time synchronization, data quality monitoring, and zero-downtime migration",
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
    id: "mod_7",
    category: "app_migration_modernization",
    text: {
      ja: "モダナイゼーションの価値測定とROI評価をどのように行っていますか？",
      en: "How do you measure the value and ROI of modernization efforts?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "low",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mod_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "モダナイゼーションの投資効果を評価するためには、コスト削減、開発速度向上、市場投入時間短縮など、定量的および定性的な価値指標を確立することが重要です。",
        links: [
          {
            text: "モダナイゼーションROI",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/measuring-business-value-from-cloud-computing/",
          },
          {
            text: "価値測定",
            url: "https://cloud.google.com/blog/products/cloud-migration/measuring-the-business-impact-of-your-application-modernization-initiative",
          },
        ],
      },
      en: {
        summary:
          "To evaluate the return on modernization investments, it's important to establish quantitative and qualitative value metrics such as cost reduction, development speed improvement, and time-to-market reduction.",
        links: [
          {
            text: "Modernization ROI",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/measuring-business-value-from-cloud-computing/",
          },
          {
            text: "Value Measurement",
            url: "https://cloud.google.com/blog/products/cloud-migration/measuring-the-business-impact-of-your-application-modernization-initiative",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "モダナイゼーションの価値測定やROI評価のための体系的なフレームワークはなく、効果測定は限定的",
          en: "No systematic framework exists for measuring modernization value or ROI; effect measurement is limited",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なコスト分析とパフォーマンス指標は測定されているが、包括的な価値測定フレームワークやビジネスインパクト評価は不十分",
          en: "Basic cost analysis and performance metrics are measured, but comprehensive value measurement frameworks and business impact assessments are insufficient",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的な価値測定フレームワークが確立され、定量的・定性的指標に基づいてモダナイゼーションの効果とROIが評価されている",
          en: "A comprehensive value measurement framework is established, evaluating modernization effects and ROI based on quantitative and qualitative indicators",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な価値実現フレームワークが標準化され、リアルタイム価値追跡、プレディクティブROI分析、ビジネスとITのアラインメント評価、継続的な価値最適化などが実装されている",
          en: "An advanced value realization framework is standardized with real-time value tracking, predictive ROI analysis, business-IT alignment assessment, and continuous value optimization",
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
    id: "mod_8",
    category: "app_migration_modernization",
    text: {
      ja: "アプリケーションモダナイゼーションにおけるDevOpsとCI/CDの統合をどのように実施していますか？",
      en: "How do you implement DevOps and CI/CD integration in application modernization?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mod_4", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "DevOpsとCI/CDの実践は、アプリケーションモダナイゼーションの成功に不可欠です。継続的な統合、テスト、デプロイを通じて、迅速かつ品質の高いリリースが可能になります。",
        links: [
          {
            text: "モダナイゼーションのためのDevOps",
            url: "https://www.redhat.com/en/topics/devops",
          },
          {
            text: "CI/CD統合",
            url: "https://cloud.google.com/architecture/devops",
          },
        ],
      },
      en: {
        summary:
          "DevOps and CI/CD practices are essential for successful application modernization. They enable rapid, high-quality releases through continuous integration, testing, and deployment.",
        links: [
          {
            text: "DevOps for Modernization",
            url: "https://www.redhat.com/en/topics/devops",
          },
          {
            text: "CI/CD Integration",
            url: "https://cloud.google.com/architecture/devops",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "モダナイゼーションプロセスへのDevOpsとCI/CDの統合はほとんどなく、従来の開発・運用モデルが維持されている",
          en: "Little DevOps and CI/CD integration exists in modernization processes; traditional development and operations models are maintained",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のモダナイズされたアプリケーションでDevOpsプラクティスとCI/CDパイプラインが導入されているが、包括的な統合や標準化は限定的",
          en: "DevOps practices and CI/CD pipelines are introduced in some modernized applications, but comprehensive integration and standardization are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "モダナイゼーションプログラム全体にDevOpsとCI/CDが統合され、自動化されたテスト、デプロイ、環境管理などが広く実装されている",
          en: "DevOps and CI/CD are integrated across the modernization program with automated testing, deployment, and environment management widely implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なDevOpsとCI/CDフレームワークがモダナイゼーション戦略に完全に統合され、インフラ自動化、セキュリティ統合、品質ゲート、フィードバックループなどが標準化されている",
          en: "Advanced DevOps and CI/CD frameworks are fully integrated into the modernization strategy with infrastructure automation, security integration, quality gates, and feedback loops standardized",
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
    id: "mod_9",
    category: "app_migration_modernization",
    text: {
      ja: "モノリスをマイクロサービスに分解するアプローチをどのように実施していますか？",
      en: "How do you approach decomposing monoliths into microservices?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mod_4", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "モノリスのマイクロサービス化は、ドメイン駆動設計、境界付きコンテキスト、段階的な分解など、様々なアプローチを活用して効果的に行うことができます。適切な粒度とサービス境界の定義が重要です。",
        links: [
          {
            text: "モノリスからマイクロサービスへ",
            url: "https://martinfowler.com/articles/break-monolith-into-microservices.html",
          },
          {
            text: "ドメイン駆動設計",
            url: "https://docs.microsoft.com/en-us/azure/architecture/microservices/model/domain-driven-design",
          },
        ],
      },
      en: {
        summary:
          "Decomposing monoliths into microservices can be effectively done using various approaches such as domain-driven design, bounded contexts, and incremental decomposition. Defining appropriate granularity and service boundaries is crucial.",
        links: [
          {
            text: "Monolith to Microservices",
            url: "https://martinfowler.com/articles/break-monolith-into-microservices.html",
          },
          {
            text: "Domain Driven Design",
            url: "https://docs.microsoft.com/en-us/azure/architecture/microservices/model/domain-driven-design",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "モノリスからマイクロサービスへの体系的な分解アプローチはなく、主に大規模な書き換えや全面的な置き換えに依存している",
          en: "No systematic decomposition approach from monolith to microservices; primarily relying on large-scale rewrites or complete replacements",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のモノリスで基本的なマイクロサービス化が試みられているが、体系的な分解戦略や明確なサービス境界定義アプローチは限定的",
          en: "Basic microservicification is attempted with some monoliths, but systematic decomposition strategies and clear service boundary definition approaches are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なマイクロサービス化フレームワークが確立され、ドメイン駆動設計、段階的分解、ストラングラーパターンなどの手法が体系的に適用されている",
          en: "A comprehensive microservicification framework is established with systematic application of domain-driven design, incremental decomposition, and strangler patterns",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なモノリス分解戦略が標準化され、自動化された依存関係分析、サービス境界抽出ツール、統合テスト自動化、段階的移行パターンなどが完全に実装されている",
          en: "Advanced monolith decomposition strategies are standardized with automated dependency analysis, service boundary extraction tools, integration test automation, and incremental migration patterns fully implemented",
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
    id: "mod_10",
    category: "app_migration_modernization",
    text: {
      ja: "クラウドネイティブテクノロジーを活用したレガシーアプリケーションのモダナイゼーションをどのように進めていますか？",
      en: "How do you advance legacy application modernization using cloud-native technologies?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mod_4", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "コンテナ化、サーバーレス、サービスメッシュなどのクラウドネイティブテクノロジーを活用することで、レガシーアプリケーションの俊敏性、スケーラビリティ、信頼性を大幅に向上させることができます。",
        links: [
          {
            text: "クラウドネイティブモダナイゼーション",
            url: "https://www.cncf.io/blog/2017/05/15/developing-cloud-native-applications/",
          },
          {
            text: "サーバーレスモダナイゼーション",
            url: "https://aws.amazon.com/lambda/serverless-architectures-learn-more/",
          },
        ],
      },
      en: {
        summary:
          "Leveraging cloud-native technologies such as containerization, serverless, and service mesh can significantly improve the agility, scalability, and reliability of legacy applications.",
        links: [
          {
            text: "Cloud Native Modernization",
            url: "https://www.cncf.io/blog/2017/05/15/developing-cloud-native-applications/",
          },
          {
            text: "Serverless Modernization",
            url: "https://aws.amazon.com/lambda/serverless-architectures-learn-more/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラウドネイティブテクノロジーの活用は限定的で、主に従来のアーキテクチャと技術スタックを維持している",
          en: "Cloud-native technology utilization is limited; primarily maintaining traditional architectures and technology stacks",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションでコンテナ化やマイクロサービスなどの基本的なクラウドネイティブテクノロジーが試験的に採用されているが、包括的な戦略や標準化はまだ進行中",
          en: "Basic cloud-native technologies like containerization and microservices are experimentally adopted in some applications, but comprehensive strategies and standardization are still in progress",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なクラウドネイティブテクノロジー（コンテナ、オーケストレーション、サービスメッシュなど）が広く採用され、レガシーアプリケーションのモダナイゼーションに体系的に適用されている",
          en: "Key cloud-native technologies (containers, orchestration, service mesh) are widely adopted and systematically applied to legacy application modernization",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なクラウドネイティブモダナイゼーション戦略が標準化され、サーバーレス、イベント駆動アーキテクチャ、メッシュサービス、API駆動開発などの最先端技術とプラクティスが完全に実装されている",
          en: "Advanced cloud-native modernization strategies are standardized with cutting-edge technologies and practices including serverless, event-driven architecture, mesh services, and API-driven development fully implemented",
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
    id: "mod_11",
    category: "app_migration_modernization",
    text: {
      ja: "移行とモダナイゼーションのための自動化ツールと加速器をどのように活用していますか？",
      en: "How do you leverage automation tools and accelerators for migration and modernization?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mod_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "移行とモダナイゼーションの自動化ツールは、コード変換、依存関係分析、環境複製、テスト自動化などのタスクを効率化し、プロセス全体を加速します。",
        links: [
          { text: "移行ツール", url: "https://aws.amazon.com/migration-hub/" },
          {
            text: "モダナイゼーション加速器",
            url: "https://cloud.google.com/migrate/containers/docs",
          },
        ],
      },
      en: {
        summary:
          "Migration and modernization automation tools streamline tasks such as code conversion, dependency analysis, environment replication, and test automation, accelerating the overall process.",
        links: [
          {
            text: "Migration Tools",
            url: "https://aws.amazon.com/migration-hub/",
          },
          {
            text: "Modernization Accelerators",
            url: "https://cloud.google.com/migrate/containers/docs",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "移行とモダナイゼーションのための自動化ツールはほとんど活用されておらず、主に手動プロセスに依存している",
          en: "Automation tools for migration and modernization are hardly utilized; primarily relying on manual processes",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な移行ツールや自動化スクリプトは一部使用されているが、包括的なツールセットや体系的な活用戦略は限定的",
          en: "Basic migration tools and automation scripts are used in some cases, but comprehensive toolsets and systematic utilization strategies are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的な自動化ツールと加速器が採用され、コード分析、移行計画、環境複製、テスト自動化などの主要プロセスが効率化されている",
          en: "Comprehensive automation tools and accelerators are adopted, streamlining key processes including code analysis, migration planning, environment replication, and test automation",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な移行・モダナイゼーション自動化プラットフォームが標準化され、AI支援コード変換、自動依存関係マッピング、エンドツーエンドテスト自動化、移行進捗追跡などが完全に実装されている",
          en: "Advanced migration and modernization automation platforms are standardized with AI-assisted code conversion, automated dependency mapping, end-to-end test automation, and migration progress tracking fully implemented",
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
    id: "mod_12",
    category: "app_migration_modernization",
    text: {
      ja: "移行とモダナイゼーションにおけるAPI戦略をどのように実装していますか？",
      en: "How do you implement API strategy in migration and modernization?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mod_2", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なAPI戦略は、レガシーシステムとモダンアプリケーション間の統合を容易にし、段階的なモダナイゼーションを可能にします。APIゲートウェイ、ファサード、バージョニングなどの手法が重要です。",
        links: [
          {
            text: "API戦略",
            url: "https://cloud.google.com/apis/design",
          },
          {
            text: "APIリードモダナイゼーション",
            url: "https://www.redhat.com/en/topics/integration/what-are-apis",
          },
        ],
      },
      en: {
        summary:
          "An effective API strategy facilitates integration between legacy systems and modern applications, enabling incremental modernization. Techniques such as API gateways, facades, and versioning are important.",
        links: [
          {
            text: "API Strategy",
            url: "https://cloud.google.com/apis/design",
          },
          {
            text: "API-led Modernization",
            url: "https://www.redhat.com/en/topics/integration/what-are-apis",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的なAPI戦略はなく、API開発は主にアドホックに行われている",
          en: "No systematic API strategy exists; API development is primarily ad hoc",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なAPIが開発されているが、包括的な設計標準、ライフサイクル管理、ガバナンスなどは限定的",
          en: "Basic APIs are developed, but comprehensive design standards, lifecycle management, and governance are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なAPI戦略が確立され、API設計標準、ゲートウェイ管理、バージョニング、文書化などのプラクティスが広く採用されている",
          en: "A comprehensive API strategy is established with API design standards, gateway management, versioning, and documentation practices widely adopted",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なAPI駆動戦略が標準化され、APIファースト設計、マイクロゲートウェイ、自動API生成、高度なAPI分析、セキュリティなどが完全に実装されている",
          en: "An advanced API-driven strategy is standardized with API-first design, micro-gateways, automated API generation, advanced API analytics, and security fully implemented",
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
    id: "mod_13",
    category: "app_migration_modernization",
    text: {
      ja: "モダナイゼーションプロセスにおけるセキュリティとコンプライアンスをどのように確保していますか？",
      en: "How do you ensure security and compliance in the modernization process?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mod_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "アプリケーションの移行とモダナイゼーションにおいて、セキュリティとコンプライアンスを確保することは非常に重要です。脆弱性スキャン、アイデンティティ管理、暗号化、コンプライアンスチェックなどが含まれます。",
        links: [
          {
            text: "セキュアな移行",
            url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-security-management",
          },
          {
            text: "モダナイゼーションにおけるコンプライアンス",
            url: "https://aws.amazon.com/blogs/security/compliance-in-the-cloud-for-new-financial-services-applications/",
          },
        ],
      },
      en: {
        summary:
          "Ensuring security and compliance in application migration and modernization is critical. This includes vulnerability scanning, identity management, encryption, and compliance checks.",
        links: [
          {
            text: "Secure Migration",
            url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-security-management",
          },
          {
            text: "Compliance in Modernization",
            url: "https://aws.amazon.com/blogs/security/compliance-in-the-cloud-for-new-financial-services-applications/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "セキュリティとコンプライアンスに特化したモダナイゼーションアプローチはほとんどなく、従来のセキュリティプラクティスが適用されている",
          en: "Few modernization approaches specific to security and compliance exist; traditional security practices are applied",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なセキュリティ対策とコンプライアンスチェックは行われているが、モダナイゼーションプロセス全体に統合された包括的なアプローチは限定的",
          en: "Basic security measures and compliance checks are implemented, but comprehensive approaches integrated throughout the modernization process are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なセキュリティとコンプライアンスフレームワークがモダナイゼーションプロセスに統合され、セキュリティスキャン、コンプライアンスチェック、リスク評価などが体系的に実施されている",
          en: "A comprehensive security and compliance framework is integrated into the modernization process with systematic security scanning, compliance checks, and risk assessments",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なセキュリティ駆動型モダナイゼーション戦略が標準化され、セキュリティ・アズ・コード、自動化されたコンプライアンス検証、継続的な脆弱性評価、プライバシー・バイ・デザインなどが完全に実装されている",
          en: "An advanced security-driven modernization strategy is standardized with security-as-code, automated compliance verification, continuous vulnerability assessment, and privacy-by-design fully implemented",
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
    id: "mod_14",
    category: "app_migration_modernization",
    text: {
      ja: "クラウドネイティブパターンとプラクティスをレガシーアプリケーションにどのように適用していますか？",
      en: "How do you apply cloud-native patterns and practices to legacy applications?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mod_4", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドネイティブパターン（サーキットブレーカー、バルクヘッド、サイドカー、コンフィグマップなど）とプラクティス（不変インフラ、Infrastructure as Code、カオスエンジニアリングなど）をレガシーアプリケーションに適用することで、復元力、スケーラビリティ、保守性を向上させることができます。",
        links: [
          {
            text: "クラウドネイティブパターン",
            url: "https://www.cncf.io/blog/2017/05/15/developing-cloud-native-applications",
          },
          {
            text: "レジリエンスパターン",
            url: "https://docs.microsoft.com/en-us/azure/architecture/patterns/category/resiliency",
          },
        ],
      },
      en: {
        summary:
          "Applying cloud-native patterns (circuit breaker, bulkhead, sidecar, config maps) and practices (immutable infrastructure, Infrastructure as Code, chaos engineering) to legacy applications can improve resilience, scalability, and maintainability.",
        links: [
          {
            text: "Cloud Native Patterns",
            url: "https://www.cncf.io/blog/2017/05/15/developing-cloud-native-applications",
          },
          {
            text: "Resilience Patterns",
            url: "https://docs.microsoft.com/en-us/azure/architecture/patterns/category/resiliency",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラウドネイティブパターンとプラクティスはレガシーアプリケーションにほとんど適用されていない",
          en: "Cloud-native patterns and practices are rarely applied to legacy applications",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のレガシーアプリケーションで基本的なクラウドネイティブパターンが試験的に採用されているが、体系的なアプローチや広範な実装は限定的",
          en: "Basic cloud-native patterns are experimentally adopted in some legacy applications, but systematic approaches and widespread implementation are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なクラウドネイティブパターンとプラクティスがレガシーアプリケーションに広く適用され、復元力、スケーラビリティ、運用効率が向上している",
          en: "Key cloud-native patterns and practices are widely applied to legacy applications, improving resilience, scalability, and operational efficiency",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なクラウドネイティブパターン戦略が標準化され、複数のパターンを組み合わせた包括的なアプローチ、パターンライブラリ、自動適用ツール、継続的な最適化などが実装されている",
          en: "Advanced cloud-native pattern strategies are standardized with comprehensive approaches combining multiple patterns, pattern libraries, automated application tools, and continuous optimization",
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
    id: "mod_15",
    category: "app_migration_modernization",
    text: {
      ja: "移行とモダナイゼーションプロジェクトにおける組織の変革管理をどのように行っていますか？",
      en: "How do you manage organizational change in migration and modernization projects?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "optional",
    dependencies: [{ questionId: "mod_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "アプリケーションのモダナイゼーションは技術的な変革だけでなく、組織的な変革も必要とします。スキル開発、文化変革、組織構造の再編、ステークホルダー管理などが重要な側面です。",
        links: [
          {
            text: "変革管理",
            url: "https://cloud.google.com/architecture/migration-to-gcp-getting-started#organizational_change_management",
          },
          {
            text: "文化的変革",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/the-cloud-operating-model-for-the-digital-age/",
          },
        ],
      },
      en: {
        summary:
          "Application modernization requires not only technical transformation but also organizational change. Skill development, cultural transformation, organizational restructuring, and stakeholder management are important aspects.",
        links: [
          {
            text: "Change Management",
            url: "https://cloud.google.com/architecture/migration-to-gcp-getting-started#organizational_change_management",
          },
          {
            text: "Cultural Transformation",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/the-cloud-operating-model-for-the-digital-age/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "移行とモダナイゼーションに特化した変革管理はほとんど行われておらず、主に技術的側面に焦点が当てられている",
          en: "Little change management specific to migration and modernization is performed; focus is primarily on technical aspects",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な変革管理活動（トレーニング、コミュニケーションなど）は実施されているが、包括的な変革戦略や文化的側面への対応は限定的",
          en: "Basic change management activities (training, communication, etc.) are implemented, but comprehensive transformation strategies and cultural aspect responses are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的な変革管理プログラムが確立され、スキル開発、組織構造の調整、文化変革、ステークホルダー管理などが体系的に実施されている",
          en: "A comprehensive change management program is established with systematic skill development, organizational structure adjustment, cultural transformation, and stakeholder management",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な組織変革モデルが標準化され、ビジネスと技術の緊密な連携、継続的な学習文化、自己組織化チーム、データドリブンな変革管理などが完全に実装されている",
          en: "An advanced organizational transformation model is standardized with close business-technology alignment, continuous learning culture, self-organizing teams, and data-driven change management fully implemented",
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
    id: "mod_16",
    category: "app_migration_modernization",
    text: {
      ja: "モダナイゼーションにおけるクラウドネイティブデータベースとデータサービスの採用をどのように進めていますか？",
      en: "How do you advance the adoption of cloud-native databases and data services in modernization?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mod_4", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドネイティブデータベースとデータサービス（NoSQL、NewSQL、サーバーレスデータベース、データストリーミングなど）の採用は、スケーラビリティ、弾力性、パフォーマンスを向上させる重要な要素です。",
        links: [
          {
            text: "クラウドネイティブデータベース",
            url: "https://cloud.google.com/products/databases",
          },
          {
            text: "データベースモダナイゼーション",
            url: "https://aws.amazon.com/blogs/database/best-practices-for-database-modernization/",
          },
        ],
      },
      en: {
        summary:
          "Adopting cloud-native databases and data services (NoSQL, NewSQL, serverless databases, data streaming, etc.) is a crucial element for improving scalability, elasticity, and performance.",
        links: [
          {
            text: "Cloud Native Databases",
            url: "https://cloud.google.com/products/databases",
          },
          {
            text: "Database Modernization",
            url: "https://aws.amazon.com/blogs/database/best-practices-for-database-modernization/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラウドネイティブデータベースとデータサービスの採用はほとんど進んでおらず、主に従来のリレーショナルデータベースが使用されている",
          en: "Adoption of cloud-native databases and data services has hardly progressed; primarily traditional relational databases are used",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のユースケースでクラウドネイティブデータベースが試験的に採用されているが、包括的なデータモダナイゼーション戦略や広範な実装は限定的",
          en: "Cloud-native databases are experimentally adopted in some use cases, but comprehensive data modernization strategies and wide-ranging implementation are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なユースケースに適したクラウドネイティブデータベースとデータサービスが広く採用され、データモデルの最適化、移行戦略、運用プラクティスが確立されている",
          en: "Cloud-native databases and data services suited to key use cases are widely adopted with data model optimization, migration strategies, and operational practices established",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデータモダナイゼーション戦略が標準化され、ポリグロット永続化、目的適合型データストア、データメッシュアーキテクチャ、ハイブリッドトランザクション/分析処理などが完全に実装されている",
          en: "Advanced data modernization strategies are standardized with polyglot persistence, purpose-fit data stores, data mesh architecture, and hybrid transactional/analytical processing fully implemented",
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
    id: "mod_17",
    category: "app_migration_modernization",
    text: {
      ja: "モダナイゼーションにおけるAIと機械学習の活用をどのように進めていますか？",
      en: "How do you advance the utilization of AI and machine learning in modernization?"
    },
    weight: 1,
    maturityImportance: 'medium',
    roleRelevance: {
      executive: 'medium',
      manager: 'medium',
      practitioner: 'high'
    },
    assessmentType: 'optional',
    dependencies: [
      { questionId: "mod_4", minValue: 66 }
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary: "AIと機械学習は、レガシーコードの分析、最適な移行パスの特定、テスト自動化、インテリジェントな監視など、アプリケーションモダナイゼーションの様々な側面で活用できます。",
        links: [
          { text: "モダナイゼーションにおけるAI", url: "https://cloud.google.com/blog/products/ai-machine-learning/how-to-modernize-your-ai-ml-systems" },
          { text: "レガシー分析のためのML", url: "https://www.redhat.com/en/topics/ai/what-is-aiops" }
        ]
      },
      en: {
        summary: "AI and machine learning can be utilized in various aspects of application modernization, such as legacy code analysis, identifying optimal migration paths, test automation, and intelligent monitoring.",
        links: [
          { text: "AI in Modernization", url: "https://cloud.google.com/blog/products/ai-machine-learning/how-to-modernize-your-ai-ml-systems" },
          { text: "ML for Legacy Analysis", url: "https://www.redhat.com/en/topics/ai/what-is-aiops" }
        ]
      }
    },
    options: [
      {
        value: 0,
        label: {
          ja: "モダナイゼーションプロセスにおけるAIと機械学習の活用はほとんどない",
          en: "There is little utilization of AI and machine learning in the modernization process"
        }
      },
      {
        value: 33,
        label: {
          ja: "一部の限定的な領域でAIと機械学習が試験的に活用されているが、包括的な戦略や広範な実装は進んでいない",
          en: "AI and machine learning are experimentally utilized in some limited areas, but comprehensive strategies and wide-ranging implementation have not progressed"
        }
      },
      {
        value: 66,
        label: {
          ja: "主要なモダナイゼーション領域（コード分析、テスト自動化、パターン検出など）でAIと機械学習が広く活用されている",
          en: "AI and machine learning are widely utilized in key modernization areas (code analysis, test automation, pattern detection, etc.)"
        }
      },
      {
        value: 100,
        label: {
          ja: "高度なAI駆動型モダナイゼーション戦略が標準化され、自動コード変換、インテリジェントリファクタリング提案、自己修復システム、予測的リソース最適化などが実装されている",
          en: "Advanced AI-driven modernization strategies are standardized with automated code conversion, intelligent refactoring suggestions, self-healing systems, and predictive resource optimization implemented"
        }
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know"
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic."
        }
      }
    ]
  },

  {
    id: "mod_18",
    category: "app_migration_modernization",
    text: {
      ja: "モダナイゼーション後の運用最適化と継続的改善をどのように行っていますか？",
      en: "How do you perform operational optimization and continuous improvement after modernization?"
    },
    weight: 1,
    maturityImportance: 'high',
    roleRelevance: {
      executive: 'medium',
      manager: 'high',
      practitioner: 'high'
    },
    assessmentType: 'optional',
    dependencies: [
      { questionId: "mod_1", minValue: 66 }
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary: "モダナイゼーションは一度限りのプロジェクトではなく、継続的なプロセスです。運用最適化、パフォーマンスチューニング、コスト最適化、技術的負債の管理などの継続的な取り組みが重要です。",
        links: [
          { text: "モダナイゼーション後の最適化", url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/optimize/" },
          { text: "継続的改善", url: "https://cloud.google.com/architecture/framework/operational-excellence/implement-continuous-optimization" }
        ]
      },
      en: {
        summary: "Modernization is not a one-time project but a continuous process. Ongoing efforts such as operational optimization, performance tuning, cost optimization, and technical debt management are important.",
        links: [
          { text: "Post-Modernization Optimization", url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/optimize/" },
          { text: "Continuous Improvement", url: "https://cloud.google.com/architecture/framework/operational-excellence/implement-continuous-optimization" }
        ]
      }
    },
    options: [
      {
        value: 0,
        label: {
          ja: "モダナイゼーション後の運用最適化と継続的改善の体系的なアプローチはほとんどなく、主にリアクティブな対応が行われている",
          en: "Few systematic approaches to operational optimization and continuous improvement after modernization exist; responses are primarily reactive"
        }
      },
      {
        value: 33,
        label: {
          ja: "基本的なモニタリングと最適化活動は行われているが、包括的な継続的改善フレームワークや自動化された最適化は限定的",
          en: "Basic monitoring and optimization activities are performed, but comprehensive continuous improvement frameworks and automated optimization are limited"
        }
      },
      {
        value: 66,
        label: {
          ja: "包括的な運用最適化と継続的改善プログラムが確立され、パフォーマンス最適化、コスト管理、技術的負債削減などが体系的に実施されている",
          en: "A comprehensive operational optimization and continuous improvement program is established with systematic performance optimization, cost management, and technical debt reduction"
        }
      },
      {
        value: 100,
        label: {
          ja: "高度な継続的最適化フレームワークが標準化され、自動パフォーマンスチューニング、AIベースの異常検出、予測的スケーリング、コスト効率の自動最適化などが実装されている",
          en: "An advanced continuous optimization framework is standardized with automated performance tuning, AI-based anomaly detection, predictive scaling, and automatic cost efficiency optimization implemented"
        }
      },
      {
        value: -1,
        label: {
          ja: "わかりません",
          en: "I don't know"
        },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic."
        }
      }
    ]
  }
];
