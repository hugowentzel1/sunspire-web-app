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
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-gray-900">
              <span className="text-orange-500">☀️</span> Sunspire
            </a>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/pricing" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Pricing</a>
            <a href="/partners" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Partners</a>
            <a href="/support" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Support</a>
            <motion.button 
              onClick={handleLaunchClick}
              className="btn-primary"
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
