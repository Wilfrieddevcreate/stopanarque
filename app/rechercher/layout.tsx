import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vérifier un suspect",
  description:
    "Recherchez un numéro de téléphone, un nom ou un compte suspect dans la base de données StopArnaque. Découvrez si un numéro a déjà été signalé au Bénin.",
  openGraph: {
    title: "Vérifier un suspect | StopArnaque Bénin",
    description: "Recherchez si un numéro ou un suspect a déjà été signalé.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
