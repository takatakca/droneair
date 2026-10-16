/**
 * Idempotent invitations must never downgrade an existing tenant role.
 * Upsert's default MERGE would overwrite membership_role with "member".
 */
export const MEMBER_INVITE_UPSERT_OPTIONS = {
  onConflict: "client_id,user_id",
  ignoreDuplicates: true,
} as const;
