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
      className="cta-band p-8 text-center relative overflow-hidden"
      style={{
        color: '#111827'
      }}
    >
      {/* Company color accent overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, var(--brand-primary, #FFA63D) 0%, transparent 100%)`
        }}
      />
      
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Branded Tool?</h2>
        <p className="text-xl mb-8 opacity-90">
          Get complete financial projections, detailed assumptions, and unblurred savings charts
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <motion.button
            onClick={handlePrimaryClick}
            className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              color: 'var(--brand-primary, #FFA63D)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              border: '2px solid #ffffff'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-2px)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            Launch on {b.domain || b.brand}
          </motion.button>
          <motion.button
            onClick={handleSecondaryClick}
            className="px-8 py-4 rounded-2xl font-bold text-lg request-sample-btn transition-all duration-300 transform hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Request Sample Report
          </motion.button>
        </div>
        <div className="text-sm opacity-90 mb-4">
          Only $99/mo + $399 setup. 14-day refund if it doesn't lift booked calls.
        </div>
        <div className="text-xs opacity-75 mb-4">
          Cancel anytime. No long-term contracts.
        </div>
        <div className="text-sm opacity-90">
          <button 
            onClick={handleSecondaryClick}
            className="underline hover:no-underline transition-all"
            style={{ color: 'var(--brand-primary, #FFA63D)' }}
          >
            Email me full report
          </button>
        </div>
        <div className="mt-4">
          <PriceAnchor />
        </div>
      </div>
    </motion.div>
  );
}
