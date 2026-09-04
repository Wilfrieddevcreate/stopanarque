import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteJsonLd } from "@/components/JsonLd";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { VisitTracker } from "@/components/VisitTracker";
import { I18nProvider } from "@/lib/i18n/context";
import { DEFAULT_OG_IMAGE, SITE_LOCALE, SITE_NAME, SITE_URL } from "@/lib/seo";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "StopArnaque Bénin — Signaler et vérifier une arnaque",
    template: `%s | ${SITE_NAME}`,
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
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
    locale: SITE_LOCALE,
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "StopArnaque Bénin — Signaler et vérifier une arnaque",
    description:
      "Plateforme béninoise de signalement d'arnaques. Signalez un numéro frauduleux, vérifiez un suspect et protégez la communauté.",
    images: [{ ...DEFAULT_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StopArnaque Bénin — Signaler et vérifier une arnaque",
    description:
      "Plateforme béninoise de signalement d'arnaques. Protégez-vous et protégez les autres.",
    images: [DEFAULT_OG_IMAGE.url],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "StopArnaque",
    statusBarStyle: "default",
  },
  // Renseigner NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION pour valider la propriété
  // du domaine dans la Search Console sans redéployer de code.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  alternates: {
    canonical: "/",
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
    <html lang="fr" suppressHydrationWarning className={`${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        <SiteJsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-body" suppressHydrationWarning>
        {/* Plus de MotionConfig ici : il embarquait framer-motion (39 Ko gzip)
            dans le bundle partagé par toutes les pages. Le respect de
            prefers-reduced-motion est assuré en CSS (globals.css). */}
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
