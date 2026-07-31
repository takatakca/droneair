import { Link } from "@tanstack/react-router";
import { Menu, Phone, Mail, X } from "lucide-react";
import { useState } from "react";

import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";

export function SiteHeader() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/solutions", label: t.nav.solutions },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" aria-label={COMPANY.name} onClick={() => setOpen(false)}>
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
          <LanguageToggle />
          <Link
            to="/contact"
            className="rounded-sm border border-primary/60 px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {t.cta.primary}
          </Link>
        </nav>

        <button
          type="button"
          className="text-foreground md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 px-5 py-6 md:hidden">
          <Logo size="md" className="mb-6" />
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display text-lg tracking-wide text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 space-y-3 border-t border-border pt-5">
            <a
              href={COMPANY.phoneHref}
              className="flex items-center gap-3 text-sm text-foreground"
            >
              <Phone className="size-4 text-primary" />
              {COMPANY.phoneDisplay}
            </a>
            <a
              href={COMPANY.emailHref}
              className="flex items-center gap-3 text-sm text-foreground"
            >
              <Mail className="size-4 text-primary" />
              {COMPANY.email}
            </a>
            <address className="not-italic text-sm leading-relaxed text-muted-foreground">
              {COMPANY.street}
              <br />
              {COMPANY.cityFr}
              <br />
              {COMPANY.country}
            </address>
            <LanguageToggle className="mt-2" />
          </div>
        </div>
      )}
    </header>
  );
}