import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/SiteLayout";
import { ProcessSection, SolutionsSection } from "@/components/SolutionsSection";
import { useLang } from "@/lib/i18n";

const title = "Solutions | DRONE R’AIR — Waypoint Missions & Aerial Data";
const description =
  "Inspection de bâtiments, cartographie de terrains, suivi de chantier et livrables de données aériennes par DRONE R’AIR.";

export const Route = createFileRoute("/solutions")({
  component: SolutionsPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/solutions" },
    ],
    links: [{ rel: "canonical", href: "/solutions" }],
  }),
});

function SolutionsPage() {
  return (
    <SiteLayout>
      <SolutionsIntro />
      <SolutionsSection />
      <ProcessSection />
    </SiteLayout>
  );
}

function SolutionsIntro() {
  const { t } = useLang();
  return (
    <section className="border-b border-border bg-graphite/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <p className="label-tech">{t.solutions.label}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          {t.hero.statement}
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.hero.lead}
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-block rounded-sm bg-primary px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t.cta.primary}
        </Link>
      </div>
    </section>
  );
}