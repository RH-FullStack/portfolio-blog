---
phase: 02-blog-content-system
verified: 2026-07-13T23:45:00Z
status: human_needed
score: 11/11 must-haves verified
overrides_applied: 0
---

# Phase 2: Blog & Content System Verification Report

**Phase Goal:** Visitors can browse, read, and discover blog posts written as git-committed MDX files with syntax-highlighted code and tag-based navigation, and Rasmus can publish a new post with zero manual boilerplate.
**Verified:** 2026-07-13T23:45:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor browses a blog list view showing title, date, excerpt, reading time, and tags (BLOG-01, D-01) | ✓ VERIFIED | `src/app/(site)/blog/page.tsx` maps `getAllPosts()` to full `<PostListRow>` rows; rendered HTML at `/blog` confirmed via `next build` static output. Empty state ("No posts yet") present but currently unused (3 real posts). |
| 2 | Visitor reads an individual blog post rendered from git-committed MDX, with syntax-highlighted code blocks (BLOG-02/BLOG-03) | ✓ VERIFIED | `src/app/(site)/blog/[slug]/page.tsx` renders `<Prose><MDXContent code={post.code} /></Prose>`; built HTML for `/blog/why-i-write-code-toward-japan` contains `data-theme="github-light github-dark"` on code spans and `pre[data-theme]` layout CSS (padding/border-radius/overflow-x) confirmed present in `globals.css` and applied in output. |
| 3 | Visitor browses a tag archive to filter posts by topic/pillar (BLOG-04, D-03) | ✓ VERIFIED | `src/app/(site)/blog/tags/[tag]/page.tsx` generates 5 static tag pages (`aikido`, `entrepreneurship`, `investing`, `japan`, `software`) via `generateStaticParams` over `getAllTags()`; no `/blog/tags` index page exists (D-03 confirmed: `test ! -f` passes). |
| 4 | Visitor sees related posts (by shared tags) at the end of a blog post (BLOG-05) | ✓ VERIFIED | `getRelatedPosts(post, getAllPosts())` wired into the post page; built HTML for `why-i-write-code-toward-japan` shows a "Related Posts" section linking to the other two real posts (`starting-to-invest-at-thirty`, `what-aikido-taught-me-about-shipping`) — genuine tag-overlap matches, not placeholders. |
| 5 | Rasmus publishes a new post by writing an MDX file + frontmatter and running `git push`, with no manual boilerplate (BLOG-06) | ✓ VERIFIED | Slug is filename-derived (no `slug` frontmatter field required); `content/posts/*.mdx` contains only title/date/tags/excerpt/draft. Live-tested: adding a schema-invalid MDX file (missing `title`) to `content/posts/` and running `npx next build` fails the build with `Error: Schema validation failed.` (threat T-02-01 confirmed live, not just per SUMMARY claim); removing the bad file restores a clean build. |
| 6 | Draft filtering is applied in exactly one place (D-11) | ✓ VERIFIED | `src/lib/posts.ts` has exactly one `!p.draft` filter inside unexported `getPublishedPosts()`; all exported functions route through it. `related-posts.ts` has a defensive secondary `!p.draft` filter (documented as intentional defense-in-depth in 02-REVIEW.md IN-01, not a violation). |
| 7 | All blog routes are statically generated with `dynamicParams = false`; unknown slugs/tags 404, drafts never get a static path | ✓ VERIFIED | Both `[slug]` and `tags/[tag]` routes set `export const dynamicParams = false` and source `generateStaticParams` exclusively from `lib/posts.ts` (never raw `#site/content`), confirmed via grep and `next build` output (3 slugs, 5 tags, matching real published content exactly). |
| 8 | Heading anchor links are visible and keyboard-reachable (D-13) | ✓ VERIFIED | Post-fix `velite.config.ts` configures `rehypeAutolinkHeadings` with `behavior: 'append'`, visible `#` glyph, `aria-label`, no `aria-hidden`/`tabIndex=-1`. Built HTML confirms: `<a class="heading-anchor" aria-label="Link to this heading" href="#...">#</a>`. `.heading-anchor` CSS present with hover/focus-visible states and 44px hit target. |
| 9 | Code blocks have layout CSS (no mobile overflow) | ✓ VERIFIED | `pre[data-theme] { overflow-x: auto; border-radius: 0.5rem; padding: 1rem; }` present in `globals.css`, confirmed applied to built `<pre>` output. |
| 10 | `npm run lint` passes (no blocking errors) | ✓ VERIFIED | `npm run lint` → 0 errors, 1 pre-existing info-level warning (anonymous default export in `next.config.mjs`, explicitly out of scope per 02-REVIEW.md IN-04). |
| 11 | Interactive tag/title links use consistent focus-visible styling with the rest of the site | ✓ VERIFIED | `Tag.tsx` and `PostListRow.tsx` both carry `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion` matching `Button.tsx`'s established convention. |

**Score:** 11/11 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `velite.config.ts` | posts collection schema (D-09), filename-derived slug, mdx plugin wiring | ✓ VERIFIED | Schema matches exactly (title/date/tags/excerpt/draft/metadata/code); `rehypeSlug` before `rehypeAutolinkHeadings`, then `rehypePrettyCode`; no `s.excerpt()`/`s.slug()`. |
| `next.config.mjs` | top-level-await Velite build trigger, Turbopack-safe | ✓ VERIFIED | Contains `await import('velite')`, `VELITE_STARTED` guard, `strict: true`. Live-tested: fails `next build` on malformed frontmatter. |
| `tsconfig.json` | `#site/content` alias | ✓ VERIFIED | `"#site/content": ["./.velite"]` present. |
| `src/app/globals.css` | dual-theme code CSS, heading-anchor CSS, pre layout CSS | ✓ VERIFIED | All three rule sets present and keyed to `.dark` class (not media query). |
| `src/lib/posts.ts` | getAllPosts/getPostBySlug/getPostsByTag/getAllTags | ✓ VERIFIED | All four exported, single draft filter, sorted correctly. |
| `src/lib/related-posts.ts` | getRelatedPosts (D-05/D-06/D-08) | ✓ VERIFIED | Ranking + backfill algorithm implemented; 5 tests passing (`npm test`). |
| `src/components/ui/Tag.tsx` | linkable Tag variant (D-02) | ✓ VERIFIED | `href?` prop; internal `next/link` when present, `<span>` otherwise; no `rel`/external handling. |
| `src/components/mdx/MDXContent.tsx` | Velite code-string renderer | ✓ VERIFIED | Evaluates `new Function(code)` against `react/jsx-runtime`; lint-clean (WR-01 fixed). |
| `src/components/blog/PostListRow.tsx` | full/compact row (D-01/D-07/D-17) | ✓ VERIFIED | `compact` prop branches correctly; UTC-fixed date formatting; hairline divider present. |
| `src/app/(site)/blog/page.tsx` | blog index route | ✓ VERIFIED | Present, wired, builds. |
| `src/app/(site)/blog/[slug]/page.tsx` | post detail route | ✓ VERIFIED | Present, wired, builds; 3 static paths generated. |
| `src/app/(site)/blog/tags/[tag]/page.tsx` | tag archive route | ✓ VERIFIED | Present, wired, builds; 5 static paths generated; no `/blog/tags` index page. |
| `src/app/(site)/page.tsx` | homepage Latest Writing teaser | ✓ VERIFIED | `LATEST_POSTS = getAllPosts().slice(0, 3)`, compact `PostListRow` rows, "View all posts" CTA to `/blog`, placed below Featured Projects, no `Card` reuse. |
| `content/posts/*.mdx` (3 files) | real launch content | ✓ VERIFIED | All 3 posts exist, `draft: false`, schema-valid, ≥300 words each, ≥2 `##` headings each, one contains a fenced code block, tags overlap genuinely (`japan` ×3, `software` ×2). |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `next.config.mjs` | `.velite/index.js` | top-level await `build()` | ✓ WIRED | Confirmed via successful `next build` and live schema-failure test. |
| `velite.config.ts` mdx plugins | heading anchors + highlighted code | rehypeSlug → rehypeAutolinkHeadings → rehypePrettyCode | ✓ WIRED | Correct order confirmed in file; output HTML has both `id` attrs and `data-theme` attrs. |
| `src/lib/posts.ts` | `#site/content` | `import { posts } from '#site/content'` | ✓ WIRED | Confirmed. |
| all query functions | `getPublishedPosts()` | internal call | ✓ WIRED | Single draft-filter accessor confirmed (exactly 1 occurrence of `!p.draft` in posts.ts). |
| `blog/page.tsx` | `getAllPosts()` → `PostListRow` | map | ✓ WIRED | Confirmed in source + build output. |
| `blog/[slug]/page.tsx` | `MDXContent` + `getRelatedPosts` | render + related | ✓ WIRED | Confirmed in source + built HTML (real related-post links rendered). |
| `blog/tags/[tag]/page.tsx` | `generateStaticParams` over `getAllTags()` | static tag set | ✓ WIRED | Confirmed: 5 static tag pages generated matching real tag set. |
| `PostListRow.tsx` | `/blog/[slug]` | `next/link href` | ✓ WIRED | Confirmed. |
| `PostListRow.tsx` | `/blog/tags/[tag]` via linkable `Tag` | `<Tag href=...>` | ✓ WIRED | Confirmed. |
| `page.tsx` (homepage) | `getAllPosts().slice(0, 3)` → `PostListRow compact` | module constant + map | ✓ WIRED | Confirmed. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|---------------------|--------|
| `blog/page.tsx` | `posts` | `getAllPosts()` → Velite `#site/content` → 3 real MDX files | Yes | ✓ FLOWING |
| `blog/[slug]/page.tsx` | `post`, `related` | `getPostBySlug`, `getRelatedPosts` over real posts | Yes | ✓ FLOWING |
| `blog/tags/[tag]/page.tsx` | `posts` | `getPostsByTag(tag)` over real posts | Yes | ✓ FLOWING |
| `page.tsx` (homepage) | `LATEST_POSTS` | `getAllPosts().slice(0, 3)` over real posts | Yes | ✓ FLOWING |

No hollow props or disconnected data sources found — all routes render against the 3 real, published launch posts, not empty/static fallbacks.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Static build generates all routes | `npx next build` | 3 `/blog/[slug]` paths, 5 `/blog/tags/[tag]` paths, `/blog` index — all generated | ✓ PASS |
| Malformed frontmatter fails the build (BLOG-06 guardrail / T-02-01) | Added a temp MDX file missing `title`, ran `npx next build` | Build failed: `Error: Schema validation failed.` at `next.config.mjs:8:3` | ✓ PASS |
| Test suite passes | `npm test` | 5/5 tests passing (related-posts ranking) | ✓ PASS |
| Typecheck passes | `npx tsc --noEmit` | No errors | ✓ PASS |
| Lint passes | `npm run lint` | 0 errors, 1 pre-existing out-of-scope warning | ✓ PASS |
| Syntax highlighting renders in output | grep built HTML for `data-theme` | `data-theme="github-light github-dark"` present on code spans | ✓ PASS |
| Heading anchors render visibly | grep built HTML for `.heading-anchor` | `<a class="heading-anchor" aria-label="Link to this heading" href="#...">#</a>` present | ✓ PASS |
| Repo left clean after live schema-failure test | `git status --short` post-test | Only pre-existing unrelated uncommitted changes remain (`.gitignore`, `public/hero.jpg`, `src/lib/site-config.ts`, untracked images) | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
|-------------|----------------|--------------|--------|----------|
| BLOG-01 | 02-05, 02-06 | Blog list view (title, date, excerpt, reading time, tags) + homepage teaser | ✓ SATISFIED | `/blog` route + homepage "Latest Writing" section, both verified above. |
| BLOG-02 | 02-03, 02-05 | Individual post page rendered from git-committed MDX | ✓ SATISFIED | `MDXContent` + `blog/[slug]/page.tsx`, verified above. |
| BLOG-03 | 02-01, 02-05 | Syntax-highlighted code blocks | ✓ SATISFIED | rehype-pretty-code wiring + dual-theme CSS + layout CSS, verified in built HTML. |
| BLOG-04 | 02-02, 02-05 | Tag archive to filter posts by topic/pillar | ✓ SATISFIED | `getPostsByTag`/`getAllTags` + `blog/tags/[tag]/page.tsx`, 5 real tag pages generated. |
| BLOG-05 | 02-02, 02-05 | Related posts by shared tags | ✓ SATISFIED | `getRelatedPosts` (tested, 5/5 passing) + rendered in post page with genuine matches. |
| BLOG-06 | 02-01, 02-04 | Zero-boilerplate publish workflow (write MDX + frontmatter, git push) | ✓ SATISFIED | Filename-derived slug, no manual boilerplate fields, strict schema validation fails build on error (live-tested), 3 real posts published end-to-end via the workflow. |

No orphaned requirements — all 6 BLOG-0X IDs from REQUIREMENTS.md appear in at least one plan's `requirements` frontmatter field, and all are backed by verified evidence.

### Anti-Patterns Found

None. Scanned all phase-modified files (`src/lib/posts.ts`, `src/lib/related-posts.ts`, `src/components/ui/Tag.tsx`, `src/components/mdx/MDXContent.tsx`, `src/components/blog/PostListRow.tsx`, all three blog routes, homepage, `velite.config.ts`, `next.config.mjs`) for TODO/FIXME/placeholder/empty-implementation patterns — zero matches.

The code review (`02-REVIEW.md`) found 4 warnings (WR-01..WR-04), all of which were subsequently fixed and verified in `02-REVIEW-FIX.md` and independently re-confirmed here against the current codebase (lint clean, code-block CSS present, heading anchors visible, focus-visible consistent). The 4 remaining info-level items (IN-01..IN-04) are minor and explicitly out of scope / non-blocking (documented defensive redundancy, missing URL-encoding edge case for hypothetical future tags, a magic-number comment, and a stylistic ESLint warning).

## Human Verification Required

### 1. Syntax highlighting visual quality in both light and dark mode

**Test:** Visit `/blog/why-i-write-code-toward-japan` in a browser, toggle the theme switcher between light and dark mode, and inspect the fenced TypeScript code block.
**Expected:** Code is legible and visually polished in both themes (github-light / github-dark color schemes), with no color contrast issues and a visible, appropriately-padded code block that doesn't overflow on narrow viewports.
**Why human:** Color rendering, contrast quality, and "does this look good" are visual judgments that cannot be verified via grep/build output — only that the correct CSS/data attributes are present and wired.

### 2. Heading anchor link behavior and hover/focus affordance

**Test:** Visit any blog post, hover over and tab-focus the "#" glyph next to a heading; click it.
**Expected:** The "#" is visible at rest (subtle, ~40% opacity per the fix), turns vermillion on hover/focus, shows a focus ring when tabbed to via keyboard, and clicking it updates the URL fragment and scrolls to the heading.
**Why human:** Keyboard-navigation flow and visual hover/focus affordance require interactive browser testing, not static analysis.

### 3. Tag archive and related-posts navigation flow

**Test:** From `/blog`, click a tag chip to reach `/blog/tags/[tag]`, then from a post page click a related-post row to navigate to another post.
**Expected:** Navigation feels smooth, tag chips and post-title links have a clear hover/focus state, and the overall reading flow (list → post → related → another post) feels cohesive, not disjointed.
**Why human:** End-to-end user-flow feel and navigation ergonomics are subjective/experiential and not programmatically verifiable.

### 4. Mobile responsiveness of code blocks and post layout

**Test:** View `/blog/why-i-write-code-toward-japan` on a narrow viewport (mobile width) and confirm the code block scrolls horizontally rather than breaking the page layout.
**Expected:** `overflow-x: auto` on `pre[data-theme]` produces a horizontal scrollbar within the code block on narrow screens, without the block bleeding outside the `Prose` container.
**Why human:** Responsive layout behavior at actual viewport widths needs visual/device testing; the CSS property's presence was confirmed, but its rendered effect on real narrow viewports was not.

### Gaps Summary

No gaps — all must-haves (roadmap Success Criteria + plan-level must_haves) verified against the current codebase, all automated checks (typecheck, lint, tests, static build) pass, and a live schema-failure test independently confirmed the BLOG-06 build-time validation guardrail. The four human-verification items above are standard visual/UX polish checks appropriate for a phase whose goal is fundamentally about visitor-facing browsing/reading experience — they do not indicate any functional gap, only that visual quality and interaction feel have not yet been eyeballed by a human in a browser.

---

*Verified: 2026-07-13T23:45:00Z*
*Verifier: Claude (gsd-verifier)*
