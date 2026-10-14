import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    if (!open) return () => {
      document.body.style.overflow = "";
    };

    const menu = mobileMenuRef.current;
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = () => Array.from(menu?.querySelectorAll<HTMLElement>(selector) ?? []);

    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/solutions", label: t.nav.solutions },
    { to: "/contact", label: t.nav.contact },
  ];

  const solid = scrolled || !overlay || open;
  const accountTo = signedIn ? ("/client" as const) : ("/login" as const);
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
              className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {l.label}
            </LocalLink>
          ))}
          <Link
            to={accountTo}
            className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {accountLabel}
          </Link>
          <LanguageToggle />
          <LocalLink
            to="/contact"
            className="border-b border-primary/70 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:border-foreground hover:text-foreground"
          >
            {t.cta.primary}
          </LocalLink>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="-mr-2 flex size-11 items-center justify-center text-foreground md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div
          ref={mobileMenuRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col justify-between overflow-y-auto bg-background px-5 pb-10 pt-8 md:hidden"
        >
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
            <Link
              to={accountTo}
              onClick={() => setOpen(false)}
              className="hairline py-5 text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground"
            >
              {accountLabel}
            </Link>
          </nav>

          <div className="hairline mt-10 space-y-4 pt-6">
            <a href={COMPANY.phoneHref} className="block text-base text-foreground">
              {COMPANY.phoneDisplay}
            </a>
            <a href={COMPANY.emailHref} className="block break-all text-base text-foreground">
              {COMPANY.email}
            </a>
            <address className="not-italic text-sm leading-relaxed text-muted-foreground">
              {COMPANY.street}
              <br />
              {lang === "fr" ? COMPANY.cityFr : COMPANY.cityEn}
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
