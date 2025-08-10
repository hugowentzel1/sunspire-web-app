import { NextResponse } from "next/server";
import { pvwatts } from "@/lib/pvwatts";
import { getRate } from "@/lib/rates";
import { buildEstimate } from "@/lib/estimate";

type Inputs = {
  address: string;
  lat: number; lng: number;
  systemKw: number;
  tilt: number; azimuth: number; lossesPct: number;
  state?: string;
  roofFace?: "N"|"E"|"S"|"W";
};

function mapRoofFaceToAzimuth(face?: string): number | undefined {
  const f = (face || "").toUpperCase();
  if (f === "N") return 0;
  if (f === "E") return 90;
  if (f === "S") return 180;
  if (f === "W") return 270;
  return undefined;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseInputsFromSearch(url: string): Inputs {
  const sp = new URL(url).searchParams;

  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  const address = sp.get("address") ?? "";

  const systemKw = Number(sp.get("systemKw")) || 6;        // decent default
  const tiltIn   = Number(sp.get("tilt"));
  const faceIn   = sp.get("roofFace") as Inputs["roofFace"] | null;
  const azIn     = Number(sp.get("azimuth"));
  const lossesIn = Number(sp.get("lossesPct"));

  // Prefer explicit azimuth if provided; otherwise map roofFace; otherwise default south (180)
  const azimuth = Number.isFinite(azIn)
    ? ((azIn % 360) + 360) % 360
    : (mapRoofFaceToAzimuth(faceIn || undefined) ?? 180);

  // Sensible guardrails
  const tilt     = Number.isFinite(tiltIn) ? clamp(tiltIn, 0, 60) : 22;
  const lossesPct = Number.isFinite(lossesIn) ? clamp(lossesIn, 5, 25) : 14;

  const state = sp.get("state") ?? undefined;

  if (!address || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Missing address/coordinates");
  }

  return { address, lat, lng, systemKw, tilt, azimuth, lossesPct, state, roofFace: faceIn ?? undefined };
}

export async function GET(req: Request) {
  try {
    let i = parseInputsFromSearch(req.url);

    const pv = await pvwatts({
      lat: i.lat,
      lon: i.lng,
      system_capacity_kw: i.systemKw,
      tilt_deg: i.tilt,
      azimuth_deg: i.azimuth,
      losses_pct: i.lossesPct,
      module_type: 1,     // premium
      array_type: 2,      // **fixed roof mount**
      dc_ac_ratio: 1.2,
      inv_eff: 96
    });

    const rate = await getRate(i.state);
    const estimate = buildEstimate({
      address: i.address, lat: i.lat, lng: i.lng,
      stateCode: i.state, pv, rate,
      systemKw: i.systemKw, tilt: i.tilt, azimuth: i.azimuth, lossesPct: i.lossesPct
    });

    // IMPORTANT: keep the exact shape the UI expects (estimate inside top-level object)
    return NextResponse.json({ estimate }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "estimate failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const qs = new URLSearchParams(Object.entries(body).map(([k,v]) => [k, String(v)]));
  const url = `http://dummy.local?${qs.toString()}`;
  return GET(new Request(url));
}
