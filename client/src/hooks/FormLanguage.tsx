import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE,
  detectBrowserLanguage,
} from "./context";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  availableLanguages: typeof AVAILABLE_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  availableLanguages: AVAILABLE_LANGUAGES,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { i18n } = useTranslation();
  const [location] = useLocation();
  
  // Use a consistent key for language storage
  const LANGUAGE_STORAGE_KEY = 'i18nextLng';
  
  const getLanguageFromURL = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && Object.values(AVAILABLE_LANGUAGES).some((l: any) => l.code === langParam)) {
      return langParam;
    }
    
    return null;
  };
  
  const getInitialLanguage = () => {
    if (typeof window !== "undefined") {
      // Check URL first
      const urlLang = getLanguageFromURL();
      if (urlLang) return urlLang;
      
      // Then localStorage  
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLang) {
        const baseLang = savedLang.split('-')[0];
        if (Object.values(AVAILABLE_LANGUAGES).some((l: any) => l.code === baseLang)) {
          return baseLang;
        }
      }
    }
    return detectBrowserLanguage();
  };

  const [language, setLanguageState] = useState<string>(getInitialLanguage);

  const setLanguage = (lang: string) => {
    if (Object.values(AVAILABLE_LANGUAGES).some((l: { code: string }) => l.code === lang)) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
      setLanguageState(lang);
      i18n.changeLanguage(lang);
    }
  };
  
  // Check for URL parameter changes
  useEffect(() => {
    const urlLang = getLanguageFromURL();
    if (urlLang && urlLang !== language) {
      setLanguage(urlLang);
    }
  }, [location]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, availableLanguages: AVAILABLE_LANGUAGES }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
