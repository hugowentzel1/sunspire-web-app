"use client";

import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

export default function DPAPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Data Processing Agreement</h1>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Definitions</h2>
            <p className="text-gray-700 mb-6">
              This Data Processing Agreement ("DPA") forms part of the Terms of Service between 
              Sunspire ("Data Processor") and the customer ("Data Controller") for the processing 
              of personal data in connection with the provision of solar analysis services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Processing of Personal Data</h2>
            <p className="text-gray-700 mb-6">
              The Data Processor shall process personal data only on documented instructions from 
              the Data Controller, including regarding transfers of personal data to a third country 
              or an international organisation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Security Measures</h2>
            <p className="text-gray-700 mb-6">
              The Data Processor shall implement appropriate technical and organisational measures 
              to ensure a level of security appropriate to the risk, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Encryption of personal data</li>
              <li>Ability to ensure ongoing confidentiality, integrity, and availability</li>
              <li>Regular testing and evaluation of security measures</li>
              <li>Access controls and authentication procedures</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subprocessors</h2>
            <p className="text-gray-700 mb-6">
              The Data Processor may engage subprocessors to assist in providing services. All 
              subprocessors are bound by data protection obligations no less protective than 
              those in this DPA.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Subject Rights</h2>
            <p className="text-gray-700 mb-6">
              The Data Processor shall assist the Data Controller in responding to requests from 
              data subjects exercising their rights under applicable data protection law.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Breach Notification</h2>
            <p className="text-gray-700 mb-6">
              The Data Processor shall notify the Data Controller without undue delay after 
              becoming aware of a personal data breach, providing relevant information to assist 
              in breach notification obligations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Protection Impact Assessment</h2>
            <p className="text-gray-700 mb-6">
              The Data Processor shall provide reasonable assistance to the Data Controller 
              with any data protection impact assessments and prior consultations with supervisory 
              authorities.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Return or Deletion of Data</h2>
            <p className="text-gray-700 mb-6">
              Upon termination of services, the Data Processor shall delete or return all personal 
              data to the Data Controller, unless retention is required by applicable law.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Audit Rights</h2>
            <p className="text-gray-700 mb-6">
              The Data Processor shall make available to the Data Controller all information 
              necessary to demonstrate compliance with this DPA and allow for audits and inspections.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700">
              For questions about this DPA, contact our Data Protection Officer at{' '}
              <a href="mailto:dpo@sunspire.app" className="text-[var(--brand-primary)] hover:underline">
                dpo@sunspire.app
              </a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
