import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Actualités & alertes arnaques au Bénin",
  description:
    "Les dernières arnaques en circulation au Bénin : alertes vérifiées, nouveaux modes opératoires, conseils de prévention et communiqués officiels.",
  path: "/actualites",
  ogDescription:
    "Alertes vérifiées sur les arnaques en circulation au Bénin, conseils de prévention et communiqués.",
  keywords: ["alerte arnaque Bénin", "nouvelle arnaque Bénin", "actualité cybercriminalité Bénin", "arnaque en cours Bénin", "communiqué StopArnaque"],
});

export default function ActualitesLayout({ children }: { children: React.ReactNode }) {
  // Le fil d'Ariane est déclaré par chaque page : ici il s'appliquerait aussi
  // aux articles, qui publient déjà le leur.
  return <>{children}</>;
}
