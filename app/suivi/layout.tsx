import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Suivre mon dossier",
  description:
    "Consultez l'état de votre signalement d'arnaque au Bénin grâce à votre code de suivi. Suivez en temps réel l'avancement de votre dossier.",
  path: "/suivi",
  ogDescription: "Suivez l'état de votre signalement avec votre code de suivi.",
  robots: { index: false, follow: false },
});

export default function SuiviLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
