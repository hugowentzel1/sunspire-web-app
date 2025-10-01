'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useBrandColors } from '@/hooks/useBrandColors';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PricingPage() {
  const searchParams = useSearchParams();
  const b = useBrandTakeover();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
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

  const faqs = [
    {
      q: 'Accuracy & data sources',
      a: 'We use NREL PVWatts v8, EIA utility rates, and real-time solar irradiance data to provide industry-standard estimates.'
    },
    {
      q: 'Security & encryption',
      a: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We follow SOC 2-aligned security controls.'
    },
    {
      q: 'Cancel & refund policy',
      a: '14-day full refund if the tool doesn\'t increase your booked calls. Cancel anytime after that with 30 days notice.'
    },
    {
      q: 'Support',
      a: 'Email support with <24h response time. Priority support available for setup and CRM integrations.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link 
            href={createUrlWithParams('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 hover-lift button-press"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
          >
            White-Label Sunspire
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg text-slate-700"
          >
            Your branded solar quote tool — ready to launch
          </motion.p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[640px_360px] gap-8 justify-center mb-16">
          {/* LEFT: What You Get Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md"
          >
            <div className="space-y-6">
              {/* Price Block */}
              <div className="text-center pb-4 border-b border-gray-100">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  $99/mo + $399 setup
                </div>
                <p className="text-sm text-gray-500">
                  Start setup — $399 today
                </p>
              </div>

              {/* Feature List with stagger animation */}
              <div className="space-y-3">
                {[
                  'Branded reports & PDFs',
                  'Your domain (CNAME)',
                  'CRM integrations (HubSpot, Salesforce, Airtable)',
                  'Unlimited quotes',
                  'SLA & support',
                  'End-to-end encryption'
                ].map((feature, idx) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + (idx * 0.08) }}
                    className="flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <motion.button
                  onClick={handleUpgrade}
                  className="w-full min-w-[280px] h-[52px] px-8 rounded-2xl text-white font-semibold text-lg transition-all duration-150 shadow-md hover:shadow-lg button-press hover-lift"
                  style={{ backgroundColor: 'var(--brand-primary)', minHeight: '52px' }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  whileHover={{ y: -2 }}
                >
                  Start setup — $399 today
                </motion.button>

                {/* Trust Row */}
                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout — powered by Stripe</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center pt-2">
                14-day refund if it doesn&apos;t lift booked calls
              </p>
            </div>
          </motion.div>

          {/* RIGHT: Social Proof Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Why Installers Switch</h3>
              
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="flex items-start space-x-3"
                >
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Live in &lt;24 hours — no coding required</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="flex items-start space-x-3"
                >
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Teams report +25–40% more booked calls after adding instant quotes</span>
                </motion.div>
              </div>

              {/* Micro Testimonial */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="pt-3 border-t border-gray-100"
              >
                <p className="text-xs italic text-gray-600">
                  &ldquo;Cut quoting time from 15 min to 1 min.&rdquo;
                </p>
                <p className="text-xs text-gray-500 mt-1">— Solar Company Owner, CA</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 3-Step Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 max-w-3xl mx-auto">
            {[
              { num: 1, title: 'Connect domain', desc: 'Simple CNAME setup' },
              { num: 2, title: 'Brand & CRM', desc: 'Logo, colors, integrations' },
              { num: 3, title: 'Live in 24h', desc: 'Start generating quotes' }
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center gap-4 flex-1">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.num}
                    </div>
                    <div className="text-center md:text-left">
                      <div className="font-semibold text-gray-900 text-sm">{step.title}</div>
                      <div className="text-xs text-gray-500 hidden md:block">{step.desc}</div>
                    </div>
                  </div>
                </div>
                {idx < 2 && (
                  <svg className="hidden md:block w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Accordions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${openFAQ === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === idx && (
                  <div className="px-6 pb-4 text-sm text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legal Footer */}
        <div className="text-center text-xs text-gray-500 space-x-4">
          <Link href={createUrlWithParams('/privacy')} className="hover:text-gray-700">Privacy</Link>
          <span>•</span>
          <Link href={createUrlWithParams('/terms')} className="hover:text-gray-700">Terms</Link>
          <span>•</span>
          <Link href={createUrlWithParams('/security')} className="hover:text-gray-700">Security</Link>
          <span>•</span>
          <Link href={createUrlWithParams('/dpa')} className="hover:text-gray-700">DPA</Link>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <div className="flex items-center justify-between gap-4 max-w-screen-sm mx-auto">
          <div className="flex-shrink-0">
            <div className="text-sm font-bold text-gray-900">$99/mo + $399 setup</div>
            <div className="text-xs text-gray-500">14-day refund</div>
          </div>
          <button
            onClick={handleUpgrade}
            className="flex-1 max-w-[200px] px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-md button-press"
            style={{ backgroundColor: 'var(--brand-primary)', minHeight: '44px' }}
          >
            Start setup
          </button>
        </div>
      </div>
    </div>
  );
}
