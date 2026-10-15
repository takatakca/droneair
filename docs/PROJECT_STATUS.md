# DRONE AIR — Project status

Updated: 2026-10-15 (GitHub evidence, not a live release verification)  
Repository: https://github.com/takatakca/droneair  
Publication branch: `main`  
Last implementation SHA at this checkpoint: `aea07c1dd0d9ea970162c30a79d3699422e25498`  
Tracked release blockers: https://github.com/takatakca/droneair/issues/2

## Delivered in the repository

- Independent DRONE AIR bilingual website, public mission intake, SEO and legal routes.
- Authenticated client portal, project view, private deliverables, short-lived signed downloads.
- Protected admin views for clients, projects, missions and files.
- Validated admin-led client membership against verified Supabase Auth identity.
- Supabase migration scripts for tenant/data roles and new restricted profile identity updates.
- Mission request duplicate/rate checks; honeypot spam responses avoid unnecessary data storage.
- GitHub Actions CI: production build, type checking, lint, security regression tests and Docker image build.
- Self-hosted Nitro/Bun `Dockerfile.coolify` and liveness endpoint. Node runtime previously caused a CI smoke-test failure; Bun runtime correction is under verification.

## Evidence and boundaries

- The code integration PR #1 was merged on 2026-10-14.
- Commit `4d87ec5` passed CI on 2026-10-14 (GitHub run 38610621138).
- Security commit `aea07c1` passed the validate job; container build status must be read from GitHub Actions when resuming.
- The newest SQL migration exists in Git, **not verified as applied** in the intended database.
- These CI checks do not prove the application is deployed, connected to the right database, or capable of sending transactional emails.

## Production state

**NOT VERIFIED / NOT COMPLETE.** The linked Supabase tool account cannot access DRONE AIR project `ngdcmpywualyphgrutir`. No verified DRONE AIR-specific Coolify target, secrets, deployed SHA, DNS/TLS or real multi-client testing evidence has been produced in this session. A populated `.env` existed in prior public Git history; rotation remains mandatory.

## Product architecture

DRONE AIR maintains its independent interface and client data. The GROUPE TAKATAK master integration remains disabled until an approved versioned DRONE AIR contract exists. No other TAKATAK dashboard should automatically expose DRONE AIR client data.

See `docs/TASK_QUEUE.md` and `docs/AGENT_HANDOFF.md` for exact next actions.
