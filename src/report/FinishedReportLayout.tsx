"use client";
import React from "react";
import { motion } from "framer-motion";

export interface ReportData {
  address: string;
  generatedAt: Date;
  dataSourceNote: string;
  systemSizeKW: number;
  annualProductionKWh: number;
  netCostAfterITC: number;
  year1Savings: number;
  paybackYear: number;
  npv25Year: number;
  roiPct: number;
  co2OffsetPerYear: number;
  solarIrradiance: number;
  tilt: number;
  losses: number;
  utilityRate: number;
  assumptions: {
    itcPercentage: number;
    costPerWatt: number;
    degradationRate: number;
    oandmPerKWYear: number;
    electricityRateIncrease: number;
    discountRate: number;
  };
  cashflowProjection: Array<{
    year: number;
    production: number;
    savings: number;
    cumulativeSavings: number;
    netCashflow: number;
  }>;
}

interface FinishedReportLayoutProps {
  data: ReportData;
  children: React.ReactNode;
}

export default function FinishedReportLayout({ data, children }: FinishedReportLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="space-y-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
