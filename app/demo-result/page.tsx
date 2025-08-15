"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useCountdown } from '@/src/demo/useCountdown';
import { usePreviewQuota } from '@/src/demo/usePreviewQuota';
import { getCTA } from '@/src/demo/cta';
import { useABVariant } from '@/src/demo/useABVariant';
import { track } from '@/src/demo/track';
import BlurMask from '@/src/demo/BlurMask';
import { currencyRange } from '@/src/demo/redaction';
import PriceAnchor from '@/src/demo/PriceAnchor';
import SocialProof from '@/src/demo/SocialProof';
import { DemoBanner } from '@/src/demo/DemoChrome';
import StickyBuyBar from '@/src/demo/StickyBuyBar';
import InstallSheet from '@/src/demo/InstallSheet';
import HeroBrand from '@/src/brand/HeroBrand';
import Image from 'next/image';

export default function DemoResult() {
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays);
  const { read } = usePreviewQuota(2);
  const remaining = read();
  const variant = useABVariant();

  // Mock estimate data for demo (structured like the real report)
  const estimate = {
    address: "123 Solar Street, San Diego, CA",
    date: new Date(),
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
    utilityRateSource: 'Demo',
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
    track("view", { href: location.href });
  }, []);

  // Enhanced CTA with pulse animation
  const EnhancedCTA = ({ primary = true, children }: { primary?: boolean; children: React.ReactNode }) => (
    <motion.button
      onClick={() => {
        if (primary) {
          document.dispatchEvent(new CustomEvent("openInstall"));
          track("cta_click", { cta_type: "unlock_full_report" });
        } else {
          document.dispatchEvent(new CustomEvent("openInstall", { detail: { sampleReport: true } }));
          track("cta_click", { cta_type: "request_sample_report" });
        }
      }}
      className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${
        primary
          ? 'bg-[var(--brand-primary)] text-white hover:shadow-2xl'
          : 'bg-white border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={primary ? { scale: [1, 1.02, 1] } : {}}
      transition={primary ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
    >
      {children}
    </motion.button>
  );

  // Urgency banner
  const UrgencyBanner = () => {
    const isUrgent = countdown.days <= 3;
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center p-4 rounded-2xl mb-8 ${
          isUrgent
            ? 'bg-red-100 border-2 border-red-300 text-red-800'
            : 'bg-yellow-100 border-2 border-yellow-300 text-yellow-800'
        }`}
      >
        <div className="font-bold text-lg">
          {isUrgent ? '⚠️ ' : '⏰ '}
          {isUrgent 
            ? `Expires in ${countdown.days} days — secure your access now!`
            : `Exclusive preview — expires in ${countdown.days} days`
          }
        </div>
        {isUrgent && (
          <div className="text-sm mt-2 opacity-80">
            Don't lose access to your personalized solar analysis
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter" data-demo={b.enabled}>
      <DemoBanner />
      
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              {!b.enabled ? (
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="text-white font-bold text-lg">☀️</span>
                </motion.div>
              ) : (
                <HeroBrand />
              )}
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  {b.enabled ? b.brand : 'Sunspire'}
                </h1>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                  {b.enabled ? "Solar Intelligence Report" : "Solar Intelligence Report"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button 
                onClick={() => window.history.back()} 
                className={`px-6 py-3 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                  b.enabled 
                    ? 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                New Analysis
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
          
          {/* Urgency Banner */}
          <UrgencyBanner />

          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2, duration: 0.8 }} 
              className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
            >
              <span className="text-4xl">📊</span>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900">Solar Intelligence Report</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive analysis for your property at {estimate.address}
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Data Source: {estimate.utilityRateSource}</span>
                <span>•</span>
                <span>Generated on {estimate.date.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Trust elements and CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3, duration: 0.8 }} 
            className="mt-4 flex flex-col items-center justify-center gap-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              <EnhancedCTA primary={true}>
                {getCTA(variant, "primary", b.domain)}
              </EnhancedCTA>
              <EnhancedCTA primary={false}>
                Request Sample Report
              </EnhancedCTA>
            </div>
            <div className="text-xs text-slate-500">
              Data sources: PVWatts v8 (NREL) • EIA rates • HTTPS encrypted
            </div>
          </motion.div>

          {/* Social Proof */}
          <SocialProof />

          {/* Key Metrics Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.8 }} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-2">{estimate.systemSizeKW} kW</div>
              <div className="text-gray-600 font-semibold">System Size</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">☀️</span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-2">{estimate.annualProductionKWh.toLocaleString()} kWh</div>
              <div className="text-gray-600 font-semibold">Annual Production</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-2">{currencyRange(estimate.netCostAfterITC)}</div>
              <div className="text-gray-600 font-semibold">Net Cost (After ITC)</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-2">{currencyRange(estimate.year1Savings)}</div>
              <div className="text-gray-600 font-semibold">Year 1 Savings</div>
            </div>
          </motion.div>

          {/* Savings Chart - Blurred */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Solar Savings Over Time</h2>
            <BlurMask>
              <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-lg font-semibold">Savings Projection Chart</div>
                  <div className="text-sm">25-year cash flow analysis</div>
                </div>
              </div>
            </BlurMask>
          </motion.div>

          {/* Three Column Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.8, duration: 0.8 }} 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Financial Analysis - Blurred */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Analysis</h2>
              <BlurMask>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">Payback Period</span>
                    <span className="font-bold text-gray-900">{estimate.paybackYear} years</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">25-Year NPV</span>
                    <span className="font-bold text-gray-900">{currencyRange(estimate.npv25Year)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">ROI</span>
                    <span className="font-bold text-gray-900">~{Math.round(estimate.roiPct * 0.9)}-{Math.round(estimate.roiPct * 1.1)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-gray-600">Electricity Rate</span>
                    <span className="font-bold text-gray-900">${estimate.utilityRate}/kWh</span>
                  </div>
                </div>
              </BlurMask>
            </div>

            {/* Environmental Impact - Safe */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Environmental Impact</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">CO₂ Offset/Year</span>
                  <span className="font-bold text-gray-900">{estimate.co2OffsetPerYear.toLocaleString()} lbs</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">Solar Irradiance</span>
                  <span className="font-bold text-gray-900">{estimate.solarIrradiance} kWh/m²/day</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">System Tilt</span>
                  <span className="font-bold text-gray-900">{estimate.tilt}°</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-gray-600">System Losses</span>
                  <span className="font-bold text-gray-900">{estimate.losses}%</span>
                </div>
              </div>
            </div>

            {/* Calculation Assumptions - Blurred */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculation Assumptions</h2>
              <BlurMask>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">Federal Tax Credit (ITC)</span>
                    <span className="font-bold text-gray-900">{(estimate.assumptions.itcPercentage * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">Cost per Watt</span>
                    <span className="font-bold text-gray-900">${estimate.assumptions.costPerWatt}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">Panel Degradation</span>
                    <span className="font-bold text-gray-900">{(estimate.assumptions.degradationRate * 100).toFixed(1)}%/year</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">O&M Cost</span>
                    <span className="font-bold text-gray-900">${estimate.assumptions.oandmPerKWYear}/kW/year</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">Rate Increase</span>
                    <span className="font-bold text-gray-900">{(estimate.assumptions.electricityRateIncrease * 100).toFixed(1)}%/year</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-gray-600">Discount Rate</span>
                    <span className="font-bold text-gray-900">{(estimate.assumptions.discountRate * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </BlurMask>
            </div>
          </motion.div>

          {/* Final CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.0, duration: 0.8 }} 
            className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Unlock Your Full Report?</h2>
            <p className="text-xl mb-8 opacity-90">
              Get complete financial projections, detailed assumptions, and unblurred savings charts
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <EnhancedCTA primary={true}>
                {getCTA(variant, "primary", b.domain)}
              </EnhancedCTA>
              <EnhancedCTA primary={false}>
                Request Sample Report
              </EnhancedCTA>
            </div>
            <PriceAnchor />
          </motion.div>
        </motion.div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center text-gray-500 text-sm">
          <p>Demo preview — some details hidden. Install your live version for exact values and complete analysis.</p>
        </div>
      </footer>
      
      {/* Demo components */}
      <InstallSheet />
      <StickyBuyBar />
    </div>
  );
}
