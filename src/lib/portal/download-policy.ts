/** Server-side client download precondition, before tenant membership lookup. */
export function isClientDownloadAllowed(file: {
  is_visible_to_client: boolean;
  is_archived: boolean;
  upload_verified: boolean;
}): boolean {
  return file.is_visible_to_client && !file.is_archived && file.upload_verified;
}
