"use client";
import React, { useEffect } from "react";
import { useBrandTakeover } from "./useBrandTakeover";

export default function NavBrandOverride() {
  const b = useBrandTakeover();
  
  useEffect(() => {
    if (!b.enabled) return;
    document.querySelectorAll("[data-app-brand], .app-brand, header .brand")
      .forEach(el => (el as HTMLElement).style.visibility = "hidden");
  }, [b.enabled]);
  
  return null;
}
