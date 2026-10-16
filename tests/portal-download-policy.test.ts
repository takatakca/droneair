import { test } from "bun:test";
import { strict as assert } from "node:assert";

import { isClientDownloadAllowed } from "../src/lib/portal/download-policy";

test("clients may request signed links only for verified, published, active files", () => {
  assert.equal(isClientDownloadAllowed({
    is_visible_to_client: true, is_archived: false, upload_verified: true,
  }), true);
  for (const property of ["is_visible_to_client", "upload_verified"] as const) {
    const file = { is_visible_to_client: true, is_archived: false, upload_verified: true };
    file[property] = false;
    assert.equal(isClientDownloadAllowed(file), false);
  }
  assert.equal(isClientDownloadAllowed({
    is_visible_to_client: true, is_archived: true, upload_verified: true,
  }), false);
});
