---
phase: 02-blog-content-system
plan: 01
subsystem: content
tags: [velite, mdx, nextjs, tailwind, rehype-pretty-code, shiki, remark-gfm]

# Dependency graph
requires:
  - phase: 01-core-site-design-system
    provides: Tailwind v4 @theme tokens, .dark-class manual theme toggle (next-themes), globals.css structure
provides:
  - Velite content pipeline wired into next.config.mjs (top-level-await, Turbopack-safe, strict validation)
  - velite.config.ts posts collection (Zod schema matching D-09, filename-derived slug, mdx plugin chain)
  - "#site/content" tsconfig path alias resolving to typed .velite output
  - Dual-theme syntax-highlighting CSS keyed to the .dark class
affects: [02-02, 02-03, 02-04, 02-05, 02-06]

# Tech tracking
tech-stack:
  added: [velite@0.4.0, remark-gfm@4.0.1, rehype-pretty-code@0.14.4, rehype-slug@6.0.0, rehype-autolink-headings@7.1.0]
  patterns:
    - "Top-level-await Velite build() call inside next.config.mjs, guarded by a VELITE_STARTED env flag, with strict: true so malformed frontmatter fails next build/dev instead of silently excluding the post"
    - "Filename-derived post slug via context().file.path.split('/').pop() (path is ABSOLUTE in this Velite version, not collection-relative — see deviation below)"
    - "Dual-theme rehype-pretty-code CSS keyed off :where(.dark, .dark *), matching the project's existing @custom-variant dark pattern, not @media (prefers-color-scheme: dark)"

key-files:
  created:
    - next.config.mjs
    - velite.config.ts
  modified:
    - package.json / package-lock.json
    - tsconfig.json
    - .gitignore
    - src/app/globals.css
  deleted:
    - next.config.ts

key-decisions:
  - "Used s.string() for excerpt (not s.excerpt()) per D-10 — excerpt is a manually-authored frontmatter field, not body-derived"
  - "No slug frontmatter field — slug is derived purely from filename (BLOG-06 zero-boilerplate publishing)"
  - "Added strict: true to the Velite build() call (not in the original plan's code snippet) so malformed frontmatter fails the build, satisfying threat model T-02-01 and the plan's own must_have truth"

patterns-established:
  - "lib/ layer (future plans) is the only place allowed to import from #site/content directly — mirrors ARCHITECTURE.md's content-access boundary"
  - "content/posts/*.mdx flat file layout, no per-post subfolders — slug is the bare filename"

requirements-completed: [BLOG-03, BLOG-06]

# Metrics
duration: ~20min
completed: 2026-07-13
---

# Phase 2 Plan 01: Velite Content Pipeline Summary

**Git-based MDX content pipeline (Velite 0.4.0) wired into next.config.mjs with strict frontmatter validation, filename-derived slugs, and dual-theme Shiki syntax highlighting keyed to the project's manual `.dark` toggle.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-13
- **Tasks:** 3/3 completed
- **Files modified:** 7 (2 created, 4 modified, 1 deleted) + 1 deviation fix

## Accomplishments
- Velite content pipeline installed and wired end-to-end: `npx velite` and `next build` both produce a typed `.velite/` output with a `posts` collection
- Frontmatter schema matches D-09 exactly (title, date, tags, excerpt, draft) using Zod validation via `s.object()`, with `s.metadata()` providing `readingTime`/`wordCount` for free (no `reading-time` package needed)
- Filename-derived slug verified empirically via a throwaway spike post — closed RESEARCH.md's open Assumption A1
- Syntax highlighting wired (`rehype-pretty-code` after `rehype-slug`/`rehype-autolink-headings` in the correct order) with dual-theme CSS keyed to `.dark`, not OS preference
- Malformed frontmatter now fails `next build` (verified with a deliberately broken test post), matching the plan's must_have truth and threat model T-02-01

## Task Commits

Each task was committed atomically:

1. **Task 1: Install content-pipeline deps, convert next.config to .mjs, add tsconfig alias + gitignore** - `4546c25` (feat)
2. **Task 2: Author velite.config.ts (schema + slug transform + mdx plugins)** - `ee0eefa` (feat)
3. **Task 3: Add dual-theme code-block CSS to globals.css** - `8f2f8e3` (feat)
4. **Deviation fix: enforce strict Velite validation** - `901cebc` (fix)

_No plan metadata commit in this worktree — orchestrator handles final STATE.md/ROADMAP.md commit after merge._

## Files Created/Modified
- `next.config.mjs` - Top-level-await Velite build trigger, `VELITE_STARTED` guard, `strict: true` validation
- `velite.config.ts` - `posts` collection: Zod schema, filename-derived slug transform, mdx remark/rehype plugin wiring
- `tsconfig.json` - Added `"#site/content": ["./.velite"]` path alias
- `.gitignore` - Added `.velite` (build-generated output, must not be committed)
- `package.json` / `package-lock.json` - Added velite, remark-gfm, rehype-pretty-code, rehype-slug, rehype-autolink-headings
- `src/app/globals.css` - Dual-theme `[data-theme]` CSS for syntax-highlighted code blocks, keyed to `.dark`
- `next.config.ts` - Deleted (replaced by `next.config.mjs`)

## Decisions Made
- **Confirmed `context().file.path` returns an ABSOLUTE path** in Velite 0.4.0 (e.g. `/Users/.../content/posts/slug-spike`), not the collection-relative path RESEARCH.md's Pattern 2 code assumed. The slug transform now does `context().file.path.split('/').pop()!.replace(/\.mdx$/, '')` — takes the last path segment and strips the extension — which is robust regardless of absolute/relative path format. Verified output: a file `content/posts/slug-spike.mdx` produces `slug: "slug-spike"`.
- **`content/posts/` directory does not exist at the end of this plan.** The Task 2 spike file was created and deleted as instructed, and no other content exists yet — ownership of `content/posts/` is deliberately left to plan 02-04 (launch content), consistent with the plan's own scoping note.
- **`.velite` import shape for downstream plans:**
  ```ts
  import { posts } from '#site/content'
  import type { Post } from '#site/content'
  ```
  `Post` is exported as `Collections['posts']['schema']['_output']` from the generated `.velite/index.d.ts`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed slug-derivation regex — `context().file.path` is absolute, not collection-relative**
- **Found during:** Task 2 (velite.config.ts authoring + slug verification spike)
- **Issue:** The plan's code snippet used `context().file.path.replace(/^posts\//, '').replace(/\.mdx$/, '')`, assuming a collection-relative path like `posts/my-post.mdx`. Running the spike revealed `context().file.path` actually returns an absolute filesystem path (e.g. `/Users/.../content/posts/slug-spike.mdx`), so the `^posts\//` replace never matched, leaving the slug as an absolute path with only the extension stripped.
- **Fix:** Changed the transform to `context().file.path.split('/').pop()!.replace(/\.mdx$/, '')` — takes the last path segment (the bare filename) regardless of the path's absolute/relative format, then strips `.mdx`.
- **Files modified:** velite.config.ts
- **Verification:** Spike post `content/posts/slug-spike.mdx` produced `slug: "slug-spike"` (confirmed via `.velite/posts.json` inspection); spike file then deleted per plan instructions.
- **Committed in:** `ee0eefa` (Task 2 commit, documented inline in the commit message)

**2. [Rule 2 - Missing Critical Functionality] Added `strict: true` to the Velite build() call**
- **Found during:** Post-task verification (deliberately breaking a post's frontmatter, as instructed by the plan's `<verification>` section)
- **Issue:** Velite's JS `build()` API defaults `strict` to `false`. With the plan's original `next.config.mjs` snippet (`build({ watch: isDev, clean: !isDev })`), a post missing required frontmatter (e.g. `title`) logged a validation error to the console but was silently excluded from the `posts` collection — `next build` still succeeded. This violates the plan's own must_have truth ("Malformed post frontmatter fails the Velite build instead of rendering wrong") and threat model entry T-02-01, which explicitly requires a bad post to fail `next build` rather than being silently dropped.
- **Fix:** Added `strict: true` to the `build()` call in `next.config.mjs`.
- **Files modified:** next.config.mjs
- **Verification:** Re-ran `npx next build` with a post missing `title` present in `content/posts/` — build now fails with `Error: Schema validation failed.` at the `next.config.mjs` await site, exactly as required. Confirmed a clean `next build` (no malformed posts, no posts at all) still succeeds.
- **Committed in:** `901cebc`

---

**Total deviations:** 2 auto-fixed (1 bug fix, 1 missing critical functionality)
**Impact on plan:** Both fixes were necessary for the plan's own stated must-haves and threat model to actually hold true at runtime. No scope creep — no new files, dependencies, or architecture beyond what the plan specified.

## Issues Encountered
- Velite's glob resolution silently excludes files with a leading underscore in the filename (e.g. `_slug-spike.mdx` matched 0 files against `posts/*.mdx`, while `slug-spike.mdx` matched 1). Renamed the spike file to avoid a leading underscore. Not a plan blocker, but worth noting for anyone authoring posts later — a leading `_` on a post filename would make it invisible to the pipeline (silently, not an error).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `#site/content` import (`posts`, `Post` type) is ready for plan 02-02 (blog index/list) and downstream plans to consume
- `lib/posts.ts` / `lib/related-posts.ts` (not yet created — future plans) can now safely import from `#site/content`
- `content/posts/` directory does not yet exist — plan 02-04 (launch content) owns creating it with real posts
- No blockers for downstream plans in this phase

## Self-Check: PASSED

All created/modified files confirmed present on disk (next.config.mjs, velite.config.ts, tsconfig.json, .gitignore, src/app/globals.css, this SUMMARY.md); next.config.ts confirmed deleted; all 4 task/deviation commit hashes (4546c25, ee0eefa, 8f2f8e3, 901cebc) confirmed present in git log.

---
*Phase: 02-blog-content-system*
*Completed: 2026-07-13*
