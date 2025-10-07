import { SITE_STATS, installersLivePlus } from "@/lib/siteStats";

export default function TrustRow() {
  return (
    <div
      data-testid="hero-trust-row"
      aria-label="Trust signals"
      className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-2 text-[13px] text-neutral-700"
    >
      {/* Emojis are subdued for a premium look */}
      <span className="opacity-60" aria-hidden>👥</span>
      <span>{installersLivePlus} installers live</span>

      <span className="text-neutral-300">•</span>
      <span className="opacity-60" aria-hidden>🔒</span>
      <span>SOC 2</span>

      <span className="text-neutral-300">•</span>
      <span className="opacity-60" aria-hidden>🛡️</span>
      <span>GDPR</span>

      <span className="text-neutral-300">•</span>
      <span className="opacity-60" aria-hidden>☀️</span>
      <span>NREL PVWatts®</span>

      <span className="text-neutral-300">•</span>
      <span className="opacity-60 text-neutral-500" aria-hidden>★</span>
      <span>{SITE_STATS.rating}/5 rating</span>
    </div>
  );
}

