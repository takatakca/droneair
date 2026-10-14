import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { DataSection } from "@/components/DataSection";
import { LocalLink } from "@/components/LocalLink";
import { SiteLayout } from "@/components/SiteLayout";
import { ProcessSection, SolutionsSection } from "@/components/SolutionsSection";
import { useLang } from "@/lib/i18n";
import { publicHead } from "@/lib/seo";

export const Route = createFileRoute("/en/solutions")({
  component: EnglishSolutions,
  head: () => publicHead("/solutions", "en"),
});

function EnglishSolutions() {
  const { t } = useLang();
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[92rem] px-5 pb-4 pt-20 sm:px-8 sm:pt-28">
        <p className="label-tech">{t.solutions.label}</p>
        <h1 className="display-lg mt-5 max-w-3xl text-foreground">{t.hero.statement}</h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{t.hero.lead}</p>
        <LocalLink to="/contact" className="link-arrow mt-10">
          {t.cta.primary}<ArrowRight className="size-3.5" />
        </LocalLink>
      </section>
      <SolutionsSection />
      <DataSection />
      <ProcessSection />
    </SiteLayout>
  );
}
