"use client";

import { useEffect, useMemo, useState } from "react";
import { sanitizeCompany, brandGradient, logoUrlFromDomain } from "../lib/company";

export default function DemoPage() {
  const [company, setCompany] = useState("");
  const [domain, setDomain]   = useState("");
  const { from, to } = useMemo(() => brandGradient(company), [company]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = sanitizeCompany(p.get("company"));
    const d = (p.get("domain") || "").trim();
    setCompany(c);
    setDomain(d);

    if (c) document.title = `${c} — Sunspire Demo`;

    // Prevent 100k personalized URLs from being indexed
    if (c) {
      const m = document.createElement("meta");
      m.name = "robots";
      m.content = "noindex,follow";
      document.head.appendChild(m);
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif"
      }}
    >
      <div style={{
        width: "100%",
        maxWidth: 880,
        background: "white",
        borderRadius: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        padding: 28
      }}>
        <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          {domain ? (
            <img
              src={logoUrlFromDomain(domain)}
              alt="company logo"
              width={32}
              height={32}
              style={{ borderRadius: 8 }}
            />
          ) : null}
          <h1 style={{ margin: 0, fontSize: 22 }}>
            {company ? `Custom Sunspire Demo for ${company}` : "Your Custom Sunspire Demo"}
          </h1>
        </header>

        <p style={{ marginTop: 0, color: "#475569" }}>
          {company
            ? `${company} — here's how Sunspire turns visitors into booked solar calls (no dev work).`
            : "See how Sunspire turns visitors into booked solar calls (no dev work)."}
        </p>

        {/* Replace this with your real demo embed/component */}
        <div style={{
          marginTop: 16,
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          padding: 16,
          background: "#f8fafc"
        }}>
          <p style={{ margin: 0, color: "#334155" }}>
            Your 60-sec walkthrough video or interactive widget goes here.
          </p>
        </div>

        <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href="https://cal.com/your-link?source=sunspire_demo"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #334155",
              textDecoration: "none",
              color: "white",
              background: "#0f172a"
            }}
          >
            Book a 14-day pilot call
          </a>
          <a
            href="https://your-checkout-or-more-info"
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              textDecoration: "none",
              color: "#0f172a",
              background: "white"
            }}
          >
            See pricing & terms
          </a>
        </div>
      </div>
    </main>
  );
}
