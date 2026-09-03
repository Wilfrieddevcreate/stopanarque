import { notFound } from "next/navigation";
import { getArticleBySlug, getArticleSitemapEntries } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";
import { ArticleView } from "./ArticleView";

/**
 * Page serveur : l'article est chargé côté serveur puis passé au composant
 * client. Le HTML initial contient donc le titre, le chapô et le corps de
 * l'article — indispensable pour l'indexation (l'ancienne version chargeait
 * l'article en `useEffect`, les moteurs ne voyaient qu'une page vide).
 */

/**
 * Régénération incrémentale : sans cela, la page est figée au build et un
 * article publié après le déploiement reste invisible jusqu'au prochain build.
 */
export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getArticleSitemapEntries();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <ArticleView
      url={absoluteUrl(`/actualites/${article.slug}`)}
      article={{
        id: article.id,
        slug: article.slug,
        title: article.title,
        titleEn: article.titleEn,
        titleFon: article.titleFon,
        titleYo: article.titleYo,
        excerpt: article.excerpt,
        excerptEn: article.excerptEn,
        excerptFon: article.excerptFon,
        excerptYo: article.excerptYo,
        content: article.content,
        contentEn: article.contentEn,
        contentFon: article.contentFon,
        contentYo: article.contentYo,
        coverImage: article.coverImage,
        category: article.category,
        createdAt: article.createdAt.toISOString(),
        authorName: article.author?.name ?? "StopArnaque Bénin",
      }}
    />
  );
}
