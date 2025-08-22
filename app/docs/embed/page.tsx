"use client";

import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import LegalFooter from '@/components/legal/LegalFooter';

export default function EmbedGuidePage() {
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
          <h1 className="text-4xl font-bold mb-6" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Embed Guide</h1>
          <p className="text-xl text-gray-600">
            Add your white-label solar tool to your website in minutes
          </p>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Method 1: iFrame Embed */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>iFrame Embed</h2>
            <p className="text-gray-700 mb-4">
              The simplest way to embed your solar tool on any website:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                {`<iframe src="https://yourcompany.sunspire.app/embed" width="100%" height="600" frameborder="0"></iframe>`}
              </code>
            </div>
          </div>

          {/* Method 2: JavaScript Widget */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>JavaScript Widget</h2>
            <p className="text-gray-700 mb-4">
              For more control and customization options:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                {`<script src="https://yourcompany.sunspire.app/widget.js"></script>
<div id="sunspire-widget" data-company="${b.enabled && b.brand ? b.brand : 'Your Company'}"></div>`}
              </code>
            </div>
          </div>

          {/* Method 3: API Integration */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Method 3: API Integration</h2>
            <p className="text-gray-700 mb-4">
              For advanced developers who want full control:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                {`// Example API call
const response = await fetch('https://yourcompany.sunspire.app/api/estimate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    address: '123 Main St, City, State',
    usage: 1000 // kWh per month
  })
});

const estimate = await response.json();`}
              </code>
            </div>
            <p className="text-sm text-gray-600">
              Get your API key from your Sunspire dashboard
            </p>
          </div>

          {/* Customization Options */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Customization Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Styling</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Brand colors and fonts</li>
                  <li>• Button styles and layouts</li>
                  <li>• Form field customization</li>
                  <li>• Responsive design options</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Functionality</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Lead capture forms</li>
                  <li>• CRM integration</li>
                  <li>• Custom success messages</li>
                  <li>• Analytics tracking</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Technical Help?</h3>
            <p className="text-gray-600 mb-6">
              Our development team can help you with custom integrations.
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
                href="/docs/crm" 
                className="px-6 py-3 border-2 rounded-lg font-medium transition-colors"
                style={{ 
                  borderColor: b.enabled && b.primary ? b.primary : '#d97706',
                  color: b.enabled && b.primary ? b.primary : '#d97706'
                }}
              >
                CRM Integration Guide
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <LegalFooter brand={b.enabled ? b.brand : undefined} />
    </div>
  );
}
