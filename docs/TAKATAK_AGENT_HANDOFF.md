# DRONE AIR agent handoff

## 2026-10-10 — Codex final-production pass

Branch: `codex/final-production-2026-10-10`  
Pull request: #1

### Scope continued from previous agent

The client portal foundation was already merged on `main`. This pass continued it rather than rebuilding it.

Completed in this branch:

- protected admin console for clients, projects, mission requests and client deliverables
- direct signed uploads to the private `client-deliverables` bucket
- verify → private/publish → unpublish/archive workflow
- secure file replacement/version handoff with same-client/project integrity checks
- client project detail page and row-based file cabinet
- indexable English public routes under `/en`
- bilingual canonical/hreflang/sitemap handling
- premium editorial public-site pacing, service chapters, client-delivery chapter and closing CTA
- route-aware HTML language and branded error experience
- mobile navigation focus trap/Escape/focus return
- GitHub Actions build + TypeScript + lint + brand/secret/Lovable-runtime guards
- official TanStack Start + Nitro Vite configuration (no Lovable Vite wrapper)
- direct Google Gemini mission triage
- direct Google Workspace/Gmail API transactional email implementation
- committed `.env` removed from HEAD and replaced with `.env.example`
- obsolete `.lovable` project artifacts and runtime error bridge removed
- obsolete direct Lovable package dependencies removed and lockfile regenerated
- production/deployment/integration documentation updated

### Verified in GitHub

CI has passed production build, TypeScript and lint after the GitHub-first runtime changes. The CI workflow also fails if:

- a runtime `@lovable.dev` dependency/reference reappears
- `LOVABLE_API_KEY` or Lovable AI gateway usage reappears
- a populated `.env` becomes tracked
- obsolete DRONE R’AIR / old email/domain / placeholder links reappear in production-facing source/docs

### Critical production security blocker

A populated `.env` existed historically in this public repository.

Removing it from HEAD **does not remove it from Git history**. Every credential that ever appeared in that file must be rotated before production deployment.

Do not paste replacement secrets into issues, PR comments or chat.

### DRONE AIR Supabase blocker

The repository references Supabase project:

`ngdcmpywualyphgrutir`

The Supabase account currently connected to the engineering tools does not have access to that project. Therefore production migrations, RLS/storage verification, first-admin provisioning and two-client isolation testing cannot be truthfully marked production verified yet.

Do not create a replacement paid database merely to bypass this blocker.

### Hosting discovery

No DRONE AIR deployment target was found in the currently connected providers:

- Vercel: no matching project
- Netlify: no matching project
- Render workspace: existing services are `isexy` and `takatak`, not DRONE AIR

Do not force DRONE AIR onto one of those providers without confirming the intended production hosting architecture.

### TAKATAK V1

`takatakca/takatak-v1` was inspected for real identity, entitlement, registry and API contracts.

No DRONE AIR-specific master contract was found. No TAKATAK V1 code was modified and no master endpoint was invented.

DRONE AIR remains independently deployable and locally authoritative for its own client memberships, projects, missions and deliverables until an approved versioned TAKATAK contract exists.

### Required next production steps

1. Review/merge PR #1 once the latest CI is green.
2. Rotate every historically committed secret.
3. Connect/access the actual DRONE AIR Supabase project and apply/review migrations.
4. Provision the first admin role through a secure owner-controlled process.
5. Test Client A / Client B isolation, private upload, publish, signed download and expiry.
6. Configure Google Workspace/Gmail OAuth secrets and run a real send from `info@drone-air.ca`.
7. Configure `GEMINI_API_KEY` if AI triage is desired; absence must degrade safely to human review.
8. Confirm the real production hosting target for `drone-air.ca`, configure secrets there, deploy a staging/preview build and verify runtime behavior.
9. Verify DNS/TLS, public routes, mission intake, auth, admin, client downloads and rollback.
10. Promote to production only after those gates pass.
