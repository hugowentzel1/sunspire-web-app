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
  /** CSS selector for cookie banner */
  cookieSelector?: string;
  /** CSS selector for chat widget */
  chatSelector?: string;
};

export default function StickyCTA({
  heroSelector = "#main-cta",
  label = "Activate on Your Domain — 24 Hours",
  href,
  subtext = "113+ installers live • SOC2 • GDPR • NREL PVWatts®",
  analyticsId,
  hideWhenCookieVisible = true,
  cookieSelector = "[data-cookie-banner]",
  chatSelector = "[data-chat-widget]",
}: StickyCTAProps) {
  const [hiddenByHero, setHiddenByHero] = useState(false);
  const [hiddenByCookie, setHiddenByCookie] = useState(false);
  const [offset, setOffset] = useState(0);
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

  // Compute dynamic bottom offset to avoid collisions (cookie/chat)
  useEffect(() => {
    const compute = () => {
      let extra = 0;
      const cookie = document.querySelector(cookieSelector) as HTMLElement | null;
      const chat = document.querySelector(chatSelector) as HTMLElement | null;
      if (cookie && cookie.offsetParent !== null) extra += cookie.getBoundingClientRect().height + 8;
      if (chat && chat.offsetParent !== null) extra += 56; // typical launcher size
      setOffset(extra);
    };
    compute();
    const ro = new ResizeObserver(compute);
    document.querySelectorAll(`${cookieSelector}, ${chatSelector}`).forEach(el => ro.observe(el));
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [cookieSelector, chatSelector]);

  const isHidden = hiddenByHero || hiddenByCookie;

  return (
    <>
      {/* Desktop: bottom-right card with improved sizing and elevation */}
      <div
        data-sticky-cta-desktop
        className={`hidden md:block fixed right-0 z-50 transition-opacity duration-200 ${
          isHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          bottom: `calc(32px + env(safe-area-inset-bottom) + ${offset}px)`,
          paddingRight: "env(safe-area-inset-right)"
        }}
        aria-hidden={isHidden}
      >
        <div className="rounded-2xl border bg-white/98 backdrop-blur supports-[backdrop-filter]:bg-white/80
                        border-black/5 shadow-[0_6px_16px_rgba(0,0,0,.12)]">
          <div className="p-4">
            <Link
              id={`sticky-desktop-${id}`}
              href={href}
              className="block w-full min-h-[50px] px-5 rounded-xl font-semibold text-center leading-[50px] text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)] focus-visible:ring-offset-2 transition-colors"
              data-analytics={analyticsId || undefined}
            >
              {label}
            </Link>
            {subtext ? (
              <div className="mt-2 text-[13px] text-neutral-600 text-center">
                {subtext}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile: full-width sticky bar */}
      <div
        className={`md:hidden fixed inset-x-0 z-50 transition-transform duration-200 ${
          isHidden ? "translate-y-full" : "translate-y-0"
        }`}
        style={{
          bottom: `calc(0px + env(safe-area-inset-bottom) + ${offset}px)`
        }}
        aria-hidden={isHidden}
      >
        <div className="mx-3 mb-3 rounded-2xl border bg-white/98 backdrop-blur border-black/5 shadow-[0_6px_16px_rgba(0,0,0,.12)]">
          <Link
            id={`sticky-mobile-${id}`}
            href={href}
            className="block w-full min-h-[52px] px-5 rounded-2xl font-semibold text-center leading-[52px] text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)] focus-visible:ring-offset-2 transition-colors"
            data-analytics={analyticsId || undefined}
          >
            {label}
          </Link>
          {subtext ? (
            <div className="px-4 pt-1 pb-3 text-[12.5px] text-neutral-600 text-center">
              {subtext}
            </div>
          ) : null}
        </div>
      </div>

      {/* Reduced motion: soft fade only */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          [data-sticky-cta-desktop] .transition-opacity { transition: none !important; }
        }

        /* tiny micro-nudge to avoid crowding the container gutter on mid-width laptops */
        @media (min-width:1210px) and (max-width:1360px) {
          [data-sticky-cta-desktop] { right: 6px; }
        }
      `}</style>
    </>
  );
}