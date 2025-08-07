'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';

import { TenantProvider, useTenant } from '@/components/TenantProvider';
import { LeadModal } from '@/components/LeadModal';
import { SolarEstimate } from '@/lib/estimate';
import EstimateChart from '@/components/EstimateChart';

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tenant, loading: tenantLoading } = useTenant();
  const [estimate, setEstimate] = useState<SolarEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeadModal, setShowLeadModal] = useState(false);


  useEffect(() => {
    const address = searchParams.get('address');
    const lat = parseFloat(searchParams.get('lat') || '40.7128');
    const lng = parseFloat(searchParams.get('lng') || '-74.0060');
    const placeId = searchParams.get('placeId');

    if (address && lat && lng) {
      // Call the new estimate API
      fetchEstimate(address, lat, lng, placeId);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const fetchEstimate = async (address: string, lat: number, lng: number, placeId?: string | null) => {
    try {
      const params = new URLSearchParams({
        address,
        lat: lat.toString(),
        lng: lng.toString(),
        ...(placeId && { placeId })
      });

      const response = await fetch(`/api/estimate?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch estimate');
      }

      const data = await response.json();
      setEstimate(data.estimate);
    } catch (error) {
      console.error('Error fetching estimate:', error);
      // Fallback to basic estimate if API fails
      setEstimate({
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
        cashflowProjection: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use the cashflow projection from the estimate
  const chartData = estimate?.cashflowProjection || [];

  if (tenantLoading || !tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-700">Generating your solar intelligence report...</p>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">No data available</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const chartData = generateChartData(estimate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      {/* Premium Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white font-bold text-lg">☀️</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  {tenant.name}
                </h1>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                  Solar Intelligence Report
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">

              <motion.button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Analysis
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Report Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Report Header */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
            >
              <span className="text-4xl">📊</span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900">
                Solar Intelligence Report
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive analysis for your property at {estimate.address}
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Confidence Range: {estimate.confidenceRange}</span>
                <span>•</span>
                <span>Generated on {estimate.date.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-2">{estimate.systemSizeKW} kW</div>
              <div className="text-gray-600 font-semibold">System Size</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">☀️</span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-2">{estimate.annualProductionKWh.toLocaleString()} kWh</div>
              <div className="text-gray-600 font-semibold">Annual Production</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
                          <div className="text-3xl font-black text-gray-900 mb-2">${estimate.netCostAfterITC.toLocaleString()}</div>
            <div className="text-gray-600 font-semibold">Net Cost (After ITC)</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
                          <div className="text-3xl font-black text-gray-900 mb-2">${estimate.year1Savings.toLocaleString()}</div>
            <div className="text-gray-600 font-semibold">Year 1 Savings</div>
            </div>
          </motion.div>

          {/* 25-Year Cashflow Chart */}
          <EstimateChart 
            cashflowData={chartData}
            netCostAfterITC={estimate.netCostAfterITC}
          />

          {/* Detailed Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Financial Analysis */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Analysis</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">Payback Period</span>
                  <span className="font-bold text-gray-900">{estimate.paybackPeriodYears} years</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">25-Year NPV</span>
                  <span className="font-bold text-gray-900">${estimate.npv25Year.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">ROI</span>
                  <span className="font-bold text-gray-900">{Math.round(((estimate.npv25Year + estimate.netCostAfterITC) / estimate.netCostAfterITC) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-gray-600">Electricity Rate</span>
                  <span className="font-bold text-gray-900">${estimate.utilityRate}/kWh ({estimate.utilityRateSource})</span>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Environmental Impact</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">CO₂ Offset/Year</span>
                  <span className="font-bold text-gray-900">{estimate.co2OffsetPerYear.toLocaleString()} lbs</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">Solar Irradiance</span>
                  <span className="font-bold text-gray-900">{estimate.solarIrradiance} kWh/m²/day</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">System Tilt</span>
                  <span className="font-bold text-gray-900">{estimate.tilt}°</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-gray-600">System Losses</span>
                  <span className="font-bold text-gray-900">{estimate.losses}%</span>
                </div>
              </div>
            </div>

            {/* Assumptions Panel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculation Assumptions</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">Federal Tax Credit (ITC)</span>
                  <span className="font-bold text-gray-900">{(estimate.assumptions.itcPercentage * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">Cost per Watt</span>
                  <span className="font-bold text-gray-900">${estimate.assumptions.costPerWatt}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">Panel Degradation</span>
                  <span className="font-bold text-gray-900">{(estimate.assumptions.degradationRate * 100).toFixed(1)}%/year</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">O&M Cost</span>
                  <span className="font-bold text-gray-900">${estimate.assumptions.oandmPerKWYear}/kW/year</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <span className="text-gray-600">Rate Increase</span>
                  <span className="font-bold text-gray-900">{(estimate.assumptions.electricityRateIncrease * 100).toFixed(1)}%/year</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-gray-600">Discount Rate</span>
                  <span className="font-bold text-gray-900">{(estimate.assumptions.discountRate * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Go Solar?</h2>
            <p className="text-xl mb-8 opacity-90">
              Connect with verified solar installers in your area and get started today
            </p>
            <motion.button
              onClick={() => setShowLeadModal(true)}
              className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Matched with Installers
            </motion.button>
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
