// /lib/company.ts
export function sanitizeCompany(raw: string | null): string {
  if (!raw) return "";
  return raw.trim().slice(0, 64).replace(/[<>]/g, "");
}

// Deterministic pastel gradient from the company string
export function brandGradient(company: string) {
  if (!company) return { from: "#eef2ff", to: "#f5f3ff" }; // soft default
  let h = 0;
  for (let i = 0; i < company.length; i++) {
    h = (h * 31 + company.charCodeAt(i)) % 360;
  }
  const from = `hsl(${h}, 75%, 92%)`;
  const to   = `hsl(${(h + 30) % 360}, 85%, 96%)`;
  return { from, to };
}

export function logoUrlFromDomain(domain?: string) {
  if (!domain) return "";
  return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`;
}
