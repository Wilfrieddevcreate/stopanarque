import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suivre mon dossier",
  description:
    "Consultez l'état de votre signalement d'arnaque au Bénin grâce à votre code de suivi. Suivez en temps réel l'avancement de votre dossier.",
  openGraph: {
    title: "Suivre mon dossier | StopArnaque Bénin",
    description: "Suivez l'état de votre signalement avec votre code de suivi.",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/suivi",
  },
};

export default function SuiviLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
