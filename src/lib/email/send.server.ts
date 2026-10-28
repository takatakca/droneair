/** Server-only Resend or Gmail API dispatch for DRONE AIR transactional messages. */
import { COMPANY } from "@/lib/company";
import {
  fetchEmailProvider,
  GMAIL_OAUTH_TIMEOUT_MS,
  GMAIL_SEND_TIMEOUT_MS,
  RESEND_SEND_TIMEOUT_MS,
} from "@/lib/email/http.server";

export type EmailEventType =
  | "internal_notification"
  | "customer_acknowledgment"
  | "customer_reply"
  | "ai_draft"
  | "manual_reply";

export const FROM = `${COMPANY.name} <${COMPANY.email}>`;

const GMAIL_SEND_ENDPOINT = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const RESEND_SEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_ATTEMPTS = 2;

export type EmailProvider = "resend" | "gmail";

export interface SendResult {
  status: "sent" | "failed";
  provider?: EmailProvider;
  providerMessageId?: string;
  errorCode?: string;
  errorSummary?: string;
}

type Env = Record<string, string | undefined>;

interface MissionEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  label: EmailEventType;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function required(name: string, env: Env = process.env): string | null {
  const value = env[name]?.trim();
  return value || null;
}

/**
 * Resend when `RESEND_API_KEY` is set (drone-air.ca has no Google Workspace),
 * otherwise Gmail when its OAuth credentials are complete, otherwise none.
 */
export function selectEmailProvider(env: Env = process.env): EmailProvider | null {
  if (required("RESEND_API_KEY", env)) return "resend";
  if (
    required("GOOGLE_GMAIL_CLIENT_ID", env) &&
    required("GOOGLE_GMAIL_CLIENT_SECRET", env) &&
    required("GOOGLE_GMAIL_REFRESH_TOKEN", env)
  ) {
    return "gmail";
  }
  return null;
}

/** Resend API request body. The sender domain must be verified in Resend. */
export function resendPayload(input: MissionEmail, env: Env = process.env) {
  const sender = required("RESEND_SENDER_EMAIL", env) ?? COMPANY.email;
  return {
    from: `${COMPANY.name} <${sender}>`,
    to: [input.to],
    reply_to: COMPANY.email,
    subject: input.subject,
    html: input.html,
    text: input.text,
    tags: [{ name: "event", value: input.label }],
  };
}

function bytesToBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64Url(value: string): string {
  return bytesToBase64(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function wrapBase64(value: string): string {
  return bytesToBase64(value).replace(/.{1,76}/g, "$&\r\n").trimEnd();
}

function encodedHeader(value: string): string {
  return `=?UTF-8?B?${bytesToBase64(value)}?=`;
}

function buildRawMessage(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
  messageId: string;
}): string {
  const boundary = `drone-air-${crypto.randomUUID()}`;
  const sender = required("GMAIL_SENDER_EMAIL") ?? COMPANY.email;
  const lines = [
    `From: ${COMPANY.name} <${sender}>`,
    `To: ${input.to}`,
    `Reply-To: ${COMPANY.email}`,
    `Subject: ${encodedHeader(input.subject)}`,
    `Message-ID: <${input.messageId}@drone-air.ca>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(input.text),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    wrapBase64(input.html),
    `--${boundary}--`,
    "",
  ];

  return base64Url(lines.join("\r\n"));
}

async function gmailAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const clientId = required("GOOGLE_GMAIL_CLIENT_ID");
  const clientSecret = required("GOOGLE_GMAIL_CLIENT_SECRET");
  const refreshToken = required("GOOGLE_GMAIL_REFRESH_TOKEN");
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("gmail_not_configured");
  }

  const response = await fetchEmailProvider(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  }, GMAIL_OAUTH_TIMEOUT_MS);

  if (!response.ok) {
    throw new Error(`gmail_oauth_${response.status}`);
  }

  const payload = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!payload.access_token) throw new Error("gmail_oauth_missing_token");

  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(60, payload.expires_in ?? 3600) * 1000,
  };
  return payload.access_token;
}

/**
 * Sends one transactional email through Resend or Google Workspace/Gmail
 * (see `selectEmailProvider`).
 *
 * The mission idempotency key becomes the Resend `Idempotency-Key` or a
 * deterministic Gmail Message-ID. Temporary provider failures receive one
 * bounded retry. The caller always stores the mission first, so email failure
 * never loses a lead.
 */
export async function sendMissionEmail(input: MissionEmail): Promise<SendResult> {
  const provider = selectEmailProvider();
  if (provider === "resend") return sendWithResend(input);
  if (provider === "gmail") return sendWithGmail(input);
  return {
    status: "failed",
    errorCode: "email_not_configured",
    errorSummary: "No email provider is configured (RESEND_API_KEY or Google Workspace Gmail OAuth)",
  };
}

async function sendWithResend(input: MissionEmail): Promise<SendResult> {
  const apiKey = required("RESEND_API_KEY") ?? "";
  const body = JSON.stringify(resendPayload(input));

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetchEmailProvider(RESEND_SEND_ENDPOINT, {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
          // Resend keeps the key for 24 hours, so the retry below cannot send twice.
          "idempotency-key": input.idempotencyKey.slice(0, 256),
        },
        body,
      }, RESEND_SEND_TIMEOUT_MS);

      if (response.ok) {
        const payload = (await response.json()) as { id?: string };
        return {
          status: "sent",
          provider: "resend",
          ...(payload.id ? { providerMessageId: payload.id } : {}),
        };
      }

      const retryable = (response.status === 429 || response.status >= 500) && attempt < MAX_ATTEMPTS;
      if (!retryable) {
        return {
          status: "failed",
          provider: "resend",
          errorCode: `resend_${response.status}`,
          errorSummary: `Resend rejected the message with HTTP ${response.status}`,
        };
      }

      await sleep(750 * attempt);
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) {
        const message = error instanceof Error ? error.message : "resend_unexpected_error";
        return {
          status: "failed",
          provider: "resend",
          errorCode: message.slice(0, 80),
          errorSummary: message.slice(0, 300),
        };
      }
      await sleep(500 * attempt);
    }
  }

  return {
    status: "failed",
    provider: "resend",
    errorCode: "resend_exhausted",
    errorSummary: "Resend retry attempts exhausted",
  };
}

async function sendWithGmail(input: MissionEmail): Promise<SendResult> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const accessToken = await gmailAccessToken();
      const response = await fetchEmailProvider(GMAIL_SEND_ENDPOINT, {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          raw: buildRawMessage({
            to: input.to,
            subject: input.subject,
            html: input.html,
            text: input.text,
            messageId: input.idempotencyKey.replace(/[^a-zA-Z0-9._-]/g, "-"),
          }),
        }),
      }, GMAIL_SEND_TIMEOUT_MS);

      if (response.ok) {
        const payload = (await response.json()) as { id?: string };
        return {
          status: "sent",
          provider: "gmail",
          ...(payload.id ? { providerMessageId: payload.id } : {}),
        };
      }

      const retryable = (response.status === 429 || response.status >= 500) && attempt < MAX_ATTEMPTS;
      if (!retryable) {
        return {
          status: "failed",
          provider: "gmail",
          errorCode: `gmail_${response.status}`,
          errorSummary: `Gmail API rejected the message with HTTP ${response.status}`,
        };
      }

      await sleep(750 * attempt);
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) {
        const message = error instanceof Error ? error.message : "gmail_unexpected_error";
        return {
          status: "failed",
          provider: "gmail",
          errorCode: message.slice(0, 80),
          errorSummary: message.slice(0, 300),
        };
      }
      cachedToken = null;
      await sleep(500 * attempt);
    }
  }

  return {
    status: "failed",
    provider: "gmail",
    errorCode: "gmail_exhausted",
    errorSummary: "Gmail retry attempts exhausted",
  };
}
