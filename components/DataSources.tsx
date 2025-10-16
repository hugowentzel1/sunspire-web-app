// components/DataSources.tsx
// Premium, luxurious styling that fits cohesively with the site

'use client';

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

type Props = {
  utilityLabel?: string;
  lastUpdated?: string;
  showLidar?: boolean;
  shadingMethod?: 'remote' | 'proxy';
};

export default function DataSources({
  utilityLabel = "Current Local Utility Tariff",
  lastUpdated = "2025-10-15",
  showLidar = true,
  shadingMethod = 'proxy',
}: Props) {
  const shadingLabel = shadingMethod === 'remote' ? 'High-Resolution LiDAR Shading' : 'Geographic Shading Analysis';
  
  return (
    <section
      aria-label="Data sources and methodology"
      className="mx-auto mt-16 mb-12 w-full max-w-4xl px-6"
    >
      {/* Clean professional container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-md p-10">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase mb-2">
            Powered by Verified Industry Data
          </h3>
          <div className="mx-auto h-px w-12 bg-gray-300 mt-3" />
        </div>

        {/* Data Sources - Perfectly centered with even spacing */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <span className="text-sm font-semibold text-gray-800">NREL PVWatts® v8</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-sm font-semibold text-gray-800">{utilityLabel}</span>
          {showLidar && (
            <>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-sm font-semibold text-gray-800">{shadingLabel}</span>
            </>
          )}
        </div>

        {/* Main Divider */}
        <div className="mx-auto my-8 h-px w-full max-w-md bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Disclaimer */}
        <p className="text-center text-sm leading-7 text-gray-700 mb-8 max-w-3xl mx-auto">
          <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
          Actual production and savings depend on site conditions, equipment, installation quality, weather, and utility tariffs.
        </p>

        {/* Methodology Section */}
        <div className="text-center pt-6 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Methodology
          </p>
          <p className="text-xs leading-6 text-gray-600 max-w-3xl mx-auto">
            <span className="font-semibold">NREL PVWatts® v8</span> (2020 TMY climate data)
            <span className="mx-2">•</span>
            <span className="font-semibold">OpenEI URDB / EIA</span> utility rates (updated {lastUpdated})
            <span className="mx-2">•</span>
            <span className="font-semibold">{shadingMethod === 'remote' ? 'High-resolution LiDAR' : 'Geographic proxy'}</span> shading analysis
            <span className="mx-2">•</span>
            <span className="font-semibold">Financial assumptions:</span> 30% ITC, 0.5%/yr panel degradation, $22/kW/yr O&amp;M
          </p>
        </div>
      </div>
    </section>
  );
}
