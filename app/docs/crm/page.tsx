"use client";

import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import LegalFooter from '@/components/legal/LegalFooter';

export default function CRMGuidePage() {
  const b = useBrandTakeover();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-6" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>CRM Integration Guide</h1>
          <p className="text-xl text-gray-600">
            Connect your solar leads with HubSpot, Salesforce, and Airtable
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* HubSpot */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>HubSpot Integration</h2>
            <p className="text-gray-700 mb-4">
              Automatically create contacts and deals in HubSpot:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                {`// HubSpot webhook configuration
Webhook URL: https://yourcompany.sunspire.app/webhooks/hubspot
Events: contact.created, deal.created
Properties: name, email, phone, company, solar_estimate`}
              </code>
            </div>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Automatic contact creation</li>
              <li>Deal pipeline management</li>
              <li>Custom property mapping</li>
              <li>Real-time synchronization</li>
            </ul>
          </div>

          {/* Salesforce */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Salesforce Integration</h2>
            <p className="text-gray-700 mb-4">
              Sync leads and opportunities with Salesforce:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                {`// Salesforce API configuration
API Endpoint: https://yourcompany.sunspire.app/api/salesforce
Authentication: OAuth 2.0
Objects: Lead, Opportunity, Contact`}
              </code>
            </div>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Lead record creation</li>
              <li>Opportunity tracking</li>
              <li>Custom field mapping</li>
              <li>Workflow automation</li>
            </ul>
          </div>

          {/* Airtable */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Airtable Integration</h2>
            <p className="text-gray-700 mb-4">
              Store and organize leads in Airtable:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                {`// Airtable webhook configuration
Base ID: YOUR_BASE_ID
Table: Solar Leads
Fields: Name, Email, Phone, Address, Estimate`}
              </code>
            </div>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Automatic row creation</li>
              <li>Custom field mapping</li>
              <li>Real-time updates</li>
              <li>Bulk data import</li>
            </ul>
          </div>

          {/* Custom API */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Custom API Integration</h2>
            <p className="text-gray-700 mb-4">
              Build custom integrations with our REST API:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <code className="text-green-400 text-sm">
                {`// Example API call
POST /api/leads
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "estimate": {
    "systemSize": 5.2,
    "netCost": 15600,
    "savings": 1800
  }
}`}
              </code>
            </div>
            <ul className="list-disc pl-6 text-gray-700">
              <li>RESTful API endpoints</li>
              <li>Webhook support</li>
              <li>Custom data formats</li>
              <li>Rate limiting</li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Integration Help?</h3>
            <p className="text-gray-600 mb-6">
              Our team can help you set up any CRM integration.
            </p>
            <a 
              href="/support" 
              className="px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              style={{ 
                backgroundColor: b.enabled && b.primary ? b.primary : '#d97706',
                color: 'white'
              }}
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </main>

      <LegalFooter brand={b.enabled ? b.brand : undefined} />
    </div>
  );
}
