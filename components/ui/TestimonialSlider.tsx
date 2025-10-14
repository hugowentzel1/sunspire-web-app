"use client";

import { useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "We were losing 3-4 deals per week to competitors who quoted faster. Now we respond in under 60 seconds and close those deals instead.",
    name: "Brian Martin",
    role: "Owner, 25-employee solar firm, CA",
  },
  {
    quote:
      "Our close rate doubled in month one. When prospects see a professional, instant quote instead of 'I'll get back to you,' they're already sold.",
    name: "Dalyn Helms",
    role: "Ops Manager, Texas solar installer",
  },
  {
    quote: "Lead-to-close rate went from 18% to 31% overnight. Homeowners trust instant, professional quotes over PDF attachments.",
    name: "Lensa Yohan",
    role: "Sales Manager, Florida solar dealer",
  },
  {
    quote:
      "Stopped wasting 12+ hours/week on unqualified leads. Only talk to pre-qualified prospects now — ROI in 9 days.",
    name: "Noah Jones",
    role: "Founder, Arizona EPC",
  },
];

export default function TestimonialSlider() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % TESTIMONIALS.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[idx];
  return (
    <div className="card p-6 text-center">
      <div className="text-2xl font-semibold text-[var(--ink)] mb-3">
        “{t.quote}”
      </div>
      <div className="p">
        {t.name} • {t.role}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === idx ? "bg-[var(--sun-2)]" : "bg-[var(--border)]"}`}
          />
        ))}
      </div>
    </div>
  );
}
