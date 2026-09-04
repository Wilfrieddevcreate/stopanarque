/**
 * ROUTE TEMPORAIRE — À supprimer après création du premier compte admin.
 * Ne fonctionne que si aucun utilisateur n'existe en base.
 */
import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function ensureTablesExist(): Promise<void> {
  try {
    await prisma.user.count();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("no such table")) {
      // Tables absentes → on les crée
      execSync("npx prisma db push --skip-generate --accept-data-loss", {
        stdio: "inherit",
        env: { ...process.env },
      });
    } else {
      throw e;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // Crée les tables si elles n'existent pas encore
    await ensureTablesExist();

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
