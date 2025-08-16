"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useTenant } from './TenantProvider';
import { SolarEstimate } from '@/lib/estimate';

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimate: SolarEstimate;
  address: string;
}

export function LeadModal({ isOpen, onClose, estimate, address }: LeadModalProps) {
  const { tenant } = useTenant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    if (!tenant) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          address,
          tenantSlug: tenant.slug,
          systemSizeKW: estimate.systemSizeKW,
          netCostAfterITC: estimate.netCostAfterITC,
          year1Savings: estimate.year1Savings,
          paybackYear: estimate.paybackYear,
          npv25Year: estimate.npv25Year,
          co2OffsetPerYear: estimate.co2OffsetPerYear,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to submit lead');
      }

      setIsSuccess(true);
      reset();
      
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
      setError(null);
      setIsSuccess(false);
    }
  };

  if (!tenant) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh]"
          >
            {isSuccess ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">You're All Set!</h2>
                <p className="text-gray-600 mb-6">
                  Thanks for reaching out! We’ll email you a summary and next steps within 24 hours.
                </p>
                
                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Estimate Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>System Size: {estimate.systemSizeKW} kW</p>
                    <p>Net Cost: ${estimate.netCostAfterITC.toLocaleString()}</p>
                    <p>Year 1 Savings: ${estimate.year1Savings.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 overflow-auto">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Get Your Solar Quote
                  </h2>
                  <p className="text-gray-600">
                    We’ll email your personalized proposal from {tenant.name}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className={`w-full px-4 py-3 rounded-2xl border-2 transition-colors ${
                        errors.name 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
                      } focus:ring-4 focus:outline-none`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className={`w-full px-4 py-3 rounded-2xl border-2 transition-colors ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
                      } focus:ring-4 focus:outline-none`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-colors resize-none"
                      placeholder="Any specific questions or requirements?"
                    />
                  </div>

                  {/* Property Address */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Property Address
                    </label>
                    <p className="text-gray-600 text-sm">{address}</p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Footer Buttons */}
                  <footer className="mt-4 sticky bottom-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 px-4 py-3">
                    <div className="flex flex-col justify-end gap-3 sm:flex-row">
                      <button 
                        type="button" 
                        onClick={handleClose} 
                        className="h-10 px-4 rounded-md border border-slate-200 text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 px-4 rounded-md text-white font-semibold brand-gradient"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          'Request Sample Report'
                        )}
                      </button>
                    </div>
                  </footer>
                </form>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

