/**
 * issue-rules.ts (v0.2 – 2025-05-12)
 * クラウドネイティブ成熟度評価のための重要な問題ルールを定義します。
 * 各ルールは、条件と対応するテキストを定義し、アセスメントの回答に基づいて評価されます。
 */

import { IssueRule, EvalContext, low, mid, high } from './issue-rule-model';

export const issueRules: IssueRule[] = [
/* ───────────── 1. FOUNDATIONS & CULTURE  ─────────────────────────── */
{
  id: 'fc_leadership_support',
  categoryId: 'foundations_culture',
  questionIds: ['fc_1'],                     // Leadership buy-in
  severity: 3,
  predicate: ({answers}) => low(answers.fc_1),
  text: {
    en: 'No leadership sponsorship for cloud-native initiatives',
    ja: 'クラウドネイティブ推進に対する経営層の後ろ盾がない'
  }
},
{
  id: 'fc_collaboration_silos',
  categoryId: 'foundations_culture',
  questionIds: ['fc_4'],                     // Cross-team collab
  severity: 2,
  predicate: ({answers}) => low(answers.fc_4),
  text: {
    en: 'Teams work in silos; collaboration patterns not defined',
    ja: '組織がサイロ化しており、明確なコラボレーションパターンがない'
  }
},
{
  id: 'fc_skill_gap',
  categoryId: 'foundations_culture',
  questionIds: ['fc_2', 'fc_3'],             // Training & hiring
  severity: 3,
  predicate: ({answers}) =>
    low(answers.fc_2) || low(answers.fc_3),
  text: {
    en: 'Significant skills gap in modern cloud / DevOps practices',
    ja: '最新クラウド・DevOps スキルに大きなギャップがある'
  }
},

/* ───────────── 2. BUSINESS VALUE & STRATEGY  ─────────────────────── */
{
  id: 'bvs_no_objectives',
  categoryId: 'business_value_strategy',
  questionIds: ['bvs_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.bvs_1),
  text: {
    en: 'No clear, measurable cloud-native business objectives',
    ja: '測定可能なクラウドネイティブのビジネス目標が定義されていない'
  }
},
{
  id: 'bvs_no_value_metrics',
  categoryId: 'business_value_strategy',
  questionIds: ['bvs_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.bvs_2),
  text: {
    en: 'Business value is not tracked against delivery metrics',
    ja: 'ビジネス価値がデリバリ指標と連動して追跡されていない'
  }
},
{
  id: 'bvs_it_business_misaligned',
  categoryId: 'business_value_strategy',
  questionIds: ['bvs_3'],
  severity: 2,
  predicate: ({answers}) => low(answers.bvs_3),
  text: {
    en: 'IT initiatives are not aligned with product / revenue goals',
    ja: 'IT 施策がプロダクトや収益目標と整合していない'
  }
},

/* ───────────── 3. APPLICATION ARCHITECTURE  ─────────────────────── */
{
  id: 'aa_monolith',
  categoryId: 'application_architecture',
  questionIds: ['aa_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.aa_1),
  text: {
    en: 'Monolithic architecture with no decomposition plan',
    ja: 'モノリシックなアーキテクチャで分割計画がない'
  }
},
{
  id: 'aa_config_hardcode',
  categoryId: 'application_architecture',
  questionIds: ['aa_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.aa_2),
  text: {
    en: 'Configuration is hard-coded; twelve-factor principles ignored',
    ja: '設定がハードコードされており、12factor 原則が守られていない'
  }
},
{
  id: 'aa_no_api_boundaries',
  categoryId: 'application_architecture',
  questionIds: ['aa_3'],
  severity: 2,
  predicate: ({answers}) => low(answers.aa_3),
  text: {
    en: 'Service/API boundaries undefined; tight coupling persists',
    ja: 'サービス/API の境界が不明確で、密結合のまま'
  }
},

/* ───────────── 4. APP MIGRATION & MODERNISATION  ────────────────── */
{
  id: 'mod_no_roadmap',
  categoryId: 'app_migration_modernization',
  questionIds: ['mod_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.mod_1),
  text: {
    en: 'No application modernisation roadmap or prioritisation',
    ja: 'アプリケーション近代化のロードマップ／優先順位付けがない'
  }
},
{
  id: 'mod_lift_shift_only',
  categoryId: 'app_migration_modernization',
  questionIds: ['mod_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.mod_2),
  text: {
    en: '"Lift-and-shift" dominates; refactoring is not planned',
    ja: 'リフト＆シフトのみで、リファクタリング計画がない'
  }
},
{
  id: 'mod_cutover_risk',
  categoryId: 'app_migration_modernization',
  questionIds: ['mod_3','mod_4'],
  severity: 2,
  predicate: ({answers}) => low(answers.mod_3) || low(answers.mod_4),
  text: {
    en: 'Cut-over/rollback strategy unclear; migration risk is high',
    ja: 'カットオーバー／ロールバック戦略が不明確でリスクが高い'
  }
},

/* ───────────── 5. CONTAINER INFRASTRUCTURE  ─────────────────────── */
{
  id: 'ci_no_scan',
  categoryId: 'container_infrastructure',
  questionIds: ['ci_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.ci_1),
  text: {
    en: 'Images not scanned for CVEs before deployment',
    ja: 'デプロイ前にコンテナイメージの CVE スキャンが行われていない'
  }
},
{
  id: 'ci_root_containers',
  categoryId: 'container_infrastructure',
  questionIds: ['ci_3'],
  severity: 2,
  predicate: ({answers}) => low(answers.ci_3),
  text: {
    en: 'Containers run as root; pod security standards unmet',
    ja: 'コンテナが root 権限で動作しており、セキュリティ標準を満たしていない'
  }
},
{
  id: 'ci_no_resources',
  categoryId: 'container_infrastructure',
  questionIds: ['ci_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.ci_2),
  text: {
    en: 'CPU / memory limits not set; risk of noisy-neighbour outages',
    ja: 'CPU／メモリ制限が設定されておらず、ノイジーネイバー障害のリスク'
  }
},
{
  id: 'ci_no_backup',
  categoryId: 'container_infrastructure',
  questionIds: ['ci_4'],
  severity: 1,
  predicate: ({answers}) => low(answers.ci_4),
  text: {
    en: 'No backup / restore plan for cluster state or volumes',
    ja: 'クラスタ状態やボリュームのバックアップ／リストア計画がない'
  }
},

/* ───────────── 6. CI/CD PRACTICES  ─────────────────────────────── */
{
  id: 'cicd_manual_deploy',
  categoryId: 'cicd_practices',
  questionIds: ['cicd_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.cicd_1),
  text: {
    en: 'Deployments are manual; no repeatable pipeline defined',
    ja: 'デプロイが手動で再現性のあるパイプラインがない'
  }
},
{
  id: 'cicd_no_tests',
  categoryId: 'cicd_practices',
  questionIds: ['cicd_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.cicd_2),
  text: {
    en: 'Automated tests absent or cover < 20 % of code-paths',
    ja: '自動テストがない、またはコードパスの 20% 未満しかカバーしていない'
  }
},
{
  id: 'cicd_secrets_in_repo',
  categoryId: 'cicd_practices',
  questionIds: ['cicd_3'],
  severity: 2,
  predicate: ({answers}) => low(answers.cicd_3),
  text: {
    en: 'Secrets / credentials stored in source-control',
    ja: 'シークレットや認証情報がソースコード管理内に保存されている'
  }
},

/* ───────────── 7. DORA METRICS  ─────────────────────────────────── */
{
  id: 'dora_low_deploy_freq',
  categoryId: 'dora_metrics',
  questionIds: ['dora_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.dora_1),
  text: {
    en: 'Deployment frequency less than monthly',
    ja: 'デプロイ頻度が月 1 回未満'
  }
},
{
  id: 'dora_long_lead_time',
  categoryId: 'dora_metrics',
  questionIds: ['dora_2'],
  severity: 3,
  predicate: ({answers}) => low(answers.dora_2),
  text: {
    en: 'Lead-time for changes exceeds one month',
    ja: '変更のリードタイムが 1 か月を超えている'
  }
},
{
  id: 'dora_high_cfr',
  categoryId: 'dora_metrics',
  questionIds: ['dora_3'],
  severity: 2,
  predicate: ({answers}) => low(answers.dora_3),
  text: {
    en: 'Change-failure rate above 45 %',
    ja: '変更失敗率が 45% を超えている'
  }
},

/* ───────────── 8. SECURITY & COMPLIANCE  ───────────────────────── */
{
  id: 'sc_no_vuln_scan',
  categoryId: 'security_compliance',
  questionIds: ['sc_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.sc_1),
  text: {
    en: 'No vulnerability-scanning integrated into pipelines',
    ja: 'パイプラインに脆弱性スキャンが統合されていない'
  }
},
{
  id: 'sc_no_policy_as_code',
  categoryId: 'security_compliance',
  questionIds: ['sc_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.sc_2),
  text: {
    en: 'Policy-as-Code not used; compliance checks are manual',
    ja: 'Policy as Code が導入されておらず、コンプライアンスチェックが手動'
  }
},
{
  id: 'sc_no_network_policies',
  categoryId: 'security_compliance',
  questionIds: ['sc_3'],
  severity: 2,
  predicate: ({answers}) => low(answers.sc_3),
  text: {
    en: 'Zero-trust / network segmentation not implemented',
    ja: 'ゼロトラストやネットワーク分割が実装されていない'
  }
},

/* ───────────── 9. INFRASTRUCTURE & PLATFORM  ───────────────────── */
{
  id: 'ip_manual_provision',
  categoryId: 'infrastructure_platform',
  questionIds: ['ip_1','ip_6'],
  severity: 3,
  predicate: ({answers}) => low(answers.ip_1) || low(answers.ip_6),
  text: {
    en: 'Infrastructure provisioned manually; IaC adoption is low',
    ja: 'インフラが手動プロビジョニングで IaC の採用率が低い'
  }
},
{
  id: 'ip_no_idp',
  categoryId: 'infrastructure_platform',
  questionIds: ['ip_8'],
  severity: 2,
  predicate: ({answers}) => low(answers.ip_8),
  text: {
    en: 'No self-service internal developer platform in place',
    ja: 'セルフサービス型の内部開発プラットフォームがない'
  }
},
{
  id: 'ip_no_dr',
  categoryId: 'infrastructure_platform',
  questionIds: ['ip_11'],
  severity: 2,
  predicate: ({answers}) => low(answers.ip_11),
  text: {
    en: 'Disaster-recovery & resilience objectives not defined',
    ja: 'ディザスタリカバリやレジリエンス目標が定義されていない'
  }
},

/* ───────────── 10. DATA MANAGEMENT  ────────────────────────────── */
{
  id: 'dm_no_backup',
  categoryId: 'data_management',
  questionIds: ['dm_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.dm_1),
  text: {
    en: 'No automated backup & restore for business-critical data',
    ja: 'ビジネスクリティカルなデータの自動バックアップ／リストアがない'
  }
},
{
  id: 'dm_no_classification',
  categoryId: 'data_management',
  questionIds: ['dm_7'],
  severity: 2,
  predicate: ({answers}) => low(answers.dm_7),
  text: {
    en: 'Data classification & lineage not in place',
    ja: 'データ分類とリネージ機能が整備されていない'
  }
},
{
  id: 'dm_manual_scaling',
  categoryId: 'data_management',
  questionIds: ['dm_5'],
  severity: 2,
  predicate: ({answers}) => low(answers.dm_5),
  text: {
    en: 'Database scaling is manual; risk of performance bottlenecks',
    ja: 'データベースのスケーリングが手動で、性能ボトルネックのリスク'
  }
},

/* ───────────── 11. OBSERVABILITY  ──────────────────────────────── */
{
  id: 'obs_no_monitoring',
  categoryId: 'observability',
  questionIds: ['obs_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.obs_1),
  text: {
    en: 'Critical workloads lack basic monitoring & alerting',
    ja: '重要ワークロードに基本的なモニタリング／アラートがない'
  }
},
{
  id: 'obs_no_central_logs',
  categoryId: 'observability',
  questionIds: ['obs_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.obs_2),
  text: {
    en: 'No central log aggregation or search in place',
    ja: 'ログの集中集約・検索基盤がない'
  }
},
{
  id: 'obs_no_sli_slo',
  categoryId: 'observability',
  questionIds: ['obs_3'],
  severity: 1,
  predicate: ({answers}) => low(answers.obs_3),
  text: {
    en: 'Service SLI/SLOs undefined; no user-centred health metrics',
    ja: 'サービスの SLI/SLO が定義されておらず、ユーザ中心の健全性指標がない'
  }
},

/* ───────────── 12. FINOPS / COST MANAGEMENT  ───────────────────── */
{
  id: 'finops_no_visibility',
  categoryId: 'finops_cost_management',
  questionIds: ['finops_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.finops_1),
  text: {
    en: 'Cloud spending visibility is missing; no show-back reports',
    ja: 'クラウド支出の可視化がなく、ショーバックレポートもない'
  }
},
{
  id: 'finops_unmanaged_provision',
  categoryId: 'finops_cost_management',
  questionIds: ['finops_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.finops_2),
  text: {
    en: 'Resource provisioning is uncontrolled; orphan workloads exist',
    ja: 'リソースプロビジョニングが管理されておらず、孤立ワークロードが存在'
  }
},
{
  id: 'finops_no_optimisation',
  categoryId: 'finops_cost_management',
  questionIds: ['finops_3'],
  severity: 2,
  predicate: ({answers}) => low(answers.finops_3),
  text: {
    en: 'No cost-optimisation tools or automated policies implemented',
    ja: 'コスト最適化ツールや自動ポリシーが導入されていない'
  }
},

/* ───────────── 13. OPERATIONS RESILIENCE  ─────────────────────── */
{
  id: 'ops_no_chaos',
  categoryId: 'operations_resilience',
  questionIds: ['ops_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.ops_2),
  text: {
    en: 'Chaos / failure-injection tests not performed',
    ja: 'カオス／障害注入テストが実施されていない'
  }
},
{
  id: 'ops_single_region',
  categoryId: 'operations_resilience',
  questionIds: ['ops_3'],
  severity: 3,
  predicate: ({answers}) => low(answers.ops_3),
  text: {
    en: 'Production runs in a single region; no multi-AZ fail-over',
    ja: '本番環境が単一リージョンで稼働しており、マルチ AZ フェイルオーバーなし'
  }
},
{
  id: 'ops_no_runbooks',
  categoryId: 'operations_resilience',
  questionIds: ['ops_1'],
  severity: 2,
  predicate: ({answers}) => low(answers.ops_1),
  text: {
    en: 'Incident run-books & auto-remediation scripts absent',
    ja: 'インシデント対応 Runbook や自動修復スクリプトが整備されていない'
  }
},

/* ───────────── 14. MULTICLOUD / HYBRID GOVERNANCE ─────────────── */
{
  id: 'mhg_no_policy_unification',
  categoryId: 'multicloud_hybrid_governance',
  questionIds: ['mhg_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.mhg_1),
  text: {
    en: 'No unified policy or IAM model across clouds',
    ja: 'クラウド間で統一されたポリシーや IAM モデルがない'
  }
},
{
  id: 'mhg_silo_teams',
  categoryId: 'multicloud_hybrid_governance',
  questionIds: ['mhg_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.mhg_2),
  text: {
    en: 'Separate teams manage each cloud provider (knowledge silos)',
    ja: 'クラウドごとに別チームが管理しており、知識がサイロ化している'
  }
},
{
  id: 'mhg_no_central_budget',
  categoryId: 'multicloud_hybrid_governance',
  questionIds: ['mhg_3'],
  severity: 1,
  predicate: ({answers}) => low(answers.mhg_3),
  text: {
    en: 'No central budget / cost controls for multi-cloud spend',
    ja: 'マルチクラウド費用に対する中央集約の予算・コスト管理がない'
  }
},

/* ───────────── 15. AI / ML INTEGRATION  ───────────────────────── */
{
  id: 'ai_no_mlops',
  categoryId: 'ai_ml_integration',
  questionIds: ['ai_1'],
  severity: 3,
  predicate: ({answers}) => low(answers.ai_1),
  text: {
    en: 'MLOps practices not established; model life-cycle unmanaged',
    ja: 'MLOps プラクティスが確立されておらず、モデルライフサイクルが管理されていない'
  }
},
{
  id: 'ai_manual_deploy',
  categoryId: 'ai_ml_integration',
  questionIds: ['ai_2'],
  severity: 2,
  predicate: ({answers}) => low(answers.ai_2),
  text: {
    en: 'AI models deployed manually; no canary or shadow testing',
    ja: 'AI モデルが手動デプロイで、カナリア／シャドウテストがない'
  }
},
{
  id: 'ai_no_monitoring',
  categoryId: 'ai_ml_integration',
  questionIds: ['ai_3'],
  severity: 2,
  predicate: ({answers}) => low(answers.ai_3),
  text: {
    en: 'Model accuracy / drift not monitored in production',
    ja: '本番環境でモデル精度やドリフトを監視していない'
  }
}
];

/**
 * 評価ルールを処理し、該当する問題を返す評価関数
 * @param answers 質問への回答
 * @param orgProfile 組織プロファイル
 * @param language 言語設定
 * @returns 評価結果（重要な問題のリスト）
 */
export function evaluateIssues(
  answers: Record<string, number>, 
  orgProfile: any = {}, 
  language: string = 'en'
): { id: string; text: string; severity: number; categoryId: string; }[] {
  const context: EvalContext = {
    answers,
    profile: orgProfile || {}
  };

  // Filter rules that match the criteria
  const matchingRules = issueRules.filter(rule => {
    // Check if we have answers for any of the questions
    const hasRelevantAnswers = rule.questionIds.some(qId => 
      answers[qId] !== undefined && answers[qId] !== null
    );
    
    // Only evaluate if we have relevant answers
    return hasRelevantAnswers && rule.predicate(context);
  });

  // Format and localize the matching rules
  return matchingRules
    .map(rule => ({
      id: rule.id,
      text: rule.text[language as keyof typeof rule.text] || rule.text.en,
      severity: rule.severity,
      categoryId: rule.categoryId
    }))
    .sort((a, b) => b.severity - a.severity); // Sort by severity, highest first
} 