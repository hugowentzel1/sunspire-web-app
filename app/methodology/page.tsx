"use client";

import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import LegalFooter from '@/components/legal/LegalFooter';

export default function MethodologyPage() {
  const b = useBrandTakeover();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <a 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Calculation Methodology</h1>
          <p className="text-xl text-gray-600">
            How we calculate your solar energy potential and financial projections
          </p>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Solar Irradiance */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Solar Irradiance Data</h2>
            <p className="text-gray-700 mb-4">
              We use NREL PVWatts® v8, the industry standard for solar energy modeling, to calculate 
              your location's solar potential. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Daily solar irradiance patterns</li>
              <li>Seasonal variations</li>
              <li>Weather data integration</li>
              <li>Local climate considerations</li>
            </ul>
          </div>

          {/* System Sizing */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">System Sizing Calculations</h2>
            <p className="text-gray-700 mb-4">
              System size is determined by analyzing your historical electricity consumption and 
              available roof space:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>12-month electricity usage analysis</li>
              <li>Roof orientation and tilt optimization</li>
              <li>Shading analysis and efficiency factors</li>
              <li>Panel efficiency and degradation modeling</li>
            </ul>
          </div>

          {/* Financial Modeling */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Projections</h2>
            <p className="text-gray-700 mb-4">
              Our financial model incorporates current market data and federal incentives:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Current utility rates from EIA database</li>
              <li>Federal Investment Tax Credit (ITC) calculations</li>
              <li>Equipment costs based on current market rates</li>
              <li>25-year cash flow projections with inflation</li>
            </ul>
          </div>

          {/* Assumptions */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Assumptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">System Performance</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Panel degradation: 0.5% per year</li>
                  <li>• System losses: 14% (wiring, inverter, etc.)</li>
                  <li>• O&M costs: $15/kW/year</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Factors</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Electricity rate increase: 2.5% annually</li>
                  <li>• Discount rate: 5% for NPV calculations</li>
                  <li>• Federal ITC: 30% of system cost</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accuracy & Limitations</h2>
            <p className="text-gray-700 mb-4">
              Our estimates are based on industry-standard modeling tools and current market data. 
              Actual results may vary due to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Site-specific conditions and shading</li>
              <li>Installation quality and equipment selection</li>
              <li>Future changes in utility rates or incentives</li>
              <li>Weather variations from historical averages</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>Note:</strong> These estimates are for informational purposes only and do not 
              constitute a binding quote. Professional site surveys provide the most accurate assessments.
            </p>
          </div>
        </motion.div>
      </main>
      
      {/* Footer */}
      <LegalFooter />
    </div>
  );
}
