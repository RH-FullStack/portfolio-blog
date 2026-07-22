---
phase: quick
plan: 260722-dmq
subsystem: content
tags: [metadata, seo, copy, jsx]

# Dependency graph
requires: []
provides:
  - Site tagline and SEO metadata across all pages with no investing references
  - About page rewritten as a coherent two-thread (developer + aikido) narrative
affects: [about, seo-metadata, site-config]

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - src/lib/site-config.ts
    - src/app/layout.tsx
    - src/app/(site)/page.tsx
    - src/app/(site)/contact/page.tsx
    - src/app/(site)/blog/tags/[tag]/page.tsx
    - src/app/(site)/blog/page.tsx
    - src/app/(site)/about/page.tsx

key-decisions:
  - "Restored worktree node_modules via npm install (exact package-lock.json versions, no new/changed deps) to unblock build verification — pre-existing environment gap, not caused by this task's edits"

patterns-established: []

requirements-completed: [REMOVE-INVESTING-REFERENCES]

# Metrics
duration: 15min
completed: 2026-07-22
---

# Quick Task 260722-dmq: Remove Investing References From The Site Summary

**Removed every "invest"/"investor"/"investing" reference from tagline, SEO metadata, and About page copy across seven files; rewrote the About page as a two-thread (developer + aikido) narrative with four paragraphs instead of five.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-22T07:43:00Z
- **Completed:** 2026-07-22T07:58:03Z
- **Tasks:** 3 completed
- **Files modified:** 7

## Accomplishments
- Dropped "investor" from the site tagline (`Developer, aikidoka, discgolf pro.`)
- Removed the investing clause from all SEO/metadata descriptions: root layout (description, OpenGraph, Twitter — 3 occurrences), home, contact, blog index, and blog tag-archive template
- Updated the visible blog-index body copy to drop the investing mention
- Rewrote the About page's metadata description, file-header comment, aikido paragraph, and closing paragraph to read as a coherent two-thread story; deleted the entire investor-thread paragraph
- Confirmed a full case-insensitive `grep -riIn "invest" src/` returns zero matches
- Confirmed `npm run build` and `npm run lint` both pass clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Mechanical copy swaps across six files (tagline + metadata descriptions)** - `22ec2ac` (fix)
2. **Task 2: About-page narrative surgery — drop the investor thread, rewrite around it** - `3e2e648` (fix)
3. **Task 3: Verify the whole site is investing-free and still builds/lints** - no commit (verification only, no files created/modified per plan)

**Plan metadata:** (pending — orchestrator handles docs commit)

## Files Created/Modified
- `src/lib/site-config.ts` - Tagline: dropped "investor, " from the comma-separated list
- `src/app/layout.tsx` - Root/OpenGraph/Twitter description strings (3 occurrences) with investing clause removed
- `src/app/(site)/page.tsx` - Home `metadata.description` with investing clause removed
- `src/app/(site)/contact/page.tsx` - Contact `metadata.description` with investing clause removed
- `src/app/(site)/blog/tags/[tag]/page.tsx` - `generateMetadata` template literal, investing clause removed, `${tag}` interpolation preserved
- `src/app/(site)/blog/page.tsx` - `metadata.description` and visible `<p>` body copy, both investing clauses removed
- `src/app/(site)/about/page.tsx` - `metadata.description`, file-header JSDoc, aikido-thread sentence, investor-thread paragraph deleted, closing paragraph rewritten — Prose block now has exactly 4 `<p>` tags (was 5)

## Decisions Made
- Restored the worktree's `node_modules` via `npm install` before running `npm run build`/`npm run lint`, since the worktree had no dependencies installed at all (0 real packages present, only a Velite compiled-config artifact). This is a standard dependency restore against the existing, unmodified `package-lock.json` — no new or different packages were added, and `package.json`/`package-lock.json` show zero diff after the install. Treated as a Rule 3 blocking-issue fix (not a new-package install, so the package-legitimacy exclusion does not apply).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Restored missing worktree node_modules before running build/lint verification**
- **Found during:** Task 3 (build/lint verification)
- **Issue:** `npm run build` failed with `ENOENT` on `node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf` — the worktree's `node_modules` contained only a Velite compiled-config artifact, no actual installed packages. This is a pre-existing environment gap unrelated to the plan's text-only edits.
- **Fix:** Ran `npm install` to restore dependencies exactly as pinned in the existing `package-lock.json`. Verified `package.json` and `package-lock.json` are byte-identical before/after (`git diff --stat` empty) — no new or changed packages, purely a restore of already-vetted, already-in-use dependencies.
- **Files modified:** none tracked (node_modules is gitignored)
- **Verification:** `npm run build` and `npm run lint` both then passed (exit 0)
- **Committed in:** N/A (node_modules is gitignored, nothing to commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to complete Task 3's verification step; no scope creep — no source files touched beyond the plan's seven target files, no dependency versions changed.

## Issues Encountered
- Pre-existing ESLint warning in `next.config.mjs` (`import/no-anonymous-default-export`) is unrelated to this task's files — left untouched per scope boundary. Lint still exits 0 (warnings don't fail the lint script).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Site is fully investing-reference-free across `src/`, tagline and all SEO metadata read as approved software+aikido copy, and the About page tells a coherent two-thread story.
- Build and lint both pass; no blockers for the next quick task or phase.

---
*Phase: quick*
*Completed: 2026-07-22*

## Self-Check: PASSED

All 7 modified source files and the SUMMARY.md itself confirmed present on disk; both task commits (`22ec2ac`, `3e2e648`) confirmed present in git history.
