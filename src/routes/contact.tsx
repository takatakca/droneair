import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/Logo";
import { SiteLayout } from "@/components/SiteLayout";
import { COMPANY, localBusinessJsonLd } from "@/lib/company";
import { useLang } from "@/lib/i18n";

const title = "DRONE R’AIR | Waypoint Missions, Inspections and Aerial Data";
const description =
  "Contactez DRONE R’AIR — 4625 Rue Fairway, Lachine, Québec H8T 1B7. Téléphone (514) 448-2825, courriel info@dronair.ca.";

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
  const [sent, setSent] = useState(false);

  const field =
    "w-full rounded-sm border border-input bg-graphite/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

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
          <div className="panel rounded-md p-6">
            {sent ? (
              <div>
                <p className="label-tech">{t.contact.form.confirmTitle}</p>
                <h2 className="mt-3 text-xl font-semibold text-foreground">
                  {t.contact.form.confirmTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t.contact.form.confirmBody}
                </p>
                <div className="mt-5 space-y-2 font-mono text-sm">
                  <a href={COMPANY.phoneHref} className="block text-primary">
                    {COMPANY.phoneDisplay}
                  </a>
                  <a href={COMPANY.emailHref} className="block text-primary">
                    {COMPANY.email}
                  </a>
                  <address className="not-italic leading-relaxed text-muted-foreground">
                    {COMPANY.name}
                    <br />
                    {COMPANY.street}
                    <br />
                    {lang === "fr" ? COMPANY.cityFr : COMPANY.cityEn}
                    <br />
                    {COMPANY.country}
                  </address>
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-sm border border-border px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-foreground hover:border-accent hover:text-accent"
                >
                  {t.contact.form.again}
                </button>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="label-tech mb-2 block">{t.contact.form.name}</span>
                    <input required name="name" className={field} />
                  </label>
                  <label className="block">
                    <span className="label-tech mb-2 block">{t.contact.form.email}</span>
                    <input required type="email" name="email" className={field} />
                  </label>
                  <label className="block">
                    <span className="label-tech mb-2 block">{t.contact.form.phone}</span>
                    <input name="phone" type="tel" className={field} />
                  </label>
                  <label className="block">
                    <span className="label-tech mb-2 block">{t.contact.form.location}</span>
                    <input name="location" className={field} />
                  </label>
                </div>
                <label className="block">
                  <span className="label-tech mb-2 block">{t.contact.form.message}</span>
                  <textarea required name="message" rows={5} className={field} />
                </label>
                <button
                  type="submit"
                  className="rounded-sm bg-primary px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {t.contact.form.submit}
                </button>
              </form>
            )}
          </div>

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