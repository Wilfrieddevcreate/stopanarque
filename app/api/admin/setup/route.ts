/**
 * ROUTE TEMPORAIRE — À supprimer après création du premier compte admin.
 * Ne fonctionne que si aucun utilisateur n'existe en base.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
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
}
