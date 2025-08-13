"use client";
import Image from "next/image";
import { useBrandTakeover } from "./useBrandTakeover";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]?.toUpperCase()).join("") || "•";
}

export default function HeroBrand() {
  const b = useBrandTakeover();
  if (!b.enabled) return null;
  return (
    <div style={{ display:"grid", placeItems:"center", margin:"24px 0" }}>
      {b.logo ? (
        <Image src={b.logo} alt={`${b.brand} logo`} width={96} height={96}
               style={{ objectFit:"contain", borderRadius:16 }} />
      ) : (
        <div style={{
          width:96, height:96, borderRadius:20, display:"grid", placeItems:"center",
          background: b.primary, color:"#0D0D0D", fontWeight:800, fontSize:28
        }}>
          {initials(b.brand)}
        </div>
      )}
    </div>
  );
}
