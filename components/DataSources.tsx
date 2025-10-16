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
      {/* Premium container with consistent styling */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 py-6 px-8">
          <h3 className="text-center text-sm font-bold tracking-wider text-gray-900 uppercase">
            Powered by Verified Industry Data
          </h3>
        </div>

        {/* Content */}
        <div className="px-10 py-8">
          
          {/* Data Source Badges - Premium pill design with icons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 px-4 py-2.5 shadow-sm">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-semibold text-gray-900">NREL PVWatts® v8</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50 px-4 py-2.5 shadow-sm">
              <span className="text-lg">💰</span>
              <span className="text-sm font-semibold text-gray-900">{utilityLabel}</span>
            </div>
            {showLidar && (
              <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50 px-4 py-2.5 shadow-sm">
                <span className="text-lg">☀️</span>
                <span className="text-sm font-semibold text-gray-900">{shadingLabel}</span>
              </div>
            )}
          </div>

          {/* Elegant divider */}
          <div className="mx-auto my-8 h-px w-32 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          {/* Disclaimer - Clear and professional */}
          <p className="text-center text-sm leading-relaxed text-gray-800 mb-8 max-w-3xl mx-auto">
            <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
            Actual production and savings depend on site conditions, equipment, installation quality, weather, and utility tariffs.
          </p>

          {/* Methodology - Complete and professional */}
          <div className="bg-gray-50/50 rounded-lg border border-gray-100 p-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">
              Analysis Methodology
            </p>
            <p className="text-xs leading-relaxed text-gray-700 text-center max-w-3xl mx-auto">
              <span className="font-semibold text-gray-900">NREL PVWatts® v8</span> <span className="text-gray-600">(2020 TMY climate data)</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="font-semibold text-gray-900">OpenEI URDB / EIA</span> <span className="text-gray-600">utility rates (updated {lastUpdated})</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="font-semibold text-gray-900">{shadingMethod === 'remote' ? 'High-resolution LiDAR' : 'Geographic proxy'}</span> <span className="text-gray-600">shading analysis</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="font-semibold text-gray-900">Financial assumptions:</span> <span className="text-gray-600">30% ITC, 0.5%/yr degradation, $22/kW/yr O&amp;M</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
