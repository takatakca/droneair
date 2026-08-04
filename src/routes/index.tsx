import { createFileRoute } from "@tanstack/react-router";

import { DataSection } from "@/components/DataSection";
import { Hero } from "@/components/Hero";
import { SiteLayout } from "@/components/SiteLayout";
import { ProcessSection, SolutionsSection } from "@/components/SolutionsSection";
import { absUrl, localBusinessJsonLd } from "@/lib/company";

const title = "DRONE AIR | Inspection, cartographie et données aériennes";
const description =
  "DRONE AIR offre des solutions d’inspection aérienne, de planification par points de passage, de cartographie et de collecte de données pour les terrains, propriétés et infrastructures.";
const url = absUrl("/");

export const Route = createFileRoute("/")({
  component: Index,
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
      {
        type: "application/ld+json",
        children: JSON.stringify(localBusinessJsonLd("fr")),
      },
    ],
  }),
});

function Index() {
  return (
    <SiteLayout overlayHeader>
      <Hero />
      <SolutionsSection />
      <DataSection />
      <ProcessSection />
    </SiteLayout>
  );
}
