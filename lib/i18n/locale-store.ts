import type { Locale } from "./translations";

const VALID_LOCALES: string[] = ["fr", "en", "fon", "yo"];
const STORAGE_KEY = "stopanarque-locale";

let currentLocale: Locale = "fr";
let hydrated = false;
const listeners = new Set<() => void>();

function notify() {
  for (const cb of listeners) cb();
}

export function subscribeLocale(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export function getLocaleSnapshot(): Locale {
  return currentLocale;
}

export function getLocaleServerSnapshot(): Locale {
  return "fr";
}

export function hydrateLocale() {
  if (hydrated) return;
  hydrated = true;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_LOCALES.includes(saved)) {
      currentLocale = saved as Locale;
      notify();
    }
  } catch {}
}

export function setLocaleStore(l: Locale) {
  currentLocale = l;
  try {
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l === "fon" || l === "yo" ? "fr" : l;
  } catch {}
  notify();
}
