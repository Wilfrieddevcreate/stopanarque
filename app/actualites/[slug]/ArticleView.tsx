"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeInUp } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";
import { contentToHtml, stripHtml } from "@/lib/content";
import { getScamData } from "@/lib/i18n/arnaques-data";
import { VISUAL_CONFIG } from "@/lib/scam-visuals";

const CATEGORY_COLORS: Record<string, string> = {
  Alerte: "bg-primary/10 text-primary",
  Conseil: "bg-success/10 text-success",
  Actualité: "bg-blue-50 text-blue-700",
  Communiqué: "bg-purple-50 text-purple-700",
};

export interface ArticleViewData {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  titleFon: string;
  titleYo: string;
  excerpt: string;
  excerptEn: string;
  excerptFon: string;
  excerptYo: string;
  content: string;
  contentEn: string;
  contentFon: string;
  contentYo: string;
  coverImage: string;
  category: string;
  createdAt: string;
  authorName: string;
}

export function ArticleView({
  article,
  url,
  relatedScamId = null,
}: {
  article: ArticleViewData;
  url: string;
  relatedScamId?: string | null;
}) {
  const { t, locale } = useI18n();
  const relatedScam = relatedScamId ? getScamData(locale).find((s) => s.id === relatedScamId) ?? null : null;
  const [copied, setCopied] = useState(false);

  const pick = (fr: string, en: string, fon: string, yo: string) => {
    if (locale === "en" && en) return en;
    if (locale === "fon" && fon) return fon;
    if (locale === "yo" && yo) return yo;
    return fr;
  };

  const title = stripHtml(pick(article.title, article.titleEn, article.titleFon, article.titleYo));
  const excerpt = stripHtml(pick(article.excerpt, article.excerptEn, article.excerptFon, article.excerptYo));
  const contentHtml = contentToHtml(pick(article.content, article.contentEn, article.contentFon, article.contentYo));

  const pageUrl = url;
  const shareText = `${title} — StopArnaque Bénin`;

  function handleCopy() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const SHARE_LINKS = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      color: "bg-[#25D366] hover:bg-[#1ebe5d]",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.526 5.858L0 24l6.335-1.502A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.866 9.866 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.862 9.862 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.468 0 9.882 4.414 9.882 9.882 0 5.467-4.414 9.882-9.882 9.882z" />
        </svg>
      ),
      href: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + pageUrl)}`,
    },
    {
      id: "facebook",
      label: "Facebook",
      color: "bg-[#1877F2] hover:bg-[#0f66da]",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
    },
    {
      id: "twitter",
      label: "X (Twitter)",
      color: "bg-black hover:bg-zinc-800",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`,
    },
    {
      id: "telegram",
      label: "Telegram",
      color: "bg-[#229ED9] hover:bg-[#1a8fc0]",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      href: `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`,
    },
  ];

  const colorClass = CATEGORY_COLORS[article.category] || "bg-gray-100 text-gray-600";
  const dateLocale = locale === "en" ? "en-GB" : locale === "yo" ? "yo-NG" : "fr-FR";
  const date = new Date(article.createdAt).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeInUp>
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("news.back")}
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
              {article.category}
            </span>
            <span className="text-sm text-muted">{date}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
            {title}
          </h1>

          <p className="text-lg text-muted leading-relaxed border-l-4 border-primary/30 pl-4 mb-8">
            {excerpt}
          </p>

          {/* Cover image */}
          {article.coverImage && (
            <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-8">
              <Image
                src={article.coverImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-10 pb-10 border-b border-border">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{article.authorName}</p>
              <p className="text-xs text-muted">StopArnaque Bénin</p>
            </div>
          </div>

          {/* Aucune animation d'opacité ici : le corps de l'article doit être
              lisible dans le HTML servi, JavaScript ou non. */}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          {relatedScam && (
            <Link
              href={`/arnaques/${relatedScam.id}`}
              className={`group mt-10 flex items-center gap-4 rounded-2xl border-2 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${VISUAL_CONFIG[relatedScam.id].color}`}
            >
              <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
                <svg className={`w-5 h-5 ${VISUAL_CONFIG[relatedScam.id].iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={VISUAL_CONFIG[relatedScam.id].icon} />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Type d&apos;arnaque concerné</p>
                <p className="font-bold text-foreground leading-snug">{relatedScam.label}</p>
                <p className="text-xs text-muted">{relatedScam.tagline}</p>
              </div>
              <svg className="w-5 h-5 shrink-0 text-muted group-hover:text-foreground group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          {/* Share section */}
          <div className="mt-12 border border-border rounded-2xl p-6">
            <p className="text-sm font-semibold text-foreground mb-1 text-center">
              Cet article vous a été utile ?
            </p>
            <p className="text-xs text-muted text-center mb-5">
              Partagez-le pour aider votre entourage à se protéger des arnaques.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {SHARE_LINKS.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all active:scale-95 ${s.color}`}
                  aria-label={`Partager sur ${s.label}`}
                >
                  {s.icon}
                  {s.label}
                </a>
              ))}

              {/* Copy link */}
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-gray-50 transition-all active:scale-95"
              >
                {copied ? (
                    <span key="check" className="reveal reveal-scale [animation-duration:.2s] flex items-center gap-2 text-success">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copié !
                    </span>
                  ) : (
                    <span key="copy" className="reveal reveal-scale [animation-duration:.2s] flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copier le lien
                    </span>
                  )}
              </button>
            </div>
          </div>

          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
            <p className="text-sm font-semibold text-foreground mb-1">{t("news.cta.text")}</p>
            <p className="text-sm text-muted mb-4">{t("news.cta.sub")}</p>
            <Link
              href="/signaler"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-primary/25"
            >
              {t("hero.cta.report")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
