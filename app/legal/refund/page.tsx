export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Refund Policy</h1>
      <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Setup-Fee Refund Guarantee</h2>
              <p className="text-gray-600 mb-4">
                We stand by our promise that your branded Sunspire site will be live on your domain within 24 hours of purchase. If your site is not live within that time, the one-time setup fee is refundable. To request a setup-fee refund, contact <a href="mailto:support@getsunspire.com" className="text-[var(--brand-primary)] hover:underline">support@getsunspire.com</a> within 7 days of purchase and include your order details.
              </p>
              <p className="text-gray-600 mb-6">
                Refunds are processed to the original payment method within 5–10 business days. Subscription fees are cancel-anytime and non-refundable, except as required by law. Refunds are not available for abuse, fraud, or violations of our Terms of Service.
              </p>
      </div>
    </main>
  );
}