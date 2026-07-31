import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { buildSuspectProfile } from "@/lib/enrichment";
import { normalizePhone } from "@/lib/validation";

const RELATED_LIMIT = 50;
const NAME_LIMIT = 10;

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const rawPhone = request.nextUrl.searchParams.get("phone");
  const normalized = normalizePhone(rawPhone);
  if (!normalized) {
    return NextResponse.json({ error: "Numéro invalide" }, { status: 400 });
  }

  const reports = await prisma.report.findMany({
    where: { phoneNumber: normalized },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  if (reports.length === 0) return NextResponse.json({ profile: null });

  // Cap names/accounts to avoid generating oversized OR clauses
  const names = [...new Set(reports.map((r) => r.suspectName).filter(Boolean) as string[])].slice(0, NAME_LIMIT);
  const accounts = [...new Set(reports.map((r) => r.suspectAccount).filter(Boolean) as string[])].slice(0, NAME_LIMIT);

  let relatedReports: typeof reports = [];
  if (names.length > 0 || accounts.length > 0) {
    relatedReports = await prisma.report.findMany({
      where: {
        AND: [
          { phoneNumber: { not: normalized } },
          {
            OR: [
              ...names.map((n) => ({ suspectName: { contains: n } })),
              ...accounts.map((a) => ({ suspectAccount: { contains: a } })),
            ],
          },
        ],
      },
      take: RELATED_LIMIT,
    });
  }

  const profile = buildSuspectProfile(normalized, reports, relatedReports);
  return NextResponse.json({ profile });
}
