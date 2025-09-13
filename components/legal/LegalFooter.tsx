'use client';

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { tid } from '@/src/lib/testids';

export default function LegalFooter({ 
  hideMarketingLinks = false, 
  showPoweredBy = true, 
  brand 
}: { 
  hideMarketingLinks?: boolean; 
  showPoweredBy?: boolean; 
  brand?: string 
}) {
  const b = useBrandTakeover();
  
  // Use passed brand prop or fall back to brand takeover
  const companyName = brand || (b.enabled && b.brand ? b.brand : 'Sunspire');
  const brandColor = b.enabled && b.primary ? b.primary : '#d97706';

  return (
    <footer className="bg-gradient-to-b from-gray-50 via-white to-gray-100 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center">
          {/* Company Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sunspire Solar Intelligence</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              {hideMarketingLinks ? 'Solar Intelligence Platform' : `Demo for ${companyName} — Powered by Sunspire`}
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <p className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                1700 Northside Drive Suite A7 #5164 Atlanta, GA 30318
              </p>
              
              {/* Compliance Badges */}
              <div className="flex items-center justify-center space-x-4 mt-4">
                <a href="/security#gdpr" className="inline-flex items-center px-3 py-1 text-white text-xs font-medium rounded-full transition-all duration-200 hover:shadow-lg" style={{ 
                  background: b.enabled && b.primary ? `linear-gradient(135deg, ${b.primary}, ${b.primary}dd)` : 'linear-gradient(135deg, #d97706, #b45309)',
                  boxShadow: b.enabled && b.primary ? `0 4px 14px ${b.primary}40` : '0 4px 14px #d9770640'
                }}>
                  GDPR
                </a>
                <a href="/security#ccpa" className="inline-flex items-center px-3 py-1 text-white text-xs font-medium rounded-full transition-all duration-200 hover:shadow-lg" style={{ 
                  background: b.enabled && b.primary ? `linear-gradient(135deg, ${b.primary}, ${b.primary}dd)` : 'linear-gradient(135deg, #d97706, #b45309)',
                  boxShadow: b.enabled && b.primary ? `0 4px 14px ${b.primary}40` : '0 4px 14px #d9770640'
                }}>
                  CCPA
                </a>
                <a href="/security#soc2" className="inline-flex items-center px-3 py-1 text-white text-xs font-medium rounded-full transition-all duration-200 hover:shadow-lg" style={{ 
                  background: b.enabled && b.primary ? `linear-gradient(135deg, ${b.primary}, ${b.primary}dd)` : 'linear-gradient(135deg, #d97706, #b45309)',
                  boxShadow: b.enabled && b.primary ? `0 4px 14px ${b.primary}40` : '0 4px 14px #d9770640'
                }}>
                  SOC 2
                </a>
              </div>
              
              <p className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href="mailto:support@getsunspire.com" className="hover:opacity-80 transition-colors">support@getsunspire.com</a>
              </p>
              <p className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href="mailto:billing@getsunspire.com" className="hover:opacity-80 transition-colors">billing@getsunspire.com</a>
              </p>
              <p className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                +1 (555) 123-4567
              </p>
            </div>
          </div>

          {/* Quick Links - Only show if not hiding marketing links */}
          {!hideMarketingLinks && (
            <div {...tid('footer-marketing-links')}>
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">Quick Links</h4>
              <div className="space-y-3">
                <a href="/pricing" className="block text-gray-600 hover:opacity-80 transition-colors duration-200" style={{ '--tw-hover-opacity': '0.8' } as React.CSSProperties}>Pricing</a>
                <a href="/partners" className="block text-gray-600 hover:opacity-80 transition-colors duration-200" style={{ '--tw-hover-opacity': '0.8' } as React.CSSProperties}>Partners</a>
                <a href="/support" className="block text-gray-600 hover:opacity-80 transition-colors duration-200" style={{ '--tw-hover-opacity': '0.8' } as React.CSSProperties}>Support</a>
                <a href="/demo" className="block text-gray-600 hover:opacity-80 transition-colors duration-200" style={{ '--tw-hover-opacity': '0.8' } as React.CSSProperties}>Demo</a>
              </div>
            </div>
          )}

          {/* Legal & Support */}
          <div {...tid('footer-legal-links')}>
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Legal & Support</h4>
            <div className="space-y-3">
              <a href="/privacy" className="block text-gray-600 hover:opacity-80 transition-colors duration-200" style={{ '--tw-hover-opacity': '0.8' } as React.CSSProperties}>Privacy Policy</a>
              <a href="/terms" className="block text-gray-600 hover:opacity-80 transition-colors duration-200" style={{ '--tw-hover-opacity': '0.8' } as React.CSSProperties}>Terms of Service</a>
              <a href="/security" className="block text-gray-600 hover:opacity-80 transition-colors duration-200" style={{ '--tw-hover-opacity': '0.8' } as React.CSSProperties}>Security</a>
              <a href="/dpa" className="block text-gray-600 hover:opacity-80 transition-colors duration-200" style={{ '--tw-hover-opacity': '0.8' } as React.CSSProperties}>DPA</a>
              <a href="/do-not-sell" className="block text-gray-600 hover:opacity-80 transition-colors duration-200" style={{ '--tw-hover-opacity': '0.8' } as React.CSSProperties}>Do Not Sell My Data</a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
            {/* NREL Disclaimer */}
            <div className="flex items-center justify-center text-sm text-gray-500">
              <svg className="w-4 h-4 ml-1 mr-2 text-gray-400 flex-shrink-0 align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span className="leading-tight">Estimates generated using NREL PVWatts® v8</span>
            </div>

            {/* Google Disclaimer */}
            <div className="flex items-center justify-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              <span className="leading-tight">Mapping & location data © Google</span>
            </div>

            {/* Powered By */}
            {showPoweredBy && (
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Powered by <span className="font-medium" style={{ color: brandColor }}>Sunspire</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
