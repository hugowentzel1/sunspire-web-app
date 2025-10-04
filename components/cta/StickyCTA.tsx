import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

type StickyCTAProps = {
  href?: string;
  companyName?: string;
  showSubcopy?: boolean;     // default true
  showTrustChips?: boolean;  // default true
  testId?: string;
};

const CTA_LABEL = "Activate on Your Domain — 24 Hours";
const SUBCOPY   = "$99/mo + $399 setup • Cancel anytime";
const TRUST_CHIPS = ["SOC 2", "GDPR", "NREL PVWatts®", "113+ installers live"];

// Candidate cookie banner selectors.
// Add your exact selector here if you have one.
const COOKIE_CANDIDATE_SELECTORS = [
  '[data-cookie-banner]',
  '#cookie-consent',
  '.cookie-banner',
  '.cc-window',
  '[role="dialog"][data-cookie]',
  '[id*="cookie"]',
  '[class*="cookie"]'
];

function isLikelyBottomBanner(el: HTMLElement): boolean {
  const cs = getComputedStyle(el);
  if (!(cs.position === "fixed" || cs.position === "sticky")) return false;
  if (cs.display === "none" || cs.visibility === "hidden") return false;

  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (rect.height < 40 || rect.width < 120) return false;

  // Near the bottom (within 4px), or lives in lower third of the viewport
  const nearBottom = Math.abs(vh - rect.bottom) <= 4;
  const inLowerThird = rect.top > vh * (2 / 3);
  return nearBottom || inLowerThird;
}

export default function StickyCTA({
  href = "/pricing",
  companyName,
  showSubcopy = true,
  showTrustChips = true,
  testId = "sticky-cta",
}: StickyCTAProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [bottomOffset, setBottomOffset] = useState<number>(16);

  const calcOffset = useMemo(() => {
    let raf: number | null = null;
    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try {
          const safeProbe = document.createElement("div");
          safeProbe.style.cssText = `
            position: fixed; inset: auto 0 0 0;
            padding-bottom: env(safe-area-inset-bottom);
            visibility: hidden; pointer-events: none;
          `;
          document.body.appendChild(safeProbe);
          const safe = parseFloat(getComputedStyle(safeProbe).paddingBottom || "0") || 0;
          safeProbe.remove();

          // Find visible cookie banners (ignore our own sticky).
          const banners = new Set<HTMLElement>();
          for (const sel of COOKIE_CANDIDATE_SELECTORS) {
            document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
              if (!rootRef.current || !rootRef.current.contains(el)) {
                if (isLikelyBottomBanner(el)) banners.add(el);
              }
            });
          }

          // Measure max overlap with bottom viewport
          const vh = window.innerHeight || document.documentElement.clientHeight;
          let overlap = 0;
          banners.forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.height > 0 && r.width > 0) {
              const h = Math.max(0, vh - Math.max(0, r.top));
              overlap = Math.max(overlap, Math.min(h, r.height));
            }
          });

          const BASE = 16;
          const next = Math.round(BASE + safe + overlap);

          // Only update state if we actually changed by ≥1px to avoid jitter
          setBottomOffset((prev) => (Math.abs(prev - next) >= 1 ? next : prev));
        } catch {
          // noop
        }
      });
    };
  }, []);

  useEffect(() => {
    // Initial and on resize
    const handleResize = () => calcOffset();
    calcOffset();
    window.addEventListener("resize", handleResize);

    // Observe DOM mutations broadly but debounce via rAF in calcOffset
    const mo = new MutationObserver(() => calcOffset());
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Lightweight periodic check to catch CSS-only animation of banners
    const id = window.setInterval(calcOffset, 800);

    return () => {
      window.removeEventListener("resize", handleResize);
      mo.disconnect();
      window.clearInterval(id);
    };
  }, [calcOffset]);

  return (
    <div
      ref={rootRef}
      data-testid={testId}
      data-sticky-cta // used to ignore us in queries
      className={clsx(
        "fixed z-[70] pointer-events-none w-full sm:w-auto",
        // Positioning: mobile full-width with 16px side insets; desktop true bottom-right
        // (We use Tailwind responsive utilities so we don't set left on desktop)
        "left-4 right-4 sm:left-auto sm:right-4"
      )}
      style={{ bottom: `${bottomOffset}px` }}
      aria-live="polite"
    >
      {/* Mobile: full-width sticky bar */}
      <div className="sm:hidden pointer-events-auto">
        <div className="mx-auto max-w-[720px]">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/75">
            <Link
              href={href}
              aria-label={
                companyName
                  ? `Activate for ${companyName} — go live in 24 hours`
                  : "Activate on your domain — go live in 24 hours"
              }
              className="flex-1 text-center rounded-lg bg-red-600 text-white font-semibold px-4 py-3.5 min-h-[52px]"
            >
              {CTA_LABEL}
            </Link>
          </div>

          {showSubcopy && (
            <p className="mt-1 text-center text-xs text-neutral-600">{SUBCOPY}</p>
          )}

          {showTrustChips && (
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

      {/* Desktop: bottom-right pill */}
      <div className="hidden sm:block ml-auto pointer-events-auto">
        <div className="rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/75 max-w-[420px]">
          <Link
            href={href}
            aria-label={
              companyName
                ? `Activate for ${companyName} — go live in 24 hours`
                : "Activate on your domain — go live in 24 hours"
            }
            className="inline-flex items-center justify-center rounded-full bg-red-600 text-white font-semibold px-6 py-4 min-h-[60px] w-full hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            {CTA_LABEL}
          </Link>

          {showSubcopy && (
            <div className="mt-1.5 text-center text-[12px] text-neutral-700">{SUBCOPY}</div>
          )}

          {showTrustChips && (
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