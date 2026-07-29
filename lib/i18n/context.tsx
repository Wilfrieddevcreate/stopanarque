"use client";

import { createContext, useContext, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { type Locale, t as translate } from "./translations";
import {
  subscribeLocale,
  getLocaleSnapshot,
  getLocaleServerSnapshot,
  hydrateLocale,
  setLocaleStore,
} from "./locale-store";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "fr",
  setLocale: () => {},
  t: (key) => translate(key, "fr"),
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore: server always returns "fr", client returns "fr" until hydrated
  const locale = useSyncExternalStore(subscribeLocale, getLocaleSnapshot, getLocaleServerSnapshot);

  // Hydrate from localStorage after mount — updates the external store, not React state
  const didHydrate = useRef<boolean>(null);
  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;
    hydrateLocale();
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleStore(l);
  }, []);

  const t = useCallback((key: string) => translate(key, locale), [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
