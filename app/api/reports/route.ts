import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { generateTrackingCode } from "@/lib/tracking";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  clientIp, normalizePhone, allowedEnum, optStr,
  SCAM_TYPES, PLATFORMS, ALLOWED_EVIDENCE_TYPES,
  verifyMagicBytes, safeFilename,
} from "@/lib/validation";
import { checkBan } from "@/lib/security";
import path from "path";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_DESCRIPTION = 2000;
const MAX_FIELD = 200;

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  if (await checkBan(ip)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { allowed, remaining } = await checkRateLimit(ip, "report");
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de signalements. Réessayez dans une minute." },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  // ── Validate required fields ────────────────────────────────────────────────
  const scamType = allowedEnum(formData.get("scamType"), SCAM_TYPES);
  if (!scamType) {
    return NextResponse.json({ error: "Type d'arnaque invalide." }, { status: 400 });
  }

  // Phone optional — required only for phone-based scams
  const phoneNumber = normalizePhone(formData.get("phoneNumber"));

  // URL suspect (phishing, faux site, faux vendeur…)
  const rawUrl = optStr(formData.get("suspectUrl"), 500);
  const suspectUrl = rawUrl && /^https?:\/\/.{3,}/.test(rawUrl) ? rawUrl : null;

  // At least one identifier must be provided
  const suspectName = optStr(formData.get("suspectName"), MAX_FIELD);
  const suspectAccount = optStr(formData.get("suspectAccount"), MAX_FIELD);
  if (!phoneNumber && !suspectUrl && !suspectName && !suspectAccount) {
    return NextResponse.json(
      { error: "Fournissez au moins un identifiant : numéro, URL, nom ou compte suspect." },
      { status: 400 }
    );
  }

  const description = optStr(formData.get("description"), MAX_DESCRIPTION) ?? "Aucune description";
  const suspectPlatform = allowedEnum(formData.get("suspectPlatform"), PLATFORMS) ?? null;

  // amountLost: must be a non-negative number string if provided
  const rawAmount = optStr(formData.get("amountLost"), 20);
  const amountLost =
    rawAmount && /^\d+([.,]\d{1,2})?$/.test(rawAmount.replace(/\s/g, ""))
      ? rawAmount
      : null;

  // New optional fields
  const rawDate = optStr(formData.get("incidentDate"), 20);
  const incidentDate = rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : null;

  const rawEmail = optStr(formData.get("contactEmail"), 200);
  const contactEmail = rawEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : null;

  const isAttemptOnly = formData.get("isAttemptOnly") === "true";

  // ── Validate uploaded evidence files ────────────────────────────────────────
  const files = formData.getAll("files") as File[];
  const validFiles = files.filter((f) => f instanceof File && f.size > 0);

  if (validFiles.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_FILES} fichiers par signalement.` },
      { status: 400 }
    );
  }

  for (const file of validFiles) {
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Chaque fichier doit faire moins de 5 Mo." },
        { status: 400 }
      );
    }
    const declaredType = file.type.toLowerCase();
    if (!(ALLOWED_EVIDENCE_TYPES as readonly string[]).includes(declaredType)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPG, PNG, WebP, GIF ou PDF." },
        { status: 400 }
      );
    }
    const magicOk = await verifyMagicBytes(file, declaredType);
    if (!magicOk) {
      return NextResponse.json(
        { error: "Fichier corrompu ou type déclaré incorrect." },
        { status: 400 }
      );
    }
  }

  // ── Persist ─────────────────────────────────────────────────────────────────
  const trackingCode = generateTrackingCode();

  const existing = phoneNumber ? await prisma.report.findFirst({
    where: { phoneNumber },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  }) : null;

  const report = await prisma.report.create({
    data: {
      trackingCode,
      phoneNumber: phoneNumber ?? null,
      scamType,
      description,
      suspectName,
      suspectPlatform,
      suspectAccount,
      suspectUrl,
      amountLost,
      incidentDate,
      contactEmail,
      isAttemptOnly,
      duplicateOf: existing?.id ?? null,
    },
  });

  for (const file of validFiles) {
    const filename = safeFilename(file.name);
    // Store OUTSIDE public/ — served only via authenticated /api/admin/files route
    const uploadDir = path.join(process.cwd(), "uploads", "reports", report.id);
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    await prisma.evidence.create({
      data: {
        fileName: filename,
        filePath: `${report.id}/${filename}`,
        fileType: file.type,
        reportId: report.id,
      },
    });
  }

  return NextResponse.json(
    { success: true, trackingCode },
    { headers: { "X-RateLimit-Remaining": String(remaining) } }
  );
}
