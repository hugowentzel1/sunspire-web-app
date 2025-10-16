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
      className="mx-auto w-full max-w-4xl px-6"
    >
      <div className="py-2">
        <p className="text-center text-sm text-gray-700 mb-3">
          <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
          Actual results depend on site conditions, equipment, installation quality, weather, and utility tariffs.
        </p>
        <div className="pt-3 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
            <span className="font-semibold text-gray-900">NREL PVWatts® v8</span>
            <span className="text-gray-300 mx-3">|</span>
            <span className="font-semibold text-gray-900">OpenEI URDB</span>
            <span className="text-gray-300 mx-3">|</span>
            <span className="font-semibold text-gray-900">{shadingMethod === 'remote' ? 'LiDAR Shading' : 'Geographic Shading'}</span>
            <span className="text-gray-300 mx-3">|</span>
            <span className="font-semibold text-gray-900">30% Federal ITC</span>
          </div>
        </div>
      </div>
    </section>
  );
}
