---
phase: 02-blog-content-system
plan: 06
subsystem: ui
tags: [nextjs, homepage, blog-teaser]

# Dependency graph
requires:
  - phase: 02-blog-content-system
    plan: 02
    provides: "src/lib/posts.ts: getAllPosts() (draft-safe, newest-first)"
  - phase: 02-blog-content-system
    plan: 03
    provides: "src/components/blog/PostListRow.tsx (compact variant)"
  - phase: 02-blog-content-system
    plan: 04
    provides: "content/posts/*.mdx launch content (3 published posts)"
provides:
  - "Homepage 'Latest Writing' teaser section (D-15..D-18) below Featured Projects"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Homepage module-level constant pattern reused for posts: const LATEST_POSTS = getAllPosts().slice(0, 3), mirroring const FEATURED_PROJECTS = projects.slice(0, 3)"

key-files:
  created: []
  modified:
    - src/app/(site)/page.tsx

key-decisions:
  - "Used compact PostListRow (not Card) for the homepage teaser per D-17 — keeps card treatment exclusive to Projects, avoids stacking two card grids on the homepage"

requirements-completed: [BLOG-01]

# Metrics
duration: ~10min
completed: 2026-07-13
---

# Phase 2 Plan 06: Homepage Latest-Writing Teaser Summary

**Added a "Latest Writing" section to the homepage below the existing Featured Projects teaser, rendering the 3 most recent posts as compact `PostListRow` rows with a "View all posts" CTA to /blog (D-15..D-18).**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-07-13
- **Tasks:** 1/1 completed
- **Files modified:** 1

## Accomplishments

- Homepage now imports `getAllPosts` from `@/lib/posts` and `PostListRow` from `@/components/blog/PostListRow`, adding a module-level `const LATEST_POSTS = getAllPosts().slice(0, 3);` mirroring the existing `FEATURED_PROJECTS` pattern
- New `<Container>` section titled "Latest Writing" renders `LATEST_POSTS` as compact `PostListRow` rows (title + date only, no excerpt/tags/reading-time), placed directly below Featured Projects — Featured Projects remains the primary pitch, unchanged
- Section CTA is a `Button variant="secondary"` reading exactly "View all posts" linking to `/blog`, mirroring the "View all projects" pattern
- Updated the homepage's top docblock comment to describe both teaser sections and why the blog teaser uses `PostListRow` instead of `Card` (D-17: Projects keeps sole ownership of the card treatment)
- Verified with the 3 real launch posts from Plan 02-04 (`content/posts/*.mdx`) — the teaser renders real content, not an empty state

## Task Commits

Each task was committed atomically:

1. **Task 1: Add the "Latest Writing" teaser section to the homepage (D-15..D-18)** - `ed71080` (feat)

_No plan metadata commit in this worktree — orchestrator handles final STATE.md/ROADMAP.md commit after merge._

## Files Created/Modified

- `src/app/(site)/page.tsx` - Added `getAllPosts`/`PostListRow` imports, `LATEST_POSTS` constant, and the "Latest Writing" `<Container>` section below Featured Projects; updated docblock comment

## Verification

- `npx velite --clean` — build finished cleanly
- `npx tsc --noEmit` — passes with no errors
- `npm run build` — production build succeeds (Turbopack), homepage prerendered as static content
- Plan's full grep-based verify chain (Latest Writing heading, `getAllPosts().slice(0, 3)`, `PostListRow`, `compact`, `View all posts`, `href="/blog"`, no `Card` reference within the Latest Writing block) — all checks passed

## Decisions Made

- No deviations from the plan's exact markup — implemented the section verbatim per the plan's `<action>` code block, using compact `PostListRow` (not `Card`) per D-17.

## Deviations from Plan

None - plan executed exactly as written.

## Threat Flags

None. The teaser reads through `getAllPosts()`, which routes through the centralized `getPublishedPosts()` draft filter (Plan 02-02, D-11) — no new information-disclosure surface introduced (T-02-13 mitigated as specified in the plan's threat model).

## Known Stubs

None. `content/posts/` (from Plan 02-04) already contains 3 published launch posts, so `LATEST_POSTS` renders real content rather than an empty array at this point in the build.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Homepage now fully exercises the D-07/D-15..D-18 teaser requirements for both Projects and Blog
- `/blog` route itself is owned by a separate plan (02-05); this worktree does not include blog route files, so `npm run build`'s route table does not list `/blog` yet — the CTA link target will resolve correctly once 02-05 merges alongside this plan
- No blockers for downstream plans

## Self-Check: PASSED

Confirmed `src/app/(site)/page.tsx` modifications present on disk with all required strings (Latest Writing, getAllPosts().slice(0, 3), PostListRow, compact, View all posts, href="/blog"); commit hash `ed71080` confirmed present in `git log --oneline`.

---
*Phase: 02-blog-content-system*
*Completed: 2026-07-13*
