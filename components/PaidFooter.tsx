"use client";
import Image from "next/image";

type Props = {
  companyName: string;
  companyLogo?: string;
  brandColor?: string;
  contactEmail?: string; // company-owned, not Sunspire
  contactPhone?: string; // optional
  addressHtml?: string; // optional <address> innerHTML (sanitized upstream)
  poweredByUrl?: string; // default: https://getsunspire.com
};

export default function PaidFooter({
  companyName,
  companyLogo,
  brandColor = "#0A61FF",
  contactEmail,
  contactPhone,
  addressHtml,
  poweredByUrl = "https://getsunspire.com",
}: Props) {
  return (
    <footer
      className="mt-16 border-t border-black/10 bg-gradient-to-t from-slate-50/90 to-transparent backdrop-blur-sm"
      data-footer
      data-paid-footer
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Brand & address */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {companyLogo ? (
                <Image
                  src={companyLogo}
                  alt={`${companyName} logo`}
                  width={32}
                  height={32}
                  className="rounded-md"
                />
              ) : null}
              <span className="text-lg font-semibold tracking-tight">
                {companyName}
              </span>
            </div>
            {addressHtml ? (
              <address
                className="not-italic text-sm text-slate-600 leading-6"
                dangerouslySetInnerHTML={{ __html: addressHtml }}
              />
            ) : null}
          </div>

          {/* Legal */}
          <nav aria-label="Legal" className="text-sm">
            <ul className="space-y-2">
              <li>
                <a
                  className="underline underline-offset-2 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  href="/terms"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  href="/accessibility"
                >
                  Accessibility
                </a>
              </li>
              <li>
                <a
                  className="underline underline-offset-2 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  href="/cookies"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </nav>

          {/* Help / Contact */}
          <div className="space-y-3">
            <div className="text-sm">
              <div className="font-medium">Questions?</div>
              <ul className="mt-2 space-y-1">
                {contactEmail && (
                  <li>
                    <a
                      className="underline underline-offset-2"
                      href={`mailto:${contactEmail}`}
                    >
                      Email {companyName}
                    </a>
                  </li>
                )}
                {contactPhone && (
                  <li>
                    <a
                      className="underline underline-offset-2"
                      href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`}
                    >
                      {contactPhone}
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div className="pt-2 text-right md:text-left">
              <a
                href={poweredByUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Powered by Sunspire"
                className="inline-flex items-center gap-2 text-xs text-slate-500"
              >
                <span
                  className="relative inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: brandColor }}
                />
                <span>Powered by Sunspire</span>
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white/70 p-4 text-xs leading-6 text-slate-600">
          <p>
            Estimates are informational only, based on modeled data (NREL
            PVWatts® v8 and current utility rates). Actual results vary by site
            conditions and installation quality. Not a binding quote.
          </p>
          <p className="mt-1">
            Last updated{" "}
            <span data-last-updated>{new Date().toLocaleDateString()}</span>.
          </p>
        </div>
      </div>

      <style jsx>{`
        a {
          color: ${brandColor};
        }
        a:focus-visible {
          outline-color: ${brandColor};
        }
      `}</style>
    </footer>
  );
}
