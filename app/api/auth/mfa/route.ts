import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateTotpSetup, generateQrDataUrl, verifyTotp,
  generateBackupCodes, consumeBackupCode,
} from "@/lib/mfa";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { clientIp } from "@/lib/validation";

function requireJson(request: NextRequest): boolean {
  const ct = request.headers.get("content-type") ?? "";
  return ct.includes("application/json");
}

/** GET /api/auth/mfa — Generate a new TOTP secret (setup phase). */
export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { secret, otpauthUrl } = generateTotpSetup(user.email);
  const qrDataUrl = await generateQrDataUrl(otpauthUrl);

  // Store pending secret — activated only after first successful verification
  await prisma.user.update({ where: { id: user.id }, data: { totpSecret: secret } });

  return NextResponse.json({ qrDataUrl, secret });
}

/** POST /api/auth/mfa — Activate, verify, or use backup code. */
export async function POST(request: NextRequest) {
  if (!requireJson(request)) {
    return NextResponse.json({ error: "Content-Type application/json requis" }, { status: 415 });
  }

  const ip = clientIp(request);
  const { allowed, remaining, resetAt } = await checkRateLimit(ip, "login");
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429, headers: rateLimitHeaders(0, resetAt) }
    );
  }

  let body: { token?: unknown; action?: unknown; userId?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "JSON invalide" }, { status: 400 }); }

  const rawToken = typeof body.token === "string" ? body.token.replace(/[\s-]/g, "") : null;

  // ── Activation (admin already logged in, confirms first TOTP code) ──
  if (body.action === "activate") {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    if (!user.totpSecret) return NextResponse.json({ error: "Aucun secret MFA en attente" }, { status: 400 });

    if (!rawToken || !/^\d{6}$/.test(rawToken)) {
      return NextResponse.json({ error: "Code invalide — 6 chiffres attendus" }, { status: 400 });
    }
    if (!verifyTotp(rawToken, user.totpSecret)) {
      return NextResponse.json({ error: "Code incorrect. Vérifiez l'heure de votre appareil." }, { status: 400 });
    }

    const { plainCodes, hashedCodes } = await generateBackupCodes();
    await prisma.user.update({
      where: { id: user.id },
      data: { mfaEnabled: true, mfaBackupCodes: JSON.stringify(hashedCodes) },
    });

    // Return plaintext codes once — never stored in plain form again
    return NextResponse.json({ success: true, backupCodes: plainCodes });
  }

  // ── Login step 2: TOTP or backup code ──
  if (body.action === "verify" && typeof body.userId === "string") {
    const user = await prisma.user.findUnique({ where: { id: body.userId } });
    if (!user || !user.mfaEnabled || !user.totpSecret) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!rawToken) {
      return NextResponse.json({ error: "Code requis" }, { status: 400 });
    }

    // Try TOTP first (6 digits), then backup code (10 hex chars)
    let authenticated = false;

    if (/^\d{6}$/.test(rawToken)) {
      authenticated = verifyTotp(rawToken, user.totpSecret);
    } else if (/^[A-F0-9]{10}$/i.test(rawToken)) {
      // Backup code flow
      if (!user.mfaBackupCodes) {
        return NextResponse.json({ error: "Aucun code de secours disponible" }, { status: 400 });
      }
      const { valid, remaining: remainingCodes } = await consumeBackupCode(rawToken, user.mfaBackupCodes);
      if (valid) {
        await prisma.user.update({
          where: { id: user.id },
          data: { mfaBackupCodes: JSON.stringify(remainingCodes) },
        });
        authenticated = true;
      }
    } else {
      return NextResponse.json({ error: "Format de code invalide" }, { status: 400 });
    }

    if (!authenticated) {
      return NextResponse.json({ error: "Code incorrect." }, { status: 400 });
    }

    const { createSession } = await import("@/lib/auth");
    await createSession(user.id);
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name } });
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 });
}

/** DELETE /api/auth/mfa — Disable MFA (clears secret and backup codes). */
export async function DELETE() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  await prisma.user.update({
    where: { id: user.id },
    data: { mfaEnabled: false, totpSecret: null, mfaBackupCodes: null },
  });

  return NextResponse.json({ success: true });
}
