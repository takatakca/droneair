import { strict as assert } from "node:assert";
import { test } from "bun:test";
import {
  assertQuerySucceeded,
  requireChangedRow,
  requireExactCount,
} from "../src/lib/portal/db-result";

test("database errors are surfaced instead of being converted to empty records", () => {
  assert.doesNotThrow(() => assertQuerySucceeded(null, "read failed"));
  assert.throws(() => assertQuerySucceeded({ message: "connection lost" }, "read failed"), /read failed/);
});

test("a mutation requires a real affected row", () => {
  assert.deepEqual(requireChangedRow({ id: "a" }, null, "update failed"), { id: "a" });
  assert.throws(() => requireChangedRow(null, null, "update failed"), /update failed/);
  assert.throws(() => requireChangedRow({ id: "a" }, { message: "denied" }, "update failed"), /update failed/);
});

test("exact counts reject null, invalid and failed results", () => {
  assert.equal(requireExactCount({ count: 0, error: null }, "count failed"), 0);
  assert.equal(requireExactCount({ count: 42, error: null }, "count failed"), 42);
  assert.throws(() => requireExactCount({ count: null, error: null }, "count failed"), /count failed/);
  assert.throws(() => requireExactCount({ count: -1, error: null }, "count failed"), /count failed/);
  assert.throws(() => requireExactCount({ count: 10, error: { message: "timeout" } }, "count failed"), /count failed/);
});
