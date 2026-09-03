"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";
import { getScamData, type ScamEntry } from "@/lib/i18n/arnaques-data";
import { ARNAQUES_FAQ } from "@/lib/faq";
import { SITE_LANG, SITE_NAME, absoluteUrl, breadcrumb } from "@/lib/seo";
import { VISUAL_CONFIG } from "@/lib/scam-visuals";



// ── Composant carte ────────────────────────────────────────────────────────────

function ScamCard({
  id, label, tagline, active, onClick,
}: {
  id: string;
  label: string;
  tagline: string;
  active: boolean;
  onClick: () => void;
}) {
  const v = VISUAL_CONFIG[id];
  return (
    <motion.button
      id={`onglet-${id}`}
      onClick={onClick}
      aria-expanded={active}
      aria-controls={`fiche-${id}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        active ? `${v.color} border-current shadow-sm` : "bg-white border-border hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-white/60" : "bg-gray-100"}`}>
          <svg className={`w-4 h-4 ${active ? v.iconColor : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={v.icon} />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{label}</p>
          <p className="text-xs text-muted truncate">{tagline}</p>
        </div>
      </div>
    </motion.button>
  );
}

/**
 * Fiche détaillée d'une arnaque.
 * Les 17 fiches sont toutes rendues dans le HTML — les inactives sont masquées
 * en CSS. Auparavant seule la fiche active existait dans le DOM : les 16 autres
 * (le contenu le plus riche du site) étaient invisibles pour les moteurs.
 */
function ScamPanel({
  scam,
  active,
  t,
}: {
  scam: ScamEntry;
  active: boolean;
  t: (key: string) => string;
}) {
  const v = VISUAL_CONFIG[scam.id];
  return (
    <motion.div
      id={`fiche-${scam.id}`}
      role="region"
      aria-labelledby={`onglet-${scam.id}`}
      hidden={!active}
      initial={false}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border-2 p-6 sm:p-8 ${v.color}`}
    >
        {/* Titre */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center shrink-0">
            <svg className={`w-6 h-6 ${v.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={v.icon} />
            </svg>
          </div>
          <div>
            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1 ${v.badgeColor}`}>
              {scam.tagline}
            </span>
            <h2 className="text-xl font-bold text-foreground">{scam.label}</h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-foreground/80 leading-relaxed mb-5 text-sm sm:text-base">{scam.description}</p>

        {/* Exemple */}
        <div className="bg-white/60 rounded-xl p-4 mb-5 border border-white/80">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
            {t("arnaques.section.example")}
          </p>
          <p className="text-sm text-foreground italic">&laquo;&nbsp;{scam.example}&nbsp;&raquo;</p>
        </div>

        {/* Signes */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636z" />
            </svg>
            {t("arnaques.section.signs")}
          </p>
          <ul className="space-y-1.5">
            {scam.signs.map((sign, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                {sign}
              </li>
            ))}
          </ul>
        </div>

        {/* Protection */}
        <div className="mb-7">
          <p className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t("arnaques.section.protect")}
          </p>
          <ul className="space-y-1.5">
            {scam.protect.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/signaler"
            className="flex-1 bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-semibold text-sm text-center transition-colors shadow-lg shadow-primary/25"
          >
            {t("arnaques.cta.report")}
          </Link>
          <Link
            href="/rechercher"
            className="flex-1 bg-white/70 hover:bg-white text-foreground py-3.5 rounded-xl font-semibold text-sm text-center transition-colors border border-white/80"
          >
            {t("arnaques.cta.check")}
          </Link>
        </div>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

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

export default function ArnaquesPage() {
  const { t, locale } = useI18n();
  const scams = getScamData(locale);
  const [activeId, setActiveId] = useState<string>(scams[0].id);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Bloque le scroll du body quand le bottom sheet est ouvert
  useEffect(() => {
    if (sheetOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [sheetOpen]);

  const activeScam = scams.find((s) => s.id === activeId) ?? scams[0];

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

        {/* Layout deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Colonne gauche — liste scrollable */}
          <div className="lg:col-span-2 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {scams.map((scam) => (
                <StaggerItem key={scam.id}>
                  <ScamCard
                    id={scam.id}
                    label={scam.label}
                    tagline={scam.tagline}
                    active={activeId === scam.id}
                    onClick={() => {
                      setActiveId(scam.id);
                      setSheetOpen(true);
                    }}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Colonne droite — fiches détaillées (toutes rendues pour le SEO, une seule visible) */}
          {/* Sur mobile : hidden mais présente dans le DOM pour les moteurs */}
          <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
            {scams.map((scam) => (
              <ScamPanel key={scam.id} scam={scam} active={scam.id === activeId} t={t} />
            ))}
          </div>
        </div>

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

        {/* ── Bottom sheet mobile (invisible sur lg+) ────────────────────── */}
        <AnimatePresence>
          {sheetOpen && (
            <>
              {/* Fond assombri */}
              <motion.div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSheetOpen(false)}
              />

              {/* Tiroir */}
              <motion.div
                className="fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-3xl bg-white shadow-2xl"
                style={{ maxHeight: "88vh" }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 32, stiffness: 320 }}
                drag="y"
                dragConstraints={{ top: 0 }}
                dragElastic={{ top: 0, bottom: 0.4 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 80) setSheetOpen(false);
                }}
              >
                {/* Poignée de glissement */}
                <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                  <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>

                {/* Bouton fermer */}
                <button
                  onClick={() => setSheetOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  aria-label="Fermer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Contenu scrollable */}
                <div className="overflow-y-auto px-4 pb-10" style={{ maxHeight: "calc(88vh - 48px)" }}>
                  <ScamPanel scam={activeScam} active={true} t={t} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
