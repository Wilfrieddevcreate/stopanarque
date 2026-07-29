import Image from "next/image";

export function LogoIcon({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="StopArnaque"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoIcon size={38} />
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
