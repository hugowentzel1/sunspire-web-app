// SUNSPIRE: shared sticky CTA bar
import React from "react";

export default function StickyCtaBar({
  label,
  testId,
  className = "",
}: { label: string; testId?: string; className?: string }) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur supports-[padding:max(0px)]:pb-[max(env(safe-area-inset-bottom),16px)] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] ${className}`}
      data-testid={testId}
      role="region"
      aria-label="Sticky action"
    >
      <div className="mx-auto max-w-screen-sm p-3">
        <button className="w-full h-12 rounded-lg px-5 bg-red-600 text-white font-semibold hover:bg-red-700 transition">
          {label}
        </button>
      </div>
    </div>
  );
}


