'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function useBrandColors() {
  const sp = useSearchParams();
  
  useEffect(() => {
    const primary = sp?.get('primary'); // pass ?primary=%23FF6A00 if you want
    const a = primary && /^%23?[0-9a-fA-F]{6}$/.test(primary) ? decodeURIComponent(primary) : null;
    const fallbackA = '#FF7A00';
    const fallbackB = '#FF3D81';
    const b = a ? a : fallbackB;

    const r = document.documentElement;
    r.style.setProperty('--brand', a || fallbackA);
    r.style.setProperty('--brand-2', b || fallbackB);
  }, [sp]);
}
