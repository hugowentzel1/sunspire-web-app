'use client';

export default function LegalFooter({ showPoweredBy = true, brand }: { showPoweredBy?: boolean; brand?: string }) {

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <div className="space-x-2">
          <span>Estimates generated using NREL PVWatts® v8.</span>
          <span>•</span>
          <span>Mapping & location data © Google</span>
        </div>
        
        {/* Company Information */}
        <div className="text-center md:text-right">
          <p className="font-medium">Sunspire Solar Intelligence</p>
          <p className="text-xs">123 Solar Street, Sunny City, SC 12345</p>
          <p className="text-xs">hello@sunspire.app | +1 (555) 123-4567</p>
        </div>
        <div className="space-x-3">
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

    </>
  );
}
