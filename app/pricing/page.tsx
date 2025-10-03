'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useBrandColors } from '@/hooks/useBrandColors';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Container from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Stack } from '@/components/layout/Stack';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
  const searchParams = useSearchParams();
  const b = useBrandTakeover();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  
  useBrandColors();

  // Intersection Observer for sticky CTA
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCTA(!entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    const mainCTA = document.getElementById('main-cta');
    if (mainCTA) observer.observe(mainCTA);

    return () => observer.disconnect();
  }, []);

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
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-inter"
      data-brand
    >
      <Section>
        <Container>
          <Stack>
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

            {/* Hero Block */}
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-black text-neutral-900"
              >
                $99/mo + $399 setup
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto mt-8"
              >
                Go live in under 24 hours with branded solar quotes.
              </motion.p>
              
              {/* Risk Line */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm text-neutral-500 mt-6"
              >
                14-day refund if it doesn&apos;t lift booked calls.
              </motion.p>

              {/* Main CTA */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-8"
                      >
                        <Button
                          id="main-cta"
                          onClick={handleStartSetup}
                          className="w-full md:w-auto"
                        >
                          Start setup — $399 today + $99/mo
                        </Button>
                      </motion.div>

              {/* Trust Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center justify-center gap-2 mt-4 text-sm text-neutral-500"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Secure Stripe checkout • No hidden fees • 14-day refund</span>
              </motion.div>
            </div>

            {/* Social Proof Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center py-6 border-y border-neutral-200/60"
            >
              <p className="text-sm italic text-neutral-600">
                &ldquo;Cut quoting time from 15 min to 1 min.&rdquo; — Solar Company Owner, CA
              </p>
            </motion.div>

            {/* Core Value Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-10 md:mt-16">
              {/* What You Get */}
              <Card>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">What You Get</h2>
                <div className="space-y-4">
                  {[
                    'Branded reports & PDFs',
                    'Your domain (CNAME)',
                    'CRM integrations (HubSpot, Salesforce)',
                    'Unlimited quotes',
                    'SLA & support',
                    'End-to-end encryption'
                  ].map((feature, idx) => (
                    <div key={feature} className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-neutral-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Why Installers Switch */}
              <Card>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Why Installers Switch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700 font-medium">Live in &lt;24 hours — no coding required</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700 font-medium">Teams report +25–40% more booked calls after adding instant quotes</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* ROI Micro-nudge */}
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-600">
                One extra booked job per month typically covers the subscription.
              </p>
            </div>

            {/* FAQ Block */}
            <div className="mt-10 md:mt-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-10">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-neutral-200/60 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                      className="w-full px-6 py-5 md:px-7 md:py-6 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
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
                        className="px-6 py-5 md:px-7 md:py-6"
                      >
                        <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Stack>
        </Container>
      </Section>

      {/* Use consistent Footer component across entire demo site */}
      <Footer />

              {/* Mobile Sticky CTA */}
              {showStickyCTA && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-50">
                  <div className="px-4 py-4">
                    <Button
                      onClick={handleStartSetup}
                      className="w-full"
                    >
                      Start setup — $399 today + $99/mo
                    </Button>
                  </div>
                </div>
              )}
    </div>
  );
}
