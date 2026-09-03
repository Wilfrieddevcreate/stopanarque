import { getPublishedArticles } from "@/lib/articles";
import { stripHtml } from "@/lib/content";
import { SITE_LANG, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { NewsList } from "./NewsList";

/**
 * Page serveur : la liste est rendue dans le HTML initial (avant, elle était
 * chargée en `useEffect` et les moteurs ne voyaient aucun article).
 * Le filtrage par catégorie reste côté client.
 */

export default async function ActualitesPage() {
  const articles = await getPublishedArticles();

  const jsonLdList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Actualités et alertes arnaques — ${SITE_NAME}`,
    description:
      "Alertes sur les arnaques en circulation au Bénin, conseils de prévention et communiqués officiels.",
    url: absoluteUrl("/actualites"),
    inLanguage: SITE_LANG,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/actualites/${a.slug}`),
        name: stripHtml(a.title),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }}
      />
      <NewsList
        articles={articles.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          titleEn: a.titleEn,
          titleFon: a.titleFon,
          titleYo: a.titleYo,
          excerpt: a.excerpt,
          excerptEn: a.excerptEn,
          excerptFon: a.excerptFon,
          excerptYo: a.excerptYo,
          coverImage: a.coverImage,
          category: a.category,
          createdAt: a.createdAt.toISOString(),
          authorName: a.author?.name ?? SITE_NAME,
        }))}
      />
    </>
  );
}
