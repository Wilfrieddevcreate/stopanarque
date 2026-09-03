"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
import { HomeJsonLd } from "@/components/JsonLd";
import { stripHtml } from "@/lib/content";
import { HeroIllustration, StepIllustration1, StepIllustration2, StepIllustration3, CommunityIllustration } from "@/components/Illustrations";

export function HomeView({ articles }: { articles: Article[] }) {
  return (
    <div className="overflow-hidden">
      <HomeJsonLd />
      <AlertBanner />
      <LiveActivityToast />
      <HeroSection />
      <StatsBar />
      <ActivityTicker />
      <HowItWorks />
      <WhyReport />
      <ScamTypes />
      <TrustSection />
      <LatestNews articles={articles} />
      <FAQ />
      <CTASection />
    </div>
  );
}

/* ─── Hero ─── */
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
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-white text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold mb-7 border border-primary/20 shadow-sm"
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
              {t("hero.badge")}
            </motion.div>

            {/* Benin flag bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="flex h-[3px] w-14 mb-5 rounded-full overflow-hidden"
              style={{ transformOrigin: "left" }}
            >
              <div className="flex-1 bg-success" />
              <div className="flex-1 bg-accent" />
              <div className="flex-1 bg-primary" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="text-[2.75rem] sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-900 leading-[1.1]"
            >
              <span className="block">{t("hero.title1")}</span>
              <span className="block">
                {t("hero.title2")}{" "}
                <motion.span
                  className="relative inline-block text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  {t("hero.title3")}
                  <motion.svg
                    className="absolute -bottom-1.5 left-0 w-full"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.75, duration: 0.9, ease: "easeOut" }}
                  >
                    <motion.path
                      d="M2 7 Q50 2 100 6 Q150 10 198 3"
                      stroke="#E8112D"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.75, duration: 0.9, ease: "easeOut" }}
                    />
                  </motion.svg>
                </motion.span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="mt-5 text-[0.95rem] text-slate-500 leading-relaxed max-w-sm"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="mt-8 flex flex-row items-center gap-3"
            >
              {/* Primary */}
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/signaler"
                  className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white pl-4 pr-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 shadow-lg shadow-primary/30 hover:shadow-primary/40"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {t("hero.cta.report")}
                  <svg className="w-3.5 h-3.5 shrink-0 translate-x-0 group-hover:translate-x-1 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>

              {/* Secondary */}
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/rechercher"
                  className="group inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 pl-4 pr-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-primary transition-colors duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t("hero.cta.search")}
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust micro-line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-xs text-slate-400 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% gratuit · données sécurisées · Bénin
            </motion.p>
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
function StatsBar() {
  const { t } = useI18n();
  const [stats, setStats] = useState<{
    totalReports: number;
    confirmedReports: number;
    totalSearches: number;
  } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fallback = setTimeout(() => setLoaded(true), 3500);
    fetch("/api/statistics")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoaded(true); clearTimeout(fallback); })
      .catch(() => setLoaded(true));
    return () => clearTimeout(fallback);
  }, []);

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
      value: stats ? Math.floor(stats.totalSearches / 1000) : 0,
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
            <span className="text-[11px] text-muted">Données mises à jour en temps réel</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {items.map((stat, i) => (
              <div key={i} className="text-center">
                {stats !== null || loaded || stat.value === 98 ? (
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    duration={2.5}
                    className="text-3xl sm:text-4xl font-bold text-primary font-heading"
                  />
                ) : (
                  <div className="h-10 w-20 mx-auto bg-gray-100 rounded-lg animate-pulse" />
                )}
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
                illustration: <StepIllustration1 />,
                title: t("how.step1.title"),
                desc: t("how.step1.desc"),
              },
              {
                step: 2,
                illustration: <StepIllustration2 />,
                title: t("how.step2.title"),
                desc: t("how.step2.desc"),
              },
              {
                step: 3,
                illustration: <StepIllustration3 />,
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
                    <motion.div whileHover={{ rotate: 5, scale: 1.05 }} className="relative">
                      {item.illustration}
                      <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
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

const ALL_NOTIFS = [
  { type: "danger", icon: "!", title: "Appel suspect détecté", sub: "+229 97 ●● ●● ●● · Signalé 4 fois", time: "à l'instant" },
  { type: "warning", icon: "?", title: "SMS frauduleux signalé", sub: "Faux Mobile Money — Vérification", time: "il y a 1 min" },
  { type: "success", icon: "✓", title: "Arnaque confirmée", sub: "Numéro ajouté à la base", time: "il y a 3 min" },
  { type: "danger", icon: "!", title: "Usurpation d'identité", sub: "+229 61 ●● ●● ●● · Nouveau", time: "à l'instant" },
  { type: "warning", icon: "?", title: "Faux conseiller bancaire", sub: "UBA Bénin — Signalé 7 fois", time: "il y a 2 min" },
];

/* ─── Why report ─── */
function WhyReport() {
  const { t } = useI18n();
  const [topIdx, setTopIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTopIdx(i => (i + 1) % ALL_NOTIFS.length), 3800);
    return () => clearInterval(iv);
  }, []);
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
                { value: "68%", text: t("why.stat1") },
                { value: "500M", text: t("why.stat2") },
                { value: "3 min", text: t("why.stat3") },
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
            <div className="space-y-6">
              {/* Community illustration */}
              <div className="flex justify-center">
                <CommunityIllustration />
              </div>

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

                {/* Top notification — cycles automatically */}
                <AnimatePresence mode="popLayout">
                  {(() => {
                    const notif = ALL_NOTIFS[topIdx];
                    return (
                      <motion.div
                        key={topIdx}
                        initial={{ opacity: 0, y: -12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.97 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className={`mb-3 p-4 rounded-xl border ${
                          notif.type === "danger"
                            ? "bg-danger/5 border-danger/20"
                            : notif.type === "warning"
                            ? "bg-accent/10 border-accent/30"
                            : "bg-primary/5 border-primary/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 ${notif.type === "danger" ? "bg-danger" : notif.type === "warning" ? "bg-accent-dark" : "bg-primary"}`}>
                            {notif.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" />
                            </div>
                            <p className="text-xs text-muted mt-0.5">{notif.sub}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 shrink-0">{notif.time}</span>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {/* Bottom 2 — static */}
                {[ALL_NOTIFS[(topIdx + 1) % ALL_NOTIFS.length], ALL_NOTIFS[(topIdx + 2) % ALL_NOTIFS.length]].map((notif, i) => (
                  <motion.div
                    key={`static-${i}`}
                    className={`mb-3 p-4 rounded-xl border ${
                      notif.type === "danger"
                        ? "bg-danger/5 border-danger/20"
                        : notif.type === "warning"
                        ? "bg-accent/10 border-accent/30"
                        : "bg-primary/5 border-primary/20"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 ${notif.type === "danger" ? "bg-danger" : notif.type === "warning" ? "bg-accent-dark" : "bg-primary"}`}>
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
    { icon: "📞", name: t("home.scam.1.name"), desc: t("home.scam.1.desc") },
    { icon: "📱", name: t("home.scam.2.name"), desc: t("home.scam.2.desc") },
    { icon: "🎣", name: t("home.scam.3.name"), desc: t("home.scam.3.desc") },
    { icon: "🏦", name: t("home.scam.4.name"), desc: t("home.scam.4.desc") },
    { icon: "💻", name: t("home.scam.5.name"), desc: t("home.scam.5.desc") },
    { icon: "👤", name: t("home.scam.6.name"), desc: t("home.scam.6.desc") },
  ];

  return (
    <section className="py-24 bg-gray-50/70">
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

        <FadeInUp className="mt-10 text-center">
          <Link
            href="/arnaques"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            {t("scam.cta.all")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </FadeInUp>
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

const CAT_COLORS: Record<string, string> = {
  Alerte: "bg-primary/10 text-primary",
  Conseil: "bg-success/10 text-success",
  Actualité: "bg-accent/20 text-accent-dark",
  Communiqué: "bg-foreground/10 text-foreground",
};

function LatestNews({ articles }: { articles: Article[] }) {
  const { t, locale } = useI18n();

  if (articles.length === 0) return null;

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

        {(
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const title = stripHtml(
                locale === "en" && article.titleEn ? article.titleEn :
                locale === "fon" && article.titleFon ? article.titleFon :
                locale === "yo" && article.titleYo ? article.titleYo :
                article.title
              );
              const excerpt = stripHtml(
                locale === "en" && article.excerptEn ? article.excerptEn :
                locale === "fon" && article.excerptFon ? article.excerptFon :
                locale === "yo" && article.excerptYo ? article.excerptYo :
                article.excerpt
              );
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
                    {article.coverImage && (
                      <div className="relative h-44 w-full overflow-hidden shrink-0">
                        <Image
                          src={article.coverImage}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
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
      q: t("faq.1.q"),
      a: t("faq.1.a"),
    },
    {
      q: t("faq.2.q"),
      a: t("faq.2.a"),
    },
    {
      q: t("faq.3.q"),
      a: t("faq.3.a"),
    },
    {
      q: t("faq.4.q"),
      a: t("faq.4.a"),
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

/* ─── Activity ticker ─── */
const TICKER_ITEMS = [
  "● +229 97 ●● ●● ●● — Signalé 6 fois",
  "✅ Arnaque confirmée — Faux conseiller bancaire",
  "● +229 61 ●● ●● ●● — Signalé à l'instant",
  "⚠️ SMS frauduleux — Mobile Money",
  "● +229 95 ●● ●● ●● — Signalé 3 fois",
  "✅ Numéro blacklisté — Usurpation d'identité",
  "● +229 66 ●● ●● ●● — Nouveau signalement",
  "⚠️ Faux recrutement — WhatsApp",
];

function ActivityTicker() {
  return (
    <div className="bg-primary/5 border-y border-primary/10 py-2.5 overflow-hidden">
      <motion.div
        className="flex gap-14 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="text-xs text-primary/60 font-medium shrink-0 tracking-wide">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Live activity toast ─── */
const LIVE_ACTIVITIES = [
  { icon: "🚨", label: "Nouveau signalement", detail: "+229 97 ●● ●● ●●", loc: "Cotonou" },
  { icon: "✅", label: "Arnaque confirmée", detail: "Numéro ajouté à la base", loc: "Porto-Novo" },
  { icon: "🔍", label: "Recherche effectuée", detail: "+229 61 ●● ●● ●●", loc: "Parakou" },
  { icon: "⚠️", label: "SMS suspect signalé", detail: "Faux Mobile Money", loc: "Bohicon" },
  { icon: "✅", label: "Signalement validé", detail: "Usurpation d'identité", loc: "Abomey" },
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
          <span className="text-lg mt-0.5">{a.icon}</span>
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
