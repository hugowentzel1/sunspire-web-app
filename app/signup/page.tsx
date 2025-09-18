'use client';

import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import LegalFooter from '@/components/legal/LegalFooter';

export default function SignupPage() {
  const searchParams = useSearchParams();
  return (
    <>
      <Head>
        <title>Sign Up | Sunspire</title>
        <meta name="description" content="Sign up for Sunspire Solar Intelligence." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Get Started with Sunspire
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Activate your white-label solar intelligence tool in 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <form className="space-y-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Selection
                </label>
                <select
                  id="plan"
                  name="plan"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                >
                  <option value="">Select a plan</option>
                  <option value="starter">Starter - $99/month</option>
                  <option value="professional">Professional - $199/month</option>
                  <option value="enterprise">Enterprise - Custom pricing</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-[var(--brand-primary)] text-white font-semibold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                Activate on Your Domain — 24 Hours
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                No call required. $99/mo + $399 setup. 14-day refund if it doesn&apos;t lift booked calls.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter 
          brand={searchParams.get('company') || undefined} 
          hideMarketingLinks={!searchParams.get('demo')}
        />
      </footer>
    </>
  );
}
