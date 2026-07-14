# Deploy Checklist — Phase 3 (SEO Foundation & Launch)

**Generated:** 2026-07-14
**Plan:** 03-07 (pre-deploy verification + HARD GATE per D-07)
**Status:** Automated checks complete. Blocked on Rasmus's manual steps below before any push/deploy.

---

## Automated checks

| # | Check | Command | Result |
|---|-------|---------|--------|
| 1 | REPLACE_ME scan | `grep -rn "REPLACE_ME" src/` | **BLOCKED** — 7 occurrences across 2 files (see below). Launch blocker per D-11 until Rasmus edits these himself. |
| 2 | Project screenshots decision | `ls public/projects/*.png` + check `image` fields in `src/content/projects.ts` | **BLOCKED (placeholder state)** — `public/projects/` does not exist; no real screenshots supplied. All 4 projects in `src/content/projects.ts` have their `image` field commented out. Cards will render the monogram token placeholder (plan 03-05 fallback) as-is. Requires Rasmus's explicit sign-off to ship with placeholders, or he supplies real screenshots + restores the `image` fields before deploy. |
| 3 | No broken image references | `grep -rn "src: '/projects/" src/content/projects.ts` | **PASS** — no active `image` fields reference any `/projects/*.png` path (all commented out); no dead references exist. |
| 4 | Env var hygiene | `grep -rn "NEXT_PUBLIC_" src/ next.config.mjs` | **PASS** — the only `NEXT_PUBLIC_` reference in the codebase is `NEXT_PUBLIC_SITE_URL`, used in `src/app/layout.tsx` (`metadataBase`) and `src/lib/site-config.ts` (`siteUrl`, consumed by `sitemap.ts` and `robots.ts`). No domain is hardcoded anywhere — `sitemap.ts` and `robots.ts` both build URLs from `siteConfig.siteUrl`. |
| 5 | Production build / Lighthouse gate | Reference plan 03-06 evidence | **PASS** — 03-06-SUMMARY.md confirms a real `next build && next start` production run with Lighthouse 90+ in all four categories (Performance, Accessibility, Best Practices, SEO), both mobile and desktop, across `/`, `/projects`, and a live blog post. Raw evidence: `.planning/phases/03-seo-foundation-launch/lighthouse/*.json` (6 files, all present on disk). Not re-run in this plan since evidence already exists. |
| 6 | No `output: 'export'` | `grep -n "output" next.config.mjs` | **PASS** — `next.config.mjs` has no `output` key; Next.js remains in default hybrid mode. Image Optimization API and Route Handlers (sitemap, robots, opengraph-image) remain available. |

### Outstanding blockers (verbatim)

**Check 1 — REPLACE_ME occurrences (7 total):**
```
src/content/projects.ts:27:    links: { code: 'https://github.com/REPLACE_ME/rasmusos' },
src/content/projects.ts:38:      code: 'https://github.com/REPLACE_ME/portfolio-tracker',
src/content/projects.ts:50:      code: 'https://github.com/REPLACE_ME/dojo-scheduler',
src/content/projects.ts:60:    links: { code: 'https://github.com/REPLACE_ME/devnotes-cli' },
src/lib/site-config.ts:20:    github: 'https://github.com/REPLACE_ME',
src/lib/site-config.ts:21:    linkedin: 'https://linkedin.com/in/REPLACE_ME',
src/lib/site-config.ts:22:    email: 'REPLACE_ME@example.com',
```

**Check 2 — project screenshots state:**
```
public/projects/ — does not exist (no real screenshots supplied)
src/content/projects.ts — all 4 `image` fields are commented out (rasmusos, portfolio-tracker, dojo-scheduler, devnotes-cli)
```
Cards currently render the monogram token placeholder built in plan 03-05. This is a real, working fallback (not broken) — it just needs Rasmus's explicit decision: ship as-is with placeholders, or supply real screenshots first.

---

## Rasmus's manual steps (HARD GATE — D-07)

Claude has **NOT** created any git remote, has **NOT** pushed anything, and has **NOT** run any `vercel` command. Nothing will be pushed or deployed until you give an explicit go signal. These are your steps to run yourself, in order:

1. **Resolve the REPLACE_ME blockers (D-11):**
   - `src/lib/site-config.ts` — replace `github`, `linkedin`, `email` under `social` with your real profile URLs / email.
   - `src/content/projects.ts` — replace the 4 `code` URLs (`REPLACE_ME/rasmusos`, `REPLACE_ME/portfolio-tracker`, `REPLACE_ME/dojo-scheduler`, `REPLACE_ME/devnotes-cli`) with your real GitHub repo URLs (or drop the `code` link entirely for any project without a public repo).

2. **Decide on project screenshots:**
   - Either supply real screenshots — add `public/projects/<slug>.png` for each project and uncomment/restore the corresponding `image: { src: '/projects/<slug>.png', alt: '...' }` field in `src/content/projects.ts` — or
   - Explicitly accept the monogram placeholder cards for launch (no code change needed; this is a valid, already-working state).

3. **Create a GitHub repo under your PERSONAL account and push:**
   - Create a new repo on your personal GitHub account (not an org).
   - Add it as the `origin` remote locally and push your local `main` branch.
   - (Claude will not do this step — D-07 hard gate.)

4. **Import the repo into Vercel:**
   - Vercel Dashboard → Add New → Project → import the GitHub repo.
   - Hobby tier (free).
   - Confirm the build uses Node 20+ (Tailwind v4's Lightning CSS engine requires it — default on new Vercel projects).

5. **Set the environment variable:**
   - In Vercel Project Settings → Environment Variables, add `NEXT_PUBLIC_SITE_URL` = `https://<your-chosen-subdomain>.vercel.app` (D-09 — you pick the subdomain when you connect the project; it is not decided in code).

6. **Deploy.**

7. **Post-deploy verification (do these once live):**
   - Check the OG preview using a social-preview debugger (e.g. Twitter Card Validator, LinkedIn Post Inspector, or opengraph.xyz) against your live URL — confirm the "Rasmus Hansen — Software Developer" OG image renders correctly.
   - Visit `https://<your-subdomain>.vercel.app/sitemap.xml` and `https://<your-subdomain>.vercel.app/robots.txt` directly and confirm both resolve with the correct live domain in every URL (not `localhost`).

---

## Summary

- 4 of 6 automated checks **PASS** (env var hygiene, no broken image refs, Lighthouse gate, no static export).
- 2 of 6 automated checks are **BLOCKED**, both by design (D-11) — REPLACE_ME placeholders and the project-screenshot decision are explicitly Rasmus's to resolve, not Claude's.
- Nothing has been pushed to any remote. Nothing has been deployed. No `vercel` command has been run. The HARD GATE (D-07) holds until Rasmus gives an explicit go signal.
