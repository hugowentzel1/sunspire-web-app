"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompany } from './CompanyContext';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const { company } = useCompany();
  const b = useBrandTakeover();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleActivateClick = () => {
    window.open(`/signup?company=${company.companyHandle}`, '_blank');
  };

  const handleSampleClick = () => {
    document.dispatchEvent(new CustomEvent('openLeadForm'));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
        role="banner"
        aria-label="Call to action"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Message */}
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-gray-900">
                Keep this live on <span className="font-semibold">{company.companyDomain}</span> — 
                <span className="font-bold text-[var(--brand-primary)]"> $399 setup + $99/mo</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleActivateClick}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200"
                style={{ backgroundColor: 'var(--brand-primary)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Activate Sunspire now"
              >
                Activate now
              </motion.button>
              
              <motion.button
                onClick={handleSampleClick}
                className="px-6 py-2 rounded-lg font-semibold border-2 transition-all duration-200"
                style={{ 
                  borderColor: 'var(--brand-primary)',
                  color: 'var(--brand-primary)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Request sample report"
              >
                Request sample
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
