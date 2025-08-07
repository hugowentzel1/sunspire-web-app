'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TenantProvider, useTenant } from '@/components/TenantProvider';
import { LeadModal } from '@/components/LeadModal';
import { calculateSolarEstimate, SolarEstimate, methodology } from '@/lib/calc';

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tenant, loading: tenantLoading } = useTenant();
  const [estimate, setEstimate] = useState<SolarEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    const address = searchParams.get('address');
    const lat = parseFloat(searchParams.get('lat') || '40.7128');
    const lng = parseFloat(searchParams.get('lng') || '-74.0060');

    if (address) {
      // Calculate solar estimate
      const solarEstimate = calculateSolarEstimate({ lat, lng }, address);
      setEstimate(solarEstimate);
    }
    setIsLoading(false);
  }, [searchParams]);

  // Generate 25-year savings data for chart
  const generateChartData = (estimate: SolarEstimate) => {
    const data = [];
    let cumulativeSavings = 0;
    let degradationFactor = 1.0;
    let currentRate = estimate.electricityRate;
    
    for (let year = 1; year <= 25; year++) {
      const yearlyProduction = estimate.annualProductionKWh * degradationFactor;
      const yearlySavings = yearlyProduction * currentRate;
      cumulativeSavings += yearlySavings;
      
      data.push({
        year,
        yearlySavings: Math.round(yearlySavings),
        cumulativeSavings: Math.round(cumulativeSavings),
        netSavings: Math.round(cumulativeSavings - estimate.estimatedCost)
      });
      
      // Panel degradation: 0.5% per year after year 1
      if (year > 1) {
        degradationFactor *= 0.995;
      }
      
      // Electricity rate increase: 2.5% per year
      currentRate *= 1.025;
    }
    
    return data;
  };

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
                onClick={() => setShowMethodology(true)}
                className="px-4 py-2 text-gray-600 hover:text-orange-500 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
              >
                How We Calculate
              </motion.button>
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
              <div className="text-3xl font-black text-gray-900 mb-2">${estimate.estimatedCost.toLocaleString()}</div>
              <div className="text-gray-600 font-semibold">Estimated Cost</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-2">${estimate.estimatedSavings.toLocaleString()}</div>
              <div className="text-gray-600 font-semibold">Annual Savings</div>
            </div>
          </motion.div>

          {/* 25-Year Savings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">25-Year Savings Projection</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="year" 
                    stroke="#6B7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Net Savings']}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netSavings" 
                    stroke="#FFA63D" 
                    strokeWidth={3}
                    dot={{ fill: '#FFA63D', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#FFA63D', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Net savings after accounting for system cost, panel degradation, and electricity rate increases
            </p>
          </motion.div>

          {/* Detailed Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
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
                  <span className="font-bold text-gray-900">{Math.round(((estimate.npv25Year + estimate.estimatedCost) / estimate.estimatedCost) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-gray-600">Electricity Rate</span>
                  <span className="font-bold text-gray-900">${estimate.electricityRate}/kWh</span>
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
                  <span className="text-gray-600">Region</span>
                  <span className="font-bold text-gray-900">{estimate.region}</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-gray-600">System Efficiency</span>
                  <span className="font-bold text-gray-900">75%</span>
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

      {/* Methodology Modal */}
      {showMethodology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMethodology(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{methodology.title}</h2>
            <p className="text-gray-600 mb-6">{methodology.description}</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Sources</h3>
                <ul className="space-y-2">
                  {methodology.sources.map((source, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-gray-600">{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Calculation Factors</h3>
                <ul className="space-y-2">
                  {methodology.factors.map((factor, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-600">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setShowMethodology(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
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
