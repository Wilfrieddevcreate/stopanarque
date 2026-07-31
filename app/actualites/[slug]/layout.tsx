import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stopanarque.bj";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      category: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { name: true } },
    },
  });

  if (!article) {
    return {
      title: "Article introuvable",
      robots: { index: false, follow: false },
    };
  }

  const description = article.excerpt
    ? stripHtml(article.excerpt).slice(0, 160)
    : stripHtml(article.content).slice(0, 160);

  const image = article.coverImage
    ? article.coverImage.startsWith("http")
      ? article.coverImage
      : `${SITE_URL}${article.coverImage}`
    : `${SITE_URL}/og-image.png`;

  return {
    title: article.title,
    description,
    authors: article.author ? [{ name: article.author.name }] : undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url: `${SITE_URL}/actualites/${slug}`,
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      section: article.category,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
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

  const article = await prisma.article.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { name: true } },
    },
  });

  if (!article) return <>{children}</>;

  const description = article.excerpt
    ? stripHtml(article.excerpt).slice(0, 160)
    : stripHtml(article.content).slice(0, 160);

  const image = article.coverImage
    ? article.coverImage.startsWith("http")
      ? article.coverImage
      : `${SITE_URL}${article.coverImage}`
    : `${SITE_URL}/og-image.png`;

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description,
    image,
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: { "@type": "Person", name: article.author?.name ?? "StopArnaque Bénin" },
    publisher: {
      "@type": "Organization",
      name: "StopArnaque Bénin",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icons/icon-512x512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/actualites/${slug}` },
    url: `${SITE_URL}/actualites/${slug}`,
    inLanguage: "fr-BJ",
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Actualités", item: `${SITE_URL}/actualites` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/actualites/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {children}
    </>
  );
}
