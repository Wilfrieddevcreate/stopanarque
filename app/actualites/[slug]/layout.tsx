import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";
import { stripHtml } from "@/lib/content";
import {
  SITE_NAME,
  SITE_LANG,
  SITE_LOCALE,
  SITE_URL,
  absoluteUrl,
  breadcrumb,
  truncate,
} from "@/lib/seo";

/**
 * Métadonnées et données structurées d'un article.
 * `getArticleBySlug` est mémoïsé : le layout, la page et `generateMetadata`
 * partagent une seule requête. Le filtre `published` évite qu'un brouillon
 * expose son titre dans les métadonnées ou le JSON-LD.
 */

function describe(article: { excerpt: string; content: string }) {
  return truncate(stripHtml(article.excerpt) || stripHtml(article.content));
}

function coverOf(coverImage: string) {
  return coverImage ? absoluteUrl(coverImage) : absoluteUrl("/og-image.png");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article introuvable",
      robots: { index: false, follow: false },
    };
  }

  const title = stripHtml(article.title);
  const description = describe(article);
  const image = coverOf(article.coverImage);
  const url = absoluteUrl(`/actualites/${slug}`);
  const authorName = article.author?.name ?? SITE_NAME;

  return {
    // Le template ajoute " | StopArnaque Bénin" (20 caractères) : sur un titre
    // déjà long, le cumul serait tronqué dans les résultats de recherche.
    title: title.length > 45 ? { absolute: title } : title,
    description,
    authors: [{ name: authorName }],
    category: article.category,
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      section: article.category,
      authors: [authorName],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `/actualites/${slug}`,
    },
  };
}

export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return <>{children}</>;

  const title = stripHtml(article.title);
  const description = describe(article);
  const url = absoluteUrl(`/actualites/${slug}`);
  const body = stripHtml(article.content);

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: truncate(title, 110),
    description,
    image: [coverOf(article.coverImage)],
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    articleSection: article.category,
    wordCount: body ? body.split(/\s+/).length : undefined,
    author: {
      "@type": "Person",
      name: article.author?.name ?? SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icons/icon-512.png"),
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: SITE_LANG,
    isAccessibleForFree: true,
  };

  const jsonLdBreadcrumb = breadcrumb([
    { name: "Accueil", path: "/" },
    { name: "Actualités", path: "/actualites" },
    { name: title, path: `/actualites/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {children}
    </>
  );
}
