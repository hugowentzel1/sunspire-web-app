"use client";
import Image from "next/image";

type Props = {
  company: string;
  logo?: string;
  supportEmail?: string;
  phone?: string;
  lastUpdated?: string; // e.g., "9/17/2025"
  brandColor?: string;
};

export default function FooterPaid({
  company,
  logo,
  supportEmail,
  phone,
  lastUpdated,
  brandColor = "#2563EB",
}: Props) {
  return (
    <footer
      role="contentinfo"
      data-paid-footer
      className="mt-12 border-t border-black/10 bg-white/70 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Brand */}
          <div className="md:col-span-4 flex items-start gap-4">
            {logo && (
              <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden ring-1 ring-black/10 bg-white">
                <Image src={logo} alt={`${company} logo`} fill sizes="40px" />
              </div>
            )}
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {company}
              </div>
              <div className="text-sm text-gray-500">Solar Intelligence</div>
            </div>
          </div>

          {/* Middle: Legal */}
          <div className="md:col-span-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Legal</div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <a className="hover:text-gray-900" href="/privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-gray-900" href="/terms">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-gray-900" href="/accessibility">
                  Accessibility
                </a>
              </li>
              <li>
                <a className="hover:text-gray-900" href="/cookies">
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Right: Contacts */}
          <div className="md:col-span-4">
            <div className="text-sm font-medium text-gray-900 mb-2">
              Questions?
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              {supportEmail && (
                <li>
                  <a
                    className="hover:text-gray-900"
                    href={`mailto:${supportEmail}`}
                  >
                    Email {company}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    className="hover:text-gray-900"
                    href={`tel:${phone.replace(/\D/g, "")}`}
                  >
                    {phone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2 text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 inline-block" />
                <span>
                  Powered by{" "}
                  <a
                    href="https://getsunspire.com"
                    target="_blank"
                    rel="noopener"
                    className="underline hover:text-gray-900"
                  >
                    Sunspire
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-6 rounded-xl border border-black/10 bg-white px-4 py-3 text-xs text-gray-600"
          data-disclaimer-box
        >
          <p>
            Estimates are informational only, based on modeled data (NREL
            PVWatts® v8 and current utility rates). Actual results vary by site
            conditions and installation quality. Not a binding quote.
          </p>
          {lastUpdated && (
            <p className="mt-1 text-gray-500">Last updated {lastUpdated}.</p>
          )}
        </div>
      </div>
    </footer>
  );
}
