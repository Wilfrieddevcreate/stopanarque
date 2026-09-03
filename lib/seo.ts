/**
 * Socle SEO centralisé : URL du site, identité de l'organisation et helpers
 * utilisés par les métadonnées, le JSON-LD, le sitemap et robots.txt.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://stopanarque.bj").replace(/\/$/, "");
export const SITE_NAME = "StopArnaque Bénin";
export const SITE_SHORT_NAME = "StopArnaque";
export const SITE_LOCALE = "fr_BJ";
export const SITE_LANG = "fr-BJ";

export const CONTACT_EMAIL = "contact@stopanarque.bj";

/** Réseaux sociaux officiels — alimente `sameAs` du JSON-LD Organization. */
export const SOCIAL_PROFILES: string[] = [];

export const DEFAULT_OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "StopArnaque Bénin — Plateforme de signalement d'arnaques",
} as const;

/** Transforme un chemin relatif en URL absolue (requis par OpenGraph et JSON-LD). */
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Coupe une description à la limite utile des SERP (~160 caractères) sans
 * casser un mot en deux ni laisser de ponctuation orpheline.
 */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–-]+$/, "")}…`;
}

/** Fil d'Ariane : construit les items JSON-LD à partir de couples nom/chemin. */
export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
