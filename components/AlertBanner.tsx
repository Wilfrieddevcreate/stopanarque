"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Alert {
  id: string;
  scamType: string;
  platform: string | null;
  timeAgo: string;
  createdAt: string;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export function AlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Fetch on mount + poll every 30s
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const res = await fetch("/api/alerts/recent");
        const data = await res.json();
        if (!cancelled) setAlerts(data.alerts || []);
      } catch {}
    }
    init();
    const interval = setInterval(init, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Auto-rotate every 5s
  useEffect(() => {
    if (alerts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  if (dismissed || alerts.length === 0) return null;

  const current = alerts[currentIndex % alerts.length];
  if (!current) return null;
  const time = relativeTime(current.createdAt);

  return (
    <div className="bg-foreground text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3 min-h-[40px]">
        {/* Pulsing dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>

        {/* Alert text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={current.id + currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-center"
          >
            <span className="text-white/60">{time}</span>
            {" — "}
            <span>
              un numéro{current.platform ? ` ${current.platform}` : ""} confirmé comme{" "}
              <strong className="text-primary-light">{current.scamType.toLowerCase()}</strong>
            </span>
          </motion.p>
        </AnimatePresence>

        {/* Dots indicator */}
        {alerts.length > 1 && (
          <div className="flex gap-1 shrink-0 ml-2">
            {alerts.map((_, i) => (
              <span
                key={i}
                className={`w-1 h-1 rounded-full transition-colors ${
                  i === currentIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
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
