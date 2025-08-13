"use client";
import React from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

export default function BlurMask({ children }: { children: React.ReactNode }) {
  const b = useBrandTakeover();
  if (!b.enabled) return <>{children}</>;
  return (
    <div style={{ position:"relative" }}>
      {children}
      <div style={{ position:"absolute", inset:0, backdropFilter:"blur(7px)", background:"rgba(255,255,255,.35)" }} />
      <div style={{ position:"absolute", inset:"auto 8px 8px auto", fontSize:12, color:"#fff",
                    background:"rgba(0,0,0,.6)", borderRadius:8, padding:"6px 10px" }}>
        Preview — details hidden
      </div>
      <button onClick={()=>document.dispatchEvent(new CustomEvent("openInstall"))}
        style={{ position:"absolute", left:"50%", bottom:"14px", transform:"translateX(-50%)",
                 padding:"8px 12px", borderRadius:12, border:"none", background:"var(--brand-primary)" }}>
        Add to {b.domain ?? "our site"} to unlock
      </button>
    </div>
  );
}
