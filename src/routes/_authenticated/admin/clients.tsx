import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import {
  addClientMember,
  createClientAccount,
  getAdminClientDetail,
  getAdminWorkspace,
} from "@/lib/portal/admin.functions";
import {
  findAccountByEmail,
  removeClientMember,
  updateClientAccount,
} from "@/lib/portal/admin-ops.functions";
import { useLang } from "@/lib/i18n";
import { portalCopy } from "@/lib/portal/copy";

export const Route = createFileRoute("/_authenticated/admin/clients")({
  component: AdminClients,
});

function AdminClients() {
  const { lang } = useLang();
  const p = portalCopy(lang).admin;
  const qc = useQueryClient();
  const getWorkspace = useServerFn(getAdminWorkspace);
  const getDetail = useServerFn(getAdminClientDetail);
  const createClient = useServerFn(createClientAccount);
  const updateClient = useServerFn(updateClientAccount);
  const lookupAccount = useServerFn(findAccountByEmail);
  const addMember = useServerFn(addClientMember);
  const removeMember = useServerFn(removeClientMember);

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [lookup, setLookup] = useState<{ found: boolean; name: string | null } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const workspace = useQuery({
    queryKey: ["admin-workspace"],
    queryFn: () => getWorkspace({}),
  });
  const detail = useQuery({
    queryKey: ["admin-client", selectedId],
    queryFn: () => getDetail({ data: { clientId: selectedId! } }),
    enabled: Boolean(selectedId),
  });

  const clients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (workspace.data?.clients ?? []).filter((c) => !q || c.name.toLowerCase().includes(q));
  }, [workspace.data, search]);

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["admin-workspace"] });
    await qc.invalidateQueries({ queryKey: ["admin-client", selectedId] });
    await qc.invalidateQueries({ queryKey: ["admin-counts"] });
  }

  async function onCreate(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    const result = await createClient({ data: { name: newName } });
    setNewName("");
    setSelectedId(result.id);
    await refresh();
  }

  async function onUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail.data) return;
    const fd = new FormData(event.currentTarget);
    await updateClient({
      data: {
        clientId: detail.data.client.id,
        name: String(fd.get("name") ?? ""),
        status: String(fd.get("status") ?? "active"),
      },
    });
    setMessage(lang === "fr" ? "Client mis à jour." : "Client updated.");
    await refresh();
  }

  async function onLookup(event: React.FormEvent) {
    event.preventDefault();
    const result = await lookupAccount({ data: { email: memberEmail } });
    setLookup({ found: result.found, name: result.name });
  }

  async function onConfirmLink() {
    if (!selectedId || !lookup?.found) return;
    await addMember({ data: { clientId: selectedId, email: memberEmail } });
    setMemberEmail("");
    setLookup(null);
    setMessage(lang === "fr" ? "Compte associé." : "Account linked.");
    await refresh();
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{p.client}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{p.nav.clients}</h1>
        </div>
        <form onSubmit={onCreate} className="flex min-w-[18rem] flex-1 gap-3 sm:max-w-xl">
          <input
            required
            minLength={2}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={p.actions.newClient}
            className="min-w-0 flex-1 border-b border-border bg-transparent px-1 py-3 outline-none focus:border-primary"
          />
          <button className="link-arrow" type="submit">{p.create}</button>
        </form>
      </div>

      {message ? <p role="status" className="mt-5 text-sm text-primary">{message}</p> : null}

      <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={p.search}
            className="w-full border-b border-border bg-transparent px-1 py-3 outline-none focus:border-primary"
          />
          <div className="mt-5 border-y border-border">
            {clients.map((client) => (
              <button
                type="button"
                key={client.id}
                onClick={() => setSelectedId(client.id)}
                className="grid w-full grid-cols-[1fr_auto] gap-5 border-b border-border py-5 text-left last:border-b-0 hover:text-primary"
              >
                <span>
                  <strong className="block font-medium">{client.name}</strong>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {client.memberCount} {p.members.toLowerCase()} · {client.projectCount} {p.projects.toLowerCase()} · {client.fileCount} {p.files.toLowerCase()}
                  </span>
                </span>
                <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{client.status}</span>
              </button>
            ))}
            {!workspace.isLoading && clients.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground">{p.empty}</p>
            ) : null}
          </div>
        </div>

        <div className="min-w-0">
          {!selectedId ? (
            <p className="text-sm text-muted-foreground">
              {lang === "fr" ? "Sélectionnez un client pour gérer son dossier." : "Select a client to manage its record."}
            </p>
          ) : detail.isLoading ? (
            <p className="text-sm text-muted-foreground">{p.loading}</p>
          ) : detail.data ? (
            <div>
              <form onSubmit={onUpdate} className="grid gap-5 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
                <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {p.name}
                  <input name="name" defaultValue={detail.data.client.name} className="mt-2 w-full border-b border-border bg-transparent py-2 text-base text-foreground outline-none focus:border-primary" />
                </label>
                <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {p.status}
                  <select name="status" defaultValue={detail.data.client.status} className="mt-2 w-full border border-border bg-background px-3 py-2 text-foreground">
                    <option value="active">active</option>
                    <option value="paused">paused</option>
                    <option value="archived">archived</option>
                  </select>
                </label>
                <button className="link-arrow" type="submit">{p.save}</button>
              </form>

              <section className="mt-12">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{p.members}</h2>
                <div className="mt-4 border-y border-border">
                  {detail.data.members.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-b-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm">{member.email ?? member.userId}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{member.role}</p>
                      </div>
                      <button
                        type="button"
                        className="text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-destructive"
                        onClick={async () => {
                          await removeMember({ data: { clientId: detail.data!.client.id, userId: member.userId } });
                          await refresh();
                        }}
                      >
                        {p.remove}
                      </button>
                    </div>
                  ))}
                  {detail.data.members.length === 0 ? <p className="py-4 text-sm text-muted-foreground">{p.empty}</p> : null}
                </div>

                <form onSubmit={onLookup} className="mt-6 flex flex-wrap gap-3">
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => { setMemberEmail(e.target.value); setLookup(null); }}
                    placeholder={p.email}
                    className="min-w-[16rem] flex-1 border-b border-border bg-transparent px-1 py-3 outline-none focus:border-primary"
                  />
                  <button type="submit" className="link-arrow">{p.lookup}</button>
                </form>
                {lookup ? (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-sm">
                    <span>
                      {lookup.found
                        ? `${p.accountFound}${lookup.name ? `: ${lookup.name}` : ""}`
                        : p.noAccount}
                    </span>
                    {lookup.found ? (
                      <button type="button" onClick={onConfirmLink} className="link-arrow">{p.confirmLink}</button>
                    ) : null}
                  </div>
                ) : null}
              </section>

              <section className="mt-12 grid gap-10 md:grid-cols-2">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{p.projects}</h2>
                  <div className="mt-4 border-y border-border">
                    {detail.data.projects.map((project) => (
                      <div key={project.id} className="border-b border-border py-4 last:border-b-0">
                        <p className="font-medium">{project.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{[project.reference, project.location, project.status].filter(Boolean).join(" · ")}</p>
                      </div>
                    ))}
                    {detail.data.projects.length === 0 ? <p className="py-4 text-sm text-muted-foreground">{p.empty}</p> : null}
                  </div>
                </div>
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{p.files}</h2>
                  <div className="mt-4 border-y border-border">
                    {detail.data.files.map((file) => (
                      <div key={file.id} className="border-b border-border py-4 last:border-b-0">
                        <p className="font-medium">{file.displayName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {file.isArchived ? p.archivedLabel : file.isVisibleToClient ? p.publishedLabel : p.privateLabel}
                        </p>
                      </div>
                    ))}
                    {detail.data.files.length === 0 ? <p className="py-4 text-sm text-muted-foreground">{p.empty}</p> : null}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <p className="text-sm text-destructive">{lang === "fr" ? "Client introuvable." : "Client not found."}</p>
          )}
        </div>
      </div>
    </section>
  );
}
