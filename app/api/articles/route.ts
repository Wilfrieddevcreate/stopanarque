import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const slug = searchParams.get("slug");

  if (slug) {
    const article = await prisma.article.findFirst({
      where: { slug, published: true },
      include: { author: { select: { name: true } } },
    });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ article });
  }

  const articles = await prisma.article.findMany({
    where: { published: true, ...(category ? { category } : {}) },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      titleEn: true,
      titleFon: true,
      titleYo: true,
      excerpt: true,
      excerptEn: true,
      excerptFon: true,
      excerptYo: true,
      coverImage: true,
      category: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });

  return NextResponse.json({ articles });
}
