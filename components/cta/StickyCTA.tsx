import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

type StickyCTAProps = {
  href?: string;                 // where the CTA goes (pricing/checkout)
  companyName?: string;          // for aria-label context
  showSubcopy?: boolean;         // default: true
  showTrustChips?: boolean;      // default: true
  className?: string;
  testId?: string;
};

const CTA_LABEL = "Activate on Your Domain — 24 Hours";
const SUBCOPY   = "$99/mo + $399 setup • Cancel anytime";

// Legacy trust signals to display under the button (compact)
const TRUST_CHIPS = [
  "SOC 2",
  "GDPR",
  "NREL PVWatts®",
  "113+ installers live"
];

// Common cookie banner selectors (add yours if different)
const COOKIE_SELECTORS = [
  '[data-cookie-banner]',
  '#cookie-consent',
  '[role="dialog"][data-cookie]',
  '.cookie-banner',
  '.cc-window',
  '[id*="cookie"]',
  '[class*="cookie"]',
  '[data-testid*="cookie"]',
  '.cookie-notice',
  '#cookie-notice',
  '.cookie-consent',
  '[data-cookie]'
];

export default function StickyCTA({
  href = "/pricing",
  companyName,
  showSubcopy = true,
  showTrustChips = true,
  className,
  testId = "sticky-cta",
}: StickyCTAProps) {
  const [bottomOffset, setBottomOffset] = useState<number>(16);
  const moRef = useRef<MutationObserver | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const setSafeArea = () => {
      const root = document.documentElement;
      const probe = document.createElement("div");
      probe.style.cssText = `
        position: fixed; inset: auto 0 0 0;
        padding-bottom: env(safe-area-inset-bottom);
        visibility: hidden; pointer-events: none;
      `;
      document.body.appendChild(probe);
      const pb = parseFloat(getComputedStyle(probe).paddingBottom || "0");
      root.style.setProperty("--sat-safe-bottom", `${pb || 0}px`);
      probe.remove();
    };

    const calcOffset = () => {
      const root = document.documentElement;
      const safe = Number(root.style.getPropertyValue("--sat-safe-bottom").replace("px", "")) || 0;

      // Measure tallest visible cookie banner
      let cookieHeight = 0;
      for (const sel of COOKIE_SELECTORS) {
        const elements = document.querySelectorAll<HTMLElement>(sel);
        elements.forEach(el => {
          if (el && el.offsetParent !== null) {
            const rect = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            // Only consider elements that are actually visible and positioned at the bottom
            if (rect.height > 0 && rect.bottom >= viewportHeight * 0.8) {
              cookieHeight = Math.max(cookieHeight, rect.height);
              console.log('🍪 Found cookie banner:', sel, 'height:', rect.height, 'bottom:', rect.bottom, 'viewport:', viewportHeight);
            }
          }
        });
      }
      
      // Also check for any fixed positioned elements at the bottom
      const allFixedElements = document.querySelectorAll<HTMLElement>('[style*="position: fixed"], [style*="position:fixed"]');
      allFixedElements.forEach(el => {
        if (el.offsetParent !== null) {
          const rect = el.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          // Check if it's positioned at the bottom and looks like a cookie banner
          if (rect.height > 0 && rect.bottom >= viewportHeight - 10) {
            cookieHeight = Math.max(cookieHeight, rect.height);
            console.log('🍪 Found fixed element at bottom:', 'height:', rect.height, 'bottom:', rect.bottom, 'viewport:', viewportHeight);
          }
        }
      });

      const BASE = 16; // base spacing from viewport bottom when no banner
      const next = Math.round(BASE + (cookieHeight > 0 ? cookieHeight + 16 : 0) + safe); // +16 for proper clearance
      console.log('🍪 Setting bottom offset:', next, 'cookieHeight:', cookieHeight);
      setBottomOffset(next);
    };

    setSafeArea();
    calcOffset();

    // React to DOM mutations (banner show/hide/attribute changes)
    moRef.current = new MutationObserver(calcOffset);
    moRef.current.observe(document.body, { childList: true, subtree: true, attributes: true });

    // React to banner resizes
    roRef.current = new ResizeObserver(calcOffset);
    COOKIE_SELECTORS.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) roRef.current?.observe(el as Element);
    });

    // Window resize as fallback
    window.addEventListener("resize", calcOffset);

    return () => {
      window.removeEventListener("resize", calcOffset);
      moRef.current?.disconnect();
      roRef.current?.disconnect();
    };
  }, []);

  return (
    <div
      data-testid={testId}
      className={clsx(
        "fixed z-[70] pointer-events-none w-full sm:w-auto sm:left-auto",
        className
      )}
      style={{
        right: "16px",
        bottom: `${bottomOffset}px`
      }}
      aria-live="polite"
    >
      {/* Mobile: full-width sticky bar (64–68px total, tap ≥52–56px) */}
      <div className="sm:hidden pointer-events-auto">
        <div className="mx-auto max-w-[720px]">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/75">
            <span className="sr-only">
              {companyName ? `Activate for ${companyName}` : "Activate on your domain"}
            </span>
            <Link
              href={href}
              aria-label={companyName ? `Activate for ${companyName} — go live in 24 hours` : "Activate on your domain — go live in 24 hours"}
              className="flex-1 text-center rounded-lg bg-red-600 text-white font-semibold px-4 py-3.5 min-h-[52px]"
            >
              {CTA_LABEL}
            </Link>
          </div>

          {showSubcopy && (
            <p className="mt-1 text-center text-xs text-neutral-600">{SUBCOPY}</p>
          )}

          {showTrustChips && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-600">
              {TRUST_CHIPS.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-black/20 px-2 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: bottom-right pill (button ≈60px tall) */}
      <div className="hidden sm:block ml-auto pointer-events-auto">
        <div className="rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/75 max-w-[400px]">
          <Link
            href={href}
            aria-label={companyName ? `Activate for ${companyName} — go live in 24 hours` : "Activate on your domain — go live in 24 hours"}
            className="inline-flex items-center justify-center rounded-full bg-red-600 text-white font-semibold px-6 py-4 min-h-[60px] w-full hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            {CTA_LABEL}
          </Link>

          {showSubcopy && (
            <div className="mt-1.5 text-center text-[12px] text-neutral-700">{SUBCOPY}</div>
          )}

          {showTrustChips && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-600">
              {TRUST_CHIPS.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-black/20 px-2 py-1"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}