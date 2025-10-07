// components/Footer.tsx
// Industry-standard mobile-first footer design
// References: Stripe (stripe.com), Notion (notion.so), HubSpot (hubspot.com)
// - Single column stack on mobile (< 768px)
// - Multi-column grid on desktop
// - Consistent alignment (left-aligned for readability)
// - Touch-friendly spacing (min 44x44px tap targets)
// - Clear visual hierarchy

import Link from "next/link";
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import Container from '@/components/layout/Container';

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

export default function Footer() {
  const b = useBrandTakeover();
  return (
    <footer className="bg-slate-100/60 py-8 md:py-10" data-testid="footer">
      <Container className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="px-4 py-8 md:px-10 md:py-12">
          {/* MULTI-COLUMN GRID - Stacks vertically on mobile, 3 columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
            
            {/* COLUMN 1: Company Info - Always left-aligned */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Sunspire Solar Intelligence
              </h3>
              <p className="text-sm text-slate-600">
                Demo for {b.brand} — Powered by Sunspire
              </p>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">📍</span>
                  <div>
                    1700 Northside Drive Suite A7 #5164<br />
                    Atlanta, GA 30318
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Pill>GDPR</Pill>
                  <Pill>CCPA</Pill>
                  <Pill>SOC 2</Pill>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Contact Info - Left-aligned on all screens */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2 min-h-[44px]">
                  <span className="text-base flex-shrink-0">✉️</span>
                  <a className="hover:text-slate-900 transition-colors" href="mailto:support@getsunspire.com">
                    support@getsunspire.com
                  </a>
                </li>
                <li className="flex items-center gap-2 min-h-[44px]">
                  <span className="text-base flex-shrink-0">✉️</span>
                  <a className="hover:text-slate-900 transition-colors" href="mailto:billing@getsunspire.com">
                    billing@getsunspire.com
                  </a>
                </li>
                <li className="flex items-center gap-2 min-h-[44px]">
                  <span className="text-base flex-shrink-0">☎️</span>
                  <a className="hover:text-slate-900 transition-colors" href="tel:+14041234567">
                    +1 (404) 123-4567
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: Links - Left-aligned on all screens */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900">Quick Links</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="min-h-[44px] flex items-center">
                  <Link className="hover:text-slate-900 transition-colors" href="/pricing">
                    Pricing
                  </Link>
                </li>
                <li className="min-h-[44px] flex items-center">
                  <Link className="hover:text-slate-900 transition-colors" href="/partners">
                    Partners
                  </Link>
                </li>
                <li className="min-h-[44px] flex items-center">
                  <Link className="hover:text-slate-900 transition-colors" href="/support">
                    Support
                  </Link>
                </li>
              </ul>

              <h4 className="text-lg font-semibold text-slate-900 pt-4">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="min-h-[44px] flex items-center">
                  <Link className="hover:text-slate-900 transition-colors" href="/privacy">
                    Privacy Policy
                  </Link>
                </li>
                <li className="min-h-[44px] flex items-center">
                  <Link className="hover:text-slate-900 transition-colors" href="/terms">
                    Terms of Service
                  </Link>
                </li>
                <li className="min-h-[44px] flex items-center">
                  <Link className="hover:text-slate-900 transition-colors" href="/security">
                    Security
                  </Link>
                </li>
                <li className="min-h-[44px] flex items-center">
                  <Link className="hover:text-slate-900 transition-colors" href="/dpa">
                    DPA
                  </Link>
                </li>
                <li className="min-h-[44px] flex items-center">
                  <Link className="hover:text-slate-900 transition-colors" href="/do-not-sell">
                    Do Not Sell My Data
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* DIVIDER */}
          <hr className="my-8 md:my-10 border-slate-200" />

          {/* BOTTOM BAR - Stacks vertically on mobile, horizontal on desktop */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 text-xs md:text-sm text-slate-600">
            {/* Mobile: Full width blocks, Desktop: Flex items */}
            <div className="flex items-center gap-2">
              <span className="text-base flex-shrink-0">⚡</span>
              <span>Estimates generated using NREL PVWatts® v8</span>
            </div>

            <div className="flex items-center gap-2 md:flex-1 md:justify-center">
              <span>
                Powered by{" "}
                <span className="font-semibold" style={{ color: b.primary }}>
                  Sunspire
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2 md:justify-end">
              <span className="text-base flex-shrink-0">🗺️</span>
              <span>Mapping & location data © Google</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}