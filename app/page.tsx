'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PlaceResult } from '@/lib/calc';
import LegalFooter from '@/components/legal/LegalFooter';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import HeroBrand from '@/src/brand/HeroBrand';
import StickyBuyBar from '@/src/demo/StickyBuyBar';
import InstallSheet from '@/src/demo/InstallSheet';
import NavBrandOverride from '@/src/brand/NavBrandOverride';
// import { DemoBanner } from '@/src/demo/DemoChrome';
import { usePreviewQuota } from '@/src/demo/usePreviewQuota';
import { useCountdown } from '@/src/demo/useCountdown';
import SocialProof from '@/src/demo/SocialProof';
import LockOverlay from '@/src/demo/LockOverlay';
import { track } from '@/src/demo/track';
import Image from 'next/image';
import { IconBadge } from '@/components/ui/IconBadge';
import { useBrandColors } from '@/hooks/useBrandColors';
import LoadingFallback from '@/components/LoadingFallback';
import React from 'react';

const AddressAutocomplete = dynamic(() => import('@/components/AddressAutocomplete'), { 
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
});

function HomeContent() {
  console.log('[route] render start');
  
  const [address, setAddress] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  // Brand takeover mode detection
  const b = useBrandTakeover();
  
  // Debug logging for brand state
  useEffect(() => {
    console.log('Main page brand state:', b);
    console.log('Main page localStorage:', localStorage.getItem('sunspire-brand-takeover'));
  }, [b]);
  
  // Brand colors from URL
  useBrandColors();
  const { read, consume } = usePreviewQuota(2);
  const remaining = read();
  const countdown = useCountdown(b.expireDays);
  
  // Auto-open install sheet after first run
  const [hasShownInstall, setHasShownInstall] = useState(false);
  const shouldShowLock = b.enabled && (remaining <= 0 || countdown.isExpired);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track page view
  useEffect(() => {
    if (!isClient) return;
    
    if (b.enabled) {
      try {
        track("session_company", { 
          brand: b.brand || undefined,
          domain: b.domain || undefined,
          firstName: b.firstName || undefined,
          role: b.role || undefined,
          logo: b.logo || undefined
        });
      } catch (error) {
        console.warn('Tracking failed:', error);
      }
    }
  }, [isClient, b.enabled, b.brand, b.domain, b.firstName, b.role, b.logo]);

  const handleAddressSelect = (placeResult: PlaceResult) => {
    setAddress(placeResult.formattedAddress);
    setSelectedPlace(placeResult);
    
    if (b.enabled && isClient) {
      try {
        track("address_entered", {
          brand: b.brand || undefined,
          domain: b.domain || undefined,
          address: placeResult.formattedAddress
        });
      } catch (error) {
        console.warn('Tracking failed:', error);
      }
    }
  };

  const handleGenerateEstimate = () => {
    if (!address.trim()) return;
    
    if (b.enabled) {
      if (remaining <= 0 || countdown.isExpired) {
        return; // LockOverlay will handle this
      }
      
      consume();
      
      try {
        track("run_start", { event: "run_start", runsUsed: 2 - remaining + 1 });
        
        // Track report generation
        track("report_generated", {
          brand: b.brand || undefined,
          domain: b.domain || undefined,
          address: address
        });
      } catch (error) {
        console.warn('Tracking failed:', error);
      }
      
      // Auto-open install sheet after first run (sessionStorage guard)
      if (remaining === 2 && !hasShownInstall) {
        setHasShownInstall(true);
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent("openInstall"));
        }, 1000);
      }
      
      // Navigate to demo result page
      const u = new URL("/demo-result", location.origin);
      u.search = location.search; // keep personalization
      location.href = u.toString();
      return;
    }
    
    setIsLoading(true);
    if (selectedPlace) {
      const q = new URLSearchParams({
        address: selectedPlace.formattedAddress,
        lat: String(selectedPlace.lat),
        lng: String(selectedPlace.lng),
        placeId: selectedPlace.placeId,
      });
      router.push(`/report?${q.toString()}`);
    } else {
      const q = new URLSearchParams({ address, lat: '40.7128', lng: '-74.0060', placeId: 'demo' });
      router.push(`/report?${q.toString()}`);
    }
  };

  const handleLaunchClick = () => {
    if (b.enabled) {
      track("cta_launch_clicked", {
        brand: b.brand || undefined,
        domain: b.domain || undefined,
        placement: "header"
      });
      document.dispatchEvent(new CustomEvent("openInstall"));
    }
  };

  // Add debug markers and content shown sentinel - force redeploy
  useEffect(() => { 
    console.log('[route] hydrated');
    (window as any).__CONTENT_SHOWN__ = true; 
  }, []);

  // Don't block render on brand takeover - show content immediately
  // The brand takeover will update the UI when ready
  // Remove the early return to show full content always

  const initials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter" data-demo={b.enabled}>
              {/* <DemoBanner /> */}


      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center space-y-12">
          
          {/* Company Branding Section */}
          {b.enabled && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1, duration: 0.8 }}
              className="mt-4 mb-8"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl py-6 px-8 border border-gray-200/50 shadow-lg mx-auto max-w-2xl">
                <div className="space-y-4 text-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Built for Your Company
                  </h2>
                  <p className="text-lg text-gray-600">
                    Exclusive preview of your white-label solar intelligence tool
                  </p>
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 border border-gray-200 text-gray-600">
                    <span className="mr-2">⚡</span>
                    White-label ready
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* HERO ICON: render only one (fix double) */}
          {!b.enabled ? (
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${b.primary}, ${b.primary}CC)` }}>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" 
                animate={{ x: ['-100%', '100%'] }} 
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} 
              />
              <span className="text-6xl relative z-10">☀️</span>
            </div>
          ) : (
            <HeroBrand />
          )}
          
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="relative">
              <motion.div 
                className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg" 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white text-lg">✓</span>
              </motion.div>
            </motion.div>

            <div className="space-y-6">
              <motion.h1 
                className="text-5xl md:text-7xl font-black text-gray-900 leading-tight" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {b.enabled ? (
                  <>
                    White-Label Solar Tool
                    <span className="block text-[var(--brand-primary)]">— Live in 10 Minutes</span>
                  </>
                ) : (
                  <>
                    Solar Intelligence
                    <span className="block text-[var(--brand-primary)]">in Seconds</span>
                  </>
                )}
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {b.enabled 
                  ? `Embed a branded quote tool on your domain. Turn visitors into booked calls. 14-day refund if it doesn't lift conversions.`
                  : "Transform your property with AI-powered solar analysis. Get instant estimates, detailed reports, and connect with premium installers."
                }
              </motion.p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.8, duration: 0.8 }} 
            className="flex flex-wrap justify-center gap-8 text-sm"
          >
            {/* Tenant trust badges are removed as per edit hint */}
            {/* {tenant.trustBadges.slice(0, 3).map((badge, index) => ( */}
            {/*   <div key={index} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200/50"> */}
            {/*     <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div> */}
            {/*     <span className="font-semibold text-gray-700">{badge}</span> */}
            {/*   </div> */}
            {/* ))} */}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.0, duration: 0.8 }} 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 p-8 md:p-12 max-w-3xl mx-auto"
          >
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Enter Your Property Address</h2>
                <p className="text-gray-600">Get a comprehensive solar analysis tailored to your specific location</p>
              </div>

              <div className="space-y-6">
                {/* Address Input - Show for both demo and regular modes */}
                <div className="w-full max-w-2xl mx-auto">
                  <AddressAutocomplete 
                    value={address}
                    onChange={setAddress}
                    onSelect={handleAddressSelect}
                    placeholder={b.city ? `Start typing an address in ${b.city}...` : "Start typing your property address..."}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Enter your property address to get started
                  </p>
                </div>

                {/* Generate Button - Now below the search bar */}
                <motion.button 
                  onClick={b.enabled && address.trim() ? handleGenerateEstimate : (b.enabled ? handleLaunchClick : handleGenerateEstimate)} 
                  disabled={!b.enabled && !address.trim() || isLoading} 
                  className={`w-full ${
                    (!b.enabled && !address.trim()) || isLoading 
                      ? 'btn-disabled' 
                      : b.enabled
                        ? 'btn-cta'
                        : 'btn-cta'
                  }`} 
                  whileHover={(!b.enabled && !address.trim()) || isLoading ? {} : { scale: 1.02 }} 
                  whileTap={(!b.enabled && !address.trim()) || isLoading ? {} : { scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing Your Property...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-4">
                      <span>
                        {b.enabled 
                          ? (address.trim() ? `Generate Solar Report` : `Launch Tool`)
                          : "Generate Solar Intelligence Report"
                        }
                      </span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  )}
                </motion.button>
                
                {b.enabled && (
                  <div className="text-sm text-gray-500 text-center space-y-2">
                    <p>Preview: {remaining} run{remaining===1?"":"s"} left.</p>
                    <p>Expires in {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.2, duration: 0.8 }} 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 drop-shadow-sm">NREL v8</div>
              <div className="text-gray-700 font-bold text-lg tracking-wide">Industry Standard</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 drop-shadow-sm">SOC 2</div>
              <div className="text-gray-700 font-bold text-lg tracking-wide">Compliance</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 drop-shadow-sm">CRM Ready</div>
              <div className="text-gray-700 font-bold text-lg tracking-wide">HubSpot, Salesforce</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 drop-shadow-sm">24/7</div>
              <div className="text-gray-700 font-bold text-lg tracking-wide">Support</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.4, duration: 0.8 }} 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <div className="feature-card p-5 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div className="title">NREL PVWatts® v8</div>
              <div className="desc">Industry-standard solar modeling with current utility rates</div>
            </div>
            <div className="feature-card p-5 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div className="title">CRM Integration</div>
              <div className="desc">Direct push to HubSpot, Salesforce, and Airtable</div>
            </div>
            <div className="feature-card p-5 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div className="title">End-to-End Encryption</div>
              <div className="desc">SOC 2-aligned controls and data protection</div>
            </div>

          </motion.div>

          {/* Logos Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.5, duration: 0.8 }} 
            className="text-center"
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <span className="text-gray-600 font-medium">Dozens of installers • CRM-ready • SOC 2-aligned</span>
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.6, duration: 0.8 }} 
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg">
                  <span>1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Add the widget</h3>
                <p className="text-gray-600">One line of code to embed on your website</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg">
                  <span>2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Visitors get instant quotes</h3>
                <p className="text-gray-600">AI-powered analysis in seconds</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--brand-primary)] to-white rounded-2xl flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg">
                  <span>3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Your team gets booked calls</h3>
                <p className="text-gray-600">Qualified leads ready to convert</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.8, duration: 0.8 }} 
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">CMS? — Yes, 1-line &lt;script&gt;. Hosted option too.</h3>
                <p className="text-gray-600">Works with any website platform. Just add one line of code.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Accuracy? — NREL PVWatts v8 • EIA rates • local irradiance</h3>
                <p className="text-gray-600">Industry-standard data sources. <a href="/methodology" className="text-blue-600 hover:underline">View methodology</a>.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Security? — Encrypted in transit & at rest</h3>
                <p className="text-gray-600">Bank-level security for all customer data.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel? — Yes, 14-day refund if it doesn't lift booked calls</h3>
                <p className="text-gray-600">No long-term contracts. Cancel anytime.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Support? — Email support 24/7</h3>
                <p className="text-gray-600">Get help whenever you need it.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter brand={b.enabled ? b.brand : undefined} />
      </footer>
      
      {/* Demo components - only show when brand takeover is enabled */}
      <InstallSheet />
      <StickyBuyBar />
      {shouldShowLock && <LockOverlay />}
      <SocialProof />
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
// Force Vercel deployment
