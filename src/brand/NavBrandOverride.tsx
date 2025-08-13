"use client";
import { useEffect } from "react";
import { useBrandTakeover } from "./useBrandTakeover";

export default function NavBrandOverride() {
  const b = useBrandTakeover();
  useEffect(() => {
    if (!b.enabled) return;
    const selectors = [
      "[data-app-brand]",
      ".app-brand",
      "header .brand",
      "header img[alt='Sunspire']",
      "header [aria-label='Sunspire']",
      "a[href='/' i]" 
    ];
    document.querySelectorAll(selectors.join(",")).forEach(el => {
      (el as HTMLElement).style.visibility = "hidden";
      (el as HTMLElement).style.pointerEvents = "none";
      (el as HTMLElement).setAttribute("data-vendor-hidden", "true");
    });
  }, [b.enabled]);
  return null;
}
