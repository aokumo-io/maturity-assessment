/**
 * @file language-switcher.tsx
 * @description 言語切り替えコンポーネント
 * 英語と日本語の切り替えを提供します。
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/FormLanguage';

interface LanguageSwitcherProps {
  variant?: 'default' | 'navbar' | 'footer';
  className?: string;
}

export function LanguageSwitcher({
  variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const { language, setLanguage, availableLanguages } = useLanguage();
    
  // Get the current language display name
  const currentLanguage = Object.values(availableLanguages).find(
    lang => lang.code === language
  );

  const handleLanguageChange = (langCode: string) => {
    // Ensure we update both the context state and the i18n instance
    setLanguage(langCode);
    i18n.changeLanguage(langCode);
    // Save to localStorage to ensure persistence
    localStorage.setItem('i18nextLng', langCode);
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'navbar':
        return 'text-sm bg-white text-gray-700 border-gray-200 hover:bg-gray-50';
      case 'footer':
        return 'text-sm bg-transparent text-gray-400 border-gray-700 hover:bg-gray-800';
      default:
        return 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`flex items-center space-x-1 ${getButtonStyles()} ${className}`}
          >
            <span>{currentLanguage?.native || language}</span>
            <Globe className="mr-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
        {Object.values(availableLanguages).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`flex items-center ${lang.code === language ? 'font-medium text-primary-600 bg-primary-50' : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className="mr-2">{lang.native}</span>
          </DropdownMenuItem>
        ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 