import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  FILE_CATEGORIES,
  MAX_UPLOAD_BYTES,
  PROJECT_STATUSES,
  isAllowedUpload,
} from "@/lib/portal/constants";
import { trimmed } from "@/lib/portal/validate";

export interface AdminFile {
  id: string;
  displayName: string;
  description: string | null;
  category: string;
  sizeBytes: number | null;
  version: number;
  isVisibleToClient: boolean;
  isArchived: boolean;
  uploadVerified: boolean;
  publishedAt: string | null;
  projectId: string | null;
  createdAt: string;
}

export interface AdminClient {
  id: string;
  name: string;
  status: string;
  memberCount: number;
  projectCount: number;
  fileCount: number;
}

export interface AdminWorkspace {
  clients: AdminClient[];
  missions: {
    id: string;
    createdAt: string;
    name: string;
    company: string | null;
    email: string;
    serviceType: string;
    projectLocation: string;
    leadPriority: string;
    submissionStatus: string;
  }[];
}

export interface AdminClientDetail {
  client: { id: string; name: string; status: string };
  members: { userId: string; email: string | null; role: string }[];
  projects: {
    id: string;
    title: string;
    reference: string | null;
    status: string;
    location: string | null;
  }[];
  files: AdminFile[];
}

/** Admin overview: every client account plus the newest mission requests. */
export const getAdminWorkspace = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminWorkspace> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const [{ data: clients }, { data: memberships }, { data: projects }, { data: files }, { data: missions }] =
      await Promise.all([
        supabaseAdmin.from("clients").select("id, name, status").order("name"),
        supabaseAdmin.from("client_memberships").select("client_id"),
        supabaseAdmin.from("client_projects").select("client_id"),
        supabaseAdmin.from("client_files").select("client_id").eq("is_archived", false),
        supabaseAdmin
          .from("mission_requests")
          .select(
            "id, created_at, name, company, email, service_type, project_location, lead_priority, submission_status",
          )
          .order("created_at", { ascending: false })
          .limit(40),
      ]);

    const count = (rows: { client_id: string }[] | null, id: string) =>
      (rows ?? []).filter((r) => r.client_id === id).length;

    return {
      clients: (clients ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        memberCount: count(memberships, c.id),
        projectCount: count(projects, c.id),
        fileCount: count(files, c.id),
      })),
      missions: (missions ?? []).map((m) => ({
        id: m.id,
        createdAt: m.created_at,
        name: m.name,
        company: m.company,
        email: m.email,
        serviceType: m.service_type,
        projectLocation: m.project_location,
        leadPriority: m.lead_priority,
        submissionStatus: m.submission_status,
      })),
    };
  });

export const getAdminClientDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { clientId: string }) => {
    if (!data?.clientId) throw new Error("Missing client id");
    return { clientId: data.clientId };
  })
  .handler(async ({ data, context }): Promise<AdminClientDetail> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const { data: client, error } = await supabaseAdmin
      .from("clients")
      .select("id, name, status")
      .eq("id", data.clientId)
      .maybeSingle();
    if (error || !client) throw new Error("Client not found");

    const [{ data: members }, { data: projects }, { data: files }] = await Promise.all([
      supabaseAdmin
        .from("client_memberships")
        .select("user_id, membership_role")
        .eq("client_id", client.id),
      supabaseAdmin
        .from("client_projects")
        .select("id, title, project_reference, status, location")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("client_files")
        .select(
          "id, display_name, description, category, size_bytes, version, is_visible_to_client, is_archived, upload_verified, published_at, project_id, created_at",
        )
        .eq("client_id", client.id)
        .order("created_at", { ascending: false }),
    ]);

    const memberIds = (members ?? []).map((m) => m.user_id);
    const { data: profiles } = memberIds.length
      ? await supabaseAdmin.from("profiles").select("id, email").in("id", memberIds)
      : { data: [] as { id: string; email: string | null }[] };

    return {
      client,
      members: (members ?? []).map((m) => ({
        userId: m.user_id,
        email: (profiles ?? []).find((p) => p.id === m.user_id)?.email ?? null,
        role: m.membership_role,
      })),
      projects: (projects ?? []).map((p) => ({
        id: p.id,
        title: p.title,
        reference: p.project_reference,
        status: p.status,
        location: p.location,
      })),
      files: (files ?? []).map((f) => ({
        id: f.id,
        displayName: f.display_name,
        description: f.description,
        category: f.category,
        sizeBytes: f.size_bytes,
        version: f.version,
        isVisibleToClient: f.is_visible_to_client,
        isArchived: f.is_archived,
        uploadVerified: f.upload_verified,
        publishedAt: f.published_at,
        projectId: f.project_id,
        createdAt: f.created_at,
      })),
    };
  });

export const createClientAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { name: string }) => {
    const name = trimmed(data?.name, 120);
    if (name.length < 2) throw new Error("Client name is too short");
    return { name };
  })
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const { data: row, error } = await supabaseAdmin
      .from("clients")
      .insert({ name: data.name })
      .select("id")
      .single();
    if (error || !row) throw new Error("Could not create the client account");
    return { id: row.id };
  });

/** Links an existing signed-up user (matched by email) to a client account. */
export const addClientMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { clientId: string; email: string }) => {
    const email = trimmed(data?.email, 200).toLowerCase();
    if (!data?.clientId) throw new Error("Missing client id");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email address");
    return { clientId: data.clientId, email };
  })
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();
    if (!profile) throw new Error("No account exists with that email yet");

    const { error } = await supabaseAdmin
      .from("client_memberships")
      .upsert(
        { client_id: data.clientId, user_id: profile.id, membership_role: "member" },
        { onConflict: "client_id,user_id" },
      );
    if (error) throw new Error("Could not link that account");

    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: profile.id, role: "client" }, { onConflict: "user_id,role" });
    return { ok: true };
  });

export const createClientProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      clientId: string;
      title: string;
      reference?: string;
      location?: string;
      serviceType?: string;
      status?: string;
    }) => {
      const title = trimmed(data?.title, 160);
      if (!data?.clientId) throw new Error("Missing client id");
      if (title.length < 2) throw new Error("Project title is too short");
      const status = (PROJECT_STATUSES as readonly string[]).includes(data?.status ?? "")
        ? (data.status as string)
        : "planned";
      return {
        clientId: data.clientId,
        title,
        reference: trimmed(data?.reference, 60),
        location: trimmed(data?.location, 200),
        serviceType: trimmed(data?.serviceType, 120),
        status,
      };
    },
  )
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const { data: row, error } = await supabaseAdmin
      .from("client_projects")
      .insert({
        client_id: data.clientId,
        title: data.title,
        project_reference: data.reference || null,
        location: data.location || null,
        service_type: data.serviceType || null,
        status: data.status,
      })
      .select("id")
      .single();
    if (error || !row) throw new Error("Could not create the project");
    return { id: row.id };
  });

/** Step 1 of an upload: reserve a private storage path and return a signed upload token. */
export const createUploadTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      clientId: string;
      projectId?: string | null;
      displayName: string;
      description?: string;
      category?: string;
      filename: string;
      mimeType: string;
      sizeBytes: number;
      version?: number;
    }) => {
      if (!data?.clientId) throw new Error("Missing client id");
      const displayName = trimmed(data?.displayName, 160) || trimmed(data?.filename, 160);
      if (!displayName) throw new Error("A file name is required");
      if (!isAllowedUpload(data?.filename ?? "", data?.mimeType ?? "")) {
        throw new Error("Unsupported file type");
      }
      if (!Number.isFinite(data?.sizeBytes) || data.sizeBytes <= 0 || data.sizeBytes > MAX_UPLOAD_BYTES) {
        throw new Error("File is too large");
      }
      const category = (FILE_CATEGORIES as readonly string[]).includes(data?.category ?? "")
        ? (data.category as string)
        : "deliverable";
      return {
        clientId: data.clientId,
        projectId: data.projectId ?? null,
        displayName,
        description: trimmed(data?.description, 500),
        category,
        filename: trimmed(data?.filename, 200) || displayName,
        mimeType: data.mimeType,
        sizeBytes: Math.round(data.sizeBytes),
        version:
          Number.isFinite(data?.version) && (data.version as number) > 0
            ? Math.min(Math.round(data.version as number), 999)
            : 1,
      };
    },
  )
  .handler(async ({ data, context }): Promise<{ fileId: string; path: string; token: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin, buildStoragePath } = await import("@/lib/portal/portal.server");
    const { DELIVERABLES_BUCKET } = await import("@/lib/portal/constants");
    await assertAdmin(context.userId);

    const path = buildStoragePath({
      clientId: data.clientId,
      projectId: data.projectId,
      filename: data.filename,
    });

    const { data: row, error } = await supabaseAdmin
      .from("client_files")
      .insert({
        client_id: data.clientId,
        project_id: data.projectId,
        display_name: data.displayName,
        description: data.description || null,
        category: data.category,
        original_filename: data.filename,
        mime_type: data.mimeType,
        size_bytes: data.sizeBytes,
        storage_path: path,
        version: data.version,
        uploaded_by: context.userId,
        upload_verified: false,
        is_visible_to_client: false,
      })
      .select("id")
      .single();
    if (error || !row) throw new Error("Could not register the file");

    const { data: ticket, error: ticketError } = await supabaseAdmin.storage
      .from(DELIVERABLES_BUCKET)
      .createSignedUploadUrl(path);
    if (ticketError || !ticket) throw new Error("Could not prepare the upload");

    return { fileId: row.id, path, token: ticket.token };
  });

/** Step 2: confirm the object landed in storage before it becomes usable. */
export const confirmUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { fileId: string; replacesFileId?: string | null }) => {
    if (!data?.fileId) throw new Error("Missing file id");
    return { fileId: data.fileId, replacesFileId: data.replacesFileId ?? null };
  })
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin, logFileEvent } = await import("@/lib/portal/portal.server");
    const { DELIVERABLES_BUCKET } = await import("@/lib/portal/constants");
    await assertAdmin(context.userId);

    const { data: file } = await supabaseAdmin
      .from("client_files")
      .select("id, storage_path")
      .eq("id", data.fileId)
      .maybeSingle();
    if (!file) throw new Error("File not found");

    const folder = file.storage_path.split("/").slice(0, -1).join("/");
    const name = file.storage_path.split("/").slice(-1)[0]!;
    const { data: listed } = await supabaseAdmin.storage
      .from(DELIVERABLES_BUCKET)
      .list(folder, { search: name, limit: 100 });
    const found = (listed ?? []).find((o) => o.name === name);
    if (!found) throw new Error("The upload did not complete");

    await supabaseAdmin
      .from("client_files")
      .update({ upload_verified: true, size_bytes: found.metadata?.["size"] ?? null })
      .eq("id", file.id);
    await logFileEvent(file.id, context.userId, "upload");

    if (data.replacesFileId && data.replacesFileId !== file.id) {
      await supabaseAdmin
        .from("client_files")
        .update({ is_archived: true, is_visible_to_client: false, published_at: null })
        .eq("id", data.replacesFileId);
      await logFileEvent(data.replacesFileId, context.userId, "replace");
    }
    return { ok: true };
  });

export const setFileVisibility = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { fileId: string; visible: boolean }) => {
    if (!data?.fileId) throw new Error("Missing file id");
    return { fileId: data.fileId, visible: Boolean(data.visible) };
  })
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin, logFileEvent } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const { error } = await supabaseAdmin
      .from("client_files")
      .update({
        is_visible_to_client: data.visible,
        published_at: data.visible ? new Date().toISOString() : null,
      })
      .eq("id", data.fileId)
      .eq("upload_verified", true);
    if (error) throw new Error("Could not update the file");
    await logFileEvent(data.fileId, context.userId, data.visible ? "publish" : "unpublish");
    return { ok: true };
  });

export const archiveFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { fileId: string; archived: boolean }) => {
    if (!data?.fileId) throw new Error("Missing file id");
    return { fileId: data.fileId, archived: Boolean(data.archived) };
  })
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin, logFileEvent } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const { error } = await supabaseAdmin
      .from("client_files")
      .update({
        is_archived: data.archived,
        ...(data.archived ? { is_visible_to_client: false, published_at: null } : {}),
      })
      .eq("id", data.fileId);
    if (error) throw new Error("Could not update the file");
    await logFileEvent(data.fileId, context.userId, data.archived ? "archive" : "restore");
    return { ok: true };
  });