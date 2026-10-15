/** Shared, safe rule used before an admin file is marked as a replacement. */
export function isSameClientProject(
  current: { client_id: string; project_id: string | null },
  previous: { client_id: string; project_id: string | null },
): boolean {
  return current.client_id === previous.client_id &&
    (current.project_id ?? null) === (previous.project_id ?? null);
}
