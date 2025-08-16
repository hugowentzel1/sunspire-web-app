import React from "react";

export default function LockedOverlay({
  onUnlock,
  label = "Unlock Full Report",
  className = "",
}: {
  onUnlock: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none rounded-2xl z-20 ${className}`}
      aria-hidden="true"
    >
      {/* soft veil to remove inner borders/ghost boxes */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-md rounded-2xl" />
      {/* the CTA - centered and properly aligned */}
      <button
        type="button"
        onClick={onUnlock}
        className="pointer-events-auto absolute left-1/2 bottom-4 transform -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-md bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-95 transition z-30"
      >
        🔒 {label} →
      </button>
    </div>
  );
}
