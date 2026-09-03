import type { Metadata } from "next";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Guide des arnaques",
  description:
    "Reconnaître une arnaque au Bénin : Mobile Money, faux emploi, phishing, romance scam, sextorsion, faux prêt… Apprenez les signes et comment vous protéger.",
  path: "/arnaques",
  type: "article",
  ogTitle: `Guide des arnaques au Bénin | ${SITE_NAME}`,
  ogDescription:
    "17 types d'arnaques expliqués : comment les reconnaître, exemples réels et conseils de protection.",
  keywords: ["types d'arnaques Bénin", "arnaque Mobile Money", "phishing Bénin", "faux emploi Bénin", "romance scam Bénin", "sextorsion Bénin", "arnaque investissement Bénin", "faux prêt Bénin", "reconnaître arnaque", "protection arnaque"],
});



export default function ArnaquesLayout({ children }: { children: React.ReactNode }) {
  // Le JSON-LD du hub est déclaré par la page elle-même : ici il s'appliquerait
  // aussi aux fiches /arnaques/[slug], qui publient déjà le leur.
  return <>{children}</>;
}
