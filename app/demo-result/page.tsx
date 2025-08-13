"use client";
import BlurMask from "@/src/demo/BlurMask";
import { currencyRange } from "@/src/demo/redaction";
import { useEffect } from "react";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";
import { usePreviewQuota } from "@/src/demo/usePreviewQuota";

export default function DemoResult(){
  const b = useBrandTakeover();
  const { read } = usePreviewQuota(2);
  const remaining = read();

  // mock-ish values to render structure
  const pv={ sizeKw:6.0, annualKwh:9637, cost:12600, savingsYr1:1603, npv25:9736, roiPct:177 };

  useEffect(()=>{ fetch("/api/demo-event",{method:"POST",body:JSON.stringify({type:"view_demo_result",href:location.href})}); },[]);

  // Always blur premium areas in demo (both runs)
  const Premium = ({children}:{children:React.ReactNode}) => b.enabled ? <BlurMask>{children}</BlurMask> : <>{children}</>;

  return (
    <main style={{ padding:"24px 16px", maxWidth:1120, margin:"0 auto" }}>
      <h1>Solar Intelligence Report</h1>
      <p style={{opacity:.7}}>Preview {remaining===2?"(first run)":"(second run or later)"} — some details hidden.</p>

      {/* Safe headline tiles */}
      <section style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:16, margin:"16px 0" }}>
        <div><strong>6 kW</strong><div>System Size</div></div>
        <div><strong>{pv.annualKwh.toLocaleString()} kWh</strong><div>Annual Production</div></div>
        <div><strong>{currencyRange(pv.cost)}</strong><div>Net Cost (After ITC)</div></div>
        <div><strong>{currencyRange(pv.savingsYr1)}</strong><div>Year 1 Savings</div></div>
      </section>

      {/* Savings curve -> blur beyond teaser */}
      <section style={{ marginTop:16 }}>
        <h2>Your Solar Savings Over Time</h2>
        <Premium>
          <div style={{ height:240, background:"#f3f5f7", border:"1px dashed #ddd", borderRadius:12 }} />
        </Premium>
      </section>

      {/* Premium financials -> blur */}
      <section style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:16, margin:"16px 0" }}>
        <Premium>
          <div style={{ padding:16, background:"#fff", borderRadius:16, border:"1px solid #eee" }}>
            <h3>Financial Analysis</h3>
            <ul>
              <li>Payback Period: 8 years</li>
              <li>25-Year NPV: {currencyRange(pv.npv25)}</li>
              <li>ROI: {Math.round(pv.roiPct*0.9)}–{Math.round(pv.roiPct*1.1)}%</li>
            </ul>
          </div>
        </Premium>
        <div style={{ padding:16, background:"#fff", borderRadius:16, border:"1px solid #eee" }}>
          <h3>Environmental Impact</h3>
          <ul>
            <li>CO₂ Offset/Year: 8,191 lbs</li>
            <li>Irradiance: 5.01 kWh/m²/day</li>
          </ul>
        </div>
        <Premium>
          <div style={{ padding:16, background:"#fff", borderRadius:16, border:"1px solid #eee" }}>
            <h3>Calculation Assumptions</h3>
            <ul>
              <li>Rate Increase: 2.5%/yr</li>
              <li>Cost per Watt: $3 (range)</li>
              <li>Discount Rate: 7%</li>
            </ul>
          </div>
        </Premium>
      </section>
      <p style={{opacity:.7, marginTop:12}}>Install your live version to unlock exact values, unblurred graphs, and full assumptions.</p>
    </main>
  );
}
