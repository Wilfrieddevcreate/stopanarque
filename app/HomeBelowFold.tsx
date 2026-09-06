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
import {
  StepIllustration1,
  StepIllustration2,
  StepIllustration3,
  CommunityIllustration,
} from "@/components/Illustrations";
import { useI18n } from "@/lib/i18n/context";
import { stripHtml } from "@/lib/content";
import type { Article } from "./HomeView";

export function HomeBelowFold({ articles }: { articles: Article[] }) {
  return (
    <>
      <HowItWorks />
      <WhyReport />
      <ScamTypes />
      <TrustSection />
      <LatestNews articles={articles} />
      <FAQ />
      <CTASection />
    </>
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

        <div className="relative">
          {/* Connector line — CSS grow-x animation */}
          <div className="hidden md:block absolute top-24 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5">
            <div className="grow-x h-full bg-primary/20" style={{ animationDelay: ".3s" }} />
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {[
              { step: 1, illustration: <StepIllustration1 />, title: t("how.step1.title"), desc: t("how.step1.desc") },
              { step: 2, illustration: <StepIllustration2 />, title: t("how.step2.title"), desc: t("how.step2.desc") },
              { step: 3, illustration: <StepIllustration3 />, title: t("how.step3.title"), desc: t("how.step3.desc") },
            ].map((item) => (
              <StaggerItem key={item.step}>
                {/* CSS hover replaces motion.div whileHover={{ y: -6 }} */}
                <div className="relative bg-white rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 group">
                  <div className="flex items-center justify-center mb-6">
                    {/* CSS hover replaces motion.div whileHover={{ rotate: 5, scale: 1.05 }} */}
                    <div className="relative group-hover:rotate-[5deg] group-hover:scale-105 transition-transform duration-200">
                      {item.illustration}
                      <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground text-center mb-3">{item.title}</h3>
                  <p className="text-muted leading-relaxed text-center">{item.desc}</p>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 -z-10" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

/* ─── Why report ─── */
const ALL_NOTIFS = [
  { type: "danger",  icon: "!", title: "Appel suspect détecté",    sub: "+229 97 ●● ●● ●● · Signalé 4 fois", time: "à l'instant" },
  { type: "warning", icon: "?", title: "SMS frauduleux signalé",   sub: "Faux Mobile Money — Vérification",   time: "il y a 1 min" },
  { type: "success", icon: "+", title: "Arnaque confirmée",        sub: "Numéro ajouté à la base",            time: "il y a 3 min" },
  { type: "danger",  icon: "!", title: "Usurpation d'identité",    sub: "+229 61 ●● ●● ●● · Nouveau",        time: "à l'instant" },
  { type: "warning", icon: "?", title: "Faux conseiller bancaire", sub: "UBA Bénin — Signalé 7 fois",        time: "il y a 2 min" },
];

function WhyReport() {
  const { t } = useI18n();
  const [topIdx, setTopIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTopIdx((i) => (i + 1) % ALL_NOTIFS.length), 3800);
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
              {t("why.title1")}<br />
              <span className="text-primary">{t("why.title2")}</span><br />
              {t("why.title3")}
            </h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Les arnaques téléphoniques touchent des millions de personnes chaque
              année. En signalant un numéro suspect, vous contribuez à une base
              de données collective qui protège toute la communauté.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { value: "68%",   text: t("why.stat1") },
                { value: "500M",  text: t("why.stat2") },
                { value: "3 min", text: t("why.stat3") },
              ].map((item, i) => (
                <FadeInUp key={i} delay={i * 0.1}>
                  <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-border">
                    <span className="text-2xl font-bold text-primary shrink-0 w-20 text-center">{item.value}</span>
                    <p className="text-sm text-muted">{item.text}</p>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </SlideInLeft>

          <SlideInRight>
            <div className="space-y-6">
              <div className="flex justify-center">
                <CommunityIllustration />
              </div>

              <div className="relative">
                {/* CSS hover replaces motion.div whileHover={{ rotate: -2, scale: 1.02 }} */}
                <div className="bg-white rounded-3xl shadow-2xl border border-border p-6 max-w-sm mx-auto hover:rotate-[-2deg] hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>

                  {/* Notification carousel — framer-motion needed for AnimatePresence */}
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
                            notif.type === "danger"  ? "bg-danger/5 border-danger/20" :
                            notif.type === "warning" ? "bg-accent/10 border-accent/30" :
                                                       "bg-primary/5 border-primary/20"
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

                  {/* Static notifications below — plain div, no framer-motion */}
                  {[ALL_NOTIFS[(topIdx + 1) % ALL_NOTIFS.length], ALL_NOTIFS[(topIdx + 2) % ALL_NOTIFS.length]].map((notif, i) => (
                    <div
                      key={`static-${i}`}
                      className={`mb-3 p-4 rounded-xl border ${
                        notif.type === "danger"  ? "bg-danger/5 border-danger/20" :
                        notif.type === "warning" ? "bg-accent/10 border-accent/30" :
                                                   "bg-primary/5 border-primary/20"
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
                    </div>
                  ))}
                </div>

                {/* Decorative blobs — CSS animation replaces motion.div animate repeat:Infinity */}
                <div className="animate-float-up absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-2xl -z-10" />
                <div className="animate-float-down absolute -bottom-4 -left-4 w-16 h-16 bg-primary/5 rounded-2xl -z-10" />
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
    {
      icon: <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" /></svg>,
      name: t("home.scam.1.name"), desc: t("home.scam.1.desc"),
    },
    {
      icon: <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2" ry="2" strokeWidth={1.5} /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2} strokeLinecap="round" /></svg>,
      name: t("home.scam.2.name"), desc: t("home.scam.2.desc"),
    },
    {
      icon: <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>,
      name: t("home.scam.3.name"), desc: t("home.scam.3.desc"),
    },
    {
      icon: <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18M12 6v12M7 6h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>,
      name: t("home.scam.4.name"), desc: t("home.scam.4.desc"),
    },
    {
      icon: <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth={1.5} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8M12 17v4" /></svg>,
      name: t("home.scam.5.name"), desc: t("home.scam.5.desc"),
    },
    {
      icon: <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      name: t("home.scam.6.name"), desc: t("home.scam.6.desc"),
    },
  ];

  return (
    <section className="py-24 bg-gray-50/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t("scam.label")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t("scam.title")}</h2>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">{t("scam.subtitle")}</p>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {types.map((type) => (
            <StaggerItem key={type.name}>
              <div className="bg-white rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default">
                <span className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-4">{type.icon}</span>
                <h3 className="font-semibold text-foreground text-lg">{type.name}</h3>
                <p className="text-sm text-muted mt-1">{type.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp className="mt-10 text-center">
          <Link href="/arnaques" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors">
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
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t("trust.title")}</h2>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: t("trust.1.title"), desc: t("trust.1.desc") },
            { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", title: t("trust.2.title"), desc: t("trust.2.desc") },
            { icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3", title: t("trust.3.title"), desc: t("trust.3.desc") },
          ].map((item) => (
            <StaggerItem key={item.title}>
              {/* CSS hover replaces motion.div whileHover={{ y: -4 }} */}
              <div className="bg-white rounded-2xl p-8 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
                {/* CSS hover replaces motion.div whileHover rotate sequence */}
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:rotate-6 transition-transform duration-300">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted leading-relaxed">{item.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─── Latest news ─── */
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
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t("news.title")}</h2>
            <p className="mt-3 text-lg text-muted max-w-xl">{t("news.subtitle")}</p>
          </div>
          <Link href="/actualites" className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all shrink-0">
            {t("news.see_all")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </FadeInUp>

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
                <div className="group bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col h-full overflow-hidden">
                  {article.coverImage && (
                    <div className="relative h-44 w-full overflow-hidden shrink-0">
                      <Image
                        src={article.coverImage}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                      <Link href={`/actualites/${article.slug}`}>{title}</Link>
                    </h3>
                    <p className="text-muted text-sm leading-relaxed line-clamp-3 flex-1">{excerpt}</p>
                    <Link href={`/actualites/${article.slug}`} className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold mt-5 hover:gap-2.5 transition-all">
                      {t("news.read_more")}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeInUp className="mt-10 text-center sm:hidden">
          <Link href="/actualites" className="inline-flex items-center gap-2 text-primary font-semibold">
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
    { q: t("faq.1.q"), a: t("faq.1.a") },
    { q: t("faq.2.q"), a: t("faq.2.a") },
    { q: t("faq.3.q"), a: t("faq.3.a") },
    { q: t("faq.4.q"), a: t("faq.4.a") },
  ];
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t("faq.label")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t("faq.title")}</h2>
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
    <motion.div layout className="bg-white rounded-2xl border border-border overflow-hidden hover:border-primary/20 transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left">
        <span className="font-semibold text-foreground pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-muted shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
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
          {/* CSS hover replaces motion.div whileHover={{ scale: 1.01 }} */}
          <div className="relative bg-linear-to-br from-primary to-primary-dark rounded-3xl p-10 sm:p-16 text-center overflow-hidden hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <div className="flex-1 bg-success" />
              <div className="flex-1 bg-accent" />
              <div className="flex-1 bg-primary" />
            </div>

            <div className="relative">
              {/* CSS animate-pulse replaces motion.div animate={{ scale: [1,1.1,1] }} repeat:Infinity */}
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t("cta.title")}</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{t("cta.text")}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* CSS hover/active replaces motion.div whileHover + whileTap */}
                <Link
                  href="/signaler"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-foreground px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl hover:scale-105 active:scale-[0.97]"
                >
                  {t("cta.button")}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/rechercher" className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors">
                  {t("cta.link")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </ScaleIn>
      </div>
    </section>
  );
}
