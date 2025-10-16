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
  const b = useBrandTakeover();
  
  return (
    <section
      aria-label="Data sources and methodology"
      className="mx-auto mt-16 mb-12 w-full max-w-4xl px-6"
    >
      <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 p-8">
        
        {/* Ultra-minimal disclaimer */}
        <p className="text-center text-sm text-gray-700 mb-6 max-w-3xl mx-auto">
          <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
          Actual results depend on site conditions, equipment, installation quality, weather, and utility tariffs.
        </p>

        {/* Simple methodology list */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.primary || '#d97706' }}></span>
              <span className="font-semibold text-gray-900">NREL PVWatts® v8</span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.primary || '#d97706' }}></span>
              <span className="font-semibold text-gray-900">OpenEI URDB</span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.primary || '#d97706' }}></span>
              <span className="font-semibold text-gray-900">{shadingMethod === 'remote' ? 'LiDAR Shading' : 'Geographic Shading'}</span>
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.primary || '#d97706' }}></span>
              <span className="font-semibold text-gray-900">30% Federal ITC</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
