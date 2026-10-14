import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const migration = readFileSync(
  new URL("../supabase/migrations/20261014180000_lock_profile_identity.sql", import.meta.url),
  "utf8",
);

test("profile email is no longer writable by client-side table grants", () => {
  assert.match(migration, /REVOKE UPDATE ON TABLE public\.profiles FROM PUBLIC, anon, authenticated/i);
  assert.match(migration, /GRANT UPDATE \(first_name, last_name, preferred_language\)/i);
  assert.doesNotMatch(migration, /GRANT UPDATE \([^)]*email/i);
});

test("client membership helper refuses cross-user identity probing", () => {
  assert.match(migration, /_user_id = \(select auth\.uid\(\)\)/i);
});

test("auth-email changes are synchronized by an owner-controlled trigger", () => {
  assert.match(migration, /AFTER UPDATE OF email ON auth\.users/i);
  assert.match(migration, /SET email = NEW\.email/i);
});
