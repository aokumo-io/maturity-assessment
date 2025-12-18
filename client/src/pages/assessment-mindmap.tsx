import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import InteractiveMindMap from '@/components/assessment/interactive-mindmap';
import { useParams, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function AssessmentMindMap() {
  // Extract UUID from the URL if present - allows this component to work with or without session ID
  const { id } = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const { t } = useTranslation('mindmap');

  const handleBackToResults = () => {
    if (id) {
      navigate(`/results/${id}`);
    } else {
      // Fall back to non-UUID route for backward compatibility
      navigate("/results");
    }
  };

  // Add back button to actions
  const actions = (
    <Button 
      variant="outline" 
      onClick={handleBackToResults}
      className="flex items-center"
    >
      <i className="ri-arrow-left-line mr-2"></i>
      {t('navigation.backToResults', 'Back to Results')}
    </Button>
  );

  return (
    <AppLayout 
      title={t('pageTitle')}
      subtitle={t('pageSubtitle')}
      actions={actions}
    >
      <div className="p-6 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary-700 mb-2">{t('overview.title')}</h2>
          <p className="text-gray-600 mb-4">
            {t('overview.description')}
          </p>
          
          <div className="bg-primary-50 p-4 rounded-lg mb-6 border border-primary-100">
            <h3 className="text-lg font-medium text-primary-700 mb-2 flex items-center">
              <i className="ri-information-line mr-2 text-accent-500"></i>
              {t('instructions.title')}
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-1"></i>
                <span><strong>{t('common:actions.navigate', 'Navigate')}</strong>: {t('instructions.navigate')}</span>
              </li>
              <li className="flex items-start">
                <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-1"></i>
                <span><strong>{t('common:actions.explore', 'Explore')}</strong>: {t('instructions.explore')}</span>
              </li>
              <li className="flex items-start">
                <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-1"></i>
                <span><strong>{t('common:actions.interact', 'Interact')}</strong>: {t('instructions.interact')}</span>
              </li>
              <li className="flex items-start">
                <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-1"></i>
                <span><strong>{t('common:actions.controls', 'Controls')}</strong>: {t('instructions.controls')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mb-8">
          <InteractiveMindMap />
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-primary-700 mb-2">{t('personalization.title')}</h2>
            <p className="text-gray-600">
              {t('personalization.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-primary-700 mb-2 flex items-center">
                <i className="ri-settings-line mr-2 text-accent-500"></i>
                {t('personalization.customization.title')}
              </h3>
              <p className="text-gray-600 mb-3">
                {t('personalization.customization.description')}
              </p>
              <ul className="space-y-1 text-gray-700">
                <li className="flex items-start">
                  <i className="ri-arrow-right-s-line text-accent-500 mr-2 mt-1"></i>
                  <span>{t('personalization.customization.items.organizationSize')}</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-arrow-right-s-line text-accent-500 mr-2 mt-1"></i>
                  <span>{t('personalization.customization.items.maturityLevel')}</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-arrow-right-s-line text-accent-500 mr-2 mt-1"></i>
                  <span>{t('personalization.customization.items.businessPriorities')}</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-arrow-right-s-line text-accent-500 mr-2 mt-1"></i>
                  <span>{t('personalization.customization.items.assessmentDepth')}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-primary-700 mb-2 flex items-center">
                <i className="ri-file-chart-line mr-2 text-accent-500"></i>
                {t('personalization.results.title')}
              </h3>
              <p className="text-gray-600 mb-3">
                {t('personalization.results.description')}
              </p>
              <ul className="space-y-1 text-gray-700">
                <li className="flex items-start">
                  <i className="ri-arrow-right-s-line text-accent-500 mr-2 mt-1"></i>
                  <span>{t('personalization.results.items.maturityAnalysis')}</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-arrow-right-s-line text-accent-500 mr-2 mt-1"></i>
                  <span>{t('personalization.results.items.businessImpact')}</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-arrow-right-s-line text-accent-500 mr-2 mt-1"></i>
                  <span>{t('personalization.results.items.roadmap')}</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-arrow-right-s-line text-accent-500 mr-2 mt-1"></i>
                  <span>{t('personalization.results.items.benchmarking')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}