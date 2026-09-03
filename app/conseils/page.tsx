"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/MotionDiv";
import { useI18n } from "@/lib/i18n/context";
import { ADVICE_SECTIONS, getAdviceTranslation } from "@/lib/i18n/advice";

const TABS = [
  { id: "prevenir", labelKey: "advice.tab.prevent", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { id: "reconnaitre", labelKey: "advice.tab.recognize", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { id: "reagir", labelKey: "advice.tab.react", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const EMERGENCY = [
  { label: "Police Secours", value: "117", icon: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { label: "MTN Service Client", value: "123", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
  { label: "Moov Service Client", value: "155", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
  { label: "OCRC Cybercriminalité", value: "+229 21 30 84 50", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

const SECTION_IDS = Object.keys(ADVICE_SECTIONS) as TabId[];

/**
 * Une section de conseils : toutes sont montées, seule l'active est visible.
 */
function AdviceSection({
  tabId,
  active,
  ta,
  t,
}: {
  tabId: TabId;
  active: boolean;
  ta: (key: string) => string;
  t: (key: string) => string;
}) {
  const sectionData = ADVICE_SECTIONS[tabId];
  return (
    <motion.div
      id={`section-${tabId}`}
      role="region"
      aria-labelledby={`onglet-${tabId}`}
      hidden={!active}
      initial={false}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 15 }}
      transition={{ duration: 0.25 }}
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          {ta(sectionData.titleKey)}
        </h2>
        <p className="mt-2 text-muted max-w-xl mx-auto">
          {ta(sectionData.subtitleKey)}
        </p>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionData.cards.map((card) => (
          <StaggerItem key={card.titleKey}>
            <motion.div
              whileHover={{ y: -3 }}
              className={`rounded-2xl border p-6 transition-shadow hover:shadow-lg ${
                card.type === "do"
                  ? "bg-success/5 border-success/20"
                  : card.type === "dont"
                  ? "bg-primary/5 border-primary/20"
                  : "bg-white border-border"
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  card.type === "do"
                    ? "bg-success/15"
                    : card.type === "dont"
                    ? "bg-primary/15"
                    : "bg-foreground/10"
                }`}>
                  <svg className={`w-5 h-5 ${
                    card.type === "do"
                      ? "text-success"
                      : card.type === "dont"
                      ? "text-primary"
                      : "text-foreground"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={card.icon} />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-foreground">{ta(card.titleKey)}</h3>
                    {card.type === "do" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded-full">
                        {t("advice.todo")}
                      </span>
                    )}
                    {card.type === "dont" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {t("advice.danger")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{ta(card.descKey)}</p>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </motion.div>
  );
}

export default function ConseilsPage() {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<TabId>("prevenir");

  function ta(key: string) {
    return getAdviceTranslation(key, locale);
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeInUp className="text-center mb-12">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            {t("advice.label")}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground">
            {t("advice.title")}
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {t("advice.subtitle")}
          </p>
        </FadeInUp>

        {/* Tabs.
            En dessous de `sm` (640px), "Reconnaître" + son icône dépasse la
            largeur des petits téléphones (~360px et moins) : la barre à largeur
            libre (inline-flex) débordait du viewport des deux côtés, rendant
            "Prévenir" et "Réagir" inatteignables. La grille à 3 colonnes égales
            (minmax(0,1fr)) ne peut structurellement pas dépasser son conteneur ;
            le libellé s'enroule sur deux lignes si besoin plutôt que de sortir
            de la pastille. À partir de `sm`, la barre reprend sa largeur libre
            d'origine, identique à avant. */}
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-3 gap-1 w-full max-w-sm rounded-2xl bg-gray-100 p-1.5 sm:inline-flex sm:w-auto sm:max-w-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`onglet-${tab.id}`}
                aria-expanded={activeTab === tab.id}
                aria-controls={`section-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1.5 py-2 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold text-center leading-tight transition-colors ${
                  activeTab === tab.id ? "text-white" : "text-gray-500 hover:text-foreground"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-xl shadow-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <svg className="w-4 h-4 relative z-10 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span className="relative z-10">{t(tab.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {/* Les trois sections sont rendues, les inactives masquées en CSS.
            Avant, seule la section active existait dans le DOM : 15 conseils sur
            23 n'étaient jamais servis alors que le JSON-LD les décrivait. */}
        {SECTION_IDS.map((tabId) => (
          <AdviceSection key={tabId} tabId={tabId} active={tabId === activeTab} ta={ta} t={t} />
        ))}

        {/* Emergency numbers */}
        <FadeInUp className="mt-20">
          <div className="bg-foreground rounded-3xl p-8 sm:p-10 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
            </div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t("advice.emergency.title")}</h2>
              <p className="text-white/60 mb-8">{t("advice.emergency.subtitle")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {EMERGENCY.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/60">{item.label}</p>
                      <p className="text-lg font-bold font-mono">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* CTA */}
        <FadeInUp className="mt-12 text-center">
          <p className="text-muted mb-4">{t("advice.cta")}</p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              href="/signaler"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg shadow-primary/25"
            >
              {t("cta.button")}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </FadeInUp>
      </div>
    </div>
  );
}
