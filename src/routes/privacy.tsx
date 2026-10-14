import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/LegalPage";
import { useLang } from "@/lib/i18n";
import { publicHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => publicHead("/privacy", "fr"),
});

export function PrivacyPage() {
  const { t } = useLang();
  return <LegalPage title={t.privacy.title} body={t.privacy.body} />;
}
