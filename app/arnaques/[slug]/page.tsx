import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getScamData } from "@/lib/i18n/arnaques-data";
import { ScamDetail } from "@/components/ScamDetail";
import { getPublishedArticles } from "@/lib/articles";
import { articlesForScam } from "@/lib/scam-links";
import { stripHtml } from "@/lib/content";
import { SITE_LANG, SITE_NAME, absoluteUrl, breadcrumb, pageMetadata, truncate } from "@/lib/seo";

/**
 * Une URL par type d'arnaque.
 *
 * Les 17 fiches n'existaient que sous forme d'onglets d'une même page : dix-sept
 * intentions de recherche distinctes (« arnaque Mobile Money », « sextorsion
 * Bénin », « faux agent MTN »…) se concurrençaient sur une seule URL.
 */

const SCAMS = getScamData("fr");

/** Les articles liés viennent de la base : la fiche se régénère périodiquement. */
export const revalidate = 300;

export function generateStaticParams() {
  return SCAMS.map((scam) => ({ slug: scam.id }));
}

function find(slug: string) {
  return SCAMS.find((scam) => scam.id === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scam = find(slug);
  if (!scam) return { title: "Arnaque introuvable", robots: { index: false, follow: false } };

  return pageMetadata({
    title: `${scam.label} au Bénin`,
    description: truncate(`${scam.description} Signes d'alerte et conseils pour s'en protéger.`),
    path: `/arnaques/${scam.id}`,
    type: "article",
    ogTitle: `${scam.label} — ${scam.tagline} | ${SITE_NAME}`,
  });
}

export default async function ScamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scam = find(slug);
  if (!scam) notFound();

  const url = absoluteUrl(`/arnaques/${scam.id}`);

  const related = articlesForScam(scam.id, await getPublishedArticles(50)).slice(0, 4).map((a) => ({
    slug: a.slug,
    title: stripHtml(a.title),
    category: a.category,
    createdAt: a.createdAt.toISOString(),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${scam.label} au Bénin : ${scam.tagline}`,
    description: scam.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: SITE_LANG,
    isAccessibleForFree: true,
    about: { "@type": "Thing", name: scam.label },
    author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-512.png") },
    },
  };

  const jsonLdBreadcrumb = breadcrumb([
    { name: "Accueil", path: "/" },
    { name: "Guide des arnaques", path: "/arnaques" },
    { name: scam.label, path: `/arnaques/${scam.id}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <ScamDetail id={scam.id} relatedArticles={related} />
    </>
  );
}
