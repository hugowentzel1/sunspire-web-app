'use client';

import { motion } from 'framer-motion';

interface StickySidebarProps {
  brand: string;
  onUpgradeClick: () => void;
  onFeaturesClick: () => void;
}

export default function StickySidebar({ brand, onUpgradeClick, onFeaturesClick }: StickySidebarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-40"
      data-testid="report-sidebar"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 max-w-sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700 font-medium">
              This demo is already branded for <span className="font-bold">{brand}</span>. Upgrade now to keep it live.
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            77 installers · 12,384 quotes · Avg quote 42s · 99.7% uptime
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onUpgradeClick}
              className="w-full btn-primary text-sm py-3"
              data-testid="report-cta"
            >
              Keep my branded Sunspire
            </button>
            
            <button
              onClick={onFeaturesClick}
              className="w-full text-sm text-[var(--brand-primary)] hover:underline"
            >
              See white-label features
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
