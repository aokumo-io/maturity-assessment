/**
 * 基礎文化質問モジュール
 *
 * クラウドネイティブの基礎と文化に関する質問を定義するモジュールです。
 * チーム構造、エンジニアリング文化、リーダーシップのサポートなどの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const foundationsCultureQuestions: AssessmentQuestion[] = [
  {
    id: "fc_1",
    category: "foundations_culture",
    text: {
      ja: "組織のクラウドネイティブワークロードのためのチーム構造はどのように構成されていますか？",
      en: "How is your team structure organized for cloud native workloads?",
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
          "クラウドネイティブチームは通常、製品中心の分野横断的なチーム構造で、デリバリー能力を向上させます。",
        links: [
          { text: "Team Topologies", url: "https://teamtopologies.com/" },
          {
            text: "CNCF Cloud Native Definition",
            url: "https://github.com/cncf/toc/blob/main/DEFINITION.md",
          },
        ],
      },
      en: {
        summary:
          "Cloud native teams typically operate with a product-centric, cross-functional team structure to enhance delivery capabilities.",
        links: [
          { text: "Team Topologies", url: "https://teamtopologies.com/" },
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
          ja: "伝統的なサイロ化されたチーム（開発、運用、セキュリティなど）",
          en: "Traditional siloed teams (development, operations, security, etc.)",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のクロスファンクショナルなコラボレーションがありますが、まだ大部分はサイロ化されています",
          en: "Some cross-functional collaboration but still mostly siloed",
        },
      },
      {
        value: 66,
        label: {
          ja: "複数のクロスファンクショナルチームがありますが、一貫性のないプラクティス",
          en: "Multiple cross-functional teams but inconsistent practices",
        },
      },
      {
        value: 100,
        label: {
          ja: "共有責任を持つ完全なクロスファンクショナルプロダクトチーム",
          en: "Fully cross-functional product teams with shared responsibility",
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
    id: "fc_2",
    category: "foundations_culture",
    text: {
      ja: "知識共有とエンジニアリング文化はどのように扱われていますか？",
      en: "How is knowledge sharing and engineering culture handled in your organization?",
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
          "効果的な知識共有文化は、イノベーションの促進、オンボーディング時間の短縮、技術的負債の削減に役立ちます。",
        links: [
          {
            text: "DevOps Handbook",
            url: "https://itrevolution.com/product/the-devops-handbook/",
          },
          { text: "DORA Research 2024", url: "https://dora.dev/research/2024/dora-report?hl=ja" },
        ],
      },
      en: {
        summary:
          "An effective knowledge sharing culture helps foster innovation, reduce onboarding time, and minimize technical debt.",
        links: [
          {
            text: "DevOps Handbook",
            url: "https://itrevolution.com/product/the-devops-handbook/",
          },
          { text: "DORA Research 2024", url: "https://dora.dev/research/2024/dora-report/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的な知識共有の取り組みがなく、必要に応じた個人間の伝達に依存している",
          en: "No systematic knowledge sharing initiatives, relying on ad-hoc person-to-person transfer",
        },
      },
      {
        value: 33,
        label: {
          ja: "ドキュメントやチームミーティングによる基本的な知識共有が行われているが、一貫性や包括性に欠ける",
          en: "Basic knowledge sharing through documentation and team meetings, but lacking consistency or comprehensiveness",
        },
      },
      {
        value: 66,
        label: {
          ja: "定期的な技術共有会、内部Wiki、コミュニティ・オブ・プラクティスなどの仕組みが確立され、活発に活用されている",
          en: "Established mechanisms like regular tech sharing sessions, internal wikis, and communities of practice actively utilized",
        },
      },
      {
        value: 100,
        label: {
          ja: "知識共有が組織文化として定着し、イノベーションショーケース、ハッカソン、内部トレーニングプログラム、メンタリングなど複数の取り組みが統合的に機能している",
          en: "Knowledge sharing embedded in organizational culture with multiple integrated initiatives like innovation showcases, hackathons, internal training programs, and mentoring",
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
    id: "fc_3",
    category: "foundations_culture",
    text: {
      ja: "クラウドネイティブ変革への経営層のサポートはどのように評価されますか？",
      en: "How would you assess leadership support for cloud native transformation?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "low",
    },
    assessmentType: "quick",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "経営層の明確なサポートと理解は、クラウドネイティブ変革の成功に不可欠です。変革は単なる技術的変更ではなく、組織全体のアプローチとしてとらえる必要があります。",
        links: [
          {
            text: "State of DevOps Report 2024",
            url: "https://dora.dev/research/2024/dora-report?hl=ja",
          },
          {
            text: "McKinsey - Cloud's trillion-dollar prize",
            url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/clouds-trillion-dollar-prize-is-up-for-grabs",
          },
        ],
      },
      en: {
        summary:
          "Clear leadership support and understanding is crucial for successful cloud native transformation. Transformation must be viewed as an organizational approach rather than just a technical change.",
        links: [
          {
            text: "State of DevOps Report 2024",
            url: "https://dora.dev/research/2024/dora-report/",
          },
          {
            text: "McKinsey - Cloud's trillion-dollar prize",
            url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/clouds-trillion-dollar-prize-is-up-for-grabs",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "経営層のクラウドネイティブに対する理解が限定的で、明確な支援や投資がない",
          en: "Limited executive understanding of cloud native with no clear support or investment",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の経営層がクラウドネイティブの価値を認識し、限定的なリソースや予算を割り当てている",
          en: "Some executives recognize the value of cloud native and allocate limited resources or budget",
        },
      },
      {
        value: 66,
        label: {
          ja: "経営層がクラウドネイティブを戦略的優先事項と位置づけ、必要なリソースと支援を提供している",
          en: "Leadership considers cloud native a strategic priority and provides necessary resources and support",
        },
      },
      {
        value: 100,
        label: {
          ja: "経営層がクラウドネイティブ変革を強力に推進し、必要な組織変更を支援し、長期的なビジョンと投資計画を持っている",
          en: "Leadership strongly champions cloud native transformation, supports necessary organizational changes, and maintains a long-term vision with investment plans",
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
    id: "fc_4",
    category: "foundations_culture",
    text: {
      ja: "クラウドネイティブチームの運用モデルとプラクティスはどの程度確立されていますか？",
      en: "To what extent are cloud native team operating models and practices established?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "quick",
    baseQuestion: true,
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なクラウドネイティブ運用モデルには、明確な責任分担、自律性の高いチーム、製品志向のアプローチが含まれます。",
        links: [
          { text: "Team Topologies", url: "https://teamtopologies.com/" },
          {
            text: "Site Reliability Engineering Book",
            url: "https://sre.google/sre-book/table-of-contents/",
          },
        ],
      },
      en: {
        summary:
          "Effective cloud native operating models include clear responsibility allocation, highly autonomous teams, and product-oriented approaches.",
        links: [
          { text: "Team Topologies", url: "https://teamtopologies.com/" },
          {
            text: "Site Reliability Engineering Book",
            url: "https://sre.google/sre-book/table-of-contents/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "明確なクラウドネイティブ運用モデルはなく、従来のITサービス管理（ITSM）プロセスに依存している",
          en: "No clear cloud native operating model, relying on traditional IT Service Management (ITSM) processes",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のチームが「You Build It, You Run It」の原則や製品チームモデルを試験的に採用しているが、組織全体には広がっていない",
          en: "Some teams have piloted 'You Build It, You Run It' principles or product team models, but these haven't spread across the organization",
        },
      },
      {
        value: 66,
        label: {
          ja: "製品チームモデル、プラットフォームチーム、SREプラクティスなどが採用され、明確な責任分担が確立されているが、最適化の余地がある",
          en: "Product team models, platform teams, and SRE practices have been adopted with clear responsibility allocation, but there's room for optimization",
        },
      },
      {
        value: 100,
        label: {
          ja: "製品志向の運用モデルが完全に確立され、自己サービス型プラットフォーム、内部開発者エクスペリエンス（DevEx）チーム、明確なフィードバックループが整備されている",
          en: "Product-oriented operating model fully established with self-service platforms, internal developer experience (DevEx) teams, and clear feedback loops",
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
    id: "fc_5",
    category: "foundations_culture",
    text: {
      ja: "クラウドネイティブスキル開発プログラムはどの程度成熟していますか？",
      en: "How mature is your cloud native skills development program?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドネイティブの成功には、継続的なスキル開発と学習文化が不可欠です。技術の急速な進化に対応するには、組織的な学習プログラムが必要です。",
        links: [
          {
            text: "CNCF Training & Certification",
            url: "https://www.cncf.io/certification/training/",
          },
          {
            text: "DevOps Capability Assessment",
            url: "https://www.devops-research.com/quickcheck.html",
          },
        ],
      },
      en: {
        summary:
          "Cloud native success requires continuous skills development and a learning culture. Organizational learning programs are essential to keep pace with rapidly evolving technologies.",
        links: [
          {
            text: "CNCF Training & Certification",
            url: "https://www.cncf.io/certification/training/",
          },
          {
            text: "DevOps Capability Assessment",
            url: "https://www.devops-research.com/quickcheck.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "公式なクラウドネイティブスキル開発プログラムが存在せず、個人の自己学習に依存している",
          en: "No formal cloud native skills development program exists, relying on individual self-learning",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なトレーニングリソースは提供されているが、体系的なスキル開発プログラムは確立されていない",
          en: "Basic training resources are provided, but no systematic skills development program is established",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なスキル開発プログラムが確立され、認定資格取得支援、ハンズオントレーニング、学習時間の確保などが行われている",
          en: "Comprehensive skills development program established with certification support, hands-on training, and allocated learning time",
        },
      },
      {
        value: 100,
        label: {
          ja: "組織全体にわたるスキルマトリクスと個別育成計画が管理され、継続的な学習文化が定着し、内部講師やコミュニティによる知識移転が活発に行われている",
          en: "Organization-wide skills matrix and individual development plans managed, with established continuous learning culture and active knowledge transfer through internal trainers and communities",
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
    id: "fc_6",
    category: "foundations_culture",
    text: {
      ja: "組織のクラウドネイティブ導入における文化的障壁をどのように特定し、対処していますか？",
      en: "How do you identify and address cultural barriers to cloud native adoption in your organization?",
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
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "文化的変革はクラウドネイティブ導入成功の鍵です。組織はレジスタンスを特定し、チームの心構えを変え、恐れに対処する方法を持つべきです。",
        links: [
          {
            text: "Change Management in DevOps Transformations",
            url: "https://cloud.google.com/architecture/devops/devops-culture-transform",
          },
          {
            text: "The Phoenix Project",
            url: "https://itrevolution.com/product/the-phoenix-project/",
          },
        ],
      },
      en: {
        summary:
          "Cultural transformation is key to successful cloud native adoption. Organizations should have methods to identify resistance, shift team mindsets, and address fears.",
        links: [
          {
            text: "Change Management in DevOps Transformations",
            url: "https://cloud.google.com/architecture/devops/devops-culture-transform",
          },
          {
            text: "The Phoenix Project",
            url: "https://itrevolution.com/product/the-phoenix-project/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "文化的障壁を体系的に特定・対処するプロセスがなく、問題が発生した時に対応するのみ",
          en: "No systematic process to identify and address cultural barriers; only reactive when problems arise",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な組織変革の取り組みはあるが、クラウドネイティブ特有の文化的課題への対応は限定的",
          en: "Basic organizational change initiatives exist, but limited focus on cloud native-specific cultural challenges",
        },
      },
      {
        value: 66,
        label: {
          ja: "文化的障壁を特定するための定期的な評価と、変革管理プロセスが確立されており、継続的に改善されている",
          en: "Regular assessments to identify cultural barriers and established change management processes that are continuously improved",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的な文化変革プログラムが実施され、リーダーシップの模範、心理的安全性の確保、継続的なフィードバック、成功の祝福など、複数のアプローチが統合されている",
          en: "Comprehensive cultural transformation program with integrated approaches including leadership modeling, psychological safety, continuous feedback, and celebrating successes",
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
    id: "fc_7",
    category: "foundations_culture",
    text: {
      ja: "組織内でのオープンソースへの関与とコントリビューション文化はどの程度発展していますか？",
      en: "How developed is your organization's engagement with and contribution culture to open source?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "オープンソースへの積極的な関与は、クラウドネイティブの成功において重要な要素です。これにより、最新の技術トレンドへのアクセス、コミュニティからの学習、そして自社ツールとエコシステムの橋渡しが可能になります。",
        links: [
          {
            text: "CNCF Annual Survey 2024",
            url: "https://www.linuxfoundation.jp/wp-content/uploads/2025/05/cncf-annual-2024-jp2.pdf",
          },
          {
            text: "TODO Group: OSPO Guides",
            url: "https://todogroup.org/guides/",
          },
        ],
      },
      en: {
        summary:
          "Active engagement with open source is a critical element of cloud native success, allowing access to cutting-edge technical trends, learning from the community, and bridging proprietary tools with the ecosystem.",
        links: [
          {
            text: "CNCF Annual Survey 2024",
            url: "https://www.linuxfoundation.jp/wp-content/uploads/2025/05/cncf-annual-2024-jp2.pdf",
          },
          {
            text: "TODO Group: OSPO Guides",
            url: "https://todogroup.org/guides/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "オープンソースは主に消費するのみで、貢献はほとんどなく、組織的な関与もない",
          en: "Open source is primarily consumed with little contribution and no organizational engagement",
        },
      },
      {
        value: 33,
        label: {
          ja: "個人レベルでのオープンソース貢献はあるが、公式な戦略や組織的なサポートは限定的",
          en: "Some individual open source contributions but limited formal strategy or organizational support",
        },
      },
      {
        value: 66,
        label: {
          ja: "オープンソースへの貢献を奨励する明確な戦略があり、一部のプロジェクトでは積極的に関与している",
          en: "Clear strategy encouraging open source contributions with active involvement in select projects",
        },
      },
      {
        value: 100,
        label: {
          ja: "組織全体でオープンソースの価値が認識され、積極的な貢献文化が確立され、戦略的プロジェクトではリーダーシップ的役割を担っている",
          en: "Organization-wide recognition of open source value with established contribution culture and leadership roles in strategic projects",
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
    id: "fc_8",
    category: "foundations_culture",
    text: {
      ja: "クラウドネイティブの意思決定と技術選定においてオープンソースエコシステムの考慮をどのように行っていますか？",
      en: "How do you factor the open source ecosystem into cloud native decision-making and technology selection?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "standard",
    baseQuestion: true,
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドネイティブエコシステムでは、オープンソースプロジェクトの成熟度、コミュニティの健全性、ガバナンスモデルを評価することが、持続可能な技術選択において重要です。",
        links: [
          { text: "CNCF Landscape", url: "https://landscape.cncf.io/" },
          { text: "OpenSSF Scorecard", url: "https://securityscorecards.dev/" },
        ],
      },
      en: {
        summary:
          "In the cloud native ecosystem, evaluating open source project maturity, community health, and governance models is crucial for sustainable technology choices.",
        links: [
          { text: "CNCF Landscape", url: "https://landscape.cncf.io/" },
          { text: "OpenSSF Scorecard", url: "https://securityscorecards.dev/" },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "技術選定はオープンソースエコシステムの考慮なしに行われ、主に機能要件やベンダー関係に基づいている",
          en: "Technology selection occurs without consideration of the open source ecosystem, primarily based on functional requirements or vendor relationships",
        },
      },
      {
        value: 33,
        label: {
          ja: "オープンソースの考慮は基本的なレベルで行われるが、体系的な評価プロセスはなく、主にライセンスとサポートの可用性に焦点が当てられている",
          en: "Open source considerations made at a basic level but without systematic evaluation process, focusing primarily on licensing and support availability",
        },
      },
      {
        value: 66,
        label: {
          ja: "技術選定プロセスにオープンソースエコシステムの評価が組み込まれ、プロジェクトの成熟度、コミュニティの健全性、適合性などを考慮している",
          en: "Open source ecosystem evaluation integrated into technology selection process, considering project maturity, community health, and fit",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的なオープンソース評価フレームワークが確立され、技術的負債、ベンダーロックイン、長期的な持続可能性、エコシステム内での位置づけ、潜在的なコントリビューション機会などが体系的に考慮されている",
          en: "Comprehensive open source evaluation framework established with systematic consideration of technical debt, vendor lock-in, long-term sustainability, ecosystem positioning, and potential contribution opportunities",
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
    id: "fc_9",
    category: "foundations_culture",
    text: {
      ja: "組織はオープンソースプログラムオフィス（OSPO）やオープンソース戦略をどの程度確立していますか？",
      en: "To what extent has your organization established an Open Source Program Office (OSPO) or open source strategy?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    baseQuestion: true,
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "OSPOは、オープンソースの戦略的活用、リスク管理、コンプライアンス、コミュニティ貢献のバランスを取る上で重要な役割を果たします。成熟したOSPOは、クラウドネイティブエコシステムへの効果的な参加を促進します。",
        links: [
          {
            text: "Linux Foundation: Creating an Open Source Program",
            url: "https://www.linuxfoundation.org/tools/creating-an-open-source-program/",
          },
          {
            text: "TODO Group: OSPO 101",
            url: "https://github.com/todogroup/ospo-career-path",
          },
        ],
      },
      en: {
        summary:
          "OSPOs play a crucial role in balancing strategic use of open source, risk management, compliance, and community contributions. A mature OSPO facilitates effective participation in the cloud native ecosystem.",
        links: [
          {
            text: "Linux Foundation: Creating an Open Source Program",
            url: "https://www.linuxfoundation.org/tools/creating-an-open-source-program/",
          },
          {
            text: "TODO Group: OSPO 101",
            url: "https://github.com/todogroup/ospo-career-path",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "オープンソースを管理するための正式な構造や戦略がなく、アドホックなアプローチを採用している",
          en: "No formal structure or strategy for managing open source, using an ad-hoc approach",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なオープンソースポリシーは存在するが、専任のチームや包括的な戦略はなく、主にコンプライアンスに焦点が当てられている",
          en: "Basic open source policies exist but no dedicated team or comprehensive strategy, primarily focusing on compliance",
        },
      },
      {
        value: 66,
        label: {
          ja: "公式なOSPOまたはそれに相当する機能が確立され、オープンソースの使用、貢献、リスク管理のためのプロセスを管理している",
          en: "Formal OSPO or equivalent function established, managing processes for open source use, contribution, and risk management",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に成熟したOSPOが、組織全体のオープンソース戦略を主導し、戦略的プロジェクトへの参加、インナーソース文化の促進、ビジネス目標とのオープンソース活動の整合を行っている",
          en: "Highly mature OSPO leading organization-wide open source strategy, participation in strategic projects, fostering inner source culture, and aligning open source activities with business objectives",
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
    id: "fc_10",
    category: "foundations_culture",
    text: {
      ja: "組織のクラウドネイティブジャーニーにおける心理的安全性とフィードバック文化をどのように確立していますか？",
      en: "How do you establish psychological safety and feedback culture in your organization's cloud native journey?",
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
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "心理的安全性は、イノベーション、実験、継続的改善に不可欠です。リスクを取ることや失敗から学ぶことを恐れない環境を作ることで、クラウドネイティブの変革が加速します。",
        links: [
          {
            text: "Psychological Safety Research",
            url: "https://mitsucari.com/blog/psychological_safety_research/",
          },
          {
            text: "Building a psychologically safe workplace: Amy Edmondson",
            url: "https://www.youtube.com/watch?v=LhoLuui9gX8",
          },
        ],
      },
      en: {
        summary:
          "Psychological safety is crucial for innovation, experimentation, and continuous improvement. Creating an environment where people aren't afraid to take risks or learn from failures accelerates cloud native transformation.",
        links: [
          {
            text: "Psychological Safety and Learning Behavior",
            url: "https://www.jstor.org/stable/2666999",
          },
          {
            text: "Building a psychologically safe workplace: Amy Edmondson",
            url: "https://www.youtube.com/watch?v=LhoLuui9gX8",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "心理的安全性への意識が低く、失敗は責められ、フィードバックは主にトップダウンで提供される",
          en: "Low awareness of psychological safety, failures are blamed, and feedback is primarily top-down",
        },
      },
      {
        value: 33,
        label: {
          ja: "心理的安全性の重要性は認識されているが、具体的な取り組みは限定的で、フィードバックプロセスも体系化されていない",
          en: "Importance of psychological safety is recognized but limited concrete initiatives and feedback processes are not systematized",
        },
      },
      {
        value: 66,
        label: {
          ja: "心理的安全性を育む取り組みが実施され、リーダーがモデルとなり、定期的なフィードバックが奨励されている",
          en: "Initiatives to foster psychological safety implemented, leaders model it, and regular feedback is encouraged",
        },
      },
      {
        value: 100,
        label: {
          ja: "心理的安全性が組織文化に深く根付き、多方向のフィードバック、事後検証（レトロスペクティブ）、非難なしの障害分析などのプラクティスが標準化され、継続的に測定・改善されている",
          en: "Psychological safety deeply embedded in organizational culture with standardized practices like multi-directional feedback, retrospectives, and blameless failure analysis that are continuously measured and improved",
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
