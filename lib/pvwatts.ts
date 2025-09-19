// lib/pvwatts.ts
import { cache } from './cache';
import { retryPVWatts } from './retry';
import { createHash } from 'crypto';

export type PvwattsParams = {
  lat: number;
  lon: number;
  system_capacity_kw: number; // DC kW
  tilt_deg: number; // 0..60
  azimuth_deg: number; // 0=N,90=E,180=S,270=W
  losses_pct: number; // total % losses (soiling, mismatch, wiring, shading, etc.)
  module_type?: 0 | 1 | 2; // 0=Std,1=Prem,2=Thin
  array_type?: 1 | 2 | 3 | 4 | 5; // 2 = Fixed roof mount (BEST default for residential)
  dc_ac_ratio?: number; // default 1.2
  inv_eff?: number; // default 96
};

export type PvwattsOut = {
  annual_kwh: number;
  monthly_kwh: number[];
  solrad_kwh_m2_day: number; // outputs.solrad_annual (kWh/m²/day)
  inputsUsed: {
    lat: number;
    lon: number;
    system_capacity_kw: number;
    tilt_deg: number;
    azimuth_deg: number;
    losses_pct: number;
    module_type: 0 | 1 | 2;
    array_type: 1 | 2 | 3 | 4 | 5;
    dc_ac_ratio: number;
    inv_eff: number;
  };
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getPVWattsCacheKey(params: PvwattsParams): string {
  const hash = createHash('sha1');
  hash.update(JSON.stringify({
    lat: params.lat,
    lng: params.lon,
    tilt: params.tilt_deg,
    azimuth: params.azimuth_deg,
    dc_kw: params.system_capacity_kw,
    losses: params.losses_pct
  }));
  return `pvwatts:${hash.digest('hex')}`;
}

export async function pvwatts(p: PvwattsParams): Promise<PvwattsOut> {
  // Check cache first
  const cacheKey = getPVWattsCacheKey(p);
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const key = process.env.NREL_API_KEY;
  if (!key) throw new Error("Missing NREL_API_KEY");

  // Sanity + best-practice defaults for residential roofs
  const lat = p.lat;
  const lon = p.lon;
  const system_capacity_kw = Math.max(0.5, p.system_capacity_kw); // avoid zero/negatives
  const tilt_deg = clamp(Number.isFinite(p.tilt_deg) ? p.tilt_deg : 22, 0, 60);
  const azimuth_deg =
    (((Number.isFinite(p.azimuth_deg) ? p.azimuth_deg : 180) % 360) + 360) %
    360;
  const losses_pct = clamp(
    Number.isFinite(p.losses_pct) ? p.losses_pct : 14,
    5,
    25,
  );

  const module_type = p.module_type ?? 1; // premium by default
  const array_type = p.array_type ?? 2; // **fixed roof mount** (critical for realism)
  const dc_ac_ratio = p.dc_ac_ratio ?? 1.2;
  const inv_eff = p.inv_eff ?? 96;

  const u = new URL("https://developer.nrel.gov/api/pvwatts/v8.json");
  u.searchParams.set("api_key", key);
  u.searchParams.set("lat", String(lat));
  u.searchParams.set("lon", String(lon));
  u.searchParams.set("system_capacity", String(system_capacity_kw));
  u.searchParams.set("tilt", String(tilt_deg));
  u.searchParams.set("azimuth", String(azimuth_deg));
  u.searchParams.set("losses", String(losses_pct));
  u.searchParams.set("module_type", String(module_type));
  u.searchParams.set("array_type", String(array_type));
  u.searchParams.set("dc_ac_ratio", String(dc_ac_ratio));
  u.searchParams.set("inv_eff", String(inv_eff));
  u.searchParams.set("timeframe", "monthly");

  // Wrap API call with retry
  const result = await retryPVWatts(async () => {
    const res = await fetch(u.toString(), { cache: "no-store" });
    const json = await res.json();

    const out = json?.outputs;
    if (!out?.ac_annual || !Array.isArray(out?.ac_monthly)) {
      const msg = json?.errors?.[0] || json?.error || "PVWatts error";
      throw new Error(String(msg));
    }

    return {
      annual_kwh: out.ac_annual,
      monthly_kwh: out.ac_monthly,
    solrad_kwh_m2_day: out.solrad_annual, // already per-day
    inputsUsed: {
      lat,
      lon,
      system_capacity_kw,
      tilt_deg,
      azimuth_deg,
      losses_pct,
      module_type,
      array_type,
      dc_ac_ratio,
      inv_eff,
    },
  };
  });

  // Cache the result for 24 hours
  cache.set(cacheKey, result, 24 * 60 * 60 * 1000);
  
  return result;
}
