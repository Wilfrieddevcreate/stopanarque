import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { getSession } from "@/lib/auth";
import path from "path";

// Maps file extensions to safe content types
const SAFE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  pdf: "application/pdf",
};

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const rawPath = request.nextUrl.searchParams.get("path");
  if (!rawPath) {
    return NextResponse.json({ error: "Chemin requis" }, { status: 400 });
  }

  // Strict path validation — only allow reportId/filename pattern
  // reportId: cuid format (alphanumeric), filename: safe chars only
  const pathPattern = /^[a-z0-9]+\/[a-zA-Z0-9._-]+$/;
  if (!pathPattern.test(rawPath)) {
    return NextResponse.json({ error: "Chemin invalide" }, { status: 400 });
  }

  const ext = rawPath.split(".").pop()?.toLowerCase() ?? "";
  const contentType = SAFE_TYPES[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Type de fichier non autorisé" }, { status: 400 });
  }

  // Resolve and verify the path stays within the uploads/reports directory
  const uploadsBase = path.resolve(process.cwd(), "uploads", "reports");
  const filePath = path.resolve(uploadsBase, rawPath);

  if (!filePath.startsWith(uploadsBase + path.sep)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        // Force download — never execute/render inline
        "Content-Disposition": `attachment; filename="${path.basename(filePath)}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
}
