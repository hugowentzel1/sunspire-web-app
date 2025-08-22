"use client";

import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import LegalFooter from '@/components/legal/LegalFooter';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-6" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Information We Collect</h2>
            <p className="text-gray-700 mb-6">
              We collect information you provide directly to us, such as when you create an account, 
              request a demo, or contact us for support. This may include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Name and contact information</li>
              <li>Company information</li>
              <li>Property address for solar estimates</li>
              <li>Usage data and analytics</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>How We Use Your Information</h2>
            <p className="text-gray-700 mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide and improve our solar analysis services</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Information Sharing</h2>
            <p className="text-gray-700 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy.
            </p>

            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Your Rights</h2>
            <p className="text-gray-700 mb-6">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>GDPR & CCPA Compliance</h2>
            <p className="text-gray-700 mb-6">
              We comply with the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Data Portability:</strong> You can request a copy of your data in a portable format</li>
              <li><strong>Right to Deletion:</strong> Request complete removal of your personal information</li>
              <li><strong>Opt-Out Rights:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Data Processing:</strong> We only process data with your explicit consent</li>
              <li><strong>Cross-Border Transfers:</strong> Data is stored and processed in compliance with applicable laws</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@sunspire.app" className="text-[var(--brand-primary)] hover:underline">
                privacy@sunspire.app
              </a>
            </p>
          </div>
        </motion.div>
      </main>
      
      {/* Footer */}
      <LegalFooter />
    </div>
  );
}
