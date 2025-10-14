"use client";
import React, { useEffect, useState } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { useCountdown } from "./useCountdown";
import { usePreviewQuota } from "./usePreviewQuota";
import { getCTA } from "./cta";
import { useABVariant } from "./useABVariant";
import { track } from "./track";

function ExpiryBadge({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) {
  const isWarning = days <= 2;
  return (
    <span
      style={{
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 999,
        background: isWarning
          ? `color-mix(in srgb, var(--brand-primary) 10%, white)`
          : `color-mix(in srgb, var(--brand-primary) 10%, white)`,
        color: isWarning ? `var(--brand-primary)` : `var(--brand-primary)`,
        border: `1px solid ${isWarning ? `color-mix(in srgb, var(--brand-primary) 30%, white)` : `color-mix(in srgb, var(--brand-primary) 30%, white)`}`,
      }}
    >
      Exclusive preview — expires in {days}:{hours.toString().padStart(2, "0")}:
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </span>
  );
}

export function DemoBanner() {
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays || 3);
  const { read } = usePreviewQuota(2);
  const remaining = read();
  const variant = useABVariant();
  const [closed, setClosed] = useState(false);

  if (!b.enabled || closed) return null;

  const copy = () => {
    navigator.clipboard.writeText(location.href);
    track("cta_click", { event: "cta_click", cta_type: "copy_link" });
  };
  const open = () => {
    document.dispatchEvent(new CustomEvent("openInstall"));
    track("cta_click", { event: "cta_click", cta_type: "banner_primary" });
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 20px",
        background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
      }}
      className="justify-between"
    >
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap",
        gap: 12, 
        alignItems: "center",
        minWidth: 0,
        flex: "1 1 auto"
      }}
      className="justify-start"
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          background: "white",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
        }}>
          <strong style={{ 
            whiteSpace: "nowrap", 
            fontSize: 14,
            color: "#111827",
            fontWeight: 600
          }}>
            Exclusive preview built for {b.brand}
          </strong>
        </div>
        <ExpiryBadge
          days={countdown.days}
          hours={countdown.hours}
          minutes={countdown.minutes}
          seconds={countdown.seconds}
        />
        <span style={{ 
          fontSize: 13, 
          color: "#6B7280", 
          whiteSpace: "nowrap",
          fontWeight: 500
        }}>
          {remaining} {remaining === 1 ? 'run' : 'runs'} left
        </span>
      </div>
      <div style={{ 
        display: "flex", 
        gap: 8, 
        alignItems: "center",
        flexWrap: "wrap",
      }}
      className="md:justify-end justify-center w-full md:w-auto"
      >
        <button
          className="btn"
          onClick={open}
          style={{ 
            fontSize: 13,
            padding: "8px 14px",
            whiteSpace: "nowrap",
            fontWeight: 600,
            background: "linear-gradient(180deg, var(--brand-primary, #2563eb) 0%, color-mix(in srgb, var(--brand-primary, #2563eb) 90%, black 10%) 100%)",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
            transition: "all 0.15s ease"
          }}
        >
          Activate on {b.brand || "your domain"}
        </button>
        <button 
          className="btn" 
          onClick={copy}
          style={{ 
            fontSize: 13,
            padding: "8px 14px",
            whiteSpace: "nowrap",
            fontWeight: 500,
            background: "white",
            color: "#374151",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Copy link
        </button>
        <button 
          onClick={() => setClosed(true)} 
          aria-label="Dismiss"
          style={{
            padding: "6px 10px",
            fontSize: 18,
            cursor: "pointer",
            border: "none",
            background: "transparent",
            color: "#9CA3AF",
            borderRadius: 6,
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
            e.currentTarget.style.color = "#6B7280";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#9CA3AF";
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function StickyBuyBar() {
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays);
  const variant = useABVariant();

  if (!b.enabled) return null;

  const open = () => {
    document.dispatchEvent(new CustomEvent("openInstall"));
    track("cta_click", { event: "cta_click", cta_type: "sticky_primary" });
  };
  const copy = () => {
    navigator.clipboard.writeText(location.href);
    track("cta_click", { event: "cta_click", cta_type: "sticky_copy" });
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: "flex",
        gap: 10,
        justifyContent: "center",
        padding: "10px",
        background: "rgba(255,255,255,.92)",
        borderTop: "1px solid #eee",
        backdropFilter: "saturate(1.1) blur(4px)",
      }}
    >
      <button
        className="btn"
        onClick={open}
      >
        {getCTA(variant, "primary", b.domain)}
      </button>
      <button className="btn" onClick={copy}>
        Copy link
      </button>
      <div
        style={{
          fontSize: 12,
          color: "#6B7280",
          display: "flex",
          alignItems: "center",
        }}
      >
        Expires in {countdown.days}d {countdown.hours}h {countdown.minutes}m
      </div>
    </div>
  );
}
