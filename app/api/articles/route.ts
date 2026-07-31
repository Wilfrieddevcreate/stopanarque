import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { allowedEnum, CATEGORIES } from "@/lib/validation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    // Validate slug: only alphanumeric + hyphens
    if (!/^[a-z0-9-]{1,200}$/i.test(slug)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const article = await prisma.article.findFirst({
      where: { slug, published: true },
      include: { author: { select: { name: true } } },
    });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ article });
  }

  const rawCategory = searchParams.get("category");
  const category = allowedEnum(rawCategory, CATEGORIES) ?? null;

  const rawLimit = searchParams.get("limit");
  const limit = Math.min(Math.max(parseInt(rawLimit ?? "50", 10) || 50, 1), 50);

  const articles = await prisma.article.findMany({
    where: { published: true, ...(category ? { category } : {}) },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true, slug: true,
      title: true, titleEn: true, titleFon: true, titleYo: true,
      excerpt: true, excerptEn: true, excerptFon: true, excerptYo: true,
      coverImage: true, category: true, createdAt: true,
      author: { select: { name: true } },
    },
  });

  return NextResponse.json({ articles });
}

// Reject any non-GET method on the public articles endpoint
export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
