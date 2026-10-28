import { test } from "bun:test";
import { strict as assert } from "node:assert";
import { releaseRevision } from "../src/lib/release-revision";

const SHA = "6c86b7270428e6bde098d346538dfab8c7289318";

test("health revision prefers the CI build argument, then Coolify's SOURCE_COMMIT", () => {
  assert.equal(releaseRevision({ DRONE_AIR_GIT_SHA: SHA }), SHA);
  assert.equal(releaseRevision({ DRONE_AIR_GIT_SHA: "unverified", SOURCE_COMMIT: SHA }), SHA);
  assert.equal(releaseRevision({ SOURCE_COMMIT: ` ${SHA.toUpperCase()} ` }), SHA);
});

test("health revision never reports a placeholder or short SHA as a release", () => {
  assert.equal(releaseRevision({}), null);
  assert.equal(releaseRevision({ DRONE_AIR_GIT_SHA: "unverified", SOURCE_COMMIT: "" }), null);
  assert.equal(releaseRevision({ SOURCE_COMMIT: "unknown" }), null);
  assert.equal(releaseRevision({ SOURCE_COMMIT: SHA.slice(0, 7) }), null);
});
