"use client";
import React, { useState } from "react";
import { useIsDemo, useDemoParams } from "@/src/personalization/useDemo";
import { usePersonalizationCtx } from "@/src/personalization/PersonalizationContext";

export function DemoBanner() {
  const isDemo = useIsDemo();
  const { brand } = usePersonalizationCtx();
  const { domain } = useDemoParams();
  const [closed, setClosed] = useState(false);
  
  if (!isDemo || closed) return null;

  async function copy() { 
    try { 
      await navigator.clipboard.writeText(window.location.href); 
    } catch {} 
  }
  
  function install() { 
    document.dispatchEvent(new CustomEvent("openInstall")); 
  }

  return (
    <div style={{
      position: "sticky", 
      top: 0, 
      zIndex: 1000, 
      background: "#fff", 
      borderBottom: "1px solid #eee",
      padding: "8px 12px", 
      display: "flex", 
      gap: 12, 
      alignItems: "center", 
      justifyContent: "center"
    }}>
      <strong>{brand ?? "Your Company"} — Demo Mode</strong>
      <span style={{opacity: 0.7}}>Pre-branded preview. Not a contract quote.</span>
      <button 
        onClick={install} 
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
      <button 
        onClick={() => setClosed(true)} 
        aria-label="Dismiss"
        style={{
          padding: "4px 8px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          color: "#6b7280"
        }}
      >
        ✕
      </button>
    </div>
  );
}

export function DemoStickyBottom() {
  const isDemo = useIsDemo();
  const { domain } = useDemoParams();
  
  if (!isDemo) return null;
  
  function install() { 
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
      backdropFilter: "saturate(1.2) blur(4px)"
    }}>
      <button 
        onClick={install} 
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
