/**
 * @file i18n.ts
 * @description i18n設定ファイル
 * 国際化のためのi18nextの設定を行います。
 * 言語の検出、リソースのロード、フォールバック言語などを設定します。
 */

import i18next from 'i18next';
import { logger } from '@/lib/logger';

import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { startTransition } from 'react';

// Type definitions for resources
type ResourceLanguage = 'en' | 'ja';
type ResourceNamespace = 'common' | 'results' | 'assessment' | 'categories' | 'mindmap' | 'instructions' | 'organization' | 'businessObjectives' | 'cloudProviders' | 'industries' | 'questions';

// Removed direct imports of translation files
// Instead we will load all translations via HTTP backend

// Create a backend chain for HTTP loading
const backendOptions = {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
};

// Initialize i18next
i18next
  // Use browser language detector
  .use(LanguageDetector)
  // Use HTTP backend for loading translations
  .use(Backend)
  // Initialize react-i18next
  .use(initReactI18next)
  // Initialize configuration
  .init({
    // デフォルト言語
    fallbackLng: 'en',
    // 利用する言語のリスト
    supportedLngs: ['en', 'ja'],
    // 言語検出の順序
    load: 'languageOnly',
    // 開発モードでデバッグを無効化 (performance improvement)
    debug: false,
    // 翻訳のネームスペース
    ns: [
      'common',
      'assessment',
      'results',
      'categories',
      'mindmap',
      "instructions",
      'organization',
      'businessObjectives',
      'cloudProviders',
      'industries',
      'questions'
    ],
    defaultNS: 'common',
    // バックエンド設定
    backend: backendOptions,
    // URL parameter detection first, then localStorage, then navigator
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    },
    // 補間設定
    interpolation: {
      escapeValue: false, // Reactはすでにエスケープする
    },
    react: {
      useSuspense: false, // Disable suspense to prevent synchronous rendering issues
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span'],
    },
    // Ensure resources are loaded before app renders
    initImmediate: false,
    // Preload these namespaces to avoid missing key errors during initial render
    preload: ['en', 'ja'],
    // Add fallback values for not-yet-loaded namespaces
    fallbackNS: 'common',
    // Make it more tolerant of missing translations during initialization
    returnEmptyString: false,
    returnNull: false
  });

// Log initialization status
i18next.on('initialized', () => {
  logger.debug('i18next: initialized');
});

// Handle changes to avoid blocking the UI
i18next.on('languageChanged', (lng) => {
  startTransition(() => {
    // This will trigger re-rendering with the new language
  });
});

// Add error handling for failed resource loads
i18next.on('failedLoading', (lng, ns, msg) => {
  logger.error(`i18next: failed loading namespace [${lng}][${ns}]: ${msg}`);
});

export default i18next; 