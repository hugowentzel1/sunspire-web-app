'use client';

import { motion } from 'framer-motion';

interface PremiumReportHeaderProps {
  address: string;
  customerName?: string;
}

export default function PremiumReportHeader({ address, customerName }: PremiumReportHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-premium-dark text-white py-16 mb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          {/* Logo and Branding */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">
              <span className="text-orange-400">Your</span>Logo
            </div>
          </div>

          {/* Report Title */}
          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            Solar Intelligence Report
          </h1>
          
          {/* Customer Info */}
          {customerName && (
            <p className="text-xl text-gray-300">
              Prepared for: <span className="font-semibold text-white">{customerName}</span>
            </p>
          )}

          {/* Address */}
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-lg">{address}</span>
          </div>

          {/* Report Date */}
          <p className="text-gray-400">
            Generated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="glass rounded-full px-4 py-2 text-white/90 text-sm font-medium">
              ⚡ PVWatts® Powered
            </div>
            <div className="glass rounded-full px-4 py-2 text-white/90 text-sm font-medium">
              🔒 Bank-Level Security
            </div>
            <div className="glass rounded-full px-4 py-2 text-white/90 text-sm font-medium">
              📊 Industry Standard
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


