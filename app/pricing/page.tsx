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
      q: 'Is there a setup fee?',
      a: 'Yes, there&apos;s a one-time $399 setup fee that covers domain configuration, branding, and CRM integration. After that, it&apos;s just $99/month.'
    },
    {
      q: 'How accurate are the solar estimates?',
      a: 'We use NREL PVWatts® v8 for solar modeling, EIA utility rates, and real-time irradiance data for industry-standard precision.'
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes, 14-day full refund if it doesn&apos;t increase booked calls. Cancel anytime after with 30 days notice. No lock-in.'
    },
    {
      q: 'What support do you provide?',
      a: 'Email support with <24h response. Priority onboarding for setup and CRM integrations included.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-16 sm:py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href={createUrlWithParams('/')}
            className="inline-flex items-center text-neutral-500 hover:text-neutral-900 transition-colors button-press"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Pricing Header */}
        <div className="text-center space-y-3 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-3xl font-extrabold text-neutral-900"
          >
            $99/mo + $399 setup
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-center text-gray-600"
          >
            Go live in under 24 hours with branded solar quotes.
          </motion.p>
        </div>

        {/* Two Column Grid - What You Get + Why Installers Switch */}
        <div className="grid grid-cols-[1fr_0.9fr] gap-8 md:grid-cols-1 md:gap-6 mt-12" data-testid="pricing-grid">
          {/* LEFT: What You Get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-neutral-200/60 shadow-sm p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold mb-4">What You Get</h3>
            
            <ul className="space-y-3">
              {[
                'Branded reports & PDFs',
                'Your domain (CNAME)',
                'CRM integrations (HubSpot, Salesforce)',
                'Unlimited quotes',
                'SLA & support',
                'End-to-end encryption'
              ].map((feature, idx) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (idx * 0.06) }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* RIGHT: Why Installers Switch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-xl border border-neutral-200/60 shadow-sm p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold mb-4">Why Installers Switch</h3>
            
            <ul className="space-y-3">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="text-gray-700"
              >
                Live in &lt;24 hours — no coding required
              </motion.li>

              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="text-gray-700"
              >
                Teams report +25–40% more booked calls after adding instant quotes
              </motion.li>
            </ul>

            {/* Testimonial - aligned with checklist text */}
            <blockquote className="mt-6 border-l-2 border-gray-200 pl-4">
              <p className="italic text-gray-700">&ldquo;Cut quoting time from 15 min to 1 min.&rdquo;</p>
              <footer className="mt-2 text-sm text-gray-500">— Solar Company Owner, CA</footer>
            </blockquote>
          </motion.div>
        </div>

        {/* CTA Zone - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col items-center mt-6 mb-6"
        >
          {/* Primary CTA */}
          <button
            onClick={handleStartSetup}
            className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md"
            style={{ backgroundColor: 'var(--brand-primary)' }}
            data-testid="pricing-cta"
          >
            Start setup — $399 today (then $99/mo)
          </button>

          {/* compact pricing/guarantee */}
          <div className="mt-3 text-sm text-gray-600 text-center">
            Secure checkout — powered by Stripe · 14-day refund if it doesn&apos;t lift booked calls · No coding required
          </div>
        </motion.div>

        {/* Trust badges & 1-2-3 steps */}
        <div className="mt-4" data-testid="trust-badges">
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
        </div>

        <h2 className="text-2xl font-bold text-center mt-16">Frequently Asked Questions</h2>
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="max-w-3xl mx-auto mb-20"
          >
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-neutral-200/60 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="font-semibold text-neutral-900 pr-4">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-200 ${openFAQ === idx ? 'rotate-180' : ''}`}
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
                      className="px-6 py-4"
                    >
                      <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

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
              <div className="text-lg font-bold text-gray-900">$99/mo + $399 setup</div>
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
