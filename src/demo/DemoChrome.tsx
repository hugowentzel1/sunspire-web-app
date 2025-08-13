"use client";
import React, { useEffect, useState } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

function ExpiryBadge({days}:{days:number}){ return <span style={{fontSize:12,padding:"4px 8px",borderRadius:999,background:"#FFF3CD",color:"#8C6D1F"}}>Expires in {days} day{days===1?"":"s"}</span>; }

export function DemoBanner(){
  const b = useBrandTakeover();
  const [closed,setClosed]=useState(false);
  if(!b.enabled || closed) return null;
  const copy=()=>navigator.clipboard.writeText(location.href);
  const open=()=>document.dispatchEvent(new CustomEvent("openInstall"));
  return (
    <div style={{position:"sticky",top:0,zIndex:1000,display:"flex",gap:10,justifyContent:"center",alignItems:"center",padding:"10px 12px",background:"#fff",borderBottom:"1px solid #eee"}}>
      <strong>Exclusive preview built for {b.brand}</strong>
      <span style={{opacity:.7}}>Ready to launch on your site</span>
      <button className="btn" style={{background:"var(--brand-primary)"}} onClick={open}>Add to {b.domain ?? "our site"}</button>
      <button className="btn" onClick={copy}>Copy link</button>
      <ExpiryBadge days={b.expireDays}/>
      <button onClick={()=>setClosed(true)} aria-label="Dismiss">✕</button>
    </div>
  );
}

export function StickyBuyBar(){
  const b = useBrandTakeover();
  if(!b.enabled) return null;
  const open=()=>document.dispatchEvent(new CustomEvent("openInstall"));
  const copy=()=>navigator.clipboard.writeText(location.href);
  return (
    <div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:1000,display:"flex",gap:10,justifyContent:"center",padding:"10px",background:"rgba(255,255,255,.92)",borderTop:"1px solid #eee",backdropFilter:"saturate(1.1) blur(4px)"}}>
      <button className="btn" style={{background:"var(--brand-primary)"}} onClick={open}>Add to {b.domain ?? "our site"}</button>
      <button className="btn" onClick={copy}>Copy link</button>
    </div>
  );
}
