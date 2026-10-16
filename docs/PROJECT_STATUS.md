# DRONE AIR — Project status

Updated: 2026-10-15 (GitHub evidence, not a live release verification)  
Repository: https://github.com/takatakca/droneair  
Publication branch: `main`  
Last verified implementation SHA: `9d0a035c4c02d9ff0e050614fb1577496f054490`  
Tracked release blockers: https://github.com/takatakca/droneair/issues/2

## Delivered in the repository

- Independent DRONE AIR bilingual website, public mission intake, SEO and legal routes.
- Authenticated client portal, project view, private deliverables, short-lived signed downloads.
- Protected admin views for clients, projects, missions and files.
- Validated admin-led client membership against verified Supabase Auth identity.
- Supabase migration scripts for tenant/data roles and new restricted profile identity updates.
- Mission request duplicate/rate checks; honeypot spam responses avoid unnecessary data storage.
- GitHub Actions CI: production build, type checking, lint, security regression tests and Docker image build.
- Self-hosted Nitro/Bun `Dockerfile.coolify` and liveness endpoint reporting an optional build revision. The Node/Bun startup mismatch is corrected and the Bun runtime has passed real container smoke testing in GitHub Actions.

## Evidence and boundaries

- The code integration PR #1 was merged on 2026-10-14.
- Commit `4d87ec5` passed CI on 2026-10-14 (GitHub run 38610621138).
- Security commit `aea07c1` passed complete CI ([run 38613467950](https://github.com/takatakca/droneair/actions/runs/38613467950)).
- Docker runtime recovery `ff5edba` passed build and running-container smoke ([run 38774629494](https://github.com/takatakca/droneair/actions/runs/38774629494)).
- Release SHA observability `9d0a035` passed build, typecheck, lint, tests, Docker image and HTTP smoke/revision ([run 38775210246](https://github.com/takatakca/droneair/actions/runs/38775210246)).
- Documentation/handoff revision `7699abe` also passed complete GitHub CI ([run 38775537222](https://github.com/takatakca/droneair/actions/runs/38775537222)).
- The newest SQL migration exists in Git, **not verified as applied** in the intended database.
- These CI checks do not prove the application is deployed, connected to the right database, or capable of sending transactional emails.

## Production state

**NOT VERIFIED / NOT COMPLETE.** The linked Supabase tool account cannot access DRONE AIR project `ngdcmpywualyphgrutir`. No verified DRONE AIR-specific Coolify target, secrets, deployed SHA, DNS/TLS or real multi-client testing evidence has been produced in this session. A populated `.env` existed in prior public Git history; rotation remains mandatory.

## Product architecture

DRONE AIR maintains its independent interface and client data. The GROUPE TAKATAK master integration remains disabled until an approved versioned DRONE AIR contract exists. No other TAKATAK dashboard should automatically expose DRONE AIR client data.

See `docs/TASK_QUEUE.md` and `docs/AGENT_HANDOFF.md` for exact next actions.


## 2026-10-15 — Next code checkpoint

Public mission form hardening is committed for GitHub CI validation: total multipart request size enforcement and file byte-signature checks. No database migration or live Supabase service call was made; production release blockers in issue #2 remain.


Security code checkpoint `bc485cf` passed full GitHub Actions CI [38792341421](https://github.com/takatakca/droneair/actions/runs/38792341421), including the new bounded-body and file-signature tests. The follow-up container HTTP negative-path smoke test is pending validation.


## 2026-10-15 — File administration hardening

Further code changes verify replacement scope before accepting a new file, refuse success if archive/replace affects no row, and cleanup tentative file records when a signed upload ticket cannot be created. Regression tests cover isolation by client/project. These checks require GitHub CI and later live Supabase verification.


### GitHub verification — 2026-10-15 (final implementation batch)
- `bc485cf`: bounded multipart parser and MIME signature tests passed ([CI 38792341421](https://github.com/takatakca/droneair/actions/runs/38792341421)).
- `343c169`: live Bun container returned 413 for oversized multipart and 400 for unsupported JSON body ([CI 38792894836](https://github.com/takatakca/droneair/actions/runs/38792894836)).
- `77f3938`: new admin file replacement safeguards and isolation regression tests passed build, TypeScript, lint, tests, Docker build and container HTTP smoke ([CI 38793107957](https://github.com/takatakca/droneair/actions/runs/38793107957)).

These are GitHub-run test results, not real Supabase integration or production deployment evidence.


A follow-up code checkpoint adds explicit errors for failed Supabase client/admin portal reads so outages cannot be silently presented as empty records. Its GitHub CI and real database acceptance results must be checked separately.

## 2026-10-16 — Server-side administrator correctness

The code now distinguishes real empty results from failed Supabase reads and checks actual affected rows on update/delete operations. Mission-to-client/project creation requires an existing mission. Dedicated regression tests cover the shared result guards. Live integration acceptance remains blocked by access to the existing DRONE AIR Supabase project.

### 2026-10-16 — Authorization improvement

Admin account linking is now idempotent: a repeated invitation must not overwrite an existing client membership role, and account lookup errors are explicit. A new regression test guards the upsert behavior. GitHub CI and real database verification are separate requirements.

The administrator file screen now handles failed file actions and failed listing/history fetches explicitly. Code submitted for GitHub CI; real customer acceptance and production integration remain unverified.
