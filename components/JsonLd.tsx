import { t } from "@/lib/i18n/translations";
import {
  CONTACT_EMAIL,
  SITE_LANG,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
} from "@/lib/seo";

/**
 * Graphe de connaissance du site, injecté une seule fois dans le layout racine.
 *
 * Les entités sont reliées par `@id` (organisation ← site ← pages) : c'est ce
 * qui permet aux moteurs de rattacher chaque page à une même organisation
 * plutôt que d'en déduire plusieurs entités distinctes.
 */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_ID = `${SITE_URL}/#logo`;

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "NGO"],
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      alternateName: SITE_SHORT_NAME,
      url: SITE_URL,
      email: CONTACT_EMAIL,
      description:
        "Plateforme béninoise de signalement et de vérification des arnaques téléphoniques et en ligne. Signalez un numéro frauduleux, vérifiez un suspect et protégez la communauté.",
      logo: {
        "@type": "ImageObject",
        "@id": LOGO_ID,
        url: absoluteUrl("/icons/icon-512.png"),
        contentUrl: absoluteUrl("/icons/icon-512.png"),
        width: 512,
        height: 512,
        caption: SITE_NAME,
      },
      image: { "@id": LOGO_ID },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cotonou",
        addressCountry: "BJ",
      },
      areaServed: { "@type": "Country", name: "Bénin" },
      knowsLanguage: ["fr", "en", "fon", "yo"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: CONTACT_EMAIL,
          areaServed: "BJ",
          availableLanguage: ["French", "English"],
        },
      ],
      // `sameAs` renforce la reconnaissance de l'entité : à remplir dès que les
      // comptes officiels existent (voir SOCIAL_PROFILES dans lib/seo.ts).
      ...(SOCIAL_PROFILES.length > 0 ? { sameAs: SOCIAL_PROFILES } : {}),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        "Signalez et vérifiez les arnaques au Bénin : numéros frauduleux, Mobile Money, phishing, sextorsion.",
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: SITE_LANG,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/rechercher?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export function SiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/**
 * Données structurées de la page d'accueil.
 *
 * Les questions/réponses sont lues en français : le JSON-LD doit rester stable
 * quelle que soit la langue choisie par le visiteur, puisque c'est la version
 * française que les moteurs indexent.
 */
const FAQ_KEYS = ["faq.1", "faq.2", "faq.3", "faq.4"];

const homeGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "StopArnaque Bénin — Signaler et vérifier une arnaque",
      description:
        "Plateforme béninoise de signalement d'arnaques téléphoniques et en ligne. Signalez un numéro frauduleux, vérifiez un suspect et protégez la communauté.",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      inLanguage: SITE_LANG,
      primaryImageOfPage: { "@id": LOGO_ID },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      isPartOf: { "@id": WEBSITE_ID },
      inLanguage: SITE_LANG,
      mainEntity: FAQ_KEYS.map((key) => ({
        "@type": "Question",
        name: t(`${key}.q`, "fr"),
        acceptedAnswer: { "@type": "Answer", text: t(`${key}.a`, "fr") },
      })),
    },
  ],
};

export function HomeJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(homeGraph) }}
    />
  );
}
