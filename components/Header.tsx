"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useId } from "react";
import { LogoFull } from "@/components/Logo";
import { LangSwitcher } from "@/components/LangSwitcher";
import { useI18n } from "@/lib/i18n/context";

/**
 * En-tête sans framer-motion. Il est monté sur toutes les pages : chaque
 * kilo-octet importé ici est payé partout. Les deux menus s'animent en CSS,
 * restent dans le DOM quand ils sont fermés (les moteurs voient leurs liens)
 * et sont rendus inertes pour le clavier et les lecteurs d'écran.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();
  const mobileMenuId = useId();

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
              aria-expanded={menuOpen}
              aria-controls={mobileMenuId}
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

        {/* Mobile menu — animation de hauteur via grid-template-rows, sans JS */}
        <div
          id={mobileMenuId}
          className={`md:hidden grid transition-[grid-template-rows] duration-200 ease-out ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <div className="overflow-hidden min-h-0">
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
          </div>
        </div>
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
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
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

      {/* Toujours monté : ses liens existent dans chaque page servie. Fermé, il
          est invisible (visibility) donc ni cliquable ni focusable. */}
      <div
        aria-hidden={!open}
        className={`absolute top-full right-0 mt-1.5 min-w-[170px] bg-white rounded-xl shadow-lg border border-border py-1.5 z-50 origin-top-right transition-[opacity,transform] duration-150 ease-out ${
          open ? "visible opacity-100 translate-y-0 scale-100" : "invisible opacity-0 -translate-y-1.5 scale-[0.97]"
        }`}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-foreground hover:bg-gray-50 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
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
