---
phase: 03-seo-foundation-launch
plan: 02
subsystem: seo
tags: [next-og, satori, sitemap, robots, metadata-api, geist]

# Dependency graph
requires:
  - phase: 02-blog-content-system
    provides: getAllPosts()/getAllTags() draft-safe query layer (src/lib/posts.ts), siteConfig (src/lib/site-config.ts)
provides:
  - Build-time Open Graph image (src/app/opengraph-image.tsx) on Node.js runtime with vendored Geist fonts and the enso monogram
  - Draft-safe sitemap.ts enumerating static routes, published posts, and tags
  - robots.ts allowing all crawling and referencing the sitemap
affects: [03-06 (production build verification), any future page/route additions needing sitemap entries]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "next/og ImageResponse routes must use runtime = 'nodejs' (Edge deprecated for route segments in Next 16) and plain inline style objects only — no Tailwind className (Satori constraint)"
    - "Sitemap/robots/OG URLs always composed from siteConfig.siteUrl — never hardcode a deploy domain"
    - "Sitemap enumeration must go through getAllPosts()/getAllTags() (draft-filtered), never a raw Velite #site/content import"

key-files:
  created:
    - src/app/opengraph-image.tsx
    - src/app/sitemap.ts
    - src/app/robots.ts
  modified: []

key-decisions:
  - "Used runtime = 'nodejs' for opengraph-image.tsx per RESEARCH.md Pitfall 1 (Edge runtime deprecated for route segments in Next.js 16), superseding the stale 'Edge recommended' line in CLAUDE.md's Version Compatibility table"
  - "OG image text is hardcoded 'Rasmus Hansen' / 'Software Developer', not siteConfig.name (which holds the swappable 'RasmusOS' placeholder)"

patterns-established:
  - "Monogram SVG path data/colors must be copied verbatim between Header.tsx and any Satori-rendered OG image (no shared component possible across DOM/Satori render targets)"

requirements-completed: [SEO-02, SEO-03]

# Metrics
duration: 12min
completed: 2026-07-14
---

# Phase 03 Plan 02: SEO Assets (OG Image, Sitemap, Robots) Summary

**Build-time next/og Open Graph image on Node.js runtime plus a draft-safe sitemap.ts and allow-all robots.ts, all deriving URLs from siteConfig.siteUrl**

## Performance

- **Duration:** 12 min
- **Started:** 2026-07-14T09:50:00Z
- **Completed:** 2026-07-14T10:02:13Z
- **Tasks:** 2
- **Files modified:** 3 (all newly created)

## Accomplishments
- `opengraph-image.tsx` renders a 1200×630 paper-background card with the enso monogram (verbatim path/stroke match to Header.tsx) and "Rasmus Hansen" / "Software Developer" text, using vendored Geist SemiBold/Regular fonts, on the Node.js runtime
- `sitemap.ts` enumerates 5 static routes plus all published posts and tags exclusively through `getAllPosts()`/`getAllTags()`, so `draft: true` posts can never leak into the public sitemap
- `robots.ts` allows all crawling and points to `/sitemap.xml`, with the URL composed from `siteConfig.siteUrl` (no hardcoded deploy domain)

## Task Commits

Each task was committed atomically:

1. **Task 1: Build-time Open Graph image (next/og, Node.js runtime)** - `cca3fda` (feat)
2. **Task 2: sitemap.ts (draft-safe) and robots.ts** - `86a8022` (feat)

_No TDD tasks in this plan — plan type is `execute`._

## Files Created/Modified
- `src/app/opengraph-image.tsx` - Build-time OG image via next/og ImageResponse, Node.js runtime, vendored Geist fonts, enso monogram
- `src/app/sitemap.ts` - MetadataRoute.Sitemap from static routes + draft-safe getAllPosts()/getAllTags()
- `src/app/robots.ts` - MetadataRoute.Robots allow-all + sitemap reference via siteConfig.siteUrl

## Decisions Made
- Confirmed `runtime = 'nodejs'` (not `'edge'`) per plan's explicit correction of the stale CLAUDE.md guidance — Next.js 16 deprecated Edge runtime for route segments (RESEARCH.md Pitfall 1)
- Hardcoded "Rasmus Hansen" / "Software Developer" text in the OG image rather than reading from `siteConfig`, since `siteConfig.name` is the "RasmusOS" placeholder (D-05)

## Deviations from Plan

None - plan executed exactly as written. One environmental setup step was required but is not a deviation from the plan's code: this worktree had no `node_modules/` or `.velite/` build artifacts present, so `npm install` and `npx velite build` were run first to make `npx tsc --noEmit` resolvable (the `#site/content` virtual module Velite generates). Both are standard build prerequisites already documented in the codebase (`next.config.mjs` wires Velite automatically on `next dev`/`next build`), not code changes, and neither is committed as part of this plan (`.velite` is gitignored, `node_modules` is gitignored).

## Issues Encountered
- Initial `npx tsc --noEmit` run failed on pre-existing files (`src/lib/posts.ts`, `src/lib/related-posts.ts`, `src/components/blog/PostListRow.tsx`) with "Cannot find module '#site/content'" — this is Velite's generated virtual module, produced only after a Velite build runs. Ran `npx velite build` to generate `.velite/`, after which `tsc --noEmit` exited 0 cleanly. Not a bug in this plan's files; purely a fresh-worktree bootstrap step.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All three SEO file-convention routes exist, type-check cleanly, and match the plan's verified patterns exactly
- Runtime confirmation (sitemap.xml/robots.txt/og-image actually served correctly in a production build) is deferred to plan 03-06 per this plan's own success criteria
- No blockers for subsequent Phase 3 plans

---
*Phase: 03-seo-foundation-launch*
*Completed: 2026-07-14*

## Self-Check: PASSED

- FOUND: src/app/opengraph-image.tsx
- FOUND: src/app/sitemap.ts
- FOUND: src/app/robots.ts
- FOUND: .planning/phases/03-seo-foundation-launch/03-02-SUMMARY.md
- FOUND commit: cca3fda
- FOUND commit: 86a8022
