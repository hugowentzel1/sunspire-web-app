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
};

export default function StickyCTA({
  heroSelector = "#main-cta",
  label = "Activate on Your Domain — 24 Hours",
  href,
  subtext = "113+ installers live • SOC2 • GDPR • NREL PVWatts®",
  analyticsId,
}: StickyCTAProps) {
  const [hidden, setHidden] = useState(false);
  const obsId = useId();

  useEffect(() => {
    const hero = document.querySelector(heroSelector);
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -30% 0px", threshold: 0.1 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [heroSelector]);

  return (
    <>
      {/* Desktop: FLUSH-RIGHT BOTTOM-RIGHT (never mid-right) */}
      <div
        data-sticky-cta-desktop=""
        data-analytics={analyticsId || undefined}
        className={`hidden md:block fixed bottom-6 right-0 z-50 transition-opacity ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ paddingRight: "env(safe-area-inset-right)" }}
        aria-hidden={hidden}
      >
        <div
          className="rounded-l-xl bg-white/95 backdrop-blur border border-neutral-200 shadow-lg"
          role="complementary"
          aria-label="Sticky action"
        >
          <div className="p-3 min-w-[220px]">
            <Link
              id={`sticky-desktop-${obsId}`}
              href={href}
              className="inline-flex items-center justify-center h-12 px-7 rounded-xl font-semibold text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-600)]"
            >
              {label}
            </Link>
            {subtext ? (
              <p className="mt-2 text-[11px] leading-4 text-neutral-600">
                {subtext}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile: FULL-WIDTH bottom bar */}
      <div
        data-sticky-cta-mobile=""
        data-analytics={analyticsId || undefined}
        className={`fixed inset-x-0 bottom-0 z-50 md:hidden transition-transform ${
          hidden ? "translate-y-full" : "translate-y-0"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-hidden={hidden}
      >
        <div className="mx-auto max-w-[1200px] px-4 py-3">
          <Link
            id={`sticky-mobile-${obsId}`}
            href={href}
            className="block w-full h-12 px-7 rounded-xl font-semibold text-center leading-[48px] text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand-600)]"
          >
            {label}
          </Link>
        </div>
      </div>
    </>
  );
}
