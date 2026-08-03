import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/LegalPage";
import { useLang } from "@/lib/i18n";

const title = "Conditions d’utilisation | DRONE AIR";
const description =
  "Conditions d’utilisation du site de DRONE AIR : portée du contenu, évaluation des missions et limites des livrables aériens.";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/terms" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
});

function TermsPage() {
  const { t } = useLang();
  return <LegalPage title={t.terms.title} body={t.terms.body} />;
}
