import BlurMask from "@/src/demo/BlurMask";
import { redactNumber } from "@/src/demo/redaction";
import { headers } from "next/headers";

export default function DemoResult() {
  // simple static-ish mock figures to demonstrate layout
  const h = headers(); // no SSR fetches
  const pv = { 
    sizeKw: 8.2, 
    annualKwh: 11500, 
    cost: 23800, 
    savingsYr1: 1860, 
    paybackYrs: 7.4 
  };

  // Render sections; where money shows, use redactNumber
  // The blur mask can be conditionally applied via client param; kept simple here.

  return (
    <main style={{ padding: "24px 16px", maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "24px" }}>Demo Report</h1>
      
      <section style={{ marginTop: 16, background: "#f9fafb", padding: "20px", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>System Summary</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
            <strong>Estimated Size:</strong> {pv.sizeKw.toFixed(1)} kW
          </li>
          <li style={{ padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
            <strong>Annual Production:</strong> {pv.annualKwh.toLocaleString()} kWh
          </li>
          <li style={{ padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
            <strong>Estimated Cost:</strong> {redactNumber(pv.cost)} USD
          </li>
          <li style={{ padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
            <strong>Year-1 Savings:</strong> {redactNumber(pv.savingsYr1)} USD
          </li>
          <li style={{ padding: "8px 0" }}>
            <strong>Payback:</strong> ~{pv.paybackYrs.toFixed(1)} years
          </li>
        </ul>
      </section>
      
      <section style={{ marginTop: 24, background: "#f9fafb", padding: "20px", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>Modeled Roof & Sun Path</h2>
        <BlurMask>
          <div style={{
            height: 240, 
            background: "#f3f5f7", 
            border: "1px dashed #ddd", 
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: "14px"
          }}>
            Roof analysis visualization would appear here
          </div>
        </BlurMask>
      </section>
      
      <section style={{ marginTop: 24, background: "#f9fafb", padding: "20px", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px" }}>Financial Projections</h2>
        <BlurMask>
          <div style={{
            height: 200, 
            background: "#f3f5f7", 
            border: "1px dashed #ddd", 
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: "14px"
          }}>
            Financial charts and ROI analysis would appear here
          </div>
        </BlurMask>
      </section>
      
      <p style={{ 
        opacity: 0.7, 
        marginTop: 24, 
        fontSize: "14px",
        textAlign: "center",
        padding: "16px",
        background: "#fef3c7",
        borderRadius: "8px",
        border: "1px solid #fbbf24"
      }}>
        Demo preview — numbers are approximate ranges. Install your live version for exact values.
      </p>
    </main>
  );
}
