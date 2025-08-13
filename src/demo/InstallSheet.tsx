"use client";
import React, { useEffect, useState } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

export default function InstallSheet(){
  const b = useBrandTakeover();
  const [open,setOpen]=useState(false);
  useEffect(()=>{ const on=()=>setOpen(true); document.addEventListener("openInstall",on); return ()=>document.removeEventListener("openInstall",on); },[]);
  useEffect(()=>{ if(b.enabled && b.pilot) setOpen(true); },[b.enabled,b.pilot]);
  if(!b.enabled || !open) return null;

  async function emailPack(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const email=new FormData(e.currentTarget).get("email");
    await fetch("/api/demo-event",{method:"POST",body:JSON.stringify({type:"email_pack",email,brand:b.brand,primary:b.primary,domain:b.domain,rep:b.rep,demoLink:location.href})});
    alert("Install pack sent. Check your inbox.");
  }

  return (
    <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:1100,display:"grid",placeItems:"end"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"min(520px,96vw)",background:"#fff",height:"100%",padding:24,overflow:"auto"}}>
        <h3>Add to {b.domain ?? "your site"}</h3>
        <ol>
          <li><strong>Hosted subdomain</strong> (fastest): solar.{b.domain ?? "yourdomain.com"}</li>
          <li><strong>Embed</strong> (1-line script & API key)</li>
        </ol>
        <button className="btn" style={{background:"var(--brand-primary)"}} onClick={()=>alert("Checkout placeholder — integrate Stripe/Invoice")}>Start Free Pilot</button>
        <hr style={{margin:"16px 0"}}/>
        <form onSubmit={emailPack}>
          <label style={{display:"block",marginBottom:6}}>Or email me the install pack</label>
          <input required type="email" name="email" placeholder="name@company.com" style={{width:"100%",padding:10,border:"1px solid #ddd",borderRadius:8}}/>
          <div style={{marginTop:10,display:"flex",gap:8}}>
            <button className="btn" type="submit">Send</button>
            <button className="btn" type="button" onClick={()=>setOpen(false)}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}
