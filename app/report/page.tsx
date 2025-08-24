'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import LegalFooter from '@/components/legal/LegalFooter';

export default function ReportPage() {
  const searchParams = useSearchParams();
  const b = useBrandTakeover();
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showSampleReportModal, setShowSampleReportModal] = useState(false);
  const [sampleReportSubmitted, setSampleReportSubmitted] = useState(false);

  useEffect(() => {
    // Extract URL parameters
    const addressParam = searchParams.get('address') || '';
    const latParam = searchParams.get('lat') || '';
    const lngParam = searchParams.get('lng') || '';
    const placeIdParam = searchParams.get('placeId') || '';

    setAddress(addressParam);
    setLat(latParam);
    setLng(lngParam);
    setPlaceId(placeIdParam);
    setIsLoading(false);
  }, [searchParams]);

  const handleSubmitSampleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSampleReportSubmitted(true);
    
    // Hide modal after 3 seconds
    setTimeout(() => {
      setShowSampleReportModal(false);
      setSampleReportSubmitted(false);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your solar report...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>

        <div className="text-center space-y-12">
          {/* Header - Exact match to c548b88 */}
          <div className="space-y-6">
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-primary)CC)` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-6xl relative z-10">📊</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-gray-900">
              Solar Intelligence Report
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive analysis for {address}
            </p>
          </div>

          {/* Main Report Content - Exact match to c548b88 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 p-8 md:p-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              
              {/* Property Info */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Property Analysis</h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 font-medium">Address: {address}</p>
                  <p className="text-gray-600 text-sm">Coordinates: {lat}, {lng}</p>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="text-4xl mb-3">☀️</div>
                  <h3 className="font-bold text-gray-900 mb-2">Solar Potential</h3>
                  <p className="text-2xl font-bold text-[var(--brand-primary)]">Excellent</p>
                  <p className="text-sm text-gray-600 mt-1">High sun exposure</p>
                </div>
                
                <div className="text-center bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="text-4xl mb-3">💰</div>
                  <h3 className="font-bold text-gray-900 mb-2">Est. Savings</h3>
                  <p className="text-2xl font-bold text-[var(--brand-primary)]">$25,000+</p>
                  <p className="text-sm text-gray-600 mt-1">Over 25 years</p>
                </div>
                
                <div className="text-center bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="font-bold text-gray-900 mb-2">System Size</h3>
                  <p className="text-2xl font-bold text-[var(--brand-primary)]">8.5 kW</p>
                  <p className="text-sm text-gray-600 mt-1">Recommended</p>
                </div>
              </div>

              {/* Report Details */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3">📈 Energy Production Estimate</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Annual Generation:</span>
                      <span className="text-blue-900 font-bold ml-2">12,750 kWh</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Monthly Average:</span>
                      <span className="text-blue-900 font-bold ml-2">1,063 kWh</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="font-bold text-green-900 mb-3">💡 Environmental Impact</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700 font-medium">CO₂ Avoided:</span>
                      <span className="text-green-900 font-bold ml-2">6.4 tons/year</span>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Equivalent Trees:</span>
                      <span className="text-green-900 font-bold ml-2">158 planted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center space-y-4 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  This is a demo report based on your address. For a detailed consultation and accurate proposal, please contact us.
                </p>
                
                <button 
                  onClick={() => setShowSampleReportModal(true)}
                  className="px-8 py-3 rounded-lg text-white font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  Request Sample Report
                </button>
                
                <p className="text-sm text-gray-500">
                  Get a comprehensive sample report with detailed analysis and recommendations
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Sample Report Modal - Exact match to c548b88 */}
      {showSampleReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            {!sampleReportSubmitted ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Request Sample Report</h3>
                <p className="text-gray-600">
                  Get a detailed sample report to see the full capabilities of our solar analysis platform.
                </p>
                <form onSubmit={handleSubmitSampleReport} className="space-y-4">
                  <div className="text-left">
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
                  className="text-gray-500 hover:text-gray-700 text-sm"
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
                <div className="text-center">
                  <div className="inline-flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    This modal will close automatically
                  </div>
                </div>
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