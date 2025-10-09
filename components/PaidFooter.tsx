'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

// Helper to get default logo URL from Clearbit
const getDefaultLogo = (brand: string) => {
  const brandLower = brand.toLowerCase();
  
  if (brandLower.includes('google')) return 'https://logo.clearbit.com/google.com';
  if (brandLower.includes('microsoft')) return 'https://logo.clearbit.com/microsoft.com';
  if (brandLower.includes('apple')) return 'https://logo.clearbit.com/apple.com';
  if (brandLower.includes('amazon')) return 'https://logo.clearbit.com/amazon.com';
  if (brandLower.includes('meta') || brandLower.includes('facebook')) return 'https://logo.clearbit.com/facebook.com';
  if (brandLower.includes('netflix')) return 'https://logo.clearbit.com/netflix.com';
  if (brandLower.includes('tesla')) return 'https://logo.clearbit.com/tesla.com';
  
  return null;
};

export default function PaidFooter() {
  const b = useBrandTakeover();
  const logoUrl = b.logo || getDefaultLogo(b.brand);
  const brandName = b.brand || 'Your Company';
  const brandColor = b.primary || '#FF6B35';

  // Handler for cookie preferences
  const handleCookiePreferences = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      // Try common CMP APIs
      if ((window as any).__cmp) {
        (window as any).__cmp('open');
      } else if ((window as any).__tcfapi) {
        (window as any).__tcfapi('displayConsentUi', 2, () => {});
      } else {
        // Fallback to route if no CMP available
        window.location.href = '/legal/cookies';
      }
    }
  };

  return (
    <footer className="border-t bg-slate-50/80 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Row 1: Brand (centered) */}
        <div data-testid="footer-brand" className="flex flex-col items-center gap-4 mb-8">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={`${brandName} logo`}
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
            />
          )}
          {brandName && (
            <div className="text-base font-semibold text-slate-800">
              {brandName}
            </div>
          )}
        </div>

        {/* Row 2: Links (centered, evenly spaced) */}
        <nav data-testid="footer-links" aria-label="Legal and support" className="mb-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            {[
              { href: '/legal/privacy', label: 'Privacy Policy' },
              { href: '/legal/terms', label: 'Terms of Service' },
              { href: '/legal/cookies', label: 'Cookie Preferences', onClick: handleCookiePreferences },
              { href: '/legal/accessibility', label: 'Accessibility' },
              { href: '/contact', label: 'Contact' },
            ].map((link, i, arr) => (
              <li key={link.href} className="flex items-center gap-3">
                {link.onClick ? (
                  <button
                    onClick={link.onClick}
                    className="text-slate-600 hover:text-slate-900 transition-colors underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                    style={{ 
                      '--tw-ring-color': brandColor 
                    } as React.CSSProperties}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                    style={{ 
                      '--tw-ring-color': brandColor 
                    } as React.CSSProperties}
                  >
                    {link.label}
                  </Link>
                )}
                {i < arr.length - 1 && (
                  <span aria-hidden="true" className="text-slate-400">•</span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Row 3: Micro-attribution (centered, subdued) */}
        <div data-testid="footer-micro" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500/70">
          <span>Mapping &amp; location data © Google</span>
          <span aria-hidden="true" className="text-slate-400">•</span>
          <span>Estimates generated using NREL PVWatts® v8</span>
          <span aria-hidden="true" className="text-slate-400">•</span>
          <span>
            Powered by{' '}
            <a 
              href="https://getsunspire.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-slate-700 transition-colors"
            >
              Sunspire
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
