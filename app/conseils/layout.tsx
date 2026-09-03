import type { Metadata } from "next";
import { ADVICE_SECTIONS, getAdviceTranslation } from "@/lib/i18n/advice";
import { SITE_NAME, SITE_LANG, SITE_LOCALE, absoluteUrl, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Conseils anti-arnaque au Bénin",
  description:
    "Guide pratique pour se protéger des arnaques au Bénin : les réflexes à adopter, les signaux d'alerte à repérer et la marche à suivre si vous êtes victime.",
  keywords: [
    "conseils anti-arnaque Bénin",
    "se protéger des arnaques",
    "que faire victime arnaque Bénin",
    "reconnaître une arnaque",
    "numéro OCRC Bénin",
    "prévention cybercriminalité Bénin",
    "sécurité Mobile Money",
  ],
  openGraph: {
    type: "article",
    title: `Conseils anti-arnaque : prévenir, reconnaître, réagir | ${SITE_NAME}`,
    description: "Guide complet anti-arnaques au Bénin : prévenir, reconnaître, réagir.",
    url: absoluteUrl("/conseils"),
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: `Conseils anti-arnaque | ${SITE_NAME}`,
    description: "Guide complet anti-arnaques au Bénin : prévenir, reconnaître, réagir.",
  },
  alternates: { canonical: "/conseils" },
};

/**
 * L'interface n'affiche qu'un onglet à la fois : ce JSON-LD expose les trois
 * sections d'un coup, pour que l'intégralité des conseils soit indexable.
 */
const jsonLdGuide = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Conseils anti-arnaque au Bénin : prévenir, reconnaître, réagir",
  description:
    "Guide pratique pour se protéger des arnaques au Bénin : réflexes de prévention, signaux d'alerte et démarches en cas de fraude.",
  url: absoluteUrl("/conseils"),
  inLanguage: SITE_LANG,
  isAccessibleForFree: true,
  author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-512.png") },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl("/conseils") },
  hasPart: Object.entries(ADVICE_SECTIONS).map(([id, section]) => ({
    "@type": "ItemList",
    name: getAdviceTranslation(section.titleKey, "fr"),
    description: getAdviceTranslation(section.subtitleKey, "fr"),
    url: absoluteUrl(`/conseils#${id}`),
    numberOfItems: section.cards.length,
    itemListElement: section.cards.map((card, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: getAdviceTranslation(card.titleKey, "fr"),
      description: getAdviceTranslation(card.descKey, "fr"),
    })),
  })),
};

const jsonLdBreadcrumb = breadcrumb([
  { name: "Accueil", path: "/" },
  { name: "Conseils & Sécurité", path: "/conseils" },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGuide) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {children}
    </>
  );
}
