'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PremiumNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="nav-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-xl font-bold text-gray-900">
              <span className="text-secondary">Your</span>Logo
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-secondary transition-colors font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-secondary transition-colors font-medium">
              Pricing
            </a>
            <a href="#contact" className="text-gray-700 hover:text-secondary transition-colors font-medium">
              Contact
            </a>
            <button className="btn-premium text-sm px-6 py-2">
              Get Demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-secondary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-secondary transition-colors font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-secondary transition-colors font-medium">
                Pricing
              </a>
              <a href="#contact" className="text-gray-700 hover:text-secondary transition-colors font-medium">
                Contact
              </a>
              <button className="btn-premium text-sm px-6 py-2 w-full">
                Get Demo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}


