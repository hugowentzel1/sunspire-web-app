"use client";
import { useEffect, useMemo, useState } from "react";
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
function hex(h: string | null, fallback = "#FFA63D") {
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
  } catch {
    return null;
  }
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
  runs: number; // always 2
  blur: boolean; // always true
  pilot: boolean;
  isDemo: boolean; // true for demo mode, false for paid mode
};

const STORAGE_KEY = "sunspire-brand-takeover";

export function useBrandTakeover(): BrandState {
  const [st, setSt] = useState<BrandState>({
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
    isDemo: false,
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      console.log("useBrandTakeover: Not in browser environment");
      return;
    }

    console.log("useBrandTakeover: Hook running, checking URL parameters...");

    // Function to save brand state to localStorage
    const saveBrandState = (brandState: BrandState) => {
      try {
        const stateWithTimestamp = {
          ...brandState,
          _timestamp: Date.now(),
        };
        console.log(
          "useBrandTakeover: Saving to localStorage:",
          stateWithTimestamp,
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithTimestamp));
        console.log("useBrandTakeover: Successfully saved to localStorage");

        // Verify the save worked
        const verification = localStorage.getItem(STORAGE_KEY);
        console.log(
          "useBrandTakeover: Verification - localStorage now contains:",
          verification,
        );
      } catch (e) {
        console.error("useBrandTakeover: Failed to save to localStorage:", e);
      }
    };

    // First, try to get brand info from URL parameters
    const sp = new URLSearchParams(location.search);
    console.log("useBrandTakeover: URL search params:", location.search);
    console.log("useBrandTakeover: Company param:", sp.get("company"));
    console.log("useBrandTakeover: BrandColor param:", sp.get("brandColor"));

    const isDemo = isDemoFromSearch(sp);
    const hasCompany = !!sp.get("company");
    const urlEnabled = isDemo || hasCompany; // Enable for both demo and company branding
    console.log(
      "useBrandTakeover: URL enabled:",
      urlEnabled,
      "isDemo:",
      isDemo,
      "hasCompany:",
      hasCompany,
    );

    if (urlEnabled) {
      console.log(
        "useBrandTakeover: URL has brand parameters, processing... [FORCE DEPLOYMENT]",
      );

      // URL has brand parameters - use them and save to localStorage
      const companyName =
        clean(sp.get("company") || sp.get("brand")) || "Your Company";
      const customColor = sp.get("primary") || sp.get("brandColor");
      // Hardcode brand colors to fix the live site
      let themeColor;
      const brandLower = companyName.toLowerCase();
      if (brandLower === "tesla") {
        themeColor = "#CC0000"; // Tesla red
        console.log("useBrandTakeover: Using hardcoded Tesla red:", themeColor);
      } else if (brandLower === "apple") {
        themeColor = "#0071E3"; // Apple blue
        console.log(
          "useBrandTakeover: Using hardcoded Apple blue:",
          themeColor,
        );
      } else if (brandLower === "netflix") {
        themeColor = "#E50914"; // Netflix red
        console.log(
          "useBrandTakeover: Using hardcoded Netflix red:",
          themeColor,
        );
      } else if (brandLower === "google") {
        themeColor = "#4285F4"; // Google blue
        console.log(
          "useBrandTakeover: Using hardcoded Google blue:",
          themeColor,
        );
      } else if (brandLower === "microsoft") {
        themeColor = "#00A4EF"; // Microsoft blue
        console.log(
          "useBrandTakeover: Using hardcoded Microsoft blue:",
          themeColor,
        );
      } else if (brandLower === "amazon") {
        themeColor = "#FF9900"; // Amazon orange
        console.log(
          "useBrandTakeover: Using hardcoded Amazon orange:",
          themeColor,
        );
      } else if (brandLower === "meta" || brandLower === "facebook") {
        themeColor = "#1877F2"; // Meta blue
        console.log("useBrandTakeover: Using hardcoded Meta blue:", themeColor);
      } else {
        try {
          console.log(
            "useBrandTakeover: About to call getBrandTheme with:",
            companyName,
          );
          themeColor = getBrandTheme(companyName);
          console.log("useBrandTakeover: getBrandTheme returned:", themeColor);
        } catch (error) {
          console.error(
            "useBrandTakeover: Error calling getBrandTheme:",
            error,
          );
          themeColor = "#FFA63D"; // fallback
        }
      }

      console.log("useBrandTakeover: Company name:", companyName);
      console.log("useBrandTakeover: Custom color:", customColor);
      console.log("useBrandTakeover: Theme color:", themeColor);
      console.log("useBrandTakeover: getBrandTheme called with:", companyName);

      const brandState: BrandState = {
        enabled: true, // Enable for both demo and paid experiences
        brand: companyName,
        primary: themeColor, // Use hardcoded theme color directly
        logo: allowLogo(sp.get("logo")),
        domain: sp.get("domain") || sp.get("company"),
        city: sp.get("city"),
        rep: sp.get("rep"),
        firstName: clean(sp.get("firstName")),
        role: clean(sp.get("role")),
        expireDays: Math.max(1, parseInt(sp.get("expire") || "7", 10) || 7),
        runs: 2,
        blur: true,
        pilot: sp.get("pilot") === "1",
        isDemo: isDemo, // Set demo mode flag
      };

      console.log("useBrandTakeover: Created brand state:", brandState);

      // Save to localStorage and set state
      saveBrandState(brandState);
      setSt(brandState);
    } else {
      console.log(
        "useBrandTakeover: No URL parameters, checking localStorage...",
      );

      // No URL parameters - try to restore from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        console.log("useBrandTakeover: Stored localStorage content:", stored);

        if (stored) {
          const parsed = JSON.parse(stored);
          console.log("useBrandTakeover: Parsed localStorage:", parsed);

          // Only restore if it's still valid (not expired)
          const now = Date.now();
          const storedTime = parsed._timestamp || 0;
          const daysSinceStored = (now - storedTime) / (1000 * 60 * 60 * 24);

          console.log("useBrandTakeover: Days since stored:", daysSinceStored);

          if (daysSinceStored < (parsed.expireDays || 7)) {
            console.log(
              "useBrandTakeover: Restored brand state from localStorage:",
              parsed,
            );
            setSt(parsed);
            return;
          } else {
            // Expired - remove from localStorage
            console.log(
              "useBrandTakeover: Brand state expired, removing from localStorage",
            );
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (e) {
        console.warn(
          "useBrandTakeover: Failed to restore brand state from localStorage:",
          e,
        );
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (cleanupError) {
          console.warn(
            "useBrandTakeover: Failed to clean up localStorage:",
            cleanupError,
          );
        }
      }

      console.log("useBrandTakeover: Setting default state");

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
        isDemo: false,
      });
    }

  }, []); // Only run once on mount

  return useMemo(() => st, [st]);
}

export const ALLOWED_LOGO_HOSTS = Array.from(ALLOWED);
