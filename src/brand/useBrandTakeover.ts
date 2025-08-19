"use client";
import { useEffect, useMemo, useState } from "react";

const ALLOWED = new Set([
  "logo.clearbit.com",
  "res.cloudinary.com",
  "i.imgur.com",
  "images.unsplash.com",
  "cdn.jsdelivr.net",
]);

function clean(s: string | null) {
  return s ? s.replace(/[<>]/g, "").trim().slice(0, 40) : null;
}
function hex(h: string | null, fallback="#FFA63D") {
  if (!h) return fallback;
  const x = h.startsWith("#") ? h : `#${h}`;
  return /^#[0-9a-fA-F]{6}$/.test(x) ? x.toUpperCase() : fallback;
}
function allowLogo(urlStr: string | null) {
  if (!urlStr) return null;
  try {
    const u = new URL(urlStr);
    if (u.protocol !== "https:") return null;
    if (!ALLOWED.has(u.hostname)) return null;
    return u.toString();
  } catch { return null; }
}

export type BrandState = {
  enabled: boolean;
  brand: string;
  primary: string;
  logo: string | null;
  domain: string | null;
  city: string | null;
  rep: string | null;
  firstName: string | null;
  role: string | null;
  expireDays: number;
  runs: number;     // always 2
  blur: boolean;    // always true
  pilot: boolean;
};

export function useBrandTakeover(): BrandState {
  const [st, setSt] = useState<BrandState>({
    enabled:false, brand:"Your Company", primary:"#FFA63D", logo:null,
    domain:null, city:null, rep:null, firstName:null, role:null, expireDays:7, runs:2, blur:true, pilot:false
  });

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const enabled = sp.get("demo")==="1" || sp.get("demo")==="true" || !!sp.get("company");
    const expire = Math.max(1, parseInt(sp.get("expire")||"7",10)||7);
    setSt({
      enabled,
      brand: clean(sp.get("company") || sp.get("brand")) || "Your Company",
      primary: hex(sp.get("primary") || sp.get("brandColor")),
      logo: allowLogo(sp.get("logo")),
      domain: sp.get("domain") || sp.get("company"),
      city: sp.get("city"),
      rep: sp.get("rep"),
      firstName: clean(sp.get("firstName")),
      role: clean(sp.get("role")),
      expireDays: expire,
      runs: 2,
      blur: true,
      pilot: sp.get("pilot")==="1",
    });
  }, []);

  return useMemo(()=>st,[st]);
}

export const ALLOWED_LOGO_HOSTS = Array.from(ALLOWED);
