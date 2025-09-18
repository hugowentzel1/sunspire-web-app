"use client";

import { useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Sunspire helped us close deals 2x faster with beautiful, instant reports.",
    name: "Alex P.",
    role: "VP Sales, HelioCo",
  },
  {
    quote:
      "The white-label setup was live in a day—our brand, our domain, our leads.",
    name: "Marisa D.",
    role: "CEO, BrightLeaf Solar",
  },
  {
    quote: "Installers love the clarity. Customers love the speed.",
    name: "Jordan K.",
    role: "COO, Apex Renewables",
  },
  {
    quote:
      "A modern, premium experience that finally matches our sales process.",
    name: "Taylor S.",
    role: "Sales Director, NovaSun",
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
