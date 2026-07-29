import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, remaining, resetAt } = await checkRateLimit(ip, "search");
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429, headers: rateLimitHeaders(0, resetAt) }
    );
  }

  const code = request.nextUrl.searchParams.get("code");
  if (!code || !code.trim()) {
    return NextResponse.json({ error: "Code requis" }, { status: 400 });
  }

  const report = await prisma.report.findUnique({
    where: { trackingCode: code.trim().toUpperCase() },
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
    return NextResponse.json({ result: null });
  }

  // Masquer partiellement le numéro pour la confidentialité
  const masked =
    report.phoneNumber.slice(0, 4) +
    "****" +
    report.phoneNumber.slice(-2);

  return NextResponse.json({
    result: {
      trackingCode: report.trackingCode,
      status: report.status,
      scamType: report.scamType,
      phoneNumber: masked,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      timeline: report.actions.map((a) => ({
        action: a.action,
        date: a.createdAt,
      })),
    },
  });
}
