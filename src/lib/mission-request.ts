/** Shared (client + server) rules for the mission request form. */

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

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
