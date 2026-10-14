# DRONE AIR security verification

## Implementation completed 2026-10-14

- Admin-created client memberships now compare the requested email against the canonical Supabase Auth email, and require the Auth email to be verified. A mutable `profiles.email` field is never sufficient.
- Admin account lookup uses the same canonical verification.
- A signed upload can only be confirmed when Supabase Storage reports a valid actual byte size within `MAX_UPLOAD_BYTES`. Database write failures no longer count as successful confirmation.
- Publishing/unpublishing a file requires an existing, verified and unarchived record; no success event is written for a zero-row update.
- Regression tests are triggered on GitHub CI.

## Release gate still outstanding

These code changes are not proof of production database policies. Before release, audit and restrict client-side `UPDATE` grants on `public.profiles` (particularly `email`) in the actual DRONE AIR Supabase project. Verify the existing RLS, private bucket, first admin provisioning, two-client isolation, upload/download permissions and revocation with live test users.

Never paste credentials into this repository. Rotate historical committed environment values before production deployment.
