"use client";
import React from "react";
import { motion } from "framer-motion";
import LockedOverlay from "@/components/LockedOverlay";
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

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
  const b = useBrandTakeover();
  
  // Simplify data for better understanding - show every 5 years
  const simplifiedData = series
    .filter((item, index) => index === 0 || (index + 1) % 5 === 0 || index === series.length - 1)
    .map(item => ({
      year: item.year,
      totalSavings: item.cumulativeSavings,
      totalSavingsFormatted: `$${Math.round(item.cumulativeSavings / 1000)}k`,
      annualSavings: item.savings,
      annualSavingsFormatted: `$${Math.round(item.savings / 1000)}k`
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">Year {label}</p>
          <p className="text-sm text-green-600 font-semibold">
            Total Savings: {data.totalSavingsFormatted}
          </p>
          <p className="text-sm text-gray-600">
            Annual Savings: {data.annualSavingsFormatted}
          </p>
        </div>
      );
    }
    return null;
  };

  // Find payback year for visual indicator
  const paybackYear = series.findIndex(item => item.netCashflow >= 0) + 1;
  const netCostAfterITC = Math.abs(series[0]?.netCashflow || 12600);

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

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={simplifiedData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Years', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
              label={{ value: 'Total Savings', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Total savings area - single clean line with company colors */}
            <Area
              type="monotone"
              dataKey="totalSavings"
              stroke={b.enabled && b.primary ? b.primary : "#10b981"}
              strokeWidth={3}
              fill={b.enabled && b.primary ? `url(#companyGradient)` : `url(#savingsGradient)`}
              fillOpacity={0.4}
              dot={{ 
                fill: b.enabled && b.primary ? b.primary : "#10b981", 
                strokeWidth: 2, 
                r: 4 
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Simplified insights */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className={`text-center p-4 rounded-lg border ${
          b.enabled && b.primary 
            ? `bg-gradient-to-br from-[${b.primary}]20 to-[${b.primary}]10 border-[${b.primary}]` 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className={`text-xl font-bold ${
            b.enabled && b.primary 
              ? `text-[${b.primary}]` 
              : 'text-orange-600'
          }`}>
            ${Math.round(netCostAfterITC / 1000)}k
          </div>
          <div className="text-xs text-gray-600">Investment</div>
        </div>
        <div className={`text-center p-4 rounded-lg border ${
          b.enabled && b.primary 
            ? `bg-gradient-to-br from-[${b.primary}]20 to-[${b.primary}]10 border-[${b.primary}]` 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className={`text-xl font-bold ${
            b.enabled && b.primary 
              ? `text-[${b.primary}]` 
              : 'text-blue-600'
          }`}>
            {paybackYear} years
          </div>
          <div className="text-xs text-gray-600">Payback Time</div>
        </div>
        <div className={`text-center p-4 rounded-lg border ${
          b.enabled && b.primary 
            ? `bg-gradient-to-br from-[${b.primary}]20 to-[${b.primary}]10 border-[${b.primary}]` 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className={`text-xl font-bold ${
            b.enabled && b.primary 
              ? `text-[${b.primary}]` 
              : 'text-green-600'
          }`}>
            ${Math.round(series[24]?.cumulativeSavings / 1000)}k
          </div>
          <div className="text-xs text-gray-600">25-Year Savings</div>
        </div>
      </div>

      {/* Simple explanation */}
      <div className={`mt-4 p-4 rounded-lg border ${
        b.enabled && b.primary 
          ? `bg-[${b.primary}]5 border-[${b.primary}]20` 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">How to read this:</span> The {b.enabled && b.primary ? 'company-branded' : 'green'} area shows your total savings growing over time. 
          After {paybackYear} years, you'll have saved enough to cover your initial investment. 
          By year 25, you'll have saved ${Math.round(series[24]?.cumulativeSavings / 1000)}k total.
        </p>
      </div>

      {/* SVG definitions for gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="companyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={b.enabled && b.primary ? b.primary : "#10b981"} stopOpacity={0.6}/>
            <stop offset="50%" stopColor={b.enabled && b.primary ? `${b.primary}80` : "#10b98180"} stopOpacity={0.3}/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
      </svg>

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
          className={`inline-flex items-center px-6 py-3 text-white rounded-lg font-semibold transition-colors shadow-md ${
            b.enabled && b.primary 
              ? `bg-[${b.primary}] hover:bg-[${b.primary}]/90` 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h4z" />
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
