'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import LegalFooter from '@/components/legal/LegalFooter';

export default function ReportPage() {
  const searchParams = useSearchParams();
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your solar report...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-12">
          
          {/* Header */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900">
              Solar Intelligence Report
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive analysis for {address}
            </p>
          </div>

          {/* Report Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 p-8 md:p-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Analysis</h2>
                <p className="text-gray-600">Location: {address}</p>
                <p className="text-gray-600">Coordinates: {lat}, {lng}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">☀️</div>
                  <h3 className="font-semibold text-gray-900">Solar Potential</h3>
                  <p className="text-gray-600">High</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">💰</div>
                  <h3 className="font-semibold text-gray-900">Savings</h3>
                  <p className="text-gray-600">$25,000+</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">📊</div>
                  <h3 className="font-semibold text-gray-900">ROI</h3>
                  <p className="text-gray-600">5-7 years</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  This is a demo report. For a full analysis, please contact us.
                </p>
                <button 
                  onClick={() => window.location.href = '/signup'}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter />
      </footer>
    </div>
  );
}
