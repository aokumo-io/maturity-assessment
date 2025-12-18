import { persistenceManager } from "@/lib/assessmentUtils";
import { logger } from '@/lib/logger';


export const AVAILABLE_LANGUAGES = {
  EN: { code: "en", name: "English", native: "English" },
  JA: { code: "ja", name: "Japanese", native: "日本語" },
};

export const DEFAULT_LANGUAGE = AVAILABLE_LANGUAGES.EN.code;

export function detectBrowserLanguage(): string {
  // Try to get the stored language from persistenceManager
  try {
    const storedLang = persistenceManager.loadFormData<string | null>("i18nextLng", null);
    if (storedLang) {
      const baseLang = storedLang.split("-")[0];
      const isSupported = Object.values(AVAILABLE_LANGUAGES).some(
        (lang: any) => lang.code === baseLang
      );
      if (isSupported) return baseLang;
    }
  } catch (error) {
    logger.error("Error loading language preference:", error);
  }

  // Fall back to browser language if no stored preference
  const browserLang = navigator.language.split("-")[0];
  const isBrowserLangSupported = Object.values(AVAILABLE_LANGUAGES).some(
    (lang: any) => lang.code === browserLang
  );

  return isBrowserLangSupported ? browserLang : DEFAULT_LANGUAGE;
}
