import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const format = request.nextUrl.searchParams.get("format") || "csv";
  const status = request.nextUrl.searchParams.get("status");
  const type = request.nextUrl.searchParams.get("type");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (type) where.scamType = type;

  const reports = await prisma.report.findMany({
    where,
    include: { evidences: true },
    orderBy: { createdAt: "desc" },
  });

  if (format === "csv") {
    const header = "Code suivi,Numéro,Nom suspect,Plateforme,Compte,Type arnaque,Montant perdu,Statut,Date,Description,Preuves\n";
    const rows = reports.map((r) => {
      const cols = [
        r.trackingCode,
        r.phoneNumber,
        r.suspectName || "",
        r.suspectPlatform || "",
        r.suspectAccount || "",
        r.scamType,
        r.amountLost || "",
        r.status,
        new Date(r.createdAt).toLocaleString("fr-FR"),
        `"${r.description.replace(/"/g, '""')}"`,
        r.evidences.map((e) => e.fileName).join("; "),
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

  // JSON fallback
  return NextResponse.json({ reports });
}
