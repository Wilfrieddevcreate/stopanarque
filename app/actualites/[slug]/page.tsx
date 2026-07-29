"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FadeInUp } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";

const CATEGORY_COLORS: Record<string, string> = {
  Alerte: "bg-primary/10 text-primary",
  Conseil: "bg-success/10 text-success",
  Actualité: "bg-blue-50 text-blue-700",
  Communiqué: "bg-purple-50 text-purple-700",
};

interface Article {
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
  author: { name: string };
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useI18n();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles?slug=${params.slug}`)
      .then((r) => {
        if (!r.ok) { router.push("/actualites"); return null; }
        return r.json();
      })
      .then((d) => d && setArticle(d.article))
      .finally(() => setLoading(false));
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!article) return null;

  const pick = (fr: string, en: string, fon: string, yo: string) => {
    if (locale === "en" && en) return en;
    if (locale === "fon" && fon) return fon;
    if (locale === "yo" && yo) return yo;
    return fr;
  };

  const title = pick(article.title, article.titleEn, article.titleFon, article.titleYo);
  const excerpt = pick(article.excerpt, article.excerptEn, article.excerptFon, article.excerptYo);
  const content = pick(article.content, article.contentEn, article.contentFon, article.contentYo);

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
              <p className="text-sm font-semibold text-foreground">{article.author.name}</p>
              <p className="text-xs text-muted">StopArnaque Bénin</p>
            </div>
          </div>

          <div className="space-y-4">
            {content.split("\n").map((para, i) =>
              para.trim() ? (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="text-base text-gray-700 leading-relaxed"
                >
                  {para}
                </motion.p>
              ) : (
                <br key={i} />
              )
            )}
          </div>

          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
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
