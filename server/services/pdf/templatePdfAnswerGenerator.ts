
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../../utils/logger';
import { Assessment, AssessmentResponse, CategoryScore, Organization } from '@shared/schema';
import { t } from './pdfHelpers';

// テンプレートパスの定数
const TEMPLATE_DIR = path.resolve(process.cwd(), 'server/services/pdf/templates');
const MAIN_TEMPLATE = path.join(TEMPLATE_DIR, 'template-review.hbs');
const FONTS_DIR = path.resolve(process.cwd(), 'server/services/pdf/fonts');
const JS_DIR = path.join(TEMPLATE_DIR, 'js');

function registerHelpers() {
  // 等価比較ヘルパー
  Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });
  
  // 大なり比較ヘルパー
  Handlebars.registerHelper('gt', function(a, b) {
    return a > b;
  });
  
  // 小なりイコール比較ヘルパー
  Handlebars.registerHelper('lte', function(a,b) {
    return a <= b;
  });
  
  // 配列インデックス取得ヘルパー
  Handlebars.registerHelper('index_of', function(array, value) {
    return array.indexOf(value);
  });
  
  // 数値フォーマットヘルパー
  Handlebars.registerHelper('format_number', function(value) {
    return new Intl.NumberFormat().format(value);
  });
  
  // JSONシリアライズヘルパー
  Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
  });
  
  // 算術ヘルパー: 減算
  Handlebars.registerHelper('subtract', function(a, b) {
    return (Number(a) || 0) - (Number(b) || 0);
  });
  
  // 算術ヘルパー: 乗算
  Handlebars.registerHelper('multiply', function(a, b) {
    return (Number(a) || 0) * (Number(b) || 0);
  });
  
  // 算術ヘルパー: 加算
  Handlebars.registerHelper('add', function(a, b) {
    return (Number(a) || 0) + (Number(b) || 0);
  });
  
  // 算術ヘルパー: 除算
  Handlebars.registerHelper('divide', function(a, b) {
    const divisor = Number(b) || 1;
    return (Number(a) || 0) / divisor;
  });
  
  // 論理ヘルパー: AND
  Handlebars.registerHelper('and', function(a, b) {
    return a && b;
  });
  
  // 論理ヘルパー: NOT
  Handlebars.registerHelper('not', function(a) {
    return !a;
  });
  
  // 比較ヘルパー: 未満
  Handlebars.registerHelper('lt', function(a, b) {
    return (Number(a) || 0) < (Number(b) || 0);
  });
  
  // 比較ヘルパー: 以上
  Handlebars.registerHelper('gte', function(a, b) {
    return (Number(a) || 0) >= (Number(b) || 0);
  });
  
  // 算術ヘルパー: 絶対値
  Handlebars.registerHelper('abs', function(a) {
    return Math.abs(Number(a) || 0);
  });

  Handlebars.registerHelper('isObject', function (value: any) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  });

  // 文字列の先頭を大文字にするヘルパー
  Handlebars.registerHelper('capitalize', function(str: string) {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  
  Handlebars.registerHelper('length', function (str) {
    return str ? str.length : 0;
  });

}

async function loadTemplates() {
  try {
    // メインテンプレートを読み込む
    const templateContent = await fs.readFile(MAIN_TEMPLATE, 'utf-8');
    
    // パーシャルを登録（存在する場合）
    const partialsDir = path.join(TEMPLATE_DIR, 'partials');
    try {
      const files = await fs.readdir(partialsDir);
      for (const file of files) {
        if (file.endsWith('.hbs')) {
          const partialName = path.basename(file, '.hbs');
          const partialContent = await fs.readFile(path.join(partialsDir, file), 'utf-8');
          Handlebars.registerPartial(partialName, partialContent);
        }
      }
    } catch (err) {
      logger.warn('No partials directory found or error loading partials', err);
    }
    
    // テンプレートをコンパイル
    return Handlebars.compile(templateContent);
  } catch (error) {
    logger.error('Error loading templates:', error);
    throw error;
  }
}

function getHeaderHtml(language: string): string {
  const title = language === 'ja' 
    ? '評価レポート'
    : 'Assessment Report';
  
  const pageLabel = language === 'ja'
    ? 'ページ <span class="pageNumber"></span>/<span class="totalPages"></span>'
    : 'Page <span class="pageNumber"></span> of <span class="totalPages"></span>';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
      </style>
    </head>
    <body>
      <div style="width:100%; font-size:12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; padding-bottom:12px; border-bottom:1px solid #e5e7eb; padding: 0 1cm; font-family: Arial, sans-serif;">
        <span style="font-size: 20px; font-weight: 700; color: #3b82f6;">Aokumo AI</span>
        <div style="font-size: 12px; color: #6b7280; text-align: right; line-height: 1.3;">
          <div><strong>${title}</strong></div>
          <div>${pageLabel}</div>
        </div>
      </div>
    </body>
    </html>
  `;
}



export async function generateAnswerTemplatePDF(params: {
  assessmentResponse: {
    assessmentType: string;
    language: string;
    categories: any[];
    totalQuestions: number;
    answeredQuestions: number;
    assessmentTypeName?: string;
  };
  sessionId: string;
  language: string | 'en' | 'ja';
}): Promise<Buffer> {

  try {
    // デフォルト値を設定
    const language = params.language ?? 'en';
    logger.info(`Generating template-based PDF in ${language} language`);
    
    // ヘルパーを登録
    registerHelpers();
    
    // テンプレートをロードしてコンパイル
    const template = await loadTemplates();
    
    const getCategoryName = (categoryId: string, t: any): string => {
        return t(`${categoryId}.title`, language, {}, 'categories');
    };

    const getAssessmentTypeName = (assessmentType: string, t: any): string => {
        return t(`types.${assessmentType}`, language, {}, 'assessment');
    };

    // カテゴリー名を追加
    if (params.assessmentResponse && Array.isArray(params.assessmentResponse.categories)) {
        params.assessmentResponse.categories = params.assessmentResponse.categories.map(category => ({
            ...category,
            categoryName: getCategoryName(category.categoryId, t),
        }));
    }
    // Thêm assessmentTypeName vào assessmentResponse
    if (params.assessmentResponse) {
        params.assessmentResponse.assessmentTypeName = getAssessmentTypeName(params.assessmentResponse.assessmentType, t);
    }
    // データを準備
    const templateData = params;
    
    // HTMLをレンダリング
    const html = template(templateData);
    
    // デバッグ用にHTMLを保存（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      const debugDir = path.resolve(process.cwd(), 'debug');
      try {
        await fs.mkdir(debugDir, { recursive: true });
        await fs.writeFile(path.join(debugDir, 'template-output.html'), html);
        logger.debug(`Template HTML saved to ${path.join(debugDir, 'template-output.html')}`);
      } catch (err) {
        logger.warn('Could not save debug HTML:', err);
      }
    }
    
    // Puppeteerを起動
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      protocolTimeout: 60000, // 60 seconds
      timeout: 60000 // 60 seconds
    });
    
    try {
      // ページを作成してコンテンツを設定
      const page = await browser.newPage();
      
      // リソースのロードを待機するために長めのタイムアウトを設定
      await page.setDefaultNavigationTimeout(60000);
      await page.setDefaultTimeout(60000);
      
      // HTMLコンテンツを設定
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 60000
      });
      
      // ヘッダーHTMLを生成
      const headerHtml = getHeaderHtml(params.language);
      
      // PDFを生成
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '60px', right: '1cm', bottom: '40px', left: '1cm' },
        displayHeaderFooter: true,
        headerTemplate: headerHtml, // 空のヘッダー
        footerTemplate: `
          <div style="width: 100%; font-size: 8px; text-align: center; color: #666;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `
      });
      
      logger.info('Template-based PDF generation completed successfully');
      return Buffer.from(pdfBuffer);
    } finally {
      // ブラウザを閉じる（try-finallyで確実にクローズ）
      await browser.close();
    }
  } catch (error) {
    logger.error('Error in template-based PDF generation:', error);
    throw error;
  }
} 
