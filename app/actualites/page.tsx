"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";
import { stripHtml } from "@/lib/content";

const CAT_KEYS: Record<string, string> = {
  Alerte: "news.cat.alerte",
  Conseil: "news.cat.conseil",
  Actualité: "news.cat.actualite",
  Communiqué: "news.cat.communique",
};

const CATEGORY_COLORS: Record<string, string> = {
  Alerte: "bg-primary/10 text-primary",
  Conseil: "bg-success/10 text-success",
  Actualité: "bg-blue-50 text-blue-700",
  Communiqué: "bg-purple-50 text-purple-700",
};

const DB_CATEGORIES = ["Alerte", "Conseil", "Actualité", "Communiqué"];

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
  coverImage: string;
  category: string;
  createdAt: string;
  author: { name: string };
}

export default function ActualitesPage() {
  const { t, locale } = useI18n();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Toutes");

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "Toutes"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const getTitle = (a: Article) => {
    const raw =
      locale === "en" && a.titleEn ? a.titleEn :
      locale === "fon" && a.titleFon ? a.titleFon :
      locale === "yo" && a.titleYo ? a.titleYo :
      a.title;
    return stripHtml(raw);
  };

  const getExcerpt = (a: Article) => {
    const raw =
      locale === "en" && a.excerptEn ? a.excerptEn :
      locale === "fon" && a.excerptFon ? a.excerptFon :
      locale === "yo" && a.excerptYo ? a.excerptYo :
      a.excerpt;
    return stripHtml(raw);
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center mb-12">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t("news.label")}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground">{t("news.title")}</h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">{t("news.subtitle")}</p>
        </FadeInUp>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory("Toutes")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeCategory === "Toutes"
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t("news.all")}
          </motion.button>
          {DB_CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t(CAT_KEYS[cat])}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-muted text-lg font-medium">{t("news.empty.title")}</p>
            <p className="text-muted text-sm mt-1">{t("news.empty.sub")}</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((article, i) => (
              <StaggerItem key={article.id}>
                <ArticleCard
                  article={article}
                  featured={i === 0 && activeCategory === "Toutes"}
                  title={getTitle(article)}
                  excerpt={getExcerpt(article)}
                  readMore={t("news.read_more")}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  featured,
  title,
  excerpt,
  readMore,
}: {
  article: Article;
  featured?: boolean;
  title: string;
  excerpt: string;
  readMore: string;
}) {
  const colorClass = CATEGORY_COLORS[article.category] || "bg-gray-100 text-gray-600";
  const date = new Date(article.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-white rounded-2xl border border-border hover:shadow-lg transition-shadow overflow-hidden group ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <Link href={`/actualites/${article.slug}`} className="block">
        {/* Cover image */}
        {article.coverImage && (
          <div className={`relative w-full overflow-hidden ${featured ? "h-56 sm:h-64" : "h-44"}`}>
            <Image
              src={article.coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
              {article.category}
            </span>
            <span className="text-xs text-muted">{date}</span>
          </div>

          <h2 className={`font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-3 ${
            featured ? "text-2xl" : "text-lg"
          }`}>
            {title}
          </h2>

          <p className="text-sm text-muted leading-relaxed line-clamp-3">{excerpt}</p>

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs text-muted">{article.author.name}</span>
            </div>
            <span className="text-xs text-primary font-medium group-hover:underline flex items-center gap-1">
              {readMore}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
