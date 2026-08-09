import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface PortalFile {
  id: string;
  displayName: string;
  description: string | null;
  category: string;
  sizeBytes: number | null;
  mimeType: string | null;
  version: number;
  publishedAt: string | null;
  projectId: string | null;
}

export interface PortalProject {
  id: string;
  title: string;
  reference: string | null;
  location: string | null;
  serviceType: string | null;
  status: string;
  completedAt: string | null;
  createdAt: string;
}

export interface PortalOverview {
  isAdmin: boolean;
  profile: { firstName: string | null; lastName: string | null; email: string | null };
  clients: { id: string; name: string; status: string }[];
  projects: PortalProject[];
  files: PortalFile[];
}

/** Everything the signed-in client needs: their companies, projects and published files. */
export const getPortalOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortalOverview> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    const [{ data: roles }, { data: profile }, { data: memberships }] = await Promise.all([
      supabaseAdmin.from("user_roles").select("role").eq("user_id", userId),
      supabaseAdmin
        .from("profiles")
        .select("first_name, last_name, email")
        .eq("id", userId)
        .maybeSingle(),
      supabaseAdmin.from("client_memberships").select("client_id").eq("user_id", userId),
    ]);

    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    const clientIds = (memberships ?? []).map((m) => m.client_id);

    const base: PortalOverview = {
      isAdmin,
      profile: {
        firstName: profile?.first_name ?? null,
        lastName: profile?.last_name ?? null,
        email: profile?.email ?? null,
      },
      clients: [],
      projects: [],
      files: [],
    };
    if (clientIds.length === 0) return base;

    const [{ data: clients }, { data: projects }, { data: files }] = await Promise.all([
      supabaseAdmin.from("clients").select("id, name, status").in("id", clientIds),
      supabaseAdmin
        .from("client_projects")
        .select("id, title, project_reference, location, service_type, status, completed_at, created_at")
        .in("client_id", clientIds)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("client_files")
        .select(
          "id, display_name, description, category, size_bytes, mime_type, version, published_at, project_id",
        )
        .in("client_id", clientIds)
        .eq("is_visible_to_client", true)
        .eq("is_archived", false)
        .eq("upload_verified", true)
        .order("published_at", { ascending: false, nullsFirst: false }),
    ]);

    return {
      ...base,
      clients: (clients ?? []).map((c) => ({ id: c.id, name: c.name, status: c.status })),
      projects: (projects ?? []).map((p) => ({
        id: p.id,
        title: p.title,
        reference: p.project_reference,
        location: p.location,
        serviceType: p.service_type,
        status: p.status,
        completedAt: p.completed_at,
        createdAt: p.created_at,
      })),
      files: (files ?? []).map((f) => ({
        id: f.id,
        displayName: f.display_name,
        description: f.description,
        category: f.category,
        sizeBytes: f.size_bytes,
        mimeType: f.mime_type,
        version: f.version,
        publishedAt: f.published_at,
        projectId: f.project_id,
      })),
    };
  });

/** Issues a short-lived signed download link, after verifying membership. */
export const requestFileDownload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { fileId: string }) => {
    if (!data?.fileId || typeof data.fileId !== "string") throw new Error("Invalid file id");
    return { fileId: data.fileId };
  })
  .handler(async ({ data, context }): Promise<{ url: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertMembership, signedDownloadUrl, logFileEvent } = await import(
      "@/lib/portal/portal.server"
    );

    const { data: file, error } = await supabaseAdmin
      .from("client_files")
      .select("id, client_id, storage_path, display_name, is_visible_to_client, is_archived, upload_verified")
      .eq("id", data.fileId)
      .maybeSingle();
    if (error || !file) throw new Error("File not found");

    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin");
    const isAdmin = (roles ?? []).length > 0;

    if (!isAdmin) {
      if (!file.is_visible_to_client || file.is_archived || !file.upload_verified) {
        throw new Error("File not found");
      }
      await assertMembership(context.userId, file.client_id);
    }

    const url = await signedDownloadUrl(file.storage_path, file.display_name);
    await logFileEvent(file.id, context.userId, isAdmin ? "admin_download" : "download");
    return { url };
  });