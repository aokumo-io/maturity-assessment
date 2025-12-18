/**
 * アプリケーションアーキテクチャ質問モジュール
 *
 * クラウドネイティブアプリケーションのアーキテクチャに関する質問を定義するモジュールです。
 * Twelve-Factor App原則、マイクロサービス、API設計などの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const applicationArchitectureQuestions: AssessmentQuestion[] = [
  // Base Questions (Always shown first)
  {
    id: "aa_1",
    category: "application_architecture",
    text: {
      ja: "アプリケーションはTwelve-Factor Appの原則にどの程度従っていますか？",
      en: "To what extent do your applications follow Twelve-Factor App principles?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "quick",
    baseQuestion: true, // Indicator that this is a first-page question
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "Twelve-Factor Appの原則は、クラウドネイティブアプリケーションを構築するための方法論で、可搬性、スケーラビリティ、メンテナンス性に優れたアプリケーションの開発を支援します。",
        links: [
          { text: "Twelve-Factor App", url: "https://12factor.net/ja/" },
          {
            text: "CNCF Cloud Native Definition",
            url: "https://github.com/cncf/toc/blob/main/DEFINITION.md",
          },
        ],
      },
      en: {
        summary:
          "The Twelve-Factor App methodology is a set of principles for building cloud-native applications that are portable, scalable, and maintainable.",
        links: [
          { text: "Twelve-Factor App", url: "https://12factor.net/" },
          {
            text: "CNCF Cloud Native Definition",
            url: "https://github.com/cncf/toc/blob/main/DEFINITION.md",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "Twelve-Factor Appの原則はほとんど採用されていない",
          en: "Not following Twelve-Factor App principles",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションで基本的な原則（コードベース、依存関係、設定など）が採用されている",
          en: "Some applications follow basic principles (codebase, dependencies, config, etc.)",
        },
      },
      {
        value: 66,
        label: {
          ja: "多くのアプリケーションがほとんどの原則に従っており、新規開発では標準として採用されている",
          en: "Most applications follow most principles, and they are standard for new development",
        },
      },
      {
        value: 100,
        label: {
          ja: "すべてのアプリケーションが完全にTwelve-Factor Appの原則に準拠し、継続的にベストプラクティスが適用・改善されている",
          en: "All applications fully comply with Twelve-Factor App principles, with best practices continuously applied and improved",
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
    id: "aa_2",
    category: "application_architecture",
    text: {
      ja: "クラウドネイティブのアーキテクチャパターンをどのように実装していますか？",
      en: "How are you implementing cloud native architectural patterns?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "quick",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドネイティブアーキテクチャパターンには、マイクロサービス、イベント駆動型アーキテクチャ、APIゲートウェイ、フロントエンドとバックエンドの分離などがあります。これらのパターンはスケーラビリティ、レジリエンス、開発速度の向上に役立ちます。",
        links: [
          {
            text: "Cloud Native Patterns",
            url: "https://www.manning.com/books/cloud-native-patterns",
          },
          {
            text: "Microsoft Cloud Design Patterns",
            url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/",
          },
        ],
      },
      en: {
        summary:
          "Cloud native architecture patterns include microservices, event-driven architecture, API gateways, and frontend-backend separation. These patterns help improve scalability, resilience, and development velocity.",
        links: [
          {
            text: "Cloud Native Patterns",
            url: "https://www.manning.com/books/cloud-native-patterns",
          },
          {
            text: "Microsoft Cloud Design Patterns",
            url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "モノリシックなアーキテクチャが主流で、クラウドネイティブパターンはほとんど採用されていない",
          en: "Mostly monolithic architectures with few cloud native patterns adopted",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションで基本的なクラウドネイティブパターン（サービス分割、API設計など）が採用されている",
          en: "Some applications use basic cloud native patterns (service decomposition, API design, etc.)",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なアプリケーションで包括的なクラウドネイティブパターン（マイクロサービス、イベント駆動型、耐障害性パターンなど）が実装されている",
          en: "Key applications implement comprehensive cloud native patterns (microservices, event-driven, resilience patterns, etc.)",
        },
      },
      {
        value: 100,
        label: {
          ja: "すべてのアプリケーションがクラウドネイティブを前提に設計され、最新のベストプラクティス（サービスメッシュ、分散トレーシングなど）が組織全体で標準化されている",
          en: "All applications are designed as cloud native, with latest best practices (service mesh, distributed tracing, etc.) standardized across the organization",
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
    id: "aa_3",
    category: "application_architecture",
    text: {
      ja: "アプリケーションのコードは単一のコードベースでバージョン管理されており、様々な環境(開発、ステージング、本番)へのデプロイはそのコードベースから行われていますか？",
      en: "Is your application code managed in a single codebase with version control, with deployments to various environments (dev, staging, production) all made from that codebase?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "quick",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "単一のコードベースとバージョン管理は、Twelve-Factor Appの第一の原則であり、環境間の一貫性を保ち、「私の環境では動作するが」というような問題を防ぎます。",
        links: [
          {
            text: "Twelve-Factor: Codebase",
            url: "https://12factor.net/ja/codebase",
          },
          {
            text: "Git Flow",
            url: "https://nvie.com/posts/a-successful-git-branching-model/",
          },
        ],
      },
      en: {
        summary:
          "A single codebase with version control is the first principle of the Twelve-Factor App methodology, maintaining consistency between environments and preventing 'works on my machine' issues.",
        links: [
          {
            text: "Twelve-Factor: Codebase",
            url: "https://12factor.net/codebase",
          },
          {
            text: "Git Flow",
            url: "https://nvie.com/posts/a-successful-git-branching-model/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コードベースの管理が不十分で、環境ごとに異なるコードベースが存在する",
          en: "Poor codebase management with different codebases for different environments",
        },
      },
      {
        value: 33,
        label: {
          ja: "主要なアプリケーションコードは単一のコードベースで管理されているが、環境ごとの変更やカスタマイズが発生している",
          en: "Main application code is managed in a single codebase, but environment-specific changes or customizations occur",
        },
      },
      {
        value: 66,
        label: {
          ja: "全てのアプリケーションコードは単一のコードベースで管理され、環境差分は設定で対応しているが、一部例外がある",
          en: "All application code is managed in a single codebase with environment differences in configuration, but some exceptions exist",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのアプリケーションは厳密に単一のコードベースから全環境へデプロイされ、環境差分は完全に設定で管理されている",
          en: "All applications are strictly deployed to all environments from a single codebase, with environment differences fully managed through configuration",
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
    id: "aa_17",
    category: "application_architecture",
    text: {
      ja: "アプリケーションのモダン化戦略はどのように定義されていますか？",
      en: "How is your application modernization strategy defined?",
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
          "アプリケーションのモダン化戦略は、レガシーシステムからクラウドネイティブへの移行パスを定義し、ビジネス価値とテクニカルデットのバランスを取るものです。",
        links: [
          {
            text: "Gartner Application Modernization",
            url: "https://www.gartner.com/en/information-technology/glossary/application-modernization",
          },
          {
            text: "6R戦略",
            url: "https://aws.amazon.com/jp/blogs/enterprise-strategy/6-strategies-for-migrating-applications-to-the-cloud/",
          },
        ],
      },
      en: {
        summary:
          "An application modernization strategy defines the path from legacy systems to cloud native, balancing business value with technical debt reduction.",
        links: [
          {
            text: "Gartner Application Modernization",
            url: "https://www.gartner.com/en/information-technology/glossary/application-modernization",
          },
          {
            text: "6R Strategy",
            url: "https://aws.amazon.com/blogs/enterprise-strategy/6-strategies-for-migrating-applications-to-the-cloud/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "アプリケーションモダン化の明確な戦略はなく、ad-hocな対応が主流",
          en: "No clear application modernization strategy, with mainly ad-hoc approaches",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なモダン化戦略が存在するが、主に技術的な視点のみで、ビジネス価値との連携が不足している",
          en: "Basic modernization strategy exists, but mainly from a technical perspective with limited business value alignment",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なモダン化戦略が定義され、リファクタリング、リプラットフォーム、リライトなどのアプローチが使い分けられている",
          en: "Comprehensive modernization strategy defined with differentiated approaches for refactoring, replatforming, rewriting, etc.",
        },
      },
      {
        value: 100,
        label: {
          ja: "ビジネス価値とテクニカルデットのバランスを取った戦略的なモダン化ロードマップが確立され、継続的に更新されている",
          en: "Strategic modernization roadmap established that balances business value and technical debt, continuously updated",
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
    id: "aa_4",
    category: "application_architecture",
    text: {
      ja: "アプリケーションが必要とする全ての外部ライブラリやツールは、依存関係管理ツール(例: npm, Bundler, pip)によって明示的に宣言され、隔離された形で管理されていますか？(システムワイドなパッケージへの暗黙的な依存はありませんか？)",
      en: "Are all external libraries and tools required by your applications explicitly declared and isolated through dependency management tools (e.g., npm, Bundler, pip)? (Are there implicit dependencies on system-wide packages?)",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "none",
      manager: "low",
      practitioner: "high",
    },
    assessmentType: "quick",
    dependencies: [
      { questionId: "aa_1", minValue: 33 }, // Only show if aa_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "依存関係の明示的な宣言と隔離は、Twelve-Factor Appの第二の原則であり、「私のマシンでは動作する」という問題を解決し、アプリケーションの可搬性を高めます。",
        links: [
          {
            text: "Twelve-Factor: Dependencies",
            url: "https://12factor.net/ja/dependencies",
          },
          {
            text: "Dependency Management Best Practices",
            url: "https://snyk.io/blog/best-practices-for-dependency-management/",
          },
        ],
      },
      en: {
        summary:
          "Explicit declaration and isolation of dependencies is the second principle of the Twelve-Factor App, solving the 'works on my machine' problem and increasing application portability.",
        links: [
          {
            text: "Twelve-Factor: Dependencies",
            url: "https://12factor.net/dependencies",
          },
          {
            text: "Dependency Management Best Practices",
            url: "https://snyk.io/blog/best-practices-for-dependency-management/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "依存関係は明示的に管理されておらず、グローバルにインストールされたライブラリやシステムパッケージに依存している",
          en: "Dependencies are not explicitly managed, relying on globally installed libraries or system packages",
        },
      },
      {
        value: 33,
        label: {
          ja: "主要な依存関係は管理ツールで宣言されているが、一部の依存関係はシステム全体で共有されている",
          en: "Major dependencies are declared using management tools, but some dependencies are shared system-wide",
        },
      },
      {
        value: 66,
        label: {
          ja: "ほとんどの依存関係は明示的に宣言され管理されているが、一部の開発ツールや特殊なライブラリは例外となっている",
          en: "Most dependencies are explicitly declared and managed, with exceptions for some development tools or special libraries",
        },
      },
      {
        value: 100,
        label: {
          ja: "全ての依存関係が明示的に宣言され、完全に隔離された環境で管理されており、システムワイドなパッケージへの依存は一切ない",
          en: "All dependencies are explicitly declared and managed in completely isolated environments, with no reliance on system-wide packages",
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
    id: "aa_5",
    category: "application_architecture",
    text: {
      ja: "環境ごとに異なる設定情報(データベース接続情報、APIキーなど)は、コードから完全に分離され、環境変数を通じてアプリケーションに渡されていますか？",
      en: "Are environment-specific configuration settings (database connection info, API keys, etc.) completely separated from code and passed to applications through environment variables?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [
      { questionId: "aa_1", minValue: 33 }, // Only show if aa_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "設定の外部化は、Twelve-Factor Appの重要な原則の一つで、環境ごとの違いを管理し、機密情報の漏洩リスクを減らします。",
        links: [
          {
            text: "Twelve-Factor: Config",
            url: "https://12factor.net/ja/config",
          },
          {
            text: "Managing Secrets in Kubernetes",
            url: "https://kubernetes.io/docs/concepts/configuration/secret/",
          },
        ],
      },
      en: {
        summary:
          "Externalized configuration is a key principle of the Twelve-Factor App methodology, managing environment differences and reducing the risk of leaked sensitive information.",
        links: [
          { text: "Twelve-Factor: Config", url: "https://12factor.net/config" },
          {
            text: "Managing Secrets in Kubernetes",
            url: "https://kubernetes.io/docs/concepts/configuration/secret/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "設定情報はコード内にハードコーディングされている",
          en: "Configuration settings are hardcoded in the application code",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の設定は環境変数やプロパティファイルで管理されているが、コード内に設定が残っている",
          en: "Some settings are managed through environment variables or property files, but some remain in the code",
        },
      },
      {
        value: 66,
        label: {
          ja: "ほとんどの設定はコードから分離されているが、一部の設定は環境ごとに異なるファイルで管理されている",
          en: "Most settings are separated from code, but some are managed in different files for each environment",
        },
      },
      {
        value: 100,
        label: {
          ja: "全ての環境固有の設定はコードから完全に分離され、環境変数または専用の設定管理システム（Kubernetesの ConfigMapやSecretなど）を通じて管理されている",
          en: "All environment-specific settings are completely separated from code and managed through environment variables or dedicated configuration management systems (like Kubernetes ConfigMaps and Secrets)",
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
    id: "aa_6",
    category: "application_architecture",
    text: {
      ja: "データベース、キャッシュ、メッセージキューなどの連携サービスは、ネットワーク経由でアクセスされるリソースとして扱われ、設定を通じて接続情報が提供されていますか？(ローカルサービスへの依存はありませんか？)",
      en: "Are backing services like databases, caches, and message queues treated as attached resources accessed via network with connection information provided through configuration? (No dependencies on local services?)",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "aa_1", minValue: 66 }, // Only show if aa_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "バッキングサービスをアタッチドリソースとして扱うことで、アプリケーションの可搬性と柔軟性が向上し、環境間の移行やスケーリングが容易になります。",
        links: [
          {
            text: "Twelve-Factor: Backing Services",
            url: "https://12factor.net/ja/backing-services",
          },
          {
            text: "Cloud Native Storage",
            url: "https://www.cncf.io/blog/2020/02/21/cloud-native-storage-what-it-is-and-why-it-matters/",
          },
        ],
      },
      en: {
        summary:
          "Treating backing services as attached resources improves application portability and flexibility, making environment transitions and scaling easier.",
        links: [
          {
            text: "Twelve-Factor: Backing Services",
            url: "https://12factor.net/backing-services",
          },
          {
            text: "Cloud Native Storage",
            url: "https://www.cncf.io/blog/2020/02/21/cloud-native-storage-what-it-is-and-why-it-matters/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "バッキングサービスはアプリケーションと密結合しており、多くのローカルサービスへの依存がある",
          en: "Backing services are tightly coupled with applications, with many dependencies on local services",
        },
      },
      {
        value: 33,
        label: {
          ja: "主要なバッキングサービスはネットワーク経由でアクセスされるが、一部のサービスはローカルに依存している",
          en: "Major backing services are accessed over the network, but some services depend on local resources",
        },
      },
      {
        value: 66,
        label: {
          ja: "ほとんどのバッキングサービスはネットワーク経由でアクセスされ、設定で接続情報が提供されているが、例外的なケースが存在する",
          en: "Most backing services are accessed over the network with connection info provided through configuration, but some exceptions exist",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのバッキングサービスが完全にアタッチドリソースとして扱われ、ネットワーク経由でアクセスされ、環境変数または設定管理システムを通じて接続情報が提供されている",
          en: "All backing services are treated completely as attached resources, accessed over the network with connection information provided through environment variables or configuration management systems",
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
    id: "aa_7",
    category: "application_architecture",
    text: {
      ja: "コードのビルド(実行可能形式の作成)、リリース(ビルドと設定の結合)、実行(プロセスの起動)の各ステージは、明確に分離され、独立して実行可能ですか？一度ビルドされた成果物は変更されずにリリース、実行ステージに進みますか？",
      en: "Are the build (creating executable form), release (combining build with configuration), and run (starting processes) stages clearly separated and independently executable? Once built, does the artifact proceed unchanged through release and run stages?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "none",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [
      { questionId: "aa_1", minValue: 66 }, // Only show if aa_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ビルド、リリース、実行の分離は、一貫性のあるデプロイと運用を可能にし、問題発生時の原因特定や修正を容易にします。",
        links: [
          {
            text: "Twelve-Factor: Build, Release, Run",
            url: "https://12factor.net/ja/build-release-run",
          },
          {
            text: "Immutable Infrastructure",
            url: "https://www.hashicorp.com/resources/what-is-mutable-vs-immutable-infrastructure",
          },
        ],
      },
      en: {
        summary:
          "Separating build, release, and run stages enables consistent deployment and operations, making it easier to identify and fix issues when they occur.",
        links: [
          {
            text: "Twelve-Factor: Build, Release, Run",
            url: "https://12factor.net/build-release-run",
          },
          {
            text: "Immutable Infrastructure",
            url: "https://www.hashicorp.com/resources/what-is-mutable-vs-immutable-infrastructure",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "ビルド、リリース、実行のステージは明確に分離されておらず、本番環境で直接コード変更やビルドが行われることがある",
          en: "Build, release, and run stages are not clearly separated, with direct code changes or builds in production environments",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なビルドとデプロイのプロセスは存在するが、環境ごとに異なる成果物が作成されたり、本番環境での設定変更が頻繁に行われる",
          en: "Basic build and deploy processes exist, but different artifacts are created for each environment or configuration changes frequently occur in production",
        },
      },
      {
        value: 66,
        label: {
          ja: "ビルド、リリース、実行のステージは概ね分離されているが、緊急時には例外的にプロセスがバイパスされることがある",
          en: "Build, release, and run stages are generally separated, but processes may be bypassed in emergency situations",
        },
      },
      {
        value: 100,
        label: {
          ja: "ビルド、リリース、実行のステージは完全に分離され、一度ビルドされた成果物は変更されることなくリリース、実行ステージに進む。各ステージは明確に追跡可能である",
          en: "Build, release, and run stages are completely separated, with artifacts proceeding unchanged through release and run stages. Each stage is clearly traceable",
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
    id: "aa_8",
    category: "application_architecture",
    text: {
      ja: "アプリケーションは、永続的な状態をプロセス自身に保持せず、必要に応じて外部のバッキングストア(データベース等)を利用する、ステートレスなプロセスとして実行されていますか？",
      en: "Are applications executed as stateless processes, where they do not retain persistent state in the process itself and instead use external backing stores (databases, etc.) when needed?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "aa_1", minValue: 66 }, // Only show if aa_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ステートレスなプロセスは、水平スケーリングや障害からの復旧を容易にし、クラウド環境での信頼性とスケーラビリティを向上させます。",
        links: [
          {
            text: "Twelve-Factor: Processes",
            url: "https://12factor.net/ja/processes",
          },
          {
            text: "Stateless Applications",
            url: "https://docs.microsoft.com/en-us/azure/architecture/patterns/stateless",
          },
        ],
      },
      en: {
        summary:
          "Stateless processes facilitate horizontal scaling and recovery from failures, improving reliability and scalability in cloud environments.",
        links: [
          {
            text: "Twelve-Factor: Processes",
            url: "https://12factor.net/processes",
          },
          {
            text: "Stateless Applications",
            url: "https://docs.microsoft.com/en-us/azure/architecture/patterns/stateless",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "アプリケーションは大部分がステートフルであり、プロセス内に永続的な状態を保持している",
          en: "Applications are mostly stateful, maintaining persistent state within the process",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションコンポーネントはステートレスだが、多くのコンポーネントはプロセス内に状態を保持している",
          en: "Some application components are stateless, but many components maintain state within the process",
        },
      },
      {
        value: 66,
        label: {
          ja: "大部分のアプリケーションはステートレスだが、一部のコンポーネントは特定の理由でプロセス内に状態を保持している",
          en: "Most applications are stateless, but some components maintain state within the process for specific reasons",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのアプリケーションが完全にステートレスであり、永続的な状態は全て外部のバッキングストアに保存されている",
          en: "All applications are completely stateless, with all persistent state stored in external backing stores",
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
    id: "aa_9",
    category: "application_architecture",
    text: {
      ja: "アプリケーションは自己完結型であり、外部のWebサーバー(Apache, Nginx等)に依存せず、指定されたポートを自身でバインドしてリクエストを待ち受け、サービスを提供していますか？",
      en: "Are applications self-contained, not dependent on external web servers (Apache, Nginx, etc.), binding to a specified port themselves to listen for requests and provide services?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "aa_1", minValue: 66 }, // Only show if aa_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "自己完結型のアプリケーションは、特定のWebサーバーへの依存を排除し、コンテナ環境やクラウドプラットフォームでの移植性とデプロイの柔軟性を高めます。",
        links: [
          {
            text: "Twelve-Factor: Port Binding",
            url: "https://12factor.net/ja/port-binding",
          },
          {
            text: "Self-Contained Services",
            url: "https://microservices.io/patterns/deployment/service-per-container.html",
          },
        ],
      },
      en: {
        summary:
          "Self-contained applications eliminate dependencies on specific web servers, enhancing portability and deployment flexibility in container environments and cloud platforms.",
        links: [
          {
            text: "Twelve-Factor: Port Binding",
            url: "https://12factor.net/port-binding",
          },
          {
            text: "Self-Contained Services",
            url: "https://microservices.io/patterns/deployment/service-per-container.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "アプリケーションは外部の特定のWebサーバーに完全に依存しており、独立して実行することができない",
          en: "Applications are completely dependent on specific external web servers and cannot execute independently",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションは自己完結型だが、多くは外部Webサーバーに依存している",
          en: "Some applications are self-contained, but many depend on external web servers",
        },
      },
      {
        value: 66,
        label: {
          ja: "大部分のアプリケーションは自己完結型だが、一部のレガシーアプリケーションは外部Webサーバーに依存している",
          en: "Most applications are self-contained, but some legacy applications depend on external web servers",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのアプリケーションが自己完結型であり、指定されたポートに自身でバインドし、コンテナやクラウド環境で実行可能なサービスとして動作する",
          en: "All applications are self-contained, binding to specified ports themselves and operating as deployable services in container or cloud environments",
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
    id: "aa_10",
    category: "application_architecture",
    text: {
      ja: "アプリケーションは、個々のプロセスの数を増減させること(水平スケーリング)によって、負荷の変動に対応できるよう設計されていますか？",
      en: "Are applications designed to handle varying loads by increasing or decreasing the number of individual processes (horizontal scaling)?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "aa_1", minValue: 66 }, // Only show if aa_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "プロセスモデルに基づいた水平スケーリングは、クラウド環境で負荷の変動に効率的に対応するための基本的なアプローチです。",
        links: [
          {
            text: "Twelve-Factor: Concurrency",
            url: "https://12factor.net/ja/concurrency",
          },
          {
            text: "Horizontal vs. Vertical Scaling",
            url: "https://aws.amazon.com/blogs/startups/scaling-on-aws-part-1-a-primer/",
          },
        ],
      },
      en: {
        summary:
          "Process-model-based horizontal scaling is the fundamental approach for efficiently handling load variations in cloud environments.",
        links: [
          {
            text: "Twelve-Factor: Concurrency",
            url: "https://12factor.net/concurrency",
          },
          {
            text: "Horizontal vs. Vertical Scaling",
            url: "https://aws.amazon.com/blogs/startups/scaling-on-aws-part-1-a-primer/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "アプリケーションは水平スケーリングに対応しておらず、垂直スケーリング（リソース増強）のみでしか負荷に対応できない",
          en: "Applications cannot be horizontally scaled and handle load only through vertical scaling (resource enhancement)",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションコンポーネントは水平スケーリングが可能だが、多くのコンポーネントはスケーリングに対応していない",
          en: "Some application components can be horizontally scaled, but many components cannot scale",
        },
      },
      {
        value: 66,
        label: {
          ja: "大部分のアプリケーションは水平スケーリングが可能だが、一部のコンポーネントやレガシーシステムは例外となっている",
          en: "Most applications can be horizontally scaled, with exceptions for some components or legacy systems",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのアプリケーションが完全に水平スケーリングに対応し、負荷に応じて自動的にスケールアウト/インする仕組みが実装されている",
          en: "All applications fully support horizontal scaling, with mechanisms implemented for automatic scale-out/in based on load",
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
    id: "aa_11",
    category: "application_architecture",
    text: {
      ja: "アプリケーションのプロセスは、迅速に起動でき、かつ終了シグナル(例: SIGTERM)を受け取った際には、進行中の作業を安全に完了させてから終了する(グレースフルシャットダウン)ように設計されていますか？",
      en: "Are application processes designed to start up quickly and shut down gracefully when they receive a termination signal (e.g., SIGTERM), safely completing ongoing work before terminating?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "optional",
    dependencies: [
      { questionId: "aa_1", minValue: 66 }, // Only show if aa_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "迅速な起動と安全な終了は、クラウド環境でのスケーリングやデプロイの効率性と信頼性を高め、データの整合性を維持します。",
        links: [
          {
            text: "Twelve-Factor: Disposability",
            url: "https://12factor.net/ja/disposability",
          },
          {
            text: "Graceful Shutdown in Kubernetes",
            url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination",
          },
        ],
      },
      en: {
        summary:
          "Quick startup and safe shutdown improve efficiency and reliability of scaling and deployment in cloud environments while maintaining data integrity.",
        links: [
          {
            text: "Twelve-Factor: Disposability",
            url: "https://12factor.net/disposability",
          },
          {
            text: "Graceful Shutdown in Kubernetes",
            url: "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "アプリケーションの起動に時間がかかり、シャットダウン時に進行中の作業が失われる可能性が高い",
          en: "Applications take a long time to start up, and ongoing work is likely to be lost during shutdown",
        },
      },
      {
        value: 33,
        label: {
          ja: "アプリケーションはある程度迅速に起動するが、グレースフルシャットダウンの実装は限定的である",
          en: "Applications start up relatively quickly, but graceful shutdown implementation is limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "大部分のアプリケーションは迅速に起動し、基本的なグレースフルシャットダウンを実装しているが、一部例外がある",
          en: "Most applications start up quickly and implement basic graceful shutdown, but some exceptions exist",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのアプリケーションが迅速に起動し、シグナルを受け取った際に進行中の作業を完了し、接続を適切に閉じてからクリーンに終了する",
          en: "All applications start up quickly and, when receiving signals, complete ongoing work, properly close connections, and cleanly terminate",
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
    id: "aa_12",
    category: "application_architecture",
    text: {
      ja: "開発環境、ステージング環境、本番環境で使用される技術スタック(言語、ライブラリ、バックエンドサービスの種類とバージョン)は、可能な限り一致しており、環境間のギャップを最小限に抑える努力がなされていますか？",
      en: "Do development, staging, and production environments use technology stacks (languages, libraries, backend service types and versions) that match as closely as possible, with efforts made to minimize gaps between environments?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "aa_1", minValue: 66 }, // Only show if aa_1 scored at least 66
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "開発環境と本番環境の類似性を保つことで、「開発環境では動作したのに本番では動かない」という問題を減らし、デプロイの信頼性を高めます。",
        links: [
          {
            text: "Twelve-Factor: Dev/Prod Parity",
            url: "https://12factor.net/ja/dev-prod-parity",
          },
          {
            text: "Environment Parity",
            url: "https://martinfowler.com/bliki/EnvironmentParity.html",
          },
        ],
      },
      en: {
        summary:
          "Maintaining similarity between development and production environments reduces 'works in development but not in production' issues and improves deployment reliability.",
        links: [
          {
            text: "Twelve-Factor: Dev/Prod Parity",
            url: "https://12factor.net/dev-prod-parity",
          },
          {
            text: "Environment Parity",
            url: "https://martinfowler.com/bliki/EnvironmentParity.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "開発環境と本番環境で使用される技術スタックには大きな違いがあり、「自分の環境では動くのに」という問題が頻繁に発生する",
          en: "Major differences exist between technology stacks used in development and production environments, with frequent 'works on my machine' issues",
        },
      },
      {
        value: 33,
        label: {
          ja: "主要な技術スタックは環境間で似ているが、バージョンの違いやバックエンドサービスの構成に重要な差異がある",
          en: "Main technology stacks are similar across environments, but significant differences exist in versions or backend service configurations",
        },
      },
      {
        value: 66,
        label: {
          ja: "大部分の技術スタックは環境間で一致しているが、パフォーマンスや規模の違いなど一部の差異が残っている",
          en: "Most technology stacks match across environments, but some differences remain in areas like performance or scale",
        },
      },
      {
        value: 100,
        label: {
          ja: "全ての環境で完全に同じ技術スタックとバージョンが使用され、環境間の違いは構成パラメータのみである",
          en: "All environments use exactly the same technology stacks and versions, with differences only in configuration parameters",
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
    id: "aa_13",
    category: "application_architecture",
    text: {
      ja: "アプリケーションは、ログの出力先や管理方法を自身で制御せず、全てのログを標準出力(stdout)または標準エラー出力(stderr)へのイベントストリームとして出力していますか？",
      en: "Do applications avoid controlling log output destinations or management themselves, instead outputting all logs as event streams to standard output (stdout) or standard error (stderr)?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "aa_1", minValue: 66 }, // Only show if aa_1 scored at least 66
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ログをイベントストリームとして扱うことで、アプリケーションはログの保存や転送を気にする必要がなく、クラウド環境での一貫したログ管理が可能になります。",
        links: [
          { text: "Twelve-Factor: Logs", url: "https://12factor.net/ja/logs" },
          {
            text: "Logging Best Practices",
            url: "https://www.datadoghq.com/blog/docker-logging/",
          },
        ],
      },
      en: {
        summary:
          "Treating logs as event streams allows applications to ignore log storage and routing concerns, enabling consistent log management in cloud environments.",
        links: [
          { text: "Twelve-Factor: Logs", url: "https://12factor.net/logs" },
          {
            text: "Logging Best Practices",
            url: "https://www.datadoghq.com/blog/docker-logging/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "アプリケーションは特定のログファイルパスに直接書き込み、ログローテーションなども自身で管理している",
          en: "Applications write directly to specific log file paths and manage log rotation themselves",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションはログを標準出力に書き出しているが、多くは特定のファイルパスに直接書き込んでいる",
          en: "Some applications output logs to standard output, but many write directly to specific file paths",
        },
      },
      {
        value: 66,
        label: {
          ja: "大部分のアプリケーションはログを標準出力/標準エラー出力に書き出しているが、一部例外的なケースがある",
          en: "Most applications output logs to standard output/standard error, but some exceptional cases exist",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのアプリケーションはログを標準出力/標準エラー出力のみに書き出し、ログの収集・転送・保存・分析は外部のログ集約システムによって行われている",
          en: "All applications output logs only to standard output/standard error, with collection, routing, storage, and analysis handled by external log aggregation systems",
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
    id: "aa_14",
    category: "application_architecture",
    text: {
      ja: "データベースマイグレーションや一度きりのスクリプト実行などの管理タスクは、アプリケーション本体と同じコードベースと設定を使用し、本番環境で独立したプロセスとして実行されていますか？",
      en: "Are admin tasks like database migrations or one-time script executions run as separate processes in the production environment, using the same codebase and configuration as the main application?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "none",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "aa_1", minValue: 66 }, // Only show if aa_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "管理タスクをアプリケーションのコードベースの一部として扱うことで、コード管理の一貫性を保ち、環境間の差異による問題を防ぎます。",
        links: [
          {
            text: "Twelve-Factor: Admin Processes",
            url: "https://12factor.net/ja/admin-processes",
          },
          {
            text: "Database Migrations",
            url: "https://martinfowler.com/articles/evodb.html",
          },
        ],
      },
      en: {
        summary:
          "Treating admin tasks as part of the application codebase maintains code management consistency and prevents issues due to differences between environments.",
        links: [
          {
            text: "Twelve-Factor: Admin Processes",
            url: "https://12factor.net/admin-processes",
          },
          {
            text: "Database Migrations",
            url: "https://martinfowler.com/articles/evodb.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "管理タスクは手動で実行され、アプリケーションコードとは別に管理されている",
          en: "Admin tasks are executed manually and managed separately from application code",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の管理タスクはアプリケーションコードベースで管理されているが、多くは別々に管理されている",
          en: "Some admin tasks are managed in the application codebase, but many are managed separately",
        },
      },
      {
        value: 66,
        label: {
          ja: "大部分の管理タスクはアプリケーションと同じコードベースで管理され、同じ環境で実行されるが、一部例外がある",
          en: "Most admin tasks are managed in the same codebase as the application and executed in the same environment, but some exceptions exist",
        },
      },
      {
        value: 100,
        label: {
          ja: "全ての管理タスクはアプリケーションと同じコードベースと設定を使用し、一時的なプロセスとして本番環境で実行され、バージョン管理されている",
          en: "All admin tasks use the same codebase and configuration as the application, run as temporary processes in the production environment, and are version controlled",
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
    id: "aa_15",
    category: "application_architecture",
    text: {
      ja: "イベント駆動型アーキテクチャのパターンをどの程度実装していますか？",
      en: "To what extent have you implemented event-driven architecture patterns?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "aa_2", minValue: 66 }, // Only show if aa_2 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "イベント駆動型アーキテクチャは、サービス間の疎結合を実現し、スケーラビリティと柔軟性を高める重要なパターンです。",
        links: [
          {
            text: "Event-Driven Architecture",
            url: "https://martinfowler.com/articles/201701-event-driven.html",
          },
          { text: "Cloud Events", url: "https://cloudevents.io/" },
        ],
      },
      en: {
        summary:
          "Event-driven architecture is a key pattern that enables loose coupling between services, enhancing scalability and flexibility.",
        links: [
          {
            text: "Event-Driven Architecture",
            url: "https://martinfowler.com/articles/201701-event-driven.html",
          },
          { text: "Cloud Events", url: "https://cloudevents.io/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "イベント駆動型アーキテクチャは採用されておらず、同期通信が主流である",
          en: "Event-driven architecture is not adopted, with synchronous communication predominant",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のワークロードでイベント駆動型パターンが実装されているが、大部分は同期通信に依存している",
          en: "Event-driven patterns are implemented for some workloads, but most rely on synchronous communication",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なワークロードでイベント駆動型アーキテクチャが採用され、メッセージブローカーやイベントストリーミングプラットフォームが利用されている",
          en: "Event-driven architecture is adopted for key workloads, with message brokers and event streaming platforms being utilized",
        },
      },
      {
        value: 100,
        label: {
          ja: "イベント駆動型アーキテクチャが標準として採用され、非同期通信、コレオグラフィ、CENCIパターンなどの高度なパターンが実装されている",
          en: "Event-driven architecture is adopted as a standard, with advanced patterns like asynchronous communication, choreography, and CENCI patterns implemented",
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
    id: "aa_16",
    category: "application_architecture",
    text: {
      ja: "マイクロサービス間のサービス間通信をどのように管理していますか？",
      en: "How do you manage service-to-service communication between microservices?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "none",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "aa_2", minValue: 66 }, // Only show if aa_2 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "サービス間通信の効果的な管理は、マイクロサービスアーキテクチャの成功に不可欠であり、サービスの発見、負荷分散、回復力、監視などの側面を含みます。",
        links: [
          {
            text: "Service-to-Service Communication",
            url: "https://microservices.io/patterns/communication-style/messaging.html",
          },
          {
            text: "API Gateway Pattern",
            url: "https://microservices.io/patterns/apigateway.html",
          },
        ],
      },
      en: {
        summary:
          "Effective management of service-to-service communication is essential for successful microservices architecture, including aspects like service discovery, load balancing, resilience, and monitoring.",
        links: [
          {
            text: "Service-to-Service Communication",
            url: "https://microservices.io/patterns/communication-style/messaging.html",
          },
          {
            text: "API Gateway Pattern",
            url: "https://microservices.io/patterns/apigateway.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "サービス間通信の標準化された方法がなく、各サービスが独自の方法で通信している",
          en: "No standardized method for service-to-service communication, with each service communicating in its own way",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なREST APIやメッセージキューを使用しているが、標準化や管理が不十分である",
          en: "Basic REST APIs and message queues are used, but standardization and management are insufficient",
        },
      },
      {
        value: 66,
        label: {
          ja: "APIゲートウェイ、サービスディスカバリー、コントラクトテストなどの仕組みが導入され、サービス間通信が体系的に管理されている",
          en: "API gateways, service discovery, and contract testing mechanisms are in place, systematically managing service-to-service communication",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的なサービスメッシュ、高度なプロトコル（gRPC、GraphQLなど）、非同期通信パターンが標準化され、完全な可観測性と制御が実現されている",
          en: "Comprehensive service mesh, advanced protocols (gRPC, GraphQL, etc.), and asynchronous communication patterns are standardized, with complete observability and control",
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
    id: "aa_18",
    category: "application_architecture",
    text: {
      ja: "APIファーストのアプローチがどの程度採用されていますか？",
      en: "To what extent is an API-first approach adopted?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [
      { questionId: "aa_2", minValue: 33 }, // Only show if aa_2 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "APIファーストのアプローチでは、APIを設計から実装までの中心に据え、一貫性のあるインターフェースを構築します。これにより、フロントエンドとバックエンドの分離、サードパーティ統合、サービスの再利用が容易になります。",
        links: [
          {
            text: "API First Approach",
            url: "https://swagger.io/resources/articles/adopting-an-api-first-approach/",
          },
          { text: "OpenAPI Specification", url: "https://www.openapis.org/" },
        ],
      },
      en: {
        summary:
          "The API-first approach places APIs at the center from design to implementation, building consistent interfaces. This facilitates frontend-backend separation, third-party integration, and service reusability.",
        links: [
          {
            text: "API First Approach",
            url: "https://swagger.io/resources/articles/adopting-an-api-first-approach/",
          },
          { text: "OpenAPI Specification", url: "https://www.openapis.org/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "APIファーストのアプローチは採用されておらず、APIは必要に応じて後付けで実装されている",
          en: "API-first approach is not adopted, with APIs implemented after the fact as needed",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のプロジェクトでAPIファーストの考え方を採用しているが、標準化されていない",
          en: "Some projects adopt API-first thinking, but it's not standardized",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なプロジェクトでAPIファーストアプローチが採用され、OpenAPI/Swaggerなどの標準仕様が使用されている",
          en: "Major projects adopt an API-first approach, using standard specifications like OpenAPI/Swagger",
        },
      },
      {
        value: 100,
        label: {
          ja: "組織全体でAPIファーストが標準となり、API設計レビュー、モック作成、自動ドキュメント生成、API管理プラットフォームなどが整備されている",
          en: "API-first is standard organization-wide, with API design reviews, mock creation, automatic documentation generation, and API management platforms in place",
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
    id: "aa_19",
    category: "application_architecture",
    text: {
      ja: "クラウドネイティブアプリケーションの復元力（レジリエンス）はどのように設計されていますか？",
      en: "How is resilience designed into your cloud native applications?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [
      { questionId: "aa_2", minValue: 66 }, // Only show if aa_2 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウド環境では障害は不可避であるという前提に立ち、アプリケーションが部分的な障害に対して耐性を持ち、迅速に回復できるよう設計することが重要です。",
        links: [
          {
            text: "Resilience in Cloud Native Architecture",
            url: "https://docs.microsoft.com/en-us/azure/architecture/framework/resiliency/overview",
          },
          { text: "Chaos Engineering", url: "https://principlesofchaos.org/" },
        ],
      },
      en: {
        summary:
          "In cloud environments, failures are inevitable, so it's important to design applications that are resilient to partial failures and can recover quickly.",
        links: [
          {
            text: "Resilience in Cloud Native Architecture",
            url: "https://docs.microsoft.com/en-us/azure/architecture/framework/resiliency/overview",
          },
          { text: "Chaos Engineering", url: "https://principlesofchaos.org/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "復元力は考慮されておらず、障害発生時は完全な停止やマニュアル対応が必要",
          en: "Resilience is not considered, requiring complete stoppage or manual intervention during failures",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な高可用性対策（冗長化など）は実装されているが、部分的な障害への対応や自動回復機能は限定的",
          en: "Basic high availability measures (like redundancy) are implemented, but responses to partial failures or automatic recovery capabilities are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "サーキットブレーカー、リトライ、タイムアウト、フォールバックなどの復元力パターンが主要なシステムに実装されている",
          en: "Resilience patterns like circuit breakers, retries, timeouts, and fallbacks are implemented in key systems",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的な復元力戦略が採用され、カオスエンジニアリング、自己修復メカニズム、分散システムの障害モード分析が実施されている",
          en: "Comprehensive resilience strategy is adopted with chaos engineering, self-healing mechanisms, and distributed system failure mode analysis",
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
    id: "aa_20",
    category: "application_architecture",
    text: {
      ja: "データの永続化と状態管理戦略はどのように定義されていますか？",
      en: "How is your data persistence and state management strategy defined?",
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
      { questionId: "aa_8", minValue: 33 }, // Only show if aa_8 scored at least 33
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドネイティブ環境での状態管理は、一時的な状態と永続的な状態を適切に区別し、スケーラビリティとデータの一貫性のバランスを取る必要があります。",
        links: [
          {
            text: "Data Management for Cloud-Native Applications",
            url: "https://www.confluent.io/blog/data-management-for-cloud-native-applications/",
          },
          {
            text: "Stateful Applications in Kubernetes",
            url: "https://kubernetes.io/docs/tasks/run-application/run-stateful-application/",
          },
        ],
      },
      en: {
        summary:
          "State management in cloud native environments requires proper distinction between ephemeral and persistent states, balancing scalability and data consistency.",
        links: [
          {
            text: "Data Management for Cloud-Native Applications",
            url: "https://www.confluent.io/blog/data-management-for-cloud-native-applications/",
          },
          {
            text: "Stateful Applications in Kubernetes",
            url: "https://kubernetes.io/docs/tasks/run-application/run-stateful-application/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "状態管理の明確な戦略はなく、アプリケーションごとに異なるアプローチが取られている",
          en: "No clear state management strategy, with different approaches taken for each application",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な状態管理パターンが採用されているが、分散環境での一貫性や耐障害性への対応は限定的",
          en: "Basic state management patterns are adopted, but consistency and fault tolerance in distributed environments are addressed in a limited way",
        },
      },
      {
        value: 66,
        label: {
          ja: "データの種類や要件に応じた適切なストレージ選択と状態管理パターンが確立され、主要なシステムに実装されている",
          en: "Appropriate storage selection and state management patterns based on data types and requirements are established and implemented in key systems",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な状態管理戦略が確立され、CQRSパターン、イベントソーシング、最終的一貫性モデルなどが適材適所で採用されている",
          en: "Advanced state management strategy is established, with CQRS patterns, event sourcing, and eventual consistency models adopted where appropriate",
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
    id: "aa_21",
    category: "application_architecture",
    text: {
      ja: "セキュリティをアーキテクチャに組み込む「シフトレフト」アプローチはどの程度採用されていますか？",
      en: "To what extent is a 'shift left' approach adopted for embedding security in architecture?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [
      { questionId: "aa_17", minValue: 33 }, // Only show if aa_17 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "シフトレフトセキュリティは、開発の早い段階からセキュリティを考慮し、設計段階から脆弱性を排除するアプローチです。これにより、後工程での発見よりもコスト効率よく対応できます。",
        links: [
          {
            text: "Shift Left Security",
            url: "https://snyk.io/learn/shift-left-security/",
          },
          {
            text: "DevSecOps",
            url: "https://www.redhat.com/en/topics/devops/what-is-devsecops",
          },
        ],
      },
      en: {
        summary:
          "Shift left security is an approach that considers security from early stages of development, eliminating vulnerabilities at the design stage. This is more cost-effective than discovery in later stages.",
        links: [
          {
            text: "Shift Left Security",
            url: "https://snyk.io/learn/shift-left-security/",
          },
          {
            text: "DevSecOps",
            url: "https://www.redhat.com/en/topics/devops/what-is-devsecops",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "セキュリティは主に開発後のテストや運用段階で考慮されている",
          en: "Security is primarily considered in post-development testing and operational phases",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なセキュリティレビューや脆弱性スキャンが開発プロセスに組み込まれているが、アーキテクチャレベルでの統合は限定的",
          en: "Basic security reviews and vulnerability scanning are incorporated into the development process, but integration at the architecture level is limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "セキュリティ要件が設計段階から考慮され、主要なプロジェクトでは脅威モデリングやセキュアコーディング標準が採用されている",
          en: "Security requirements are considered from the design stage, with threat modeling and secure coding standards adopted in key projects",
        },
      },
      {
        value: 100,
        label: {
          ja: "セキュリティがアーキテクチャの中核要素として位置づけられ、設計段階からのセキュリティレビュー、自動化されたセキュリティテスト、継続的な脆弱性管理が標準化されている",
          en: "Security is positioned as a core element of architecture, with security reviews from the design stage, automated security testing, and continuous vulnerability management standardized",
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
