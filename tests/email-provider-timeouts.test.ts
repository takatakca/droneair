import { test } from "bun:test";
import { strict as assert } from "node:assert";
import {
  fetchEmailProvider,
  GMAIL_OAUTH_TIMEOUT_MS,
  GMAIL_SEND_TIMEOUT_MS,
} from "../src/lib/email/http.server";

test("OAuth and Gmail send use bounded network timeouts", () => {
  assert.ok(GMAIL_OAUTH_TIMEOUT_MS > 0 && GMAIL_OAUTH_TIMEOUT_MS <= 5_000);
  assert.ok(GMAIL_SEND_TIMEOUT_MS > 0 && GMAIL_SEND_TIMEOUT_MS <= 8_000);
  assert.throws(() => fetchEmailProvider("https://example.invalid", {}, 0), /Invalid email provider timeout/);
});

test("HTTP requests receive a real abort deadline", async () => {
  let observedSignal: AbortSignal | undefined;
  const stub = (async (_url: string | URL | Request, init?: RequestInit) => {
    observedSignal = init?.signal ?? undefined;
    return new Response("ok", { status: 200 });
  }) as typeof fetch;
  const response = await fetchEmailProvider(
    "https://example.invalid",
    { method: "POST", body: "data" },
    50,
    stub,
  );
  assert.equal(response.status, 200);
  assert.ok(observedSignal instanceof AbortSignal);
  assert.equal(observedSignal.aborted, false);
  await new Promise((resolve) => setTimeout(resolve, 65));
  assert.equal(observedSignal.aborted, true);
});

test("reject invalid provider timeout values", () => {
  const stub = (async () => new Response("ok")) as typeof fetch;
  for (const value of [-1, 1.5, 30001, Number.NaN]) {
    assert.throws(() => fetchEmailProvider("https://example.invalid", {}, value, stub), /Invalid email provider timeout/);
  }
});
