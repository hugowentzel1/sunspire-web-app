"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

import LegalFooter from '@/components/legal/LegalFooter';

export default function SupportPage() {
  const b = useBrandTakeover();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    priority: '',
    category: '',
    subject: '',
    message: ''
  });

  const [showChat, setShowChat] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track support request
    console.log('Support request submitted:', formData);
    
    // In production, send to your support system
    alert('Support ticket created! We\'ll respond within 24 hours (or 2 hours for priority tickets).');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const faqs = [
    {
      question: "How accurate are the solar estimates?",
      answer: "Our estimates use NREL PVWatts v8, EIA electricity rates, and local solar irradiance data. Accuracy is typically ±10-15%, comparable to professional site surveys."
    },
    {
      question: "How quickly can I get the tool live on my website?",
      answer: "Standard setup takes 24-48 hours. Enterprise clients get priority setup within 12 hours."
    },
    {
      question: "Can I customize the branding and colors?",
      answer: "Yes! All plans include full white-label customization with your colors, logo, and domain."
    },
    {
      question: "Do you integrate with CRM systems?",
      answer: "Yes, we integrate with most major CRMs including Salesforce, HubSpot, and Pipedrive. Custom integrations available for enterprise clients."
    },
    {
      question: "What if the tool doesn't increase my conversions?",
      answer: "We offer a 14-day money-back guarantee. If you don't see increased booked calls, you get a full refund."
    },
    {
      question: "Is there a setup fee?",
      answer: "Standard plans include a $399 setup fee. Enterprise plans have custom setup pricing based on requirements."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Support Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get help with setup, integration, and optimization. Our team responds to all 
            tickets within 24 hours (2 hours for priority support).
          </p>
        </motion.div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Get instant help from our support team</p>
            <button 
              onClick={() => setShowChat(true)}
              className="px-4 py-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              Start Chat
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Send us a detailed message</p>
            <a 
              href="mailto:support@sunspire.app"
              className="px-4 py-2 rounded-lg text-white transition-colors inline-block"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              Email Us
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.1 }}>
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Priority Support</h3>
            <p className="text-gray-600 mb-4">Enterprise clients get phone support</p>
            <a 
              href="/pricing"
              className="px-4 py-2 rounded-lg text-white transition-colors inline-block"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              Upgrade
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - FAQ */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Resources */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Helpful Resources</h3>
              <div className="space-y-3">
                <a href="/methodology" className="block hover:text-opacity-80 transition-colors" style={{ color: 'var(--brand-primary)' }}>
                  📊 Calculation Methodology
                </a>
                <a href="/pricing" className="block hover:text-opacity-80 transition-colors" style={{ color: 'var(--brand-primary)' }}>
                  🏢 Enterprise Features
                </a>
                <a href="/partners" className="block hover:text-opacity-80 transition-colors" style={{ color: 'var(--brand-primary)' }}>
                  🤝 Partner Program
                </a>
                <a href="mailto:setup@sunspire.app" className="block hover:text-opacity-80 transition-colors" style={{ color: 'var(--brand-primary)' }}>
                  ⚡ Setup Assistance
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Support Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Support Ticket</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                    placeholder="Your name"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                  placeholder="Your company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    required
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low - General question</option>
                    <option value="normal">Normal - Need help</option>
                    <option value="high">High - System issue</option>
                    <option value="urgent">Urgent - Site down</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                  >
                    <option value="">Select category</option>
                    <option value="setup">Setup & Installation</option>
                    <option value="integration">CRM Integration</option>
                    <option value="customization">Branding & Customization</option>
                    <option value="billing">Billing & Account</option>
                    <option value="technical">Technical Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': 'var(--brand-primary)' } as React.CSSProperties}
                  placeholder="Please provide as much detail as possible..."
                />
              </div>

              <button
                type="submit"
                className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Create Support Ticket
              </button>
            </form>

            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.05 }}>
              <h4 className="font-semibold text-gray-900 mb-2">Response Times</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Standard: 24 hours</li>
                <li>• High Priority: 4 hours</li>
                <li>• Urgent: 1 hour</li>
                <li>• Enterprise: 2 hours guaranteed</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Chat Widget Simulation */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="text-white p-4 rounded-t-lg flex justify-between items-center" style={{ backgroundColor: 'var(--brand-primary)' }}>
            <h4 className="font-semibold">Live Support</h4>
            <button 
              onClick={() => setShowChat(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-4">
              Hi! I'm here to help. What can I assist you with today?
            </p>
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button className="px-4 py-2 rounded-lg text-sm text-white transition-colors" style={{ backgroundColor: 'var(--brand-primary)' }}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <LegalFooter brand={b.enabled ? b.brand : undefined} />
    </div>
  );
}
