"use client";

import { useState } from "react";
import FocusTrap from "@/components/ui/FocusTrap";

interface ReportLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone?: string; address?: string }) => Promise<void>;
  address?: string;
  brandColor?: string;
  /** Installer/company name for consent: "contacted by [Company] via ..." */
  companyName?: string;
  /** Optional booking URL (e.g. Calendly); "Book a time" opens this then closes. */
  bookingUrl?: string;
}

export default function ReportLeadModal({
  isOpen,
  onClose,
  onSubmit,
  address = "",
  brandColor = "#0ea5e9",
  companyName,
  bookingUrl,
}: ReportLeadModalProps) {
  const raw = companyName && companyName.trim() ? companyName.trim() : "the company";
  const consentCompany = raw.toLowerCase() === "sunspire" ? "the company" : raw;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!consent) {
      setError("Please agree to be contacted.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, address: address || undefined });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="report-lead-modal-title">
      <FocusTrap>
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 md:p-8 flex flex-col gap-6">
            {!success ? (
              <>
                <div className="space-y-2">
                  <h2 id="report-lead-modal-title" className="text-xl md:text-2xl font-bold text-gray-900">
                    Where should we send your report?
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We&apos;ll email your full report. A local installer may follow up to answer questions—free, no obligation.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="report-lead-name" className="block text-sm font-medium text-gray-700 mb-1.5">First name *</label>
                    <input
                      id="report-lead-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your first name"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent text-gray-900"
                      style={{ outlineColor: brandColor }}
                    />
                  </div>
                  <div>
                    <label htmlFor="report-lead-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input
                      id="report-lead-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent text-gray-900"
                      style={{ outlineColor: brandColor }}
                    />
                  </div>
                  <div>
                    <label htmlFor="report-lead-phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
                    <input
                      id="report-lead-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent text-gray-900"
                      style={{ outlineColor: brandColor }}
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      id="report-lead-consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 rounded border-gray-300 shrink-0"
                    />
                    <label htmlFor="report-lead-consent" className="text-sm text-gray-600 leading-snug">
                      I agree to be contacted by {consentCompany} by phone, email, or text about my solar report.{" "}
                      <a href="/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy</a>
                      {" · "}
                      <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Terms</a>
                    </label>
                  </div>
                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-opacity disabled:opacity-70"
                    style={{ ['--brand' as string]: brandColor } as React.CSSProperties}
                  >
                    {isSubmitting ? "Sending…" : "Email my report"}
                  </button>
                </form>
                <p className="text-xs text-gray-500 text-center">Takes about 30 seconds. No obligation.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 text-sm text-gray-500 hover:text-gray-700 -mb-2"
                  aria-label="Close"
                >
                  Cancel
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl" style={{ backgroundColor: brandColor }}>✓</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">You&apos;re all set</h3>
                <p className="text-gray-600 mb-6">You&apos;ll hear back within 1 business day.</p>
                <div className="space-y-3">
                  {bookingUrl ? (
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 px-4 rounded-xl font-semibold text-white text-center"
                      style={{ backgroundColor: brandColor }}
                      onClick={() => onClose()}
                    >
                      Book a time (recommended)
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={onClose}
                      className="block w-full py-3 px-4 rounded-xl font-semibold text-white"
                      style={{ backgroundColor: brandColor }}
                    >
                      Book a time (recommended)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="block w-full py-2.5 px-4 rounded-xl font-medium text-gray-600 hover:bg-gray-100 border border-gray-300"
                  >
                    No thanks — have them reach out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
