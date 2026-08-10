import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  coerceCategory,
  coerceMissionStatus,
  coerceProjectStatus,
  isEmail,
  trimmed,
} from "@/lib/portal/validate";

export interface AdminCounts {
  missions: number;
  newMissions: number;
  clients: number;
  activeProjects: number;
  files: number;
  publishedFiles: number;
}

export interface AdminProjectRow {
  id: string;
  title: string;
  reference: string | null;
  clientId: string;
  clientName: string;
  location: string | null;
  serviceType: string | null;
  status: string;
  description: string | null;
  missionRequestId: string | null;
  fileCount: number;
  updatedAt: string;
}

export interface AdminFileRow {
  id: string;
  displayName: string;
  originalFilename: string | null;
  category: string;
  description: string | null;
  version: number;
  sizeBytes: number | null;
  mimeType: string | null;
  clientId: string;
  clientName: string;
  projectId: string | null;
  projectTitle: string | null;
  isVisibleToClient: boolean;
  isArchived: boolean;
  uploadVerified: boolean;
  createdAt: string;
  publishedAt: string | null;
}

export interface AdminMissionRow {
  id: string;
  createdAt: string;
  name: string;
  company: string | null;
  email: string;
  telephone: string;
  serviceType: string;
  projectLocation: string;
  leadPriority: string;
  leadType: string;
  submissionStatus: string;
}

export interface AdminMissionDetail extends AdminMissionRow {
  preferredLanguage: string;
  approximateArea: string | null;
  desiredDate: string | null;
  description: string;
  attachmentUrl: string | null;
  sourcePage: string | null;
  aiSummary: string | null;
  aiFollowUpQuestions: string[] | null;
  aiResponseStatus: string;
  emailNotificationStatus: string;
  customerAckStatus: string;
  humanReviewRequired: boolean;
  emailEvents: {
    id: string;
    createdAt: string;
    eventType: string;
    status: string;
    recipient: string | null;
    errorSummary: string | null;
  }[];
}

/** Confirms the caller holds the admin role. Used to gate the /admin route tree. */
export const getAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: true; email: string | null }> => {
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await assertAdmin(context.userId);
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", context.userId)
      .maybeSingle();
    return { isAdmin: true, email: data?.email ?? null };
  });

/** Real database counts for the admin home. No estimates, no invented numbers. */
export const getAdminCounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminCounts> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const head = { count: "exact" as const, head: true };
    const [missions, newMissions, clients, activeProjects, files, published] = await Promise.all([
      supabaseAdmin.from("mission_requests").select("id", head),
      supabaseAdmin.from("mission_requests").select("id", head).eq("submission_status", "new"),
      supabaseAdmin.from("clients").select("id", head),
      supabaseAdmin
        .from("client_projects")
        .select("id", head)
        .not("status", "in", '("completed","archived")'),
      supabaseAdmin.from("client_files").select("id", head).eq("is_archived", false),
      supabaseAdmin
        .from("client_files")
        .select("id", head)
        .eq("is_archived", false)
        .eq("is_visible_to_client", true),
    ]);

    return {
      missions: missions.count ?? 0,
      newMissions: newMissions.count ?? 0,
      clients: clients.count ?? 0,
      activeProjects: activeProjects.count ?? 0,
      files: files.count ?? 0,
      publishedFiles: published.count ?? 0,
    };
  });

export const updateClientAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { clientId: string; name: string; status: string }) => {
    if (!data?.clientId) throw new Error("Missing client id");
    const name = trimmed(data?.name, 120);
    if (name.length < 2) throw new Error("Client name is too short");
    const status = ["active", "paused", "archived"].includes(data?.status) ? data.status : "active";
    return { clientId: data.clientId, name, status };
  })
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("clients")
      .update({ name: data.name, status: data.status })
      .eq("id", data.clientId);
    if (error) throw new Error("Could not update the client");
    return { ok: true };
  });

export const removeClientMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { clientId: string; userId: string }) => {
    if (!data?.clientId || !data?.userId) throw new Error("Missing identifiers");
    return { clientId: data.clientId, userId: data.userId };
  })
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("client_memberships")
      .delete()
      .eq("client_id", data.clientId)
      .eq("user_id", data.userId);
    if (error) throw new Error("Could not remove that access");
    return { ok: true };
  });

/** Looks up whether an account already exists for an email, without linking it. */
export const findAccountByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { email: string }) => {
    const email = trimmed(data?.email, 200).toLowerCase();
    if (!isEmail(email)) throw new Error("Invalid email address");
    return { email };
  })
  .handler(
    async ({
      data,
      context,
    }): Promise<{ found: boolean; userId: string | null; name: string | null }> => {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { assertAdmin } = await import("@/lib/portal/portal.server");
      await assertAdmin(context.userId);
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("email", data.email)
        .maybeSingle();
      if (!profile) return { found: false, userId: null, name: null };
      return {
        found: true,
        userId: profile.id,
        name: [profile.first_name, profile.last_name].filter(Boolean).join(" ") || null,
      };
    },
  );

export const getAdminProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminProjectRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const [{ data: projects }, { data: clients }, { data: files }] = await Promise.all([
      supabaseAdmin
        .from("client_projects")
        .select(
          "id, title, project_reference, client_id, location, service_type, status, description, mission_request_id, updated_at",
        )
        .order("updated_at", { ascending: false }),
      supabaseAdmin.from("clients").select("id, name"),
      supabaseAdmin.from("client_files").select("project_id").eq("is_archived", false),
    ]);

    return (projects ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      reference: p.project_reference,
      clientId: p.client_id,
      clientName: (clients ?? []).find((c) => c.id === p.client_id)?.name ?? "—",
      location: p.location,
      serviceType: p.service_type,
      status: p.status,
      description: p.description,
      missionRequestId: p.mission_request_id,
      fileCount: (files ?? []).filter((f) => f.project_id === p.id).length,
      updatedAt: p.updated_at,
    }));
  });

export const updateClientProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      projectId: string;
      title: string;
      reference?: string;
      location?: string;
      serviceType?: string;
      status?: string;
      description?: string;
      missionRequestId?: string | null;
    }) => {
      if (!data?.projectId) throw new Error("Missing project id");
      const title = trimmed(data?.title, 160);
      if (title.length < 2) throw new Error("Project title is too short");
      return {
        projectId: data.projectId,
        title,
        reference: trimmed(data?.reference, 60),
        location: trimmed(data?.location, 200),
        serviceType: trimmed(data?.serviceType, 120),
        status: coerceProjectStatus(data?.status),
        description: trimmed(data?.description, 1000),
        missionRequestId: data?.missionRequestId || null,
      };
    },
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("client_projects")
      .update({
        title: data.title,
        project_reference: data.reference || null,
        location: data.location || null,
        service_type: data.serviceType || null,
        status: data.status,
        description: data.description || null,
        mission_request_id: data.missionRequestId,
        completed_at: data.status === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", data.projectId);
    if (error) throw new Error("Could not update the project");
    return { ok: true };
  });

export const getAdminFiles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminFileRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const [{ data: files }, { data: clients }, { data: projects }] = await Promise.all([
      supabaseAdmin
        .from("client_files")
        .select(
          "id, display_name, original_filename, category, description, version, size_bytes, mime_type, client_id, project_id, is_visible_to_client, is_archived, upload_verified, created_at, published_at",
        )
        .order("created_at", { ascending: false })
        .limit(400),
      supabaseAdmin.from("clients").select("id, name"),
      supabaseAdmin.from("client_projects").select("id, title"),
    ]);

    return (files ?? []).map((f) => ({
      id: f.id,
      displayName: f.display_name,
      originalFilename: f.original_filename,
      category: f.category,
      description: f.description,
      version: f.version,
      sizeBytes: f.size_bytes,
      mimeType: f.mime_type,
      clientId: f.client_id,
      clientName: (clients ?? []).find((c) => c.id === f.client_id)?.name ?? "—",
      projectId: f.project_id,
      projectTitle: (projects ?? []).find((p) => p.id === f.project_id)?.title ?? null,
      isVisibleToClient: f.is_visible_to_client,
      isArchived: f.is_archived,
      uploadVerified: f.upload_verified,
      createdAt: f.created_at,
      publishedAt: f.published_at,
    }));
  });

export const updateFileMetadata = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      fileId: string;
      displayName: string;
      category?: string;
      description?: string;
      version?: number;
      projectId?: string | null;
    }) => {
      if (!data?.fileId) throw new Error("Missing file id");
      const displayName = trimmed(data?.displayName, 160);
      if (!displayName) throw new Error("A display name is required");
      return {
        fileId: data.fileId,
        displayName,
        category: coerceCategory(data?.category),
        description: trimmed(data?.description, 500),
        version:
          Number.isFinite(data?.version) && (data.version as number) > 0
            ? Math.min(Math.round(data.version as number), 999)
            : 1,
        projectId: data?.projectId || null,
      };
    },
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("client_files")
      .update({
        display_name: data.displayName,
        category: data.category,
        description: data.description || null,
        version: data.version,
        project_id: data.projectId,
      })
      .eq("id", data.fileId);
    if (error) throw new Error("Could not update the file");
    return { ok: true };
  });

export const getFileEvents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { fileId: string }) => {
    if (!data?.fileId) throw new Error("Missing file id");
    return { fileId: data.fileId };
  })
  .handler(
    async ({
      data,
      context,
    }): Promise<{ id: string; createdAt: string; eventType: string; actor: string | null }[]> => {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { assertAdmin } = await import("@/lib/portal/portal.server");
      await assertAdmin(context.userId);

      const { data: events } = await supabaseAdmin
        .from("client_file_events")
        .select("id, created_at, event_type, user_id")
        .eq("client_file_id", data.fileId)
        .order("created_at", { ascending: false })
        .limit(60);

      const ids = [...new Set((events ?? []).map((e) => e.user_id).filter(Boolean))] as string[];
      const { data: profiles } = ids.length
        ? await supabaseAdmin.from("profiles").select("id, email").in("id", ids)
        : { data: [] as { id: string; email: string | null }[] };

      return (events ?? []).map((e) => ({
        id: e.id,
        createdAt: e.created_at,
        eventType: e.event_type,
        actor: (profiles ?? []).find((p) => p.id === e.user_id)?.email ?? null,
      }));
    },
  );

export const getAdminMissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminMissionRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const { data } = await supabaseAdmin
      .from("mission_requests")
      .select(
        "id, created_at, name, company, email, telephone, service_type, project_location, lead_priority, lead_type, submission_status",
      )
      .order("created_at", { ascending: false })
      .limit(300);

    return (data ?? []).map((m) => ({
      id: m.id,
      createdAt: m.created_at,
      name: m.name,
      company: m.company,
      email: m.email,
      telephone: m.telephone,
      serviceType: m.service_type,
      projectLocation: m.project_location,
      leadPriority: m.lead_priority,
      leadType: m.lead_type,
      submissionStatus: m.submission_status,
    }));
  });

export const getMissionDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { missionId: string }) => {
    if (!data?.missionId) throw new Error("Missing mission id");
    return { missionId: data.missionId };
  })
  .handler(async ({ data, context }): Promise<AdminMissionDetail> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const { data: m, error } = await supabaseAdmin
      .from("mission_requests")
      .select("*")
      .eq("id", data.missionId)
      .maybeSingle();
    if (error || !m) throw new Error("Mission request not found");

    const { data: events } = await supabaseAdmin
      .from("mission_email_events")
      .select("id, created_at, event_type, status, recipient, error_summary")
      .eq("mission_request_id", m.id)
      .order("created_at", { ascending: false })
      .limit(30);

    return {
      id: m.id,
      createdAt: m.created_at,
      name: m.name,
      company: m.company,
      email: m.email,
      telephone: m.telephone,
      serviceType: m.service_type,
      projectLocation: m.project_location,
      leadPriority: m.lead_priority,
      leadType: m.lead_type,
      submissionStatus: m.submission_status,
      preferredLanguage: m.preferred_language,
      approximateArea: m.approximate_area,
      desiredDate: m.desired_date,
      description: m.description,
      attachmentUrl: m.attachment_url,
      sourcePage: m.source_page,
      aiSummary: m.ai_summary,
      aiFollowUpQuestions: (m.ai_follow_up_questions as string[] | null) ?? null,
      aiResponseStatus: m.ai_response_status,
      emailNotificationStatus: m.email_notification_status,
      customerAckStatus: m.customer_ack_status,
      humanReviewRequired: m.human_review_required,
      emailEvents: (events ?? []).map((e) => ({
        id: e.id,
        createdAt: e.created_at,
        eventType: e.event_type,
        status: e.status,
        recipient: e.recipient,
        errorSummary: e.error_summary,
      })),
    };
  });

export const updateMissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { missionId: string; status: string }) => {
    if (!data?.missionId) throw new Error("Missing mission id");
    return { missionId: data.missionId, status: coerceMissionStatus(data?.status) };
  })
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("mission_requests")
      .update({ submission_status: data.status })
      .eq("id", data.missionId);
    if (error) throw new Error("Could not update the mission status");
    return { ok: true };
  });

/** Explicit admin action: opens a client file from a mission request. */
export const createClientFromMission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { missionId: string; name: string }) => {
    if (!data?.missionId) throw new Error("Missing mission id");
    const name = trimmed(data?.name, 120);
    if (name.length < 2) throw new Error("Client name is too short");
    return { missionId: data.missionId, name };
  })
  .handler(async ({ data, context }): Promise<{ clientId: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const { data: row, error } = await supabaseAdmin
      .from("clients")
      .insert({ name: data.name })
      .select("id")
      .single();
    if (error || !row) throw new Error("Could not create the client");
    return { clientId: row.id };
  });

/** Explicit admin action: opens a project from a mission request. */
export const createProjectFromMission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { missionId: string; clientId: string; title: string }) => {
    if (!data?.missionId || !data?.clientId) throw new Error("Missing identifiers");
    const title = trimmed(data?.title, 160);
    if (title.length < 2) throw new Error("Project title is too short");
    return { missionId: data.missionId, clientId: data.clientId, title };
  })
  .handler(async ({ data, context }): Promise<{ projectId: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertAdmin } = await import("@/lib/portal/portal.server");
    await assertAdmin(context.userId);

    const { data: mission } = await supabaseAdmin
      .from("mission_requests")
      .select("project_location, service_type")
      .eq("id", data.missionId)
      .maybeSingle();

    const { data: row, error } = await supabaseAdmin
      .from("client_projects")
      .insert({
        client_id: data.clientId,
        title: data.title,
        location: mission?.project_location ?? null,
        service_type: mission?.service_type ?? null,
        mission_request_id: data.missionId,
        status: "planning",
      })
      .select("id")
      .single();
    if (error || !row) throw new Error("Could not create the project");
    return { projectId: row.id };
  });
