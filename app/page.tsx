import { getPublishedArticles } from "@/lib/articles";
import { getRecentAlerts, getHomeStats, type BannerItem } from "@/lib/statistics";
import { HomeView, type Article, type HomeStats } from "./HomeView";

/**
 * Page d'accueil : articles, alertes et statistiques sont chargés côté serveur.
 *
 * Auparavant la bannière et les compteurs se remplissaient en `useEffect` : le
 * HTML servi annonçait « 0 signalements », et la bannière s'insérait au-dessus
 * du hero après hydratation en décalant toute la page de 42 px.
 */
export const revalidate = 300;

export default async function Home() {
  const [latest, alerts, stats] = await Promise.all([
    getPublishedArticles(3),
    getRecentAlerts().catch((): BannerItem[] => []),
    getHomeStats().catch((): HomeStats | null => null),
  ]);

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

  return <HomeView articles={articles} alerts={alerts} stats={stats} />;
}
