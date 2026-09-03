"use client";

import { useEffect, useRef } from "react";

export function usePageDuration(page: string) {
  const startRef = useRef<number>(0);
  const hiddenTimeRef = useRef<number>(0);
  const hiddenAtRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = Date.now();
    hiddenTimeRef.current = 0;
    hiddenAtRef.current = null;

    function handleVisibility() {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
      } else if (hiddenAtRef.current !== null) {
        hiddenTimeRef.current += Date.now() - hiddenAtRef.current;
        hiddenAtRef.current = null;
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);

      const totalMs = Date.now() - startRef.current;
      const activeMs = totalMs - hiddenTimeRef.current;
      const seconds = Math.round(activeMs / 1000);

      // Ignorer les bounces < 3s et les sessions irréalistes > 30min
      if (seconds < 3 || seconds > 1800) return;

      // sendBeacon est fiable même pendant le déchargement de la page
      try {
        navigator.sendBeacon(
          "/api/visits/duration",
          new Blob(
            [JSON.stringify({ page, duration: seconds })],
            { type: "application/json" }
          )
        );
      } catch {
        // silencieux — le tracking est best-effort
      }
    };
  }, [page]);
}
