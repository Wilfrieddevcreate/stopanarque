import { getPublishedArticles } from "@/lib/articles";
import { HomeView, type Article } from "./HomeView";

/**
 * Page d'accueil : les derniers articles sont chargés côté serveur.
 *
 * Ils étaient récupérés en `useEffect` : le HTML servi ne contenait donc aucun
 * lien vers un article, la section « actualités » n'avait rien d'indexable et
 * /actualites/* ne recevait aucun lien depuis la page la plus forte du site.
 */
export const revalidate = 300;

export default async function Home() {
  const latest = await getPublishedArticles(3);

  const articles: Article[] = latest.slice(0, 3).map((a) => ({
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
  }));

  return <HomeView articles={articles} />;
}
