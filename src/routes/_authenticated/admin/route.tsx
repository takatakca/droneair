import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/portal/AdminShell";
import { privateHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminShell,
  head: () =>
    privateHead(
      "Administration — DRONE AIR",
      "Console privée DRONE AIR pour les clients, projets, demandes de mission et livrables.",
    ),
});
