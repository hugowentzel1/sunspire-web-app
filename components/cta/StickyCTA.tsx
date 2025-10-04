import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ShieldCheck, Lock, BarChart3, Users } from "lucide-react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

/**
 * Premium sticky CTA for Sunspire:
 * - Dynamic company color from URL/theme (no hardcoded colors)
 * - Luxury gradient trust badges with subtle company color tints
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
const BRAND_50  = "var(--brand-50, #f5f7fa)";
const BRAND_600 = "var(--brand-600, #2563eb)"; // fallback: blue-600
const BRAND_700 = "var(--brand-700, #1d4ed8)";

const NEUTRAL_800 = "rgb(38 38 38)"; // neutral text tone
const CARD_BG     = "#FFFFFF";       // pure white pill surface

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

// Uniform trust badge with fixed dimensions and white background
function PremiumBadge({
  icon: Icon,
  children,
  ariaLabel,
  className,
  companyColor,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  companyColor: string;
}) {
  return (
    <span
      role="listitem"
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-full select-none",
        // Fixed height and equal width on breakpoints:
        "h-10 sm:h-10",
        "w-[168px] sm:w-[172px]",              // equal pill width
        "px-3",                                 // inner padding (keeps icon/label comfy)
        "text-[13px] leading-[18px] font-medium",
        "transition-colors duration-150 ease-out",
        "overflow-hidden",                      // prevent spill
        "whitespace-nowrap",
        className,
      ].join(" ")}
      style={{
        backgroundColor: "#FFFFFF",            // pure white surface
        color: "rgb(38 38 38)",
        border: "1px solid rgba(0,0,0,0.85)",  // BLACK outline as requested
      }}
      // subtle hover tint using brand-50; safe if var is present
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--brand-50, #f5f7fa) 18%, #FFFFFF)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
    >
      <Icon aria-hidden className="h-[14px] w-[14px] flex-shrink-0" style={{ color: companyColor }} />
      <span className="min-w-0 overflow-hidden text-ellipsis">{children}</span>
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
        "fixed z-[70] pointer-events-none w-full sm:w-auto",
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
          <div className="rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-black/5 px-6 py-5">
            <Link
              href={href}
              aria-label={
                companyName
                  ? `Activate for ${companyName} — go live in 24 hours`
                  : "Activate on your domain — go live in 24 hours"
              }
              className={[
                "block w-full rounded-full text-white font-bold",
                "text-[16px] leading-tight tracking-[-0.01em]",
                "px-6 py-4 min-h-[56px]",
                "transition-all duration-200 ease-in-out",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "hover:shadow-lg transform hover:-translate-y-0.5",
              ].join(" ")}
              style={{
                backgroundColor: companyColor,
              }}
            >
              {CTA_LABEL}
            </Link>

            {showSubcopy && (
              <p className="mt-2 text-center text-[13px] leading-5 text-neutral-700">
                {SUBCOPY}
              </p>
            )}

            {showTrust && (
              <div role="list" className="mt-3 grid grid-cols-2 gap-3 justify-items-center items-center">
                <PremiumBadge icon={ShieldCheck} ariaLabel="SOC 2 attestation" companyColor={companyColor}>SOC 2</PremiumBadge>
                <PremiumBadge icon={Lock}        ariaLabel="GDPR compliant" companyColor={companyColor}>GDPR</PremiumBadge>
                <PremiumBadge icon={BarChart3}   ariaLabel="NREL PVWatts data" companyColor={companyColor}>NREL PVWatts®</PremiumBadge>
                <PremiumBadge icon={Users}       ariaLabel="Installers using Sunspire" companyColor={companyColor}>113+ installers live</PremiumBadge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: bottom-right pill */}
      <div className="hidden sm:block ml-auto pointer-events-auto">
        <div className="rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.15)] ring-1 ring-black/5 px-6 py-6 max-w-[440px]">
          <Link
            href={href}
            aria-label={
              companyName
                ? `Activate for ${companyName} — go live in 24 hours`
                : "Activate on your domain — go live in 24 hours"
            }
            className={[
              "inline-flex w-full items-center justify-center rounded-full text-white font-bold",
              "text-[17px] leading-tight tracking-[-0.01em]",
              "px-6 py-5 min-h-[64px]",
              "transition-all duration-200 ease-in-out",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "hover:shadow-lg transform hover:-translate-y-0.5",
            ].join(" ")}
            style={{
              backgroundColor: companyColor,
            }}
          >
            {CTA_LABEL}
          </Link>

          {showSubcopy && (
            <div className="mt-2 text-center text-[13px] leading-5 text-neutral-700">
              {SUBCOPY}
            </div>
          )}

          {showTrust && (
            <div role="list" className="mt-3 grid grid-cols-2 gap-3 justify-items-center items-center">
              <PremiumBadge icon={ShieldCheck} ariaLabel="SOC 2 attestation" companyColor={companyColor}>SOC 2</PremiumBadge>
              <PremiumBadge icon={Lock}        ariaLabel="GDPR compliant" companyColor={companyColor}>GDPR</PremiumBadge>
              <PremiumBadge icon={BarChart3}   ariaLabel="NREL PVWatts data" companyColor={companyColor}>NREL PVWatts®</PremiumBadge>
              <PremiumBadge icon={Users}       ariaLabel="Installers using Sunspire" companyColor={companyColor}>113+ installers live</PremiumBadge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}