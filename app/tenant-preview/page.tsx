'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TenantProvider, useTenant } from '@/components/TenantProvider';
import LegalFooter from '@/components/legal/LegalFooter';

function TenantPreviewContent() {
  const { tenant, loading } = useTenant();
  const [selectedTenant, setSelectedTenant] = useState('default');

  const tenants = [
    { slug: 'default', name: 'Sunspire', description: 'Premium Solar Intelligence' },
    { slug: 'acme', name: 'ACME Solar', description: 'Your Trusted Solar Partner' },
  ];

  const handleTenantChange = (slug: string) => {
    setSelectedTenant(slug);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tenant', slug);
    window.history.pushState({}, '', url.toString());
    // Force re-render by reloading the page
    window.location.reload();
  };

  if (loading || !tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-700">Loading tenant configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white font-bold text-lg">🎨</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  White-Label Preview
                </h1>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                  Tenant Configuration Demo
                </p>
              </div>
            </div>

            <motion.button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to App
            </motion.button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Tenant Selector */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Choose Your Brand
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tenants.map((t) => (
                <motion.button
                  key={t.slug}
                  onClick={() => handleTenantChange(t.slug)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedTenant === t.slug
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                      t.slug === 'default' 
                        ? 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-500' 
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      <span className="text-white font-bold text-xl">
                        {t.slug === 'default' ? '☀️' : '⚡'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{t.name}</h3>
                      <p className="text-gray-600">{t.description}</p>
                    </div>
                    {selectedTenant === t.slug && (
                      <div className="flex items-center justify-center space-x-2 text-orange-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Active</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Current Tenant Display */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Current Configuration: {tenant.name}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Brand Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Brand Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Company Name</label>
                    <p className="text-lg font-semibold text-gray-900">{tenant.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Tagline</label>
                    <p className="text-lg font-semibold text-gray-900">{tenant.tagline}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Contact Email</label>
                    <p className="text-lg font-semibold text-gray-900">{tenant.contact.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-lg font-semibold text-gray-900">{tenant.contact.phone}</p>
                  </div>
                </div>
              </div>

              {/* Color Scheme */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Color Scheme</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Primary</label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg border border-gray-300"
                        style={{ backgroundColor: tenant.colors.primary }}
                      ></div>
                      <span className="text-sm font-mono">{tenant.colors.primary}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Secondary</label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg border border-gray-300"
                        style={{ backgroundColor: tenant.colors.secondary }}
                      ></div>
                      <span className="text-sm font-mono">{tenant.colors.secondary}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Accent</label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg border border-gray-300"
                        style={{ backgroundColor: tenant.colors.accent }}
                      ></div>
                      <span className="text-sm font-mono">{tenant.colors.accent}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Success</label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg border border-gray-300"
                        style={{ backgroundColor: tenant.colors.success }}
                      ></div>
                      <span className="text-sm font-mono">{tenant.colors.success}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trust Badges</h3>
              <div className="flex flex-wrap gap-3">
                {tenant.trustBadges.map((badge, index) => (
                  <div key={index} className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Testimonials</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tenant.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role} • {testimonial.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">How to Use White-Label</h3>
            <div className="space-y-4 text-blue-800">
              <p>• <strong>URL Parameter:</strong> Add <code className="bg-blue-100 px-2 py-1 rounded">?tenant=acme</code> to any page</p>
              <p>• <strong>Domain Detection:</strong> Configure custom domains to automatically load specific tenant configs</p>
              <p>• <strong>Customization:</strong> Edit <code className="bg-blue-100 px-2 py-1 rounded">public/tenants/[slug].json</code> files</p>
              <p>• <strong>CSS Variables:</strong> Colors automatically apply via CSS custom properties</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Legal Footer */}
      <LegalFooter />
    </div>
  );
}

export default function TenantPreviewPage() {
  return (
    <TenantProvider>
      <TenantPreviewContent />
    </TenantProvider>
  );
}
