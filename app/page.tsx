'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PlaceResult } from '@/lib/calc';
import LegalFooter from '@/components/legal/LegalFooter';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import HeroBrand from '@/src/brand/HeroBrand';
import { useBrandColors } from '@/hooks/useBrandColors';
import { usePreviewQuota } from '@/src/demo/usePreviewQuota';
import { useCountdown } from '@/src/demo/useCountdown';
import { useIsDemo } from '@/src/lib/isDemo';
import React from 'react';
import { attachCheckoutHandlers } from '@/src/lib/checkout';
import { tid } from '@/src/lib/testids';

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
  const router = useRouter();
  const searchParams = useSearchParams();

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
          console.log('Redirecting to paid version for company:', company);
          router.push(`/paid?company=${encodeURIComponent(company)}`);
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isDemo, searchParams, router]);

  const handleAddressSelect = async (address: string, placeId?: string) => {
    setAddress(address);
    setIsLoading(true);

    try {
      const q = new URLSearchParams();
      q.set('address', address);
      if (placeId) {
        q.set('placeId', placeId);
      }
      
      const company = searchParams.get('company');
      const demo = searchParams.get('demo');
      const token = searchParams.get('token');
      const utm_source = searchParams.get('utm_source');
      const utm_campaign = searchParams.get('utm_campaign');
      
      if (company) q.set('company', company);
      if (demo) q.set('demo', demo);
      if (token) q.set('token', token);
      if (utm_source) q.set('utm_source', utm_source);
      if (utm_campaign) q.set('utm_campaign', utm_campaign);
      
      console.log('Navigating to report with manual address:', q.toString());
      router.push(`/report?${q.toString()}`);
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

  const initials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-white font-inter" data-demo={isDemo}>
      <main className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Live confirmation bar for paid mode */}
        {!isDemo && (
          <div className="mx-auto max-w-3xl mt-4 rounded-lg bg-emerald-50 text-emerald-900 text-sm px-4 py-2 border border-emerald-200" {...tid('live-bar')}>
            ✅ Live for <b>{b.brand || 'Your Company'}</b>. Leads now save to your CRM.
          </div>
        )}
        
        {/* Company Branding Section - Demo only */}
        {isDemo && b.enabled && (
          <div className="py-24">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 py-6 px-8 mx-auto max-w-2xl">
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
                  className="inline-flex items-center px-6 py-3 rounded-2xl text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] active:translate-y-[1px] transition" 
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  <span className="mr-2">⚡</span>
                  Activate on Your Domain — 24 Hours
                </button>
                <p className="text-sm text-black/60 mt-2">
                  No call required. $99/mo + $399 setup. 14-day refund if it doesn&apos;t lift booked calls.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* HERO SECTION */}
        <div className="py-24 text-center">
          {/* HERO ICON */}
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
            <HeroBrand />
          )}
          
          <div className="space-y-6 mt-8">
            {/* Eyebrow */}
            <p className="text-sm text-black/60 font-medium tracking-wide">
              Private demo — not affiliated.
            </p>

            {/* H1 */}
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-[-0.02em] leading-[1.05] text-gray-900">
              Your Branded Solar Quote Tool
              <span className="block" style={{ color: 'var(--brand-primary)' }}>— Ready to Launch</span>
            </h1>
            
            {/* Subhead */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-[1.55]">
              Go live in 24 hours. Capture more leads. Book more consults. Close more installs — all under your brand.
            </p>
            
            {/* Primary CTA */}
            <button 
              data-cta="primary"
              onClick={handleLaunchClick}
              data-cta-button
              className="inline-flex items-center px-6 py-3 rounded-2xl text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] active:translate-y-[1px] transition" 
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <span className="mr-2">⚡</span>
              Activate on Your Domain — 24 Hours
            </button>
            
            {/* Micro terms */}
            <p className="text-sm text-black/60">
              $99/mo + $399 setup • 14-day refund if it doesn&apos;t lift booked calls
            </p>
            
            {/* Social-proof line */}
            <p className="text-sm text-black/60 font-medium tracking-wide">
              Trusted by 113+ installers • 28,417 quotes modeled this month • 99.99% uptime
            </p>
          </div>
        </div>

        {/* ADDRESS MODULE */}
        <div className="py-24">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-8 md:p-12 max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Enter Your Property Address</h2>
                <p className="text-gray-600">Get a comprehensive solar analysis tailored to your specific location</p>
              </div>

              <div className="space-y-6">
                {/* Address Input */}
                <div className="w-full max-w-2xl mx-auto">
                  <AddressAutocomplete 
                    value={address}
                    onChange={setAddress}
                    onSelect={handleAddressSelect}
                    placeholder={b.city ? `Start typing an address in ${b.city}...` : "Start typing your property address..."}
                    className="w-full"
                  />
                  <p className="text-sm text-black/60 mt-2 text-center">
                    Enter your property address to get started
                  </p>
                </div>

                {/* Generate Button */}
                <button 
                  onClick={address.trim() ? () => handleAddressSelect(address) : handleLaunchClick}
                  disabled={!address.trim() || isLoading} 
                  data-cta-button
                  className={`w-full px-6 py-3 rounded-2xl text-[15px] font-semibold transition ${
                    !address.trim() || isLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'text-white shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] active:translate-y-[1px]'
                  }`}
                  style={!address.trim() || isLoading ? {} : { backgroundColor: 'var(--brand-primary)' }} 
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing Your Property...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-4">
                      <span>
                        {address.trim() ? `Generate Solar Intelligence Report` : `Activate on Your Domain — 24 Hours`}
                      </span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  )}
                </button>
                
                {/* Proof line with proper spacing */}
                <div className="text-center mt-4">
                  <p className="text-sm text-black/60 italic">
                    &ldquo;Helped one installer book 37% more consults in 90 days.&rdquo;
                  </p>
                </div>
                
                {isDemo && (
                  <div className="text-sm text-black/60 text-center space-y-2 mt-4">
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
        </div>

        {/* KPI BAND - Single band only */}
        <div className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-gray-900 font-mono">28,417</div>
                <div className="text-sm text-black/60 font-medium">quotes modeled this month</div>
              </div>
              <div>
                <div className="text-4xl font-black text-gray-900 font-mono">31%</div>
                <div className="text-sm text-black/60 font-medium">average increase in completions</div>
              </div>
              <div>
                <div className="text-4xl font-black text-gray-900 font-mono">113+</div>
                <div className="text-sm text-black/60 font-medium">installers live today</div>
              </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIAL BLOCK - Single block, 4 quotes */}
        <div className="py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-6">
                <p className="text-sm text-gray-600 italic mb-2">
                  &ldquo;Cut quoting time from 15 minutes to 1 minute — we now respond faster than local competitors.&rdquo;
                </p>
                <p className="text-xs text-black/60">— Solar Company Owner, 25-employee firm, California</p>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-6">
                <p className="text-sm text-gray-600 italic mb-2">
                  &ldquo;Booked 4 extra consults in week one thanks to branded quotes.&rdquo;
                </p>
                <p className="text-xs text-black/60">— Ops Manager, Texas solar installer</p>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-6">
                <p className="text-sm text-gray-600 italic mb-2">
                  &ldquo;Lead conversion grew 40% in our first month using Sunspire.&rdquo;
                </p>
                <p className="text-xs text-black/60">— Solar Company Owner, Florida</p>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-6">
                <p className="text-sm text-gray-600 italic mb-2">
                  &ldquo;Investing in Sunspire paid for itself in week two. Customers now trust our estimates instantly.&rdquo;
                </p>
                <p className="text-xs text-black/60">— CEO, Arizona solar company</p>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE GRID - Single row of 3 */}
        <div className="py-24">
          <div className="max-w-5xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-4" style={{ backgroundColor: `${b.primary}20` }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">NREL PVWatts® v8</h3>
                <p className="text-gray-600">Industry-standard solar modeling with current utility rates</p>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-4" style={{ backgroundColor: `${b.primary}20` }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">CRM Integration</h3>
                <p className="text-gray-600">Direct push to HubSpot, Salesforce, and Airtable</p>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-4" style={{ backgroundColor: `${b.primary}20` }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">End-to-End Encryption</h3>
                <p className="text-gray-600">SOC 2-aligned controls and data protection</p>
              </div>
            </div>
          </div>
        </div>

        {/* FINAL CTA SECTION */}
        <div className="py-24">
          <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.01em] text-gray-900 mb-6">
              Activate on Your Domain — 24 Hours
            </h2>
            
            {/* Inline bullets */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-black/60 mb-6">
              <span>• &lt;24h setup</span>
              <span>• CRM integrations</span>
              <span>• Ongoing support</span>
            </div>
            
            {/* Price line */}
            <p className="text-lg text-black/60 mb-8">
              $99/mo + $399 setup • 14-day refund if it doesn&apos;t increase bookings
            </p>
            
            {/* Primary button */}
            <button 
              onClick={handleLaunchClick}
              data-cta-button
              className="inline-flex items-center px-8 py-4 rounded-2xl text-lg font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] active:translate-y-[1px] transition" 
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <span className="mr-2">⚡</span>
              Activate on Your Domain — 24 Hours
            </button>
          </div>
        </div>

        {/* WHY WE BUILT SUNSPIRE */}
        <div className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.01em] text-gray-900 mb-6">
              Why We Built Sunspire
            </h2>
            <p className="text-lg leading-[1.55] text-gray-600 max-w-[70ch] mx-auto">
              We started Sunspire to give solar companies a simple way to capture more leads without paying for complex CRMs or custom developers. In just 24 hours, you can launch a fully branded quote tool that looks like it was built in-house, helps you win more consultations, and closes more installs.
            </p>
          </div>
        </div>

        {/* FAQ Section - Demo only */}
        {isDemo && (
          <div className="py-24">
            <div className="max-w-4xl mx-auto px-6 md:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">CMS? — Yes, 1-line &lt;script&gt;. Hosted option too.</h3>
                  <p className="text-gray-600">Works with any website platform. Just add one line of code.</p>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Accuracy? — NREL PVWatts v8 • EIA rates • local irradiance</h3>
                  <p className="text-gray-600">Industry-standard data sources. <a href="/methodology" className="text-[var(--brand-primary)] hover:underline">View methodology</a>.</p>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Security? — Encrypted in transit & at rest</h3>
                  <p className="text-gray-600">Bank-level security for all customer data.</p>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel? — Yes, 14-day refund if it doesn&apos;t lift booked calls</h3>
                  <p className="text-gray-600">No long-term contracts. Cancel anytime.</p>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Support? — Email support 24/7</h3>
                  <p className="text-gray-600">Get help whenever you need it.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Column 1: Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Sunspire Solar Intelligence</h3>
              <p className="text-sm text-black/60">Demo for Apple — Powered by Sunspire</p>
              <div className="space-y-2 text-sm text-black/60 mb-4">
                <div className="flex items-start space-x-2">
                  <span className="mt-0.5">📍</span>
                  <span>1700 Northside Drive Suite A7 #5164, Atlanta, GA 30318</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-black/60">
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <a href="mailto:support@getsunspire.com" className="hover:opacity-80 transition-colors">support@getsunspire.com</a>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <a href="mailto:billing@getsunspire.com" className="hover:opacity-80 transition-colors">billing@getsunspire.com</a>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="/pricing" className="block text-black/60 hover:opacity-80 transition-colors">Pricing</a>
                <a href="/partners" className="block text-black/60 hover:opacity-80 transition-colors">Partners</a>
                <a href="/support" className="block text-black/60 hover:opacity-80 transition-colors">Support</a>
              </div>
            </div>

            {/* Column 3: Legal & Support */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Legal & Support</h4>
              <div className="space-y-2 text-sm">
                <a href="/privacy" className="block text-black/60 hover:opacity-80 transition-colors">Privacy Policy</a>
                <a href="/terms" className="block text-black/60 hover:opacity-80 transition-colors">Terms of Service</a>
                <a href="/security" className="block text-black/60 hover:opacity-80 transition-colors">Security</a>
                <a href="/dpa" className="block text-black/60 hover:opacity-80 transition-colors">DPA</a>
                <a href="/do-not-sell" className="block text-black/60 hover:opacity-80 transition-colors">Do Not Sell My Data</a>
              </div>
            </div>
          </div>

          {/* Bottom Attribution Bar */}
          <div className="border-t border-black/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-black/60 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Estimates generated using NREL PVWatts® v8</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>Mapping & location data © Google</span>
              </div>
            </div>
            <p>
              Powered by <span className="font-semibold" style={{ color: b.primary }}>Sunspire</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}