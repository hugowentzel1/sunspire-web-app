"use client";
import React, { useEffect, useState } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useCountdown } from '@/src/demo/useCountdown';
import { usePreviewQuota } from '@/src/demo/usePreviewQuota';
import { track } from '@/src/demo/track';
import { shouldBlurBlock } from '@/src/demo/redaction';
import { DemoBanner } from '@/src/demo/DemoChrome';
import InstallSheet from '@/src/demo/InstallSheet';
import LockOverlay from '@/src/demo/LockOverlay';
import HeroBrand from '@/src/brand/HeroBrand';

// Import new report components
import FinishedReportLayout from '@/src/report/FinishedReportLayout';
import ReportHeader from '@/src/report/components/ReportHeader';
import MetricCard from '@/src/report/components/MetricCard';
import SavingsChart from '@/src/report/components/SavingsChart';
import Financial from '@/src/report/sections/Financial';
import Environmental from '@/src/report/sections/Environmental';
import Assumptions from '@/src/report/sections/Assumptions';
import CTABand from '@/src/report/CTABand';
import LeadFormModal from '@/src/report/LeadFormModal';
import LeadFormSuccessModal from '@/src/report/LeadFormSuccessModal';

export default function DemoResult() {
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays);
  const { read } = usePreviewQuota(2);
  const remaining = read();
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Mock estimate data for demo (structured like the real report)
  const estimate = {
    address: "123 Solar Street, San Diego, CA",
    generatedAt: new Date(),
    dataSourceNote: 'Demo',
    systemSizeKW: 6.2,
    annualProductionKWh: 9637,
    netCostAfterITC: 12600,
    year1Savings: 1603,
    paybackYear: 8,
    npv25Year: 9736,
    roiPct: 177,
    co2OffsetPerYear: 8191,
    solarIrradiance: 5.01,
    tilt: 20,
    losses: 14,
    utilityRate: 0.14,
    assumptions: {
      itcPercentage: 0.30,
      costPerWatt: 3.00,
      degradationRate: 0.005,
      oandmPerKWYear: 22,
      electricityRateIncrease: 0.025,
      discountRate: 0.07,
    },
    cashflowProjection: Array.from({ length: 25 }, (_, i) => ({
      year: i + 1,
      production: Math.round(9637 * Math.pow(0.995, i)),
      savings: Math.round(9637 * Math.pow(0.995, i) * 0.14),
      cumulativeSavings: Math.round(9637 * 0.14 * (i + 1)),
      netCashflow: Math.round(9637 * 0.14 * (i + 1) - 12600),
    })),
  };

  // Track page view
  useEffect(() => {
    track("view_result", { href: location.href });
  }, []);

  // Listen for lead form events
  useEffect(() => {
    const handleOpenLeadForm = () => setIsLeadFormOpen(true);
    const handleOpenInstall = () => {
      track("install_open");
      // InstallSheet will handle this
    };

    document.addEventListener("openLeadForm", handleOpenLeadForm);
    document.addEventListener("openInstall", handleOpenInstall);

    return () => {
      document.removeEventListener("openLeadForm", handleOpenLeadForm);
      document.removeEventListener("openInstall", handleOpenInstall);
    };
  }, []);

  // Check if demo is expired or quota exhausted
  if (countdown.isExpired || remaining <= 0) {
    return <LockOverlay />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter" data-demo={b.enabled}>
      <DemoBanner />
      
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              {!b.enabled ? (
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-lg">☀️</span>
                </div>
              ) : (
                <HeroBrand />
              )}
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  {b.enabled ? b.brand : 'Sunspire'}
                </h1>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                  Solar Intelligence Report
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()} 
                className={`px-6 py-3 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  b.enabled 
                    ? 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}
              >
                New Analysis
              </button>
            </div>
          </div>
        </div>
      </header>

      <FinishedReportLayout data={estimate}>
        {/* Report Header */}
        <ReportHeader 
          address={estimate.address}
          generatedAt={estimate.generatedAt}
          dataSourceNote={estimate.dataSourceNote}
          countdown={countdown}
        />

        {/* Top Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            label="System Size"
            value={estimate.systemSizeKW}
            unit=" kW"
            icon="⚡"
            blur={false}
          />
          <MetricCard 
            label="Annual Production"
            value={estimate.annualProductionKWh}
            unit=" kWh"
            icon="☀️"
            blur={false}
          />
          <MetricCard 
            label="Net Cost (After ITC)"
            value={estimate.netCostAfterITC}
            unit=""
            icon="💰"
            blur={shouldBlurBlock("lifetime_savings")}
            blurId="net_cost"
          />
          <MetricCard 
            label="Year 1 Savings"
            value={estimate.year1Savings}
            unit=""
            icon="📈"
            blur={shouldBlurBlock("y1_savings")}
            blurId="y1_savings"
          />
        </div>

        {/* Savings Chart */}
        <SavingsChart 
          series={estimate.cashflowProjection}
          blur={shouldBlurBlock("mainGraphs")}
        />

        {/* Three Highlight Chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50">
            <div className="text-2xl font-bold text-gray-900 mb-2">Investment</div>
            <div className="text-gray-600">Teaser value shown</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50">
            <div className="text-2xl font-bold text-gray-900 mb-2">Payback Time</div>
            <div className="text-gray-600">Blurred</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50">
            <div className="text-2xl font-bold text-gray-900 mb-2">25-Year Savings</div>
            <div className="text-gray-600">Blurred</div>
          </div>
        </div>

        {/* Three Column Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Financial 
            paybackYear={estimate.paybackYear}
            npv25Year={estimate.npv25Year}
            roiPct={estimate.roiPct}
            utilityRate={estimate.utilityRate}
          />
          <Environmental 
            co2OffsetPerYear={estimate.co2OffsetPerYear}
            solarIrradiance={estimate.solarIrradiance}
            tilt={estimate.tilt}
            losses={estimate.losses}
          />
          <Assumptions 
            itcPercentage={estimate.assumptions.itcPercentage}
            costPerWatt={estimate.assumptions.costPerWatt}
            degradationRate={estimate.assumptions.degradationRate}
            oandmPerKWYear={estimate.assumptions.oandmPerKWYear}
            electricityRateIncrease={estimate.assumptions.electricityRateIncrease}
            discountRate={estimate.assumptions.discountRate}
          />
        </div>

        {/* Bottom CTA Band */}
        <CTABand />
      </FinishedReportLayout>

      {/* Demo components */}
      <InstallSheet />
      
      {/* Lead Form Modal */}
      <LeadFormModal 
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        address={estimate.address}
      />

      {/* Success Modal */}
      <LeadFormSuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        summary={{
          systemSizeKW: estimate.systemSizeKW,
          netCostAfterITC: estimate.netCostAfterITC,
          year1Savings: estimate.year1Savings
        }}
      />
    </div>
  );
}
