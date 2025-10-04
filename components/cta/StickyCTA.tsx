import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

const CTA_LABEL = "Activate on Your Domain — 24 Hours";
const SUBCOPY   = "$99/mo + $399 setup • Cancel anytime";

// Add or adjust selectors depending on your cookie banner implementation
const COOKIE_SELECTORS = [
  '[data-cookie-banner]',
  '#cookie-consent',
  '.cookie-banner',
  '.cc-window'
];

export default function StickyCTA() {
  const [bottomOffset, setBottomOffset] = useState<number>(16);
  const moRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const updateSafeArea = () => {
      const root = document.documentElement;
      const probe = document.createElement("div");
      probe.style.cssText = `
        position: fixed; inset: auto 0 0 0;
        padding-bottom: env(safe-area-inset-bottom);
        visibility: hidden; pointer-events: none;
      `;
      document.body.appendChild(probe);
      const pb = parseFloat(getComputedStyle(probe).paddingBottom || "0");
      root.style.setProperty("--safe-bottom", `${pb || 0}px`);
      probe.remove();
    };

    const calcOffset = () => {
      const root = document.documentElement;
      const safe = Number(root.style.getPropertyValue("--safe-bottom").replace("px", "")) || 0;

      let cookieHeight = 0;
      for (const sel of COOKIE_SELECTORS) {
        const el = document.querySelector<HTMLElement>(sel);
        if (el && el.offsetParent !== null) {
          cookieHeight = Math.max(cookieHeight, el.getBoundingClientRect().height);
        }
      }

      const BASE = 16;
      const next = BASE + safe + (cookieHeight > 0 ? cookieHeight : 0);
      setBottomOffset(next);
    };

    updateSafeArea();
    calcOffset();

    // Watch DOM for cookie banner
    moRef.current = new MutationObserver(calcOffset);
    moRef.current.observe(document.body, { childList: true, subtree: true, attributes: true });

    window.addEventListener("resize", calcOffset);

    return () => {
      window.removeEventListener("resize", calcOffset);
      moRef.current?.disconnect();
    };
  }, []);

  return (
    <div
      className="fixed z-[70] pointer-events-none w-full sm:w-auto"
      style={{ left: "16px", right: "16px", bottom: `${bottomOffset}px` }}
    >
      {/* Mobile: full-width sticky bar */}
      <div className="sm:hidden pointer-events-auto">
        <div className="mx-auto max-w-[720px]">
          <div className="flex items-center justify-between rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/75">
            <Link
              href="/pricing"
              aria-label="Activate on your domain — go live in 24 hours"
              className="flex-1 text-center rounded-lg bg-red-600 text-white font-semibold px-4 py-3 min-h-[52px]"
            >
              {CTA_LABEL}
            </Link>
          </div>
          <p className="mt-1 text-center text-xs text-neutral-600">{SUBCOPY}</p>
        </div>
      </div>

      {/* Desktop: bottom-right pill */}
      <div className="hidden sm:block ml-auto mr-4 pointer-events-auto">
        <div className="rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/75 max-w-[400px]">
          <Link
            href="/pricing"
            aria-label="Activate on your domain — go live in 24 hours"
            className="inline-flex items-center justify-center rounded-full bg-red-600 text-white font-semibold px-6 py-4 min-h-[56px] w-full hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            {CTA_LABEL}
          </Link>
          <div className="mt-1.5 text-center text-[12px] text-neutral-700">{SUBCOPY}</div>
        </div>
      </div>
    </div>
  );
}