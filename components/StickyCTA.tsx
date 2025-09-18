"use client";

import { useState, useEffect } from "react";
import { useCompany } from "./CompanyContext";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

export default function StickyCTA() {
  const { company } = useCompany();
  const b = useBrandTakeover();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show CTA when user has scrolled past 50% of the page
      if (scrollY > (documentHeight - windowHeight) * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLaunchClick = async () => {
    if (b.enabled) {
      // Start Stripe checkout with tracking
      try {
        // Collect tracking parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const company = urlParams.get("company");
        const utm_source = urlParams.get("utm_source");
        const utm_campaign = urlParams.get("utm_campaign");

        // Start checkout
        const response = await fetch("/api/stripe/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: "starter",
            token,
            company,
            utm_source,
            utm_campaign,
          }),
        });

        if (!response.ok) {
          throw new Error("Checkout failed");
        }

        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        console.error("Checkout error:", error);
        alert("Unable to start checkout. Please try again.");
      }
    }
  };

  if (!isVisible || !b.enabled) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              Ready to launch your solar tool?
            </h3>
            <p className="text-sm text-gray-600">
              Get your branded solar intelligence platform live in 24 hours
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLaunchClick}
              className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              <span className="mr-2">⚡</span>
              Activate on Your Domain — 24 Hours
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
