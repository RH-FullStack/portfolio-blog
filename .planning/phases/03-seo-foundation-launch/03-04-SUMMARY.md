---
phase: 03-seo-foundation-launch
plan: 04
subsystem: infra
tags: [nextjs, next-image, seo, performance, lcp, image-optimization]

# Dependency graph
requires: []
provides:
  - "next.config.mjs images.formats (avif+webp) + images.qualities allow-list [55,65,70,75]"
  - "Homepage metadata description (title-less, inherits root default title)"
  - "Hero Background.jpg quality-tuned Image (quality=70) as sole priority/LCP element"
  - "Backup image assets relocated to assets/originals/ (kept in git, not deployed)"
affects: [03-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "next.config.mjs images config: explicit formats + qualities allow-list (unlisted quality props are silently coerced by Next.js)"
    - "Only the true LCP element gets `priority`; competing images must not carry it"

key-files:
  created:
    - assets/originals/BackgroundOld.jpg
    - assets/originals/heroold.jpg
  modified:
    - next.config.mjs
    - src/app/(site)/page.tsx

key-decisions:
  - "WebP+AVIF both enabled in next.config.mjs formats; WebP wins for the textured hero at every tested quality (verified empirically this session with sharp), but AVIF stays available for other images"
  - "qualities allow-list includes 55/65 as headroom so plan 03-06 can lower hero quality without editing next.config.mjs again"
  - "Homepage metadata sets description only, no title — inherits root layout's default title per D-02"
  - "Removed priority from the 200x200 hero.jpg portrait since Background.jpg (full-bleed) is the actual LCP candidate"

patterns-established:
  - "Single source of truth for quality values: any explicit <Image quality> prop must be a member of next.config.mjs images.qualities"

requirements-completed: [SEO-01, SEO-04]

duration: ~10min
completed: 2026-07-14
---

# Phase 3 Plan 04: Image Performance Config + Homepage Metadata Summary

**Configured next/image AVIF+WebP formats with a tunable qualities allow-list, tuned the homepage hero to a single quality-controlled LCP image, added the homepage's own meta description, and relocated backup image assets out of the publicly-served `public/` tree.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-07-14T11:58Z (approx, first task edit)
- **Completed:** 2026-07-14T12:03Z
- **Tasks:** 3
- **Files modified:** 4 (2 modified, 2 renamed)

## Accomplishments
- `next.config.mjs` now declares `images.formats: ['image/avif', 'image/webp']` and `images.qualities: [55, 65, 70, 75]`, unblocking any explicit `quality` prop up to 75 and giving plan 03-06 headroom to tune down without another config edit.
- Homepage (`src/app/(site)/page.tsx`) exports a title-less `Metadata` object with a hand-written description (D-03), inheriting the root layout's default title (D-02).
- The hero `Background.jpg` `<Image>` now carries `quality={70}` (a member of the new allow-list) and remains the sole `priority` image; the 200×200 portrait `hero.jpg` no longer competes for LCP preload priority.
- `public/BackgroundOld.jpg` and `public/heroold.jpg` (409KB + 11KB of unused backup assets) were relocated via `git mv` to `assets/originals/`, removing them from the publicly-deployed surface while preserving git history/provenance (D-14, T-03-10 mitigation).

## Task Commits

Each task was committed atomically:

1. **Task 1: Configure next/image optimization in next.config.mjs** - `9a1738a` (feat)
2. **Task 2: Homepage metadata description + hero LCP image tuning** - `cfc5511` (feat)
3. **Task 3: Relocate backup image assets out of public/ (D-14)** - `8f1b62e` (chore)

**Plan metadata:** (this commit, docs: complete plan)

## Files Created/Modified
- `next.config.mjs` - Added `images.formats` (AVIF+WebP) and `images.qualities` allow-list; Velite top-level-await build block preserved verbatim
- `src/app/(site)/page.tsx` - Added title-less `metadata` export with description; added `quality={70}` to the hero background `<Image>`; removed `priority` from the portrait `<Image>`
- `assets/originals/BackgroundOld.jpg` (renamed from `public/BackgroundOld.jpg`)
- `assets/originals/heroold.jpg` (renamed from `public/heroold.jpg`)

## Decisions Made
- Enabled both AVIF and WebP formats even though WebP wins for this specific textured hero image (empirically verified: WebP q70 ≈195KB vs AVIF q70 ≈294KB) — AVIF stays available for other images that may benefit from it (e.g., project screenshots added later).
- Included 55 and 65 in the qualities allow-list purely as tuning headroom for plan 03-06's Lighthouse-mobile gate work, without requiring another `next.config.mjs` edit.
- No `title` key added to the homepage metadata — intentionally relies on the root layout's `default` title ("Rasmus Hansen — Software Developer") per D-02.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Generated missing Velite output to unblock `npx tsc --noEmit`**
- **Found during:** Task 2 verification
- **Issue:** `npx tsc --noEmit` failed with `Cannot find module '#site/content'` — the Velite-generated `.velite/` type declarations (path-mapped in `tsconfig.json`) did not exist yet in this fresh worktree checkout, since Velite only builds them as a side effect of `next dev`/`next build` or a direct `velite build` invocation.
- **Fix:** Ran `npx velite build` once to generate `.velite/index.d.ts` (a build artifact, already gitignored via the existing `.velite` entry in `.gitignore` — no tracked-file changes). Re-ran `npx tsc --noEmit`, which then passed cleanly.
- **Files modified:** None (generated `.velite/` output only, not committed — already gitignored)
- **Verification:** `npx tsc --noEmit` exits 0 after the Velite build step
- **Committed in:** N/A (no tracked files changed; this was a local build-artifact regeneration, not a code change)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to run the plan's own verification command in a fresh worktree; no code or tracked-file changes resulted, no scope creep.

## Issues Encountered
None beyond the Velite build-artifact regeneration documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 03-06 (Lighthouse mobile Performance gate) can tune the hero `quality` prop down to `65` or `55` using the already-provisioned `images.qualities` allow-list without touching `next.config.mjs` again.
- SEO-01 (homepage half) and SEO-04 (image config + LCP tuning half) are both delivered by this plan; the measured Lighthouse 90+ outcome remains to be verified in plan 03-06 as scoped.
- D-14 (backup asset relocation) is complete; no dangling references to the relocated files remain under `src/`.

---
*Phase: 03-seo-foundation-launch*
*Completed: 2026-07-14*

## Self-Check: PASSED

All created/modified files confirmed present on disk; all task commit hashes (9a1738a, cfc5511, 8f1b62e) confirmed present in git log.
