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

export const Route = createFileRoute("/_authenticated/client")({
  component: ClientArea,
  head: () => ({
    meta: [
      { title: "Espace client — DRONE AIR" },
      {
        name: "description",
        content: "Consultez vos projets DRONE AIR et téléchargez vos livrables aériens en toute sécurité.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Espace client — DRONE AIR" },
      { property: "og:description", content: "Vos projets et livrables aériens DRONE AIR." },
    ],
  }),
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

  const { data, isLoading } = useQuery({
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
        <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/" aria-label={COMPANY.name}>
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-5">
            <LanguageToggle />
            <button
              type="button"
              onClick={signOut}
              className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.portal.nav.signOut}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[92rem] flex-1 px-5 py-14 sm:px-8">
        <p className="label-tech text-silver">{p.title}</p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
          {p.welcome}
          {data?.profile.firstName ? `, ${data.profile.firstName}` : ""}
        </h1>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">{p.preparing}</p>
        ) : (data?.clients.length ?? 0) === 0 ? (
          <p className="hairline mt-10 max-w-xl pt-6 text-sm leading-relaxed text-muted-foreground">
            {p.noClient}
          </p>
        ) : (
          <>
            <section className="mt-14">
              <h2 className="label-tech text-muted-foreground">{p.projects}</h2>
              <div className="mt-5 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {(data?.projects ?? []).map((project) => (
                  <article key={project.id} className="bg-background p-6">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary">
                      {project.status}
                    </p>
                    <h3 className="mt-3 text-base font-medium text-foreground">{project.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {[project.reference, project.location].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-16">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <h2 className="label-tech text-muted-foreground">{p.files}</h2>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  aria-label={p.projects}
                  className="rounded-sm border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground"
                >
                  <option value="all">{p.allProjects}</option>
                  {(data?.projects ?? []).map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              {files.length === 0 ? (
                <p className="hairline mt-6 pt-6 text-sm text-muted-foreground">{p.noFiles}</p>
              ) : (
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  {files.map((file) => (
                    <li
                      key={file.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {file.displayName}
                        </p>
                        <p className="mt-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                          {file.category} · {formatBytes(file.sizeBytes)} · {p.version} {file.version}
                          {file.publishedAt
                            ? ` · ${p.published} ${new Date(file.publishedAt).toLocaleDateString()}`
                            : ""}
                        </p>
                      </div>
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
              <p className="mt-5 text-xs text-muted-foreground">{p.downloadNote}</p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}