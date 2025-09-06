"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { getCTA } from "./cta";
import { useABVariant } from "./useABVariant";
import { useCountdown } from "./useCountdown";

export default function LockOverlay() {
  const b = useBrandTakeover();
  const variant = useABVariant();
  const countdown = useCountdown(b.expireDays || 7);

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

  async function openStripeCheckout() {
    try {
      // Collect tracking parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const company = urlParams.get('company');
      const utm_source = urlParams.get('utm_source');
      const utm_campaign = urlParams.get('utm_campaign');
      
      // Start checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'starter',
          token,
          company,
          utm_source,
          utm_campaign
        })
      });
      
      if (!response.ok) {
        throw new Error('Checkout failed');
      }
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to start checkout. Please try again.');
    }
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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "48px",
        maxWidth: "900px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}>
        {/* Brand Logo/Name */}
        <div style={{ marginBottom: "40px" }}>
          {b.logo ? (
            <Image 
              src={b.logo} 
              alt={`${b.brand} logo`} 
              width={100}
              height={100}
              unoptimized
              className="mx-auto mb-6"
              sizes="100vw"
              style={{ height: 'auto', width: 'auto' }}
            />
          ) : (
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "24px",
              background: "var(--brand-primary)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: "32px",
              fontWeight: "800",
              margin: "0 auto 24px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)"
            }}>
              {b.brand.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]?.toUpperCase()).join("")}
            </div>
          )}
          <h2 style={{ 
            fontSize: "32px", 
            fontWeight: "800", 
            color: "#111827",
            marginBottom: "8px",
            lineHeight: "1.2"
          }}>
            🚫 Demo quota exhausted
          </h2>
          <p style={{
            fontSize: "18px",
            color: "#6B7280",
            margin: "0 0 16px 0"
          }}>
            Activate to get full access
          </p>
          
          {/* Countdown Timer */}
          <div style={{
            background: "var(--brand-primary)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "12px",
            display: "inline-block",
            fontSize: "16px",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
          }}>
            {countdown.isExpired ? (
              "Demo Expired"
            ) : (
              `Expires in ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`
            )}
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          marginBottom: "48px",
          alignItems: "start"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--brand-primary)",
                marginRight: "8px"
              }}></div>
              <h3 style={{ 
                fontSize: "20px", 
                fontWeight: "700", 
                margin: "0", 
                color: "#DC2626" 
              }}>
                What You See Now
              </h3>
            </div>
            <div style={{
              height: "140px",
              background: "#FEF2F2",
              border: "3px dashed #FCA5A5",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#DC2626",
              fontWeight: "600",
              fontSize: "16px",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "48px",
                opacity: "0.3"
              }}>🔒</div>
              <div style={{ zIndex: 1 }}>Blurred Data</div>
            </div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10B981",
                marginRight: "8px"
              }}></div>
              <h3 style={{ 
                fontSize: "20px", 
                fontWeight: "700", 
                margin: "0", 
                color: "#10B981" 
              }}>
                What You Get Live
              </h3>
            </div>
            <div style={{
              height: "140px",
              background: "#ECFDF5",
              border: "3px solid #10B981",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#059669",
              fontWeight: "700",
              fontSize: "16px",
              position: "relative",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)"
            }}>
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "48px",
                opacity: "0.3"
              }}>✨</div>
              <div style={{ zIndex: 1 }}>Full Reports</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: "32px"
        }}>
          <button 
            onClick={openStripeCheckout}
            data-cta="primary"
            style={{
              padding: "18px 36px",
              background: "var(--brand-primary)",
              color: "#fff",
              border: "none",
              borderRadius: "16px",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
              transition: "all 0.2s ease",
              minWidth: "200px"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.15)";
            }}
          >
            Activate on Your Domain — 24 Hours
          </button>
        </div>

        {/* Pricing Info */}
        <div style={{
          background: "#F8FAFC",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px"
        }}>
          <p style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
            margin: "0 0 8px 0"
          }}>
            Full version from just $99/mo + $399 setup
          </p>
          <p style={{
            fontSize: "14px",
            color: "#6B7280",
            margin: "0"
          }}>
            Most tools cost $2,500+/mo. Cancel anytime. No long-term contracts.
          </p>
        </div>

      </div>
    </div>
  );
}