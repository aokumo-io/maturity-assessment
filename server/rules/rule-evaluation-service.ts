/**
 * rule-evaluation-service.ts
 * 評価のためのユーティリティ関数と、アセスメント回答から評価コンテキストを作成するためのサービス
 */

import { AssessmentResponse, Assessment, Organization } from "@shared/schema";
import { evaluateIssues } from "./issue-rules";
import { OrgProfile, EvalContext, CriticalIssue } from "./issue-rule-model";

/**
 * アセスメント回答から質問IDごとのスコアを抽出する
 * @param responses アセスメント回答の配列
 * @returns 質問IDをキーとするスコアのマップ
 */
export function extractAnswersFromResponses(responses: AssessmentResponse[]): Record<string, number> {
  const answers: Record<string, number> = {};
  
  responses.forEach(response => {
    // Use score value, or -1 for "I don't know" responses
    answers[response.questionId] = response.dontKnow ? -1 : response.score;
  });
  
  return answers;
}

/**
 * Organization情報からプロファイルオブジェクトを作成する
 * @param organization 組織情報
 * @returns 評価に使用するプロファイル
 */
export function createProfileFromOrganization(organization?: Organization): OrgProfile {
  if (!organization) {
    return {};
  }
  
  return {
    industry: organization.industry,
    size: organization.companySize,
    cloudProvider: organization.cloudProviders ? [organization.cloudProviders.toString()] : [],
    region: organization.region,
    objectives: organization.businessObjectives ? [organization.businessObjectives] : [],
    userRole: organization.userRole || undefined
  };
}

/**
 * アセスメント回答から重要な問題を評価する
 * @param responses アセスメント回答の配列
 * @param organization 組織情報
 * @param language 言語設定
 * @returns 重要な問題のリスト
 */
export function evaluateCriticalIssues(
  responses: AssessmentResponse[],
  organization?: Organization,
  language: string = 'en'
): CriticalIssue[] {
  // Extract answers map from responses
  const answers = extractAnswersFromResponses(responses);
  
  // Create organization profile
  const profile = createProfileFromOrganization(organization);
  
  // Evaluate issues using the rules engine
  return evaluateIssues(answers, profile, language);
}

/**
 * カテゴリーごとの重要な問題を制限する
 * @param issues 重要な問題のリスト
 * @param maxPerCategory カテゴリーごとの最大問題数
 * @returns 絞り込まれた問題のリスト
 */
export function limitIssuesPerCategory(
  issues: CriticalIssue[],
  maxPerCategory: number = 3
): CriticalIssue[] {
  const issuesByCategory: Record<string, CriticalIssue[]> = {};
  
  // Group issues by category
  issues.forEach(issue => {
    if (!issuesByCategory[issue.categoryId]) {
      issuesByCategory[issue.categoryId] = [];
    }
    issuesByCategory[issue.categoryId].push(issue);
  });
  
  // Limit issues per category and flatten back to array
  return Object.values(issuesByCategory)
    .flatMap(categoryIssues => {
      // Sort by severity and then take the top maxPerCategory
      return categoryIssues
        .sort((a, b) => b.severity - a.severity)
        .slice(0, maxPerCategory);
    })
    // Final sort by severity for all issues
    .sort((a, b) => b.severity - a.severity);
} 