"use client";
import React from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { getCTA } from "./cta";
import { useABVariant } from "./useABVariant";
import PriceAnchor from "./PriceAnchor";
import { track } from "./track";

export default function BlurMask({ 
  children, 
  cta = "Unlock Full Report",
  id 
}: { 
  children: React.ReactNode;
  cta?: string;
  id?: string;
}) {
  const b = useBrandTakeover();
  const variant = useABVariant();
  
  if (!b.enabled) return <>{children}</>;
  
  const handleBlurClick = () => {
    track("cta_click", { placement: "blur", id });
    document.dispatchEvent(new CustomEvent("openInstall"));
  };
  
  return (
    <div style={{ position:"relative" }}>
      {children}
      <div style={{ position:"absolute", inset:0, backdropFilter:"blur(7px)", background:"rgba(255,255,255,.35)" }} />
      <div style={{ position:"absolute", inset:"auto 8px 8px auto", fontSize:12, color:"#fff",
                    background:"rgba(0,0,0,.6)", borderRadius:8, padding:"6px 10px" }}>
        Preview — details hidden
      </div>
      <button 
        onClick={handleBlurClick}
        style={{ position:"absolute", left:"50%", bottom:"14px", transform:"translateX(-50%)",
                 padding:"8px 12px", borderRadius:12, border:"none", background:"var(--brand-primary)", color:"#fff", cursor:"pointer" }}
        aria-label="Preview — details hidden. Activate to unlock full report."
      >
        {cta}
      </button>
      <div style={{ position:"absolute", bottom:"-60px", left:"50%", transform:"translateX(-50%)", width:"100%" }}>
        <PriceAnchor />
      </div>
    </div>
  );
}
