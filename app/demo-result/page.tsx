"use client";
import BlurMask from "@/src/demo/BlurMask";
import { rangeCurrency } from "@/src/demo/redaction";

export default function DemoResult() {
  // Static-ish figures to show structure; no remote fetches
  const pv = { 
    sizeKw: 8.2, 
    annualKwh: 11500, 
    cost: 23800, 
    savingsYr1: 1860, 
    paybackYrs: 7.4 
  };
  
  return (
    <main style={{ padding: "24px 16px", maxWidth: 960, margin: "0 auto" }}>
      <h1>Preview Report</h1>

      {/* SAFE to show exacts (keeps credibility) */}
      <section>
        <h2>System Summary</h2>
        <ul>
          <li>Estimated Size: {pv.sizeKw.toFixed(1)} kW</li>
          <li>Annual Production: {pv.annualKwh.toLocaleString()} kWh</li>
          <li>Estimated Cost: {rangeCurrency(pv.cost)}</li>        {/* $ redacted to a range */}
          <li>Year-1 Savings: {rangeCurrency(pv.savingsYr1)}</li> {/* $ redacted to a range */}
          <li>Payback: ~{pv.paybackYrs.toFixed(1)} years</li>
        </ul>
      </section>

      {/* HIGH-VALUE visuals -> BLUR */}
      <section style={{ marginTop: 16 }}>
        <h2>Roof & Sun Model</h2>
        <BlurMask>
          <div style={{ 
            height: 240, 
            background: "#f3f5f7", 
            border: "1px dashed #ddd", 
            borderRadius: 12 
          }} />
        </BlurMask>
      </section>

      {/* KEEP PROOF, HIDE PRICING GRANULARITY */}
      <section style={{ marginTop: 16 }}>
        <h2>Utility Rate Breakdown</h2>
        <BlurMask>
          <div style={{ 
            height: 160, 
            background: "#f9fafb", 
            border: "1px dashed #ddd", 
            borderRadius: 12 
          }} />
        </BlurMask>
      </section>

      <p style={{ opacity: 0.7, marginTop: 12 }}>
        Install your live version for exact imagery, rate breakdown, and dollar values.
      </p>
    </main>
  );
}
