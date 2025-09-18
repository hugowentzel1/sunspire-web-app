"use client";

import { useEffect } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { useBrandColors } from "@/hooks/useBrandColors";
import LegalFooter from "@/components/legal/LegalFooter";
import { track } from "@/src/demo/track";
import { attachCheckoutHandlers } from "@/src/lib/checkout";

export default function PricingPage() {
  const b = useBrandTakeover();

  // Apply brand colors from URL
  useBrandColors();

  // Attach checkout handlers to CTAs
  useEffect(() => {
    attachCheckoutHandlers();
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
    } else {
      // Route to signup page
      window.location.href = "/signup";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-[var(--brand)] transition-colors font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </a>
        </div>

        <div className="text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="relative">
              <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden bg-[var(--brand)]">
                <span className="text-6xl relative z-10">💰</span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
                Simple, Transparent
                <span className="block text-[var(--brand)]">Pricing</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                One flat rate. No hidden fees. 14-day refund guarantee if it
                doesn&apos;t lift your booked calls.
              </p>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 p-8 md:p-12 max-w-2xl mx-auto">
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-2">
                  $99/mo + $399 setup
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--brand)]">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Unlimited solar quotes</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--brand)]">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">
                    CRM integration (HubSpot, Salesforce)
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--brand)]">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">White-label branding</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--brand)]">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">24/7 support</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--brand)]">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">SOC 2 compliance</span>
                </div>
              </div>

              <button
                data-cta="primary"
                onClick={handleLaunchClick}
                className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-medium text-white border border-transparent shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer bg-[var(--brand)]"
              >
                <span className="mr-2">⚡</span>
                Activate on Your Domain — 24 Hours
              </button>

              <p className="text-sm text-gray-600 mt-2">
                No call required. 14-day refund if it doesn&apos;t lift booked
                calls.
              </p>
            </div>
          </div>

          {/* Setup Fee */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What&apos;s included in the setup fee?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Custom domain setup and SSL certificate</p>
              <p>• White-label branding and logo integration</p>
              <p>• CRM connection (HubSpot, Salesforce, Airtable)</p>
              <p>• Team training and onboarding</p>
              <p>• 24/7 priority support for first 30 days</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does setup take?
              </h3>
              <p className="text-gray-600">
                Most customers are live within 24 hours. Complex integrations
                may take up to 48 hours.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes, no long-term contracts. Cancel anytime with 30 days notice.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if it doesn&apos;t work for my business?
              </h3>
              <p className="text-gray-600">
                We offer a 14-day refund guarantee if the platform doesn&apos;t
                help increase your booked calls.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer volume discounts?
              </h3>
              <p className="text-gray-600">
                Yes, for companies with 10+ locations. Contact us for enterprise
                pricing.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LegalFooter brand={b.enabled ? b.brand : undefined} />
      </footer>
    </div>
  );
}
