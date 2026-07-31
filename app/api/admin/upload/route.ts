import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { getSession } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, verifyMagicBytes, safeFilename } from "@/lib/validation";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

  const declaredType = file.type.toLowerCase();
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(declaredType)) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG, WebP ou GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop lourd (max 5 Mo)." }, { status: 400 });
  }

  // Verify actual file content matches declared type (anti-spoofing)
  const magicOk = await verifyMagicBytes(file, declaredType);
  if (!magicOk) {
    return NextResponse.json(
      { error: "Fichier corrompu ou type déclaré incorrect." },
      { status: 400 }
    );
  }

  const filename = safeFilename(file.name);
  const uploadDir = path.join(process.cwd(), "public", "uploads", "articles");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/articles/${filename}` });
}
