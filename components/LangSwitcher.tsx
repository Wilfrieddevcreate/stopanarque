"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LOCALES, LOCALE_NAMES, LOCALE_FLAGS, type Locale } from "@/lib/i18n/translations";

/**
 * Sélecteur de langue sans framer-motion : rendu par le Header sur toutes les
 * pages, il ferait rentrer la bibliothèque dans le bundle partagé.
 */
export function LangSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Langue"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <span>{LOCALE_FLAGS[locale]}</span>
        <span className="hidden sm:inline">{LOCALE_NAMES[locale]}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        role="listbox"
        aria-hidden={!open}
        className={`absolute right-0 top-full mt-1 bg-white rounded-xl border border-border shadow-lg overflow-hidden z-50 min-w-[140px] origin-top-right transition-[opacity,transform] duration-150 ease-out ${
          open ? "visible opacity-100 translate-y-0 scale-100" : "invisible opacity-0 -translate-y-1 scale-95"
        }`}
      >
        {LOCALES.map((l: Locale) => (
          <button
            key={l}
            role="option"
            aria-selected={locale === l}
            tabIndex={open ? 0 : -1}
            onClick={() => { setLocale(l); setOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
              locale === l
                ? "bg-primary/5 text-primary font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{LOCALE_FLAGS[l]}</span>
            <span>{LOCALE_NAMES[l]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
