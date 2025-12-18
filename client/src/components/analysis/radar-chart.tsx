import React, { useMemo } from "react";
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { ASSESSMENT_CATEGORIES } from '@/lib/constants';
import type { CategoryScore } from "@shared/schema";
import { useTranslation } from "react-i18next";

interface RadarChartProps {
  categoryScores: CategoryScore[];
  title?: string;
  simplified?: boolean;
}

export function RadarChart({ 
  categoryScores, 
  title = "Maturity Radar",
  simplified = false 
}: RadarChartProps) {
  const { t, i18n } = useTranslation(['results', 'assessment']);

  // Prepare radar chart data
  const radarData = useMemo(() => 
    categoryScores.map(cat => {
      const categoryInfo = ASSESSMENT_CATEGORIES.find(c => c.id === cat.categoryId);
      return {
        // Use the full category ID for consistent translation
        categoryId: cat.categoryId,
        // Keep the original category for fallback
        originalCategory: categoryInfo?.title || cat.categoryId,
        yourScore: cat.score >= 0 ? cat.score : 0
      };
    }),
  [categoryScores]);

  // Calculate formatted radar data with translations
  const formattedRadarData = useMemo(() => {
    return radarData.map(item => ({
      ...item,
      // Always use the full category ID for translation to ensure consistency
      category: t(`assessment:categories.${item.categoryId}`, item.originalCategory)
    }));
  }, [radarData, i18n.language, t]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-bold mb-4">{t('sections.radarChart', title)}</h2>
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart outerRadius={130} data={formattedRadarData}>
            <PolarGrid />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ 
                fontSize: 13,
                fill: "#4b5563",
                dy: 4
              }}
              tickLine={{ stroke: 'none' }}
              tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name={t('comparisonTab.tooltip.yourScore', 'Your Score')} dataKey="yourScore" stroke="#1e40af" fill="#1e40af" fillOpacity={0.3} />
            <Legend />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Create a simplified version specifically for the dashboard
export function SimplifiedRadarChart({ categoryScores, title = "Maturity Radar" }: Omit<RadarChartProps, 'simplified'>) {
  const { t } = useTranslation(['results']);
  return <RadarChart categoryScores={categoryScores} title={t('sections.radarChart', title)} simplified={true} />;
}

export default RadarChart;
