/**
 * @file use-meta.ts
 * @description ルート変更時に自動的にメタタグを更新するためのReactフック
 * React hook for automatically updating meta tags on route and language changes
 */

import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { setPageMeta, setCategoryMeta, updateMetaForLanguageChange } from '@/utils/meta';

/**
 * ページのメタタグを自動的に更新するフック
 * Hook to automatically update page meta tags
 */
export function usePageMeta(customConfig?: { title?: string; description?: string }) {
  const [location] = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Extract the clean path without query parameters
    const cleanPath = location.split('?')[0];
    
    // Update meta tags for the current page
    setPageMeta(cleanPath, customConfig);
  }, [location, customConfig]);

  // Update meta tags when language changes
  useEffect(() => {
    const cleanPath = location.split('?')[0];
    updateMetaForLanguageChange(cleanPath);
  }, [i18n.language, location]);
}

/**
 * カテゴリーページのメタタグを自動的に更新するフック
 * Hook to automatically update category page meta tags
 */
export function useCategoryMeta(categoryId?: string, categoryTitle?: string) {
  const [location] = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (categoryId && categoryTitle) {
      setCategoryMeta(categoryId, categoryTitle);
    } else {
      // Fallback to regular page meta if category info not available
      const cleanPath = location.split('?')[0];
      setPageMeta(cleanPath);
    }
  }, [categoryId, categoryTitle, location]);

  // Update meta tags when language changes
  useEffect(() => {
    if (categoryId && categoryTitle) {
      setCategoryMeta(categoryId, categoryTitle);
    } else {
      const cleanPath = location.split('?')[0];
      updateMetaForLanguageChange(cleanPath);
    }
  }, [i18n.language, categoryId, categoryTitle, location]);
} 