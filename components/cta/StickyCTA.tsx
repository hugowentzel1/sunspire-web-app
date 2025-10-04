import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ShieldCheck, Lock, SunMedium, Users } from "lucide-react";

/**
 * Brand-aware sticky CTA for Sunspire:
 * - All color accents use CSS vars:
 *   --brand-50, --brand-600, --brand-700
 * - No hardcoded reds.
 * - Cookie-aware offset (no overlap, no jitter).
 * - Luxury quiet trust badges: near-white pills, brand line icons, neutral text.
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

// Quiet, luxury pill badge (brand icon, neutral text, black outline)
function QuietBadge({
  icon: Icon,
  children,
  ariaLabel,
  className,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <span
      role="listitem"
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center gap-2 rounded-full border",
        "px-3 py-[7px]",
        "text-[13px] leading-[18px] font-medium",
        "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
        "transition-colors duration-150 ease-out",
        className,
      ].join(" ")}
      style={{
        backgroundColor: CARD_BG,
        color: NEUTRAL_800,
        borderColor: "rgb(0, 0, 0)", // Black outline
      }}
    >
      {/* crisp line icon in brand color */}
      <Icon aria-hidden className="h-[14px] w-[14px]" style={{ color: BRAND_600 }} />
      <span className="whitespace-nowrap">{children}</span>
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
  const [bottomOffset, setBottomOffset] = useState<number>(16);

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

          const BASE = 16; // inset from bottom when no banner
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
        // mobile: full width with 16px side insets; desktop: true bottom-right (no left)
        "left-4 right-4 sm:left-auto sm:right-4"
      )}
      style={{ bottom: `${bottomOffset}px` }}
      aria-live="polite"
    >
      {/* Mobile: full-width sticky bar (unchanged size) */}
      <div className="sm:hidden pointer-events-auto">
        <div className="mx-auto max-w-[720px]">
          <div className="rounded-2xl bg-white/90 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 px-4 py-4">
            <Link
              href={href}
              aria-label={
                companyName
                  ? `Activate for ${companyName} — go live in 24 hours`
                  : "Activate on your domain — go live in 24 hours"
              }
              className={[
                "block w-full rounded-full text-white",
                "text-[16px] font-semibold leading-tight tracking-[-0.01em]",
                "px-5 py-3.5 min-h-[52px]",
                "transition-colors",
                // brand-aware background + hover + focus ring
                "focus:outline-none focus-visible:ring-2",
                "focus-visible:ring-[color:var(--brand-600)]",
                "hover:bg-[color:var(--brand-700)]",
                "bg-[color:var(--brand-600)]",
              ].join(" ")}
              // no inline styles needed; classes above use CSS vars
            >
              {CTA_LABEL}
            </Link>

            {showSubcopy && (
              <p className="mt-2 text-center text-[13px] leading-5 text-neutral-700">
                {SUBCOPY}
              </p>
            )}

            {showTrust && (
              <div role="list" className="mt-3 grid grid-cols-3 gap-3 justify-items-center">
                <QuietBadge icon={ShieldCheck} ariaLabel="SOC 2 attestation">SOC 2</QuietBadge>
                <QuietBadge icon={Lock}        ariaLabel="GDPR compliant">GDPR</QuietBadge>
                <QuietBadge icon={SunMedium}   ariaLabel="NREL PVWatts data">NREL PVWatts®</QuietBadge>
                <QuietBadge icon={Users}       ariaLabel="Installers using Sunspire" className="col-start-2">113+ installers live</QuietBadge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: bottom-right pill (unchanged size) */}
      <div className="hidden sm:block ml-auto pointer-events-auto">
        <div className="rounded-2xl bg-white/90 backdrop-blur shadow-[0_12px_36px_rgba(0,0,0,0.08)] ring-1 ring-black/5 px-5 py-5 max-w-[420px]">
          <Link
            href={href}
            aria-label={
              companyName
                ? `Activate for ${companyName} — go live in 24 hours`
                : "Activate on your domain — go live in 24 hours"
            }
            className={[
              "inline-flex w-full items-center justify-center rounded-full text-white",
              "text-[17px] font-semibold leading-tight tracking-[-0.01em]",
              "px-6 py-4 min-h-[60px]",
              "transition-colors",
              // brand-aware states
              "focus:outline-none focus-visible:ring-2",
              "focus-visible:ring-[color:var(--brand-600)]",
              "hover:bg-[color:var(--brand-700)]",
              "bg-[color:var(--brand-600)]",
            ].join(" ")}
          >
            {CTA_LABEL}
          </Link>

          {showSubcopy && (
            <div className="mt-2 text-center text-[13px] leading-5 text-neutral-700">
              {SUBCOPY}
            </div>
          )}

          {showTrust && (
            <div role="list" className="mt-3 grid grid-cols-3 gap-3 justify-items-center">
              <QuietBadge icon={ShieldCheck} ariaLabel="SOC 2 attestation">SOC 2</QuietBadge>
              <QuietBadge icon={Lock}        ariaLabel="GDPR compliant">GDPR</QuietBadge>
              <QuietBadge icon={SunMedium}   ariaLabel="NREL PVWatts data">NREL PVWatts®</QuietBadge>
              <QuietBadge icon={Users}       ariaLabel="Installers using Sunspire" className="col-start-2">113+ installers live</QuietBadge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}