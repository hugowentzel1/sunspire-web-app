"use client";
import React from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { track } from "./track";

export default function BlurMask({ 
  children, 
  cta = "Unlock Full Report",
  id 
}: { 
  children: React.ReactNode;
  cta?: string;
  id?: string;
}) {
  const b = useBrandTakeover();
  
  if (!b.enabled) return <>{children}</>;
  
  const handleBlurClick = () => {
    track("unlock_clicked", { placement: "blur", id });
    document.dispatchEvent(new CustomEvent("openInstall"));
  };
  
  return (
    <div className="relative">
      {/* Hide the original content completely */}
      <div className="opacity-0 pointer-events-none">
        {children}
      </div>
      
      {/* Solid white overlay that blocks everything */}
      <div className="absolute inset-0 bg-white rounded-2xl shadow-lg" />
      
      {/* Preview Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="px-3 py-1.5 bg-gray-900/90 text-white text-xs font-medium rounded-full border border-white/20">
          Preview — details hidden
        </div>
      </div>
      
      {/* Unlock Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <button 
          onClick={handleBlurClick}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-0 cursor-pointer"
          aria-label="Preview — details hidden. Activate to unlock full report."
        >
          <div className="flex items-center space-x-2">
            <span>🔒</span>
            <span>{cta}</span>
            <span>→</span>
          </div>
        </button>
      </div>
    </div>
  );
}
