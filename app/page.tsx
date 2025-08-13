'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { TenantProvider, useTenant } from '@/components/TenantProvider';
import { PlaceResult } from '@/lib/calc';
import LegalFooter from '@/components/legal/LegalFooter';
import { usePersonalization } from '@/components/usePersonalization';


import { useIsDemo, useDemoParams, useDemoQuota } from '@/src/demo/useDemo';
import { usePersonalizationCtx, PersonalizationProvider } from '@/src/personalization/PersonalizationContext';
import { DemoBanner, DemoStickyBar } from '@/src/demo/DemoChrome';
import InstallSheet from '@/src/demo/InstallSheet';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import DemoRibbon from '@/components/ui/DemoRibbon';

const AddressAutocomplete = dynamic(() => import('@/components/AddressAutocomplete'), { ssr: false });

function HomeContent() {
  const [address, setAddress] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { tenant, loading: tenantLoading } = useTenant();
  
  // Global personalization for every page
  const { company, domain, logoUrl, gradient, isPersonalized, mounted } = usePersonalization();
  
  // Demo mode detection
  const isDemo = useIsDemo();
  const { city, runs, blur } = useDemoParams();
  const { remaining, consume } = useDemoQuota(runs);

  const handleAddressSelect = (placeResult: PlaceResult) => {
    setAddress(placeResult.formattedAddress);
    setSelectedPlace(placeResult);
  };

  const handleGenerateEstimate = () => {
    if (!address.trim()) return;
    
    if (isDemo) {
      if (runs <= 0) {
        alert("Demo mode: address submission is disabled. Click 'Put this on our site' to install your live version.");
        return;
      }
      if (remaining <= 0) {
        alert("Demo limit reached. Click 'Put this on our site' to install your live version.");
        return;
      }
      consume();
      // Navigate to demo result page
      const url = new URL("/demo-result", window.location.origin);
      url.search = window.location.search; // preserve personalization + demo params
      window.location.href = url.toString();
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

  // Show loading until both tenant and personalization are ready
  if (tenantLoading || !tenant || !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
        <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              {/* Personalization: Logo with company favicon if available */}
              {isPersonalized && logoUrl ? (
                <motion.div 
                  className="w-12 h-12 rounded-2xl shadow-2xl overflow-hidden"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img 
                    src={logoUrl} 
                    alt={`${company} logo`} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ) : (
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="text-white font-bold text-lg">☀️</span>
                </motion.div>
              )}
              <div>
                {/* Personalization: Company name in header */}
                <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  {isPersonalized ? company : tenant.name}
                </h1>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                  {isPersonalized ? "Personalized Solar Intelligence" : tenant.tagline}
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Enterprise</a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Partners</a>
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Support</a>
              <motion.button 
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center space-y-12">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="relative">
              {/* Personalization: Dynamic gradient based on company */}
              <div 
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden"
                style={{
                  background: isPersonalized 
                    ? `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                    : 'linear-gradient(135deg, #f97316, #dc2626, #ec4899)'
                }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
                <span className="text-6xl relative z-10">☀️</span>
              </div>
              <motion.div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <span className="text-white text-lg">✓</span>
              </motion.div>
            </motion.div>

            <div className="space-y-6">
              {/* Personalization: Headline text */}
              <motion.h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
                {isPersonalized ? `Custom Sunspire Demo for ${company}` : "Solar Intelligence"}
                <span className="block text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text">in Seconds</span>
              </motion.h1>
              {/* Personalization: Body copy snippets */}
              <motion.p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
                {isPersonalized 
                  ? `${company}, here's how we turn visitors into booked solar calls (no dev work).`
                  : "Transform your property with AI-powered solar analysis. Get instant estimates, detailed reports, and connect with premium installers."
                }
              </motion.p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex flex-wrap justify-center gap-8 text-sm">
            {tenant.trustBadges.slice(0, 3).map((badge, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200/50">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-700">{badge}</span>
              </div>
            ))}
          </motion.div>

          {isDemo ? (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.8 }} className="space-y-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 p-8 md:p-12 max-w-3xl mx-auto">
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Enter Your Property Address</h2>
                    <p className="text-gray-600">Get a comprehensive solar analysis tailored to your specific location</p>
                  </div>

                  <div className="space-y-6">
                    <AddressAutocomplete 
                      value={address} 
                      onChange={setAddress} 
                      onSelect={handleAddressSelect} 
                      placeholder={isDemo && city ? `Start typing an address in ${city}...` : "Start typing your property address..."} 
                      className="w-full" 
                    />
                    <motion.button onClick={handleGenerateEstimate} disabled={!address.trim() || isLoading} className={`w-full py-6 px-8 rounded-2xl text-lg font-bold text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${!address.trim() || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600'}`} whileHover={!address.trim() || isLoading ? {} : { scale: 1.02 }} whileTap={!address.trim() || isLoading ? {} : { scale: 0.98 }}>
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-4">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Analyzing Your Property...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-4">
                          <span>Generate Solar Intelligence Report</span>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </div>
                      )}
                    </motion.button>
                    
                    {isDemo && runs <= 0 && (
                      <p className="text-sm text-gray-500 text-center">Demo mode: Address submission is disabled. Click 'Put this on our site' to install your live version.</p>
                    )}
                    {isDemo && runs > 0 && (
                      <p className="text-sm text-gray-500 text-center">Demo mode: You have {remaining} test run{remaining === 1 ? "" : "s"}.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.8 }} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 p-8 md:p-12 max-w-3xl mx-auto">
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">Enter Your Property Address</h2>
                  <p className="text-gray-600">Get a comprehensive solar analysis tailored to your specific location</p>
                </div>

                <div className="space-y-6">
                  <AddressAutocomplete 
                    value={address} 
                    onChange={setAddress} 
                    onSelect={handleAddressSelect} 
                    placeholder="Start typing your property address..." 
                    className="w-full" 
                  />
                  <motion.button onClick={handleGenerateEstimate} disabled={!address.trim() || isLoading} className={`w-full py-6 px-8 rounded-2xl text-lg font-bold text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${!address.trim() || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600'}`} whileHover={!address.trim() || isLoading ? {} : { scale: 1.02 }} whileTap={!address.trim() || isLoading ? {} : { scale: 0.98 }}>
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing Your Property...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-4">
                        <span>Generate Solar Intelligence Report</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300"><div className="text-4xl font-black text-gray-900 mb-2">50K+</div><div className="text-gray-600 font-semibold">Properties Analyzed</div></div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300"><div className="text-4xl font-black text-gray-900 mb-2">{isDemo ? "—" : "$2.5M"}</div><div className="text-gray-600 font-semibold">Total Savings Generated</div></div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300"><div className="text-4xl font-black text-gray-900 mb-2">98%</div><div className="text-gray-600 font-semibold">Accuracy Rate</div></div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300"><div className="text-4xl font-black text-gray-900 mb-2">24/7</div><div className="text-gray-600 font-semibold">AI Support</div></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Advanced Analytics</h3>
              <p className="text-gray-600">AI-powered insights with 25-year projections and ROI analysis</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Premium Network</h3>
              <p className="text-gray-600">Connect with verified, top-rated solar installers in your area</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Enterprise Security</h3>
              <p className="text-gray-600">Bank-level encryption and SOC 2 compliance for your data</p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter />
      </footer>
      <InstallSheet />
      <DemoStickyBar />
    </div>
    </>
  );
}

export default function Home() {
  return (
    <TenantProvider>
      <PersonalizationProvider>
        <DemoRibbon />
        <AppErrorBoundary>
          <HomeContent />
        </AppErrorBoundary>
        <InstallSheet />
        <DemoStickyBar />
      </PersonalizationProvider>
    </TenantProvider>
  );
}
