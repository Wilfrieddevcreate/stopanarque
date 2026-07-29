import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hors connexion",
};

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M13 12a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Vous êtes hors connexion
        </h1>
        <p className="text-muted mb-8 leading-relaxed">
          Vérifiez votre connexion internet et réessayez.
          StopArnaque nécessite une connexion pour fonctionner.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Réessayer
        </Link>
      </div>
    </div>
  );
}
