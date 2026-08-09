/** Server-only helpers for the client area and the admin file cabinet. */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { DELIVERABLES_BUCKET, safeFilename } from "@/lib/portal/constants";

/** Throws unless the caller holds the admin role. Never trust client input for this. */
export async function assertAdmin(userId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error("Role verification failed");
  if (!data) throw new Error("Forbidden");
}

/** Returns the client ids the caller belongs to. */
export async function memberClientIds(userId: string): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("client_memberships")
    .select("client_id")
    .eq("user_id", userId);
  if (error) throw new Error("Membership lookup failed");
  return (data ?? []).map((row) => row.client_id);
}

export async function assertMembership(userId: string, clientId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("client_memberships")
    .select("id")
    .eq("user_id", userId)
    .eq("client_id", clientId)
    .maybeSingle();
  if (error) throw new Error("Membership lookup failed");
  if (!data) throw new Error("Forbidden");
}

export function buildStoragePath(input: {
  clientId: string;
  projectId: string | null;
  filename: string;
}): string {
  const folder = input.projectId ?? "general";
  const stamp = Date.now().toString(36);
  return `${input.clientId}/${folder}/${stamp}-${safeFilename(input.filename)}`;
}

/** Short-lived signed URL. Storage stays private; nothing is ever public. */
export async function signedDownloadUrl(
  storagePath: string,
  downloadName: string,
  expiresIn = 120,
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(DELIVERABLES_BUCKET)
    .createSignedUrl(storagePath, expiresIn, { download: downloadName });
  if (error || !data?.signedUrl) throw new Error("Could not create download link");
  return data.signedUrl;
}

export async function logFileEvent(
  clientFileId: string,
  userId: string | null,
  eventType: string,
): Promise<void> {
  await supabaseAdmin
    .from("client_file_events")
    .insert({ client_file_id: clientFileId, user_id: userId, event_type: eventType });
}