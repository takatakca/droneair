# DRONE AIR agent handoff

## 2026-10-10 — Codex final-production pass

Branch: `codex/final-production-2026-10-10`

Scope:

- continued from the client-portal foundation already merged to `main`
- did not redo stale branches with no active PR
- completed admin UI work against existing server functions
- added client project detail and refined client file-cabinet presentation
- completed indexable English public routes and bilingual SEO wiring
- hardened cross-client project/file association checks
- added GitHub CI
- removed tracked runtime `.env` from the working branch and added a safe template
- documented TAKATAK integration status instead of inventing a master API

Important production blocker:

A populated `.env` was historically committed to this public repository. Secrets from that file must be rotated before production, even after the file is removed from HEAD.

TAKATAK master status:

No DRONE AIR-specific contract was found in `takatakca/takatak-v1`; integration remains intentionally disabled until an approved contract exists.

Continue by reviewing the PR checks, resolving any CI findings, identifying the real deployment target, applying reviewed migrations, configuring rotated secrets, then performing staging/production verification.
