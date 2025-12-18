/**
 * @file pdfService.ts
 * @description PDFサービス
 * PDFの生成サービスを提供します。
 */

import { storage } from '../../storage';
import { logger } from '../../utils/logger';
import { Assessment, ImplementationRecommendation } from '@shared/schema';
import { generatePDF } from './pdfGenerator';
import { generateTemplatePDF } from './templatePdfGenerator';

/**
 * アセスメントPDFを生成する
 * @param sessionId セッションID
 * @param language 言語コード（ja/en）
 * @param useTemplate テンプレートPDFを使用するかどうか（デフォルト: true）
 * @returns 生成されたPDFのBuffer
 */
export async function generateAssessmentPDF(
  sessionId: string,
  language: string = 'en',
  useTemplate: boolean = true
): Promise<Buffer> {
  try {
    // アセスメントデータの取得
    const assessment = await storage.getCurrentAssessment(sessionId);
    if (!assessment) {
      throw new Error(`Assessment not found for session ID: ${sessionId}`);
    }

    // 組織データの取得（存在する場合）
    let organization = undefined;
    if (assessment.organizationId) {
      organization = await storage.getOrganization(assessment.organizationId, sessionId);
    }

    // カテゴリスコアの取得
    const categoryScores = await storage.getCategoryScores(sessionId);
    if (!categoryScores || categoryScores.length === 0) {
      throw new Error(`No category scores found for session ID: ${sessionId}`);
    }

    // クリティカルな問題の数をカウント
    const criticalIssuesCount = categoryScores.reduce((count, category) => {
      return count + (category.criticalIssues?.length || 0);
    }, 0);

    // PDFの生成（テンプレートPDFを優先、フォールバックで標準PDF）
    if (useTemplate) {
      // テンプレートベースのPDF生成（推奨）
      logger.info(`Generating template-based PDF for session ID: ${sessionId} in ${language}`);
      
      // アセスメントにクリティカル問題数を追加
      const enhancedAssessment = {
        ...assessment,
        criticalIssuesCount
      };
      
      return await generateTemplatePDF({
        assessment: enhancedAssessment,
        organization,
        categoryScores,
        sessionId,
        language
      });
    } else {
      // 標準PDF生成（レガシー）
      logger.info(`Generating standard PDF for session ID: ${sessionId} in ${language}`);
      
      // 推奨事項の取得（レガシーPDFジェネレーターで必要）
      const recommendations: ImplementationRecommendation[] = [];
      
      return await generatePDF({
        assessment,
        organization,
        categoryScores,
        recommendations,
        sessionId,
        language
      });
    }
  } catch (error) {
    logger.error(`Error generating PDF for session ${sessionId}:`, error);
    throw error;
  }
}

/**
 * PDFファイル名を生成する
 * @param sessionId セッションID
 * @param orgName 組織名
 * @param language 言語コード
 * @returns ファイル名
 */
export function generatePDFFilename(sessionId: string, orgName?: string, language: string = 'en'): string {
  const date = new Date().toISOString().slice(0, 10);
  
  // Create filename based on language with exact requested formats
  let baseFilename;
  if (language === 'ja') {
    baseFilename = `クラウドネイティブ成熟度評価レポート-${date}.pdf`;
  } else {
    baseFilename = `Cloud-Native-Assessment-Report-${date}.pdf`;
  }
  
  return baseFilename;
} 

/**
 * 質問PDFファイル名を生成する
 * @param language 言語コード
 * @returns ファイル名
 */
export function generatePDFQuestionFilename(language: string = 'en'): string {
  const date = new Date().toISOString().slice(0, 10);
  
  // Create filename based on language with exact requested formats
  let baseFilename;
  if (language === 'ja') {
    baseFilename = `クラウドネイティブ評価レビュー回答-${date}.pdf`;
  } else {
    baseFilename = `Cloud-Native-Assessment-Review-Responses-${date}.pdf`;
  }
  
  return baseFilename;
} 