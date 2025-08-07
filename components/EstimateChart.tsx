'use client';

import { useState, useEffect } from 'react';
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

interface CashflowData {
  year: number;
  production: number;
  savings: number;
  cumulativeSavings: number;
  netCashflow: number;
}

interface EstimateChartProps {
  cashflowData: CashflowData[];
  netCostAfterITC: number;
  className?: string;
}

export default function EstimateChart({ cashflowData, netCostAfterITC, className = '' }: EstimateChartProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Lazy load the chart
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Format data for the chart
  const chartData = cashflowData.map(item => ({
    ...item,
    netCashflowFormatted: `$${(item.netCashflow / 1000).toFixed(1)}k`,
    savingsFormatted: `$${(item.savings / 1000).toFixed(1)}k`,
    cumulativeFormatted: `$${(item.cumulativeSavings / 1000).toFixed(1)}k`
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">Year {label}</p>
          <p className="text-sm text-gray-600">
            Production: {data.production.toLocaleString()} kWh
          </p>
          <p className="text-sm text-gray-600">
            Annual Savings: {data.savingsFormatted}
          </p>
          <p className="text-sm text-gray-600">
            Cumulative: {data.cumulativeFormatted}
          </p>
          <p className={`text-sm font-semibold ${
            data.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Net Cashflow: {data.netCashflowFormatted}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          25-Year Cashflow Projection
        </h3>
        <p className="text-gray-600 text-sm">
          Shows your cumulative savings over 25 years, accounting for panel degradation and electricity rate increases
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Zero line */}
            <Line
              type="monotone"
              dataKey={() => 0}
              stroke="#d1d5db"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
            
            {/* Net cashflow area */}
            <Area
              type="monotone"
              dataKey="netCashflow"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#netCashflowGradient)"
              fillOpacity={0.3}
            />
            
            {/* Cumulative savings line */}
            <Line
              type="monotone"
              dataKey="cumulativeSavings"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Net Cashflow</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-700">Cumulative Savings</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border border-gray-300 rounded"></div>
          <span className="text-gray-700">Break-even Line</span>
        </div>
      </div>

      {/* Key insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            ${(netCostAfterITC / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-gray-600">Net System Cost</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ${(chartData[24]?.cumulativeSavings / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-gray-600">25-Year Savings</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            ${(chartData[24]?.netCashflow / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-gray-600">Net Profit</div>
        </div>
      </div>

      {/* SVG definitions for gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="netCashflowGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
