"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRiskLevel } from "@/lib/types";
import { FadeIn } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";

interface SearchResult {
  query: string;
  count: number;
  scamTypes: string[];
  phones: string[];
  names: string[];
  platforms: string[];
}

export default function RechercherPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResult(data.result);
      setSearched(true);
    } catch {
      setResult(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  const risk = result ? getRiskLevel(result.count) : null;

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{t("search.title")}</h1>
            <p className="mt-3 text-muted text-lg">{t("search.subtitle")}</p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder={t("search.placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-4 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground placeholder:text-gray-400"
              />
              <motion.button
                type="submit"
                disabled={loading || !query.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                {loading ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : t("search.button")}
              </motion.button>
            </div>
          </form>

          <AnimatePresence mode="wait">
            {searched && (
              <motion.div
                key={result?.count ?? "empty"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {result && result.count > 0 ? (
                  <div className={`rounded-2xl border p-6 sm:p-8 ${risk!.bgColor}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{t("search.button")}</p>
                        <p className="text-xl font-bold text-foreground">&ldquo;{result.query}&rdquo;</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${risk!.color} bg-white/80`}>
                        {t("search.risk")} {risk!.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="bg-white/60 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">{t("search.results")}</p>
                        <p className="text-3xl font-bold text-foreground">{result.count}</p>
                      </div>
                      <div className="bg-white/60 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">{t("search.types")}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {result.scamTypes.map((st) => (
                            <span key={st} className="inline-block px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium text-gray-700">{st}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {result.phones.length > 0 && (
                        <div className="bg-white/60 rounded-xl p-4">
                          <p className="text-sm text-gray-500 mb-1">{t("search.phones")}</p>
                          <div className="flex flex-wrap gap-2">
                            {result.phones.map((p) => (
                              <span key={p} className="font-mono text-sm font-semibold text-foreground bg-gray-100 px-2.5 py-1 rounded-lg">{p}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.names.length > 0 && (
                        <div className="bg-white/60 rounded-xl p-4">
                          <p className="text-sm text-gray-500 mb-1">{t("search.names")}</p>
                          <div className="flex flex-wrap gap-2">
                            {result.names.map((n) => (
                              <span key={n} className="text-sm font-medium text-foreground bg-gray-100 px-2.5 py-1 rounded-lg">{n}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.platforms.length > 0 && (
                        <div className="bg-white/60 rounded-xl p-4">
                          <p className="text-sm text-gray-500 mb-1">{t("search.platforms")}</p>
                          <div className="flex flex-wrap gap-2">
                            {result.platforms.map((p) => (
                              <span key={p} className="text-sm font-medium text-foreground bg-gray-100 px-2.5 py-1 rounded-lg">{p}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 bg-white/60 rounded-xl p-4">
                      <p className="text-sm text-gray-600">{t("search.warning")}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-success/20 bg-success/5 p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-success mb-2">{t("search.no_result")}</h3>
                    <p className="text-success/70">{t("search.no_result.text")}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!searched && (
            <div className="text-center text-muted mt-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">{t("search.subtitle")}</p>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
