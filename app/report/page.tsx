'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { TenantProvider, useTenant } from '@/components/TenantProvider';
import { LeadModal } from '@/components/LeadModal';
import { SolarEstimate } from '@/lib/estimate';
import EstimateChart from '@/components/EstimateChart';
import { formatDateSafe } from '@/lib/format';
import LegalFooter from '@/components/legal/LegalFooter';
import { IconBadge } from '@/components/ui/IconBadge';
import UnlockButton from '@/components/UnlockButton';

import { useBrandColors } from '@/hooks/useBrandColors';
import StickyBuyBar from '@/src/demo/StickyBuyBar';
import InstallSheet from '@/src/demo/InstallSheet';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import HeroBrand from '@/src/brand/HeroBrand';
import { DemoBanner } from '@/src/demo/DemoChrome';
import Image from 'next/image';

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tenant, loading: tenantLoading } = useTenant();
  const [estimate, setEstimate] = useState<SolarEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  
  // Brand takeover mode detection
  const b = useBrandTakeover();
  
  // Brand colors from URL
  useBrandColors();

  const demoAddressesByState: Record<string, {address:string, lat:number, lng:number}> = {
    AZ: { address: "123 N Central Ave, Phoenix, AZ", lat: 33.4484, lng: -112.0740 },
    CA: { address: "111 S Spring St, Los Angeles, CA", lat: 34.0537, lng: -118.2428 },
    FL: { address: "200 S Orange Ave, Orlando, FL", lat: 28.5384, lng: -81.3789 },
    GA: { address: "2 City Plaza, Atlanta, GA", lat: 33.749, lng: -84.388 },
    TX: { address: "901 S Mopac Expy, Austin, TX", lat: 30.2672, lng: -97.7431 },
    NV: { address: "400 Stewart Ave, Las Vegas, NV", lat: 36.1716, lng: -115.1391 }
  };

  function pickDemoAddress(state?: string) {
    if (state && demoAddressesByState[state]) return demoAddressesByState[state];
    return demoAddressesByState["AZ"]; // sunny default
  }

  useEffect(() => {
    const demoFlag = searchParams.get('demo');
    const isDemo = !!demoFlag && demoFlag !== '0' && demoFlag !== 'false';

    let address = searchParams.get('address') || '';
    let lat = parseFloat(searchParams.get('lat') || '');
    let lng = parseFloat(searchParams.get('lng') || '');
    const placeId = searchParams.get('placeId');
    const state = searchParams.get('state') || undefined;

    // If demo and missing coords, pick a good default by state
    if (isDemo && (!Number.isFinite(lat) || !Number.isFinite(lng) || !address)) {
      const pick = pickDemoAddress(state);
      address = pick.address;
      lat = pick.lat;
      lng = pick.lng;
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError('Missing or invalid coordinates.');
      setIsLoading(false);
      return;
    }

    if (address && lat && lng) {
      fetchEstimate(address, lat, lng, placeId);
    } else {
      setError('Missing address or coordinates.');
      setIsLoading(false);
    }
  }, [searchParams]);

  const fetchEstimate = async (address: string, lat: number, lng: number, placeId?: string | null) => {
    try {
      const params = new URLSearchParams({ address, lat: String(lat), lng: String(lng), ...(placeId && { placeId }) });
      const response = await fetch(`/api/estimate?${params}`);
      if (!response.ok) throw new Error(`Failed to fetch estimate: ${response.status}`);
      const data = await response.json();
      if (!data.estimate) throw new Error('No estimate data in response');
      setEstimate(data.estimate);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setEstimate({
        id: Date.now().toString(),
        address,
        coordinates: { lat, lng },
        date: new Date(),
        systemSizeKW: 8.6,
        tilt: 20,
        azimuth: 180,
        losses: 14,
        annualProductionKWh: 11105634,
        monthlyProduction: Array(12).fill(1000),
        solarIrradiance: 4.5,
        grossCost: 25800,
        netCostAfterITC: 18060,
        year1Savings: 2254,
        paybackYear: 8,
        npv25Year: 73000,
        co2OffsetPerYear: 10200,
        utilityRate: 0.14,
        utilityRateSource: 'Static',
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
          production: Math.round(12000 * Math.pow(0.995, i)),
          savings: Math.round(12000 * Math.pow(0.995, i) * 0.14),
          cumulativeSavings: Math.round(12000 * 0.14 * (i + 1)),
          netCashflow: Math.round(12000 * 0.14 * (i + 1) - 18060),
        })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (tenantLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-900">Generating your solar intelligence report...</p>
        </div>
      </div>
    );
  }

  if (error && !estimate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 max-w-md">
            <div className="font-semibold mb-2">Error Loading Report</div>
            <div>{error}</div>
            <button onClick={() => router.push('/')} className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (!estimate) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter" data-demo={b.enabled}>
      <DemoBanner />
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              {!b.enabled ? (
                <motion.div whileHover={{ scale: 1.05, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <IconBadge>☀️</IconBadge>
                </motion.div>
              ) : (
                <HeroBrand />
              )}
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  {b.enabled ? b.brand : tenant?.name}
                </h1>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                  {b.enabled ? "Solar Intelligence Report" : "Solar Intelligence Report"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button 
                onClick={() => router.push('/')} 
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
          <div className="text-center space-y-6">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="w-24 h-24 mx-auto">
              <div className="brand-gradient text-white rounded-full w-24 h-24 grid place-items-center shadow-[0_8px_30px_rgba(0,0,0,.08)]">
                <span className="text-4xl">📊</span>
              </div>
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900">Solar Intelligence Report</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive analysis for your property at {estimate.address}</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Data Source: {estimate.utilityRateSource}</span>
                <span>•</span>
                <span>Generated on {formatDateSafe(estimate.date)}</span>
              </div>
            </div>
          </div>

          {/* Trust elements and CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/tenant-preview?demo=1"
              className={`px-5 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 ${
                b.enabled 
                  ? 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90' 
                  : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500'
              }`}
            >
              Put this on our site
            </a>
            <div className="text-xs text-slate-500">
              Data sources: PVWatts v8 (NREL) • EIA rates • HTTPS encrypted
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              {/* BLUR LAYER (kept behind button) */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none" aria-hidden />
              
              {/* CONTENT LAYER */}
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4"><IconBadge>⚡</IconBadge></div>
                <div className="text-3xl font-black text-gray-900 mb-2">{estimate.systemSizeKW} kW</div>
                <div className="text-gray-600 font-semibold">System Size</div>
              </div>

              {/* UNLOCK BUTTON (always sharp, centered, consistent spacing) */}
              <UnlockButton
                label="Unlock Full Report"
                onClick={() => {}} // TODO: Add checkout function
                className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              {/* BLUR LAYER (kept behind button) */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none" aria-hidden />
              
              {/* CONTENT LAYER */}
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4"><IconBadge>☀️</IconBadge></div>
                <div className="text-3xl font-black text-gray-900 mb-2">{estimate.annualProductionKWh.toLocaleString()} kWh</div>
                <div className="text-gray-600 font-semibold">Annual Production</div>
              </div>

              {/* UNLOCK BUTTON (always sharp, centered, consistent spacing) */}
              <UnlockButton
                label="Unlock Full Report"
                onClick={() => {}} // TODO: Add checkout function
                className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              {/* BLUR LAYER (kept behind button) */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none" aria-hidden />
              
              {/* CONTENT LAYER */}
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4"><IconBadge>💰</IconBadge></div>
                <div className="text-3xl font-black text-gray-900 mb-2">${estimate.netCostAfterITC.toLocaleString()}</div>
                <div className="text-gray-600 font-semibold">Net Cost (After ITC)</div>
              </div>

              {/* UNLOCK BUTTON (always sharp, centered, consistent spacing) */}
              <UnlockButton
                label="Unlock Full Report"
                onClick={() => {}} // TODO: Add checkout function
                className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              {/* BLUR LAYER (kept behind button) */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none" aria-hidden />
              
              {/* CONTENT LAYER */}
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4"><IconBadge>📈</IconBadge></div>
                <div className="text-3xl font-black text-gray-900 mb-2">{estimate.year1Savings.toLocaleString()}</div>
                <div className="text-gray-600 font-semibold">Year 1 Savings</div>
              </div>

              {/* UNLOCK BUTTON (always sharp, centered, consistent spacing) */}
              <UnlockButton
                label="Unlock Full Report"
                onClick={() => {}} // TODO: Add checkout function
                className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2"
              />
            </div>
          </motion.div>

          <div className="relative rounded-2xl bg-white p-5 overflow-hidden">
            <div className="relative z-10 min-h-[400px]">
              <EstimateChart cashflowData={estimate.cashflowProjection} netCostAfterITC={estimate.netCostAfterITC} />
            </div>
            <div className="relative z-10 flex justify-center mt-4">
              <UnlockButton
                label="Unlock Full Report"
                onClick={() => {}} // TODO: Add checkout function
              />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Financial Analysis - Unblurred */}
            <div className="relative rounded-2xl p-8 bg-white border border-gray-200/50">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Analysis</h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Payback Period</span><span className="font-bold text-gray-900">{estimate.paybackYear} years</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">25-Year NPV</span><span className="font-bold text-gray-900">${estimate.npv25Year.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">ROI</span><span className="font-bold text-gray-900">{Math.round(((estimate.npv25Year + estimate.netCostAfterITC) / estimate.netCostAfterITC) * 100)}%</span></div>
                  <div className="flex justify-between items-center py-4"><span className="text-gray-600">Electricity Rate</span><span className="font-bold text-gray-900">${estimate.utilityRate}/kWh ({estimate.utilityRateSource})</span></div>
                </div>
              </div>
            </div>

            {/* Environmental Impact - Blurred */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50">
              {/* BLUR LAYER */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none" aria-hidden />
              
              {/* CONTENT LAYER */}
              <div className="relative z-10 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Environmental Impact</h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">CO₂ Offset/Year</span><span className="font-bold text-gray-900">{estimate.co2OffsetPerYear.toLocaleString()} lbs</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Solar Irradiance</span><span className="font-bold text-gray-900">{estimate.solarIrradiance} kWh/m²/day</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">System Tilt</span><span className="font-bold text-gray-900">{estimate.tilt}°</span></div>
                  <div className="flex justify-between items-center py-4"><span className="text-gray-600">System Losses</span><span className="font-bold text-gray-900">{estimate.losses}%</span></div>
                </div>
              </div>

              {/* UNLOCK BUTTON (always sharp, centered, consistent spacing) */}
              <UnlockButton
                label="Unlock Full Report"
                onClick={() => {}} // TODO: Add checkout function
                className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2"
              />
            </div>

            {/* Calculation Assumptions - Unblurred */}
            <div className="relative rounded-2xl p-8 bg-white border border-gray-200/50">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculation Assumptions</h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Federal Tax Credit (ITC)</span><span className="text-gray-900 font-bold">{(estimate.assumptions.itcPercentage * 100).toFixed(0)}%</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Cost per Watt</span><span className="text-gray-900 font-bold">${estimate.assumptions.costPerWatt}</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Panel Degradation</span><span className="text-gray-900 font-bold">{(estimate.assumptions.degradationRate * 100).toFixed(1)}%/year</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">O&M Cost</span><span className="text-gray-900 font-bold">${estimate.assumptions.oandmPerKWYear}/kW/year</span></div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Rate Increase</span><span className="text-gray-900 font-bold">{(estimate.assumptions.electricityRateIncrease * 100).toFixed(1)}%/year</span></div>
                  <div className="flex justify-between items-center py-4"><span className="text-gray-600">Discount Rate</span><span className="text-gray-900 font-bold">{(estimate.assumptions.discountRate * 100).toFixed(0)}%</span></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.8 }} className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl py-12 px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Go Solar?</h2>
            <p className="text-xl mb-10 opacity-90">Connect with verified solar installers in your area and get started today</p>
            <motion.button onClick={() => setShowLeadModal(true)} className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Get Matched with Installers</motion.button>
          </motion.div>
        </motion.div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter />
      </footer>

      {estimate && (
        <LeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} estimate={estimate} address={estimate.address} />
      )}
      
      {/* Demo components - only show when brand takeover is enabled */}
      <InstallSheet />
      <StickyBuyBar />
    </div>
  );
}

export default function ReportPage() {
  return (
    <TenantProvider>
      <ReportContent />
    </TenantProvider>
  );
}
