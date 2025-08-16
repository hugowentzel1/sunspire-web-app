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
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Your Solar Savings Over Time
        </h3>
        <p className="text-gray-600 text-sm">
          Simple view of how your solar investment pays off over 25 years
        </p>
      </div>

      <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
        {/* Chart visualization */}
        <div className="w-full h-full p-4">
          <div className="text-center text-gray-500 mb-4">
            <div className="text-2xl font-bold mb-2">📊</div>
            <div className="text-lg font-semibold">25-Year Cash Flow Analysis</div>
          </div>
          
          {/* Simple bar chart */}
          <div className="flex items-end justify-center space-x-1 h-32">
            {series.slice(0, 10).map((yearData, index) => {
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
          
          {/* Chart legend */}
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
        </div>
      </div>

      {/* Simplified insights */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-xl font-bold text-orange-600">
            ${Math.round(series[0]?.netCashflow ? Math.abs(series[0].netCashflow) / 1000 : 12)}k
          </div>
          <div className="text-xs text-gray-600">Investment</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xl font-bold text-blue-600">
            {series.findIndex(y => y.netCashflow >= 0) + 1 || 8} years
          </div>
          <div className="text-xs text-gray-600">Payback Time</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-xl font-bold text-green-600">
            ${Math.round(series[24]?.cumulativeSavings / 1000) || 9}k
          </div>
          <div className="text-xs text-gray-600">25-Year Savings</div>
        </div>
      </div>

      {/* Simple explanation */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">How to read this:</span> The bars show your annual savings growing over time. 
          After {series.findIndex(y => y.netCashflow >= 0) + 1 || 8} years, you'll have saved enough to cover your initial investment. 
          By year 25, you'll have saved ${Math.round(series[24]?.cumulativeSavings / 1000) || 9}k total.
        </p>
      </div>

      <div className="text-center mt-4">
        <a 
          href="/methodology" 
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          View data sources and methodology →
        </a>
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
