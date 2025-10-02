"use client";

import { useState } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';

import Footer from '@/components/Footer';

export default function SupportPage() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    clients_count: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send partner application to billing@getsunspire.com
      const response = await fetch('/api/partner-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Thanks — we\'ll review and reply by email.');
        // Reset form
        setFormData({
          company: '',
          name: '',
          email: '',
          phone: '',
          clients_count: '',
          message: ''
        });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Partner application error:', error);
      alert('Something went wrong. Please try again or email billing@getsunspire.com.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const faqs = [
    {
      question: "Accuracy & data sources",
      answer: "Estimates use industry-standard models (e.g., NREL PVWatts® v8) and current utility rates where available. Not endorsed by any data provider."
    },
    {
      question: "Security & encryption",
      answer: "Data encrypted in transit & at rest. Controls aligned to SOC 2 Trust Services Criteria."
    },
    {
      question: "Cancel & refund policy",
      answer: "No long-term contracts. Cancel anytime. 14-day refund if Sunspire doesn't lift booked calls."
    },
    {
      question: "Support",
      answer: "Email support@getsunspire.com. Responses typically within 24h on business days."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a 
            href={searchParams.get('demo') ? `/?${searchParams.toString()}` : `/paid?${searchParams.toString()}`} 
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Demo Banner */}
        {searchParams.get('demo') && b.enabled && (
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl py-6 px-8 border border-gray-200/50 shadow-lg mx-auto max-w-2xl">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  Demo for {b.brand || 'Your Company'} — Powered by <a href="/status" className="hover:underline" style={{ color: b.primary }}>Sunspire</a>
                </h2>
                <p className="text-lg text-gray-600">
                  Your Logo. Your URL. Instant Solar Quotes — Live in 24 Hours
                </p>
                <button 
                  data-cta="primary"
                  onClick={() => window.location.href = `/?${searchParams.toString()}`}
                  data-cta-button
                  className="inline-flex items-center px-4 py-4 rounded-full text-sm font-medium text-white border border-transparent shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer" 
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  <span className="mr-2">⚡</span>
                  Activate on Your Domain — 24 Hours
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  No call required. $99/mo + $399 setup. 14-day refund if it doesn&apos;t lift booked calls.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Section - Compact Trust Strip */}
        <div className="text-center mb-12">
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 ring-1 ring-gray-200 px-3 py-1 text-xs font-medium">
              ✓ Live in &lt;24h
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 ring-1 ring-gray-200 px-3 py-1 text-xs font-medium">
              ✓ Bank-level security
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 ring-1 ring-gray-200 px-3 py-1 text-xs font-medium">
              ✓ 14-day refund if it doesn&apos;t lift booked calls
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - FAQ */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8" data-testid="support-faq">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${openFAQ === index ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Partner Inquiry */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Partner with Sunspire (Optional)</h2>
              <p className="text-gray-600 mb-6">
                Agencies and consultants earn a flat 30% recurring commission for active accounts they refer. Net-30 payouts.
              </p>
              
              {/* Generic Social Proof */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-600 italic">
                  &ldquo;We added predictable monthly revenue recommending Sunspire to solar clients.&rdquo; — Agency Owner
                </p>
              </div>
              
              {/* Commission Structure */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Commission Structure</h3>
                <p className="text-gray-600">30% recurring on subscription (flat).</p>
              </div>
              
              {/* Partner Form */}
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="partner-inquiry-form">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Agency Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                    placeholder="Your agency or company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                    placeholder="+1 (404) 770-2672"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many solar companies do you work with?
                  </label>
                  <select
                    name="clients_count"
                    value={formData.clients_count}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                  >
                    <option value="">Select range</option>
                    <option value="1-4">1–4</option>
                    <option value="5-19">5–19</option>
                    <option value="20+">20+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                    placeholder={`Tell us about your client base and how you'd promote ${b.enabled ? b.brand : 'Your Company'}.`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                  data-testid="partner-submit"
                >
                  Submit Partner Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Use consistent Footer component across entire demo site */}
      <Footer />
    </div>
  );
}
