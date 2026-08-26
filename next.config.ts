import type { NextConfig } from "next";

// Static CSP — compatible with Next.js static generation.
// 'unsafe-inline' is required for Next.js hydration scripts and framer-motion inline styles.
// object-src/base-uri/frame-ancestors still block the highest-risk injection vectors.
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

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@libsql/client"],
  async headers() {
    return [
      {
        // Apply CSP to all pages
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
      {
        // SW must be served fresh and be allowed to control all paths
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
        ],
      },
      {
        // Uploaded article images: safe to cache, never execute
        source: "/uploads/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
