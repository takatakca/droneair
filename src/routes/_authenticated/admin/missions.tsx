import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import { getAdminWorkspace } from "@/lib/portal/admin.functions";
import {
  createClientFromMission,
  createProjectFromMission,
  getAdminMissions,
  getMissionDetail,
  updateMissionStatus,
} from "@/lib/portal/admin-ops.functions";
import { MISSION_STATUSES } from "@/lib/portal/validate";
import { useLang } from "@/lib/i18n";
import { portalCopy } from "@/lib/portal/copy";

export const Route = createFileRoute("/_authenticated/admin/missions")({
  component: AdminMissions,
});

function AdminMissions() {
  const { lang } = useLang();
  const p = portalCopy(lang).admin;
  const qc = useQueryClient();
  const fetchMissions = useServerFn(getAdminMissions);
  const fetchDetail = useServerFn(getMissionDetail);
  const fetchWorkspace = useServerFn(getAdminWorkspace);
  const setStatus = useServerFn(updateMissionStatus);
  const createClient = useServerFn(createClientFromMission);
  const createProject = useServerFn(createProjectFromMission);

  const missions = useQuery({ queryKey: ["admin-missions"], queryFn: () => fetchMissions({}) });
  const workspace = useQuery({ queryKey: ["admin-workspace"], queryFn: () => fetchWorkspace({}) });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);
  const detail = useQuery({
    queryKey: ["admin-mission", selectedId],
    queryFn: () => fetchDetail({ data: { missionId: selectedId! } }),
    enabled: Boolean(selectedId),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (missions.data ?? []).filter((m) =>
      !q || [m.name, m.company, m.email, m.serviceType, m.projectLocation, m.submissionStatus].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [missions.data, search]);

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["admin-missions"] });
    await qc.invalidateQueries({ queryKey: ["admin-mission", selectedId] });
    await qc.invalidateQueries({ queryKey: ["admin-workspace"] });
    await qc.invalidateQueries({ queryKey: ["admin-counts"] });
  }

  const selected = detail.data;

  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{p.missionDetail}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{p.nav.missions}</h1>

      <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={p.search} className="w-full border-b border-border bg-transparent px-1 py-3 outline-none focus:border-primary" />
          <div className="mt-5 border-y border-border">
            {filtered.map((m) => (
              <button type="button" key={m.id} onClick={() => { setSelectedId(m.id); setCreatedClientId(null); }} className="w-full border-b border-border py-5 text-left last:border-b-0 hover:text-primary">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{m.submissionStatus}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{[m.serviceType, m.projectLocation, m.leadPriority].filter(Boolean).join(" · ")}</p>
              </button>
            ))}
            {!missions.isLoading && filtered.length === 0 ? <p className="py-6 text-sm text-muted-foreground">{p.empty}</p> : null}
          </div>
        </div>

        <div className="min-w-0">
          {!selectedId ? (
            <p className="text-sm text-muted-foreground">{lang === "fr" ? "Sélectionnez une demande." : "Select a request."}</p>
          ) : detail.isLoading ? (
            <p className="text-sm text-muted-foreground">{p.loading}</p>
          ) : selected ? (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-semibold">{selected.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{[selected.company, selected.email, selected.telephone].filter(Boolean).join(" · ")}</p>
                </div>
                <select
                  value={selected.submissionStatus}
                  onChange={async (e) => { await setStatus({ data: { missionId: selected.id, status: e.target.value } }); await refresh(); }}
                  className="border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {MISSION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <dl className="mt-8 grid gap-x-8 gap-y-6 border-y border-border py-6 sm:grid-cols-2">
                <Item label={p.location} value={selected.projectLocation} />
                <Item label={p.service} value={selected.serviceType} />
                <Item label={p.language} value={selected.preferredLanguage} />
                <Item label={p.desiredDate} value={selected.desiredDate ?? "—"} />
                <Item label={p.area} value={selected.approximateArea ?? "—"} />
                <Item label={p.created} value={new Date(selected.createdAt).toLocaleString()} />
              </dl>

              <section className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{p.description}</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{selected.description}</p>
              </section>

              <section className="mt-10 border-t border-border pt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-destructive">{p.internalOnly}</p>
                <h3 className="mt-5 text-sm font-semibold">{p.aiSummary}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.aiSummary ?? "—"}</p>
                <h3 className="mt-6 text-sm font-semibold">{p.aiQuestions}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {(selected.aiFollowUpQuestions ?? []).map((q) => <li key={q}>{q}</li>)}
                </ul>

                <h3 className="mt-8 text-sm font-semibold">{p.emailLog}</h3>
                <div className="mt-3 border-y border-border">
                  {selected.emailEvents.map((event) => (
                    <div key={event.id} className="grid gap-1 border-b border-border py-3 text-xs last:border-b-0 sm:grid-cols-[10rem_1fr_7rem]">
                      <span>{new Date(event.createdAt).toLocaleString()}</span>
                      <span className="text-muted-foreground">{event.eventType} · {event.recipient ?? "—"}</span>
                      <span>{event.status}</span>
                    </div>
                  ))}
                  {selected.emailEvents.length === 0 ? <p className="py-3 text-sm text-muted-foreground">{p.empty}</p> : null}
                </div>
              </section>

              <section className="mt-10 grid gap-8 border-t border-border pt-7 md:grid-cols-2">
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const fd = new FormData(event.currentTarget);
                    const result = await createClient({ data: { missionId: selected.id, name: String(fd.get("name") ?? "") } });
                    setCreatedClientId(result.clientId);
                    await refresh();
                  }}
                >
                  <h3 className="text-sm font-semibold">{p.createClientFromRequest}</h3>
                  <input name="name" defaultValue={selected.company || selected.name} required className="mt-4 w-full border-b border-border bg-transparent py-3 outline-none focus:border-primary" />
                  <button type="submit" className="link-arrow mt-4">{p.create}</button>
                </form>

                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const fd = new FormData(event.currentTarget);
                    await createProject({
                      data: {
                        missionId: selected.id,
                        clientId: String(fd.get("clientId") ?? ""),
                        title: String(fd.get("title") ?? ""),
                      },
                    });
                    await refresh();
                  }}
                >
                  <h3 className="text-sm font-semibold">{p.createProjectFromRequest}</h3>
                  <select name="clientId" required defaultValue={createdClientId ?? ""} key={createdClientId ?? "none"} className="mt-4 w-full border border-border bg-background px-3 py-3 text-foreground">
                    <option value="">{p.client}</option>
                    {(workspace.data?.clients ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input name="title" defaultValue={selected.company ? `${selected.company} — ${selected.serviceType}` : `${selected.name} — ${selected.serviceType}`} required className="mt-3 w-full border-b border-border bg-transparent py-3 outline-none focus:border-primary" />
                  <button type="submit" className="link-arrow mt-4">{p.create}</button>
                </form>
              </section>
            </div>
          ) : (
            <p className="text-sm text-destructive">{lang === "fr" ? "Demande introuvable." : "Request not found."}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</dt><dd className="mt-1 text-sm">{value}</dd></div>;
}
