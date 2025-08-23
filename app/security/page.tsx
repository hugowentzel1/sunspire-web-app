import Head from 'next/head';
import LegalFooter from '@/components/legal/LegalFooter';

export default function SecurityPage() {
  return (
    <>
      <Head>
        <title>Security & Compliance | Sunspire</title>
        <meta name="description" content="Sunspire's security posture, SOC 2 readiness, GDPR/CCPA compliance, and data protection measures." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Security & Compliance
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Enterprise-grade security with SOC 2 readiness, GDPR/CCPA compliance, and bank-level encryption
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-12">
            
            {/* Encryption Section */}
            <div
              id="encryption"
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Encryption</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>TLS 1.2+ in Transit:</strong> All data transmitted between your browser and our servers is encrypted using industry-standard TLS protocols.</p>
                <p><strong>AES-256 at Rest:</strong> Customer data stored in our databases is encrypted using AES-256 encryption, the same standard used by banks and government agencies.</p>
                <p><strong>Key Management:</strong> Encryption keys are managed securely and rotated regularly to maintain the highest level of protection.</p>
              </div>
            </div>

            {/* SOC 2 Section */}
            <div
              id="soc2"
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">SOC 2 Readiness</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>Type II Compliance:</strong> Our systems and processes are designed to meet SOC 2 Type II requirements, ensuring consistent security controls.</p>
                <p><strong>Regular Audits:</strong> We undergo regular security assessments and penetration testing to maintain our security posture.</p>
                <p><strong>Control Framework:</strong> Comprehensive security controls covering access management, change management, and incident response.</p>
              </div>
            </div>

            {/* GDPR Section */}
            <div
              id="gdpr"
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">GDPR Adherence</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>Data Subject Rights:</strong> Full support for GDPR data subject rights including access, rectification, erasure, and portability.</p>
                <p><strong>Lawful Basis:</strong> Clear legal basis for data processing with explicit consent mechanisms.</p>
                <p><strong>Data Minimization:</strong> We only collect and process data that is necessary for providing our services.</p>
                <p><strong>Cross-Border Transfers:</strong> Adequate safeguards for international data transfers in compliance with GDPR requirements.</p>
              </div>
            </div>

            {/* CCPA Section */}
            <div
              id="ccpa"
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 016.001 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">CCPA Adherence</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>California Consumer Rights:</strong> Full support for CCPA consumer rights including disclosure, deletion, and opt-out of data sales.</p>
                <p><strong>Do Not Sell My Data:</strong> Clear mechanisms for consumers to opt-out of data sales and sharing.</p>
                <p><strong>Transparency:</strong> Comprehensive privacy notices and data processing disclosures.</p>
                <p><strong>Verification:</strong> Secure processes for verifying consumer identity when processing rights requests.</p>
              </div>
            </div>

            {/* Breach Procedures Section */}
            <div
              id="breach"
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Breach Procedures</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>72-Hour Notification:</strong> We commit to notifying affected individuals and relevant authorities within 72 hours of discovering a data breach, where required by law.</p>
                <p><strong>Incident Response:</strong> Comprehensive incident response plan with dedicated security team and escalation procedures.</p>
                <p><strong>Forensic Analysis:</strong> Immediate forensic analysis to determine the scope and impact of any security incident.</p>
                <p><strong>Customer Communication:</strong> Transparent communication with customers about any security incidents and remediation steps.</p>
              </div>
            </div>

            {/* DPO Contact Section */}
            <div
              id="dpo"
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Data Protection Officer</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>Contact:</strong> <a href="mailto:security@sunspire.app" className="text-[var(--brand-primary)] hover:underline font-medium">security@sunspire.app</a></p>
                <p><strong>Responsibilities:</strong> Overseeing data protection strategy, ensuring compliance with privacy regulations, and serving as the primary contact for privacy-related inquiries.</p>
                <p><strong>Response Time:</strong> We aim to respond to all privacy and security inquiries within 24 hours during business days.</p>
                <p><strong>Expertise:</strong> Our DPO has extensive experience in data protection law and privacy compliance across multiple jurisdictions.</p>
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
