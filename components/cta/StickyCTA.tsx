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
      const viewportHeight = window.innerHeight;

      // More aggressive detection - look for ANY element at the bottom of the viewport
      let cookieHeight = 0;
      
      // Check all elements that might be cookie banners
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const element = el as HTMLElement;
        if (element.offsetParent !== null) {
          const rect = element.getBoundingClientRect();
          
          // Check if element is at the very bottom of the viewport
          if (rect.height > 0 && rect.bottom >= viewportHeight - 5) {
            // Additional checks to confirm it's likely a cookie banner
            const style = getComputedStyle(element);
            const isFixed = style.position === 'fixed';
            const isSticky = style.position === 'sticky';
            const hasCookieText = element.textContent?.toLowerCase().includes('cookie') || 
                                 element.textContent?.toLowerCase().includes('consent') ||
                                 element.textContent?.toLowerCase().includes('privacy') ||
                                 element.textContent?.toLowerCase().includes('accept') ||
                                 element.textContent?.toLowerCase().includes('decline');
            
            // More selective: only consider elements that are actually at the bottom and reasonable size
            if ((isFixed || isSticky || hasCookieText) && 
                rect.top < viewportHeight && 
                rect.height < 200 && // Reasonable size for a cookie banner
                rect.height > 20) { // Not too small
              cookieHeight = Math.max(cookieHeight, rect.height);
              console.log('🍪 Found potential cookie banner:', {
                tagName: element.tagName,
                height: rect.height,
                bottom: rect.bottom,
                top: rect.top,
                viewport: viewportHeight,
                isFixed,
                isSticky,
                hasCookieText,
                text: element.textContent?.substring(0, 50)
              });
            }
          }
        }
      });

      const BASE = 16; // base spacing from viewport bottom when no banner
      const next = Math.round(BASE + (cookieHeight > 0 ? cookieHeight + 16 : 0) + safe); // +16 for just above the banner
      console.log('🍪 Setting bottom offset:', next, 'cookieHeight:', cookieHeight, 'BASE:', BASE, 'safe:', safe);
      setBottomOffset(next);
    };

    setSafeArea();
    calcOffset();

    // React to DOM mutations (banner show/hide/attribute changes)
    moRef.current = new MutationObserver(calcOffset);
    moRef.current.observe(document.body, { childList: true, subtree: true, attributes: true });

    // React to banner resizes - observe all elements
    roRef.current = new ResizeObserver(calcOffset);
    // Observe the entire document for any size changes
    roRef.current.observe(document.body);

    // Window resize as fallback
    window.addEventListener("resize", calcOffset);
    
    // Also run detection periodically to catch any missed changes
    const interval = setInterval(calcOffset, 1000);

    return () => {
      window.removeEventListener("resize", calcOffset);
      moRef.current?.disconnect();
      roRef.current?.disconnect();
      clearInterval(interval);
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