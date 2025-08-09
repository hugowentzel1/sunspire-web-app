'use client';

import { useEffect, useMemo, useState } from 'react';

export default function DemoRibbon() {
  const [enabled, setEnabled] = useState(false);
  const [brand, setBrand] = useState<string | undefined>();
  const [logo, setLogo] = useState<string | undefined>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isDemo = params.get('demo');
    const b = params.get('brand') || undefined;
    const lg = params.get('logo') || undefined;
    const primary = params.get('primary') || undefined;
    const secondary = params.get('secondary') || undefined;

    if (primary) document.documentElement.style.setProperty('--sun-1', primary);
    if (secondary) document.documentElement.style.setProperty('--sun-2', secondary);
    setBrand(b);
    setLogo(lg);
    setEnabled(isDemo === '1' || isDemo === 'true');

    return () => {
      if (primary) document.documentElement.style.removeProperty('--sun-1');
      if (secondary) document.documentElement.style.removeProperty('--sun-2');
    };
  }, []);

  const initials = useMemo(() => {
    if (!brand) return '🅻';
    const words = brand.trim().split(/\s+/);
    const chars = words.slice(0,2).map(w => w[0]?.toUpperCase()).join('');
    return chars || '🅻';
  }, [brand]);

  if (!enabled) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--border)] bg-white/90 backdrop-blur shadow-[0_10px_40px_rgba(15,23,42,.08)]">
        <div className="h-8 w-8 rounded-xl overflow-hidden flex items-center justify-center text-xs font-black text-white"
             style={{ background: 'linear-gradient(140deg, var(--sun-1), var(--sun-2), var(--sun-3))' }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Brand logo" className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="text-sm font-semibold text-[var(--ink)]">
          {brand ? `Demo for ${brand}` : 'Demo Preview'} • <span className="text-[var(--muted)]">Your logo could be here</span>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="text-xs font-bold px-2 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-2)]"
        >Copy link</button>
      </div>
    </div>
  );
}
