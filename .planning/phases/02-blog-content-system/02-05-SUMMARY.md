---
phase: 02-blog-content-system
plan: 05
subsystem: ui
tags: [nextjs, app-router, ssg, mdx, blog]

# Dependency graph
requires:
  - phase: 02-blog-content-system
    plan: 02
    provides: "src/lib/posts.ts (getAllPosts/getPostBySlug/getPostsByTag/getAllTags), src/lib/related-posts.ts (getRelatedPosts)"
  - phase: 02-blog-content-system
    plan: 03
    provides: "src/components/blog/PostListRow.tsx, src/components/mdx/MDXContent.tsx, linkable Tag variant"
  - phase: 02-blog-content-system
    plan: 04
    provides: "content/posts/*.mdx (3 launch posts) via Velite"
provides:
  - "Blog index route (src/app/(site)/blog/page.tsx) — D-01 plain list, empty-state safe"
  - "Post detail route (src/app/(site)/blog/[slug]/page.tsx) — MDX render + related posts, fully SSG"
  - "Per-tag archive route (src/app/(site)/blog/tags/[tag]/page.tsx) — D-03, fully SSG"
affects: [02-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next.js 16 async params: route components typed as `params: Promise<{...}>`, awaited before use — applies to both [slug] and tags/[tag]"
    - "generateStaticParams sourced exclusively from lib/posts.ts query functions (getAllPosts/getAllTags), never from raw #site/content import, to keep draft-filtering single-sourced (D-11)"

key-files:
  created:
    - src/app/(site)/blog/page.tsx
    - src/app/(site)/blog/[slug]/page.tsx
    - src/app/(site)/blog/tags/[tag]/page.tsx
  modified: []

key-decisions:
  - "Related Posts section on the post page is conditionally rendered only when getRelatedPosts returns a non-empty array, avoiding an empty heading with no rows underneath it for edge cases (e.g. a single-post site)"

patterns-established:
  - "All three blog routes wrap content in <Container className=\"py-16 sm:py-24\"> matching every existing (site) page"

requirements-completed: [BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05]

# Metrics
duration: ~20min
completed: 2026-07-13
---

# Phase 2 Plan 05: Blog Routes (Index, Post Detail, Tag Archive) Summary

**Three fully statically-generated blog routes — plain-list index, MDX post detail with related posts, and per-tag archive — all gated by `dynamicParams = false` so unknown slugs/tags 404 at the CDN edge.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-13
- **Tasks:** 3/3 completed
- **Files modified:** 3 (all created)

## Accomplishments

- `/blog` renders every published post as a plain-list `PostListRow` row (D-01) with a safe "No posts yet" empty state, wrapped in the standard `<Container className="py-16 sm:py-24">` shell matching `/projects` and `/about`
- `/blog/[slug]` statically generates one page per published post via `generateStaticParams` over `getAllPosts()` (draft-filtered upstream in `lib/posts.ts`, D-11), renders the MDX body through `<Prose><MDXContent code={post.code} /></Prose>`, and shows up to 3 related posts (`getRelatedPosts`) as compact `PostListRow`s; unknown/draft slugs call `notFound()`
- `/blog/tags/[tag]` statically generates one page per tag via `generateStaticParams` over `getAllTags()`, lists tagged posts as full `PostListRow`s, and 404s any unknown tag (`dynamicParams = false`, no fallback branch) — no `/blog/tags` index page exists (D-03)
- Verified end-to-end with a full `npx next build`: all 3 real posts and 5 real tags were statically generated (`● /blog/[slug]` → 3 paths, `● /blog/tags/[tag]` → 5 paths), no draft paths present (there are currently no draft posts in `content/posts/`)
- Confirmed rendered HTML output contains `data-theme="github-light github-dark"` on code blocks (BLOG-03 syntax highlighting) and `id="..."` attributes on headings (D-13 heading anchors) in the built post pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Blog index route (D-01 plain list)** - `a5b2999` (feat)
2. **Task 2: Post detail route (MDX render + related posts)** - `102c4b0` (feat)
3. **Task 3: Tag archive route (D-03)** - `ad4096d` (feat)

_No plan metadata commit in this worktree — orchestrator handles final STATE.md/ROADMAP.md commit after merge._

## Files Created/Modified

- `src/app/(site)/blog/page.tsx` - Blog index Server Component; maps `getAllPosts()` to full `PostListRow` rows; defensive empty state
- `src/app/(site)/blog/[slug]/page.tsx` - Dynamic post route; `generateStaticParams`/`dynamicParams=false`; `getPostBySlug` + `notFound()`; `Prose`+`MDXContent` body render; `getRelatedPosts` compact rows
- `src/app/(site)/blog/tags/[tag]/page.tsx` - Dynamic tag-archive route; `generateStaticParams`/`dynamicParams=false`; `getPostsByTag` + `notFound()`; full `PostListRow` rows

## Decisions Made

- Related Posts heading/section only renders when `getRelatedPosts` returns at least one post, to avoid a visible empty section header on very small sites (not specified either way by the plan; chosen defensively, no scope change to the plan's required behavior since real content always yields related posts via the recency backfill).
- No other deviations — all three files match the plan's `<action>` blocks and the `02-PATTERNS.md` canonical code blocks closely, adjusted only for Next.js 16's async `params` requirement (already anticipated explicitly by the plan's Task 2 instructions and applied consistently to Task 3 as well, since both are dynamic routes).

## Deviations from Plan

None - plan executed exactly as written. (The async-`params` typing was explicitly called out in the plan's Task 2 action text as a Next 16 requirement, and applied identically to Task 3's `[tag]` route for consistency — not a deviation, a direct application of the same documented requirement to both dynamic routes.)

## Issues Encountered

- Worktree had no `node_modules` and no `.velite` output at start — ran `npm install` then `npx velite --clean` before any typechecking, per the mandatory pre-flight step. Not a plan deviation; standard worktree bootstrap.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All five BLOG-0X requirements (BLOG-01 through BLOG-05) are now visitor-verifiable: list view, MDX read with highlighting, tag archive, related posts, and edge-404 for unknown paths
- `npx next build` confirmed fully static output for `/blog`, all 3 post slugs, and all 5 tag pages — ready for 02-06 (homepage latest-writing teaser), which can reuse `getAllPosts()` + `PostListRow` (compact) exactly as established here
- No blockers for downstream plans

## Self-Check: PASSED

All created files confirmed present on disk (`src/app/(site)/blog/page.tsx`, `src/app/(site)/blog/[slug]/page.tsx`, `src/app/(site)/blog/tags/[tag]/page.tsx`); all 3 task commit hashes (a5b2999, 102c4b0, ad4096d) confirmed present in git log; `npx tsc --noEmit` clean and `npx next build` succeeded with the expected static route set re-verified after the final commit.

---
*Phase: 02-blog-content-system*
*Completed: 2026-07-13*
