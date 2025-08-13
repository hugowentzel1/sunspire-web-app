export const runtime = "edge";
export const contentType = "image/png";

import { ImageResponse } from "next/og";

function normalizeHex(hex: string | null, fallback = "#FFA63D") {
  if (!hex) return fallback;
  const h = hex.startsWith("#") ? hex : `#${hex}`;
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h.toUpperCase() : fallback;
}
function sanitizeBrand(s: string | null) {
  if (!s) return "Sunspire";
  return s.replace(/[<>]/g, "").trim().slice(0, 40) || "Sunspire";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const brand = sanitizeBrand(url.searchParams.get("brand"));
  const primary = normalizeHex(url.searchParams.get("primary"));

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: primary,
          color: "#0D0D0D",
          fontSize: 98,
          fontWeight: 800,
          letterSpacing: "-1px",
          padding: 40,
        }}
      >
        {brand}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
