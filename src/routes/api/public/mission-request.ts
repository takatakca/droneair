import { createFileRoute } from "@tanstack/react-router";
import { createHash, randomUUID } from "crypto";
import { z } from "zod";

import {
  EMAIL_RE,
  LIMITS,
  MAX_ATTACHMENT_BYTES,
  MIN_FILL_MS,
  extensionFor,
  isAllowedAttachment,
} from "@/lib/mission-request";

const BUCKET = "mission-attachments";
const RATE_WINDOW_MINUTES = 10;
const RATE_MAX_PER_WINDOW = 3;

const schema = z.object({
  name: z.string().trim().min(1).max(LIMITS.name),
  company: z.string().trim().max(LIMITS.company).optional().default(""),
  email: z.string().trim().max(LIMITS.email).regex(EMAIL_RE),
  phone: z.string().trim().min(1).max(LIMITS.telephone),
  preferredLanguage: z.enum(["fr", "en"]).default("fr"),
  location: z.string().trim().min(1).max(LIMITS.location),
  service: z.string().trim().min(1).max(LIMITS.service),
  area: z.string().trim().max(LIMITS.area).optional().default(""),
  date: z.string().trim().max(24).optional().default(""),
  message: z.string().trim().min(1).max(LIMITS.description),
  consent: z.literal("on"),
  sourcePage: z.string().trim().max(200).optional().default("/contact"),
  honeypot: z.string().max(200).optional().default(""),
  elapsedMs: z.coerce.number().int().nonnegative().max(86_400_000).optional().default(MIN_FILL_MS),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function fingerprint(request: Request): string {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return createHash("sha256").update(`${ip}|${request.headers.get("user-agent") ?? ""}`).digest("hex");
}

export const Route = createFileRoute("/api/public/mission-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return json({ ok: false, error: "invalid_request" }, 400);
        }

        const raw = Object.fromEntries(
          Array.from(form.entries()).filter(([, v]) => typeof v === "string"),
        );
        const parsed = schema.safeParse(raw);
        if (!parsed.success) return json({ ok: false, error: "invalid_input" }, 400);
        const data = parsed.data;

        const ipHash = fingerprint(request);
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Silent spam classification: honeypot filled, or submitted implausibly fast.
        const suspicious = data.honeypot.trim().length > 0 || data.elapsedMs < MIN_FILL_MS;

        const since = new Date(Date.now() - RATE_WINDOW_MINUTES * 60_000).toISOString();

        if (!suspicious) {
          const { count } = await supabaseAdmin
            .from("mission_requests")
            .select("id", { count: "exact", head: true })
            .eq("ip_hash", ipHash)
            .gte("created_at", since);
          if ((count ?? 0) >= RATE_MAX_PER_WINDOW) {
            return json({ ok: false, error: "rate_limited" }, 429);
          }

          // Duplicate-submission guard (double click / retry of the same content).
          const { data: dupes } = await supabaseAdmin
            .from("mission_requests")
            .select("id")
            .eq("email", data.email.toLowerCase())
            .eq("description", data.message)
            .gte("created_at", since)
            .limit(1);
          if (dupes && dupes.length > 0) {
            return json({ ok: true, id: dupes[0]!.id, duplicate: true, emailSent: false });
          }
        }

        // Attachment: validated server-side, stored under a generated name.
        let attachmentPath: string | null = null;
        const file = form.get("attachment");
        if (!suspicious && file instanceof File && file.size > 0) {
          if (!isAllowedAttachment(file.type)) {
            return json({ ok: false, error: "attachment_type" }, 400);
          }
          if (file.size > MAX_ATTACHMENT_BYTES) {
            return json({ ok: false, error: "attachment_size" }, 400);
          }
          const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extensionFor(file.type)}`;
          const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(path, await file.arrayBuffer(), {
              contentType: file.type,
              upsert: false,
            });
          if (uploadError) {
            console.error("mission attachment upload failed", uploadError.message);
            return json({ ok: false, error: "attachment_failed" }, 502);
          }
          attachmentPath = path;
        }

        const { data: inserted, error } = await supabaseAdmin
          .from("mission_requests")
          .insert({
            name: data.name,
            company: data.company || null,
            email: data.email.toLowerCase(),
            telephone: data.phone,
            preferred_language: data.preferredLanguage,
            project_location: data.location,
            service_type: data.service,
            approximate_area: data.area || null,
            desired_date: data.date || null,
            description: data.message,
            attachment_url: attachmentPath,
            consent: true,
            submission_status: suspicious ? "spam" : "new",
            source_page: data.sourcePage,
            ip_hash: ipHash,
          })
          .select("id")
          .single();

        if (error) {
          console.error("mission request insert failed", error.message);
          return json({ ok: false, error: "store_failed" }, 500);
        }

        // Email notification to info@dronair.ca is not wired yet: this project has
        // no verified sender domain, so nothing is simulated here. The request is
        // stored and the client reports delivery honestly.
        return json({ ok: true, id: inserted.id, emailSent: false });
      },
    },
  },
});
