import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, createSession, destroySession } from "@/lib/auth";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit by IP: 5 attempts per 15 minutes
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, remaining, resetAt } = await checkRateLimit(ip, "login");

  if (!allowed) {
    const retryAfter = Math.ceil((resetAt.getTime() - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${Math.ceil(retryAfter / 60)} minute(s).` },
      { status: 429, headers: rateLimitHeaders(0, resetAt) }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const { email, password } = body;

    // Basic input validation
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    if (email.length > 200 || password.length > 200) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const user = await authenticateAdmin(email.trim().toLowerCase(), password);
    if (!user) {
      // Same message for wrong email or wrong password (no user enumeration)
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401, headers: rateLimitHeaders(remaining, resetAt) }
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
