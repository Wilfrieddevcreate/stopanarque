import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conseils & Sécurité",
  description:
    "Conseils pratiques pour se protéger des arnaques au Bénin. Comment reconnaître une arnaque, prévenir les fraudes et réagir en cas de sextorsion ou d'escroquerie.",
  openGraph: {
    title: "Conseils & Sécurité | StopArnaque Bénin",
    description: "Guide complet anti-arnaques : prévenir, reconnaître, réagir.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
