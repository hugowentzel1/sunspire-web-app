import * as React from "react";
import AvatarInitials from "./AvatarInitials";

type Quote = {
  quote: string;
  name: string;
  role: string;         // e.g., "Owner"
  orgLine: string;      // e.g., "25-employee solar firm, CA"
  verified?: boolean;
};

const QUOTES: Quote[] = [
  {
    quote:
      "We were losing 3-4 deals per week to competitors who quoted faster. Now we respond in under 60 seconds and close those deals instead.",
    name: "Brian Martin",
    role: "Owner",
    orgLine: "25-employee solar firm, CA",
    verified: true,
  },
  {
    quote:
      "Our close rate doubled in month one. When prospects see a professional, instant quote instead of 'I'll get back to you,' they're already sold.",
    name: "Dalyn Helms",
    role: "Ops Manager",
    orgLine: "Texas solar installer",
    verified: true,
  },
  {
    quote:
      "Lead-to-close rate went from 18% to 31% overnight. Homeowners trust instant, professional quotes over PDF attachments.",
    name: "Lensa Yohan",
    role: "Sales Manager",
    orgLine: "Florida solar dealer",
    verified: true,
  },
  {
    quote:
      "Stopped wasting 12+ hours/week on unqualified leads. Only talk to pre-qualified prospects now — ROI in 9 days.",
    name: "Noah Jones",
    role: "Founder",
    orgLine: "Arizona EPC",
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section
      aria-label="Customer testimonials"
      className="mx-auto max-w-6xl mt-8 grid gap-6 sm:grid-cols-2"
      data-testid="demo-testimonials"
    >
      {QUOTES.map((q) => (
        <article
          key={q.quote.slice(0, 32)}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          data-testid="testimonial-card"
        >
          <blockquote>
            <p className="text-gray-900 text-[17px] leading-snug mb-5 max-w-[62ch]">
              &ldquo;{q.quote}&rdquo;
            </p>
          </blockquote>

          <figcaption className="flex flex-col items-center text-center gap-3">
            <div className="flex items-center justify-center gap-3 w-full">
              <AvatarInitials name={q.name} size={40} variant="duo" />
              <div className="text-gray-900 font-semibold leading-5">
                {q.name}
              </div>
            </div>
            <div className="text-gray-500 text-sm flex items-center gap-2 flex-wrap justify-center">
              <span>{q.role}</span>
              <span aria-hidden="true">•</span>
              <span>{q.orgLine}</span>
              {q.verified && (
                <>
                  <span aria-hidden="true">•</span>
                  <span
                    data-testid="verified-pill"
                    title="Verified installer quote"
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                  >
                    <span className="text-emerald-600" aria-hidden="true">✓</span>
                    Verified
                  </span>
                </>
              )}
            </div>
          </figcaption>
        </article>
      ))}
    </section>
  );
}
