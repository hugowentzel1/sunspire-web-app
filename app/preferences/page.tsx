"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

export default function PreferencesPage() {
  const b = useBrandTakeover();
  const [preferences, setPreferences] = useState({
    marketing: true,
    productUpdates: true,
    transactional: true // Always locked
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggle = (key: 'marketing' | 'productUpdates') => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    
    try {
      // In production, this would call an API to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setMessage('Preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Email Preferences</h1>
          <p className="text-xl text-gray-600">
            Manage your email communication preferences
          </p>
        </motion.div>

        {/* Preferences Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="space-y-6">
            {/* Marketing Emails */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Marketing Communications</h3>
                <p className="text-sm text-gray-600">Product updates, special offers, and industry news</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => handleToggle('marketing')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Product Updates */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Product Updates</h3>
                <p className="text-sm text-gray-600">New features, improvements, and announcements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.productUpdates}
                  onChange={() => handleToggle('productUpdates')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Transactional Emails - Always On */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <h3 className="font-semibold text-gray-900">Transactional Emails</h3>
                <p className="text-sm text-gray-600">Billing, support, and account-related communications</p>
              </div>
              <div className="flex items-center">
                <div className="w-11 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-gray-500">Always On</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
            
            {message && (
              <p className={`mt-4 text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>

          {/* Additional Options */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Additional Options</h3>
            <div className="space-y-3">
              <a 
                href={`/unsubscribe?token=${Math.random().toString(36).substr(2, 9)}`}
                className="block text-blue-600 hover:text-blue-800 transition-colors"
              >
                Unsubscribe from all marketing emails
              </a>
              <a 
                href="mailto:support@sunspire.app?subject=Email%20Preferences%20Help"
                className="block text-blue-600 hover:text-blue-800 transition-colors"
              >
                Contact support for help
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
