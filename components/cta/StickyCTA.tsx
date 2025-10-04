import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

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
  const brand = useBrandTakeover();

  // Get company color or fallback to red
  const companyColor = brand?.primary || "#ef4444"; // red-500 fallback
  const companyColorHover = brand?.primary || "#dc2626"; // red-600 fallback

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
          <div
            className="
              rounded-xl bg-white/95 backdrop-blur
              shadow-[0_8px_25px_rgba(0,0,0,0.12)]
              border border-gray-200/50
              px-6 py-5
            "
          >
            {/* CTA button */}
            <Link
              href={href}
              aria-label={companyName ? `Activate for ${companyName} — go live in 24 hours` : "Activate on your domain — go live in 24 hours"}
              className="
                block w-full rounded-lg
                text-white font-semibold
                text-[16px] leading-tight
                px-6 py-4 min-h-[56px]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                transition-all duration-200
              "
              style={{ 
                backgroundColor: companyColor,
                '--tw-ring-color': companyColor
              } as React.CSSProperties & { '--tw-ring-color': string }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = companyColorHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = companyColor;
              }}
            >
              {CTA_LABEL}
            </Link>

            {/* Price line */}
            {showSubcopy && (
              <p className="mt-3 text-center text-[13px] text-gray-600 leading-relaxed">
                {SUBCOPY}
              </p>
            )}

            {/* Trust badges - 2 columns on mobile */}
            {showTrustChips && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {TRUST_CHIPS.map((t) => (
                  <span
                    key={t}
                    className="
                      inline-flex items-center justify-center
                      rounded-md border border-gray-300 bg-white
                      text-gray-700 text-[11px] font-medium
                      px-3 py-2
                      whitespace-nowrap
                      min-h-[32px]
                    "
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: bottom-right pill */}
      <div className="hidden sm:block ml-auto pointer-events-auto">
        <div
          className="
            rounded-xl bg-white/95 backdrop-blur
            shadow-[0_8px_25px_rgba(0,0,0,0.12)]
            border border-gray-200/50
            px-6 py-6
            max-w-[380px]
          "
        >
          {/* CTA button */}
          <Link
            href={href}
            aria-label={companyName ? `Activate for ${companyName} — go live in 24 hours` : "Activate on your domain — go live in 24 hours"}
            className="
              inline-flex w-full items-center justify-center
              rounded-lg text-white font-semibold
              text-[16px] leading-tight
              px-6 py-4 min-h-[56px]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              transition-all duration-200
            "
            style={{ 
              backgroundColor: companyColor,
              '--tw-ring-color': companyColor
            } as React.CSSProperties & { '--tw-ring-color': string }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = companyColorHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = companyColor;
            }}
          >
            {CTA_LABEL}
          </Link>

          {/* Price line */}
          {showSubcopy && (
            <p className="mt-3 text-center text-[13px] text-gray-600 leading-relaxed">
              {SUBCOPY}
            </p>
          )}

          {/* Trust badges - single row on desktop, wrap to 2 rows if needed */}
          {showTrustChips && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {TRUST_CHIPS.map((t) => (
                <span
                  key={t}
                  className="
                    inline-flex items-center justify-center
                    rounded-md border border-gray-300 bg-white
                    text-gray-700 text-[11px] font-medium
                    px-3 py-2
                    whitespace-nowrap
                    min-h-[32px] flex-1 min-w-[80px] max-w-[90px]
                  "
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