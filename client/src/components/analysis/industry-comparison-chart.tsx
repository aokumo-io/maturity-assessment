import React, { useEffect, useRef } from "react";
import { generateIndustryComparisonChartData } from "@/lib/chartUtils";
import { compareWithIndustry } from "@/lib/assessmentUtils";
import type { CategoryScore } from "@shared/schema";
import Chart from "chart.js/auto";

interface IndustryComparisonChartProps {
  categoryScores: CategoryScore[];
  title?: string;
  showViewMore?: boolean;
  onViewMore?: () => void;
}

export function IndustryComparisonChart({ 
  categoryScores, 
  title = "Industry Comparison",
  showViewMore = true,
  onViewMore
}: IndustryComparisonChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || categoryScores.length === 0) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const industryData = compareWithIndustry(categoryScores);
    const chartData = generateIndustryComparisonChartData(categoryScores, industryData);

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label || ''}: ${context.raw}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            }
          },
          y: {
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
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [categoryScores]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex justify-between items-center mb-4">
        {showViewMore && onViewMore && (
          <button 
            onClick={onViewMore}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center"
          >
            View detailed comparison <i className="ri-arrow-right-line ml-1"></i>
          </button>
        )}
      </div>
      <div className="chart-container h-[300px] w-full">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="flex items-center justify-center mt-4 gap-6 text-sm">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-blue-600 mr-1"></span>
          Your Organization
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-gray-500 mr-1"></span>
          Industry Average
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-600 mr-1"></span>
          Industry Leaders
        </div>
      </div>
    </div>
  );
}

export default IndustryComparisonChart;
