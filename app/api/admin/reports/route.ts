import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const cursor = request.nextUrl.searchParams.get("cursor");
  const all = request.nextUrl.searchParams.get("all");

  // Mode "all" pour charger les stats/fréquences (léger, sans include)
  if (all === "stats") {
    const reports = await prisma.report.findMany({
      select: { id: true, phoneNumber: true, scamType: true, suspectPlatform: true, status: true },
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
  const data = hasMore ? reports.slice(0, PAGE_SIZE) : reports;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return NextResponse.json({ reports: data, nextCursor });
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { reportId, action, comment } = await request.json();
    if (!reportId || !action) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const statusMap: Record<string, string> = {
      validate: "CONFIRME",
      reject: "REJETE",
      analyze: "EN_ANALYSE",
    };

    const newStatus = statusMap[action];
    if (!newStatus) {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    const [report] = await prisma.$transaction([
      prisma.report.update({
        where: { id: reportId },
        data: { status: newStatus },
      }),
      prisma.adminAction.create({
        data: {
          action,
          comment: comment || null,
          reportId,
          userId: user.id,
        },
      }),
    ]);

    return NextResponse.json({ success: true, report });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
