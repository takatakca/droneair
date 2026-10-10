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

The application uses TanStack Start with Nitro. The current Vite setup still comes from `@lovable.dev/vite-tanstack-config`, which supplies the Nitro/Vite integration and defaults. Do not switch runtime presets during a production release without testing the target host.

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

The code currently uses a provider-specific email library and server-side API key. A configured key alone is not production verification.

Production email is only **PRODUCTION VERIFIED** after a real message is successfully sent from the approved DRONE AIR sender/domain and received.

Mission intake must remain successful even when notification email is unavailable.

## Rollback

Keep the previous known-good deployment artifact or release available until post-release checks pass. A database migration requiring destructive rollback must not be introduced during a routine web release.
