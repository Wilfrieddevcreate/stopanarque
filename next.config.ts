import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@libsql/client"],
  async headers() {
    return [
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
