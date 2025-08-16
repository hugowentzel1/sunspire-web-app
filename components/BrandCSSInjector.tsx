"use client";

import { useEffect } from 'react';
import { getBrandFromQuery } from '@/lib/brand';

export default function BrandCSSInjector() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const { from, to } = getBrandFromQuery();
    const root = document.documentElement;
    
    root.style.setProperty('--brand', from);
    root.style.setProperty('--brand-2', to);
  }, []);

  return null;
}
