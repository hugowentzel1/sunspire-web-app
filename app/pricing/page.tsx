"use client";

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { IconBadge } from '@/components/ui/IconBadge';

import LegalFooter from '@/components/legal/LegalFooter';

export default function PricingPage() {
  const b = useBrandTakeover();

  // Debug logging
  useEffect(() => {
    console.log('Pricing page mounted, brand state:', b);
    console.log('localStorage brand state:', localStorage.getItem('sunspire-brand-takeover'));
  }, [b]);

  const handleLaunchClick = () => {
    if (b.enabled) {
      window.open(`https://sunspire-web-app.vercel.app/?company=${encodeURIComponent(b.brand)}&primary=${encodeURIComponent(b.primary)}&logo=${encodeURIComponent(b.logo || '')}`, '_blank');
    } else {
      // Default demo behavior
      window.location.href = '/demo-result';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            One plan. No hidden fees. Get your white-label solar tool live in 24 hours.
          </p>
        </motion.div>

        {/* Main Pricing Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12 relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 text-white px-6 py-2 rounded-bl-lg font-semibold" style={{ backgroundColor: 'var(--brand-primary)' }}>
              Most Popular
            </div>
            
            {/* Setup Fee */}
            <div className="text-center mb-8">
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--brand-primary)' }}>One-Time Setup</div>
              <div className="text-4xl font-bold text-gray-900 mb-2">$399</div>
              <p className="text-gray-600">Get your tool live in 24 hours</p>
            </div>

            {/* Monthly Fee */}
            <div className="text-center mb-8">
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--brand-primary)' }}>Then Just</div>
              <div className="text-5xl font-bold text-gray-900 mb-2">$99</div>
              <div className="text-xl text-gray-600 mb-2">per month</div>
              <p className="text-gray-600">Cancel anytime, no long-term contracts</p>
            </div>

            {/* What's Included */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Everything You Get:</h3>
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
                  <span className="text-sm" style={{ color: 'var(--brand-primary)' }}>✓</span>
                </div>
                <span className="text-gray-700">Full white-label customization</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
                  <span className="text-sm" style={{ color: 'var(--brand-primary)' }}>✓</span>
                </div>
                <span className="text-gray-700">Your domain & branding</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
                  <span className="text-sm" style={{ color: 'var(--brand-primary)' }}>✓</span>
                </div>
                <span className="text-gray-700">Lead capture & CRM integration</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
                  <span className="text-sm" style={{ color: 'var(--brand-primary)' }}>✓</span>
                </div>
                <span className="text-gray-700">24/7 email support</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
                  <span className="text-sm" style={{ color: 'var(--brand-primary)' }}>✓</span>
                </div>
                <span className="text-gray-700">14-day money-back guarantee</span>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button 
              onClick={handleLaunchClick}
              className="w-full text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors"
              style={{ backgroundColor: 'var(--brand-primary)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {b.enabled ? `Launch on ${b.brand}` : "Get Started Now"}
            </motion.button>

            <p className="text-xs text-gray-500 text-center mt-4">
              No credit card required for setup
            </p>
          </div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why This Pricing Makes Sense</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <IconBadge>
                  <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.196v-.235c0-.305.211-.508.5-.508.305 0 .5.203.5.508v.235c.22 0 .418.103.573.196.155.093.3.228.3.39 0 .164-.145.3-.3.39-.155.092-.353.185-.573.185v.235c0 .305-.195.508-.5.508-.289 0-.5-.203-.5-.508v-.235c-.22 0-.418-.103-.573-.185-.155-.09-.3-.226-.3-.39 0-.162.145-.297.3-.39z"/>
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"/>
                  </svg>
                </IconBadge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ROI in 1 Month</h3>
              <p className="text-gray-700">If you book just 1 extra call per month, you've covered your costs</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <IconBadge>
                  <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                </IconBadge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live in 24 Hours</h3>
              <p className="text-gray-700">No waiting weeks for custom development</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <IconBadge>
                  <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                  </svg>
                </IconBadge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Anytime</h3>
              <p className="text-gray-700">14-day refund if it doesn't increase your conversions</p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="rounded-2xl p-8 max-w-2xl mx-auto bg-gray-50 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-700 mb-6">
              Join 50+ solar companies already using {b.enabled ? b.brand : 'Your Company'} to increase their conversions.
            </p>
            <motion.button 
              onClick={handleLaunchClick}
              className="px-8 py-3 rounded-lg font-semibold text-white transition-colors"
              style={{ backgroundColor: 'var(--brand-primary)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {b.enabled ? `Launch on ${b.brand}` : "Start Your 14-Day Trial"}
            </motion.button>
          </div>
        </motion.div>
      </main>

      <LegalFooter brand={b.enabled ? b.brand : undefined} />
    </div>
  );
}
