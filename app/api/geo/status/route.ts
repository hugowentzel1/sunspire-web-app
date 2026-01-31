import { NextResponse } from "next/server";

/**
 * Safe debug endpoint: returns whether server Geocoding key is set (no secret value).
 * GET /api/geo/status → { ok, usingServerKey, keyPrefix }
 */
export async function GET() {
  const serverKey = process.env.GOOGLE_GEOCODING_API_KEY;
  const hasServerKey =
    typeof serverKey === "string" && serverKey.trim().length > 0;
  const keyPrefix = hasServerKey ? serverKey!.trim().slice(0, 4) : "";
  const ok = hasServerKey && keyPrefix === "AIza";
  return NextResponse.json({
    ok,
    usingServerKey: hasServerKey,
    keyPrefix: keyPrefix || null,
    hint: !hasServerKey
      ? "Set GOOGLE_GEOCODING_API_KEY in Vercel (unrestricted key) and redeploy."
      : !ok
        ? "Key should start with AIza (capital I). Fix typo and redeploy."
        : "Server key is set. Geocoding should work.",
  });
}
