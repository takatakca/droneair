# KLEAN — Note déploiement drone-air.ca — 2026-10-29

Note AVANT / PENDANT / APRÈS, signée KLEAN. Version complète dans Google Drive, dossier « 00 — Opérations TAKATAK » : « KLEAN — Déploiement 3/10 : reverscanada.ca + drone-air.ca — 2026-10-29 ». Aucun secret dans ce document.

## AVANT
- Main : 6c86b72. Cible Coolify déclarée : app `droneair`, vps2, domaine drone-air.ca, mail chez MochaHost. Health : /api/health (revision SHA) et /api/ready.
- PR ouvertes : #5 (health + revision), #6 (email Resend), #7 (health + revision + OWNER_ACTIONS). Issue #2 ouverte (gates : Supabase, auto-déploiement Coolify, DNS/TLS, sécurité).
- Blocage GitHub 429 vers 17:16 EDT : pause stricte, aucune rafale, levé après ~120 s.

## PENDANT (autorisation client 17:14 EDT : merger les PR prêtes, repos clients)
- #7 vérifiée fichier par fichier (9 fichiers) ; 4 checks success (validate ×2, Coolify container build ×2), mergeable clean → MERGÉE, main e6779a0.
- #5 vérifiée (8 fichiers = sous-ensemble exact de #7 sauf OWNER_ACTIONS.md) → fermée comme remplacée par #7.
- #6 vérifiée (7 fichiers, code disjoint de #7 mais 3 docs en commun) → NON MERGÉE, blocage exact : la mise à jour de branche vers main après #7 a échoué avec « merge conflict between base and head ». #6 reste OUVERTE : résoudre le conflit docs (rebase ou nouvelle branche), re-vérifier CI, puis merger. Commentaire de blocage déposé sur #6.

## APRÈS — état en ligne avec preuve (17:41 EDT)
- https://drone-air.ca/api/health : {"status":"alive","service":"drone-air","revision":"e6779a04c9e33b8468d29acbea8727bb49951f85"} — la revision servie = le nouveau main. Auto-déploiement Coolify EFFECTIF (prouvé par health, pas par le panneau Coolify, auquel KLEAN n'a pas accès).
- /api/ready : HTTP 503 observé — cohérent avec l'accès Supabase en attente, pas un échec de déploiement.

## Checklist propriétaire restante
1. Résoudre le conflit docs de #6, re-vérifier CI, merger #6.
2. Resend : domaine drone-air.ca, DKIM TXT resend._domainkey + MX/SPF TXT sur `send` (MX apex MochaHost inchangé).
3. Coolify (app droneair) : RESEND_API_KEY en variable runtime-only, redémarrage.
4. Mission test : provider = resend, status = sent dans mission_email_events.
5. Accès Supabase, migrations, /api/ready = 200, DNS/TLS ; issue #2 reste ouverte.

Signé : KLEAN — agent déploiement 3/10, 2026-10-29.
