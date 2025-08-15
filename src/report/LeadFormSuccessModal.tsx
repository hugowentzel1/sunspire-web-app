"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { teaseCurrency } from "@/src/demo/redaction";
import { track } from "@/src/demo/track";

interface LeadFormSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: {
    systemSizeKW: number;
    netCostAfterITC: number;
    year1Savings: number;
  };
}

export default function LeadFormSuccessModal({ 
  isOpen, 
  onClose, 
  summary 
}: LeadFormSuccessModalProps) {
  const handleStartActivation = () => {
    track("cta_click", { placement: "success_modal", cta_type: "start_activation" });
    document.dispatchEvent(new CustomEvent("openInstall"));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
            <p className="text-gray-600 mb-6">We'll email a sample within 24 hours.</p>
            
            {/* Summary Card */}
            <div className="bg-gray-50 rounded-2xl p-6 text-left mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Solar Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">System Size:</span>
                  <span className="font-medium text-gray-900">{summary.systemSizeKW} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Cost (After ITC):</span>
                  <span className="font-medium text-gray-900">{teaseCurrency(summary.netCostAfterITC)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year 1 Savings:</span>
                  <span className="font-medium text-gray-900">{teaseCurrency(summary.year1Savings)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleStartActivation}
                className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
              >
                Start activation now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
