'use client';

export default function LegalFooter({ showPoweredBy = true, brand }: { showPoweredBy?: boolean; brand?: string }) {

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section - Company Info & Legal Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Information - Left */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Sunspire Solar Intelligence</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>123 Solar Street, Sunny City, SC 12345</p>
              <p>hello@sunspire.app</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>

          {/* Legal Links - Center */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
            <div className="space-y-2 text-sm">
              <a className="block text-gray-600 hover:text-gray-900 transition-colors" href="/privacy">Privacy Policy</a>
              <a className="block text-gray-600 hover:text-gray-900 transition-colors" href="/terms">Terms of Service</a>
              <a className="block text-gray-600 hover:text-gray-900 transition-colors" href="/dpa">Data Processing Agreement</a>
              <a className="block text-gray-600 hover:text-gray-900 transition-colors" href="/methodology">Calculation Methodology</a>
            </div>
          </div>

          {/* Support & Resources - Right */}
          <div className="text-center md:text-right">
            <h3 className="font-semibold text-gray-900 mb-3">Support & Resources</h3>
            <div className="space-y-2 text-sm">
              <a className="block text-gray-600 hover:text-gray-900 transition-colors" href="/support">Support Center</a>
              <a className="block text-gray-600 hover:text-gray-900 transition-colors" href="/status">System Status</a>
              <a className="block text-gray-600 hover:text-gray-900 transition-colors" href="/preferences">Email Preferences</a>
              <a className="block text-gray-600 hover:text-gray-900 transition-colors" href="/partners">Partner Program</a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Disclaimers & Powered By */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            {/* Disclaimers */}
            <div className="text-center md:text-left space-y-2">
              <p>Estimates generated using NREL PVWatts® v8.</p>
              <p>Mapping & location data © Google</p>
            </div>

            {/* Powered By */}
            {showPoweredBy && (
              <div className="text-center md:text-right">
                <p className="text-gray-600">Powered by Your Company</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
