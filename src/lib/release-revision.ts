/**
 * The Git commit this server runs, reported by /api/health.
 * DRONE_AIR_GIT_SHA is the Docker build argument (GitHub CI); Coolify supplies SOURCE_COMMIT
 * ("include source commit in build" is on for the droneair application).
 * Only a full 40-character SHA is reported: an unset or placeholder value is never shown as a commit.
 */
export function releaseRevision(env: Record<string, string | undefined>): string | null {
  for (const value of [env["DRONE_AIR_GIT_SHA"], env["SOURCE_COMMIT"]]) {
    const sha = value?.trim().toLowerCase();
    if (sha && /^[0-9a-f]{40}$/.test(sha)) return sha;
  }
  return null;
}
