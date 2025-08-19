"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PartnersPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-900">
                <span className="text-orange-500">☀️</span> Sunspire
              </a>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/enterprise" className="text-gray-600 hover:text-blue-500">Enterprise</a>
              <a href="/support" className="text-gray-600 hover:text-blue-500">Support</a>
              <a href="/" className="btn-primary">Back to Demo</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Commission Structure</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Standard Plan ($99/month)</span>
                  <span className="font-bold text-blue-600">$30/month recurring</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Setup Fee ($399)</span>
                  <span className="font-bold text-blue-600">$120 one-time</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Enterprise Deals</span>
                  <span className="font-bold text-blue-600">Custom rates</span>
                </div>
              </div>
            </div>

            {/* Partner Benefits */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Partner Benefits</h3>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">💰</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Recurring Revenue</h4>
                  <p className="text-gray-600">30% commission on all recurring payments, paid monthly</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">🎯</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Marketing Support</h4>
                  <p className="text-gray-600">Sales materials, case studies, and co-marketing opportunities</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">🏷️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">White-Label Options</h4>
                  <p className="text-gray-600">Resell under your own brand with custom pricing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">📈</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Partner Portal</h4>
                  <p className="text-gray-600">Track commissions, leads, and performance in real-time</p>
                </div>
              </div>
            </div>

            {/* Success Story */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Partner Success Story</h4>
              <p className="text-gray-600 italic mb-3">
                "We've generated over $15,000 in recurring revenue in just 6 months by 
                recommending Sunspire to our solar clients. The commission payments are 
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about your client base and how you'd promote Sunspire..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
    </div>
  );
}
