const GIT_SHA = /^[0-9a-f]{40}$/i;

/**
 * The Git commit this server runs, reported by `/api/health`.
 * CI passes `DRONE_AIR_GIT_SHA` as a Docker build argument; Coolify supplies `SOURCE_COMMIT`.
 * Only a full 40-character SHA is reported, so a placeholder is never shown as a release.
 */
export function releaseRevision(env: Record<string, string | undefined>): string | null {
  for (const value of [env["DRONE_AIR_GIT_SHA"], env["SOURCE_COMMIT"]]) {
    const candidate = value?.trim() ?? "";
    if (GIT_SHA.test(candidate)) return candidate.toLowerCase();
  }
  return null;
}
