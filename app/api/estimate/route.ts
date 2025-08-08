import { NextResponse } from "next/server";
import { pvwatts } from "@/lib/pvwatts";
import { getRate } from "@/lib/rates";
import { buildEstimate } from "@/lib/estimate";

type Inputs = {
  address: string;
  lat: number; lng: number;
  systemKw: number; tilt: number; azimuth: number; lossesPct: number;
  state?: string; shadePct?: number; roofFace?: "N"|"E"|"S"|"W";
};

function parseInputsFromSearch(url: string): Inputs {
  const sp = new URL(url).searchParams;
  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  const address = sp.get("address") ?? "";
  const systemKw = Number(sp.get("systemKw") ?? 6);
  const tilt = Number(sp.get("tilt") ?? 20);
  const azimuth = Number(sp.get("azimuth") ?? 180);
  const lossesPct = Number(sp.get("lossesPct") ?? (process.env.DEFAULT_LOSSES_PCT ?? 14));
  const state = (sp.get("state") ?? "").toUpperCase() || undefined;
  const roofFace = (sp.get("roofFace") as Inputs["roofFace"]) || undefined;
  const shadePct = Number(sp.get("shadePct") ?? 0);

  return { address, lat, lng, systemKw, tilt, azimuth, lossesPct, state, roofFace, shadePct };
}

function withRoofAdjustments(i: Inputs): Inputs {
  // Optional: If roofFace provided, overwrite azimuth. N=0,E=90,S=180,W=270
  let az = i.azimuth;
  if (i.roofFace) {
    az = i.roofFace === "N" ? 0 : i.roofFace === "E" ? 90 : i.roofFace === "S" ? 180 : 270;
  }
  // Add shading into losses (cap at 30%)
  const losses = Math.min(30, i.lossesPct + (i.shadePct || 0));
  return { ...i, azimuth: az, lossesPct: losses };
}

export async function GET(req: Request) {
  try {
    let i = parseInputsFromSearch(req.url);
    if (!Number.isFinite(i.lat) || !Number.isFinite(i.lng)) {
      return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
    }
    i = withRoofAdjustments(i);

    const pv = await pvwatts({
      lat: i.lat, lon: i.lng,
      system_capacity_kw: i.systemKw,
      tilt_deg: i.tilt,
      azimuth_deg: i.azimuth,
      losses_pct: i.lossesPct
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
