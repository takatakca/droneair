# DRONE AIR — Executable task queue

Priority and status at 2026-10-16. Keep this list in sync with issue #2 and `WORKLOG.md`.

## P0 — Production security gates (blocked by external access)

- [ ] Obtain authorized access to the **existing** Supabase project `ngdcmpywualyphgrutir` (do not replace with an unrelated environment).
- [ ] Rotate historically committed environment values and review key validity/history. Never paste values in Git or chat.
- [ ] Check current database migrations; review/apply `20261014180000_lock_profile_identity.sql` and verify least-privilege profile updates.
- [ ] Confirm all exposed schema tables use correct RLS and `client-deliverables` and `mission-attachments` buckets are private.
- [ ] Provision the first admin role with an owner-controlled mechanism; do not grant via user metadata.
- [ ] Perform two-client negative access tests, including memberships, projects, files and signed download URLs.

Acceptance: evidence captured from the actual Supabase project, failed cross-tenant access attempts, no exposed server secret.

## P1 — Hosting and live release (blocked by unknown environment)

- [x] Locate/confirm a dedicated DRONE AIR Coolify/Contabo (or actual provider) service and linked deployment branch. (2026-10-26: `droneair-preview` on vps2, branch `main`; preview only)
- [ ] Configure public `VITE_SUPABASE_*` Docker **build** arguments with valid project values.
- [ ] Configure `SUPABASE_*`, Google OAuth, optional Gemini and service keys as **runtime-only** secrets.
- [ ] Deploy to a non-production preview, verify build/runtime and DNS/TLS before switching the production domain. (2026-10-26: build/runtime verified with placeholder values and `smoke-http.mjs` PASS; real values, DNS/TLS pending)
- [ ] Prove live `/api/health`, French/English pages, form persistence, admin/client portal and private file flow.
- [ ] Verify sender identity with a real delivered test email, or truthfully document notifications as disabled.
- [x] Commit a disabled-by-default GitHub Actions workflow that can request deployment **only** after successful `main` CI.
- [ ] Provision a dedicated DRONE AIR Coolify resource, deployment URL/token as encrypted GitHub secrets and enable `DRONE_AIR_PRODUCTION_DEPLOY_ENABLED=true` **only after release gates**.
- [ ] Confirm the actual deployment SHA, health and rollback after turning on the gated workflow.

Acceptance: public production URL serves the expected commit SHA and critical flows succeed in production-like tests.

## P2 — Independent repository improvements

- [x] Enforce verified canonical Auth emails for client invitations.
- [x] Verify actual stored upload size and forbid archived-file publication.
- [x] Use UUID-based private file paths.
- [x] Harden request throttling, deduplication responses and attachment cleanup.
- [x] Add tests for identity, storage paths and migration policy intent.
- [x] Add an automated HTTP smoke test for the built container and both public languages.
- [x] Confirm container runtime boot and smoke tests PASS using Bun (Node 22 previously failed with Bun undefined); run 38774629494 PASS.
- [x] Confirm CI-built Docker /api/health revision matches the Git SHA; run 38775210246 PASS.
- [x] Add a container health check that works without curl/wget (Bun `HEALTHCHECK` in `Dockerfile.coolify`, 2026-10-28).
- [ ] Confirm the actual Coolify production /api/health revision matches the deployed Git SHA (falls back to Coolify `SOURCE_COMMIT` since 2026-10-28).
- [ ] Review media optimization and cross-tenant end-to-end integration tests in staging.
- [ ] Run a real security-oriented acceptance test of the pending database migration.
- [ ] Add any missing production health/observability only after discovering the real deployment platform.

The detailed release checklist is https://github.com/takatakca/droneair/issues/2. Never mark P0/P1 complete based only on a passing build.


## Next agent pickup — 2026-10-15

GitHub Actions runs 38774629494 (Bun boot and HTTP smoke), 38775210246 (SHA-check smoke), and 38775537222 (documentation) are all successful. No outstanding CI failure is known. Do not prioritize rebuilding this same smoke functionality. Resume the unresolved P0/P1 security/hosting gates. No real Supabase migration, production DNS/TLS or Coolify deploy was verified.


## 2026-10-15 — Public intake hardening
- [x] Add bounded streaming multipart parsing and reject oversized requests before full parse, even without Content-Length.
- [x] Check PDF/JPEG/PNG/WebP signatures against declared MIME types before upload.
- [x] Confirm new tests and Bun Docker HTTP smoke are green on GitHub Actions: run 38792341421 PASS.
- [x] Verified running CI HTTP rejects oversized multipart (413) and non-multipart (400) without database access: run 38792894836 PASS.


## 2026-10-15 — File lifecycle safety
- [x] Reject mismatched replacement client/project before marking the new file verified.
- [x] Reject archival/replacement actions without a confirmed updated row.
- [x] Clean the tentative file record when creation of a signed upload ticket fails.
- [x] GitHub CI verification of file lifecycle changes: run 38793107957 PASS.
- [ ] Complete same-client/project file replacement and cross-tenant isolation tests against authorized real Supabase database.


## 2026-10-15 — Error-path honesty
- [x] Do not mask Supabase client portal and admin overview/detail query failures as empty lists.
- [ ] Verify updated server functions in GitHub CI and run real service-outage scenarios on authorized staging.

## 2026-10-16 — Administrator database correctness

- [x] Reject admin dashboard counts when the database query fails or returns no exact count.
- [x] Reject phantom success for client/project/file/mission updates and membership removals.
- [x] Reject missing source missions before generating client/project records.
- [x] Do not silently hide database errors in administrator listings, detail and audit history.
- [x] Validate new server code and regression tests in GitHub Actions: 38852451732 PASS.
- [ ] Validate the admin operations using the authorized live Supabase staging environment.

## 2026-10-16 — Membership idempotency

- [x] Preserve an existing membership's role on repeat invite rather than overwriting with "member".
- [x] Distinguish Supabase profile lookup failure from "account does not exist".
- [x] GitHub CI 38852562996 PASS for repeat-invitation role handling.
- [ ] Verify repeated invitation with a privileged membership in authorized DRONE AIR staging.

## 2026-10-16 — Admin file management UI

- [x] Catch file metadata, publication and archive errors and show a visible alert.
- [x] Disable file mutation buttons during requests and prevent rapid double clicks.
- [x] Display file-list/history load errors instead of an empty-state message.
- [x] GitHub CI 38852681875 PASS for file UI.
- [ ] Exercise file edits, publication and archiving against an authorized staging database.

## 2026-10-16 — Database readiness

- [x] Add database-sensitive HTTP /api/ready separate from process /api/health.
- [x] Add CI HTTP smoke proving fake Supabase settings return readiness 503.
- [x] GitHub CI 38852863989 PASS: liveness 200, readiness 503 with dummy credentials.
- [ ] Verify readiness 200 against the authorized existing DRONE AIR preview database.


## 2026-10-16 — Optional transactional email availability

- [x] Add finite HTTP deadlines to Google OAuth token refresh and Gmail sends.
- [x] Add regression test verifying the request receives an abort signal.
- [x] Provider timeout commit CI 38953188965 PASS (typecheck, unit tests, Docker and HTTP smoke).
- [ ] Verify actual sender delivery and saved mission behavior under provider outages using authorized preview.


## 2026-10-16 — Deployment verification gate

- [x] Require exact canonical HTTPS production origin and dedicated webhook/token before deploy request.
- [x] After webhook, poll for the validated Git SHA and database readiness, plus French/English homepages.
- [x] Fail the deployment workflow rather than reporting success when the runtime is not verified.
- [x] Modified gated CD source passes CI 38953413909; no real CD deployment executed.
- [ ] Run real CD workflow only after owner-controlled release gates and secure credentials are configured.


## 2026-10-16 — Private download authorization failure

- [x] Do not silently treat a Supabase role lookup failure as a normal client authorization decision.
- [x] Add regression tests for published, archived and unverified client download states.
- [x] Download guard source CI 38953654188 PASS.
- [ ] Execute real two-client negative signed-download access test on authorized DRONE AIR Supabase.
