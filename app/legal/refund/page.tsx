export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Refund Policy</h1>
      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">14-Day Money-Back Guarantee</h2>
        <p className="text-gray-600 mb-4">
          We offer a <strong>14-day money-back guarantee</strong> on your first subscription charge.
        </p>
        <p className="text-gray-600 mb-4">
          If you&apos;re dissatisfied for any reason in the first 14 days after activation (first deployment on your domain), 
          email <a href="mailto:support@getsunspire.com" className="text-[var(--brand-primary)] hover:underline">support@getsunspire.com</a> to request a refund.
        </p>
        <p className="text-gray-600 mb-6">
          Refunds are issued within 5–10 business days to the original payment method.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Cancellation Policy</h2>
        <p className="text-gray-600 mb-4">
          You can cancel your subscription at any time. Cancellations take effect at the end of your current billing period.
        </p>
        <p className="text-gray-600">
          No refunds are provided for partial billing periods or for cancellations made after the initial 14-day guarantee period.
        </p>
      </div>
    </main>
  );
}