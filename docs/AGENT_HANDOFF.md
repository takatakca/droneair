# DRONE AIR — Agent handoff

Updated: 2026-10-16. Read `AGENTS.md`, this file, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md` and GitHub issue #2 before coding. Historical implementation detail remains at `docs/TAKATAK_AGENT_HANDOFF.md`.

## Last completed task

Added explicit authorization-query error handling to private file downloads with tests of client file visibility/archive/verification. Implementation `5623eb6467aa5c46b5bdcd43d5484172094caf7e` passed full CI [38953654188](https://github.com/takatakca/droneair/actions/runs/38953654188). Earlier this session, Gmail request deadlines passed [38953188965](https://github.com/takatakca/droneair/actions/runs/38953188965), and the improved (still disabled) Coolify post-deploy SHA+readiness verification passed [38953413909](https://github.com/takatakca/droneair/actions/runs/38953413909).

## Currently active task

No local container CI defect remains known. Complete the outstanding **external release gates**: authorized access to the existing DRONE AIR Supabase project, key rotation, real migration/RLS testing, and a dedicated Coolify hosting resource with production domain, runtime secrets, actual sender delivery and rollback verification. These are not claims of completion.

## Latest pushed implementation

SHA: `5623eb6467aa5c46b5bdcd43d5484172094caf7e` (latest verified application code; inspect `main` for the later documentation-only commit)  
See https://github.com/takatakca/droneair/commits/main for the subsequent documentation-only commit(s), which cannot self-reference their own SHA without a new commit.

## Files changed during this session

- `src/lib/portal/admin-ops.functions.ts`, `src/lib/portal/db-result.ts`, `tests/db-result.test.ts`
- `src/lib/portal/admin.functions.ts`, `src/lib/portal/membership.ts`, `tests/membership-options.test.ts`
- `src/routes/_authenticated/admin/files.tsx`
- `src/routes/api/ready.ts`, `scripts/smoke-http.mjs`
- `WORKLOG.md`, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEPLOYMENT.md`, `docs/DECISIONS.md`

Historical work remains in Git commits, `WORKLOG.md` and the dated handoff sections below.

## Executed commands and verification

GitHub API access verified with `get_repo`, `fetch_file`, `search_commits`, `search_prs`, `search_issues` and branch/runs reads. Wrote commit through Git tree/commit/reference calls with an expected-head SHA (no force push). GitHub Actions validate job for `aea07c1`: SUCCESS (build, TypeScript, lint and tests). Confirm the final container job status in https://github.com/takatakca/droneair/actions/runs/38613467950.

The earlier `4d87ec5` commit had a fully successful container/build run: https://github.com/takatakca/droneair/actions/runs/38610621138.

The Supabase connection reported **no permission** for project `ngdcmpywualyphgrutir`. The environment had no installed local Supabase CLI and the repository could not be cloned from the container due to blocked DNS. No live migration, end-to-end client-isolation test or production deployment is claimed.

## Known errors and blockers

1. Historic committed `.env` data in this public repository means all historical credentials require rotation before release.
2. DRONE AIR Supabase project is inaccessible from the connected account; confirm existing schema and migration history before using the new SQL file.
3. DRONE AIR production/preview service, environment secrets, DNS/TLS and real release SHA are not yet independently verified.
4. Google Workspace sender delivery and actual mission intake are unverified.
5. TAKATAK master integration has no approved DRONE AIR contract.

## Access needed (never copy secrets into Git)

Authorized project-level permission for DRONE AIR's *existing* Supabase instance, owner-controlled credential rotation, a dedicated hosting-provider app/service with secret management, domain DNS/TLS authority and Google Workspace sender configuration.

## Real deployment status

**Not deployed or production-verified by this agent.** Code is pushed to `main`; GitHub CI is evidence of build quality only, not of an active public server.

## Exact next action

1. Read the GitHub latest `main` HEAD and current CI runs. If any CI job fails, inspect job logs and fix on a new commit.
2. Verify/obtain access to `ngdcmpywualyphgrutir`; inspect existing migrations and bucket policies, then review/apply the unapplied least-privilege SQL and test two-client RLS.
3. When a real dedicated DRONE AIR hosting service becomes accessible, configure build/runtime secrets, deploy to preview, verify the actual API, and promote to production only after all release gates pass.
4. Update `WORKLOG.md`, this handoff and issue #2 with exact evidence. Never mark release as successful without a verified external runtime.

## Additional independent task (2026-10-14)

Prepared `scripts/smoke-http.mjs` and a CI container runtime smoke step after creating the five standard handoff documents (documentation commit `1dc8372ab6c939aaa742f93fd0bbaa78514a9ca9`). Inspect the newest `main` CI to see whether HTTP checks pass. These smoke requests use mock CI runtime values, **not** the production project, and must not be cited as a production release.

## Gated continuous delivery wiring

The repository now includes `.github/workflows/deploy-coolify.yml`. It is **inactive until** the owner-controlled repository variable `DRONE_AIR_PRODUCTION_DEPLOY_ENABLED=true` and dedicated Coolify webhook/token secrets are supplied. It will refuse stale SHAs and untrusted PR CI results. No deployment has been executed or verified through this workflow.


## 2026-10-15 — Container boot failure diagnosed and corrected

Verified CI failures:
- Run 38614070184 — validation/build/typecheck/lint/tests passed; container HTTP smoke failed.
- Run 38614445582 — same outcome; job 116028809351 logs explicitly show `ReferenceError: Bun is not defined` at generated `BunServer.serve`.
- Post-CI Coolify deploy runs were skipped, not deployments.

Root cause: `vite build` with current Nitro 3 emits an H3 Bun server. `Dockerfile.coolify` previously used Node 22 as runtime and started `.output/server/index.mjs` under Node, which cannot provide global `Bun`.

Fix: switch the final Docker layer to `oven/bun:1`, run as unprivileged `bun` user, start with `bun .output/server/index.mjs`. Align `package.json` start command and deployment docs. Existing GitHub Actions container job exercises HTTP health and French/English pages with fake CI Supabase inputs. Verify the latest run before calling this fixed.

Exact next task: inspect the next GitHub Actions run for this fix. If smoke still fails, fetch failed job logs and repair the actual reason; avoid retrying Node runtime. Once CI fully green, resume real Supabase access/secret rotation and dedicated Coolify app release gates in issue #2. No production rollout is authorized or confirmed.


## 2026-10-15 — Git revision evidence added

To verify actual deployed source, `/api/health` now returns `revision` from `DRONE_AIR_GIT_SHA` when a valid 40-character SHA was supplied to the Docker runtime stage, otherwise null. CI Docker build passes `GITHUB_SHA` and smoke-checks it. Production Coolify must supply the real checkout SHA; do not mistake the presence of a SHA string for external deployment confirmation. Recheck GitHub Actions before marking the new smoke run successful.


## 2026-10-15 — Verified CI resolution and exact next step

Latest fully verified application commit: `9d0a035c4c02d9ff0e050614fb1577496f054490`.

GitHub Actions:
- [run 38774629494](https://github.com/takatakca/droneair/actions/runs/38774629494): SUCCESS. Build/typecheck/lint/tests, Docker build and live health/French/English HTTP smoke.
- [run 38775210246](https://github.com/takatakca/droneair/actions/runs/38775210246): SUCCESS. The same checks **plus** verifying the exact baked Git SHA in `GET /api/health`.
- Gated production deployment workflow remained skipped because the dedicated application/secrets/enable switch are not verified.

Files modified in these final code commits: `Dockerfile.coolify`, `package.json`, `README.md`, `src/routes/api/health.ts`, `scripts/smoke-http.mjs`, `.github/workflows/ci.yml`, `WORKLOG.md` and the standard documentation files. This handoff update is documentation-only and may trigger a later CI run; use the GitHub `main` ref to identify the newest documentation commit.

**Current remaining task**: access the actual DRONE AIR Supabase project `ngdcmpywualyphgrutir` with authorized permissions, review/apply the queued migration, verify tenant isolation and rotate historically exposed keys. In parallel discover/configure the dedicated DRONE AIR Coolify resource, private runtime secrets and build arguments, then verify live revision, DNS/TLS, mission submission, portal downloads and rollback. Do not enable gated deployment until release security gates are met. No real production deployment, hostname/TLS verification or email delivery was completed during this session.

The attempted unauthenticated requests to `drone-air.ca` failed DNS resolution in the execution environment; this is **not** proof of worldwide DNS failure.


## 2026-10-15 — Mission payload security work

The next independent code task after recovering Bun CI was to stop oversized public mission form requests before `request.formData()` allocates the entire payload. Added `src/lib/mission-body.server.ts` streaming limit and `MAX_MISSION_BODY_BYTES` constant. `src/routes/api/public/mission-request.ts` uses the bounded form parser and checks uploaded file signature bytes for PDF/JPEG/PNG/WebP before Storage upload. Added `tests/mission-intake-security.test.ts` with multipart, oversize streaming, missing/false content-length and magic-byte checks. Change is **not verified against the real database**; check the new GitHub CI first. Next actual production step remains authorized DRONE AIR Supabase project access and dedicated Coolify setup, key rotation and live tenant tests. GitHub issue #2 remains open.


## 2026-10-15 — Bounded mission intake validation and next regression check

Commit `d0addc4ad9b5a55ac45c5ccb2d2b8d7166a7b857` introduced a bounded multipart parser, file signature checks and regression tests; CI run 38792228853 exposed a TypeScript DOM BlobPart incompatibility. Corrected in `bc485cfb805ed36c6cc54ab443f4b4603aed44c1` by copying chunks into an exact `ArrayBuffer` before `Response.formData()`. **Full CI run [38792341421](https://github.com/takatakca/droneair/actions/runs/38792341421) succeeded**, including production build, TypeScript, lint, Bun tests, Docker build and HTTP smoke.

The newest code change also extends `scripts/smoke-http.mjs` with live-container negative tests of HTTP 413 for oversized multipart and HTTP 400 for JSON on the public mission endpoint. **Check the newest CI run for this change**. No actual mission was submitted to production, and all real Supabase/Coolify release gates remain open.


## 2026-10-15 — Additional file lifecycle correctness patch

Admin operations in `src/lib/portal/admin.functions.ts` now check replacement scope *before* accepting an upload; replacements must archive the prior file successfully, archives must update a real row, and a failed signed upload ticket attempts to delete its tentative record. Pure regression test `tests/portal-replacement.test.ts` covers client and project boundaries. The production Supabase project remains inaccessible, so these changes are **not** production integration-tested. Check current GitHub CI and keep release gate #2 open. Files: `src/lib/portal/admin.functions.ts`, `src/lib/portal/replacement.ts`, `tests/portal-replacement.test.ts`, standard status/queue/decisions/handoff documents and worklog.


## 2026-10-15 — Final verified state and handoff

**Latest verified implementation commit:** `77f39384b67da6657c484ba56f61d6cfc5c7d04c` on `main`. This and the prior implementation commits were pushed without force-push. See current `main` SHA at https://github.com/takatakca/droneair/commits/main (a later documentation-only commit may follow).

**Latest completed tasks and proof:**
1. Public mission multipart body now has a strict total size limit before parsing and PDF/JPEG/PNG/WebP byte signatures are checked. Initial TS issue fixed in `bc485cf`; full CI [38792341421](https://github.com/takatakca/droneair/actions/runs/38792341421) SUCCESS.
2. Running Bun container HTTP 413 and 400 negative tests added, CI [38792894836](https://github.com/takatakca/droneair/actions/runs/38792894836) SUCCESS.
3. Admin signed-ticket failures cleanup tentative metadata, file replacement rejects different client/project before verification, and replacement/archive require actual updated rows. Regression tests included, CI [38793107957](https://github.com/takatakca/droneair/actions/runs/38793107957) SUCCESS.

**Files changed:** `src/lib/mission-request.ts`, `src/lib/mission-body.server.ts`, `src/routes/api/public/mission-request.ts`, `tests/mission-intake-security.test.ts`, `scripts/smoke-http.mjs`, `src/lib/portal/admin.functions.ts`, `src/lib/portal/replacement.ts`, `tests/portal-replacement.test.ts`, the five required documents and `WORKLOG.md`.

**Executed checks:** connected GitHub commit/branch/PR/issue/CI APIs, CI job step and failure log review, full GitHub Bun build, strict TypeScript, ESLint, regression tests, Docker Bun image and actual HTTP smoke on mock environment. Supabase project `ngdcmpywualyphgrutir` access returned permission denied. The configured Coolify application, runtime credentials, DNS/TLS and sender remain unverified; the gated production workflow was skipped, not deployed.

**Currently active release task:** validate and apply previously staged database migration on authorized existing Supabase project; rotate historically committed credentials; prove two-client RLS and file isolation, genuine mission form persistence and private storage. Then connect a separate DRONE AIR Coolify resource, configure build/runtime secrets and validate the actual deployed SHA, DNS/TLS, transactional email and rollback. GitHub issue #2 tracks gates.

**Exact next action:** check latest `main` SHA and CI after any documentation commit, then obtain authorized project access to `ngdcmpywualyphgrutir` to inspect migrations and RLS without creating a new paid project; if blocked, resume independent source-quality tasks but **never** declare release complete.


## 2026-10-15 — Portals now report query failures accurately

`src/lib/portal/client.functions.ts` and `src/lib/portal/admin.functions.ts` now check error results for role/profile/membership, tenant projects/files and admin workspace/member detail reads. When a query fails, these server functions throw an explicit general error rather than rendering empty data. This code change does not imply the live Supabase project is accessible. GitHub CI must be checked for this checkpoint; acceptance testing against live users remains in issue #2.

## 2026-10-16 — Administrator operation reliability

Latest prior validated GitHub CI: `38793570682` succeeded for `1d02db3`; gated Coolify deployment was skipped (`38793699874`). No production deployment was made.

The new implementation tightens `src/lib/portal/admin-ops.functions.ts`: missing count/read query errors now fail visibly, row updates/deletes must return an affected row, mission-sourced client/project creation requires an actual mission. Pure helper `src/lib/portal/db-result.ts` is verified by new `tests/db-result.test.ts`. Modified standard tracking docs and `WORKLOG.md`. **Verify GitHub CI for the new commit before claiming it passes.** The deployed database cannot be checked without access to project `ngdcmpywualyphgrutir`; do not create an unrelated or billable Supabase project.

Exact next action: inspect latest `main` run and fix any TypeScript, lint, tests or Docker HTTP failures. Once green, next release gates remain existing-project Supabase access, applying/reviewing pending migrations, historical key rotation, two-client RLS/storage tests and verified dedicated Coolify app with domain/TLS/sender. Source code changes are not proof of production.

## 2026-10-16 — Repeat invitation role preservation

Additional authorization improvement: `src/lib/portal/admin.functions.ts` now refuses profile lookups that failed at Supabase and uses `MEMBER_INVITE_UPSERT_OPTIONS` with `ignoreDuplicates: true`. Existing client membership rows and custom `membership_role` are **not** overwritten with `member` when an administrator repeats an invitation. Added shared config `src/lib/portal/membership.ts` and regression test `tests/membership-options.test.ts`. This does **not** grant roles to new unauthenticated users: existing verified Auth identity matching remains required.

Check current GitHub Actions before claiming this newest fix passed. The authorization path also requires a real existing-project Supabase integration test for duplicate membership preservation. Never use any unrelated TAKATAK Supabase project as a substitute.

## 2026-10-16 — File admin error UI

The `src/routes/_authenticated/admin/files.tsx` screen now guards edit/publish/archive server calls with a serialized action runner, disables duplicate clicks, catches errors and presents French/English alerts. It also distinguishes failed file/history queries from valid empty results. Verify GitHub Actions on the new UI commit; without a DRONE AIR-connected Supabase instance, live form/workflow acceptance remains blocked. Refrain from enabling production deployment.

## 2026-10-16 — Separate database readiness

Added `src/routes/api/ready.ts`: a server-only, read-only, 4-second bounded query of DRONE AIR `clients`. HTTP 200 means the actual DB can answer; 503 indicates failure. The endpoint never exposes secrets or detailed Supabase errors. `scripts/smoke-http.mjs` now expects 503 with the deliberately fake CI credentials. The production ready state cannot be verified without the real project. Check newest GitHub Actions run to validate the route and smoke; prior code CI for invitation `38852562996` passed. Production webhook must remain disabled.

## Current next action and exact validation evidence — 2026-10-16

Last application SHA validated: `dd56dbb963f03627cb53aa64df47af1708f3597f`. Relevant GitHub Actions runs: 38852451732, 38852562996, 38852681875, 38852863989: **all successful**, including Docker runtime and HTTP checks. No new application functionality is awaiting CI. This handoff documentation commit may trigger one additional GitHub Actions run; confirm before closing session.

**No real deployment was done.** The GitHub post-CI Coolify deploy workflow remains disabled and skipped. The connected Supabase tool returned `You do not have permission to perform this action` on existing DRONE AIR project `ngdcmpywualyphgrutir`. Real `drone-air.ca` and `/api/health` could not be retrieved through the current external verification interface; their actual availability is unknown. Do not imply a global DNS outage. No Supabase migration was applied. Historic public `.env` values require rotation.

**Access needed:** authorization on the existing Supabase project, controlled credential rotation, access to the dedicated DRONE AIR Coolify application (not another project's app), DNS/TLS authority, Google Workspace sender proof and owner-controlled production approval. Never paste secrets into Git.

**Exact next step:** first inspect newest `main` CI and any changes by other agents; then inspect/apply the pending identity privilege migration on the correct authorized Supabase instance, verify two-client RLS and private buckets, perform end-to-end missions and invitations, configure the dedicated Coolify resource with the actual build SHA/public variables/runtime secrets and validate `/api/ready` 200 before production. Leave issue #2 open until real deployment, delivery and rollback are proven.


## 2026-10-16 — Optional email provider deadlines

Added `src/lib/email/http.server.ts`, `tests/email-provider-timeouts.test.ts`, and modified `src/lib/email/send.server.ts` to limit actual OAuth/Gmail outbound HTTP calls to 5 and 8 seconds. Existing two-attempt behavior, lead storage-first contract and failure reporting remain. This commit was pushed to `main`; **check the exact latest GitHub CI run** for validation. No live Gmail email was sent or verified. Previous checkpoint `b719f9f61a4f226a0a3731398e44526c5cde2d09` passed CI run 38853048865. Continue external production gates unchanged.


## 2026-10-16 — Gated Coolify post-deploy proof

`.github/workflows/deploy-coolify.yml` now demands the approved `DRONE_AIR_PRODUCTION_ORIGIN=https://drone-air.ca`, a dedicated resource webhook and token before requesting deployment; after webhook it retries actual public release SHA, `/api/ready` and `/`, `/en` checks and fails if never confirmed. Added `tests/deploy-workflow-gates.test.ts`. This workflow remains opt-in **disabled**, no webhook was sent, and its actual end-to-end behavior cannot be verified without the dedicated production environment. Check newest CI for these source changes. Do not enable deploy until credential rotation, Supabase and tenant security acceptance. Previous email timeout commit `0e687918` must also be checked for full CI status.


## 2026-10-16 — Signed-download authorization guard

Changed `src/lib/portal/client.functions.ts` to fail explicitly when `user_roles` lookup fails before issuing a signed URL; retained independent client tenant membership and file-state checks. Extracted `src/lib/portal/download-policy.ts` and added `tests/portal-download-policy.test.ts`. Exact next step: check current GitHub Actions for this commit; cross-client real Supabase tests remain blocked. The prior gated deployment workflow commit `f2d1f423` passed CI run 38953413909. No Coolify webhook was sent and no production release was verified.


## 2026-10-16 — Verified final checkpoint and next action

**Source-of-truth code SHA:** `5623eb6467aa5c46b5bdcd43d5484172094caf7e` on `main` (followed by this docs-only commit). CI proof:
- `0e687918` [38953188965](https://github.com/takatakca/droneair/actions/runs/38953188965): **PASS**.
- `f2d1f423` [38953413909](https://github.com/takatakca/droneair/actions/runs/38953413909): **PASS**.
- `5623eb64` [38953654188](https://github.com/takatakca/droneair/actions/runs/38953654188): **PASS**.
All passed build, strict TypeScript, lint, Bun tests, Docker image build and real CI-container HTTP smoke. The Coolify deployment jobs remain **skipped**, as deliberately gated; source-level validation does **not** prove the production CD workflow ran.

**Files changed:** `src/lib/email/http.server.ts`, `src/lib/email/send.server.ts`, `tests/email-provider-timeouts.test.ts`, `.github/workflows/deploy-coolify.yml`, `tests/deploy-workflow-gates.test.ts`, `src/lib/portal/client.functions.ts`, `src/lib/portal/download-policy.ts`, `tests/portal-download-policy.test.ts`, and required status/handoff/deployment/decision documents and `WORKLOG.md`.

**Commands and checks:** connected GitHub reads for branch, CI, open PRs/issues, file source; atomic Git tree/commit/update-ref with expected SHA and no force push; fetched GitHub Actions job results; attempted public HTTPS requests to `drone-air.ca/`, `/api/health`, `/api/ready` (unavailable via verification interface). Queried the intended existing Supabase project again: **permission denied**. No SQL migration was applied. No real Gmail email was sent.

**Currently active task / blockers:** production acceptance, not another CI repair. Historical committed keys need owner-controlled rotation. The existing Supabase project `ngdcmpywualyphgrutir` is inaccessible to this connection; live migration history, private bucket/RLS, two-client denial tests and mission persistence have not been proven. No authorized dedicated DRONE AIR Coolify resource, DNS/TLS, production sender/delivery, or release rollback evidence is available. TAKATAK identity integration requires a separate approved contract.

**Exact next action:** verify the latest `main` SHA and this documentation commit's GitHub CI; obtain authorized DRONE AIR Supabase access (without creating a billable project); review and apply pending least-privilege migration after backup; rotate historical secrets; validate two real client accounts and signed files; configure a DRONE AIR-only Coolify app and `DRONE_AIR_PRODUCTION_ORIGIN` under a protected production environment; verify correct public build SHA, `/api/ready`, DNS/TLS, email and rollback. Enable the gated CD switch only after owner-approved release security gates. Update issue #2 with evidence, never claim unverified production.

## 2026-10-26 — Non-production Coolify preview (Claude)

- **Coolify application:** `droneair-preview` (uuid `ovag3pomaa7qqz4ohq3pmfbs`), project "DRONE AIR", server vps2 (`209.145.49.63`). It builds `main` with `Dockerfile.coolify` (port 3000) on every push through the Coolify GitHub App. Temporary address: `http://ovag3pomaa7qqz4ohq3pmfbs.209.145.49.63.sslip.io` (plain HTTP).
- **Placeholder values, as in CI:** `VITE_SUPABASE_URL=https://example.supabase.co` and a placeholder publishable key (build-time). Placeholder `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are marked **runtime-only** in Coolify, not build args. The preview cannot reach any real database. No Gmail or Gemini secrets are set.
- **Evidence on commit `f651597`:**
  - Coolify deployment finished.
  - `node scripts/smoke-http.mjs http://ovag3pomaa7qqz4ohq3pmfbs.209.145.49.63.sslip.io` passes: `/` and `/en` HTTP 200, oversized and wrong-type mission requests rejected, `/api/ready` reports the fake database unavailable.
  - `/api/health` returns `{"status":"alive","service":"drone-air","revision":null}`.
  - Chromium (fr-CA) renders `/`, `/en` and `/contact` without page errors.
- **Coolify health check disabled:** the `oven/bun` runtime image has no `curl` or `wget`, so Coolify's in-container probe failed even though the server was listening. Next: add a Bun-based Docker `HEALTHCHECK` (or install curl), then re-enable it.
- **`revision` is null:** Coolify does not pass `DRONE_AIR_GIT_SHA`; it provides `SOURCE_COMMIT` when "include source commit in build" is on. Next: let `Dockerfile.coolify` fall back to `SOURCE_COMMIT`.
- **Live `drone-air.ca` is unchanged.** It is the MochaHost reseller account `droneair` (`209.42.24.129`, Passenger `app/.output/server/index.mjs`, an older build). On that site `/en` renders a nearly empty page, while the preview serves the full English page.
- **The gated `deploy-coolify.yml` stays disabled.** The Coolify auto-deploy above only reaches the temporary preview address, never the production domain.

**Next exact action:** the owner provides the real public `VITE_SUPABASE_*` values and the runtime secrets (after rotation) in Coolify, then completes the P0 database gates. After that: attach `drone-air.ca` + `www`, switch only the website A records to `209.145.49.63` (mail stays at MochaHost), redeploy for TLS, and verify on the real domain with `scripts/smoke-http.mjs`.

## 2026-10-27 — drone-air.ca now served by Coolify (owner-approved, Claude)
- **Owner decision:** move the domain to Coolify now and add the real values afterwards.
- **Coolify:** the application `droneair-preview` was renamed **`droneair`** (same uuid `ovag3pomaa7qqz4ohq3pmfbs`). Domains: `https://drone-air.ca`, `https://www.drone-air.ca` (redirects to the apex) and the sslip address.
- **DNS:** In the authoritative zone (MochaHost reseller account), the `drone-air.ca` A record → `209.145.49.63` (TTL 300); `www` is a CNAME to the apex. MX now names `mail.drone-air.ca`, an A record → `209.42.24.129`, so mail stays on MochaHost. The bolonca copy of the zone was switched the same way, with mail on bolonca, ready for when the reseller account is removed. Zone backups were taken first. Resolvers holding the old 7200 s record follow within about 2 hours.
- **Evidence:** over HTTPS with a valid certificate, `https://drone-air.ca/api/health` is alive and `/en` returns the full English page (33 KB); `www` redirects. The old MochaHost app had no environment variables, so nothing was lost in the move.
- **Still placeholder values, so the production release gates are NOT met:** mission intake, the client portal, private files and email do not work. Values to set in Coolify: build: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (real project `ngdcmpywualyphgrutir`, replacing the placeholders; needs a rebuild); runtime-only: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (after rotation), `GOOGLE_GMAIL_CLIENT_ID`, `GOOGLE_GMAIL_CLIENT_SECRET`, `GOOGLE_GMAIL_REFRESH_TOKEN`, `GMAIL_SENDER_EMAIL`, optional `GEMINI_API_KEY`. Then redeploy and run `node scripts/smoke-http.mjs https://drone-air.ca`.
- **Next exact action:** the owner sets those values, then completes the P0 database gates in `docs/TASK_QUEUE.md`. Remove the reseller account `droneair` only after downloading `backup-10.26.2026_16-26-14_droneair.tar.gz` from its home folder.

## 2026-10-29 — Commit in /api/health on Coolify, Bun health check, owner checklist (Claude)
- **`docs/OWNER_ACTIONS.md`** is the hands-on checklist, with the same numbers as the private Drive main file. Items are labelled 🔧 OWNER (manual) or 🤖 CLAUDE (agent). Start with O-06 → O-08.
- **`src/lib/release-revision.ts`:** `/api/health` reports `DRONE_AIR_GIT_SHA` (CI build argument) or Coolify's `SOURCE_COMMIT`, and only ever a full 40-character SHA. "Include source commit in build" is on for the `droneair` Coolify app. Tested in `tests/release-revision.test.ts`.
- **`Dockerfile.coolify`:** a `HEALTHCHECK` uses Bun's `fetch`, because the image has no curl or wget, so Docker and Coolify can see container health. Coolify's own curl-based check stays off.
- **Verified locally:**
  - `bun test tests`: 27/27 pass.
  - `vite build`, then `tsc --noEmit`: 0 errors.
  - The built server with `SOURCE_COMMIT=<sha>` reports `revision:<sha>`.
  - The health-check command exits 0 with the server up and 1 with nothing listening.
- **Next exact action:** after the merge, Claude checks that `https://drone-air.ca/api/health` shows the merged commit and that the container is healthy (C-08). The owner does O-06 → O-08.
