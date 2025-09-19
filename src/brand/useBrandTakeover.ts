"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBrandTheme } from "@/lib/brandTheme";
import { isDemoFromSearch } from "@/src/lib/isDemo";

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
  isDemo: boolean;  // true for demo mode, false for paid mode
};

const STORAGE_KEY = 'sunspire-brand-takeover';

export function useBrandTakeover(): BrandState {
  const searchParams = useSearchParams();
  const [st, setSt] = useState<BrandState>({
    enabled:false, brand:"Your Company", primary:getBrandTheme("default"), logo:null,
    domain:null, city:null, rep:null, firstName:null, role:null, expireDays:7, runs:2, blur:true, pilot:false, isDemo:false
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Function to process brand takeover
    const processBrandTakeover = () => {
      const sp = searchParams;
      const isDemo = isDemoFromSearch(sp);
      const hasCompany = !!sp.get("company");
      const urlEnabled = isDemo || hasCompany; // Enable for both demo and company branding
      
      if (urlEnabled) {
        // URL has brand parameters - use them and save to localStorage
        const companyName = clean(sp.get("company") || sp.get("brand")) || "Your Company";
        const customColor = sp.get("primary") || sp.get("brandColor");
        const logoUrl = sp.get("logo");
        
        // Use custom color from URL if provided, otherwise use brand theme
        let themeColor;
        if (customColor) {
          themeColor = hex(customColor);
        } else {
          try {
            themeColor = getBrandTheme(companyName);
          } catch (error) {
            themeColor = '#FFA63D'; // fallback
          }
        }
        
        const brandState: BrandState = {
          enabled: urlEnabled, // Enable for both demo and company branding
          brand: companyName,
          primary: themeColor,
          logo: allowLogo(sp.get("logo")),
          domain: sp.get("domain") || sp.get("company"),
          city: sp.get("city"),
          rep: sp.get("rep"),
          firstName: clean(sp.get("firstName")),
          role: clean(sp.get("role")),
          expireDays: Math.max(1, parseInt(sp.get("expire")||"7",10)||7),
          runs: 2,
          blur: true,
          pilot: sp.get("pilot")==="1",
          isDemo: isDemo
        };
        
        setSt(brandState);
        saveBrandState(brandState);
      } else {
        // No URL parameters - try to restore from localStorage
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          
          if (stored) {
            const parsed = JSON.parse(stored);
            
            // Only restore if it's still valid (not expired)
            const now = Date.now();
            const storedTime = parsed._timestamp || 0;
            const daysSinceStored = (now - storedTime) / (1000 * 60 * 60 * 24);
            
            if (daysSinceStored < (parsed.expireDays || 7)) {
              setSt(parsed);
              return;
            } else {
              // Expired - remove from localStorage
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        } catch (e) {
          console.warn('useBrandTakeover: Failed to restore brand state from localStorage:', e);
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch (cleanupError) {
            console.warn('useBrandTakeover: Failed to clean up localStorage:', cleanupError);
          }
        }
        
        // Default state
        setSt({
          enabled: false,
          brand: "Your Company",
          primary: getBrandTheme("default"),
          logo: null,
          domain: null,
          city: null,
          rep: null,
          firstName: null,
          role: null,
          expireDays: 7,
          runs: 2,
          blur: true,
          pilot: false,
          isDemo: false
        });
      }
    };
    
    // Function to save brand state to localStorage
    const saveBrandState = (brandState: BrandState) => {
      try {
        const stateWithTimestamp = {
          ...brandState,
          _timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithTimestamp));
      } catch (e) {
        console.error('useBrandTakeover: Failed to save to localStorage:', e);
      }
    };
    
    // Process brand takeover
    processBrandTakeover();
  }, [searchParams]); // Re-run when searchParams change

  return useMemo(()=>st,[st]);
}

export const ALLOWED_LOGO_HOSTS = Array.from(ALLOWED);