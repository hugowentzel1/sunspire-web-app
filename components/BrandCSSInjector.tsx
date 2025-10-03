"use client";

import { useEffect } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

export default function BrandCSSInjector() {
  const { enabled, primary, brand } = useBrandTakeover();

  useEffect(() => {
    const root = document.documentElement;

    if (enabled && primary) {
      // Set the company's primary color and generate the full range
      root.style.setProperty("--brand", primary);
      root.style.setProperty("--brand-2", primary); // Use same color for consistency
      root.style.setProperty("--brand-primary", primary); // This is what the CSS actually uses
      
      // Generate the full brand color range for consistent theming
      root.style.setProperty("--brand-50", `${primary}20`); // Very light
      root.style.setProperty("--brand-100", `${primary}30`); // Light
      root.style.setProperty("--brand-200", `${primary}40`); // Lighter
      root.style.setProperty("--brand-300", `${primary}60`); // Light-medium
      root.style.setProperty("--brand-400", `${primary}80`); // Medium-light
      root.style.setProperty("--brand-500", primary); // Base color
      root.style.setProperty("--brand-600", primary); // Same as base for buttons
      root.style.setProperty("--brand-700", primary); // Same as base for hover
      root.style.setProperty("--brand-800", primary); // Same as base
      root.style.setProperty("--brand-900", primary); // Same as base

      console.log(`Brand CSS injected: ${brand} with color ${primary}`);
    } else {
      // Fallback to default brand
      root.style.setProperty("--brand", "#FF7A00");
      root.style.setProperty("--brand-2", "#FF3D81");
      root.style.setProperty("--brand-primary", "#FFA63D");
      
      // Set default brand range
      root.style.setProperty("--brand-50", "#fff7ed");
      root.style.setProperty("--brand-100", "#ffedd5");
      root.style.setProperty("--brand-200", "#fed7aa");
      root.style.setProperty("--brand-300", "#fdba74");
      root.style.setProperty("--brand-400", "#fb923c");
      root.style.setProperty("--brand-500", "#f97316");
      root.style.setProperty("--brand-600", "#ea580c");
      root.style.setProperty("--brand-700", "#c2410c");
      root.style.setProperty("--brand-800", "#9a3412");
      root.style.setProperty("--brand-900", "#7c2d12");
    }
  }, [enabled, primary, brand]);

  return null;
}
