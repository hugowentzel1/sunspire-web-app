'use client';

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

export default function Footer() {
  const b = useBrandTakeover();
  const brand = b.brand || 'Apple';

  return (
    <footer className="bg-gray-50 py-12" data-testid="footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content in rounded card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Column 1: Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Sunspire Solar Intelligence</h3>
              <p className="text-sm text-gray-600">Demo for {brand} — Powered by Sunspire</p>
              
              {/* Address with emoji */}
              <div className="flex items-start space-x-2">
                <span className="text-gray-500 mt-0.5">📍</span>
                <span className="text-sm text-gray-600">1700 Northside Drive Suite A7 #5164 Atlanta, GA 30318</span>
              </div>
              
              {/* Compliance chips */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">GDPR</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">CCPA</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">SOC 2</span>
              </div>
              
              {/* Email addresses with emoji */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">✉️</span>
                  <span className="text-sm text-gray-600">support@getsunspire.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">✉️</span>
                  <span className="text-sm text-gray-600">billing@getsunspire.com</span>
                </div>
              </div>
              
              {/* Phone with emoji */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">☎️</span>
                <span className="text-sm text-gray-600">+1 (404) 123-4567</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/pricing" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Pricing</a>
                <a href="/partners" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Partners</a>
                <a href="/support" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Support</a>
              </div>
            </div>

            {/* Column 3: Legal & Support */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Legal & Support</h3>
              <div className="space-y-2">
                <a href="/privacy" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Privacy Policy</a>
                <a href="/terms" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Terms of Service</a>
                <a href="/security" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Security</a>
                <a href="/dpa" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">DPA</a>
                <a href="/do-not-sell" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Do Not Sell My Data</a>
              </div>
            </div>
          </div>

          {/* Hairline divider */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-12 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>Estimates generated using NREL PVWatts® v8</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🗺️</span>
                  <span>Mapping & location data © Google</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Powered by <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Sunspire</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
