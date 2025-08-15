"use client";
import React from "react";
import { motion } from "framer-motion";
import BlurMask from "@/src/demo/BlurMask";

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
      <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-lg font-semibold">Savings Projection Chart</div>
          <div className="text-sm">25-year cash flow analysis</div>
          <div className="text-xs mt-2 opacity-75">
            {series.length} years of data available
          </div>
        </div>
      </div>
    </div>
  );

  if (blur) {
    return (
      <BlurMask id="mainGraphs" cta="Unlock Full Report">
        {chartContent}
      </BlurMask>
    );
  }

  return chartContent;
}
