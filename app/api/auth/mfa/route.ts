import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTotpSetup, generateQrDataUrl, verifyTotp } from "@/lib/mfa";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { clientIp } from "@/lib/validation";

/** GET /api/auth/mfa — Generate a new TOTP secret (setup phase). */
export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { secret, otpauthUrl } = generateTotpSetup(user.email);
  const qrDataUrl = await generateQrDataUrl(otpauthUrl);

  // Store the pending secret — only activated after first successful verification
  await prisma.user.update({ where: { id: user.id }, data: { totpSecret: secret } });

  return NextResponse.json({ qrDataUrl, secret });
}

/** POST /api/auth/mfa — Activate MFA (confirm first code) or verify during login. */
export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const { allowed, remaining, resetAt } = await checkRateLimit(ip, "login");
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429, headers: rateLimitHeaders(0, resetAt) }
    );
  }

  let body: { token?: unknown; action?: unknown; userId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token.replace(/\s/g, "") : null;
  if (!token || !/^\d{6}$/.test(token)) {
    return NextResponse.json({ error: "Code invalide — 6 chiffres attendus" }, { status: 400 });
  }

  // Activation flow (admin already logged in, confirming their first TOTP code)
  if (body.action === "activate") {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    if (!user.totpSecret) {
      return NextResponse.json({ error: "Aucun secret MFA en attente" }, { status: 400 });
    }

    if (!verifyTotp(token, user.totpSecret)) {
      return NextResponse.json({ error: "Code incorrect. Vérifiez l'heure de votre appareil." }, { status: 400 });
    }

    await prisma.user.update({ where: { id: user.id }, data: { mfaEnabled: true } });
    return NextResponse.json({ success: true });
  }

  // Verification flow (login step 2: userId passed from temp state)
  if (body.action === "verify" && typeof body.userId === "string") {
    const user = await prisma.user.findUnique({ where: { id: body.userId } });
    if (!user || !user.mfaEnabled || !user.totpSecret) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!verifyTotp(token, user.totpSecret)) {
      return NextResponse.json({ error: "Code incorrect." }, { status: 400 }, );
    }

    // Create the real session now
    const { createSession } = await import("@/lib/auth");
    await createSession(user.id);
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name } });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}

/** DELETE /api/auth/mfa — Disable MFA. */
export async function DELETE() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  await prisma.user.update({
    where: { id: user.id },
    data: { mfaEnabled: false, totpSecret: null },
  });

  return NextResponse.json({ success: true });
}
