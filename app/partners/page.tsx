"use client";

import { useState } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useSearchParams } from 'next/navigation';
import { useCompany } from '@/components/CompanyContext';
import { IconBadge } from '@/components/ui/IconBadge';

import Footer from '@/components/Footer';

export default function PartnersPage() {
  const b = useBrandTakeover();
  const searchParams = useSearchParams();
  const { company } = useCompany();
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    experience: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send partner application to support@getsunspire.com
      const response = await fetch('/api/partner-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Thank you! Our partner team will review your application and contact you within 48 hours.');
        // Reset form
        setFormData({
          company: '',
          name: '',
          email: '',
          phone: '',
          experience: '',
          message: ''
        });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Partner application error:', error);
      alert('Something went wrong. Please try again or email support@getsunspire.com directly.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-16 sm:py-8">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a 
            href={searchParams?.get('demo') ? `/?${searchParams?.toString()}` : `/paid?${searchParams?.toString()}`} 
            className="inline-flex items-center text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>

        {/* Demo Banner */}
        {searchParams?.get('demo') && b.enabled && (
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl py-6 px-8 border border-gray-200/50 shadow-lg mx-auto max-w-2xl">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  Demo for {b.brand || 'Your Company'} — Powered by <span style={{ color: b.primary }}>Sunspire</span>
                </h2>
                <p className="text-lg text-gray-600">
                  Your Logo. Your URL. Instant Solar Quotes — Live in 24 Hours
                </p>
                <button 
                  data-cta="primary"
                  onClick={() => window.location.href = `/?${searchParams?.toString()}`}
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

        {/* Hero Section */}
        <div className="text-center space-y-3 py-12">
          <h1 className="text-4xl font-bold text-neutral-900">
            Partner with Sunspire
          </h1>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
            Join our growing network of agencies, consultants, and resellers. 
            Earn 30% recurring commission while helping solar companies grow.
          </p>
          
          {/* Short summary line */}
          <p className="mt-2 text-gray-600 text-center max-w-3xl mx-auto">
            $99/mo + $399 setup. 14-day refund if it doesn't lift booked calls. Live in 24h.
          </p>
        </div>

        {/* Eligibility and Payout Terms - Balanced spacing */}
        <section className="py-16 md:py-12 sm:py-8">
          <div className="max-w-6xl mx-auto px-6 sm:px-4">
            <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-sm p-6 md:p-6 sm:p-5">
              <h3 className="text-lg font-semibold mb-4">Commission Structure</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Standard Plan ($99/month)</span>
                  <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>$30/month recurring</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Setup Fee ($399)</span>
                  <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>$120 one-time</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Enterprise Deals</span>
                  <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>Custom rates</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Apply to Become a Partner - Balanced spacing */}
        <section className="py-16 md:py-12 sm:py-8">
          <div className="max-w-6xl mx-auto px-6 sm:px-4">
            <div className="grid grid-cols-[1fr_1.1fr] gap-8 md:grid-cols-1 md:gap-6">
              {/* Left Column - Partner Benefits */}
              <div className="space-y-6">
                {/* Partner Benefits */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Partner Benefits</h3>
              
                  <div className="flex items-center gap-3">
                    <IconBadge>
                      <svg className="w-8 h-8 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      </svg>
                    </IconBadge>
                    <div>
                      <h4 className="font-semibold text-neutral-900">Recurring Revenue</h4>
                      <p className="text-neutral-500">30% commission on all recurring payments, paid monthly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <IconBadge>
                      <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                      </svg>
                    </IconBadge>
                    <div>
                      <h4 className="font-semibold text-neutral-900">Marketing Support</h4>
                      <p className="text-neutral-500">Sales materials, case studies, and co-marketing opportunities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <IconBadge>
                      <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                      </svg>
                    </IconBadge>
                    <div>
                      <h4 className="font-semibold text-neutral-900">White-Label Options</h4>
                      <p className="text-neutral-500">Resell under your own brand with custom pricing</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <IconBadge>
                      <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </IconBadge>
                    <div>
                      <h4 className="font-semibold text-neutral-900">Partner Portal</h4>
                      <p className="text-neutral-500">Track commissions, leads, and performance in real-time</p>
                    </div>
                  </div>
                </div>

                {/* Success Story */}
                <div className="bg-neutral-50 rounded-xl border border-neutral-200/60 shadow-sm p-6">
                  <h4 className="font-semibold text-neutral-900 mb-2">Success Story</h4>
                  <p className="text-neutral-600 italic mb-3">
                    &ldquo;We&apos;ve generated over $15,000 in recurring revenue in just 6 months by 
                    recommending {b.enabled ? b.brand : 'Your Company'} to our solar clients. The commission payments are
                    reliable and the product sells itself.&rdquo;
                  </p>
                  <p className="text-sm text-neutral-500">— Sarah Chen, Digital Marketing Agency</p>
                </div>
              </div>

              {/* Right Column - Application Form */}
              <div className="rounded-xl border border-neutral-200/60 shadow-sm p-6 space-y-4">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Apply to Become a Partner</h2>
            
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Company/Agency Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                      placeholder="Your agency or company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                      placeholder="+1 (404) 770-2672"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      How many solar companies do you work with?
                    </label>
                    <select
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                    >
                      <option value="">Select range</option>
                      <option value="1-4">1–4</option>
                      <option value="5-19">5–19</option>
                      <option value="20+">20+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                      placeholder="Tell us about your client base and how you'd promote Sunspire..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors mt-6"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    Submit Partner Application
                  </button>
                </form>

                <p className="text-xs text-neutral-500 mt-2 text-center">
                  Applications are typically reviewed within 48 hours
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Use consistent Footer component across entire demo site */}
      <Footer />
    </div>
  );
}
