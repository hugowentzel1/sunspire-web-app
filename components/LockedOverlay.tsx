import React from "react";
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

export default function LockedOverlay({
  onUnlock,
  label = "Unlock Full Report",
  className = "",
}: {
  onUnlock: () => void;
  label?: string;
  className?: string;
}) {
  const b = useBrandTakeover();
  
  // Use company brand colors for gradient, fallback to default
  const gradientStyle = b.enabled && b.primary ? {
    background: `linear-gradient(135deg, ${b.primary}60, ${b.primary})`
  } : {
    background: 'linear-gradient(135deg, #fbbf2460, #d97706)'
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none rounded-2xl z-20 ${className}`}
      aria-hidden="true"
    >
      {/* soft veil to remove inner borders/ghost boxes */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-md rounded-2xl" />
      {/* the CTA - consistent height and spacing */}
      <button
        type="button"
        onClick={onUnlock}
        className="pointer-events-auto absolute left-1/2 bottom-6 transform -translate-x-1/2 px-5 py-3 rounded-full text-white text-sm font-medium shadow-lg hover:opacity-95 transition-all duration-200 hover:shadow-xl z-30 min-w-[160px]"
        style={gradientStyle}
      >
        🔒 {label} →
      </button>
    </div>
  );
}
