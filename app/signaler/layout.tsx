import type { Metadata } from "next";
import { SITE_NAME, SITE_LANG, SITE_LOCALE, absoluteUrl, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Signaler une arnaque au Bénin",
  description:
    "Signalez un numéro frauduleux, un faux vendeur ou un arnaqueur au Bénin. Formulaire gratuit, anonyme et confidentiel : 2 minutes pour protéger la communauté.",
  keywords: [
    "signaler arnaque Bénin",
    "dénoncer arnaqueur Bénin",
    "signalement numéro frauduleux",
    "porter plainte arnaque Bénin",
    "signaler arnaque Mobile Money",
    "signaler arnaque WhatsApp Bénin",
  ],
  openGraph: {
    type: "website",
    title: `Signaler une arnaque au Bénin | ${SITE_NAME}`,
    description: "Signalez un numéro frauduleux. Gratuit, anonyme, confidentiel.",
    url: absoluteUrl("/signaler"),
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: `Signaler une arnaque au Bénin | ${SITE_NAME}`,
    description: "Signalez un numéro frauduleux. Gratuit, anonyme, confidentiel.",
  },
  alternates: { canonical: "/signaler" },
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Signalement d'arnaque",
  serviceType: "Signalement de fraude et de cybercriminalité",
  url: absoluteUrl("/signaler"),
  inLanguage: SITE_LANG,
  description:
    "Service gratuit et anonyme de signalement d'arnaques téléphoniques et en ligne au Bénin.",
  provider: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
  areaServed: { "@type": "Country", name: "Bénin" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "XOF" },
};

const jsonLdBreadcrumb = breadcrumb([
  { name: "Accueil", path: "/" },
  { name: "Signaler une arnaque", path: "/signaler" },
]);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {children}
    </>
  );
}
