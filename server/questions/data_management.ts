/**
 * データ管理質問モジュール
 *
 * クラウドネイティブ環境におけるデータ管理に関する質問を定義するモジュールです。
 * データストレージ戦略、データバックアップ、データセキュリティ、データガバナンスなどの側面を評価します。
 */

import { AssessmentQuestion } from "@shared/schema";

export const dataManagementQuestions: AssessmentQuestion[] = [
  {
    id: "dm_1",
    category: "data_management",
    text: {
      ja: "ストレージソリューションはどの程度洗練されていますか？",
      en: "How sophisticated are your storage solutions?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "medium",
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
          "クラウドネイティブ環境では、様々なストレージソリューション（ブロック、オブジェクト、ファイル）をユースケースに合わせて適切に選択し、パフォーマンスとコストのバランスを最適化することが重要です。",
        links: [
          {
            text: "クラウドストレージオプション",
            url: "https://cloud.google.com/storage/docs",
          },
          {
            text: "ストレージのベストプラクティス",
            url: "https://aws.amazon.com/blogs/storage/best-practices-for-cloud-storage/",
          },
        ],
      },
      en: {
        summary:
          "In cloud native environments, it's important to appropriately select various storage solutions (block, object, file) based on use cases and optimize the balance between performance and cost.",
        links: [
          {
            text: "Cloud Storage Options",
            url: "https://cloud.google.com/storage/docs",
          },
          {
            text: "Storage Best Practices",
            url: "https://aws.amazon.com/blogs/storage/best-practices-for-cloud-storage/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "ストレージソリューションは基本的なもののみで、クラウドネイティブ環境に最適化されていない",
          en: "Storage solutions are basic and not optimized for cloud native environments",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なクラウドストレージソリューションは使用されているが、ユースケースに応じた最適化や高度な機能の活用は限定的",
          en: "Basic cloud storage solutions are used, but optimization for specific use cases and utilization of advanced features is limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "多様なストレージソリューション（ブロック、オブジェクト、ファイル）が適切に使い分けられ、パフォーマンスやコスト最適化が行われている",
          en: "Various storage solutions (block, object, file) are appropriately differentiated, with performance and cost optimization implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に最適化されたストレージ戦略が実装され、自動階層化、インテリジェントなデータライフサイクル管理、高度なデータ保護機能などが活用されている",
          en: "Highly optimized storage strategies are implemented, utilizing automatic tiering, intelligent data lifecycle management, advanced data protection features, etc.",
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
    id: "dm_2",
    category: "data_management",
    text: {
      ja: "ユースケースに基づいて、リレーショナル、キーバリュー、ドキュメント、インメモリ、グラフ、時系列、ワイドカラム、台帳データベースなどを選択・組み合わせて、組織に最適なものを採用していますか？",
      en: "Are you selecting and combining relational, key-value, document, in-memory, graph, time series, wide column, ledger databases, etc. based on use cases to adopt what is optimal for your organization?",
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
          "クラウドネイティブ環境では、単一のデータベースですべてのユースケースに対応するのではなく、特定のユースケースに最適化されたデータベースを目的に応じて選択することで、パフォーマンス、スケーラビリティ、開発効率を向上させることができます。",
        links: [
          {
            text: "データベース選択ガイド",
            url: "https://docs.microsoft.com/en-us/azure/architecture/guide/technology-choices/data-store-overview",
          },
          {
            text: "ポリグロット永続性",
            url: "https://martinfowler.com/bliki/PolyglotPersistence.html",
          },
        ],
      },
      en: {
        summary:
          "In cloud native environments, rather than using a single database for all use cases, selecting databases optimized for specific use cases can improve performance, scalability, and development efficiency.",
        links: [
          {
            text: "Database Selection Guide",
            url: "https://docs.microsoft.com/en-us/azure/architecture/guide/technology-choices/data-store-overview",
          },
          {
            text: "Polyglot Persistence",
            url: "https://martinfowler.com/bliki/PolyglotPersistence.html",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "全てのユースケースで単一種類のデータベース（主にリレーショナルDB）のみを使用している",
          en: "Only a single type of database (mainly relational DB) is used for all use cases",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のユースケースで最適なデータベースタイプを選択しているが、ほとんどは従来のリレーショナルDBを使用している",
          en: "Optimal database types are selected for some use cases, but most still use traditional relational DBs",
        },
      },
      {
        value: 66,
        label: {
          ja: "多くのユースケースで適切なデータベースタイプを選択し、複数のデータベースタイプを組み合わせているが、選択基準が明確に定義されていない場合もある",
          en: "Appropriate database types are selected for many use cases and multiple database types are combined, but selection criteria may not always be clearly defined",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのユースケースで明確な選択基準に基づいて最適なデータベースタイプを選択し、必要に応じて複数のデータベースタイプを組み合わせて使用している",
          en: "Optimal database types are selected based on clear criteria for all use cases, combining multiple database types as needed",
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
    id: "dm_3",
    category: "data_management",
    text: {
      ja: "ディザスタリカバリアプローチはどの程度包括的ですか？",
      en: "How comprehensive is your disaster recovery approach?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    baseQuestion: true,
    maturityLevel: "beginner",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なディザスタリカバリ戦略は、データ損失やサービス中断のリスクを最小限に抑え、目標復旧時間（RTO）と目標復旧時点（RPO）の要件を満たすために不可欠です。",
        links: [
          {
            text: "ディザスタリカバリの基本",
            url: "https://aws.amazon.com/disaster-recovery/",
          },
          {
            text: "RTOとRPO",
            url: "https://www.ibm.com/cloud/blog/rto-vs-rpo-whats-the-difference",
          },
        ],
      },
      en: {
        summary:
          "An effective disaster recovery strategy is essential to minimize the risk of data loss and service interruption, and to meet Recovery Time Objective (RTO) and Recovery Point Objective (RPO) requirements.",
        links: [
          {
            text: "Disaster Recovery Basics",
            url: "https://aws.amazon.com/disaster-recovery/",
          },
          {
            text: "RTO and RPO",
            url: "https://www.ibm.com/cloud/blog/rto-vs-rpo-whats-the-difference",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的なディザスタリカバリ計画はなく、基本的なバックアップのみが実施されている",
          en: "No systematic disaster recovery plan exists, with only basic backups implemented",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なディザスタリカバリ計画は存在するが、自動化は限定的で、RTOやRPOの定義も不明確",
          en: "A basic disaster recovery plan exists, but automation is limited and RTO/RPO definitions are unclear",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なディザスタリカバリ計画が実装され、明確なRTO/RPOが定義され、定期的なテストも行われている",
          en: "A comprehensive disaster recovery plan is implemented, with clear RTO/RPO defined and regular testing conducted",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なディザスタリカバリソリューションが実装され、自動フェイルオーバー、継続的なデータレプリケーション、複数リージョン戦略などが標準化されている",
          en: "Advanced disaster recovery solutions are implemented, with automated failover, continuous data replication, multi-region strategies, etc. standardized",
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
    id: "dm_20",
    category: "data_management",
    text: {
      ja: "アプリケーションのデータ層において、単一障害点のリスクを軽減するため、データベースやオブジェクトストレージにマネージドサービスを利用していますか？もしくは「リスク軽減」ではなく単一障害点の「リスク回避」のため、分散データベース/分散ストレージや独自実装（DBクラスタリングやストレージ同期）による対策を行っていますか？",
      en: "In the data layer of your applications, are you using managed services for databases and object storage to mitigate the risk of single points of failure? Or, rather than 'risk mitigation,' are you implementing measures such as distributed databases/distributed storage or custom implementations (DB clustering, storage synchronization) to 'avoid the risk' of single points of failure?",
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
          "データ層の可用性と冗長性は、ビジネス継続性の確保に不可欠です。単一障害点を排除し、適切なレプリケーション戦略を実装することで、障害発生時でもデータの整合性とアクセス可能性を維持できます。",
        links: [
          {
            text: "データベース高可用性",
            url: "https://cloud.google.com/sql/docs/mysql/high-availability",
          },
          {
            text: "分散データベースシステム",
            url: "https://aws.amazon.com/dynamodb/global-tables/",
          },
        ],
      },
      en: {
        summary:
          "Availability and redundancy in the data layer are essential for ensuring business continuity. By eliminating single points of failure and implementing appropriate replication strategies, data integrity and accessibility can be maintained even during failures.",
        links: [
          {
            text: "Database High Availability",
            url: "https://cloud.google.com/sql/docs/mysql/high-availability",
          },
          {
            text: "Distributed Database Systems",
            url: "https://aws.amazon.com/dynamodb/global-tables/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データベースやストレージは単一障害点となっており、冗長性や分散性は考慮されていない",
          en: "Databases and storage are single points of failure, with redundancy and distribution not considered",
        },
      },
      {
        value: 33,
        label: {
          ja: "主要なデータベースやストレージにはバックアップが取られているが、マネージドサービスや分散システムは限定的にしか使用されていない",
          en: "Backups are maintained for key databases and storage, but managed services or distributed systems are used only in a limited way",
        },
      },
      {
        value: 66,
        label: {
          ja: "ほとんどのデータストアにマネージドサービスを使用し、単一障害点のリスクを軽減している",
          en: "Managed services are used for most data stores, mitigating the risk of single points of failure",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのデータストアが高可用性を持つ分散システムとして設計され、リージョン間やゾーン間でのレプリケーションが実装されており、単一障害点が存在しない",
          en: "All data stores are designed as highly available distributed systems, with replication implemented across regions and zones, eliminating single points of failure",
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
    id: "dm_4",
    category: "data_management",
    text: {
      ja: "リージョンやゾーン間でのデータ復元力をどのように実装していますか？",
      en: "How do you implement data resilience across regions and zones?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "dm_3", minValue: 33 }, // Only show if dm_3 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "リージョンやゾーンをまたいだデータ復元力は、大規模な障害やリージョン全体の停止に対する保護を提供します。適切なレプリケーション戦略とグローバル分散アーキテクチャにより、高い可用性と災害耐性を実現できます。",
        links: [
          {
            text: "マルチリージョン戦略",
            url: "https://cloud.google.com/architecture/infra-reliability-guide",
          },
          {
            text: "クロスリージョンレプリケーション",
            url: "https://aws.amazon.com/dynamodb/global-tables/",
          },
        ],
      },
      en: {
        summary:
          "Data resilience across regions and zones provides protection against large-scale failures or entire region outages. Appropriate replication strategies and globally distributed architecture enable high availability and disaster resistance.",
        links: [
          {
            text: "Multi-Region Strategies",
            url: "https://cloud.google.com/architecture/infra-reliability-guide",
          },
          {
            text: "Cross-Region Replication",
            url: "https://aws.amazon.com/dynamodb/global-tables/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "リージョン/ゾーン間のデータ復元力に特化した対策はなく、単一障害点のリスクが高い",
          en: "No specific measures for data resilience across regions/zones, with high risk of single points of failure",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の重要なデータに対してリージョン/ゾーン間のレプリケーションが実施されているが、包括的な戦略ではない",
          en: "Cross-region/zone replication is implemented for some critical data, but it's not a comprehensive strategy",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なデータはリージョン/ゾーンをまたいで冗長化され、定期的なフェイルオーバーテストも実施されている",
          en: "Key data is redundantly stored across regions/zones, with regular failover testing conducted",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのデータに対して高度なマルチリージョン/マルチゾーン戦略が実装され、自動フェイルオーバー、データ一貫性確保、グローバル分散などの機能が標準化されている",
          en: "Advanced multi-region/multi-zone strategies are implemented for all data, with automated failover, data consistency assurance, global distribution, etc. standardized",
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
    id: "dm_5",
    category: "data_management",
    text: {
      ja: "データベーススキーマの変更と移行をどのように管理していますか？",
      en: "How do you manage database schema changes and migrations?",
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
      { questionId: "dm_2", minValue: 33 }, // Only show if dm_2 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "データベーススキーマの変更管理は、アプリケーションの進化において重要な側面です。体系的なアプローチにより、ダウンタイムやデータ整合性の問題を最小限に抑えながら、スキーマを安全に更新できます。",
        links: [
          {
            text: "スキーマ移行のベストプラクティス",
            url: "https://docs.microsoft.com/en-us/azure/architecture/patterns/schema-versioning",
          },
          {
            text: "データベース移行ツール",
            url: "https://www.liquibase.com/resources/guides/database-automation",
          },
        ],
      },
      en: {
        summary:
          "Database schema change management is an important aspect in the evolution of applications. A systematic approach allows safe schema updates while minimizing downtime and data integrity issues.",
        links: [
          {
            text: "Schema Migration Best Practices",
            url: "https://docs.microsoft.com/en-us/azure/architecture/patterns/schema-versioning",
          },
          {
            text: "Database Migration Tools",
            url: "https://www.liquibase.com/resources/guides/database-automation",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データベーススキーマの変更は手動で行われ、バージョン管理や自動化はほとんどない",
          en: "Database schema changes are performed manually, with little version control or automation",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なスキーマ変更管理が行われているが、自動化は限定的で、本番環境への適用は手動プロセスが多い",
          en: "Basic schema change management is in place, but automation is limited and application to production environment often involves manual processes",
        },
      },
      {
        value: 66,
        label: {
          ja: "データベースマイグレーションツールが標準的に採用され、スキーマ変更はバージョン管理され、CI/CDパイプラインに統合されている",
          en: "Database migration tools are standardly adopted, schema changes are version controlled, and integrated into CI/CD pipelines",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデータベーススキーマ管理が実装され、無停止スキーマ変更、自動テスト、ロールバック機能、前方/後方互換性確保などの機能が標準化されている",
          en: "Advanced database schema management is implemented, with zero-downtime schema changes, automated testing, rollback capabilities, forward/backward compatibility assurance, etc. standardized",
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
    id: "dm_6",
    category: "data_management",
    text: {
      ja: "データの暗号化と保護はどのように実装されていますか？",
      en: "How is data encryption and protection implemented?",
    },
    weight: 1,
    maturityImportance: "high",
    roleRelevance: {
      executive: "high",
      manager: "medium",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "dm_1", minValue: 33 }, // Only show if dm_1 scored at least 33
    ],
    maturityLevel: "intermediate",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "データの暗号化と保護は、セキュリティとコンプライアンスの基盤です。保存データと転送中データの両方を適切に保護することで、機密情報の漏洩リスクを最小限に抑えることができます。",
        links: [
          {
            text: "データ暗号化のベストプラクティス",
            url: "https://cloud.google.com/security/encryption-at-rest",
          },
          { text: "鍵管理システム", url: "https://aws.amazon.com/kms/" },
        ],
      },
      en: {
        summary:
          "Data encryption and protection form the foundation of security and compliance. By properly protecting both data at rest and data in transit, the risk of sensitive information leakage can be minimized.",
        links: [
          {
            text: "Data Encryption Best Practices",
            url: "https://cloud.google.com/security/encryption-at-rest",
          },
          {
            text: "Key Management Systems",
            url: "https://aws.amazon.com/kms/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データの暗号化はほとんど実装されておらず、基本的なネットワークセキュリティに依存している",
          en: "Data encryption is barely implemented, relying on basic network security",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部の機密データに対して基本的な暗号化（SSL/TLS、一部のデータベース暗号化など）が実装されているが、包括的な戦略はない",
          en: "Basic encryption (SSL/TLS, some database encryption, etc.) is implemented for some sensitive data, but there is no comprehensive strategy",
        },
      },
      {
        value: 66,
        label: {
          ja: "保存データと転送中データの大部分に対して暗号化が実装され、鍵管理システムも導入されている",
          en: "Encryption is implemented for most data at rest and data in transit, and a key management system is also in place",
        },
      },
      {
        value: 100,
        label: {
          ja: "包括的なデータ保護戦略が実装され、全てのデータに対するエンドツーエンドの暗号化、高度な鍵管理、暗号化状態での処理機能、定期的なセキュリティ監査などが標準化されている",
          en: "A comprehensive data protection strategy is implemented, with end-to-end encryption for all data, advanced key management, processing capabilities on encrypted data, regular security audits, etc. standardized",
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
    id: "dm_7",
    category: "data_management",
    text: {
      ja: "データガバナンスとコンプライアンスはどのように管理されていますか？",
      en: "How are data governance and compliance managed?",
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
      { questionId: "dm_6", minValue: 66 }, // Only show if dm_6 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なデータガバナンスは、データの整合性、セキュリティ、プライバシー、およびコンプライアンスを確保するための方針、手順、および制御を確立します。",
        links: [
          {
            text: "データガバナンスフレームワーク",
            url: "https://www.ibm.com/cloud/learn/data-governance",
          },
          {
            text: "クラウドデータコンプライアンス",
            url: "https://cloud.google.com/security/compliance",
          },
        ],
      },
      en: {
        summary:
          "Effective data governance establishes policies, procedures, and controls to ensure data integrity, security, privacy, and compliance.",
        links: [
          {
            text: "Data Governance Framework",
            url: "https://www.ibm.com/cloud/learn/data-governance",
          },
          {
            text: "Cloud Data Compliance",
            url: "https://cloud.google.com/security/compliance",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的なデータガバナンスの枠組みはなく、コンプライアンス対応は主に反応的に行われている",
          en: "No systematic data governance framework exists, and compliance responses are primarily reactive",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なデータガバナンスのポリシーと手順は存在するが、自動化された実施や監視の仕組みは限定的",
          en: "Basic data governance policies and procedures exist, but mechanisms for automated enforcement and monitoring are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なデータガバナンスフレームワークが確立され、自動化されたコンプライアンスチェック、データカタログ、定期的な監査が実装されている",
          en: "A comprehensive data governance framework is established, with automated compliance checks, data catalog, and regular audits implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデータガバナンス戦略が組織全体で実装され、Policy as Code、リアルタイムコンプライアンスモニタリング、自動修復、プライバシー保護技術などが標準化されている",
          en: "Advanced data governance strategies are implemented organization-wide, with Policy as Code, real-time compliance monitoring, automated remediation, privacy protection technologies, etc. standardized",
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
    id: "dm_8",
    category: "data_management",
    text: {
      ja: "データアクセス制御とポリシー管理はどのように実装されていますか？",
      en: "How are data access controls and policy management implemented?",
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
      { questionId: "dm_7", minValue: 66 }, // Only show if dm_7 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "細粒度のアクセス制御とポリシー管理により、適切なユーザーのみが必要なデータにアクセスできるよう保証し、最小権限の原則を実装することができます。",
        links: [
          {
            text: "データアクセス制御",
            url: "https://cloud.google.com/security/products/iam",
          },
          { text: "ポリシー管理", url: "https://www.openpolicyagent.org/" },
        ],
      },
      en: {
        summary:
          "Fine-grained access control and policy management ensure that only appropriate users can access necessary data, implementing the principle of least privilege.",
        links: [
          {
            text: "Data Access Control",
            url: "https://cloud.google.com/security/products/iam",
          },
          {
            text: "Policy Management",
            url: "https://www.openpolicyagent.org/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データアクセス制御は基本的なユーザー認証のみで、細粒度のポリシー管理はほとんど実装されていない",
          en: "Data access control is limited to basic user authentication, with little fine-grained policy management implemented",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なロールベースアクセス制御（RBAC）は実装されているが、高度なポリシー管理や動的なアクセス制御は限定的",
          en: "Basic role-based access control (RBAC) is implemented, but advanced policy management and dynamic access control are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "属性ベースアクセス制御（ABAC）や細粒度のポリシー管理が主要なデータストアに実装され、一元管理されている",
          en: "Attribute-based access control (ABAC) and fine-grained policy management are implemented for key data stores and centrally managed",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なアクセス制御フレームワークが実装され、Policy as Code、コンテキスト認識アクセス、ゼロトラストモデル、動的ポリシー適用などが標準化されている",
          en: "Advanced access control frameworks are implemented, with Policy as Code, context-aware access, zero trust model, dynamic policy enforcement, etc. standardized",
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
    id: "dm_9",
    category: "data_management",
    text: {
      ja: "データライフサイクル管理はどのように実装されていますか？",
      en: "How is data lifecycle management implemented?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "optional",
    dependencies: [
      { questionId: "dm_1", minValue: 66 }, // Only show if dm_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "データライフサイクル管理は、データの作成から廃棄までの全過程を体系的に管理し、ストレージコストの最適化、コンプライアンス要件の遵守、パフォーマンスの向上を実現します。",
        links: [
          {
            text: "データライフサイクル管理",
            url: "https://cloud.google.com/storage/docs/lifecycle",
          },
          {
            text: "データ保持ポリシー",
            url: "https://aws.amazon.com/blogs/storage/setting-up-amazon-s3-data-lifecycle-policies/",
          },
        ],
      },
      en: {
        summary:
          "Data lifecycle management systematically manages the entire process from data creation to disposal, optimizing storage costs, ensuring compliance requirements, and improving performance.",
        links: [
          {
            text: "Data Lifecycle Management",
            url: "https://cloud.google.com/storage/docs/lifecycle",
          },
          {
            text: "Data Retention Policies",
            url: "https://aws.amazon.com/blogs/storage/setting-up-amazon-s3-data-lifecycle-policies/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "体系的なデータライフサイクル管理はなく、古いデータや不要なデータが定期的に整理されていない",
          en: "No systematic data lifecycle management exists, and old or unnecessary data is not regularly organized",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なデータ保持ポリシーは存在するが、自動化された階層化や廃棄の仕組みは限定的",
          en: "Basic data retention policies exist, but mechanisms for automated tiering and disposal are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なデータライフサイクル管理が実装され、自動データ階層化、保持ポリシー適用、コスト最適化が行われている",
          en: "Comprehensive data lifecycle management is implemented, with automated data tiering, retention policy application, and cost optimization",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデータライフサイクル管理が標準化され、AIを活用したデータ分類、インテリジェントな階層化、コンプライアンス主導の保持ポリシー、自動化されたコスト最適化などが実装されている",
          en: "Advanced data lifecycle management is standardized, with AI-powered data classification, intelligent tiering, compliance-driven retention policies, automated cost optimization, etc. implemented",
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
    id: "dm_10",
    category: "data_management",
    text: {
      ja: "データバックアップと復元戦略はどのように実装されていますか？",
      en: "How are data backup and recovery strategies implemented?",
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
      { questionId: "dm_3", minValue: 66 }, // Only show if dm_3 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なバックアップと復元戦略は、データ喪失のリスクを最小限に抑え、障害発生時の迅速な復旧を可能にします。自動化、定期的なテスト、明確に定義されたプロセスがその基盤となります。",
        links: [
          {
            text: "3-2-1バックアップ戦略",
            url: "https://www.veeam.com/blog/321-backup-rule.html",
          },
          {
            text: "クラウドバックアップソリューション",
            url: "https://cloud.google.com/solutions/backup-dr",
          },
        ],
      },
      en: {
        summary:
          "Effective backup and recovery strategies minimize the risk of data loss and enable rapid recovery in the event of failures. Automation, regular testing, and clearly defined processes form their foundation.",
        links: [
          {
            text: "3-2-1 Backup Strategy",
            url: "https://www.veeam.com/blog/321-backup-rule.html",
          },
          {
            text: "Cloud Backup Solutions",
            url: "https://cloud.google.com/solutions/backup-dr",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データバックアップは不定期に手動で行われ、復元プロセスのテストはほとんど実施されていない",
          en: "Data backups are performed manually at irregular intervals, with little testing of the recovery process",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的な定期バックアップは自動化されているが、復元テストは限定的で、包括的な戦略は確立されていない",
          en: "Basic regular backups are automated, but recovery testing is limited and no comprehensive strategy is established",
        },
      },
      {
        value: 66,
        label: {
          ja: "包括的なバックアップ・復元戦略が実装され、定期的なバックアップ、自動化されたプロセス、定期的な復元テストが行われている",
          en: "A comprehensive backup and recovery strategy is implemented, with regular backups, automated processes, and periodic recovery testing",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なバックアップ・復元システムが標準化され、リアルタイムレプリケーション、ポイントインタイムリカバリ、自動検証、複数リージョンにわたる保管などが実装されている",
          en: "Advanced backup and recovery systems are standardized, with real-time replication, point-in-time recovery, automatic verification, multi-region storage, etc. implemented",
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
    id: "dm_11",
    category: "data_management",
    text: {
      ja: "データの品質と整合性をどのように確保していますか？",
      en: "How do you ensure data quality and integrity?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "high",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "dm_2", minValue: 66 }, // Only show if dm_2 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "データ品質と整合性は、信頼性の高い分析と意思決定の基盤です。データ検証、整合性チェック、品質モニタリングなどの仕組みにより、正確で信頼できるデータを維持することができます。",
        links: [
          {
            text: "データ品質フレームワーク",
            url: "https://cloud.google.com/bigquery/docs",
          },
          {
            text: "データ整合性のベストプラクティス",
            url: "https://www.talend.com/resources/what-is-data-integrity/",
          },
        ],
      },
      en: {
        summary:
          "Data quality and integrity form the foundation for reliable analysis and decision-making. Mechanisms such as data validation, integrity checks, and quality monitoring can maintain accurate and reliable data.",
        links: [
          {
            text: "Data Quality Framework",
            url: "https://cloud.google.com/bigquery/docs",
          },
          {
            text: "Data Integrity Best Practices",
            url: "https://www.talend.com/resources/what-is-data-integrity/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データ品質と整合性の体系的な管理はなく、問題が発生した場合に対処するリアクティブなアプローチが主流",
          en: "No systematic management of data quality and integrity, with reactive approaches that address issues as they arise being mainstream",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なデータ検証とスキーマ制約は実装されているが、包括的な品質フレームワークや継続的なモニタリングは限定的",
          en: "Basic data validation and schema constraints are implemented, but comprehensive quality frameworks and continuous monitoring are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "データ品質フレームワークが確立され、自動検証、整合性チェック、品質メトリクスの追跡が実装されている",
          en: "A data quality framework is established, with automated validation, integrity checks, and quality metrics tracking implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデータ品質管理が標準化され、AIを活用した異常検出、自動修正、データ品質SLA、品質に基づくデータパイプライン制御などが実装されている",
          en: "Advanced data quality management is standardized, with AI-powered anomaly detection, automatic correction, data quality SLAs, quality-based data pipeline control, etc. implemented",
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
    id: "dm_12",
    category: "data_management",
    text: {
      ja: "データパイプラインと統合プロセスをどのように管理していますか？",
      en: "How do you manage data pipelines and integration processes?",
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
      { questionId: "dm_2", minValue: 66 }, // Only show if dm_2 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "効果的なデータパイプラインと統合プロセスにより、異なるソースからのデータを効率的に収集、変換、ロードし、一貫性のあるデータフローを確保することができます。",
        links: [
          {
            text: "データパイプラインアーキテクチャ",
            url: "https://cloud.google.com/blog/topics/developers-practitioners/what-data-pipeline-architecture-should-i-use/",
          },
          {
            text: "ETL vs ELT",
            url: "https://www.xplenty.com/blog/etl-vs-elt/",
          },
        ],
      },
      en: {
        summary:
          "Effective data pipelines and integration processes enable efficient collection, transformation, and loading of data from different sources, ensuring consistent data flow.",
        links: [
          {
            text: "Data Pipeline Architecture",
            url: "https://cloud.google.com/blog/topics/developers-practitioners/what-data-pipeline-architecture-should-i-use/",
          },
          {
            text: "ETL vs ELT",
            url: "https://www.xplenty.com/blog/etl-vs-elt/",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データ統合は主に手動プロセスで行われ、標準化されたパイプラインはほとんど存在しない",
          en: "Data integration is primarily done through manual processes, with few standardized pipelines",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なデータパイプラインが一部のデータフローに実装されているが、包括的な管理や監視の仕組みは限定的",
          en: "Basic data pipelines are implemented for some data flows, but comprehensive management and monitoring mechanisms are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "標準化されたデータパイプラインフレームワークが確立され、主要なデータフローは自動化され、監視されている",
          en: "A standardized data pipeline framework is established, with major data flows automated and monitored",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデータパイプライン管理が実装され、データフローをコードとして管理、メタデータ駆動の統合、リアルタイム処理、自己修復機能などが標準化されている",
          en: "Advanced data pipeline management is implemented, with data flows managed as code, metadata-driven integration, real-time processing, self-healing capabilities, etc. standardized",
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
    id: "dm_13",
    category: "data_management",
    text: {
      ja: "データの可観測性と監視をどのように実装していますか？",
      en: "How do you implement data observability and monitoring?",
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
      { questionId: "dm_11", minValue: 66 }, // Only show if dm_11 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "データの可観測性と監視により、データパイプラインやストレージの健全性、品質、パフォーマンスを継続的に追跡し、問題を早期に検出することができます。",
        links: [
          {
            text: "データ可観測性",
            url: "https://www.ibm.com/think/topics/data-observability/",
          },
          {
            text: "データ監視のベストプラクティス",
            url: "https://www.secoda.co/learn/best-practices-for-data-monitoring",
          },
        ],
      },
      en: {
        summary:
          "Data observability and monitoring enable continuous tracking of the health, quality, and performance of data pipelines and storage, allowing early detection of issues.",
        links: [
          {
            text: "Data Observability",
            url: "https://www.ibm.com/think/topics/data-observability/",
          },
          {
            text: "Data Monitoring Best Practices",
            url: "https://www.secoda.co/learn/best-practices-for-data-monitoring",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データの可観測性や監視の体系的な仕組みはなく、問題が発生した後に対処するリアクティブなアプローチが主流",
          en: "No systematic mechanisms for data observability or monitoring exist, with reactive approaches that address issues after they occur being mainstream",
        },
      },
      {
        value: 33,
        label: {
          ja: "基本的なデータパイプラインのモニタリングは実装されているが、包括的な可観測性フレームワークや先進的な検出機能は限定的",
          en: "Basic data pipeline monitoring is implemented, but comprehensive observability frameworks and advanced detection capabilities are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "データの可観測性フレームワークが確立され、メタデータ監視、データ品質指標、パイプラインパフォーマンスの追跡が実装されている",
          en: "A data observability framework is established, with metadata monitoring, data quality indicators, and pipeline performance tracking implemented",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデータ可観測性システムが標準化され、AIを活用した異常検出、データの系譜追跡、影響分析、自動修復などの機能が実装されている",
          en: "Advanced data observability systems are standardized, with AI-powered anomaly detection, data lineage tracking, impact analysis, automated remediation, etc. implemented",
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
    id: "dm_14",
    category: "data_management",
    text: {
      ja: "クラウドネイティブデータウェアハウスと分析プラットフォームをどのように活用していますか？",
      en: "How do you utilize cloud native data warehouses and analytics platforms?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "high",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "comprehensive",
    dependencies: [
      { questionId: "dm_1", minValue: 66 }, // Only show if dm_1 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "クラウドネイティブデータウェアハウスと分析プラットフォームは、スケーラビリティ、柔軟性、コスト効率に優れ、データドリブンな意思決定を支援します。",
        links: [
          {
            text: "モダンデータウェアハウス",
            url: "https://aws.amazon.com/big-data/datalakes-and-analytics/modern-data-architecture/",
          },
          {
            text: "クラウド分析",
            url: "https://cloud.google.com/solutions/smart-analytics",
          },
        ],
      },
      en: {
        summary:
          "Cloud native data warehouses and analytics platforms excel in scalability, flexibility, and cost efficiency, supporting data-driven decision making.",
        links: [
          {
            text: "Modern Data Warehouse",
            url: "https://aws.amazon.com/big-data/datalakes-and-analytics/modern-data-architecture/",
          },
          {
            text: "Cloud Analytics",
            url: "https://cloud.google.com/solutions/smart-analytics",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "クラウドネイティブデータウェアハウスや分析プラットフォームはほとんど活用されておらず、従来型のオンプレミスソリューションが主流",
          en: "Cloud native data warehouses and analytics platforms are hardly utilized, with traditional on-premises solutions being mainstream",
        },
      },
      {
        value: 33,
        label: {
          ja: "一部のデータや分析ワークロードでクラウドネイティブソリューションを利用しているが、包括的な戦略や最適化は限定的",
          en: "Cloud native solutions are used for some data and analytics workloads, but comprehensive strategies and optimization are limited",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なデータウェアハウスと分析ワークロードでクラウドネイティブプラットフォームを活用し、コスト最適化やスケーラビリティの利点を享受している",
          en: "Cloud native platforms are utilized for major data warehouse and analytics workloads, benefiting from cost optimization and scalability advantages",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度に最適化されたクラウドネイティブデータアーキテクチャが実装され、サーバーレス分析、自動スケーリング、コスト管理、高度なセキュリティ機能などが標準化されている",
          en: "Highly optimized cloud native data architecture is implemented, with serverless analytics, automatic scaling, cost management, advanced security features, etc. standardized",
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
    id: "dm_15",
    category: "data_management",
    text: {
      ja: "データメッシュやデータファブリックのようなモダンデータアーキテクチャをどのように採用していますか？",
      en: "How do you adopt modern data architectures such as data mesh or data fabric?",
    },
    weight: 1,
    maturityImportance: "medium",
    roleRelevance: {
      executive: "medium",
      manager: "high",
      practitioner: "medium",
    },
    assessmentType: "optional",
    dependencies: [
      { questionId: "dm_14", minValue: 66 }, // Only show if dm_14 scored at least 66
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "データメッシュやデータファブリックなどのモダンアーキテクチャは、分散型の組織でのデータ管理をより効果的にし、ドメイン主導のデータ所有権とセルフサービス機能を促進します。",
        links: [
          {
            text: "データメッシュの原則",
            url: "https://martinfowler.com/articles/data-mesh-principles.html",
          },
          {
            text: "データファブリックアーキテクチャ",
            url: "https://www.ibm.com/cloud/learn/data-fabric",
          },
        ],
      },
      en: {
        summary:
          "Modern architectures such as data mesh and data fabric make data management in distributed organizations more effective, promoting domain-driven data ownership and self-service capabilities.",
        links: [
          {
            text: "Data Mesh Principles",
            url: "https://martinfowler.com/articles/data-mesh-principles.html",
          },
          {
            text: "Data Fabric Architecture",
            url: "https://www.ibm.com/cloud/learn/data-fabric",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "モダンデータアーキテクチャの採用は検討されておらず、従来の中央集権的なデータ管理アプローチが主流",
          en: "Adoption of modern data architecture is not being considered, with traditional centralized data management approaches being mainstream",
        },
      },
      {
        value: 33,
        label: {
          ja: "データメッシュやデータファブリックの概念を探索し、一部の領域で試験的に実装しているが、組織全体での採用は初期段階",
          en: "The concepts of data mesh or data fabric are being explored and experimentally implemented in some areas, but organization-wide adoption is in the early stages",
        },
      },
      {
        value: 66,
        label: {
          ja: "主要なドメインや事業領域でデータメッシュやデータファブリックの原則を採用し、ドメイン所有のデータプロダクト、セルフサービス機能、分散ガバナンスなどを実装している",
          en: "Data mesh or data fabric principles are adopted in major domains or business areas, implementing domain-owned data products, self-service capabilities, distributed governance, etc.",
        },
      },
      {
        value: 100,
        label: {
          ja: "高度なデータメッシュ/ファブリックアーキテクチャが組織全体で採用され、完全な分散データガバナンス、標準化されたインターフェース、自動化されたデータ検出、ドメイン間のシームレスな統合などが実現されている",
          en: "Advanced data mesh/fabric architecture is adopted organization-wide, with fully distributed data governance, standardized interfaces, automated data discovery, seamless integration between domains, etc. realized",
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
    id: "dm_16",
    category: "data_management",
    text: {
      ja: "データベーススキーマの変更や参照データの更新などをバージョン管理システム(例: Git)で管理し、自動テストを含むCI/CDパイプラインを通じて、安全かつ自動的に各環境(テスト、ステージング、本番)へ反映させる仕組み(データベースマイグレーションツール、例: Flyway, Liquibase等の活用を含む)が導入・運用されていますか？",
      en: "Have you implemented and are you operating a system to manage database schema changes and reference data updates in a version control system (e.g., Git) and reflect them safely and automatically to each environment (test, staging, production) through CI/CD pipelines including automated testing (including the use of database migration tools like Flyway, Liquibase, etc.)?",
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
      { questionId: "dm_5", minValue: 33 }, // Only show if dm_5 scored at least 33
    ],
    maturityLevel: "advanced",
    hasKnowledgeResource: true,
    knowledge: {
      ja: {
        summary:
          "データベース変更をCI/CDパイプラインに統合することで、アプリケーションコードとデータベーススキーマの一貫性を保ち、変更の自動化と検証を実現できます。",
        links: [
          {
            text: "データベースCI/CD",
            url: "https://www.red-gate.com/solutions/database-devops",
          },
          {
            text: "DB移行の自動化",
            url: "https://medium.com/@codewithalfredo/automating-data-seeding-migration-for-robust-ci-cd-pipelines-1d104109baca",
          },
        ],
      },
      en: {
        summary:
          "Integrating database changes into CI/CD pipelines maintains consistency between application code and database schemas, enabling automation and validation of changes.",
        links: [
          {
            text: "Database CI/CD",
            url: "https://www.red-gate.com/solutions/database-devops",
          },
          {
            text: "Automating DB Migrations",
            url: "https://medium.com/@codewithalfredo/automating-data-seeding-migration-for-robust-ci-cd-pipelines-1d104109baca",
          },
        ],
      },
    },
    options: [
      {
        value: 0,
        label: {
          ja: "データベース変更は手動で管理・適用され、バージョン管理やCI/CDプロセスは導入されていない",
          en: "Database changes are managed and applied manually, with no version control or CI/CD processes implemented",
        },
      },
      {
        value: 33,
        label: {
          ja: "データベース変更は基本的にバージョン管理されているが、本番環境への適用は手動で行われることが多い",
          en: "Database changes are basically version controlled, but application to production environment is often done manually",
        },
      },
      {
        value: 66,
        label: {
          ja: "データベース変更の大部分はバージョン管理され、CI/CDパイプラインを通じて適用されるが、複雑な変更や一部の環境では例外的に手動適用が行われる",
          en: "Most database changes are version controlled and applied through CI/CD pipelines, but complex changes or certain environments may exceptionally require manual application",
        },
      },
      {
        value: 100,
        label: {
          ja: "全てのデータベース変更が厳密にバージョン管理され、自動テストを含むCI/CDパイプラインを通じて全環境に安全に適用され、ロールバック機能も実装されている",
          en: "All database changes are strictly version controlled and safely applied to all environments through CI/CD pipelines including automated testing, with rollback capabilities also implemented",
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
