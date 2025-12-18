/**
 * @file industry-comparison-recharts.tsx
 * @description業界比較チャート（Rechartsバージョン）
 * 業界ベンチマークとのスコア比較を表示します。
 */

import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer
} from 'recharts';
import { ASSESSMENT_CATEGORIES } from '@/lib/constants';
import { categoryBenchmarks, CategoryBenchmarkData } from '@/lib/benchmarkData';
import type { CategoryScore } from '@shared/schema';
import { compareWithIndustry } from '@/lib/assessmentUtils';
import { useTranslation } from 'react-i18next';
import { translateCategory, shouldShowJapanContent } from '@/lib/translationUtils';

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  const { t } = useTranslation('results');
  
  if (active && payload && payload.length) {
    // Find the corresponding data item
    const data = payload[0].payload;
    
    // Calculate the gap
    const gap = data.industryLeaders - data.yourScore;
    const gapPercentage = Math.round((gap / data.industryLeaders) * 100);
    
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md" style={{ minWidth: "220px" }}>
        <h4 className="font-bold text-base mb-2">{data.category}</h4>
        <div className="space-y-0.5">
          <p className="text-sm">{t('comparisonTab.tooltip.yourScore')}: <span className="font-medium text-blue-800">{data.yourScore}</span></p>
          <p className="text-sm">{t('comparisonTab.tooltip.industryMedian')}: <span className="text-gray-700">{data.industryAvg}</span></p>
          <p className="text-sm">{t('comparisonTab.tooltip.industryLeader')}: <span className="font-medium text-green-600">{data.industryLeaders}</span></p>
          <p className="text-sm text-red-600 mt-1">{t('comparisonTab.tooltip.gapToLeader')}: {gap} {t('comparisonTab.tooltip.points')}</p>
        </div>
      </div>
    );
  }
  return null;
};

interface IndustryComparisonRechartsProps {
  categoryScores: CategoryScore[];
  title?: string;
  showViewMore?: boolean;
  onViewMore?: () => void;
}

// Define types for our chart data
interface ChartItem {
  category: string;
  yourScore: number;
  industryAvg: number;
  industryLeaders: number;
  id: string;
}

export function IndustryComparisonRecharts({ 
  categoryScores, 
  title = "Industry Comparison",
  showViewMore = true,
  onViewMore
}: IndustryComparisonRechartsProps) {
  const { t, i18n } = useTranslation('results');
  const currentLanguage = i18n.language;
  const showJapanContent = shouldShowJapanContent(currentLanguage);
  
  // Get industry comparison data using the unified data source in assessmentUtils
  const comparisonData = useMemo(() => {
    return compareWithIndustry(categoryScores);
  }, [categoryScores]);
  
  // Create category ID to benchmark data mapping for efficient lookups
  const benchmarkMap = useMemo(() => {
    const map: Record<string, CategoryBenchmarkData> = {};
    
    // Map benchmark data directly to category IDs using the categoryId field
    categoryBenchmarks.forEach(benchmark => {
      map[benchmark.categoryId] = benchmark;
    });
    
    return map;
  }, []);
  
  // Generate chart data in the format required by Recharts
  const chartData = useMemo(() => {
    // Add the Overall data
    const data: ChartItem[] = [{
      category: translateCategory('overall', t),
      yourScore: comparisonData.overallComparison.org,
      industryAvg: comparisonData.overallComparison.avg,
      industryLeaders: comparisonData.overallComparison.leaders,
      id: 'overall'
    }];
    
    // Add data for each category
    ASSESSMENT_CATEGORIES.forEach(cat => {
      const comparison = comparisonData.categoryComparisons[cat.id];
      if (comparison) {
        data.push({
          category: translateCategory(cat.id, t),
          yourScore: comparison.org,
          industryAvg: comparison.avg,
          industryLeaders: comparison.leaders,
          id: cat.id
        });
      }
    });
    
    // Limit to first 6 items (Overall + 5 categories)
    return data.slice(0, 6);
  }, [comparisonData, t, i18n.language]);

  // Custom legend style with increased spacing between items
  const legendWrapperStyle = {
    paddingTop: '10px',
    paddingBottom: '5px',
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    fontSize: '13px'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('comparisonTab.mainChart', title)}</h2>
        {showViewMore && onViewMore && (
          <button 
            onClick={onViewMore}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center"
          >
            {t('viewDetailedComparison', 'View detailed comparison')} <i className="ri-arrow-right-line ml-1"></i>
          </button>
        )}
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            barSize={20}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="category" 
              angle={-15} 
              textAnchor="end" 
              height={60} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]} 
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              iconType="circle" 
              align="center"
              wrapperStyle={legendWrapperStyle}
            />
            <Bar dataKey="yourScore" name={t('comparisonTab.legend.yourOrg', 'Your Organization')} fill="#1e40af" radius={[3, 3, 0, 0]} />
            <Bar dataKey="industryAvg" name={t('comparisonTab.legend.industryAvg', 'Industry Average')} fill="#94a3b8" radius={[3, 3, 0, 0]} />
            <Bar dataKey="industryLeaders" name={t('comparisonTab.legend.industryLeaders', 'Industry Leaders')} fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IndustryComparisonRecharts; 