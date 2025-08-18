import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.next();
  
  // Set demo header for demo pages
  if (url.searchParams.get("demo") === "1") {
    res.headers.set("x-demo", "1");
  }
  
  // Handle company-specific URLs for white-label demos
  const hostname = url.hostname;
  const pathname = url.pathname;
  
  // Check if this is a company-specific subdomain or path
  if (hostname.includes('solarpro') || pathname.startsWith('/solarpro')) {
    res.headers.set("x-tenant", "solarpro");
  } else if (hostname.includes('ecosolar') || pathname.startsWith('/ecosolar')) {
    res.headers.set("x-tenant", "ecosolar");
  } else if (hostname.includes('premiumsolar') || pathname.startsWith('/premiumsolar')) {
    res.headers.set("x-tenant", "premiumsolar");
  } else if (hostname.includes('acme') || pathname.startsWith('/acme')) {
    res.headers.set("x-tenant", "acme");
  }
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
