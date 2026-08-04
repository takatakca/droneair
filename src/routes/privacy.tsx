import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/LegalPage";
import { absUrl } from "@/lib/company";
import { useLang } from "@/lib/i18n";

const title = "Politique de confidentialité | DRONE AIR";
const description =
  "Politique de confidentialité de DRONE AIR : renseignements recueillis dans le formulaire de demande de mission et utilisation de ces renseignements.";

const url = absUrl("/privacy");

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
});

function PrivacyPage() {
  const { t } = useLang();
  return <LegalPage title={t.privacy.title} body={t.privacy.body} />;
}
