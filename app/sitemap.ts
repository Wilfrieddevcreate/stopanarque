import type { MetadataRoute } from "next";
import { getArticleSitemapEntries } from "@/lib/articles";
import { getScamData } from "@/lib/i18n/arnaques-data";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * Sitemap du site. Les pages `noindex` (/suivi, /offline, /admin) en sont
 * volontairement absentes : les y inclure enverrait un signal contradictoire.
 */
/**
 * Régénération incrémentale : sans cela, la page est figée au build et un
 * article publié après le déploiement reste invisible jusqu'au prochain build.
 */
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pas de `lastModified` sur les pages statiques : y mettre l'heure du build
  // annonce à chaque déploiement que les 9 pages ont changé, ce qui décrédibilise
  // le signal. Seuls les articles portent une vraie date de modification.
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/signaler`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/rechercher`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/arnaques`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/conseils`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/actualites`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/politique-confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const scamPages: MetadataRoute.Sitemap = getScamData("fr").map((scam) => ({
    url: `${SITE_URL}/arnaques/${scam.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const articles = await getArticleSitemapEntries();

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/actualites/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    // Sitemap images : permet l'indexation des visuels d'articles dans Google Images.
    ...(a.coverImage ? { images: [absoluteUrl(a.coverImage)] } : {}),
  }));

  return [...staticPages, ...scamPages, ...articlePages];
}
