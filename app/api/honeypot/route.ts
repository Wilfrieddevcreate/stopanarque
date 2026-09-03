/**
 * Honeypot endpoint — never linked from the UI.
 * Any request here is from a scanner, crawler, or attacker.
 * We log the threat and auto-ban the IP immediately.
 */
import { NextRequest, NextResponse } from "next/server";
import { clientIp } from "@/lib/validation";
import { logThreat } from "@/lib/security";

async function handle(request: NextRequest) {
  const ip = clientIp(request);
  const ua = request.headers.get("user-agent") ?? "";

  await logThreat({
    ip,
    threat: "scanner",
    path: request.nextUrl.pathname,
    detail: `Honeypot hit: ${request.method} ${request.nextUrl.pathname}`,
    userAgent: ua,
  }).catch(() => {});

  // Deliberate delay to waste scanner time (tarpit)
  await new Promise((r) => setTimeout(r, 2000));

  // Return a convincing but harmless 403
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const PATCH = handle;
