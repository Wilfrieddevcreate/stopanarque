"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRiskLevel } from "@/lib/types";
import { FadeIn } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";

interface SearchResult {
  query: string;
  queryType: "url" | "phone" | "general";
  count: number;
  scamTypes: string[];
  phones: string[];
  names: string[];
  platforms: string[];
  urls: string[];
}

const URL_RE_CLIENT = /^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/\S*)?$/i;
const PHONE_RE_CLIENT = /^[+\d\s\-().]{7,}$/;

function detectInputType(q: string): "url" | "phone" | "general" {
  if (URL_RE_CLIENT.test(q.trim())) return "url";
  if (PHONE_RE_CLIENT.test(q.trim())) return "phone";
  return "general";
}

export default function RechercherPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputType = query.trim() ? detectInputType(query) : "general";

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

  const placeholders: Record<string, string> = {
    url: "Ex : site-arnaque.com ou https://faux-vendeur.bj",
    phone: "Ex : +22961234567",
    general: t("search.placeholder"),
  };

  const chips = [
    { label: `📞 ${t("search.chip.phone")}`, value: "+22961234567" },
    { label: `🌐 ${t("search.chip.url")}`, value: "mtn-benin-recharge-gratuite.net" },
    { label: `👤 ${t("search.chip.name")}`, value: "Sophie Martin" },
  ];

  const inputIcon = inputType === "url" ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
    </svg>
  ) : inputType === "phone" ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{t("search.title")}</h1>
            <p className="mt-3 text-muted text-lg">{t("search.input_hint")}</p>
          </div>

          {/* Exemples cliquables */}
          <div className="flex flex-wrap gap-2 justify-center mb-5">
            {chips.map((ex) => (
              <button
                key={ex.value}
                type="button"
                onClick={() => setQuery(ex.value)}
                className="px-3 py-1.5 text-xs rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-muted"
              >
                {ex.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-all">
                {inputIcon}
              </span>
              <input
                type="text"
                placeholder={placeholders[inputType]}
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
                  <div className="space-y-4">
                    {/* Result card */}
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
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm text-gray-500">{t("search.names")}</p>
                              <span className="text-xs text-gray-400 italic">{t("search.unverified")}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {result.names.map((n) => (
                                <span key={n} className="text-sm font-medium text-foreground bg-gray-100 px-2.5 py-1 rounded-lg">{n}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {result.urls.length > 0 && (
                          <div className="bg-white/60 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-500">{t("search.urls_label")}</p>
                              <span className="text-xs text-danger font-medium bg-danger/10 px-2 py-0.5 rounded-full">⚠ {t("search.no_visit")}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {result.urls.map((u) => (
                                <span key={u} className="font-mono text-xs font-semibold text-danger bg-danger/5 border border-danger/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                                  </svg>
                                  {u}
                                </span>
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
                      <div className="mt-4 bg-white/60 rounded-xl p-3 flex gap-2 items-start">
                        <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-gray-500">{t("search.warning")} {t("search.legal")}</p>
                      </div>
                    </div>

                    {/* Advice when result found */}
                    <FoundResultAdvice count={result.count} />
                  </div>
                ) : (
                  <NoResultPanel query={result?.query ?? query} />
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

function FoundResultAdvice({ count }: { count: number }) {
  const { t } = useI18n();
  const urgent = count >= 3;
  const steps = [
    {
      num: "1",
      title: t("search.found.step1.title"),
      text: t("search.found.step1.text"),
      color: "border-danger/30 bg-danger/5 text-danger",
    },
    {
      num: "2",
      title: t("search.found.step2.title"),
      text: t("search.found.step2.text"),
      color: "border-amber-300 bg-amber-50 text-amber-700",
    },
    {
      num: "3",
      title: t("search.found.step3.title"),
      text: t("search.found.step3.text"),
      color: "border-primary/30 bg-primary/5 text-primary",
    },
    {
      num: "4",
      title: t("search.found.step4.title"),
      text: t("search.found.step4.text"),
      color: "border-success/30 bg-success/5 text-success",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      {urgent && (
        <div className="flex gap-2 items-center bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 mb-5">
          <svg className="w-4 h-4 text-danger shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-sm font-semibold text-danger">
            {count} signalement{count > 1 ? "s" : ""} — {t("search.urgent")}
          </p>
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">{t("search.found.title")}</p>
      <div className="space-y-3">
        {steps.map((s) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Number(s.num) * 0.08 }}
            className={`flex gap-3 rounded-xl border p-4 ${s.color}`}
          >
            <span className="w-6 h-6 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
              style={{ color: "inherit" }}>
              {s.num}
            </span>
            <div>
              <p className="text-sm font-semibold mb-0.5">{s.title}</p>
              <p className="text-xs leading-relaxed opacity-80">{s.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <a
          href="/signaler"
          className="flex-1 text-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          {t("search.found.cta.report")}
        </a>
        <a
          href="/conseils"
          className="flex-1 text-center border border-border hover:bg-gray-50 text-foreground font-medium py-3 rounded-xl text-sm transition-colors"
        >
          {t("search.found.cta.advice")}
        </a>
      </div>
    </div>
  );
}

const PHONE_RE = /^[+\d\s\-().]{7,}$/;
const URL_RE_PANEL = /^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/\S*)?$/i;

function NoResultPanel({ query }: { query: string }) {
  const { t } = useI18n();
  const isUrl = URL_RE_PANEL.test(query.trim());
  const isPhone = !isUrl && PHONE_RE.test(query.trim());

  const PHONE_TIPS = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("tip.phone.1.title"),
      text: t("tip.phone.1.text"),
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
        </svg>
      ),
      title: t("tip.phone.2.title"),
      text: t("tip.phone.2.text"),
      color: "text-primary bg-primary/5 border-primary/10",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t("tip.phone.3.title"),
      text: t("tip.phone.3.text"),
      color: "text-danger bg-danger/5 border-danger/10",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t("tip.phone.4.title"),
      text: t("tip.phone.4.text"),
      color: "text-success bg-success/5 border-success/10",
    },
  ];

  const URL_TIPS = [
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      title: t("tip.url.1.title"),
      text: t("tip.url.1.text"),
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
      title: t("tip.url.2.title"),
      text: t("tip.url.2.text"),
      color: "text-danger bg-danger/5 border-danger/10",
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      title: t("tip.url.3.title"),
      text: t("tip.url.3.text"),
      color: "text-primary bg-primary/5 border-primary/10",
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
      title: t("tip.url.4.title"),
      text: t("tip.url.4.text"),
      color: "text-success bg-success/5 border-success/10",
    },
  ];

  const GENERAL_TIPS = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("tip.general.1.title"),
      text: t("tip.general.1.text"),
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("tip.general.2.title"),
      text: t("tip.general.2.text"),
      color: "text-primary bg-primary/5 border-primary/10",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t("tip.general.3.title"),
      text: t("tip.general.3.text"),
      color: "text-danger bg-danger/5 border-danger/10",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
      title: t("tip.general.4.title"),
      text: t("tip.general.4.text"),
      color: "text-success bg-success/5 border-success/10",
    },
  ];

  const tips = isUrl ? URL_TIPS : isPhone ? PHONE_TIPS : GENERAL_TIPS;

  const subtitle = isUrl
    ? t("search.noresult.url")
    : isPhone
    ? t("search.noresult.phone")
    : t("search.noresult.general");

  const adviceLabel = isUrl
    ? t("search.noresult.url_advice")
    : isPhone
    ? t("search.noresult.phone_advice")
    : t("search.noresult.general_advice");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-success/20 bg-success/5 p-6 text-center">
        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-success mb-1">{t("search.no_result")}</h3>
        <p className="text-sm text-success/70">{subtitle}</p>
      </div>

      {/* Advice section */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 px-1">
          {adviceLabel}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`flex gap-3 rounded-xl border p-4 ${tip.color}`}
            >
              <span className="shrink-0 mt-0.5">{tip.icon}</span>
              <div>
                <p className="text-sm font-semibold mb-0.5">{tip.title}</p>
                <p className="text-xs leading-relaxed opacity-80">{tip.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <a
          href="/signaler"
          className="flex-1 text-center bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          {t("arnaques.cta.report")}
        </a>
        <a
          href="/conseils"
          className="flex-1 text-center border border-border hover:bg-gray-50 text-foreground font-medium py-3 rounded-xl text-sm transition-colors"
        >
          {t("search.found.cta.advice")}
        </a>
      </div>
    </div>
  );
}
