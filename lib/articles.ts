import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Accès serveur aux articles publiés.
 *
 * `cache()` mémoïse l'appel pour la durée d'une requête : le layout, la page et
 * `generateMetadata` d'un même article partagent une seule requête SQL.
 * Toutes les fonctions filtrent sur `published` — un brouillon ne doit jamais
 * fuiter dans les métadonnées, le JSON-LD ou le sitemap.
 */

export const ARTICLE_LIST_FIELDS = {
  id: true, slug: true,
  title: true, titleEn: true, titleFon: true, titleYo: true,
  excerpt: true, excerptEn: true, excerptFon: true, excerptYo: true,
  coverImage: true, category: true, createdAt: true, updatedAt: true,
  author: { select: { name: true } },
} as const;

export const getArticleBySlug = cache(async (slug: string) => {
  if (!/^[a-z0-9-]{1,200}$/i.test(slug)) return null;
  try {
    return await prisma.article.findFirst({
      where: { slug, published: true },
      include: { author: { select: { name: true } } },
    });
  } catch {
    return null;
  }
});

export const getPublishedArticles = cache(async (limit = 50) => {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: ARTICLE_LIST_FIELDS,
    });
  } catch {
    // Base indisponible au build : la page se rend sans articles.
    return [];
  }
});

export const getArticleSitemapEntries = cache(async () => {
  try {
    return await prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, coverImage: true, title: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return [];
  }
});

export type ArticleListItem = Awaited<ReturnType<typeof getPublishedArticles>>[number];
export type ArticleDetail = NonNullable<Awaited<ReturnType<typeof getArticleBySlug>>>;
