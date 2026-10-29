import assert from "node:assert/strict";
import { test } from "node:test";

import { releaseRevision } from "../src/lib/release-revision";

const sha = "0123456789abcdef0123456789abcdef01234567";

test("CI build argument DRONE_AIR_GIT_SHA wins", () => {
  assert.equal(releaseRevision({ DRONE_AIR_GIT_SHA: sha, SOURCE_COMMIT: "f".repeat(40) }), sha);
});

test("Coolify SOURCE_COMMIT is used when the build argument is a placeholder", () => {
  assert.equal(releaseRevision({ DRONE_AIR_GIT_SHA: "unverified", SOURCE_COMMIT: sha.toUpperCase() }), sha);
});

test("no full SHA anywhere: null, never a placeholder", () => {
  assert.equal(releaseRevision({}), null);
  assert.equal(releaseRevision({ DRONE_AIR_GIT_SHA: "unverified", SOURCE_COMMIT: "unknown" }), null);
});
