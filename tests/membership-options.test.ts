import { test } from "bun:test";
import { strict as assert } from "node:assert";

import { MEMBER_INVITE_UPSERT_OPTIONS } from "../src/lib/portal/membership";

test("admin re-invites never replace existing membership roles", () => {
  assert.equal(MEMBER_INVITE_UPSERT_OPTIONS.onConflict, "client_id,user_id");
  assert.equal(MEMBER_INVITE_UPSERT_OPTIONS.ignoreDuplicates, true);
});
