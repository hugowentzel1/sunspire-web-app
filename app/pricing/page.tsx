"use client";

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

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
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ROI in 1 Month</h3>
              <p className="text-gray-600">If you book just 1 extra call per month, you've covered your costs</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live in 24 Hours</h3>
              <p className="text-gray-600">No waiting weeks for custom development</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Anytime</h3>
              <p className="text-gray-600">14-day refund if it doesn't increase your conversions</p>
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
          <div className="rounded-2xl p-8 max-w-2xl mx-auto" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.05 }}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
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
