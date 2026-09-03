import type { NextConfig } from "next";

// ── Content Security Policy ──────────────────────────────────────────────────
// 'unsafe-inline' required for Next.js hydration + Framer Motion inline styles.
// 'unsafe-eval' required for Next.js development; kept in prod for now (needed
// by some Next internals). frame-ancestors + object-src cover the critical vectors.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' blob: data:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self'",
  "media-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// ── Permissions Policy ───────────────────────────────────────────────────────
// Disable every browser feature the site doesn't use.
const PERMISSIONS_POLICY = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()",
  "usb=()",
  "bluetooth=()",
  "accelerometer=()",
  "gyroscope=()",
  "magnetometer=()",
  "fullscreen=(self)",
  "interest-cohort=()",   // disable FLoC / Topics API
].join(", ");

// ── Shared security headers (all routes) ────────────────────────────────────
const SECURITY_HEADERS = [
  // Clickjacking — belt-and-suspenders alongside frame-ancestors in CSP
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing attacks
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Stop sending full Referer to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable dangerous browser features
  { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
  // Prevent same-site windows from sharing a browsing context group
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Ensure browsers only load resources from the same origin
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  // XSS filter (legacy IE/Chrome — belt-and-suspenders)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // HSTS — tell browsers to only connect over HTTPS for 2 years
  // 'preload' allows submission to the HSTS preload list
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // CSP
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@libsql/client"],

  // Enforce 4 MB body limit on Server Actions (prevents upload DoS)
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },

  // Redirect common scanner targets to the honeypot
  async redirects() {
    const honeyTargets = [
      "/wp-admin", "/wp-login.php", "/admin.php", "/.env",
      "/config.php", "/phpinfo.php", "/.git/config",
      "/backup.sql", "/dump.sql", "/db.sql",
      "/api/v1", "/api/v2", "/graphql", "/swagger",
    ];
    return honeyTargets.map((source) => ({
      source,
      destination: "/api/honeypot",
      permanent: false,
    }));
  },

  async headers() {
    return [
      {
        // Apply all security headers globally
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
      {
        // Service worker: no cache
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        // Prevent search engines from indexing API responses
        source: "/api/(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
          // No caching of API responses that may contain personal data
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        // Public article images: safe to cache, never execute
        source: "/uploads/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
