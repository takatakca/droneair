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

export const PROJECT_STATUSES = [
  "planning",
  "scheduled",
  "processing",
  "ready",
  "completed",
  "archived",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

/**
 * Extension allowlist — the authoritative check. Browsers report inconsistent
 * MIME types for KML/KMZ/XLSX/MOV, so the extension decides and the MIME is
 * only rejected when it is an executable/script type.
 */
export const ALLOWED_UPLOAD_EXTENSIONS = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "tif",
  "tiff",
  "csv",
  "xlsx",
  "kml",
  "kmz",
  "zip",
  "mp4",
  "mov",
] as const;

const BLOCKED_MIME_PATTERN =
  /^(application\/(x-msdownload|x-msdos-program|x-executable|x-sh|x-shellscript|java-archive|vnd\.microsoft\.portable-executable)|text\/(html|javascript)|application\/javascript)$/i;

export function fileExtension(name: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(name.trim());
  return match ? match[1]!.toLowerCase() : "";
}

export function isAllowedUpload(filename: string, mime: string): boolean {
  const ext = fileExtension(filename);
  if (!(ALLOWED_UPLOAD_EXTENSIONS as readonly string[]).includes(ext)) return false;
  if (mime && BLOCKED_MIME_PATTERN.test(mime)) return false;
  return true;
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