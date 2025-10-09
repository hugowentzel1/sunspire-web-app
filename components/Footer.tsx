// components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import Container from '@/components/layout/Container';
import { useIsDemo } from '@/src/lib/isDemo';
import { useSearchParams } from 'next/navigation';
import { getTenantFlags } from '@/lib/tenantConfig';

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

// Helper to get default logo URL
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

export default function Footer() {
  const b = useBrandTakeover();
  const isDemo = useIsDemo();
  const searchParams = useSearchParams();
  const tenantFlags = getTenantFlags(b.brand, searchParams);
  const logoUrl = b.logo || getDefaultLogo(b.brand);
  
  // Handler for opening cookie preferences
  const handleCookiePreferences = () => {
    if (typeof window !== 'undefined') {
      // Try common CMP APIs
      if ((window as any).__cmp) {
        (window as any).__cmp('open');
      } else if ((window as any).__tcfapi) {
        (window as any).__tcfapi('displayConsentUi', 2, () => {});
      }
    }
  };
  
  return (
    <footer className="bg-slate-100/60 py-10" data-testid="footer">
      {/* FOOTER CARD (everything lives inside this block) */}
      <Container className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="px-6 py-10 md:px-10 md:py-12">
          {/* 3-COLUMN GRID - Mobile: centered, Desktop: original alignment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
            {/* LEFT - Mobile: centered, Desktop: left-aligned */}
            <div className="min-w-0 md:max-w-sm text-center md:text-left">
              {/* Company Logo (paid mode only) */}
              {!isDemo && logoUrl && (
                <div className="flex justify-center md:justify-start mb-4">
                  <Image
                    src={logoUrl}
                    alt={`${b.brand} logo`}
                    width={48}
                    height={48}
                    className="rounded-lg"
                    style={{
                      objectFit: "contain",
                      width: "48px",
                      height: "48px"
                    }}
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-900">
                Sunspire Solar Intelligence
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {isDemo ? `Demo for ${b.brand} — Powered by Sunspire` : `Powered by Sunspire for ${b.brand}`}
              </p>

              {isDemo && (
                <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-700">
                  <div className="flex items-start gap-3 justify-center md:justify-start">
                    <span className="mt-0.5 flex-shrink-0">📍</span>
                    <div className="min-w-0 break-words whitespace-normal text-left">
                      1700 Northside Drive Suite A7 #5164<br className="hidden sm:block" />
                      Atlanta, GA 30318
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                    <Pill>GDPR</Pill>
                    <Pill>CCPA</Pill>
                    <Pill>SOC 2</Pill>
                  </div>

                  <ul className="mt-1 space-y-2.5">
                    <li className="flex items-start gap-3 justify-center md:justify-start">
                      <span className="mt-0.5 flex-shrink-0">✉️</span>
                      <a className="underline-offset-2 hover:underline" href="mailto:support@getsunspire.com">
                        support@getsunspire.com
                      </a>
                    </li>
                    <li className="flex items-start gap-3 justify-center md:justify-start">
                      <span className="mt-0.5 flex-shrink-0">✉️</span>
                      <a className="underline-offset-2 hover:underline" href="mailto:billing@getsunspire.com">
                        billing@getsunspire.com
                      </a>
                    </li>
                    <li className="flex items-start gap-3 justify-center md:justify-start">
                      <span className="mt-0.5 flex-shrink-0">☎️</span>
                      <a className="underline-offset-2 hover:underline" href="tel:+14041234567">
                        +1 (404) 123-4567
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* MIDDLE - Demo only */}
            {isDemo && (
              <div className="min-w-0 md:max-w-xs flex flex-col items-center text-center">
                <h4 className="text-xl font-semibold text-slate-900">Quick Links</h4>
                <ul className="mt-4 space-y-3 text-sm text-slate-700 leading-relaxed">
                  <li><Link className="hover:underline underline-offset-2" href="/pricing">Pricing</Link></li>
                  <li><Link className="hover:underline underline-offset-2" href="/partners">Partners</Link></li>
                  <li><Link className="hover:underline underline-offset-2" href="/support">Support</Link></li>
                </ul>
              </div>
            )}

            {/* RIGHT - Different for demo vs paid */}
            <div className={`min-w-0 md:max-w-xs text-center md:text-right ${isDemo ? '' : 'md:col-span-2'}`}>
              <h4 className="text-xl font-semibold text-slate-900">Legal &amp; {isDemo ? 'Support' : 'Information'}</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-700 leading-relaxed">
                <li><Link className="hover:underline underline-offset-2" href="/privacy">Privacy Policy</Link></li>
                <li><Link className="hover:underline underline-offset-2" href="/terms">Terms of Service</Link></li>
                {!isDemo && (
                  <>
                    <li>
                      <button 
                        onClick={handleCookiePreferences}
                        className="hover:underline underline-offset-2 cursor-pointer"
                      >
                        Cookie Preferences
                      </button>
                    </li>
                    <li><Link className="hover:underline underline-offset-2" href="/accessibility">Accessibility</Link></li>
                    <li><Link className="hover:underline underline-offset-2" href="/contact">Contact</Link></li>
                    {tenantFlags.cpraApplies && (
                      <li><Link className="hover:underline underline-offset-2" href="/privacy/ccpa-opt-out">Do Not Sell or Share My Personal Information</Link></li>
                    )}
                  </>
                )}
                {isDemo && (
                  <>
                    <li><Link className="hover:underline underline-offset-2" href="/security">Security</Link></li>
                    <li><Link className="hover:underline underline-offset-2" href="/dpa">DPA</Link></li>
                    <li><Link className="hover:underline underline-offset-2" href="/do-not-sell">Do Not Sell My Data</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* DIVIDER */}
          <hr className="my-10 border-slate-200" />

          {/* BOTTOM BAR - Attribution row (simplified, centered) */}
          <div className="text-xs text-slate-500 text-center" data-testid="footer-attribution">
            <p>Mapping &amp; location data © Google  •  Estimates generated using NREL PVWatts® v8</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
