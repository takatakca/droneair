import { afterEach, test } from "bun:test";
import { strict as assert } from "node:assert";
import { resendPayload, selectEmailProvider, sendMissionEmail } from "../src/lib/email/send.server";

const GMAIL = {
  GOOGLE_GMAIL_CLIENT_ID: "id",
  GOOGLE_GMAIL_CLIENT_SECRET: "secret",
  GOOGLE_GMAIL_REFRESH_TOKEN: "refresh",
};

const MESSAGE = {
  to: "client@example.com",
  subject: "Mission reçue",
  html: "<p>Merci</p>",
  text: "Merci",
  idempotencyKey: "mission-ack-00000000-0000-4000-8000-000000000000",
  label: "customer_acknowledgment" as const,
};

const realFetch = globalThis.fetch;
const savedEnv = { ...process.env };

afterEach(() => {
  globalThis.fetch = realFetch;
  for (const name of ["RESEND_API_KEY", "RESEND_SENDER_EMAIL", ...Object.keys(GMAIL)]) {
    if (savedEnv[name] === undefined) delete process.env[name];
    else process.env[name] = savedEnv[name];
  }
});

test("Resend is chosen when its key is set, then complete Gmail OAuth, otherwise none", () => {
  assert.equal(selectEmailProvider({ RESEND_API_KEY: "re_test", ...GMAIL }), "resend");
  assert.equal(selectEmailProvider(GMAIL), "gmail");
  assert.equal(selectEmailProvider({ ...GMAIL, GOOGLE_GMAIL_REFRESH_TOKEN: " " }), null);
  assert.equal(selectEmailProvider({ RESEND_API_KEY: "  " }), null);
  assert.equal(selectEmailProvider({}), null);
});

test("Resend payload sends from DRONE AIR and replies to info@drone-air.ca", () => {
  const payload = resendPayload(MESSAGE, {});
  assert.equal(payload.from, "DRONE AIR <info@drone-air.ca>");
  assert.deepEqual(payload.to, ["client@example.com"]);
  assert.equal(payload.reply_to, "info@drone-air.ca");
  assert.equal(payload.subject, "Mission reçue");
  assert.deepEqual(payload.tags, [{ name: "event", value: "customer_acknowledgment" }]);
  assert.equal(resendPayload(MESSAGE, { RESEND_SENDER_EMAIL: "missions@drone-air.ca" }).from, "DRONE AIR <missions@drone-air.ca>");
});

test("Resend send uses the mission idempotency key and retries one server error", async () => {
  process.env["RESEND_API_KEY"] = "re_test";
  const calls: { url: string; headers: Headers; body: unknown }[] = [];
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), headers: new Headers(init?.headers), body: JSON.parse(String(init?.body)) });
    return calls.length === 1
      ? new Response("busy", { status: 503 })
      : Response.json({ id: "email_123" });
  }) as typeof fetch;

  const result = await sendMissionEmail(MESSAGE);
  assert.deepEqual(result, { status: "sent", provider: "resend", providerMessageId: "email_123" });
  assert.equal(calls.length, 2);
  assert.equal(calls[0]?.url, "https://api.resend.com/emails");
  assert.equal(calls[0]?.headers.get("authorization"), "Bearer re_test");
  assert.equal(calls[0]?.headers.get("idempotency-key"), MESSAGE.idempotencyKey);
  assert.equal(calls[1]?.headers.get("idempotency-key"), MESSAGE.idempotencyKey);
});

test("Resend rejections are recorded without retry, and no provider fails closed", async () => {
  process.env["RESEND_API_KEY"] = "re_test";
  let count = 0;
  globalThis.fetch = (async () => {
    count += 1;
    return new Response("invalid", { status: 422 });
  }) as typeof fetch;
  const rejected = await sendMissionEmail(MESSAGE);
  assert.equal(count, 1);
  assert.equal(rejected.status, "failed");
  assert.equal(rejected.provider, "resend");
  assert.equal(rejected.errorCode, "resend_422");

  delete process.env["RESEND_API_KEY"];
  for (const name of Object.keys(GMAIL)) delete process.env[name];
  const none = await sendMissionEmail(MESSAGE);
  assert.equal(none.status, "failed");
  assert.equal(none.errorCode, "email_not_configured");
  assert.equal(count, 1);
});
