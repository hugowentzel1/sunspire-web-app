// components/DataSources.tsx
// Premium, luxurious styling that fits cohesively with the site

'use client';

import { useState, useEffect } from 'react';
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
  const [variant, setVariant] = useState(1);
  
  // Keyboard navigation (localhost only)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      const handleKeyPress = (e: KeyboardEvent) => {
        // Type 'next' or just 'n' to go to next variant
        if (e.key === 'n' || e.key === 'N') {
          setVariant((prev) => (prev === 5 ? 1 : prev + 1));
        }
        // Type 'prev' or 'p' to go to previous variant
        if (e.key === 'p' || e.key === 'P') {
          setVariant((prev) => (prev === 1 ? 5 : prev - 1));
        }
        // Type number 1-5 to jump to that variant
        if (e.key >= '1' && e.key <= '5') {
          setVariant(parseInt(e.key));
        }
      };
      
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, []);
  
  return (
    <section
      aria-label="Data sources and methodology"
      className="mx-auto mt-16 mb-12 w-full max-w-4xl px-6"
    >
      {/* Variant indicator (localhost only) */}
      {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
        <div className="mb-4 text-center space-y-2">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">
              VARIANT {variant} / 5
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-900 font-mono">N</kbd> for next · 
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-900 font-mono mx-1">P</kbd> for previous · 
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-900 font-mono">1-5</kbd> to jump
          </p>
        </div>
      )}
      
      {/* OPTION 1: Authority-First (Current) */}
      {variant === 1 && (
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 p-8">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs mb-6">
            <span className="font-semibold text-gray-900">NREL PVWatts® v8</span>
            <span className="text-gray-300">•</span>
            <span className="font-semibold text-gray-900">OpenEI URDB</span>
            <span className="text-gray-300">•</span>
            <span className="font-semibold text-gray-900">{shadingMethod === 'remote' ? 'LiDAR Shading' : 'Geographic Shading'}</span>
            <span className="text-gray-300">•</span>
            <span className="font-semibold text-gray-900">30% Federal ITC</span>
          </div>
          <p className="text-center text-xs text-gray-600 pt-6 border-t border-gray-100">
            <span className="font-semibold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
            Actual results depend on site conditions, equipment, installation quality, weather, and utility tariffs.
          </p>
        </div>
      )}
      
      {/* OPTION 2: Trust-Reassurance (Inverted) - No box, with | divider */}
      {variant === 2 && (
        <div className="py-4">
          <p className="text-center text-sm text-gray-700 mb-6">
            <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
            Actual results depend on site conditions, equipment, installation quality, weather, and utility tariffs.
          </p>
          <div className="pt-6 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
              <span className="font-semibold text-gray-900">NREL PVWatts® v8</span>
              <span className="h-3 w-px bg-gray-200"></span>
              <span className="font-semibold text-gray-900">OpenEI URDB</span>
              <span className="h-3 w-px bg-gray-200"></span>
              <span className="font-semibold text-gray-900">{shadingMethod === 'remote' ? 'LiDAR Shading' : 'Geographic Shading'}</span>
              <span className="h-3 w-px bg-gray-200"></span>
              <span className="font-semibold text-gray-900">30% Federal ITC</span>
            </div>
          </div>
        </div>
      )}
      
      {/* OPTION 3: Single-Line Power */}
      {variant === 3 && (
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 p-6">
          <p className="text-center text-xs text-gray-700 leading-relaxed">
            <span className="font-bold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
            Actual results vary by conditions. 
            <span className="mx-2">|</span>
            <span className="font-semibold text-gray-900">Data:</span> NREL PVWatts® v8, OpenEI URDB, {shadingMethod === 'remote' ? 'LiDAR Shading' : 'Geographic Shading'}, 30% Federal ITC
          </p>
        </div>
      )}
      
      {/* OPTION 4: Emphasis on Accuracy */}
      {variant === 4 && (
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 p-8">
          <div className="text-center mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Industry-Standard Data
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
              <span className="font-semibold text-gray-900">NREL PVWatts® v8</span>
              <span className="text-gray-300">•</span>
              <span className="font-semibold text-gray-900">OpenEI URDB</span>
              <span className="text-gray-300">•</span>
              <span className="font-semibold text-gray-900">{shadingMethod === 'remote' ? 'LiDAR Shading' : 'Geographic Shading'}</span>
              <span className="text-gray-300">•</span>
              <span className="font-semibold text-gray-900">30% Federal ITC</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
            Modeled estimate. Actual results may vary.
          </p>
        </div>
      )}
      
      {/* OPTION 5: Badge Style (Visual Authority) */}
      {variant === 5 && (
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 p-8">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-full">
              NREL PVWatts® v8
            </span>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-full">
              OpenEI URDB
            </span>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-full">
              {shadingMethod === 'remote' ? 'LiDAR Shading' : 'Geographic Shading'}
            </span>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-full">
              30% Federal ITC
            </span>
          </div>
          <p className="text-center text-xs text-gray-600 pt-6 border-t border-gray-100">
            <span className="font-semibold text-gray-900">Modeled estimate</span> — not a performance guarantee. 
            Actual results depend on site conditions, equipment, installation quality, weather, and utility tariffs.
          </p>
        </div>
      )}
    </section>
  );
}
