import React from "react";

type Testimonial = {
  quote: string;
  role: string;
  company: string; // company type (and optional size)
  region: string;  // state/region
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Cut quoting time from 15 minutes to 1 minute — we now respond faster than local competitors.",
    role: "Owner",
    company: "25-employee solar firm",
    region: "CA",
  },
  {
    quote:
      "Booked 4 extra consults in week one — the branded quotes immediately stood out.",
    role: "Operations Manager",
    company: "Texas solar installer",
    region: "TX",
  },
  {
    quote:
      "Our lead conversion jumped 40% in the first month — follow-ups became instant and on-brand.",
    role: "Sales Manager",
    company: "Florida solar dealer",
    region: "FL",
  },
  {
    quote:
      "Sunspire paid for itself in week two — homeowners instantly trusted our estimates.",
    role: "Founder",
    company: "Arizona EPC",
    region: "AZ",
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure
      className="flex h-full flex-col justify-between rounded-xl border border-black/10 bg-white p-5 shadow-sm"
      aria-label={`Testimonial from ${t.role}, ${t.company} (${t.region})`}
    >
          <blockquote className="text-[15px] leading-6 text-slate-800">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
      <figcaption className="mt-4 border-t border-slate-200 pt-3 text-sm text-slate-600">
        <span className="font-medium text-slate-900">— {t.role}</span>
        {", "}
        <span>{t.company}</span>
        {", "}
        <span>{t.region}</span>
      </figcaption>
    </figure>
  );
}

export default function TestimonialsSection({
  title = "Trusted by 100+ installers and growing",
  subtitle = "Here's what early adopters are already saying.",
  limit = 4,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
}) {
  const items = TESTIMONIALS.slice(0, Math.max(1, Math.min(limit, TESTIMONIALS.length)));
  return (
    <section aria-labelledby="testimonials-heading" className={className}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-6 text-center">
          <h2 id="testimonials-heading" className="text-xl font-semibold text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
