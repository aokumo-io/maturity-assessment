/**
 * @file translationUtils.ts
 * @description 翻訳ユーティリティ関数
 * アプリケーション全体で使用される翻訳関連の共通機能を提供します。
 */

import { TFunction } from 'i18next';
import { ASSESSMENT_CATEGORIES } from './constants';

/**
 * カテゴリIDを翻訳する
 * 
 * @param categoryId カテゴリID
 * @param t 翻訳関数
 * @param namespace 翻訳ネームスペース (デフォルト: 'results')
 * @returns 翻訳されたカテゴリ名
 */
export const translateCategory = (categoryId: string, t: TFunction, namespace = 'results'): string => {
  // 特殊ケース: 'overall' の処理
  if (categoryId === 'overall') {
    return t(`${namespace}:categories.overall`, 'Overall');
  }

  // 翻訳を試みる
  const translated = t(`${namespace}:categories.${categoryId}`, '');
  
  // 翻訳が見つからない場合は constants からフォールバック
  if (!translated) {
    const category = ASSESSMENT_CATEGORIES.find(c => c.id === categoryId);
    return category?.title || categoryId;
  }
  
  return translated;
};

/**
 * 言語に基づいて日本固有のコンテンツを表示するかどうかを判断する
 * 
 * @param language 現在の言語コード
 * @returns 日本固有のコンテンツを表示するかどうか
 */
export const shouldShowJapanContent = (language: string): boolean => {
  return language === 'ja';
}; 