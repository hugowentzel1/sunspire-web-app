'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PremiumChartContainerProps {
  title: string;
  children: ReactNode;
  paybackYear?: number;
  className?: string;
}

export default function PremiumChartContainer({ title, children, paybackYear, className = '' }: PremiumChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`card-premium p-8 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        {paybackYear && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span>Payback: {paybackYear} years</span>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="relative">
        {/* Payback Line */}
        {paybackYear && (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-0 bottom-0 w-px bg-warning opacity-30"
              style={{ left: `${(paybackYear / 25) * 100}%` }}
            ></div>
            <div 
              className="absolute bottom-0 text-xs text-warning font-medium"
              style={{ left: `${(paybackYear / 25) * 100}%`, transform: 'translateX(-50%)' }}
            >
              {paybackYear}y
            </div>
          </div>
        )}

        {/* Zero Line */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-gray-200 opacity-50"></div>
        </div>

        {/* Chart Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}


