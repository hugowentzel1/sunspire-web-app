"use client";
import React, { useEffect, useState } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { useCountdown } from "./useCountdown";
import { getCTA } from "./cta";
import { useABVariant } from "./useABVariant";
import { track } from "./track";

function ExpiryBadge({days, hours, minutes, seconds}:{days:number, hours:number, minutes:number, seconds:number}){ 
  return (
    <span style={{fontSize:12,padding:"4px 8px",borderRadius:999,background:"#FFF3CD",color:"#8C6D1F"}}>
      Expires in {days}d {hours}h {minutes}m {seconds}s
    </span>
  ); 
}

export function DemoBanner(){
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays);
  const variant = useABVariant();
  const [closed,setClosed]=useState(false);
  
  if(!b.enabled || closed) return null;
  
  const copy=()=>{
    navigator.clipboard.writeText(location.href);
    track("cta_click", { event: "cta_click", cta_type: "copy_link" });
  };
  const open=()=>{
    document.dispatchEvent(new CustomEvent("openInstall"));
    track("cta_click", { event: "cta_click", cta_type: "banner_primary" });
  };
  
  return (
    <div style={{position:"sticky",top:0,zIndex:1000,display:"flex",gap:10,justifyContent:"center",alignItems:"center",padding:"10px 12px",background:"#fff",borderBottom:"1px solid #eee"}}>
      <strong>Exclusive preview built for {b.brand}</strong>
      <span style={{opacity:.7}}>Ready to launch on your site</span>
      <button className="btn" style={{background:"var(--brand-primary)"}} onClick={open}>
        {getCTA(variant, "primary", b.domain)}
      </button>
      <button className="btn" onClick={copy}>Copy link</button>
      <ExpiryBadge days={countdown.days} hours={countdown.hours} minutes={countdown.minutes} seconds={countdown.seconds}/>
      <button onClick={()=>setClosed(true)} aria-label="Dismiss">✕</button>
    </div>
  );
}

export function StickyBuyBar(){
  const b = useBrandTakeover();
  const countdown = useCountdown(b.expireDays);
  const variant = useABVariant();
  
  if(!b.enabled) return null;
  
  const open=()=>{
    document.dispatchEvent(new CustomEvent("openInstall"));
    track("cta_click", { event: "cta_click", cta_type: "sticky_primary" });
  };
  const copy=()=>{
    navigator.clipboard.writeText(location.href);
    track("cta_click", { event: "cta_click", cta_type: "sticky_copy" });
  };
  
  return (
    <div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:1000,display:"flex",gap:10,justifyContent:"center",padding:"10px",background:"rgba(255,255,255,.92)",borderTop:"1px solid #eee",backdropFilter:"saturate(1.1) blur(4px)"}}>
      <button className="btn" style={{background:"var(--brand-primary)"}} onClick={open}>
        {getCTA(variant, "primary", b.domain)}
      </button>
      <button className="btn" onClick={copy}>Copy link</button>
      <div style={{fontSize:12,color:"#6B7280",display:"flex",alignItems:"center"}}>
        Expires in {countdown.days}d {countdown.hours}h {countdown.minutes}m
      </div>
    </div>
  );
}
