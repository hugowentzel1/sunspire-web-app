"use client";
import { useEffect, useId, useState } from "react";
import Link from "next/link";

type StickyCTAProps = {
  /** CSS selector for the main/hero CTA to observe */
  heroSelector?: string;
  /** Button label */
  label?: string;
  /** Destination href */
  href: string;
  /** Optional small trust line under button */
  subtext?: string;
  /** Optional analytics id */
  analyticsId?: string;
  /** If true, auto-hide sticky whenever cookie banner is visible */
  hideWhenCookieVisible?: boolean;
};

export default function StickyCTA({
  heroSelector = "#main-cta",
  label = "Activate on Your Domain — 24 Hours",
  href,
  subtext = "113+ installers live • SOC2 • GDPR • NREL PVWatts®",
  analyticsId,
  hideWhenCookieVisible = true,
}: StickyCTAProps) {
  const [hiddenByHero, setHiddenByHero] = useState(false);
  const [hiddenByCookie, setHiddenByCookie] = useState(false);
  const id = useId();

  useEffect(() => {
    // Hide when hero CTA is visible
    const hero = document.querySelector(heroSelector);
    if (!hero) {
      setHiddenByHero(false); // If no hero CTA, don't hide sticky CTA
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setHiddenByHero(entry.isIntersecting),
      { rootMargin: "0px 0px -30% 0px", threshold: 0.1 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [heroSelector]);

  useEffect(() => {
    if (!hideWhenCookieVisible) return;
    const root = document.documentElement;
    const update = () => setHiddenByCookie(root.hasAttribute("data-cookie-visible"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(root, { attributes: true, attributeFilter: ["data-cookie-visible"] });
    return () => mo.disconnect();
  }, [hideWhenCookieVisible]);

  const isHidden = hiddenByHero || hiddenByCookie;

  return (
    <>
      {/* Desktop: bottom-right positioned with larger responsive size */}
      <div
        className={`hidden md:block fixed z-50 transition-opacity ${
          isHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          bottom: `calc(24px + env(safe-area-inset-bottom) + var(--cookie-offset, 0px))`,
          right: "1rem",
          width: "clamp(280px, 28vw, 400px)",
          paddingRight: "env(safe-area-inset-right)",
        }}
        aria-hidden={isHidden}
      >
        <div
          className="rounded-2xl bg-white border border-neutral-200 shadow-lg"
          role="complementary"
          aria-label="Sticky action"
        >
          <div className="p-5">
            <Link
              id={`sticky-desktop-${id}`}
              href={href}
              className="block w-full h-12 px-5 rounded-xl font-semibold text-center leading-[48px] text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-600)] transition-all duration-200 hover:scale-[1.02]"
              data-analytics={analyticsId || undefined}
            >
              {label}
            </Link>
            {subtext ? (
              <p className="mt-3 text-[11px] leading-4 text-neutral-500 text-center">
                {subtext}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile: full-width bottom bar; offset by cookie height */}
      <div
        className={`fixed inset-x-0 z-50 md:hidden transition-transform ${
          isHidden ? "translate-y-full" : "translate-y-0"
        }`}
        style={{
          // anchor at bottom, but lift by cookie offset
          bottom: `calc(0px + var(--cookie-offset, 0px))`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        aria-hidden={isHidden}
      >
        <div className="mx-auto max-w-[1200px] px-4 py-3">
          <Link
            id={`sticky-mobile-${id}`}
            href={href}
            className="block w-full h-12 px-7 rounded-xl font-semibold text-center leading-[48px] text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-600)]"
            data-analytics={analyticsId || undefined}
          >
            {label}
          </Link>
        </div>
      </div>
    </>
  );
}
