// components/DataSources.tsx
// Premium, luxurious styling that fits cohesively with the site

'use client';

import { useBrandTakeover } from '@/src/brand/useBrandTakeover';
import { IconBadge } from '@/components/ui/IconBadge';

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
  const shadingLabel = shadingMethod === 'remote' ? 'High-Resolution LiDAR Shading' : 'Geographic Shading Analysis';
  
  return (
    <section
      aria-label="Data sources and methodology"
      className="mx-auto mt-16 mb-12 w-full max-w-4xl px-6"
    >
      {/* Match exact card styling from report tiles */}
      <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300 p-8">
        
        {/* Header - Matches report page typography */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-black text-gray-900 mb-2">
            Powered by Verified Industry Data
          </h3>
          <div className="mx-auto h-0.5 w-16 rounded-full mt-3" style={{ backgroundColor: b.primary || '#d97706' }} />
        </div>

        {/* Data Source Badges - Using IconBadge pattern from report */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          <div className="flex flex-col items-center gap-3">
            <IconBadge>⚡</IconBadge>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">NREL PVWatts® v8</div>
              <div className="text-xs text-gray-600">Solar Production</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <IconBadge>💰</IconBadge>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{utilityLabel}</div>
              <div className="text-xs text-gray-600">Utility Rates</div>
            </div>
          </div>
          
          {showLidar && (
            <div className="flex flex-col items-center gap-3">
              <IconBadge>☀️</IconBadge>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-900">{shadingLabel}</div>
                <div className="text-xs text-gray-600">Shading Analysis</div>
              </div>
            </div>
          )}
        </div>

        {/* Divider - Matches site pattern */}
        <div className="mx-auto my-8 h-px w-full max-w-md bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Disclaimer - Matches calculation details box typography */}
        <div className="mb-8">
          <p className="text-center text-sm leading-relaxed text-gray-700 max-w-3xl mx-auto">
            <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
            Actual production and savings depend on site conditions, equipment, installation quality, weather, and utility tariffs.
          </p>
        </div>

        {/* Methodology - Matches data sources pattern from report */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">
            Analysis Methodology
          </h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="w-2 h-2 rounded-full mr-3 mt-1.5 flex-shrink-0" style={{ backgroundColor: b.primary || '#d97706' }}></span>
              <span className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">NREL PVWatts® v8</span> — 2020 TMY climate data for precise solar irradiance modeling
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 rounded-full mr-3 mt-1.5 flex-shrink-0" style={{ backgroundColor: b.primary || '#d97706' }}></span>
              <span className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">OpenEI URDB / EIA</span> — Utility rates updated {lastUpdated}
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 rounded-full mr-3 mt-1.5 flex-shrink-0" style={{ backgroundColor: b.primary || '#d97706' }}></span>
              <span className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{shadingMethod === 'remote' ? 'High-resolution LiDAR' : 'Geographic proxy'}</span> — {shadingMethod === 'remote' ? 'Remote sensing shading analysis' : 'Location-based shading estimation'}
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 rounded-full mr-3 mt-1.5 flex-shrink-0" style={{ backgroundColor: b.primary || '#d97706' }}></span>
              <span className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Financial assumptions:</span> 30% Federal ITC, 0.5%/yr panel degradation, $22/kW/yr O&amp;M
              </span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Last updated {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
