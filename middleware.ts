import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.next();
  
  // Set demo header for demo pages
  if (url.searchParams.get("demo") === "1") {
    res.headers.set("x-demo", "1");
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
