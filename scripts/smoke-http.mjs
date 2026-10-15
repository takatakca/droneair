#!/usr/bin/env node
// Read-only smoke test against a running DRONE AIR server.
// This verifies HTTP rendering/liveness only; it does NOT verify the database.
const origin = process.argv[2] || process.env.DRONE_AIR_BASE_URL;
if (!origin) {
  console.error("Usage: node scripts/smoke-http.mjs https://preview.example");
  process.exit(2);
}

const base = new URL(origin);
if (!["http:", "https:"].includes(base.protocol)) {
  throw new Error("The base URL must use HTTP or HTTPS");
}

for (const path of ["/api/health", "/", "/en"]) {
  const url = new URL(path, base);
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(15000),
    headers: { "accept": path === "/api/health" ? "application/json" : "text/html" },
  });

  if (response.status !== 200) {
    throw new Error(`${path}: HTTP ${response.status}, expected 200`);
  }

  const type = response.headers.get("content-type") || "";
  if (path === "/api/health") {
    if (!type.includes("application/json")) {
      throw new Error("Health endpoint must return JSON");
    }
    const body = await response.json();
    if (body.status !== "alive" || body.service !== "drone-air") {
      throw new Error("Unexpected health endpoint response");
    }
    const expectedRevision = process.env.DRONE_AIR_EXPECTED_SHA;
    if (expectedRevision && body.revision !== expectedRevision.toLowerCase()) {
      throw new Error(`Deployed revision ${body.revision ?? "(unset)"} does not match expected ${expectedRevision}`);
    }
    if (!response.headers.get("cache-control")?.includes("no-store")) {
      throw new Error("Health endpoint must disable caching");
    }
  } else {
    if (!type.includes("text/html")) {
      throw new Error(`${path}: expected an HTML page, received ${type}`);
    }
    const html = await response.text();
    if (!html.includes("DRONE AIR")) {
      throw new Error(`${path}: expected DRONE AIR branding in rendered HTML`);
    }
  }
  console.log(`PASS ${url.pathname}: HTTP 200`);
}


// The public mission handler must reject oversized multipart requests before
// touching Supabase (this container deliberately has fake Supabase values).
const oversized = new FormData();
oversized.set(
  "attachment",
  new Blob([new Uint8Array(11 * 1024 * 1024)], { type: "application/pdf" }),
  "oversized.pdf",
);
const oversizedResponse = await fetch(new URL("/api/public/mission-request", base), {
  method: "POST",
  body: oversized,
  signal: AbortSignal.timeout(30000),
});
if (oversizedResponse.status !== 413) {
  const actual = await oversizedResponse.text();
  throw new Error(`Expected HTTP 413 for oversized form, got ${oversizedResponse.status}: ${actual.slice(0, 160)}`);
}
const rejectedBody = await oversizedResponse.json();
if (rejectedBody.error !== "attachment_size") {
  throw new Error("Oversized form must return attachment_size");
}
console.log("PASS /api/public/mission-request: oversized multipart rejected before database access");

// Non-multipart bodies must fail validation without relying on the database.
const invalidResponse = await fetch(new URL("/api/public/mission-request", base), {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: "{}",
  signal: AbortSignal.timeout(15000),
});
if (invalidResponse.status !== 400) {
  throw new Error(`Expected HTTP 400 for JSON submitted to multipart route; got ${invalidResponse.status}`);
}
console.log("PASS /api/public/mission-request: unexpected media type rejected");
