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
    phoneNumber: anonymizePhone(g.phoneNumber),
    count: g._count.phoneNumber,
  }));

  return {
    totalReports,
    confirmedReports,
    thisMonthReports,
    reportsPerMonth,
    topScamTypes,
    topPlatforms,
    topNumbers,
  };
}

export async function getRecentAlerts() {
  const reports = await prisma.report.findMany({
    where: { status: "CONFIRME" },
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: {
      id: true,
      scamType: true,
      suspectPlatform: true,
      updatedAt: true,
    },
  });

  return reports.map((r) => ({
    id: r.id,
    scamType: r.scamType,
    platform: r.suspectPlatform,
    timeAgo: timeAgo(r.updatedAt),
    createdAt: r.updatedAt.toISOString(),
  }));
}
