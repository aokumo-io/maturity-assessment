/**
 * @file comparison-tab.tsx
 * @description インダストリー比較タブ
 * 業界ベンチマークとのスコア比較を表示します。
 */

import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { ASSESSMENT_CATEGORIES } from '@/lib/constants';
import { categoryBenchmarks, getCompanyIconName, CategoryBenchmarkData } from '@/lib/benchmarkData';
import type { CategoryScore } from '@shared/schema';
import { compareWithIndustry } from '@/lib/assessmentUtils';
import { useTranslation } from 'react-i18next';
import { translateCategory, shouldShowJapanContent } from '@/lib/translationUtils';

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  const { t, i18n } = useTranslation('results');
  const currentLanguage = i18n.language;
  const showJapanContent = shouldShowJapanContent(currentLanguage);
  
  if (active && payload && payload.length) {
    // Find the corresponding data item
    const data = payload[0].payload;
    
    // Calculate the gap
    const gap = data.industryLeaders - data.yourScore;
    const gapPercentage = Math.round((gap / data.industryLeaders) * 100);
    
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md" style={{ minWidth: "240px" }}>
        <h4 className="font-bold text-base mb-2">{data.category}</h4>
        <div className="space-y-0.5">
          <p className="text-sm">{t('comparisonTab.tooltip.yourScore')}: <span className="font-medium text-blue-800">{data.yourScore}</span></p>
          <p className="text-sm">{t('comparisonTab.tooltip.industryMedian')}: <span className="text-gray-700">{data.industryAvg}</span></p>
          <p className="text-sm">{t('comparisonTab.tooltip.industryLeader')}: <span className="font-medium text-green-600">{data.industryLeaders}</span></p>
          <p className="text-sm text-red-600 mt-1">{t('comparisonTab.tooltip.gapToLeader')}: {gap} {t('comparisonTab.tooltip.points')} ({gapPercentage}{t('comparisonTab.tooltip.gapPercentage')})</p>
        </div>
        {(showJapanContent || data.globalLeader) && (
          <div className="border-t mt-2 pt-2">
            {showJapanContent && data.japanLeader && (
              <p className="text-sm">{t('comparisonTab.tooltip.japanLeader')}: {data.japanLeader}</p>
            )}
            {data.globalLeader && (
              <p className="text-sm">{t('comparisonTab.tooltip.globalLeader')}: {data.globalLeader}</p>
            )}
            <p className="text-xs text-gray-600 mt-1">{data.keyInsight || "Industry benchmarks indicate significant adoption variation"}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

interface ComparisonTabProps {
  categoryScores: CategoryScore[];
}

// Define types for our chart data
interface ChartItem {
  category: string;
  yourScore: number;
  industryAvg: number;
  industryLeaders: number;
  id: string;
  japanLeader?: string;
  globalLeader?: string;
  description?: string;
  keyInsight?: string;
}

interface BenchmarkItem extends ChartItem {
  japanLeader: string;
  globalLeader: string;
  description: string;
  keyInsight: string;
  gap: number;
  gapPercentage: string;
}

/**
 * Industry comparison tab component
 * Displays detailed industry benchmark comparisons using:
 * 1. Main comparison chart - showing your org vs industry average and leaders
 * 2. Gap analysis chart - showing biggest gaps to industry leaders
 * 3. Leader reference models - showing examples from Japanese and global leaders
 * 4. Detailed comparison table - comprehensive data for all categories
 */
export function ComparisonTab({ categoryScores }: ComparisonTabProps) {
  // State to track whether to show all categories
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllReferenceModels, setShowAllReferenceModels] = useState(false);
  const { t, i18n } = useTranslation(['results', 'assessment']);
  const currentLanguage = i18n.language;
  const showJapanContent = shouldShowJapanContent(currentLanguage);
  
  // Get industry comparison data using the unified data source in assessmentUtils
  const comparisonData = useMemo(() => {
    return compareWithIndustry(categoryScores);
  }, [categoryScores]);
  
  // Create mapping between category IDs and titles for reference
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    ASSESSMENT_CATEGORIES.forEach(cat => {
      map[cat.id] = translateCategory(cat.id, t, 'assessment');
    });
    return map;
  }, [t]);
  
  // Create category ID to benchmark data mapping for efficient lookups
  const benchmarkMap = useMemo(() => {
    const map: Record<string, CategoryBenchmarkData> = {};
    
    // Map benchmark data directly to category IDs using the categoryId field
    categoryBenchmarks.forEach(benchmark => {
      map[benchmark.categoryId] = benchmark;
    });
    
    return map;
  }, []);
  
  if (!comparisonData || !benchmarkMap) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{t('comparisonTab.error.failedToLoad', 'Failed to load comparison data')}</p>
          <p className="text-gray-600">{t('comparisonTab.error.tryRefresh', 'Please try refreshing the page.')}</p>
        </div>
      </div>
    );
  }
  
  // Generate chart data in the format required by Recharts
  const mainChartData = useMemo(() => {
    // Add the Overall data
    const data: ChartItem[] = [{
      category: translateCategory('overall', t, 'assessment'),
      yourScore: comparisonData.overallComparison.org,
      industryAvg: comparisonData.overallComparison.avg,
      industryLeaders: comparisonData.overallComparison.leaders,
      id: 'overall',
      japanLeader: showJapanContent ? 'Top Japanese Companies' : '',
      globalLeader: 'Global Leaders',
      description: 'Cross-category implementation excellence',
      keyInsight: 'Industry leaders demonstrate consistent excellence across all cloud native dimensions'
    }];
    
    // Add data for each category
    ASSESSMENT_CATEGORIES.forEach(cat => {
      const comparison = comparisonData.categoryComparisons[cat.id];
      if (comparison) {
        // Find benchmark data for this category to get leader information
        const benchmark = benchmarkMap[cat.id];
        
        // Get translated description and keyInsight if available
        const translatedDescription = t(`benchmarkDescriptions.${cat.id}.description`, { 
          defaultValue: benchmark?.description || 'Industry-leading implementation'
        });
        const translatedKeyInsight = t(`benchmarkDescriptions.${cat.id}.keyInsight`, {
          defaultValue: benchmark?.keyInsight || 'Industry benchmarks indicate significant adoption variation'
        });
        
        data.push({
          category: translateCategory(cat.id, t, 'assessment'),
          yourScore: comparison.org,
          industryAvg: comparison.avg,
          industryLeaders: comparison.leaders,
          id: cat.id,
          japanLeader: showJapanContent ? benchmark?.japanLeader || 'Japanese Leader' : '',
          globalLeader: benchmark?.globalLeader || 'Global Leader',
          description: translatedDescription,
          keyInsight: translatedKeyInsight
        });
      }
    });
    
    // Limit to first 6 items (Overall + 5 categories)
    const MAX_CHART_ITEMS = 15;
    return data.slice(0, MAX_CHART_ITEMS);
  }, [comparisonData, benchmarkMap, showJapanContent, t]);
  
  // Create detailed data with benchmark information for all categories
  const detailedBenchmarkData = useMemo<BenchmarkItem[]>(() => {
    // Start with overall data
    const overallData: BenchmarkItem = {
      category: translateCategory('overall', t, 'assessment'),
      yourScore: comparisonData.overallComparison.org,
      industryAvg: comparisonData.overallComparison.avg,
      industryLeaders: comparisonData.overallComparison.leaders,
      id: 'overall',
      japanLeader: showJapanContent ? 'Top Japanese Companies' : '',
      globalLeader: 'Global Leaders',
      description: 'Cross-category implementation excellence',
      keyInsight: 'Industry leaders demonstrate consistent excellence across all cloud native dimensions',
      gap: comparisonData.overallComparison.leaders - comparisonData.overallComparison.org,
      gapPercentage: (((comparisonData.overallComparison.leaders - comparisonData.overallComparison.org) / comparisonData.overallComparison.leaders) * 100).toFixed(1)
    };
    
    // Add data for all categories in the order defined by ASSESSMENT_CATEGORIES
    const categoryData = ASSESSMENT_CATEGORIES.map(cat => {
      const comparison = comparisonData.categoryComparisons[cat.id];
      if (!comparison) return null;
      
      // Find benchmark data for this category
      const benchmark = benchmarkMap[cat.id];
      
      // Get translated description and keyInsight if available
      const translatedDescription = t(`benchmarkDescriptions.${cat.id}.description`, { 
        defaultValue: benchmark?.description || 'Industry-leading implementation'
      });
      const translatedKeyInsight = t(`benchmarkDescriptions.${cat.id}.keyInsight`, {
        defaultValue: benchmark?.keyInsight || 'Industry benchmarks indicate significant adoption variation'
      });
      
      // Prepare the data
      const gap = comparison.leaders - comparison.org;
      const gapPercentage = ((gap / comparison.leaders) * 100).toFixed(1);
      
      return {
        category: translateCategory(cat.id, t, 'assessment'),
        yourScore: comparison.org,
        industryAvg: comparison.avg,
        industryLeaders: comparison.leaders,
        id: cat.id,
        japanLeader: showJapanContent ? benchmark?.japanLeader || 'Japanese Leader' : '',
        globalLeader: benchmark?.globalLeader || 'Global Leader',
        description: translatedDescription,
        keyInsight: translatedKeyInsight,
        gap,
        gapPercentage
      };
    }).filter((item): item is BenchmarkItem => item !== null);
    
    // Combine overall + categories
    return [overallData, ...categoryData];
  }, [comparisonData, benchmarkMap, showJapanContent, t]);
  
  // Generate data for the gap analysis chart - filter out Overall, sort by gap size, take top 8
  const gapAnalysisData = useMemo(() => {
    return detailedBenchmarkData
      .filter(item => item.id !== 'overall')
      .map(item => {
        // For diverging chart: negative values go left (over-performance), positive go right (gaps)
        const isOverPerformer = item.gap <= 0;
        const displayGap = isOverPerformer ? item.gap : item.gap; // Keep actual values
        
        return {
          ...item,
          gap: displayGap,
          isOverPerformer,
          overPerformanceGap: isOverPerformer ? Math.abs(displayGap) : 0, // Positive value for left side
          improvementGap: !isOverPerformer ? displayGap : 0, // Positive value for right side
          gapLabel: isOverPerformer ? `+${Math.abs(displayGap)}` : `${displayGap}`
        };
      })
      .sort((a, b) => {
        // Sort by absolute gap size (largest gaps first, regardless of direction)
        return Math.abs(b.gap) - Math.abs(a.gap);
      });
  }, [detailedBenchmarkData]);

  // Calculate the maximum absolute value for symmetric chart domain
  const maxAbsoluteGap = useMemo(() => {
    const maxGap = Math.max(...gapAnalysisData.map(item => Math.abs(item.gap)));
    return Math.ceil(maxGap / 10) * 10; // Round up to nearest 10
  }, [gapAnalysisData]);

  // Custom legend style with increased spacing between items
  const legendWrapperStyle = {
    paddingTop: '15px',
    paddingBottom: '10px',
    display: 'flex',
    justifyContent: 'center',
    gap: '30px', // Increases spacing between legend items
    fontSize: '14px' // Sets the font size to 14px
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main comparison chart */}
      <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('comparisonTab.mainChart')}</h2>
        </div>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mainChartData}
              aria-label={t('comparisonTab.chartAriaLabel')}
              role="img"
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              barSize={30}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="category" 
                angle={-20} 
                textAnchor="end" 
                height={70} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]} 
                ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                tickFormatter={(value) => `${value}%`}
                interval={0}
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                minTickGap={0}
                label={{ 
                  value: t('comparisonTab.maturityLabel', 'Maturity'), 
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                iconType="circle" 
                align="center"
                wrapperStyle={legendWrapperStyle}
              />
              <Bar dataKey="yourScore" name={t('comparisonTab.legend.yourOrg')} fill="#1e40af" radius={[3, 3, 0, 0]} />
              <Bar dataKey="industryAvg" name={t('comparisonTab.legend.industryAvg')} fill="#94a3b8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="industryLeaders" name={t('comparisonTab.legend.industryLeaders')} fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Gap Analysis */}
      <div className={`bg-white p-6 rounded-lg shadow-md ${showAllReferenceModels ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
        <h2 className="text-xl font-bold mb-4">{t('comparisonTab.gapAnalysis')}</h2>
        
        {/* Legend for diverging chart */}
        <div className="flex justify-center mb-3 text-sm">
          <div className="flex items-center mr-6">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600">{t('comparisonTab.legend.exceedsLeader', 'Exceeds Leader')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-600">{t('comparisonTab.legend.gapToLeader')}</span>
          </div>
        </div>
        
        <div className={`w-full ${showAllReferenceModels ? 'h-[450px]' : 'h-64'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={gapAnalysisData}
              layout="vertical"
              margin={{ top: 5, right: 40, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                domain={[-maxAbsoluteGap, maxAbsoluteGap]}
                tickFormatter={(value) => Math.abs(value).toString()}
              />
              <YAxis 
                dataKey="category" 
                type="category" 
                width={200} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: any, name: any) => {
                  const absValue = Math.abs(value);
                  const isOverPerformer = value < 0;
                  const label = isOverPerformer 
                    ? `⭐ +${absValue} ${t('comparisonTab.tooltip.pointsAboveLeader', 'pts above leader')}`
                    : `${absValue} ${t('comparisonTab.tooltip.points')}`;
                  return [label, name];
                }}
                labelFormatter={(label: any) => `${t('comparisonTab.columns.category')}: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              
              {/* Over-performance bars (negative values, shown as positive on left) */}
              <Bar 
                dataKey={(item: any) => item.isOverPerformer ? -Math.abs(item.gap) : 0}
                name={t('comparisonTab.legend.exceedsLeader', 'Exceeds Leader')} 
                fill="#10b981" 
                radius={[4, 0, 0, 4]}
              />
              
              {/* Gap bars (positive values, shown on right) */}
              <Bar 
                dataKey={(item: any) => !item.isOverPerformer ? item.gap : 0}
                name={t('comparisonTab.legend.gapToLeader')} 
                fill="#ef4444" 
                radius={[0, 4, 4, 0]}
              />
              
              {/* Reference line at zero */}
              <ReferenceLine x={0} stroke="#6b7280" strokeDasharray="2 2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          {t('comparisonTab.gapAnalysisDescription')}
        </p>
      </div>
      
      {/* Leader Profile */}
      <div className={`bg-white p-6 rounded-lg shadow-md ${showAllReferenceModels ? 'lg:col-span-3' : ''}`}>
        <h2 className="text-xl font-bold mb-4">{t('comparisonTab.leaderReference')}</h2>
        <div className={`overflow-y-auto ${showAllReferenceModels ? '' : 'h-64'} pr-2`}>
          <div className="space-y-4">
            {detailedBenchmarkData
              .filter(item => item.id !== 'overall')
              .slice(0, showAllReferenceModels ? undefined : 5)
              .map((item) => (
              <div key={item.id} className="border-b pb-3">
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium text-sm flex items-center">
                    {item.yourScore > item.industryLeaders && <span className="mr-1 text-lg">🏆</span>}
                    {item.category}
                  </h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.yourScore > item.industryLeaders 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.yourScore > item.industryLeaders ? (
                      <>
                        ⭐ {t('comparisonTab.columns.yourScore')}: {item.yourScore} 
                        <span className="text-green-700 font-bold ml-1">
                          (+{item.yourScore - item.industryLeaders} {t('comparisonTab.tooltip.pointsAboveLeader', 'above leader')})
                        </span>
                      </>
                    ) : (
                      <>
                        {t('comparisonTab.tooltip.industryLeader')}: {item.industryLeaders}
                      </>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-1">
                  {showJapanContent && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-1">🇯🇵</span>
                      <span className="text-sm">{item.japanLeader}</span>
                    </div>
                  )}
                  <div className={`flex items-center ${showJapanContent ? '' : 'col-span-2'}`}>
                    <span className="text-sm font-medium mr-1">🌎</span>
                    <span className="text-sm">{item.globalLeader}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            ))}
            {detailedBenchmarkData.filter(item => item.id !== 'overall').length > 6 && (
              <button className="text-sm text-blue-600 hover:underline font-medium" 
                onClick={() => {
                  setShowAllReferenceModels(!showAllReferenceModels);
                }}
              >
                {t('comparisonTab.viewAllCategories')}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Regional comparison */}
      <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
        <h2 className="text-xl font-bold mb-4">{t('comparisonTab.japanGlobalComparison')}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('comparisonTab.columns.category')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('comparisonTab.columns.yourScore')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('comparisonTab.columns.industryMedian')}
                </th>
                {showJapanContent && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('comparisonTab.columns.japanLeader')}
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('comparisonTab.columns.globalLeader')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('comparisonTab.columns.implementation')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {detailedBenchmarkData
                .filter(item => item.id !== 'overall')
                .slice(0, showAllCategories ? undefined : 6)
                .map((item) => {
                  const isOverPerformer = item.yourScore > item.industryLeaders;
                  const pointsAboveLeader = isOverPerformer ? item.yourScore - item.industryLeaders : 0;
                  
                  return (
                <tr key={item.id} className={`hover:bg-gray-50 ${isOverPerformer ? 'bg-green-50 border-l-4 border-l-green-500' : ''}`}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center">
                      {isOverPerformer && <span className="mr-2 text-lg">🏆</span>}
                      {item.category}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center">
                      <span className={isOverPerformer ? 'text-green-700 font-bold' : 'text-blue-800'}>
                        {item.yourScore}
                        {isOverPerformer && <span className="ml-1 text-yellow-500">⭐</span>}
                      </span>
                      {isOverPerformer && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          +{pointsAboveLeader} {t('comparisonTab.tooltip.pointsAboveLeader', 'above leader')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {item.industryAvg}
                  </td>
                  {showJapanContent && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">🇯🇵</span>
                        <div>
                          <div className="text-sm font-medium">{item.japanLeader}</div>
                          <div className="text-xs text-gray-500">{item.industryLeaders} pts</div>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">
                        {getCompanyIconName(item.globalLeader).slice(0, 2)}
                      </span>
                      <div>
                        <div className="text-sm font-medium">{item.globalLeader}</div>
                        <div className="text-xs text-gray-500">
                          {item.industryLeaders} pts
                          {isOverPerformer && (
                            <span className="ml-1 text-green-600 font-medium">
                              ({t('comparisonTab.legend.exceedsLeader', 'Exceeded')})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">
                    {item.description}
                  </td>
                </tr>
                  );
                })}
            </tbody>
          </table>
          {!showAllCategories && detailedBenchmarkData.filter(item => item.id !== 'overall').length > 6 && (
            <div className="flex justify-center mt-4">
              <button 
                onClick={() => setShowAllCategories(true)}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                {t('comparisonTab.viewAllCategories')}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Data sources attribution */}
      <div className="mt-4 text-center text-xs text-gray-500 lg:col-span-3">
        {t('comparisonTab.dataSources')}
      </div>
    </div>
  );
}

export default ComparisonTab; 