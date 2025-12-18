/**
 * @file index.ts
 * @description 知識コンテンツのインデックスファイル
 * 各カテゴリの知識コンテンツをインポートし、エクスポートします。
 * これにより、アプリケーション全体での知識コンテンツの一貫した管理が可能になります。
 */

import { knowledgeContent as applicationArchitecture } from './application_architecture';
import { knowledgeContent as aiMlIntegration } from './ai_ml_integration';
import { knowledgeContent as appMigrationModernization } from './app_migration_modernization';
import { knowledgeContent as businessValueStrategy } from './business_value_strategy';
import { knowledgeContent as cicdPractices } from './cicd_practices';
import { knowledgeContent as containerInfrastructure } from './container_infrastructure';
import { knowledgeContent as dataManagement } from './data_management';
import { knowledgeContent as doraMetrics } from './dora_metrics';
import { knowledgeContent as finopsCostManagement } from './finops_cost_management';
import { knowledgeContent as foundationsCulture } from './foundations_culture';
import { knowledgeContent as infrastructurePlatform } from './infrastructure_platform';
import { knowledgeContent as multicloudHybridGovernance } from './multicloud_hybrid_governance';
import { knowledgeContent as observability } from './observability';
import { knowledgeContent as operationsResilience } from './operations_resilience';
import { knowledgeContent as securityCompliance } from './security_compliance';

/**
 * @interface KnowledgeContent
 * @description 知識コンテンツの型定義
 */
export interface KnowledgeContent {
  [questionId: string]: {
    en: {
      explanation: string;
      examples?: string[];
      resources?: string[];
    };
    ja: {
      explanation: string;
      examples?: string[];
      resources?: string[];
    };
  };
}

/**
 * @interface CategoryKnowledge
 * @description カテゴリー別知識コンテンツのマップ
 */
export interface CategoryKnowledge {
  [category: string]: KnowledgeContent;
}

/**
 * @const knowledgeByCategory
 * @description カテゴリー別に整理された知識コンテンツ
 */
export const knowledgeByCategory: CategoryKnowledge = {
  application_architecture: applicationArchitecture,
  ai_ml_integration: aiMlIntegration,
  app_migration_modernization: appMigrationModernization,
  business_value_strategy: businessValueStrategy,
  cicd_practices: cicdPractices,
  container_infrastructure: containerInfrastructure,
  data_management: dataManagement,
  dora_metrics: doraMetrics,
  finops_cost_management: finopsCostManagement,
  foundations_culture: foundationsCulture,
  infrastructure_platform: infrastructurePlatform,
  multicloud_hybrid_governance: multicloudHybridGovernance,
  observability: observability,
  operations_resilience: operationsResilience,
  security_compliance: securityCompliance,
};

/**
 * @function getKnowledgeContent
 * @description 特定の質問ID用の知識コンテンツを取得します
 * @param {string} category - 質問のカテゴリ
 * @param {string} questionId - 質問ID
 * @returns {object|null} 知識コンテンツまたはnull（存在しない場合）
 */
export function getKnowledgeContent(category: string, questionId: string) {
  if (!knowledgeByCategory[category] || !knowledgeByCategory[category][questionId]) {
    return null;
  }
  
  return knowledgeByCategory[category][questionId];
}

export default knowledgeByCategory; 