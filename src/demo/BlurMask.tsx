"use client";
import React from "react";

export default function BlurMask({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        backdropFilter: "blur(7px)", 
        background: "rgba(255,255,255,.35)" 
      }} />
      <div style={{ 
        position: "absolute", 
        right: 8, 
        bottom: 8, 
        fontSize: 12, 
        color: "#fff",
        background: "rgba(0,0,0,.55)", 
        borderRadius: 8, 
        padding: "4px 8px" 
      }}>
        Demo preview — some details hidden
      </div>
    </div>
  );
}
