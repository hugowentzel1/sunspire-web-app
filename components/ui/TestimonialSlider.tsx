"use client";

import { useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Cut quoting time from 15 minutes to 1 minute, and now we respond faster than local competitors.",
    name: "Brian Martin",
    role: "Owner, 25-employee solar firm, CA",
  },
  {
    quote:
      "Booked 4 extra consults in week one, and the branded quotes immediately stood out.",
    name: "Dalyn Helms",
    role: "Ops Manager, Texas solar installer",
  },
  {
    quote: "Our lead conversion jumped 40% in the first month, and follow-ups became instant and on-brand.",
    name: "Lensa Yohan",
    role: "Sales Manager, Florida solar dealer",
  },
  {
    quote:
      "Sunspire paid for itself in week two, as homeowners instantly trusted our estimates and closed more deals.",
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
