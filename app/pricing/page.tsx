'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useBrandColors } from '@/hooks/useBrandColors';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PricingPage() {
  const searchParams = useSearchParams();
  const b = useBrandTakeover();
  
  // Apply brand colors from URL parameters
  useBrandColors();

  const handleUpgrade = async () => {
    try {
      // Collect tracking parameters from URL
      const token = searchParams.get('token');
      const company = searchParams.get('company');
      const utm_source = searchParams.get('utm_source');
      const utm_campaign = searchParams.get('utm_campaign');
      
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
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to start checkout. Please try again.');
    }
  };

  // Function to create URLs with preserved parameters
  const createUrlWithParams = (path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${path}?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link 
            href={createUrlWithParams('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              White-Label Sunspire
            </h1>
            <p className="text-base md:text-lg text-slate-700">
              Your branded solar quote tool — ready to launch
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            {/* Main pricing card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl max-w-2xl mx-auto lg:mx-0"
            >
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  $99/mo + $399 setup
                </div>
                <p className="text-sm text-gray-500">
                  Start setup — $399 today
                </p>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full"></span>
                  <span className="text-gray-700">Branded reports & PDFs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full"></span>
                  <span className="text-gray-700">Your domain (CNAME)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full"></span>
                  <span className="text-gray-700">CRM integrations (HubSpot, Salesforce)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full"></span>
                  <span className="text-gray-700">Unlimited quotes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full"></span>
                  <span className="text-gray-700">SLA & support</span>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  onClick={handleUpgrade}
                  className="w-full btn-primary text-lg py-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start setup — $399 today
                </motion.button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                14-day refund if it doesn&apos;t lift booked calls
              </p>
            </div>
            </motion.div>

            {/* Proof sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg max-w-sm mx-auto lg:mx-0"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 text-center">Why Installers Switch</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Setup under 24 hours — no coding required.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Installers see +29% more booked jobs.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}