import { createFileRoute } from "@tanstack/react-router";
import { releaseRevision } from "@/lib/release-revision";

/** Process liveness only. Database and external providers are checked separately. */
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: () => {
        const revision = releaseRevision(process.env);
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
