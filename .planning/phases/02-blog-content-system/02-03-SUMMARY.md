---
phase: 02-blog-content-system
plan: 03
subsystem: ui
tags: [react, nextjs, mdx, tailwind, presentational-components]

# Dependency graph
requires:
  - phase: 02-blog-content-system (plan 01)
    provides: "#site/content" typed Velite output (Post type, code string, metadata.readingTime)
provides:
  - Linkable Tag variant (href? prop) for /blog/tags/[tag] navigation (D-02)
  - MDXContent renderer turning Velite's compiled function-body code string into JSX (BLOG-02)
  - Shared PostListRow component (compact prop) serving blog index, related-posts, and homepage teaser (D-01/D-07/D-17)
affects: [02-05, 02-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tag.tsx href?-prop branching: internal next/link when href present, plain span otherwise — no external-link/rel handling since blog tags are internal-only (contrast with Button.tsx's external-anchor branch)"
    - "MDXContent evaluates Velite's function-body code string via new Function(code) against react/jsx-runtime (RESEARCH.md Pattern 3) — trusted first-party content, not runtime user input"
    - "PostListRow: one component + compact boolean prop serves 3 display contexts instead of 3 separate components"
    - "Fixed Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }) for all post dates — avoids server/client hydration mismatch from local-timezone rendering"

key-files:
  created:
    - src/components/mdx/MDXContent.tsx
    - src/components/blog/PostListRow.tsx
  modified:
    - src/components/ui/Tag.tsx

key-decisions:
  - "PostListRow prop contract: { post: Post, compact?: boolean }. compact=false (default) renders full index row (title text-heading, date · readingTime min read, excerpt, linkable tags, top hairline divider); compact=true renders title text-body + date only. Consumers (02-05 blog routes, 02-06 homepage) pass compact for related-posts/teaser use, omit it for the blog index."
  - "MDXContent prop contract: { code: string, components?: Record<string, React.ComponentType> }. code is post.code from the Velite Post type (function-body string, not JSX). components lets a caller override/extend the empty sharedComponents map without touching MDXContent itself."
  - "Tag prop contract extended (backward compatible): { children: string, href?: string, className?: string }. Existing Card.tsx usage (no href) is byte-for-byte unchanged; new href usage (blog tags) renders next/link with neutral resting state + vermillion hover/focus-visible only, per D-02."

patterns-established:
  - "Tag.tsx is now the single reusable pattern for both non-interactive badges (Card.tsx tech tags) and internal-link chips (blog tag-archive links) — future badge-style UI should extend this component rather than creating a new one."

requirements-completed: [BLOG-02]

# Metrics
duration: ~10min
completed: 2026-07-13
---

# Phase 2 Plan 03: Blog Presentational Components Summary

**Linkable Tag variant, Velite MDX-to-JSX renderer, and a shared compact/full PostListRow component — the three presentational pieces backing BLOG-02 and the blog index/related-posts/homepage-teaser display contexts (D-01/D-02/D-07/D-17).**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-07-13
- **Tasks:** 3/3 completed
- **Files modified:** 3 (1 modified, 2 created)

## Accomplishments
- `Tag` now supports an optional `href` prop rendering an internal `next/link` chip (D-02) while leaving existing non-linked usage in `Card.tsx` byte-for-byte unchanged
- `MDXContent` created exactly per RESEARCH.md Pattern 3 — evaluates Velite's compiled function-body code string via `new Function(code)` against `react/jsx-runtime`, satisfying BLOG-02
- `PostListRow` created as a single component with a `compact` boolean, serving the full blog-index row (title, date + reading time, excerpt, linkable tags, hairline divider) and the compact related-posts/homepage-teaser row (title + date only) from one implementation
- All three files typecheck cleanly (`npx tsc --noEmit`), including against the real Velite-generated `Post` type (`npx velite build --strict` run to generate `.velite/` output for type resolution, since it didn't yet exist in this worktree)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend Tag.tsx with an internal-link variant (D-02)** - `3147cfd` (feat)
2. **Task 2: Create the MDXContent renderer** - `8348277` (feat)
3. **Task 3: Create the shared PostListRow** - `607e496` (feat)

_No plan metadata commit in this worktree — orchestrator handles final STATE.md/ROADMAP.md commit after merge._

## Files Created/Modified
- `src/components/ui/Tag.tsx` - Added optional `href` prop; internal `next/link` chip with neutral resting state, vermillion hover/focus-visible only (D-02); unchanged `<span>` behavior when `href` omitted
- `src/components/mdx/MDXContent.tsx` - New. Renders Velite's compiled MDX code string to JSX via `new Function(code)` + `react/jsx-runtime` (BLOG-02)
- `src/components/blog/PostListRow.tsx` - New. `{ post, compact? }` component; full/compact row variants, fixed-UTC date formatting, linkable tags via `Tag`

## Decisions Made
- Ran `npx velite build --strict` locally (not committed — `.velite/` is gitignored per 02-01) to generate the typed `#site/content` output needed for `PostListRow.tsx` to typecheck against the real `Post` type, since this worktree had no prior Velite build artifact. No `content/posts/*.mdx` exist yet (owned by 02-04), so `.velite/posts.json` is an empty array — this only exercises type resolution, not runtime data.
- No other deviations — plan's exact code blocks were implemented verbatim (Tag.tsx, MDXContent.tsx, PostListRow.tsx all match the plan's `<action>` blocks character-for-character).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `PostListRow({ post, compact? })` and `MDXContent({ code, components? })` are ready for consumption by 02-05 (blog routes: `/blog`, `/blog/[slug]`, `/blog/tags/[tag]`) and 02-06 (homepage latest-writing teaser)
- Linkable `Tag` (`href` prop) is ready for use in `PostListRow`'s tag rendering and anywhere else internal tag-archive links are needed
- No blockers for downstream plans in this phase

## Self-Check: PASSED

All created/modified files confirmed present on disk (src/components/ui/Tag.tsx, src/components/mdx/MDXContent.tsx, src/components/blog/PostListRow.tsx); all 3 task commit hashes (3147cfd, 8348277, 607e496) confirmed present in git log.

---
*Phase: 02-blog-content-system*
*Completed: 2026-07-13*
