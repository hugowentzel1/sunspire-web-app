"use client";
import React from "react";
import { motion } from "framer-motion";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { track } from "@/src/demo/track";

export default function StickyCTA() {
  const b = useBrandTakeover();

  const handlePrimaryClick = () => {
    track("cta_click", { placement: "mobile_sticky", cta_type: "primary" });
    document.dispatchEvent(new CustomEvent("openInstall"));
  };

  const handleSecondaryClick = () => {
    track("cta_click", { placement: "mobile_sticky", cta_type: "secondary" });
    document.dispatchEvent(new CustomEvent("openLeadForm"));
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg"
    >
      <div className="px-4 py-4 space-y-3">
        {/* Primary CTA */}
        <button
          onClick={handlePrimaryClick}
          className="w-full py-4 px-6 bg-orange-600 text-white rounded-2xl font-semibold hover:bg-orange-700 transition-colors"
        >
          Launch on {b.domain || b.brand}
        </button>
        
        {/* Secondary CTA */}
        <button
          onClick={handleSecondaryClick}
          className="w-full py-4 px-6 border-2 border-orange-600 text-orange-600 rounded-2xl font-semibold hover:bg-orange-50 transition-colors"
        >
                                                      Activate on Your Domain — 24 Hours
        </button>
        
        {/* Price anchor */}
        <p className="text-xs text-center text-gray-500">
          Only $99/mo + $399 setup. 14-day refund if it doesn't lift booked calls.
        </p>
      </div>
    </motion.div>
  );
}
