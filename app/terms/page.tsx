"use client";

import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using Sunspire's solar analysis services, you accept and agree to be bound 
              by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Description</h2>
            <p className="text-gray-700 mb-6">
              Sunspire provides solar energy analysis tools, including estimates, calculations, and 
              installer matching services. Our estimates are based on modeling data and are for 
              informational purposes only.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 mb-6">
              You agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide accurate information when using our services</li>
              <li>Use the services only for lawful purposes</li>
              <li>Not attempt to reverse engineer or copy our technology</li>
              <li>Maintain the security of your account credentials</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
            <p className="text-gray-700 mb-6">
              Services are billed monthly in advance. Setup fees are charged once upon activation. 
              You may cancel your subscription at any time with 14 days notice.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Policy</h2>
            <p className="text-gray-700 mb-6">
              We offer a 14-day money-back guarantee. If you're not satisfied with our services 
              within the first 14 days, we'll provide a full refund.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              Sunspire's liability is limited to the amount paid for services in the 12 months 
              preceding any claim. We are not liable for indirect, incidental, or consequential damages.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700">
              For questions about these terms, contact us at{' '}
              <a href="mailto:legal@sunspire.app" className="text-[var(--brand-primary)] hover:underline">
                legal@sunspire.app
              </a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
