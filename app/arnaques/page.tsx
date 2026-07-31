"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";
import { getScamData } from "@/lib/i18n/arnaques-data";

// ── Config visuelle (non traduite) ────────────────────────────────────────────

const VISUAL_CONFIG: Record<string, {
  color: string;
  badgeColor: string;
  iconColor: string;
  icon: string;
}> = {
  "mobile-money": {
    color: "bg-yellow-50 border-yellow-200",
    badgeColor: "bg-yellow-100 text-yellow-700",
    iconColor: "text-yellow-500",
    icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  "arnaque-bancaire": {
    color: "bg-red-50 border-red-200",
    badgeColor: "bg-red-100 text-red-700",
    iconColor: "text-red-500",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  phishing: {
    color: "bg-orange-50 border-orange-200",
    badgeColor: "bg-orange-100 text-orange-700",
    iconColor: "text-orange-500",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  "faux-vendeur": {
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    iconColor: "text-blue-500",
    icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  },
  "faux-emploi": {
    color: "bg-teal-50 border-teal-200",
    badgeColor: "bg-teal-100 text-teal-700",
    iconColor: "text-teal-500",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  investissement: {
    color: "bg-emerald-50 border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-700",
    iconColor: "text-emerald-500",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  "faux-pret": {
    color: "bg-cyan-50 border-cyan-200",
    badgeColor: "bg-cyan-100 text-cyan-700",
    iconColor: "text-cyan-500",
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  },
  loterie: {
    color: "bg-purple-50 border-purple-200",
    badgeColor: "bg-purple-100 text-purple-700",
    iconColor: "text-purple-500",
    icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
  },
  usurpation: {
    color: "bg-pink-50 border-pink-200",
    badgeColor: "bg-pink-100 text-pink-700",
    iconColor: "text-pink-500",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  romance: {
    color: "bg-rose-50 border-rose-200",
    badgeColor: "bg-rose-100 text-rose-700",
    iconColor: "text-rose-500",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  sextorsion: {
    color: "bg-red-50 border-red-200",
    badgeColor: "bg-red-100 text-red-800",
    iconColor: "text-red-600",
    icon: "M15 10l4.553-2.069A1 1 0 0121 8.883V15a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
  },
  immobilier: {
    color: "bg-stone-50 border-stone-200",
    badgeColor: "bg-stone-100 text-stone-700",
    iconColor: "text-stone-500",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  "bourse-visa": {
    color: "bg-indigo-50 border-indigo-200",
    badgeColor: "bg-indigo-100 text-indigo-700",
    iconColor: "text-indigo-500",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
  },
  medecin: {
    color: "bg-green-50 border-green-200",
    badgeColor: "bg-green-100 text-green-700",
    iconColor: "text-green-500",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  "support-technique": {
    color: "bg-slate-50 border-slate-200",
    badgeColor: "bg-slate-100 text-slate-700",
    iconColor: "text-slate-500",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  "appel-frauduleux": {
    color: "bg-amber-50 border-amber-200",
    badgeColor: "bg-amber-100 text-amber-700",
    iconColor: "text-amber-500",
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  },
  "sms-frauduleux": {
    color: "bg-violet-50 border-violet-200",
    badgeColor: "bg-violet-100 text-violet-700",
    iconColor: "text-violet-500",
    icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  },
};

// ── Composant carte ────────────────────────────────────────────────────────────

function ScamCard({
  id, label, tagline, active, onClick,
}: {
  id: string;
  label: string;
  tagline: string;
  active: boolean;
  onClick: () => void;
}) {
  const v = VISUAL_CONFIG[id];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        active ? `${v.color} border-current shadow-sm` : "bg-white border-border hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-white/60" : "bg-gray-100"}`}>
          <svg className={`w-4 h-4 ${active ? v.iconColor : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={v.icon} />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{label}</p>
          <p className="text-xs text-muted truncate">{tagline}</p>
        </div>
      </div>
    </motion.button>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ArnaquesPage() {
  const { t, locale } = useI18n();
  const scams = getScamData(locale);
  const [activeId, setActiveId] = useState<string>(scams[0].id);
  const active = scams.find((s) => s.id === activeId) ?? scams[0];
  const v = VISUAL_CONFIG[active.id];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <FadeInUp className="text-center mb-12">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t("arnaques.label")}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground">
            {t("arnaques.title")}
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {t("arnaques.subtitle")}
          </p>
        </FadeInUp>

        {/* Layout deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Colonne gauche — liste scrollable */}
          <div className="lg:col-span-2 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {scams.map((scam) => (
                <StaggerItem key={scam.id}>
                  <ScamCard
                    id={scam.id}
                    label={scam.label}
                    tagline={scam.tagline}
                    active={activeId === scam.id}
                    onClick={() => setActiveId(scam.id)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Colonne droite — fiche détaillée */}
          <div className="lg:col-span-3 lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border-2 p-6 sm:p-8 ${v.color}`}
              >
                {/* Titre */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center shrink-0">
                    <svg className={`w-6 h-6 ${v.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={v.icon} />
                    </svg>
                  </div>
                  <div>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1 ${v.badgeColor}`}>
                      {active.tagline}
                    </span>
                    <h2 className="text-xl font-bold text-foreground">{active.label}</h2>
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground/80 leading-relaxed mb-5 text-sm sm:text-base">{active.description}</p>

                {/* Exemple */}
                <div className="bg-white/60 rounded-xl p-4 mb-5 border border-white/80">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                    {t("arnaques.section.example")}
                  </p>
                  <p className="text-sm text-foreground italic">"{active.example}"</p>
                </div>

                {/* Signes */}
                <div className="mb-5">
                  <p className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636z" />
                    </svg>
                    {t("arnaques.section.signs")}
                  </p>
                  <ul className="space-y-1.5">
                    {active.signs.map((sign, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Protection */}
                <div className="mb-7">
                  <p className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {t("arnaques.section.protect")}
                  </p>
                  <ul className="space-y-1.5">
                    {active.protect.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/signaler"
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-semibold text-sm text-center transition-colors shadow-lg shadow-primary/25"
                  >
                    {t("arnaques.cta.report")}
                  </Link>
                  <Link
                    href="/rechercher"
                    className="flex-1 bg-white/70 hover:bg-white text-foreground py-3.5 rounded-xl font-semibold text-sm text-center transition-colors border border-white/80"
                  >
                    {t("arnaques.cta.check")}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* CTA bas de page */}
        <FadeInUp className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl border border-border p-8 sm:p-12">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              {t("arnaques.victim.title")}
            </h2>
            <p className="text-muted mb-6 max-w-xl mx-auto">
              {t("arnaques.victim.text")}
            </p>
            <Link
              href="/signaler"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg shadow-primary/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636z" />
              </svg>
              {t("arnaques.victim.button")}
            </Link>
          </div>
        </FadeInUp>

      </div>
    </div>
  );
}
