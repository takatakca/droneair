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
