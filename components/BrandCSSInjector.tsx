"use client";

import { useEffect } from 'react';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

export default function BrandCSSInjector() {
  const { enabled, primary, brand } = useBrandTakeover();

  useEffect(() => {
    const root = document.documentElement;
    
    if (enabled && primary) {
      // Set the company's primary color
      root.style.setProperty('--brand', primary);
      root.style.setProperty('--brand-2', primary); // Use same color for consistency
      root.style.setProperty('--brand-primary', primary); // This is what the CSS actually uses
      
      console.log(`Brand CSS injected: ${brand} with color ${primary}`);
    } else {
      // Fallback to default brand
      root.style.setProperty('--brand', '#FF7A00');
      root.style.setProperty('--brand-2', '#FF3D81');
      root.style.setProperty('--brand-primary', '#FFA63D');
    }
  }, [enabled, primary, brand]);

  return null;
}
