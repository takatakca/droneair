import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/LegalPage";
import { useLang } from "@/lib/i18n";
import { publicHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => publicHead("/terms", "fr"),
});

export function TermsPage() {
  const { t } = useLang();
  return <LegalPage title={t.terms.title} body={t.terms.body} />;
}
