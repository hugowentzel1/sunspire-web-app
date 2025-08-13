"use client";
import React, { useEffect } from "react";
import { useBrandTakeover } from "./useBrandTakeover";

export default function BrandProvider({ children }: { children: React.ReactNode }) {
  const b = useBrandTakeover();

  // CSS var theme
  useEffect(() => {
    if (!b.enabled) return;
    document.documentElement.style.setProperty("--brand-primary", b.primary);
  }, [b.enabled, b.primary]);

  // Favicon override
  useEffect(() => {
    if (!b.enabled) return;
    const link = document.querySelector('link[rel="icon"]') || document.createElement("link");
    link.setAttribute("rel","icon");
    link.setAttribute("href", b.logo ? b.logo :
      `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='8' fill='${encodeURIComponent(b.primary)}'/></svg>`);
    document.head.appendChild(link);
  }, [b.enabled, b.logo, b.primary]);

  // Title + robots
  useEffect(() => {
    if (!b.enabled) return;
    document.title = `${b.brand} — Solar Intelligence`;
    const meta = document.createElement("meta");
    meta.name = "robots"; meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, [b.enabled, b.brand]);

  return <>{children}</>;
}
