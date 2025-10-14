"use client";

import { motion } from "framer-motion";

interface ReportCTAFooterProps {
  onBook?: () => void;
  onTalk?: () => void;
  onDownloadPdf?: () => void;
  onCopyLink?: () => void;
  brandColor?: string;
  searchParams?: string;
}

export default function ReportCTAFooter({
  onBook,
  onTalk,
  onDownloadPdf,
  onCopyLink,
  brandColor = "#FF6B35",
  searchParams = "",
}: ReportCTAFooterProps) {
  
  const handleBook = async () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_book_consultation_bottom', {
        event_category: 'engagement',
        event_label: 'report_page_bottom'
      });
    }
    
    // Start Stripe checkout instead of going to contact
    try {
      // Collect tracking parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const company = urlParams.get('company');
      const utm_source = urlParams.get('utm_source');
      const utm_campaign = urlParams.get('utm_campaign');
      
      // Start checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'starter',
          token,
          company,
          utm_source,
          utm_campaign
        })
      });
      
      if (!response.ok) throw new Error('Checkout failed');
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to start checkout. Please try again.');
    }
    
    if (onBook) onBook();
  };

  const handleTalk = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_call_click', {
        event_category: 'engagement',
        event_label: 'report_page_bottom'
      });
    }
    if (onTalk) onTalk();
  };

  const handleDownload = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_download_pdf_click', {
        event_category: 'engagement',
        event_label: 'report_page_bottom'
      });
    }
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      alert('PDF download functionality coming soon!');
    }
  };

  const handleCopy = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_copy_share_link_click', {
        event_category: 'engagement',
        event_label: 'report_page_bottom'
      });
    }
    if (onCopyLink) {
      onCopyLink();
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Share link copied to clipboard!');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      aria-label="Activate your branded version"
      className="report-cta-footer mt-12 mb-8 rounded-2xl p-8 md:p-10 bg-gradient-to-br from-slate-50 via-white to-gray-50 border border-gray-200/80 shadow-lg"
      data-testid="report-cta-footer"
    >
      {/* Headline */}
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Ready to activate your branded version?
        </h3>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          This demo is already customized for your company. Launch your own version in 24 hours.
        </p>
      </div>

      {/* Primary CTA */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <motion.button
          onClick={handleBook}
          className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-semibold text-white border border-transparent shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto sm:min-w-[400px]"
          style={{ backgroundColor: brandColor }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Start activation — demo expires soon"
          data-testid="report-cta-primary"
        >
          <span className="mr-3">⚡</span>
          <span>Start Activation — Demo Expires Soon</span>
        </motion.button>
        
        <p className="text-sm text-gray-600" data-testid="report-cta-subtext">
          $99/mo + $399 setup • Live on your site in 24 hours — setup fee refunded if not.
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-6">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure Stripe checkout
        </span>
        <span>•</span>
        <span>No hidden fees</span>
        <span>•</span>
        <span>Cancel anytime</span>
      </div>

      {/* Utility actions row */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6 border-t border-gray-200">
        <motion.button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-200 border border-gray-300 w-full sm:w-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Download PDF Report"
        >
          <span>📄</span>
          <span>Download PDF</span>
        </motion.button>
        
        <motion.button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-200 border border-gray-300 w-full sm:w-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Copy Share Link"
        >
          <span>🔗</span>
          <span>Share This Report</span>
        </motion.button>
      </div>
    </motion.section>
  );
}

