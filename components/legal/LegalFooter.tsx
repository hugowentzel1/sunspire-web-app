'use client';

export default function LegalFooter({ showPoweredBy = true, brand }: { showPoweredBy?: boolean; brand?: string }) {

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center">
          {/* Company Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sunspire Solar Intelligence</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Transforming solar analysis with AI-powered intelligence and white-label solutions.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p className="flex items-center justify-center">
                <span className="w-4 h-4 mr-2">📍</span>
                123 Solar Street, Sunny City, SC 12345
              </p>
              <p className="flex items-center justify-center">
                <span className="w-4 h-4 mr-2">✉️</span>
                hello@sunspire.app
              </p>
              <p className="flex items-center justify-center">
                <span className="w-4 h-4 mr-2">📞</span>
                +1 (555) 123-4567
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Quick Links</h4>
            <div className="space-y-3">
              <a href="/pricing" className="block text-gray-600 hover:text-orange-600 transition-colors duration-200">Pricing</a>
              <a href="/partners" className="block text-gray-600 hover:text-orange-600 transition-colors duration-200">Partners</a>
              <a href="/support" className="block text-gray-600 hover:text-orange-600 transition-colors duration-200">Support</a>
              <a href="/demo" className="block text-gray-600 hover:text-orange-600 transition-colors duration-200">Demo</a>
            </div>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Legal & Support</h4>
            <div className="space-y-3">
              <a href="/privacy" className="block text-gray-600 hover:text-orange-600 transition-colors duration-200">Privacy Policy</a>
              <a href="/terms" className="block text-gray-600 hover:text-orange-600 transition-colors duration-200">Terms of Service</a>
              <a href="/methodology" className="block text-gray-600 hover:text-orange-600 transition-colors duration-200">Methodology</a>
              <a href="/status" className="block text-gray-600 hover:text-orange-600 transition-colors duration-200">System Status</a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            {/* Disclaimers */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <span className="w-3 h-3 mr-2">⚡</span>
                Estimates generated using NREL PVWatts® v8
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center">
                <span className="w-3 h-3 mr-2">🗺️</span>
                Mapping & location data © Google
              </span>
            </div>

            {/* Powered By */}
            {showPoweredBy && (
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Powered by <span className="font-medium text-orange-600">Your Company</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
