import { createFileRoute } from "@tanstack/react-router";

import { DataSection } from "@/components/DataSection";
import { Hero } from "@/components/Hero";
import { SiteLayout } from "@/components/SiteLayout";
import { ProcessSection, SolutionsSection } from "@/components/SolutionsSection";
import { localBusinessJsonLd } from "@/lib/company";
import { publicHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    ...publicHead("/", "fr"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(localBusinessJsonLd("fr")),
      },
    ],
  }),
});

export function HomePage() {
  return (
    <SiteLayout overlayHeader>
      <Hero />
      <SolutionsSection />
      <DataSection />
      <ProcessSection />
    </SiteLayout>
  );
}
