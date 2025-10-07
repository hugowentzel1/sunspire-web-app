"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useCookieBannerOffset from '../hooks/useCookieBannerOffset';

interface FooterCtaRevealProps {
  className?: string;
}

export default function FooterCtaReveal({ className = '' }: FooterCtaRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { offsetBottomPx } = useCookieBannerOffset();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      
      // Show around 80-85% scroll
      const shouldShow = scrollPercent > 0.8;
      
      // Only show if sticky CTA is hidden (near footer)
      const stickyCta = document.querySelector('[data-testid="sticky-cta"]');
      const stickyVisible = stickyCta ? getComputedStyle(stickyCta).opacity !== '0' : false;
      
      // Hide when modal is open
      const modalOpen = document.querySelector('[data-modal-open="true"]') !== null;
      
      const finalVisibility = shouldShow && !stickyVisible && !modalOpen;
      setIsVisible(finalVisibility);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Watch for sticky CTA changes
    const observer = new MutationObserver(handleScroll);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      data-testid="footer-cta"
      className={`fixed z-40 transition-all duration-300 ease-out ${className}`}
      style={{ 
        bottom: `${20 + offsetBottomPx}px`,
        right: '16px',
        left: '16px',
        maxWidth: '420px',
        margin: '0 auto'
      }}
    >
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-4">
        <p className="text-sm text-gray-700 mb-3 text-center">
          Launch your branded quote experience — live in 24 hours.
        </p>
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
      </div>
    </div>
  );
}