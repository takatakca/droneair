import { randomUUID } from "node:crypto";

import { safeFilename } from "@/lib/portal/constants";

/** Unpredictable, tenant-scoped storage keys; never reuse a timestamp filename. */
export function buildStoragePath(input: {
  clientId: string;
  projectId: string | null;
  filename: string;
}): string {
  const folder = input.projectId ?? "general";
  return `${input.clientId}/${folder}/${randomUUID()}-${safeFilename(input.filename)}`;
}
