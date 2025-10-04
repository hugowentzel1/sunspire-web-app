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

// Luxury trust badge with Sunspire-native styling
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
        "relative inline-flex items-center justify-center gap-2",
        "rounded-full select-none",
        "h-10 sm:h-11 w-[168px] sm:w-[180px] px-3",
        "text-[14px] leading-[18px] font-medium",
        "ring-1 ring-[rgba(0,0,0,0.82)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_0_rgba(16,24,40,0.06)]",
        "overflow-hidden whitespace-nowrap text-ellipsis",
        "transition-all duration-150 ease-out",
        "hover:-translate-y-[0.5px] hover:shadow-[0_2px_10px_rgba(16,24,40,0.06)]",
        className,
      ].join(" ")}
      style={{
        background: `linear-gradient(180deg, #ffffff 0%, color-mix(in srgb, var(--brand-50, #f6f8fc) 14%, #ffffff 86%) 100%)`,
        color: "rgb(23,23,23)",
      }}
    >
      {/* Inner hairline for Sunspire card sheen */}
      <span 
        className="absolute inset-[1px] rounded-full pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.6)"
        }}
      />
      <Icon 
        aria-hidden 
        className="h-[15px] w-[15px] stroke-[1.75] flex-shrink-0" 
        style={{ color: "var(--brand-600)" }} 
      />
      <span className="min-w-0 overflow-hidden text-ellipsis text-slate-900">{children}</span>
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
          <div className="rounded-2xl bg-white/92 ring-1 ring-black/5 shadow-[0_10px_30px_rgba(16,24,40,0.08)] backdrop-blur-[6px] px-5 py-4 transition-all duration-200">
            <Link
              href={href}
              aria-label={
                companyName
                  ? `Activate for ${companyName} — go live in 24 hours`
                  : "Activate on your domain — go live in 24 hours"
              }
              className={[
                "relative inline-flex w-full items-center justify-center",
                "rounded-full text-white text-[16px] font-semibold tracking-[-0.01em]",
                "min-h-[52px] px-5",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-600)]",
                "hover:brightness-[1.03] active:brightness-[0.98]",
                "hover:-translate-y-[1px]",
                "hover:shadow-[0_12px_24px_rgba(16,24,40,0.12)]",
              ].join(" ")}
              style={{
                background: `linear-gradient(180deg, var(--brand-600, #2563eb) 0%, var(--brand-700, #1d4ed8) 100%)`,
              }}
            >
              {/* Optional top gloss */}
              <span 
                className="absolute inset-x-2 top-1.5 h-[16%] rounded-full pointer-events-none"
                style={{ background: "rgba(255,255,255,.18)" }}
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
        <div className="rounded-2xl bg-white/92 ring-1 ring-black/5 shadow-[0_10px_30px_rgba(16,24,40,0.08)] backdrop-blur-[6px] px-6 py-5 max-w-[440px] transition-all duration-200">
          <Link
            href={href}
            aria-label={
              companyName
                ? `Activate for ${companyName} — go live in 24 hours`
                : "Activate on your domain — go live in 24 hours"
            }
            className={[
              "relative inline-flex w-full items-center justify-center",
              "rounded-full text-white text-[17px] font-semibold tracking-[-0.01em]",
              "min-h-[56px] px-6",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-600)]",
              "hover:brightness-[1.03] active:brightness-[0.98]",
              "hover:-translate-y-[1px]",
              "hover:shadow-[0_12px_24px_rgba(16,24,40,0.12)]",
            ].join(" ")}
            style={{
              background: `linear-gradient(180deg, var(--brand-600, #2563eb) 0%, var(--brand-700, #1d4ed8) 100%)`,
            }}
          >
            {/* Optional top gloss */}
            <span 
              className="absolute inset-x-2 top-1.5 h-[16%] rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,.18)" }}
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