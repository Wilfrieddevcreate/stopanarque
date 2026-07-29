"use client";

import Link from "next/link";
import { LogoIcon } from "@/components/Logo";
import { useI18n } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-50 border-t border-border mt-auto">
      <div className="flex h-1">
        <div className="flex-1 bg-success" />
        <div className="flex-1 bg-accent" />
        <div className="flex-1 bg-primary" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <LogoIcon size={32} />
              <span className="text-lg font-bold font-heading">
                Stop<span className="text-primary">Arnaque</span>
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">{t("footer.tagline")}</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">
              {t("footer.nav")}
            </h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">{t("nav.home")}</Link></li>
              <li><Link href="/signaler" className="text-sm text-muted hover:text-foreground transition-colors">{t("nav.report")}</Link></li>
              <li><Link href="/rechercher" className="text-sm text-muted hover:text-foreground transition-colors">{t("nav.search")}</Link></li>
              <li><Link href="/suivi" className="text-sm text-muted hover:text-foreground transition-colors">{t("nav.tracking")}</Link></li>
              <li><Link href="/conseils" className="text-sm text-muted hover:text-foreground transition-colors">{t("nav.advice")}</Link></li>
              <li><Link href="/actualites" className="text-sm text-muted hover:text-foreground transition-colors">{t("nav.news")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">
              {t("footer.privacy.title")}
            </h3>
            <p className="text-sm text-muted leading-relaxed">{t("footer.privacy.text")}</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted">
          © {new Date().getFullYear()} StopArnaque Bénin. {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
