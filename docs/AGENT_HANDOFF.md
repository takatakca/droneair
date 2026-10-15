# DRONE AIR — Agent handoff

Updated: 2026-10-15. Read `AGENTS.md`, this file, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md` and GitHub issue #2 before coding. Historical implementation detail remains at `docs/TAKATAK_AGENT_HANDOFF.md`.

## Last completed task

Fixed the real Docker deployment blocker: Nitro's generated Bun server was incorrectly launched with Node. It now runs in a Bun container. Added HTTP runtime smoke checks and a non-secret Git revision marker; verified full CI success on code commit `9d0a035c4c02d9ff0e050614fb1577496f054490` (run 38775210246) and documentation commit `7699abe56d22bf624acc8469d3e4e38facb71e25` (run 38775537222).

## Currently active task

No local container CI defect remains known. Complete the outstanding **external release gates**: authorized access to the existing DRONE AIR Supabase project, key rotation, real migration/RLS testing, and a dedicated Coolify hosting resource with production domain, runtime secrets, actual sender delivery and rollback verification. These are not claims of completion.

## Latest pushed implementation

SHA: `9d0a035c4c02d9ff0e050614fb1577496f054490`  
See https://github.com/takatakca/droneair/commits/main for the subsequent documentation-only commit(s), which cannot self-reference their own SHA without a new commit.

## Files changed during the implementation

- `src/lib/portal/portal.server.ts`
- `src/lib/portal/storage-path.ts`
- `src/routes/api/public/mission-request.ts`
- `supabase/migrations/20261014180000_lock_profile_identity.sql`
- `tests/storage-path.test.ts`
- `tests/security-migration.test.ts`
- `WORKLOG.md`

Documentation completion additionally updates `AGENTS.md`, `docs/DEPLOYMENT.md`, `WORKLOG.md` and creates the status/queue/decisions/handoff files.

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
