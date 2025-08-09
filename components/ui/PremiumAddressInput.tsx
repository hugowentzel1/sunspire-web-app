'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const AddressAutocomplete = dynamic(() => import('@/components/AddressAutocomplete'), { ssr: false });

interface PremiumAddressInputProps {
  onAddressSelect: (address: any) => void;
  onGenerateEstimate: () => void;
  isLoading?: boolean;
}

export default function PremiumAddressInput({ onAddressSelect, onGenerateEstimate, isLoading = false }: PremiumAddressInputProps) {
  const [address, setAddress] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="card-glass p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Generate Solar Intelligence Report
            </h3>
            <p className="text-white/80">
              Enter any address to get instant solar estimates powered by NREL PVWatts®
            </p>
          </div>

          {/* Address Input */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <AddressAutocomplete 
                value={address}
                onChange={setAddress}
                onSelect={onAddressSelect}
                placeholder="Start typing your property address..."
                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border-2 border-amber-200 focus:border-amber-400 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-amber-50"
              />
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: address ? 1.02 : 1 }}
              whileTap={{ scale: address ? 0.98 : 1 }}
              onClick={onGenerateEstimate}
              disabled={!address || isLoading}
              className={`${!address || isLoading ? 'btn-disabled w-full text-lg py-4' : 'btn-premium w-full text-lg py-4'}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating Report...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Solar Intelligence Report</span>
                </div>
              )}
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>NREL PVWatts®</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


