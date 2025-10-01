'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
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

  const handleStartSetup = async () => {
    try {
      const token = searchParams.get('token');
      const company = searchParams.get('company');
      const utm_source = searchParams.get('utm_source');
      const utm_campaign = searchParams.get('utm_campaign');
      
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
      
      if (!response.ok) throw new Error('Checkout failed');
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to start checkout. Please try again.');
    }
  };

  const createUrlWithParams = (path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${path}?${params.toString()}`;
  };

  const faqs = [
    {
      q: 'Accuracy & data sources',
      a: 'NREL PVWatts® v8 for solar modeling, EIA utility rates, and real-time irradiance data. Industry-standard precision.'
    },
    {
      q: 'Security & encryption',
      a: 'End-to-end encryption (TLS 1.3 in transit, AES-256 at rest). SOC 2-aligned controls. Bank-level security.'
    },
    {
      q: 'Cancel & refund policy',
      a: '14-day full refund if it doesn\'t increase booked calls. Cancel anytime after with 30 days notice. No lock-in.'
    },
    {
      q: 'Support',
      a: 'Email support with <24h response. Priority onboarding for setup and CRM integrations included.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href={createUrlWithParams('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors button-press"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-black text-gray-900 mb-4"
          >
            $99/mo + $399 setup
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto"
          >
            Live in &lt;24 hours · CNAME · CRM (HubSpot/Salesforce) · Unlimited quotes
          </motion.p>
        </div>

        {/* Two Column Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 max-w-5xl mx-auto">
          {/* LEFT: Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What You Get</h2>
            
            {/* Feature Checklist */}
            <div className="space-y-4 mb-8">
              {[
                'Branded reports & PDFs',
                'Your domain (CNAME)',
                'CRM integrations (HubSpot, Salesforce)',
                'Unlimited quotes',
                'SLA & support',
                'End-to-end encryption'
              ].map((feature, idx) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (idx * 0.07) }}
                  className="flex items-center gap-3"
                >
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Primary CTA */}
            <motion.button
              onClick={handleStartSetup}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="w-full px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all button-press hover-lift"
              style={{ backgroundColor: 'var(--brand-primary)', minHeight: '52px', minWidth: '280px' }}
            >
              Start setup — $399 today
            </motion.button>

            {/* Trust Row */}
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure checkout — powered by Stripe</span>
            </div>

            {/* Money-back guarantee */}
            <p className="text-sm text-gray-500 text-center mt-4">
              14-day refund if it doesn&apos;t lift booked calls
            </p>
          </motion.div>

          {/* RIGHT: Why Switch Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Installers Switch</h2>
            
            <div className="space-y-4 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex items-start gap-3"
              >
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 font-medium">Live in &lt;24 hours — no coding</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="flex items-start gap-3"
              >
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 font-medium">Teams report +25–40% more booked calls after adding instant quotes</span>
              </motion.div>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="pt-4 border-t border-gray-100"
            >
              <p className="text-sm italic text-gray-600">
                &ldquo;Cut quoting time from 15 min to 1 min.&rdquo;
              </p>
              <p className="text-sm text-gray-500 mt-1">— Solar Company Owner, CA</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Risk Reversal + Social Proof Band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 mb-8 text-center border border-gray-200/50"
        >
          <p className="text-sm text-gray-700">
            <span className="font-semibold">100+ installers live today</span>
            <span className="mx-3">·</span>
            <span>14-day refund</span>
            <span className="mx-3">·</span>
            <span>Bank-level security</span>
          </p>
        </motion.div>

        {/* 3-Step Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex items-center justify-center gap-6 mb-16 flex-wrap"
        >
          {[
            { num: 1, title: 'Connect domain' },
            { num: 2, title: 'Brand & CRM' },
            { num: 3, title: 'Live in 24h' }
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full font-bold text-white flex items-center justify-center text-lg" style={{ backgroundColor: 'var(--brand-primary)' }}>
                  {step.num}
                </div>
                <span className="font-semibold text-gray-900">{step.title}</span>
              </div>
              {idx < 2 && (
                <svg className="hidden md:block w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </div>
          ))}
        </motion.div>

        {/* FAQ Accordions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  style={{ minHeight: '60px' }}
                >
                  <span className="font-semibold text-gray-900 text-lg">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${openFAQ === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Legal Footer */}
        <div className="text-center text-sm text-gray-500 space-x-4 mb-16">
          <Link href={createUrlWithParams('/privacy')} className="hover:text-gray-700 transition-colors">Privacy</Link>
          <span>•</span>
          <Link href={createUrlWithParams('/terms')} className="hover:text-gray-700 transition-colors">Terms</Link>
          <span>•</span>
          <Link href={createUrlWithParams('/security')} className="hover:text-gray-700 transition-colors">Security</Link>
          <span>•</span>
          <Link href={createUrlWithParams('/dpa')} className="hover:text-gray-700 transition-colors">DPA</Link>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 safe-area-bottom"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div>
              <div className="text-lg font-bold text-gray-900">$99/mo + $399</div>
              <div className="text-xs text-gray-500">14-day refund</div>
            </div>
            <button
              onClick={handleStartSetup}
              className="px-6 py-3 rounded-xl text-white font-bold shadow-lg button-press"
              style={{ backgroundColor: 'var(--brand-primary)', minHeight: '48px' }}
            >
              Start setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
