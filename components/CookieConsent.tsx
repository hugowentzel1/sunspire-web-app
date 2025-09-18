"use client";

import { useState, useEffect } from "react";
import { isEmbed } from "@/lib/flags";
import { isDemoFromSearch } from "@/lib/isDemo";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if we're in embed mode
    const urlParams = new URLSearchParams(window.location.search);
    const embedMode = isEmbed(urlParams);
    const demoMode = isDemoFromSearch(urlParams);
    setIsEmbedMode(embedMode);
    setIsDemoMode(demoMode);

    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem("cookie-consent");
    if (!cookieChoice && !embedMode) {
      setShowBanner(true);
    } else if (cookieChoice === "accepted") {
      setIsAccepted(true);
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = () => {
    // In production, this would load Google Analytics, Mixpanel, etc.
    console.log("Analytics loaded - cookies accepted");

    // Example: Load Google Analytics
    // if (typeof window !== 'undefined' && window.gtag) {
    //   window.gtag('consent', 'update', {
    //     'analytics_storage': 'granted'
    //   });
    // }
  };

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsAccepted(true);
    setShowBanner(false);
    loadAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
    // Analytics remain disabled
  };

  // In embed mode, show a minimal footer link
  if (isEmbedMode) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="text-center">
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Privacy & Cookies
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!showBanner || isAccepted) {
    return null;
  }

  // For paid mode, show compact bottom-left toast
  if (!isDemoMode) {
    return (
      <div
        className="fixed bottom-4 left-4 z-50 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg max-w-sm"
        data-cookie-banner
      >
        <div className="p-4">
          <p className="text-sm text-gray-700 mb-3">
            We use cookies to improve your experience.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Manage
            </button>
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 text-xs font-medium text-white rounded transition-colors"
              style={{
                backgroundColor: "var(--brand-primary)",
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For demo mode, show full banner
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
      style={{ maxHeight: "56px" }}
      data-cookie-banner
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              We use cookies to improve your experience
            </h3>
            <p className="text-sm text-gray-600">
              We use cookies and similar technologies to analyze site usage,
              personalize content, and provide social media features. By
              continuing to use our site, you consent to our use of cookies.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{
                backgroundColor: "var(--brand-primary)",
                borderColor: "var(--brand-primary)",
              }}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
