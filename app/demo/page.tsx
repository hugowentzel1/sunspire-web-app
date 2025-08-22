"use client";

import { motion } from 'framer-motion';
import { useCompany } from '@/components/CompanyContext';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import StickyCTA from '@/components/StickyCTA';

export default function DemoPage() {
  const { company } = useCompany();
  const b = useBrandTakeover();

  const handleActivateClick = () => {
    window.open(`/signup?company=${company.companyHandle}`, '_blank');
  };

  const handleWalkthroughClick = () => {
    // Open calendar booking or contact form
    window.open('mailto:hello@sunspire.app?subject=Book%20Walkthrough', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome, {company.companyName} — your branded solar quote tool is live
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Instant ROI & payback on your domain. Leads push straight to {company.companyName || 'your CRM'}.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <motion.button
              onClick={handleActivateClick}
              className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{
                background: 'var(--brand-primary, #FFA63D)',
                color: '#ffffff',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                minWidth: '200px'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-2px)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Activate Sunspire now
            </motion.button>
            
            <motion.button
              onClick={handleWalkthroughClick}
              className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 text-gray-700 hover:text-gray-900 underline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Book a 10-min walkthrough
            </motion.button>
          </div>

          {/* Preview Timer */}
          <p className="text-sm text-gray-500">
            This private preview stays live for 7 days.
          </p>
        </motion.div>

        {/* Trust Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <span>Dozens of installers</span>
            <span>•</span>
            <span>CRM-ready (HubSpot, Salesforce, Airtable)</span>
            <span>•</span>
            <span>SOC 2–aligned</span>
          </div>
        </motion.div>

        {/* Demo Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Personalized Demo
            </h2>
            <p className="text-gray-600 mb-6">
              This page is customized for {company.companyName}. All branding, colors, and content 
              are personalized to match your company's identity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Brand Colors</h3>
                <p className="text-gray-600">Customized to match your palette</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Company Logo</h3>
                <p className="text-gray-600">Your logo displayed throughout</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Domain Ready</h3>
                <p className="text-gray-600">Live on {company.companyDomain}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      {/* Sticky CTA */}
      <StickyCTA />
    </div>
  );
}
