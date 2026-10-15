/** Shared (client + server) rules for the mission request form. */

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

// Limit the entire multipart request, including text fields and boundaries.
// The declared file-size check alone is not enough to prevent large-body DoS.
export const MAX_MISSION_BODY_BYTES = MAX_ATTACHMENT_BYTES + 512 * 1024;

export const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ATTACHMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp";

const EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isAllowedAttachment(type: string): boolean {
  return (ALLOWED_ATTACHMENT_TYPES as readonly string[]).includes(type);
}

export function extensionFor(type: string): string {
  return EXTENSIONS[type] ?? "bin";
}

/** A browser-supplied MIME type does not prove the uploaded file's type. */
export function matchesAttachmentSignature(type: string, data: Uint8Array): boolean {
  const starts = (...bytes: number[]) => bytes.every((byte, i) => data[i] === byte);
  if (type === "application/pdf") return starts(0x25, 0x50, 0x44, 0x46, 0x2d);
  if (type === "image/jpeg") return starts(0xff, 0xd8, 0xff);
  if (type === "image/png") return starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  if (type === "image/webp") {
    return starts(0x52, 0x49, 0x46, 0x46) &&
      data[8] === 0x57 && data[9] === 0x45 &&
      data[10] === 0x42 && data[11] === 0x50;
  }
  return false;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Minimum time a genuine human needs to fill the form (ms). */
export const MIN_FILL_MS = 2500;

export const LIMITS = {
  name: 120,
  company: 160,
  email: 254,
  telephone: 40,
  location: 240,
  service: 120,
  area: 120,
  description: 5000,
} as const;
