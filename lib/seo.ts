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

/**
 * Image sociale par défaut.
 *
 * Elle est produite par app/opengraph-image.tsx (généré à la volée en 1200×630)
 * et non par un fichier statique : l'ancien /og-image.png faisait 432×578 en
 * portrait alors que les balises annonçaient 1200×630, d'où des vignettes
 * recadrées ou floues sur WhatsApp, Facebook et LinkedIn.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
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

/**
 * Fabrique de métadonnées de page.
 *
 * Next fusionne les metadata de façon SUPERFICIELLE : un layout enfant qui
 * redéclare `openGraph` remplace intégralement celui du parent. Six pages
 * avaient ainsi perdu leur `og:image` en redéclarant `openGraph` sans `images`.
 * Passer par cette fabrique garantit que chaque page émet des blocs openGraph et
 * twitter complets — le piège ne peut plus se reproduire sur une page ajoutée.
 */
export function pageMetadata(options: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  ogTitle?: string;
  ogDescription?: string;
  robots?: { index: boolean; follow: boolean };
}) {
  const {
    title,
    description,
    path,
    keywords,
    type = "website",
    ogTitle = `${title} | ${SITE_NAME}`,
    ogDescription = description,
    robots,
  } = options;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    openGraph: {
      type,
      title: ogTitle,
      description: ogDescription,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: [{ ...DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: ogTitle,
      description: ogDescription,
      images: [DEFAULT_OG_IMAGE.url],
    },
    alternates: { canonical: path },
  };
}
