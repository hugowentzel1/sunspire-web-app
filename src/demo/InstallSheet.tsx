"use client";
import React, { useEffect, useState } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

export default function InstallSheet() {
  const b = useBrandTakeover();
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const on = () => setOpen(true);
    document.addEventListener("openInstall", on);
    return () => document.removeEventListener("openInstall", on);
  }, []);
  
  useEffect(() => { 
    if (b.enabled && b.pilot) setOpen(true); 
  }, [b.enabled, b.pilot]);
  
  if (!b.enabled || !open) return null;

  async function emailPack(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    await fetch("/api/demo-event", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "email_pack", 
        email, 
        brand: b.brand, 
        primary: b.primary, 
        domain: b.domain, 
        rep: b.rep, 
        demoLink: window.location.href
      })
    });
    alert("Install pack sent. Check your inbox.");
  }

  return (
    <div 
      onClick={() => setOpen(false)}
      style={{ 
        position: "fixed", 
        inset: 0, 
        background: "rgba(0,0,0,.35)", 
        zIndex: 1100, 
        display: "grid", 
        placeItems: "end" 
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: "min(520px,96vw)", 
          background: "#fff", 
          height: "100%", 
          padding: 24, 
          overflow: "auto" 
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "600" }}>
          Add to {b.domain ?? "your site"}
        </h3>
        <ol style={{ margin: "0 0 16px 0", paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}>
            <strong>Hosted subdomain</strong> (fastest): e.g. solar.{b.domain ?? "yourdomain.com"}
          </li>
          <li style={{ marginBottom: "8px" }}>
            <strong>Embed</strong> (1-line script & API key)
          </li>
        </ol>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button 
            style={{
              padding: "10px 20px",
              background: "#f97316",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
            onClick={() => alert("Checkout placeholder — integrate Stripe/Invoice")}
          >
            Start Free Pilot
          </button>
        </div>
        <hr style={{ margin: "16px 0" }} />
        <form onSubmit={emailPack}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "500" }}>
            Or email me the install pack
          </label>
          <input 
            required 
            type="email" 
            name="email" 
            placeholder="name@company.com"
            style={{ 
              width: "100%", 
              padding: 10, 
              border: "1px solid #ddd", 
              borderRadius: 8,
              marginBottom: "10px"
            }}
          />
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button 
              style={{
                padding: "8px 16px",
                background: "#f97316",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px"
              }}
              type="submit"
            >
              Send
            </button>
            <button 
              style={{
                padding: "8px 16px",
                background: "#f8fafc",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
              type="button" 
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
