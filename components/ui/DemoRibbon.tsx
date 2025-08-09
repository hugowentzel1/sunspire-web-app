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
    const chars = words.slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
    return chars || '🅻';
  }, [brand]);

  if (!enabled) return null;

  const mailto = typeof window !== 'undefined'
    ? `mailto:sales@sunspire.app?subject=${encodeURIComponent('White-label Demo')}&body=${encodeURIComponent(`Brand: ${brand ?? ''}\nLink: ${window.location.href}`)}`
    : 'mailto:sales@sunspire.app?subject=White-label%20Demo';

  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100]">
      <div className="flex items-center gap-4 px-5 py-3 rounded-full border border-[var(--border)] bg-white/95 backdrop-blur shadow-[0_16px_60px_rgba(15,23,42,.12)]">
        <div
          className="h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center text-xs font-black text-white"
          style={{ background: 'linear-gradient(140deg, var(--sun-1), var(--sun-2), var(--sun-3))' }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Brand logo" className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="text-sm font-semibold text-[var(--ink)]">
          <span className="mr-1">This could be your logo</span>
          <span className="hidden sm:inline text-[var(--muted)]">— White‑label on your domain in 24h</span>
          <span className="ml-2 text-[var(--muted)]">{brand ? `(Preview: ${brand})` : ''}</span>
        </div>
        <button onClick={copy} className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-2)]">
          Copy demo link
        </button>
        <a href={mailto} className="btn-sunset text-xs px-3 py-2">
          Get white‑label demo
        </a>
      </div>
    </div>
  );
}
