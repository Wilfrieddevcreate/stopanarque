"use client";

import Link from "next/link";
import { getScamData } from "@/lib/i18n/arnaques-data";
import { VISUAL_CONFIG } from "@/lib/scam-visuals";
import { useI18n } from "@/lib/i18n/context";
import { FadeInUp } from "@/components/MotionDiv";

/**
 * Fiche d'arnaque servie sur son URL propre.
 * Le contenu suit la langue choisie ; le rendu serveur reste le français,
 * qui est la version indexée.
 */
export type RelatedArticle = { slug: string; title: string; category: string; createdAt: string };

export function ScamDetail({
  id,
  relatedArticles = [],
}: {
  id: string;
  relatedArticles?: RelatedArticle[];
}) {
  const { t, locale } = useI18n();
  const scam = getScamData(locale).find((s) => s.id === id) ?? getScamData("fr").find((s) => s.id === id);
  if (!scam) return null;

  const v = VISUAL_CONFIG[scam.id];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <nav aria-label="Fil d'Ariane" className="mb-8 text-sm text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/arnaques" className="hover:text-foreground transition-colors">Guide des arnaques</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{scam.label}</span>
          </nav>

          <div className={`rounded-2xl border-2 p-6 sm:p-8 ${v.color}`}>
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
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{scam.label}</h1>
              </div>
            </div>

            <p className="text-foreground/80 leading-relaxed mb-5 text-sm sm:text-base">{scam.description}</p>

            <div className="bg-white/60 rounded-xl p-4 mb-5 border border-white/80">
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                {t("arnaques.section.example")}
              </h2>
              <p className="text-sm text-foreground italic">&laquo;&nbsp;{scam.example}&nbsp;&raquo;</p>
            </div>

            <div className="mb-5">
              <h2 className="text-sm font-semibold text-foreground mb-2.5">{t("arnaques.section.signs")}</h2>
              <ul className="space-y-1.5">
                {scam.signs.map((sign) => (
                  <li key={sign} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                    {sign}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-7">
              <h2 className="text-sm font-semibold text-foreground mb-2.5">{t("arnaques.section.protect")}</h2>
              <ul className="space-y-1.5">
                {scam.protect.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

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
          </div>

          {/* Articles d'actualité portant sur ce type d'arnaque */}
          {relatedArticles.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold text-foreground mb-4">Dans l&apos;actualité</h2>
              <ul className="space-y-2">
                {relatedArticles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/actualites/${a.slug}`}
                      className="group flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {a.category}
                      </span>
                      <span className="flex-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {a.title}
                      </span>
                      <svg className="w-4 h-4 shrink-0 text-muted group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Maillage : chaque fiche renvoie vers les autres */}
          <div className="mt-10">
            <h2 className="text-lg font-bold text-foreground mb-4">Autres types d&apos;arnaques</h2>
            <div className="flex flex-wrap gap-2">
              {getScamData(locale)
                .filter((s) => s.id !== scam.id)
                .map((s) => (
                  <Link
                    key={s.id}
                    href={`/arnaques/${s.id}`}
                    className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm text-muted hover:text-foreground hover:border-gray-300 transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
            </div>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
