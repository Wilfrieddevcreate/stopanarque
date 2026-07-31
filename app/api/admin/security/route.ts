import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { pruneExpiredBans } from "@/lib/security";

// ── GET /api/admin/security — dashboard data ──────────────────────────────────

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Lazy cleanup
  await pruneExpiredBans().catch(() => {});

  const since24h = new Date(Date.now() - 24 * 3600_000);
  const since7d  = new Date(Date.now() - 7 * 24 * 3600_000);

  const [events24h, bans, threatBreakdown, topAttackers] = await Promise.all([
    prisma.securityEvent.findMany({
      where:   { createdAt: { gte: since24h } },
      orderBy: { createdAt: "desc" },
      take:    100,
      select:  { id: true, ip: true, threatType: true, severity: true, path: true, detail: true, userAgent: true, createdAt: true },
    }),
    prisma.securityBan.findMany({
      orderBy: { bannedAt: "desc" },
      take:    50,
    }),
    prisma.securityEvent.groupBy({
      by:      ["threatType"],
      where:   { createdAt: { gte: since7d } },
      _count:  { threatType: true },
      orderBy: { _count: { threatType: "desc" } },
    }),
    prisma.securityEvent.groupBy({
      by:      ["ip"],
      where:   { createdAt: { gte: since7d } },
      _count:  { ip: true },
      orderBy: { _count: { ip: "desc" } },
      take:    10,
    }),
  ]);

  const total24h = events24h.length;
  const critical = events24h.filter((e) => e.severity === "critical").length;

  return NextResponse.json({
    summary: { total24h, critical, activeBans: bans.length },
    events:  events24h,
    bans,
    threatBreakdown: threatBreakdown.map((t) => ({
      type:  t.threatType,
      count: t._count.threatType,
    })),
    topAttackers: topAttackers.map((a) => ({
      ip:    a.ip,
      count: a._count.ip,
    })),
  });
}

// ── DELETE /api/admin/security?banId=xxx — remove a ban ───────────────────────

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const banId = request.nextUrl.searchParams.get("banId");
  if (!banId) return NextResponse.json({ error: "banId requis" }, { status: 400 });

  await prisma.securityBan.delete({ where: { id: banId } }).catch(() => {});
  return NextResponse.json({ success: true });
}
