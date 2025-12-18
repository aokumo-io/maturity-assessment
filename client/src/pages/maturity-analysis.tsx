import React, { useState, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import AppLayout from "@/components/layout/app-layout";
import ComparisonTab from "@/components/analysis/tabs/comparison-tab";
import OverviewTab from "@/components/analysis/tabs/overview-tab";
import CostAnalysisTab from "@/components/analysis/tabs/cost-analysis-tab";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Assessment, CategoryScore } from "@shared/schema";
import { calculateOverallPercentile, generatePositionText } from "@/lib/maturityPercentile";
import { useTranslation } from "react-i18next";
import { apiRequest } from '@/lib/queryClient';

export default function MaturityAnalysis() {
  const [activeTab, setActiveTab] = useState("overview");
  const { t, i18n } = useTranslation('common');
  const [, navigate] = useLocation();
  // Extract UUID from URL if present
  const { id } = useParams<{ id?: string }>();
  
  const queryClient = useQueryClient();
  
  // Fetch assessment data
  const { data: assessment, isLoading: isLoadingAssessment } = useQuery<Assessment>({
    queryKey: ["/api/assessment/current"],
  });
  

  // Get category scores
  const { data: categoryScores, isLoading: isLoadingScores } = useQuery({
    queryKey: ["/api/assessment/scores"],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/assessment/scores');
      if (!response.ok) {
        throw new Error(`Failed to fetch category scores: ${response.status}`);
      }
      return await response.json();
    },
    initialData: () => queryClient.getQueryData(["/api/assessment/scores"]),
  });

  // Calculate percentile
  const percentileData = useMemo(() => {
    if (!categoryScores || categoryScores.length === 0) {
      return { percentile: 0, ahead: '', top: '', isAboveMedian: false };
    }
    const percentile = calculateOverallPercentile(categoryScores);
    return generatePositionText(percentile, i18n.language);
  }, [categoryScores, i18n.language]);

  const tabs = [
    { id: "overview", label: t('analysis.tabs.overview') },
    { id: "industry", label: t('analysis.tabs.industry') },
    { id: "cost", label: t('analysis.tabs.cost') },
  ];

  const headerTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    active: activeTab === tab.id,
    onClick: () => setActiveTab(tab.id)
  }));
  
  // Handle navigation back to results
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
  
  if (isLoadingAssessment || isLoadingScores) {
    return (
      <AppLayout 
        title={t('analysis.title')}
        subtitle={t('analysis.loading')}
        actions={actions}
      >
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-80 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  if (!assessment || !categoryScores || categoryScores.length === 0) {
    return (
      <AppLayout 
        title={t('analysis.title')}
        subtitle={t('analysis.noData')}
        actions={actions}
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">
            <div className="text-5xl text-gray-300 mb-4">
              <i className="ri-bar-chart-box-line"></i>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t('analysis.noAnalysisAvailable')}</h2>
            <p className="text-gray-500">{t('analysis.pleaseCompleteAssessment')}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title={t('analysis.title')}
      tabs={headerTabs}
      actions={actions}
    >
      <div className="p-6 bg-gray-50">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab 
              categoryScores={categoryScores} 
              percentileData={percentileData} 
            />
          </TabsContent>
          
          <TabsContent value="industry" className="space-y-6">
            <ComparisonTab categoryScores={categoryScores} />
          </TabsContent>
          
          <TabsContent value="cost" className="space-y-6">
            <CostAnalysisTab categoryScores={categoryScores} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
