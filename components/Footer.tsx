// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

type Props = {
  brandName?: string;
  logoUrl?: string;
  brandColor?: string;
  poweredBy?: boolean;
};

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

export default function Footer({
  brandName,
  logoUrl,
  brandColor,
  poweredBy = true,
}: Props) {
  // Get brand context if not provided via props
  const b = useBrandTakeover();
  const finalBrandName = brandName || b.brand;
  const finalLogoUrl = logoUrl || b.logo || getDefaultLogo(finalBrandName);
  const finalBrandColor = brandColor || b.primary;

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
    <footer aria-label="Site footer" className="border-t bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          {finalLogoUrl && (
            <div className="h-8 w-auto">
              <Image 
                src={finalLogoUrl} 
                alt={`${finalBrandName ?? "Brand"} logo`} 
                width={112} 
                height={32} 
                className="h-8 w-auto object-contain" 
              />
            </div>
          )}
          {finalBrandName && (
            <div className="text-base font-medium text-slate-800 dark:text-slate-100">
              {finalBrandName}
            </div>
          )}
        </div>

        {/* Legal links */}
        <nav aria-label="Legal and support" className="mt-6 mx-auto max-w-3xl">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
            {[
              { href: "/legal/privacy", label: "Privacy Policy" },
              { href: "/legal/terms", label: "Terms of Service" },
              { href: "/legal/cookies", label: "Cookie Preferences", onClick: handleCookiePreferences },
              { href: "/legal/accessibility", label: "Accessibility" },
              { href: "/contact", label: "Contact" },
            ].map((l, i, arr) => (
              <li key={l.href} className="flex items-center">
                {l.onClick ? (
                  <button
                    onClick={l.onClick}
                    aria-label={l.label}
                    className="underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600 rounded"
                  >
                    {l.label}
                  </button>
                ) : (
                  <Link
                    href={l.href}
                    aria-label={l.label}
                    className="underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600 rounded"
                  >
                    {l.label}
                  </Link>
                )}
                {i < arr.length - 1 && (
                  <span aria-hidden="true" className="mx-2 text-slate-400">•</span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footnotes (centered, improved rhythm) */}
        <div className="mt-8 pt-6 border-t border-neutral-200/70 dark:border-neutral-800">
          <div className="mx-auto max-w-4xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm text-slate-600 dark:text-slate-300">
              {/* Google Attribution */}
              <div className="flex flex-col items-center space-y-1">
                <div className="font-medium">
                  Mapping Data
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  © Google
                </div>
              </div>
              
              {/* PVWatts Attribution */}
              <div className="flex flex-col items-center space-y-1">
                <div className="font-medium">
                  Solar Modeling
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  NREL PVWatts® v8
                </div>
              </div>
              
              {/* Sunspire Credit */}
              <div className="flex flex-col items-center space-y-1">
                <div className="font-medium">
                  Powered By
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Sunspire
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
