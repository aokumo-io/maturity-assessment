/**
 * マルチクラウド・ハイブリッドクラウド・ガバナンス質問モジュール
 *
 * マルチクラウド環境、ハイブリッドクラウド、およびクラウドガバナンスに関する質問を定義するモジュールです。
 * クラウド戦略、クラウド間の相互運用性、ポリシー管理などの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const multicloudHybridGovernanceQuestions: AssessmentQuestion[] = [
  {
    id: "mch_1",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "マルチクラウド/ハイブリッドクラウド戦略はどの程度確立されていますか？",
      en: "How well-established is your multi-cloud / hybrid-cloud strategy?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なマルチクラウド/ハイブリッドクラウド戦略では、複数のクラウド環境やオンプレミス環境にわたるワークロードの配置、標準、ガバナンスに関する明確な方針と理由を定義します。",
        links: [
          {
            text: "Multi-cloud Strategy",
            url: "https://cloud.google.com/architecture/framework/reliability",
          },
          {
            text: "Hybrid Cloud Approach",
            url: "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/",
          },
        ],
      },
      en: {
        summary:
          "An effective multi-cloud / hybrid strategy defines clear policies and rationales for workload placement, standards, and governance across multiple cloud and on-prem environments.",
        links: [
          {
            text: "Multi-cloud Strategy",
            url: "https://cloud.google.com/architecture/framework/reliability",
          },
          {
            text: "Hybrid Cloud Approach",
            url: "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "マルチクラウド/ハイブリッドクラウド戦略は存在せず、異なる環境の利用は主にアドホックに決定されている",
          en: "No multi-cloud / hybrid strategy exists; use of different environments is mainly decided ad-hoc.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なマルチクラウド/ハイブリッド戦略は存在するが、包括的な方針や標準が不足しており、環境間の一貫性に課題がある",
          en: "A basic strategy exists, but lacks comprehensive policies or standards, causing consistency issues across environments.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なマルチクラウド/ハイブリッド戦略が確立され、明確なワークロード配置基準、ガバナンスモデル、標準化されたアプローチが定義されている",
          en: "A comprehensive strategy is established with clear workload-placement criteria, governance model, and standardized approaches.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に成熟したマルチクラウド/ハイブリッド戦略が実装され、最適化されたワークロード配置、一貫したガバナンス、環境間の統合運用モデル、継続的な評価と最適化が行われている",
          en: "A highly mature strategy delivers optimized workload placement, consistent governance, an integrated operating model, and continuous evaluation/optimization.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_2",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "異なるクラウド環境およびオンプレミス環境間のアイデンティティとアクセス管理はどのように実装されていますか？",
      en: "How is identity and access management implemented across different cloud and on-prem environments?",
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
          "環境間の一貫したアイデンティティとアクセス管理は、セキュリティと運用効率の両方にとって不可欠です。これにより、ユーザーとサービスの認証と認可を統一的に管理し、複雑さとセキュリティリスクを軽減できます。",
        links: [
          {
            text: "Federated Identity Management",
            url: "https://cloud.google.com/iam/docs/workload-identity-federation?hl=ja",
          },
          {
            text: "Cross-Cloud IAM",
            url: "https://cloud.google.com/architecture/identity/best-practices-for-federating",
          },
        ],
      },
      en: {
        summary:
          "Consistent IAM across environments is essential for security and operational efficiency, enabling unified authentication/authorization while reducing complexity and risk.",
        links: [
          {
            text: "Federated Identity Management",
            url: "https://cloud.google.com/iam/docs/workload-identity-federation?hl=ja",
          },
          {
            text: "Cross-Cloud IAM",
            url: "https://cloud.google.com/architecture/identity/best-practices-for-federating",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "環境間のアイデンティティ管理は統合されておらず、各環境で個別のアイデンティティとアクセス制御が管理されている",
          en: "IAM is not integrated; each environment manages identities and access independently.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なフェデレーションや統合アプローチが一部実装されているが、包括的な統合や一貫したポリシー管理は限定的",
          en: "Some basic federation/integration exists, but comprehensive integration and consistent policy management are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なクロス環境IAM戦略が実装され、統合されたアイデンティティ管理、SSO、一貫したアクセスポリシーが確立されている",
          en: "A comprehensive cross-environment IAM strategy provides integrated identity management, SSO, and consistent access policies.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な統合IAMフレームワークが標準化され、集中管理、細粒度アクセス制御、動的ポリシー、高度な認証メカニズム、継続的なコンプライアンス監視が実装されている",
          en: "An advanced IAM framework offers centralized management, fine-grained controls, dynamic policies, robust authentication, and continuous compliance monitoring.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_3",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "異なるクラウド環境およびオンプレミス環境間で一貫したセキュリティ対策はどのように確保されていますか？",
      en: "How are consistent security measures ensured across cloud and on-prem environments?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: { executive: "high", manager: "high", practitioner: "high" },
    assessmentType: "comprehensive",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "環境間で一貫したセキュリティポリシーと対策を確保することは、包括的なセキュリティ態勢の構築とコンプライアンス要件の満たすために不可欠です。",
        links: [
          {
            text: "Multi-cloud Security",
            url: "https://cloudsecurityalliance.org/artifacts/security-guidance-v5",
          },
          {
            text: "Unified Security Controls",
            url: "https://cloud.google.com/security-command-center",
          },
        ],
      },
      en: {
        summary:
          "Ensuring consistent security policies and controls across environments is vital to build a strong security posture and meet compliance requirements.",
        links: [
          {
            text: "Multi-cloud Security",
            url: "https://cloudsecurityalliance.org/artifacts/security-guidance-v5",
          },
          {
            text: "Unified Security Controls",
            url: "https://cloud.google.com/security-command-center",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "環境間で一貫したセキュリティ対策はなく、各環境で個別のセキュリティアプローチが採用されている",
          en: "No consistent measures; each environment follows its own security approach.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な共通セキュリティ方針は存在するが、環境間での実装の一貫性や統合的な監視には課題がある",
          en: "Basic common policies exist, but consistent implementation and integrated monitoring are lacking.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なクロス環境セキュリティフレームワークが実装され、標準化されたポリシー、統合された脅威検出、一貫した制御が確立されている",
          en: "A comprehensive framework delivers standardized policies, integrated threat detection, and consistent controls.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な統合セキュリティモデルが標準化され、環境間の一貫したゼロトラスト実装、自動化されたコンプライアンス検証、高度な脅威インテリジェンス共有、統合SOCが実現されている",
          en: "An advanced integrated model provides consistent zero-trust, automated compliance checks, threat-intel sharing, and an integrated SOC.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_4",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "異なるクラウド環境およびオンプレミス環境にわたる集中的な監視と管理はどのように実装されていますか？",
      en: "How is centralized monitoring and management implemented across cloud and on-prem environments?",
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
          "集中的な監視と管理は、複数の環境にわたる可視性、トラブルシューティング、パフォーマンス最適化を可能にし、運用効率を向上させます。",
        links: [
          {
            text: "Multi-cloud Monitoring",
            url: "https://www.datadoghq.com/ja/blog/tagging-best-practices/",
          },
          {
            text: "Unified Management",
            url: "https://azure.microsoft.com/ja-jp/products/azure-arc",
          },
        ],
      },
      en: {
        summary:
          "Centralized monitoring and management provide visibility, troubleshooting, and performance optimization across environments, enhancing operational efficiency.",
        links: [
          {
            text: "Multi-cloud Monitoring",
            url: "https://www.datadoghq.com/ja/blog/tagging-best-practices/",
          },
          {
            text: "Unified Management",
            url: "https://azure.microsoft.com/ja-jp/products/azure-arc",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "環境間の集中的な監視や管理はなく、各環境で個別のツールとアプローチが使用されている",
          en: "No centralized monitoring/management; each environment uses separate tools and approaches.",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の環境や領域で基本的な統合監視が実装されているが、包括的な可視性や統合管理は限定的",
          en: "Basic integrated monitoring exists in some areas, but comprehensive visibility and unified management remain limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的な統合監視・管理プラットフォームが実装され、主要な環境にわたる一貫した可視性、アラート、基本的な自動化が実現されている",
          en: "A comprehensive platform provides consistent visibility, alerts, and basic automation across key environments.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な統合運用フレームワークが標準化され、全環境にわたる完全な可視性、相関分析、予測分析、自動化された対応、統合管理インターフェースが実現されている",
          en: "An advanced framework delivers full visibility, correlation, predictive analytics, automated response, and a unified interface across all environments.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  /* ───────────────────────────── STANDARD ───────────────────────────── */
  {
    id: "mch_5",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "複数のクラウド環境やオンプレミス環境にわたるコスト管理はどのように実装されていますか？",
      en: "How is cost management implemented across multiple cloud and on-prem environments?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mch_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "複数環境にわたる統合コスト管理により、全体的な支出の可視化、最適化機会の特定、および戦略的な意思決定が可能になります。",
        links: [
          {
            text: "Multi-cloud Cost Management",
            url: "https://www.ibm.com/jp-ja/finops",
          },
          {
            text: "Cloud Financial Management",
            url: "https://aws.amazon.com/aws-cost-management/",
          },
        ],
      },
      en: {
        summary:
          "Integrated cost management across environments enables full spend visibility, identifies optimization opportunities, and supports strategic decision-making.",
        links: [
          {
            text: "Multi-cloud Cost Management",
            url: "https://www.ibm.com/jp-ja/finops",
          },
          {
            text: "Cloud Financial Management",
            url: "https://aws.amazon.com/aws-cost-management/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "環境間の統合コスト管理はなく、各環境のコストは個別に管理され、全体的な可視性は限られている",
          en: "No integrated cost management; each environment manages costs separately with limited overall visibility.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なクロス環境コスト可視化は実装されているが、詳細な分析や最適化戦略の統合は限定的",
          en: "Basic cross-environment cost visibility exists, but detailed analysis and integrated optimization strategies are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なマルチクラウドコスト管理フレームワークが実装され、統合されたダッシュボード、環境間の比較分析、最適化戦略が確立されている",
          en: "A comprehensive multi-cloud cost framework offers integrated dashboards, cross-environment analysis, and established optimization strategies.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な統合コスト管理が標準化され、AIを活用した最適化、予測分析、自動調整、クロス環境のリソース配置最適化、ビジネス価値との連携などが実装されている",
          en: "An advanced integrated cost system uses AI optimization, predictive analytics, auto-adjustment, cross-environment placement optimization, and linkage to business value.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_6",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "異なるクラウド環境およびオンプレミス環境間のネットワーク接続とデータ転送はどのように管理されていますか？",
      en: "How are network connectivity and data transfer managed across cloud and on-prem environments?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mch_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効率的で安全なネットワーク接続とデータ転送戦略は、マルチクラウド/ハイブリッド環境のパフォーマンス、セキュリティ、コスト効率性に大きな影響を与えます。",
        links: [
          {
            text: "Hybrid Connectivity",
            url: "https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/",
          },
          {
            text: "Multi-cloud Networking",
            url: "https://cloud.google.com/network-connectivity/docs/interconnect",
          },
        ],
      },
      en: {
        summary:
          "Efficient, secure connectivity and data-transfer strategies strongly affect performance, security, and cost efficiency in multi-cloud/hybrid setups.",
        links: [
          {
            text: "Hybrid Connectivity",
            url: "https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/",
          },
          {
            text: "Multi-cloud Networking",
            url: "https://cloud.google.com/network-connectivity/docs/interconnect",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "環境間の接続は最小限で、主にパブリックインターネット経由で行われ、体系的なネットワーク戦略はない",
          en: "Connectivity is minimal and primarily over the public internet; no systematic network strategy.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な専用接続やVPN接続は確立されているが、包括的なネットワーク設計やトラフィック最適化は限定的",
          en: "Dedicated links/VPNs exist, but comprehensive design and traffic optimization are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なハイブリッド/マルチクラウドネットワーク戦略が実装され、専用接続、トラフィック最適化、セキュリティ対策が確立されている",
          en: "A comprehensive hybrid/multi-cloud strategy includes dedicated connectivity, traffic optimization, and security measures.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なネットワークファブリックが実装され、複数環境にわたる統合SDN、動的ルーティング、高度な暗号化、自動スケーリングなどが標準化されている",
          en: "An advanced network fabric offers integrated SDN, dynamic routing, strong encryption, and autoscaling across environments.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_7",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "複数のクラウド環境やオンプレミス環境にわたるコンプライアンスとリスク管理はどのように実施されていますか？",
      en: "How are compliance and risk management carried out across multiple cloud and on-prem environments?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mch_3", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "マルチクラウド/ハイブリッド環境では、異なるプラットフォーム間で一貫したコンプライアンスとリスク管理を確保することが、規制要件の遵守とセキュリティリスクの軽減に不可欠です。",
        links: [
          {
            text: "Multi-cloud Compliance",
            url: "https://www.sans.org/reading-room/whitepapers/compliance/addressing-compliance-multi-cloud-environments-39370",
          },
          {
            text: "Cloud Risk Management",
            url: "https://csrc.nist.gov/publications/detail/sp/800-144/final",
          },
        ],
      },
      en: {
        summary:
          "In multi-cloud/hybrid environments, consistent compliance and risk management across platforms are essential to meet regulations and reduce security risks.",
        links: [
          {
            text: "Multi-cloud Compliance",
            url: "https://www.sans.org/reading-room/whitepapers/compliance/addressing-compliance-multi-cloud-environments-39370",
          },
          {
            text: "Cloud Risk Management",
            url: "https://csrc.nist.gov/publications/detail/sp/800-144/final",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "環境間の統合コンプライアンス管理はなく、各環境で個別にリスク評価が行われている",
          en: "No integrated compliance management; each environment performs risk assessment separately.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なコンプライアンスフレームワークは存在するが、環境間での一貫した実装や継続的な検証は限定的",
          en: "A basic framework exists, but consistent implementation and continuous validation are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なクロス環境コンプライアンス・リスク管理フレームワークが実装され、統一ポリシー、定期的な評価、自動チェックが確立されている",
          en: "A comprehensive cross-environment framework provides unified policies, periodic assessments, and automated checks.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な統合ガバナンスモデルが標準化され、リアルタイムコンプライアンス監視、自動修復、予測的リスク分析、継続的な適応型フレームワークなどが実装されている",
          en: "An advanced governance model delivers real-time monitoring, automated remediation, predictive risk analysis, and adaptive frameworks.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_8",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "異なるクラウド環境およびオンプレミス環境間でのワークロード配置戦略はどのように実装されていますか？",
      en: "How is workload-placement strategy implemented across different cloud and on-prem environments?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mch_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なワークロード配置戦略により、各環境の強みを活用し、コスト、パフォーマンス、コンプライアンス、リスク要件のバランスを取りながら最適な実行環境を選択することができます。",
        links: [
          {
            text: "Workload Placement",
            url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/decision-guides/multicloud/",
          },
          {
            text: "Cloud Workload Strategy",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/6-strategies-for-migrating-applications-to-the-cloud/",
          },
        ],
      },
      en: {
        summary:
          "An effective workload-placement strategy leverages each environment's strengths, balancing cost, performance, compliance, and risk requirements.",
        links: [
          {
            text: "Workload Placement",
            url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/decision-guides/multicloud/",
          },
          {
            text: "Cloud Workload Strategy",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/6-strategies-for-migrating-applications-to-the-cloud/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的なワークロード配置戦略はなく、環境の選択は主に状況的または歴史的要因に基づいている",
          en: "No systematic placement strategy; environment selection is situational or historical.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な配置基準は定義されているが、包括的なフレームワークや一貫した評価プロセスは限定的",
          en: "Basic criteria are defined, but a comprehensive framework and consistent evaluation process are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なワークロード配置フレームワークが確立され、明確な評価基準、意思決定プロセス、最適化レビューが実装されている",
          en: "A comprehensive placement framework defines clear evaluation criteria, decision processes, and optimization reviews.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な配置最適化モデルが標準化され、詳細な多次元分析、AIを活用した推奨、動的な再配置能力、継続的な最適化サイクルなどが実装されている",
          en: "An advanced optimization model offers multi-dimensional analysis, AI recommendations, dynamic relocation, and continuous optimization.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  /* ─────────────────────────── COMPREHENSIVE ─────────────────────────── */
  {
    id: "mch_9",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "異なるクラウド環境およびオンプレミス環境にわたるサービスメッシュはどのように実装されていますか？",
      en: "How is service mesh implemented across different cloud and on-prem environments?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "optional",
    dependencies: [{ questionId: "mch_6", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クロス環境サービスメッシュは、異なるプラットフォーム間でのサービス通信、トラフィック管理、セキュリティ、可観測性を提供し、複雑なマイクロサービスアーキテクチャを簡素化します。",
        links: [
          {
            text: "Multi-cluster Service Mesh",
            url: "https://istio.io/latest/docs/setup/install/multicluster/",
          },
          {
            text: "Cross-environment Services",
            url: "https://linkerd.io/2.11/features/multicluster/",
          },
        ],
      },
      en: {
        summary:
          "A cross-environment service mesh provides service communication, traffic management, security, and observability, simplifying complex microservice architectures.",
        links: [
          {
            text: "Multi-cluster Service Mesh",
            url: "https://istio.io/latest/docs/setup/install/multicluster/",
          },
          {
            text: "Cross-environment Services",
            url: "https://linkerd.io/2.11/features/multicluster/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "サービスメッシュは実装されておらず、サービス間通信は各環境で個別に管理されている",
          en: "No service mesh; service communication is managed separately in each environment.",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の環境でサービスメッシュが試験的に導入されているが、環境間での統合や標準化は限定的",
          en: "Service mesh is piloted in some environments, but cross-environment integration and standardization are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要な環境にわたる統合サービスメッシュが実装され、クロス環境のサービス検出、トラフィック管理、セキュリティポリシーが確立されている",
          en: "An integrated service mesh across major environments provides service discovery, traffic management, and security policies.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なマルチクラウドサービスメッシュが標準化され、全環境でのシームレスな統合、一貫したポリシー適用、高度な可観測性、自動化された管理などが実装されている",
          en: "An advanced multi-cloud service mesh standardizes seamless integration, consistent policy enforcement, advanced observability, and automated management across all environments.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_10",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "クラウドとオンプレミスにまたがるハイブリッドデプロイメントパターンはどのように実装されていますか？",
      en: "How are hybrid deployment patterns across cloud and on-prem environments implemented?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "optional",
    dependencies: [{ questionId: "mch_8", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なハイブリッドデプロイメントパターンにより、アプリケーションとデータを複数の環境にまたがって最適に配置し、レイテンシ、コスト、セキュリティ、コンプライアンス要件のバランスを取ることができます。",
        links: [
          {
            text: "Hybrid Application Patterns",
            url: "https://docs.microsoft.com/en-us/azure/architecture/hybrid/hybrid-architectures",
          },
          {
            text: "Multi-environment Deployment",
            url: "https://cloud.google.com/architecture/hybrid-multicloud-patterns-and-practices",
          },
        ],
      },
      en: {
        summary:
          "Effective hybrid deployment patterns optimally place applications and data across environments, balancing latency, cost, security, and compliance requirements.",
        links: [
          {
            text: "Hybrid Application Patterns",
            url: "https://docs.microsoft.com/en-us/azure/architecture/hybrid/hybrid-architectures",
          },
          {
            text: "Multi-environment Deployment",
            url: "https://cloud.google.com/architecture/hybrid-multicloud-patterns-and-practices",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "標準化されたハイブリッドデプロイメントパターンはなく、環境間の連携は限定的でアドホックに実装されている",
          en: "No standardized hybrid deployment patterns; integration between environments is limited and ad-hoc.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なハイブリッドパターンが一部のアプリケーションに実装されているが、包括的なアプローチや再利用可能なパターンは限定的",
          en: "Basic hybrid patterns are implemented for some applications, but comprehensive approaches or reusable patterns are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なハイブリッドデプロイメントパターンライブラリが確立され、環境間の連携、データ同期、整合性確保の標準アプローチが実装されている",
          en: "A comprehensive pattern library provides standard approaches for integration, data sync, and consistency across environments.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なハイブリッドパターンが標準化され、クラウドバースト、データ主権対応、分散マイクロサービス、環境間CI/CD、自動配置最適化などが完全に実装されている",
          en: "Advanced hybrid patterns standardize cloud burst, data-sovereignty support, distributed microservices, cross-environment CI/CD, and automated placement optimization.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_11",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "異なるクラウド環境およびオンプレミス環境間のディザスタリカバリはどのように実装されていますか？",
      en: "How is disaster recovery implemented across different cloud and on-prem environments?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: { executive: "high", manager: "high", practitioner: "high" },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mch_6", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "複数環境にわたるディザスタリカバリ戦略により、単一のクラウドプロバイダーやデータセンターの障害に対する回復力を高め、ビジネス継続性を確保することができます。",
        links: [
          {
            text: "Multi-cloud DR",
            url: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
          },
          {
            text: "Cross-environment Recovery",
            url: "https://cloud.google.com/architecture/dr-scenarios-planning-guide",
          },
        ],
      },
      en: {
        summary:
          "A cross-environment disaster-recovery strategy increases resilience against failures of a single provider or data center, ensuring business continuity.",
        links: [
          {
            text: "Multi-cloud DR",
            url: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
          },
          {
            text: "Cross-environment Recovery",
            url: "https://cloud.google.com/architecture/dr-scenarios-planning-guide",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "環境間のディザスタリカバリ計画はなく、各環境内での回復力に主に依存している",
          en: "No cross-environment DR plan; resilience relies primarily on each environment.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な環境間バックアップ戦略は実装されているが、包括的な復旧計画や自動フェイルオーバーは限定的",
          en: "Basic cross-environment backups exist, but comprehensive recovery plans or automated failover are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的な環境間ディザスタリカバリ戦略が確立され、明確なRPO/RTO目標、データレプリケーション、定期的なテストが実装されている",
          en: "A comprehensive cross-environment DR strategy defines clear RPO/RTO, data replication, and regular tests.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なマルチクラウド/ハイブリッドDR戦略が標準化され、自動フェイルオーバー、環境間の整合性保証、継続的検証、ビジネス影響分析に基づく最適化などが実装されている",
          en: "An advanced hybrid/multi-cloud DR strategy standardizes automated failover, cross-environment consistency, continuous validation, and optimization based on business-impact analysis.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_12",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "異なるクラウド環境およびオンプレミス環境間での自動化とInfrastructure as Codeの標準化はどのように実装されていますか？",
      en: "How are automation and Infrastructure as Code standardized across cloud and on-prem environments?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mch_4", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "環境間で一貫したInfrastructure as Code（IaC）アプローチと自動化戦略により、デプロイメントの一貫性、変更管理の効率化、およびリスクの軽減が可能になります。",
        links: [
          {
            text: "Cross-cloud IaC",
            url: "https://www.hashicorp.com/ja/solutions/zero-trust-security",
          },
          {
            text: "Hybrid Automation",
            url: "https://www.pulumi.com/docs/clouds/",
          },
        ],
      },
      en: {
        summary:
          "Consistent IaC and automation across environments provide deployment consistency, streamlined change management, and risk reduction.",
        links: [
          {
            text: "Cross-cloud IaC",
            url: "https://www.hashicorp.com/ja/solutions/zero-trust-security",
          },
          {
            text: "Hybrid Automation",
            url: "https://www.pulumi.com/docs/clouds/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "環境間で標準化された自動化やIaCアプローチはなく、各環境で異なるツールや手法が使用されている",
          en: "No standardized automation/IaC; each environment uses different tools and methods.",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の環境で基本的なIaCと自動化が実装されているが、統一されたアプローチや包括的な標準化は限定的",
          en: "Basic IaC and automation exist in some environments, but unified approaches and comprehensive standardization are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要な環境にわたる標準化されたIaCフレームワークと自動化戦略が確立され、共通のツールセット、ベストプラクティス、CI/CD統合が実装されている",
          en: "A standardized IaC framework and automation strategy are established across major environments with common tooling, best practices, and CI/CD integration.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に標準化されたクロス環境IaCと自動化が実装され、抽象化レイヤー、再利用可能なモジュール、自動検証、変更管理の完全な統合、環境間の一貫性確保などが標準化されている",
          en: "Highly standardized cross-environment IaC and automation provide abstraction layers, reusable modules, automated validation, fully integrated change management, and environment consistency.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_13",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "異なるクラウドプロバイダー間の違いを抽象化するレイヤーはどのように実装されていますか？",
      en: "How is an abstraction layer that hides differences among cloud providers implemented?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "optional",
    dependencies: [{ questionId: "mch_8", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドプラットフォーム抽象化レイヤーにより、異なるプロバイダー間の違いを隠蔽し、アプリケーションの移植性を高め、ベンダーロックインのリスクを軽減することができます。",
        links: [
          {
            text: "Cloud Abstraction",
            url: "https://www.terraform.io/language/providers",
          },
          {
            text: "Multi-cloud Libraries",
            url: "https://libcloud.apache.org/",
          },
        ],
      },
      en: {
        summary:
          "A cloud-platform abstraction layer hides provider differences, improving portability and reducing vendor-lock-in risk.",
        links: [
          {
            text: "Cloud Abstraction",
            url: "https://www.terraform.io/language/providers",
          },
          {
            text: "Multi-cloud Libraries",
            url: "https://libcloud.apache.org/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラウド抽象化レイヤーは実装されておらず、各環境でプロバイダー固有のAPIや機能を直接使用している",
          en: "No abstraction layer; provider-specific APIs/features are used directly in each environment.",
        },
      },
      {
        value: 33,
        label: {
          ja: "限定的な抽象化が一部の共通機能（ストレージ、コンピュートなど）に実装されているが、包括的なアプローチではない",
          en: "Limited abstraction exists for some common functions (storage, compute, etc.) but is not comprehensive.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的な抽象化レイヤーが主要なサービス領域に実装され、標準APIやインターフェース、移植性を考慮したアーキテクチャが確立されている",
          en: "A comprehensive abstraction layer covers major service areas with standard APIs/interfaces and portability-focused architecture.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な抽象化フレームワークが標準化され、幅広いサービス領域をカバーし、ベンダー間の差異を効果的に隠蔽、動的プロバイダー切替能力、性能やコストを最適化する知的ルーティングなどが実装されている",
          en: "An advanced abstraction framework covers wide service areas, effectively hides vendor differences, enables dynamic provider switching, and performs intelligent routing to optimize performance and cost.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_14",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "ベンダーロックインの軽減策はどのように実装されていますか？",
      en: "How are vendor lock-in mitigation measures implemented?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mch_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ベンダーロックイン軽減戦略は、特定のクラウドプロバイダーへの過度の依存を回避し、将来の柔軟性、交渉力、リスク分散を確保します。",
        links: [
          {
            text: "Avoiding Lock-in",
            url: "https://www.cloudfoundry.org/blog/cloud-foundry-and-kubernetes-complementary/",
          },
          {
            text: "Portable Cloud Design",
            url: "https://cloud.google.com/blog/products/application-development/13-popular-application-architectures-for-google-cloud",
          },
        ],
      },
      en: {
        summary:
          "Lock-in mitigation strategies avoid excessive dependence on a single provider and secure future flexibility, bargaining power, and risk distribution.",
        links: [
          {
            text: "Avoiding Lock-in",
            url: "https://www.cloudfoundry.org/blog/cloud-foundry-and-kubernetes-complementary/",
          },
          {
            text: "Portable Cloud Design",
            url: "https://cloud.google.com/blog/products/application-development/13-popular-application-architectures-for-google-cloud",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "ベンダーロックインの軽減策はほとんど実装されておらず、プロバイダー固有のサービスやAPIへの依存度が高い",
          en: "Few mitigation measures; heavy dependence on provider-specific services/APIs.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なベンダーロックイン認識はあり、一部の領域で標準技術を優先しているが、包括的な戦略や移行計画は限定的",
          en: "Lock-in is recognized and standard tech is preferred in some areas, but comprehensive strategy or migration plans are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なロックイン軽減戦略が確立され、オープン標準の採用、アーキテクチャの移植性考慮、代替プロバイダー評価などが実施されている",
          en: "A comprehensive mitigation strategy adopts open standards, designs for portability, and evaluates alternative providers.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なベンダー中立戦略が組織全体で実装され、抽象化レイヤー、代替プロバイダーへの移行計画、リスク評価、ロックイン度の定期的な測定、複数プロバイダー間での負荷分散などが標準化されている",
          en: "An advanced vendor-neutral strategy is organization-wide, with abstraction layers, migration plans, risk evaluation, periodic lock-in measurement, and load balancing across providers.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },

  {
    id: "mch_15",
    category: "multicloud_hybrid_governance",
    text: {
      ja: "マルチクラウド/ハイブリッド環境を管理するためのクラウドセンターオブエクセレンス（CCoE）またはクラウド運用モデルの実装状況はどうですか？",
      en: "What is the implementation status of a Cloud Center of Excellence (CCoE) or cloud operating model for managing multi-cloud/hybrid environments?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "mch_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドセンターオブエクセレンス（CCoE）は、マルチクラウド/ハイブリッド環境全体のベストプラクティス、標準、ガバナンス、知識共有を確立・推進する中央組織です。効果的なCCoEにより、一貫性のある採用と運用が促進されます。",
        links: [
          {
            text: "Cloud Center of Excellence",
            url: "https://cloud.google.com/resources/cloud-teams?hl=ja",
          },
          {
            text: "Multi-cloud Operating Model",
            url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/operating-model/",
          },
        ],
      },
      en: {
        summary:
          "A CCoE establishes and promotes best practices, standards, governance, and knowledge sharing across multi-cloud/hybrid environments. An effective CCoE drives consistent adoption and operations.",
        links: [
          {
            text: "Cloud Center of Excellence",
            url: "https://cloud.google.com/resources/cloud-teams?hl=ja",
          },
          {
            text: "Multi-cloud Operating Model",
            url: "https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/operating-model/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "公式なCCoEやクラウド運用モデルは確立されておらず、クラウド管理は各チームや部門に分散している",
          en: "No formal CCoE or operating model; cloud management is siloed across teams or departments.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なクラウド管理チームまたは取り組みは存在するが、包括的な権限や組織全体にわたる影響力は限定的",
          en: "A basic cloud management team/initiative exists, but its authority and organization-wide influence are limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なCCoEまたはクラウド運用モデルが確立され、標準、ガバナンス、ベストプラクティス、トレーニングプログラムなどを推進している",
          en: "A comprehensive CCoE or operating model promotes standards, governance, best practices, and training programs.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に成熟したCCoEが組織全体に完全に統合され、継続的な革新、戦略的方向性の設定、自動化されたガバナンス、先進的なクラウドサービスモデル、組織変革の推進などを行っている",
          en: "A highly mature CCoE is fully integrated organization-wide, driving continuous innovation, strategic direction, automated governance, advanced cloud service models, and transformational change.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Choose this option if you're not familiar with this topic.",
        },
      },
    ],
  },
];
