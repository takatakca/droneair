import { Link } from "@tanstack/react-router";

import { LanguageToggle } from "@/components/LanguageToggle";
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
    <footer className="bg-background">
      <div className="mx-auto max-w-[92rem] px-5 pb-10 pt-20 sm:px-8">
        <p className="text-silver font-display text-[clamp(2.5rem,10vw,7rem)] font-bold leading-none tracking-[0.06em]">
          {COMPANY.name}
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t.footer.description}
        </p>

        <div className="hairline mt-16 grid gap-12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label={t.footer.navLabel}>
            <p className="label-tech">{t.footer.navLabel}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label-tech">{t.footer.servicesLabel}</p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {t.solutions.items.map((s) => (
                <li key={s.title}>{s.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-tech">{t.footer.contactLabel}</p>
            <address className="mt-5 not-italic text-sm leading-relaxed text-muted-foreground">
              {COMPANY.street}
              <br />
              {lang === "fr" ? COMPANY.cityFr : COMPANY.cityEn}
              <br />
              {COMPANY.country}
            </address>
            <div className="mt-5 space-y-2 font-mono text-sm">
              <a href={COMPANY.phoneHref} className="block text-foreground hover:text-primary">
                {COMPANY.phoneDisplay}
              </a>
              <a href={COMPANY.emailHref} className="block break-all text-foreground hover:text-primary">
                {COMPANY.email}
              </a>
            </div>
          </div>

          <div>
            <p className="label-tech">{t.footer.websiteLabel}</p>
            <a
              href={COMPANY.website}
              className="mt-5 block font-mono text-sm text-foreground hover:text-primary"
            >
              {COMPANY.websiteDisplay}
            </a>
            <p className="label-tech mt-8">{t.footer.langLabel}</p>
            <LanguageToggle className="mt-3" />
          </div>
        </div>

        <div className="hairline mt-14 pt-8">
          <p className="label-tech mb-3">{t.footer.legalLabel}</p>
          <p className="max-w-4xl text-xs leading-relaxed text-muted-foreground">{t.footer.legal}</p>
          <p className="mt-8 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} {COMPANY.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
