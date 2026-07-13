---
phase: 01-core-site-design-system
plan: 03
subsystem: ui
tags: [nextjs, projects, cards, homepage-teaser, typescript]

# Dependency graph
requires: [01-01]
provides:
  - "src/content/projects.ts: typed static project data (single source of truth, PROJ-01)"
  - "src/components/ui/Tag.tsx: neutral-surface tech-stack tag primitive"
  - "src/components/ui/Card.tsx: project card primitive (title, summary, tags, demo/code links)"
  - "/projects route: full curated project grid"
  - "Homepage featured-projects teaser (D-07), completing CORE-01 homepage structure"
affects: [01-04-about-contact-404, 01-05-checkpoint]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Typed static data (src/content/projects.ts) as single source feeding both /projects and the homepage teaser — no MDX/Velite in Phase 1"
    - "Card primitive composes Tag + Button; Button auto-adds rel=noopener noreferrer on external target=_blank links (T-03-01)"
    - "Card hover micro-interaction (scale + shadow) via Tailwind transition-transform, neutralized under prefers-reduced-motion by the existing global CSS rule"

key-files:
  created:
    - src/content/projects.ts
    - src/components/ui/Card.tsx
    - src/components/ui/Tag.tsx
    - src/app/(site)/projects/page.tsx
  modified:
    - src/app/(site)/page.tsx

key-decisions:
  - "Curated 4 placeholder projects (within the 3-5 range) covering this site itself, a SaaS-style tool, an investing dashboard, and an open-source CLI — realistic content Rasmus can edit later, matching the PATTERNS.md canonical shape"
  - "Project image paths (/projects/*.png) are placeholder references only — no image asset files were generated for this plan (unlike hero.jpg in 01-01, this plan's frontmatter has no user_setup asset requirement); next/image renders correctly at build time regardless since local string src paths are resolved at request time, not build time"

requirements-completed: [PROJ-01, CORE-01, DSGN-01]

# Metrics
duration: ~12min
completed: 2026-07-13
---

# Phase 1 Plan 3: Projects Showcase & Homepage Teaser Summary

**Typed `content/projects.ts` data layer plus `Card`/`Tag` primitives power both the `/projects` index and a new homepage featured-projects teaser, completing the homepage per D-07.**

## Performance

- **Duration:** ~12 min
- **Completed:** 2026-07-13T07:32:00Z
- **Tasks:** 2/2 completed
- **Files modified:** 5 (4 created, 1 modified)

## Accomplishments
- `src/content/projects.ts` exports `Project` type and `projects` array with 4 curated entries (title, summary, tags, demo/code links, image) — no parsing library, no MDX/Velite
- `Tag.tsx` renders tech-stack tags on the neutral `bg-secondary`/`dark:bg-secondary-dark` surface, never the vermillion accent
- `Card.tsx` renders a project's title, summary, tag row, and demo/code links; external links route through the existing `Button` primitive, which automatically applies `rel="noopener noreferrer"` on `target="_blank"` anchors (T-03-01 reverse-tabnabbing mitigation); subtle hover scale/shadow micro-interaction (D-03) is neutralized under `prefers-reduced-motion` by the global CSS rule from plan 01-01
- `/projects` is a Server Component page rendering all 4 projects in a responsive grid (1 column on mobile, 2 columns at `sm`+) inside `Container`
- Homepage (`src/app/(site)/page.tsx`) now has the hero (unchanged, from plan 01-01) plus a new "Featured Projects" teaser section below it showing the first 3 projects and a "View all projects" link to `/projects`, with generous `py-16 sm:py-24` section spacing per D-04
- Confirmed the homepage contains no "latest post"/blog teaser content (explicitly deferred to Phase 2 per CONTEXT.md)
- `npm run build` prerenders both `/` and `/projects` as static content; `npm run lint` passes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Typed project data layer + Card and Tag primitives** - `40d127b` (feat)
2. **Task 2: Projects index page + homepage featured-projects teaser** - `f7949f6` (feat)

**Plan metadata:** (this SUMMARY commit, made by this worktree agent — STATE.md/ROADMAP.md updates are owned by the orchestrator after wave merge)

## Files Created/Modified
- `src/content/projects.ts` - typed `Project` type + `projects` array (4 curated entries)
- `src/components/ui/Tag.tsx` - neutral-surface tag primitive
- `src/components/ui/Card.tsx` - project card primitive (image, title, summary, tags, demo/code links, hover micro-interaction)
- `src/app/(site)/projects/page.tsx` - projects index route (Server Component, responsive Card grid)
- `src/app/(site)/page.tsx` - modified to append the featured-projects teaser below the existing hero

## Decisions Made
- Curated 4 placeholder projects spanning this site itself, an investing dashboard, a dojo-scheduling SaaS, and an open-source CLI — realistic, editable placeholder content within PROJ-01's 3-5 range.
- Left project image `src` paths as documented placeholder references (`/projects/*.png`) without generating actual image files — this plan's frontmatter carries no `user_setup` asset requirement (unlike 01-01's `hero.jpg`), and `next/image` with a plain string `src` resolves at request time, so the build is unaffected. Flagged under User Setup Required below.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

- **`src/content/projects.ts` `image.src` fields** (`/projects/rasmusos.png`, `/projects/portfolio-tracker.png`, `/projects/dojo-scheduler.png`, `/projects/devnotes-cli.png`): reference paths under `public/projects/` that do not yet contain real image files. Cards will render broken-image icons until Rasmus adds real screenshots at those paths. This does not block the plan's goal (data layer + grid + teaser all render and build correctly) and follows the exact placeholder pattern documented in `01-PATTERNS.md`'s canonical `content/projects.ts` block. Resolution: add real project screenshots to `public/projects/` (asset swap only, no code change needed) — same pattern as the `public/hero.jpg` placeholder from plan 01-01.

## Issues Encountered

None.

## User Setup Required

Add real project screenshots to `public/projects/` at the paths referenced in `src/content/projects.ts` (`rasmusos.png`, `portfolio-tracker.png`, `dojo-scheduler.png`, `devnotes-cli.png`), and optionally replace the placeholder project titles/summaries/links with real project details. No code changes needed — same-path asset swap.

## Next Phase Readiness
- `Card`/`Tag` primitives and the typed `projects` data source are now available for any future phase needing project data (e.g., a v1.1 per-project case-study page, explicitly out of scope for v1).
- No blockers for 01-04 (About/Contact/404) or 01-05 (phase checkpoint) — this plan's files (`src/content/projects.ts`, `Card.tsx`, `Tag.tsx`, `projects/page.tsx`, homepage teaser) have zero overlap with 01-02's and 01-04's file sets per the wave plan.

## Self-Check: PASSED

All created/modified files verified present on disk; both task commit hashes (`40d127b`, `f7949f6`) verified present in git log.

---
*Phase: 01-core-site-design-system*
*Completed: 2026-07-13*
