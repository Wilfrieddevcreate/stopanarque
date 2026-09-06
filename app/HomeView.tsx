"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ScaleIn } from "@/components/MotionDiv";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HeroBackground } from "@/components/HeroBackground";
import { AlertBanner } from "@/components/AlertBanner";
import { useI18n } from "@/lib/i18n/context";
import { HomeJsonLd } from "@/components/JsonLd";
import type { BannerItem } from "@/lib/statistics";
import { HeroIllustration } from "@/components/Illustrations";

const HomeBelowFold = dynamic(
  () => import("./HomeBelowFold").then((m) => m.HomeBelowFold),
  { ssr: true }
);

export type HomeStats = { totalReports: number; confirmedReports: number; totalSearches: number };

export type Article = {
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
};

export function HomeView({
  articles,
  alerts,
  stats,
}: {
  articles: Article[];
  alerts: BannerItem[];
  stats: HomeStats | null;
}) {
  return (
    <div className="overflow-hidden">
      <HomeJsonLd />
      <AlertBanner initialItems={alerts} />
      <LiveActivityToast />
      <HeroSection />
      <StatsBar stats={stats} />
      <ActivityTicker />
      <HomeBelowFold articles={articles} />
    </div>
  );
}

/* ─── Hero ─── */
/* Entrées en CSS et en transformations seules : le titre est peint dès le
   premier rendu (LCP) au lieu d'attendre le JavaScript en opacity:0. */
function HeroSection() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-[#F6F8FC]">
      <HeroBackground />

      {/* Subtle decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 rounded-full bg-success/5 blur-2xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 lg:gap-8 items-center">

          {/* ── Left: text + CTAs ── */}
          <div className="max-w-xl">

            {/* Badge */}
            <div className="slide-up inline-flex items-center gap-2 bg-white text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold mb-7 border border-primary/20 shadow-sm">
              <span className="dot-pulse w-1.5 h-1.5 bg-primary rounded-full" />
              {t("hero.badge")}
            </div>

            {/* Benin flag bar */}
            <div className="grow-x flex h-[3px] w-14 mb-5 rounded-full overflow-hidden" style={{ animationDelay: ".08s" }}>
              <div className="flex-1 bg-success" />
              <div className="flex-1 bg-accent" />
              <div className="flex-1 bg-primary" />
            </div>

            {/* Title */}
            <h1
              className="slide-up text-[2.75rem] sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-900 leading-[1.1]"
              style={{ animationDelay: ".12s" }}
            >
              <span className="block">{t("hero.title1")}</span>
              <span className="block">
                {t("hero.title2")}{" "}
                <span className="relative inline-block text-primary">
                  {t("hero.title3")}
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      className="draw-in"
                      pathLength={1}
                      d="M2 7 Q50 2 100 6 Q150 10 198 3"
                      stroke="#E8112D"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      style={{ animationDelay: ".75s" }}
                    />
                  </svg>
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="slide-up mt-5 text-[0.95rem] text-slate-500 leading-relaxed max-w-sm"
              style={{ animationDelay: ".28s" }}
            >
              {t("hero.subtitle")}
            </p>

            {/* CTAs */}
            <div className="slide-up mt-8 flex flex-row items-center gap-3" style={{ animationDelay: ".4s" }}>
              {/* Primary */}
              <Link
                href="/signaler"
                className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white pl-4 pr-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-px active:scale-[0.97]"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {t("hero.cta.report")}
                <svg className="w-3.5 h-3.5 shrink-0 translate-x-0 group-hover:translate-x-1 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Secondary */}
              <Link
                href="/rechercher"
                className="group inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 pl-4 pr-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-px active:scale-[0.97]"
              >
                <svg className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-primary transition-colors duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t("hero.cta.search")}
              </Link>
            </div>

            {/* Trust micro-line */}
            <p className="mt-4 text-xs text-slate-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% gratuit · données sécurisées · Bénin
            </p>
          </div>

          {/* ── Right: illustration ── */}
          <div className="hidden lg:block">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats bar ─── */
function StatsBar({ stats }: { stats: HomeStats | null }) {
  const { t } = useI18n();

  const items = [
    {
      value: stats?.totalReports ?? 0,
      suffix: "+",
      label: t("home.stat.reports"),
    },
    {
      value: stats?.confirmedReports ?? 0,
      suffix: "+",
      label: t("home.stat.confirmed"),
    },
    {
      value: stats && stats.totalSearches >= 1000 ? Math.floor(stats.totalSearches / 1000) : (stats?.totalSearches ?? 0),
      suffix: stats && stats.totalSearches >= 1000 ? "k+" : "+",
      label: t("home.stat.searches"),
    },
    {
      value: 98,
      suffix: "%",
      label: t("home.stat.satisfaction"),
    },
  ];

  return (
    <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4 sm:px-6">
      <ScaleIn>
        <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-success uppercase tracking-widest">En direct</span>
            </div>
            <span className="text-[11px] text-muted">Données mises à jour toutes les 5 minutes</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {items.map((stat, i) => (
              <div key={i} className="text-center">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  duration={2.5}
                  className="text-3xl sm:text-4xl font-bold text-primary font-heading"
                />
                <p className="text-sm text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </ScaleIn>
    </section>
  );
}
/* ─── Activity ticker ─── */
const TICKER_ITEMS = [
  "+229 97 ●● ●● ●● — Signalé 6 fois",
  "Confirmé — Faux conseiller bancaire",
  "+229 61 ●● ●● ●● — Signalé à l'instant",
  "Alerte — SMS frauduleux Mobile Money",
  "+229 95 ●● ●● ●● — Signalé 3 fois",
  "Blacklisté — Usurpation d'identité",
  "+229 66 ●● ●● ●● — Nouveau signalement",
  "Alerte — Faux recrutement WhatsApp",
];

function ActivityTicker() {
  return (
    <div className="bg-primary/5 border-y border-primary/10 py-2.5 overflow-hidden">
      <div className="flex gap-14 whitespace-nowrap animate-marquee">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="text-xs text-primary/60 font-medium shrink-0 tracking-wide">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Live activity toast ─── */
const LIVE_ACTIVITIES = [
  { type: "alert",   label: "Nouveau signalement", detail: "+229 97 ●● ●● ●●",    loc: "Cotonou" },
  { type: "success", label: "Arnaque confirmée",    detail: "Numéro ajouté à la base", loc: "Porto-Novo" },
  { type: "search",  label: "Recherche effectuée",  detail: "+229 61 ●● ●● ●●",   loc: "Parakou" },
  { type: "warning", label: "SMS suspect signalé",  detail: "Faux Mobile Money",   loc: "Bohicon" },
  { type: "success", label: "Signalement validé",   detail: "Usurpation d'identité", loc: "Abomey" },
];

function LiveActivityToast() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const first = setTimeout(() => setShow(true), 4000);
    const iv = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % LIVE_ACTIVITIES.length);
        setShow(true);
      }, 500);
    }, 7000);
    return () => { clearTimeout(first); clearInterval(iv); };
  }, []);

  const a = LIVE_ACTIVITIES[idx];

  const iconNode = a.type === "success" ? (
    <span className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  ) : a.type === "search" ? (
    <span className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </span>
  ) : a.type === "warning" ? (
    <span className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    </span>
  ) : (
    <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </span>
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -24, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -24, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-8 left-6 z-50 hidden lg:flex items-start gap-3 bg-white rounded-2xl shadow-xl border border-border/60 px-4 py-3 max-w-[260px]"
        >
          {iconNode}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground truncate">{a.label}</span>
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </div>
            <p className="text-[11px] text-muted mt-0.5 truncate">{a.detail}</p>
            <p className="text-[11px] text-muted/70">{a.loc} · à l'instant</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

