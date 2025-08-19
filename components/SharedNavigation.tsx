"use client";

import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

export default function SharedNavigation() {
  const b = useBrandTakeover();

  const handleLaunchClick = () => {
    if (b.enabled) {
      window.open(`https://sunspire-web-app.vercel.app/?company=${encodeURIComponent(b.brand)}&primary=${encodeURIComponent(b.primary)}&logo=${encodeURIComponent(b.logo || '')}`, '_blank');
    } else {
      // Default demo behavior
      window.location.href = '/demo-result';
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">☀️</span>
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ color: b.enabled ? 'var(--brand-primary)' : undefined }}>
                {b.enabled ? b.brand : 'Your Company'}
              </h1>
              <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                SOLAR INTELLIGENCE
              </p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-10">
            <a href="/enterprise" className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Enterprise</a>
            <a href="/partners" className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Partners</a>
            <a href="/support" className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium">Support</a>
            <motion.button 
              onClick={handleLaunchClick}
              className="btn-primary ml-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {b.enabled ? `Launch on ${b.brand}` : "Get Started"}
            </motion.button>
          </nav>
        </div>
      </div>
    </header>
  );
}
