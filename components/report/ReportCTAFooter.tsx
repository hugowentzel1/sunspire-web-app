"use client";

import { motion } from "framer-motion";

interface ReportCTAFooterProps {
  onBook?: () => void;
  onRequestConsult?: () => void;
  onTalk?: () => void;
  onDownloadPdf?: () => void;
  onCopyLink?: () => void;
  brandColor?: string;
  searchParams?: string;
  /** Paid report: hide "Talk to a Specialist", show only Book/Request consult (full width) */
  hideTalkToSpecialist?: boolean;
}

export default function ReportCTAFooter({
  onBook,
  onRequestConsult,
  onTalk,
  onDownloadPdf,
  onCopyLink,
  brandColor = "#FF6B35",
  searchParams = "",
  hideTalkToSpecialist = false,
}: ReportCTAFooterProps) {
  const handleRequestConsult = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "cta_request_consult", { event_category: "engagement", event_label: "report_page_bottom" });
    }
    if (onRequestConsult) {
      onRequestConsult();
      return;
    }
    handleBook();
  };

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
      aria-label="Next steps"
      className="report-cta-footer mt-8 mb-8 rounded-2xl p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-sm grid grid-rows-[1fr_auto_1fr]"
      data-testid="report-cta-footer"
    >
      {/* TOP HALF — primary CTA; paid report: single full-width button, no Talk to Specialist */}
      <div className="h-full grid place-content-center">
        <div className={`cta-row flex gap-3 justify-center items-center mb-0 ${hideTalkToSpecialist ? 'flex-col w-full max-w-md mx-auto' : 'flex-col sm:flex-row'}`} style={{ marginLeft: hideTalkToSpecialist ? 0 : '-12px', transform: hideTalkToSpecialist ? 'none' : 'translateY(-6.25px)' }}>
          <motion.button
            onClick={handleRequestConsult}
            className={`inline-flex items-center justify-center px-6 py-4 text-white rounded-xl font-semibold text-base hover:shadow-lg transition-all duration-200 ${hideTalkToSpecialist ? 'w-full' : 'w-full sm:w-auto'}`}
            style={{ backgroundColor: brandColor }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            role="button"
            aria-label={onRequestConsult ? "Request a free consult" : "Book a Consultation"}
          >
            {onRequestConsult ? "📅 Request a free consult" : "📅 Book a Consultation"}
          </motion.button>

          {!hideTalkToSpecialist && (
            <motion.a
              href="tel:+14041234567"
              onClick={handleTalk}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold text-base hover:bg-gray-200 transition-all duration-200 w-full sm:w-auto border border-gray-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Talk to a Specialist"
            >
              📞 Talk to a Specialist
            </motion.a>
          )}
        </div>
      </div>

      {/* DIVIDER — stays auto height */}
      <div className="h-px bg-gray-200 my-4 md:my-5" />

      {/* BOTTOM HALF — keep your current bottom-row flex with all its classes/margins */}
      <div className="h-full grid place-content-center">
        <div className="utility-row flex flex-col sm:flex-row gap-3 justify-center items-center pt-0 border-t-0" style={{ marginLeft: '9px', transform: 'translateY(6.25px)' }}>
          <motion.button
            onClick={handleDownload}
            className="btn-tertiary px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-200 border border-gray-300 w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Download PDF Report"
          >
            📄 Download PDF
          </motion.button>
          
          <motion.button
            onClick={handleCopy}
            className="btn-tertiary px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-200 border border-gray-300 w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Copy Share Link"
          >
            🔗 Copy Share Link
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}

