import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/Logo";
import { MissionForm } from "@/components/MissionForm";
import { SiteLayout } from "@/components/SiteLayout";
import { COMPANY, localBusinessJsonLd } from "@/lib/company";
import { useLang } from "@/lib/i18n";

const title = "DRONE AIR | Waypoint Missions, Inspections and Aerial Data";
const description =
  "DRONE AIR provides aerial inspection, waypoint planning, mapping, and data-collection solutions for land, properties, and infrastructure. Lachine, Quebec — (514) 448-2825.";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/contact" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(localBusinessJsonLd("en")) },
    ],
  }),
});

function ContactPage() {
  const { lang, t } = useLang();

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Logo size="md" />
        <h1 className="mt-8 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          {t.contact.title}
        </h1>
        <span className="rule-gold mt-6 block max-w-24 opacity-70" />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.contact.intro}
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_0.85fr]">
          <MissionForm />

          <aside className="space-y-6">
            <p className="label-tech">{t.contact.details}</p>
            <address className="not-italic leading-relaxed text-foreground">
              <span className="text-silver font-display text-lg font-semibold tracking-widest">
                {COMPANY.name}
              </span>
              <br />
              {COMPANY.street}
              <br />
              {lang === "fr" ? COMPANY.cityFr : COMPANY.cityEn}
              <br />
              {COMPANY.country}
            </address>
            <div className="space-y-3">
              <a
                href={COMPANY.phoneHref}
                className="flex items-center gap-3 border-t border-border pt-3 text-sm text-foreground hover:text-primary"
              >
                <Phone className="size-4 text-primary" />
                <span className="label-tech">{t.contact.phoneLabel}</span>
                <span className="font-mono">{COMPANY.phoneDisplay}</span>
              </a>
              <a
                href={COMPANY.emailHref}
                className="flex items-center gap-3 border-t border-border pt-3 text-sm text-foreground hover:text-primary"
              >
                <Mail className="size-4 text-primary" />
                <span className="label-tech">{t.contact.emailLabel}</span>
                <span className="font-mono">{COMPANY.email}</span>
              </a>
              <p className="flex items-start gap-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {t.footer.legal}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}