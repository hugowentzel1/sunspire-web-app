"use client";

import { useBrandTakeover } from '@/hooks/useBrandTakeover';
import LegalFooter from '@/components/legal/LegalFooter';

export default function PrivacyPage() {
  const b = useBrandTakeover();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            How we collect, use, and protect your personal information
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h2>
            
            <div className="space-y-6 text-gray-700">
              <p>
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
              
              <p>
                Sunspire ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our solar intelligence platform.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h3>
              <p>
                We collect information you provide directly to us, such as when you create an account, submit a solar analysis request, or contact our support team. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information</li>
                <li>Property address and details</li>
                <li>Company information</li>
                <li>Payment information</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h3>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Improve our services and develop new features</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Information Sharing</h3>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h3>
              <p>
                You have the right to access, correct, or delete your personal information. You may also opt out of certain communications from us.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h3>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@sunspire.app<br/>
                  <strong>Address:</strong> Sunspire, 123 Main Street, San Francisco, CA 94105
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LegalFooter brand={b.enabled ? b.brand : undefined} />
    </div>
  );
}
