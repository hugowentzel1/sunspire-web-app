import Head from 'next/head';
import LegalFooter from '@/components/legal/LegalFooter';

export default function DoNotSellPage() {
  return (
    <>
      <Head>
        <title>Do Not Sell My Data | Sunspire</title>
        <meta name="description" content="Exercise your right to opt-out of data sales under CCPA." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Do Not Sell My Data
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Exercise your California Consumer Privacy Act (CCPA) rights
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8">
            
            {/* CCPA Rights */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your CCPA Rights</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Right to Know:</strong> You have the right to know what personal information we collect, use, and share about you.</p>
                <p><strong>Right to Delete:</strong> You have the right to request deletion of your personal information.</p>
                <p><strong>Right to Opt-Out:</strong> You have the right to opt-out of the sale of your personal information.</p>
                <p><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</p>
              </div>
            </div>

            {/* Opt-Out Form */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Opt-Out of Data Sales</h2>
              <p className="text-gray-600 mb-6">
                To opt-out of the sale of your personal information, please provide your email address below:
              </p>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[var(--brand-primary)] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Opt-Out of Data Sales
                </button>
              </form>
              
              <p className="text-sm text-gray-500 mt-4">
                We will process your request within 45 days and send you a confirmation email.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have any questions about your CCPA rights or this opt-out process, please contact us:</p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:privacy@sunspire.app" className="text-[var(--brand-primary)] hover:underline">privacy@sunspire.app</a></p>
                  <p><strong>Data Protection Officer:</strong> <a href="mailto:security@sunspire.app" className="text-[var(--brand-primary)] hover:underline">security@sunspire.app</a></p>
                  <p><strong>Address:</strong> Sunspire, 123 Main Street, San Francisco, CA 94105</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Verification:</strong> We may need to verify your identity before processing your request. This helps protect your privacy and security.</p>
                <p><strong>Authorized Agents:</strong> You may designate an authorized agent to make requests on your behalf. The agent must provide proof of authorization.</p>
                <p><strong>Household Requests:</strong> If you are making a request on behalf of your household, we may need additional verification.</p>
                <p><strong>Updates:</strong> We will update this page as our data practices change. Please check back periodically.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter />
      </footer>
    </>
  );
}
