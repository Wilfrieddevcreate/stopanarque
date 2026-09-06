"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
const swal = () => import("sweetalert2").then((m) => m.default);
import { stripHtml } from "@/lib/content";

const CATEGORY_COLORS: Record<string, string> = {
  Alerte: "bg-primary/10 text-primary",
  Conseil: "bg-success/10 text-success",
  Actualité: "bg-blue-50 text-blue-700",
  Communiqué: "bg-purple-50 text-purple-700",
};

const LANG_LABELS: Record<string, string> = {
  titleEn: "EN", titleFon: "FON", titleYo: "YO",
};

interface Article {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  titleFon: string;
  titleYo: string;
  excerpt: string;
  category: string;
  published: boolean;
  createdAt: string;
  author: { name: string };
}

export default function AdminActualitesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchArticles() {
    const res = await fetch("/api/admin/articles");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setArticles(data.articles || []);
    setLoading(false);
  }

  useEffect(() => { fetchArticles(); }, []);

  async function handleTogglePublish(article: Article) {
    await fetch("/api/admin/articles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: article.id, published: !article.published }),
    });
    await fetchArticles();
  }

  async function handleDelete(article: Article) {
    const result = await (await swal()).fire({
      title: "Supprimer cet article ?",
      text: article.title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E8112D",
      cancelButtonText: "Annuler",
      confirmButtonText: "Supprimer",
    });
    if (!result.isConfirmed) return;
    await fetch(`/api/admin/articles?id=${article.id}`, { method: "DELETE" });
    setArticles((prev) => prev.filter((a) => a.id !== article.id));
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Actualités</h1>
          <p className="text-sm text-muted mt-0.5">
            {articles.length} article{articles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/actualites/nouveau")}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-primary/25"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvel article
        </button>
      </div>

      {/* Empty state */}
      {articles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-border">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-muted font-medium">Aucun article pour l&apos;instant</p>
          <button
            onClick={() => router.push("/admin/actualites/nouveau")}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Créer le premier article
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => {
            const langs = (["titleEn", "titleFon", "titleYo"] as const).filter(
              (k) => !!(article[k as keyof Article] as string)
            );
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-border p-4 sm:p-5 flex items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_COLORS[article.category] || "bg-gray-100 text-gray-600"}`}>
                      {article.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${article.published ? "bg-success/10 text-success" : "bg-gray-100 text-gray-500"}`}>
                      {article.published ? "Publié" : "Brouillon"}
                    </span>
                    {langs.map((k) => (
                      <span key={k} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600">
                        {LANG_LABELS[k]}
                      </span>
                    ))}
                    <span className="text-[11px] text-muted ml-1">
                      {new Date(article.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-foreground leading-snug line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted mt-0.5 line-clamp-1">{stripHtml(article.excerpt)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Toggle publish */}
                  <button
                    onClick={() => handleTogglePublish(article)}
                    title={article.published ? "Dépublier" : "Publier"}
                    className={`p-2 rounded-lg transition-colors ${
                      article.published
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                        article.published
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      } />
                    </svg>
                  </button>

                  {/* Edit → dedicated page */}
                  <button
                    onClick={() => router.push(`/admin/actualites/${article.id}`)}
                    title="Modifier"
                    className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(article)}
                    title="Supprimer"
                    className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
