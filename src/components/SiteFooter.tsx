import { Link } from "@tanstack/react-router";

import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { lang, t } = useLang();

  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/solutions", label: t.nav.solutions },
    { to: "/contact", label: t.nav.contact },
    { to: "/privacy", label: t.nav.privacy },
    { to: "/terms", label: t.nav.terms },
  ];

  return (
    <footer className="border-t border-border bg-[oklch(0.12_0.006_264)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr]">
        <div>
          <Logo size="md" />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t.footer.description}
          </p>
          <div className="mt-6">
            <p className="label-tech mb-2">{t.footer.langLabel}</p>
            <LanguageToggle />
          </div>
        </div>

        <nav aria-label={t.footer.navLabel} className="space-y-3">
          <p className="label-tech">{t.footer.navLabel}</p>
          <ul className="space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="label-tech pt-4">{t.footer.servicesLabel}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {t.solutions.items.map((s) => (
              <li key={s.title}>{s.title}</li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <p className="label-tech">{t.footer.contactLabel}</p>
          <address className="not-italic text-sm leading-relaxed text-foreground">
            <span className="text-silver font-display font-semibold tracking-widest">
              {COMPANY.name}
            </span>
            <br />
            {COMPANY.street}
            <br />
            {lang === "fr" ? COMPANY.cityFr : COMPANY.cityEn}
            <br />
            {COMPANY.country}
          </address>
          <div className="space-y-1 font-mono text-sm">
            <a href={COMPANY.phoneHref} className="block text-foreground hover:text-primary">
              {COMPANY.phoneDisplay}
            </a>
            <a href={COMPANY.emailHref} className="block break-all text-foreground hover:text-primary">
              {COMPANY.email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <p className="label-tech mb-2">{t.footer.legalLabel}</p>
          <p className="max-w-4xl text-xs leading-relaxed text-muted-foreground">
            {t.footer.legal}
          </p>
          <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} {COMPANY.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
