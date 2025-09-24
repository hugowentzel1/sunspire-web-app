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

const AddressAutocomplete = dynamic(() => import('@/components/AddressAutocomplete'), { 
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
});

interface HomeClientProps {
  buildSha: string;
}

function HomeClient({ buildSha }: HomeClientProps) {
  console.log('[route] render start');
  
  const [address, setAddress] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showSampleReportModal, setShowSampleReportModal] = useState(false);
  const [sampleReportSubmitted, setSampleReportSubmitted] = useState(false);
  const [trustData, setTrustData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters safely
  const company = searchParams?.get('company') || 'Your Company';
  const demo = searchParams?.get('demo') === '1';

  // Brand takeover mode detection
  const b = useBrandTakeover();
  
  // Demo mode detection - use brand state instead of separate hook
  const isDemo = b.isDemo;
  
  // Add loading state to wait for brand takeover to complete
  const [isBrandLoaded, setIsBrandLoaded] = useState(true);
  
  // Brand colors from URL
  useBrandColors();
  const { read, consume } = usePreviewQuota(2);
  const remaining = read();
  const countdown = useCountdown(b.expireDays);

  // ALL USEEFFECT HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS TO COMPLY WITH RULES OF HOOKS
  
  // Force brand loaded state to prevent hydration issues
  useEffect(() => {
    setIsBrandLoaded(true);
  }, []);

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
  
  // Set client state immediately to prevent hydration mismatch
  if (typeof window !== 'undefined') {
    setIsClient(true);
  }
  
  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden animate-pulse" style={{background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Loading...</h1>
        </div>
      </div>
    );
  }
  
  // Force client-side rendering to prevent hydration issues
  if (typeof window === 'undefined') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden animate-pulse" style={{background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Loading...</h1>
        </div>
      </div>
    );
  }

  // Early return for paid versions to prevent demo content from rendering
  if (!isDemo) {
    const company = searchParams.get('company');
    if (company) {
      return <div>Redirecting to paid version...</div>;
    }
  }

  // Show loading state while brand takeover is loading
  if (!isBrandLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden animate-pulse" style={{background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Loading...</h1>
        </div>
      </div>
    );
  }

  const handleAddressSelect = (place: PlaceResult) => {
    setSelectedPlace(place);
    setAddress(place.formattedAddress);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to results page
      router.push(`/report?address=${encodeURIComponent(place.formattedAddress)}&lat=${place.lat}&lng=${place.lng}`);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlace) {
      handleAddressSelect(selectedPlace);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      {/* Build stamp for dev/preview */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="fixed top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-50">
          {buildSha.slice(0, 7)}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Solar Intelligence for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {company}
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered solar analysis and installer matching. Get instant quotes, 
              find the best installers, and maximize your solar investment.
            </p>
            
            {/* Address Input Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <AddressAutocomplete
                    onSelect={(address, placeId) => {
                      // Create a mock PlaceResult for now
                      const mockPlace: PlaceResult = {
                        formattedAddress: address,
                        lat: 0, // Will be filled by geocoding
                        lng: 0, // Will be filled by geocoding
                        components: {},
                        placeId: placeId || ''
                      };
                      handleAddressSelect(mockPlace);
                    }}
                    placeholder="Enter your address for solar analysis"
                    className="w-full"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!selectedPlace || isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Analyzing...' : 'Get Solar Quote'}
                </button>
              </div>
            </form>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-12">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No Spam</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Solar Intelligence?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform analyzes your property and connects you with the best solar installers in your area.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Advanced algorithms analyze your roof, sun exposure, and energy usage to provide accurate solar potential.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Installers</h3>
              <p className="text-gray-600">
                Connect with vetted, licensed solar installers in your area who have proven track records.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Pricing</h3>
              <p className="text-gray-600">
                Compare quotes from multiple installers to ensure you get the best price for your solar installation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers who have gone solar with our help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &ldquo;The solar analysis was incredibly detailed and helped me understand exactly what to expect from my solar installation.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Homeowner, California</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &ldquo;Found the perfect installer through this platform. The process was smooth and the installation exceeded my expectations.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Mike Chen</p>
                  <p className="text-sm text-gray-500">Business Owner, Texas</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &ldquo;The AI analysis was spot-on. It predicted my energy savings almost exactly, and I&apos;m already seeing the benefits.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Emily Rodriguez</p>
                  <p className="text-sm text-gray-500">Homeowner, Arizona</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Go Solar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get your free solar analysis and connect with the best installers in your area. 
            Start saving on your energy bills today.
          </p>
          <button
            onClick={() => {
              const addressInput = document.querySelector('input[placeholder*="address"]') as HTMLInputElement;
              if (addressInput) {
                addressInput.scrollIntoView({ behavior: 'smooth' });
                addressInput.focus();
              }
            }}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Get Started Now
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <LegalFooter />
    </div>
  );
}

export default HomeClient;
