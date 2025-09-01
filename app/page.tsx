'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PlaceResult } from '@/lib/calc';
import LegalFooter from '@/components/legal/LegalFooter';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import HeroBrand from '@/src/brand/HeroBrand';
import { useBrandColors } from '@/hooks/useBrandColors';
import { usePreviewQuota } from '@/src/demo/usePreviewQuota';
import { useCountdown } from '@/src/demo/useCountdown';
import React from 'react';
import { attachCheckoutHandlers } from '@/src/lib/checkout';

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

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Attach checkout handlers to CTAs
  useEffect(() => {
    attachCheckoutHandlers();
  }, []);



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
    
    setIsLoading(true);
    
    try {
      if (selectedPlace && selectedPlace.formattedAddress) {
        const q = new URLSearchParams({
          address: selectedPlace.formattedAddress,
          lat: String(selectedPlace.lat),
          lng: String(selectedPlace.lng),
          placeId: selectedPlace.placeId,
        });
        console.log('Navigating to report with selected place:', q.toString());
        router.push(`/report?${q.toString()}`);
      } else {
        const q = new URLSearchParams({ 
          address, 
          lat: '40.7128', 
          lng: '-74.0060', 
          placeId: 'demo' 
        });
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
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const company = urlParams.get('company');
        const utm_source = urlParams.get('utm_source');
        const utm_campaign = urlParams.get('utm_campaign');
        
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-6">
          
          {/* Company Branding Section */}
          {b.enabled && (
            <div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl py-6 px-8 border border-gray-200/50 shadow-lg mx-auto max-w-2xl">
                <div className="space-y-4 text-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Demo for {b.brand || 'Your Company'} — Powered by Sunspire
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
                    No call required. $399 setup + $99/mo. 14-day refund if it doesn&apos;t lift booked calls.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* HERO ICON: render only one (fix double) */}
          {!b.enabled ? (
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${b.primary}, ${b.primary}CC)` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-6xl relative z-10">☀️</span>
            </div>
          ) : (
            <HeroBrand />
          )}
          
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">✓</span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
                {b.enabled ? (
                  <>
                    Your Branded Solar Quote Tool
                    <span className="block text-[var(--brand-primary)]">— Ready to Launch</span>
                  </>
                ) : (
                  <>
                    Your Branded Solar Quote Tool
                    <span className="block text-[var(--brand-primary)]">— Ready to Launch</span>
                  </>
                )}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {b.enabled 
                  ? `Go live in 24 hours. Convert more leads, book more consultations, and sync every inquiry seamlessly to your CRM — all fully branded for your company.`
                  : "Go live in 24 hours. Convert more leads, book more consultations, and sync every inquiry seamlessly to your CRM — all fully branded for your company."
                }
              </p>
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
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Enter your property address to get started
                  </p>
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
                          ? (address.trim() ? `Generate Solar Report` : `Launch Tool`)
                          : "Generate Solar Intelligence Report"
                        }
                      </span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  )}
                </button>
                
                {b.enabled && (
                  <div className="text-sm text-gray-500 text-center space-y-2">
                    <p>Preview: {remaining} run{remaining===1?"":"s"} left.</p>
                    <p>Expires in {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto section-spacing">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
              <div className="text-4xl font-black text-gray-900 mb-2">NREL v8</div>
              <div className="text-gray-600 font-semibold">Industry Standard</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
              <div className="text-4xl font-black text-gray-900 mb-2">SOC 2</div>
              <div className="text-gray-600 font-semibold">Compliance</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
              <div className="text-4xl font-black text-gray-900 mb-2">CRM Ready</div>
              <div className="text-gray-600 font-semibold">HubSpot, Salesforce</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center">
              <div className="text-4xl font-black text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600 font-semibold">Support</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto section-spacing">
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
          </div>

          {/* Logos Strip */}
          <div className="text-center section-spacing">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <span className="text-gray-600 font-medium">Dozens of installers • CRM-ready • SOC 2-aligned</span>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="max-w-5xl mx-auto section-spacing">
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
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto section-spacing">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">CMS? — Yes, 1-line &lt;script&gt;. Hosted option too.</h3>
                <p className="text-gray-600">Works with any website platform. Just add one line of code.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Accuracy? — NREL PVWatts v8 • EIA rates • local irradiance</h3>
                <p className="text-gray-600">Industry-standard data sources. <a href="/methodology" className="text-[var(--brand-primary)] hover:underline">View methodology</a>.</p>
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

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter brand={b.enabled ? b.brand : undefined} />
      </footer>
      

    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
