import type { Metadata } from "next";
import { SITE_NAME, SITE_LANG, SITE_LOCALE, absoluteUrl, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Vérifier un numéro ou un suspect",
  description:
    "Vérifiez gratuitement si un numéro de téléphone, un nom ou un compte a déjà été signalé comme arnaqueur au Bénin. Résultat immédiat et anonyme.",
  keywords: [
    "vérifier numéro Bénin",
    "numéro arnaqueur Bénin",
    "qui m'a appelé Bénin",
    "numéro suspect MTN Moov",
    "base de données arnaqueurs Bénin",
    "vérifier compte Mobile Money",
  ],
  openGraph: {
    type: "website",
    title: `Vérifier un numéro ou un suspect | ${SITE_NAME}`,
    description:
      "Ce numéro a-t-il déjà été signalé ? Vérification gratuite et anonyme dans la base StopArnaque Bénin.",
    url: absoluteUrl("/rechercher"),
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: `Vérifier un numéro ou un suspect | ${SITE_NAME}`,
    description: "Ce numéro a-t-il déjà été signalé ? Vérification gratuite et anonyme.",
  },
  alternates: { canonical: "/rechercher" },
};

/**
 * `WebApplication` décrit le moteur de vérification lui-même : c'est ce qui
 * permet à Google de comprendre que la page est un outil, pas un article.
 */
const jsonLdSearch = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Vérification de numéro StopArnaque",
  url: absoluteUrl("/rechercher"),
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  inLanguage: SITE_LANG,
  description:
    "Moteur de vérification permettant de savoir si un numéro, un nom ou un compte a déjà été signalé comme frauduleux au Bénin.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "XOF" },
  provider: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
};

const jsonLdBreadcrumb = breadcrumb([
  { name: "Accueil", path: "/" },
  { name: "Vérifier un suspect", path: "/rechercher" },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSearch) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {children}
    </>
  );
}
