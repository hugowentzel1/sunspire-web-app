'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalModal({ isOpen, onClose }: LegalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--ink)]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[var(--ink)]">Terms & Privacy</h2>
              
              <div>
                <h3 className="font-bold text-[var(--ink)] mb-2">Disclaimer</h3>
                <p className="text-sm text-[var(--muted)]">
                  Solar estimates are approximations based on mathematical models and historical data. 
                  Actual production may vary due to weather, equipment performance, and other factors. 
                  These estimates should not be considered as guarantees.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-[var(--ink)] mb-2">Data Use</h3>
                <p className="text-sm text-[var(--muted)]">
                  Address and contact information is used to generate solar estimates and may be shared 
                  with verified solar installers when you request quotes. Data is processed by NREL PVWatts® 
                  for calculations and Google Maps for location services.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-[var(--ink)] mb-2">Consent</h3>
                <p className="text-sm text-[var(--muted)]">
                  By continuing to use this service, you consent to our data processing practices. 
                  For full terms and privacy policy, please contact us for licensing information.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
