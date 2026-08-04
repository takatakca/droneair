import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { DataSection } from "@/components/DataSection";
import { SiteLayout } from "@/components/SiteLayout";
import { ProcessSection, SolutionsSection } from "@/components/SolutionsSection";
import { absUrl } from "@/lib/company";
import { useLang } from "@/lib/i18n";

const title = "Solutions | DRONE AIR — Missions par points de passage et données aériennes";
const description =
  "Inspection de bâtiments, cartographie de terrains, suivi de chantier et livrables de données aériennes par DRONE AIR.";
const url = absUrl("/solutions");

export const Route = createFileRoute("/solutions")({
  component: SolutionsPage,
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
  }),
});

function SolutionsPage() {
  return (
    <SiteLayout>
      <SolutionsIntro />
      <SolutionsSection />
      <DataSection />
      <ProcessSection />
    </SiteLayout>
  );
}

function SolutionsIntro() {
  const { t } = useLang();
  return (
    <section className="mx-auto max-w-[92rem] px-5 pb-4 pt-20 sm:px-8 sm:pt-28">
      <p className="label-tech">{t.solutions.label}</p>
      <h1 className="display-lg mt-5 max-w-3xl text-foreground">{t.hero.statement}</h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {t.hero.lead}
      </p>
      <Link to="/contact" className="link-arrow mt-10">
        {t.cta.primary}
        <ArrowRight className="size-3.5" />
      </Link>
    </section>
  );
}
