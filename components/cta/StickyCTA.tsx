import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

/**
 * Premium text-only sticky CTA for Sunspire:
 * - Dynamic company color from URL/theme (no hardcoded colors)
 * - Text-only trust capsules with uniform sizing
 * - Premium shadows, spacing, and animations
 * - Cookie-aware positioning with smooth transitions
 * - Consistent with site's minimalist, professional style
 */

// ---- Copy ----
const CTA_LABEL = "Activate on Your Domain — 24 Hours";
const SUBCOPY   = "$99/mo + $399 setup • Cancel anytime";

// ---- Cookie banner detection ----
const COOKIE_CANDIDATE_SELECTORS = [
  '[data-cookie-banner]',
  '#cookie-consent',
  '.cookie-banner',
  '.cc-window',
  '[role="dialog"][data-cookie]',
  '[id*="cookie"]',
  '[class*="cookie"]'
];

// ---- Color variables (fallbacks; you set real values per-company) ----
const BRAND_50  = "var(--brand-50, #f6f8fc)";
const BRAND_600 = "var(--brand-600, #2563eb)"; // fallback: blue-600
const BRAND_700 = "var(--brand-700, #1d4ed8)";

// ---- Helpers ----
function isLikelyBottomBanner(el: HTMLElement): boolean {
  const cs = getComputedStyle(el);
  if (!(cs.position === "fixed" || cs.position === "sticky")) return false;
  if (cs.display === "none" || cs.visibility === "hidden") return false;

  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (rect.height < 40 || rect.width < 120) return false;

  const nearBottom = Math.abs(vh - rect.bottom) <= 4;
  const inLowerThird = rect.top > vh * (2 / 3);
  return nearBottom || inLowerThird;
}

// Premium text-only capsule with stronger brand tint and subtle brand text
function PremiumCapsule({
  children,
  ariaLabel,
  companyColor,
}: {
  children: React.ReactNode;
  ariaLabel?: string;
  companyColor: string;
}) {
  return (
    <span
      role="listitem"
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center",
        "h-11 w-[180px] px-3",
        "rounded-full select-none",
        "text-[14px] leading-[18px] font-medium",
        "whitespace-nowrap text-ellipsis overflow-hidden",
        "transition-all duration-150 ease-out",
        "hover:-translate-y-[0.5px]",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
      ].join(" ")}
      style={{
        background: `linear-gradient(180deg, #fff 0%, ${companyColor}15 100%)`, // 40% brand tint using hex opacity
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65), 0 1px 0 rgba(16,24,40,0.06)",
        border: "1px solid rgba(0,0,0,0.82)",
        letterSpacing: "0.01em",
        color: "#000000", // Pure black text
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 12px ${companyColor}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.65), 0 1px 0 rgba(16,24,40,0.06)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${companyColor}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      {children}
    </span>
  );
}

type StickyCTAProps = {
  href?: string;                 // destination (pricing/checkout)
  companyName?: string;          // for ARIA label context
  showSubcopy?: boolean;         // default true
  showTrust?: boolean;           // default true
  testId?: string;
};

export default function StickyCTA({
  href = "/pricing",
  companyName,
  showSubcopy = true,
  showTrust = true,
  testId = "sticky-cta",
}: StickyCTAProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [bottomOffset, setBottomOffset] = useState<number>(24); // 24px margin from edges
  const brand = useBrandTakeover();
  
  // Get company color with fallback
  const companyColor = brand?.primary || "#2563eb";

  const calcOffset = useMemo(() => {
    let raf: number | null = null;
    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try {
          // safe area via env() probe
          const probe = document.createElement("div");
          probe.style.cssText = `
            position: fixed; inset: auto 0 0 0;
            padding-bottom: env(safe-area-inset-bottom);
            visibility: hidden; pointer-events: none;
          `;
          document.body.appendChild(probe);
          const safe = parseFloat(getComputedStyle(probe).paddingBottom || "0") || 0;
          probe.remove();

          // find cookie banners (ignore our own subtree)
          const banners = new Set<HTMLElement>();
          for (const sel of COOKIE_CANDIDATE_SELECTORS) {
            document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
              if (!rootRef.current || !rootRef.current.contains(el)) {
                if (isLikelyBottomBanner(el)) banners.add(el);
              }
            });
          }

          // measure max overlap at viewport bottom
          const vh = window.innerHeight || document.documentElement.clientHeight;
          let overlap = 0;
          banners.forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.height > 0 && r.width > 0) {
              const h = Math.max(0, vh - Math.max(0, r.top));
              overlap = Math.max(overlap, Math.min(h, r.height));
            }
          });

              const BASE = 24; // 24px margin from bottom when no banner
              const next = Math.round(BASE + safe + overlap);
              setBottomOffset((prev) => (Math.abs(prev - next) >= 1 ? next : prev)); // avoid micro-jitter
        } catch {
          /* noop */
        }
      });
    };
  }, []);

  useEffect(() => {
    const handleResize = () => calcOffset();
    calcOffset();
    window.addEventListener("resize", handleResize);

    const mo = new MutationObserver(() => calcOffset());
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });

    // periodic check for CSS-only animated banners
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
      className={clsx(
        "fixed z-50 pointer-events-none w-full sm:w-auto",
        // mobile: full width with 24px side insets; desktop: true bottom-right (no left)
        "left-6 right-6 sm:left-auto sm:right-6",
        "transition-all duration-200 ease-in-out" // Smooth repositioning
      )}
      style={{ bottom: `${bottomOffset}px` }}
      aria-live="polite"
    >
      {/* Mobile: full-width sticky bar */}
      <div className="sm:hidden pointer-events-auto">
        <div className="mx-auto max-w-[720px]">
            <div 
              className="rounded-2xl px-5 py-4 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(6px)",
                boxShadow: "0 10px 30px rgba(16,24,40,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
                outline: "1px solid rgba(0,0,0,0.06)",
              }}
            >
            <Link
              href="/api/stripe/create-checkout-session"
              aria-label={
                companyName
                  ? `Activate for ${companyName} — go live in 24 hours`
                  : "Activate on your domain — go live in 24 hours"
              }
              className={[
                "relative inline-flex w-full items-center justify-center",
                "rounded-full text-white text-[16px] font-semibold tracking-[-0.01em]",
                "min-h-[52px] px-5",
                "transition-all duration-300 ease-out",
                "focus-visible:outline-none",
                "hover:-translate-y-[2px] hover:scale-[1.02]",
                "active:translate-y-0 active:scale-[0.98]",
                "group",
              ].join(" ")}
              style={{
                background: `linear-gradient(180deg, var(--brand-600, #2563eb) 0%, var(--brand-700, #1d4ed8) 100%)`,
                boxShadow: "0 8px 20px rgba(16,24,40,0.15), 0 2px 4px rgba(16,24,40,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(16,24,40,0.2), 0 4px 8px rgba(16,24,40,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(16,24,40,0.15), 0 2px 4px rgba(16,24,40,0.1)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(0.98)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,24,40,0.2), inset 0 1px 2px rgba(0,0,0,0.2)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 16px 32px rgba(16,24,40,0.2), 0 4px 8px rgba(16,24,40,0.15)";
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${companyColor}70, 0 8px 20px rgba(16,24,40,0.15)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(16,24,40,0.15), 0 2px 4px rgba(16,24,40,0.1)";
              }}
            >
              {/* Enhanced gloss effect */}
              <span 
                className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
                }}
              />
              {CTA_LABEL}
            </Link>

            {showSubcopy && (
              <p className="mt-2 text-[14px] leading-[20px] text-slate-800/90 tracking-[0.005em] text-center">
                {SUBCOPY}
              </p>
            )}

            {showTrust && (
              <div role="list" className="mt-3 grid grid-cols-2 gap-3 justify-items-center items-center">
                <PremiumCapsule ariaLabel="SOC 2 attestation" companyColor={companyColor}>SOC 2</PremiumCapsule>
                <PremiumCapsule ariaLabel="GDPR compliant" companyColor={companyColor}>GDPR</PremiumCapsule>
                <PremiumCapsule ariaLabel="NREL PVWatts data" companyColor={companyColor}>NREL PVWatts®</PremiumCapsule>
                <PremiumCapsule ariaLabel="Installers using Sunspire" companyColor={companyColor}>113+ installers live</PremiumCapsule>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: bottom-right pill */}
      <div className="hidden sm:block ml-auto pointer-events-auto">
        <div 
          className="rounded-2xl px-6 py-5 max-w-[440px] transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 10px 30px rgba(16,24,40,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
            outline: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Link
            href="/api/stripe/create-checkout-session"
            aria-label={
              companyName
                ? `Activate for ${companyName} — go live in 24 hours`
                : "Activate on your domain — go live in 24 hours"
            }
            className={[
              "relative inline-flex w-full items-center justify-center",
              "rounded-full text-white text-[17px] font-semibold tracking-[-0.01em]",
              "min-h-[56px] px-6",
              "transition-all duration-300 ease-out",
              "focus-visible:outline-none",
              "hover:-translate-y-[2px] hover:scale-[1.02]",
              "active:translate-y-0 active:scale-[0.98]",
              "group",
            ].join(" ")}
            style={{
              background: `linear-gradient(180deg, var(--brand-600, #2563eb) 0%, var(--brand-700, #1d4ed8) 100%)`,
              boxShadow: "0 8px 20px rgba(16,24,40,0.15), 0 2px 4px rgba(16,24,40,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 16px 32px rgba(16,24,40,0.2), 0 4px 8px rgba(16,24,40,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(16,24,40,0.15), 0 2px 4px rgba(16,24,40,0.1)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(0.98)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,24,40,0.2), inset 0 1px 2px rgba(0,0,0,0.2)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 16px 32px rgba(16,24,40,0.2), 0 4px 8px rgba(16,24,40,0.15)";
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 3px ${companyColor}70, 0 8px 20px rgba(16,24,40,0.15)`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(16,24,40,0.15), 0 2px 4px rgba(16,24,40,0.1)";
            }}
          >
            {/* Enhanced gloss effect */}
            <span 
              className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ 
                background: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
              }}
            />
            {CTA_LABEL}
          </Link>

          {showSubcopy && (
            <div className="mt-2 text-[14px] leading-[20px] text-slate-800/90 tracking-[0.005em] text-center">
              {SUBCOPY}
            </div>
          )}

          {showTrust && (
            <div role="list" className="mt-3 grid grid-cols-2 gap-3 justify-items-center items-center">
              <PremiumCapsule ariaLabel="SOC 2 attestation" companyColor={companyColor}>SOC 2</PremiumCapsule>
              <PremiumCapsule ariaLabel="GDPR compliant" companyColor={companyColor}>GDPR</PremiumCapsule>
              <PremiumCapsule ariaLabel="NREL PVWatts data" companyColor={companyColor}>NREL PVWatts®</PremiumCapsule>
              <PremiumCapsule ariaLabel="Installers using Sunspire" companyColor={companyColor}>113+ installers live</PremiumCapsule>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}