import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nous contacter",
  description: "Contactez l'équipe StopArnaque Bénin pour toute question, problème technique, demande de suppression de données ou partenariat.",
  openGraph: {
    title: "Nous contacter | StopArnaque Bénin",
    description: "Une question ? Notre équipe vous répond sous 48 h.",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
