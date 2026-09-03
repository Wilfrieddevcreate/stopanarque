import type { Metadata } from "next";
import { SITE_NAME, SITE_LOCALE, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Actualités & alertes arnaques au Bénin",
  description:
    "Les dernières arnaques en circulation au Bénin : alertes vérifiées, nouveaux modes opératoires, conseils de prévention et communiqués officiels.",
  keywords: [
    "alerte arnaque Bénin",
    "nouvelle arnaque Bénin",
    "actualité cybercriminalité Bénin",
    "arnaque en cours Bénin",
    "communiqué StopArnaque",
  ],
  openGraph: {
    type: "website",
    title: `Actualités & alertes arnaques au Bénin | ${SITE_NAME}`,
    description:
      "Alertes vérifiées sur les arnaques en circulation au Bénin, conseils de prévention et communiqués.",
    url: absoluteUrl("/actualites"),
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
  },
  twitter: {
    card: "summary_large_image",
    title: `Actualités & alertes arnaques au Bénin | ${SITE_NAME}`,
    description: "Les dernières arnaques en circulation au Bénin, vérifiées par notre équipe.",
  },
  alternates: { canonical: "/actualites" },
};

export default function ActualitesLayout({ children }: { children: React.ReactNode }) {
  // Le fil d'Ariane est déclaré par chaque page : ici il s'appliquerait aussi
  // aux articles, qui publient déjà le leur.
  return <>{children}</>;
}
