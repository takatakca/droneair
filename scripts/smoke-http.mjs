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
