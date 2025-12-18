/**
 * @file overview-tab.tsx
 * @description アセスメント概要タブ
 * マチュリティスコアの概要と主要な指標を表示します。
 */

import React, { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { ASSESSMENT_CATEGORIES } from '@/lib/constants';
import type { CategoryScore } from '@shared/schema';
import { calculateOverallScore } from '@/lib/assessmentUtils';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge'; 
import { categoryBenchmarks, getCompanyIconName, calculateOverallBenchmarks } from '@/lib/benchmarkData';

interface OverviewTabProps {
  categoryScores: CategoryScore[];
  percentileData: {
    percentile: number;
    ahead: string;
    top: string;
    isAboveMedian: boolean;
  };
}

export function OverviewTab({ categoryScores, percentileData }: OverviewTabProps) {
  const { t } = useTranslation(['results', 'assessment']);
  
  // Calculate overall scores
  const yourOverallScore = useMemo(() => 
    calculateOverallScore(categoryScores), [categoryScores]);
  
  // Calculate industry benchmarks from category data
  const industryBenchmarks = useMemo(() => 
    calculateOverallBenchmarks(categoryScores), [categoryScores]);
  
  // Prepare radar chart data
  const radarData = useMemo(() => 
    categoryScores.map(cat => {
      const categoryInfo = ASSESSMENT_CATEGORIES.find(c => c.id === cat.categoryId);
      const categoryBenchmark = categoryBenchmarks.find(b => b.categoryId === cat.categoryId);
      return {
        category: t(`assessment:categories.${cat.categoryId}`, categoryInfo?.title || cat.categoryId),
        yourScore: cat.score >= 0 ? cat.score : 0,
        industryMedian: categoryBenchmark?.median || industryBenchmarks.median,
        industryLeader: categoryBenchmark?.leader || industryBenchmarks.leader
      };
    }),
  [categoryScores, t, industryBenchmarks]);
  
  // Get improvement opportunities (weaknesses)
  const improvementOpportunities = useMemo(() => {
    const validScores = categoryScores.filter(cat => cat.score >= 0);
    if (!validScores.length) return [];
    
    // Sort by gap size (leader score - your score)
    return validScores
      .map(cat => {
        const categoryInfo = ASSESSMENT_CATEGORIES.find(c => c.id === cat.categoryId);
        const benchmark = categoryBenchmarks.find(b => b.categoryId === cat.categoryId);
        const leaderScore = benchmark?.leader || industryBenchmarks.leader; // Use benchmark data
        const gap = leaderScore - cat.score;
        const gapPercentage = Math.round((gap / leaderScore) * 100);
        
        // Get translated category name
        const translatedCategory = t(`assessment:categories.${cat.categoryId}`, categoryInfo?.title || cat.categoryId);
        
        return {
          categoryId: cat.categoryId,
          category: translatedCategory,
          score: cat.score,
          leaderScore,
          gap,
          gapPercentage,
          referenceModel: benchmark ? 
            `${getCompanyIconName(benchmark.globalLeader)} ${benchmark.globalLeader}` : 
            'Industry Leader'
        };
      })
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 5); // Get top 5 improvement opportunities
  }, [categoryScores, t, industryBenchmarks]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Overall Maturity Position - Increased width by 15% */}
      <div className="lg:col-span-5">
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
          <h2 className="text-xl font-bold mb-4">{t('assessment:overview.maturityPosition', 'Overall Maturity Position')}</h2>
          
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-full h-8 bg-gray-200 rounded-full">
              <div 
                className="absolute top-0 left-0 h-8 bg-blue-800 rounded-l-full flex items-center justify-center"
                style={{ width: `${percentileData.percentile}%` }}
              >
                {percentileData.percentile > 15 && (
                  <span className="text-white text-xs font-bold px-2">
                    {percentileData.percentile}%
                  </span>
                )}
              </div>
              {percentileData.percentile <= 15 && (
                <span className="absolute text-xs font-bold left-0 w-full text-center h-8 flex items-center justify-center">
                  {percentileData.percentile}%
                </span>
              )}
            </div>
          </div>
          
          {/* Position text below the progress bar */}
          <div className="text-center text-gray-700 mb-4">
            <p className="font-bold">{percentileData.ahead}</p>
            <p className="text-sm mt-1">{percentileData.top}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="text-xs text-blue-800 font-medium">{t('overview.yourScore', 'Your Score')}</p>
              <p className="text-3xl font-bold text-blue-800">{yourOverallScore}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-xs text-gray-600 font-medium">{t('overview.industryMedian', 'Industry Median')}</p>
              <p className="text-3xl font-bold text-gray-600">{industryBenchmarks.median}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <p className="text-xs text-green-700 font-medium">{t('overview.leaderScore', 'Leader Score')}</p>
              <p className="text-3xl font-bold text-green-700">{industryBenchmarks.leader}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">{t('assessment:overview.comparisonNote', 'This comparison is based on industry benchmarks.')}</p>
        </div>
      </div>
      
      {/* Radar Chart - Decreased width by 15% */}
      <div className="lg:col-span-7">
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
          <h2 className="text-xl font-bold mb-4">{t('sections.radarChart', 'Maturity Radar')}</h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 14 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name={t('overview.yourScore', 'Your Score')} dataKey="yourScore" stroke="#1e40af" fill="#1e40af" fillOpacity={0.3} />
                <Radar name={t('overview.industryMedian', 'Industry Median')} dataKey="industryMedian" stroke="#4b5563" fill="#4b5563" fillOpacity={0.2} />
                <Radar name={t('comparisonTab.legend.industryLeaders', 'Industry Leaders')} dataKey="industryLeader" stroke="#059669" fill="#059669" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Top Improvement Opportunities */}
      <div className="lg:col-span-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{t('improvementOpportunities.title', 'Top Improvement Opportunities')}</h2>
          <p className="text-sm text-gray-600 mb-4">{t('improvementOpportunities.description', 'Key areas with the highest potential for improvement')}</p>
          
          {improvementOpportunities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                    <th className="py-3 px-4 text-left">{t('improvementOpportunities.category', 'Category')}</th>
                    <th className="py-3 px-4 text-center">{t('improvementOpportunities.yourScore', 'Your Score')}</th>
                    <th className="py-3 px-4 text-center">{t('improvementOpportunities.leader', 'Leader')}</th>
                    <th className="py-3 px-4 text-center">{t('improvementOpportunities.gap', 'Gap')}</th>
                    <th className="py-3 px-4 text-left">{t('improvementOpportunities.referenceModel', 'Reference Model')}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {improvementOpportunities.map((item) => (
                    <tr key={item.categoryId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-left font-bold">{item.category}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-0">
                          {item.score}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-0">
                          {item.leaderScore}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-0">
                          {item.gap} pts ({item.gapPercentage}%)
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-left text-xs">{item.referenceModel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">{t('improvementOpportunities.noData', 'Complete an assessment to see improvement opportunities')}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewTab; 