import { test } from "node:test";
import assert from "node:assert/strict";

import { buildStoragePath } from "../src/lib/portal/storage-path";

test("separate upload tickets never reuse a key", () => {
  const opts = {
    clientId: "00000000-0000-4000-8000-000000000001",
    projectId: "00000000-0000-4000-8000-000000000002",
    filename: "report.pdf",
  };
  const a = buildStoragePath(opts);
  const b = buildStoragePath(opts);
  assert.notEqual(a, b);
  assert.ok(a.startsWith(`${opts.clientId}/${opts.projectId}/`));
  assert.ok(a.endsWith("-report.pdf"));
});

test("general uploads remain scoped and do not leak path separators", () => {
  const path = buildStoragePath({
    clientId: "00000000-0000-4000-8000-000000000001",
    projectId: null,
    filename: "../../client-invoice.pdf",
  });
  assert.ok(path.startsWith("00000000-0000-4000-8000-000000000001/general/"));
  assert.equal(path.split("/").length, 3);
});
