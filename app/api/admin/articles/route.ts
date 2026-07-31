import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { str, optStr, allowedEnum, CATEGORIES } from "@/lib/validation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const user = await getSession();
  if (!user) return null;
  return user;
}

const T = (v: unknown) => str(v, 300);
const EXCERPT_MAX = 500;
const CONTENT_MAX = 100_000;

function sanitizeCoverImage(raw: unknown): string {
  const s = str(raw, 500);
  if (!s) return "";
  // Only allow relative paths starting with /uploads/ or /images/
  if (s.startsWith("/uploads/") || s.startsWith("/images/")) return s;
  return "";
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return NextResponse.json({ articles });
}

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const title = T(body.title);
  const excerpt = str(body.excerpt, EXCERPT_MAX);
  const content = str(body.content, CONTENT_MAX);

  if (!title || !excerpt || !content) {
    return NextResponse.json(
      { error: "Titre, résumé et contenu (FR) sont requis." },
      { status: 400 }
    );
  }

  const category = allowedEnum(body.category, CATEGORIES) ?? "Alerte";

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let i = 1;
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const article = await prisma.article.create({
    data: {
      slug,
      title,
      titleEn: T(body.titleEn),
      titleFon: T(body.titleFon),
      titleYo: T(body.titleYo),
      excerpt,
      excerptEn: str(body.excerptEn, EXCERPT_MAX),
      excerptFon: str(body.excerptFon, EXCERPT_MAX),
      excerptYo: str(body.excerptYo, EXCERPT_MAX),
      content,
      contentEn: str(body.contentEn, CONTENT_MAX),
      contentFon: str(body.contentFon, CONTENT_MAX),
      contentYo: str(body.contentYo, CONTENT_MAX),
      coverImage: sanitizeCoverImage(body.coverImage),
      category,
      published: body.published === true,
      authorId: user.id,
    },
  });

  return NextResponse.json({ article }, { status: 201 });
}

export async function PATCH(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { id, ...fields } = body;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  // Verify article exists before updating
  const existing = await prisma.article.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Article introuvable" }, { status: 404 });

  const data: Record<string, unknown> = {};

  const textFields: [string, number][] = [
    ["title", 300], ["titleEn", 300], ["titleFon", 300], ["titleYo", 300],
    ["excerpt", EXCERPT_MAX], ["excerptEn", EXCERPT_MAX], ["excerptFon", EXCERPT_MAX], ["excerptYo", EXCERPT_MAX],
    ["content", CONTENT_MAX], ["contentEn", CONTENT_MAX], ["contentFon", CONTENT_MAX], ["contentYo", CONTENT_MAX],
  ];
  for (const [key, max] of textFields) {
    if (fields[key] !== undefined) data[key] = str(fields[key], max);
  }

  if (fields.category !== undefined) {
    const cat = allowedEnum(fields.category, CATEGORIES);
    if (cat) data.category = cat;
  }
  if (fields.coverImage !== undefined) {
    data.coverImage = sanitizeCoverImage(fields.coverImage);
  }
  if (fields.published !== undefined) {
    data.published = fields.published === true;
  }

  const article = await prisma.article.update({ where: { id }, data });
  return NextResponse.json({ article });
}

export async function DELETE(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const existing = await prisma.article.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Article introuvable" }, { status: 404 });

  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
