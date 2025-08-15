"use client";
import React, { useEffect, useState } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { getCTA } from "./cta";
import { useABVariant } from "./useABVariant";
import { track } from "./track";

export default function InstallSheet(){
  const b = useBrandTakeover();
  const variant = useABVariant();
  const [open,setOpen]=useState(false);
  const [sampleReport, setSampleReport] = useState(false);
  
  useEffect(()=>{ 
    const on=(e: CustomEvent) => {
      setOpen(true);
      if (e.detail?.sampleReport) {
        setSampleReport(true);
      }
    }; 
    document.addEventListener("openInstall", on as EventListener); 
    return ()=>document.removeEventListener("openInstall", on as EventListener); 
  },[]);
  
  useEffect(()=>{ if(b.enabled && b.pilot) setOpen(true); },[b.enabled,b.pilot]);
  
  if(!b.enabled || !open) return null;

  async function emailPack(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const email=new FormData(e.currentTarget).get("email");
    await fetch("/api/demo-event",{method:"POST",body:JSON.stringify({
      type:"email_pack",
      email,
      brand:b.brand,
      primary:b.primary,
      domain:b.domain,
      rep:b.rep,
      demoLink:location.href,
      sampleReport,
      variant
    })});
    track("install_open", { event: "install_open", sample_report: sampleReport });
    alert("Install pack sent. Check your inbox.");
  }

  function openStripeCheckout() {
    const params = new URLSearchParams({
      brand: b.brand,
      domain: b.domain || "yourdomain.com",
      rep: b.rep || "demo",
      utm_source: "demo_install",
      utm_medium: "modal",
      utm_campaign: "install_sheet",
      variant
    });
    
    // Test Stripe checkout - replace with your actual checkout URL
    const checkoutUrl = `https://checkout.stripe.com/test?${params.toString()}`;
    window.open(checkoutUrl, "_blank");
    track("cta_click", { event: "cta_click", cta_type: "install_primary" });
  }

  return (
    <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:1100,display:"grid",placeItems:"end"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"min(520px,96vw)",background:"#fff",height:"100%",padding:24,overflow:"auto"}}>
        <h3>Add to {b.domain ?? "your site"}</h3>
        <ol>
          <li><strong>Hosted subdomain</strong> (fastest): solar.{b.domain ?? "yourdomain.com"}</li>
          <li><strong>Embed</strong> (1-line script & API key)</li>
        </ol>
        <button className="btn" style={{background:"var(--brand-primary)"}} onClick={openStripeCheckout}>
          {getCTA(variant, "primary", b.domain)}
        </button>
        <hr style={{margin:"16px 0"}}/>
        <form onSubmit={emailPack}>
          <label style={{display:"block",marginBottom:6}}>Or email me the install pack</label>
          <div style={{marginBottom:12}}>
            <label style={{display:"flex",alignItems:"center",gap:8}}>
              <input 
                type="checkbox" 
                checked={sampleReport}
                onChange={(e) => setSampleReport(e.target.checked)}
                style={{margin:0}}
              />
              <span style={{fontSize:14}}>Include sample report</span>
            </label>
          </div>
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
