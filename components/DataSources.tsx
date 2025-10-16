// components/DataSources.tsx
// Premium, luxurious styling that fits cohesively with the site

type Props = {
  utilityLabel?: string;
  lastUpdated?: string;
  showLidar?: boolean;
};

export default function DataSources({
  utilityLabel = "Current Local Utility Tariff",
  lastUpdated = "2025-10-15",
  showLidar = true,
}: Props) {
  return (
    <section
      aria-label="Data sources and methodology"
      className="mx-auto mt-16 mb-12 w-full max-w-4xl"
    >
      {/* Title - Elegant and Minimal */}
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
          Powered by Verified Industry Data
        </p>
      </div>

      {/* Pill row - Premium styling with better spacing */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
          <span aria-hidden className="text-base">⚡</span>
          <span>NREL PVWatts® v8</span>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
          <span aria-hidden className="text-base">💰</span>
          <span>{utilityLabel}</span>
        </span>
        {showLidar && (
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
            <span aria-hidden className="text-base">☀️</span>
            <span>LiDAR Roof Shading</span>
          </span>
        )}
      </div>

      {/* Disclaimer - Professional and Clear */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-gray-700 mb-4">
          <span className="font-semibold">Modeled estimate</span> — not a performance guarantee. Actual production and savings depend on site conditions, equipment, installation quality, weather, and utility tariffs.
        </p>

        {/* Subtle divider */}
        <div className="mx-auto my-5 h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Methodology - Complete but elegant */}
        <p className="mx-auto max-w-4xl text-center text-xs leading-relaxed text-gray-600">
          <span className="font-medium">Methodology:</span> NREL PVWatts® v8 (2020 TMY climate data) • OpenEI URDB / EIA utility rates (updated {lastUpdated}){showLidar ? " • High-resolution LiDAR shading analysis" : ""} • Financial assumptions: 30% ITC, 0.5%/yr panel degradation, $22/kW/yr O&amp;M
        </p>
      </div>
    </section>
  );
}
