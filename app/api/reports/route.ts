import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { generateTrackingCode } from "@/lib/tracking";
import { checkRateLimit } from "@/lib/rate-limit";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const { allowed, remaining } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Trop de signalements. Réessayez dans une minute." },
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
      );
    }

    const formData = await request.formData();
    const phoneNumber = formData.get("phoneNumber") as string;
    const scamType = formData.get("scamType") as string;
    const description = (formData.get("description") as string) || "Aucune description";
    const suspectName = (formData.get("suspectName") as string) || null;
    const suspectPlatform = (formData.get("suspectPlatform") as string) || null;
    const suspectAccount = (formData.get("suspectAccount") as string) || null;
    const amountLost = (formData.get("amountLost") as string) || null;

    if (!phoneNumber || !scamType) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const normalizedPhone = phoneNumber.replace(/\s/g, "");
    const trackingCode = generateTrackingCode();

    // Déduplication : chercher un signalement existant avec le même numéro
    const existing = await prisma.report.findFirst({
      where: { phoneNumber: normalizedPhone },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    const report = await prisma.report.create({
      data: {
        trackingCode,
        phoneNumber: normalizedPhone,
        scamType,
        description,
        suspectName,
        suspectPlatform,
        suspectAccount,
        amountLost,
        duplicateOf: existing?.id || null,
      },
    });

    const files = formData.getAll("files") as File[];
    if (files.length > 0 && files[0].size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", report.id);
      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = path.join(uploadDir, safeName);
        await writeFile(filePath, buffer);

        await prisma.evidence.create({
          data: {
            fileName: file.name,
            filePath: `/uploads/${report.id}/${safeName}`,
            fileType: file.type,
            reportId: report.id,
          },
        });
      }
    }

    return NextResponse.json(
      { success: true, id: report.id, trackingCode },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
