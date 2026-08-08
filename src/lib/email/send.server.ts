/** Server-only email dispatch with controlled retries and durable logging. */
import { EmailAPIError, sendLovableEmail } from "@lovable.dev/email-js";

import { COMPANY } from "@/lib/company";

export type EmailEventType =
  | "internal_notification"
  | "customer_acknowledgment"
  | "customer_reply"
  | "ai_draft"
  | "manual_reply";

export const FROM = `${COMPANY.name} <${COMPANY.email}>`;
/** Verified delegated sending subdomain; falls back to the root domain. */
const senderDomain = () => process.env["EMAIL_SENDER_DOMAIN"] ?? "drone-air.ca";

const MAX_ATTEMPTS = 3;

export interface SendResult {
  status: "sent" | "failed";
  providerMessageId?: string;
  errorCode?: string;
  errorSummary?: string;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Sends one email. Temporary failures (429 / 5xx) are retried a bounded number
 * of times; permanent failures stop immediately. Never throws.
 */
export async function sendMissionEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  label: EmailEventType;
}): Promise<SendResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    return { status: "failed", errorCode: "missing_api_key", errorSummary: "LOVABLE_API_KEY is not configured" };
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await sendLovableEmail(
        {
          to: input.to,
          from: FROM,
          sender_domain: senderDomain(),
          reply_to: COMPANY.email,
          subject: input.subject,
          html: input.html,
          text: input.text,
          label: input.label,
          purpose: "transactional",
          idempotency_key: input.idempotencyKey,
        },
        { apiKey, idempotencyKey: input.idempotencyKey },
      );
      if (!response.success) {
        return { status: "failed", errorCode: "provider_rejected", errorSummary: response.status ?? "unknown" };
      }
      return { status: "sent", ...(response.message_id ? { providerMessageId: response.message_id } : {}) };
    } catch (error) {
      if (error instanceof EmailAPIError) {
        const retryable = error.retryable && attempt < MAX_ATTEMPTS;
        if (!retryable) {
          return {
            status: "failed",
            errorCode: error.code ?? String(error.status),
            errorSummary: error.message.slice(0, 300),
          };
        }
        await sleep(Math.min((error.retryAfterSeconds ?? 2) * 1000, 5000));
        continue;
      }
      if (attempt >= MAX_ATTEMPTS) {
        return {
          status: "failed",
          errorCode: "unexpected_error",
          errorSummary: error instanceof Error ? error.message.slice(0, 300) : "unknown error",
        };
      }
      await sleep(1000 * attempt);
    }
  }
  return { status: "failed", errorCode: "exhausted", errorSummary: "retry attempts exhausted" };
}