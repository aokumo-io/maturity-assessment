/**
 * 質問モジュール一覧
 * 
 * 各カテゴリごとの質問モジュールをまとめて提供します。
 * このファイルは全ての質問カテゴリをインポートし、統合されたアクセスポイントを提供します。
 */

import { AssessmentQuestion } from "@shared/schema";
import { foundationsCultureQuestions } from "./foundations_culture";
import { applicationArchitectureQuestions } from "./application_architecture";
import { cicdPracticesQuestions } from "./cicd_practices";
import { aiMlIntegrationQuestions } from "./ai_ml_integration";
import { appMigrationModernizationQuestions } from "./app_migration_modernization";
import { businessValueStrategyQuestions } from "./business_value_strategy";
import { containerInfrastructureQuestions } from "./container_infrastructure";
import { doraMetricsQuestions } from "./dora_metrics";
import { observabilityQuestions } from "./observability";
import { infrastructurePlatformQuestions } from "./infrastructure_platform";
import { multicloudHybridGovernanceQuestions } from "./multicloud_hybrid_governance";
import { securityComplianceQuestions } from "./security_compliance";
import { dataManagementQuestions } from "./data_management";
import { finopsCostManagementQuestions } from "./finops_cost_management";
import { operationsResilienceQuestions } from "./operations_resilience";

/**
 * 全カテゴリの質問を含むオブジェクト
 */
export const questionBank: Record<string, AssessmentQuestion[]> = {
  foundations_culture: foundationsCultureQuestions,
  application_architecture: applicationArchitectureQuestions,
  cicd_practices: cicdPracticesQuestions,
  ai_ml_integration: aiMlIntegrationQuestions,
  app_migration_modernization: appMigrationModernizationQuestions,
  business_value_strategy: businessValueStrategyQuestions,
  container_infrastructure: containerInfrastructureQuestions,
  dora_metrics: doraMetricsQuestions,
  observability: observabilityQuestions,
  infrastructure_platform: infrastructurePlatformQuestions,
  multicloud_hybrid_governance: multicloudHybridGovernanceQuestions,
  security_compliance: securityComplianceQuestions,
  data_management: dataManagementQuestions,
  finops_cost_management: finopsCostManagementQuestions,
  operations_resilience: operationsResilienceQuestions,
  // 他のカテゴリはここに追加
};

// ... 既存のコード