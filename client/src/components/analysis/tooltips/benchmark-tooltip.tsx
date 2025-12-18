/**
 * @file benchmark-tooltip.tsx
 * @description ベンチマーク比較のためのカスタムツールチップコンポーネント
 */

import React from 'react';

interface BenchmarkData {
  category: string;
  yourScore: number;
  median: number;
  leader: number;
  japanLeader?: string;
  globalLeader?: string;
  description?: string;
  keyInsight?: string;
}

interface BenchmarkTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function BenchmarkTooltip({ active, payload, label }: BenchmarkTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload as BenchmarkData;
  const gap = data.leader - data.yourScore;
  const gapPercentage = ((gap / data.leader) * 100).toFixed(1);
  
  return (
    <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md max-w-sm">
      <h4 className="font-bold text-lg">{data.category}</h4>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="col-span-2">
          <p className="text-sm font-medium">Your Score: <span className="font-bold text-blue-800">{data.yourScore}</span></p>
          <p className="text-sm font-medium">Industry Median: <span className="font-medium text-gray-600">{data.median}</span></p>
          <p className="text-sm font-medium">Industry Leader: <span className="font-bold text-green-600">{data.leader}</span></p>
          <p className="text-sm font-medium text-red-600 mt-1">Gap to Leader: {gap} points ({gapPercentage}%)</p>
        </div>
        {(data.japanLeader || data.globalLeader) && (
          <div className="col-span-2 mt-1 border-t pt-1">
            {data.japanLeader && (
              <p className="text-sm"><span className="font-medium">Japan Leader:</span> {data.japanLeader}</p>
            )}
            {data.globalLeader && (
              <p className="text-sm"><span className="font-medium">Global Leader:</span> {data.globalLeader}</p>
            )}
            {data.keyInsight && (
              <p className="text-xs text-gray-600 mt-1">{data.keyInsight}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BenchmarkTooltip; 