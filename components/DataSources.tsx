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
        <p className="text-center text-sm text-gray-700">
          <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
          Actual results vary with site conditions, equipment, installation quality, weather, and utility tariffs. 
          Data & modeling: NREL PVWatts® v8 • Utility rates from OpenEI URDB / EIA • Shading: {shadingMethod === 'remote' ? 'LiDAR (where available)' : 'Geographic proxy'}.
        </p>
      </div>
    </section>
  );
}
