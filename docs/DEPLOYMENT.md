# DRONE AIR deployment

Production domain: https://drone-air.ca

## Release gates

A production release requires evidence for:

- GitHub CI green
- reviewed database migrations
- runtime secrets configured outside Git
- historical leaked/committed secrets rotated
- production Supabase connection verified
- admin role provisioned securely
- mission request persistence tested
- client tenant isolation tested
- private upload/download flow tested
- French and English public routes tested
- canonical/hreflang/sitemap verified
- domain and TLS verified
- email sender status accurately reported
- rollback path understood

## Build

```bash
bun install --frozen-lockfile
bun run build
bunx tsc --noEmit
bun run lint
```

The application uses TanStack Start with Nitro through the official Vite plugins. The exact Nitro deployment preset must be selected and tested against the real hosting provider before production promotion.

## Environment

Use the hosting provider's encrypted environment/secret controls. Start from `.env.example`.

Never upload or commit a populated `.env`.

## Database

Apply only reviewed migrations from `supabase/migrations/`.

Do not reset the production database.

Before and after migrations, verify:

- RLS enabled on client data
- `client-deliverables` remains private
- membership helper permissions remain restricted
- service-role key is server-only

## Domain

The application expects:

- canonical origin: `https://drone-air.ca`
- public email: `info@drone-air.ca`

DNS/TLS configuration is provider-specific and must be verified at the actual deployment target.

## Email

Transactional email uses the Google Workspace/Gmail API with server-side OAuth refresh credentials. Configure `GOOGLE_GMAIL_CLIENT_ID`, `GOOGLE_GMAIL_CLIENT_SECRET`, `GOOGLE_GMAIL_REFRESH_TOKEN`, and `GMAIL_SENDER_EMAIL` in the deployment secret manager.

Production email is only **PRODUCTION VERIFIED** after a real message is successfully sent as `info@drone-air.ca` and received. Mission intake must remain successful even when notification email is unavailable.

Mission AI triage uses the Google Gemini API through `GEMINI_API_KEY` and degrades to human review if the provider is unavailable.

## Rollback

Keep the previous known-good deployment artifact or release available until post-release checks pass. A database migration requiring destructive rollback must not be introduced during a routine web release.

## Contabo / Coolify container deployment (prepared, not yet activated)

The repository includes a multi-stage `Dockerfile.coolify` running the generated TanStack Start / Nitro **Bun** server. A former Node image failed at startup with `ReferenceError: Bun is not defined` despite a successful build; runtime now matches the build adapter. Use the existing TAKATAK Contabo/Coolify infrastructure once a **DRONE AIR-specific app** and production environment have been verified.

1. Create a separate Coolify application linked to `takatakca/droneair` branch `main`. Build mode: Dockerfile `Dockerfile.coolify`; container port: `3000`.
2. Configure public **build-time** inputs `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. These become part of the browser bundle. Use actual project values, not CI placeholders; a production image must never use `example.supabase.co`.
3. Configure **runtime-only** secrets `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and optional Google/Gemini credentials in Coolify's secret manager. Never add them as Docker build arguments.
4. Wire the GitHub webhook to the DRONE AIR Coolify application so new validated `main` commits can trigger automatic deployments once approved; preserve the previous version for rollback.
5. Verify `GET /api/health` returns `{"status":"alive","service":"drone-air"}`. This is a liveness check **only**, not proof of database readiness.
6. Validate actual database/storage authorization and mission delivery using separate test clients, then verify domain DNS, reverse-proxy TLS, public pages and server logs before switching the production domain.

GitHub CI builds the Dockerfile using explicitly fake public parameters and **does not publish** that image or promote it to production. No real Coolify application, webhook, DNS, runtime secrets, migrations or production smoke test is configured by committing these files.

## Identity migration awaiting authorized Supabase access (2026-10-14)

After verifying the production project's identity and existing migration history, apply the **new, unapplied** migration `supabase/migrations/20261014180000_lock_profile_identity.sql` using the authorized deployment migration workflow. The file was prepared without a live Supabase connection; **it is not evidence that it has run**. The local Supabase CLI was unavailable during preparation.

This migration revokes broad profile UPDATE privileges, grants only name/language updates to authenticated clients, mirrors verified Auth email changes back to `profiles.email`, and prevents cross-user membership existence probing. Review the Auth trigger's implications for the current database version before applying; do not edit an already-applied migration or reset the database.

For read-only SQL post-migration verification in the *actual DRONE AIR project*:

```sql
select has_column_privilege('authenticated', 'public.profiles', 'email', 'UPDATE')
  as client_can_modify_profile_email;
-- Must be false.
select has_column_privilege('authenticated', 'public.profiles', 'first_name', 'UPDATE')
  as client_can_modify_name;
-- Must be true.
select id, public from storage.buckets
  where id in ('client-deliverables', 'mission-attachments');
-- Both buckets must exist and be private.
```

Additionally: test the Auth email-change trigger, authenticated user membership RPC for self versus other user, and private file operations with two independent client identities. Do not promote if any test fails.

## Validation after an authorized deployment

Record exact release SHA, target server, preview origin and current production origin in `docs/AGENT_HANDOFF.md`.

- `GET https://<preview-host>/api/health`: process liveness only, expected JSON service `drone-air`.
- Check French `/` and English `/en` and SEO canonical/hreflang on the actual served HTML.
- Submit a genuine test mission; verify its durable row and email event status in the connected database.
- Test admin uploads to a private bucket; verify unauthorized access denied for another client; signed links expire.
- Verify Coolify rollback release, origin DNS/TLS and configured Google email sender.
- Activate any auto-deploy hook only after the intended app is linked and secrets are provisioned; a green GitHub Docker build alone is not a live deployment.

## Reusable smoke check

The CI job builds the runtime image with mock **public** build arguments, then starts it using mock runtime values and executes:

```bash
node scripts/smoke-http.mjs http://127.0.0.1:18080
```

Once the real DRONE AIR preview is online, run the same **read-only** smoke check against its HTTPS origin. The script demands HTTP 200, matching DRONE AIR health JSON and HTML on both French and English homepages. A passing smoke check does **not** validate real database readiness, auth isolation, email delivery, or the deployed Git SHA.

## CI-gated Coolify deployment workflow (disabled until release approval)

`.github/workflows/deploy-coolify.yml` listens for the completion of `Drone Air CI` on `main` and only sends an authenticated **resource** deploy webhook after all of these conditions are true:

1. The upstream event was a `push` from this repository's current `main`, not an untrusted pull request, and CI concluded `success`.
2. The repository variable `DRONE_AIR_PRODUCTION_DEPLOY_ENABLED` is exactly `true`.
3. The validated SHA still equals GitHub's current `main` HEAD (stale CI runs are skipped).
4. A dedicated DRONE AIR Coolify resource exists, and these GitHub Actions secrets are provisioned: `DRONE_AIR_COOLIFY_WEBHOOK` and `DRONE_AIR_COOLIFY_TOKEN` (minimum `deploy` scope). Use a resource webhook for **only** DRONE AIR, not a multi-site tag.
5. The production GitHub environment and any required approvals have been configured and the real production security release gates already passed.

The workflow is disabled without the explicit variable. A successful webhook HTTP response means that Coolify accepted a request, **not** that the release became healthy or that its intended SHA is live. Check the Coolify deployment logs and real `/api/health` and public pages. If the resource is configured with its own GitHub push-based auto deploy, disable that separate push trigger to prevent unvalidated deployments.


## Deployed Git revision evidence (2026-10-15)

The Dockerfile accepts a **non-secret** build argument `DRONE_AIR_GIT_SHA`, expected to be the exact commit checked out by Coolify. The running `GET /api/health` response now includes `revision`: a 40-character Git SHA when configured, otherwise `null`. Do not treat `null` or a manually mistyped SHA as release evidence.

GitHub CI passes `GITHUB_SHA` as the Docker build argument and checks it with `DRONE_AIR_EXPECTED_SHA` in the HTTP smoke script. For Coolify production, configure this argument from the actual Git checkout SHA of **the dedicated DRONE AIR resource** (not the SHA of a parent build pipeline). Confirm the health response's `revision` equals the commit deployed, and independently inspect the Coolify build record. No release SHA verification is possible on production until that environment exists.


## CI evidence from 2026-10-15

The former Nitro/Node runtime error was fixed with the Bun runtime. GitHub Actions [38774629494](https://github.com/takatakca/droneair/actions/runs/38774629494) reports successful live container boot plus health and bilingual smoke. [38775210246](https://github.com/takatakca/droneair/actions/runs/38775210246) reports success with the Git revision assertion too. These are tests in an isolated CI container with explicitly fake Supabase values; they are **not** evidence of a real deployed application.


## Mission payload safety checks

The public `POST /api/public/mission-request` path enforces a total request-body limit before multipart parsing (10 MiB allowed attachment plus 512 KiB form overhead), including streamed requests without a trustworthy Content-Length. An oversize request responds HTTP 413; malformed/non-multipart input HTTP 400. The server checks actual PDF/JPEG/PNG/WebP file signature bytes, not just a client-provided MIME type, before uploading to private Storage. These safeguards do not replace infrastructure rate limiting, WAF filtering or real production integration testing.


Container CI now also attempts HTTP 413 oversized-multipart and HTTP 400 invalid-content-type checks on `/api/public/mission-request`. These deliberately run with mock Supabase credentials to verify rejection **before** any database access. Full mission intake persistence, messaging and email delivery still require the real authorized deployment.


## Latest verified CI checkpoints

- 38792341421: bounded form reader regression tests and running Docker app passed.
- 38792894836: application HTTP POST rejects oversized multipart with 413 and invalid JSON with 400 (fake CI database configuration).
- 38793107957: private file lifecycle regression tests and full Bun Docker CI passed.
- These results do not substitute for a real Supabase tenant isolation test or a verified production deploy.

## Server database read/mutation checks (2026-10-16)

Administrator query failures and absent exact counts cause errors rather than showing zeros. Single-record mutations request the affected row, which avoids a false confirmation when a record is missing or filtered. Mission-derived client/project creation checks that the source mission still exists. Verify under actual permission models in the authorized Supabase environment; CI uses fake credentials for container boot only.

Before release, exercise admin invitation twice for an account whose `client_memberships.membership_role` is not `member`: confirm the role does not change. New account linking still requires a canonical verified Auth email. Inspect two-client access after this path; a GitHub unit test alone does not prove database behavior.

## Database readiness endpoint (2026-10-16)

- `GET /api/health`: HTTP 200 if the application process can serve HTTP, regardless of database connectivity. Use for a container **liveness** probe; do not mistake this for ready-to-publish.
- `GET /api/ready`: HTTP 200 only after a bounded, read-only query on `public.clients` succeeds using the server-side Supabase connection; otherwise HTTP 503. Response includes only a generic `status` and `service`, never keys or raw DB errors. Query timeout is 4 seconds.
- CI uses fake Supabase inputs, so the runtime smoke test **expects 503** for readiness while `/api/health` remains 200. The two endpoints must differ in that environment.
- Before production promotion, verify `/api/ready` = 200 at the correct preview origin against the authorized existing database. A 200 is connectivity evidence, **not** proof of migrations, RLS, two-client isolation, private storage or email delivery. Avoid configuring an external platform to restart the application solely because the database is temporarily unavailable; prefer liveness for process restarts and readiness for deployment gates.

## Verified CI / readiness evidence — 2026-10-16

CI run [38852863989](https://github.com/takatakca/droneair/actions/runs/38852863989) successfully exercised `/api/health` (liveness HTTP 200) and `/api/ready` (HTTP 503 using CI's fake Supabase project). Admin server behavior tests and UI compilation passed CI 38852451732, 38852562996, 38852681875. None of these workflows establishes real database connectivity or a deployed origin. A dedicated production resource, key rotation, verified DNS/TLS and a positive readiness check with real credentials remain prerequisites.


### Gmail network outage behavior (2026-10-16)

OAuth token exchanges use a 5-second HTTP abort deadline and Gmail send requests use an 8-second deadline; each notification has at most two attempts. The request still waits for optional AI/email after storing the lead, so a high-latency AI+email combination can take longer than either single deadline. Before release, simulate Google provider timeouts using controlled preview conditions and ensure persistent mission storage, appropriate delivery failure status and no false email-success message. Delivery must be tested with authorized credentials, not CI placeholders.


### Automated post-Coolify proof (2026-10-16)

Configure the **protected production environment** variable `DRONE_AIR_PRODUCTION_ORIGIN=https://drone-air.ca` alongside the already documented DRONE AIR-only Coolify webhook/token and `DRONE_AIR_PRODUCTION_DEPLOY_ENABLED=true` **only after all release gates are met**. The workflow now refuses to send a webhook without the expected canonical origin and credentials. After a green CI and exact-main guard, it requests deployment and polls for:
- HTTPS `/api/health` reporting the exact validated SHA (supply `DRONE_AIR_GIT_SHA` as a non-secret Coolify Docker build argument);
- HTTPS `/api/ready` status `ready` (read-only DB query);
- HTTP 200 for `/` and `/en`.

The workflow fails if these are not proven within bounded retries; a successful webhook request is not completion. Live DB tenancy, email sender and rollback remain manual release gates. Production deployment remains disabled/unverified until authorized provider, DNS/TLS and Supabase permissions are available.


The private file download handler fails when a role lookup encounters a database error. For acceptance, verify that role-service outages cannot generate signed links and that a non-admin cannot download unpublished, archived, unverified, or another client's file. CI unit tests cover file-state predicates but not real database RLS or bucket policies.
