/**
 * @file meta.ts
 * @description 動的メタタグ管理のためのユーティリティ関数
 * Dynamic meta tag management utility for SEO optimization with i18n support
 */

import i18next from '@/lib/i18n';

/**
 * メタタグ設定のインターフェース
 * Interface for meta tag configuration
 */
interface MetaConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

/**
 * 多言語メタタグ設定
 * Multilingual meta tag configuration
 */
interface MultilingualMetaConfig {
  en: MetaConfig;
  ja: MetaConfig;
}

/**
 * デフォルトの多言語メタタグ設定
 * Default multilingual meta tag configuration
 */
const DEFAULT_META: MultilingualMetaConfig = {
  en: {
    title: "Cloud Native Maturity Assessment | Aokumo",
    description: "Evaluate your organization's cloud native adoption and get personalized recommendations for digital transformation with our comprehensive assessment tool.",
    keywords: "cloud native, maturity assessment, digital transformation, cloud adoption, DevOps, microservices, Kubernetes, containers, AWS, Azure, GCP",
    ogTitle: "Cloud Native Maturity Assessment | Aokumo",
    ogDescription: "Evaluate your organization's cloud native adoption and get personalized recommendations for digital transformation with our comprehensive assessment tool.",
    ogImage: "https://assessment.aokumo.io/images/og-image.png",
    canonical: "https://assessment.aokumo.io"
  },
  ja: {
    title: "クラウドネイティブ成熟度評価 | Aokumo",
    description: "組織のクラウドネイティブ導入レベルを評価し、デジタル変革のためのパーソナライズされた推奨事項を取得できる包括的な評価ツールです。",
    keywords: "クラウドネイティブ, 成熟度評価, デジタル変革, クラウド導入, DevOps, マイクロサービス, Kubernetes, コンテナ, AWS, Azure, GCP",
    ogTitle: "クラウドネイティブ成熟度評価 | Aokumo",
    ogDescription: "組織のクラウドネイティブ導入レベルを評価し、デジタル変革のためのパーソナライズされた推奨事項を取得できる包括的な評価ツールです。",
    ogImage: "https://assessment.aokumo.io/images/og-image-ja.png",
    canonical: "https://assessment.aokumo.io"
  }
};

/**
 * ページ固有の多言語メタタグ設定
 * Page-specific multilingual meta tag configurations
 */
const PAGE_META_CONFIGS: Record<string, MultilingualMetaConfig> = {
  "/": {
    en: {
      title: "Cloud Native Maturity Assessment | Aokumo",
      description: "Start your cloud native transformation journey with our comprehensive maturity assessment. Get personalized recommendations and roadmap.",
      canonical: "https://assessment.aokumo.io/"
    },
    ja: {
      title: "クラウドネイティブ成熟度評価 | Aokumo",
      description: "包括的な成熟度評価でクラウドネイティブ変革の旅を始めましょう。パーソナライズされた推奨事項とロードマップを取得できます。",
      canonical: "https://assessment.aokumo.io/"
    }
  },
  "/welcome": {
    en: {
      title: "Welcome | Cloud Native Maturity Assessment",
      description: "Welcome to the Cloud Native Maturity Assessment. Choose your assessment type and begin your cloud native transformation journey.",
      canonical: "https://assessment.aokumo.io/"
    },
    ja: {
      title: "ようこそ | クラウドネイティブ成熟度評価",
      description: "クラウドネイティブ成熟度評価へようこそ。評価タイプを選択して、クラウドネイティブ変革の旅を始めてください。",
      canonical: "https://assessment.aokumo.io/"
    }
  },
  "/instructions": {
    en: {
      title: "Instructions | Cloud Native Maturity Assessment",
      description: "Learn how to complete the cloud native maturity assessment and get the most accurate results for your organization.",
      canonical: "https://assessment.aokumo.io/"
    },
    ja: {
      title: "説明 | クラウドネイティブ成熟度評価",
      description: "クラウドネイティブ成熟度評価の完了方法を学び、組織にとって最も正確な結果を得る方法を理解してください。",
      canonical: "https://assessment.aokumo.io/"
    }
  },
  "/organization-info": {
    en: {
      title: "Organization Information | Cloud Native Assessment",
      description: "Provide your organization details to personalize your cloud native maturity assessment experience.",
      canonical: "https://assessment.aokumo.io/"
    },
    ja: {
      title: "組織情報 | クラウドネイティブ評価",
      description: "組織の詳細を入力して、クラウドネイティブ成熟度評価をパーソナライズしてください。",
      canonical: "https://assessment.aokumo.io/"
    }
  },
  "/assessment-mindmap": {
    en: {
      title: "Assessment Mindmap | Cloud Native Maturity Assessment",
      description: "Interactive visualization of the cloud native assessment process, modules, and analysis framework.",
      canonical: "https://assessment.aokumo.io/"
    },
    ja: {
      title: "評価マインドマップ | クラウドネイティブ成熟度評価",
      description: "クラウドネイティブ評価プロセス、モジュール、分析フレームワークのインタラクティブな可視化。",
      canonical: "https://assessment.aokumo.io/"
    }
  },
  "/review-responses": {
    en: {
      title: "Review Responses | Cloud Native Maturity Assessment",
      description: "Review and modify your assessment responses before submitting for analysis.",
      canonical: "https://assessment.aokumo.io/"
    },
    ja: {
      title: "回答の確認 | クラウドネイティブ成熟度評価",
      description: "分析のために送信する前に、評価の回答を確認し修正してください。",
      canonical: "https://assessment.aokumo.io/"
    }
  }
};

/**
 * カテゴリー別のメタタグ設定を生成
 * Generate meta tag configuration for assessment categories
 */
function getCategoryMetaConfig(categoryId: string, categoryTitle: string, language: 'en' | 'ja'): Partial<MetaConfig> {
  const baseUrl = 'https://assessment.aokumo.io';
  
  if (language === 'ja') {
    return {
      title: `${categoryTitle}評価 | クラウドネイティブ成熟度`,
      description: `包括的なクラウドネイティブ評価の一環として、組織の${categoryTitle.toLowerCase()}成熟度を評価してください。`,
      canonical: baseUrl
    };
  } else {
    return {
      title: `${categoryTitle} Assessment | Cloud Native Maturity`,
      description: `Evaluate your organization's ${categoryTitle.toLowerCase()} maturity as part of the comprehensive cloud native assessment.`,
      canonical: baseUrl
    };
  }
}

/**
 * 現在の言語を取得
 * Get current language from i18n
 */
function getCurrentLanguage(): 'en' | 'ja' {
  const currentLang = i18next.language || 'en';
  return currentLang.startsWith('ja') ? 'ja' : 'en';
}

/**
 * メタタグを更新する関数
 * Function to update meta tags
 */
export function updateMetaTags(config: Partial<MetaConfig>, path: string = '/'): void {
  const currentLang = getCurrentLanguage();
  const defaultConfig = DEFAULT_META[currentLang];
  const finalConfig = { ...defaultConfig, ...config };

  // タイトルを更新 / Update title
  if (finalConfig.title) {
    document.title = finalConfig.title;
  }

  // HTML lang属性を更新 / Update HTML lang attribute
  document.documentElement.lang = currentLang;

  // メタタグを更新 / Update meta tags
  updateMetaTag('description', finalConfig.description);
  updateMetaTag('keywords', finalConfig.keywords);
  
  // 言語メタタグを更新 / Update language meta tag
  updateMetaTag('language', currentLang);
  
  // Open Graph タグを更新 / Update Open Graph tags
  updateMetaProperty('og:title', finalConfig.ogTitle || finalConfig.title);
  updateMetaProperty('og:description', finalConfig.ogDescription || finalConfig.description);
  updateMetaProperty('og:image', finalConfig.ogImage);
  updateMetaProperty('og:url', finalConfig.canonical);
  updateMetaProperty('og:locale', currentLang === 'ja' ? 'ja_JP' : 'en_US');

  // Twitter Card タグを更新 / Update Twitter Card tags
  updateMetaProperty('twitter:title', finalConfig.ogTitle || finalConfig.title);
  updateMetaProperty('twitter:description', finalConfig.ogDescription || finalConfig.description);
  updateMetaProperty('twitter:image', finalConfig.ogImage);

  // カノニカルURLを更新 / Update canonical URL
  if (finalConfig.canonical) {
    updateCanonicalUrl(finalConfig.canonical);
  }

  // robots タグを更新 / Update robots tag
  if (finalConfig.noindex) {
    updateMetaTag('robots', 'noindex, nofollow');
  } else {
    updateMetaTag('robots', 'index, follow');
  }

  // hreflang タグを更新 / Update hreflang tags
  updateHreflangTags(path);
}

/**
 * 特定のメタタグを更新
 * Update specific meta tag
 */
function updateMetaTag(name: string, content?: string): void {
  if (!content) return;

  let metaTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.name = name;
    document.head.appendChild(metaTag);
  }
  metaTag.content = content;
}

/**
 * Open Graph や Twitter Card のプロパティを更新
 * Update Open Graph or Twitter Card properties
 */
function updateMetaProperty(property: string, content?: string): void {
  if (!content) return;

  let metaTag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('property', property);
    document.head.appendChild(metaTag);
  }
  metaTag.content = content;
}

/**
 * カノニカルURLを更新
 * Update canonical URL
 */
function updateCanonicalUrl(url: string): void {
  let linkTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!linkTag) {
    linkTag = document.createElement('link');
    linkTag.rel = 'canonical';
    document.head.appendChild(linkTag);
  }
  linkTag.href = url;
}

/**
 * hreflang タグを更新
 * Update hreflang tags for multilingual SEO
 */
function updateHreflangTags(path: string): void {
  // Remove existing hreflang tags
  const existingHreflangTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
  existingHreflangTags.forEach(tag => tag.remove());

  const baseUrl = 'https://assessment.aokumo.io';
  const languages = ['en', 'ja'];
  
  // Add hreflang tags for each language
  languages.forEach(lang => {
    const linkTag = document.createElement('link');
    linkTag.rel = 'alternate';
    linkTag.hreflang = lang;
    linkTag.href = `${baseUrl}${path}${path.includes('?') ? '&' : '?'}lang=${lang}`;
    document.head.appendChild(linkTag);
  });

  // Add x-default hreflang tag
  const defaultLinkTag = document.createElement('link');
  defaultLinkTag.rel = 'alternate';
  defaultLinkTag.hreflang = 'x-default';
  defaultLinkTag.href = `${baseUrl}${path}`;
  document.head.appendChild(defaultLinkTag);
}

/**
 * ページのメタタグを設定
 * Set meta tags for a specific page
 */
export function setPageMeta(path: string, customConfig?: Partial<MetaConfig>): void {
  const currentLang = getCurrentLanguage();
  const pageConfig = PAGE_META_CONFIGS[path]?.[currentLang] || {};
  const finalConfig = { ...pageConfig, ...customConfig };
  updateMetaTags(finalConfig, path);
}

/**
 * カテゴリーページのメタタグを設定
 * Set meta tags for category pages
 */
export function setCategoryMeta(categoryId: string, categoryTitle: string, customConfig?: Partial<MetaConfig>): void {
  const currentLang = getCurrentLanguage();
  const categoryConfig = getCategoryMetaConfig(categoryId, categoryTitle, currentLang);
  const finalConfig = { ...categoryConfig, ...customConfig };
  const path = `/assessment/${categoryId}`;
  updateMetaTags(finalConfig, path);
}

/**
 * メタタグをリセット
 * Reset meta tags to default
 */
export function resetMeta(): void {
  const currentLang = getCurrentLanguage();
  updateMetaTags(DEFAULT_META[currentLang]);
}

/**
 * 言語変更時のメタタグ更新
 * Update meta tags when language changes
 */
export function updateMetaForLanguageChange(path: string = '/'): void {
  setPageMeta(path);
} 