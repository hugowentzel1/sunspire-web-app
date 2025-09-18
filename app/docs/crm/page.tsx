"use client";

import { motion } from "framer-motion";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import LegalFooter from "@/components/legal/LegalFooter";
import Link from "next/link";

export default function CRMGuidesPage() {
  const b = useBrandTakeover();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">☀️</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-[var(--brand-primary)]">
                  {b.enabled ? b.brand : "Your Company"}
                </h1>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                  Solar Intelligence
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-12">
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/partners"
                className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
              >
                Partners
              </Link>
              <Link
                href="/support"
                className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
              >
                Support
              </Link>
              <Link href="/" className="btn-primary ml-12">
                New Analysis
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              CRM Integration Guides
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect your solar intelligence tool with your favorite CRM
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* HubSpot Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🟠</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                HubSpot Integration
              </h3>
              <p className="text-gray-600 mb-6">
                Connect your solar tool with HubSpot CRM for seamless lead
                management and automation.
              </p>
              <Link
                href="/docs/crm/hubspot"
                className="inline-block w-full py-3 px-6 bg-[var(--brand-primary)] text-white rounded-lg font-semibold hover:bg-[var(--brand-primary-dark)] transition-colors text-center"
              >
                View HubSpot Guide
              </Link>
            </motion.div>

            {/* Salesforce Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔵</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Salesforce Integration
              </h3>
              <p className="text-gray-600 mb-6">
                Integrate with Salesforce CRM to track leads, opportunities, and
                customer data.
              </p>
              <Link
                href="/docs/crm/salesforce"
                className="inline-block w-full py-3 px-6 bg-[var(--brand-primary)] text-white rounded-lg font-semibold hover:bg-[var(--brand-primary-dark)] transition-colors text-center"
              >
                View Salesforce Guide
              </Link>
            </motion.div>

            {/* Airtable Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🟣</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Airtable Integration
              </h3>
              <p className="text-gray-600 mb-6">
                Connect with Airtable for flexible database management and
                custom workflows.
              </p>
              <Link
                href="/docs/crm/airtable"
                className="inline-block w-full py-3 px-6 bg-[var(--brand-primary)] text-white rounded-lg font-semibold hover:bg-[var(--brand-primary-dark)] transition-colors text-center"
              >
                View Airtable Guide
              </Link>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/support"
              className="inline-flex items-center px-6 py-3 text-gray-600 hover:text-[var(--brand-primary)] transition-colors"
            >
              ← Back to Support
            </Link>
          </div>
        </motion.div>
      </main>

      <LegalFooter brand={b.enabled ? b.brand : undefined} />
    </div>
  );
}
