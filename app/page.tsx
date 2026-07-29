"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FadeInUp,
  ScaleIn,
  SlideInLeft,
  SlideInRight,
  StaggerContainer,
  StaggerItem,
} from "@/components/MotionDiv";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HeroBackground } from "@/components/HeroBackground";
import { AlertBanner } from "@/components/AlertBanner";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <AlertBanner />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <WhyReport />
      <ScamTypes />
      <TrustSection />
      <LatestNews />
      <FAQ />
      <CTASection />
    </div>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  const { t } = useI18n();
  return (
    <section className="relative min-h-[90vh] flex items-center bg-linear-to-b from-primary/5 via-white to-white">
      <HeroBackground />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm text-primary px-5 py-2 rounded-full text-sm font-medium mb-8 border border-primary/20"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-accent rounded-full"
            />
            {t("hero.badge")}
          </motion.div>

          {/* Benin flag accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex h-1 w-24 mx-auto mb-8 rounded-full overflow-hidden"
          >
            <div className="flex-1 bg-success" />
            <div className="flex-1 bg-accent" />
            <div className="flex-1 bg-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
          >
            {t("hero.title1")}
            <br />
            {t("hero.title2")}{" "}
            <motion.span
              className="relative inline-block text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t("hero.title3")}
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              >
                <motion.path
                  d="M2 8 Q50 2 100 7 Q150 12 198 4"
                  stroke="#E8112D"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                />
              </motion.svg>
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/signaler"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-semibold text-base transition-colors shadow-xl shadow-primary/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {t("hero.cta.report")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/rechercher"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-foreground px-8 py-4 rounded-2xl font-semibold text-base transition-colors border border-border shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t("hero.cta.search")}
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats bar ─── */
function StatsBar() {
  return (
    <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4 sm:px-6">
      <ScaleIn>
        <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: 15847, suffix: "+", label: "Signalements reçus" },
              { value: 8923, suffix: "+", label: "Arnaques confirmées" },
              { value: 45, suffix: "k+", label: "Recherches effectuées" },
              { value: 98, suffix: "%", label: "Taux de satisfaction" },
            ].map((stat, i) => (
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

/* ─── How it works ─── */
function HowItWorks() {
  const { t } = useI18n();
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center mb-20">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t("how.label")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground">
            {t("how.title")}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {t("how.subtitle")}
          </p>
        </FadeInUp>

        {/* Timeline */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-24 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5">
            <motion.div
              className="h-full bg-primary/20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {[
              {
                step: 1,
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                title: t("how.step1.title"),
                desc: t("how.step1.desc"),
              },
              {
                step: 2,
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                title: t("how.step2.title"),
                desc: t("how.step2.desc"),
              },
              {
                step: 3,
                icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                title: t("how.step3.title"),
                desc: t("how.step3.desc"),
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="relative bg-white rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-center justify-center mb-6">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      className="relative w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                        {item.step}
                      </span>
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground text-center mb-3">{item.title}</h3>
                  <p className="text-muted leading-relaxed text-center">{item.desc}</p>

                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10" />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

/* ─── Why report ─── */
function WhyReport() {
  const { t } = useI18n();
  return (
    <section className="py-24 bg-linear-to-b from-primary/5 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <SlideInLeft>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              {t("why.label")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              {t("why.title1")}
              <br />
              <span className="text-primary">{t("why.title2")}</span>
              <br />
              {t("why.title3")}
            </h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Les arnaques téléphoniques touchent des millions de personnes chaque
              année. En signalant un numéro suspect, vous contribuez à une base
              de données collective qui protège toute la communauté.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { value: "68%", text: "des Béninois ont déjà été contactés par un arnaqueur" },
                { value: "500M", text: "FCFA de préjudice estimé par an" },
                { value: "3 min", text: "suffisent pour déposer un signalement" },
              ].map((item, i) => (
                <FadeInUp key={i} delay={i * 0.1}>
                  <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-border">
                    <span className="text-2xl font-bold text-primary shrink-0 w-20 text-center">
                      {item.value}
                    </span>
                    <p className="text-sm text-muted">{item.text}</p>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </SlideInLeft>

          <SlideInRight>
            <div className="relative">
              <motion.div
                whileHover={{ rotate: -2, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white rounded-3xl shadow-2xl border border-border p-6 max-w-sm mx-auto"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>

                {[
                  { type: "danger", icon: "!", title: "Appel suspect détecté", sub: "+229 97 12 34 56 - Signalé 4 fois", time: "Il y a 2 min" },
                  { type: "warning", icon: "?", title: "SMS frauduleux signalé", sub: "Faux Mobile Money - Vérification", time: "Il y a 15 min" },
                  { type: "success", icon: "✓", title: "Arnaque confirmée", sub: "Numéro ajouté à la base", time: "Il y a 1h" },
                ].map((notif, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.2 }}
                    className={`mb-3 p-4 rounded-xl border ${
                      notif.type === "danger"
                        ? "bg-danger/5 border-danger/20"
                        : notif.type === "warning"
                        ? "bg-accent/10 border-accent/30"
                        : "bg-primary/5 border-primary/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                          notif.type === "danger"
                            ? "bg-danger"
                            : notif.type === "warning"
                            ? "bg-accent-dark"
                            : "bg-primary"
                        }`}
                      >
                        {notif.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                        <p className="text-xs text-muted mt-0.5">{notif.sub}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{notif.time}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-2xl -z-10"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/5 rounded-2xl -z-10"
              />
            </div>
          </SlideInRight>
        </div>
      </div>
    </section>
  );
}

/* ─── Scam types ─── */
function ScamTypes() {
  const { t } = useI18n();
  const types = [
    { icon: "📞", name: "Appel frauduleux", desc: "Faux conseillers, faux services publics" },
    { icon: "📱", name: "SMS frauduleux", desc: "Faux Mobile Money, faux remboursements" },
    { icon: "🎣", name: "Phishing", desc: "Faux sites web, vol d'identifiants" },
    { icon: "🏦", name: "Arnaque bancaire", desc: "Faux conseillers bancaires" },
    { icon: "💻", name: "Faux support tech", desc: "Faux techniciens, prise en main à distance" },
    { icon: "👤", name: "Usurpation d'identité", desc: "Vol d'identité, faux agents" },
  ];

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t("scam.label")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {t("scam.title")}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {t("scam.subtitle")}
          </p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {types.map((type) => (
            <StaggerItem key={type.name}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-shadow cursor-default"
              >
                <span className="text-3xl mb-3 block">{type.icon}</span>
                <h3 className="font-semibold text-foreground text-lg">{type.name}</h3>
                <p className="text-sm text-muted mt-1">{type.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── Trust ─── */
function TrustSection() {
  const { t } = useI18n();
  return (
    <section className="py-24 bg-linear-to-b from-primary/5 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t("trust.label")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {t("trust.title")}
          </h2>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
              title: t("trust.1.title"),
              desc: t("trust.1.desc"),
            },
            {
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
              title: t("trust.2.title"),
              desc: t("trust.2.desc"),
            },
            {
              icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
              title: t("trust.3.title"),
              desc: t("trust.3.desc"),
            },
          ].map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-all"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                  className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5"
                >
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </motion.div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── Latest News ─── */
type Article = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  category: string;
  createdAt: string;
};

const CAT_COLORS: Record<string, string> = {
  Alerte: "bg-primary/10 text-primary",
  Conseil: "bg-success/10 text-success",
  Actualité: "bg-accent/20 text-accent-dark",
  Communiqué: "bg-foreground/10 text-foreground",
};

function LatestNews() {
  const { t, locale } = useI18n();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles?limit=3")
      .then((r) => r.json())
      .then((data) => setArticles(Array.isArray(data?.articles) ? data.articles.slice(0, 3) : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && articles.length === 0) return null;

  return (
    <section className="py-24 bg-linear-to-b from-white to-primary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="flex items-end justify-between mb-16">
          <div>
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              {t("news.label")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t("news.title")}
            </h2>
            <p className="mt-3 text-lg text-muted max-w-xl">
              {t("news.subtitle")}
            </p>
          </div>
          <Link
            href="/actualites"
            className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all shrink-0"
          >
            {t("news.see_all")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </FadeInUp>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
                <div className="h-6 bg-gray-100 rounded mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const title = locale === "en" && article.titleEn ? article.titleEn : article.title;
              const excerpt = locale === "en" && article.excerptEn ? article.excerptEn : article.excerpt;
              const date = new Date(article.createdAt).toLocaleDateString(
                locale === "en" ? "en-GB" : "fr-FR",
                { day: "numeric", month: "long", year: "numeric" }
              );
              return (
                <StaggerItem key={article.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all flex flex-col h-full overflow-hidden"
                  >
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CAT_COLORS[article.category] ?? "bg-gray-100 text-gray-600"}`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-muted">{date}</span>
                      </div>
                      <h3 className="font-bold text-foreground text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-muted text-sm leading-relaxed line-clamp-3 flex-1">
                        {excerpt}
                      </p>
                      <Link
                        href={`/actualites/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold mt-5 hover:gap-2.5 transition-all"
                      >
                        {t("news.read_more")}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        <FadeInUp className="mt-10 text-center sm:hidden">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-primary font-semibold"
          >
            {t("news.see_all")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </FadeInUp>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const { t } = useI18n();
  const faqs = [
    {
      q: "Est-ce que mon signalement est anonyme ?",
      a: "Oui, absolument. Votre identité n'est jamais révélée publiquement. L'email est optionnel et sert uniquement à vous informer du suivi.",
    },
    {
      q: "Que se passe-t-il après mon signalement ?",
      a: "Votre signalement est analysé par nos équipes. Si l'arnaque est confirmée après recoupement, le numéro est ajouté à notre base de données et peut être consulté par tous.",
    },
    {
      q: "Combien de temps prend le traitement ?",
      a: "La plupart des signalements sont traités sous 48h. Les cas complexes nécessitant des vérifications supplémentaires peuvent prendre jusqu'à 7 jours.",
    },
    {
      q: "Les résultats de recherche révèlent-ils des informations personnelles ?",
      a: "Non, jamais. La recherche affiche uniquement le nombre de signalements et le niveau de risque. Aucun détail personnel n'est visible.",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t("faq.label")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {t("faq.title")}
          </h2>
        </FadeInUp>

        <StaggerContainer className="space-y-4">
          {faqs.map((faq, i) => (
            <StaggerItem key={i}>
              <FAQItem question={faq.q} answer={faq.a} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-border overflow-hidden hover:border-primary/20 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-semibold text-foreground pr-4">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-muted leading-relaxed">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

/* ─── CTA ─── */
function CTASection() {
  const { t } = useI18n();
  return (
    <section className="py-24 bg-linear-to-b from-white to-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScaleIn>
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative bg-linear-to-br from-primary to-primary-dark rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {/* Benin flag accent */}
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <div className="flex-1 bg-success" />
              <div className="flex-1 bg-accent" />
              <div className="flex-1 bg-primary" />
            </div>

            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {t("cta.title")}
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                {t("cta.text")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/signaler"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-foreground px-8 py-4 rounded-2xl font-bold text-base transition-colors shadow-xl"
                  >
                    {t("cta.button")}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
                <Link
                  href="/rechercher"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors"
                >
                  {t("cta.link")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </ScaleIn>
      </div>
    </section>
  );
}
