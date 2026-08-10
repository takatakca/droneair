import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { LanguageToggle } from "@/components/LanguageToggle";
import { LocalLink } from "@/components/LocalLink";
import { Logo } from "@/components/Logo";
import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";
import { portalCopy } from "@/lib/portal/copy";
import { useSignedIn } from "@/lib/use-session";
import { cn } from "@/lib/utils";

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const { t, lang } = useLang();
  const access = portalCopy(lang).access;
  const signedIn = useSignedIn();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/solutions", label: t.nav.solutions },
    { to: "/contact", label: t.nav.contact },
  ];

  const solid = scrolled || !overlay || open;
  const accountTo = signedIn ? "/client" : "/login";
  const accountLabel = signedIn ? access.signedIn : access.signedOut;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid
          ? "border-b border-border bg-background/88 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between gap-4 px-5 sm:px-8">
        <LocalLink to="/" aria-label={COMPANY.name} onClick={() => setOpen(false)} className="min-w-0">
          <Logo size="sm" />
        </LocalLink>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <LocalLink
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {l.label}
            </LocalLink>
          ))}
          <a
            href={accountTo}
            className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {accountLabel}
          </a>
          <LanguageToggle />
          <LocalLink
            to="/contact"
            className="border-b border-primary/70 pb-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-primary transition-colors hover:border-foreground hover:text-foreground"
          >
            {t.cta.primary}
          </LocalLink>
        </nav>

        <button
          type="button"
          className="-mr-2 flex size-11 items-center justify-center text-foreground md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col justify-between overflow-y-auto bg-background px-5 pb-10 pt-8 md:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <LocalLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="hairline py-5 font-display text-3xl tracking-tight text-foreground first:border-t-0 first:pt-0"
              >
                {l.label}
              </LocalLink>
            ))}
            <LocalLink
              to="/contact"
              onClick={() => setOpen(false)}
              className="hairline py-5 font-display text-3xl tracking-tight text-primary"
            >
              {t.cta.primary}
            </LocalLink>
            <a
              href={accountTo}
              onClick={() => setOpen(false)}
              className="hairline py-5 font-mono text-sm uppercase tracking-[0.22em] text-muted-foreground"
            >
              {accountLabel}
            </a>
          </nav>

          <div className="hairline mt-10 space-y-4 pt-6">
            <a href={COMPANY.phoneHref} className="block font-mono text-base text-foreground">
              {COMPANY.phoneDisplay}
            </a>
            <a href={COMPANY.emailHref} className="block break-all font-mono text-base text-foreground">
              {COMPANY.email}
            </a>
            <address className="not-italic text-sm leading-relaxed text-muted-foreground">
              {COMPANY.street}
              <br />
              {COMPANY.cityFr}
              <br />
              {COMPANY.country}
            </address>
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
