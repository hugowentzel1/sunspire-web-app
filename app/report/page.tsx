"use client";

import { useState, useEffect, useCallback } from "react";

// Extend window object to include our function
declare global {
  interface Window {
    consumeQuotaIfNeeded?: () => void;
  }
}
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { TenantProvider, useTenant } from "@/components/TenantProvider";
// LeadModal import removed - no popups wanted
import { SolarEstimate } from "@/lib/estimate";
import EstimateChart from "@/components/EstimateChart";
import { formatDateSafe } from "@/lib/format";
import LegalFooter from "@/components/legal/LegalFooter";
import PaidFooter from "@/components/PaidFooter";
import DisclaimerBar from "@/components/DisclaimerBar";
import { IconBadge } from "@/components/ui/IconBadge";
import UnlockButton from "@/components/UnlockButton";
import { ResultsAttribution } from "@/components/legal/ResultsAttribution";

import { ensureBlurSupport } from "@/src/lib/ensureBlur";
import { isDemoFromSearchParams } from "@/src/lib/isDemo";
import { isDemoFromSearch } from "@/lib/isDemo";
import { tid } from "@/src/lib/testids";

import { getBrandTheme } from "@/lib/brandTheme";
// import StickyBuyBar from '@/src/demo/StickyBuyBar';
// import InstallSheet from '@/src/demo/InstallSheet';
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import HeroBrand from "@/src/brand/HeroBrand";
import StickyBar from "@/components/StickyBar";
// StickyCTA import removed - no popups wanted
// import { DemoBanner } from '@/src/demo/DemoChrome';
import LockOverlay from "@/src/demo/LockOverlay";
import { usePreviewQuota } from "@/src/demo/usePreviewQuota";
import { useCountdown } from "@/src/demo/useCountdown";
import Image from "next/image";

// Demo addresses for different states
const demoAddressesByState: Record<
  string,
  { address: string; lat: number; lng: number }
> = {
  AZ: {
    address: "123 N Central Ave, Phoenix, AZ",
    lat: 33.4484,
    lng: -112.074,
  },
  CA: {
    address: "111 S Spring St, Los Angeles, CA",
    lat: 34.0537,
    lng: -118.2428,
  },
  FL: { address: "200 S Orange Ave, Orlando, FL", lat: 28.5384, lng: -81.3789 },
  GA: { address: "2 City Plaza, Atlanta, GA", lat: 33.749, lng: -84.388 },
  TX: { address: "901 S Mopac Expy, Austin, TX", lat: 30.2672, lng: -97.7431 },
  NV: {
    address: "400 Stewart Ave, Las Vegas, NV",
    lat: 36.1716,
    lng: -115.1391,
  },
};

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tenant, loading: tenantLoading } = useTenant();
  const [estimate, setEstimate] = useState<SolarEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // showLeadModal state removed - no popups wanted
  const [demoMode, setDemoMode] = useState(false);

  // Brand takeover mode detection
  const b = useBrandTakeover();

  // Demo quota management
  const { read, consume } = usePreviewQuota(2);
  const [remaining, setRemaining] = useState(2);
  const [quotaConsumed, setQuotaConsumed] = useState(false);
  const [pageLoadId] = useState(() => Date.now().toString());
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Countdown for demo expiry
  const countdown = useCountdown(b.expireDays || 7);

  // Initialize remaining from quota
  useEffect(() => {
    const currentQuota = read();
    setRemaining(currentQuota);
  }, [read]);

  // Reset quota consumed state on each page load
  useEffect(() => {
    setQuotaConsumed(false);
  }, [searchParams]);

  // Update remaining quota
  useEffect(() => {
    const currentRemaining = read();
    console.log("🔒 Demo quota - read():", currentRemaining);
    setRemaining(currentRemaining);
  }, [read]);

  // Don't reset quota consumed flag - track per URL session

  // Checkout handlers are attached via onClick props on buttons

  // Consume quota when user interacts with report - will be defined inside useEffect

  // Stripe checkout handler
  const handleCheckout = async () => {
    // Consume quota when user clicks checkout
    if (typeof window.consumeQuotaIfNeeded === "function") {
      window.consumeQuotaIfNeeded();
    }

    console.log("🛒 handleCheckout called");
    try {
      // Collect tracking parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const company = urlParams.get("company");
      const utm_source = urlParams.get("utm_source");
      const utm_campaign = urlParams.get("utm_campaign");

      console.log("🛒 Starting checkout with params:", {
        token,
        company,
        utm_source,
        utm_campaign,
      });

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
      console.error("🛒 Checkout error:", error);
      alert("Unable to start checkout. Please try again.");
    }
  };

  // Lead submit handler for paid mode
  const handleLeadSubmit = async (leadData: any) => {
    try {
      // Submit lead to CRM (stubbed for now)
      console.log("📝 Submitting lead:", leadData);

      // Show success toast for paid mode only
      if (!demoMode) {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      }
    } catch (error) {
      console.error("📝 Lead submit error:", error);
    }
  };

  // Capitalize company names properly
  const capitalizeCompanyName = (brand: string) => {
    if (!brand) return "";

    // Handle special cases
    const specialCases: Record<string, string> = {
      meta: "Meta",
      facebook: "Facebook",
      google: "Google",
      microsoft: "Microsoft",
      apple: "Apple",
      amazon: "Amazon",
      netflix: "Netflix",
      spotify: "Spotify",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      instagram: "Instagram",
      twitch: "Twitch",
      discord: "Discord",
      slack: "Slack",
      shopify: "Shopify",
      uber: "Uber",
      lyft: "Lyft",
      tesla: "Tesla",
      sunpower: "SunPower",
      solarcity: "SolarCity",
      vivint: "Vivint",
      sunrun: "Sunrun",
      sunnova: "Sunnova",
      tealenergy: "Teal Energy",
      solarpro: "SolarPro",
      ecosolar: "EcoSolar",
      premiumsolar: "Premium Solar",
      acme: "ACME",
      bp: "BP",
      shell: "Shell",
      exxon: "ExxonMobil",
      chevron: "Chevron",
      zillow: "Zillow",
      redfin: "Redfin",
      realtor: "Realtor.com",
      homedepot: "The Home Depot",
      chase: "Chase",
      wellsfargo: "Wells Fargo",
      bankofamerica: "Bank of America",
      goldmansachs: "Goldman Sachs",
      starbucks: "Starbucks",
      mcdonalds: "McDonald's",
      cocacola: "Coca-Cola",
      coca: "Coca-Cola",
      target: "Target",
      bestbuy: "Best Buy",
      snapchat: "Snapchat",
      whatsapp: "WhatsApp",
      firefox: "Firefox",
      harleydavidson: "Harley-Davidson",
    };

    const brandLower = brand.toLowerCase();
    return (
      specialCases[brandLower] ||
      brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()
    );
  };

  // Generate a default logo URL for common companies when no logo is provided
  const getDefaultLogo = (brand: string) => {
    const brandLower = brand.toLowerCase();

    // Tech companies
    if (brandLower.includes("google"))
      return "https://logo.clearbit.com/google.com";
    if (brandLower.includes("microsoft"))
      return "https://logo.clearbit.com/microsoft.com";
    if (brandLower.includes("apple"))
      return "https://logo.clearbit.com/apple.com";
    if (brandLower.includes("amazon"))
      return "https://logo.clearbit.com/amazon.com";
    if (brandLower.includes("meta") || brandLower.includes("facebook"))
      return "https://logo.clearbit.com/facebook.com";
    if (brandLower.includes("netflix"))
      return "https://logo.clearbit.com/netflix.com";
    if (brandLower.includes("spotify"))
      return "https://logo.clearbit.com/spotify.com";
    if (brandLower.includes("twitter"))
      return "https://logo.clearbit.com/twitter.com";
    if (brandLower.includes("linkedin"))
      return "https://logo.clearbit.com/linkedin.com";
    if (brandLower.includes("instagram"))
      return "https://logo.clearbit.com/instagram.com";
    if (brandLower.includes("twitch"))
      return "https://logo.clearbit.com/twitch.tv";
    if (brandLower.includes("discord"))
      return "https://logo.clearbit.com/discord.com";
    if (brandLower.includes("slack"))
      return "https://logo.clearbit.com/slack.com";
    if (brandLower.includes("shopify"))
      return "https://logo.clearbit.com/shopify.com";
    if (brandLower.includes("uber"))
      return "https://logo.clearbit.com/uber.com";
    if (brandLower.includes("lyft"))
      return "https://logo.clearbit.com/lyft.com";

    // Solar companies
    if (brandLower.includes("tesla"))
      return "https://logo.clearbit.com/tesla.com";
    if (brandLower.includes("sunpower"))
      return "https://logo.clearbit.com/sunpower.com";
    if (brandLower.includes("solarcity"))
      return "https://logo.clearbit.com/solarcity.com";
    if (brandLower.includes("vivint"))
      return "https://logo.clearbit.com/vivint.com";
    if (brandLower.includes("sunrun"))
      return "https://logo.clearbit.com/sunrun.com";
    if (brandLower.includes("sunnova"))
      return "https://logo.clearbit.com/sunnova.com";
    if (brandLower.includes("tealenergy"))
      return "https://logo.clearbit.com/tealenergy.com";
    if (brandLower.includes("solarpro"))
      return "https://logo.clearbit.com/solarpro.com";
    if (brandLower.includes("ecosolar"))
      return "https://logo.clearbit.com/ecosolar.com";
    if (brandLower.includes("premiumsolar"))
      return "https://logo.clearbit.com/premiumsolar.com";
    if (brandLower.includes("acme"))
      return "https://logo.clearbit.com/acme.com";

    // Energy companies
    if (brandLower.includes("bp")) return "https://logo.clearbit.com/bp.com";
    if (brandLower.includes("shell"))
      return "https://logo.clearbit.com/shell.com";
    if (brandLower.includes("exxon"))
      return "https://logo.clearbit.com/exxonmobil.com";
    if (brandLower.includes("chevron"))
      return "https://logo.clearbit.com/chevron.com";

    // Real estate/home
    if (brandLower.includes("zillow"))
      return "https://logo.clearbit.com/zillow.com";
    if (brandLower.includes("redfin"))
      return "https://logo.clearbit.com/redfin.com";
    if (brandLower.includes("realtor"))
      return "https://logo.clearbit.com/realtor.com";
    if (brandLower.includes("homedepot"))
      return "https://logo.clearbit.com/homedepot.com";

    // Financial services
    if (brandLower.includes("chase"))
      return "https://logo.clearbit.com/chase.com";
    if (brandLower.includes("wellsfargo"))
      return "https://logo.clearbit.com/wellsfargo.com";
    if (brandLower.includes("bankofamerica"))
      return "https://logo.clearbit.com/bankofamerica.com";
    if (brandLower.includes("goldmansachs"))
      return "https://logo.clearbit.com/goldmansachs.com";

    // Other popular brands
    if (brandLower.includes("starbucks"))
      return "https://logo.clearbit.com/starbucks.com";
    if (brandLower.includes("mcdonalds"))
      return "https://logo.clearbit.com/mcdonalds.com";
    if (brandLower.includes("cocacola") || brandLower.includes("coca"))
      return "https://logo.clearbit.com/coca-cola.com";
    if (brandLower.includes("target"))
      return "https://logo.clearbit.com/target.com";
    if (brandLower.includes("bestbuy"))
      return "https://logo.clearbit.com/bestbuy.com";
    if (brandLower.includes("snapchat"))
      return "https://logo.clearbit.com/snapchat.com";
    if (brandLower.includes("whatsapp"))
      return "https://logo.clearbit.com/whatsapp.com";
    if (brandLower.includes("firefox"))
      return "https://logo.clearbit.com/mozilla.org";
    if (brandLower.includes("harleydavidson"))
      return "https://logo.clearbit.com/harley-davidson.com";

    return null;
  };

  const pickDemoAddress = useCallback((state?: string) => {
    if (state && demoAddressesByState[state])
      return demoAddressesByState[state];
    return demoAddressesByState["AZ"]; // sunny default
  }, []);

  const fetchEstimate = async (
    address: string,
    lat: number,
    lng: number,
    placeId?: string | null,
  ) => {
    try {
      const params = new URLSearchParams({
        address,
        lat: String(lat),
        lng: String(lng),
        ...(placeId && { placeId }),
      });
      const response = await fetch(`/api/estimate?${params}`);
      if (!response.ok)
        throw new Error(`Failed to fetch estimate: ${response.status}`);
      const data = await response.json();
      if (!data.estimate) throw new Error("No estimate data in response");
      setEstimate(data.estimate);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setEstimate({
        id: Date.now().toString(),
        address,
        coordinates: { lat, lng },
        date: new Date(),
        systemSizeKW: 8.6,
        tilt: 20,
        azimuth: 180,
        losses: 14,
        annualProductionKWh: 11105634,
        monthlyProduction: Array(12).fill(1000),
        solarIrradiance: 4.5,
        grossCost: 25800,
        netCostAfterITC: 18060,
        year1Savings: 2254,
        paybackYear: 8,
        npv25Year: 73000,
        co2OffsetPerYear: 10200,
        utilityRate: 0.14,
        utilityRateSource: "Static",
        assumptions: {
          itcPercentage: 0.3,
          costPerWatt: 3.0,
          degradationRate: 0.005,
          oandmPerKWYear: 22,
          electricityRateIncrease: 0.025,
          discountRate: 0.07,
        },
        cashflowProjection: Array.from({ length: 25 }, (_, i) => ({
          year: i + 1,
          production: Math.round(12000 * Math.pow(0.995, i)),
          savings: Math.round(12000 * Math.pow(0.995, i) * 0.14),
          cumulativeSavings: Math.round(12000 * 0.14 * (i + 1)),
          netCashflow: Math.round(12000 * 0.14 * (i + 1) - 18060),
        })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const sp = new URLSearchParams(searchParams as any);
    const isDemo = isDemoFromSearchParams(sp);
    const isDemoFromParams = isDemoFromSearch(sp);
    const company = searchParams.get("company");
    const hasBrand = !!company; // Company parameter does NOT imply demo
    const demoModeValue = isDemoFromParams; // Only demo param determines demo mode

    console.log("🔍 Demo mode detection:", {
      company,
      isDemo,
      hasBrand,
      demoModeValue,
      searchParams: Object.fromEntries(searchParams.entries()),
    });

    // Set demo mode state
    setDemoMode(demoModeValue);

    // Ensure blur support is available
    ensureBlurSupport();

    let address = searchParams.get("address") || "";
    let lat = parseFloat(searchParams.get("lat") || "");
    let lng = parseFloat(searchParams.get("lng") || "");
    const placeId = searchParams.get("placeId");
    const state = searchParams.get("state") || undefined;

    // If demo mode and missing coords, pick a good default by state
    if (
      isDemo &&
      (!Number.isFinite(lat) || !Number.isFinite(lng) || !address)
    ) {
      const pick = pickDemoAddress(state);
      address = pick.address;
      lat = pick.lat;
      lng = pick.lng;
    }

    // For demo mode or when we have coordinates, create a fallback estimate immediately
    if (isDemo || (address && Number.isFinite(lat) && Number.isFinite(lng))) {
      const fallbackEstimate = {
        id: Date.now().toString(),
        address: address || "123 Solar Street, San Diego, CA",
        coordinates: { lat: lat || 32.7157, lng: lng || -117.1611 },
        date: new Date(),
        systemSizeKW: 8.6,
        tilt: 20,
        azimuth: 180,
        losses: 14,
        annualProductionKWh: 11105634,
        monthlyProduction: Array(12).fill(1000),
        solarIrradiance: 4.5,
        grossCost: 25800,
        netCostAfterITC: 18060,
        year1Savings: 2254,
        paybackYear: 8,
        npv25Year: 73000,
        co2OffsetPerYear: 10200,
        utilityRate: 0.14,
        utilityRateSource: isDemo ? "Demo" : "Static",
        assumptions: {
          itcPercentage: 0.3,
          costPerWatt: 3.0,
          degradationRate: 0.005,
          oandmPerKWYear: 22,
          electricityRateIncrease: 0.025,
          discountRate: 0.07,
        },
        cashflowProjection: Array.from({ length: 25 }, (_, i) => ({
          year: i + 1,
          production: Math.round(12000 * Math.pow(0.995, i)),
          savings: Math.round(12000 * Math.pow(0.995, i) * 0.14),
          cumulativeSavings: Math.round(12000 * 0.14 * (i + 1)),
          netCashflow: Math.round(12000 * 0.14 * (i + 1) - 18060),
        })),
      };

      setEstimate(fallbackEstimate);
      setIsLoading(false);

      // Try to fetch real estimate in background if we have coordinates
      if (address && Number.isFinite(lat) && Number.isFinite(lng)) {
        fetchEstimate(address, lat, lng, placeId);
      }
    } else {
      setError("Missing address or coordinates.");
      setIsLoading(false);
    }

    // Don't consume quota immediately - only when user interacts with report
    console.log("🔒 Demo quota - report loaded, not consuming quota yet");

    // Define consumeQuotaIfNeeded function for checkout clicks (no additional consumption)
    window.consumeQuotaIfNeeded = () => {
      console.log(
        "🔒 Demo quota - checkout clicked, quota already consumed on report view",
      );
    };
  }, [searchParams, pickDemoAddress]);

  if (tenantLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-900">
            Generating your solar intelligence report...
          </p>
        </div>
      </div>
    );
  }

  if (error && !estimate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 max-w-md">
            <div className="font-semibold mb-2">Error Loading Report</div>
            <div>{error}</div>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!estimate) return null;

  // Show lock overlay if demo quota is exhausted
  const currentQuota = read();
  console.log(
    "🔒 Demo quota check - demoMode:",
    demoMode,
    "currentQuota:",
    currentQuota,
    "remaining:",
    remaining,
  );

  // Show lock overlay if quota is negative (only after all runs are exhausted)
  if (demoMode && currentQuota < 0) {
    console.log("🔒 Showing lock overlay - quota exhausted");
    return <LockOverlay />;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter"
      data-demo={demoMode}
    >
      {/* Custom banner for report page */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              {demoMode ? (
                b.logo || getDefaultLogo(b.brand) ? (
                  <Image
                    src={b.logo || getDefaultLogo(b.brand) || ""}
                    alt={`${b.brand} logo`}
                    width={48}
                    height={48}
                    className="rounded-lg"
                    style={{
                      objectFit: "contain",
                      width: "48px",
                      height: "48px",
                      minWidth: "48px",
                      minHeight: "48px",
                      maxWidth: "48px",
                      maxHeight: "48px",
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-bold">☀️</span>
                  </div>
                )
              ) : (
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">☀️</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-[var(--brand-primary)]">
                  {demoMode ? capitalizeCompanyName(b.brand) : "Your Company"}
                </h1>
                <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                  Solar Intelligence
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-12">
              <a
                href="/pricing"
                className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
              >
                Pricing
              </a>
              <a
                href="/partners"
                className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
              >
                Partners
              </a>
              <a
                href="/support"
                className="text-gray-600 hover:text-[var(--brand-primary)] transition-colors font-medium"
              >
                Support
              </a>
              <motion.button
                onClick={() => {
                  const company = searchParams.get("company");
                  const demo = searchParams.get("demo");
                  const url =
                    company && demo ? `/?company=${company}&demo=${demo}` : "/";
                  router.push(url);
                }}
                className="btn-primary ml-12"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Analysis
              </motion.button>
            </nav>
          </div>
        </div>
      </header>

      {/* Disclaimer Footer - Demo only */}
      {demoMode && (
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <p className="text-xs text-gray-500 text-center">
              Private demo for {capitalizeCompanyName(b.brand)}. Not affiliated.
            </p>
          </div>
        </div>
      )}

      <main
        data-testid="report-page"
        data-report-paid={!demoMode}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Live confirmation bar for paid mode - removed for clean paid experience */}

        {/* Success toast for paid mode */}
        {showSuccessToast && (
          <div
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
            {...tid("lead-success-toast")}
          >
            Saved! We&apos;ve received your inquiry.
          </div>
        )}

        {/* Ready-to text section - Only show in demo mode */}
        {demoMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="text-center">
              <p className="text-xl text-gray-700 leading-relaxed">
                Ready to Launch Your Branded Tool?
              </p>
            </div>
          </motion.div>
        )}

        {/* Theme probe for testing */}
        <div
          data-testid="theme-probe"
          style={{ color: "var(--brand)" }}
          className="hidden"
        />
        {/* Brand theme CSS variable */}
        <style>{`:root{--brand:${getBrandTheme(searchParams.get("company") || undefined)};}`}</style>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-24 h-24 mx-auto"
            >
              {demoMode && (b.logo || getDefaultLogo(b.brand)) ? (
                <Image
                  src={b.logo || getDefaultLogo(b.brand) || ""}
                  alt={`${b.brand} logo`}
                  width={96}
                  height={96}
                  className="rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,.08)]"
                  style={{
                    objectFit: "contain",
                    width: "96px",
                    height: "96px",
                  }}
                />
              ) : (
                <div className="brand-gradient text-white rounded-full w-24 h-24 grid place-items-center shadow-[0_8px_30px_rgba(0,0,0,.08)]">
                  <span className="text-4xl">☀️</span>
                </div>
              )}
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900">
                New Analysis
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive analysis for your property at {estimate.address}
              </p>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Data Source: {estimate.utilityRateSource}</span>
                <span>•</span>
                <span>Generated on {formatDateSafe(estimate.date)}</span>
              </div>

              {/* Demo quota counter - only show in demo mode */}
              {demoMode && (
                <div className="text-sm text-gray-500 text-center space-y-2 mt-4">
                  <p>
                    Preview: {remaining} run{remaining === 1 ? "" : "s"} left.
                  </p>
                  <p>
                    Expires in {countdown.days}d {countdown.hours}h{" "}
                    {countdown.minutes}m {countdown.seconds}s
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metric Tiles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch"
          >
            {/* System Size - NO BLUR, ALWAYS VISIBLE */}
            <div
              data-testid="tile-systemSize"
              data-kpi
              className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <IconBadge>⚡</IconBadge>
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2 tabular-nums">
                  {estimate.systemSizeKW} kW
                </div>
                <div className="text-gray-600 font-semibold">System Size</div>
              </div>
            </div>

            {/* Annual Production - NO BLUR, ALWAYS VISIBLE */}
            <div
              data-testid="tile-annualProduction"
              data-kpi
              className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative z-10 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <IconBadge>☀️</IconBadge>
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2 tabular-nums">
                  {estimate.annualProductionKWh.toLocaleString()} kWh
                </div>
                <div className="text-gray-600 font-semibold">
                  Annual Production
                </div>
              </div>
            </div>

            {/* Net Cost - BLURRED WITH UNLOCK BUTTON */}
            <div
              data-testid="tile-lifetimeSavings"
              data-kpi
              className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300"
            >
              {/* BLUR LAYER (kept behind button) - Demo Only */}
              {demoMode && <div className="blur-layer" aria-hidden />}

              {/* CONTENT LAYER */}
              <div className="content-layer p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <IconBadge>💰</IconBadge>
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2 tabular-nums">
                  ${estimate.netCostAfterITC.toLocaleString()}
                </div>
                <div className="text-gray-600 font-semibold">
                  Net Cost (After ITC)
                </div>
              </div>

              {/* UNLOCK BUTTON - Demo Only */}
              {demoMode && (
                <UnlockButton
                  label="Unlock Full Report"
                  onClick={handleCheckout}
                  className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2"
                />
              )}
            </div>

            {/* Year 1 Savings - BLURRED WITH UNLOCK BUTTON */}
            <div
              data-testid="tile-large"
              data-kpi
              className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50 hover:shadow-xl transition-all duration-300"
            >
              {/* BLUR LAYER (kept behind button) - Demo Only */}
              {demoMode && <div className="blur-layer" aria-hidden />}

              {/* CONTENT LAYER */}
              <div className="content-layer p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <IconBadge>📈</IconBadge>
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2 tabular-nums">
                  ${estimate.year1Savings.toLocaleString()}
                </div>
                <div className="text-gray-600 font-semibold">
                  Year 1 Savings
                </div>
              </div>

              {/* UNLOCK BUTTON - Demo Only */}
              {demoMode && (
                <UnlockButton
                  label="Unlock Full Report"
                  onClick={handleCheckout}
                  className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2"
                />
              )}
            </div>
          </motion.div>

          {/* Chart */}
          <div
            data-testid="savings-chart"
            className="relative rounded-2xl bg-white p-5 overflow-hidden"
          >
            <div className="relative z-10 min-h-[400px]">
              <EstimateChart
                cashflowData={estimate.cashflowProjection}
                netCostAfterITC={estimate.netCostAfterITC}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Financial Analysis - Blurred */}
            <div
              data-testid={demoMode ? "locked-panel" : "unlocked-panel"}
              className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50"
            >
              {/* BLUR LAYER - Demo Only */}
              {demoMode && <div className="blur-layer" aria-hidden />}

              {/* CONTENT LAYER */}
              <div className="content-layer p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Financial Analysis
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">Payback Period</span>
                    <span className="font-bold text-gray-900">
                      {estimate.paybackYear} years
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">25-Year NPV</span>
                    <span className="font-bold text-gray-900">
                      ${estimate.npv25Year.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">ROI</span>
                    <span className="font-bold text-gray-900">
                      {Math.round(
                        ((estimate.npv25Year + estimate.netCostAfterITC) /
                          estimate.netCostAfterITC) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-gray-600">Electricity Rate</span>
                    <span className="font-bold text-gray-900">
                      ${estimate.utilityRate}/kWh ({estimate.utilityRateSource})
                    </span>
                  </div>
                </div>
              </div>

              {/* UNLOCK BUTTON - Demo Only */}
              {demoMode && (
                <UnlockButton
                  label="Unlock Full Report"
                  onClick={handleCheckout}
                  className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2"
                />
              )}
            </div>

            {/* Environmental Impact - Blurred */}
            <div
              data-testid={demoMode ? "locked-panel" : "unlocked-panel"}
              className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/50"
            >
              {/* BLUR LAYER - Demo Only */}
              {demoMode && <div className="blur-layer" aria-hidden />}

              {/* CONTENT LAYER */}
              <div className="content-layer p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Environmental Impact
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">CO₂ Offset/Year</span>
                    <span className="font-bold text-gray-900">
                      {estimate.co2OffsetPerYear.toLocaleString()} lbs
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">Solar Irradiance</span>
                    <span className="text-gray-900">
                      {estimate.solarIrradiance} kWh/m²/day
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="text-gray-600">System Tilt</span>
                    <span className="text-gray-900">{estimate.tilt}°</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-gray-600">System Losses</span>
                    <span className="font-bold text-gray-900">
                      {estimate.losses}%
                    </span>
                  </div>
                </div>
              </div>

              {/* UNLOCK BUTTON - Demo Only */}
              {demoMode && (
                <UnlockButton
                  label="Unlock Full Report"
                  onClick={handleCheckout}
                  className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2"
                />
              )}
            </div>

            {/* Consolidated Information Box */}
            <div className="relative rounded-2xl p-8 bg-white border border-gray-200/50">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Calculation Details & Data Sources
                </h2>

                {/* Calculation Assumptions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Calculation Assumptions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">
                        Federal Tax Credit (ITC)
                      </span>
                      <span className="text-gray-900 font-bold">
                        {(estimate.assumptions.itcPercentage * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">Cost per Watt</span>
                      <span className="text-gray-900 font-bold">
                        ${estimate.assumptions.costPerWatt}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">Panel Degradation</span>
                      <span className="text-gray-900 font-bold">
                        {(estimate.assumptions.degradationRate * 100).toFixed(
                          1,
                        )}
                        %/year
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">O&M Cost</span>
                      <span className="text-gray-900 font-bold">
                        ${estimate.assumptions.oandmPerKWYear}/kW/year
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">Rate Increase</span>
                      <span className="text-gray-900 font-bold">
                        {(
                          estimate.assumptions.electricityRateIncrease * 100
                        ).toFixed(1)}
                        %/year
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Discount Rate</span>
                      <span className="text-gray-900 font-bold">
                        {(estimate.assumptions.discountRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Data Sources */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Data Sources
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <span>
                        Solar irradiance data from industry-standard models
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      <span>Utility rates from local utility databases</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                      <span>
                        Financial calculations based on current federal and
                        state incentives
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Estimates are informational only. Actual results vary by
                      site conditions and installation quality. Not a binding
                      quote.
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Last updated {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Demo-only CTA section - removed for paid experience */}

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 leading-relaxed">
                Estimates are informational only, based on modeled data (NREL
                PVWatts® v8 and current utility rates).
                <br />
                Actual results vary by site conditions and installation quality.
                Not a binding quote.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {demoMode ? (
        <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center text-gray-600">
            <p>Demo Footer - Powered by Sunspire</p>
          </div>
        </footer>
      ) : (
        <footer className="bg-gradient-to-b from-gray-50 via-white to-gray-100 border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-16">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center">
              {/* Company Logo & Name */}
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {b.brand || "Your Company"}
                </h3>
                {b.logo && (
                  <img
                    src={b.logo}
                    alt={`${b.brand || "Your Company"} logo`}
                    className="h-12 w-12 rounded-lg object-contain"
                  />
                )}
              </div>

              {/* Legal & Support */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                  Legal & Support
                </h4>
                <div className="space-y-3">
                  <a
                    href="/privacy"
                    className="block text-gray-600 hover:opacity-80 transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="/terms"
                    className="block text-gray-600 hover:opacity-80 transition-colors duration-200"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="/accessibility"
                    className="block text-gray-600 hover:opacity-80 transition-colors duration-200"
                  >
                    Accessibility
                  </a>
                  <a
                    href="/cookies"
                    className="block text-gray-600 hover:opacity-80 transition-colors duration-200"
                  >
                    Cookies
                  </a>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                  Contact
                </h4>
                <div className="space-y-3 text-sm text-gray-500">
                  <p className="flex items-center justify-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +1 (555) 123-4567
                  </p>
                  <p className="flex items-center justify-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      href="mailto:support@client-company.com"
                      className="hover:opacity-80 transition-colors"
                    >
                      support@client-company.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-200 pt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
                {/* NREL Disclaimer */}
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 ml-1 mr-2 text-gray-400 flex-shrink-0 align-middle"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="leading-tight">
                    Estimates generated using NREL PVWatts® v8
                  </span>
                </div>

                {/* Powered by Sunspire */}
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <span className="leading-tight">
                    Powered by{" "}
                    <span
                      className="font-medium"
                      style={{ color: b.primary || "#2563eb" }}
                    >
                      Sunspire
                    </span>
                  </span>
                </div>

                {/* Google Disclaimer */}
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <span className="leading-tight">
                    Mapping & location data © Google
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* LeadModal removed - no popups wanted */}

      {/* Demo components removed - no more popup */}

      {/* StickyCTA removed - no popups wanted */}

      {demoMode && <StickyBar />}
    </div>
  );
}

export default function ReportPage() {
  return (
    <TenantProvider>
      <ReportContent />
    </TenantProvider>
  );
}
