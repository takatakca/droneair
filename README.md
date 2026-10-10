# DRONE AIR

Production website and secure client-delivery portal for **DRONE AIR**.

- Production domain: https://drone-air.ca
- Contact: info@drone-air.ca
- Phone: (514) 448-2825
- Location: 4625 Rue Fairway, Lachine, Québec H8T 1B7, Canada
- Languages: French (default) and English

## Product boundaries

DRONE AIR is an independent client application. It owns its mission intake, client projects, deliverables and business operations.

GROUPE TAKATAK may provide shared services only through explicit, approved API contracts. There is currently no verified DRONE AIR contract in `takatakca/takatak-v1`; no master API integration is enabled by this repository. See `docs/TAKATAK_INTEGRATION_STATUS.md`.

## Stack

- TanStack Start / React / TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL and private Storage
- TanStack Query
- Nitro server build

GitHub is the development source of truth. The repository still contains provider-specific Lovable build/email/AI dependencies inherited from the original implementation. Those dependencies must not be confused with the development workflow and should only be replaced when a verified production alternative is ready.

## Public routes

French:

- `/`
- `/solutions`
- `/contact`
- `/privacy`
- `/terms`

English:

- `/en`
- `/en/solutions`
- `/en/contact`
- `/en/privacy`
- `/en/terms`

Private/account routes:

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/client`
- `/client/projects/:projectId`

Admin routes:

- `/admin`
- `/admin/clients`
- `/admin/projects`
- `/admin/missions`
- `/admin/files`

Admin authorization is enforced server-side through `user_roles`. Never grant admin status from client-controlled metadata.

## Mission intake

`POST /api/public/mission-request` validates and stores mission requests in Supabase. It includes attachment validation, duplicate/rate controls, spam classification, AI-assisted triage and email notification attempts.

Mission storage is authoritative. An email-provider failure must never discard a successfully validated request.

## Client file cabinet

Deliverables use the private `client-deliverables` storage bucket.

Security flow:

1. Admin reserves a generated private storage path.
2. Browser receives a short-lived signed upload token.
3. Upload goes directly to private storage.
4. Server verifies the object exists before marking it usable.
5. Admin explicitly publishes the file.
6. Authorized client membership is checked server-side before download.
7. Client receives a short-lived signed download URL.
8. File events are logged.

No permanent public deliverable URL is used.

## Environment variables

Copy `.env.example` into the deployment environment's secret manager. Never commit a populated `.env`.

Required Supabase variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Current provider-specific mission AI/email variables:

- `LOVABLE_API_KEY`
- `MISSION_AI_MODEL` (optional override)
- `EMAIL_SENDER_DOMAIN`

Because a populated `.env` was historically committed to this public repository, every secret that ever appeared in that file must be rotated before production. Removing the file from the latest commit does not remove it from Git history.

## Development

Bun is preferred because `bun.lock` is committed.

```bash
bun install --frozen-lockfile
bun run dev
```

Production checks:

```bash
bun run build
bunx tsc --noEmit
bun run lint
```

The build runs first in CI so TanStack can regenerate its file-route tree before standalone TypeScript checking.

## Database

Supabase migrations live under `supabase/migrations/`. Migrations are additive and must be reviewed before production application.

Important tables include:

- `mission_requests`
- `mission_email_events`
- `profiles`
- `clients`
- `client_memberships`
- `user_roles`
- `client_projects`
- `client_files`
- `client_file_events`

Private buckets include mission attachments and client deliverables.

## Deployment

See `docs/DEPLOYMENT.md`.

Do not declare production verified merely because the build passes. Production verification requires the deployment target, production environment variables, database migrations, domain/TLS, real mission intake, private file authorization and email status to be checked against the deployed site.

## Agent coordination

Read `AGENTS.md` and the top of `WORKLOG.md` before making changes. Multiple agents may work in this GitHub organization; preserve branches and do not rewrite published Git history.
