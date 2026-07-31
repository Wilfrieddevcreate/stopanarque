"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoFull } from "@/components/Logo";
import { LangSwitcher } from "@/components/LangSwitcher";
import { useI18n } from "@/lib/i18n/context";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <LogoFull />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/">{t("nav.home")}</NavLink>
            <NavLink href="/signaler">{t("nav.report")}</NavLink>
            <NavLink href="/rechercher">{t("nav.search")}</NavLink>
            <NavLink href="/suivi">{t("nav.tracking")}</NavLink>
            <NavLink href="/arnaques">{t("nav.scams")}</NavLink>
            <NavLink href="/conseils">{t("nav.advice")}</NavLink>
            <NavLink href="/actualites">{t("nav.news")}</NavLink>
            <LangSwitcher />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LangSwitcher />
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 space-y-1">
                <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>{t("nav.home")}</MobileNavLink>
                <MobileNavLink href="/signaler" onClick={() => setMenuOpen(false)}>{t("nav.report")}</MobileNavLink>
                <MobileNavLink href="/rechercher" onClick={() => setMenuOpen(false)}>{t("nav.search")}</MobileNavLink>
                <MobileNavLink href="/suivi" onClick={() => setMenuOpen(false)}>{t("nav.tracking")}</MobileNavLink>
                <MobileNavLink href="/arnaques" onClick={() => setMenuOpen(false)}>{t("nav.scams")}</MobileNavLink>
                <MobileNavLink href="/conseils" onClick={() => setMenuOpen(false)}>{t("nav.advice")}</MobileNavLink>
                <MobileNavLink href="/actualites" onClick={() => setMenuOpen(false)}>{t("nav.news")}</MobileNavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-foreground hover:bg-gray-50 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-foreground hover:bg-gray-50 transition-colors"
    >
      {children}
    </Link>
  );
}
