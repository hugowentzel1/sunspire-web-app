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
      {/* the CTA - consistent height and spacing */}
      <button
        type="button"
        onClick={onUnlock}
        className="pointer-events-auto absolute left-1/2 bottom-6 transform -translate-x-1/2 px-5 py-3 rounded-full text-white text-sm font-medium shadow-lg bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 hover:opacity-95 transition-all duration-200 hover:shadow-xl z-30 min-w-[160px]"
      >
        🔒 {label} →
      </button>
    </div>
  );
}
