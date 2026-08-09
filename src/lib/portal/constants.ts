/** Shared, client-safe constants for the DRONE AIR client area. */

export const DELIVERABLES_BUCKET = "client-deliverables";

export const FILE_CATEGORIES = [
  "deliverable",
  "report",
  "imagery",
  "map",
  "invoice",
  "other",
] as const;
export type FileCategory = (typeof FILE_CATEGORIES)[number];

export const PROJECT_STATUSES = ["planned", "in_progress", "processing", "delivered", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

export const ALLOWED_UPLOAD_MIME = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
  "video/mp4",
  "application/zip",
  "text/csv",
] as const;

export function isAllowedUploadMime(mime: string): boolean {
  return (ALLOWED_UPLOAD_MIME as readonly string[]).includes(mime);
}

/** Strips path separators and exotic characters from an uploaded filename. */
export function safeFilename(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(-120);
  return cleaned.replace(/^[.-]+/, "") || "file";
}

export function formatBytes(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}