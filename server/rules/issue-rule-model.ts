/**
 * issue-rule-model.ts
 * モデルはCriticalIssuesの構造とルールの評価方法を定義します。
 * 各ルールは、質問の回答と組織プロファイルに基づいて評価されます。
 */

// Category ID type from existing application
export type CategoryId =
  | "foundations_culture"
  | "application_architecture"
  | "container_infrastructure"
  | "cicd_practices"
  | "dora_metrics"
  | "observability"
  | "security_compliance"
  | "infrastructure_platform"
  | "data_management"
  | "business_value_strategy"
  | "finops_cost_management"
  | "app_migration_modernization"
  | "operations_resilience"
  | "multicloud_hybrid_governance"
  | "ai_ml_integration";

// Localized text structure
export interface LocalisedString {
  en: string;
  ja: string;
}

// Organization profile from assessment data
export interface OrgProfile {
  industry?: string;
  size?: string;
  cloudProvider?: string[];
  region?: string;
  objectives?: string[];
  userRole?: string;
  [key: string]: any;
}

// Evaluation context for rule predicates
export interface EvalContext {
  answers: Record<string, number>;  // questionId ➜ 0-100 or -1
  profile: OrgProfile;              // industry, size, objectives, …
}

// Issue rule definition
export interface IssueRule {
  id: string;                       // unique for deduping / analytics
  categoryId: CategoryId;           // link to card
  questionIds: string[];            // which answers we look at
  severity: 1 | 2 | 3;              // 3 = show first
  predicate: (ctx: EvalContext) => boolean;
  text: LocalisedString;            // { en: "...", ja: "..." }
}

// Critical issue output format
export interface CriticalIssue {
  id: string;
  text: string;
  severity: number;
  categoryId: string;
}

// Helper functions for predicates
export const low  = (ans: number) => ans <= 33;
export const mid  = (ans: number) => ans > 33 && ans <= 66;
export const high = (ans: number) => ans > 66; 