/** Client-safe input coercion helpers shared by the portal server functions. */
import { FILE_CATEGORIES, PROJECT_STATUSES } from "@/lib/portal/constants";

export function trimmed(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function coerceProjectStatus(value: unknown): string {
  return (PROJECT_STATUSES as readonly string[]).includes(String(value ?? ""))
    ? String(value)
    : "planning";
}

export function coerceCategory(value: unknown): string {
  return (FILE_CATEGORIES as readonly string[]).includes(String(value ?? ""))
    ? String(value)
    : "deliverable";
}

export const MISSION_STATUSES = [
  "new",
  "reviewing",
  "quoted",
  "scheduled",
  "completed",
  "declined",
  "spam",
] as const;

export function coerceMissionStatus(value: unknown): string {
  return (MISSION_STATUSES as readonly string[]).includes(String(value ?? ""))
    ? String(value)
    : "new";
}

export function isEmail(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}
