import { createFileRoute } from "@tanstack/react-router";

/** Process liveness only. Database and external providers are checked separately. */
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: () => {
        const configuredRevision = process.env["DRONE_AIR_GIT_SHA"] ?? "";
        // Never represent an unset/placeholder value as a deployed Git commit.
        const revision = /^[0-9a-f]{40}$/i.test(configuredRevision)
          ? configuredRevision.toLowerCase()
          : null;
        return new Response(JSON.stringify({ status: "alive", service: "drone-air", revision }), {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});
