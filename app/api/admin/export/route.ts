import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { allowedEnum, csvCell, REPORT_STATUSES, SCAM_TYPES as SCAM_TYPES_ALL } from "@/lib/validation";

const EXPORT_LIMIT = 10_000;

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const rawFormat = request.nextUrl.searchParams.get("format");
  const format = rawFormat === "json" ? "json" : "csv";

  const rawStatus = request.nextUrl.searchParams.get("status");
  const status = allowedEnum(rawStatus, REPORT_STATUSES) ?? null;

  const rawType = request.nextUrl.searchParams.get("type");
  const scamType = allowedEnum(rawType, SCAM_TYPES_ALL) ?? null;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (scamType) where.scamType = scamType;

  const reports = await prisma.report.findMany({
    where,
    include: { evidences: true },
    orderBy: { createdAt: "desc" },
    take: EXPORT_LIMIT,
  });

  if (format === "csv") {
    const header = "Code suivi,Numéro,Nom suspect,Plateforme,Compte,Type arnaque,Montant perdu,Statut,Date,Description,Preuves\n";
    const rows = reports.map((r) => {
      const cols = [
        csvCell(r.trackingCode),
        csvCell(r.phoneNumber ?? ""),
        csvCell(r.suspectName ?? ""),
        csvCell(r.suspectPlatform ?? ""),
        csvCell(r.suspectAccount ?? ""),
        csvCell(r.scamType),
        csvCell(r.amountLost ?? ""),
        csvCell(r.status),
        csvCell(new Date(r.createdAt).toLocaleString("fr-FR")),
        csvCell(r.description),
        csvCell(r.evidences.map((e) => e.fileName).join("; ")),
      ];
      return cols.join(",");
    });

    const csv = header + rows.join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="signalements-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ reports, total: reports.length });
}
