import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { clientIp } from "@/lib/validation";
import { checkBan } from "@/lib/security";

const MAX_QUERY = 100;

function maskPhone(phone: string): string {
  if (phone.length <= 6) return "****";
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

  const raw = request.nextUrl.searchParams.get("q");
  if (!raw || !raw.trim()) {
    return NextResponse.json({ result: null });
  }

  const query = raw.trim().slice(0, MAX_QUERY);
  const normalized = query.replace(/\s/g, "");

  const reports = await prisma.report.findMany({
    where: {
      OR: [
        { phoneNumber: { contains: normalized } },
        { suspectName: { contains: query } },
        { suspectAccount: { contains: query } },
      ],
    },
    select: {
      phoneNumber: true,
      scamType: true,
      suspectName: true,
      suspectPlatform: true,
    },
    take: 200, // cap to avoid accidental full-table dumps
  });

  if (reports.length === 0) {
    return NextResponse.json({
      result: { query, count: 0, scamTypes: [], suspects: [] },
      headers: rateLimitHeaders(remaining, resetAt),
    });
  }

  const scamTypes = [...new Set(reports.map((r) => r.scamType))];
  // Never return full phone numbers — always mask
  const phones = [...new Set(reports.map((r) => r.phoneNumber ? maskPhone(r.phoneNumber) : null).filter(Boolean))];
  const names = [...new Set(reports.map((r) => r.suspectName).filter(Boolean))];
  const platforms = [...new Set(reports.map((r) => r.suspectPlatform).filter(Boolean))];

  return NextResponse.json(
    { result: { query, count: reports.length, scamTypes, phones, names, platforms } },
    { headers: rateLimitHeaders(remaining, resetAt) }
  );
}
