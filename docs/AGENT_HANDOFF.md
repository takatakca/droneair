# DRONE AIR — Agent handoff

Updated: 2026-10-14. Read `AGENTS.md`, this file, `docs/PROJECT_STATUS.md`, `docs/TASK_QUEUE.md` and GitHub issue #2 before coding. Historical implementation detail remains at `docs/TAKATAK_AGENT_HANDOFF.md`.

## Last completed task

Applied security and reliability code changes on the existing `main` branch: canonical Auth email protection reinforced with an unapplied SQL migration; role lookup cannot probe arbitrary users; mission form submission rate checks now fail closed, suppress duplicate lead references and cleanup orphan attachments; UUID-based upload paths and regression tests.

## Currently active task

Finish repository documentation, monitor CI for the latest pushed change, then resume the *first feasible* release gate. Next external dependency is access to the actual Supabase project and a verified application deployment host.

## Latest pushed implementation

SHA: `aea07c1dd0d9ea970162c30a79d3699422e25498`  
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
