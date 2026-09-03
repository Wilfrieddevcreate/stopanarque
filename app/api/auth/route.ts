import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, createSession, destroySession } from "@/lib/auth";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { checkBan, logThreat } from "@/lib/security";
import { clientIp } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  // Reject if IP is banned
  if (await checkBan(ip)) {
    return NextResponse.json(
      { error: "Accès refusé." },
      { status: 403 }
    );
  }

  // Rate limit by IP: 5 attempts per 15 minutes
  const { allowed, remaining, resetAt } = await checkRateLimit(ip, "login");

  if (!allowed) {
    await logThreat({ ip, threat: "rate_limit", path: "/api/auth", userAgent: request.headers.get("user-agent") ?? "" });
    const retryAfter = Math.ceil((resetAt.getTime() - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${Math.ceil(retryAfter / 60)} minute(s).` },
      { status: 429, headers: rateLimitHeaders(0, resetAt) }
    );
  }

  const ct = request.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type application/json requis" }, { status: 415 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const { email, password } = body;

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    if (email.length > 200 || password.length > 200) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const user = await authenticateAdmin(email.trim().toLowerCase(), password);
    if (!user) {
      // Log failed attempt — accumulates toward auto-ban
      await logThreat({
        ip,
        threat: "brute_force",
        path: "/api/auth",
        detail: `email: ${email.slice(0, 60)}`,
        userAgent: request.headers.get("user-agent") ?? "",
      });
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401, headers: rateLimitHeaders(remaining, resetAt) }
      );
    }

    // If MFA is enabled, do NOT create a session yet — return a signal for step 2
    if (user.mfaEnabled) {
      return NextResponse.json(
        { requiresMfa: true, userId: user.id },
        { headers: rateLimitHeaders(remaining, resetAt) }
      );
    }

    await createSession(user.id);
    return NextResponse.json(
      { success: true, user: { id: user.id, name: user.name } },
      { headers: rateLimitHeaders(remaining, resetAt) }
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ success: true });
}
