'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { TenantProvider, useTenant } from '@/components/TenantProvider';
import { LeadModal } from '@/components/LeadModal';
import { LegalFooter } from '@/components/legal/LegalFooter';
import { SolarEstimate } from '@/lib/estimate';
import EstimateChart from '@/components/EstimateChart';
import { formatDateSafe } from '@/lib/format';

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tenant, loading: tenantLoading } = useTenant();
  const [estimate, setEstimate] = useState<SolarEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);

  useEffect(() => {
    const address = searchParams.get('address');
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const placeId = searchParams.get('placeId');

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
      console.log('Fetching estimate for:', { address, lat, lng, placeId });
      
      const params = new URLSearchParams({
        address,
        lat: lat.toString(),
        lng: lng.toString(),
        ...(placeId && { placeId })
      });

      const response = await fetch(`/api/estimate?${params}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', response.status, errorText);
        throw new Error(`Failed to fetch estimate: ${response.status}`);
      }

      const data = await response.json();
      console.log('Estimate data received:', data);
      
      if (!data.estimate) {
        throw new Error('No estimate data in response');
      }
      
      setEstimate(data.estimate);
    } catch (error) {
      console.error('Error fetching estimate:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      
      const fallbackEstimate = {
        id: Date.now().toString(),
        address,
        coordinates: { lat, lng },
        date: new Date(),
        systemSizeKW: 8.5,
        tilt: 20,
        azimuth: 180,
        losses: 14,
        annualProductionKWh: 12000,
        monthlyProduction: Array(12).fill(1000),
        solarIrradiance: 4.5,
        grossCost: 25500,
        netCostAfterITC: 17850,
        year1Savings: 1680,
        paybackYear: 11,
        npv25Year: 25000,
        co2OffsetPerYear: 10200,
        utilityRate: 0.14,
        utilityRateSource: 'Static',
        assumptions: {
          itcPercentage: 0.30,
          costPerWatt: 3.00,
          degradationRate: 0.005,
          oandmPerKWYear: 22,
          electricityRateIncrease: 0.025,
          discountRate: 0.07
        },
        cashflowProjection: Array.from({ length: 25 }, (_, i) => ({
          year: i + 1,
          production: Math.round(12000 * Math.pow(0.995, i)),
          savings: Math.round(12000 * Math.pow(0.995, i) * 0.14),
          cumulativeSavings: Math.round(12000 * 0.14 * (i + 1)),
          netCashflow: Math.round(12000 * 0.14 * (i + 1) - 17850)
        }))
      };
      
      console.log('Using fallback estimate:', fallbackEstimate);
      setEstimate(fallbackEstimate);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = estimate?.cashflowProjection || [];

  if (tenantLoading || !tenant) {
    return (
      <div className="min-h-screen bg-[var(--accent-light)] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-[var(--accent-dark)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--accent-light)] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-[var(--accent-dark)]">Generating your solar intelligence report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--accent-light)] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 max-w-md">
            <div className="font-semibold mb-2">Error Loading Report</div>
            <div>{error}</div>
            <button
              onClick={() => router.push('/')}
              className="btn-primary mt-4"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="min-h-screen bg-[var(--accent-light)] flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-[var(--accent-dark)]">No data available</h1>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--accent-light)]">
      {/* Premium Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">☀️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--accent-dark)]">
                  {tenant.name}
                </h1>
                <p className="text-sm font-medium text-gray-600">
                  Solar Intelligence Report
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              New Analysis
            </button>
          </div>
        </div>
      </header>

      {/* Report Content */}
      <main className="max-w-7xl mx-auto px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Report Header */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-2xl flex items-center justify-center shadow-lg"
            >
              <span className="text-3xl">📊</span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--accent-dark)]">
                Solar Intelligence Report
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive analysis for your property at {estimate.address}
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Data Source: {estimate.utilityRateSource}</span>
                <span>•</span>
                <span>Generated on {formatDateSafe(estimate.date)}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="card card-padding text-center hover-lift">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">⚡</span>
              </div>
              <div className="text-3xl font-bold text-[var(--accent-dark)] mb-2">{estimate.systemSizeKW} kW</div>
              <div className="text-gray-600 font-medium">System Size</div>
            </div>

            <div className="card card-padding text-center hover-lift">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-hover)] rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">☀️</span>
              </div>
              <div className="text-3xl font-bold text-[var(--accent-dark)] mb-2">{estimate.annualProductionKWh.toLocaleString()} kWh</div>
              <div className="text-gray-600 font-medium">Annual Production</div>
            </div>

            <div className="card card-padding text-center hover-lift">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">💰</span>
              </div>
              <div className="text-3xl font-bold text-[var(--accent-dark)] mb-2">${estimate.netCostAfterITC.toLocaleString()}</div>
              <div className="text-gray-600 font-medium">Net Cost (After ITC)</div>
            </div>

            <div className="card card-padding text-center hover-lift">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-hover)] rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">📈</span>
              </div>
              <div className="text-3xl font-bold text-[var(--accent-dark)] mb-2">${estimate.year1Savings.toLocaleString()}</div>
              <div className="text-gray-600 font-medium">Year 1 Savings</div>
            </div>
          </motion.div>

          {/* 25-Year Cashflow Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="card card-padding"
          >
            <EstimateChart 
              cashflowData={chartData}
              netCostAfterITC={estimate.netCostAfterITC}
            />
          </motion.div>

          {/* Detailed Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Financial Analysis */}
            <div className="card card-padding">
              <h2 className="text-xl font-bold text-[var(--accent-dark)] mb-6">Financial Analysis</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Payback Period</span>
                  <span className="font-bold text-[var(--accent-dark)]">{estimate.paybackYear} years</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">25-Year NPV</span>
                  <span className="font-bold text-[var(--accent-dark)]">${estimate.npv25Year.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">ROI</span>
                  <span className="font-bold text-[var(--accent-dark)]">{Math.round(((estimate.npv25Year + estimate.netCostAfterITC) / estimate.netCostAfterITC) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Electricity Rate</span>
                  <span className="font-bold text-[var(--accent-dark)]">${estimate.utilityRate}/kWh ({estimate.utilityRateSource})</span>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="card card-padding">
              <h2 className="text-xl font-bold text-[var(--accent-dark)] mb-6">Environmental Impact</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">CO₂ Offset/Year</span>
                  <span className="font-bold text-[var(--accent-dark)]">{estimate.co2OffsetPerYear.toLocaleString()} lbs</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Solar Irradiance</span>
                  <span className="font-bold text-[var(--accent-dark)]">{estimate.solarIrradiance} kWh/m²/day</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">System Tilt</span>
                  <span className="font-bold text-[var(--accent-dark)]">{estimate.tilt}°</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">System Losses</span>
                  <span className="font-bold text-[var(--accent-dark)]">{estimate.losses}%</span>
                </div>
              </div>
            </div>

            {/* Assumptions Panel */}
            <div className="card card-padding">
              <h2 className="text-xl font-bold text-[var(--accent-dark)] mb-6">Calculation Assumptions</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Federal Tax Credit (ITC)</span>
                  <span className="font-bold text-[var(--accent-dark)]">{(estimate.assumptions.itcPercentage * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Cost per Watt</span>
                  <span className="font-bold text-[var(--accent-dark)]">${estimate.assumptions.costPerWatt}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Panel Degradation</span>
                  <span className="font-bold text-[var(--accent-dark)]">{(estimate.assumptions.degradationRate * 100).toFixed(1)}%/year</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">O&M Cost</span>
                  <span className="font-bold text-[var(--accent-dark)]">${estimate.assumptions.oandmPerKWYear}/kW/year</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Rate Increase</span>
                  <span className="font-bold text-[var(--accent-dark)]">{(estimate.assumptions.electricityRateIncrease * 100).toFixed(1)}%/year</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Discount Rate</span>
                  <span className="font-bold text-[var(--accent-dark)]">{(estimate.assumptions.discountRate * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] rounded-xl p-8 text-center text-white shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Go Solar?</h2>
            <p className="text-xl mb-8 opacity-90">
              Connect with verified solar installers in your area and get started today
            </p>
            <button
              onClick={() => setShowLeadModal(true)}
              className="px-8 py-4 bg-white text-[var(--primary)] rounded-lg font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:scale-[1.02]"
            >
              Get Matched with Installers
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Lead Modal */}
      {estimate && (
        <LeadModal
          isOpen={showLeadModal}
          onClose={() => setShowLeadModal(false)}
          estimate={estimate}
          address={estimate.address}
        />
      )}

      {/* Legal Footer */}
      <LegalFooter showGoogleAttribution={true} />
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
