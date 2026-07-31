import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

// ── Edge-safe attack pattern detection ────────────────────────────────────────
// (no Prisma — pure regex, runs before any route handler)

const SQL_RE = /(\b(union|select|insert|update|delete|drop|alter|exec|execute|cast|information_schema|pg_sleep|sleep|benchmark|load_file|outfile)\b|--|\/\*.*\*\/|'\s*(or|and)\s*'|\bor\s+\d+=\d+)/i;
const XSS_RE = /<[^>]*script|javascript:|on\w+\s*=|eval\s*\(|document\s*\.|alert\s*\(/i;
const PATH_RE = /(\.\.(\/|\\)|%2e%2e(%2f|%5c)|\.%2f|%2e\.)/i;
const SCANNER_UA_RE = /nikto|sqlmap|masscan|nmap|dirbuster|gobuster|wfuzz|hydra|zgrab|nuclei|acunetix|burpsuite|nessus|openvas/i;

type EdgeThreat = "sql_injection" | "xss" | "path_traversal" | "scanner";

function detectUrlThreat(url: string, ua: string): EdgeThreat | null {
  if (SCANNER_UA_RE.test(ua)) return "scanner";
  let decoded = url;
  try { decoded = decodeURIComponent(url); } catch { /* keep raw */ }
  if (PATH_RE.test(decoded)) return "path_traversal";
  if (SQL_RE.test(decoded))  return "sql_injection";
  if (XSS_RE.test(decoded))  return "xss";
  return null;
}

function verifyTokenAge(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot === -1) return false;
    const sessionId = decoded.slice(0, lastDot);
    return sessionId.length > 10 && sessionId.length < 60;
  } catch {
    return false;
  }
}

function safeFrom(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/admin";
  if (raw.includes("://")) return "/admin";
  return raw;
}

function clientIpEdge(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDev = process.env.NODE_ENV === "development";

  // ── Edge threat detection ──────────────────────────────────────────────────
  const ua = request.headers.get("user-agent") ?? "";
  const fullUrl = request.nextUrl.pathname + request.nextUrl.search;
  const threat = detectUrlThreat(fullUrl, ua);

  if (threat) {
    const ip = clientIpEdge(request);
    // Block immediately and add headers so the /api/admin/security endpoint can
    // record the event (the browser will never see this response body).
    const blocked = new NextResponse(
      JSON.stringify({ error: "Requête bloquée", threat }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
    // Fire-and-forget: notify the logging API (best-effort, no await in Edge)
    const logUrl = new URL("/api/admin/security/log", request.url);
    fetch(logUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-log": "1" },
      body: JSON.stringify({ ip, threat, path: fullUrl, userAgent: ua }),
    }).catch(() => {});
    return blocked;
  }

  // ── Admin route protection ────────────────────────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token || !verifyTokenAge(token)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", safeFrom(pathname));
      const res = NextResponse.redirect(loginUrl);
      if (token) res.cookies.delete(SESSION_COOKIE);
      return res;
    }
  }

  // ── CSP nonce ─────────────────────────────────────────────────────────────
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    // strict-dynamic makes nonce propagate to dynamically loaded scripts
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Style: self + nonce for inline (framer-motion, Tiptap inject inline styles)
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    // Images: self + blob (Image component) + data URIs
    "img-src 'self' blob: data:",
    // Fonts loaded from next/font (self) and Google Fonts
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "media-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Replaces X-Frame-Options
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

  return response;
}

export const config = {
  matcher: [
    {
      // Exclude prefetches and static assets — they don't need CSP nonce
      source: "/((?!_next/static|_next/image|favicon.ico|icons|manifest).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
