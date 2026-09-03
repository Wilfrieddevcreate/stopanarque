import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { allowedEnum, optStr, REPORT_STATUSES, ADMIN_ACTIONS } from "@/lib/validation";
import { decrypt } from "@/lib/crypto";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const cursor = request.nextUrl.searchParams.get("cursor");
  const all = request.nextUrl.searchParams.get("all");

  if (all === "stats") {
    // Return only the fields needed for stats, no phone numbers, paginated
    const reports = await prisma.report.findMany({
      select: { id: true, scamType: true, suspectPlatform: true, status: true },
      take: 5000,
    });
    return NextResponse.json({ stats: reports });
  }

  const reports = await prisma.report.findMany({
    take: PAGE_SIZE + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: {
      evidences: true,
      actions: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const hasMore = reports.length > PAGE_SIZE;
  const data = (hasMore ? reports.slice(0, PAGE_SIZE) : reports).map((r) => ({
    ...r,
    contactEmail: decrypt(r.contactEmail),
  }));
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return NextResponse.json({ reports: data, nextCursor });
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  let body: { reportId?: unknown; action?: unknown; comment?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { reportId, action: rawAction, comment: rawComment } = body;

  if (!reportId || typeof reportId !== "string") {
    return NextResponse.json({ error: "reportId requis" }, { status: 400 });
  }

  const action = allowedEnum(rawAction, ADMIN_ACTIONS);
  if (!action) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  const comment = optStr(rawComment, 1000);

  const existing = await prisma.report.findUnique({ where: { id: reportId }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Signalement introuvable" }, { status: 404 });

  const statusMap: Record<typeof action, (typeof REPORT_STATUSES)[number]> = {
    validate: "CONFIRME",
    reject: "REJETE",
    analyze: "EN_ANALYSE",
  };

  const [report] = await prisma.$transaction([
    prisma.report.update({
      where: { id: reportId },
      data: { status: statusMap[action] },
    }),
    prisma.adminAction.create({
      data: { action, comment, reportId, userId: user.id },
    }),
  ]);

  return NextResponse.json({ success: true, report });
}
