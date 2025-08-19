"use client";
import React, { useEffect } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { getCTA } from "./cta";
import { useABVariant } from "./useABVariant";
import PriceAnchor from "./PriceAnchor";

export default function LockOverlay() {
  const b = useBrandTakeover();
  const variant = useABVariant();

  // Block scrolling and tab focus
  useEffect(() => {
    if (typeof document === "undefined") return;
    
    document.body.style.overflow = "hidden";
    const focusableElements = document.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    focusableElements.forEach((el) => {
      (el as HTMLElement).setAttribute("tabindex", "-1");
    });

    return () => {
      document.body.style.overflow = "";
      focusableElements.forEach((el) => {
        (el as HTMLElement).removeAttribute("tabindex");
      });
    };
  }, []);

  if (!b.enabled) return null;

  function openStripeCheckout() {
    const params = new URLSearchParams({
      brand: b.brand,
      domain: b.domain || "yourdomain.com",
      rep: b.rep || "demo",
      utm_source: "demo_lock",
      utm_medium: "overlay",
      utm_campaign: "lock_screen"
    });
    
    // Test Stripe checkout - replace with your actual checkout URL
    const checkoutUrl = `https://checkout.stripe.com/test?${params.toString()}`;
    window.open(checkoutUrl, "_blank");
  }

  function openInstallSheet() {
    document.dispatchEvent(new CustomEvent("openInstall", { 
      detail: { sampleReport: true } 
    }));
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.95)",
      zIndex: 2000,
      display: "grid",
      placeItems: "center",
      padding: "24px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "32px",
        maxWidth: "800px",
        width: "100%",
        textAlign: "center"
      }}>
        {/* Brand Logo/Name */}
        <div style={{ marginBottom: "24px" }}>
          {b.logo ? (
            <img 
              src={b.logo} 
              alt={`${b.brand} logo`} 
              style={{ 
                width: "80px", 
                height: "80px", 
                objectFit: "contain",
                margin: "0 auto 16px"
              }} 
            />
          ) : (
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: b.primary,
              color: "#0D0D0D",
              display: "grid",
              placeItems: "center",
              fontSize: "24px",
              fontWeight: "800",
              margin: "0 auto 16px"
            }}>
              {b.brand.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]?.toUpperCase()).join("")}
            </div>
          )}
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#111827" }}>
            Your Solar Intelligence Tool is now locked.
          </h2>
        </div>

        {/* Side-by-side comparison */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px"
        }}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#6B7280" }}>
              What You See Now
            </h3>
            <div style={{
              height: "120px",
              background: "#F3F4F6",
              border: "2px dashed #D1D5DB",
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              color: "#9CA3AF"
            }}>
              Blurred Data
            </div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#059669" }}>
              What You Get Live
            </h3>
            <div style={{
              height: "120px",
              background: "#ECFDF5",
              border: "2px solid #10B981",
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              color: "#059669",
              fontWeight: "600"
            }}>
              Full Reports
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            onClick={openStripeCheckout}
            style={{
              padding: "16px 32px",
              background: "var(--brand-primary)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {getCTA(variant, "primary", b.domain)}
          </button>
          
          <button 
            onClick={openInstallSheet}
            className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1"
            style={{
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              background: "var(--brand-primary, #FFA63D)",
              color: "#ffffff",
              border: "2px solid var(--brand-primary, #FFA63D)",
              boxShadow: "0 8px 25px rgba(255, 166, 61, 0.3)"
            }}
          >
            Request Sample Report
          </button>
        </div>

        <PriceAnchor />
      </div>
    </div>
  );
}
