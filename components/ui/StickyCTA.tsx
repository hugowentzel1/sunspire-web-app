"use client";
import { useEffect, useState } from "react";
import { useCookieBannerOffset } from "../hooks/useCookieBannerOffset";

function useChartSeenOrHalfScroll() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const chart = document.getElementById("savings-chart");
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = (window.scrollY + window.innerHeight) / (doc.scrollHeight || document.body.scrollHeight);
      if (scrolled > 0.5) setReady(true);
    };
    const io = chart ? new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setReady(true)), { threshold: 0.2 }) : null;
    window.addEventListener("scroll", onScroll, { passive: true });
    if (chart && io) io.observe(chart);
    return () => { window.removeEventListener("scroll", onScroll); io?.disconnect(); };
  }, []);
  return ready;
}

export default function StickyCta() {
  const seen = useChartSeenOrHalfScroll();
  const { offsetBottomPx } = useCookieBannerOffset();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const nearFooter = window.innerHeight + window.scrollY > document.body.scrollHeight - 640;
      const modalOpen = !!document.querySelector('[data-modal-open="true"]');
      const tiny = window.innerHeight < 540;
      setHidden(nearFooter || modalOpen || tiny || !seen);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [seen]);

  if (hidden) return null;
  return (
    <aside data-testid="sticky-cta"
           className="fixed right-4 z-40 w-[92%] max-w-[420px] md:max-w-[480px] rounded-2xl border border-neutral-200/70 bg-white/85 p-4 shadow-lg backdrop-blur-md"
           style={{ bottom: 16 + offsetBottomPx }}>
      <button aria-label="Launch on Your Domain in 24 Hours"
              className="w-full rounded-xl bg-[#2F80ED] px-4 py-3 text-[15px] font-semibold text-white"
              onClick={() => (window.location.href = "/pricing")}>
        Launch on Your Domain in 24 Hours
      </button>
      <p className="mt-2 text-center text-[12px] text-neutral-700">
        $99/mo + $399 setup • Cancel anytime • Stripe secured
      </p>
      <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-neutral-600">
        <span>SOC 2</span><span>•</span><span>GDPR</span><span>•</span><span>NREL PVWatts®</span>
      </div>
    </aside>
  );
}