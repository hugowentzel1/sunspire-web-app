"use client";
import React, { useEffect } from "react";
import { useBrandTakeover } from "./useBrandTakeover";

export default function BrandProvider({ children }: { children: React.ReactNode }) {
  const b = useBrandTakeover();

  useEffect(() => {
    if (!b.enabled) return;
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", b.primary);
  }, [b.enabled, b.primary]);

  // Favicon override (logo if provided; else colored dot)
  useEffect(() => {
    if (!b.enabled) return;
    const link = document.querySelector('link[rel="icon"]') || document.createElement("link");
    link.setAttribute("rel", "icon");
    link.setAttribute(
      "href",
      b.logo
        ? b.logo
        : `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='8' fill='${encodeURIComponent(b.primary)}'/></svg>`
    );
    document.head.appendChild(link);
  }, [b.enabled, b.logo, b.primary]);

  // Noindex in demo
  useEffect(() => {
    if (!b.enabled) return;
    const m = document.createElement("meta");
    m.name = "robots"; 
    m.content = "noindex,nofollow";
    document.head.appendChild(m);
    return () => { 
      if (document.head.contains(m)) {
        document.head.removeChild(m); 
      }
    };
  }, [b.enabled]);

  return <>{children}</>;
}
