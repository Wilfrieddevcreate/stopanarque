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

  const q = request.nextUrl.searchParams.get("q");
  if (!q || !q.trim()) {
    return NextResponse.json({ result: null });
  }

  const query = q.trim();
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
  });

  if (reports.length === 0) {
    return NextResponse.json({
      result: { query, count: 0, scamTypes: [], suspects: [] },
    });
  }

  const scamTypes = [...new Set(reports.map((r) => r.scamType))];
  const phones = [...new Set(reports.map((r) => r.phoneNumber))];
  const names = [...new Set(reports.map((r) => r.suspectName).filter(Boolean))];
  const platforms = [...new Set(reports.map((r) => r.suspectPlatform).filter(Boolean))];

  return NextResponse.json({
    result: {
      query,
      count: reports.length,
      scamTypes,
      phones,
      names,
      platforms,
    },
  });
}
