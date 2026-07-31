import { NextRequest, NextResponse } from "next/server";
import { logThreat, type ThreatType } from "@/lib/security";

const VALID_THREATS: ThreatType[] = [
  "sql_injection", "xss", "path_traversal", "rfi",
  "brute_force", "suspicious_input", "scanner", "rate_limit",
];

// Internal-only endpoint — called by proxy.ts fire-and-forget.
// Not authenticated with session (proxy has no session context), but
// protected by the x-internal-log header check + threat type allowlist.
// Never returns sensitive data.
export async function POST(request: NextRequest) {
  if (request.headers.get("x-internal-log") !== "1") {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const ip        = typeof b.ip        === "string" ? b.ip.slice(0, 100)        : "unknown";
  const path      = typeof b.path      === "string" ? b.path.slice(0, 500)      : "/";
  const detail    = typeof b.detail    === "string" ? b.detail.slice(0, 500)    : "";
  const userAgent = typeof b.userAgent === "string" ? b.userAgent.slice(0, 300) : "";
  const threat    = typeof b.threat    === "string" && VALID_THREATS.includes(b.threat as ThreatType)
    ? b.threat as ThreatType
    : null;

  if (!threat) {
    return NextResponse.json({ error: "Threat invalide" }, { status: 400 });
  }

  await logThreat({ ip, threat, path, detail, userAgent });

  return NextResponse.json({ ok: true });
}
