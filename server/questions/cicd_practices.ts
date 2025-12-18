/**
 * CI/CD実践質問モジュール
 *
 * 継続的インテグレーション・継続的デリバリー（CI/CD）プラクティスに関する質問を定義するモジュールです。
 * パイプライン自動化、テスト自動化、デプロイメント戦略などを評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const cicdPracticesQuestions: AssessmentQuestion[] = [
  // Base Questions (Always shown first)
  {
    id: "cicd_1",
    category: "cicd_practices",
    text: {
      ja: "CI/CDパイプラインの成熟度はどの程度ですか？",
      en: "What is the maturity level of your CI/CD pipeline?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
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
          "CI/CDパイプラインは、ソフトウェアのビルド、テスト、デプロイを自動化し、より迅速で信頼性の高いリリースを可能にします。",
        links: [
          {
            text: "CI/CDパイプラインの説明",
            url: "https://www.redhat.com/en/topics/devops/what-is-ci-cd",
          },
          {
            text: "CI/CDベストプラクティス",
            url: "https://www.jetbrains.com/teamcity/ci-cd-guide/ci-cd-best-practices//",
          },
        ],
      },
      en: {
        summary:
          "CI/CD pipelines automate the build, test, and deployment of software, enabling faster and more reliable releases.",
        links: [
          {
            text: "CI/CD Pipeline Explained",
            url: "https://www.redhat.com/en/topics/devops/what-is-ci-cd",
          },
          {
            text: "CI/CD Best Practices",
            url: "https://www.jetbrains.com/teamcity/ci-cd-guide/ci-cd-best-practices//",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "CI/CDパイプラインはほとんど実装されておらず、手動デプロイが主流",
          en: "CI/CD pipelines are barely implemented, with manual deployments predominant",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なCI/CDパイプラインは構築されているが、自動化の範囲が限定的で手動ステップも多い",
          en: "Basic CI/CD pipelines are built, but automation scope is limited with many manual steps",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なCI/CDパイプラインが主要なアプリケーションに実装され、テスト自動化やデプロイ自動化が広く採用されている",
          en: "Comprehensive CI/CD pipelines are implemented for key applications, with test and deployment automation widely adopted",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なCI/CDプラクティスが標準化され、全てのアプリケーションで完全自動化されたパイプライン、品質ゲート、セキュリティスキャン、自動ロールバックなどが実装されている",
          en: "Advanced CI/CD practices are standardized, with fully automated pipelines, quality gates, security scanning, and automatic rollbacks implemented for all applications",
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
    id: "cicd_2",
    category: "cicd_practices",
    text: {
      ja: "テスト自動化をどの程度採用していますか？",
      en: "To what extent have you adopted test automation?",
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
          "自動テストは、コードの品質を確保し、リグレッションを防ぎ、開発速度を向上させる重要な要素です。",
        links: [
          {
            text: "テスト自動化ピラミッド",
            url: "https://martinfowler.com/articles/practical-test-pyramid.html",
          },
          {
            text: "継続的テスト",
            url: "https://qiita.com/shinkai_/items/13e76a5641d9ec9a41d2",
          },
        ],
      },
      en: {
        summary:
          "Automated testing is a critical element in ensuring code quality, preventing regressions, and improving development velocity.",
        links: [
          {
            text: "Test Automation Pyramid",
            url: "https://martinfowler.com/articles/practical-test-pyramid.html",
          },
          {
            text: "Continuous Testing",
            url: "https://www.atlassian.com/continuous-delivery/software-testing",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "自動テストはほとんど実装されておらず、主に手動テストに依存している",
          en: "Automated testing is barely implemented, relying primarily on manual testing",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な単体テストは一部実装されているが、包括的なテスト戦略はない",
          en: "Basic unit tests are partially implemented, but there is no comprehensive testing strategy",
        },
      },
      {
        value: 66,
        label: {
          ja: "複数レベルのテスト（単体、統合、E2Eなど）が自動化され、主要なアプリケーションで実装されている",
          en: "Multiple levels of testing (unit, integration, E2E, etc.) are automated and implemented for key applications",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的なテスト自動化戦略が実装され、全てのレベルのテストが自動化され、テスト駆動開発やテストカバレッジ目標が標準化されている",
          en: "Comprehensive test automation strategy is implemented, with all levels of testing automated and test-driven development and test coverage goals standardized",
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
    id: "cicd_3",
    category: "cicd_practices",
    text: {
      ja: "GitOpsの採用はどの程度進んでいますか？",
      en: "To what extent have you adopted GitOps?",
    },
    weight: 1,
    maturityImportance: "medium",
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
          "GitOpsは、Gitリポジトリをシステムとインフラストラクチャの唯一の信頼できる情報源として使用する運用モデルです。これにより、変更の追跡性、監査能力、一貫性が向上します。",
        links: [
          { text: "GitOpsの原則", url: "https://www.gitops.tech/" },
          { text: "ArgoCD", url: "https://argo-cd.readthedocs.io/en/latest/" },
        ],
      },
      en: {
        summary:
          "GitOps is an operational model that uses Git repositories as the single source of truth for systems and infrastructure, improving traceability, auditability, and consistency of changes.",
        links: [
          { text: "GitOps Principles", url: "https://www.gitops.tech/" },
          { text: "ArgoCD", url: "https://argo-cd.readthedocs.io/en/latest/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "GitOpsアプローチは採用されておらず、従来の手動または部分的に自動化されたデプロイプロセスが使用されている",
          en: "GitOps approach is not adopted, using traditional manual or partially automated deployment processes",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のアプリケーションやインフラでGitOpsの原則が試験的に採用されているが、広範囲には至っていない",
          en: "GitOps principles are experimentally adopted for some applications or infrastructure, but not widely implemented",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なアプリケーションとインフラがGitOpsアプローチで管理され、宣言的な構成と自動同期が実装されている",
          en: "Key applications and infrastructure are managed with a GitOps approach, with declarative configuration and automatic synchronization implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "GitOpsが組織全体の標準アプローチとして確立され、全てのアプリケーションとインフラが宣言的に管理され、高度な自動化、検証、監査機能が実装されている",
          en: "GitOps is established as the standard approach organization-wide, with all applications and infrastructure managed declaratively and advanced automation, validation, and auditing capabilities implemented",
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
    id: "cicd_16",
    category: "cicd_practices",
    text: {
      ja: "ソースコードリポジトリへの変更をトリガーとして、コンテナイメージのビルド、自動テスト、ステージング環境へのデプロイまでを自動で行うCI/CDパイプラインが整備されていますか？また、自動化されたロールアウトやロールバックの仕組みも導入されていますか？",
      en: "Do you have CI/CD pipelines in place that automatically build container images, run automated tests, and deploy to staging environments triggered by changes to the source code repository? Have you also implemented automated rollout and rollback mechanisms?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
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
          "完全に自動化されたCI/CDパイプラインにより、開発からデプロイまでのプロセスが迅速かつ一貫して行われ、人為的ミスも減少します。",
        links: [
          { text: "継続的デリバリー", url: "https://continuousdelivery.com/" },
          {
            text: "デプロイメント自動化",
            url: "https://cloud.google.com/deploy/docs/automation?hl=ja",
          },
        ],
      },
      en: {
        summary:
          "Fully automated CI/CD pipelines ensure that processes from development to deployment are rapid and consistent, while reducing human error.",
        links: [
          {
            text: "Continuous Delivery",
            url: "https://continuousdelivery.com/",
          },
          {
            text: "Deployment Automation",
            url: "https://cloud.google.com/deploy/docs/automation?hl=en",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "CI/CDパイプラインは導入されておらず、ビルドやデプロイは手動で行われている",
          en: "CI/CD pipelines are not implemented, with builds and deployments performed manually",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なCI/CDパイプラインが整備され、ビルドと一部のテストは自動化されているが、デプロイは手動で行われている",
          en: "Basic CI/CD pipelines are established, with automated builds and some tests, but deployments are performed manually",
        },
      },
      {
        value: 66,
        label: {
          ja: "完全なCI/CDパイプラインが整備され、ビルド、テスト、ステージング環境へのデプロイまでが自動化されているが、本番環境へのデプロイは手動承認が必要",
          en: "Complete CI/CD pipelines are established, with builds, tests, and deployments to staging environments automated, but production deployments require manual approval",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なCI/CDパイプラインが整備され、全環境へのデプロイが自動化されており、カナリアリリースやブルー/グリーンデプロイメントによる安全なロールアウトと自動ロールバック機能が実装されている",
          en: "Advanced CI/CD pipelines are established, with deployments to all environments automated and safe rollouts with canary releases or blue/green deployments and automatic rollback functionality implemented",
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
    id: "cicd_4",
    category: "cicd_practices",
    text: {
      ja: "プログレッシブデリバリー戦略をどのように実装していますか？",
      en: "How do you implement progressive delivery strategies?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "quick",
    dependencies: [
      { questionId: "cicd_16", minValue: 33 }, // Only show if cicd_16 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "プログレッシブデリバリーでは、カナリアリリース、ブルー/グリーンデプロイメント、フィーチャーフラグなどの技術を使用して、リスクを最小限に抑えながら段階的に変更をリリースします。",
        links: [
          {
            text: "プログレッシブデリバリー",
            url: "https://zenn.dev/cloud_ace/articles/gitlab-gcp-cicd",
          },
          {
            text: "フィーチャーフラグ",
            url: "https://martinfowler.com/articles/feature-toggles.html",
          },
        ],
      },
      en: {
        summary:
          "Progressive delivery uses techniques like canary releases, blue/green deployments, and feature flags to release changes gradually while minimizing risk.",
        links: [
          {
            text: "Progressive Delivery",
            url: "https://www.harness.io/blog/blue-green-canary-deployment-strategies",
          },
          {
            text: "Feature Flags",
            url: "https://martinfowler.com/articles/feature-toggles.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "プログレッシブデリバリー戦略（カナリアリリース、ブルー/グリーンデプロイメントなど）は実装されていない",
          en: "Progressive delivery strategies (canary releases, blue/green deployments, etc.) are not implemented",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の重要なアプリケーションで基本的なプログレッシブデリバリー技術が試験的に採用されている",
          en: "Basic progressive delivery techniques are experimentally adopted for some critical applications",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なアプリケーションでプログレッシブデリバリー戦略が標準的に採用され、リスク軽減に貢献している",
          en: "Progressive delivery strategies are standardly adopted for key applications, contributing to risk reduction",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なプログレッシブデリバリー戦略が組織全体で標準化され、自動化された機能フラグ、トラフィック制御、ロールバックトリガーなどが完全に実装されている",
          en: "Advanced progressive delivery strategies are standardized organization-wide, with automated feature flags, traffic control, and rollback triggers fully implemented",
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
    id: "cicd_5",
    category: "cicd_practices",
    text: {
      ja: "CI/CDパイプラインでのデプロイメントの安全性をどのように確保していますか？",
      en: "How do you ensure deployment safety in your CI/CD pipelines?",
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
      { questionId: "cicd_1", minValue: 33 }, // Only show if cicd_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "安全なデプロイメントは、適切な承認プロセス、自動検証、ヘルスチェック、ロールバック機能など、複数の安全メカニズムによって確保されます。",
        links: [
          {
            text: "デプロイメントの安全性",
            url: "https://cloud.google.com/deploy/docs/automation",
          },
          {
            text: "CI/CDセキュリティ",
            url: "https://owasp.org/www-project-devsecops-guideline//",
          },
        ],
      },
      en: {
        summary:
          "Safe deployments are ensured by multiple safety mechanisms, including appropriate approval processes, automated validation, health checks, and rollback capabilities.",
        links: [
          {
            text: "Deployment Safety",
            url: "https://cloud.google.com/deploy/docs/automation",
          },
          {
            text: "CI/CD Security",
            url: "https://owasp.org/www-project-devsecops-guideline//",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "デプロイメントの安全性に特化した対策はほとんど実施されていない",
          en: "Few specialized measures for deployment safety are implemented",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な手動承認ステップや簡易的なロールバック手順が実装されている",
          en: "Basic manual approval steps and simple rollback procedures are implemented",
        },
      },
      {
        value: 66,
        label: {
          ja: "自動テスト、品質ゲート、標準化されたロールバック手順などによりデプロイメントの安全性が確保されている",
          en: "Deployment safety is ensured through automated tests, quality gates, and standardized rollback procedures",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデプロイメント安全戦略が実装され、自動検証、カナリアアナリシス、自動ロールバック、事前/事後デプロイメントチェックなどが標準化されている",
          en: "Advanced deployment safety strategies are implemented, with automated validation, canary analysis, automatic rollback, and pre/post-deployment checks standardized",
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
    id: "cicd_6",
    category: "cicd_practices",
    text: {
      ja: "継続的インテグレーションのプラクティスをどの程度採用していますか？",
      en: "To what extent have you adopted continuous integration practices?",
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
      { questionId: "cicd_1", minValue: 33 }, // Only show if cicd_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "継続的インテグレーション（CI）は、開発者がコードを頻繁にメインブランチにマージし、自動ビルドとテストを実行することで、早期に問題を発見し修正するプラクティスです。",
        links: [
          {
            text: "継続的インテグレーション",
            url: "https://martinfowler.com/articles/continuousIntegration.html",
          },
          {
            text: "CIベストプラクティス",
            url: "https://thoughtworks.com/insights/practices/continuous-integration",
          },
        ],
      },
      en: {
        summary:
          "Continuous Integration (CI) is a practice where developers frequently merge code into the main branch, running automated builds and tests to discover and fix issues early.",
        links: [
          {
            text: "Continuous Integration",
            url: "https://martinfowler.com/articles/continuousIntegration.html",
          },
          {
            text: "CI Best Practices",
            url: "https://thoughtworks.com/insights/practices/continuous-integration",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "継続的インテグレーションはほとんど実践されておらず、長期的なフィーチャーブランチや大規模なマージが一般的",
          en: "Continuous integration is barely practiced, with long-lived feature branches and large merges common",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のチームが継続的インテグレーションを実践し、基本的な自動ビルドとテストを実装しているが、組織全体での採用は限定的",
          en: "Some teams practice continuous integration, implementing basic automated builds and tests, but organization-wide adoption is limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "ほとんどのチームが継続的インテグレーションを実践し、頻繁なコミット、トランクベース開発、自動ビルド/テストが標準化されている",
          en: "Most teams practice continuous integration, with frequent commits, trunk-based development, and automated builds/tests standardized",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度な継続的インテグレーションが組織全体で実践され、トランクベース開発、事前コミット検証、高速フィードバックループが完全に標準化されている",
          en: "Advanced continuous integration is practiced organization-wide, with trunk-based development, pre-commit validation, and fast feedback loops fully standardized",
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
    id: "cicd_7",
    category: "cicd_practices",
    text: {
      ja: "Infrastructure as Code (IaC)とCI/CDをどのように統合していますか？",
      en: "How do you integrate Infrastructure as Code (IaC) with CI/CD?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "low",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "standard",
    dependencies: [
      { questionId: "cicd_1", minValue: 33 }, // Only show if cicd_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "Infrastructure as Code（IaC）とCI/CDの統合により、インフラストラクチャの変更も自動化されたパイプラインを通じて検証、適用することができます。",
        links: [
          {
            text: "IaCとCI/CD",
            url: "https://developer.hashicorp.com/terraform/tutorials/automation/automate-terraform",
          },
          {
            text: "Terraform CI/CD",
            url: "https://developer.hashicorp.com/terraform/tutorials/automation/automate-terraform",
          },
        ],
      },
      en: {
        summary:
          "Integrating Infrastructure as Code (IaC) with CI/CD allows infrastructure changes to be validated and applied through automated pipelines.",
        links: [
          {
            text: "IaC and CI/CD",
            url: "https://developer.hashicorp.com/terraform/tutorials/automation/automate-terraform",
          },
          {
            text: "Terraform CI/CD",
            url: "https://developer.hashicorp.com/terraform/tutorials/automation/automate-terraform",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "IaCとCI/CDの統合はほとんど行われておらず、インフラ変更は手動で適用されている",
          en: "Integration of IaC with CI/CD is minimal, with infrastructure changes applied manually",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なIaCファイルがバージョン管理されているが、パイプラインを通じた自動検証や適用は限定的",
          en: "Basic IaC files are version controlled, but automated validation and application through pipelines is limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なインフラコンポーネントはIaCとして管理され、CI/CDパイプラインによる検証とデプロイが実装されている",
          en: "Key infrastructure components are managed as IaC, with validation and deployment through CI/CD pipelines implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "すべてのインフラストラクチャがIaCとして管理され、CI/CDパイプラインを通じて完全に自動化された検証、テスト、デプロイが実装されている",
          en: "All infrastructure is managed as IaC, with fully automated validation, testing, and deployment through CI/CD pipelines implemented",
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
    id: "cicd_8",
    category: "cicd_practices",
    text: {
      ja: "CI/CDパイプラインでのセキュリティとコンプライアンスの統合はどの程度進んでいますか？",
      en: "To what extent is security and compliance integrated into your CI/CD pipelines?",
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
      { questionId: "cicd_1", minValue: 66 }, // Only show if cicd_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "DevSecOpsの原則に従い、セキュリティとコンプライアンスのチェックをパイプラインに組み込むことで、早期に問題を発見し、安全なソフトウェアデリバリーを実現します。",
        links: [
          {
            text: "DevSecOps",
            url: "https://www.redhat.com/en/topics/devops/what-is-devsecops",
          },
          {
            text: "パイプラインセキュリティ",
            url: "https://owasp.org/www-project-devsecops-guideline//",
          },
        ],
      },
      en: {
        summary:
          "Following DevSecOps principles, integrating security and compliance checks into pipelines enables early problem detection and secure software delivery.",
        links: [
          {
            text: "DevSecOps",
            url: "https://www.redhat.com/en/topics/devops/what-is-devsecops",
          },
          {
            text: "Pipeline Security",
            url: "https://owasp.org/www-project-devsecops-guideline//",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "セキュリティおよびコンプライアンスチェックはパイプラインに統合されておらず、別のプロセスとして実施されている",
          en: "Security and compliance checks are not integrated into pipelines, but conducted as separate processes",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なセキュリティスキャンやコンプライアンスチェックが一部のパイプラインに組み込まれているが、包括的な統合には至っていない",
          en: "Basic security scans and compliance checks are incorporated into some pipelines, but comprehensive integration is not achieved",
        },
      },
      {
        value: 66,
        label: {
          ja: "静的/動的セキュリティテスト、コンプライアンスチェック、脆弱性スキャンなどが主要なパイプラインに組み込まれている",
          en: "Static/dynamic security tests, compliance checks, and vulnerability scans are incorporated into key pipelines",
        },
      },
      {
        value: 100,
        label: {
          ja: "完全なDevSecOpsアプローチが採用され、包括的なセキュリティ/コンプライアンステスト、ポリシーチェック、自動修復機能などがすべてのパイプラインに標準として組み込まれている",
          en: "Complete DevSecOps approach is adopted, with comprehensive security/compliance tests, policy checks, and automatic remediation features integrated as standard in all pipelines",
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
    id: "cicd_9",
    category: "cicd_practices",
    text: {
      ja: "CI/CDパイプラインのパフォーマンスと効率性をどのように最適化していますか？",
      en: "How do you optimize the performance and efficiency of your CI/CD pipelines?",
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
      { questionId: "cicd_1", minValue: 66 }, // Only show if cicd_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効率的なCI/CDパイプラインにより、フィードバックループが短縮され、開発者の生産性が向上します。キャッシング、並列処理、テスト分割などの技術がパフォーマンスの向上に貢献します。",
        links: [
          {
            text: "CI/CDパイプライン最適化",
            url: "https://qiita.com/tarian/items/1d0882de6a02714a2ff1",
          },
          {
            text: "高速フィードバック",
            url: "https://martinfowler.com/articles/developer-effectiveness.html#fast-feedback",
          },
        ],
      },
      en: {
        summary:
          "Efficient CI/CD pipelines shorten feedback loops and improve developer productivity. Techniques like caching, parallel processing, and test splitting contribute to performance improvements.",
        links: [
          {
            text: "CI/CD Pipeline Optimization",
            url: "https://www.microtica.com/blog/optimize-your-ci-cd-pipeline-for-faster-deployments",
          },
          {
            text: "Fast Feedback",
            url: "https://martinfowler.com/articles/developer-effectiveness.html#fast-feedback",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "CI/CDパイプラインの最適化はほとんど行われておらず、実行時間が長く非効率的",
          en: "CI/CD pipeline optimization is minimal, with long execution times and inefficiency",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な最適化（キャッシングなど）が一部実装されているが、実行時間や効率性に課題が残る",
          en: "Basic optimizations (like caching) are partially implemented, but challenges remain with execution time and efficiency",
        },
      },
      {
        value: 66,
        label: {
          ja: "パイプラインの多くは最適化され、並列処理、効率的なテスト戦略、キャッシングなどが実装されている",
          en: "Most pipelines are optimized, with parallel processing, efficient test strategies, and caching implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に最適化されたパイプラインが標準となり、テスト分割、インテリジェントテスト実行、高度なキャッシング戦略などにより迅速なフィードバックループが実現されている",
          en: "Highly optimized pipelines are standard, with test splitting, intelligent test execution, and advanced caching strategies enabling rapid feedback loops",
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
    id: "cicd_10",
    category: "cicd_practices",
    text: {
      ja: "ポリシーと品質ゲートはCI/CDパイプラインにどのように実装されていますか？",
      en: "How are policies and quality gates implemented in your CI/CD pipelines?",
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
      { questionId: "cicd_1", minValue: 66 }, // Only show if cicd_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "品質ゲートとポリシーチェックにより、一定の品質基準を満たさないコードが本番環境に到達することを防ぎます。これには、コード品質、テストカバレッジ、セキュリティ要件などが含まれます。",
        links: [
          {
            text: "品質ゲート",
            url: "https://docs.sonarsource.com/sonarqube-server/latest/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates//",
          },
          { text: "Policy as Code", url: "https://www.openpolicyagent.org/" },
        ],
      },
      en: {
        summary:
          "Quality gates and policy checks prevent code that doesn't meet certain quality standards from reaching production environments. This includes code quality, test coverage, and security requirements.",
        links: [
          {
            text: "Quality Gates",
            url: "https://docs.sonarsource.com/sonarqube-server/latest/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates//",
          },
          { text: "Policy as Code", url: "https://www.openpolicyagent.org/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "ポリシーや品質ゲートはパイプラインに組み込まれておらず、品質保証は主に手動レビューに依存している",
          en: "Policies and quality gates are not incorporated into pipelines, with quality assurance primarily dependent on manual reviews",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なコード品質チェックやテストカバレッジなどの単純な品質ゲートが一部実装されている",
          en: "Simple quality gates like basic code quality checks and test coverage are partially implemented",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的な品質ゲートとポリシーチェック（コード品質、テストカバレッジ、セキュリティ、パフォーマンスなど）が主要なパイプラインに実装されている",
          en: "Comprehensive quality gates and policy checks (code quality, test coverage, security, performance, etc.) are implemented in key pipelines",
        },
      },
      {
        value: 100,
        label: {
          ja: "Policy as Codeアプローチが採用され、高度な品質ゲートとポリシー強制が全パイプラインに標準として組み込まれ、例外管理や承認プロセスも体系化されている",
          en: "Policy as Code approach is adopted, with advanced quality gates and policy enforcement incorporated as standard in all pipelines, and exception management and approval processes systematized",
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
    id: "cicd_11",
    category: "cicd_practices",
    text: {
      ja: "環境管理とCI/CDの統合はどの程度進んでいますか？",
      en: "To what extent is environment management integrated with CI/CD?",
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
      { questionId: "cicd_1", minValue: 66 }, // Only show if cicd_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的な環境管理とCI/CDの統合により、環境の一貫性が確保され、「私の環境では動作する」問題が軽減されます。これには、環境のオンデマンド作成、テスト環境の自動プロビジョニングなどが含まれます。",
        links: [
          {
            text: "環境管理",
            url: "https://zenn.dev/tech4anyone/articles/d58d1690973fbd",
          },
          {
            text: "エフェメラル環境",
            url: "https://zenn.dev/takuyanagai0213/articles/8eaaf4cf0db866",
          },
        ],
      },
      en: {
        summary:
          "Effective environment management integration with CI/CD ensures environment consistency and reduces 'works in my environment' issues. This includes on-demand environment creation and automated test environment provisioning.",
        links: [
          {
            text: "Environment Management",
            url: "https://learn.microsoft.com/en-us/devops/operate/governance-cicd",
          },
          {
            text: "Ephemeral Environments",
            url: "https://daily.dev/blog/ultimate-guide-to-cicd-monitoring-metrics",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "環境管理とCI/CDの統合はほとんど行われておらず、環境は手動で管理されている",
          en: "Environment management integration with CI/CD is minimal, with environments managed manually",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な環境管理の自動化（構成管理ツールの使用など）が一部実装されているが、CI/CDとの統合は限定的",
          en: "Basic environment management automation (like using configuration management tools) is partially implemented, but integration with CI/CD is limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要な環境は自動化され、CI/CDパイプラインと統合されており、環境のプロビジョニングやテスト環境の作成が自動化されている",
          en: "Key environments are automated and integrated with CI/CD pipelines, with environment provisioning and test environment creation automated",
        },
      },
      {
        value: 100,
        label: {
          ja: "完全に自動化された環境管理が実現され、エフェメラル環境、環境パリティ、Infrastructure as Codeによる環境定義などがCI/CDと完全に統合されている",
          en: "Fully automated environment management is achieved, with ephemeral environments, environment parity, and environment definition through Infrastructure as Code fully integrated with CI/CD",
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
    id: "cicd_12",
    category: "cicd_practices",
    text: {
      ja: "CI/CDに関するメトリクスとモニタリングをどのように実装していますか？",
      en: "How do you implement metrics and monitoring for CI/CD?",
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
      { questionId: "cicd_1", minValue: 66 }, // Only show if cicd_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "CI/CDパイプラインのメトリクスとモニタリングにより、デリバリープロセスの健全性と効率性を継続的に評価し、改善することが可能になります。",
        links: [
          {
            text: "CI/CDメトリクス",
            url: "https://zenn.dev/cloud_ace/articles/1d8b7e7fecff92",
          },
          {
            text: "DORAメトリクス",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
        ],
      },
      en: {
        summary:
          "Metrics and monitoring for CI/CD pipelines enable continuous evaluation and improvement of delivery process health and efficiency.",
        links: [
          {
            text: "CI/CD Metrics",
            url: "https://jetbrains.com/help/teamcity/devops-ci-cd-metrics.html",
          },
          {
            text: "DORA Metrics",
            url: "https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "CI/CDに関するメトリクスやモニタリングはほとんど実装されておらず、パフォーマンスデータは収集されていない",
          en: "Metrics and monitoring for CI/CD are barely implemented, with performance data not collected",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なパイプライン実行時間や成功率などの単純なメトリクスは収集されているが、包括的な分析や可視化は限定的",
          en: "Simple metrics like basic pipeline execution time and success rate are collected, but comprehensive analysis and visualization are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なCI/CDメトリクス（ビルド時間、テスト成功率、デプロイ頻度など）が収集・可視化され、パイプラインの健全性監視に活用されている",
          en: "Key CI/CD metrics (build time, test success rate, deployment frequency, etc.) are collected and visualized, utilized for pipeline health monitoring",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なCI/CDメトリクスとモニタリングが実装され、DORAメトリクス、詳細なパフォーマンス分析、傾向把握、予測分析などが標準化され、継続的改善に活用されている",
          en: "Advanced CI/CD metrics and monitoring are implemented, with DORA metrics, detailed performance analysis, trend identification, and predictive analytics standardized and utilized for continuous improvement",
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
    id: "cicd_13",
    category: "cicd_practices",
    text: {
      ja: "開発者エクスペリエンス（DevEx）の視点からCI/CDツールとプロセスをどのように最適化していますか？",
      en: "How do you optimize CI/CD tools and processes from a developer experience (DevEx) perspective?",
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
      { questionId: "cicd_1", minValue: 66 }, // Only show if cicd_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "優れた開発者エクスペリエンス（DevEx）により、開発者の生産性と満足度が向上します。CI/CDツールとプロセスの使いやすさ、ローカル開発環境との統合、迅速なフィードバックなどが重要です。",
        links: [
          {
            text: "開発者エクスペリエンス",
            url: "https://martinfowler.com/articles/developer-effectiveness.html",
          },
          {
            text: "CI/CDにおけるDevEx",
            url: "https://zenn.dev/yyykms123/articles/2021-05-17-ci-cd",
          },
        ],
      },
      en: {
        summary:
          "Excellent developer experience (DevEx) improves developer productivity and satisfaction. Usability of CI/CD tools and processes, integration with local development environments, and rapid feedback are important.",
        links: [
          {
            text: "Developer Experience",
            url: "https://martinfowler.com/articles/developer-effectiveness.html",
          },
          {
            text: "DevEx in CI/CD",
            url: "https://zenn.dev/yyykms123/articles/2021-05-17-ci-cd",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "開発者エクスペリエンスの観点からのCI/CDの最適化はほとんど行われておらず、複雑で使いにくいツールやプロセスが存在する",
          en: "Optimization of CI/CD from a developer experience perspective is minimal, with complex and difficult-to-use tools and processes",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な開発者向けドキュメントや標準化されたツールは提供されているが、包括的なDevEx戦略はない",
          en: "Basic developer documentation and standardized tools are provided, but there is no comprehensive DevEx strategy",
        },
      },
      {
        value: 66,
        label: {
          ja: "開発者エクスペリエンスを考慮したCI/CDツールとプロセスが整備され、セルフサービス機能、迅速なフィードバック、ローカル開発環境との統合などが実装されている",
          en: "CI/CD tools and processes considering developer experience are established, with self-service features, rapid feedback, and integration with local development environments implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "開発者エクスペリエンスを最優先したCI/CDエコシステムが確立され、高度なセルフサービスプラットフォーム、開発者ポータル、インナーループ最適化などにより卓越した使いやすさと効率性が実現されている",
          en: "CI/CD ecosystem prioritizing developer experience is established, with advanced self-service platforms, developer portals, and inner loop optimizations enabling excellent usability and efficiency",
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
    id: "cicd_14",
    category: "cicd_practices",
    text: {
      ja: "組織全体でのCI/CDのガバナンスと標準化はどの程度確立されていますか？",
      en: "To what extent are CI/CD governance and standardization established across the organization?",
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
      { questionId: "cicd_1", minValue: 66 }, // Only show if cicd_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なCI/CDガバナンスと標準化により、ベストプラクティスの共有、一貫性の確保、重複の回避、リソースの効率的な活用が可能になります。",
        links: [
          {
            text: "CI/CDガバナンス",
            url: "https://qiita.com/mstakaha1113/items/f9fad71b8bd33e77d9ce",
          },
          {
            text: "パイプライン標準化",
            url: "https://harness.io/blog/continuous-delivery/standardizing-ci-cd",
          },
        ],
      },
      en: {
        summary:
          "Effective CI/CD governance and standardization enable sharing of best practices, ensuring consistency, avoiding duplication, and efficient resource utilization.",
        links: [
          {
            text: "CI/CD Governance",
            url: "https://github.blog/changelog/2023-01-09-github-actions-support-for-organization-wide-required-workflows-public-beta/",
          },
          {
            text: "Pipeline Standardization",
            url: "https://codefresh.io/learn/harness-io/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "CI/CDのガバナンスや標準化はほとんど行われておらず、各チームが独自のアプローチを採用している",
          en: "CI/CD governance and standardization are minimal, with each team adopting their own approach",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なガイドラインや推奨プラクティスは存在するが、組織全体での一貫した採用や実施は限定的",
          en: "Basic guidelines and recommended practices exist, but consistent adoption and implementation across the organization are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "標準化されたCI/CDパイプラインテンプレート、共有ライブラリ、ガバナンスプロセスが確立され、多くのチームで採用されている",
          en: "Standardized CI/CD pipeline templates, shared libraries, and governance processes are established and adopted by many teams",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的なCI/CDガバナンスフレームワークが確立され、共有プラットフォーム、内部開発者ポータル、セルフサービスカタログ、自動化された標準遵守チェックなどが組織全体で実装されている",
          en: "Comprehensive CI/CD governance framework is established, with shared platforms, internal developer portals, self-service catalogs, and automated standard compliance checks implemented organization-wide",
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
    id: "cicd_15",
    category: "cicd_practices",
    text: {
      ja: "データベースの変更やマイグレーションをCI/CDパイプラインにどのように統合していますか？",
      en: "How do you integrate database changes and migrations into CI/CD pipelines?",
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
      { questionId: "cicd_1", minValue: 66 }, // Only show if cicd_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "データベース変更を CI/CD パイプラインに統合することで、アプリケーションコードとデータベーススキーマの一貫性を保ち、リスクを軽減することができます。",
        links: [
          {
            text: "データベースCI/CD",
            url: "https://octopus.com/blog/database-deployment-automation-approaches",
          },
          {
            text: "スキーママイグレーション",
            url: "https://martinfowler.com/articles/evodb.html",
          },
        ],
      },
      en: {
        summary:
          "Integrating database changes into CI/CD pipelines maintains consistency between application code and database schemas, reducing risk.",
        links: [
          {
            text: "Database CI/CD",
            url: "https://octopus.com/blog/database-deployment-automation-approaches",
          },
          {
            text: "Schema Migrations",
            url: "https://martinfowler.com/articles/evodb.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データベースの変更は手動で管理・適用され、CI/CDパイプラインとの統合はほとんどない",
          en: "Database changes are managed and applied manually, with minimal integration with CI/CD pipelines",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なデータベースマイグレーションスクリプトはバージョン管理されているが、CI/CDパイプラインでの自動テストや適用は限定的",
          en: "Basic database migration scripts are version controlled, but automated testing and application in CI/CD pipelines are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "データベースの変更管理ツール（Flyway、Liquibaseなど）が導入され、主要なアプリケーションではデータベース変更がCI/CDパイプラインに統合されている",
          en: "Database change management tools (Flyway, Liquibase, etc.) are implemented, with database changes integrated into CI/CD pipelines for key applications",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデータベースCI/CD統合が実装され、マイグレーションの自動テスト、スキーマ検証、ロールバック戦略、状態ベースと移行ベースのアプローチの適切な組み合わせなどが標準化されている",
          en: "Advanced database CI/CD integration is implemented, with migration automated testing, schema validation, rollback strategies, and appropriate combinations of state-based and migration-based approaches standardized",
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
