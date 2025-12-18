/**
 * セキュリティとコンプライアンス質問モジュール
 *
 * クラウドネイティブ環境におけるセキュリティとコンプライアンスに関する質問を定義するモジュールです。
 * DevSecOps、セキュリティ自動化、脆弱性管理、コンプライアンス対応などの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const securityComplianceQuestions: AssessmentQuestion[] = [
  {
    id: "sc_1",
    category: "security_compliance",
    text: {
      ja: "クラウドネイティブ環境でのセキュリティにどのようにアプローチしていますか？",
      en: "How do you approach security in a cloud-native environment?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "quick",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドネイティブ環境のセキュリティは動的インフラや短いライフサイクルに適応する必要があります。セキュリティをコードとして扱い、CI/CDパイプラインへ組み込むことが重要です。",
        links: [
          {
            text: "Cloud Native Security",
            url: "https://tag-security.cncf.io/community/resources/security-whitepaper/v2/cloud-native-security-whitepaper-ja/",
          },
          {
            text: "Kubernetes Security",
            url: "https://kubernetes.io/docs/concepts/security/overview/",
          },
        ],
      },
      en: {
        summary:
          "Security in cloud-native settings must accommodate dynamic infrastructure and short lifecycles. Treat security as code and embed it directly in CI/CD pipelines.",
        links: [
          {
            text: "Cloud Native Security",
            url: "https://tag-security.cncf.io/community/resources/security-whitepaper/",
          },
          {
            text: "Kubernetes Security",
            url: "https://kubernetes.io/docs/concepts/security/overview/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラウドネイティブ特有のセキュリティ対策はほとんど実施されておらず、従来型アプローチに依存している",
          en: "Little to no cloud-native–specific controls; relies on legacy approaches.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なクラウドセキュリティ対策（アクセス制御・NWセキュリティ等）はあるが、包括的ではない",
          en: "Basic cloud controls (access, network) exist, but coverage is limited.",
        },
      },
      {
        value: 66,
        label: {
          ja: "ベストプラクティスが広く採用され、開発ライフサイクル全体に統合されている",
          en: "Best-practice controls are widely adopted and integrated across the SDLC.",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的フレームワークがあり、自動テスト・ポリシー強制・脅威検出・インシデント対応が標準化されている",
          en: "A full framework standardizes automated tests, policy enforcement, threat detection, and incident response.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "この内容に詳しくない場合は選択してください。",
          en: "Select this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  {
    id: "sc_2",
    category: "security_compliance",
    text: {
      ja: "コンプライアンス要件をどのように管理していますか？",
      en: "How do you manage compliance requirements?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "quick",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "規制準拠を維持するには、自動検証・継続的監視・証跡収集が鍵です。コード化されたポリシーで一貫性を確保します。",
        links: [
          {
            text: "Cloud Compliance",
            url: "https://aws.amazon.com/jp/compliance/",
          },
          {
            text: "Kubernetes CIS Benchmark",
            url: "https://www.cisecurity.org/benchmark/kubernetes",
          },
        ],
      },
      en: {
        summary:
          "Maintaining compliance requires automated validation, continuous monitoring, and audit trails. Policy-as-Code ensures consistency.",
        links: [
          {
            text: "Cloud Compliance",
            url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.18/html-single/security_and_compliance/index",
          },
          {
            text: "Kubernetes CIS Benchmark",
            url: "https://www.cisecurity.org/benchmark/kubernetes",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "主に手動プロセスで管理し、クラウドネイティブ特化対策はほとんどない",
          en: "Managed manually; few cloud-native–specific measures.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本プロセスはあるが自動化や継続的検証は限定的",
          en: "Basic processes exist, but limited automation or continuous validation.",
        },
      },
      {
        value: 66,
        label: {
          ja: "Policy as Code・自動チェックが広く採用され体系化されている",
          en: "Policy-as-Code and automated checks are broadly adopted and structured.",
        },
      },
      {
        value: 100,
        label: {
          ja: "継続的自動検証・リアルタイム監視・証跡収集・例外管理が完全自動化されている",
          en: "Continuous auto-validation, real-time monitoring, audit collection, and exception handling are fully automated.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "この内容に詳しくない場合は選択してください。",
          en: "Select this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  {
    id: "sc_3",
    category: "security_compliance",
    text: {
      ja: "ネットワークセキュリティへのアプローチはどのようなものですか？",
      en: "What is your approach to network security?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
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
          "境界型防御からゼロトラスト・マイクロセグメンテーションへ移行し、サービス間通信の保護を重視します。",
        links: [
          {
            text: "Network Policies",
            url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/",
          },
          {
            text: "Zero Trust Security",
            url: "https://atmarkit.itmedia.co.jp/ait/articles/2503/04/news070.html",
          },
        ],
      },
      en: {
        summary:
          "Move from perimeter defense to zero-trust, micro-segmentation, and secure service-to-service communication.",
        links: [
          {
            text: "Network Policies",
            url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/",
          },
          {
            text: "Zero Trust Security",
            url: "https://www.cncf.io/wp-content/uploads/2022/06/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラウドネイティブ特化対策はなし",
          en: "No cloud-native–specific measures.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基礎的なセグメンテーション/ファイアウォールのみ",
          en: "Only basic segmentation/firewalls.",
        },
      },
      {
        value: 66,
        label: {
          ja: "ゼロトラスト・サービスメッシュ・NWポリシーなどを採用",
          en: "Zero-trust, service-mesh security, and network policies adopted.",
        },
      },
      {
        value: 100,
        label: {
          ja: "動的ポリシー・暗号化通信・異常検知・自動対応が標準化",
          en: "Dynamic policy, encrypted traffic, anomaly detection, automated response standardized.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "この内容に詳しくない場合は選択してください。",
          en: "Select this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  {
    id: "sc_4",
    category: "security_compliance",
    text: {
      ja: "セキュリティプラクティスが開発ライフサイクルにどの程度統合されていますか？",
      en: "To what extent are security practices integrated into your development life cycle?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "DevSecOpsはコードの早期段階からセキュリティを組み込み、継続的検証を行います。後工程より効率的です。",
        links: [
          {
            text: "DevSecOps",
            url: "https://www.redhat.com/en/topics/devops/what-is-devsecops",
          },
          {
            text: "Shift-Left Security",
            url: "https://snyk.io/learn/shift-left-security/",
          },
        ],
      },
      en: {
        summary:
          "DevSecOps embeds security from the earliest stages and validates continuously—more efficient than end-stage fixes.",
        links: [
          {
            text: "DevSecOps",
            url: "https://www.redhat.com/en/topics/devops/what-is-devsecops",
          },
          {
            text: "Shift-Left Security",
            url: "https://snyk.io/learn/shift-left-security/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "セキュリティは最後に考慮される",
          en: "Security considered only at the end.",
        },
      },
      {
        value: 33,
        label: {
          ja: "レビュー/スキャンはあるが全体統合は限定的",
          en: "Reviews/scans exist, but limited full integration.",
        },
      },
      {
        value: 66,
        label: {
          ja: "自動テスト・ポリシーチェックを含むDevSecOpsが標準",
          en: "DevSecOps with automated tests and policy checks is standard.",
        },
      },
      {
        value: 100,
        label: {
          ja: "設計段階からの要件組込み・継続検証・自動修復を実装",
          en: "Security requirements at design, continuous validation, and auto-remediation implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "この内容に詳しくない場合は選択してください。",
          en: "Select this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  /* ───────────────────────── Intermediate Questions ────────────────────── */
  {
    id: "sc_5",
    category: "security_compliance",
    text: {
      ja: "クラウドネイティブ環境でのシークレットと機密設定をどのように管理していますか？",
      en: "How do you manage secrets and sensitive configuration in a cloud-native environment?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [{ questionId: "sc_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "シークレット管理は機密情報を安全に保管・配布・ローテーションするプロセスで、漏洩リスクを減らします。",
        links: [
          {
            text: "Secret Management",
            url: "https://kubernetes.io/docs/concepts/configuration/secret/",
          },
          { text: "HashiCorp Vault", url: "https://www.vaultproject.io/" },
        ],
      },
      en: {
        summary:
          "Secret management securely stores, distributes, and rotates sensitive data, reducing leakage risk.",
        links: [
          {
            text: "Secret Management",
            url: "https://kubernetes.io/docs/concepts/configuration/secret/",
          },
          { text: "HashiCorp Vault", url: "https://www.vaultproject.io/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "ハードコード/安全でない保存が多く、対策はほとんどない",
          en: "Secrets are often hard-coded or stored insecurely; few controls.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なツールは使用するが、標準化された戦略はない",
          en: "Basic tooling used, but no standardized strategy.",
        },
      },
      {
        value: 66,
        label: {
          ja: "暗号化ストレージ・アクセス制御・ローテーションポリシーを採用",
          en: "Encrypted stores, access control, and rotation policies adopted.",
        },
      },
      {
        value: 100,
        label: {
          ja: "動的シークレット・JITアクセス・自動ローテーション・監査ログを含む高度なフレームワークを実装",
          en: "Advanced framework with dynamic secrets, JIT access, auto-rotation, and audit logging implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "この内容に詳しくない場合は選択してください。",
          en: "Select this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  {
    id: "sc_6",
    category: "security_compliance",
    text: {
      ja: "ID管理と認証・認可の管理をどのように行っていますか？",
      en: "How do you manage identities, authentication, and authorization?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [{ questionId: "sc_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ID・認証/認可管理は信頼関係と最小権限を実現する基盤です。ユーザーとサービス両方を対象にします。",
        links: [
          {
            text: "RBAC in Kubernetes",
            url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/",
          },
          { text: "SPIFFE/SPIRE", url: "https://spiffe.io/" },
        ],
      },
      en: {
        summary:
          "Identity and access management (IAM) establishes trust and least privilege for users and services.",
        links: [
          {
            text: "RBAC in Kubernetes",
            url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/",
          },
          { text: "SPIFFE/SPIRE", url: "https://spiffe.io/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "基本的なユーザー認証のみで、クラウドネイティブ特有機能を活用していない",
          en: "Only basic user authentication; cloud-native IAM features unused.",
        },
      },
      {
        value: 33,
        label: {
          ja: "RBAC/IAMポリシーはあるが、細かな権限制御や全体戦略が不足",
          en: "RBAC/IAM policies exist, but fine-grained controls and cohesive strategy are lacking.",
        },
      },
      {
        value: 66,
        label: {
          ja: "最小権限・サービスアイデンティティなどを含む包括的戦略を実装",
          en: "Comprehensive strategy with least privilege, service identities, etc.",
        },
      },
      {
        value: 100,
        label: {
          ja: "動的ポリシー・コンテキスト認証・相互TLS・自動監査など高度なIAMを実装",
          en: "Advanced IAM with dynamic policy, context-aware auth, mutual TLS, and auto-audit.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "この内容に詳しくない場合は選択してください。",
          en: "Select this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  {
    id: "sc_7",
    category: "security_compliance",
    text: {
      ja: "脆弱性管理をどのように実施していますか？",
      en: "How do you perform vulnerability management?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [{ questionId: "sc_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "継続的スキャンと迅速修正が重要です。コード・依存・イメージ・インフラ全体を対象にします。",
        links: [
          {
            text: "Container Scanning",
            url: "https://sysdig.jp/blog/container-security-best-practices/",
          },
          { text: "CVE Database", url: "https://nvd.nist.gov/vuln/search" },
        ],
      },
      en: {
        summary:
          "Continuous scanning and fast remediation matter. Cover code, dependencies, images, and infrastructure.",
        links: [
          {
            text: "Container Scanning",
            url: "https://snyk.io/articles/container-security/container-scanning/",
          },
          { text: "CVE Database", url: "https://nvd.nist.gov/vuln/search" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的プロセスなし。不定期スキャン・修正のみ",
          en: "No formal process; ad-hoc scans/fixes.",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本スキャンは実施するが自動化された修正フローはない",
          en: "Basic scans performed, but no automated remediation flow.",
        },
      },
      {
        value: 66,
        label: {
          ja: "定期的スキャン、優先順位付け、追跡、修正が確立",
          en: "Regular scanning, prioritization, tracking, and remediation established.",
        },
      },
      {
        value: 100,
        label: {
          ja: "自動スキャン・CI/CD統合・自動修正などを含む高度フレームワーク",
          en: "Advanced framework with auto-scan, CI/CD integration, and auto-remediation.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "この内容に詳しくない場合は選択してください。",
          en: "Select this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  {
    id: "sc_8",
    category: "security_compliance",
    text: {
      ja: "コンテナとKubernetesのセキュリティをどのように確保していますか？",
      en: "How do you secure containers and Kubernetes?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [{ questionId: "sc_1", minValue: 33 }],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "イメージセキュリティ、ランタイム保護、クラスター設定など多面的アプローチが必要です。",
        links: [
          {
            text: "Kubernetes Security",
            url: "https://kubernetes.io/docs/concepts/security/",
          },
          {
            text: "CIS Benchmarks",
            url: "https://www.cisecurity.org/benchmark/kubernetes",
          },
        ],
      },
      en: {
        summary:
          "A multi-layer approach covering image security, runtime protection, and cluster hardening is required.",
        links: [
          {
            text: "Kubernetes Security",
            url: "https://kubernetes.io/docs/concepts/security/",
          },
          {
            text: "CIS Benchmarks",
            url: "https://www.cisecurity.org/benchmark/kubernetes",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "特化対策なし", en: "No specific measures." },
      },
      {
        value: 33,
        label: {
          ja: "イメージスキャンと基本RBACのみ",
          en: "Image scans and basic RBAC only.",
        },
      },
      {
        value: 66,
        label: {
          ja: "イメージスキャン・ポッド/ネットワークポリシーなどを採用",
          en: "Image scanning and pod/network policies adopted.",
        },
      },
      {
        value: 100,
        label: {
          ja: "署名検証・ランタイム監視・ポリシー強制・CIS準拠を完全実装",
          en: "Signature verification, runtime monitoring, policy enforcement, CIS compliance fully implemented.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "この内容に詳しくない場合は選択してください。",
          en: "Select this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  /* ───────────────────────── Comprehensive (sc_9 - sc_21) ──────────────── */
  {
    id: "sc_9",
    category: "security_compliance",
    text: {
      ja: "Security as Codeのアプローチをどの程度採用していますか？",
      en: "To what extent do you adopt a Security-as-Code approach?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_4", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ポリシー・設定・制御をコード化し、バージョン管理と自動テストを行うことで一貫性と再現性を確保します。",
        links: [
          {
            text: "Security as Code",
            url: "https://sysdig.jp/learn-cloud-native/what-is-policy-as-code/",
          },
          {
            text: "Open Policy Agent",
            url: "https://www.openpolicyagent.org/",
          },
        ],
      },
      en: {
        summary:
          "Security-as-Code codifies policies, settings, and controls, enabling versioning, automated tests, and consistency.",
        links: [
          {
            text: "Security as Code",
            url: "https://www.infoq.com/articles/secure-software-development-gitops/",
          },
          {
            text: "Open Policy Agent",
            url: "https://www.openpolicyagent.org/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "設定は手動管理が中心で、コード化されていない",
          en: "Settings managed manually; not codified.",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部ポリシーをコード管理するが、範囲は限定的",
          en: "Some policies in code, but limited scope.",
        },
      },
      {
        value: 66,
        label: {
          ja: "多くのポリシーがコード化されCI/CDに統合",
          en: "Most policies codified and integrated into CI/CD.",
        },
      },
      {
        value: 100,
        label: {
          ja: "全ポリシーがコード化され、自動テスト・検証・適用が完全自動化",
          en: "All policies codified with fully automated testing, validation, and enforcement.",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: {
          ja: "この内容に詳しくない場合は選択してください。",
          en: "Select this option if you're not familiar with the topic.",
        },
      },
    ],
  },

  {
    id: "sc_10",
    category: "security_compliance",
    text: {
      ja: "セキュリティインシデント対応と脅威検出をどのように管理していますか？",
      en: "How do you manage incident response and threat detection?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドネイティブでは自動検出と迅速対応が必要で、従来より俊敏・自動化されたプロセスが求められます。",
        links: [
          {
            text: "Incident Response",
            url: "https://csrc.nist.gov/Projects/incident-response",
          },
          {
            text: "Threat Detection",
            url: "https://www.sans.org/top25-software-errors/",
          },
        ],
      },
      en: {
        summary:
          "Cloud-native demands automated detection and fast response, requiring agile and automated workflows.",
        links: [
          {
            text: "Incident Response",
            url: "https://csrc.nist.gov/Projects/incident-response",
          },
          {
            text: "Threat Detection",
            url: "https://www.sans.org/top25-software-errors/",
          },
        ],
      },
    },
    options: [
      { value: 0, label: { ja: "基本計画のみ", en: "Basic plan only" } },
      {
        value: 33,
        label: {
          ja: "計画＋一部自動化検出",
          en: "Plan + limited automated detection",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的プロセス・ある程度自動化",
          en: "Comprehensive process with some automation",
        },
      },
      {
        value: 100,
        label: {
          ja: "AI検出・自動対応・詳細フォレンジック",
          en: "AI-driven detection, auto-response, deep forensics",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },

  {
    id: "sc_11",
    category: "security_compliance",
    text: {
      ja: "IAMの高度な機能をどのように実装していますか？",
      en: "How do you implement advanced IAM capabilities?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_6", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "高度IAMにはMFA、Just-In-Timeアクセス、特権管理、ゼロトラストなどが含まれます。",
        links: [
          {
            text: "Zero Trust IAM",
            url: "https://atmarkit.itmedia.co.jp/ait/articles/2503/04/news070.html",
          },
          {
            text: "MFA Guidance",
            url: "https://pages.nist.gov/800-63-3/sp800-63b.html",
          },
        ],
      },
      en: {
        summary:
          "Advanced IAM features include MFA, JIT access, privileged access management, and zero-trust.",
        links: [
          {
            text: "Zero Trust IAM",
            url: "https://www.cncf.io/wp-content/uploads/2022/06/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf",
          },
          {
            text: "MFA Guidance",
            url: "https://pages.nist.gov/800-63-3/sp800-63b.html",
          },
        ],
      },
    },
    options: [
      { value: 0, label: { ja: "高度機能なし", en: "No advanced features" } },
      {
        value: 33,
        label: { ja: "MFA等一部実装", en: "Some features (e.g., MFA)" },
      },
      {
        value: 66,
        label: { ja: "包括フレームワーク", en: "Comprehensive framework" },
      },
      {
        value: 100,
        label: { ja: "ゼロトラストIAM", en: "Full zero-trust IAM" },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },

  {
    id: "sc_12",
    category: "security_compliance",
    text: {
      ja: "セキュリティとコンプライアンスの監視・報告をどのように行っていますか？",
      en: "How do you monitor and report security & compliance?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_2", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "可視化は透明性と継続改善に不可欠です。自動ダッシュボードとリスク指標を活用します。",
        links: [
          {
            text: "Security Metrics",
            url: "https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf",
          },
          {
            text: "Compliance Reporting",
            url: "https://www.nri-secure.co.jp/blog/cis-controls-v8",
          },
        ],
      },
      en: {
        summary:
          "Visibility enables transparency and continuous improvement. Use automated dashboards and risk metrics.",
        links: [
          {
            text: "Security Metrics",
            url: "https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf",
          },
          {
            text: "Compliance Reporting",
            url: "https://www.cisecurity.org/controls/v8",
          },
        ],
      },
    },
    options: [
      { value: 0, label: { ja: "主に手動", en: "Mostly manual" } },
      { value: 33, label: { ja: "一部自動化", en: "Partly automated" } },
      {
        value: 66,
        label: { ja: "包括ダッシュボード", en: "Comprehensive dashboards" },
      },
      {
        value: 100,
        label: { ja: "リアルタイム可視化", en: "Real-time visualization" },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },

  {
    id: "sc_13",
    category: "security_compliance",
    text: {
      ja: "データセキュリティと保護をどのように管理していますか？",
      en: "How do you manage data security and protection?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "データ分類・暗号化・アクセス制御・ライフサイクル管理など多層的アプローチが必要です。",
        links: [
          {
            text: "Data Security",
            url: "https://www.ibm.com/think/topics/data-security",
          },
          {
            text: "Encryption",
            url: "https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/encryption-best-practices/general-encryption-best-practices.html",
          },
        ],
      },
      en: {
        summary:
          "A layered approach includes classification, encryption, access control, and lifecycle management.",
        links: [
          {
            text: "Data Security",
            url: "https://www.ibm.com/think/topics/data-security",
          },
          {
            text: "Encryption",
            url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "基本暗号化のみ", en: "Only basic encryption" },
      },
      {
        value: 33,
        label: { ja: "暗号化+AC", en: "Encryption + access control" },
      },
      {
        value: 66,
        label: {
          ja: "分類＋監査など包括対策",
          en: "Classification & audit, broad controls",
        },
      },
      {
        value: 100,
        label: {
          ja: "自動分類・透過暗号など高度プログラム",
          en: "Advanced program: auto-classification, transparent encryption",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },

  {
    id: "sc_14",
    category: "security_compliance",
    text: {
      ja: "クラウドセキュリティ態勢管理（CSPM）をどのように実装していますか？",
      en: "How do you implement Cloud Security Posture Management (CSPM)?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "CSPMは設定ミスや脆弱性を継続評価しベストプラクティス準拠を確保します。",
        links: [
          {
            text: "CSPM Overview",
            url: "https://www.checkpoint.com/cyber-hub/cloud-security/what-is-cspm-cloud-security-posture-management/",
          },
          {
            text: "Cloud Benchmarks",
            url: "https://www.cisecurity.org/cis-benchmarks",
          },
        ],
      },
      en: {
        summary:
          "CSPM continuously evaluates misconfigurations and vulnerabilities to ensure best-practice alignment.",
        links: [
          {
            text: "CSPM Overview",
            url: "https://www.checkpoint.com/cyber-hub/cloud-security/what-is-cspm-cloud-security-posture-management/",
          },
          {
            text: "Cloud Benchmarks",
            url: "https://www.cisecurity.org/cis-benchmarks",
          },
        ],
      },
    },
    options: [
      { value: 0, label: { ja: "手動評価", en: "Manual assessment" } },
      { value: 33, label: { ja: "基本スキャン", en: "Basic scans" } },
      { value: 66, label: { ja: "包括CSPM導入", en: "Comprehensive CSPM" } },
      {
        value: 100,
        label: {
          ja: "マルチクラウドCSPM+自動修復",
          en: "Multi-cloud CSPM with auto-remediation",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },

  {
    id: "sc_15",
    category: "security_compliance",
    text: {
      ja: "サプライチェーンセキュリティをどのように管理していますか？",
      en: "How do you manage software supply-chain security?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "依存関係検証、コード署名、SBOM生成などでコードとコンポーネントの整合性を確保します。",
        links: [
          { text: "SLSA Framework", url: "https://slsa.dev/" },
          { text: "SBOM", url: "https://www.cisa.gov/sbom" },
        ],
      },
      en: {
        summary:
          "Verify dependencies, sign code, and generate SBOMs to ensure component integrity throughout the pipeline.",
        links: [
          { text: "SLSA Framework", url: "https://slsa.dev/" },
          { text: "SBOM", url: "https://www.cisa.gov/sbom" },
        ],
      },
    },
    options: [
      { value: 0, label: { ja: "対策ほぼなし", en: "Little to no measures" } },
      {
        value: 33,
        label: { ja: "依存スキャンのみ", en: "Dependency scanning only" },
      },
      {
        value: 66,
        label: { ja: "フレームワーク導入", en: "Framework introduced" },
      },
      {
        value: 100,
        label: {
          ja: "SBOM・ゼロトラストSCM",
          en: "SBOM & Zero-trust supply chain",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },

  {
    id: "sc_16",
    category: "security_compliance",
    text: {
      ja: "クラウドネイティブ環境でのセキュリティアーキテクチャと設計をどのように管理していますか？",
      en: "How do you manage security architecture and design in cloud-native environments?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_4", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "ゼロトラスト・Defense-in-Depth・最小権限原則を備えたアーキテクチャと脅威モデリングが重要です。",
        links: [
          {
            text: "Zero Trust Architecture",
            url: "https://atmarkit.itmedia.co.jp/ait/articles/2503/04/news070.html",
          },
          {
            text: "Security by Design (AWS)",
            url: "https://aws.amazon.com/architecture/security-identity-compliance/",
          },
        ],
      },
      en: {
        summary:
          "Zero-trust, defense-in-depth, and least privilege principles plus threat modeling underpin secure architecture.",
        links: [
          {
            text: "Zero Trust Architecture",
            url: "https://www.cncf.io/wp-content/uploads/2022/06/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf",
          },
          {
            text: "Security by Design (AWS)",
            url: "https://aws.amazon.com/architecture/security-identity-compliance/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "後付け設計", en: "Security added post-design" },
      },
      {
        value: 33,
        label: { ja: "基本原則のみ", en: "Basic principles considered" },
      },
      {
        value: 66,
        label: { ja: "フレームワーク確立", en: "Framework established" },
      },
      {
        value: 100,
        label: {
          ja: "脅威モデリング＋自動検証",
          en: "Threat modeling + automated validation",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },

  {
    id: "sc_17",
    category: "security_compliance",
    text: {
      ja: "セキュリティ意識向上とトレーニングプログラムをどのように実施していますか？",
      en: "How do you run security awareness and training programs?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_1", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "役割別コンテンツやシミュレーション演習でセキュリティ文化を醸成し、人為的リスクを低減します。",
        links: [
          {
            text: "Security Awareness",
            url: "https://www.sans.org/security-awareness-training/",
          },
          {
            text: "Cloud Security Training",
            url: "https://www.isaca.org/resources/cybersecurity",
          },
        ],
      },
      en: {
        summary:
          "Role-based content and simulation exercises build security culture and reduce human risk.",
        links: [
          {
            text: "Security Awareness",
            url: "https://www.sans.org/security-awareness-training/",
          },
          {
            text: "Cloud Security Training",
            url: "https://www.isaca.org/resources/cybersecurity",
          },
        ],
      },
    },
    options: [
      { value: 0, label: { ja: "ほとんど実施なし", en: "Little to none" } },
      { value: 33, label: { ja: "基本研修のみ", en: "Basic training only" } },
      {
        value: 66,
        label: { ja: "包括プログラム", en: "Comprehensive program" },
      },
      {
        value: 100,
        label: {
          ja: "リアルタイム＆適応学習",
          en: "Real-time & adaptive learning",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },

  {
    id: "sc_18",
    category: "security_compliance",
    text: {
      ja: "コンプライアンスの自動化と継続的検証をどのように実施していますか？",
      en: "How do you automate and continuously validate compliance?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_2", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "Compliance as Codeとリアルタイムモニタリングで継続準拠を保証します。",
        links: [
          {
            text: "Compliance as Code",
            url: "https://www.infoq.com/articles/compliance-as-code/",
          },
          {
            text: "Continuous Compliance",
            url: "https://www.nri-secure.co.jp/blog/cis-controls-v8",
          },
        ],
      },
      en: {
        summary:
          "Compliance-as-Code with real-time monitoring ensures continuous adherence.",
        links: [
          {
            text: "Compliance as Code",
            url: "https://www.infoq.com/articles/compliance-as-code/",
          },
          {
            text: "Continuous Compliance",
            url: "https://www.cisecurity.org/controls/v8",
          },
        ],
      },
    },
    options: [
      { value: 0, label: { ja: "手動検証", en: "Manual validation" } },
      { value: 33, label: { ja: "一部自動化", en: "Partially automated" } },
      { value: 66, label: { ja: "包括的自動化", en: "Broad automation" } },
      {
        value: 100,
        label: {
          ja: "リアルタイム&証跡自動化",
          en: "Real-time & audit automation",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },

  {
    id: "sc_19",
    category: "security_compliance",
    text: {
      ja: "サービスディスカバリとサービスメッシュで通信を管理・保護・監視していますか？",
      en: "Do you use service discovery and service mesh to manage, protect, and observe service-to-service traffic?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_3", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "サービスディスカバリとメッシュは暗号化・認証・観測性を提供し、マイクロサービスの安全運用を支えます。",
        links: [
          {
            text: "Service Mesh Security",
            url: "https://istio.io/latest/docs/concepts/security/",
          },
          {
            text: "Service Discovery",
            url: "https://kubernetes.io/docs/concepts/services-networking/service/",
          },
        ],
      },
      en: {
        summary:
          "Service discovery and mesh provide encryption, auth, and observability for safe microservice communication.",
        links: [
          {
            text: "Service Mesh Security",
            url: "https://istio.io/latest/docs/concepts/security/",
          },
          {
            text: "Service Discovery",
            url: "https://kubernetes.io/docs/concepts/services-networking/service/",
          },
        ],
      },
    },
    options: [
      { value: 0, label: { ja: "未導入", en: "Not in place" } },
      { value: 33, label: { ja: "ディスカバリのみ", en: "Discovery only" } },
      {
        value: 66,
        label: { ja: "一部メッシュ導入", en: "Partial mesh adoption" },
      },
      {
        value: 100,
        label: {
          ja: "全面導入・統合管理",
          en: "Full mesh & integrated management",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },

  {
    id: "sc_21",
    category: "security_compliance",
    text: {
      ja: "CNIプラグイン・OPA・Falco等でネットワーク＆ランタイムセキュリティを適切に実施していますか？",
      en: "Do you leverage CNI plugins, OPA, Falco, etc., to enforce network and runtime security?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [{ questionId: "sc_3", minValue: 66 }],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "CNIポリシー、OPAによるAdmission制御、Falcoによるランタイム検知でコンテナネットワークを包括保護します。",
        links: [
          {
            text: "Calico Network Policy",
            url: "https://projectcalico.docs.tigera.io/security/calico-network-policy",
          },
          { text: "Falco Runtime Security", url: "https://falco.org/docs/" },
        ],
      },
      en: {
        summary:
          "Combine CNI policies, OPA admission control, and Falco runtime detection for comprehensive container-network protection.",
        links: [
          {
            text: "Calico Network Policy",
            url: "https://projectcalico.docs.tigera.io/security/calico-network-policy",
          },
          { text: "Falco Runtime Security", url: "https://falco.org/docs/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: { ja: "ネットワーク分離のみ", en: "Only basic isolation" },
      },
      {
        value: 33,
        label: {
          ja: "ポリシー導入だが監視不足",
          en: "Policies in place but limited monitoring",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要環境で高度対策",
          en: "Advanced controls in key envs",
        },
      },
      {
        value: 100,
        label: {
          ja: "全環境で包括ポリシー＆監視",
          en: "Comprehensive policies & monitoring everywhere",
        },
      },
      {
        value: -1,
        label: { ja: "わかりません", en: "I don't know" },
        isDontKnow: true,
        description: { ja: "詳しくない場合選択", en: "Choose if unfamiliar" },
      },
    ],
  },
];
