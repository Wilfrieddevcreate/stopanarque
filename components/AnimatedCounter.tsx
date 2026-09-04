"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Compteur animé dont la valeur réelle est dans le HTML servi.
 *
 * L'ancienne version démarrait à 0 et ne comptait qu'après hydratation : le
 * HTML annonçait « 0+ signalements » aux moteurs et aux lecteurs sans JS. Ici
 * le chiffre final est rendu côté serveur. Si le compteur est déjà à l'écran
 * quand le JS arrive, on ne l'anime pas (sinon il sauterait de 39 à 0 avant de
 * remonter) ; s'il entre dans l'écran plus tard, il compte depuis 0.
 */
export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    let first = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          // Déjà visible à l'arrivée du JS : on garde la valeur affichée.
          if (entry.isIntersecting) { io.disconnect(); return; }
          return;
        }
        if (!entry.isIntersecting) return;
        io.disconnect();
        let current = 0;
        const step = target / (duration * 60);
        setCount(0);
        timer = setInterval(() => {
          current += step;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, 1000 / 60);
      },
      { rootMargin: "-50px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}
