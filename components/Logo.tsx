import Image from "next/image";

/**
 * `priority` (préchargement) n'a de sens que pour le logo du header, au-dessus
 * de la ligne de flottaison. L'icône seule sert aussi dans le pied de page : la
 * précharger là faisait émettre deux <link rel="preload"> pour la même image.
 */
export function LogoIcon({
  size = 36,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt="StopArnaque"
      width={size}
      height={size}
      className={className}
      priority={priority}
    />
  );
}

export function LogoFull({ className, priority = true }: { className?: string; priority?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoIcon size={38} priority={priority} />
      <div className="flex flex-col leading-none">
        <span className="text-[22px] font-extrabold font-heading tracking-tight text-foreground">
          Stop<span className="text-primary">Arnaque</span>
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted mt-0.5">
          Plateforme du Bénin
        </span>
      </div>
    </div>
  );
}
