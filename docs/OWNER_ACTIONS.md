# Owner actions — drone-air.ca

Updated 2026-10-29. Hands-on checklist for the hosting move (MochaHost → Coolify). The main file for all sites is in Google Drive › 00 — Opérations TAKATAK: “2026-10-29 — TAKATAK hosting (MochaHost → Coolify) — MAIN FILE — OWNER and CLAUDE actions”. Item numbers are the same everywhere. This repository is public: no secret values and no hosting-account details are written here, only key names, settings and steps; account-level steps are in the private Drive main file.

**Labels**

- 🔧 OWNER — you do it by hand (accounts, keys, payments, approvals, merges, WHM)
- 🤖 CLAUDE — the agent does it; usually waits for an OWNER item
- ✅ DONE — finished and verified

## Where this site runs

- Website: https://drone-air.ca (www redirects) — Coolify server vps2, project DRONE AIR, app `droneair`, auto-deploys `main`
- Supabase project: `ngdcmpywualyphgrutir`. The build still uses the CI **placeholder** Supabase values: data features do not work until O-06
- DNS zone: the old MochaHost account until O-13, then the main MochaHost account (copy prepared). Mail stays at MochaHost; info@drone-air.ca does not exist yet
- The release gates in docs/DEPLOYMENT.md still apply; this file is the hands-on checklist

## 🔧 OWNER — manual work

### O-01 · 🔧 OWNER · ⬜ TO DO — Merge the open pull requests
- ocarinaspa #3 (removes Lovable; it also contains #2, so #2 closes by itself)
- The notes/fix PRs opened on 2026-10-29: revers-canada-hope (header fix + notes), droneair (revision + health check + notes), mimtcaapp (notes), r2neet (notes)
- mimtcaapp #77 (from another agent: removes the old FTP uploads from the Deploy workflow)

### O-06 · 🔧 OWNER · ⬜ TO DO — Rotate the Supabase keys and enter the real values
- Old keys were in public GitHub history: Supabase → project ngdcmpywualyphgrutir → Project Settings → API Keys → create a new publishable key and a new secret key, then disable the legacy keys
- Where: Coolify → Projects → DRONE AIR → production → droneair → Environment Variables → + Add. Turn “Available at Buildtime” OFF except for keys starting with VITE_. Save all, then Restart (or Redeploy if a VITE_ key changed).
- VITE_SUPABASE_URL = https://ngdcmpywualyphgrutir.supabase.co (Buildtime ON, replaces the placeholder)
- VITE_SUPABASE_PUBLISHABLE_KEY = new publishable key (Buildtime ON)
- SUPABASE_URL (same URL), SUPABASE_PUBLISHABLE_KEY (same key), SUPABASE_SERVICE_ROLE_KEY (new secret key) — Buildtime OFF
- Then click Redeploy (not Restart)

### O-07 · 🔧 OWNER · ⬜ TO DO — Database migration and first admin
- Supabase → SQL Editor → run supabase/migrations/20261014180000_lock_profile_identity.sql from the droneair repo
- Create the first admin role the way docs/TASK_QUEUE.md (P0) describes
- *Waits on:* O-06

### O-08 · 🔧 OWNER · ❓ DECISION — Decide how drone-air sends email
- info@drone-air.ca does not exist anywhere today
- Option A: drone-air.ca has Google Workspace → enter GOOGLE_GMAIL_CLIENT_ID, GOOGLE_GMAIL_CLIENT_SECRET, GOOGLE_GMAIL_REFRESH_TOKEN, GMAIL_SENDER_EMAIL
- Option B: tell Claude to switch drone-air to Resend like ocarinaspa (C-06)
- Missions are saved either way; GEMINI_API_KEY is optional and can stay empty

### O-13 · 🔧 OWNER · ⬜ TO DO — Retire the old MochaHost account of this domain
- Only after this site works on Coolify; first download that account's backup
- The exact account, backup file and WHM steps are in the private Drive main file (item O-13)
- *Waits on:* each site working (O-02…O-11)

## 🤖 CLAUDE — agent work

### C-03 · 🤖 CLAUDE · ✅ DONE — Commit shown in /api/health on Coolify + Bun health check (PR opened 2026-10-29)
- “Include source commit in build” turned on for the droneair app; after the merge Claude checks /api/health shows the commit and the container is healthy (C-08)
- *Waits on:* O-01 (merge)

### C-06 · 🤖 CLAUDE · ⏳ WAITING — Switch drone-air email to Resend (code PR) if you choose option B
- *Waits on:* O-08

### C-08 · 🤖 CLAUDE · ⏳ WAITING — Test each site end to end after its keys are in
- Restart/redeploy, then forms, emails, Stripe test payment, /readyz; update the GitHub notes and this main file
- *Waits on:* O-02…O-11

### C-10 · 🤖 CLAUDE · ⏳ WAITING — After the old account is retired, check that DNS and mail are served by the main MochaHost account
- Compare the served zone with the prepared copy, re-save it if needed, then check the website and mail
- *Waits on:* O-13

### C-12 · 🤖 CLAUDE · 🔁 ONGOING — Keep the notes current
- docs/OWNER_ACTIONS.md in each repo and this main file

When you finish an OWNER item, tell the agent its number (for example “O-02 done”); the agent then does the CLAUDE items waiting on it and updates this file.
