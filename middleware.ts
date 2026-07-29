import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

function verifyTokenAge(token: string): boolean {
  try {
    const decoded = atob(token);
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = decoded.slice(0, lastDot);
    const timestamp = parseInt(payload.split(":")[1], 10);
    if (isNaN(timestamp)) return false;
    // Check token age (24h) — signature is verified server-side by getSession()
    return Date.now() - timestamp < 86400000;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token || !verifyTokenAge(token)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear invalid cookie
      if (token) response.cookies.delete(SESSION_COOKIE);
      return response;
    }
  }

  // Security headers on all responses
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};
