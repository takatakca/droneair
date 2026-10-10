# DRONE AIR — TAKATAK integration status

Status date: 2026-10-10

## Current status

**BLOCKED — no approved DRONE AIR master contract was found in `takatakca/takatak-v1`.**

The master repository was inspected for DRONE AIR-specific identity, entitlement, registry and API contracts. No DRONE AIR-specific contract was found.

Therefore this repository does **not** invent or activate a TAKATAK integration.

## Current authority

DRONE AIR remains independently deployable and currently uses its local Supabase implementation for:

- account authentication
- client memberships
- admin roles
- mission requests
- client projects
- private deliverables
- download authorization

This local product authority must not be interpreted as a second global TAKATAK identity authority.

## TAKATAK patterns observed

The master repository contains product-specific integration patterns for other products, including signed server-to-server APIs, explicit product entitlements, master-identity references, HMAC signatures and product-specific release gates.

Those patterns are evidence of how integrations should be designed, **not permission to reuse another product's contract**.

## Required before enabling a DRONE AIR integration

1. Approved DRONE AIR product/integration identifier.
2. Versioned contract in TAKATAK V1.
3. Explicit scopes and data-purpose definition.
4. Identity/entitlement behavior.
5. Dedicated credentials/signing secret stored outside source control.
6. Webhook/replay/idempotency rules where applicable.
7. Staging tests.
8. Owner approval before any `takatak-v1` production change.

Until those exist, DRONE AIR must continue functioning safely without the master platform.
