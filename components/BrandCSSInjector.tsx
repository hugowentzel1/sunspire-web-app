"use client";

import { useEffect, useState } from 'react';
import { getBrandFromQuery } from '@/lib/brand';

export default function BrandCSSInjector() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    try {
      const { from, to } = getBrandFromQuery();
      const root = document.documentElement;
      
      root.style.setProperty('--brand', from);
      root.style.setProperty('--brand-2', to);
    } catch (error) {
      console.warn('Brand injection failed:', error);
      // Fallback to default brand
      const root = document.documentElement;
      root.style.setProperty('--brand', '#FF7A00');
      root.style.setProperty('--brand-2', '#FF3D81');
    }
  }, []);

  // Don't render anything until client-side
  if (!isClient) return null;

  return null;
}
