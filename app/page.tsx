'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PlaceResult } from '@/lib/calc';
import LegalFooter from '@/components/legal/LegalFooter';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import HeroBrand from '@/src/brand/HeroBrand';
import { useBrandColors } from '@/hooks/useBrandColors';
import LogoWall from '@/components/trust/LogoWall';
import Testimonial from '@/components/trust/Testimonial';
import MetricsBar from '@/components/trust/MetricsBar';
import AboutBlock from '@/components/trust/AboutBlock';
import TrustFooterLine from '@/components/trust/TrustFooterLine';
import { getTrustData } from '@/lib/trust';
import { usePreviewQuota } from '@/src/demo/usePreviewQuota';
import { useCountdown } from '@/src/demo/useCountdown';
import { useIsDemo } from '@/src/lib/isDemo';
import React from 'react';
import { attachCheckoutHandlers } from '@/src/lib/checkout';
import { tid } from '@/src/lib/testids';
import Footer from '@/components/Footer';

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
  const [showSampleReportModal, setShowSampleReportModal] = useState(false);
  const [sampleReportSubmitted, setSampleReportSubmitted] = useState(false);
  const [trustData, setTrustData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // Use useSearchParams for client-side access

  // Brand takeover mode detection
  const b = useBrandTakeover();
  
  // Demo mode detection - use brand state instead of separate hook
  const isDemo = b.isDemo;
  
  // Add loading state to wait for brand takeover to complete
  const [isBrandLoaded, setIsBrandLoaded] = useState(false);
  
  // Debug logging for brand state
  useEffect(() => {
    console.log('Main page brand state:', b);
    console.log('Main page localStorage:', localStorage.getItem('sunspire-brand-takeover'));
    console.log('Main page isDemo:', isDemo);
  }, [b, isDemo]);

  // Wait for brand takeover to complete - use a timeout to ensure state has time to update
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Brand loading check:', { brand: b.brand, isDemo, enabled: b.enabled });
      setIsBrandLoaded(true);
    }, 100); // Small delay to allow brand state to update

    return () => clearTimeout(timer);
  }, [b.brand, isDemo, b.enabled]);
  
  // Brand colors from URL
  useBrandColors();
  const { read, consume } = usePreviewQuota(2);
  const remaining = read();
  const countdown = useCountdown(b.expireDays);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load trust data
  useEffect(() => {
    getTrustData().then(setTrustData);
  }, []);

  // Attach checkout handlers to CTAs
  useEffect(() => {
    attachCheckoutHandlers();
  }, []);

  // Add debug markers and content shown sentinel - force redeploy
  useEffect(() => { 
    console.log('[route] hydrated');
    (window as any).__CONTENT_SHOWN__ = true; 
  }, []);

  // Check if we should redirect to paid version - add delay to allow brand state to load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDemo && typeof window !== 'undefined') {
        const company = searchParams.get('company');
        if (company) {
          // Redirect to paid version with all URL parameters
          const currentUrl = new URL(window.location.href);
          currentUrl.pathname = '/paid';
          window.location.href = currentUrl.toString();
          return;
        }
      }
    }, 100); // Small delay to allow brand state to update

    return () => clearTimeout(timer);
  }, [isDemo, searchParams]);

  // Early return for paid versions to prevent demo content from rendering
  if (!isDemo) {
    const company = searchParams.get('company');
    if (company) {
      return <div>Redirecting to paid version...</div>;
    }
  }



  const handleAddressSelect = (result: any) => {
    setAddress(result.formattedAddress);
    setSelectedPlace(result);
    
    if (b.enabled && isClient) {

    }
  };

  const handleGenerateEstimate = () => {
    if (!address.trim()) return;
    
    console.log('Generating estimate for address:', address);
    console.log('Selected place:', selectedPlace);
    
    // Check and consume quota
    if (b.enabled) {
      const currentQuota = read();
      console.log('🔒 Homepage quota check - currentQuota:', currentQuota);
      
      // Consume demo quota first
      consume();
      const newQuota = read();
      console.log('🔒 Homepage quota consumed, remaining:', newQuota);
      
      // If quota is now negative, navigate to lockout page
      if (newQuota < 0) {
        console.log('🔒 Quota exhausted after consumption, navigating to report page to show lockout');
        // Navigate to report page which will show lockout overlay
        const company = searchParams.get('company');
        const demo = searchParams.get('demo');
        
        const q = new URLSearchParams({ 
          address: address || '123 Main St', 
          lat: '40.7128', 
          lng: '-74.0060', 
          placeId: 'demo' 
        });
        
        if (company) q.set('company', company);
        if (demo) q.set('demo', demo);
        
        router.push(`/report?${q.toString()}`);
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Get current URL parameters to preserve company and demo
      const company = searchParams.get('company');
      const demo = searchParams.get('demo');
      
      if (selectedPlace && selectedPlace.formattedAddress) {
        const q = new URLSearchParams({
          address: selectedPlace.formattedAddress,
          lat: String(selectedPlace.lat),
          lng: String(selectedPlace.lng),
          placeId: selectedPlace.placeId,
        });
        
        // Add company and demo parameters if they exist
        if (company) q.set('company', company);
        if (demo) q.set('demo', demo);
        
        console.log('Navigating to report with selected place:', q.toString());
        router.push(`/report?${q.toString()}`);
      } else {
        const q = new URLSearchParams({ 
          address, 
          lat: '40.7128', 
          lng: '-74.0060', 
          placeId: 'demo' 
        });
        
        // Add company and demo parameters if they exist
        if (company) q.set('company', company);
        if (demo) q.set('demo', demo);
        
        console.log('Navigating to report with manual address:', q.toString());
        router.push(`/report?${q.toString()}`);
      }
    } catch (error) {
      console.error('Error generating estimate:', error);
      setIsLoading(false);
    }
  };

  const handleLaunchClick = async () => {
    if (b.enabled) {
      // Start Stripe checkout with tracking
      try {
        // Collect tracking parameters from URL
        const token = searchParams.get('token');
        const company = searchParams.get('company');
        const utm_source = searchParams.get('utm_source');
        const utm_campaign = searchParams.get('utm_campaign');
        
        // Show loading state
        const button = document.querySelector('[data-cta-button]') as HTMLButtonElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Loading...';
          button.disabled = true;
          
          // Start checkout
          const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              plan: 'starter',
              token,
              company,
              utm_source,
              utm_campaign
            })
          });
          
          if (!response.ok) {
            throw new Error('Checkout failed');
          }
          
          const { url } = await response.json();
          window.location.href = url;
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Unable to start checkout. Please try again.');
      }
    } else {
      // Route to signup page for non-branded experience
      router.push('/signup');
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter" data-demo={isDemo}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-6">
          
          {/* Live confirmation bar for paid mode */}
          {!isDemo && (
            <div className="mx-auto max-w-3xl mt-4 rounded-lg bg-emerald-50 text-emerald-900 text-sm px-4 py-2 border border-emerald-200" {...tid('live-bar')}>
              ✅ Live for <b>{b.brand || 'Your Company'}</b>. Leads now save to your CRM.
            </div>
          )}
          
          {/* Company Branding Section - Demo only */}
          {isDemo && b.enabled && (
            <div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl py-6 px-8 border border-gray-200/50 shadow-lg mx-auto max-w-2xl">
                <div className="space-y-4 text-center" {...tid('demo-cta')}>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Demo for {b.brand || 'Your Company'} — Powered by <span style={{ color: b.primary }}>Sunspire</span>
                  </h2>
                  <p className="text-lg text-gray-600">
                    Your Logo. Your URL. Instant Solar Quotes — Live in 24 Hours
                  </p>
                  <button 
                    data-cta="primary"
                    onClick={handleLaunchClick}
                    data-cta-button
                    className="inline-flex items-center px-4 py-4 rounded-full text-sm font-medium text-white border border-transparent shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer" 
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    <span className="mr-2">⚡</span>
                    Activate on Your Domain — 24 Hours
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    No call required. $99/mo + $399 setup. 14-day refund if it doesn&apos;t lift booked calls.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* HERO ICON: render only one (fix double) */}
          {!isBrandLoaded ? (
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden animate-pulse" style={{ background: `linear-gradient(135deg, #e5e7eb, #d1d5db)` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
            </div>
          ) : !b.enabled ? (
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${b.primary}, ${b.primary}CC)` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-6xl relative z-10">☀️</span>
            </div>
          ) : (
            <HeroBrand size="lg" />
          )}
          
          <div className="space-y-6">
            <div className="space-y-6">
              
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
                Your Branded Solar Quote Tool — Ready to Launch
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Go live in 24 hours. Capture more leads. Book more consults. Close more installs — all under your brand.
              </p>
              
              <div className="flex flex-col items-center space-y-4">
                <button 
                  onClick={handleLaunchClick}
                  data-cta-button
                  className="inline-flex items-center px-8 py-4 rounded-full text-lg font-medium text-white border border-transparent shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer" 
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  <span className="mr-2">⚡</span>
                  Activate on Your Domain — 24 Hours
                </button>
                <p className="text-sm text-slate-500">
                  $99/mo + $399 setup • 14-day refund if it doesn&rsquo;t lift booked calls
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm section-spacing">
            {/* Tenant trust badges are removed as per edit hint */}
            {/* {tenant.trustBadges.slice(0, 3).map((badge, index) => ( */}
            {/*   <div key={index} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200/50"> */}
            {/*     <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div> */}
            {/*     <span className="font-semibold text-gray-700">{badge}</span> */}
            {/*   </div> */}
            {/* ))} */}
          </div>

          {/* Address Input Section - Exact match to c548b88 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 p-8 md:p-12 max-w-3xl mx-auto section-spacing">
            <div className="space-y-6">
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
                </div>

                {/* Generate Button - Now below the search bar */}
                <button 
                  onClick={address.trim() ? handleGenerateEstimate : (b.enabled ? handleLaunchClick : handleGenerateEstimate)}
                  disabled={!address.trim() || isLoading} 
                  data-cta-button
                  className={`w-full ${
                    !address.trim() || isLoading 
                      ? 'btn-disabled' 
                      : 'btn-cta'
                  }`} 
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
                          ? (address.trim() ? `Launch My Branded Tool` : `Activate on Your Domain — 24 Hours`)
                          : "Generate Solar Intelligence Report"
                        }
                      </span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  )}
                </button>
                
                
                {isDemo && (
                  <div className="text-sm text-gray-500 text-center space-y-2 mt-4">
                    {remaining > 0 ? (
                      <>
                        <p>Preview: {remaining} run{remaining===1?"":"s"} left.</p>
                        <p>Expires in {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s</p>
                      </>
                    ) : (
                      <div className="text-red-600 font-semibold">
                        <p>🚫 Demo limit reached</p>
                        <p>Contact us to get full access</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Testimonials - Single block with 4 quotes */}
          <div className="max-w-4xl mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                <p className="text-sm text-gray-600 italic mb-3 group-hover:text-gray-800 transition-colors duration-300">
                  &ldquo;Cut quoting time from 15 minutes to 1 minute — we now respond faster than local competitors.&rdquo;
                </p>
                <p className="text-xs text-gray-500 font-medium">— Solar Company Owner, 25-employee firm, California</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                <p className="text-sm text-gray-600 italic mb-3 group-hover:text-gray-800 transition-colors duration-300">
                  &ldquo;Booked 4 extra consults in week one thanks to branded quotes.&rdquo;
                </p>
                <p className="text-xs text-gray-500 font-medium">— Ops Manager, Texas solar installer</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                <p className="text-sm text-gray-600 italic mb-3 group-hover:text-gray-800 transition-colors duration-300">
                  &ldquo;Lead conversion grew 40% in our first month using Sunspire.&rdquo;
                </p>
                <p className="text-xs text-gray-500 font-medium">— Solar Company Owner, Florida</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                <p className="text-sm text-gray-600 italic mb-3 group-hover:text-gray-800 transition-colors duration-300">
                  &ldquo;Investing in Sunspire paid for itself in week two. Customers now trust our estimates instantly.&rdquo;
                </p>
                <p className="text-xs text-gray-500 font-medium">— CEO, Arizona solar company</p>
              </div>
            </div>
          </div>

          {/* KPI Band - Single band only */}
          <div className="py-16" style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary)CC)' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-3 gap-12 text-center">
                <div className="group">
                  <div className="text-4xl font-black text-white font-mono group-hover:text-gray-200 transition-colors duration-300">28,417</div>
                  <div className="text-sm text-white/90 font-medium mt-2">quotes modeled this month</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-black text-white font-mono group-hover:text-gray-200 transition-colors duration-300">31%</div>
                  <div className="text-sm text-white/90 font-medium mt-2">average increase in completions</div>
                </div>
                <div className="group">
                  <div className="text-4xl font-black text-white font-mono group-hover:text-gray-200 transition-colors duration-300">113+</div>
                  <div className="text-sm text-white/90 font-medium mt-2">installers live today</div>
                </div>
              </div>
            </div>
          </div>


          {/* Trust Signals - Logo Wall */}
          {trustData && <LogoWall logos={trustData.logos} />}

          {/* Features - Single row of 3 cards with company color gradient shading */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto section-spacing">
            <div className="relative bg-gradient-to-br from-white via-white to-[var(--brand-primary)]/15 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-[var(--brand-primary)]/25 rounded-3xl opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-gray-900 mb-3 group-hover:text-[var(--brand-primary)] transition-colors duration-300">NREL PVWatts® v8</div>
                <div className="text-gray-600 font-semibold leading-relaxed">Industry-standard solar modeling with current utility rates</div>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white via-white to-[var(--brand-primary)]/15 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-[var(--brand-primary)]/25 rounded-3xl opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-gray-900 mb-3 group-hover:text-[var(--brand-primary)] transition-colors duration-300">CRM Integration</div>
                <div className="text-gray-600 font-semibold leading-relaxed">Direct push to HubSpot, Salesforce, and Airtable</div>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white via-white to-[var(--brand-primary)]/15 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 flex flex-col items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-[var(--brand-primary)]/25 rounded-3xl opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-gray-900 mb-3 group-hover:text-[var(--brand-primary)] transition-colors duration-300">End-to-End Encryption</div>
                <div className="text-gray-600 font-semibold leading-relaxed">SOC 2-aligned controls and data protection</div>
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="max-w-4xl mx-auto py-12 md:py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
              <div className="text-center space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Activate on Your Domain — 24 Hours</h2>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  <span>• &lt;24h setup</span>
                  <span>• CRM integrations</span>
                  <span>• Ongoing support</span>
                </div>
                <p className="text-sm text-slate-500">
                  $99/mo + $399 setup • 14-day refund if it doesn&rsquo;t increase bookings
                </p>
                <button 
                  onClick={handleLaunchClick}
                  data-cta-button
                  className="inline-flex items-center px-8 py-4 rounded-full text-lg font-medium text-white border border-transparent shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer" 
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  <span className="mr-2">⚡</span>
                  Activate on Your Domain — 24 Hours
                </button>
              </div>
            </div>
          </div>


          {/* Trust Signals - Testimonial and Metrics */}
          {trustData && (
            <>
              {trustData.testimonial && (
                <Testimonial 
                  quote={trustData.testimonial.quote}
                  name={trustData.testimonial.name}
                  title={trustData.testimonial.title}
                  company={trustData.testimonial.company}
                  metric={trustData.testimonial.metric}
                  avatarSrc={trustData.testimonial.avatarSrc}
                />
              )}
            </>
          )}

          {/* How It Works Section - Compressed */}
          <div className="max-w-4xl mx-auto py-12 md:py-16">
            <div className="text-center space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How it works</h2>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    1
                  </div>
                  <span className="text-base text-slate-700">Customer requests quote</span>
                </div>
                <div className="hidden md:block text-slate-400">→</div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    2
                  </div>
                  <span className="text-base text-slate-700">Instant branded report</span>
                </div>
                <div className="hidden md:block text-slate-400">→</div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    3
                  </div>
                  <span className="text-base text-slate-700">Consultation booked</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section - Demo only */}
          {isDemo && (
            <div className="max-w-4xl mx-auto section-spacing" {...tid('pricing-section')}>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">CMS? — Yes, 1-line &lt;script&gt;. Hosted option too.</h3>
                  <p className="text-gray-600">Works with any website platform. Just add one line of code.</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Accuracy? — NREL PVWatts v8 • EIA rates • local irradiance</h3>
                  <p className="text-gray-600">Industry-standard data sources. <a href="/methodology" className="text-[var(--brand-primary)] hover:text-[var(--brand-primary)]/80 hover:underline font-medium transition-colors duration-200">View methodology</a>.</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Security? — Encrypted in transit & at rest</h3>
                  <p className="text-gray-600">Bank-level security for all customer data.</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel? — Yes, 14-day refund if it doesn&apos;t lift booked calls</h3>
                  <p className="text-gray-600">No long-term contracts. Cancel anytime.</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Support? — Email support 24/7</h3>
                  <p className="text-gray-600">Get help whenever you need it.</p>
                </div>
              </div>
            </div>
          )}

          {/* Trust Signals - About Block */}
          {trustData && (
            <AboutBlock 
              heading={trustData.about.heading}
              body={trustData.about.body}
            />
          )}
        </div>
      </main>

      {/* Sample Report Modal */}
      {showSampleReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            {!sampleReportSubmitted ? (
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Request Sample Report</h3>
                <p className="text-gray-600">
                  Get a detailed sample report to see the full capabilities of our solar analysis platform.
                </p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setSampleReportSubmitted(true);
                  setTimeout(() => {
                    setShowSampleReportModal(false);
                    setSampleReportSubmitted(false);
                  }, 3000);
                }} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-lg text-white font-semibold transition-colors"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    Submit Request
                  </button>
                </form>
                <button
                  onClick={() => setShowSampleReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Sample Report Requested!</h3>
                <p className="text-gray-600">
                  Thanks for reaching out! We&apos;ll send your sample report to your email within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}


      <Footer />
      

    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
