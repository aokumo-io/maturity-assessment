import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  tabs?: {
    id: string;
    label: string;
    active: boolean;
    onClick: () => void;
  }[];
  classHeader?: string;
}

export function Header({ classHeader, title, subtitle, actions, tabs}: HeaderProps) {
  const { t } = useTranslation();
  
  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className={`flex items-center justify-between h-16 px-6${classHeader ? ` ${classHeader}` : ''}`}>
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button type="button" className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>
        
        {/* Page title */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {actions ? (
            actions
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-primary-500 bg-primary-50 hover:bg-primary-100 border-primary-100"
              >
                <i className="ri-download-line mr-1"></i> {t('actions.export')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-secondary-700 bg-secondary-50 hover:bg-secondary-100 border-secondary-100"
              >
                <i className="ri-share-line mr-1"></i> {t('actions.share')}
              </Button>
              <div className="relative">
                <button className="flex items-center text-gray-500 hover:text-gray-700">
                  <i className="ri-more-2-fill text-xl"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="px-6 flex border-b border-gray-200">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                tab.active 
                  ? "text-[#145FD9] border-[#145FD9]" 
                  : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
              }`}
              onClick={tab.onClick}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;
