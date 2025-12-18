import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Logo from "@/components/logo";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cardStyles, textStyles } from "@/styles/card-styles";
import { usePageMeta } from "@/hooks/use-meta";

export default function Instructions() {
  const [, navigate] = useLocation();
  const { t } = useTranslation(['instructions', 'common']);

  // Enable dynamic meta tags that update with language changes
  usePageMeta();

  return (
    <div className="min-h-screen gradient-secondary flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <Logo className="inline-flex mb-6" />
          <h1 className="text-[3rem] font-[700] leading-[3.25rem] mb-4 text-primary-800">
            {t('page.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('page.subtitle')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="ri-information-line mr-2 text-accent-500"></i>
                {t('sections.beforeYouBegin.title')}
              </h3>
              <p className="text-base text-gray-600">
                {t('sections.beforeYouBegin.content')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="ri-user-3-line mr-2 text-accent-500"></i>
                {t('sections.whoShouldComplete.title')}
              </h3>
              <p className="text-base text-gray-600">
                {t('sections.whoShouldComplete.content')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="ri-time-line mr-2 text-accent-500"></i>
                {t('sections.timeCommitment.title')}
              </h3>
              <p className="text-base text-gray-600">
                {t('sections.timeCommitment.content')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="ri-lock-line mr-2 text-accent-500"></i>
                {t('sections.confidentiality.title')}
              </h3>
              <p className="text-base text-gray-600">
                {t('sections.confidentiality.content')}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="ri-question-answer-line mr-2 text-accent-500"></i>
                {t('sections.answerGuidelines.title')}
              </h3>
              <p className="text-base text-gray-600">
                {t('sections.answerGuidelines.content')}
              </p>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="border-[#294364] text-[#294364] hover:bg-gray-100"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              {t('actions.back')}
            </Button>
            <Button 
              onClick={() => navigate("/organization-info")}
              className="bg-accent-500 hover:bg-accent-600 text-white font-medium text-lg shadow h-11"
            >
              {t('actions.continue')}
              <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
