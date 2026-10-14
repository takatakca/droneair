# Work log

Newest first, one line per piece of work. Rule: `AGENTS.md` › Work log rule.
Format: `YYYY-MM-DD | agent | branch → PR | status | what | next step`
- 2026-10-14 | ChatGPT | main | active | Start CI container after build and smoke-test health and bilingual pages | inspect GitHub Actions result, fix any failing container startup
- 2026-10-14 | ChatGPT | main | done (validation successful, container build pending) | Lock profile email grants, rate-check suspicious missions, conceal duplicate IDs, clean orphan attachments; UUID upload paths; add regression tests | apply migration on authorized Supabase and complete release gates in issue #2
- 2026-10-14 | ChatGPT | main | done | Added reproducible Nitro container recipe and health endpoint for Coolify, plus container build validation | configure real Coolify app, build-time public values, runtime secrets and DNS only after release gates
- 2026-10-14 | ChatGPT | main | done (CI succeeded) | Enforce verified Auth email before admin links client accounts; verify real upload size; deny publish of archived files; add regression tests | check CI, then finish external Supabase/hosting release gates
- 2026-10-10 | codex | codex/final-production-2026-10-10 → PR #1 | done (merged 2026-10-14) | Admin, client deliverables, bilingual routes, GitHub-first foundation | external environment gates remain

- 2026-10-08 | claude (owner setup) | default branch | done | Added the work log rule, this log and the stop reminder | every agent follows AGENTS.md › Work log rule
