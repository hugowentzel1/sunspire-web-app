"use client";
import React, { useEffect, useState } from "react";
import { useIsDemo, useDemoParams } from "./useDemo";
import { usePersonalizationCtx } from "@/src/personalization/PersonalizationContext";

function ExpiryBadge({ days }: { days: number }) {
  return (
    <span style={{ 
      fontSize: 12, 
      padding: "4px 8px", 
      borderRadius: 999, 
      background: "#FFF3CD", 
      color: "#8C6D1F" 
    }}>
      Link expires in {days} day{days === 1 ? "" : "s"}
    </span>
  );
}

export function DemoBanner() {
  const isDemo = useIsDemo();
  const { brand } = usePersonalizationCtx();
  const { domain, expireDays } = useDemoParams();
  const [closed, setClosed] = useState(false);
  
  if (!isDemo || closed) return null;

  async function copy() { 
    try { 
      await navigator.clipboard.writeText(window.location.href); 
    } catch {} 
  }
  
  function openInstall() { 
    document.dispatchEvent(new CustomEvent("openInstall")); 
  }

  return (
    <div style={{
      position: "sticky", 
      top: 0, 
      zIndex: 1000, 
      display: "flex", 
      flexWrap: "wrap",
      gap: 10, 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "10px 12px",
      background: "#fff", 
      borderBottom: "1px solid #eee"
    }}>
      <strong>{brand ?? "Your Company"} — Demo Mode</strong>
      <span style={{ opacity: 0.7 }}>Pre-branded preview. Not a contract quote.</span>
      <button 
        onClick={openInstall} 
        style={{
          padding: "6px 12px",
          background: "#f97316",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Put this on {domain ?? "our site"}
      </button>
      <button 
        onClick={copy} 
        style={{
          padding: "6px 12px",
          background: "white",
          color: "#374151",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Copy demo link
      </button>
      <ExpiryBadge days={expireDays} />
      <button 
        onClick={() => setClosed(true)} 
        aria-label="Dismiss" 
        style={{ marginLeft: 6 }}
      >
        ✕
      </button>
    </div>
  );
}

export function DemoStickyBar() {
  const isDemo = useIsDemo();
  const { domain } = useDemoParams();
  
  if (!isDemo) return null;
  
  function openInstall() { 
    document.dispatchEvent(new CustomEvent("openInstall")); 
  }
  
  function copy() { 
    navigator.clipboard.writeText(window.location.href); 
  }
  
  return (
    <div style={{
      position: "fixed", 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 1000,
      display: "flex", 
      gap: 10, 
      justifyContent: "center", 
      padding: "10px",
      background: "rgba(255,255,255,.9)", 
      borderTop: "1px solid #eee", 
      backdropFilter: "saturate(1.1) blur(4px)"
    }}>
      <button 
        onClick={openInstall} 
        style={{
          padding: "8px 16px",
          background: "#f97316",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Put this on {domain ?? "our site"}
      </button>
      <button 
        onClick={copy} 
        style={{
          padding: "8px 16px",
          background: "white",
          color: "#374151",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        Copy link
      </button>
    </div>
  );
}
