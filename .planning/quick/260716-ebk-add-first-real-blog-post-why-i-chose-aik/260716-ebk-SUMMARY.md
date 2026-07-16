---
phase: quick-260716-ebk
plan: 01
subsystem: content
tags: [mdx, velite, blog, content]

# Dependency graph
requires:
  - phase: 02-blog-content-system
    provides: velite.config.ts posts collection schema, src/lib/posts.ts getAllPosts(), /blog index and homepage teaser consuming the same content layer
provides:
  - The first real published blog post at content/posts/why-i-chose-aikido.mdx
  - Confirmation that Velite validates real author-written frontmatter/body against the posts schema with no errors
affects: [blog, homepage, seo]

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: [content/posts/why-i-chose-aikido.mdx]
  modified: []

key-decisions:
  - "Content placed byte-for-byte per the plan's verbatim block — no rewriting, embellishing, or re-tagging"

patterns-established: []

requirements-completed: [BLOG-01, BLOG-02]

# Metrics
duration: 8min
completed: 2026-07-16
---

# Phase quick-260716-ebk: Add First Real Blog Post Summary

**Added `content/posts/why-i-chose-aikido.mdx` — Rasmus's first real published post, verified schema-valid by Velite (slug, tags, excerpt, draft: false all present and correctly typed).**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-07-16T08:17:00Z (approx)
- **Completed:** 2026-07-16T08:25:33Z
- **Tasks:** 2 (both auto)
- **Files modified:** 1

## Accomplishments
- Created the approved blog post file verbatim (frontmatter + three-section body: Why Aikido, Where I Am Now, What's Next)
- Confirmed Velite validates the new post against the `posts` collection schema with zero errors and generates the correct `.velite/posts.json` entry (title, date, tags, excerpt, draft: false, computed `metadata`/`code`, filename-derived `slug: "why-i-chose-aikido"`)
- Root-caused an unrelated, pre-existing `npm run build` failure in this worktree (missing local `node_modules`, unrelated to content) rather than papering over it with an out-of-scope fix

## Task Commits

Each task was committed atomically:

1. **Task 1: Create the approved blog post file verbatim** - `bb5e48f` (feat)
2. **Task 2: Build and verify the post is generated and surfaced end-to-end** - no commit (verification-only task, no files changed; see Deviations/Issues below for what could and could not be verified)

**Plan metadata:** commit deferred to orchestrator (per instructions, SUMMARY/STATE/PLAN docs are not committed by this executor)

_Note: Task 2 produced no file changes, so there is no additional task commit beyond Task 1._

## Files Created/Modified
- `content/posts/why-i-chose-aikido.mdx` - Rasmus's first real published blog post (Aikido origin story, current rank, forward-looking note), exact approved frontmatter and body

## Decisions Made
- None beyond the plan itself — content placed verbatim as instructed, no frontmatter fields added/removed (no `slug`, no `metadata`/`code` written manually, both are Velite-computed).

## Deviations from Plan

### Auto-fixed Issues

None — no bugs, missing functionality, or blocking issues were found in the content itself that required a fix.

### Out-of-Scope Issue Found (documented, not fixed)

**1. [Scope boundary] Pre-existing `npm run build` failure in this worktree, unrelated to the content change**
- **Found during:** Task 2 (build and verify)
- **Issue:** `npm run build` fails during static generation of `/opengraph-image` with `ENOENT: ... node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf`. Root cause: this worktree's local `node_modules/` was never populated (0 packages installed locally — `next`, `velite`, etc. only resolve via Node's upward module resolution to the parent repo's `node_modules`), compounded by a Next.js-reported workspace-root ambiguity from duplicate lockfiles (worktree + main repo).
- **Confirmed pre-existing / out of scope:** Reproduced identically with the new blog post file temporarily moved aside and restored — the failure occurs with or without this task's content change. `.planning/phases/03-seo-foundation-launch/DEPLOY-CHECKLIST.md` (check #5) and `03-06-SUMMARY.md` confirm a full `next build && next start` previously passed with Lighthouse 90+ in an environment with `node_modules` properly installed, confirming this is a worktree-provisioning gap, not a code defect.
- **Not fixed:** Out of scope per the plan (single content-file change only; no `next.config.mjs`, route, or dependency changes permitted) and per SCOPE BOUNDARY rules (pre-existing, unrelated failure). Logged to `deferred-items.md` in this quick-task directory instead of fixing.
- **What was verified in scope instead:** The Velite build step itself (`[VELITE] build finished...`) completes with zero schema errors, and `.velite/posts.json` contains the fully-correct `why-i-chose-aikido` entry — confirming the actual deliverable of this task (a schema-valid, correctly-slugged blog post) is complete and correct.

---

**Total deviations:** 0 auto-fixed; 1 out-of-scope issue documented (not fixed).
**Impact on plan:** None on this task's actual deliverable (the content file). Full end-to-end `/blog` index / homepage teaser rendering and static route generation could not be exercised via `npm run build` in this specific worktree due to the pre-existing environment gap — see Issues Encountered below.

## Issues Encountered

`npm run build` could not complete end-to-end in the executor's isolated worktree due to the pre-existing, unrelated `node_modules` provisioning gap described above. What WAS confirmed there:
- Velite validation of the new post passes with no errors (runs and completes before the unrelated failure point).
- `.velite/posts.json` contains the correct, fully-populated entry for `why-i-chose-aikido`.

**Orchestrator follow-up (post-merge, closes this gap):** After merging `bb5e48f` into `main`, ran `npm run build` directly in the main repo checkout (fully-installed `node_modules`). **Build passed cleanly end to end** — confirmed in the route manifest:
```
● /blog/[slug]
  └ /blog/why-i-chose-aikido
● /blog/tags/[tag]
  ├ /blog/tags/aikido
  └ /blog/tags/japan
```
Both must-have truths ("npm run build succeeds", "the post renders at /blog/why-i-chose-aikido") are now directly confirmed, not just inferred from the Velite data layer.

## Next Phase Readiness
- The blog is no longer empty: `content/posts/why-i-chose-aikido.mdx` is live in a passing build, rendering at `/blog/why-i-chose-aikido`, on the `/blog` index, in the homepage "Latest Writing" teaser, and under both the `aikido` and `japan` tag pages.
- No follow-up required — the build gap from the executor's worktree was environment-specific and has been closed by the orchestrator's post-merge verification.

---
*Phase: quick-260716-ebk*
*Completed: 2026-07-16*

## Self-Check: PASSED

- FOUND: content/posts/why-i-chose-aikido.mdx
- FOUND: bb5e48f (git log --oneline --all)
