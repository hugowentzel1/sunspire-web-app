'use client';

import { useState, useEffect, useMemo } from 'react';
import { sanitizeCompany, brandGradient } from '../lib/company';

export default function Home() {
  const [company, setCompany] = useState('');
  const { from, to } = useMemo(() => brandGradient(company), [company]);

  useEffect(() => {
    // Read company parameter from URL
    const p = new URLSearchParams(window.location.search);
    const c = sanitizeCompany(p.get("company"));
    setCompany(c);

    if (c) {
      document.title = `${c} — Sunspire Demo`;
      
      // Prevent 100k personalized URLs from being indexed
      const m = document.createElement("meta");
      m.name = "robots";
      m.content = "noindex,follow";
      document.head.appendChild(m);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="space-y-8">
          {/* Logo */}
          <div className="relative">
            <div 
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden"
              style={{
                background: company 
                  ? `linear-gradient(135deg, ${from}, ${to})`
                  : 'linear-gradient(135deg, #f97316, #dc2626, #ec4899)'
              }}
            >
              <span className="text-6xl">☀️</span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
              {company ? `Custom Solar Intelligence for ${company}` : "Solar Intelligence"}
              <span className="block text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text">in Seconds</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {company 
                ? `${company} — here's how Sunspire turns visitors into booked solar calls (no dev work).`
                : "Transform your property with AI-powered solar analysis. Get instant estimates, detailed reports, and connect with premium installers."
              }
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Get Started
            </button>
          </div>

          {/* Debug Info */}
          {company && (
            <div className="mt-8 p-4 bg-white/80 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Debug:</strong> Company parameter detected: "{company}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
