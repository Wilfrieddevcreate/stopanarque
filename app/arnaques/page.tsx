"use client";

import Link from "next/link";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";
import { getScamData } from "@/lib/i18n/arnaques-data";
import { ARNAQUES_FAQ } from "@/lib/faq";
import { SITE_LANG, SITE_NAME, absoluteUrl, breadcrumb } from "@/lib/seo";
import { VISUAL_CONFIG } from "@/lib/scam-visuals";

/**
 * Guide des arnaques : page de catégorie.
 *
 * Chaque type d'arnaque a sa propre page (/arnaques/[slug]). Le hub ne répète
 * plus les 17 fiches complètes — il présente chacune en une carte (nom, accroche,
 * première phrase) qui mène à sa fiche. Avant, les 17 fiches vivaient dans des
 * panneaux masqués de cette page : les fiches dédiées en dupliquaient 78 % du
 * texte, sans un seul lien pour y accéder.
 */

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ARNAQUES_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const jsonLdBreadcrumb = breadcrumb([
  { name: "Accueil", path: "/" },
  { name: "Guide des arnaques", path: "/arnaques" },
]);

/**
 * Catalogue structuré des 17 types d'arnaques : chaque fiche devient une entité
 * distincte pour les moteurs, avec ses signes d'alerte et ses conseils.
 */
const SCAMS = getScamData("fr");

const jsonLdScams = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Types d'arnaques recensés au Bénin",
  description:
    "Catalogue des arnaques les plus courantes au Bénin, avec pour chacune sa description, un exemple réel, les signes d'alerte et les conseils de protection.",
  url: absoluteUrl("/arnaques"),
  numberOfItems: SCAMS.length,
  itemListElement: SCAMS.map((scam, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: absoluteUrl(`/arnaques/${scam.id}`),
    item: {
      "@type": "Article",
      name: scam.label,
      headline: `${scam.label} — ${scam.tagline}`,
      description: scam.description,
      url: absoluteUrl(`/arnaques/${scam.id}`),
      inLanguage: SITE_LANG,
      about: { "@type": "Thing", name: scam.label },
      articleSection: "Guide des arnaques",
      publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    },
  })),
};

/** Première phrase de la description, tronquée proprement si elle est longue. */
function excerpt(text: string, max = 130): string {
  const first = text.split(/(?<=[.!?])\s/)[0] ?? text;
  if (first.length <= max) return first;
  const cut = first.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:]+$/, "")}…`;
}

export default function ArnaquesPage() {
  const { t, locale } = useI18n();
  const scams = getScamData(locale);

  return (
    <div className="py-12 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdScams) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <FadeInUp className="text-center mb-12">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t("arnaques.label")}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground">
            {t("arnaques.title")}
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {t("arnaques.subtitle")}
          </p>
        </FadeInUp>

        {/* Catalogue : une carte par type, chacune mène à sa fiche */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scams.map((scam) => {
            const v = VISUAL_CONFIG[scam.id];
            return (
              <StaggerItem key={scam.id} className="h-full">
                <Link
                  href={`/arnaques/${scam.id}`}
                  className={`group flex h-full flex-col rounded-2xl border-2 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${v.color}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
                      <svg className={`w-5 h-5 ${v.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={v.icon} />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-bold text-foreground leading-snug">{scam.label}</h2>
                      <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${v.badgeColor}`}>
                        {scam.tagline}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/75 leading-relaxed flex-1">{excerpt(scam.description)}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:gap-2.5 transition-all">
                    Lire la fiche
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* FAQ — ces questions sont aussi balisées en FAQPage dans le layout ;
            Google exige qu'un FAQPage corresponde à du contenu visible. */}
        <FadeInUp className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Questions fréquentes sur les arnaques au Bénin
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {ARNAQUES_FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-border bg-white p-5 open:shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-foreground list-none">
                  <h3 className="text-base font-semibold">{item.question}</h3>
                  <svg
                    className="w-5 h-5 shrink-0 text-muted transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-muted leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </FadeInUp>

        {/* CTA bas de page */}
        <FadeInUp className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl border border-border p-8 sm:p-12">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              {t("arnaques.victim.title")}
            </h2>
            <p className="text-muted mb-6 max-w-xl mx-auto">
              {t("arnaques.victim.text")}
            </p>
            <Link
              href="/signaler"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg shadow-primary/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636z" />
              </svg>
              {t("arnaques.victim.button")}
            </Link>
          </div>
        </FadeInUp>

      </div>
    </div>
  );
}
