import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";
import { getPortalOverview, requestFileDownload } from "@/lib/portal/client.functions";
import { formatBytes } from "@/lib/portal/constants";
import { privateHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/client")({
  component: ClientArea,
  head: () =>
    privateHead(
      "Espace client — DRONE AIR",
      "Consultez vos projets DRONE AIR et téléchargez vos livrables aériens en toute sécurité.",
    ),
});

function ClientArea() {
  const { t } = useLang();
  const p = t.portal.client;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchOverview = useServerFn(getPortalOverview);
  const download = useServerFn(requestFileDownload);
  const [projectFilter, setProjectFilter] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["portal-overview"],
    queryFn: () => fetchOverview({}),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/login", replace: true });
  }

  async function onDownload(fileId: string) {
    setPendingId(fileId);
    try {
      const result = await download({ data: { fileId } });
      window.open(result.url, "_blank", "noopener,noreferrer");
    } finally {
      setPendingId(null);
    }
  }

  const files = (data?.files ?? []).filter(
    (f) => projectFilter === "all" || f.projectId === projectFilter,
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex min-h-16 w-full max-w-[92rem] items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link to="/" aria-label={COMPANY.name}>
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-5">
            {data?.isAdmin ? (
              <Link to="/admin" className="text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
                {t.portal.nav.admin}
              </Link>
            ) : null}
            <LanguageToggle />
            <button
              type="button"
              onClick={signOut}
              className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.portal.nav.signOut}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[92rem] flex-1 px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{p.title}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-6xl">
          {p.welcome}
          {data?.profile.firstName ? `, ${data.profile.firstName}` : ""}.
        </h1>

        {isLoading ? (
          <p className="mt-12 text-sm text-muted-foreground">{p.preparing}</p>
        ) : isError ? (
          <p role="alert" className="mt-12 text-sm text-destructive">
            {t.portal.auth.genericError}
          </p>
        ) : (data?.clients.length ?? 0) === 0 ? (
          <p className="mt-12 max-w-xl border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
            {p.noClient}
          </p>
        ) : (
          <>
            <section className="mt-16">
              <div className="flex items-end justify-between gap-6">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{p.projects}</h2>
                <span className="text-xs text-muted-foreground">{data?.projects.length ?? 0}</span>
              </div>
              <div className="mt-5 border-y border-border">
                {(data?.projects ?? []).map((project, index) => (
                  <Link
                    key={project.id}
                    to="/client/projects/$projectId"
                    params={{ projectId: project.id }}
                    className="grid gap-4 border-b border-border py-6 last:border-b-0 hover:text-primary md:grid-cols-[3rem_minmax(0,1fr)_12rem_10rem] md:items-center"
                  >
                    <span className="text-xs tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <strong className="block text-lg font-medium">{project.title}</strong>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {[project.reference, project.location].filter(Boolean).join(" · ") || "—"}
                      </span>
                    </span>
                    <span className="text-sm text-muted-foreground">{project.serviceType ?? "—"}</span>
                    <span className="text-xs uppercase tracking-[0.12em]">{project.status}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-20">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{p.files}</h2>
                  <p className="mt-2 text-xs text-muted-foreground">{p.downloadNote}</p>
                </div>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  aria-label={p.projects}
                  className="border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="all">{p.allProjects}</option>
                  {(data?.projects ?? []).map((project) => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
              </div>

              {files.length === 0 ? (
                <p className="mt-6 border-t border-border pt-6 text-sm text-muted-foreground">{p.noFiles}</p>
              ) : (
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  {files.map((file, index) => (
                    <li key={file.id} className="grid gap-4 py-5 md:grid-cols-[3rem_minmax(0,1fr)_12rem_auto] md:items-center">
                      <span className="text-xs tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{file.displayName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {file.category} · {formatBytes(file.sizeBytes)} · {p.version} {file.version}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {file.publishedAt ? new Date(file.publishedAt).toLocaleDateString() : "—"}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDownload(file.id)}
                        disabled={pendingId === file.id}
                        className="link-arrow"
                      >
                        {pendingId === file.id ? p.preparing : p.download}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
