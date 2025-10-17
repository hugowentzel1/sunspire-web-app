// SUNSPIRE: shared sticky CTA bar - matches desktop home page banner style on mobile
import React from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { useCountdown } from "@/src/demo/useCountdown";
import { usePreviewQuota } from "@/src/demo/usePreviewQuota";

export default function StickyCtaBar({
  label,
  testId,
  className = "",
}: { label: string; testId?: string; className?: string }) {
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays || 7);
  const { read } = usePreviewQuota(2);
  const remaining = read();
  
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 supports-[padding:max(0px)]:pb-[max(env(safe-area-inset-bottom),16px)] ${className}`}
      data-testid={testId}
      role="region"
      aria-label="Sticky action"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 -1px 3px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div className="mx-auto max-w-screen-sm p-3">
        {/* Banner content matching desktop home page style */}
        <div className="flex flex-col gap-3 items-center text-center mb-3">
          {/* Exclusive preview badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: `color-mix(in srgb, var(--brand-primary, #2563eb) 8%, white)`,
              border: `1px solid color-mix(in srgb, var(--brand-primary, #2563eb) 20%, white)`,
              color: "var(--brand-primary, #2563eb)"
            }}
          >
            <span>Exclusive preview for {b.brand || 'Your Company'}</span>
          </div>
          
          {/* Runs left and countdown */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-medium">
              {remaining} {remaining === 1 ? 'run' : 'runs'} left
            </span>
            <span>•</span>
            <span className="font-mono">
              Expires in {countdown.days}d {countdown.hours.toString().padStart(2, '0')}:{countdown.minutes.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        
        {/* CTA Button */}
        <button 
          className="w-full h-12 rounded-lg px-5 text-white font-semibold hover:opacity-90 transition"
          style={{
            background: "var(--brand-primary, #2563eb)"
          }}
        >
          {label}
        </button>
      </div>
    </div>
  );
}


