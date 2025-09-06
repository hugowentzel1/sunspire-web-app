"use client";

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import LegalFooter from '@/components/legal/LegalFooter';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> September 2025
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                Sunspire (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our solar intelligence platform.
              </p>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, submit a solar analysis request, or contact our support team. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Name and contact information</li>
                <li>Property address and details</li>
                <li>Company information</li>
                <li>Payment information</li>
              </ul>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Provide and maintain our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Improve our services and develop new features</li>
              </ul>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
              </p>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to access, correct, or delete your personal information. You may also opt out of certain communications from us.
              </p>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Marketing emails: legal bases & your rights</h2>
              <p className="text-gray-600 mb-4"><strong>US (CAN-SPAM):</strong> We identify Sunspire Software, include our postal address, and provide an unsubscribe that works.</p>
              <p className="text-gray-600 mb-4"><strong>Canada (CASL):</strong> Our emails include our identity, mailing address, and a functional unsubscribe. We honor unsubscribes within 10 business days (typically immediately).</p>
              <p className="text-gray-600 mb-4"><strong>EU/UK (GDPR & ePrivacy):</strong> For B2B outreach we rely on <em>Legitimate interests</em> to contact relevant business recipients. You can object to marketing at any time via the unsubscribe link or by emailing <a href="mailto:support@getsunspire.com" className="text-blue-600 hover:underline">support@getsunspire.com</a>.</p>
              <p className="text-gray-600 mb-4"><strong>Your EU/UK rights:</strong> access, rectification, erasure, restriction, portability, and <em>objection to direct marketing</em>. To exercise these rights, email <a href="mailto:support@getsunspire.com" className="text-blue-600 hover:underline">support@getsunspire.com</a>. You may also contact your local data protection authority.</p>
              <p className="text-gray-600 mb-4">We maintain a suppression list to ensure we do not email you again after you unsubscribe.</p>
            </section>
              
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Support:</strong> <a href="mailto:support@getsunspire.com" className="text-blue-600 hover:underline">support@getsunspire.com</a><br/>
                  <strong>Billing:</strong> <a href="mailto:billing@getsunspire.com" className="text-blue-600 hover:underline">billing@getsunspire.com</a><br/>
                  <strong>Address:</strong> 3133 Maple Dr Ne Ste 240 #1156 Atlanta, GA 30305
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
