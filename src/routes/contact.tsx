import { createFileRoute } from "@tanstack/react-router";

import { MissionForm } from "@/components/MissionForm";
import { SiteLayout } from "@/components/SiteLayout";
import { COMPANY, absUrl, localBusinessJsonLd } from "@/lib/company";
import { useLang } from "@/lib/i18n";

const title = "Contact | DRONE AIR — Planifier une mission aérienne";
const description =
  "Planifiez une mission avec DRONE AIR : inspection aérienne, points de passage, cartographie et collecte de données. Lachine, Québec — (514) 448-2825.";
const url = absUrl("/contact");

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(localBusinessJsonLd("fr")) },
    ],
  }),
});

function ContactPage() {
  const { lang, t } = useLang();

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="min-w-0">
            <p className="label-tech">{t.nav.contact}</p>
            <h1 className="display-lg mt-5 text-foreground">{t.contact.title}</h1>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.contact.intro}
            </p>

            <div className="hairline mt-12 pt-8">
              <p className="label-tech">{t.contact.details}</p>
              <address className="mt-5 not-italic leading-relaxed text-foreground">
                <span className="text-silver font-display text-lg font-semibold tracking-[0.14em]">
                  {COMPANY.name}
                </span>
                <br />
                {COMPANY.street}
                <br />
                {lang === "fr" ? COMPANY.cityFr : COMPANY.cityEn}
                <br />
                {COMPANY.country}
              </address>
              <div className="mt-6 space-y-4">
                <a href={COMPANY.phoneHref} className="block">
                  <span className="label-tech block">{t.contact.phoneLabel}</span>
                  <span className="mt-1 block font-mono text-base text-foreground hover:text-primary">
                    {COMPANY.phoneDisplay}
                  </span>
                </a>
                <a href={COMPANY.emailHref} className="block">
                  <span className="label-tech block">{t.contact.emailLabel}</span>
                  <span className="mt-1 block break-all font-mono text-base text-foreground hover:text-primary">
                    {COMPANY.email}
                  </span>
                </a>
              </div>
            </div>

            <div className="hairline mt-10 pt-6">
              <p className="label-tech mb-3">{t.footer.legalLabel}</p>
              <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
                {t.footer.legal}
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <MissionForm />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
