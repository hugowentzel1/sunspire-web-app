"use client";

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

export default function RefundPolicyPage() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a
            href={searchParams?.get('demo') ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`}
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/50 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14-Day Money-Back Guarantee</h2>
            <p className="text-gray-600 mb-4">
              We offer a <strong>14-day money-back guarantee</strong> on your first subscription charge.
            </p>
            <p className="text-gray-600 mb-4">
              If you're dissatisfied for any reason in the first 14 days after activation (first deployment on your domain), 
              email <a href="mailto:support@getsunspire.com" className="text-[var(--brand-primary)] hover:underline">support@getsunspire.com</a> to request a refund.
            </p>
            <p className="text-gray-600 mb-6">
              Refunds are issued within 5–10 business days to the original payment method.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Cancellation Policy</h2>
            <p className="text-gray-600 mb-4">
              You can cancel anytime. Cancellations take effect at the end of the current billing period.
            </p>
            <p className="text-gray-600 mb-6">
              Your service will remain active until the end of your paid period.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Limitations</h2>
            <p className="text-gray-600 mb-4">
              Refunds are not available for abuse, fraud, or violations of our Terms of Service. 
              Chargebacks void eligibility for future refunds.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Questions?</h2>
            <p className="text-gray-600">
              Contact us at <a href="mailto:support@getsunspire.com" className="text-[var(--brand-primary)] hover:underline">support@getsunspire.com</a> or 
              see our full <a href="/terms#refunds" className="text-[var(--brand-primary)] hover:underline">Terms of Service</a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

