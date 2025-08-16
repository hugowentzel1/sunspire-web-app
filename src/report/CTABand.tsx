"use client";
import React from "react";
import { motion } from "framer-motion";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { track } from "@/src/demo/track";
import PriceAnchor from "@/src/demo/PriceAnchor";

export default function CTABand() {
  const b = useBrandTakeover();

  const handlePrimaryClick = () => {
    track("cta_click", { placement: "band", cta_type: "primary" });
    document.dispatchEvent(new CustomEvent("openInstall"));
  };

  const handleSecondaryClick = () => {
    track("cta_click", { placement: "band", cta_type: "secondary" });
    document.dispatchEvent(new CustomEvent("openLeadForm"));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 1.0, duration: 0.8 }} 
      className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 text-center text-white"
    >
      <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Branded Tool?</h2>
      <p className="text-xl mb-8 opacity-90">
        Get complete financial projections, detailed assumptions, and unblurred savings charts
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <motion.button
          onClick={handlePrimaryClick}
          className="px-8 py-4 rounded-2xl font-bold text-lg bg-white text-orange-600 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Launch on {b.domain || b.brand}
        </motion.button>
        <motion.button
          onClick={handleSecondaryClick}
          className="px-8 py-4 rounded-2xl font-bold text-lg border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:-translate-y-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Request Sample Report
        </motion.button>
      </div>
      <div className="text-sm opacity-90 mb-4">
        Only $99/mo + $399 setup. 14-day refund if it doesn't lift booked calls.
      </div>
      <div className="text-xs opacity-75">
        Cancel anytime. No long-term contracts.
      </div>
      <div className="mt-4">
        <PriceAnchor />
      </div>
    </motion.div>
  );
}
