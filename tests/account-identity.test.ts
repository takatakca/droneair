import assert from "node:assert/strict";
import { test } from "node:test";

import { matchesVerifiedEmailIdentity } from "../src/lib/portal/identity";

test("only a verified matching Auth email may be linked to a client", () => {
  assert.equal(
    matchesVerifiedEmailIdentity(
      { email: "Client@Example.CA", email_confirmed_at: "2026-10-14T10:00:00Z" },
      "client@example.ca",
    ),
    true,
  );
});

test("an edited profile email must not grant access to another account", () => {
  assert.equal(
    matchesVerifiedEmailIdentity(
      { email: "attacker@example.ca", email_confirmed_at: "2026-10-14T10:00:00Z" },
      "victim@example.ca",
    ),
    false,
  );
});

test("unverified, anonymous and missing accounts are rejected", () => {
  assert.equal(matchesVerifiedEmailIdentity({ email: "a@b.ca" }, "a@b.ca"), false);
  assert.equal(
    matchesVerifiedEmailIdentity(
      { email: "a@b.ca", email_confirmed_at: "2026-10-14T10:00:00Z", is_anonymous: true },
      "a@b.ca",
    ),
    false,
  );
  assert.equal(matchesVerifiedEmailIdentity(null, "a@b.ca"), false);
});
