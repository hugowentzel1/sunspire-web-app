'use client';

import { motion } from 'framer-motion';

interface PremiumReportCTAProps {
  estimate: any;
}

export default function PremiumReportCTA({ estimate }: PremiumReportCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Summary */}
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{estimate.systemSizeKW} kW System</span>
            {' • '}
            <span>Payback: {estimate.paybackYear || '–'} years</span>
            {' • '}
            <span>25-year NPV: ${(estimate.npv25Year || 0).toLocaleString()}</span>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <a 
              href="mailto:sales@sunspire.app?subject=White-label%20Demo%20Request&body=Hi%20Sunspire%2C%20I%27d%20like%20to%20see%20a%20demo%20of%20the%20white-label%20solar%20intelligence%20platform.%20This%20report%20looks%20exactly%20like%20what%20we%20need%20for%20our%20solar%20business."
              className="btn-outline-premium text-sm px-6 py-2"
            >
              Get White-Label Demo
            </a>
            <a 
              href="mailto:sales@sunspire.app?subject=White-label%20Setup&body=Hi%20Sunspire%2C%20I%27m%20ready%20to%20get%20started%20with%20white-labeling%20the%20solar%20intelligence%20platform.%20Please%20send%20me%20the%20next%20steps%20and%20pricing."
              className="btn-premium text-sm px-6 py-2"
            >
              Start Setup
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


