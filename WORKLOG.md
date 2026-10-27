# Work log

Newest first, one line per piece of work. Rule: `AGENTS.md` › Work log rule.
Format: `YYYY-MM-DD | agent | branch → PR | status | what | next step`
- 2026-10-27 | Claude | claude/domain-on-coolify → PR | active | drone-air.ca switched to Coolify (app renamed droneair), placeholder Supabase; HTTPS health + /en OK; mail unchanged | owner sets real VITE_/runtime values, rebuild, smoke-http.mjs on https://drone-air.ca, P0 DB gates
- 2026-10-26 | Claude | claude/coolify-preview → PR #3 | done: merged 776fc3f | Coolify preview `droneair-preview` (vps2) auto-builds main with CI placeholders; f651597 passes smoke-http.mjs; drone-air.ca unchanged | owner: real public values + runtime secrets after rotation, P0 DB gates, then switch website A records only
- 2026-10-16 | ChatGPT | main | done (CI PASS 38953654188) | Fail closed on signed download admin role lookup failures; test private file-state rules | complete two-client RLS and signed URL acceptance on authorized DB
- 2026-10-16 | ChatGPT | main | done (CI PASS 38953413909, gated CD skipped) | Require canonical production origin before webhook; verify actual deployed SHA, readiness and bilingual routes before reporting CD success | configure only after security gates and authorized Coolify resource
- 2026-10-16 | ChatGPT | main | done (CI PASS 38953188965) | Add 5-second OAuth and 8-second Gmail HTTP deadlines with regression tests | verify real OAuth sender and mission flow in authorized preview
- 2026-10-16 | ChatGPT | main | done (CI 38852863989 PASS) | Implemented database readiness endpoint and checked fake Supabase returns HTTP 503 | next: test readiness 200 on authorized production-like preview
- 2026-10-16 | ChatGPT | main | done (CI 38852681875 PASS) | Admin file UI now handles mutation/query errors and duplicate clicks | next: exercise actual authorized staging UI
- 2026-10-16 | ChatGPT | main | done (CI 38852562996 PASS) | Preserve existing membership role on repeated invitations; fail visibly on lookup errors | next: real role-preservation test in staging
- 2026-10-16 | ChatGPT | main | done (CI 38852451732 PASS) | Admin-ops fail on query errors, phantom mutations and missing mission sources | next: live authorized Supabase acceptance
- 2026-10-15 | ChatGPT | main | done (CI 38793570682 PASS) | Portal/admin database query failures now surface instead of rendering empty states | next: validate real outage scenarios in staging
- 2026-10-15 | ChatGPT | main | done (CI PASS run 38793107957) | Validate replacement before upload verification; ensure archived rows updated; cleanup failed upload tickets | stage-test with real Supabase project and separate clients when authorized
- 2026-10-15 | ChatGPT | main | done (CI PASS run 38792894836) | Proved HTTP 413 for oversized multipart and 400 for non-multipart on running Bun container | real mission persistence still requires Supabase access
- 2026-10-15 | ChatGPT | main | done (CI PASS run 38792341421) | Bound public mission multipart bodies and check PDF/image byte signatures; fixed strict TS ArrayBuffer error | add live-container HTTP 400/413 checks and verify their CI
- 2026-10-15 | ChatGPT | main | done (CI PASS run 38775210246) | Add public image Git SHA to health and assert CI image revision | complete remaining Supabase and dedicated Coolify production release gates
- 2026-10-15 | ChatGPT | main | done (CI PASS run 38774629494) | Fix real CI failure: Nitro Bun server launched under Node; switch Coolify runtime to Bun | confirmed live CI container health and bilingual routes
- 2026-10-14 | ChatGPT | main | done (CD disabled pending secrets/gates) | Add post-CI deploy webhook with stale-SHA check and explicit opt-in | verify workflow syntax, configure dedicated DRONE AIR provider only after security gates
- 2026-10-14 | ChatGPT | main | done (CI PASS 2026-10-15) | Start CI container and smoke-test health and bilingual routes; fixed Node/Bun crash | CI runs 38774629494, 38775210246 and 38775537222 succeeded
- 2026-10-14 | ChatGPT | main | done (validation successful, container build pending) | Lock profile email grants, rate-check suspicious missions, conceal duplicate IDs, clean orphan attachments; UUID upload paths; add regression tests | apply migration on authorized Supabase and complete release gates in issue #2
- 2026-10-14 | ChatGPT | main | done | Added reproducible Nitro container recipe and health endpoint for Coolify, plus container build validation | configure real Coolify app, build-time public values, runtime secrets and DNS only after release gates
- 2026-10-14 | ChatGPT | main | done (CI succeeded) | Enforce verified Auth email before admin links client accounts; verify real upload size; deny publish of archived files; add regression tests | check CI, then finish external Supabase/hosting release gates
- 2026-10-10 | codex | codex/final-production-2026-10-10 → PR #1 | done (merged 2026-10-14) | Admin, client deliverables, bilingual routes, GitHub-first foundation | external environment gates remain

- 2026-10-08 | claude (owner setup) | default branch | done | Added the work log rule, this log and the stop reminder | every agent follows AGENTS.md › Work log rule
