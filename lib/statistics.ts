import { prisma } from "./prisma";

function anonymizePhone(phone: string): string {
  if (phone.length <= 6) return phone.slice(0, 2) + " ** **";
  return phone.slice(0, 4) + " ** " + phone.slice(-2);
}

function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export async function getStatistics() {
  const [
    totalReports,
    confirmedReports,
    thisMonthReports,
    monthlyRaw,
    scamTypeGroups,
    platformGroups,
    phoneGroups,
  ] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: "CONFIRME" } }),
    prisma.report.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.$queryRawUnsafe<{ month: string; count: number }[]>(
      `SELECT strftime('%Y-%m', createdAt) as month, COUNT(*) as count FROM Report WHERE createdAt >= date('now', '-12 months') GROUP BY month ORDER BY month`
    ),
    prisma.report.groupBy({
      by: ["scamType"],
      _count: { scamType: true },
      orderBy: { _count: { scamType: "desc" } },
      take: 8,
    }),
    prisma.report.groupBy({
      by: ["suspectPlatform"],
      _count: { suspectPlatform: true },
      where: { suspectPlatform: { not: null } },
      orderBy: { _count: { suspectPlatform: "desc" } },
      take: 8,
    }),
    prisma.report.groupBy({
      by: ["phoneNumber"],
      _count: { phoneNumber: true },
      orderBy: { _count: { phoneNumber: "desc" } },
      take: 10,
    }),
  ]);

  const reportsPerMonth = (monthlyRaw as { month: string; count: number | bigint }[]).map((r) => ({
    month: r.month,
    count: Number(r.count),
  }));

  const topScamTypes = scamTypeGroups.map((g) => ({
    type: g.scamType,
    count: g._count.scamType,
  }));

  const topPlatforms = platformGroups.map((g) => ({
    platform: g.suspectPlatform!,
    count: g._count.suspectPlatform,
  }));

  const topNumbers = phoneGroups.map((g) => ({
    phoneNumber: g.phoneNumber ? anonymizePhone(g.phoneNumber) : null,
    count: g._count.phoneNumber,
  }));

  const totalSearches = await prisma.pageVisit.count({
    where: { page: { startsWith: "/rechercher" } },
  });

  return {
    totalReports,
    confirmedReports,
    thisMonthReports,
    totalSearches,
    reportsPerMonth,
    topScamTypes,
    topPlatforms,
    topNumbers,
  };
}

export async function getRecentAlerts() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [confirmedReports, recentReports, weeklyCount, latestArticle] = await Promise.all([
    // Confirmed arnaques (last 3)
    prisma.report.findMany({
      where: { status: "CONFIRME" },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, scamType: true, suspectPlatform: true, updatedAt: true },
    }),
    // Any recent report (last 2, pending or confirmed)
    prisma.report.findMany({
      where: { status: { in: ["EN_ATTENTE", "CONFIRME"] } },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { id: true, scamType: true, suspectPlatform: true, createdAt: true },
    }),
    // Count of reports this week
    prisma.report.count({ where: { createdAt: { gte: weekAgo } } }),
    // Latest published article
    prisma.article.findFirst({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, createdAt: true },
    }),
  ]);

  const items: BannerItem[] = [];

  // Type 1 — confirmed arnaques
  for (const r of confirmedReports) {
    items.push({
      id: `confirmed-${r.id}`,
      kind: "confirmed",
      scamType: r.scamType,
      platform: r.suspectPlatform ?? null,
      timeAgo: timeAgo(r.updatedAt),
      createdAt: r.updatedAt.toISOString(),
    });
  }

  // Type 2 — weekly stats (always present if data exists)
  if (weeklyCount > 0) {
    items.push({
      id: "weekly-stats",
      kind: "stats",
      weeklyCount,
      createdAt: new Date().toISOString(),
    });
  }

  // Type 3 — recent pending reports (deduplicated vs confirmed)
  const confirmedIds = new Set(confirmedReports.map((r) => r.id));
  for (const r of recentReports) {
    if (confirmedIds.has(r.id)) continue;
    items.push({
      id: `recent-${r.id}`,
      kind: "recent",
      scamType: r.scamType,
      platform: r.suspectPlatform ?? null,
      timeAgo: timeAgo(r.createdAt),
      createdAt: r.createdAt.toISOString(),
    });
  }

  // Type 4 — latest article
  if (latestArticle) {
    items.push({
      id: `article-${latestArticle.id}`,
      kind: "article",
      title: latestArticle.title,
      slug: latestArticle.slug,
      timeAgo: timeAgo(latestArticle.createdAt),
      createdAt: latestArticle.createdAt.toISOString(),
    });
  }

  // Sort by recency so the freshest item appears first
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return items;
}

export type BannerItem =
  | { id: string; kind: "confirmed"; scamType: string; platform: string | null; timeAgo: string; createdAt: string }
  | { id: string; kind: "stats"; weeklyCount: number; createdAt: string }
  | { id: string; kind: "recent"; scamType: string; platform: string | null; timeAgo: string; createdAt: string }
  | { id: string; kind: "article"; title: string; slug: string; timeAgo: string; createdAt: string };
