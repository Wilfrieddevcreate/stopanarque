import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { buildSuspectProfile } from "@/lib/enrichment";

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const phone = request.nextUrl.searchParams.get("phone");
  if (!phone) {
    return NextResponse.json({ error: "Numéro requis" }, { status: 400 });
  }

  const normalized = phone.replace(/[\s+\-()]/g, "");

  // Tous les signalements pour ce numéro
  const reports = await prisma.report.findMany({
    where: { phoneNumber: normalized },
    orderBy: { createdAt: "desc" },
  });

  if (reports.length === 0) {
    return NextResponse.json({ profile: null });
  }

  // Signalements liés : même nom suspect ou même compte
  const names = reports.map((r) => r.suspectName).filter(Boolean) as string[];
  const accounts = reports.map((r) => r.suspectAccount).filter(Boolean) as string[];

  let relatedReports: typeof reports = [];
  if (names.length > 0 || accounts.length > 0) {
    relatedReports = await prisma.report.findMany({
      where: {
        AND: [
          { phoneNumber: { not: normalized } },
          {
            OR: [
              ...(names.length > 0 ? names.map((n) => ({ suspectName: { contains: n } })) : []),
              ...(accounts.length > 0 ? accounts.map((a) => ({ suspectAccount: { contains: a } })) : []),
            ],
          },
        ],
      },
    });
  }

  const profile = buildSuspectProfile(normalized, reports, relatedReports);

  return NextResponse.json({ profile });
}
