import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { getAdminCounts } from "@/lib/portal/admin-ops.functions";
import { useLang } from "@/lib/i18n";
import { portalCopy } from "@/lib/portal/copy";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { lang } = useLang();
  const p = portalCopy(lang).admin;
  const getCounts = useServerFn(getAdminCounts);
  const counts = useQuery({
    queryKey: ["admin-counts"],
    queryFn: () => getCounts({}),
  });

  const rows = [
    { label: p.counts.missions, value: counts.data?.missions ?? "—", sub: counts.data ? `${counts.data.newMissions} ${p.counts.newMissions}` : "", to: "/admin/missions" },
    { label: p.counts.clients, value: counts.data?.clients ?? "—", sub: "", to: "/admin/clients" },
    { label: p.counts.projects, value: counts.data?.activeProjects ?? "—", sub: "", to: "/admin/projects" },
    { label: p.counts.files, value: counts.data?.files ?? "—", sub: counts.data ? `${counts.data.publishedFiles} ${p.counts.published}` : "", to: "/admin/files" },
  ];

  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{p.console}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {p.nav.home}
      </h1>

      {counts.isError ? (
        <p role="alert" className="mt-8 text-sm text-destructive">
          {lang === "fr" ? "Impossible de charger l’aperçu." : "Could not load the overview."}
        </p>
      ) : null}

      <div className="mt-12 border-y border-border">
        {rows.map((row) => (
          <Link
            key={row.to}
            to={row.to}
            className="grid gap-2 border-b border-border py-6 transition-colors last:border-b-0 hover:text-primary sm:grid-cols-[minmax(0,1fr)_9rem_10rem] sm:items-baseline"
          >
            <span className="text-lg font-medium">{row.label}</span>
            <strong className="text-3xl font-semibold tabular-nums">{row.value}</strong>
            <span className="text-xs text-muted-foreground">{row.sub}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
        <Link to="/admin/clients" className="link-arrow">{p.actions.newClient}</Link>
        <Link to="/admin/projects" className="link-arrow">{p.actions.newProject}</Link>
        <Link to="/admin/files" className="link-arrow">{p.actions.upload}</Link>
      </div>
    </section>
  );
}
