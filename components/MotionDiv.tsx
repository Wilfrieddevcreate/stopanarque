import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Animations d'apparition, en CSS pur (voir les @keyframes reveal-* dans
 * app/globals.css).
 *
 * L'ancienne implémentation framer-motion servait chaque bloc avec
 * `style="opacity:0"` et ne le révélait qu'après téléchargement du JS et
 * passage d'un IntersectionObserver : 83 % des mots de l'accueil, jusqu'au h1,
 * dépendaient de ~200 Ko de JavaScript pour être peints. Ici le HTML servi ne
 * porte aucune opacité inline ; l'animation CSS tourne sans JavaScript, et
 * `prefers-reduced-motion` la neutralise (règle globale). Les noms et les props
 * sont inchangés : aucun appelant n'a été modifié.
 */

type RevealProps = { children: ReactNode; className?: string; delay?: number };

function Reveal({
  kind,
  children,
  className,
  delay = 0,
}: RevealProps & { kind: "up" | "scale" | "left" | "right" }) {
  return (
    <div
      className={`reveal reveal-${kind}${className ? ` ${className}` : ""}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

export function FadeIn(props: RevealProps) {
  return <Reveal kind="up" {...props} />;
}

export function FadeInUp(props: RevealProps) {
  return <Reveal kind="up" {...props} />;
}

export function ScaleIn(props: RevealProps) {
  return <Reveal kind="scale" {...props} />;
}

export function SlideInLeft(props: RevealProps) {
  return <Reveal kind="left" {...props} />;
}

export function SlideInRight(props: RevealProps) {
  return <Reveal kind="right" {...props} />;
}

type StaggerItemProps = { children: ReactNode; className?: string; index?: number };

/** Décale l'apparition de chaque StaggerItem enfant de 80 ms, plafonné à 640 ms
 *  pour qu'une grille longue (17 fiches) n'ait pas de cartes invisibles > 1 s. */
export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  let i = 0;
  return (
    <div className={className}>
      {Children.map(children, (child) =>
        isValidElement(child) && child.type === StaggerItem
          ? cloneElement(child as ReactElement<StaggerItemProps>, { index: i++ })
          : child,
      )}
    </div>
  );
}

export function StaggerItem({ children, className, index = 0 }: StaggerItemProps) {
  return (
    <div
      className={`reveal reveal-up${className ? ` ${className}` : ""}`}
      style={{ animationDelay: `${Math.min(index, 8) * 0.08}s` }}
    >
      {children}
    </div>
  );
}
