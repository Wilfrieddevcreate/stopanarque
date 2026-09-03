import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /suivi et /offline sont volontairement absents : ils portent une
        // balise `noindex`, que Google ne peut lire que s'il a le droit de les
        // explorer. Les interdire ici laisserait /suivi — lié depuis le pied de
        // page — indexable sous forme d'URL nue.
        // /uploads/ reste autorisé : les images de couverture d'articles y sont
        // servies et alimentent le sitemap images.
        disallow: [
          "/admin",  // back-office, protégé par authentification
          "/api/",   // réponses JSON, sans valeur en recherche
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
