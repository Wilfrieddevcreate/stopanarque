"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BannerItem } from "@/lib/statistics";
import { stripHtml } from "@/lib/content";

/**
 * La bannière reçoit ses alertes du serveur : rendue dans le HTML initial,
 * elle ne s'insère plus au-dessus du hero après hydratation (42 px de décalage
 * de mise en page à chaque chargement). Le rafraîchissement périodique reste
 * côté client.
 */
export function AlertBanner({ initialItems = [] }: { initialItems?: BannerItem[] }) {
  const [items, setItems] = useState<BannerItem[]>(initialItems);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/alerts/recent");
        const data = await res.json();
        if (!cancelled && Array.isArray(data.alerts)) setItems(data.alerts);
      } catch {}
    }
    // Les données initiales viennent du serveur — on ne re-fetch qu'après 30s
    const poll = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(poll); };
  }, []);

  // Progress bar + auto-rotate every 6s
  useEffect(() => {
    if (items.length === 0) return;
    setProgress(0);
    const DURATION = 6000;
    const STEP = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += STEP;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
      if (elapsed >= DURATION) {
        setIndex((prev) => (prev + 1) % items.length);
        elapsed = 0;
        setProgress(0);
      }
    }, STEP);
    return () => clearInterval(timer);
  }, [index, items.length]);

  if (dismissed || items.length === 0) return null;

  const item = items[index % items.length];

  return (
    <div className="relative bg-foreground text-white overflow-hidden">
      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-primary/60"
        style={{ width: `${progress}%` }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3 min-h-10.5">
        {/* Indicator */}
        <ItemIndicator item={item} />

        {/* Content */}
        {/* La clé change à chaque rotation : le remontage rejoue l'animation CSS */}
        <div key={item.id} className="reveal reveal-soft [animation-duration:.25s] flex items-center gap-2 text-sm">
          <ItemContent item={item} />
        </div>

        {/* Dots */}
        {items.length > 1 && (
          <div className="hidden sm:flex gap-1 shrink-0 ml-1">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === index % items.length ? "bg-white scale-125" : "bg-white/25 hover:bg-white/50"
                }`}
                aria-label={`Alerte ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ItemIndicator({ item }: { item: BannerItem }) {
  if (item.kind === "confirmed") {
    return (
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
      </span>
    );
  }
  if (item.kind === "recent") {
    return (
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400" />
      </span>
    );
  }
  if (item.kind === "stats") {
    return (
      <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/20">
        <svg className="w-3 h-3 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </span>
    );
  }
  // article
  return (
    <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20">
      <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    </span>
  );
}

const MAX_TITLE = 55;
function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max).trimEnd() + "…" : str;
}

function ItemContent({ item }: { item: BannerItem }) {
  if (item.kind === "confirmed") {
    return (
      <p className="text-sm leading-snug">
        <span className="text-white/50 text-xs">{item.timeAgo}</span>
        <span className="text-white/60 mx-1.5">—</span>
        <span className="text-white/90">
          {item.platform ? (
            <>Numéro <span className="text-white font-medium">{item.platform}</span> confirmé comme </>
          ) : (
            "Numéro confirmé comme "
          )}
          <span className="text-primary-light font-semibold">{item.scamType.toLowerCase()}</span>
        </span>
      </p>
    );
  }

  if (item.kind === "recent") {
    return (
      <p className="text-sm leading-snug">
        <span className="text-white/50 text-xs">{item.timeAgo}</span>
        <span className="text-white/60 mx-1.5">—</span>
        <span className="text-yellow-200 font-medium">Nouveau signalement</span>
        <span className="text-white/70"> : </span>
        <span className="text-white/90">{item.scamType.toLowerCase()}</span>
        {item.platform && (
          <span className="text-white/50"> via {item.platform}</span>
        )}
      </p>
    );
  }

  if (item.kind === "stats") {
    return (
      <p className="text-sm leading-snug">
        <span className="text-white/50 text-xs">Cette semaine</span>
        <span className="text-white/60 mx-1.5">—</span>
        <span className="text-white font-semibold">{item.weeklyCount}</span>
        <span className="text-white/80">
          {" "}nouveau{item.weeklyCount > 1 ? "x" : ""} signalement{item.weeklyCount > 1 ? "s" : ""} déposé{item.weeklyCount > 1 ? "s" : ""}
        </span>
      </p>
    );
  }

  // article
  return (
    <p className="text-sm leading-snug">
      <span className="text-blue-300 font-medium text-xs uppercase tracking-wide">Nouveau</span>
      <span className="text-white/60 mx-1.5">—</span>
      <Link
        href={`/actualites/${item.slug}`}
        className="text-white/90 hover:text-white underline underline-offset-2 decoration-white/30 hover:decoration-white/70 transition-colors"
      >
        {truncate(stripHtml(item.title), MAX_TITLE)}
      </Link>
      <span className="text-white/40 text-xs ml-2">{item.timeAgo}</span>
    </p>
  );
}
