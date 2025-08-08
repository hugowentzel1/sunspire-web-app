export type PvwattsParams = {
  lat: number; lon: number;
  system_capacity_kw: number;   // e.g., 6
  tilt_deg: number;             // 0..60
  azimuth_deg: number;          // 0=N,90=E,180=S,270=W
  losses_pct: number;           // 10–18 typical
  module_type?: 0|1|2;          // 0=Std,1=Prem,2=Thin
  array_type?: 1|2|3|4|5;       // 1=Fixed open rack
  dc_ac_ratio?: number;         // default 1.2
  inv_eff?: number;             // default 96
};

export type PvwattsOut = {
  annual_kwh: number;
  monthly_kwh: number[];
  solrad_kwh_m2_day: number;    // outputs.solrad_annual (kWh/m²/day) — DO NOT /365
  inputsUsed: Record<string, number|string>;
};

export async function pvwatts(p: PvwattsParams): Promise<PvwattsOut> {
  const apiKey = process.env.NREL_API_KEY;
  if (!apiKey) throw new Error("Missing NREL_API_KEY");

  const u = new URL("https://developer.nrel.gov/api/pvwatts/v8.json");
  u.searchParams.set("api_key", apiKey);
  u.searchParams.set("lat", String(p.lat));
  u.searchParams.set("lon", String(p.lon));
  u.searchParams.set("system_capacity", String(p.system_capacity_kw));
  u.searchParams.set("tilt", String(p.tilt_deg));
  u.searchParams.set("azimuth", String(p.azimuth_deg));
  u.searchParams.set("losses", String(p.losses_pct));
  u.searchParams.set("module_type", String(p.module_type ?? 1));
  u.searchParams.set("array_type", String(p.array_type ?? 1));
  u.searchParams.set("dc_ac_ratio", String(p.dc_ac_ratio ?? 1.2));
  u.searchParams.set("inv_eff", String(p.inv_eff ?? 96));

  const res = await fetch(u.toString(), { cache: "no-store" });
  const json = await res.json();
  const out = json?.outputs;
  if (!res.ok || !out?.ac_annual || !out?.ac_monthly || !out?.solrad_annual) {
    const msg = json?.errors?.[0] || "PVWatts request failed";
    throw new Error(msg);
  }

  return {
    annual_kwh: out.ac_annual,
    monthly_kwh: out.ac_monthly,
    solrad_kwh_m2_day: out.solrad_annual, // already per day
    inputsUsed: {
      lat: p.lat, lon: p.lon,
      system_capacity_kw: p.system_capacity_kw,
      tilt_deg: p.tilt_deg, azimuth_deg: p.azimuth_deg,
      losses_pct: p.losses_pct,
      module_type: p.module_type ?? 1,
      array_type: p.array_type ?? 1,
      dc_ac_ratio: p.dc_ac_ratio ?? 1.2,
      inv_eff: p.inv_eff ?? 96
    }
  };
}
