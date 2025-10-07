"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useCookieBannerOffset from '../hooks/useCookieBannerOffset';

interface StickyCTAProps {
  className?: string;
}

export default function StickyCTA({ className = '' }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showValidationCue, setShowValidationCue] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { offsetBottomPx } = useCookieBannerOffset();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const savingsChart = document.getElementById('savings-chart');
      const chartInView = savingsChart ? savingsChart.getBoundingClientRect().top < window.innerHeight : false;
      
      // Show after ~50% scroll OR when savings chart enters view
      const shouldShow = scrollPercent > 0.5 || chartInView;
      
      // Hide near footer (last ~640px)
      const nearFooter = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 640;
      
      // Hide on tiny viewports (<540px tall)
      const tinyViewport = window.innerHeight < 540;
      
      // Hide when modal is open
      const modalOpen = document.querySelector('[data-modal-open="true"]') !== null;
      
      const finalVisibility = shouldShow && !nearFooter && !tinyViewport && !modalOpen;
      
      if (finalVisibility && !isVisible) {
        setIsVisible(true);
        setShowValidationCue(true);
        // Auto-fade validation cue after 1.5s
        setTimeout(() => setShowValidationCue(false), 1500);
      } else if (!finalVisibility && isVisible) {
        setIsVisible(false);
        setShowValidationCue(false);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Watch for modal changes
    const observer = new MutationObserver(handleScroll);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isVisible]);

  // Reserve height to prevent CLS
  const placeholderHeight = 76;

  return (
    <>
      {/* Placeholder to prevent CLS */}
      <div 
        style={{ height: `${placeholderHeight}px` }}
        className="pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Actual sticky CTA */}
      <div
        ref={stickyRef}
        data-testid="sticky-cta"
        className={`fixed z-50 transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        } ${className}`}
        style={{ 
          bottom: `${16 + offsetBottomPx}px`,
          right: '24px',
          maxWidth: '420px'
        }}
      >
        <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-4">
          {/* Validation cue */}
          {showValidationCue && (
            <div className="mb-3 text-sm text-green-600 font-medium animate-fade-in">
              ✓ Ready for your company domain
            </div>
          )}
          
          {/* Main CTA button */}
          <Link
            href="/api/stripe/create-checkout-session"
            className="block w-full"
          >
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              style={{ 
                transform: 'scale(1)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Activate on Your Domain — 24 Hours
            </button>
          </Link>
          
          {/* Microcopy */}
          <p className="text-xs text-gray-600 mt-2 text-center">
            Instant setup — no code, live in 2 min.
          </p>
          
          {/* Trust chips */}
          <div className="flex justify-center gap-2 mt-3 text-xs text-gray-500">
            <span>SOC 2</span>
            <span>•</span>
            <span>GDPR</span>
            <span>•</span>
            <span>NREL PVWatts®</span>
          </div>
        </div>
      </div>
    </>
  );
}