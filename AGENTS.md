# DRONE AIR — Agent instructions

## Source of truth

GitHub repository `takatakca/droneair` is the development source of truth.

Do not depend on Lovable project sync, editor state, generated prompts, or Lovable-only runtime services. Preserve published Git history: no force-push, no rewriting shared commits, and no silent replacement of another agent's work.

## Work log rule

1. Before starting, read the top of `WORKLOG.md`, active branches, and open pull requests.
2. Continue an active implementation when it already owns the same scope; do not duplicate it.
3. Claim new work with one line near the top of `WORKLOG.md`.
4. Before stopping, update that line with the real status and next step.
5. Open a pull request after validated changes; do not silently merge unreviewed work.

Line format:

`YYYY-MM-DD | agent | branch → PR | status | what | next step`

## Product boundary

DRONE AIR is an independent client application.

- Company: DRONE AIR
- Domain: https://drone-air.ca
- Email: info@drone-air.ca
- Phone: (514) 448-2825

Do not modify `takatakca/takatak-v1` merely because DRONE AIR belongs to the TAKATAK ecosystem. A TAKATAK integration requires an explicit, versioned, approved contract. Never invent endpoints or permissions.

## Engineering rules

- Preserve working business workflows.
- Use additive database migrations.
- Enforce tenant/admin authorization server-side.
- Never expose service-role keys or OAuth secrets to the browser.
- Client deliverables stay private and use short-lived signed downloads.
- Mission storage succeeds independently of optional email/AI providers.
- French is the default public language; English is indexable under `/en`.
- Never claim production verification without evidence.
- No production deployment until release gates in `docs/DEPLOYMENT.md` are satisfied.

## Visual standard

The public site is DRONE AIR, not TAKATAK. Use the approved DRONE AIR identity: black/graphite, restrained metallic silver/gold, waypoint blue, high-quality aerial imagery, editorial aerospace composition. Avoid generic AI/SaaS/WordPress template patterns.

Admin interfaces should be practical and secure. Client delivery should be premium, simple, and private.
