import { SITE_STATS, installersLivePlus } from "@/lib/siteStats";

export default function TrustRow() {
  // Single compact line under hero CTA
  return (
    <div
      data-testid="hero-trust-row"
      aria-label="Trust signals"
      className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-2 text-[13px] text-neutral-700"
    >
      {/* Emoji spans: subdued & vertically aligned */}
      <span className="opacity-60 inline-block align-middle leading-[1]" style={{ transform: 'translateY(-0.5px)' }} aria-hidden>👥</span>
      <span>{installersLivePlus} installers live</span>

      <span className="text-neutral-300">•</span>
      <span className="opacity-60 inline-flex items-center" aria-hidden>🔒</span>
      <span>SOC 2</span>

      <span className="text-neutral-300">•</span>
      <span className="opacity-60 inline-flex items-center" aria-hidden>🛡️</span>
      <span>GDPR</span>

      <span className="text-neutral-300">•</span>
      <span className="opacity-60 inline-flex items-center" aria-hidden>☀️</span>
      <span>NREL PVWatts®</span>

      <span className="text-neutral-300">•</span>
      <span className="opacity-60 inline-flex items-center text-neutral-500" aria-hidden>★</span>
      <span>{SITE_STATS.rating}/5 rating</span>
    </div>
  );
}

