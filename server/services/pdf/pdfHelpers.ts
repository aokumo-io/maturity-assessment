/**
 * PDF生成ヘルパー
 * 
 * PDFレポートに関連するユーティリティ関数を提供します。
 */

import { logger } from '../../utils/logger';
import path from 'path';
import fs from 'fs';
import { CategoryScore, Assessment, Organization } from '@shared/schema';

/**
 * PDF生成に必要なデータを抽出・整形する
 */
export interface PDFReportData {
  assessment: Assessment;
  organization?: Organization;
  categoryScores: CategoryScore[];
  recommendations: any[];
  sessionId: string;
}

// Locale cache for server-side translations
let localeCache: Record<string, Record<string, any>> = {};

/**
 * サーバーサイドでロケールファイルを読み込む
 * @param language 言語コード
 * @param namespace ネームスペース（例: 'categories', 'common'）
 * @returns ロケールデータ
 */
function loadLocale(language: string, namespace: string): Record<string, any> {
  const cacheKey = `${language}_${namespace}`;
  
  if (localeCache[cacheKey]) {
    return localeCache[cacheKey];
  }
  
  try {
    const localePath = path.resolve(process.cwd(), 'public', 'locales', language, `${namespace}.json`);
    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
    localeCache[cacheKey] = localeData;
    return localeData;
  } catch (error) {
    logger.warn(`Failed to load locale ${language}/${namespace}:`, error);
    return {};
  }
}

/**
 * 翻訳を取得するヘルパー関数
 * 
 * @param key 翻訳キー (dot notation, 'dashboard.title'など)
 * @param language 言語コード ('ja'または'en')
 * @param replacements パラメータ置換用オブジェクト
 * @param namespace 翻訳ネームスペース (resultsなど)
 * @returns 翻訳されたテキスト
 */
export function t(key: string, language: string = 'en', replacements: Record<string, string> = {}, namespace: string = 'results'): string {
  logger.debug(`Translation requested - Key: ${key}, Language: ${language}, Namespace: ${namespace}`);
  
  // First try to load from locale files
  const localeData = loadLocale(language, namespace);
  
  // Navigate through nested keys (e.g., 'dashboard.title')
  const keyParts = key.split('.');
  let translation: any = localeData;
  
  for (const part of keyParts) {
    if (translation && typeof translation === 'object' && part in translation) {
      translation = translation[part];
    } else {
      translation = null;
      break;
    }
  }
  
  // If translation found and it's a string, use it
  if (typeof translation === 'string') {
    // パラメータ置換
    if (replacements && Object.keys(replacements).length > 0) {
      translation = Object.entries(replacements).reduce(
        (text, [param, value]) => text.replace(new RegExp(`{{${param}}}`, 'g'), value),
        translation
      );
    }
    return translation;
  }
  
  // Fallback to English if Japanese translation not found
  if (language !== 'en') {
    const englishLocaleData = loadLocale('en', namespace);
    let englishTranslation: any = englishLocaleData;
    
    for (const part of keyParts) {
      if (englishTranslation && typeof englishTranslation === 'object' && part in englishTranslation) {
        englishTranslation = englishTranslation[part];
      } else {
        englishTranslation = null;
        break;
      }
    }
    
    if (typeof englishTranslation === 'string') {
      logger.debug(`Translation missing for key '${key}' in language '${language}', using English fallback`);
      // パラメータ置換
      if (replacements && Object.keys(replacements).length > 0) {
        englishTranslation = Object.entries(replacements).reduce(
          (text, [param, value]) => text.replace(new RegExp(`{{${param}}}`, 'g'), value),
          englishTranslation
        );
      }
      return englishTranslation;
    }
  }
  
  // Ultimate fallback: return key itself
  logger.debug(`Translation key '${key}' not found in any locale`);
  return key;
}

/**
 * アセスメントタイプからラベルを取得する
 */
export function getAssessmentTypeLabel(assessment: Assessment, language: string): string {
  const type = assessment.assessmentType || 'cloud-native';
  return t(`assessmentType.${type}`, language) || t('assessmentType.cloud-native', language);
}

/**
 * カテゴリ名を取得する
 */
export function getCategoryName(categoryId: string, language: string): string {
  const categoryData = loadLocale(language, 'categories');
  const category = categoryData[categoryId];
  
  if (category && typeof category === 'object' && 'title' in category) {
    return category.title;
  }
  
  // Fallback to English
  if (language !== 'en') {
    const englishCategoryData = loadLocale('en', 'categories');
    const englishCategory = englishCategoryData[categoryId];
    
    if (englishCategory && typeof englishCategory === 'object' && 'title' in englishCategory) {
      return englishCategory.title;
    }
  }
  
  // Ultimate fallback: format the categoryId
  return categoryId.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * 現在の日付をフォーマットする
 */
export function formatDate(date: Date, language: string): string {
  return date.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 