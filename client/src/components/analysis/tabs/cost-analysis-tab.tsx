/**
 * @file cost-analysis-tab.tsx
 * @description コスト分析タブコンポーネント
 * 成熟度評価に基づくコスト削減ポテンシャルの詳細な分析を表示します。
 */

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import type { CategoryScore } from "@shared/schema";
import { 
  fetchCostAnalysisFromServer,
  formatCurrency,
  type QuickWin, 
  type CostSavings 
} from "@/lib/costAnalysisService";
import { costAreaDisplayNames, costAreaDescriptions } from "@/lib/costImpactData";
import { logger } from '@/lib/logger';
import { translateCategory } from '@/lib/translationUtils';

// CostAreaCard component for displaying individual cost impact areas
function CostAreaCard({ 
  area, 
  value, 
  totalSavings, 
  currency 
}: { 
  area: string; 
  value: number; 
  totalSavings: number;
  currency: string;
}) {
  const { t, i18n } = useTranslation('results');
  
  logger.debug('[CostAreaCard] Rendering cost area card', { area, value, currency, language: i18n.language });
  
  // Calculate percentage of total savings
  const percentage = totalSavings > 0 ? Math.round((value / totalSavings) * 100) : 0;
  
  // Format the currency amount directly since server provides amounts in correct currency
  const formattedAmount = formatCurrency(value, currency);
  logger.debug('[CostAreaCard] Formatted amount', { amount: formattedAmount, original: value });
  
  // Get area display name and description
  const areaKey = area as keyof typeof costAreaDisplayNames;
  const displayName = t(`costAnalysis.costAreas.${areaKey}`, costAreaDisplayNames[areaKey]);
  const description = t(`costAnalysis.costAreaDescriptions.${areaKey}`, costAreaDescriptions[areaKey]);
  
  return (
    <Card className="shadow-md mb-4 border-0">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">{displayName}</h2>
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-0">
            {percentage}%
          </Badge>
        </div>
        
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">{t('costAnalysis.potentialSavings', 'Potential Savings')}</span>
          <span className="font-bold text-green-600">{formattedAmount}</span>
        </div>
        
        <Progress 
          value={percentage} 
          className="h-2 bg-gray-100"
        />
      </CardContent>
    </Card>
  );
}

// QuickWin component for displaying high-ROI opportunities
function QuickWinCard({ 
  quickWin, 
  currency 
}: { 
  quickWin: QuickWin;
  currency: string;
}) {
  const { t, i18n } = useTranslation(['results', 'common', 'assessment']);
  
  logger.debug('[QuickWinCard] Rendering quick win card', {
    category: quickWin.category,
    impact: quickWin.impact,
    currency,
    language: i18n.language
  });
  
  // Format impact as currency
  const formattedImpact = formatCurrency(quickWin.impact, currency);
  logger.debug('[QuickWinCard] Formatted impact amount', { 
    formattedImpact, 
    originalImpact: quickWin.impact 
  });
  
  // Get category display name using the standard translateCategory utility
  const categoryTitle = translateCategory(quickWin.category, t);
  
  // Calculate ROI stars using the percentile rank
  // Convert percentileRank (0-100) to star rating (1-5)
  // < 20% = 1 star, 20-40% = 2 stars, 40-60% = 3 stars, 60-80% = 4 stars, > 80% = 5 stars
  const getStarsFromPercentile = (percentile: number): number => {
    if (percentile < 20) return 1;
    if (percentile < 40) return 2;
    if (percentile < 60) return 3;
    if (percentile < 80) return 4;
    return 5;
  };
  
  // Calculate stars from percentile rank
  const roiRating = getStarsFromPercentile(quickWin.percentileRank);
  
  logger.debug('[QuickWinCard] ROI calculation', {
    percentileRank: quickWin.percentileRank,
    stars: roiRating
  });
  
  // Format complexity as text
  const complexityText = quickWin.complexity <= 3 
    ? t('costAnalysis.complexityLow', 'Low') 
    : quickWin.complexity <= 7 
      ? t('costAnalysis.complexityMedium', 'Medium') 
      : t('costAnalysis.complexityHigh', 'High');
  
  return (
    <Card className="shadow-md mb-4 border-0">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="font-semibold text-lg">{categoryTitle}</h2>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500 mr-2">
                {t('costAnalysis.currentScore', 'Current Score')}:
              </span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-0">
                {quickWin.score}
              </Badge>
              <span className="mx-2 text-gray-400">→</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-0">
                {quickWin.targetScore}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-600">{formattedImpact}</div>
            <div className="text-xs text-gray-500">
              {t('costAnalysis.potentialImpact', 'Potential Impact')}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {t('costAnalysis.complexity', 'Implementation Complexity')}
            </div>
            <div className="flex items-center">
              <Badge 
                variant="outline" 
                className={`
                  ${quickWin.complexity <= 3 ? 'bg-green-50 text-green-700 border-0' :
                    quickWin.complexity <= 7 ? 'bg-yellow-50 text-yellow-700 border-0' :
                    'bg-red-50 text-red-700 border-0'}
                `}
              >
                {complexityText}
              </Badge>
              <span className="ml-2 text-sm text-gray-500">{quickWin.complexity}/10</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {t('costAnalysis.roi', 'Return on Investment')}
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i}
                  className={`text-lg ${i < roiRating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3">
          <div className="text-sm text-gray-500 mb-1">
            {t('costAnalysis.primaryImpactArea', 'Primary Impact Area')}
          </div>
          <Badge 
            variant="outline" 
            className="bg-indigo-50 text-indigo-700 border-0"
          >
            {t(`costAnalysis.costAreas.${quickWin.primaryArea}`, quickWin.primaryArea)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface CostAnalysisTabProps {
  categoryScores: CategoryScore[];
}

export default function CostAnalysisTab({ categoryScores }: CostAnalysisTabProps) {
  const { t, i18n } = useTranslation(['results', 'common']);
  const [costAnalysis, setCostAnalysis] = useState<{
    costSavings: CostSavings;
    quickWins: QuickWin[];
    formattedTotal: string;
    currency: string;
    savingsPercentage: string;
  } | null>(null);
  
  useEffect(() => {
    if (categoryScores.length > 0) {
      logger.debug('[CostAnalysisTab] Requesting cost analysis', {
        language: i18n.language,
        scoresCount: categoryScores.length
      });
      
      // Use the server API instead of client calculation
      const fetchData = async () => {
        try {
          // Pass the current language to ensure proper currency formatting
          const analysis = await fetchCostAnalysisFromServer(categoryScores, i18n.language);
          
          logger.debug('[CostAnalysisTab] Analysis result', {
            currency: analysis.currency,
            formattedTotal: analysis.formattedTotal,
            savingsPercentage: analysis.savingsPercentage
          });
          
          setCostAnalysis(analysis);
        } catch (error) {
          logger.error('[CostAnalysisTab] Error fetching cost analysis', error);
          // In case of error, fallback is handled in fetchCostAnalysisFromServer
        }
      };
      
      fetchData();
    }
  }, [categoryScores, i18n.language]);
  
  // If all scores are knowledge gaps (-1), show appropriate UI
  const isAllKnowledgeGap = categoryScores.length > 0 && 
    categoryScores.every(cat => cat.score === -1);
  
  if (isAllKnowledgeGap) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle>{t('costAnalysis.title', 'Cost Impact Analysis')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="text-purple-500 mb-4">
              <i className="ri-question-mark-circle-line text-5xl"></i>
            </div>
            <h2 className="text-xl font-semibold mb-2">{t('costAnalysis.noDataTitle', 'Cannot Calculate Cost Impact')}</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {t('costAnalysis.noDataDescription', 'We need assessment data to calculate potential cost savings. Please complete the assessment with specific answers.')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Loading or no data state
  if (!costAnalysis) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle>{t('costAnalysis.title', 'Cost Impact Analysis')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { costSavings, quickWins, formattedTotal, currency, savingsPercentage } = costAnalysis;
  
  return (
    <Card className="shadow-md border-0">
      <CardHeader>
        <CardTitle>{t('costAnalysis.title', 'Cost Impact Analysis')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-gray-600">
            {t('costAnalysis.description', 'Estimated cost impact of improving cloud native maturity')}
          </p>
        </div>
        
        <div className="mb-8 p-4 bg-green-50 rounded-lg border-0">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                {t('costAnalysis.totalSavings', 'Total Potential Annual Savings')}
              </h3>
              <p className="text-sm text-green-700">
                {t('costAnalysis.savingsDescription', 'Based on closing maturity gaps across all categories')}
              </p>
            </div>
            <div className="text-right mt-3 md:mt-0">
              <div className="text-3xl font-bold text-green-700">
                {formattedTotal}
              </div>
              <div className="text-sm font-medium text-green-600">
                {savingsPercentage} {t('costAnalysis.ofTotalBaseline', 'of total baseline')}
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="areas" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="areas">{t('costAnalysis.impactAreas', 'Impact Areas')}</TabsTrigger>
            <TabsTrigger value="opportunities">{t('costAnalysis.quickWins', 'Quick Wins')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="areas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(costSavings)
                .filter(([key]) => !['total', 'confidence', 'confidenceFactors'].includes(key))
                .map(([area, value]) => (
                  <CostAreaCard 
                    key={area}
                    area={area}
                    value={value}
                    totalSavings={costSavings.total}
                    currency={currency}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="opportunities">
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                {t('costAnalysis.quickWinsDescription', 'Highest ROI improvement opportunities with immediate business impact')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickWins.map((quickWin, index) => (
                <QuickWinCard
                  key={`${quickWin.category}-${index}`}
                  quickWin={quickWin}
                  currency={currency}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-3 text-sm text-gray-500">
          <p className="mb-1">
            <i className="ri-information-line mr-1"></i>
            {t('costAnalysis.disclaimer', 'Estimates are based on industry benchmarks and your organization profile. Actual results may vary.')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 