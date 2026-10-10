import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import {
  archiveFile,
  confirmUpload,
  createUploadTicket,
  getAdminClientDetail,
  getAdminWorkspace,
  setFileVisibility,
} from "@/lib/portal/admin.functions";
import {
  getAdminFiles,
  getFileEvents,
  updateFileMetadata,
} from "@/lib/portal/admin-ops.functions";
import {
  ALLOWED_UPLOAD_EXTENSIONS,
  DELIVERABLES_BUCKET,
  FILE_CATEGORIES,
  MAX_UPLOAD_BYTES,
  formatBytes,
  isAllowedUpload,
} from "@/lib/portal/constants";
import { useLang } from "@/lib/i18n";
import { portalCopy } from "@/lib/portal/copy";

export const Route = createFileRoute("/_authenticated/admin/files")({
  component: AdminFiles,
});

function AdminFiles() {
  const { lang } = useLang();
  const p = portalCopy(lang).admin;
  const qc = useQueryClient();
  const fetchFiles = useServerFn(getAdminFiles);
  const fetchWorkspace = useServerFn(getAdminWorkspace);
  const fetchClient = useServerFn(getAdminClientDetail);
  const ticket = useServerFn(createUploadTicket);
  const confirm = useServerFn(confirmUpload);
  const visibility = useServerFn(setFileVisibility);
  const archive = useServerFn(archiveFile);
  const updateMeta = useServerFn(updateFileMetadata);
  const fetchEvents = useServerFn(getFileEvents);

  const files = useQuery({ queryKey: ["admin-files"], queryFn: () => fetchFiles({}) });
  const workspace = useQuery({ queryKey: ["admin-workspace"], queryFn: () => fetchWorkspace({}) });
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const client = useQuery({
    queryKey: ["admin-client", clientId],
    queryFn: () => fetchClient({ data: { clientId } }),
    enabled: Boolean(clientId),
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "verified" | "failed">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const selected = (files.data ?? []).find((f) => f.id === selectedId) ?? null;
  const events = useQuery({
    queryKey: ["admin-file-events", selectedId],
    queryFn: () => fetchEvents({ data: { fileId: selectedId! } }),
    enabled: Boolean(selectedId),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (files.data ?? []).filter((f) =>
      !q || [f.displayName, f.originalFilename, f.clientName, f.projectTitle, f.category].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [files.data, search]);

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["admin-files"] });
    await qc.invalidateQueries({ queryKey: ["admin-workspace"] });
    await qc.invalidateQueries({ queryKey: ["admin-client"] });
    await qc.invalidateQueries({ queryKey: ["admin-counts"] });
    await qc.invalidateQueries({ queryKey: ["admin-file-events", selectedId] });
  }

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const publish = submitter?.value === "publish";
    setUploadError(null);
    const form = event.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size <= 0) return setUploadError(lang === "fr" ? "Choisissez un fichier." : "Choose a file.");
    if (!clientId) return setUploadError(p.selectClientFirst);
    if (!isAllowedUpload(file.name, file.type)) return setUploadError(lang === "fr" ? "Type de fichier non accepté." : "Unsupported file type.");
    if (file.size > MAX_UPLOAD_BYTES) return setUploadError(lang === "fr" ? "Fichier trop volumineux." : "File is too large.");

    try {
      setUploadState("uploading");
      const result = await ticket({
        data: {
          clientId,
          projectId: String(fd.get("projectId") || "") || null,
          displayName: String(fd.get("displayName") || file.name),
          description: String(fd.get("description") || ""),
          category: String(fd.get("category") || "deliverable"),
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          version: Number(fd.get("version") || 1),
        },
      });

      const { error } = await supabase.storage
        .from(DELIVERABLES_BUCKET)
        .uploadToSignedUrl(result.path, result.token, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
      if (error) throw error;

      setUploadState("processing");
      await confirm({
        data: {
          fileId: result.fileId,
          replacesFileId: String(fd.get("replacesFileId") || "") || null,
        },
      });
      if (publish) await visibility({ data: { fileId: result.fileId, visible: true } });
      setUploadState("verified");
      form.reset();
      setClientId("");
      setProjectId("");
      await refresh();
    } catch (error) {
      setUploadState("failed");
      setUploadError(error instanceof Error ? error.message : (lang === "fr" ? "Téléversement échoué." : "Upload failed."));
    }
  }

  async function onMetadata(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const fd = new FormData(event.currentTarget);
    await updateMeta({
      data: {
        fileId: selected.id,
        displayName: String(fd.get("displayName") ?? ""),
        category: String(fd.get("category") ?? ""),
        description: String(fd.get("description") ?? ""),
        version: Number(fd.get("version") ?? 1),
        projectId: String(fd.get("projectId") || "") || null,
      },
    });
    await refresh();
  }

  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{p.files}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{p.nav.files}</h1>

      <form className="mt-10 border-y border-border py-7" onSubmit={upload}>
        <h2 className="text-lg font-semibold">{p.uploadTitle}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {p.client}
            <select
              required
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setProjectId("");
              }}
              className="mt-2 w-full border border-border bg-background px-3 py-3 text-foreground"
            >
              <option value="">{p.client}</option>
              {(workspace.data?.clients ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {p.project}
            <select
              name="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              disabled={!clientId}
              className="mt-2 w-full border border-border bg-background px-3 py-3 text-foreground disabled:opacity-50"
            >
              <option value="">{p.all}</option>
              {(client.data?.projects ?? []).map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {lang === "fr" ? "Remplace un fichier" : "Replaces a file"}
            <select
              name="replacesFileId"
              disabled={!clientId}
              className="mt-2 w-full border border-border bg-background px-3 py-3 text-foreground disabled:opacity-50"
            >
              <option value="">{lang === "fr" ? "Aucun — nouveau livrable" : "None — new deliverable"}</option>
              {(files.data ?? [])
                .filter((existing) =>
                  existing.clientId === clientId &&
                  !existing.isArchived &&
                  existing.uploadVerified &&
                  (projectId ? existing.projectId === projectId : existing.projectId == null)
                )
                .map((existing) => (
                  <option key={existing.id} value={existing.id}>
                    {existing.displayName} · v{existing.version}
                  </option>
                ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {p.displayName}
            <input name="displayName" className="mt-2 w-full border-b border-border bg-transparent py-3 text-foreground outline-none focus:border-primary" />
          </label>
          <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {p.category}
            <select name="category" defaultValue="deliverable" className="mt-2 w-full border border-border bg-background px-3 py-3 text-foreground">
              {FILE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {p.version}
            <input name="version" type="number" min={1} max={999} defaultValue={1} className="mt-2 w-full border-b border-border bg-transparent py-3 text-foreground outline-none focus:border-primary" />
          </label>
          <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {p.chooseFile}
            <input name="file" type="file" required className="mt-2 block w-full text-sm text-foreground file:mr-4 file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-foreground" />
          </label>
          <label className="md:col-span-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {p.description}
            <textarea name="description" rows={3} className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm text-foreground outline-none focus:border-primary" />
          </label>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          {p.allowed}: {ALLOWED_UPLOAD_EXTENSIONS.join(", ").toUpperCase()} · {p.maxSize}: {formatBytes(MAX_UPLOAD_BYTES)}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-7">
          <button type="submit" name="intent" value="private" className="link-arrow" disabled={uploadState === "uploading" || uploadState === "processing"}>{p.savePrivate}</button>
          <button type="submit" name="intent" value="publish" className="btn-solid" disabled={uploadState === "uploading" || uploadState === "processing"}>{p.publish}</button>
          {uploadState !== "idle" ? <span role="status" className="text-sm text-muted-foreground">{p.uploadStates[uploadState]}</span> : null}
        </div>
        {uploadError ? <p role="alert" className="mt-4 text-sm text-destructive">{uploadError}</p> : null}
      </form>

      <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(22rem,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={p.search} className="w-full border-b border-border bg-transparent px-1 py-3 outline-none focus:border-primary" />
          <div className="mt-5 border-y border-border">
            {filtered.map((file) => (
              <button type="button" key={file.id} onClick={() => setSelectedId(file.id)} className="w-full border-b border-border py-5 text-left last:border-b-0 hover:text-primary">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-medium">{file.displayName}</span>
                  <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {file.isArchived ? p.archivedLabel : file.isVisibleToClient ? p.publishedLabel : file.uploadVerified ? p.privateLabel : p.unverified}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{[file.clientName, file.projectTitle, file.category, formatBytes(file.sizeBytes), `v${file.version}`].filter(Boolean).join(" · ")}</p>
              </button>
            ))}
            {!files.isLoading && filtered.length === 0 ? <p className="py-6 text-sm text-muted-foreground">{p.empty}</p> : null}
          </div>
        </div>

        <div>
          {selected ? (
            <>
              <form key={selected.id} onSubmit={onMetadata} className="grid gap-5">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{selected.clientName}</p>
                <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {p.displayName}
                  <input name="displayName" defaultValue={selected.displayName} required className="mt-2 w-full border-b border-border bg-transparent py-3 text-base text-foreground outline-none focus:border-primary" />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {p.category}
                    <select name="category" defaultValue={selected.category} className="mt-2 w-full border border-border bg-background px-3 py-3 text-foreground">
                      {FILE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {p.version}
                    <input name="version" type="number" min={1} max={999} defaultValue={selected.version} className="mt-2 w-full border-b border-border bg-transparent py-3 text-foreground outline-none focus:border-primary" />
                  </label>
                </div>
                <input type="hidden" name="projectId" value={selected.projectId ?? ""} />
                <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {p.description}
                  <textarea name="description" defaultValue={selected.description ?? ""} rows={4} className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm text-foreground outline-none focus:border-primary" />
                </label>
                <div className="flex flex-wrap gap-6">
                  <button type="submit" className="link-arrow">{p.save}</button>
                  {selected.uploadVerified && !selected.isArchived ? (
                    <button type="button" className="link-arrow" onClick={async () => { await visibility({ data: { fileId: selected.id, visible: !selected.isVisibleToClient } }); await refresh(); }}>
                      {selected.isVisibleToClient ? p.unpublish : p.publish}
                    </button>
                  ) : null}
                  <button type="button" className="text-sm text-muted-foreground hover:text-foreground" onClick={async () => { await archive({ data: { fileId: selected.id, archived: !selected.isArchived } }); await refresh(); }}>
                    {selected.isArchived ? p.restore : p.archive}
                  </button>
                </div>
              </form>

              <section className="mt-10 border-t border-border pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{p.history}</h3>
                <div className="mt-4 border-y border-border">
                  {(events.data ?? []).map((event) => (
                    <div key={event.id} className="grid gap-1 border-b border-border py-3 text-xs last:border-b-0 sm:grid-cols-[10rem_1fr]">
                      <span>{new Date(event.createdAt).toLocaleString()}</span>
                      <span className="text-muted-foreground">{event.eventType}{event.actor ? ` · ${event.actor}` : ""}</span>
                    </div>
                  ))}
                  {!events.isLoading && (events.data?.length ?? 0) === 0 ? <p className="py-3 text-sm text-muted-foreground">{p.empty}</p> : null}
                </div>
              </section>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{lang === "fr" ? "Sélectionnez un fichier." : "Select a file."}</p>
          )}
        </div>
      </div>
    </section>
  );
}
