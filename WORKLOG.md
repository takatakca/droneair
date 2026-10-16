# Work log

Newest first, one line per piece of work. Rule: `AGENTS.md` › Work log rule.
Format: `YYYY-MM-DD | agent | branch → PR | status | what | next step`
- 2026-10-16 | ChatGPT | main | active | Add real DB readiness endpoint and negative CI check using dummy Supabase credentials | validate GitHub CI and update final handoff
- 2026-10-16 | ChatGPT | main | active | Catch admin file UI mutations, avoid double clicks, show actual read/action errors rather than empty states | validate CI and document results
- 2026-10-16 | ChatGPT | main | active | Preserve tenant membership roles on repeated admin invites; fail visibly on failed account search | verify CI and two-client staging after access
- 2026-10-16 | ChatGPT | main | active | Enforce accurate Supabase admin-ops reads, mutation existence checks, and mission source checks | verify CI, update handoff and real hosting blockers
- 2026-10-15 | ChatGPT | main | active | Make portal and admin Supabase query failures explicit rather than showing empty data | check CI, document release handoff
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
