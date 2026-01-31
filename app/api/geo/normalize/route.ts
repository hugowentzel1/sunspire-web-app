import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/src/config/env";

export interface NormalizedAddress {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

/** Prefer server-only key so Geocoding works from Vercel (no referrer). Use runtime process.env so Vercel injects env at request time. */
function getGeocodingApiKey(): string | undefined {
  const serverKey =
    typeof process.env.GOOGLE_GEOCODING_API_KEY === "string"
      ? process.env.GOOGLE_GEOCODING_API_KEY.trim()
      : "";
  if (serverKey) return serverKey;
  const raw = ENV.GOOGLE_GEOCODING_API_KEY ?? ENV.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const key = typeof raw === "string" ? raw.trim() : "";
  return key || undefined;
}

/** Google API keys start with AIza (capital I). Copy-paste often turns I into l. */
function validateKeyFormat(key: string): { ok: true } | { ok: false; error: string } {
  if (!key.startsWith("AIza")) {
    const start = key.slice(0, 4);
    return {
      ok: false,
      error: `API key should start with "AIza" (capital I), got "${start}". Fix typo in GOOGLE_GEOCODING_API_KEY.`,
    };
  }
  return { ok: true };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 },
    );
  }

  const apiKey = getGeocodingApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps API key not configured" },
      { status: 500 },
    );
  }

  const keyValidation = validateKeyFormat(apiKey);
  if (!keyValidation.ok) {
    return NextResponse.json(
      { error: keyValidation.error },
      { status: 400 },
    );
  }

  try {
    // Use Google Geocoding API (server key preferred so requests from Vercel are allowed)
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      const message = data.error_message ?? data.status;
      const msg = typeof message === "string" ? message : String(message);
      const isRefererRestriction = msg.toLowerCase().includes("referer");
      const hint = isRefererRestriction
        ? "Use GOOGLE_GEOCODING_API_KEY with an unrestricted key (API key 1). Server requests cannot use HTTP-referrer–restricted keys."
        : data.status === "REQUEST_DENIED"
          ? "In Google Cloud: (1) Enable Billing for the project (required for Maps APIs). (2) Enable Geocoding API. (3) Use API key 1 (unrestricted) for GOOGLE_GEOCODING_API_KEY."
          : undefined;
      return NextResponse.json(
        {
          error: `Geocoding failed: ${data.status}`,
          details: msg,
          ...(hint && { fix: hint }),
        },
        { status: 400 },
      );
    }

    const result = data.results[0];
    const addressComponents = result.address_components || [];

    // Extract address components
    const extractComponent = (types: string[]) => {
      const component = addressComponents.find((comp: any) =>
        comp.types.some((type: string) => types.includes(type)),
      );
      return component ? component.long_name : "";
    };

    const streetNumber = extractComponent(["street_number"]);
    const route = extractComponent(["route"]);
    const street =
      streetNumber && route
        ? `${streetNumber} ${route}`
        : streetNumber || route;

    const normalizedAddress: NormalizedAddress = {
      formattedAddress: result.formatted_address || "",
      street,
      city: extractComponent(["locality"]),
      state: extractComponent(["administrative_area_level_1"]),
      postalCode: extractComponent(["postal_code"]),
      country: extractComponent(["country"]),
      lat: result.geometry?.location?.lat || 0,
      lng: result.geometry?.location?.lng || 0,
    };

    return NextResponse.json(normalizedAddress);
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
