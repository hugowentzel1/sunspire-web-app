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
    <div className="relative group">
      {children}
      
      {/* Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/95 rounded-2xl transition-all duration-300 group-hover:bg-white/98" />
      
      {/* Preview Badge */}
      <div className="absolute top-4 right-4">
        <div className="px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
          Preview — details hidden
        </div>
      </div>
      
      {/* Unlock Button */}
      <div className="absolute inset-0 flex items-center justify-center">
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
      
      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-300/50 transition-all duration-300" />
    </div>
  );
}
