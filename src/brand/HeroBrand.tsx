"use client";
import Image from "next/image";
import { useBrandTakeover } from "./useBrandTakeover";

function initials(name:string){ return name.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]?.toUpperCase()).join("") || "•"; }

export default function HeroBrand(){
  const b = useBrandTakeover();
  if(!b.enabled) return null;
  
  // Generate a default logo URL for common companies when no logo is provided
  const getDefaultLogo = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower.includes('tesla')) return 'https://logo.clearbit.com/tesla.com';
    if (brandLower.includes('apple')) return 'https://logo.clearbit.com/apple.com';
    if (brandLower.includes('sunpower')) return 'https://logo.clearbit.com/sunpower.com';
    if (brandLower.includes('solarcity')) return 'https://logo.clearbit.com/solarcity.com';
    if (brandLower.includes('vivint')) return 'https://logo.clearbit.com/vivint.com';
    if (brandLower.includes('sunrun')) return 'https://logo.clearbit.com/sunrun.com';
    if (brandLower.includes('sunnova')) return 'https://logo.clearbit.com/sunnova.com';
    return null;
  };

  const logoUrl = b.logo || getDefaultLogo(b.brand);
  
  return (
    <div style={{ display:"grid", placeItems:"center", margin:"24px 0" }}>
      {logoUrl ? (
        <Image src={logoUrl} alt={`${b.brand} logo`} width={96} height={96} style={{ objectFit:"contain", borderRadius:16 }}/>
      ) : (
        <div style={{ width:96, height:96, borderRadius:20, display:"grid", placeItems:"center",
                      background:b.primary, color:"#0D0D0D", fontWeight:800, fontSize:28 }}>
          {initials(b.brand)}
        </div>
      )}
    </div>
  );
}
