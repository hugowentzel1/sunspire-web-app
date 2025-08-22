"use client";

import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import LegalFooter from '@/components/legal/LegalFooter';

export default function SetupGuidePage() {
  const b = useBrandTakeover();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <a 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Setup Guide</h1>
          <p className="text-xl text-gray-600">
            Step-by-step installation guide for your white-label solar intelligence tool
          </p>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4" style={{ backgroundColor: b.enabled && b.primary ? b.primary : '#d97706' }}>
                1
              </div>
              <h2 className="text-2xl font-bold" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Account Setup</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Create your Sunspire account and complete the initial configuration:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Sign up at sunspire.app</li>
              <li>Verify your email address</li>
              <li>Complete company profile setup</li>
              <li>Choose your subscription plan</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4" style={{ backgroundColor: b.enabled && b.primary ? b.primary : '#d97706' }}>
                2
              </div>
              <h2 className="text-2xl font-bold" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Branding Configuration</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Customize your white-label experience:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Upload your company logo</li>
              <li>Set brand colors and fonts</li>
              <li>Configure company information</li>
              <li>Customize email templates</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4" style={{ backgroundColor: b.enabled && b.primary ? b.primary : '#d97706' }}>
                3
              </div>
              <h2 className="text-2xl font-bold" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Domain Integration</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Connect your domain and go live:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Add your domain to the system</li>
              <li>Configure DNS settings</li>
              <li>Set up SSL certificates</li>
              <li>Test your branded tool</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4" style={{ backgroundColor: b.enabled && b.primary ? b.primary : '#d97706' }}>
                4
              </div>
              <h2 className="text-2xl font-bold" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Go Live</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Launch your white-label solar tool:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Test all functionality</li>
              <li>Train your team</li>
              <li>Start generating leads</li>
              <li>Monitor performance</li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you get up and running quickly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/support" 
                className="px-6 py-3 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: b.enabled && b.primary ? b.primary : '#d97706',
                  color: 'white'
                }}
              >
                Contact Support
              </a>
              <a 
                href="/docs/embed" 
                className="px-6 py-3 border-2 rounded-lg font-medium transition-colors"
                style={{ 
                  borderColor: b.enabled && b.primary ? b.primary : '#d97706',
                  color: b.enabled && b.primary ? b.primary : '#d97706'
                }}
              >
                Embed Guide
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <LegalFooter brand={b.enabled ? b.brand : undefined} />
    </div>
  );
}
