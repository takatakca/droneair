# DRONE AIR — Executable task queue

Priority and status at 2026-10-14. Keep this list in sync with issue #2 and `WORKLOG.md`.

## P0 — Production security gates (blocked by external access)

- [ ] Obtain authorized access to the **existing** Supabase project `ngdcmpywualyphgrutir` (do not replace with an unrelated environment).
- [ ] Rotate historically committed environment values and review key validity/history. Never paste values in Git or chat.
- [ ] Check current database migrations; review/apply `20261014180000_lock_profile_identity.sql` and verify least-privilege profile updates.
- [ ] Confirm all exposed schema tables use correct RLS and `client-deliverables` and `mission-attachments` buckets are private.
- [ ] Provision the first admin role with an owner-controlled mechanism; do not grant via user metadata.
- [ ] Perform two-client negative access tests, including memberships, projects, files and signed download URLs.

Acceptance: evidence captured from the actual Supabase project, failed cross-tenant access attempts, no exposed server secret.

## P1 — Hosting and live release (blocked by unknown environment)

- [ ] Locate/confirm a dedicated DRONE AIR Coolify/Contabo (or actual provider) service and linked deployment branch.
- [ ] Configure public `VITE_SUPABASE_*` Docker **build** arguments with valid project values.
- [ ] Configure `SUPABASE_*`, Google OAuth, optional Gemini and service keys as **runtime-only** secrets.
- [ ] Deploy to a non-production preview, verify build/runtime and DNS/TLS before switching the production domain.
- [ ] Prove live `/api/health`, French/English pages, form persistence, admin/client portal and private file flow.
- [ ] Verify sender identity with a real delivered test email, or truthfully document notifications as disabled.
- [ ] Confirm rollback works, then link a gated auto-deployment route from validated `main` to the dedicated service.

Acceptance: public production URL serves the expected commit SHA and critical flows succeed in production-like tests.

## P2 — Independent repository improvements

- [x] Enforce verified canonical Auth emails for client invitations.
- [x] Verify actual stored upload size and forbid archived-file publication.
- [x] Use UUID-based private file paths.
- [x] Harden request throttling, deduplication responses and attachment cleanup.
- [x] Add tests for identity, storage paths and migration policy intent.
- [ ] Review media optimization and cross-tenant end-to-end integration tests in staging.
- [ ] Run a real security-oriented acceptance test of the pending database migration.
- [ ] Add any missing production health/observability only after discovering the real deployment platform.

The detailed release checklist is https://github.com/takatakca/droneair/issues/2. Never mark P0/P1 complete based only on a passing build.
