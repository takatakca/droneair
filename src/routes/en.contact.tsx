import { createFileRoute } from "@tanstack/react-router";

import { MissionForm } from "@/components/MissionForm";
import { SiteLayout } from "@/components/SiteLayout";
import { COMPANY, localBusinessJsonLd } from "@/lib/company";
import { useLang } from "@/lib/i18n";
import { publicHead } from "@/lib/seo";

export const Route = createFileRoute("/en/contact")({
  component: EnglishContact,
  head: () => ({
    ...publicHead("/contact", "en"),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(localBusinessJsonLd("en")) },
    ],
  }),
});

function EnglishContact() {
  const { t } = useLang();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="min-w-0">
            <p className="label-tech">{t.nav.contact}</p>
            <h1 className="display-lg mt-5 text-foreground">{t.contact.title}</h1>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{t.contact.intro}</p>
            <div className="hairline mt-12 pt-8">
              <p className="label-tech">{t.contact.details}</p>
              <address className="mt-5 not-italic leading-relaxed text-foreground">
                <strong className="text-lg">{COMPANY.name}</strong><br />
                {COMPANY.street}<br />{COMPANY.cityEn}<br />{COMPANY.country}
              </address>
              <div className="mt-6 space-y-4">
                <a href={COMPANY.phoneHref} className="block hover:text-primary">{COMPANY.phoneDisplay}</a>
                <a href={COMPANY.emailHref} className="block break-all hover:text-primary">{COMPANY.email}</a>
              </div>
            </div>
            <div className="hairline mt-10 pt-6">
              <p className="label-tech mb-3">{t.footer.legalLabel}</p>
              <p className="max-w-md text-xs leading-relaxed text-muted-foreground">{t.footer.legal}</p>
            </div>
          </div>
          <div className="min-w-0"><MissionForm /></div>
        </div>
      </section>
    </SiteLayout>
  );
}
