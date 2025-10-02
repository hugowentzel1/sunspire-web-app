'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useBrandColors } from '@/hooks/useBrandColors';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PricingPage() {
  const searchParams = useSearchParams();
  const b = useBrandTakeover();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  useBrandColors();

  const handleStartSetup = async () => {
    try {
      const token = searchParams?.get('token');
      const company = searchParams?.get('company');
      const utm_source = searchParams?.get('utm_source');
      const utm_campaign = searchParams?.get('utm_campaign');
      
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
    const params = new URLSearchParams(searchParams?.toString());
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
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

        {/* Pricing Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-4"
          >
            $99/mo + $399 setup
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto"
          >
            Go live in under 24 hours with branded solar quotes.
          </motion.p>
        </div>

        {/* Two Equal-Height Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
          {/* LEFT: What You Get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">What You Get</h2>
            
            <div className="space-y-5 mb-8">
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
                  transition={{ duration: 0.3, delay: 0.3 + (idx * 0.06) }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Why Installers Switch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Installers Switch</h2>
            
            <div className="space-y-5 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium text-lg">Live in &lt;24 hours — no coding required</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium text-lg">Teams report +25–40% more booked calls after adding instant quotes</span>
              </motion.div>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="pt-6 border-t border-gray-100"
            >
              <p className="text-base italic text-gray-600 leading-relaxed">
                &ldquo;Cut quoting time from 15 min to 1 min.&rdquo;
              </p>
              <p className="text-sm text-gray-500 mt-2">— Solar Company Owner, CA</p>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Zone - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="max-w-2xl mx-auto text-center mb-8"
        >
          {/* Primary CTA */}
          <button
            onClick={handleStartSetup}
            className="w-full md:w-auto px-12 py-5 rounded-2xl text-white font-bold text-xl shadow-xl hover:shadow-2xl transition-all button-press hover-lift mb-4"
            style={{ backgroundColor: 'var(--brand-primary)', minHeight: '64px', minWidth: '320px' }}
          >
            Start setup — $399 today
          </button>

          {/* Stripe Trust Row */}
          <div className="flex items-center justify-center gap-2 mb-3 text-sm text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Secure checkout — powered by Stripe</span>
          </div>

          {/* Refund Guarantee */}
          <p className="text-sm italic text-gray-600 mb-6">
            14-day refund if it doesn&apos;t lift booked calls
          </p>

          {/* Trust Badges Row */}
          <div className="flex items-center justify-center gap-6 flex-wrap text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>SOC2</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>HubSpot</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Salesforce</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>GDPR</span>
            </div>
          </div>
        </motion.div>

        {/* 3-Step Setup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex items-center justify-center gap-4 md:gap-8 mb-16 flex-wrap max-w-4xl mx-auto"
        >
          {[
            { num: 1, title: 'Connect domain' },
            { num: 2, title: 'Brand & CRM' },
            { num: 3, title: 'Live in 24h' }
          ].map((step, idx) => (
            <div key={step.num} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full font-bold text-white flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
                {step.num}
              </div>
              <span className="font-semibold text-gray-900">{step.title}</span>
              {idx < 2 && (
                <svg className="hidden md:block w-5 h-5 text-gray-300 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full px-6 md:px-8 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-lg pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${openFAQ === idx ? 'rotate-180' : ''}`}
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
                    transition={{ duration: 0.3 }}
                    className="px-6 md:px-8 pb-5"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </main>

      {/* Use consistent Footer component across entire demo site */}
      <Footer />

      {/* Mobile Sticky Bottom Bar - Single Primary CTA */}
      <div 
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-50"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
            <div className="flex-shrink-0">
              <div className="text-lg font-bold text-gray-900">$99/mo + $399</div>
              <div className="text-xs text-gray-500">14-day refund</div>
            </div>
            <button
              onClick={handleStartSetup}
              className="flex-1 max-w-[180px] px-6 py-3 rounded-xl text-white font-bold text-base shadow-lg button-press"
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
