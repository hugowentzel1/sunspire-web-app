// components/Footer.tsx
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
    <footer className="bg-slate-100/60 py-10" data-testid="footer">
      {/* FOOTER CARD (everything lives inside this block) */}
      <Container className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="px-6 py-10 md:px-10 md:py-12">
          {/* 3-COLUMN GRID - Mobile: centered, Desktop: original alignment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">
            {/* LEFT - Mobile: centered, Desktop: left-aligned */}
            <div className="min-w-0 md:max-w-sm text-center md:text-left">
              <h3 className="text-xl font-semibold text-slate-900">
                Sunspire Solar Intelligence
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Demo for {b.brand} — Powered by Sunspire
              </p>

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
            </div>

            {/* MIDDLE - Always centered */}
            <div className="min-w-0 md:max-w-xs flex flex-col items-center text-center">
              <h4 className="text-xl font-semibold text-slate-900">Quick Links</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-700 leading-relaxed">
                <li><Link className="hover:underline underline-offset-2" href="/pricing">Pricing</Link></li>
                <li><Link className="hover:underline underline-offset-2" href="/partners">Partners</Link></li>
                <li><Link className="hover:underline underline-offset-2" href="/support">Support</Link></li>
              </ul>
            </div>

            {/* RIGHT - Mobile: centered, Desktop: right-aligned */}
            <div className="min-w-0 md:max-w-xs text-center md:text-right">
              <h4 className="text-xl font-semibold text-slate-900">Legal &amp; Support</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-700 leading-relaxed">
                <li><Link className="hover:underline underline-offset-2" href="/privacy">Privacy Policy</Link></li>
                <li><Link className="hover:underline underline-offset-2" href="/terms">Terms of Service</Link></li>
                <li><Link className="hover:underline underline-offset-2" href="/security">Security</Link></li>
                <li><Link className="hover:underline underline-offset-2" href="/dpa">DPA</Link></li>
                <li><Link className="hover:underline underline-offset-2" href="/do-not-sell">Do Not Sell My Data</Link></li>
              </ul>
            </div>
          </div>

          {/* DIVIDER */}
          <hr className="my-10 border-slate-200" />

          {/* BOTTOM BAR (inside the same card) */}
          <div className="flex flex-col gap-4 text-sm text-slate-600 md:flex-row md:items-start">
            {/* LEFT: PVWatts */}
            <div className="flex-1 flex gap-2">
              <span className="flex-shrink-0 mt-0.5">⚡</span>
              <span className="leading-relaxed">
                Estimates generated<br />using NREL PVWatts® v8
              </span>
            </div>

            {/* CENTER: Sunspire - Perfectly centered */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span>
                Powered by{" "}
                <span className="font-medium" style={{ color: b.primary }}>
                  Sunspire
                </span>
              </span>
            </div>

            {/* RIGHT: Google */}
            <div className="flex-1 flex gap-2 justify-end text-right">
              <span className="flex-shrink-0 mt-0.5">🗺️</span>
              <span className="leading-relaxed">
                Mapping & location<br />data © Google
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
