import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/Logo";
import { COMPANY } from "@/lib/company";
import { useLang } from "@/lib/i18n";
import { getPortalProject, requestFileDownload } from "@/lib/portal/client.functions";
import { formatBytes } from "@/lib/portal/constants";
import { portalCopy } from "@/lib/portal/copy";
import { privateHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/client/projects/$projectId")({
  component: ClientProjectPage,
  head: () => privateHead("Projet client — DRONE AIR", "Projet et livrables privés DRONE AIR."),
});

function ClientProjectPage() {
  const { projectId } = Route.useParams();
  const { lang } = useLang();
  const p = portalCopy(lang).project;
  const fetchProject = useServerFn(getPortalProject);
  const download = useServerFn(requestFileDownload);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["portal-project", projectId],
    queryFn: () => fetchProject({ data: { projectId } }),
    retry: false,
  });

  async function onDownload(fileId: string) {
    setPendingId(fileId);
    try {
      const result = await download({ data: { fileId } });
      window.open(result.url, "_blank", "noopener,noreferrer");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex min-h-16 max-w-[92rem] items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link to="/" aria-label={COMPANY.name}><Logo size="sm" /></Link>
          <LanguageToggle />
        </div>
      </header>

      <main className="mx-auto max-w-[92rem] px-5 py-14 sm:px-8 sm:py-20">
        <Link to="/client" className="link-arrow">{p.back}</Link>

        {query.isLoading ? (
          <p className="mt-12 text-sm text-muted-foreground">{p.preparing}</p>
        ) : query.isError || !query.data ? (
          <p role="alert" className="mt-12 text-sm text-destructive">{p.notFound}</p>
        ) : (
          <>
            <section className="mt-12">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{query.data.clientName}</p>
              <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">{query.data.project.title}</h1>
              <dl className="mt-10 grid gap-x-8 gap-y-6 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-4">
                <Item label={p.reference} value={query.data.project.reference ?? "—"} />
                <Item label={p.location} value={query.data.project.location ?? "—"} />
                <Item label={p.service} value={query.data.project.serviceType ?? "—"} />
                <Item label={p.status} value={query.data.project.status} />
              </dl>
              {query.data.description ? <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">{query.data.description}</p> : null}
            </section>

            <section className="mt-16">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{p.deliverables}</h2>
              {query.data.files.length === 0 ? (
                <p className="mt-5 border-t border-border pt-5 text-sm text-muted-foreground">{p.none}</p>
              ) : (
                <ul className="mt-5 divide-y divide-border border-y border-border">
                  {query.data.files.map((file, index) => (
                    <li key={file.id} className="grid gap-4 py-5 md:grid-cols-[3rem_minmax(0,1fr)_12rem_auto] md:items-center">
                      <span className="text-xs tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{file.displayName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{file.category} · {formatBytes(file.sizeBytes)} · v{file.version}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{file.publishedAt ? `${p.published} ${new Date(file.publishedAt).toLocaleDateString()}` : "—"}</span>
                      <button type="button" onClick={() => onDownload(file.id)} disabled={pendingId === file.id} className="link-arrow">
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

function Item({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</dt><dd className="mt-1 text-sm">{value}</dd></div>;
}
