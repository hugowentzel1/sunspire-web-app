"use client";
import { useEffect, useMemo, useState } from "react";

const ALLOWED = new Set([
  "logo.clearbit.com",
  "res.cloudinary.com",
  "i.imgur.com",
  "images.unsplash.com",
  "cdn.jsdelivr.net",
]);

function cleanBrand(s: string | null) {
  if (!s) return null;
  return s.replace(/[<>]/g, "").trim().slice(0, 40) || null;
}

function normalizeHex(hex: string | null, fallback = "#FFA63D") {
  if (!hex) return fallback;
  const h = hex.startsWith("#") ? hex : `#${hex}`;
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h.toUpperCase() : fallback;
}

function allowLogo(urlStr: string | null) {
  if (!urlStr) return null;
  try {
    const u = new URL(urlStr);
    if (u.protocol !== "https:") return null;
    if (!ALLOWED.has(u.hostname)) return null;
    return u.toString();
  } catch { 
    return null; 
  }
}

export type BrandTakeover = {
  enabled: boolean;        // demo mode?
  brand: string;           // default "Your Company"
  primary: string;         // validated hex
  logo: string | null;     // remote URL
  domain: string | null;
  city: string | null;
  rep: string | null;
  runs: number;            // ALWAYS 2 for demo
  blur: boolean;           // ALWAYS true for sensitive sections
  pilot: boolean;
};

export function useBrandTakeover(): BrandTakeover {
  const [state, setState] = useState<BrandTakeover>({
    enabled: false,
    brand: "Your Company",
    primary: "#FFA63D",
    logo: null,
    domain: null,
    city: null,
    rep: null,
    runs: 2,
    blur: true,
    pilot: false,
  });

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const enabled = sp.get("demo") === "1" || sp.get("demo") === "true";
    const brand = cleanBrand(sp.get("brand")) ?? "Your Company";
    const primary = normalizeHex(sp.get("primary"));
    const logo = allowLogo(sp.get("logo"));
    const pilot = sp.get("pilot") === "1";
    
    setState({
      enabled,
      brand,
      primary,
      logo,
      domain: sp.get("domain"),
      city: sp.get("city"),
      rep: sp.get("rep"),
      runs: 2,       // <— hard-coded
      blur: true,    // <— always blur key elements in demo
      pilot,
    });
  }, []);

  return useMemo(() => state, [state]);
}

export const ALLOWED_LOGO_HOSTS = Array.from(ALLOWED);
