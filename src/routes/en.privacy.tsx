import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { useLang } from "@/lib/i18n";
import { publicHead } from "@/lib/seo";

export const Route = createFileRoute("/en/privacy")({
  component: EnglishPrivacy,
  head: () => publicHead("/privacy", "en"),
});

function EnglishPrivacy() {
  const { t } = useLang();
  return <LegalPage title={t.privacy.title} body={t.privacy.body} />;
}
