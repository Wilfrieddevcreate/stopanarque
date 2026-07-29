import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { VisitTracker } from "@/components/VisitTracker";
import { I18nProvider } from "@/lib/i18n/context";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stopanarque.bj";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StopArnaque Bénin — Signalez et vérifiez les arnaques",
    template: "%s | StopArnaque Bénin",
  },
  description:
    "Plateforme béninoise de signalement d'arnaques téléphoniques et en ligne. Signalez un numéro frauduleux, vérifiez un suspect et protégez la communauté.",
  keywords: [
    "arnaque Bénin",
    "signalement arnaque",
    "numéro frauduleux",
    "arnaque téléphonique Bénin",
    "arnaque Mobile Money",
    "sextorsion Bénin",
    "stop arnaque",
    "vérifier numéro",
    "cybercriminalité Bénin",
    "arnaque WhatsApp",
    "arnaque MTN MoMo",
    "phishing Bénin",
    "signaler arnaque en ligne",
  ],
  authors: [{ name: "StopArnaque Bénin" }],
  creator: "StopArnaque Bénin",
  publisher: "StopArnaque Bénin",
  category: "security",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    url: SITE_URL,
    siteName: "StopArnaque Bénin",
    title: "StopArnaque Bénin — Signalez et vérifiez les arnaques",
    description:
      "Plateforme béninoise de signalement d'arnaques. Signalez un numéro frauduleux, vérifiez un suspect et protégez la communauté.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StopArnaque Bénin - Plateforme de signalement d'arnaques",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StopArnaque Bénin — Signalez et vérifiez les arnaques",
    description:
      "Plateforme béninoise de signalement d'arnaques. Protégez-vous et protégez les autres.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  formatDetection: {
    telephone: false,
    email: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#E8112D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${jakarta.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-body" suppressHydrationWarning>
        <I18nProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
        <ServiceWorkerRegister />
        <VisitTracker />
      </body>
    </html>
  );
}
