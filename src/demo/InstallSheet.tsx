"use client";
import React, { useEffect, useState } from "react";
import { useIsDemo, useDemoParams } from "./useDemo";
import { usePersonalizationCtx } from "@/src/personalization/PersonalizationContext";

export default function InstallSheet() {
  const isDemo = useIsDemo();
  const { brand, primary } = usePersonalizationCtx();
  const { domain, rep, pilot } = useDemoParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setOpen(true);
    document.addEventListener("openInstall", on);
    return () => document.removeEventListener("openInstall", on);
  }, []);

  // Autopen for high-intent links: &pilot=1
  useEffect(() => { 
    if (isDemo && pilot) setOpen(true); 
  }, [isDemo, pilot]);

  if (!isDemo || !open) return null;

  async function emailPack(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/demo-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "email_pack",
        email: form.get("email"),
        brand, 
        primary, 
        domain, 
        rep,
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
          Put Sunspire on {domain ?? "your site"}
        </h3>
        <p style={{ margin: "0 0 12px 0" }}>Choose one to start now:</p>
        <ol style={{ margin: "0 0 16px 0", paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}>
            <strong>Hosted subdomain</strong> (fastest): e.g. solar.{domain ?? "yourdomain.com"}
          </li>
          <li style={{ marginBottom: "8px" }}>
            <strong>Embed on your site</strong> (1-line script & API key)
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
                background: "white",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px"
              }}
              type="button" 
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </form>
        <p style={{ opacity: 0.7, marginTop: 12, fontSize: "12px" }}>
          Demo data. For illustration only.
        </p>
      </div>
    </div>
  );
}
