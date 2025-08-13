"use client";
import React from "react";

export default function BlurMask({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <div style={{
        position: "absolute", 
        inset: 0, 
        backdropFilter: "blur(6px)",
        background: "rgba(255,255,255,0.35)"
      }} />
      <div style={{
        position: "absolute", 
        bottom: 8, 
        right: 8, 
        fontSize: 12,
        padding: "4px 8px", 
        borderRadius: 8, 
        background: "rgba(0,0,0,0.55)", 
        color: "#fff"
      }}>
        Demo preview — some details hidden
      </div>
    </div>
  );
}
