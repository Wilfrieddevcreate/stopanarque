import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

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

  const body = await req.json();
  const {
    title, titleEn, titleFon, titleYo,
    excerpt, excerptEn, excerptFon, excerptYo,
    content, contentEn, contentFon, contentYo,
    category, published,
  } = body;

  if (!str(title) || !str(excerpt) || !str(content)) {
    return NextResponse.json({ error: "Titre, résumé et contenu (FR) sont requis." }, { status: 400 });
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let i = 1;
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const article = await prisma.article.create({
    data: {
      slug,
      title: str(title),
      titleEn: str(titleEn),
      titleFon: str(titleFon),
      titleYo: str(titleYo),
      excerpt: str(excerpt),
      excerptEn: str(excerptEn),
      excerptFon: str(excerptFon),
      excerptYo: str(excerptYo),
      content: str(content),
      contentEn: str(contentEn),
      contentFon: str(contentFon),
      contentYo: str(contentYo),
      coverImage: str(body.coverImage),
      category: str(category) || "Alerte",
      published: !!published,
      authorId: user.id,
    },
  });

  return NextResponse.json({ article }, { status: 201 });
}

export async function PATCH(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const data: Record<string, unknown> = {};
  const textFields = [
    "title", "titleEn", "titleFon", "titleYo",
    "excerpt", "excerptEn", "excerptFon", "excerptYo",
    "content", "contentEn", "contentFon", "contentYo",
    "coverImage", "category",
  ];
  for (const key of textFields) {
    if (fields[key] !== undefined) data[key] = str(fields[key]);
  }
  if (fields.published !== undefined) data.published = fields.published;

  const article = await prisma.article.update({ where: { id }, data });
  return NextResponse.json({ article });
}

export async function DELETE(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
