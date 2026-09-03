import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/validation";

const BOT_PATTERNS = /bot|crawler|spider|slurp|wget|curl|python|java|php/i;

export async function POST(request: NextRequest) {
  // Rate-limit visit tracking to prevent analytics flooding
  const ip = clientIp(request);
  const { allowed } = await checkRateLimit(ip, "default");
  if (!allowed) return new NextResponse(null, { status: 204 });

  try {
    const body = await request.json().catch(() => null);
    if (!body?.page || typeof body.page !== "string") {
      return new NextResponse(null, { status: 204 });
    }

    const ua = request.headers.get("user-agent") ?? "";
    if (BOT_PATTERNS.test(ua)) return new NextResponse(null, { status: 204 });

    const page = body.page.slice(0, 200);
    const referrer = request.headers.get("referer")?.slice(0, 500) ?? null;

    prisma.pageVisit.create({ data: { page, referrer } }).catch(() => {});
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}

export async function GET() {
  // Analytics data is admin-only
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalVisits, visitsToday, popularPagesRaw, dailyVisitsRaw, durationRaw] = await Promise.all([
    prisma.pageVisit.count(),
    prisma.pageVisit.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.$queryRaw<{ page: string; count: bigint }[]>`
      SELECT page, COUNT(*) as count FROM PageVisit
      WHERE duration IS NULL
      GROUP BY page ORDER BY count DESC LIMIT 10
    `,
    prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT strftime('%Y-%m-%d', createdAt) as day, COUNT(*) as count
      FROM PageVisit WHERE createdAt >= ${thirtyDaysAgo.toISOString()}
      AND duration IS NULL
      GROUP BY day ORDER BY day
    `,
    prisma.$queryRaw<{ page: string; avgDuration: number; samples: bigint }[]>`
      SELECT page, AVG(duration) as avgDuration, COUNT(*) as samples
      FROM PageVisit WHERE duration IS NOT NULL
      GROUP BY page ORDER BY samples DESC LIMIT 10
    `,
  ]);

  const durationByPage = Object.fromEntries(
    durationRaw.map((r) => [r.page, { avg: Math.round(r.avgDuration), samples: Number(r.samples) }])
  );

  return NextResponse.json({
    totalVisits,
    visitsToday,
    popularPages: popularPagesRaw.map((r) => ({
      page: r.page,
      count: Number(r.count),
      avgDuration: durationByPage[r.page]?.avg ?? null,
      durationSamples: durationByPage[r.page]?.samples ?? 0,
    })),
    dailyVisits: dailyVisitsRaw.map((r) => ({ day: r.day, count: Number(r.count) })),
    topDurationPages: durationRaw.map((r) => ({
      page: r.page,
      avgDuration: Math.round(r.avgDuration),
      samples: Number(r.samples),
    })),
  });
}
