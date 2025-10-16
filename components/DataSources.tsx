// components/DataSources.tsx
// Premium, luxurious styling that fits cohesively with the site

'use client';

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

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
  const b = useBrandTakeover();
  const brandColor = b.primary || '#2563eb';
  
  return (
    <section
      aria-label="Data sources and methodology"
      className="mx-auto mt-20 mb-16 w-full max-w-5xl px-4"
    >
      {/* Title - Premium with brand color accent */}
      <div className="mb-8 text-center">
        <div 
          className="inline-block mb-2 h-1 w-12 rounded-full"
          style={{ backgroundColor: brandColor }}
        />
        <h3 className="text-base font-bold tracking-wide text-gray-800 uppercase mb-2">
          Powered by Verified Industry Data
        </h3>
        <p className="text-sm text-gray-500">
          Trusted by solar professionals nationwide
        </p>
      </div>

      {/* Pill row - Premium badges with consistent spacing */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center gap-2.5 rounded-lg bg-white border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm transition-shadow hover:shadow-md">
          <span aria-hidden className="text-lg">⚡</span>
          <span>NREL PVWatts® v8</span>
        </span>
        <span className="inline-flex items-center gap-2.5 rounded-lg bg-white border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm transition-shadow hover:shadow-md">
          <span aria-hidden className="text-lg">💰</span>
          <span>{utilityLabel}</span>
        </span>
        {showLidar && (
          <span className="inline-flex items-center gap-2.5 rounded-lg bg-white border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm transition-shadow hover:shadow-md">
            <span aria-hidden className="text-lg">☀️</span>
            <span>LiDAR Roof Shading</span>
          </span>
        )}
      </div>

      {/* Disclaimer Container - Luxurious gradient background with brand color accent */}
      <div 
        className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl border shadow-lg overflow-hidden"
        style={{ borderColor: `${brandColor}20` }}
      >
        {/* Subtle top accent line with brand color */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${brandColor}, transparent)`,
            opacity: 0.3
          }}
        />
        
        <div className="p-10">
          {/* Main Disclaimer - Clear and Professional */}
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-gray-800 mb-6">
            <span className="font-bold" style={{ color: brandColor }}>Modeled estimate</span> — not a performance guarantee. 
            <span className="text-gray-700"> Actual production and savings depend on site conditions, equipment, installation quality, weather, and utility tariffs.</span>
          </p>

          {/* Elegant divider with brand color */}
          <div className="flex items-center justify-center my-6">
            <div className="h-px w-8 bg-gray-300" />
            <div 
              className="mx-3 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: brandColor }}
            />
            <div className="h-px w-8 bg-gray-300" />
          </div>

          {/* Methodology - Complete and Elegant */}
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Analysis Methodology
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              <span className="font-semibold text-gray-700">NREL PVWatts® v8</span> (2020 TMY climate data)
              <span className="mx-2 text-gray-400">•</span>
              <span className="font-semibold text-gray-700">OpenEI URDB / EIA</span> utility rates (updated {lastUpdated})
              {showLidar && (
                <>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="font-semibold text-gray-700">High-resolution LiDAR</span> shading analysis
                </>
              )}
              <span className="mx-2 text-gray-400">•</span>
              <span className="font-semibold text-gray-700">Financial assumptions:</span> 30% ITC, 0.5%/yr panel degradation, $22/kW/yr O&amp;M
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
