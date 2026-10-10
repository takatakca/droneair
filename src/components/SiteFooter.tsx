import { LanguageToggle } from "@/components/LanguageToggle";
import { LocalLink } from "@/components/LocalLink";
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
    <footer className="border-t border-border bg-[oklch(0.105_0.004_264)]">
      <div className="mx-auto max-w-[92rem] px-5 py-14 sm:px-8 sm:py-18">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-5xl">
            <p className="font-display text-[clamp(3.5rem,11vw,9rem)] font-semibold leading-[0.82] tracking-[-0.06em] text-foreground">
              DRONE AIR
            </p>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t.footer.description}
            </p>
          </div>
          <LanguageToggle />
        </div>

        <div className="mt-14 grid gap-10 border-y border-border py-8 md:grid-cols-[1.2fr_0.8fr]">
          <nav aria-label={t.footer.navLabel} className="flex flex-wrap gap-x-7 gap-y-3">
            {navLinks.map((link) => (
              <LocalLink
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </LocalLink>
            ))}
          </nav>

          <div className="md:text-right">
            <a href={COMPANY.phoneHref} className="block text-sm text-foreground hover:text-primary">
              {COMPANY.phoneDisplay}
            </a>
            <a href={COMPANY.emailHref} className="mt-2 block break-all text-sm text-foreground hover:text-primary">
              {COMPANY.email}
            </a>
            <address className="mt-4 not-italic text-xs leading-relaxed text-muted-foreground">
              {COMPANY.street} · {lang === "fr" ? COMPANY.cityFr : COMPANY.cityEn} · {COMPANY.country}
            </address>
          </div>
        </div>

        <div className="mt-7 grid gap-5 text-xs leading-relaxed text-muted-foreground lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-5xl">{t.footer.legal}</p>
          <p>© {new Date().getFullYear()} {COMPANY.name}</p>
        </div>
      </div>
    </footer>
  );
}
