/**
 * PDF生成モジュール
 * 
 * PDFKitを使用してPDFレポートを生成します。
 */

import PDFDocument from 'pdfkit';
import { Assessment, CategoryScore, Organization, ImplementationRecommendation } from '@shared/schema';
import { t, getCategoryName, formatDate, getAssessmentTypeLabel } from './pdfHelpers';
import path from 'path';
import fs from 'fs';
import { logger } from '../../utils/logger';

// PDFで使用する色
const colors = {
  primary: '#1f60ab',    // プライマリーカラー（青）
  secondary: '#5a7e91',  // セカンダリーカラー（グレーブルー）
  text: '#333333',       // テキスト色
  lightText: '#666666',  // 薄いテキスト色
  background: '#ffffff'  // 背景色
};

// レポート生成のためのパラメータインターフェース
interface PDFGenerationParams {
  assessment: Assessment;
  organization?: Organization;
  categoryScores: CategoryScore[];
  recommendations: ImplementationRecommendation[];
  sessionId: string;
  language: string;
}

/**
 * PDFドキュメントを生成する
 * @param params PDF生成に必要なパラメータ
 * @returns 生成されたPDFのBuffer
 */
export async function generatePDF(params: PDFGenerationParams): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const { language } = params;
      const isJapanese = language === 'ja';

      logger.info(`Generating PDF in ${language} language`);
      
      // PDFドキュメントの作成
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        info: {
          Title: t('dashboard.title', language),
          Author: 'Aokumo Cloud Assessment Tool',
          Subject: t('basedOnAssessment', language, { 
            type: getAssessmentTypeLabel(params.assessment, language) 
          }),
          Keywords: 'cloud, assessment, maturity'
        }
      });

      // フォント設定
      setupFonts(doc, language);

      // PDFの生成結果をバッファに書き込む
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        logger.info('PDF generation completed successfully');
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', (err) => {
        logger.error('PDF generation error:', err);
        reject(err);
      });

      // レポートの生成
      generateReport(doc, params);
      
      // ドキュメントの終了
      doc.end();
    } catch (error) {
      logger.error('Error in PDF generation:', error);
      reject(error);
    }
  });
}

/**
 * PDFドキュメントのフォントを設定する
 * @param doc PDFドキュメント
 * @param language 言語コード
 */
function setupFonts(doc: PDFKit.PDFDocument, language: string): void {
  const isJapanese = language === 'ja';
  
  if (isJapanese) {
    try {
      // サービスディレクトリ内の固定フォントパスを使用
      const fontPath = path.resolve(process.cwd(), 'server/services/pdf/fonts/NotoSansJP-Regular.otf');
      
      logger.debug(`Using Japanese font at: ${fontPath}`);
      
      if (fs.existsSync(fontPath)) {
        const stats = fs.statSync(fontPath);
        if (stats.size === 0) {
          logger.warn('Japanese font file exists but is empty, using default font');
          return;
        }
        
        // フォントを登録して設定
        doc.registerFont('NotoSansJP', fontPath);
        doc.font('NotoSansJP');
        logger.info('Japanese font loaded successfully');
      } else {
        logger.warn(`Japanese font not found at ${fontPath}, using default font`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Error loading Japanese font: ${errorMessage}`);
    }
  }
}

/**
 * PDFレポートを生成する
 * @param doc PDFドキュメント
 * @param params PDF生成パラメータ
 */
function generateReport(doc: PDFKit.PDFDocument, params: PDFGenerationParams): void {
  const { language } = params;
  
  // カバーページ
  generateCoverPage(doc, params);
  
  // スコアページ
  doc.addPage();
  generateScorePage(doc, params);
  
  // 詳細結果ページ (新しく追加)
  doc.addPage();
  generateDetailedResultsPage(doc, params);
  
  // 推奨事項ページ
  if (params.recommendations.length > 0) {
    doc.addPage();
    generateRecommendationsPage(doc, params);
  }
  
  // ページナンバリング
  addPageNumbers(doc, language);
}

/**
 * カバーページを生成する
 * @param doc PDFドキュメント
 * @param params PDF生成パラメータ
 */
function generateCoverPage(doc: PDFKit.PDFDocument, params: PDFGenerationParams): void {
  const { assessment, organization, sessionId, language } = params;
  
  // レポートタイトル
  doc.fontSize(24)
     .fillColor(colors.primary)
     .text(t('dashboard.title', language), {
       align: 'center'
     })
     .moveDown(1);
  
  // アセスメントタイプ
  doc.fontSize(16)
     .fillColor(colors.secondary)
     .text(t('basedOnAssessment', language, { 
       type: getAssessmentTypeLabel(assessment, language) 
     }), {
       align: 'center'
     })
     .moveDown(2);

  // セッションID
  doc.fontSize(10)
     .fillColor(colors.lightText)
     .text(`${t('sessionId', language)}: ${sessionId}`, {
       align: 'center'
     })
     .moveDown(2);
  
  // 組織情報（存在する場合）
  if (organization) {
    doc.fontSize(14)
       .fillColor(colors.primary)
       .text(t('organization', language), {
         align: 'left'
       })
       .moveDown(0.5);
    
    // 組織詳細
    const details = [
      { label: t('industry', language), value: organization.industry },
      { label: t('companySize', language), value: organization.companySize },
      { label: t('region', language), value: organization.region },
      { label: t('cloudProviders', language), 
        value: Array.isArray(organization.cloudProviders) 
          ? organization.cloudProviders.join(', ')
          : String(organization.cloudProviders) }
    ];
    
    doc.fontSize(12)
       .fillColor(colors.text);
    
    details.forEach(({ label, value }) => {
      doc.text(`${label}: `, {
        continued: true
      });
      doc.text(`${value}`).moveDown(0.5);
    });
  }
  
  // 日付
  const currentDate = formatDate(new Date(), language);
  
  doc.fontSize(10)
     .fillColor(colors.lightText)
     .text(t('generatedDate', language, { date: currentDate }), 50, doc.page.height - 100, {
       align: 'center'
     });
  
  // 機密情報の注記
  doc.fontSize(8)
     .text(t('confidential', language), 50, doc.page.height - 50, {
       align: 'center',
       width: doc.page.width - 100
     });
}

/**
 * スコアページを生成する
 * @param doc PDFドキュメント
 * @param params PDF生成パラメータ
 */
function generateScorePage(doc: PDFKit.PDFDocument, params: PDFGenerationParams): void {
  const { categoryScores, language } = params;
  
  // ページタイトル
  doc.fontSize(18)
     .fillColor(colors.primary)
     .text(t('categoryScores.title', language), {
       align: 'center'
     })
     .moveDown(1);
  
  // テーブルヘッダー
  const tableTop = doc.y;
  const tableWidth = doc.page.width - 100;
  const colWidths = [tableWidth * 0.5, tableWidth * 0.2, tableWidth * 0.3];
  
  doc.fontSize(12)
     .fillColor(colors.secondary);
     
  doc.text(t('category', language), 50, tableTop);
  doc.text(t('score', language), 50 + colWidths[0], tableTop);
  doc.text(t('maturityLevel', language), 50 + colWidths[0] + colWidths[1], tableTop);
  
  // 区切り線
  doc.moveDown(0.5);
  const lineY = doc.y;
  doc.strokeColor(colors.secondary)
     .lineWidth(1)
     .moveTo(50, lineY)
     .lineTo(doc.page.width - 50, lineY)
     .stroke();
  
  doc.moveDown(0.5);
  
  // カテゴリスコアの表示
  categoryScores.forEach((score, index) => {
    // 新しいページが必要かチェック（残りスペースが少ない場合）
    if (doc.y > doc.page.height - 120) {
      doc.addPage();
      
      // 新しいページのヘッダー
      doc.fontSize(18)
         .fillColor(colors.primary)
         .text(t('categoryScores.title', language), {
           align: 'center'
         })
         .moveDown(1);
      
      // テーブルヘッダー再表示
      const newTableTop = doc.y;
      doc.fontSize(12)
         .fillColor(colors.secondary);
         
      doc.text(t('category', language), 50, newTableTop);
      doc.text(t('score', language), 50 + colWidths[0], newTableTop);
      doc.text(t('maturityLevel', language), 50 + colWidths[0] + colWidths[1], newTableTop);
      
      // 区切り線
      doc.moveDown(0.5);
      const newLineY = doc.y;
      doc.strokeColor(colors.secondary)
         .lineWidth(1)
         .moveTo(50, newLineY)
         .lineTo(doc.page.width - 50, newLineY)
         .stroke();
      
      doc.moveDown(0.5);
    }
    
    const rowY = doc.y;
    
    // カテゴリ名
    doc.fontSize(11)
       .fillColor(colors.text)
       .text(getCategoryName(score.categoryId, language), 50, rowY, {
         width: colWidths[0] - 10
       });
    
    // スコア値
    doc.text(score.score.toFixed(1), 50 + colWidths[0], rowY);
    
    // 成熟度レベル
    const maturityKey = `maturityLevels.${score.maturityLevel}`;
    doc.text(t(maturityKey, language), 50 + colWidths[0] + colWidths[1], rowY);
    
    doc.moveDown(1);
  });
}

/**
 * 詳細結果ページを生成する
 * @param doc PDFドキュメント
 * @param params PDF生成パラメータ
 */
function generateDetailedResultsPage(doc: PDFKit.PDFDocument, params: PDFGenerationParams): void {
  const { categoryScores, language } = params;
  
  // ページタイトル
  doc.fontSize(18)
     .fillColor(colors.primary)
     .text(t('detailedResults.title', language), {
       align: 'center'
     })
     .moveDown(1);
  
  // ここに詳細結果を表示するためのコードを追加
  // 例: カテゴリごとのより詳細な情報、グラフの説明など
  
  doc.fontSize(12)
     .fillColor(colors.text)
     .text(t('detailedResults.description', language))
     .moveDown(1);
  
  // カテゴリ別の詳細結果
  categoryScores.forEach((score, index) => {
    // 新しいページが必要かチェック（残りスペースが少ない場合）
    if (doc.y > doc.page.height - 200 && index < categoryScores.length - 1) {
      doc.addPage();
      
      doc.fontSize(18)
         .fillColor(colors.primary)
         .text(t('detailedResults.title', language), {
           align: 'center'
         })
         .moveDown(1);
    }
    
    // カテゴリ名
    doc.fontSize(14)
       .fillColor(colors.primary)
       .text(getCategoryName(score.categoryId, language))
       .moveDown(0.5);
    
    // スコアと成熟度レベル
    const maturityKey = `maturityLevels.${score.maturityLevel}`;
    doc.fontSize(12)
       .fillColor(colors.text)
       .text(`${t('score', language)}: ${score.score.toFixed(1)} (${t(maturityKey, language)})`)
       .moveDown(0.5);
    
    // カテゴリの説明や詳細情報を追加できます
    // 例えば、高スコアの場合と低スコアの場合で異なるアドバイスを表示など
    let detailText = '';
    if (score.score < 2.0) {
      detailText = t(`detailedResults.categories.${score.categoryId}.low`, language);
    } else if (score.score < 3.5) {
      detailText = t(`detailedResults.categories.${score.categoryId}.medium`, language);
    } else {
      detailText = t(`detailedResults.categories.${score.categoryId}.high`, language);
    }
    
    doc.text(detailText || '')
       .moveDown(1);
    
    // 区切り線（最後のアイテム以外）
    if (index < categoryScores.length - 1) {
      doc.strokeColor(colors.secondary)
         .lineWidth(0.5)
         .moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke()
         .moveDown(0.5);
    }
  });
}

/**
 * 推奨事項ページを生成する
 * @param doc PDFドキュメント
 * @param params PDF生成パラメータ
 */
function generateRecommendationsPage(doc: PDFKit.PDFDocument, params: PDFGenerationParams): void {
  const { recommendations, language } = params;
  
  // 上位の推奨事項のみを表示（最大5つ）
  const topRecommendations = recommendations.slice(0, 5);
  
  // ページタイトル
  doc.fontSize(18)
     .fillColor(colors.primary)
     .text(t('topRecommendations.title', language), {
       align: 'center'
     })
     .moveDown(1);
  
  // 説明
  doc.fontSize(12)
     .fillColor(colors.text)
     .text(t('topRecommendations.description', language))
     .moveDown(1);
  
  // 推奨事項の表示
  topRecommendations.forEach((rec, index) => {
    // 新しいページが必要かチェック（残りスペースが少ない場合）
    if (doc.y > doc.page.height - 200 && index < topRecommendations.length - 1) {
      doc.addPage();
      
      doc.fontSize(18)
         .fillColor(colors.primary)
         .text(t('topRecommendations.title', language), {
           align: 'center'
         })
         .moveDown(1);
    }
    
    // タイトル
    const title = typeof rec.title === 'object' && rec.title !== null
      ? (rec.title[language as keyof typeof rec.title] || (rec.title as any).en || '')
      : rec.title || '';
      
    doc.fontSize(14)
       .fillColor(colors.primary)
       .text(`${index + 1}. ${title}`)
       .moveDown(0.5);
    
    // 説明
    const description = typeof rec.description === 'object' && rec.description !== null
      ? (rec.description[language as keyof typeof rec.description] || (rec.description as any).en || '')
      : rec.description || '';
      
    doc.fontSize(12)
       .fillColor(colors.text)
       .text(description)
       .moveDown(0.5);
    
    // メタデータ
    doc.fontSize(10)
       .fillColor(colors.secondary)
       .text(`${t('impact', language)}: ${rec.impact} | ${t('effort', language)}: ${rec.effort} | ${t('implementation', language)}: ${rec.timeline}`)
       .moveDown(1);
    
    // 区切り線（最後のアイテム以外）
    if (index < topRecommendations.length - 1) {
      doc.strokeColor(colors.secondary)
         .lineWidth(0.5)
         .moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke()
         .moveDown(0.5);
    }
  });
  
  // 推奨事項がない場合
  if (topRecommendations.length === 0) {
    doc.fontSize(12)
       .fillColor(colors.text)
       .text('No recommendations available.', {
         align: 'center'
       });
  }
}

/**
 * ページナンバリングを追加する
 * @param doc PDFドキュメント
 * @param language 言語コード
 */
function addPageNumbers(doc: PDFKit.PDFDocument, language: string): void {
  try {
    // ドキュメントの総ページ数とページレンジを取得
    const range = doc.bufferedPageRange();
    const totalPages = range.count;
    
    logger.debug(`Adding page numbers to PDF: pageRange=${range.start}-${range.start + range.count - 1}, totalPages=${totalPages}`);
    
    // レンジの開始ページから終了ページまで処理
    for (let i = 0; i < totalPages; i++) {
      const pageIndex = range.start + i;
      try {
        doc.switchToPage(pageIndex);
        
        let pageText = '';
        if (language === 'ja') {
          pageText = `${i + 1} ${t('of', language)} ${totalPages}`;
        } else {
          pageText = `${t('page', language)} ${i + 1} ${t('of', language)} ${totalPages}`;
        }
        
        doc.fontSize(10)
           .fillColor(colors.lightText)
           .text(
             pageText,
             50,
             doc.page.height - 50,
             {
               align: 'center',
               width: doc.page.width - 100
             }
           );
      } catch (pageError: unknown) {
        const errorMessage = pageError instanceof Error ? pageError.message : String(pageError);
        logger.warn(`Error adding page number to page ${pageIndex}: ${errorMessage}`);
        // Continue with the next page
      }
    }
  } catch (error: unknown) {
    // Log error but don't throw - page numbers are not critical
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Error adding page numbers to PDF:', errorMessage);
  }
} 