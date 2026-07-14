---
phase: 03-seo-foundation-launch
plan: 06
subsystem: performance
tags: [lighthouse, next-image, core-web-vitals, seo, next.js]

# Dependency graph
requires:
  - phase: 03-seo-foundation-launch (Wave 1: plans 03-01..03-05)
    provides: metadata wiring, OG image/sitemap/robots routes, favicon set, images.formats/qualities allow-list, hero LCP tuning, project-card 400 fix
provides:
  - Measured, captured Lighthouse evidence (mobile + desktop JSON reports) proving SEO-04 / D-13 for the production build
  - Confirmation that sitemap.xml, robots.txt, and opengraph-image are actually served (200) from the production build, not just present in source
  - Confirmation the /projects 400 image errors are gone under a real Lighthouse audit (errors-in-console score 1)
affects: [03-07 (pre-deploy checkpoint), deployment readiness]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Lighthouse gate measured against `next build && next start` (production), never `next dev`"
    - "Gate verification via a small Node script reading each captured Lighthouse JSON's `categories.*.score`"

key-files:
  created:
    - .planning/phases/03-seo-foundation-launch/lighthouse/home-mobile.json
    - .planning/phases/03-seo-foundation-launch/lighthouse/home-desktop.json
    - .planning/phases/03-seo-foundation-launch/lighthouse/projects-mobile.json
    - .planning/phases/03-seo-foundation-launch/lighthouse/projects-desktop.json
    - .planning/phases/03-seo-foundation-launch/lighthouse/blog-post-mobile.json
    - .planning/phases/03-seo-foundation-launch/lighthouse/blog-post-desktop.json
  modified: []

key-decisions:
  - "Gate passed on the first measurement (all six reports, all four categories >=90) — no hero quality tuning (Task 2's contingency path) was needed, so next.config.mjs and src/app/(site)/page.tsx were left unchanged."
  - "favicon.ico (~285KB, flagged by the orchestrator as a possible follow-up) is confirmed NOT fetched during page load in the Lighthouse network-requests trace (modern browser path uses icon.svg instead) — no slimming action taken since it doesn't affect Lighthouse or real page-load bytes."

patterns-established:
  - "D-13 evidence lives under .planning/phases/03-seo-foundation-launch/lighthouse/ as raw Lighthouse JSON, one file per route x form-factor"

requirements-completed: [SEO-04]

# Metrics
duration: 10min
completed: 2026-07-14
---

# Phase 3 Plan 06: Production Lighthouse Gate Verification Summary

**Measured Lighthouse 90+ in all four categories on both mobile and desktop for `/`, `/projects`, and a real blog post against the actual production build — gate passed on the first measurement, no hero quality tuning needed.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-07-14T10:03:00Z (approx.)
- **Completed:** 2026-07-14T10:12:54Z
- **Tasks:** 2 (Task 2 required no code changes — gate passed immediately)
- **Files modified:** 0 code files; 6 new evidence JSON files

## Accomplishments
- Ran a real production build (`NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build`) and served it locally (`next start` on port 3100) — confirmed this is the same build shape that will deploy.
- Captured Lighthouse mobile + desktop reports for the three key routes (home, projects, one real blog post — `why-i-write-code-toward-japan`), all six reports scoring ≥90 in all four categories on the first pass.
- Confirmed `/sitemap.xml`, `/robots.txt`, and `/opengraph-image` are actually served (200, correct content-type) by the running production build, not merely present as source files. Confirmed the served sitemap contains only the 3 published (non-draft) posts.
- Confirmed the `/projects` route's `errors-in-console` audit scores 1 (no 400s) under a real Lighthouse run — the plan 03-05 missing-project-image fix holds up under measurement, not just visual inspection.
- Confirmed the LCP element on `/` is the hero `Background.jpg` (`fill` image, matches the research's Pitfall 5 expectation), and captured served hero image bytes at multiple Accept-header negotiations.

## Task Commits

Each task was committed atomically:

1. **Task 1: Production build + serve, capture Lighthouse mobile+desktop on key routes** - `53c8ddb` (chore)
2. **Task 2: Enforce the 90+ gate; tune hero quality if mobile Performance < 90** - no commit (no files changed — gate passed on first measurement, contingency path in the plan not triggered)

**Plan metadata:** (pending — final docs commit follows this SUMMARY)

## Files Created/Modified

- `.planning/phases/03-seo-foundation-launch/lighthouse/home-mobile.json` - Lighthouse mobile report for `/`
- `.planning/phases/03-seo-foundation-launch/lighthouse/home-desktop.json` - Lighthouse desktop report for `/`
- `.planning/phases/03-seo-foundation-launch/lighthouse/projects-mobile.json` - Lighthouse mobile report for `/projects`
- `.planning/phases/03-seo-foundation-launch/lighthouse/projects-desktop.json` - Lighthouse desktop report for `/projects`
- `.planning/phases/03-seo-foundation-launch/lighthouse/blog-post-mobile.json` - Lighthouse mobile report for `/blog/why-i-write-code-toward-japan`
- `.planning/phases/03-seo-foundation-launch/lighthouse/blog-post-desktop.json` - Lighthouse desktop report for `/blog/why-i-write-code-toward-japan`

## D-13 Gate Evidence (final scores)

| Route | Form factor | Performance | Accessibility | Best Practices | SEO |
|-------|-------------|-------------|----------------|-----------------|-----|
| `/` | mobile | 90 | 96 | 100 | 100 |
| `/` | desktop | 99 | 96 | 100 | 100 |
| `/projects` | mobile | 95 | 93 | 100 | 100 |
| `/projects` | desktop | 100 | 93 | 100 | 100 |
| `/blog/why-i-write-code-toward-japan` | mobile | 96 | 100 | 100 | 100 |
| `/blog/why-i-write-code-toward-japan` | desktop | 100 | 100 | 100 | 100 |

Gate script (`node -e "..."` over `categories.*.score`) exits with `GATE PASS — all categories >=90 on all captured reports` for all 6 files.

**Hero image (`Background.jpg`) — no quality change needed, kept at `quality={70}` (unchanged from Wave 1 plan 03-04):**
- Served bytes at `w=1920&q=70`, negotiated by `Accept` header:
  - `Accept: */*` (no modern-format support) → JPEG fallback, 214,850 bytes
  - `Accept: image/webp,*/*` → WebP, 200,228 bytes
  - `Accept: image/avif,image/webp,*/*` (typical modern browser) → AVIF, 173,192 bytes
- LCP element confirmed via the `lcp-discovery-insight` audit's node details: `body > main > section.relative > img.object-cover` — the hero background, not the portrait, consistent with research Pitfall 5's expectation. No further `priority` changes were needed since Performance already clears 90 on both form factors.
- Served artifacts confirmed 200: `/sitemap.xml`, `/robots.txt`, `/opengraph-image` (content-type `image/png`).

## Decisions Made

- **No hero quality tuning performed.** The plan's Task 2 contingency (`quality={65}` then `quality={55}` step-down) only triggers if mobile Performance < 90; the first measurement already cleared 90 (mobile Performance 90/95/96 across the three routes), so `next.config.mjs` and `src/app/(site)/page.tsx` were left exactly as Wave 1 left them. This keeps the visually-approved hero artwork at its current fidelity (D-12's "visually indistinguishable" bar), per the plan's explicit "if ALL categories are ≥90 → make no code changes" instruction.
- **favicon.ico left as-is.** The orchestrator flagged the ~285KB multi-resolution `favicon.ico` as a possible minor deviation if it showed up being fetched on page load. The Lighthouse `network-requests` audit for `/` (home-mobile) confirms only `icon.svg` (686 bytes) is fetched during page load — `favicon.ico` is not requested by the browser in this trace, so it has zero impact on Lighthouse scores or real page weight. No change made; documented here as a verified non-issue rather than silently ignored.

## Deviations from Plan

None - plan executed exactly as written. Task 2's contingency path (hero quality step-down) was available but not triggered because the gate passed on the first measurement pass.

## Issues Encountered

None. The production build, server startup, and all six Lighthouse runs completed cleanly on the first attempt.

## User Setup Required

None - no external service configuration required. This plan is pure local measurement/verification; no deployment or third-party services were touched (per HARD GATE D-07, no git remote/Vercel work occurs in this plan).

## Next Phase Readiness

- SEO-04 is fully verified: D-13's Lighthouse 90+ bar is met on both mobile and desktop, across all four categories, for the three key routes, against the real production build.
- All Wave 1 SEO artifacts (sitemap, robots, OG image, favicon, metadata) are confirmed to actually work end-to-end under a production server, not just present in source.
- No blockers for 03-07 (pre-deploy checkpoint / REPLACE_ME verification / user go-ahead for deployment).

## Self-Check: PASSED

All 6 claimed Lighthouse JSON files confirmed present on disk; commit `53c8ddb` confirmed present in git log.

---
*Phase: 03-seo-foundation-launch*
*Completed: 2026-07-14*
