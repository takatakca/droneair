# DRONE AIR — Engineering decisions

Decisions are dated and bounded by observed evidence. An open question is not an approval.

## 2026-10-10 — Independent product and GitHub authority

DRONE AIR has its own product identity, public domain `https://drone-air.ca`, admin portal and client data. GitHub `takatakca/droneair` is the source of truth; do not resurrect Lovable build/runtime dependencies. GROUPE TAKATAK is a master identity concept, but no approved DRONE AIR-specific contract was found, so no speculative master integration is to be coded.

## 2026-10-14 — Security and tenancy

Only verified Supabase Auth identities may be linked to client memberships. Role checks, cross-client membership checks and private signed URL creation remain server-side. A new migration locks `profiles.email` client updates and constrains identity-probing through the membership RPC; production application of that migration remains pending. `auth.users` email is canonical.

## 2026-10-14 — Mission intake reliability

Validated lead persistence in the designated Supabase project is the source of truth. AI classification and email are optional side effects and must not cause a saved mission request to be lost. Throttle suspicious submissions, fail closed when rate-limit checks cannot be performed, avoid revealing previous lead IDs and clean orphan attachments on insert failure.

## 2026-10-14 — Self-hosting packaging is not deployment approval

The GitHub CI creates a Nitro/Node Coolify-compatible container image with **fake** public build variables, only as a build check. No publicly accessible preview or production service was verified. Production must use the actual environment's public build parameters and runtime server secrets, meet all release gates and retain rollback evidence. The final host/service selection is not established by a Dockerfile.

## Pending — DRONE AIR / TAKATAK Auth integration

Do not assume shared auth claims, API namespaces, scopes or tenant resolution. A reviewed versioned contract and least-privilege integration tests are required before any TAKATAK master authority is delegated or enabled.


## 2026-10-15 — Match the actual Nitro runtime

GitHub Actions runs 38614070184 and 38614445582 built Docker successfully but failed at HTTP smoke because Nitro's generated `BunServer` was started under Node. Keep the compiled output intact and change the final image to Bun rather than pretending it is a Node application. Both the `start` script and Docker CMD now use Bun. This decision is subject to a passing live container smoke test; do not claim success merely because the Docker image builds.


## 2026-10-15 — Release revisions are observable, not guessed

Container builds can pass `DRONE_AIR_GIT_SHA` as non-sensitive build metadata. The health API returns that value only when it looks like an exact SHA, and the CI smoke test demands the repository SHA. A live release must still be checked against the Coolify deployment record, domain and healthy response.


## 2026-10-15 — Limit untrusted mission request bytes before multipart parsing

Reject public mission multipart payloads larger than a 10 MiB attachment plus 512 KiB overhead. Enforce the limit during streaming as Content-Length can be absent or inaccurate. Browser-declared PDF/JPEG/PNG/WebP MIME types must agree with file signatures before private Storage upload. Preserve existing mission data persistence independent of email/AI. No schema or externally hosted service is changed by this work.


## 2026-10-15 — No false success in private file lifecycle

Admin file replacement must first validate that the old and new files belong to the same client and project. After object verification, the old file must actually be archived before returning a successful replacement. File archive/unarchive must confirm a row was updated, not rely on the absence of a PostgREST error. If creating a signed upload URL fails, remove the tentative client_file row to avoid a phantom upload. These server-authorized changes must be verified against a real two-client staging setup before production.


## 2026-10-15 — Database outages must not look like empty client data

Tenant portal and admin views must surface Supabase query errors instead of treating failed requests as empty result sets. A real empty result is valid when the database query succeeds. This avoids misleading clients about lost files/projects and prevents administrators from relying on incomplete operational dashboards. Tests against the real database are still blocked by permissions.

## 2026-10-16 — Admin operations must report actual effects

Database reads in the administrator operation layer no longer treat a failed response or missing exact count as an empty dataset/zero. Mutating an identified row must use PostgREST `.select("id").maybeSingle()` and reject updates/deletes that matched nothing. Opening a client/project from a mission first verifies that the mission exists. These controls are server-side; a successful CI build does not replace two-client database staging tests.

## 2026-10-16 — Repeat admin invitations are non-destructive

An admin linking an existing verified identity to the same client must not reset the member's existing `membership_role`. The Supabase PostgREST upsert therefore sets `ignoreDuplicates: true` with the client/user conflict key. This preserves tenant authorization while allowing the operation to be repeated safely. Errors querying profiles are surfaced rather than treated as missing accounts.

## 2026-10-16 — Administrative file actions must report failures in the interface

The administrator file page now wraps metadata/visibility/archive writes in a guarded async operation, prevents accidental double submission, and exposes failures in both French and English. Query errors for file lists and history are not mistaken for empty data. Server-side authorization remains the source of truth; this is UI correctness, not new permission logic.

## 2026-10-16 — Separate process liveness from database readiness

The public `/api/health` endpoint reports process liveness and build revision. The new `/api/ready` endpoint performs a bounded head-only query of `clients` using server credentials and returns HTTP 503 when data access fails. No details about connection errors are exposed publicly. CI with fake Supabase values must not report ready. This does not authorize switching traffic before tenant-isolation and release checks pass.


## 2026-10-16 — Bound optional Gmail requests

The mission lead is stored before optional Gmail notifications. OAuth token exchange and Gmail send HTTP calls must respect finite deadlines (5 and 8 seconds respectively) so a stalled external provider cannot hold the HTTP request indefinitely. Retry behavior remains bounded (at most two attempts) and delivery failure remains recorded as failure rather than a success claim. The change does not configure or verify Gmail sender credentials.


## 2026-10-16 — A Coolify webhook acknowledgment is not a deployment

The gated post-CI workflow remains disabled unless an owner-controlled GitHub variable explicitly enables it. Once enabled, it now **fails** if the approved HTTPS production origin (`https://drone-air.ca`) is missing or if Coolify credentials are missing/malformed; this check happens before any webhook request. After Coolify accepts the request it polls live health revision, database readiness and bilingual public routes. An unverified release fails the GitHub job. This still does not waive privileged DB migration review, two-client RLS, email or rollback acceptance.


## 2026-10-16 — Fail closed on private file authorization infrastructure errors

A role lookup error during a signed client-file download is not equivalent to "the user is not an administrator." The server now explicitly refuses download issuance when the role query fails. Non-admins must still pass verified-published-not-archived checks and an independent client membership lookup before receiving short-lived private links. Pure tests assert the file-state predicate; real cross-tenant access tests remain a release gate.


## 2026-10-16 — Latest verification is CI evidence, not release approval

GitHub runs 38953188965, 38953413909 and 38953654188 all passed after the provider, gated deploy and signed download changes. The production deployment workflow was explicitly skipped, and public domain/health/ready could not be verified using available external access. These results are technical source/build checks only, not proof of tenant isolation, database migration, email sender or production release.
