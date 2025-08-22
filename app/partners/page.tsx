"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { useCompany } from '@/components/CompanyContext';
import { IconBadge } from '@/components/ui/IconBadge';

import LegalFooter from '@/components/legal/LegalFooter';

export default function PartnersPage() {
  const b = useBrandTakeover();
  const { company } = useCompany();
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    type: '',
    experience: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track partner application
    console.log('Partner application submitted:', formData);
    
    // In production, send to your CRM/Airtable
    alert('Thank you! Our partner team will review your application and contact you within 48 hours.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <a 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Partner with Sunspire
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our growing network of agencies, consultants, and resellers. 
            Earn 30% recurring commission while helping solar companies grow.
          </p>
          
          {/* Eligibility and Payout Terms */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <p className="text-sm text-blue-800">
                <strong>Eligibility:</strong> Agencies with ≥5 solar clients • 
                <strong>Payout:</strong> 30% recurring, Net-30, 30-day cookie
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Benefits */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Commission Structure */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Commission Structure</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Standard Plan ($99/month)</span>
                  <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>$30/month recurring</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Setup Fee ($399)</span>
                  <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>$120 one-time</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Enterprise Deals</span>
                  <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>Custom rates</span>
                </div>
              </div>
            </div>

            {/* Partner Benefits */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Partner Benefits</h3>
              
              <div className="flex items-start space-x-4">
                <IconBadge>
                  <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </IconBadge>
                <div>
                  <h4 className="font-semibold text-gray-900">Recurring Revenue</h4>
                  <p className="text-gray-500">30% commission on all recurring payments, paid monthly</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <IconBadge>
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                </IconBadge>
                <div>
                  <h4 className="font-semibold text-gray-900">Marketing Support</h4>
                  <p className="text-gray-500">Sales materials, case studies, and co-marketing opportunities</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <IconBadge>
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </IconBadge>
                <div>
                  <h4 className="font-semibold text-gray-900">White-Label Options</h4>
                  <p className="text-gray-500">Resell under your own brand with custom pricing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <IconBadge>
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </IconBadge>
                <div>
                  <h4 className="font-semibold text-gray-900">Partner Portal</h4>
                  <p className="text-gray-500">Track commissions, leads, and performance in real-time</p>
                </div>
              </div>
            </div>

            {/* Success Story */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Partner Success Story</h4>
              <p className="text-gray-600 italic mb-3">
                "We've generated over $15,000 in recurring revenue in just 6 months by 
                recommending {b.enabled ? b.brand : 'Your Company'} to our solar clients. The commission payments are 
                reliable and the product sells itself."
              </p>
              <p className="text-sm text-gray-500">— Sarah Chen, Digital Marketing Agency</p>
            </div>
          </motion.div>

          {/* Right Column - Application Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply to Become a Partner</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner Type
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                >
                  <option value="">Select type</option>
                  <option value="agency">Marketing Agency</option>
                  <option value="consultant">Business Consultant</option>
                  <option value="reseller">Software Reseller</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience with Solar Industry
                </label>
                <select
                  name="experience"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                >
                  <option value="">Select experience</option>
                  <option value="none">New to solar</option>
                  <option value="some">Some experience</option>
                  <option value="experienced">Very experienced</option>
                  <option value="expert">Industry expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many solar companies do you work with?
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                  placeholder="Tell us about your client base and how you'd promote {b.enabled ? b.brand : 'Your Company'}..."
                />
              </div>

              <button
                type="submit"
                className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Submit Partner Application
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Applications are typically reviewed within 48 hours
            </p>
          </motion.div>
        </div>
      </main>

      <LegalFooter brand={b.enabled ? b.brand : undefined} />
    </div>
  );
}
