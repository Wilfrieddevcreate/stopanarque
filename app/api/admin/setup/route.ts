/**
 * ROUTE TEMPORAIRE — À supprimer après création du premier compte admin.
 * Ne fonctionne que si aucun utilisateur n'existe en base.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const INIT_SQL = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "totpSecret" TEXT,
    "mfaEnabled" INTEGER NOT NULL DEFAULT 0,
    "mfaBackupCodes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackingCode" TEXT NOT NULL UNIQUE,
    "phoneNumber" TEXT,
    "suspectName" TEXT,
    "suspectPlatform" TEXT,
    "suspectAccount" TEXT,
    "suspectUrl" TEXT,
    "description" TEXT NOT NULL,
    "scamType" TEXT NOT NULL,
    "amountLost" TEXT,
    "incidentDate" TEXT,
    "contactEmail" TEXT,
    "isAttemptOnly" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "duplicateOf" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "Evidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "AdminAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "comment" TEXT,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User" ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "RateLimit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL DEFAULT 1,
    "resetAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId")`,
  `CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx" ON "Session"("expiresAt")`,
  `CREATE TABLE IF NOT EXISTS "SecurityEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL,
    "threatType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "path" TEXT NOT NULL,
    "detail" TEXT NOT NULL DEFAULT '',
    "userAgent" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "SecurityEvent_ip_idx" ON "SecurityEvent"("ip")`,
  `CREATE INDEX IF NOT EXISTS "SecurityEvent_createdAt_idx" ON "SecurityEvent"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "SecurityEvent_threatType_idx" ON "SecurityEvent"("threatType")`,
  `CREATE TABLE IF NOT EXISTS "SecurityBan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ip" TEXT NOT NULL UNIQUE,
    "reason" TEXT NOT NULL,
    "bannedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "autoban" INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE INDEX IF NOT EXISTS "SecurityBan_expiresAt_idx" ON "SecurityBan"("expiresAt")`,
  `CREATE TABLE IF NOT EXISTS "PageVisit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "referrer" TEXT,
    "duration" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "PageVisit_createdAt_idx" ON "PageVisit"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "PageVisit_page_idx" ON "PageVisit"("page")`,
  `CREATE TABLE IF NOT EXISTS "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "titleFon" TEXT NOT NULL DEFAULT '',
    "titleYo" TEXT NOT NULL DEFAULT '',
    "excerpt" TEXT NOT NULL,
    "excerptEn" TEXT NOT NULL DEFAULT '',
    "excerptFon" TEXT NOT NULL DEFAULT '',
    "excerptYo" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL DEFAULT '',
    "contentFon" TEXT NOT NULL DEFAULT '',
    "contentYo" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'Alerte',
    "published" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("authorId") REFERENCES "User" ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "Article_published_createdAt_idx" ON "Article"("published","createdAt")`,
];

export async function POST(req: NextRequest) {
  try {
    // Initialise la base si les tables n'existent pas encore
    for (const sql of INIT_SQL) {
      await prisma.$executeRawUnsafe(sql);
    }

    // Vérifie qu'aucun admin n'existe déjà — sécurité absolue
    const existing = await prisma.user.count();
    if (existing > 0) {
      return NextResponse.json(
        { error: "Un compte admin existe déjà. Cette route est désactivée." },
        { status: 403 }
      );
    }

    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit faire au moins 8 caractères." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email: email.trim(), password: hashed, name: name.trim(), role: "ADMIN" },
    });

    return NextResponse.json({ ok: true, email: user.email, name: user.name });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[setup] Erreur:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
