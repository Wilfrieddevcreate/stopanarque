import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signaler une arnaque",
  description:
    "Signalez un numéro frauduleux ou un arnaqueur au Bénin. Formulaire rapide, anonyme et confidentiel. Protégez la communauté béninoise.",
  openGraph: {
    title: "Signaler une arnaque | StopArnaque Bénin",
    description: "Signalez un numéro frauduleux. Rapide, anonyme, confidentiel.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
