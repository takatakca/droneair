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
