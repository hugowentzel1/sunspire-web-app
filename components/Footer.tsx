// components/Footer.tsx
import Link from "next/link";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-medium leading-none">
      {children}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50 text-slate-800" data-testid="footer">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Top: 3-column grid */}
        <div className="grid min-w-0 grid-cols-1 gap-10 md:grid-cols-3 md:gap-14">
          {/* Left column */}
          <div className="min-w-0 break-words">
            <h3 className="text-2xl font-semibold tracking-tight">Sunspire Solar Intelligence</h3>
            <p className="mt-2 text-sm text-slate-600">Demo for Apple — Powered by Sunspire</p>

            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="mt-0.5">📍</span>
                <div className="min-w-0">
                  1700 Northside Drive Suite A7 #5164<br />Atlanta, GA 30318
                </div>
              </div>

              {/* Compliance badges (wrap safely) */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge>GDPR</Badge>
                <Badge>CCPA</Badge>
                <Badge>SOC 2</Badge>
              </div>

              {/* Contacts */}
              <ul className="mt-2 space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5">✉️</span>
                  <a href="mailto:support@getsunspire.com" className="underline-offset-2 hover:underline">
                    support@getsunspire.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5">✉️</span>
                  <a href="mailto:billing@getsunspire.com" className="underline-offset-2 hover:underline">
                    billing@getsunspire.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5">☎️</span>
                  <a href="tel:+14041234567" className="underline-offset-2 hover:underline">
                    +1 (404) 123-4567
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle column */}
          <div className="min-w-0 break-words text-center">
            <h4 className="text-xl font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/pricing" className="hover:underline underline-offset-2">Pricing</Link></li>
              <li><Link href="/partners" className="hover:underline underline-offset-2">Partners</Link></li>
              <li><Link href="/support" className="hover:underline underline-offset-2">Support</Link></li>
            </ul>
          </div>

          {/* Right column */}
          <div className="min-w-0 break-words">
            <h4 className="text-xl font-semibold">Legal &amp; Support</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:underline underline-offset-2">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline underline-offset-2">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:underline underline-offset-2">Security</Link></li>
              <li><Link href="/dpa" className="hover:underline underline-offset-2">DPA</Link></li>
              <li><Link href="/do-not-sell" className="hover:underline underline-offset-2">Do Not Sell My Data</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-10 border-slate-200" />

        {/* Bottom bar: left / middle / right, wraps cleanly on mobile */}
        <div className="flex flex-col gap-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 break-words flex items-center gap-2">
            <span>⚡</span>
            <span>Solar estimates generated using NREL PVWatts® v8</span>
          </div>

          <div className="min-w-0 break-words text-center">
            Powered by{" "}
            <Link href="/" className="font-medium text-slate-800 underline-offset-2 hover:underline">
              Sunspire
            </Link>
          </div>

          <div className="min-w-0 break-words flex items-center gap-2 justify-start md:justify-end">
            <span>🗺️</span>
            <span>Mapping &amp; location data © Google</span>
          </div>
        </div>
      </div>
    </footer>
  );
}