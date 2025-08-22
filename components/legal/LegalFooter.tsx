'use client';

export default function LegalFooter({ showPoweredBy = true, brand }: { showPoweredBy?: boolean; brand?: string }) {

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-600">
          {/* Disclaimers */}
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <span>Estimates generated using NREL PVWatts® v8.</span>
            <span>•</span>
            <span>Mapping & location data © Google</span>
          </div>
          
          {/* Company Information */}
          <div className="text-center md:text-right">
            <p className="font-medium text-gray-900">Sunspire Solar Intelligence</p>
            <p className="text-xs text-gray-500">123 Solar Street, Sunny City, SC 12345</p>
            <p className="text-xs text-gray-500">hello@sunspire.app | +1 (555) 123-4567</p>
          </div>
          
          {/* Legal Links */}
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end">
            <a className="underline hover:text-gray-800 transition-colors" href="/terms">Terms</a>
            <a className="underline hover:text-gray-800 transition-colors" href="/privacy">Privacy</a>
            <a className="underline hover:text-gray-800 transition-colors" href="/methodology">Methodology</a>
            <a className="underline hover:text-gray-800 transition-colors" href="/status">Status</a>
            <a className="underline hover:text-gray-800 transition-colors" href="/preferences">Preferences</a>
            {showPoweredBy && (
              <>
                <span>•</span>
                <span>Powered by Your Company</span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
