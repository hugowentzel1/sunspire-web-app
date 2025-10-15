// components/DataSources.tsx
// Tailwind only (works great with shadcn/ui tokens).
// Pass the utility label and your last-updated date.

type Props = {
  utilityLabel?: string;          // e.g., "Pacific Gas & Electric — E-1"
  lastUpdated?: string;           // e.g., "2025-10-15"
  showLidar?: boolean;            // toggle if LiDAR isn't available everywhere
};

export default function DataSources({
  utilityLabel = "Current Local Utility Tariff",
  lastUpdated = "2025-10-15",
  showLidar = true,
}: Props) {
  return (
    <section
      aria-label="Data sources and methodology"
      className="mx-auto mt-10 w-full max-w-5xl rounded-2xl border border-border/70 bg-muted/20 p-6 backdrop-blur"
    >
      {/* Title */}
      <div className="mb-4 text-center text-sm font-medium tracking-tight text-foreground">
        Powered by Verified Industry Data
      </div>

      {/* Pill row */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs text-foreground/80">
          <span aria-hidden>⚡</span>
          NREL PVWatts® v8
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs text-foreground/80">
          <span aria-hidden>💰</span>
          {utilityLabel}
        </span>
        {showLidar && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs text-foreground/80">
            <span aria-hidden>☀️</span>
            LiDAR Roof Shading
          </span>
        )}
      </div>

      {/* Calm disclaimer */}
      <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
        Modeled estimate — not a performance guarantee. Actual production and savings depend on site
        conditions, equipment, installation quality, weather, and utility tariffs.
      </p>

      {/* Divider */}
      <div className="mx-auto my-4 h-px w-24 bg-border/70" />

      {/* Methodology (complete but compact) */}
      <p className="mx-auto max-w-4xl text-center text-[11px] leading-relaxed text-muted-foreground">
        Methodology: NREL PVWatts® v8 (2020 TMY climate data) • OpenEI URDB / EIA utility rates
        (updated {lastUpdated}){showLidar ? " • High-resolution LiDAR shading analysis" : ""} •
        Financial assumptions: 30% ITC, 0.5%/yr panel degradation, $22/kW/yr O&amp;M.
      </p>
    </section>
  );
}
