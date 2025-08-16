"use client";
import React from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { track } from "./track";

export default function BlurMask({ 
  children, 
  cta = "Unlock Full Report",
  id,
  buttonPosition = "center" // "center" | "top-right" | "bottom"
}: { 
  children: React.ReactNode;
  cta?: string;
  id?: string;
  buttonPosition?: "center" | "top-right" | "bottom";
}) {
  const b = useBrandTakeover();
  
  if (!b.enabled) return <>{children}</>;
  
  const handleBlurClick = () => {
    track("unlock_clicked", { placement: "blur", id });
    document.dispatchEvent(new CustomEvent("openInstall"));
  };
  
  const getButtonClasses = () => {
    const baseClasses = "gate__unlock rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm px-4 py-2 shadow-lg transition-all duration-200 transform hover:scale-105";
    
    switch (buttonPosition) {
      case "top-right":
        return `${baseClasses} right-3 top-3`;
      case "bottom":
        return `${baseClasses} left-1/2 -translate-x-1/2 bottom-4`;
      default: // center
        return `${baseClasses} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`;
    }
  };
  
  return (
    <div className="gate">
      <div className="gate__content">
        {children}
      </div>
      <button
        type="button"
        onClick={handleBlurClick}
        className={getButtonClasses()}
        aria-label="Preview — details hidden. Activate to unlock full report."
      >
        <div className="flex items-center space-x-2">
          <span>🔒</span>
          <span>{cta}</span>
          <span>→</span>
        </div>
      </button>
    </div>
  );
}
