"use client";
import React from "react";
import { motion } from "framer-motion";
import LockedOverlay from "@/components/LockedOverlay";

interface ChartSeries {
  year: number;
  production: number;
  savings: number;
  cumulativeSavings: number;
  netCashflow: number;
}

interface SavingsChartProps {
  series: ChartSeries[];
  blur?: boolean;
}

export default function SavingsChart({ series, blur = false }: SavingsChartProps) {
  const chartContent = (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Solar Savings Over Time</h2>
      <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
        {/* Actual Chart Data - will be blurred when needed */}
        <div className="w-full h-full p-4">
          <div className="text-center text-gray-500 mb-4">
            <div className="text-2xl font-bold mb-2">📊</div>
            <div className="text-lg font-semibold">25-Year Cash Flow Analysis</div>
          </div>
          
          {/* Chart Bars */}
          <div className="flex items-end justify-center space-x-1 h-32">
            {series.slice(0, 10).map((yearData, index) => {
              // Calculate proper bar height based on savings data
              const maxSavings = Math.max(...series.slice(0, 10).map(s => s.savings));
              const barHeight = maxSavings > 0 ? (yearData.savings / maxSavings) * 80 : 10;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-3 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm"
                    style={{ height: `${Math.max(8, barHeight)}px` }}
                  />
                  <div className="text-xs text-gray-400 mt-1">{yearData.year}</div>
                </div>
              );
            })}
          </div>
          
          {/* Chart Legend */}
          <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Annual Savings</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Cumulative</span>
            </div>
          </div>
          
          {/* Data Summary */}
          <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-gray-500">
            <div>
              <div className="font-semibold">Total 25-Year Savings</div>
              <div>${series[24]?.cumulativeSavings?.toLocaleString() || '0'}</div>
            </div>
            <div>
              <div className="font-semibold">Break-Even Year</div>
              <div>Year {series.findIndex(y => y.netCashflow >= 0) + 1 || 'N/A'}</div>
            </div>
          </div>
          
          {/* Additional Chart Info */}
          <div className="text-center mt-3 text-xs text-gray-400">
            <div>Max Annual Savings: ${Math.max(...series.map(s => s.savings)).toLocaleString()}</div>
            <div>Average Annual: ${Math.round(series.reduce((sum, s) => sum + s.savings, 0) / series.length).toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <a 
          href="/methodology" 
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          View data sources and methodology →
        </a>
      </div>
      
      {/* Add unlock button below chart when in demo mode */}
      <div className="text-center mt-6">
        <button
          onClick={() => document.dispatchEvent(new CustomEvent("openInstall"))}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Unlock Full Report →
        </button>
      </div>
    </div>
  );

  if (blur) {
    return (
      <div className="relative locked-blur">
        {chartContent}
        <LockedOverlay onUnlock={() => document.dispatchEvent(new CustomEvent("openInstall"))} />
      </div>
    );
  }

  return chartContent;
}
