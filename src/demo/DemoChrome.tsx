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
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 12px",
        background: "#fff",
        borderBottom: "1px solid #eee",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <strong>Exclusive preview built for {b.brand}</strong>
        <ExpiryBadge
          days={countdown.days}
          hours={countdown.hours}
          minutes={countdown.minutes}
          seconds={countdown.seconds}
        />
        <span style={{ fontSize: 12, color: "#6B7280" }}>
          Runs left: {remaining}
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          className="btn"
          style={{ background: "#10B981", color: "white" }}
          onClick={open}
        >
          Launch on {b.domain || "your domain"}
        </button>
        <button className="btn" onClick={copy}>
          Copy link
        </button>
        <button onClick={() => setClosed(true)} aria-label="Dismiss">
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
        style={{ background: "#10B981", color: "white" }}
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
