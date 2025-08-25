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
import LockedBlur from '@/src/components/LockedBlur';
import { ensureBlurSupport } from '@/src/lib/ensureBlur';

import { useBrandColors } from '@/hooks/useBrandColors';
import { getBrandTheme } from '@/lib/brandTheme';
import StickyBuyBar from '@/src/demo/StickyBuyBar';
import InstallSheet from '@/src/demo/InstallSheet';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import HeroBrand from '@/src/brand/HeroBrand';
import StickyCTA from '@/components/StickyCTA';
// import { DemoBanner } from '@/src/demo/DemoChrome';
import Image from 'next/image';

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tenant, loading: tenantLoading } = useTenant();
  const [estimate, setEstimate] = useState<SolarEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  
  // Brand takeover mode detection
  const b = useBrandTakeover();
  
  // Brand colors from URL
  useBrandColors();

  // Generate a default logo URL for common companies when no logo is provided
  const getDefaultLogo = (brand: string) => {
    const brandLower = brand.toLowerCase();
    
    // Tech companies
    if (brandLower.includes('google')) return 'https://logo.clearbit.com/google.com';
    if (brandLower.includes('microsoft')) return 'https://logo.clearbit.com/microsoft.com';
    if (brandLower.includes('apple')) return 'https://logo.clearbit.com/apple.com';
    if (brandLower.includes('amazon')) return 'https://logo.clearbit.com/amazon.com';
    if (brandLower.includes('meta') || brandLower.includes('facebook')) return 'https://logo.clearbit.com/facebook.com';
    if (brandLower.includes('netflix')) return 'https://logo.clearbit.com/netflix.com';
    if (brandLower.includes('spotify')) return 'https://logo.clearbit.com/spotify.com';
    if (brandLower.includes('twitter')) return 'https://logo.clearbit.com/twitter.com';
    if (brandLower.includes('linkedin')) return 'https://logo.clearbit.com/linkedin.com';
    if (brandLower.includes('instagram')) return 'https://logo.clearbit.com/instagram.com';
    if (brandLower.includes('twitch')) return 'https://logo.clearbit.com/twitch.tv';
    if (brandLower.includes('discord')) return 'https://logo.clearbit.com/discord.com';
    if (brandLower.includes('slack')) return 'https://logo.clearbit.com/slack.com';
    if (brandLower.includes('shopify')) return 'https://logo.clearbit.com/shopify.com';
    if (brandLower.includes('uber')) return 'https://logo.clearbit.com/uber.com';
    if (brandLower.includes('lyft')) return 'https://logo.clearbit.com/lyft.com';
    
    // Solar companies
    if (brandLower.includes('tesla')) return 'https://logo.clearbit.com/tesla.com';
    if (brandLower.includes('sunpower')) return 'https://logo.clearbit.com/sunpower.com';
    if (brandLower.includes('solarcity')) return 'https://logo.clearbit.com/solarcity.com';
    if (brandLower.includes('vivint')) return 'https://logo.clearbit.com/vivint.com';
    if (brandLower.includes('sunrun')) return 'https://logo.clearbit.com/sunrun.com';
    if (brandLower.includes('sunnova')) return 'https://logo.clearbit.com/sunnova.com';
    if (brandLower.includes('tealenergy')) return 'https://logo.clearbit.com/tealenergy.com';
    
    // Energy companies
    if (brandLower.includes('bp')) return 'https://logo.clearbit.com/bp.com';
    if (brandLower.includes('shell')) return 'https://logo.clearbit.com/shell.com';
    if (brandLower.includes('exxon')) return 'https://logo.clearbit.com/exxonmobil.com';
    if (brandLower.includes('chevron')) return 'https://logo.clearbit.com/chevron.com';
    
    // Real estate/home
    if (brandLower.includes('zillow')) return 'https://logo.clearbit.com/zillow.com';
    if (brandLower.includes('redfin')) return 'https://logo.clearbit.com/redfin.com';
    if (brandLower.includes('realtor')) return 'https://logo.clearbit.com/realtor.com';
    if (brandLower.includes('homedepot')) return 'https://logo.clearbit.com/homedepot.com';
    
    // Financial services
    if (brandLower.includes('chase')) return 'https://logo.clearbit.com/chase.com';
    if (brandLower.includes('wellsfargo')) return 'https://logo.clearbit.com/wellsfargo.com';
    if (brandLower.includes('bankofamerica')) return 'https://logo.clearbit.com/bankofamerica.com';
    if (brandLower.includes('goldmansachs')) return 'https://logo.clearbit.com/goldmansachs.com';
    
    // Other popular brands
    if (brandLower.includes('starbucks')) return 'https://logo.clearbit.com/starbucks.com';
    if (brandLower.includes('mcdonalds')) return 'https://logo.clearbit.com/mcdonalds.com';
    if (brandLower.includes('cocacola') || brandLower.includes('coca')) return 'https://logo.clearbit.com/coca-cola.com';
    if (brandLower.includes('target')) return 'https://logo.clearbit.com/target.com';
    if (brandLower.includes('bestbuy')) return 'https://logo.clearbit.com/bestbuy.com';
    if (brandLower.includes('snapchat')) return 'https://logo.clearbit.com/snapchat.com';
    if (brandLower.includes('whatsapp')) return 'https://logo.clearbit.com/whatsapp.com';
    if (brandLower.includes('firefox')) return 'https://logo.clearbit.com/mozilla.org';
    if (brandLower.includes('harleydavidson')) return 'https://logo.clearbit.com/harley-davidson.com';
    
    return null;
  };

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
    const company = searchParams.get('company');
    const isDemo = !!demoFlag && demoFlag !== '0' && demoFlag !== 'false';
    const hasBrand = !!company; // If we have a company parameter, treat it as a demo
    const demoModeValue = isDemo || hasBrand; // Combined demo mode for LockedBlur
    
    console.log('🔍 Demo mode detection:', {
      demoFlag,
      company,
      isDemo,
      hasBrand,
      demoModeValue,
      searchParams: Object.fromEntries(searchParams.entries())
    });
    
    // Set demo mode state
    setDemoMode(demoModeValue);

    // Ensure blur support is available
    ensureBlurSupport();

    let address = searchParams.get('address') || '';
    let lat = parseFloat(searchParams.get('lat') || '');
    let lng = parseFloat(searchParams.get('lng') || '');
    const placeId = searchParams.get('placeId');
    const state = searchParams.get('state') || undefined;

    // If demo/brand mode and missing coords, pick a good default by state
    if ((isDemo || hasBrand) && (!Number.isFinite(lat) || !Number.isFinite(lng) || !address)) {
      const pick = pickDemoAddress(state);
      address = pick.address;
      lat = pick.lat;
      lng = pick.lng;
    }

    // For demo mode, brand mode, or when we have coordinates, create a fallback estimate immediately
    if (isDemo || hasBrand || (address && Number.isFinite(lat) && Number.isFinite(lng))) {
      const fallbackEstimate = {
        id: Date.now().toString(),
        address: address || '123 Solar Street, San Diego, CA',
        coordinates: { lat: lat || 32.7157, lng: lng || -117.1611 },
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
        utilityRateSource: hasBrand ? 'Demo' : 'Demo',
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
      };
      
      setEstimate(fallbackEstimate);
      setIsLoading(false);
      
      // Try to fetch real estimate in background if we have coordinates
      if (address && Number.isFinite(lat) && Number.isFinite(lng)) {
        fetchEstimate(address, lat, lng, placeId);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter" data-demo={demoMode}>
      {/* Custom banner for report page */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              {demoMode ? (
                (b.logo || getDefaultLogo(b.brand)) ? (
                  <Image 
                    src={b.logo || getDefaultLogo(b.brand) || ''} 
                    alt={`${b.brand} logo`} 
                    width={48} 
                    height={48} 
                    className="rounded-lg"
                    style={{ 
                      objectFit: "contain",
                      width: "48px",
                      height: "48px",
                      minWidth: "48px",
                      minHeight: "48px",
                      maxWidth: "48px",
                      maxHeight: "48px"
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-bold">☀️</span>
                  </div>
                )
              ) : (
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">☀️</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-[var(--brand-primary)]">
                  {demoMode ? b.brand : 'Your Company'}
                </h1>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                  SOLAR INTELLIGENCE REPORT
                </p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-12">
              <a href="/pricing" className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Pricing</a>
              <a href="/partners" className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Partners</a>
              <a href="/support" className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Support</a>
              <motion.button 
                onClick={() => router.push('/')}
                className="btn-primary ml-12"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Analysis
              </motion.button>
            </nav>
          </div>
        </div>
      </header>

      <main data-testid="report-page" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Theme probe for testing */}
        <div data-testid="theme-probe" style={{ color: 'var(--brand)' }} className="hidden" />
        {/* Brand theme CSS variable */}
        <style>{`:root{--brand:${getBrandTheme(searchParams.get('company') || undefined)};}`}</style>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
          <div className="text-center space-y-6">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="w-24 h-24 mx-auto">
              {demoMode && (b.logo || getDefaultLogo(b.brand)) ? (
                <Image 
                  src={b.logo || getDefaultLogo(b.brand) || ''} 
                  alt={`${b.brand} logo`} 
                  width={96} 
                  height={96} 
                  className="rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,.08)]"
                  style={{ 
                    objectFit: "contain",
                    width: "96px",
                    height: "96px"
                  }}
                />
              ) : (
                <div className="brand-gradient text-white rounded-full w-24 h-24 grid place-items-center shadow-[0_8px_30px_rgba(0,0,0,.08)]">
                  <span className="text-4xl">☀️</span>
                </div>
              )}
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Solar Intelligence Report</h1>
              <p className="text-sm text-gray-500">Comprehensive analysis for your property at 123 N Central Ave, Phoenix, AZ</p>
              <p className="text-xs text-gray-400">Data Source: Demo • Generated on 8/24/2025</p>
            </div>
          </div>

          {/* Top Banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="text-center">
            <p className="text-sm text-gray-500">
              A ready-to-embed, white-label quote tool that turns traffic into booked consults — live on your site in minutes.
            </p>
          </motion.div>

          {/* Trust elements and CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/tenant-preview?demo=1"
              className={`px-5 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 ${
                demoMode 
                  ? 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90' 
                  : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500'
              }`}
            >
              Put this on our site
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(window.location.href);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Copy demo link
            </a>
            <div className="text-xs text-slate-500">
              Data sources: PVWatts v8 (NREL) • EIA rates • HTTPS encrypted
            </div>
          </motion.div>

          {/* Metric Tiles */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {/* System Size - NO BLUR, ALWAYS VISIBLE */}
            <div data-testid="tile-systemSize" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4 flex justify-center"><IconBadge>⚡</IconBadge></div>
                <div className="text-3xl font-black text-gray-900 mb-2">{estimate.systemSizeKW} kW</div>
                <div className="text-gray-600 font-semibold">System Size</div>
              </div>
            </div>
            
            {/* Annual Production - NO BLUR, ALWAYS VISIBLE */}
            <div data-testid="tile-annualProduction" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4 flex justify-center"><IconBadge>☀️</IconBadge></div>
                <div className="text-3xl font-black text-gray-900 mb-2">{estimate.annualProductionKWh.toLocaleString()} kWh</div>
                <div className="text-gray-600 font-semibold">Annual Production</div>
              </div>
            </div>
            
            {/* Net Cost - BLURRED WITH UNLOCK BUTTON */}
            <div data-testid="tile-lifetimeSavings" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4 flex justify-center"><IconBadge>💰</IconBadge></div>
                <LockedBlur active={demoMode} className="mb-2">
                  <div className="text-3xl font-black text-gray-900">${estimate.netCostAfterITC.toLocaleString()}</div>
                </LockedBlur>
                <div className="text-gray-600 font-semibold">Net Cost (After ITC)</div>
              </div>

              {/* UNLOCK BUTTON */}
              <UnlockButton
                label="Unlock Full Report →"
                onClick={() => {}} // TODO: Add checkout function
                className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2"
              />
            </div>
            
            {/* Year 1 Savings - BLURRED WITH UNLOCK BUTTON */}
            <div data-testid="tile-leads" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4 flex justify-center"><IconBadge>📈</IconBadge></div>
                <LockedBlur active={demoMode} className="mb-2">
                  <div className="text-3xl font-black text-gray-900">${estimate.year1Savings.toLocaleString()}</div>
                </LockedBlur>
                <div className="text-gray-600 font-semibold">Year 1 Savings</div>
              </div>

              {/* UNLOCK BUTTON */}
              <UnlockButton
                label="Unlock Full Report →"
                onClick={() => {}} // TODO: Add checkout function
                className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2"
              />
            </div>
          </motion.div>

          {/* Chart */}
          <div data-testid="savings-chart" className="relative rounded-2xl bg-white p-5 overflow-hidden">
            <div className="relative z-10 min-h-[400px]">
              <EstimateChart cashflowData={estimate.cashflowProjection} netCostAfterITC={estimate.netCostAfterITC} />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Financial Analysis - Blurred */}
            <div data-testid="locked-panel" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50">
              {/* CONTENT LAYER */}
              <div className="relative z-10 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Analysis</h2>
                <LockedBlur active={demoMode}>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Payback Period</span><span className="font-bold text-gray-900">{estimate.paybackYear} years</span></div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">25-Year NPV</span><span className="font-bold text-gray-900">${estimate.npv25Year.toLocaleString()}</span></div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">ROI</span><span className="font-bold text-gray-900">{Math.round(((estimate.npv25Year + estimate.netCostAfterITC) / estimate.netCostAfterITC) * 100)}%</span></div>
                    <div className="flex justify-between items-center py-4"><span className="text-gray-600">Electricity Rate</span><span className="font-bold text-gray-900">${estimate.utilityRate}/kWh ({estimate.utilityRateSource})</span></div>
                  </div>
                </LockedBlur>
              </div>

              {/* UNLOCK BUTTON */}
              <UnlockButton
                label="Unlock Full Report →"
                onClick={() => {}} // TODO: Add checkout function
                className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2"
              />
            </div>

            {/* Environmental Impact - Blurred */}
            <div data-testid="locked-panel" className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50">
              {/* CONTENT LAYER */}
              <div className="relative z-10 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Environmental Impact</h2>
                <LockedBlur active={demoMode}>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">CO₂ Offset/Year</span><span className="font-bold text-gray-900">{estimate.co2OffsetPerYear.toLocaleString()} lbs</span></div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">Solar Irradiance</span><span className="font-bold text-gray-900">{estimate.solarIrradiance} kWh/m²/day</span></div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-200"><span className="text-gray-600">System Tilt</span><span className="text-gray-900">{estimate.tilt}°</span></div>
                    <div className="flex justify-between items-center py-4"><span className="text-gray-600">System Losses</span><span className="font-bold text-gray-900">{estimate.losses}%</span></div>
                  </div>
                </LockedBlur>
              </div>

              {/* UNLOCK BUTTON */}
              <UnlockButton
                label="Unlock Full Report →"
                onClick={() => {}} // TODO: Add checkout function
                className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2"
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
                
                {/* Last Updated */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    Last updated {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.8 }} className="bg-black rounded-3xl py-12 px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Launch Your Branded Tool?</h2>
            <p className="text-xl mb-10 opacity-90">Get complete financial projections, detailed assumptions, and unblurred savings charts</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button 
                onClick={() => router.push('/tenant-preview?demo=1')}
                className="px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                Activate on Your Domain
              </motion.button>
              <motion.button 
                onClick={() => setShowLeadModal(true)}
                className="px-8 py-4 bg-black text-white rounded-2xl font-bold text-lg border-2 border-white hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-1" 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                Request Sample Report
              </motion.button>
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg mb-2">Only $99/mo + $399 setup. 14-day refund if it doesn&apos;t lift booked calls.</p>
              <p className="text-base opacity-90 mb-4">Cancel anytime. No long-term contracts.</p>
              <button 
                onClick={() => setShowLeadModal(true)}
                className="text-blue-400 underline hover:no-underline font-medium"
              >
                Email me full report
              </button>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-sm opacity-90">Full version from just $99/mo + $399 setup. Most tools cost $2,500+/mo.</p>
            </div>
          </motion.div>
          
          {/* Copy Demo Link Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.2, duration: 0.8 }} 
            className="text-center mb-8"
          >
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                // Could add a toast notification here
              }}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              📋 Copy Demo Link
            </button>
          </motion.div>
          
          {/* Disclaimer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.4, duration: 0.8 }} 
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 leading-relaxed">
                Estimates are informational only, based on modeled data (NREL PVWatts® v8 and current utility rates). 
                Actual results vary by site conditions and installation quality. Not a binding quote.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter brand={b.enabled ? b.brand : undefined} />
      </footer>

      {estimate && (
        <LeadModal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} estimate={estimate} address={estimate.address} />
      )}
      
      {/* Demo components - only show when brand takeover is enabled */}
      <InstallSheet />
      <StickyBuyBar />
      
      {/* Sticky CTA */}
      <StickyCTA />
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
