import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

type StickyCTAProps = {
  href?: string;
  companyName?: string;          // for aria context
  showSubcopy?: boolean;         // default: true
  showTrustChips?: boolean;      // default: true
  className?: string;
  testId?: string;
};

const CTA_LABEL = "Activate on Your Domain — 24 Hours";
const SUBCOPY   = "$99/mo + $399 setup • Cancel anytime";
const TRUST_CHIPS = ["SOC 2", "GDPR", "NREL PVWatts®", "113+ installers live"];

// Broader cookie banner detection: add your exact selector if different.
const COOKIE_CANDIDATE_SELECTORS = [
  '[data-cookie-banner]',
  '#cookie-consent',
  '.cookie-banner',
  '.cc-window',
  '[aria-live="polite"][role="dialog"]',
  '[role="dialog"][data-cookie]',
  '[id*="cookie"]',
  '[class*="cookie"]'
];

// Heuristic: candidate element is likely a bottom banner if fixed/sticky and near bottom.
function isBottomBanner(el: HTMLElement) {
  const cs = window.getComputedStyle(el);
  const pos = cs.position;
  if (!(pos === "fixed" || pos === "sticky")) return false;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  // Consider it a bottom banner if its bottom is within 0–2px of viewport bottom OR its top is in the lower 1/3 of the screen and height >= 40px.
  const nearBottom = Math.abs(vh - rect.bottom) <= 2;
  const lowRegion = rect.top > vh * (2/3) && rect.height >= 40;
  // Also ensure it's visible
  const visible = cs.display !== "none" && cs.visibility !== "hidden" && rect.height > 0 && rect.width > 0;
  return visible && (nearBottom || lowRegion);
}

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
  const rafRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lastOffsetRef = useRef<number>(16);

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

    const findCookieBanners = (): HTMLElement[] => {
      const els = new Set<HTMLElement>();
      
      // Only use specific selectors to avoid false positives
      COOKIE_CANDIDATE_SELECTORS.forEach(sel => {
        document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          if (isBottomBanner(el)) els.add(el);
        });
      });
      
      return Array.from(els);
    };

    const calcOffset = () => {
      const root = document.documentElement;
      const safe = Number(root.style.getPropertyValue("--sat-safe-bottom").replace("px", "")) || 0;
      const base = 16; // always keep in from edge

      const banners = findCookieBanners();
      let overlap = 0;

      if (banners.length) {
        // Use the maximum overlap height among candidate banners
        const vh = window.innerHeight || document.documentElement.clientHeight;
        overlap = banners.reduce((max, el) => {
          const r = el.getBoundingClientRect();
          // If part of banner occupies the bottom of viewport, the overlap height is max(0, viewportBottom - bannerTop)
          const h = Math.max(0, vh - Math.max(0, r.top));
          return Math.max(max, Math.min(h, r.height));
        }, 0);
      }

      const next = Math.round(base + safe + overlap);
      
      // Only update if the change is significant (prevent micro-adjustments)
      if (Math.abs(next - lastOffsetRef.current) > 20) {
        setBottomOffset(next);
        lastOffsetRef.current = next;
      }
    };

    const scheduleCalc = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        // Add delay to prevent rapid updates
        setTimeout(calcOffset, 100);
      });
    };

    setSafeArea();
    calcOffset();

    // Observe DOM mutations (banner mount/unmount/attr changes)
    moRef.current = new MutationObserver(scheduleCalc);
    moRef.current.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Add a periodic re-check for animated banners (translateY in/out) - reduced frequency to prevent vibration
    intervalRef.current = window.setInterval(calcOffset, 3000);

    // Resize re-check
    window.addEventListener("resize", scheduleCalc);

    // Attach ResizeObserver to likely banners (will be refreshed inside calc)
    const banners = findCookieBanners();
    roRef.current = new ResizeObserver(scheduleCalc);
    banners.forEach(el => roRef.current?.observe(el));

    return () => {
      window.removeEventListener("resize", scheduleCalc);
      moRef.current?.disconnect();
      roRef.current?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      data-testid={testId}
      className={clsx(
        "fixed z-[70] pointer-events-none w-full sm:w-auto",
        className
      )}
      // Always inset 16px from edges; bottom is dynamic (cookie-aware)
      style={{ left: "16px", right: "16px", bottom: `${bottomOffset}px` }}
      aria-live="polite"
    >
      {/* Mobile: full-width sticky bar (inset 16px L/R) */}
      <div className="sm:hidden pointer-events-auto">
        <div className="mx-auto max-w-[720px]">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/75">
            <Link
              href={href}
              aria-label={companyName ? `Activate for ${companyName} — go live in 24 hours` : "Activate on your domain — go live in 24 hours"}
              className="flex-1 text-center rounded-lg bg-red-600 text-white font-semibold px-4 py-3.5 min-h-[52px]"
            >
              {CTA_LABEL}
            </Link>
          </div>

          {showSubcopy !== false && (
            <p className="mt-1 text-center text-xs text-neutral-600">{SUBCOPY}</p>
          )}

          {showTrustChips !== false && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-black">
              {TRUST_CHIPS.map((t) => (
                <span key={t} className="rounded-md border border-black px-2 py-1">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: bottom-right pill (inset with ml-auto / mr-4) */}
      <div className="hidden sm:block ml-auto mr-4 pointer-events-auto">
        <div className="rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/75 max-w-[420px]">
          <Link
            href={href}
            aria-label={companyName ? `Activate for ${companyName} — go live in 24 hours` : "Activate on your domain — go live in 24 hours"}
            className="inline-flex items-center justify-center rounded-full bg-red-600 text-white font-semibold px-6 py-4 min-h-[60px] w-full hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            {CTA_LABEL}
          </Link>

          {showSubcopy !== false && (
            <div className="mt-1.5 text-center text-[12px] text-neutral-700">{SUBCOPY}</div>
          )}

          {showTrustChips !== false && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-black">
              {TRUST_CHIPS.map((t) => (
                <span key={t} className="rounded-md border border-black px-2 py-1">
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