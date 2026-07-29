import Link from "next/link";
import { LogoIcon } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <LogoIcon size={64} />
            <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-full flex items-center justify-center text-foreground text-xs font-bold shadow-md">
              ?
            </span>
          </div>
        </div>

        <h1 className="text-7xl font-bold font-heading text-primary mb-2">404</h1>
        <h2 className="text-xl font-bold text-foreground mb-3">Page introuvable</h2>
        <p className="text-muted mb-8 leading-relaxed">
          Cette page n&apos;existe pas ou a été déplacée.
          Pas d&apos;inquiétude, retournez en lieu sûr.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-primary/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/signaler"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Signaler une arnaque
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
