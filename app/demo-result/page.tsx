"use client";
import BlurMask from "@/src/demo/BlurMask";
import { redactCurrencyRange } from "@/src/demo/redaction";
import { useEffect } from "react";

export default function DemoResult() {
  const pv = { 
    sizeKw: 8.2, 
    annualKwh: 11500, 
    cost: 23800, 
    savingsYr1: 1860, 
    paybackYrs: 7.4 
  };
  
  useEffect(() => {
    fetch("/api/demo-event", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        type: "view_demo_result", 
        href: window.location.href 
      }) 
    });
  }, []);
  
  return (
    <main style={{ padding: "24px 16px", maxWidth: 960, margin: "0 auto" }}>
      <h1>Demo Report</h1>
      <section style={{ marginTop: 16 }}>
        <h2>System Summary</h2>
        <ul>
          <li>Estimated Size: {pv.sizeKw.toFixed(1)} kW</li>
          <li>Annual Production: {pv.annualKwh.toLocaleString()} kWh</li>
          <li>Estimated Cost: {redactCurrencyRange(pv.cost)}</li>
          <li>Year-1 Savings: {redactCurrencyRange(pv.savingsYr1)}</li>
          <li>Payback: ~{pv.paybackYrs.toFixed(1)} years</li>
        </ul>
      </section>
      <section style={{ marginTop: 16 }}>
        <h2>Modeled Roof & Sun Path</h2>
        <BlurMask>
          <div style={{ 
            height: 240, 
            background: "#f3f5f7", 
            border: "1px dashed #ddd", 
            borderRadius: 12 
          }} />
        </BlurMask>
      </section>
      <p style={{ opacity: 0.7, marginTop: 12 }}>
        Demo preview — numbers are approximate ranges. Install your live version for exact values.
      </p>
    </main>
  );
}
