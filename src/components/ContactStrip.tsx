import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";

export function ContactStrip() {
  const { t } = useLang();
  return (
    <div className="border-y border-border bg-graphite/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={COMPANY.phoneHref}
          className="group flex items-center gap-3 text-sm text-foreground"
        >
          <Phone className="size-4 text-primary" />
          <span className="label-tech group-hover:text-foreground">{t.strip.call}</span>
          <span className="font-mono text-sm">{COMPANY.phoneDisplay}</span>
        </a>
        <a
          href={COMPANY.emailHref}
          className="group flex items-center gap-3 text-sm text-foreground"
        >
          <Mail className="size-4 text-primary" />
          <span className="label-tech group-hover:text-foreground">{t.strip.email}</span>
          <span className="font-mono text-sm">{COMPANY.email}</span>
        </a>
        <Link
          to="/contact"
          className="flex items-center gap-2 self-start rounded-sm bg-primary px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 sm:self-auto"
        >
          <MapPin className="size-3.5" />
          {t.strip.plan}
        </Link>
      </div>
    </div>
  );
}