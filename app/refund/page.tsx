"use client";

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import LegalFooter from '@/components/legal/LegalFooter';

export default function RefundPage() {
  const b = useBrandTakeover();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
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

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
          <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">
            Refund & Cancellation Policy
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> September 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscriptions</h2>
              <p className="text-gray-600 mb-4">
                Sunspire is billed monthly. You can cancel anytime via the billing portal; service remains active until the end of the current period. We do not prorate partial months.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Fee</h2>
              <p className="text-gray-600 mb-4">
                The one-time setup covers provisioning/branding/deployment and is <em>non-refundable</em> once your tenant is created.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Cancel</h2>
              <p className="text-gray-600 mb-4">
                Use the billing portal link in your account. Need help? <a href="mailto:support@getsunspire.com" className="text-[var(--brand-primary)] hover:underline">support@getsunspire.com</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about our refund policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Support:</strong> <a href="mailto:support@getsunspire.com" className="text-[var(--brand-primary)] hover:underline">support@getsunspire.com</a><br />
                  <strong>Billing:</strong> <a href="mailto:billing@getsunspire.com" className="text-[var(--brand-primary)] hover:underline">billing@getsunspire.com</a><br />
                  <strong>Address:</strong> 3133 Maple Dr Ne Ste 240 #1156 Atlanta, GA 30305<br />
                  <strong>Phone:</strong> (555) 123-4567
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <LegalFooter brand={b.enabled ? b.brand : undefined} />
    </div>
  );
}