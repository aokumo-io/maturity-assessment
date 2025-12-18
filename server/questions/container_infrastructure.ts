/**
 * コンテナインフラストラクチャ質問モジュール
 *
 * コンテナ技術とインフラストラクチャに関する質問を定義するモジュールです。
 * コンテナ化、Kubernetes環境、クラスター管理などの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const containerInfrastructureQuestions: AssessmentQuestion[] = [
  // Base Questions (Always shown first)
  {
    id: "ci_1",
    category: "container_infrastructure",
    text: {
      ja: "組織内のコンテナ採用状況はどうですか？",
      en: "What is the status of container adoption within your organization?",
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
          "コンテナ技術の採用は、クラウドネイティブへの移行の基本的なステップです。コンテナ化されたアプリケーションは、環境間の一貫性、効率的なリソース使用、迅速なデプロイなどの利点を提供します。",
        links: [
          {
            text: "コンテナ採用",
            url: "https://www.cncf.io/blog/2020/11/17/cloud-native-survey-2020-containers-in-production-jump-300-from-our-first-survey/",
          },
          {
            text: "コンテナ化のメリット",
            url: "https://www.docker.com/why-docker/",
          },
        ],
      },
      en: {
        summary:
          "Container technology adoption is a fundamental step in the transition to cloud native. Containerized applications provide benefits such as consistency between environments, efficient resource use, and rapid deployment.",
        links: [
          {
            text: "Container Adoption",
            url: "https://www.cncf.io/blog/2020/11/17/cloud-native-survey-2020-containers-in-production-jump-300-from-our-first-survey/",
          },
          {
            text: "Containerization Benefits",
            url: "https://www.docker.com/why-docker/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コンテナ技術はほとんど採用されておらず、従来の仮想マシンや物理サーバーへの直接デプロイが主流",
          en: "Container technology has barely been adopted, with traditional deployment directly to virtual machines or physical servers predominant",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションがコンテナ化されているが、多くは従来の方法でデプロイされている",
          en: "Some applications are containerized, but many are deployed using traditional methods",
        },
      },
      {
        value: 66,
        label: {
          ja: "大部分のアプリケーションがコンテナ化され、標準的なプラクティスに従っているが、一部のアプリケーションや特定の環境ではコンテナ化されていない",
          en: "Most applications are containerized and follow standard practices, but some applications or specific environments are not containerized",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのアプリケーションが適切にコンテナ化され、最小限のベースイメージ、マルチステージビルド、セキュリティスキャンなどのベストプラクティスに従っている",
          en: "All applications are properly containerized, following best practices such as minimal base images, multi-stage builds, and security scanning",
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
    id: "ci_2",
    category: "container_infrastructure",
    text: {
      ja: "コンテナイメージをどのように管理していますか？",
      en: "How do you manage container images?",
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
          "コンテナイメージの効果的な管理は、コンテナ環境の安全性、効率性、一貫性を確保するために不可欠です。これには、イメージレジストリの使用、バージョン管理、脆弱性スキャンなどが含まれます。",
        links: [
          {
            text: "コンテナレジストリ",
            url: "https://docs.docker.com/registry/",
          },
          {
            text: "イメージ管理のベストプラクティス",
            url: "https://sysdig.com/blog/container-security-best-practices/",
          },
        ],
      },
      en: {
        summary:
          "Effective container image management is essential for ensuring security, efficiency, and consistency in container environments. This includes the use of image registries, version control, and vulnerability scanning.",
        links: [
          {
            text: "Container Registry",
            url: "https://docs.docker.com/registry/",
          },
          {
            text: "Image Management Best Practices",
            url: "https://sysdig.com/blog/container-security-best-practices/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コンテナイメージの体系的な管理はなく、手動ビルドやローカルでの管理が主流",
          en: "No systematic management of container images, with manual builds and local management predominant",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なコンテナレジストリは使用されているが、バージョン管理やライフサイクル管理が不十分",
          en: "Basic container registries are used, but version control and lifecycle management are inadequate",
        },
      },
      {
        value: 66,
        label: {
          ja: "プライベートコンテナレジストリが整備され、タグ付け規則、脆弱性スキャン、アクセス制御が実装されている",
          en: "Private container registries are established, with tagging rules, vulnerability scanning, and access control implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なコンテナレジストリ管理が実装され、署名検証、自動化されたセキュリティスキャン、ポリシー強制などが標準化されている",
          en: "Advanced container registry management is implemented, with signature verification, automated security scanning, and policy enforcement standardized",
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
    id: "ci_3",
    category: "container_infrastructure",
    text: {
      ja: "Kubernetesの採用レベルはどの程度ですか？",
      en: "What is your level of Kubernetes adoption?",
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
          "Kubernetesは、コンテナのオーケストレーション、スケーリング、管理のための業界標準プラットフォームです。Kubernetesの採用は、大規模なコンテナ化アプリケーションの運用に不可欠です。",
        links: [
          {
            text: "Kubernetesの基礎",
            url: "https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/",
          },
          {
            text: "Kubernetes採用",
            url: "https://www.cncf.io/reports/cncf-annual-survey-2023///",
          },
        ],
      },
      en: {
        summary:
          "Kubernetes is the industry-standard platform for orchestrating, scaling, and managing containers. Kubernetes adoption is essential for operating large-scale containerized applications.",
        links: [
          {
            text: "Kubernetes Basics",
            url: "https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/",
          },
          {
            text: "Kubernetes Adoption",
            url: "https://www.cncf.io/reports/cncf-annual-survey-2023///",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "Kubernetesは採用されておらず、コンテナの管理は基本的なツールや手動プロセスで行われている",
          en: "Kubernetes is not adopted, with container management done using basic tools or manual processes",
        },
      },
      {
        value: 33,
        label: {
          ja: "Kubernetesが一部の環境や非本番ワークロードで使用されているが、本番環境への完全な導入には至っていない",
          en: "Kubernetes is used in some environments or non-production workloads, but has not been fully introduced to production environments",
        },
      },
      {
        value: 66,
        label: {
          ja: "Kubernetesは主要な本番ワークロードで使用されており、基本的なオーケストレーション機能が活用されている",
          en: "Kubernetes is used for major production workloads, with basic orchestration features being utilized",
        },
      },
      {
        value: 100,
        label: {
          ja: "Kubernetesが組織全体の標準プラットフォームとなり、高度な機能や拡張機能が広く活用され、マルチクラスタ戦略が実装されている",
          en: "Kubernetes has become the standard platform across the organization, with advanced features and extensions widely utilized and multi-cluster strategy implemented",
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
    id: "ci_15",
    category: "container_infrastructure",
    text: {
      ja: "アプリケーションとその実行に必要な全ての依存関係(ライブラリ、ランタイムなど)は、コンテナ技術(例: Docker)を用いて一つのイメージにまとめられ、隔離された環境で実行可能になっていますか？",
      en: "Are applications and all dependencies required for their execution (libraries, runtimes, etc.) bundled into a single image using container technology (e.g., Docker) and executable in an isolated environment?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "コンテナ化されたアプリケーションは、必要な全ての依存関係を含む自己完結型の単位です。これにより「私の環境では動作する」問題が軽減され、一貫したデプロイが可能になります。",
        links: [
          {
            text: "アプリケーションコンテナ化",
            url: "https://www.docker.com/resources/what-container/",
          },
          {
            text: "コンテナ化のベストプラクティス",
            url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/",
          },
        ],
      },
      en: {
        summary:
          "Containerized applications are self-contained units that include all necessary dependencies. This reduces 'works on my machine' problems and enables consistent deployments.",
        links: [
          {
            text: "Application Containerization",
            url: "https://www.docker.com/resources/what-container/",
          },
          {
            text: "Containerization Best Practices",
            url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "アプリケーションはコンテナ化されておらず、従来の方法（仮想マシンや物理サーバーへの直接デプロイ）で実行されている",
          en: "Applications are not containerized and are run using traditional methods (direct deployment to virtual machines or physical servers)",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションがコンテナ化されているが、多くは従来の方法で実行されており、コンテナイメージの品質にもばらつきがある",
          en: "Some applications are containerized, but many are run using traditional methods, and there is variation in container image quality",
        },
      },
      {
        value: 66,
        label: {
          ja: "大部分のアプリケーションがコンテナ化され、標準的なプラクティスに従っているが、一部のアプリケーションや特定の環境ではコンテナ化されていない",
          en: "Most applications are containerized and follow standard practices, but some applications or specific environments are not containerized",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのアプリケーションが適切にコンテナ化され、最小限のベースイメージ、マルチステージビルド、セキュリティスキャンなどのベストプラクティスに従っている",
          en: "All applications are properly containerized, following best practices such as minimal base images, multi-stage builds, and security scanning",
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
    id: "ci_4",
    category: "container_infrastructure",
    text: {
      ja: "コンテナイメージをどのように最適化していますか？",
      en: "How do you optimize container images?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "none",
      manager: "low",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [
      { questionId: "ci_1", minValue: 33 }, // Only show if ci_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "最適化されたコンテナイメージは、ストレージ効率、転送速度、起動時間、セキュリティの向上につながります。マルチステージビルド、最小限のベースイメージ、レイヤー最適化などが重要な技術です。",
        links: [
          {
            text: "イメージ最適化",
            url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/",
          },
          {
            text: "マルチステージビルド",
            url: "https://docs.docker.com/build/building/multi-stage/",
          },
        ],
      },
      en: {
        summary:
          "Optimized container images lead to improved storage efficiency, transfer speed, startup time, and security. Multi-stage builds, minimal base images, and layer optimization are important techniques.",
        links: [
          {
            text: "Image Optimization",
            url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/",
          },
          {
            text: "Multi-stage Builds",
            url: "https://docs.docker.com/build/building/multi-stage/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コンテナイメージの最適化は行われておらず、サイズやレイヤー構成に問題がある",
          en: "Container image optimization is not performed, with issues in size and layer structure",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なイメージサイズ最適化（不要なパッケージの削除など）は行われているが、体系的ではない",
          en: "Basic image size optimization (such as removing unnecessary packages) is performed, but not systematically",
        },
      },
      {
        value: 66,
        label: {
          ja: "マルチステージビルド、軽量ベースイメージ、最適化されたレイヤー構成などの技術が広く採用されている",
          en: "Techniques such as multi-stage builds, lightweight base images, and optimized layer structures are widely adopted",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に最適化されたコンテナイメージが標準であり、自動化されたサイズ最適化、依存関係の最小化、セキュリティ強化などが徹底されている",
          en: "Highly optimized container images are standard, with automated size optimization, dependency minimization, and security enhancements thoroughly implemented",
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
    id: "ci_5",
    category: "container_infrastructure",
    text: {
      ja: "コンテナランタイムのセキュリティをどのように管理していますか？",
      en: "How do you manage container runtime security?",
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
      { questionId: "ci_1", minValue: 33 }, // Only show if ci_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "コンテナランタイムのセキュリティは、コンテナ化されたアプリケーションの全体的なセキュリティにとって不可欠です。これには、権限の最小化、セキュアなベースイメージ、脆弱性スキャン、ランタイム保護などが含まれます。",
        links: [
          {
            text: "コンテナセキュリティ",
            url: "https://sysdig.com/blog/container-security-best-practices/",
          },
          {
            text: "ランタイムセキュリティ",
            url: "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
          },
        ],
      },
      en: {
        summary:
          "Container runtime security is essential for the overall security of containerized applications. This includes minimizing permissions, secure base images, vulnerability scanning, and runtime protection.",
        links: [
          {
            text: "Container Security",
            url: "https://sysdig.com/blog/container-security-best-practices/",
          },
          {
            text: "Runtime Security",
            url: "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コンテナセキュリティに特化した対策はほとんど実施されていない",
          en: "Few container-specific security measures are implemented",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なセキュリティプラクティス（権限制限、イメージスキャンなど）は一部実施されているが、包括的ではない",
          en: "Basic security practices (such as permission restrictions and image scanning) are partially implemented, but not comprehensively",
        },
      },
      {
        value: 66,
        label: {
          ja: "コンテナセキュリティの標準的なプラクティス（最小権限原則、脆弱性スキャン、セキュアなベースイメージなど）が広く採用されている",
          en: "Standard container security practices (principle of least privilege, vulnerability scanning, secure base images, etc.) are widely adopted",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的なコンテナセキュリティフレームワークが実装され、ランタイムセキュリティ監視、イメージ署名検証、自動化されたセキュリティポリシー適用などが標準化されている",
          en: "Comprehensive container security framework is implemented, with runtime security monitoring, image signature verification, and automated security policy enforcement standardized",
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
    id: "ci_17",
    category: "container_infrastructure",
    text: {
      ja: "コンテナ化されたアプリケーションのデプロイ、スケーリング、管理のためにKubernetesのようなオーケストレーションツールを導入し、かつHelmチャートなどのオーケストレーションパッケージ管理ツールを用いてアプリケーションの定義、インストール、アップグレードを管理していますか？",
      en: "Have you implemented orchestration tools like Kubernetes for deploying, scaling, and managing containerized applications, and do you manage application definition, installation, and upgrades using orchestration package management tools like Helm charts?",
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
      { questionId: "ci_3", minValue: 33 }, // Only show if ci_3 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "Kubernetesなどのオーケストレーションツールと、Helmなどのパッケージ管理ツールを組み合わせることで、コンテナ化アプリケーションの一貫したデプロイと管理が可能になります。",
        links: [
          {
            text: "Kubernetesオーケストレーション",
            url: "https://kubernetes.io/docs/concepts/overview/components/",
          },
          {
            text: "Helmパッケージマネージャー",
            url: "https://helm.sh/docs/intro/using_helm/",
          },
        ],
      },
      en: {
        summary:
          "Combining orchestration tools like Kubernetes with package management tools like Helm enables consistent deployment and management of containerized applications.",
        links: [
          {
            text: "Kubernetes Orchestration",
            url: "https://kubernetes.io/docs/concepts/overview/components/",
          },
          {
            text: "Helm Package Manager",
            url: "https://helm.sh/docs/intro/using_helm/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コンテナオーケストレーションツールは使用しておらず、コンテナは個別に管理されている",
          en: "Container orchestration tools are not used, with containers managed individually",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なコンテナオーケストレーションは導入されているが、アプリケーション定義は手動または基本的なマニフェストファイルのみで管理されている",
          en: "Basic container orchestration is implemented, but application definition is managed manually or only with basic manifest files",
        },
      },
      {
        value: 66,
        label: {
          ja: "Kubernetesなどのオーケストレーションツールが本格的に導入され、Helmチャートなどのパッケージ管理ツールも一部のアプリケーションで使用されている",
          en: "Orchestration tools like Kubernetes are fully implemented, and package management tools like Helm charts are used for some applications",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なコンテナオーケストレーションが実装され、全てのアプリケーションがHelmチャートなどで定義され、GitOpsワークフローで管理されている",
          en: "Advanced container orchestration is implemented, with all applications defined by Helm charts or similar and managed through GitOps workflows",
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
    id: "ci_6",
    category: "container_infrastructure",
    text: {
      ja: "Kubernetesクラスタの管理をどのように行っていますか？",
      en: "How do you manage Kubernetes clusters?",
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
      { questionId: "ci_3", minValue: 33 }, // Only show if ci_3 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なKubernetesクラスタ管理には、プロビジョニング、アップグレード、監視、バックアップなどの側面があります。自動化と標準化が重要です。",
        links: [
          {
            text: "マルチクラスタ管理",
            url: "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/",
          },
          {
            text: "クラスタフェデレーション",
            url: "https://github.com/kubernetes-sigs/kubefed",
          },
        ],
      },
      en: {
        summary:
          "Effective Kubernetes cluster management includes aspects such as provisioning, upgrades, monitoring, and backups. Automation and standardization are important.",
        links: [
          {
            text: "Multi-cluster Management",
            url: "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/",
          },
          {
            text: "Cluster Federation",
            url: "https://github.com/kubernetes-sigs/kubefed",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラスタ管理は主に手動で行われ、標準化や自動化が不足している",
          en: "Cluster management is primarily manual, lacking standardization and automation",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なクラスタ管理ツールを使用しているが、多くのタスクは手動で実行されている",
          en: "Basic cluster management tools are used, but many tasks are performed manually",
        },
      },
      {
        value: 66,
        label: {
          ja: "クラスタのプロビジョニング、アップグレード、監視などが大部分自動化され、標準化されている",
          en: "Cluster provisioning, upgrades, monitoring, etc. are largely automated and standardized",
        },
      },
      {
        value: 100,
        label: {
          ja: "完全に自動化されたクラスタライフサイクル管理が実装され、セルフサービスプロビジョニング、自動スケーリング、ポリシーベースの管理などが実現されている",
          en: "Fully automated cluster lifecycle management is implemented, with self-service provisioning, automatic scaling, policy-based management, etc.",
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
    id: "ci_23",
    category: "container_infrastructure",
    text: {
      ja: "作成したコンテナイメージを安全に保管、管理するために、イメージの署名や脆弱性スキャンなどのセキュリティ機能を持つコンテナレジストリ(例: Harbor、各種クラウド提供のレジストリ)を利用しており、かつコンテナの実行にはOCI(Open Container Initiative)仕様に準拠したコンテナランタイム(例: containerd, CRI-O)が使用されていますか？",
      en: "Are you using container registries with security features such as image signing and vulnerability scanning (e.g., Harbor, various cloud-provided registries) to safely store and manage created container images, and are you using OCI (Open Container Initiative) compliant container runtimes (e.g., containerd, CRI-O) for running containers?",
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
      { questionId: "ci_2", minValue: 66 }, // Only show if ci_2 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "セキュアなコンテナレジストリと標準準拠のランタイムは、コンテナ基盤のセキュリティと互換性を確保するために不可欠です。イメージの署名、脆弱性スキャン、標準化されたランタイムがベストプラクティスです。",
        links: [
          {
            text: "セキュアなレジストリ",
            url: "https://goharbor.io/docs/2.0.0/working-with-projects/project-configuration/implementing-content-trust/",
          },
          {
            text: "OCIランタイム",
            url: "https://opencontainers.org/about/overview/",
          },
        ],
      },
      en: {
        summary:
          "Secure container registries and standards-compliant runtimes are essential for ensuring security and compatibility of container infrastructure. Image signing, vulnerability scanning, and standardized runtimes are best practices.",
        links: [
          {
            text: "Secure Registries",
            url: "https://goharbor.io/docs/2.0.0/working-with-projects/project-configuration/implementing-content-trust/",
          },
          {
            text: "OCI Runtime",
            url: "https://opencontainers.org/about/overview/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コンテナレジストリは基本的な保存機能のみで使用され、セキュリティ機能は導入されていない",
          en: "Container registries are used only for basic storage functions, with no security features implemented",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なコンテナレジストリとイメージスキャンが導入されているが、包括的なセキュリティ機能や署名検証は実装されていない",
          en: "Basic container registries and image scanning are implemented, but comprehensive security features and signature verification are not implemented",
        },
      },
      {
        value: 66,
        label: {
          ja: "セキュアなコンテナレジストリと標準的なコンテナランタイムが導入され、脆弱性スキャンなども実装されているが、一部の高度なセキュリティ機能は未導入である",
          en: "Secure container registries and standard container runtimes are implemented, with vulnerability scanning also implemented, but some advanced security features are not yet introduced",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度にセキュアなコンテナレジストリを使用し、イメージの署名検証、脆弱性スキャン、ポリシー強制などが完全に自動化され、標準化されたOCI準拠のランタイムが使用されている",
          en: "Highly secure container registries are used, with image signature verification, vulnerability scanning, and policy enforcement fully automated, and standardized OCI-compliant runtimes are used",
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
    id: "ci_24",
    category: "container_infrastructure",
    text: {
      ja: "コンテナイメージやその他のソフトウェア成果物を配布する際に、配布されるソフトウェアが改ざんされておらず、正当な作成元からのものであること(真正性と完全性)を保証するために、NotaryやTUF (The Update Framework) のようなフレームワークに基づいた、デジタル署名を用いたセキュアな配布・検証プロセスを導入・運用していますか？",
      en: "Have you implemented and operated a secure distribution and verification process using digital signatures, based on frameworks like Notary or TUF (The Update Framework), to ensure that container images and other software artifacts being distributed have not been tampered with and are from legitimate sources (authenticity and integrity)?",
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
      { questionId: "ci_2", minValue: 66 }, // Only show if ci_2 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ソフトウェア成果物のデジタル署名と検証は、ソフトウェアサプライチェーンのセキュリティを確保するために不可欠です。これにより、悪意のある改ざんや未承認の変更からソフトウェアを保護することができます。",
        links: [
          {
            text: "The Update Framework",
            url: "https://theupdateframework.io/",
          },
          {
            text: "Docker Content Trust",
            url: "https://docs.docker.com/engine/security/trust/",
          },
        ],
      },
      en: {
        summary:
          "Digital signing and verification of software artifacts are essential for securing the software supply chain. This protects software from malicious tampering and unauthorized changes.",
        links: [
          {
            text: "The Update Framework",
            url: "https://theupdateframework.io/",
          },
          {
            text: "Docker Content Trust",
            url: "https://docs.docker.com/engine/security/trust/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "ソフトウェア成果物の署名や検証は行われておらず、配布プロセスにセキュリティ対策がない",
          en: "Software artifacts are not signed or verified, with no security measures in the distribution process",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の重要なソフトウェア成果物に対してのみ、基本的な署名や検証が行われている",
          en: "Basic signing and verification are performed only for some important software artifacts",
        },
      },
      {
        value: 66,
        label: {
          ja: "多くのソフトウェア成果物に対して署名と検証が実施されているが、包括的なフレームワークや完全な自動化には至っていない",
          en: "Signing and verification are performed for many software artifacts, but a comprehensive framework or complete automation has not been achieved",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのソフトウェア成果物が署名され、配布時に検証されるセキュアな配布システムが導入され、TUFのような標準的なフレームワークに則った運用が行われている",
          en: "All software artifacts are signed and a secure distribution system that verifies during distribution has been implemented, with operations following standard frameworks like TUF",
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
    id: "ci_7",
    category: "container_infrastructure",
    text: {
      ja: "高度なKubernetes機能をどの程度使用していますか？",
      en: "To what extent are you using advanced Kubernetes features?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "none",
      manager: "low",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "Kubernetesは、基本的な機能を超えて、カスタムリソース定義、オペレーター、水平/垂直自動スケーリング、フェデレーションなど、高度な機能を提供します。これらの機能を活用することで、より強力で柔軟なアプリケーション管理が可能になります。",
        links: [
          {
            text: "Kubernetesオペレーター",
            url: "https://kubernetes.io/docs/concepts/extend-kubernetes/operator/",
          },
          {
            text: "カスタムリソース",
            url: "https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/",
          },
        ],
      },
      en: {
        summary:
          "Kubernetes provides advanced features beyond basic functionality, such as custom resource definitions, operators, horizontal/vertical auto-scaling, and federation. Leveraging these features enables more powerful and flexible application management.",
        links: [
          {
            text: "Kubernetes Operators",
            url: "https://kubernetes.io/docs/concepts/extend-kubernetes/operator/",
          },
          {
            text: "Custom Resources",
            url: "https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "基本的なKubernetesリソース（Pod、Service、Deploymentなど）のみを使用している",
          en: "Only basic Kubernetes resources (Pod, Service, Deployment, etc.) are used",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の高度な機能（StatefulSets、CronJobs、Ingressなど）を限定的に使用している",
          en: "Some advanced features (StatefulSets, CronJobs, Ingress, etc.) are used in a limited way",
        },
      },
      {
        value: 66,
        label: {
          ja: "多くの高度な機能（カスタムリソース、オペレーター、HPA、PDBなど）を積極的に活用している",
          en: "Many advanced features (custom resources, operators, HPA, PDB, etc.) are actively utilized",
        },
      },
      {
        value: 100,
        label: {
          ja: "最先端のKubernetes機能（サービスメッシュ、カスタムコントローラー、クラスタAPI、高度なスケジューリング機能など）を包括的に活用している",
          en: "Cutting-edge Kubernetes features (service mesh, custom controllers, cluster API, advanced scheduling features, etc.) are comprehensively utilized",
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
    id: "ci_8",
    category: "container_infrastructure",
    text: {
      ja: "Kubernetesの名前空間（namespace）とリソースクォータをどのように管理していますか？",
      en: "How do you manage Kubernetes namespaces and resource quotas?",
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
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "Kubernetes名前空間とリソースクォータは、マルチテナント環境でのリソース分離と制御に不可欠です。効果的な管理により、リソースの過剰使用を防ぎ、公平な分配を確保することができます。",
        links: [
          {
            text: "名前空間管理",
            url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/",
          },
          {
            text: "リソースクォータ",
            url: "https://kubernetes.io/docs/concepts/policy/resource-quotas/",
          },
        ],
      },
      en: {
        summary:
          "Kubernetes namespaces and resource quotas are essential for resource isolation and control in multi-tenant environments. Effective management prevents excessive resource use and ensures fair distribution.",
        links: [
          {
            text: "Namespace Management",
            url: "https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/",
          },
          {
            text: "Resource Quotas",
            url: "https://kubernetes.io/docs/concepts/policy/resource-quotas/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "名前空間の体系的な管理は行われておらず、リソースクォータもほとんど設定されていない",
          en: "Systematic management of namespaces is not performed, and resource quotas are hardly set",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な名前空間分離は実施されているが、標準化されたリソースクォータポリシーは限定的",
          en: "Basic namespace separation is implemented, but standardized resource quota policies are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "名前空間は環境やチームごとに体系的に管理され、適切なリソースクォータが設定されている",
          en: "Namespaces are systematically managed by environment and team, with appropriate resource quotas set",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な名前空間管理が実装され、動的リソース割り当て、階層的なクォータ管理、マルチテナンシーのベストプラクティスが徹底されている",
          en: "Advanced namespace management is implemented, with dynamic resource allocation, hierarchical quota management, and multi-tenancy best practices thoroughly applied",
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
    id: "ci_9",
    category: "container_infrastructure",
    text: {
      ja: "Kubernetesの構成管理をどのように行っていますか？",
      en: "How do you perform Kubernetes configuration management?",
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
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "Kubernetesの構成管理はGitOpsアプローチで行うことで、変更の追跡性、監査可能性、一貫性を確保し、構成のドリフトを防止することができます。",
        links: [
          {
            text: "KubernetesのためのGitOps",
            url: "https://www.gitops.tech/",
          },
          {
            text: "構成管理",
            url: "https://kubernetes.io/docs/concepts/configuration/",
          },
        ],
      },
      en: {
        summary:
          "Kubernetes configuration management using a GitOps approach ensures traceability, auditability, consistency of changes, and prevents configuration drift.",
        links: [
          {
            text: "GitOps for Kubernetes",
            url: "https://www.gitops.tech/",
          },
          {
            text: "Configuration Management",
            url: "https://kubernetes.io/docs/concepts/configuration/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "Kubernetesの構成は主に手動で管理され、バージョン管理や一貫性確保の仕組みがない",
          en: "Kubernetes configuration is primarily managed manually, with no version control or consistency mechanisms",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なマニフェストファイルはバージョン管理されているが、環境間の違いや一貫した適用の管理が不十分",
          en: "Basic manifest files are version controlled, but management of differences between environments and consistent application is inadequate",
        },
      },
      {
        value: 66,
        label: {
          ja: "GitOpsアプローチが採用され、宣言的な構成管理と自動同期が主要な環境で実装されている",
          en: "GitOps approach is adopted, with declarative configuration management and automatic synchronization implemented in key environments",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なKubernetes構成管理が標準化され、Policy as Code、構成検証、ドリフト検出、自動修復などが完全に実装されている",
          en: "Advanced Kubernetes configuration management is standardized, with Policy as Code, configuration validation, drift detection, and automatic remediation fully implemented",
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
    id: "ci_10",
    category: "container_infrastructure",
    text: {
      ja: "Kubernetesのセキュリティプラクティスをどのように実装していますか？",
      en: "How do you implement Kubernetes security practices?",
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
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "Kubernetesセキュリティには、RBAC、ネットワークポリシー、Pod SecurityContext、Secret管理などの重要な側面があり、これらを適切に実装することで、コンテナ環境の全体的なセキュリティを向上させることができます。",
        links: [
          {
            text: "Kubernetesセキュリティ",
            url: "https://kubernetes.io/docs/concepts/security/",
          },
          {
            text: "Podセキュリティ標準",
            url: "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
          },
        ],
      },
      en: {
        summary:
          "Kubernetes security includes important aspects such as RBAC, network policies, Pod SecurityContext, and Secret management. Properly implementing these can improve the overall security of the container environment.",
        links: [
          {
            text: "Kubernetes Security",
            url: "https://kubernetes.io/docs/concepts/security/",
          },
          {
            text: "Pod Security Standards",
            url: "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "Kubernetes固有のセキュリティ対策はほとんど実施されていない",
          en: "Few Kubernetes-specific security measures are implemented",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なRBAC設定やネットワークポリシーは実装されているが、包括的なセキュリティアプローチではない",
          en: "Basic RBAC settings and network policies are implemented, but not a comprehensive security approach",
        },
      },
      {
        value: 66,
        label: {
          ja: "Kubernetesセキュリティのベストプラクティス（Pod SecurityContext、ネットワークポリシー、Secret管理など）が広く実装されている",
          en: "Kubernetes security best practices (Pod SecurityContext, network policies, Secret management, etc.) are widely implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的なKubernetesセキュリティフレームワークが実装され、アドミッションコントローラー、セキュリティポリシー強制、脅威検出、コンプライアンス監視などが標準化されている",
          en: "Comprehensive Kubernetes security framework is implemented, with admission controllers, security policy enforcement, threat detection, compliance monitoring, etc. standardized",
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
    id: "ci_11",
    category: "container_infrastructure",
    text: {
      ja: "サービスメッシュ機能をどのように実装していますか？",
      en: "How do you implement service mesh functionality?",
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
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "サービスメッシュは、マイクロサービス間の通信を管理・監視・保護するための専用インフラストラクチャレイヤーです。これにより、トラフィック管理、セキュリティ、可観測性が向上します。",
        links: [
          {
            text: "サービスメッシュ",
            url: "https://istio.io/latest/about/service-mesh/",
          },
          { text: "サービスメッシュ比較", url: "https://servicemesh.es/" },
        ],
      },
      en: {
        summary:
          "Service mesh is a dedicated infrastructure layer for managing, monitoring, and securing communication between microservices. This improves traffic management, security, and observability.",
        links: [
          {
            text: "Service Mesh",
            url: "https://istio.io/latest/about/service-mesh/",
          },
          { text: "Service Mesh Comparison", url: "https://servicemesh.es/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "サービスメッシュは導入されておらず、サービス間通信は基本的な方法で管理されている",
          en: "Service mesh is not implemented, with inter-service communication managed by basic methods",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の環境や限定的なサービスでサービスメッシュが試験的に導入されている",
          en: "Service mesh is experimentally implemented in some environments or limited services",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要な本番環境でサービスメッシュが導入され、トラフィック管理、可観測性、セキュリティなどの機能が活用されている",
          en: "Service mesh is implemented in key production environments, with traffic management, observability, security functions being utilized",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なサービスメッシュ機能が組織全体で標準化され、高度なルーティング、細粒度のアクセス制御、エンドツーエンドの暗号化、高度な可観測性などが実装されている",
          en: "Advanced service mesh functionality is standardized across the organization, with advanced routing, fine-grained access control, end-to-end encryption, advanced observability, etc. implemented",
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
    id: "ci_12",
    category: "container_infrastructure",
    text: {
      ja: "マルチクラスタ管理とフェデレーションをどのように実装していますか？",
      en: "How do you implement multi-cluster management and federation?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "マルチクラスタ戦略は、高可用性、リージョン間のワークロード分散、ハイブリッドクラウド環境のサポートなどの目的で実装されます。効果的な管理には、一貫したポリシー適用、リソース管理、可観測性が必要です。",
        links: [
          {
            text: "マルチクラスタ管理",
            url: "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/",
          },
          {
            text: "クラスタフェデレーション",
            url: "https://github.com/kubernetes-sigs/kubefed",
          },
        ],
      },
      en: {
        summary:
          "Multi-cluster strategies are implemented for purposes such as high availability, workload distribution between regions, and hybrid cloud environment support. Effective management requires consistent policy enforcement, resource management, and observability.",
        links: [
          {
            text: "Multi-cluster Management",
            url: "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/",
          },
          {
            text: "Cluster Federation",
            url: "https://github.com/kubernetes-sigs/kubefed",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "マルチクラスタ戦略はなく、単一のクラスタまたは個別に管理された複数のクラスタのみを使用している",
          en: "No multi-cluster strategy exists, using only a single cluster or multiple clusters managed separately",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なマルチクラスタアプローチが一部の環境で実装されているが、統合管理や一貫したポリシー適用は限定的",
          en: "Basic multi-cluster approach is implemented in some environments, but integrated management and consistent policy enforcement are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なマルチクラスタ管理が実装され、クラスタ間の一貫したポリシー適用、リソース管理、可観測性が確保されている",
          en: "Comprehensive multi-cluster management is implemented, with consistent policy enforcement, resource management, and observability across clusters",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なマルチクラスタフェデレーションが標準化され、クラスタ間のワークロード移動、グローバルリソース管理、災害復旧、動的スケーリングなどの機能が実装されている",
          en: "Advanced multi-cluster federation is standardized, with workload movement between clusters, global resource management, disaster recovery, dynamic scaling, and other features implemented",
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
    id: "ci_13",
    category: "container_infrastructure",
    text: {
      ja: "コンテナプラットフォームのパフォーマンスとリソース最適化をどのように管理していますか？",
      en: "How do you manage container platform performance and resource optimization?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "optional",
    dependencies: [
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "コンテナプラットフォームのパフォーマンスとリソース最適化は、コスト効率、スケーラビリティ、全体的なシステムパフォーマンスに直接影響します。リソース要求/制限の適切な設定、自動スケーリング、コスト可視化などが重要です。",
        links: [
          {
            text: "リソース管理",
            url: "https://kubernetes.io/ja/docs/concepts/configuration/manage-resources-containers/",
          },
          {
            text: "自動スケーリング",
            url: "https://kubernetes.io/ja/docs/tasks/run-application/horizontal-pod-autoscale/",
          },
        ],
      },
      en: {
        summary:
          "Container platform performance and resource optimization directly impact cost efficiency, scalability, and overall system performance. Proper resource requests/limits, auto-scaling, and cost visibility are important.",
        links: [
          {
            text: "Resource Management",
            url: "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
          },
          {
            text: "Autoscaling",
            url: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "パフォーマンスやリソース最適化の体系的な取り組みはなく、リソース割り当ては推測や経験に基づいて行われている",
          en: "No systematic performance or resource optimization efforts, with resource allocation based on guesswork or experience",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なリソース要求/制限やHPAが一部のワークロードに設定されているが、包括的な最適化戦略はない",
          en: "Basic resource requests/limits and HPA are set for some workloads, but there is no comprehensive optimization strategy",
        },
      },
      {
        value: 66,
        label: {
          ja: "リソース最適化のベストプラクティスが広く採用され、適切なリソース管理、自動スケーリング、パフォーマンス監視が実装されている",
          en: "Resource optimization best practices are widely adopted, with proper resource management, auto-scaling, and performance monitoring implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なパフォーマンスとリソース最適化が標準化され、自動リソース調整、コスト最適化、負荷ベースのスケーリング、詳細なパフォーマンス分析などが実装されている",
          en: "Advanced performance and resource optimization are standardized, with automatic resource tuning, cost optimization, load-based scaling, detailed performance analysis, etc. implemented",
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
    id: "ci_14",
    category: "container_infrastructure",
    text: {
      ja: "コンテナネットワーキングとネットワークポリシーをどのように管理していますか？",
      en: "How do you manage container networking and network policies?",
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
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なコンテナネットワーキングとネットワークポリシーは、マイクロサービスアーキテクチャにおけるセキュリティと通信の効率性に不可欠です。適切なCNIプラグインの選択、ネットワークポリシーの定義、トラフィック管理が重要なコンポーネントです。",
        links: [
          {
            text: "コンテナネットワーキング",
            url: "https://kubernetes.io/docs/concepts/cluster-administration/networking/",
          },
          {
            text: "ネットワークポリシー",
            url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/",
          },
        ],
      },
      en: {
        summary:
          "Effective container networking and network policies are essential for security and communication efficiency in microservice architectures. Proper CNI plugin selection, network policy definition, and traffic management are important components.",
        links: [
          {
            text: "Container Networking",
            url: "https://kubernetes.io/docs/concepts/cluster-administration/networking/",
          },
          {
            text: "Network Policies",
            url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コンテナネットワーキングは基本的な接続のみに焦点を当てており、ネットワークポリシーはほとんど実装されていない",
          en: "Container networking focuses only on basic connectivity, with network policies hardly implemented",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なCNIプラグインが使用され、一部の重要なサービスでネットワークポリシーが実装されているが、包括的なセキュリティアプローチではない",
          en: "Basic CNI plugins are used, and network policies are implemented for some important services, but it's not a comprehensive security approach",
        },
      },
      {
        value: 66,
        label: {
          ja: "高度なCNIソリューションが採用され、ネットワークポリシーが広範囲に実装され、適切なネットワークセグメンテーションが確保されている",
          en: "Advanced CNI solutions are adopted, network policies are widely implemented, and proper network segmentation is ensured",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的なコンテナネットワーキング戦略が標準化され、高度なネットワークポリシー強制、トラフィック暗号化、異常検出、自動修復などの機能が実装されている",
          en: "Comprehensive container networking strategy is standardized, with advanced network policy enforcement, traffic encryption, anomaly detection, automatic remediation, etc. implemented",
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
    id: "ci_18",
    category: "container_infrastructure",
    text: {
      ja: "ステートフルアプリケーションとデータ永続性をコンテナ環境でどのように管理していますか？",
      en: "How do you manage stateful applications and data persistence in container environments?",
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
      { questionId: "ci_1", minValue: 66 }, // Only show if ci_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "コンテナ環境でのステートフルアプリケーションとデータ永続性の管理は、データの整合性と可用性を確保するために重要です。適切な永続ボリューム管理、バックアップ戦略、ステートフル・ワークロードに適したオーケストレーションが必要です。",
        links: [
          {
            text: "永続ボリューム",
            url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
          },
          {
            text: "StatefulSets",
            url: "https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/",
          },
        ],
      },
      en: {
        summary:
          "Managing stateful applications and data persistence in container environments is important for ensuring data integrity and availability. Proper persistent volume management, backup strategies, and orchestration suitable for stateful workloads are necessary.",
        links: [
          {
            text: "Persistent Volumes",
            url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/",
          },
          {
            text: "StatefulSets",
            url: "https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "ステートフルアプリケーションはコンテナ化されておらず、従来のインフラストラクチャで実行されている",
          en: "Stateful applications are not containerized and run on traditional infrastructure",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のステートフルアプリケーションがコンテナ化されているが、データ永続性と管理は基本的なアプローチに留まっている",
          en: "Some stateful applications are containerized, but data persistence and management remain basic approaches",
        },
      },
      {
        value: 66,
        label: {
          ja: "多くのステートフルアプリケーションが適切にコンテナ化され、永続ボリューム、StatefulSets、バックアップ戦略が実装されている",
          en: "Many stateful applications are properly containerized, with persistent volumes, StatefulSets, and backup strategies implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "ステートフルアプリケーションの完全なライフサイクル管理が確立され、高度なデータ永続化戦略、自動バックアップ/リストア、災害復旧、データレプリケーションが標準化されている",
          en: "Complete lifecycle management of stateful applications is established, with advanced data persistence strategies, automatic backup/restore, disaster recovery, and data replication standardized",
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
    id: "ci_19",
    category: "container_infrastructure",
    text: {
      ja: "コンテナ環境でのロギングとモニタリングをどのように実装していますか？",
      en: "How do you implement logging and monitoring in container environments?",
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
      { questionId: "ci_1", minValue: 66 }, // Only show if ci_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "コンテナ環境での効果的なロギングとモニタリングは、システムの健全性、パフォーマンス、セキュリティを確保するために不可欠です。集中ログ管理、コンテナ・メトリクス収集、アラート設定が重要なコンポーネントです。",
        links: [
          {
            text: "コンテナロギング",
            url: "https://kubernetes.io/docs/concepts/cluster-administration/logging/",
          },
          {
            text: "Kubernetesモニタリング",
            url: "https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/",
          },
        ],
      },
      en: {
        summary:
          "Effective logging and monitoring in container environments are essential for ensuring system health, performance, and security. Centralized log management, container metrics collection, and alert configuration are important components.",
        links: [
          {
            text: "Container Logging",
            url: "https://kubernetes.io/docs/concepts/cluster-administration/logging/",
          },
          {
            text: "Monitoring Kubernetes",
            url: "https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コンテナ固有のロギングやモニタリング戦略はなく、基本的なシステムログのみに依存している",
          en: "No container-specific logging or monitoring strategy, relying only on basic system logs",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なコンテナログ収集とメトリクスモニタリングが実装されているが、包括的なアプローチや高度な分析機能はない",
          en: "Basic container log collection and metrics monitoring are implemented, but there is no comprehensive approach or advanced analysis capabilities",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なコンテナロギングとモニタリングソリューションが実装され、ログ集約、メトリクス収集、基本的なアラートが設定されている",
          en: "Comprehensive container logging and monitoring solutions are implemented, with log aggregation, metrics collection, and basic alerts configured",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なコンテナ可観測性プラットフォームが標準化され、分散トレーシング、詳細なメトリクス分析、機械学習ベースの異常検出、自動対応などの機能が実装されている",
          en: "Advanced container observability platform is standardized, with distributed tracing, detailed metrics analysis, machine learning-based anomaly detection, automated response capabilities implemented",
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
    id: "ci_20",
    category: "container_infrastructure",
    text: {
      ja: "ハイブリッド・マルチクラウド環境でのコンテナ戦略をどのように実装していますか？",
      en: "How do you implement container strategy in hybrid and multi-cloud environments?",
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
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ハイブリッド・マルチクラウド環境でのコンテナ戦略は、ベンダーロックインの回避、リソースの最適な活用、地理的な冗長性など、複数の利点を提供します。一貫したプラットフォーム抽象化、移植性、統合管理が成功の鍵です。",
        links: [
          {
            text: "マルチクラウド戦略",
            url: "https://cloud.google.com/learn/what-is-multicloud",
          },
          {
            text: "ハイブリッドクラウドコンテナ",
            url: "https://www.redhat.com/en/topics/cloud-computing/what-is-hybrid-cloud",
          },
        ],
      },
      en: {
        summary:
          "Container strategy in hybrid and multi-cloud environments provides multiple benefits such as avoiding vendor lock-in, optimal resource utilization, and geographical redundancy. Consistent platform abstraction, portability, and integrated management are keys to success.",
        links: [
          {
            text: "Multi-cloud Strategy",
            url: "https://cloud.google.com/learn/what-is-multicloud",
          },
          {
            text: "Hybrid Cloud Containers",
            url: "https://www.redhat.com/en/topics/cloud-computing/what-is-hybrid-cloud",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "マルチクラウドやハイブリッド環境は考慮されておらず、単一のクラウドプロバイダーまたはオンプレミス環境のみに焦点を当てている",
          en: "Multi-cloud or hybrid environments are not considered, focusing only on a single cloud provider or on-premises environment",
        },
      },
      {
        value: 33,
        label: {
          ja: "複数の環境にコンテナワークロードがデプロイされているが、統合された戦略や一貫した管理アプローチはない",
          en: "Container workloads are deployed to multiple environments, but there is no integrated strategy or consistent management approach",
        },
      },
      {
        value: 66,
        label: {
          ja: "ハイブリッド・マルチクラウド戦略が確立され、複数の環境間で一貫したコンテナプラットフォームと管理ツールが使用されている",
          en: "Hybrid and multi-cloud strategy is established, with consistent container platforms and management tools used across multiple environments",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的なハイブリッド・マルチクラウド戦略が標準化され、抽象化された共通プラットフォーム、自動ワークロード配置、クラウド間リソース最適化、一貫したガバナンスが実装されている",
          en: "Comprehensive hybrid and multi-cloud strategy is standardized, with abstracted common platform, automated workload placement, cross-cloud resource optimization, and consistent governance implemented",
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
    id: "ci_21",
    category: "container_infrastructure",
    text: {
      ja: "コンテナプラットフォームの災害復旧と事業継続をどのように計画・実装していますか？",
      en: "How do you plan and implement disaster recovery and business continuity for your container platform?",
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
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "コンテナプラットフォームの災害復旧（DR）と事業継続計画（BCP）は、システム障害やデータセンター停止などの重大な問題からの回復力を確保します。効果的な戦略には、マルチリージョンデプロイメント、データレプリケーション、自動フェイルオーバーが含まれます。",
        links: [
          {
            text: "Kubernetes DR",
            url: "https://www.infracloud.io/blogs/k8s-disaster-recovery-using-kasten-k10/",
          },
          {
            text: "コンテナBCP",
            url: "https://www.redhat.com/en/topics/containers/what-is-container-orchestration",
          },
        ],
      },
      en: {
        summary:
          "Disaster recovery (DR) and business continuity planning (BCP) for container platforms ensure resilience from major issues such as system failures or data center outages. Effective strategies include multi-region deployments, data replication, and automatic failover.",
        links: [
          {
            text: "Kubernetes DR",
            url: "https://www.infracloud.io/blogs/k8s-disaster-recovery-using-kasten-k10/",
          },
          {
            text: "Container BCP",
            url: "https://www.redhat.com/en/topics/containers/what-is-container-orchestration",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コンテナプラットフォーム特有の災害復旧計画はなく、基本的なバックアップのみに依存している",
          en: "No container platform-specific disaster recovery plan, relying only on basic backups",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な災害復旧手順は文書化されているが、包括的な計画や定期的なテストはなく、主に手動プロセスに依存している",
          en: "Basic disaster recovery procedures are documented, but there is no comprehensive plan or regular testing, relying mainly on manual processes",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なコンテナ災害復旧計画が確立され、明確なRTO/RPO、自動バックアップ、定期的なテストが実装されている",
          en: "Comprehensive container disaster recovery plan is established, with clear RTO/RPO, automated backups, and regular testing implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な災害復旧・事業継続戦略が標準化され、マルチリージョンデプロイメント、自動フェイルオーバー、継続的な復旧テスト、ゼロダウンタイム移行などの機能が実装されている",
          en: "Advanced disaster recovery and business continuity strategy is standardized, with multi-region deployment, automatic failover, continuous recovery testing, zero-downtime migration capabilities implemented",
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
    id: "ci_22",
    category: "container_infrastructure",
    text: {
      ja: "コンテナプラットフォームの自動化と開発者体験をどのように最適化していますか？",
      en: "How do you optimize container platform automation and developer experience?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "optional",
    dependencies: [
      { questionId: "ci_3", minValue: 66 }, // Only show if ci_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "コンテナプラットフォームの自動化と優れた開発者体験（DevX）は、開発者の生産性を向上させ、イノベーションを加速させます。セルフサービス機能、内部開発者ポータル、自動化されたワークフローが重要なコンポーネントです。",
        links: [
          {
            text: "開発者体験",
            url: "https://dxheroes.io/developer-experience/",
          },
          {
            text: "プラットフォームエンジニアリング",
            url: "https://tanzu.vmware.com/platform-engineering",
          },
        ],
      },
      en: {
        summary:
          "Container platform automation and excellent developer experience (DevX) enhance developer productivity and accelerate innovation. Self-service capabilities, internal developer portals, and automated workflows are important components.",
        links: [
          {
            text: "Developer Experience",
            url: "https://dxheroes.io/developer-experience/",
          },
          {
            text: "Platform Engineering",
            url: "https://tanzu.vmware.com/platform-engineering",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "コンテナプラットフォームは主に運用チームが管理し、開発者の自己サービス機能はほとんどなく、多くの手動プロセスが必要",
          en: "Container platform is primarily managed by operations teams, with few developer self-service capabilities and many manual processes required",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なテンプレートとツールが提供されているが、包括的な自動化や開発者向けのセルフサービスポータルはない",
          en: "Basic templates and tools are provided, but comprehensive automation or developer self-service portals are not available",
        },
      },
      {
        value: 66,
        label: {
          ja: "開発者向けの包括的なセルフサービス機能とワークフロー自動化が実装され、コンテナ環境の利用と管理が容易になっている",
          en: "Comprehensive developer self-service capabilities and workflow automation are implemented, making container environment use and management easier",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な内部開発者プラットフォームが確立され、完全な自動化、直感的なセルフサービスポータル、組み込みのベストプラクティス、高度な開発者ツールが提供されている",
          en: "Advanced internal developer platform is established, with complete automation, intuitive self-service portals, embedded best practices, and advanced developer tools provided",
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
