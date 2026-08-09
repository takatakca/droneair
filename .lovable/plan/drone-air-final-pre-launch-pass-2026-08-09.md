# DRONE AIR — Final pre-launch pass

The hero stays exactly as it is. The section in your screenshot (eyebrow, headline, lead, both CTAs, telemetry rail, terrain background and waypoint animation) is frozen — no edits to `Hero.tsx`, its asset, or its animations.

Everything else in your prompt is accepted. Because this is a very large pass, it runs in four ordered stages so nothing working gets broken. Each stage ends in a build + browser check before the next starts.

## Stage 1 — Backend: client accounts, file cabinet, admin

Migrations (additive only; existing `mission_requests`, `mission_email_events` and `mission-attachments` untouched):

- `profiles` — name, email, preferred language, auto-created on signup
- `clients` — organization name, status
- `client_memberships` — client to user, membership role (schema supports multiple users per client)
- `user_roles` + `app_role` enum (`admin`, `client`) with a `has_role()` security-definer function; roles live only in this table and are never writable by the account holder
- `client_projects` — reference, location, service type, status, optional link to a mission request
- `client_files` — storage path, display name, original filename, mime, size, category, description, version, visible-to-client flag, published date
- `client_file_events` — uploaded / published / downloaded / replaced / archived
- Private `client-deliverables` bucket. Strict RLS: a client reads only its own profile, membership, projects and published files; admins operate through server-side checks.

Server functions:

- Signed upload permission for admins, then direct browser-to-storage upload, then server verification and metadata row creation. Paths are always `client-id/project-id/file-id.ext` — original filenames are metadata only.
- Client download: verify session, membership, file ownership, published state, then mint a short-lived signed URL (minutes) and log the download. No permanent URLs anywhere.
- Server-side MIME + extension allowlist (PDF, images incl. TIFF, CSV/XLSX, KML/KMZ, ZIP, MP4/MOV, and geo/point-cloud/3D types), executables rejected.

Auth: email/password with email verification, password reset, sign-out hygiene, all bilingual.

## Stage 2 — Routes

Public: `/`, `/solutions`, `/contact`, `/privacy`, `/terms` (+ English equivalents, Stage 4).
Account: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/client`, `/client/projects/$id`.
Protected: `/admin`, `/admin/clients`, `/admin/projects`, `/admin/missions`, `/admin/files` — never linked publicly, admin-gated server-side.

Client area: large-type project header, plain horizontal deliverable rows (name, type, size, date, one download action), honest empty state. Not a card dashboard.
Admin: efficient operational UI — select client, select project, upload, name/category/description/version, verify, then save private or publish; unpublish, replace, archive, associate a mission request to a client/project explicitly.

## Stage 3 — Public site pacing and craft (hero excluded)

- Typography moves off Chakra Petch to a neo-grotesk editorial system; monospace reserved for real data (coordinates, references, sizes, telemetry).
- Services: six genuinely different compositions instead of six alternating 50/50 rows — full-bleed with oversized numeral, dark map with route, 70%-viewport image with a measurement line crossing into text, before/after sequence, wide image with a narrow vertical column, capture-to-report transformation.
- Process becomes a scroll-driven mission sequence rather than a boxed timeline.
- New acts: a giant mission statement, a client-delivery act introducing the cabinet, and a full-bleed final CTA (`VOTRE TERRAIN. / NOTRE TRAJECTOIRE.`) replacing the stacked contact strip.
- Section rhythm deliberately varied: 100vh, 70vh, full-bleed, narrow, offset, sticky. Contact form integrated into the canvas, no card, all existing validation/attachment/anti-spam/rate-limit/status behaviour preserved.
- Header nearly disappears over content, solidifies on scroll; mobile menu gets Escape, focus trap, focus return, scroll restore. Mobile is art-directed separately at 320/375/430; wide screens at 1440/1920/2560.
- Footer becomes architectural with a large wordmark, plus Client Access.
- Bilingual DRONE AIR error experience replaces the generic English error box.
- Images get responsive derivatives (AVIF/WebP), correct dimensions, lazy loading below the fold; the 1 MB logo mark is optimized. Animations pause offscreen and when the tab is hidden, and respect reduced motion.
- Optional ~1.5s opening moment on first visit only, skipped for repeat visits and reduced motion, never blocking interactivity.

## Stage 4 — SEO, cleanup, QA

- French routes stay canonical at root; English at `/en/...`. hreflang `fr-CA`, `en-CA`, `x-default`, correct canonicals, updated sitemap and robots, LocalBusiness JSON-LD, absolute OG image. No invented reviews, hours or social accounts.
- Privacy updated for accounts, client files, notifications and AI-assisted intake classification — with an explicit statement that client files are not sent to AI models.
- README rewritten for the final project; repository swept for every obsolete brand string, old email, old domain and lovable.app URL. Unused generated UI components and dependencies removed after verifying they are genuinely unused.
- Security review against your list, then full QA: build, TypeScript, lint, console, every route logged-out / client / admin / unauthorized, cross-client file access denial, file cabinet lifecycle with test data (deleted afterwards), and a mission-form regression pass.

## Known blockers up front

- Email sending is still blocked until `drone-air.ca` is verified as a sending domain. Client "files are ready" notifications will be built and logged, but no real send can be proven until that is done. I will not report it as working.
- Nothing will be published; you get one factual report in your requested format.

## Technical notes

Additive migrations only; no resets, no deletion of real mission requests. Admin authorization uses a single server-side helper plus `has_role()`, never browser-supplied role data. The service-role client stays server-only, loaded inside handlers. Client downloads are authorized server-side, never by hiding rows in the UI.
