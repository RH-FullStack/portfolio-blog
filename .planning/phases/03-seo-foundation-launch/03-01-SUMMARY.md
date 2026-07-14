---
phase: 03-seo-foundation-launch
plan: 01
subsystem: seo
tags: [nextjs, metadata-api, app-router, seo, generateMetadata]

# Dependency graph
requires:
  - phase: 02-blog-content-system
    provides: getPostBySlug/getAllPosts/getAllTags draft-safe query layer (src/lib/posts.ts), blog dynamic routes
provides:
  - Root layout title template ("%s — Rasmus Hansen") with default and OG/Twitter defaults
  - Static metadata exports on about/projects/contact/blog/not-found pages
  - generateMetadata on blog/[slug] (post.excerpt as description, canonical URL) and blog/tags/[tag] (hand-authored template)
affects: [03-02-favicon-og-image, 03-04-homepage-metadata, seo-foundation-launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Root layout owns title.template; inner pages export bare title strings (no manual '— Rasmus Hansen' suffix)"
    - "Dynamic route metadata reuses the same draft-safe query functions (getPostBySlug) already used by the page body — never import raw Velite content directly in generateMetadata"

key-files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/app/(site)/about/page.tsx
    - src/app/(site)/projects/page.tsx
    - src/app/(site)/contact/page.tsx
    - src/app/(site)/blog/page.tsx
    - src/app/not-found.tsx
    - src/app/(site)/blog/[slug]/page.tsx
    - src/app/(site)/blog/tags/[tag]/page.tsx

key-decisions:
  - "Homepage (src/app/(site)/page.tsx) deliberately left untouched per plan scope — its title/description are owned by the root layout default and plan 03-04 respectively"
  - "404 page relies on Next.js's automatic noindex robots response; no manual robots config added"

patterns-established:
  - "Metadata title values are bare strings on all inner pages; the em-dash suffix comes exclusively from the root layout's title.template"

requirements-completed: [SEO-01]

# Metrics
duration: 2min
completed: 2026-07-14
---

# Phase 3 Plan 01: Metadata API Wiring Summary

**Next.js App Router Metadata API wired site-wide — root title template + OG/Twitter defaults, static metadata on 5 inner pages, generateMetadata on both dynamic blog routes.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-07-14T10:00:09Z
- **Completed:** 2026-07-14T10:02:07Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- Root layout (`src/app/layout.tsx`) now exports a title template (`%s — Rasmus Hansen`), a rename-proof default title, a site-wide description, and matching openGraph/twitter metadata blocks — `metadataBase` preserved verbatim.
- All five inner static pages (about, projects, contact, blog, not-found) export bare-title + description metadata that inherits the root template automatically.
- Both dynamic blog routes (`blog/[slug]`, `blog/tags/[tag]`) export `generateMetadata`: post pages reuse the draft-safe `getPostBySlug` lookup and use the post's `excerpt` verbatim as the description plus a root-relative canonical URL; tag pages use a hand-authored title/description template.

## Task Commits

Each task was committed atomically:

1. **Task 1: Root layout — title template, site-wide description, OG/Twitter defaults** - `f68ed88` (feat)
2. **Task 2: Static metadata exports on inner pages (about, projects, contact, blog, not-found)** - `1d764a4` (feat)
3. **Task 3: generateMetadata on the two dynamic blog routes** - `8ea0566` (feat)

_No plan-metadata commit yet — this SUMMARY.md and REQUIREMENTS.md are committed together after this file is written (worktree mode: STATE.md/ROADMAP.md excluded, owned by orchestrator)._

## Files Created/Modified
- `src/app/layout.tsx` - Title template, default, description, openGraph/twitter defaults added to root metadata export
- `src/app/(site)/about/page.tsx` - Added `metadata` export (bare title "About" + description)
- `src/app/(site)/projects/page.tsx` - Added `metadata` export (bare title "Projects" + description)
- `src/app/(site)/contact/page.tsx` - Added `metadata` export (bare title "Contact" + description)
- `src/app/(site)/blog/page.tsx` - Added `metadata` export (bare title "Blog" + description)
- `src/app/not-found.tsx` - Added `metadata` export (bare title "Page Not Found" + description)
- `src/app/(site)/blog/[slug]/page.tsx` - Added `generateMetadata` using `getPostBySlug`, `post.excerpt` as description, `alternates.canonical`
- `src/app/(site)/blog/tags/[tag]/page.tsx` - Added `generateMetadata` with hand-authored tag title/description template

## Decisions Made
- Homepage was intentionally not touched (owned by plan 03-04, per the plan's explicit NOTE) — its title falls back to the root layout's default.
- No `openGraph.images` key added to the root layout — the site-wide OG image is supplied automatically by the `opengraph-image.tsx` file convention landing in plan 03-02.

## Deviations from Plan

None - plan executed exactly as written. One pre-existing environment condition was encountered and resolved without code changes (see Issues Encountered below).

## Issues Encountered
`npx tsc --noEmit` initially reported 8 errors, all pre-existing and unrelated to this plan's changes: `#site/content` (Velite's generated content module) had not yet been built in this fresh worktree checkout, so TypeScript couldn't resolve the module used by `src/lib/posts.ts`, `src/lib/related-posts.ts`, and `src/components/blog/PostListRow.tsx`. Confirmed via `git stash` that the same 8 errors exist with none of this plan's edits applied. Ran `npx velite --config velite.config.ts` (build-only, no code change) to generate the `.velite`/`#site/content` output, after which `npx tsc --noEmit` exited 0 with zero errors. `.velite` is git-ignored build output, not a tracked artifact, so nothing was committed for this fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- SEO-01 (titles/descriptions half) complete for every page except the homepage: all inner pages and both dynamic blog routes have accurate, brand-rename-proof metadata; blog posts reuse `excerpt` with zero extra authoring burden.
- Plan 03-02 (favicon/OG image) and 03-04 (homepage metadata) can proceed independently — no blockers introduced by this plan.
- `npx tsc --noEmit` passes cleanly after a fresh `velite` build; future executors in fresh worktrees/checkouts should expect the same one-time `#site/content` resolution step if they hit the same pre-existing error set.

---
*Phase: 03-seo-foundation-launch*
*Completed: 2026-07-14*

## Self-Check: PASSED

All 8 modified files and the SUMMARY.md itself verified present on disk. All 3 task commit hashes (f68ed88, 1d764a4, 8ea0566) verified present in git log.
