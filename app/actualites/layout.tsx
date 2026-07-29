import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Restez informé des dernières arnaques en circulation au Bénin. Alertes, conseils et actualités de la cybersécurité.",
};

export default function ActualitesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
