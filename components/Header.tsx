"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoFull } from "@/components/Logo";
import { LangSwitcher } from "@/components/LangSwitcher";
import { useI18n } from "@/lib/i18n/context";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();

  const learnItems = [
    { href: "/arnaques",  label: t("nav.scams")  },
    { href: "/conseils",  label: t("nav.advice")  },
    { href: "/actualites", label: t("nav.news")   },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <LogoFull />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/">{t("nav.home")}</NavLink>
            <NavLink href="/signaler">{t("nav.report")}</NavLink>
            <NavLink href="/rechercher">{t("nav.search")}</NavLink>
            <NavLink href="/suivi">{t("nav.tracking")}</NavLink>
            <NavDropdown label={t("nav.learn")} items={learnItems} />
            <LangSwitcher />
          </div>

          {/* Mobile burger */}
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

        {/* Mobile menu — tous les liens à plat */}
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
                <MobileNavLink href="/"          onClick={() => setMenuOpen(false)}>{t("nav.home")}</MobileNavLink>
                <MobileNavLink href="/signaler"  onClick={() => setMenuOpen(false)}>{t("nav.report")}</MobileNavLink>
                <MobileNavLink href="/rechercher" onClick={() => setMenuOpen(false)}>{t("nav.search")}</MobileNavLink>
                <MobileNavLink href="/suivi"     onClick={() => setMenuOpen(false)}>{t("nav.tracking")}</MobileNavLink>
                <div className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">{t("nav.learn")}</div>
                <MobileNavLink href="/arnaques"  onClick={() => setMenuOpen(false)}>{t("nav.scams")}</MobileNavLink>
                <MobileNavLink href="/conseils"  onClick={() => setMenuOpen(false)}>{t("nav.advice")}</MobileNavLink>
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

function NavDropdown({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-foreground hover:bg-gray-50 transition-colors"
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Toujours monté (masqué quand fermé) : sinon ces liens n'existent dans
          aucune page servie et les cibles du menu deviennent orphelines. */}
      <motion.div
        hidden={!open}
        initial={false}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : -6, scale: open ? 1 : 0.97 }}
        transition={{ duration: 0.15 }}
        className="absolute top-full right-0 mt-1.5 min-w-[170px] bg-white rounded-xl shadow-lg border border-border py-1.5 z-50"
      >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-600 hover:text-foreground hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
      </motion.div>
    </div>
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
