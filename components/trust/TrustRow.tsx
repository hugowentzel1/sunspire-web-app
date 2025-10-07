import { SITE_STATS, installersLivePlus } from "@/lib/siteStats";

export default function TrustRow() {
  return (
    <div
      data-testid="hero-trust-row"
      aria-label="Trust signals"
      className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-2 text-[13px] text-neutral-700"
    >
      <span>{installersLivePlus} Installers Live</span>
      <span className="text-neutral-300">•</span>
      <span>SOC 2 Compliant</span>
      <span className="text-neutral-300">•</span>
      <span>GDPR Ready</span>
      <span className="text-neutral-300">•</span>
      <span>NREL PVWatts®</span>
      <span className="text-neutral-300">•</span>
      <span>★ {SITE_STATS.rating}/5 rating</span>
    </div>
  );
}

