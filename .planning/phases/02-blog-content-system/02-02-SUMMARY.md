---
phase: 02-blog-content-system
plan: 02
subsystem: content
tags: [posts-query, related-posts, vitest, tdd]

# Dependency graph
requires:
  - phase: 02-blog-content-system
    plan: 01
    provides: "#site/content" typed Velite output (posts, Post type)
provides:
  - "src/lib/posts.ts: getAllPosts, getPostBySlug, getPostsByTag, getAllTags (draft filter centralized in getPublishedPosts)"
  - "src/lib/related-posts.ts: getRelatedPosts(current, allPosts, limit=3) — tag-overlap ranking with recency tiebreak and recency backfill"
  - "First test runner (vitest) + `npm test` script in the repo"
affects: [02-03, 02-05, 02-06]

# Tech tracking
tech-stack:
  added: [vitest@4.1.10]
  patterns:
    - "Single unexported getPublishedPosts() draft-filter accessor — every exported query function in posts.ts builds on it (D-11)"
    - "getRelatedPosts: score by shared-tag count desc, tiebreak by date desc, backfill remaining slots with most-recent non-selected others (D-05/D-06/D-08)"
    - "TDD RED->GREEN cycle for related-posts.ts using inline Partial<Post>-cast fixtures, no test-only Post fields hand-declared"

key-files:
  created:
    - src/lib/posts.ts
    - src/lib/related-posts.ts
    - src/lib/related-posts.test.ts
  modified:
    - package.json (added `test` script, vitest devDependency)
    - package-lock.json

key-decisions:
  - "Added vitest as the project's first test runner (none existed) with a minimal `npm test` = `vitest run` script, per the plan's explicit instruction to add one if missing"
  - "Test fixtures use a makePost() helper casting a Partial<Post> override object as Post — avoids hand-declaring a parallel Post shape while keeping tests to only the 4 fields the algorithm reads (slug, date, tags, draft)"

requirements-completed: [BLOG-04, BLOG-05]

# Metrics
duration: ~15min
completed: 2026-07-13
---

# Phase 2 Plan 02: Query Layer & Related-Posts Ranking Summary

**Draft-safe post query layer (`getAllPosts`/`getPostBySlug`/`getPostsByTag`/`getAllTags`) plus a tag-overlap `getRelatedPosts` ranking, built test-first with vitest as the repo's first test runner.**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-07-13
- **Tasks:** 2/2 completed
- **Files modified:** 5 (3 created, 2 modified)

## Accomplishments

- `src/lib/posts.ts` exports `getAllPosts`, `getPostBySlug`, `getPostsByTag`, `getAllTags`, all routed through a single unexported `getPublishedPosts()` draft filter (D-11) — verified by a grep check confirming exactly one `!p.draft` filter exists in the file
- `src/lib/related-posts.ts` exports `getRelatedPosts(current, allPosts, limit=3)` implementing the full D-05/D-06/D-08 algorithm: shared-tag overlap ranking, recency tiebreak, and recency-based backfill to the limit, excluding the current post and drafts
- Built test-first: wrote `src/lib/related-posts.test.ts` first (confirmed RED — failed because the module didn't exist), then implemented `related-posts.ts` (confirmed GREEN — all 5 tests pass)
- Added `vitest` as the project's first test runner (none existed before this plan) with `npm test` = `vitest run`

## Task Commits

Each task was committed atomically:

1. **Task 1: Create the draft-safe query layer (src/lib/posts.ts)** - `83db9b0` (feat)
2. **Task 2 RED: Add failing related-posts tests** - `d8b9edd` (test)
3. **Task 2 GREEN: Implement getRelatedPosts** - `49f4bb0` (feat)

No REFACTOR commit was needed — the GREEN implementation matched the canonical RESEARCH.md pattern exactly with no cleanup required.

_No plan metadata commit in this worktree — orchestrator handles final STATE.md/ROADMAP.md commit after merge._

## Files Created/Modified

- `src/lib/posts.ts` - Draft-safe query layer; single `getPublishedPosts()` accessor gates all four exported functions
- `src/lib/related-posts.ts` - `getRelatedPosts` tag-overlap ranking with recency tiebreak + backfill
- `src/lib/related-posts.test.ts` - 5 tests: current/draft exclusion, overlap ranking, recency tiebreak, backfill-to-limit, max-limit cap
- `package.json` - Added `"test": "vitest run"` script and `vitest` devDependency
- `package-lock.json` - Lockfile update from `npm install -D vitest`

## Interfaces for Downstream Plans (02-03, 02-05, 02-06)

Exact exported signatures, ready to import:

```typescript
// src/lib/posts.ts
import { getAllPosts, getPostBySlug, getPostsByTag, getAllTags } from '@/lib/posts';

function getAllPosts(): Post[];              // published only, sorted newest-first
function getPostBySlug(slug: string): Post | undefined;  // published only
function getPostsByTag(tag: string): Post[];  // published only, newest-first, filtered by tag
function getAllTags(): string[];              // deduped, sorted, published-posts-only tag set

// src/lib/related-posts.ts
import { getRelatedPosts } from '@/lib/related-posts';

function getRelatedPosts(current: Post, allPosts: Post[], limit?: number): Post[]; // default limit=3
```

**Test runner + command for future plans:** `vitest` (v4.1.10), invoked via `npm test` (runs `vitest run`, i.e. single-pass CI mode, not watch mode).

## Decisions Made

- Chose `vitest` over alternatives (jest, node:test) since it's the modern default for Vite/Next-adjacent TS projects, needs zero config for this simple case, and was explicitly permitted by the plan's "add a minimal vitest dev-dependency... if none is configured" instruction.
- Test fixtures avoid hand-declaring a parallel `Post` type: `makePost()` takes `Partial<Post> & { slug: string }` and casts the merged object `as Post`, keeping the test file honest about only touching the 4 fields (`slug`, `date`, `tags`, `draft`) the ranking algorithm actually reads.

## Deviations from Plan

None - plan executed exactly as written. The vitest addition was explicitly anticipated and authorized by the plan's own Task 2 instructions ("if none is configured, add a minimal vitest dev-dependency").

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `@/lib/posts` and `@/lib/related-posts` are ready for Wave 3 route plans (02-05: blog index/detail/tag pages) and the homepage teaser plan (02-06)
- `content/posts/` still does not exist (owned by a separate content-authoring plan) — `.velite` currently builds with zero posts; all query functions correctly return empty arrays/undefined in that state, which was exercised implicitly by the test suite's synthetic fixtures rather than real content
- No blockers for downstream plans

## Self-Check: PASSED

All created files confirmed present on disk (src/lib/posts.ts, src/lib/related-posts.ts, src/lib/related-posts.test.ts, this SUMMARY.md); all 3 task commit hashes (83db9b0, d8b9edd, 49f4bb0) confirmed present in git log; `npm test` (5/5 passing) and `npx tsc --noEmit` (clean) re-verified after the final commit.

---
*Phase: 02-blog-content-system*
*Completed: 2026-07-13*
