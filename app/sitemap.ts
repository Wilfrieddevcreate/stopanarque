import type { MetadataRoute } from "next";
import { getArticleSitemapEntries } from "@/lib/articles";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * Sitemap du site. Les pages `noindex` (/suivi, /offline, /admin) en sont
 * volontairement absentes : les y inclure enverrait un signal contradictoire.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/signaler`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/rechercher`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/arnaques`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/conseils`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/actualites`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const articles = await getArticleSitemapEntries();

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/actualites/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    // Sitemap images : permet l'indexation des visuels d'articles dans Google Images.
    ...(a.coverImage ? { images: [absoluteUrl(a.coverImage)] } : {}),
  }));

  return [...staticPages, ...articlePages];
}
