"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookie-consent');
    if (!cookieChoice) {
      setShowBanner(true);
    } else if (cookieChoice === 'accepted') {
      setIsAccepted(true);
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = () => {
    // In production, this would load Google Analytics, Mixpanel, etc.
    console.log('Analytics loaded - cookies accepted');
    
    // Example: Load Google Analytics
    // if (typeof window !== 'undefined' && window.gtag) {
    //   window.gtag('consent', 'update', {
    //     'analytics_storage': 'granted'
    //   });
    // }
  };

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsAccepted(true);
    setShowBanner(false);
    loadAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
    // Analytics remain disabled
  };

  if (!showBanner || isAccepted) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                We use cookies to improve your experience
              </h3>
              <p className="text-sm text-gray-600">
                We use cookies and similar technologies to analyze site usage, personalize content, 
                and provide social media features. By continuing to use our site, you consent to our 
                use of cookies. See our{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{' '}
                for more information.
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
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
