import React, { useEffect, useRef } from "react";
import { MATURITY_LEVELS } from "@/lib/constants";
import { generateCategoryBarChartData } from "@/lib/chartUtils";
import { compareWithIndustry } from "@/lib/assessmentUtils";
import type { CategoryScore } from "@shared/schema";
import Chart from "chart.js/auto";
import { useTranslation } from "react-i18next";

interface CategoryScoresChartProps {
  categoryScores: CategoryScore[];
  title?: string;
}

export function CategoryScoresChart({ 
  categoryScores, 
  title = "Category Scores" 
}: CategoryScoresChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { t, i18n } = useTranslation(['results', 'assessment']);

  useEffect(() => {
    if (!chartRef.current || categoryScores.length === 0) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const industryData = compareWithIndustry(categoryScores);
    const chartData = generateCategoryBarChartData(categoryScores, industryData);

    // Create a plugin to draw the median bars in the background
    const medianBarPlugin = {
      id: 'medianBars',
      beforeDatasetsDraw: (chart: any) => {
        const { ctx, chartArea, scales } = chart;
        
        // Check if scales are initialized
        if (!scales || !scales.y || !scales.x || !scales.y.getPixelForValue || !scales.x.getPixelForValue) {
          return;
        }
        
        const { top, bottom, left, right, width, height } = chartArea;
        const { medianData } = chartData;
        
        if (!medianData) return;
        
        // Set up styling for median bars
        ctx.save();
        ctx.fillStyle = '#94a3b8'; // Gray color for median
        ctx.globalAlpha = 0.3; // Semi-transparent
        
        // Draw each median bar
        medianData.forEach((median: number, index: number) => {
          const y = scales.y.getPixelForValue(index);
          // Get bar height from Chart.js
          const barHeight = chart.getDatasetMeta(0).data[index].height;
          const x = scales.x.getPixelForValue(0);
          const barWidth = scales.x.getPixelForValue(median) - x;
          
          // Draw the median bar
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(
              x, 
              y - barHeight / 2, 
              barWidth, 
              barHeight, 
              [0, 4, 4, 0] // Rounded corners on right side
            );
          } else {
            // Fallback for browsers that don't support roundRect
            ctx.rect(x, y - barHeight / 2, barWidth, barHeight);
          }
          ctx.fill();
        });
        
        ctx.restore();
      }
    };

    // Register the plugin
    Chart.register(medianBarPlugin);

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        indexAxis: "y",
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const datasetLabel = context.dataset.label || '';
                const value = context.raw as number;
                const index = context.dataIndex;
                const median = chartData.medianData?.[index] || 0;
                
                return [
                  `${datasetLabel}: ${value}%`,
                  `${t('comparisonTab.legend.industryAvg', 'Industry Median')}: ${median}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            grid: {
              display: true,
              color: '#e5e7eb'
            },
            ticks: {
              callback: function(value) {
                return value + "%";
              }
            }
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              callback: function(value) {
                const index = value as number;
                const categoryId = chartData.categoryIds?.[index] || '';
                return t(`assessment:categories.${categoryId}`, chartData.labels[index]);
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [categoryScores, i18n.language, t]);

  const getTranslatedLevels = () => {
    return {
      beginner: t('maturityLevels.beginner', 'Beginner'),
      intermediate: t('maturityLevels.intermediate', 'Intermediate'),
      advanced: t('maturityLevels.advanced', 'Advanced')
    };
  };

  const levels = getTranslatedLevels();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-bold mb-4">{t('sections.categoryScores', title)}</h2>
      <div className="flex justify-end items-center space-x-4 text-sm mb-4">
        <span className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#94a3b8] opacity-30 mr-1"></div> {t('comparisonTab.legend.industryAvg', 'Industry Median')}
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#F9B44D] mr-1"></span> {levels.beginner}
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#22A3F1] mr-1"></span> {levels.intermediate}
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#47B375] mr-1"></span> {levels.advanced}
        </span>
      </div>
      <div className="chart-container h-[350px] w-full">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default CategoryScoresChart;
