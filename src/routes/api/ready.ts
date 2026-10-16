import { createFileRoute } from "@tanstack/react-router";

/**
 * Readiness (not liveness): checks the intended Supabase database with
 * server-only credentials. Never return connection details to callers.
 */
export const Route = createFileRoute("/api/ready")({
  server: {
    handlers: {
      GET: async () => {
        let ready = false;
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin
            .from("clients")
            .select("id", { head: true })
            .limit(1)
            .abortSignal(AbortSignal.timeout(4_000));
          ready = !error;
          if (error) {
            console.error("DRONE AIR readiness database query failed", { code: error.code });
          }
        } catch {
          // Avoid reporting configuration, credentials or internal network details.
          console.error("DRONE AIR readiness database check failed");
        }

        return new Response(
          JSON.stringify({ status: ready ? "ready" : "unavailable", service: "drone-air" }),
          {
            status: ready ? 200 : 503,
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "no-store",
              "x-content-type-options": "nosniff",
            },
          },
        );
      },
    },
  },
});
