"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function useBrandColors() {
  const sp = useSearchParams();

  useEffect(() => {
    // Only apply brand colors if there are URL parameters
    // Don't override brand takeover colors
    const primary = sp?.get("primary"); // pass ?primary=%23FF6A00 if you want
    const a =
      primary && /^%23?[0-9a-fA-F]{6}$/.test(primary)
        ? decodeURIComponent(primary)
        : null;

    // Only set colors if there's a primary parameter in the URL
    if (a) {
      const fallbackB = "#FF3D81";
      const b = a ? a : fallbackB;

      const r = document.documentElement;
      r.style.setProperty("--brand", a);
      r.style.setProperty("--brand-2", b);
      // Also set brand-primary for backward compatibility
      r.style.setProperty("--brand-primary", a);
      console.log("useBrandColors: Applied URL brand colors:", a);
    } else {
      console.log(
        "useBrandColors: No URL brand parameters, not overriding brand takeover colors",
      );
    }
  }, [sp]);
}
