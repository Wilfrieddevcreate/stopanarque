import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { clientIp } from "@/lib/validation";
import { checkBan } from "@/lib/security";

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
