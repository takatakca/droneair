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
