import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BOT_PATTERNS = /bot|crawler|spider|slurp|wget|curl|python|java|php/i;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.page || typeof body.page !== "string") {
      return new NextResponse(null, { status: 204 });
    }

    const ua = request.headers.get("user-agent") || "";
    if (BOT_PATTERNS.test(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    const page = body.page.slice(0, 500);
    const referrer = request.headers.get("referer")?.slice(0, 500) || null;

    // Fire-and-forget insert
    prisma.pageVisit.create({ data: { page, referrer } }).catch(() => {});

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}

export async function GET() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalVisits, visitsToday, popularPagesRaw, dailyVisitsRaw] = await Promise.all([
    prisma.pageVisit.count(),
    prisma.pageVisit.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.$queryRawUnsafe<{ page: string; count: bigint }[]>(
      `SELECT page, COUNT(*) as count FROM PageVisit GROUP BY page ORDER BY count DESC LIMIT 10`
    ),
    prisma.$queryRawUnsafe<{ day: string; count: bigint }[]>(
      `SELECT strftime('%Y-%m-%d', createdAt) as day, COUNT(*) as count FROM PageVisit WHERE createdAt >= ? GROUP BY day ORDER BY day`,
      thirtyDaysAgo.toISOString()
    ),
  ]);

  return NextResponse.json({
    totalVisits,
    visitsToday,
    popularPages: popularPagesRaw.map((r) => ({ page: r.page, count: Number(r.count) })),
    dailyVisits: dailyVisitsRaw.map((r) => ({ day: r.day, count: Number(r.count) })),
  });
}
