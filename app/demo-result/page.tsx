"use client";
import React, { useEffect, useState } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useCountdown } from '@/src/demo/useCountdown';
import { usePreviewQuota } from '@/src/demo/usePreviewQuota';
import { IconBadge } from '@/components/ui/IconBadge';
import { useBrandColors } from '@/hooks/useBrandColors';
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
import StickyCTA from '@/src/ui/StickyCTA';

export default function DemoResult() {
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays || 3);
  const { read, consume } = usePreviewQuota(2);
  
  // Brand colors from URL
  useBrandColors();
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
    track("view_result", { 
      href: location.href,
      brand: b.brand || undefined,
      domain: b.domain || undefined,
      daysLeft: countdown.days,
      runsUsed: 2 - remaining,
      variant: "A"
    });
  }, [b.brand, b.domain, countdown.days, remaining]);

  // Listen for lead form events
  useEffect(() => {
    const handleOpenLeadForm = () => setIsLeadFormOpen(true);
    const handleOpenInstall = () => {
      track("install_open", {
        brand: b.brand || undefined,
        domain: b.domain || undefined,
        daysLeft: countdown.days,
        runsUsed: 2 - remaining
      });
      // InstallSheet will handle this
    };

    document.addEventListener("openLeadForm", handleOpenLeadForm);
    document.addEventListener("openInstall", handleOpenInstall);

    return () => {
      document.removeEventListener("openLeadForm", handleOpenLeadForm);
      document.removeEventListener("openInstall", handleOpenInstall);
    };
  }, [b.brand, b.domain, countdown.days, remaining]);

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
                <IconBadge>☀️</IconBadge>
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
                onClick={() => {
                  consume();
                  window.history.back();
                }} 
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
          blur={false}
        />

        {/* Three Highlight Chips with Teasers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50">
            <div className="text-2xl font-bold text-gray-900 mb-2">Investment</div>
            <div className="text-gray-600">Teaser value shown</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50">
            <div className="text-2xl font-bold text-gray-900 mb-2">Payback</div>
            <div className="text-gray-600">Under 7 years (unlock exact)</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50">
            <div className="text-2xl font-bold text-gray-900 mb-2">25-Year Savings</div>
            <div className="text-gray-600">${estimate.npv25Year.toLocaleString()} (unlock detailed breakdown)</div>
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

        {/* Feature Section with Brand-Colored Buttons */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Our Solar Intelligence Platform?</h2>
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                style={{
                  background: b.enabled 
                    ? `linear-gradient(135deg, ${b.primary}40, ${b.primary})`
                    : 'linear-gradient(135deg, #fbbf2440, #d97706)'
                }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Advanced Analytics</h3>
              <p className="text-gray-600">AI-powered insights with 25-year projections and ROI analysis</p>
            </div>
            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                style={{
                  background: b.enabled 
                    ? `linear-gradient(135deg, ${b.primary}60, ${b.primary}CC)`
                    : 'linear-gradient(135deg, #fcd34d60, #f59e0bCC)'
                }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Premium Network</h3>
              <p className="text-gray-600">Connect with verified, top-rated solar installers in your area</p>
            </div>
            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                style={{
                  background: b.enabled 
                    ? `linear-gradient(135deg, ${b.primary}80, ${b.primary})`
                    : 'linear-gradient(135deg, #fef3c780, #f59e0b)'
                }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Enterprise Security</h3>
              <p className="text-gray-600">Bank-level encryption and SOC 2 compliance for your data</p>
            </div>
          </div>
        </div>
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

      {/* Mobile Sticky CTA */}
      <StickyCTA />
    </div>
  );
}
