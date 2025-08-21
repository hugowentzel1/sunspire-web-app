"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { IconBadge } from '@/components/ui/IconBadge';

import LegalFooter from '@/components/legal/LegalFooter';

export default function PartnersPage() {
  const b = useBrandTakeover();
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
            Partner with {b.enabled ? b.brand : 'Your Company'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our growing network of agencies, consultants, and resellers. 
            Earn 30% recurring commission while helping solar companies grow.
          </p>
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

            {/* Partner Benefits */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Partner Benefits</h3>
              
              <div className="flex items-start space-x-4">
                <IconBadge>
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.196v-.235c0-.305.211-.508.5-.508.305 0 .5.203.5.508v.235c.22 0 .418.103.573.196.155.093.3.228.3.39 0 .164-.145.3-.3.39-.155.092-.353.185-.573.185v.235c0 .305-.195.508-.5.508-.289 0-.5-.203-.5-.508v-.235c-.22 0-.418-.103-.573-.185-.155-.09-.3-.226-.3-.39 0-.162.145-.297.3-.39z"/>
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"/>
                  </svg>
                </IconBadge>
                <div>
                  <h4 className="font-semibold text-gray-900">Recurring Revenue</h4>
                  <p className="text-gray-500">30% commission on all recurring payments, paid monthly</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <IconBadge>
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </IconBadge>
                <div>
                  <h4 className="font-semibold text-gray-900">Marketing Support</h4>
                  <p className="text-gray-500">Sales materials, case studies, and co-marketing opportunities</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <IconBadge>
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </IconBadge>
                <div>
                  <h4 className="font-semibold text-gray-900">White-Label Options</h4>
                  <p className="text-gray-500">Resell under your own brand with custom pricing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <IconBadge>
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
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
