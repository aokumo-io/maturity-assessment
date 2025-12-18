/**
 * 運用とレジリエンスに関する質問モジュール
 *
 * このモジュールは、インシデント管理、ディザスタリカバリ、高可用性、
 * 耐障害性など、クラウドネイティブシステムの運用レジリエンスに関する
 * 質問を提供します。
 *
 * ベストプラクティスに基づく運用プロセス、障害対応、継続性計画などの
 * 成熟度を評価する質問が含まれています。
 */

import { AssessmentQuestion } from "@shared/schema";

/**
 * 運用とレジリエンスカテゴリの質問リスト
 */
export const operationsResilienceQuestions: AssessmentQuestion[] = [
  {
    id: "ops_1",
    category: "operations_resilience",
    text: {
      ja: "インシデント管理と対応はどのように実装されていますか？",
      en: "How is incident management and response implemented?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なインシデント管理と対応プロセスは、問題の迅速な検出、分類、対応、解決を可能にし、サービスの中断を最小限に抑えます。",
        links: [
          {
            text: "インシデント管理",
            url: "https://cloud.google.com/architecture/framework/operational-excellence/incident-management",
          },
          {
            text: "SREインシデント対応",
            url: "https://sre.google/sre-book/managing-incidents/",
          },
        ],
      },
      en: {
        summary:
          "Effective incident management and response processes enable rapid detection, classification, response, and resolution of problems, minimizing service disruptions.",
        links: [
          {
            text: "Incident Management",
            url: "https://cloud.google.com/architecture/framework/operational-excellence/incident-management",
          },
          {
            text: "SRE Incident Response",
            url: "https://sre.google/sre-book/managing-incidents/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的なインシデント管理プロセスはなく、問題への対応は主に反応的でアドホックに行われている",
          en: "No systematic incident management process exists, and problem response is primarily reactive and ad hoc",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なインシデント対応プロセスは存在するが、役割や手順が標準化されておらず、ツールの統合も限定的",
          en: "Basic incident response processes exist, but roles and procedures are not standardized, and tool integration is limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なインシデント管理フレームワークが確立され、明確な役割、エスカレーションパス、対応プロセス、事後分析が標準化されている",
          en: "A comprehensive incident management framework is established, with clear roles, escalation paths, response processes, and post-mortems standardized",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なインシデント管理が組織全体で実装され、自動検出、インテリジェントな分類、事前定義された対応プレイブック、詳細な分析と継続的改善のサイクルが標準化されている",
          en: "Advanced incident management is implemented organization-wide, with automated detection, intelligent classification, predefined response playbooks, detailed analysis, and continuous improvement cycles standardized",
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
    id: "ops_2",
    category: "operations_resilience",
    text: {
      ja: "ディザスタリカバリ計画はどの程度包括的ですか？",
      en: "How comprehensive is your disaster recovery plan?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "包括的なディザスタリカバリ計画は、大規模な障害やリージョン全体の停止など、重大な障害発生時にもビジネス継続性を確保します。これには、明確に定義されたRTO（目標復旧時間）とRPO（目標復旧時点）、および詳細な復旧手順が含まれます。",
        links: [
          {
            text: "ディザスタリカバリ計画",
            url: "https://cloud.google.com/architecture/dr-scenarios-planning-guide",
          },
          {
            text: "RTOとRPOの定義",
            url: "https://docs.aws.amazon.com/ja_jp/wellarchitected/latest/reliability-pillar/welcome.html",
          },
        ],
      },
      en: {
        summary:
          "A comprehensive disaster recovery plan ensures business continuity even during major failures such as large-scale outages or entire region shutdowns. This includes clearly defined RTOs (Recovery Time Objectives) and RPOs (Recovery Point Objectives), as well as detailed recovery procedures.",
        links: [
          {
            text: "Disaster Recovery Planning",
            url: "https://cloud.google.com/architecture/dr-scenarios-planning-guide",
          },
          {
            text: "RTO and RPO Definitions",
            url: "https://docs.aws.amazon.com/pdfs/wellarchitected/latest/reliability-pillar/wellarchitected-reliability-pillar.pdf",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的なディザスタリカバリ計画はなく、基本的なバックアップ以外の準備はほとんどない",
          en: "No systematic disaster recovery plan exists, with little preparation beyond basic backups",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なディザスタリカバリ計画は存在するが、RTOやRPOの定義が不明確であり、体系的なテストも行われていない",
          en: "A basic disaster recovery plan exists, but RTO and RPO definitions are unclear, and systematic testing is not conducted",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なディザスタリカバリ計画が確立され、明確なRTOとRPO、詳細な復旧手順、定期的なテストが実施されている",
          en: "A comprehensive disaster recovery plan is established, with clear RTOs and RPOs, detailed recovery procedures, and regular testing",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なディザスタリカバリ戦略が実装され、自動フェイルオーバー、複数のリカバリシナリオ、継続的なテスト、事業継続性計画との統合などが標準化されている",
          en: "Advanced disaster recovery strategies are implemented, with automated failover, multiple recovery scenarios, continuous testing, integration with business continuity plans, etc. standardized",
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
    id: "ops_3",
    category: "operations_resilience",
    text: {
      ja: "高可用性はどのように実装されていますか？",
      en: "How is high availability implemented?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "高可用性アーキテクチャは、単一障害点を排除し、障害発生時の自動フェイルオーバーを提供することで、システムの信頼性とレジリエンスを向上させます。",
        links: [
          {
            text: "高可用性設計",
            url: "https://docs.aws.amazon.com/whitepapers/latest/migrating-magento-open-source-adobe-commerce-to-aws/architecture.html",
          },
          {
            text: "HAベストプラクティス",
            url: "https://cloud.google.com/architecture/framework/reliability?hl=ja",
          },
        ],
      },
      en: {
        summary:
          "High availability architecture improves system reliability and resilience by eliminating single points of failure and providing automated failover during failures.",
        links: [
          {
            text: "High Availability Design",
            url: "https://docs.aws.amazon.com/whitepapers/latest/migrating-magento-open-source-adobe-commerce-to-aws/architecture.html",
          },
          {
            text: "HA Best Practices",
            url: "https://cloud.google.com/architecture/framework/reliability",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "高可用性の仕組みはほとんど実装されておらず、多くのコンポーネントに単一障害点が存在する",
          en: "High availability mechanisms are barely implemented, with single points of failure existing in many components",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の重要なシステムで基本的な高可用性機能が実装されているが、包括的なアプローチではない",
          en: "Basic high availability features are implemented for some critical systems, but it's not a comprehensive approach",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なシステムに包括的な高可用性アーキテクチャが実装され、冗長性、負荷分散、自動フェイルオーバーなどが標準化されている",
          en: "Comprehensive high availability architecture is implemented for major systems, with redundancy, load balancing, automated failover, etc. standardized",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な高可用性設計が全システムに実装され、マルチリージョン/マルチゾーン配置、自動スケーリング、アクティブ-アクティブ構成、障害検出と自動復旧などが標準化されている",
          en: "Advanced high availability design is implemented for all systems, with multi-region/multi-zone deployment, automatic scaling, active-active configuration, failure detection and automated recovery, etc. standardized",
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
    id: "ops_4",
    category: "operations_resilience",
    text: {
      ja: "運用レジリエンスのテストはどのように実施されていますか？",
      en: "How is operational resilience testing conducted?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "レジリエンステストにより、障害や災害が実際に発生する前に、システムの回復力を検証し、弱点を特定することができます。定期的なテストは、実際の障害発生時に復旧手順が効果的に機能することを確保します。",
        links: [
          {
            text: "レジリエンステスト",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/test-reliability.html",
          },
          {
            text: "DRテストアプローチ",
            url: "https://cloud.google.com/architecture/framework/reliability/perform-testing-for-recovery-from-failures?hl=ja",
          },
        ],
      },
      en: {
        summary:
          "Resilience testing allows verification of system recovery capabilities and identification of weaknesses before failures or disasters actually occur. Regular testing ensures that recovery procedures function effectively during actual failures.",
        links: [
          {
            text: "Resilience Testing",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/test-reliability.html",
          },
          {
            text: "DR Testing Approaches",
            url: "https://cloud.google.com/architecture/framework/reliability/perform-testing-for-recovery-from-failures",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "レジリエンスのテストはほとんど行われておらず、実際の障害発生時に初めて復旧能力が試される",
          en: "Resilience testing is barely conducted, with recovery capabilities tested for the first time during actual failures",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なレジリエンステストが不定期に行われているが、包括的な計画やシナリオカバレッジは限定的",
          en: "Basic resilience testing is conducted irregularly, but comprehensive planning and scenario coverage are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なレジリエンステスト戦略が確立され、定期的なDRテスト、フェイルオーバーテスト、復旧シミュレーションが実施されている",
          en: "A comprehensive resilience testing strategy is established, with regular DR tests, failover tests, and recovery simulations conducted",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なレジリエンステストが標準化され、継続的なテスト、自動化されたカオスエンジニアリング、実環境でのゲームデイ演習、詳細な結果分析と改善サイクルが実装されている",
          en: "Advanced resilience testing is standardized, with continuous testing, automated chaos engineering, game day exercises in production environments, detailed result analysis and improvement cycles implemented",
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
    id: "ops_5",
    category: "operations_resilience",
    text: {
      ja: "サービスレベル指標（SLI）とサービスレベル目標（SLO）はどのように実装されていますか？",
      en: "How are Service Level Indicators (SLIs) and Service Level Objectives (SLOs) implemented?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "ops_1", minValue: 33 }, // Only show if ops_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "SLI（サービスレベル指標）とSLO（サービスレベル目標）は、サービスの信頼性と性能を客観的に測定し、目標を設定するためのフレームワークを提供します。これにより、サービスの質とユーザー体験を継続的に改善することが可能になります。",
        links: [
          {
            text: "SLIとSLOの実装",
            url: "https://sre.google/sre-book/service-level-objectives/",
          },
          {
            text: "信頼性メトリクス",
            url: "https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring/sli-metrics/overview?hl=ja",
          },
        ],
      },
      en: {
        summary:
          "SLIs (Service Level Indicators) and SLOs (Service Level Objectives) provide a framework for objectively measuring and setting goals for service reliability and performance. This enables continuous improvement of service quality and user experience.",
        links: [
          {
            text: "SLI and SLO Implementation",
            url: "https://sre.google/sre-book/service-level-objectives/",
          },
          {
            text: "Reliability Metrics",
            url: "https://cloud.google.com/architecture/framework/reliability/define-reliability-based-on-user-experience-goals",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "SLI/SLOの概念は採用されておらず、サービスの信頼性測定は主に反応的に行われている",
          en: "SLI/SLO concepts are not adopted, and service reliability measurement is primarily reactive",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なSLI/SLOが一部のサービスに定義されているが、包括的な測定や継続的なモニタリングは限定的",
          en: "Basic SLI/SLOs are defined for some services, but comprehensive measurement and continuous monitoring are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なSLI/SLOフレームワークが主要なサービスに実装され、明確な目標、定期的な測定、エラーバジェットの概念が確立されている",
          en: "A comprehensive SLI/SLO framework is implemented for major services, with clear objectives, regular measurement, and error budget concepts established",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なSLI/SLO管理が全サービスに標準化され、詳細な指標、リアルタイムモニタリング、自動アラート、エラーバジェットに基づいた意思決定などが実装されている",
          en: "Advanced SLI/SLO management is standardized for all services, with detailed metrics, real-time monitoring, automated alerts, error budget-based decision making, etc. implemented",
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
    id: "ops_6",
    category: "operations_resilience",
    text: {
      ja: "マルチリージョン/ゾーンのレジリエンスはどのように実装されていますか？",
      en: "How is multi-region/zone resilience implemented?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "ops_3", minValue: 33 }, // Only show if ops_3 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "マルチリージョン/ゾーンアーキテクチャは、リージョン全体やデータセンターの障害に対する耐性を提供し、地理的な冗長性を確保します。これにより、大規模災害発生時でもサービス継続性を維持することが可能になります。",
        links: [
          {
            text: "マルチリージョンアーキテクチャ",
            url: "https://cloud.google.com/architecture/framework/reliability/perform-testing-for-recovery-from-failures",
          },
          {
            text: "AWS レジリエンスハブ",
            url: "https://aws.amazon.com/jp/resilience-hub/",
          },
        ],
      },
      en: {
        summary:
          "Multi-region/zone architecture provides resilience against entire region or data center failures and ensures geographic redundancy. This enables maintenance of service continuity even during large-scale disasters.",
        links: [
          {
            text: "Multi-region Architecture",
            url: "https://cloud.google.com/architecture/framework/reliability/perform-testing-for-recovery-from-failures",
          },
          {
            text: "AWS Resilience Hub",
            url: "https://aws.amazon.com/resilience-hub/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "マルチリージョン/ゾーンのレジリエンスはほとんど実装されておらず、単一リージョンまたはゾーンでの運用が主流",
          en: "Multi-region/zone resilience is barely implemented, with operations in a single region or zone being mainstream",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の重要なシステムでマルチゾーン配置が実装されているが、真のマルチリージョンレジリエンスは限定的",
          en: "Multi-zone deployment is implemented for some critical systems, but true multi-region resilience is limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なシステムでマルチリージョン/ゾーン配置が実装され、リージョン間のデータレプリケーション、トラフィックルーティング戦略が確立されている",
          en: "Multi-region/zone deployment is implemented for major systems, with inter-region data replication and traffic routing strategies established",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なグローバル分散アーキテクチャが標準化され、アクティブ-アクティブ構成、グローバル負荷分散、データの一貫性管理、自動フェイルオーバーなどが実装されている",
          en: "Advanced global distributed architecture is standardized, with active-active configuration, global load balancing, data consistency management, automated failover, etc. implemented",
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
    id: "ops_7",
    category: "operations_resilience",
    text: {
      ja: "インフラストラクチャの信頼性はどのように確保されていますか？",
      en: "How is infrastructure reliability ensured?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "ops_3", minValue: 33 }, // Only show if ops_3 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "インフラストラクチャの信頼性は、適切な設計、監視、自動化を通じて確保されます。冗長性、自己修復機能、障害検出と対応の自動化が重要な要素となります。",
        links: [
          {
            text: "インフラストラクチャの信頼性",
            url: "https://cloud.google.com/architecture/framework/reliability?hl=ja",
          },
          {
            text: "信頼性の高いインフラストラクチャ設計",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-for-reliability.html",
          },
        ],
      },
      en: {
        summary:
          "Infrastructure reliability is ensured through appropriate design, monitoring, and automation. Redundancy, self-healing capabilities, and automated failure detection and response are important elements.",
        links: [
          {
            text: "Infrastructure Reliability",
            url: "https://cloud.google.com/architecture/framework/reliability",
          },
          {
            text: "Reliable Infrastructure Design",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-for-reliability.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "インフラストラクチャの信頼性対策は最小限で、障害対応は主に反応的に行われている",
          en: "Infrastructure reliability measures are minimal, and failure response is primarily reactive",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な信頼性対策（冗長化など）は実装されているが、包括的な設計や自動化された監視/対応は限定的",
          en: "Basic reliability measures (such as redundancy) are implemented, but comprehensive design and automated monitoring/response are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的な信頼性戦略が確立され、冗長設計、障害検出、自動スケーリング、定期的な容量計画などが実装されている",
          en: "A comprehensive reliability strategy is established, with redundant design, failure detection, automatic scaling, regular capacity planning, etc. implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な信頼性設計が標準化され、自己修復機能、予測的な容量管理、継続的な信頼性テスト、障害シミュレーションなどが完全に統合されている",
          en: "Advanced reliability design is standardized, with self-healing capabilities, predictive capacity management, continuous reliability testing, failure simulation, etc. fully integrated",
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
    id: "ops_8",
    category: "operations_resilience",
    text: {
      ja: "インフラストラクチャのサステナビリティと電力効率はどのように最適化されていますか？",
      en: "How are infrastructure sustainability and energy efficiency optimized?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "optional",
    dependencies: [
      { questionId: "ops_1", minValue: 33 }, // Only show if ops_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "サステナビリティと電力効率の最適化は、環境への影響を最小限に抑えながら、コスト削減も実現します。リソースの効率的な使用、省エネルギー設計、およびカーボンフットプリントの測定と削減が重要な要素となります。",
        links: [
          {
            text: "持続可能なクラウド運用",
            url: "https://cloud.google.com/sustainability",
          },
          {
            text: "エネルギー効率のベストプラクティス",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html",
          },
        ],
      },
      en: {
        summary:
          "Optimizing sustainability and energy efficiency minimizes environmental impact while also achieving cost reduction. Efficient use of resources, energy-efficient design, and measurement and reduction of carbon footprint are important elements.",
        links: [
          {
            text: "Sustainable Cloud Operations",
            url: "https://cloud.google.com/sustainability",
          },
          {
            text: "Energy Efficiency Best Practices",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "サステナビリティや電力効率は運用上の考慮事項になっておらず、特別な最適化は行われていない",
          en: "Sustainability and energy efficiency are not operational considerations, and no special optimization is performed",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なリソース効率化（未使用リソースの削除など）は行われているが、包括的なサステナビリティ戦略はない",
          en: "Basic resource efficiency (such as removing unused resources) is performed, but there is no comprehensive sustainability strategy",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なサステナビリティ戦略が確立され、電力効率の高いインスタンスの選択、リソースの最適化、カーボンフットプリントの測定などが実装されている",
          en: "A comprehensive sustainability strategy is established, with selection of energy-efficient instances, resource optimization, carbon footprint measurement, etc. implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なサステナビリティプラクティスが標準化され、カーボンアウェアな配置戦略、自動化された効率最適化、詳細な測定と報告、組織全体の環境目標との整合などが実装されている",
          en: "Advanced sustainability practices are standardized, with carbon-aware placement strategies, automated efficiency optimization, detailed measurement and reporting, alignment with organization-wide environmental goals, etc. implemented",
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
    id: "ops_9",
    category: "operations_resilience",
    text: {
      ja: "カオスエンジニアリングプラクティスはどのように採用されていますか？",
      en: "How are chaos engineering practices adopted?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "ops_4", minValue: 66 }, // Only show if ops_4 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "カオスエンジニアリングは、システムに意図的に障害を注入することで、その回復力と弱点を明らかにします。これにより、実際の障害発生前に問題を特定し、システムのレジリエンスを向上させることができます。",
        links: [
          {
            text: "カオスエンジニアリングの原則",
            url: "https://principlesofchaos.org/",
          },
          {
            text: "カオステストの実装",
            url: "https://aws.amazon.com/jp/builders-flash/202202/fis-safe-experiment/",
          },
          {
            text: "カオスエンジニアリング実践ガイド",
            url: "https://www.hitachids.com/blog/new-help-arrives-for-getting-cloud-migrations-right/",
          },
        ],
      },
      en: {
        summary:
          "Chaos engineering deliberately injects failures into systems to reveal their resilience and weaknesses. This allows identification of problems before actual failures occur, improving system resilience.",
        links: [
          {
            text: "Chaos Engineering Principles",
            url: "https://principlesofchaos.org/",
          },
          {
            text: "Implementing Chaos Testing",
            url: "https://docs.aws.amazon.com/fis/latest/userguide/getting-started-planning.html",
          },
          {
            text: "Gremlin Tutorials",
            url: "https://www.gremlin.com/community/tutorials",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "カオスエンジニアリングプラクティスは採用されておらず、計画的な障害注入は行われていない",
          en: "Chaos engineering practices are not adopted, and planned failure injection is not performed",
        },
      },
      {
        value: 33,
        label: {
          ja: "限定的な環境で基本的なカオスエンジニアリング実験が試験的に行われているが、包括的なアプローチではない",
          en: "Basic chaos engineering experiments are experimentally conducted in limited environments, but it's not a comprehensive approach",
        },
      },
      {
        value: 66,
        label: {
          ja: "構造化されたカオスエンジニアリングプログラムが確立され、計画的な実験、ゲームデイ演習、結果分析などが定期的に実施されている",
          en: "A structured chaos engineering program is established, with planned experiments, game day exercises, result analysis, etc. regularly conducted",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なカオスエンジニアリングが組織全体で標準化され、自動化された実験、本番環境での継続的テスト、詳細な分析フレームワーク、体系的な改善サイクルなどが実装されている",
          en: "Advanced chaos engineering is standardized organization-wide, with automated experiments, continuous testing in production environments, detailed analysis frameworks, systematic improvement cycles, etc. implemented",
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
    id: "ops_10",
    category: "operations_resilience",
    text: {
      ja: "自動復旧メカニズムはどのように実装されていますか？",
      en: "How are automated recovery mechanisms implemented?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "ops_3", minValue: 66 }, // Only show if ops_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "自動復旧メカニズムは、障害発生時に人間の介入なしにシステムを正常な状態に戻す能力を提供します。これにより、復旧時間が短縮され、人為的ミスのリスクが軽減されます。",
        links: [
          {
            text: "自己修復システム",
            url: "https://cloud.google.com/architecture/framework/reliability?hl=ja",
          },
          {
            text: "自動復旧",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/implement-change.html",
          },
        ],
      },
      en: {
        summary:
          "Automated recovery mechanisms provide the ability to return systems to normal state without human intervention during failures. This reduces recovery time and the risk of human error.",
        links: [
          {
            text: "Self-healing Systems",
            url: "https://cloud.google.com/architecture/framework/reliability",
          },
          {
            text: "Automated Recovery",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/implement-change.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "自動復旧メカニズムはほとんど実装されておらず、障害からの復旧は主に手動で行われている",
          en: "Automated recovery mechanisms are barely implemented, and recovery from failures is primarily done manually",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な自動復旧機能（自動再起動など）は一部のコンポーネントに実装されているが、包括的なアプローチではない",
          en: "Basic automated recovery functions (such as automatic restart) are implemented for some components, but it's not a comprehensive approach",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的な自動復旧メカニズムが主要なシステムに実装され、ヘルスチェック、自動置換、障害検出と対応のパターンが確立されている",
          en: "Comprehensive automated recovery mechanisms are implemented for major systems, with health checks, automatic replacement, failure detection and response patterns established",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な自動復旧が全システムに標準化され、複雑な障害パターンの検出、階層的な復旧戦略、自己修復アーキテクチャ、事前対応型の異常検出などが実装されている",
          en: "Advanced automated recovery is standardized for all systems, with detection of complex failure patterns, hierarchical recovery strategies, self-healing architecture, proactive anomaly detection, etc. implemented",
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
    id: "ops_12",
    category: "operations_resilience",
    text: {
      ja: "カーボンフットプリント管理はどのように実装されていますか？",
      en: "How is carbon footprint management implemented?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "ops_8", minValue: 66 }, // Only show if ops_8 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "カーボンフットプリント管理は、クラウド運用の環境への影響を測定、報告、削減するための体系的なアプローチです。これには、エネルギー効率の高いリソースの選択、使用量の最適化、再生可能エネルギーの利用などが含まれます。",
        links: [
          {
            text: "カーボンフットプリント管理",
            url: "https://cloud.google.com/carbon-footprint",
          },
          {
            text: "持続可能なクラウド運用",
            url: "https://aws.amazon.com/blogs/aws/sustainability-pillar-well-architected-framework/",
          },
        ],
      },
      en: {
        summary:
          "Carbon footprint management is a systematic approach to measuring, reporting, and reducing the environmental impact of cloud operations. This includes selection of energy-efficient resources, usage optimization, and use of renewable energy.",
        links: [
          {
            text: "Carbon Footprint Management",
            url: "https://cloud.google.com/carbon-footprint",
          },
          {
            text: "Sustainable Cloud Operations",
            url: "https://aws.amazon.com/blogs/aws/sustainability-pillar-well-architected-framework/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "カーボンフットプリントの測定や管理は行われておらず、環境への影響は運用上の考慮事項になっていない",
          en: "Carbon footprint measurement and management are not performed, and environmental impact is not an operational consideration",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なカーボンフットプリント測定が一部行われているが、包括的な管理戦略や削減目標は確立されていない",
          en: "Basic carbon footprint measurement is partially performed, but a comprehensive management strategy and reduction goals are not established",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なカーボンフットプリント管理が実装され、定期的な測定、報告、削減目標、最適化戦略が確立されている",
          en: "Comprehensive carbon footprint management is implemented, with regular measurement, reporting, reduction goals, and optimization strategies established",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なカーボンフットプリント管理が標準化され、リアルタイムモニタリング、自動最適化、組織全体の環境目標との統合、外部認証や検証などが実装されている",
          en: "Advanced carbon footprint management is standardized, with real-time monitoring, automated optimization, integration with organization-wide environmental goals, external certification and verification, etc. implemented",
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
    id: "ops_13",
    category: "operations_resilience",
    text: {
      ja: "運用手順書とドキュメントはどのように管理されていますか？",
      en: "How are operational runbooks and documentation managed?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "optional",
    dependencies: [
      { questionId: "ops_1", minValue: 66 }, // Only show if ops_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "適切に管理された運用手順書とドキュメントは、一貫性のある運用プロセスと効果的なインシデント対応の基盤となります。これらは、新しいチームメンバーのオンボーディングを容易にし、知識の共有と継承を促進します。",
        links: [
          {
            text: "運用手順書",
            url: "https://cloud.google.com/architecture/framework/operational-excellence/guides-and-runbooks",
          },
          {
            text: "ドキュメントのベストプラクティス",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/prepare.html",
          },
        ],
      },
      en: {
        summary:
          "Properly managed operational runbooks and documentation form the foundation for consistent operational processes and effective incident response. These facilitate onboarding of new team members and promote knowledge sharing and inheritance.",
        links: [
          {
            text: "Operational Runbooks",
            url: "https://cloud.google.com/architecture/framework/operational-excellence/guides-and-runbooks",
          },
          {
            text: "Documentation Best Practices",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/prepare.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的な運用手順書やドキュメントはほとんど存在せず、運用知識は主に個人の経験に依存している",
          en: "Systematic operational runbooks and documentation barely exist, and operational knowledge primarily depends on individual experience",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な運用ドキュメントは存在するが、網羅性が不十分で、更新も不定期である",
          en: "Basic operational documentation exists, but coverage is insufficient and updates are irregular",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的な運用手順書とドキュメントが整備され、定期的な更新、アクセシビリティ、検索性の確保が行われている",
          en: "Comprehensive operational runbooks and documentation are maintained, with regular updates, accessibility, and searchability ensured",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な運用ドキュメント管理が標準化され、実行可能な手順書、自動化との統合、継続的な検証と更新、コラボレーティブな編集環境などが実装されている",
          en: "Advanced operational documentation management is standardized, with executable runbooks, integration with automation, continuous verification and updating, collaborative editing environment, etc. implemented",
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
    id: "ops_14",
    category: "operations_resilience",
    text: {
      ja: "レジリエンスメトリクスと継続的改善はどのように実装されていますか？",
      en: "How are resilience metrics and continuous improvement implemented?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "ops_5", minValue: 66 }, // Only show if ops_5 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "レジリエンスメトリクスと継続的改善プロセスにより、システムの回復力を定量的に測定し、時間とともに向上させることができます。これには、障害発生率、復旧時間、システム可用性などの指標の追跡と分析が含まれます。",
        links: [
          {
            text: "レジリエンスメトリクス",
            url: "https://cloud.google.com/architecture/framework/reliability/define-reliability-based-on-user-experience-goals",
          },
          {
            text: "継続的改善",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/oe-improve.html",
          },
        ],
      },
      en: {
        summary:
          "Resilience metrics and continuous improvement processes enable quantitative measurement and improvement of system resilience over time. This includes tracking and analysis of metrics such as failure rates, recovery times, and system availability.",
        links: [
          {
            text: "Resilience Metrics",
            url: "https://cloud.google.com/architecture/framework/reliability/define-reliability-based-on-user-experience-goals",
          },
          {
            text: "Continuous Improvement",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/oe-improve.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "レジリエンスの定量的な測定はほとんど行われておらず、継続的改善プロセスも確立されていない",
          en: "Quantitative measurement of resilience is barely performed, and a continuous improvement process is not established",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なレジリエンス指標（稼働時間など）は追跡されているが、包括的な測定フレームワークや体系的な改善プロセスは限定的",
          en: "Basic resilience indicators (such as uptime) are tracked, but a comprehensive measurement framework and systematic improvement process are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なレジリエンスメトリクスフレームワークが確立され、定期的な測定、傾向分析、構造化された改善プロセスが実装されている",
          en: "A comprehensive resilience metrics framework is established, with regular measurement, trend analysis, and structured improvement processes implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なレジリエンス管理システムが標準化され、詳細な指標、予測分析、自動化された改善提案、経営層レベルの可視性、組織的な学習サイクルなどが実装されている",
          en: "Advanced resilience management systems are standardized, with detailed metrics, predictive analytics, automated improvement suggestions, executive-level visibility, organizational learning cycles, etc. implemented",
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
    id: "ops_15",
    category: "operations_resilience",
    text: {
      ja: "レジリエンスとサステナビリティの両立を考慮したリソース最適化はどのように実施されていますか？",
      en: "How is resource optimization conducted considering both resilience and sustainability?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "ops_8", minValue: 66 }, // Only show if ops_8 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "レジリエンスとサステナビリティの両立は、システムの回復力を確保しながら環境への影響を最小限に抑えるという、時に相反する目標のバランスを取ることを意味します。これには、効率的なリソース使用、適切な冗長性レベル、エネルギー効率の高いコンポーネントの選択などが含まれます。",
        links: [
          {
            text: "バランスのとれたリソース最適化",
            url: "https://learn.microsoft.com/ja-jp/training/modules/sustainable-software-engineering-overview/",
          },
          {
            text: "レジリエントで持続可能な設計",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html",
          },
        ],
      },
      en: {
        summary:
          "Balancing resilience and sustainability means striking a balance between sometimes conflicting goals of ensuring system resilience while minimizing environmental impact. This includes efficient resource use, appropriate redundancy levels, and selection of energy-efficient components.",
        links: [
          {
            text: "Balanced Resource Optimization",
            url: "https://learn.microsoft.com/en-us/training/modules/sustainable-software-engineering-overview/",
          },
          {
            text: "Resilient and Sustainable Design",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "レジリエンスとサステナビリティの両立は考慮されておらず、これらは別々の、時に競合する目標として扱われている",
          en: "Balancing resilience and sustainability is not considered, and these are treated as separate, sometimes competing goals",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なリソース効率化は実施されているが、レジリエンスとサステナビリティを体系的に両立させる戦略は限定的",
          en: "Basic resource efficiency is implemented, but strategies to systematically balance resilience and sustainability are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "レジリエンスとサステナビリティの両立を考慮した包括的なリソース最適化戦略が確立され、適切な冗長性レベル、効率的なリソース使用、エネルギー効率の高いコンポーネントの選択などが実施されている",
          en: "A comprehensive resource optimization strategy considering both resilience and sustainability is established, with appropriate redundancy levels, efficient resource use, selection of energy-efficient components, etc. implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な統合最適化アプローチが標準化され、AIを活用した効率分析、動的リソース配分、カーボンフットプリントを考慮した回復力設計、持続可能性と信頼性のトレードオフを定量的に評価するフレームワークなどが実装されている",
          en: "Advanced integrated optimization approaches are standardized, with AI-powered efficiency analysis, dynamic resource allocation, resilience design considering carbon footprint, frameworks for quantitatively evaluating trade-offs between sustainability and reliability, etc. implemented",
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
