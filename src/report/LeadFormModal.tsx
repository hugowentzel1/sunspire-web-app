"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@/src/demo/track";
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export default function LeadFormModal({ isOpen, onClose, address }: LeadFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Get brand colors
  const b = useBrandTakeover();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('🚀 Form submission started');

    try {
      const payload = {
        event: "sample_request",
        ...formData,
        address
      };
      
      console.log('📤 Sending payload:', payload);
      
      const response = await fetch("/api/demo-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (response.ok) {
        console.log('✅ Form submission successful, setting success state');
        track("sample_request", { 
          name: formData.name, 
          email: formData.email,
          address 
        });
        
        // Set success state immediately
        setIsSuccess(true);
        console.log('🎉 Success state set to true');
        
        // Don't close the modal immediately - let user see the success message
        // Only close after they've had time to read it
        setTimeout(() => {
          console.log('⏰ Timeout reached, closing modal');
          onClose();
          setIsSuccess(false);
          setFormData({ name: "", email: "", phone: "", notes: "" });
        }, 5000); // Increased to 5 seconds
      } else {
        console.error("Form submission failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Form submission finished, isSubmitting set to false');
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  // Debug logging
  console.log('🔍 LeadFormModal render state:', { isOpen, isSubmitting, isSuccess });

  // Use company brand colors for button
  const buttonStyle = b.enabled && b.primary ? {
    background: `linear-gradient(135deg, #ffffff, ${b.primary})`
  } : {
    background: 'linear-gradient(135deg, #ffffff, #d97706)'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="lead-form-modal"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {isSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{
                background: b.enabled && b.primary 
                  ? `linear-gradient(135deg, ${b.primary}20, ${b.primary}10)` 
                  : 'linear-gradient(135deg, #fef3c7, #fde68a)'
              }}>
                <svg className="w-8 h-8" style={{ color: b.enabled && b.primary ? b.primary : '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: b.enabled && b.primary ? b.primary : '#111827' }}>Sample Report Requested!</h2>
              <p className="text-gray-600 mb-4">Thanks for reaching out!</p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-medium mb-1">What's Next?</p>
                <p>We'll email you a detailed sample report within 24 hours, along with next steps to get your white-label demo live.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Request Sample Report</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">Get a detailed sample of your solar analysis</p>

              <form onSubmit={handleSubmit} className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Any specific questions or requirements..."
                  />
                </div>

                {/* Submit button */}
                <div className="mb-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full pill-brand no-blur inline-flex items-center justify-center rounded-lg px-6 py-3 text-white font-semibold shadow-md hover:brightness-95 active:brightness-90 transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "Request Sample Report"}
                  </button>
                </div>
              </form>
              
              <div className="text-center text-sm text-slate-600">
                <p>We'll send your sample report within 24 hours.</p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
