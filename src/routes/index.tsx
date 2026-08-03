import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/Hero";
import { SiteLayout } from "@/components/SiteLayout";
import { ProcessSection, SolutionsSection } from "@/components/SolutionsSection";
import { localBusinessJsonLd } from "@/lib/company";

const title = "DRONE AIR | Inspection, points de passage et données aériennes";
const description =
  "DRONE AIR offre des solutions d’inspection aérienne, de planification par points de passage, de cartographie et de collecte de données pour les terrains, propriétés et infrastructures.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(localBusinessJsonLd("fr")),
      },
    ],
  }),
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <SolutionsSection />
      <ProcessSection />
    </SiteLayout>
  );
}
