import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import { createClientProject, getAdminWorkspace } from "@/lib/portal/admin.functions";
import { getAdminProjects, updateClientProject } from "@/lib/portal/admin-ops.functions";
import { PROJECT_STATUSES } from "@/lib/portal/constants";
import { useLang } from "@/lib/i18n";
import { portalCopy } from "@/lib/portal/copy";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: AdminProjects,
});

function AdminProjects() {
  const { lang } = useLang();
  const p = portalCopy(lang).admin;
  const qc = useQueryClient();
  const fetchProjects = useServerFn(getAdminProjects);
  const fetchWorkspace = useServerFn(getAdminWorkspace);
  const createProject = useServerFn(createClientProject);
  const updateProject = useServerFn(updateClientProject);

  const projects = useQuery({ queryKey: ["admin-projects"], queryFn: () => fetchProjects({}) });
  const workspace = useQuery({ queryKey: ["admin-workspace"], queryFn: () => fetchWorkspace({}) });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const selected = (projects.data ?? []).find((x) => x.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (projects.data ?? []).filter((x) =>
      !q || [x.title, x.reference, x.clientName, x.location, x.status].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [projects.data, search]);

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["admin-projects"] });
    await qc.invalidateQueries({ queryKey: ["admin-workspace"] });
    await qc.invalidateQueries({ queryKey: ["admin-counts"] });
  }

  async function onCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const result = await createProject({
      data: {
        clientId: String(fd.get("clientId") ?? ""),
        title: String(fd.get("title") ?? ""),
        reference: String(fd.get("reference") ?? ""),
        location: String(fd.get("location") ?? ""),
        serviceType: String(fd.get("serviceType") ?? ""),
        status: String(fd.get("status") ?? "planning"),
      },
    });
    setSelectedId(result.id);
    setShowCreate(false);
    await refresh();
  }

  async function onUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const fd = new FormData(event.currentTarget);
    await updateProject({
      data: {
        projectId: selected.id,
        title: String(fd.get("title") ?? ""),
        reference: String(fd.get("reference") ?? ""),
        location: String(fd.get("location") ?? ""),
        serviceType: String(fd.get("serviceType") ?? ""),
        status: String(fd.get("status") ?? "planning"),
        description: String(fd.get("description") ?? ""),
        missionRequestId: selected.missionRequestId,
      },
    });
    await refresh();
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{p.project}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{p.nav.projects}</h1>
        </div>
        <button type="button" onClick={() => setShowCreate((v) => !v)} className="link-arrow">{p.actions.newProject}</button>
      </div>

      {showCreate ? (
        <form onSubmit={onCreate} className="mt-8 grid gap-5 border-y border-border py-6 sm:grid-cols-2">
          <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {p.client}
            <select name="clientId" required className="mt-2 w-full border border-border bg-background px-3 py-3 text-foreground">
              <option value="">{p.client}</option>
              {(workspace.data?.clients ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <Field name="title" label={p.name} required />
          <Field name="reference" label={p.reference} />
          <Field name="location" label={p.location} />
          <Field name="serviceType" label={p.service} />
          <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {p.status}
            <select name="status" defaultValue="planning" className="mt-2 w-full border border-border bg-background px-3 py-3 text-foreground">
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <div className="sm:col-span-2 flex gap-6">
            <button type="submit" className="link-arrow">{p.create}</button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-sm text-muted-foreground">{p.cancel}</button>
          </div>
        </form>
      ) : null}

      <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={p.search} className="w-full border-b border-border bg-transparent px-1 py-3 outline-none focus:border-primary" />
          <div className="mt-5 border-y border-border">
            {filtered.map((project) => (
              <button type="button" key={project.id} onClick={() => setSelectedId(project.id)} className="w-full border-b border-border py-5 text-left last:border-b-0 hover:text-primary">
                <div className="flex items-start justify-between gap-5">
                  <span className="font-medium">{project.title}</span>
                  <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{project.status}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{[project.clientName, project.reference, project.location, `${project.fileCount} ${p.files.toLowerCase()}`].filter(Boolean).join(" · ")}</p>
              </button>
            ))}
            {!projects.isLoading && filtered.length === 0 ? <p className="py-6 text-sm text-muted-foreground">{p.empty}</p> : null}
          </div>
        </div>

        <div>
          {selected ? (
            <form key={selected.id} onSubmit={onUpdate} className="grid gap-6">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{selected.clientName}</p>
              <Field name="title" label={p.name} defaultValue={selected.title} required />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="reference" label={p.reference} defaultValue={selected.reference ?? ""} />
                <Field name="location" label={p.location} defaultValue={selected.location ?? ""} />
                <Field name="serviceType" label={p.service} defaultValue={selected.serviceType ?? ""} />
                <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {p.status}
                  <select name="status" defaultValue={selected.status} className="mt-2 w-full border border-border bg-background px-3 py-3 text-foreground">
                    {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {p.description}
                <textarea name="description" defaultValue={selected.description ?? ""} rows={5} className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm text-foreground outline-none focus:border-primary" />
              </label>
              <div>
                <button type="submit" className="link-arrow">{p.save}</button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">{lang === "fr" ? "Sélectionnez un projet." : "Select a project."}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ name, label, defaultValue = "", required = false }: { name: string; label: string; defaultValue?: string; required?: boolean }) {
  return (
    <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
      {label}
      <input name={name} defaultValue={defaultValue} required={required} className="mt-2 w-full border-b border-border bg-transparent py-3 text-base text-foreground outline-none focus:border-primary" />
    </label>
  );
}
