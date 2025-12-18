/**
 * インフラストラクチャとプラットフォーム質問モジュール
 *
 * クラウドネイティブインフラストラクチャとプラットフォームに関する質問を定義するモジュールです。
 * クラウドプロバイダー戦略、IaC、プラットフォームエンジニアリングなどの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const infrastructurePlatformQuestions: AssessmentQuestion[] = [
  {
    id: "ip_1",
    category: "infrastructure_platform",
    text: {
      ja: "サーバー、ネットワーク、ストレージ、データベースなどのインフラストラクチャの構成と管理を、手作業による操作ではなく、コード(設定ファイルやスクリプト、例: Terraform, CloudFormation, Ansibleなど)で定義し、そのコードをバージョン管理システム(例: Git)で管理することによって、インフラの構築や変更作業の自動化、再現性、および一貫性を確保していますか？",
      en: "Do you define and manage infrastructure—servers, networks, storage, databases, etc.—as code (e.g., Terraform, CloudFormation, Ansible) stored in Git, guaranteeing automated, reproducible and consistent provisioning and change?",
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
          "Infrastructure as Code (IaC) は、インフラをコードとして定義・管理し、手動作業を自動化し、一貫性と変更追跡性を高めます。",
        links: [
          {
            text: "Infrastructure as Code",
            url: "https://www.redhat.com/en/topics/automation/what-is-infrastructure-as-code-iac",
          },
          {
            text: "Terraform チュートリアル",
            url: "https://qiita.com/NI57721/items/7829e9e64d016e097c28",
          },
        ],
      },
      en: {
        summary:
          "Infrastructure as Code (IaC) treats infrastructure definitions as software, automating manual work and improving consistency and traceability.",
        links: [
          {
            text: "Infrastructure as Code",
            url: "https://www.redhat.com/en/topics/automation/what-is-infrastructure-as-code-iac",
          },
          {
            text: "Terraform Tutorials",
            url: "https://developer.hashicorp.com/terraform/tutorials",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "手作業によるインフラ操作のみで、Infrastructure as Code は採用していない",
          en: "Infrastructure operations are manual; IaC is not adopted.",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のインフラコンポーネントでコードによる定義を行っているが、体系的な管理はされていない",
          en: "Some components are codified, but there is no systematic management.",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なインフラコンポーネントはコードで定義され、バージョン管理されているが、一部手動操作も残っている",
          en: "Most key components are defined and version-controlled as code, though some manual steps remain.",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのインフラコンポーネントがコードで定義され、バージョン管理され、CI/CDパイプラインで自動検証・デプロイされている",
          en: "All infrastructure is codified, version-controlled and automatically validated/deployed via CI/CD.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if you are unfamiliar with the topic.",
        },
      },
    ],
  },

  {
    id: "ip_2",
    category: "infrastructure_platform",
    text: {
      ja: "クラウド戦略はどの程度成熟していますか？",
      en: "How mature is your cloud strategy?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "low",
    },
    assessmentType: "comprehensive",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "明確なクラウド戦略は、クラウドリソースの効果的活用、コスト最適化、セキュリティ、コンプライアンス確保に不可欠です。",
        links: [
          {
            text: "Cloud Migration Best Practices",
            url: "https://cloud.google.com/architecture/migration-to-google-cloud-best-practices?hl=ja",
          },
          {
            text: "Cloud Operating Model",
            url: "https://aws.amazon.com/jp/cloudops/",
          },
        ],
      },
      en: {
        summary:
          "A clear cloud strategy is essential for effective resource use, cost optimisation, security and compliance.",
        links: [
          {
            text: "Cloud Migration Best Practices",
            url: "https://cloud.google.com/architecture/migration-to-gcp-getting-started",
          },
          {
            text: "Cloud Operating Model",
            url: "https://docs.aws.amazon.com/whitepapers/latest/public-sector-cloud-transformation/operations-and-governance-cloud-operating-model.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的なクラウド戦略はなく、アドホックなクラウド利用が主流",
          en: "No systematic strategy; cloud use is ad-hoc.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なクラウド採用戦略は存在するが、最適化や標準化が不十分",
          en: "Basic adoption plan exists but lacks optimisation/standardisation.",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なクラウド戦略が確立され、ガバナンス、コスト管理、セキュリティポリシーが整備されている",
          en: "Comprehensive strategy with governance, cost controls and security policy is in place.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に成熟した戦略が実装され、クラウドCOE、自動最適化、FinOps、マルチ/ハイブリッドクラウドが標準化",
          en: "Highly mature: Cloud CoE, automated optimisation, FinOps and standardised multi/hybrid-cloud.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if you are unfamiliar with the topic.",
        },
      },
    ],
  },

  {
    id: "ip_3",
    category: "infrastructure_platform",
    text: {
      ja: "クラウドインフラストラクチャのセキュリティはどのように管理されていますか？",
      en: "How is cloud-infrastructure security managed?",
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
          "クラウドインフラのセキュリティには、アイデンティティ管理、ネットワークセキュリティ、データ保護、設定管理など多層防御が必要です。",
        links: [
          {
            text: "Cloud Security",
            url: "https://aws.amazon.com/architecture/security-identity-compliance/",
          },
          {
            text: "CSPM",
            url: "https://www.checkpoint.com/cyber-hub/cloud-security/what-is-cspm-cloud-security-posture-management/",
          },
        ],
      },
      en: {
        summary:
          "Cloud-infrastructure security requires a defence-in-depth approach across identity, network, data protection and configuration management.",
        links: [
          {
            text: "Cloud Security",
            url: "https://aws.amazon.com/architecture/security-identity-compliance/",
          },
          {
            text: "CSPM",
            url: "https://www.checkpoint.com/cyber-hub/cloud-security/what-is-cspm-cloud-security-posture-management/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "包括的なコントロールや自動化はほとんどない",
          en: "Comprehensive controls/automation largely absent.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本コントロールはあるが戦略や継続監視は限定的",
          en: "Core controls exist, but strategy & continuous monitoring limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "多層防御・自動コンプライアンス検証・継続監視が実装されている",
          en: "Layered defence with automated compliance checks & continuous monitoring is implemented.",
        },
      },
      {
        value: 100,
        label: {
          ja: "Security as Code、脅威検知、設定ドリフト防止が完全実装",
          en: "Security-as-Code, threat detection and drift prevention fully implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if you are unfamiliar with the topic.",
        },
      },
    ],
  },

  {
    id: "ip_4",
    category: "infrastructure_platform",
    text: {
      ja: "開発者生産性を向上させるためのプラットフォームエンジニアリングの取り組みはどの程度進んでいますか？",
      en: "How advanced are your platform-engineering efforts to improve developer productivity?",
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
          "プラットフォームエンジニアリングは、標準化ツールとセルフサービスを通じてインフラ複雑さを抽象化し、生産性を高めます。",
        links: [
          {
            text: "Platform Engineering",
            url: "https://platformengineering.org/blog/what-is-platform-engineering",
          },
          {
            text: "Internal Developer Platform",
            url: "https://qiita.com/namayasai-tech/items/c25e0ca845bf06e3441d",
          },
        ],
      },
      en: {
        summary:
          "Platform engineering abstracts infrastructure complexity and boosts productivity via standardised, self-service tooling.",
        links: [
          {
            text: "Platform Engineering",
            url: "https://platformengineering.org/blog/what-is-platform-engineering",
          },
          {
            text: "Internal Developer Platform",
            url: "https://internaldeveloperplatform.org/what-is-an-internal-developer-platform/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "プラットフォーム取り組みなし",
          en: "No platform initiative",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部共通サービスはあるが戦略未整備",
          en: "Some shared services; no cohesive strategy",
        },
      },
      {
        value: 66,
        label: {
          ja: "プラットフォームチームがセルフサービス機能を提供",
          en: "Platform team offers self-service capabilities",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なIDPが運用され継続的改善が行われている",
          en: "Advanced IDP with continuous improvement in place",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },

  /* ──────────────────────────────── INTERMEDIATE QUESTIONS ──────────────────────────────── */
  {
    id: "ip_5",
    category: "infrastructure_platform",
    text: {
      ja: "クラウドリソースのコスト管理と最適化をどのように行っていますか？",
      en: "How do you manage and optimise cloud-resource costs?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "ip_2", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドコスト管理は、使用状況可視化、無駄削減、リソースサイジング最適化、予約インスタンス活用などを通じて支出を効率化します。",
        links: [
          {
            text: "Cloud Cost Optimization",
            url: "https://aws.amazon.com/aws-cost-management/",
          },
          { text: "FinOps", url: "https://www.finops.org/" },
        ],
      },
      en: {
        summary:
          "Cloud-cost management leverages visibility, waste reduction, right-sizing and reservations to keep spend efficient.",
        links: [
          {
            text: "Cloud Cost Optimization",
            url: "https://aws.amazon.com/aws-cost-management/",
          },
          { text: "FinOps", url: "https://www.finops.org/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラウドコストはリアクティブに対処",
          en: "Cost handled reactively",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なモニタリングと予算設定のみ",
          en: "Basic monitoring & budgeting only",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的フレームワークで最適化手法を活用",
          en: "Comprehensive framework with optimisation techniques",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な FinOps でリアルタイム可視化と自動最適化",
          en: "Advanced FinOps with real-time visibility & automated optimisation",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "ip_6",
    category: "infrastructure_platform",
    text: {
      ja: "インフラストラクチャとプラットフォームの自動化レベルはどの程度ですか？",
      en: "What is the level of automation for your infrastructure and platform?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "ip_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "自動化は、プロビジョニング、設定、スケーリング、修復などを手動介入なしで実行し、効率性と信頼性を向上させます。",
        links: [
          {
            text: "Infrastructure Automation",
            url: "https://www.redhat.com/en/topics/automation/what-is-infrastructure-automation",
          },
          {
            text: "Autonomous Cloud",
            url: "https://www.dynatrace.com/ja/services-support/autonomous-cloud-enablement/",
          },
        ],
      },
      en: {
        summary:
          "Automation executes provisioning, configuration, scaling and healing without manual intervention, boosting efficiency and reliability.",
        links: [
          {
            text: "Infrastructure Automation",
            url: "https://www.redhat.com/en/topics/automation/what-is-infrastructure-automation",
          },
          {
            text: "Autonomous Cloud",
            url: "https://www.dynatrace.com/services-support/autonomous-cloud-enablement/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "自動化は限定的で多くが手動",
          en: "Automation limited; most tasks manual",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なプロビジョニング/設定自動化のみ",
          en: "Basic provisioning/configuration automation only",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的フレームワークで多くの操作が自動化",
          en: "Comprehensive framework automates most operations",
        },
      },
      {
        value: 100,
        label: {
          ja: "予測スケーリングや自己修復など自律型インフラを実装",
          en: "Autonomous infra with predictive scaling & self-healing in place",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "ip_7",
    category: "infrastructure_platform",
    text: {
      ja: "マルチクラウドまたはハイブリッドクラウド戦略はどのように実装されていますか？",
      en: "How is your multi-cloud or hybrid-cloud strategy implemented?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "ip_2", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "マルチ/ハイブリッドクラウドは、ベンダーロックイン回避や規制要件対応に役立つ一方、複雑性を増します。",
        links: [
          {
            text: "Multi-cloud Strategy",
            url: "https://www.redhat.com/en/topics/cloud-computing/what-is-multicloud",
          },
          {
            text: "Hybrid Cloud",
            url: "https://www.redhat.com/ja/topics/cloud-computing/what-is-hybrid-cloud",
          },
        ],
      },
      en: {
        summary:
          "Multi-/hybrid-cloud offers vendor-lock-in avoidance and compliance benefits but increases complexity.",
        links: [
          {
            text: "Multi-cloud Strategy",
            url: "https://www.redhat.com/en/topics/cloud-computing/what-is-multicloud",
          },
          {
            text: "Hybrid Cloud",
            url: "https://www.redhat.com/en/topics/cloud-computing/what-is-hybrid-cloud",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "戦略なし。単一クラウド/オンプレのみ利用",
          en: "No strategy—single cloud or on-prem only",
        },
      },
      {
        value: 33,
        label: {
          ja: "複数クラウドを使用するが統合戦略はない",
          en: "Multiple clouds used but no integrated strategy",
        },
      },
      {
        value: 66,
        label: {
          ja: "明確な戦略があり一貫した運用管理を実装",
          en: "Clear strategy with consistent operations in place",
        },
      },
      {
        value: 100,
        label: {
          ja: "抽象化レイヤーと自動ワークロード配置を備えた高度なフレームワーク",
          en: "Advanced framework with abstraction layer & automated workload placement",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "ip_8",
    category: "infrastructure_platform",
    text: {
      ja: "セルフサービス型の内部開発者プラットフォーム(IDP)を構築・提供していますか？",
      en: "Do you provide a self-service internal developer platform (IDP) that abstracts infra complexity and accelerates delivery?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "ip_4", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "IDP は開発者が標準化されたツール・サービスをセルフサービスで利用し、一貫性あるデリバリーと生産性向上を実現します。",
        links: [
          {
            text: "Internal Developer Platform",
            url: "https://qiita.com/namayasai-tech/items/c25e0ca845bf06e3441d",
          },
          {
            text: "Platform Engineering",
            url: "https://platformengineering.org/blog/what-is-platform-engineering",
          },
        ],
      },
      en: {
        summary:
          "An IDP lets devs consume standard tools/services self-service, boosting productivity and delivery consistency.",
        links: [
          {
            text: "Internal Developer Platform",
            url: "https://internaldeveloperplatform.org/what-is-an-internal-developer-platform/",
          },
          {
            text: "Platform Engineering",
            url: "https://platformengineering.org/blog/what-is-platform-engineering",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "IDPは存在せず各チームが独自管理",
          en: "No IDP; teams manage tools on their own",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なツール提供はあるがセルフサービス/統合は限定的",
          en: "Some tooling offered but limited self-service/integration",
        },
      },
      {
        value: 66,
        label: {
          ja: "充実したIDPを提供するが一部機能やUXに課題",
          en: "IDP is fairly complete though some UX/gaps remain",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に洗練されたIDPを提供し継続的に改善",
          en: "Highly polished IDP with continuous improvement",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "ip_9",
    category: "infrastructure_platform",
    text: {
      ja: "自動最適化マネージャーを導入しコスト/パフォーマンスを最適化していますか？",
      en: "Do you run an auto-optimisation manager (e.g., Karpenter) that continuously balances cost, performance and operations?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "ip_6", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "自動最適化マネージャーはリソース使用状況と要件を分析し、最適なインフラ構成を継続的に実現します。",
        links: [
          {
            text: "Kubernetes Autoscaler",
            url: "https://github.com/kubernetes/autoscaler",
          },
          { text: "Karpenter", url: "https://karpenter.sh/docs/" },
        ],
      },
      en: {
        summary:
          "Auto-optimisation managers analyse utilisation and requirements to keep infrastructure continuously right-sized for cost and performance.",
        links: [
          {
            text: "Kubernetes Autoscaler",
            url: "https://github.com/kubernetes/autoscaler",
          },
          { text: "Karpenter", url: "https://karpenter.sh/docs/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "最適化は主に手動対応", en: "Optimisation mainly manual" },
      },
      {
        value: 33,
        label: {
          ja: "基本的オートスケーリングのみ導入",
          en: "Basic auto-scaling only",
        },
      },
      {
        value: 66,
        label: {
          ja: "複数ツールである程度自動化",
          en: "Several tools provide partial automation",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な自動最適化システムが継続的に最適割り当て",
          en: "Advanced system continuously auto-optimises allocation",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "ip_10",
    category: "infrastructure_platform",
    text: { ja: "クラウド間ポータビリティをどの程度確保していますか？", en: "How well is cloud portability ensured, enabling migration between providers with minimal changes?" },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: { executive: "high", manager: "medium", practitioner: "medium" },
    assessmentType: "optional",
    dependencies: [{ questionId: "ip_7", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary: "クラウドポータビリティは標準APIや抽象化を使用してベンダー依存を最小化し、移行を容易にします。",
        links: [
          { text: "Cloud Portability",      url: "https://www.redhat.com/ja/topics/cloud-computing/what-is-hybrid-cloud" },
          { text: "Kubernetes Portability", url: "https://kubernetes.io/docs/concepts/architecture/cloud-controller/" }
        ]
      },
      en: {
        summary: "Portability minimises vendor lock-in via standard APIs/abstractions, making cross-cloud moves easier.",
        links: [
          { text: "Cloud Portability",      url: "https://www.redhat.com/en/topics/cloud-computing/what-is-hybrid-cloud" },
          { text: "Kubernetes Portability", url: "https://kubernetes.io/docs/concepts/architecture/cloud-controller/" }
        ]
      }
    },
    options: [
      { value: 0,  label: { ja: "特定クラウドに強く依存し移行は困難", en: "Strongly tied to one provider; migration hard" } },
      { value: 33, label: { ja: "一部ポータブル設計だが多くが依存", en: "Some components portable; many remain tied" } },
      { value: 66, label: { ja: "大部分が標準APIでポータブルだが一部依存あり", en: "Most use standard APIs; some dependencies remain" } },
      { value: 100,label: { ja: "全アプリがベンダー依存最小で簡単に移行可能", en: "All apps designed portable—easy migration anywhere" } },
      {
        value: -1,label: { ja: "わかりません", en: "I don't know" }, isDontKnow: true,
        description: { ja: "このトピックについての知識がない場合は、このオプションを選択してください。", en: "Select this option if unfamiliar." }
      }
    ]
  },

  {
    id: "ip_11",
    category: "infrastructure_platform",
    text: {
      ja: "インフラとプラットフォームの信頼性と復元力をどのように確保していますか？",
      en: "How do you ensure reliability and resilience of infrastructure and platform?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: { executive: "high", manager: "high", practitioner: "high" },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "ip_6", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "冗長化、自動修復、負荷分散などで障害から迅速回復し、信頼性を確保します。",
        links: [
          {
            text: "Cloud Resilience",
            url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html",
          },
          {
            text: "Infrastructure Reliability",
            url: "https://cloud.google.com/architecture/framework/reliability",
          },
        ],
      },
      en: {
        summary:
          "Redundancy, self-healing, load balancing, etc., enable fast recovery and high reliability.",
        links: [
          {
            text: "Cloud Resilience",
            url: "https://docs.aws.amazon.com/pdfs/wellarchitected/latest/reliability-pillar/wellarchitected-reliability-pillar.pdf",
          },
          {
            text: "Infrastructure Reliability",
            url: "https://cloud.google.com/architecture/framework/reliability",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的対策なく障害対応はリアクティブ",
          en: "Little systematic mitigation; reactive response",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的冗長化/H/Aはあるが自動修復限定的",
          en: "Basic redundancy/H.A.; limited self-healing",
        },
      },
      {
        value: 66,
        label: {
          ja: "自動フェイルオーバー等を備えた包括フレームワーク",
          en: "Comprehensive framework with auto-failover etc.",
        },
      },
      {
        value: 100,
        label: {
          ja: "カオスエンジニアリング/自己修復/グローバル分散を実装",
          en: "Chaos-engineering, self-healing, global distribution",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "ip_12",
    category: "infrastructure_platform",
    text: { ja: "エッジコンピューティングとIoTインフラをどのように管理していますか？", en: "How do you manage edge-computing and IoT infrastructure?" },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: { executive: "medium", manager: "medium", practitioner: "high" },
    assessmentType: "optional",
    dependencies: [{ questionId: "ip_2", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary: "エッジ/IoTインフラ管理は中央クラウドとエッジデバイス間で分散計算と安全な運用を実現します。",
        links: [
          { text: "Edge Computing", url: "https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-edge-computing/" },
          { text: "IoT Infrastructure", url: "https://aws.amazon.com/iot/" }
        ]
      },
      en: {
        summary: "Edge/IoT management distributes compute between cloud and edge, enabling low latency and secure operations.",
        links: [
          { text: "Edge Computing", url: "https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-edge-computing/" },
          { text: "IoT Infrastructure", url: "https://aws.amazon.com/iot/" }
        ]
      }
    },
    options: [
      { value: 0,  label: { ja: "従来の管理のみ、体系的エッジ/IoT対策なし", en: "Traditional mgmt only; no systematic edge/IoT" } },
      { value: 33, label: { ja: "基本デバイス管理はあるが中央統合は限定",   en: "Basic device mgmt; limited central integration" } },
      { value: 66, label: { ja: "包括プラットフォームで中央設定/監視を実装", en: "Comprehensive platform for central config/monitoring" } },
      { value: 100,label: { ja: "ゼロタッチ導入、エッジAI、セキュア通信を実装", en: "Zero-touch onboarding, edge-AI, secure comms" } },
      {
        value: -1,label: { ja: "わかりません", en: "I don't know" }, isDontKnow: true,
        description: { ja: "このトピックについての知識がない場合は、このオプションを選択してください。", en: "Select this option if unfamiliar." }
      }
    ]
  },

  {
    id: "ip_13",
    category: "infrastructure_platform",
    text: { ja: "インフラとプラットフォームのコンプライアンスをどのように管理していますか？", en: "How do you manage compliance for infrastructure and platform?" },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: { executive: "high", manager: "high", practitioner: "medium" },
    assessmentType: "optional",
    dependencies: [{ questionId: "ip_3", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary: "自動ポリシー適用や継続検証で規制準拠と監査効率を確保します。",
        links: [
          { text: "Cloud Compliance", url: "https://www.redhat.com/en/solutions/compliance-approach" },
          { text: "Compliance as Code", url: "https://qiita.com/tanopanta/items/75c32fe1e6fecf47b710" }
        ]
      },
      en: {
        summary: "Automated policy enforcement and continuous validation ensure regulatory compliance and audit efficiency.",
        links: [
          { text: "Cloud Compliance", url: "https://www.redhat.com/en/solutions/compliance-approach" },
          { text: "Compliance as Code", url: "https://medium.com/spacelift/what-is-policy-as-code-pac-how-do-you-implement-it-5d43d906368e" }
        ]
      }
    },
    options: [
      { value: 0,  label: { ja: "コンプライアンスは主に手動で自動化ほぼ無し", en: "Compliance mostly manual; little automation" } },
      { value: 33, label: { ja: "基本チェックと文書化のみ、自動検証不十分",  en: "Basic checks/docs; insufficient auto-validation" } },
      { value: 66, label: { ja: "自動ポリシー検証と証跡収集を実装",          en: "Automated policy checks and evidence collection" } },
      { value: 100,label: { ja: "Compliance as Code、リアルタイムモニタリング、自動修復を実装", en: "Compliance-as-Code, real-time monitoring & auto-remediation" } },
      {
        value: -1,label: { ja: "わかりません", en: "I don't know" }, isDontKnow: true,
        description: { ja: "このトピックについての知識がない場合は、このオプションを選択してください。", en: "Select this option if unfamiliar." }
      }
    ]
  },

  {
    id: "ip_14",
    category: "infrastructure_platform",
    text: { ja: "セルフサービス機能と開発者体験(DevX)をどのように最適化していますか？", en: "How do you optimise self-service capabilities and developer experience (DevX)?" },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: { executive: "medium", manager: "high", practitioner: "high" },
    assessmentType: "optional",
    dependencies: [{ questionId: "ip_8", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary: "優れたセルフサービスとDevXは生産性・満足度を高め、迅速なフィードバックを実現します。",
        links: [
          { text: "Developer Experience", url: "https://www.thoughtworks.com/insights/podcasts/technology-podcasts/measuring-developer-experience" },
          { text: "Platform Self-service", url: "https://qiita.com/namayasai-tech/items/c25e0ca845bf06e3441d" }
        ]
      },
      en: {
        summary: "Great self-service and DevX boost productivity and satisfaction, delivering fast feedback loops.",
        links: [
          { text: "Developer Experience", url: "https://www.thoughtworks.com/insights/blog/engineering-effectiveness/level-up-developer-experience-five-practical-strategies-engineering-teams" },
          { text: "Platform Self-service", url: "https://internaldeveloperplatform.org/what-is-an-internal-developer-platform/" }
        ]
      }
    },
    options: [
      { value: 0,  label: { ja: "セルフサービス限定的、管理者介入多い", en: "Limited self-service; many admin handoffs" } },
      { value: 33, label: { ja: "基本セルフサービスポータルのみ、UX課題", en: "Basic portal; usability gaps" } },
      { value: 66, label: { ja: "包括セルフサービス＋自動ワークフローを提供", en: "Comprehensive self-service with automated workflows" } },
      { value: 100,label: { ja: "AIアシスト/継続フィードバック付き高度DevX", en: "Advanced DevX with AI assist & continuous feedback" } },
      {
        value: -1,label: { ja: "わかりません", en: "I don't know" }, isDontKnow: true,
        description: { ja: "このトピックについての知識がない場合は、このオプションを選択してください。", en: "Select this option if unfamiliar." }
      }
    ]
  },

  {
    id: "ip_15",
    category: "infrastructure_platform",
    text: {
      ja: "ゼロトラストアーキテクチャをどのように実装していますか？",
      en: "How do you implement Zero-Trust architecture in infra & platform?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "ip_3", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ゼロトラストは\"常に検証\"を原則とし、マイクロセグメンテーションと継続的認証で安全性を高めます。",
        links: [
          {
            text: "Zero Trust Architecture",
            url: "https://www.nist.gov/publications/zero-trust-architecture",
          },
          {
            text: "Zero Trust Implementation",
            url: "https://cloud.google.com/beyondcorp",
          },
        ],
      },
      en: {
        summary:
          "Zero Trust enforces 'never trust, always verify' via micro-segmentation and continuous authentication.",
        links: [
          {
            text: "Zero Trust Architecture",
            url: "https://www.nist.gov/publications/zero-trust-architecture",
          },
          {
            text: "Zero Trust Implementation",
            url: "https://cloud.google.com/beyondcorp",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "境界型モデル中心でゼロトラスト未導入",
          en: "Perimeter-centric; Zero Trust not adopted",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部原則採用だが包括実装は進行中",
          en: "Some principles adopted; full rollout in progress",
        },
      },
      {
        value: 66,
        label: {
          ja: "ID検証/最小権限/マイクロセグメンテーション実装",
          en: "ID verification, least privilege, micro-segmentation implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "継続認証/動的セグメンテーション/暗号通信を完全実装",
          en: "Continuous auth, dynamic segmentation, encrypted comms fully implemented",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "ip_16",
    category: "infrastructure_platform",
    text: {
      ja: "サーバーレス/FaaSプラットフォームをどのように活用していますか？",
      en: "How do you leverage serverless/FaaS platforms?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "optional",
    dependencies: [{ questionId: "ip_2", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "サーバーレスはインフラ管理を抽象化し、イベント駆動アーキテクチャと従量課金で開発を加速します。",
        links: [
          {
            text: "Serverless Computing",
            url: "https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-serverless-computing/",
          },
          {
            text: "FaaS Architecture",
            url: "https://www.redhat.com/en/topics/cloud-native-apps/what-is-faas",
          },
        ],
      },
      en: {
        summary:
          "Serverless abstracts infra, enabling event-driven apps and pay-per-use, accelerating development.",
        links: [
          {
            text: "Serverless Computing",
            url: "https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-serverless-computing/",
          },
          {
            text: "FaaS Architecture",
            url: "https://www.redhat.com/en/topics/cloud-native-apps/what-is-faas",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "サーバーレスはほとんど未使用",
          en: "Serverless hardly used",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の自動化/イベント処理で試験利用",
          en: "Trial use for minor automation/events",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要ユースケースで広く採用",
          en: "Widely adopted for key use-cases",
        },
      },
      {
        value: 100,
        label: {
          ja: "マルチクラウド対応の高度サーバーレス戦略実装",
          en: "Advanced, multi-cloud serverless strategy implemented",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "ip_17",
    category: "infrastructure_platform",
    text: {
      ja: "GitOpsアプローチをどのように適用していますか？",
      en: "How do you apply a GitOps approach to infrastructure and platform?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: { executive: "low", manager: "high", practitioner: "high" },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "ip_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "GitOpsは宣言的設定をGitで管理し、変更の追跡性と自動同期を提供します。",
        links: [
          {
            text: "GitOps Principles",
            url: "https://www.redhat.com/ja/topics/devops/what-is-gitops",
          },
          {
            text: "Infrastructure GitOps",
            url: "https://www.redhat.com/en/topics/devops/what-is-gitops",
          },
        ],
      },
      en: {
        summary:
          "GitOps stores declarative config in Git, offering traceable changes and automatic synchronisation.",
        links: [
          {
            text: "GitOps Principles",
            url: "https://opengitops.dev/",
          },
          {
            text: "Infrastructure GitOps",
            url: "https://www.redhat.com/en/topics/devops/what-is-gitops",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "GitOpsは未採用、手動/スクリプト管理",
          en: "GitOps not used; manual or scripts",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部コンポーネントで試験的に採用",
          en: "Trial GitOps for some components",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要コンポーネントで宣言的設定＋自動同期",
          en: "Declarative config + auto-sync for key components",
        },
      },
      {
        value: 100,
        label: {
          ja: "全インフラをGitOpsで管理しドリフト検出/修復を実装",
          en: "All infra managed by GitOps with drift detection & auto-fix",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },

  {
    id: "ip_18",
    category: "infrastructure_platform",
    text: {
      ja: "持続可能なインフラ/プラットフォーム実践をどのように取り入れていますか？",
      en: "How do you incorporate sustainable-infrastructure practices?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "optional",
    dependencies: [{ questionId: "ip_2", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "エネルギー効率最適化や炭素排出削減など、環境への影響を最小化しつつビジネス目標を達成します。",
        links: [
          {
            text: "Green Cloud Computing",
            url: "https://www.accenture.com/content/dam/accenture/final/accenture-com/document/Accenture-360-Value-Report-2022-JP.pdf",
          },
          {
            text: "Sustainable IT",
            url: "https://www.itmedia.co.jp/enterprise/articles/2411/05/news067.html",
          },
        ],
      },
      en: {
        summary:
          "Sustainable practices minimise environmental impact via energy efficiency and carbon reduction while meeting business goals.",
        links: [
          {
            text: "Green Cloud Computing",
            url: "https://insuranceblog.accenture.com/wp-content/uploads/2021/06/The-Green-Behind-The-Cloud-Accenture.pdf",
          },
          {
            text: "Sustainable IT",
            url: "https://www.ibm.com/think/topics/sustainable-it",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "持続可能性への取り組みはほとんどなし",
          en: "Little focus on sustainability",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的省エネ対策のみ、戦略や測定なし",
          en: "Basic energy savings; no strategy/metrics",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括フレームワークで効率化や排出測定を実施",
          en: "Framework for efficiency and emissions measurement",
        },
      },
      {
        value: 100,
        label: {
          ja: "カーボンアウェアなワークロード配置と最適化を実装",
          en: "Carbon-aware workload placement & optimisation implemented",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "このトピックについての知識がない場合は、このオプションを選択してください。",
          en: "Select this option if unfamiliar.",
        },
      },
    ],
  },
];
