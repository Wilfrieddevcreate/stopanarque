import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { clientIp } from "@/lib/validation";
import { checkBan } from "@/lib/security";
import { rm } from "fs/promises";
import path from "path";

const MAX_CODE = 20;

function maskPhone(phone: string): string {
  if (phone.length <= 4) return "****";
  return phone.slice(0, 3) + "****" + phone.slice(-2);
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request);

  if (await checkBan(ip)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { allowed, remaining, resetAt } = await checkRateLimit(ip, "search");
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429, headers: rateLimitHeaders(0, resetAt) }
    );
  }

  const raw = request.nextUrl.searchParams.get("code");
  if (!raw || !raw.trim()) {
    return NextResponse.json({ error: "Code requis" }, { status: 400 });
  }

  const code = raw.trim().toUpperCase().slice(0, MAX_CODE);

  const report = await prisma.report.findUnique({
    where: { trackingCode: code },
    select: {
      trackingCode: true,
      status: true,
      scamType: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
      actions: {
        select: { action: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!report) {
    return NextResponse.json({ result: null }, { headers: rateLimitHeaders(remaining, resetAt) });
  }

  return NextResponse.json(
    {
      result: {
        trackingCode: report.trackingCode,
        status: report.status,
        scamType: report.scamType,
        phoneNumber: report.phoneNumber ? maskPhone(report.phoneNumber) : null,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        timeline: report.actions.map((a) => ({ action: a.action, date: a.createdAt })),
      },
    },
    { headers: rateLimitHeaders(remaining, resetAt) }
  );
}

export async function DELETE(request: NextRequest) {
  const ip = clientIp(request);

  if (await checkBan(ip)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { allowed, remaining, resetAt } = await checkRateLimit(ip, "search");
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429, headers: rateLimitHeaders(0, resetAt) }
    );
  }

  const raw = request.nextUrl.searchParams.get("code");
  if (!raw?.trim()) {
    return NextResponse.json({ error: "Code requis" }, { status: 400 });
  }

  const code = raw.trim().toUpperCase().slice(0, MAX_CODE);

  const report = await prisma.report.findUnique({
    where: { trackingCode: code },
    select: { id: true, status: true },
  });

  if (!report) {
    return NextResponse.json({ error: "Signalement introuvable" }, { status: 404 });
  }

  // Only allow deletion of pending reports — confirmed reports are part of the public record
  if (report.status === "CONFIRME") {
    return NextResponse.json(
      { error: "Un signalement confirmé ne peut pas être supprimé. Contactez-nous si nécessaire." },
      { status: 403 }
    );
  }

  // Delete uploaded files from disk before deleting DB records
  const uploadDir = path.join(process.cwd(), "uploads", "reports", report.id);
  await rm(uploadDir, { recursive: true, force: true }).catch(() => {});

  // Cascade deletes Evidence and AdminAction via Prisma relations
  await prisma.report.delete({ where: { id: report.id } });

  return NextResponse.json(
    { success: true },
    { headers: rateLimitHeaders(remaining, resetAt) }
  );
}
