# Phase 2: Blog & Content System - Research

**Researched:** 2026-07-13
**Domain:** Git-based MDX content layer (Velite) on Next.js 16 App Router, syntax-highlighted code, tag taxonomy, build-time related-posts ranking
**Confidence:** HIGH (Velite API/config surface verified via Context7 `/zce/velite` docs; Next.js 16 + Turbopack wiring cross-verified via WebSearch + official velite.js.org; package versions verified via `npm view`)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Blog Index & Tag Styling**
- D-01: Blog index (`/blog`) uses a plain text list — no card chrome or images. Large clickable title headline per post, metadata row beneath (date · reading time · tags), thin divider between posts. Deliberately distinct from the image-driven Projects card grid — leans into the "ma" whitespace philosophy (Phase 1 D-04).
- D-02: Blog tags are styled neutrally, reusing the existing `Tag` component's visual treatment (neutral secondary surface) — not color-coded per pillar. Vermillion accent stays reserved for interactive/emphasis states only (Phase 1 D-01).
- D-03: Tag archive is per-tag pages only (`/blog/tags/[tag]`), reached by clicking a tag on a post or list row. No standalone `/blog/tags` overview/index page — not justified with only 4 pillars at launch.
- D-04: A post's frontmatter `tags` field accepts an array — multiple pillar tags per post are allowed.

**Related Posts Behavior**
- D-05: Show up to 3 related posts at the end of each post, matched by shared tags.
- D-06: If a post has fewer than 3 shared-tag matches, fill remaining slots with the most recent other posts (excluding the current one) — the section should never look broken or empty, even with only 2-3 total posts at launch.
- D-07: Related-post entries are compact: title + date only. No excerpt/tags repeated.
- D-08: Ranking weights posts by tag-overlap count (more shared tags = higher rank), ties broken by recency. This is a build-time computation (array intersection size), not runtime.

**Post Page & Authoring Workflow**
- D-09: Frontmatter schema: `title`, `date`, `tags` (array), `excerpt`, `draft` (boolean). No `coverImage` field.
- D-10: Excerpt is a manually-written frontmatter field (not auto-derived from post body).
- D-11: `draft: true` frontmatter flag excludes a post from all public views (list, tags, related, sitemap) without needing to delete or move the file.
- D-12: No byline on post pages ("By Rasmus Hansen").
- D-13: Add clickable heading anchor links via `rehype-slug` + `rehype-autolink-headings`, wired into Velite's `mdx.rehypePlugins`.
- D-14 (launch content plan): Rasmus will have 2-3 real posts at launch, covering at least 2 different content pillars. Claude drafts the actual MDX content (structure + prose) grounded in PROJECT.md's developer/aikidoka/investor journey and the four content pillars — Rasmus reviews, edits, and approves each draft before it's committed as a real (non-draft) post. This is a content-authoring task within the phase plan, not just a technical build task.

**Homepage Latest-Post Teaser**
- D-15: Add the homepage "latest writing" teaser now (carried forward from Phase 1's deferred D-07).
- D-16: Shows 3 posts, placed below the existing featured-projects teaser.
- D-17: Same compact list style as the blog index/related-posts (title + date) — not the `Card` component used by the featured-projects teaser above it.
- D-18: Includes a "View all posts" link to `/blog`, consistent with the featured-projects teaser's "View all projects" link pattern.

### Claude's Discretion
- Exact component decomposition for the compact list style (D-01, D-07, D-17) — e.g., whether blog-index rows and related-post/homepage-teaser rows share one underlying component or are separate — is an implementation detail for planning, not decided here.
- Velite schema/config wiring specifics (collections, transforms for `readingTime`, cross-collection queries for related posts) — per the Phase 2 research flag in ROADMAP.md, this needed a dedicated research pass during planning. **This document is that research pass** — see Architecture Patterns and Code Examples below.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope. The one carried-forward item from Phase 1 (homepage latest-post teaser) was resolved within this phase's decisions (D-15..D-18), not deferred further.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BLOG-01 | Visitor can browse a blog list view showing title, date, excerpt, reading time, and tags for each post | Velite `posts` collection with `s.metadata()` (readingTime) + frontmatter `excerpt`/`tags`; `lib/posts.ts` query layer pattern; D-01 plain-list UI |
| BLOG-02 | Visitor can read an individual blog post page rendered from a git-committed MDX file | Velite `s.mdx()` + `MDXContent` render pattern; `content/posts/*.mdx` as source of truth; `dynamicParams = false` SSG pattern (inherited from ARCHITECTURE.md Pattern 3) |
| BLOG-03 | Code blocks in blog posts render with syntax highlighting | `rehype-pretty-code` wired into Velite's `mdx.rehypePlugins`; dual-theme CSS pattern adapted to this project's `.dark`-class theming (not `prefers-color-scheme`) |
| BLOG-04 | Visitor can browse a tag archive to filter posts by topic/pillar | `getPostsByTag()` query function + `generateStaticParams` over the unique tag set; D-03 per-tag pages only |
| BLOG-05 | Visitor sees related posts (by shared tags) at the end of a blog post | Build-time tag-overlap ranking helper (`lib/related-posts.ts`) consumed inside the Server Component; D-05/D-06/D-08 ranking rules |
| BLOG-06 | Rasmus can publish a new post via a low-friction workflow (write an MDX file with frontmatter, git push) with no manual boilerplate per post | Filename-derived slug (no manual `slug` frontmatter field), Velite Zod validation catches malformed frontmatter at build time, draft flag for in-progress posts |
</phase_requirements>

## Summary

This phase's only genuinely new technical surface is the Velite content pipeline — every other piece (layout, design tokens, `Tag`/`Prose`/`Container` primitives, Server Component page shape) already exists from Phase 1 and is reused as-is. The core risk flagged by the roadmap (Velite's Next.js wiring) is now resolved: **Next.js 16 defaults to Turbopack in dev**, and Velite's own docs explicitly warn that its Webpack-plugin integration path does not reliably work under Turbopack. The correct pattern for this project is the **top-level-await wiring in `next.config.mjs`** (not `next.config.ts`, and not the Webpack-plugin pattern) — verified directly against Velite's official Next.js integration guide and cross-checked via WebSearch against community reports of the same Turbopack incompatibility.

A second load-bearing discovery: Velite's `s.metadata()` schema field natively computes `readingTime` and `wordCount` from the document body at build time — this makes the separately-recommended `reading-time` npm package (per `.planning/research/STACK.md`) **redundant** for this phase's actual need. This document recommends dropping that dependency in favor of the built-in schema field (see Alternatives Considered).

A third project-specific nuance not covered by any generic Velite/rehype-pretty-code tutorial: this project's dark mode is a **manual class toggle** (`next-themes` with `attribute="class"`, already wired in `ThemeProvider.tsx`), not an OS-level `prefers-color-scheme` media query. `rehype-pretty-code`'s official dual-theme CSS snippet keys off `@media (prefers-color-scheme: dark)`, which would silently ignore the user's manual light/dark toggle for code blocks specifically (code blocks would follow OS theme while the rest of the page follows the user's explicit choice). The CSS must be adapted to key off the `.dark` class selector instead, mirroring the existing `@custom-variant dark` pattern in `globals.css`.

**Primary recommendation:** Use Velite 0.4.0 with a single `posts` collection (`s.mdx()` body, Zod-validated frontmatter, filename-derived `slug` via `context().file.path`, `s.metadata()` for reading time), wired into `next.config.mjs` via the top-level-await pattern, with `rehype-pretty-code` + `rehype-slug` + `rehype-autolink-headings` + `remark-gfm` in the `mdx` (not `markdown`) config block, dual Shiki themes styled with a `.dark`-class selector, and a plain `lib/related-posts.ts` helper (not a Velite `prepare` hook) computing the D-08 tag-overlap ranking at Server Component render time during `next build`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| MDX parsing, frontmatter validation, syntax highlighting (build-time) | Build tooling (Velite, run via `next.config.mjs`) | — | Runs entirely at `next build`/`next dev` startup, before any React tree exists; owns all filesystem/content-schema concerns |
| Post listing, tag filtering, related-posts ranking | API/Backend tier (Server Components) | — | No client JS; `lib/posts.ts` + `lib/related-posts.ts` are plain server-only functions called directly inside Server Component page files, per ARCHITECTURE.md's established Anti-Pattern-1 guidance (never do content reads in Client Components) |
| Post rendering (MDX → JSX), code block highlighting output, heading anchors | Frontend Server (SSR/SSG) | Browser (styling only) | `MDXContent` renders server-side to static HTML; `rehype-pretty-code`'s output is plain HTML with data attributes styled via CSS — zero client JS shipped for highlighting |
| Blog index / tag archive / related-posts UI (plain list styling) | Browser / Client (presentation only) | Frontend Server (renders it) | Purely presentational Tailwind markup; no interactivity requiring `"use client"` — D-01/D-03 explicitly rule out any client-side filter widget |
| Homepage latest-writing teaser | Frontend Server (SSR/SSG) | — | Same Server Component pattern as the existing featured-projects teaser; reads from the same `lib/posts.ts` query layer |
| CDN / Static | CDN / Static (Vercel) | — | Final HTML for all blog routes is static output (`dynamicParams = false`), served from Vercel's CDN with zero server compute per request, matching CLAUDE.md's "no `output: 'export'`" + Anti-Pattern 4 (no ISR/revalidation needed) constraints |

## Standard Stack

### Core

| Library | Version (verified) | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `velite` | 0.4.0 [VERIFIED: npm registry] | Type-safe MDX content layer: Zod-validated frontmatter, `.velite` typed output, computed fields | Already locked by STACK.md/CLAUDE.md/CONTEXT.md as the project's content pipeline; this research adds the concrete wiring |
| `rehype-pretty-code` | 0.14.4 [VERIFIED: npm registry] | Shiki-powered syntax highlighting, compiled to static HTML at build time | Zero client JS; unstyled data-attribute output matches the hand-crafted design goal |
| `shiki` | 4.3.1 [VERIFIED: npm registry] | Highlighter engine (peer dep of rehype-pretty-code, range `^1.0.0 \|\| ^2.0.0 \|\| ^3.0.0 \|\| ^4.0.0`) [VERIFIED: `npm view rehype-pretty-code peerDependencies`] | Resolved automatically by npm; no explicit pin needed unless a shared `createHighlighter` instance is wanted later (not needed at 2-3 posts) |
| `remark-gfm` | 4.0.1 [VERIFIED: npm registry] | GitHub-flavored markdown (tables, strikethrough, autolinked URLs) | Table stakes for a technical blog |
| `rehype-slug` | 6.0.0 [VERIFIED: npm registry] | Adds `id` attributes to headings | Required precondition for `rehype-autolink-headings` (D-13) |
| `rehype-autolink-headings` | 7.1.0 [VERIFIED: npm registry] | Adds clickable anchor links to headings that already have an `id` | Must run **after** `rehype-slug` in the plugin array — it looks up existing `id`s, does not generate them [VERIFIED: WebSearch, rehypejs/rehype-autolink-headings official README example ordering] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `reading-time` | 1.5.0 [VERIFIED: npm registry] | Word-count-based reading time estimate | **Optional / likely unnecessary** — see Alternatives Considered. Only install if `s.metadata()`'s built-in `readingTime` (rounds to whole minutes, no configurable words-per-minute) proves insufficient. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `reading-time` npm package (per STACK.md) | Velite's built-in `s.metadata()` schema, which returns `{ readingTime: number, wordCount: number }` computed directly from the MDX body [VERIFIED: Context7 `/zce/velite`, `docs/guide/velite-schemas.md`] | `s.metadata()` requires zero extra dependency and zero custom `transform` code — just add `metadata: s.metadata()` to the schema and read `post.metadata.readingTime`. Only reach for the `reading-time` package if you need the human-readable string format (e.g. "5 min read") pre-formatted, custom words-per-minute tuning, or rounding behavior different from Velite's default — none of which this phase's requirements (BLOG-01: "reading time" as a display value) call for. **Recommendation: skip `reading-time`, use `s.metadata()`.** |
| `s.slug('posts')` (validates an explicit frontmatter `slug` field) | Filename-derived slug via `context().file.path` in a `.transform()` | D-09's frontmatter schema has no `slug` field, and BLOG-06 requires zero manual boilerplate per post — requiring authors to hand-type a `slug:` field (and keep it unique/synced with the filename) is exactly the friction Pitfall 7 (research/PITFALLS.md) warns against. Filename-derived slug means the post's filename *is* the URL, with no duplicated data to keep in sync. |
| Global (`@media (prefers-color-scheme: dark)`) dual-theme CSS from rehype-pretty-code's own docs | `.dark`-class-scoped selector, matching this project's existing `@custom-variant dark (&:where(.dark, .dark *))` | This project's dark mode is a manual `next-themes` class toggle (`ThemeProvider.tsx`, `attribute="class"`), not OS-preference-only. Using the media-query CSS verbatim from rehype-pretty-code's docs would make code blocks ignore the user's manual toggle. Must rewrite the selector to key off `.dark` instead of the media query. |

**Installation:**
```bash
npm install velite remark-gfm rehype-pretty-code rehype-slug rehype-autolink-headings
# reading-time intentionally omitted — see Alternatives Considered above.
# shiki is resolved automatically as rehype-pretty-code's peer dependency; no separate install needed.
```

**Version verification:** All versions above confirmed via `npm view <package> version` on 2026-07-13 (see table). These match `.planning/research/STACK.md`'s recommended majors/minors closely; no material drift found.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    BUILD TIME (next dev / next build)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  content/posts/*.mdx (frontmatter: title, date, tags, excerpt, draft)     │
│         │                                                                 │
│         ▼                                                                │
│  next.config.mjs (top-level await) triggers `velite build`               │
│         │                                                                 │
│         ▼                                                                │
│  velite.config.ts:                                                       │
│    - Zod schema validates frontmatter (build FAILS on bad data)          │
│    - mdx: { remarkPlugins: [remark-gfm],                                 │
│             rehypePlugins: [rehype-slug, rehype-autolink-headings,       │
│                             rehype-pretty-code] }   ◄── ORDER MATTERS    │
│    - s.mdx() compiles body → function-body code string                  │
│    - s.metadata() computes { readingTime, wordCount }                   │
│    - .transform() derives `slug` from context().file.path                │
│         │                                                                 │
│         ▼                                                                │
│  .velite/index.js + index.d.ts  (typed `posts` array — import via        │
│    tsconfig path alias, e.g. `@/.velite`)                                 │
│         │                                                                 │
│         ▼                                                                │
│  lib/posts.ts   ── getAllPosts() / getPostsByTag() / getAllTags()        │
│                     (all filter out draft:true — D-11)                   │
│  lib/related-posts.ts ── getRelatedPosts(post) (D-05/D-06/D-08 ranking)  │
│         │                                                                 │
│         ▼                                                                │
│  generateStaticParams() over posts + tags                                │
│         │                                                                 │
│         ▼                                                                │
│  MDXContent (Server Component) renders post.code → JSX, styled via       │
│    Prose wrapper + rehype-pretty-code data-attribute CSS                 │
│         │                                                                 │
│         ▼                                                                │
│  Static HTML per /blog, /blog/[slug], /blog/tags/[tag] route             │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                REQUEST TIME (Vercel CDN — no server compute)             │
│  Visitor requests /blog/my-post → served as pre-rendered static HTML     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
content/
└── posts/
    ├── my-first-post.mdx       # flat files — no per-post subfolders (keeps slug derivation trivial)
    └── another-post.mdx
velite.config.ts                # collections + mdx plugin wiring (see Code Examples)
next.config.mjs                 # renamed from next.config.ts — top-level-await Velite wiring
src/
├── lib/
│   ├── posts.ts                 # getAllPosts(), getPostBySlug(), getPostsByTag(), getAllTags()
│   └── related-posts.ts         # getRelatedPosts(post, allPosts) — D-05/D-06/D-08 ranking
├── components/
│   ├── mdx/
│   │   └── MDXContent.tsx       # Velite's function-body → React renderer + custom component map
│   └── blog/
│       └── PostListRow.tsx      # shared compact row (D-01 list row / D-07 related / D-17 homepage teaser)
└── app/(site)/
    ├── page.tsx                  # existing homepage — add latest-writing teaser section (D-15..D-18)
    └── blog/
        ├── page.tsx               # /blog index (D-01 plain list)
        ├── [slug]/page.tsx        # /blog/[slug] — post + related posts
        └── tags/[tag]/page.tsx    # /blog/tags/[tag] — D-03 per-tag archive, no index page
```

### Structure Rationale

- **Flat `content/posts/*.mdx` (no per-post subfolders):** Velite's own examples sometimes use `posts/2021-01-01-hello-world/index.md` (directory-per-post, useful for colocating post-specific images). This project's D-09 frontmatter has no `coverImage` field and no per-post image needs, so flat files keep the filename-derived slug logic simple (`context().file.path` parsing has no `index` segment to strip).
- **`next.config.mjs`, not `.ts`:** See Common Pitfalls — Turbopack + Velite wiring below. Converting is a zero-cost rename since the existing `next.config.ts` has no TypeScript-specific config (just an empty `NextConfig` object).
- **`lib/related-posts.ts` as a separate file from `lib/posts.ts`:** Keeps the D-08 ranking algorithm (tag-overlap count + recency tiebreak + recency backfill) isolated and independently testable from the simpler list/filter functions in `lib/posts.ts`.
- **`components/blog/PostListRow.tsx` as one shared component:** Per CONTEXT.md's "Claude's Discretion" note, the blog-index row (D-01), related-post row (D-07), and homepage-teaser row (D-17) all share the identical "title + date" compact visual spec — a single component with a boolean/variant prop (e.g., whether to also show excerpt/reading-time/tags for the full index vs. compact-only for related/teaser) avoids duplicating markup three times.

### Pattern 1: Velite + Next.js 16 wiring (top-level await in `next.config.mjs`)

**What:** Trigger Velite's build programmatically from `next.config.mjs`, guarded so it only runs once (Next.js re-evaluates config multiple times) and only during `dev`/`build`, not `start`.

**When to use:** Always for this project — this is the only wiring path confirmed compatible with Turbopack, which is Next.js 16's default dev bundler.

**Example:**
```javascript
// next.config.mjs
// Source: https://velite.js.org/guide/with-nextjs (Context7 /zce/velite, cross-verified WebSearch)
const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: isDev, clean: !isDev })
}

/** @type {import('next').NextConfig} */
export default {
  // existing next config options here
}
```

**Trade-offs:**
- Pro: True top-level `await` blocks config module evaluation until Velite's build completes — guarantees `.velite/index.js` exists before Next.js starts compiling any route that imports from it. No race condition.
- Con: Loses the `NextConfig` TypeScript import-type annotation available in `next.config.ts` (cosmetic only — use the `/** @type {import('next').NextConfig} */` JSDoc comment instead, as shown above, to keep editor type-checking).
- **Why not `next.config.ts` with `.then()` (the pattern Velite's own docs show for `.ts`):** That variant does **not** await the build — it fires the promise and moves on immediately, because Next's TypeScript config loader historically could not execute real top-level await. WebSearch surfaced [vercel/next.js#67765](https://github.com/vercel/next.js/issues/67765) confirming this was an open limitation, with a caveat that Node ≥22.18 with the native TypeScript resolver *may* now support true top-level await in `.ts` config files [MEDIUM confidence — WebSearch only, no official Next.js changelog entry confirming this fix date located this session]. This project's local Node is v24.13.0 (comfortably above that threshold), but **Vercel's build environment Node version is not independently confirmed in this session** — using `.mjs` sidesteps the question entirely and is the documented-safe path regardless of Node version. **Recommendation: rename to `next.config.mjs`, do not rely on `.ts` + top-level await.**

### Pattern 2: MDX schema + slug + reading time

**What:** A single `posts` Velite collection with Zod-validated frontmatter matching D-09 exactly, `s.mdx()` for the compiled body, `s.metadata()` for reading time, and a `.transform()` deriving `slug` from the file path (not from frontmatter).

**When to use:** This is the only collection needed for this phase (projects remain plain TS per Phase 1 — do not migrate `content/projects.ts` to Velite).

**Example:**
```typescript
// velite.config.ts
// Source: Context7 /zce/velite (docs/guide/quick-start.md schema shape,
// docs/guide/velite-schemas.md for s.metadata()/s.mdx(),
// docs/guide/define-collections.md for the context().file.path slug pattern)
import { defineConfig, s, context } from 'velite'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'

export default defineConfig({
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/*.mdx',
      schema: s
        .object({
          title: s.string().max(99),
          date: s.isodate(),
          tags: s.array(s.string()),
          excerpt: s.string(), // D-10: manual field, NOT s.excerpt() (which parses from body)
          draft: s.boolean().default(false),
          metadata: s.metadata(), // { readingTime, wordCount } — replaces `reading-time` package
          code: s.mdx(),
        })
        .transform((data) => ({
          ...data,
          // Filename-derived slug — no manual `slug` frontmatter field (BLOG-06).
          // context().file.path is the collection-relative path, e.g. 'posts/my-first-post.mdx'.
          slug: context()
            .file.path.replace(/^posts\//, '')
            .replace(/\.mdx$/, ''),
        })),
    },
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug, // MUST run before rehype-autolink-headings — generates heading `id`s
      rehypeAutolinkHeadings, // looks up existing `id`s, does not create them
      rehypePrettyCode, // order relative to slug/autolink doesn't matter — different node types (code vs headings)
    ],
  },
})
```

**Note on the `slug` transform:** This exact string-splitting expression is not lifted verbatim from Velite's docs (which show the *pattern* — "`path: context().file.path // or parse to filename based slug`" — but not a copy-paste implementation). Treat this specific regex as [ASSUMED] and verify with a throwaway `console.log` during Wave 0 that `context().file.path` returns the value this code assumes (collection-relative, forward-slash-separated, including the `posts/` prefix and `.mdx` extension) before committing to it across all query functions.

### Pattern 3: Rendering compiled MDX in a Server Component

**What:** Velite compiles MDX to a "function-body" code string (`s.mdx()`), not JSX — this string is `new Function()`'d at render time inside a small `MDXContent` component.

**Example:**
```tsx
// src/components/mdx/MDXContent.tsx
// Source: Context7 /zce/velite, docs/guide/using-mdx.md
import * as runtime from 'react/jsx-runtime'

const sharedComponents = {
  // global component overrides available in every post without per-post import
}

function useMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

export function MDXContent({
  code,
  components,
}: {
  code: string
  components?: Record<string, React.ComponentType>
}) {
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} />
}
```

```tsx
// src/app/(site)/blog/[slug]/page.tsx
import { posts } from '#site/content' // tsconfig path alias → .velite output
import { MDXContent } from '@/components/mdx/MDXContent'
import { Prose } from '@/components/ui/Prose'

export function generateStaticParams() {
  return posts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }))
}
export const dynamicParams = false // ARCHITECTURE.md Pattern 3 — 404 on unknown slugs, no SSR fallback

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug && !p.draft)
  if (!post) return null // unreachable given dynamicParams=false + generateStaticParams filter
  return (
    <Prose>
      <h1>{post.title}</h1>
      <MDXContent code={post.code} />
    </Prose>
  )
}
```

**tsconfig path alias** (add alongside the existing `@/*` alias):
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "#site/content": ["./.velite"]
    }
  }
}
```
[VERIFIED: Context7 `/zce/velite`, `docs/guide/using-collections.md`]

### Pattern 4: Related posts (D-05/D-06/D-08) — plain function, not a Velite `prepare` hook

**What:** Compute tag-overlap ranking as a plain TypeScript function called from the `[slug]/page.tsx` Server Component, operating on the already-loaded `posts` array. This still runs entirely at `next build` time (SSG) — no client runtime cost, satisfying D-08's "build-time computation, not runtime" requirement without needing Velite's `prepare` hook (which would bake `relatedSlugs` into the `.velite` JSON output instead — a valid but unnecessary extra layer of indirection for a "handful of posts" scale, per ARCHITECTURE.md's Scaling Considerations).

**Example:**
```typescript
// src/lib/related-posts.ts
import type { Post } from '#site/content'

export function getRelatedPosts(current: Post, allPosts: Post[], limit = 3): Post[] {
  const others = allPosts.filter((p) => p.slug !== current.slug && !p.draft)

  const scored = others
    .map((post) => ({
      post,
      overlap: post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap // D-08: more shared tags first
      return +new Date(b.post.date) - +new Date(a.post.date) // D-08: recency tiebreak
    })

  const withOverlap = scored.filter((s) => s.overlap > 0).map((s) => s.post)
  if (withOverlap.length >= limit) return withOverlap.slice(0, limit)

  // D-06: backfill with most-recent others (excluding already-selected) if fewer than `limit` tag matches
  const selectedSlugs = new Set(withOverlap.map((p) => p.slug))
  const backfill = others
    .filter((p) => !selectedSlugs.has(p.slug))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))

  return [...withOverlap, ...backfill].slice(0, limit)
}
```

### Anti-Patterns to Avoid

- **Installing `@next/mdx` alongside Velite:** Explicitly forbidden by CLAUDE.md ("Do not install `@next/mdx` alongside Velite") — two content pipelines solving the same problem.
- **Installing `gray-matter`:** Explicitly forbidden by CLAUDE.md — Velite's Zod schema already parses and validates frontmatter.
- **Using the `VeliteWebpackPlugin` pattern from Velite's own "snippets" doc:** This is Velite's *older* integration path and is documented (both by Velite and corroborated by WebSearch) as unreliable under Turbopack, which Next.js 16 uses by default for `next dev`. Use Pattern 1 (`next.config.mjs` top-level await) instead.
- **Using `s.slug('posts')` for the exposed post `slug`:** Requires a manually-authored `slug` frontmatter field not present in D-09's schema — reintroduces the exact per-post boilerplate BLOG-06 exists to eliminate.
- **Reaching for `s.excerpt()`:** This Velite schema *parses the excerpt from the markdown body*. D-10 requires excerpt to be a manually-written frontmatter field. Use `excerpt: s.string()` (a plain Zod string reading the frontmatter value), not `s.excerpt()`.
- **Filtering drafts only in the `[slug]/page.tsx` component:** D-11 requires drafts excluded from *all* public views (list, tags, related, sitemap). Filter once, centrally, inside every exported `lib/posts.ts` query function (`getAllPosts`, `getPostsByTag`, `getAllTags`) rather than re-filtering ad hoc in each page — mirrors ARCHITECTURE.md's "lib/ is the only layer allowed to touch content directly" boundary.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontmatter parsing/validation | Custom YAML parser + manual type guards | Velite's Zod-based `s.object()` schema | Build-time errors on malformed frontmatter (e.g. missing `title`, bad `date` format) instead of a runtime crash or silently-wrong page |
| Reading time estimation | Manual word-count/WPM calculation | Velite's `s.metadata()` (or, if its rounding proves insufficient, the `reading-time` npm package) | Zero extra code either way; `s.metadata()` needs zero extra dependency |
| Syntax highlighting | Custom Shiki/Prism wiring inside a Client Component | `rehype-pretty-code` inside Velite's `mdx.rehypePlugins` | Highlighting happens once at build time, ships as static HTML — a hand-rolled client-side highlighter would ship an entire highlighter engine as JS to every visitor for content that never changes per-request |
| Heading anchor links | Manual `id` generation + manual `<a>` wrapper per heading in every post | `rehype-slug` + `rehype-autolink-headings` | Handles slug uniqueness/collision and edge cases (headings with identical text) that a hand-rolled version would need to reinvent |
| Related-posts ranking | A database query or search index | Plain array `.filter()`/`.sort()` over the in-memory `posts` array (Pattern 4 above) | At 2-3 launch posts (and comfortably to "hundreds," per ARCHITECTURE.md Scaling Considerations), this is O(n²) at worst and runs once per build — no indexing infrastructure is justified |

**Key insight:** Every "don't hand-roll" item above already has a zero-cost, build-time answer inside the Velite pipeline. The temptation in this phase is to reach for Client Components or extra npm packages (a runtime tag-filter widget, a runtime highlighter, a reading-time library) where a purely static, build-time answer already exists and better fits the project's $0/month, zero-server-compute constraint.

## Common Pitfalls

### Pitfall 1: Velite + Turbopack incompatibility silently breaks dev mode

**What goes wrong:** Following Velite's `VeliteWebpackPlugin` integration guide (still findable in its docs under "snippets") works for `next build` but the `.velite` output either doesn't rebuild on file changes in `next dev`, or the plugin's `beforeCompile` hook never fires correctly, because Next.js 16's default dev bundler is Turbopack, which doesn't run the Webpack plugin pipeline the same way.

**Why it happens:** The Webpack-plugin pattern predates Turbopack becoming Next.js's default. Velite's own docs now recommend the top-level-await `next.config.mjs`/`.ts` pattern specifically because of this [VERIFIED: Context7 `/zce/velite`, cross-checked via WebSearch — "This approach is recommended when Turbopack is enabled, as the VeliteWebpackPlugin may not function correctly"].

**How to avoid:** Use Pattern 1 above (`next.config.mjs`, top-level await). Do not use the `webpack: config => {...}` plugin pattern for this project.

**Warning signs:** Editing an `.mdx` file's frontmatter during `next dev` doesn't reflect in the browser without a manual server restart; `.velite/index.js` timestamp is stale relative to the edited content file.

### Pitfall 2: `.ts` config + top-level await race condition

**What goes wrong:** If `next.config.ts` is kept (rather than renamed to `.mjs`) and written with `import('velite').then(m => m.build(...))` (Velite's own documented `.ts` pattern), the Promise is fired but not awaited before Next.js proceeds — on a cold `next build` (no pre-existing `.velite` directory, e.g. right after a fresh git clone or in a clean Vercel build container), there's a real risk the build process starts resolving `#site/content` imports before Velite has finished writing `.velite/index.js`.

**Why it happens:** Node's native top-level-await support inside `.ts` config files depends on Next.js detecting a native TypeScript resolver (Node ≥22.18 with `process.features.typescript`), a relatively recent and not-fully-verified-in-this-session capability [MEDIUM confidence — WebSearch only]. Where that path isn't active, `.then()` without `await` cannot block module evaluation, unlike genuine top-level await in an `.mjs` file.

**How to avoid:** Rename `next.config.ts` → `next.config.mjs` and use the true top-level-await pattern (Pattern 1). This project's existing `next.config.ts` has no TypeScript-specific content (an empty `NextConfig` object), so the rename is free.

**Warning signs:** Intermittent "Cannot find module '#site/content'" or "posts is undefined" errors that disappear on a second build/dev run (the classic signature of a resolved-just-in-time race condition).

### Pitfall 3: rehype-pretty-code's default dual-theme CSS ignores this project's manual dark-mode toggle

**What goes wrong:** Copying rehype-pretty-code's official dual-theme CSS snippet verbatim (`@media (prefers-color-scheme: dark) { code[data-theme*=" "] { color: var(--shiki-dark); ... } }`) makes code blocks follow the OS/browser's color-scheme preference — but this project's dark mode is a manual `next-themes` class toggle (`attribute="class"` in `ThemeProvider.tsx`) that can be set independently of OS preference. A user who manually switches to dark mode while their OS is in light mode (or vice versa) would see code blocks rendered in the *wrong* theme relative to the rest of the page.

**Why it happens:** rehype-pretty-code's docs assume the common case of theme-follows-OS; this project already made a different (and more common for modern sites) choice in Phase 1 — a user-controlled toggle, defaulting to system preference (DSGN-02) but overridable.

**How to avoid:** Replace the `@media (prefers-color-scheme: dark)` selector with a `.dark`-class-scoped selector, matching the existing `@custom-variant dark (&:where(.dark, .dark *))` pattern already in `globals.css`:
```css
/* globals.css addition — adapted from rehype-pretty-code's docs, keyed to .dark class instead of OS preference */
code[data-theme*=" "],
code[data-theme*=" "] span {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}
:where(.dark, .dark *) code[data-theme*=" "],
:where(.dark, .dark *) code[data-theme*=" "] span {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}
```
**Warning signs:** Toggling the site's theme switch changes every other surface but code blocks stay visually stuck in one theme.

### Pitfall 4: rehype-slug / rehype-autolink-headings order

**What goes wrong:** If `rehype-autolink-headings` runs before `rehype-slug` in the `mdx.rehypePlugins` array, headings have no `id` yet for autolink-headings to attach a link to — anchors silently fail to appear (no error thrown).

**Why it happens:** `rehype-slug` generates the `id`; `rehype-autolink-headings` only looks up an *existing* `id` and injects a link — it does not generate slugs itself [VERIFIED: WebSearch, rehypejs/rehype-autolink-headings official README usage example].

**How to avoid:** Always list `rehypeSlug` before `rehypeAutolinkHeadings` in the `mdx.rehypePlugins` array (see Pattern 2 code example).

**Warning signs:** Headings render normally but have no visible/clickable anchor icon and no `id` attribute in the rendered HTML.

### Pitfall 5: MDX hydration mismatches from date formatting (inherited from PITFALLS.md Pitfall 2)

**What goes wrong / how to avoid:** Already documented in `.planning/research/PITFALLS.md` Pitfall 2 — format dates with a fixed locale/timezone (`Intl.DateTimeFormat('en-US', { timeZone: 'UTC' })`), never rely on runtime-local timezone for the frontmatter `date` field's display. Directly relevant here since every post/list/related-post row displays a formatted date (D-01, D-07, D-17).

### Pitfall 6: Forgetting to centralize draft-filtering (D-11 regression risk)

**What goes wrong:** A new query function is added later (e.g., a "posts by tag, sorted" helper for a future feature) that reads directly from the imported `posts` array without re-applying the `!post.draft` filter, silently leaking a draft post into a public view.

**How to avoid:** Establish one private, unexported "base" accessor (e.g., `getPublishedPosts()`) at the top of `lib/posts.ts` that all other exported query functions build on, so there is exactly one place the `draft` filter is applied — never filter drafts ad hoc per-function.

## Code Examples

### Full `velite.config.ts`
See Pattern 2 above — includes schema, mdx plugin wiring, and slug transform in one block.

### `next.config.mjs`
See Pattern 1 above.

### `MDXContent` render component + post page
See Pattern 3 above.

### Related-posts ranking
See Pattern 4 above.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `VeliteWebpackPlugin` in `next.config.js`'s `webpack()` hook | Top-level-await `build()` call in `next.config.mjs` | Documented shift coincides with Turbopack becoming Next.js's default dev bundler (Next.js 15.5 experimental → Next.js 16 stable, per `.planning/research/STACK.md`'s own Next.js 16 confidence notes) | The Webpack-plugin pattern is not reliable when `next dev` runs on Turbopack (the default in this project, Next 16.2.10) |
| `reading-time` npm package for word-count-based estimates | Velite's built-in `s.metadata()` schema field | Available since Velite's schema system stabilized (current in 0.4.0, verified this session) | One fewer dependency; no functional loss for this phase's "reading time" display requirement |

**Deprecated/outdated:**
- Contentlayer / `next-contentlayer` (unscoped): archived/unmaintained, already excluded by CLAUDE.md and STACK.md — not reconsidered here.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|----------------|
| A1 | The exact slug-derivation regex (`context().file.path.replace(/^posts\//, '').replace(/\.mdx$/, '')`) produces a clean bare filename slug for this project's flat `content/posts/*.mdx` layout | Pattern 2 / Code Examples | If `context().file.path` returns an absolute path or a different relative-path format than assumed, slugs could include unexpected path segments, breaking `/blog/[slug]` routing. Low-cost to verify: log the value once during Wave 0 before relying on it across all query functions. |
| A2 | Node ≥22.18 with the native TypeScript resolver enables genuine top-level await inside `next.config.ts` (making the `.ts`-with-`await` variant potentially viable as an alternative to renaming to `.mjs`) | Pattern 1 / Pitfall 2 | Low risk — this research's recommendation is to use `.mjs` regardless, which sidesteps the question. Only relevant if the planner instead chooses to keep `.ts`; in that case, this claim needs verification against Vercel's actual build-container Node version before trusting it in production. |
| A3 | Velite 0.4.0's `s.metadata()` reading-time rounding/behavior is adequate for BLOG-01's "reading time" display without needing the `reading-time` package's configurable words-per-minute | Alternatives Considered / Standard Stack | Low risk — if the displayed reading time looks obviously wrong for a real post (e.g., always rounds to 1 minute for short posts), swapping in `reading-time` is a small, isolated change to one schema field, not an architectural change |

**If this table is empty:** N/A — see entries above; all other claims in this document are `[VERIFIED]` via Context7, `npm view`, or WebSearch cross-referenced against Velite's/rehype-autolink-headings' official docs.

## Open Questions

1. **Does the Vercel build container's Node.js version support native top-level await in `.ts` config files?**
   - What we know: This project's local dev Node is v24.13.0 (comfortably above the v22.18 threshold WebSearch surfaced). Vercel's default Node version for new projects is generally current-LTS-or-newer.
   - What's unclear: Whether Vercel's actual build image at deploy time matches or exceeds that threshold, and whether Next.js's `.ts` config loader path has fully resolved vercel/next.js#67765 as of Next 16.2.10.
   - Recommendation: Moot for this plan — recommendation is to use `next.config.mjs` (Pattern 1), which works correctly regardless of this open question. Revisit only if there's a strong reason to keep `.ts` config typing later.

2. **Does `context().file.path` include the leading collection folder name (`posts/`) or is it collection-relative already (bare `my-post.mdx`)?**
   - What we know: Velite's own example output for `s.path()` shows `'posts/2021-01-01-hello-world'` — i.e., includes the collection subfolder.
   - What's unclear: Whether `context().file.path` (used directly, not via `s.path()`) returns the same collection-prefixed value or something else (e.g., a root-relative or absolute path).
   - Recommendation: Verify with a one-line `console.log(context().file.path)` during the first Wave 0 spike before finalizing the slug transform (ties to Assumption A1).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Velite build, Next.js dev/build | ✓ | v24.13.0 | — |
| npm | Package installation | ✓ | 11.6.2 | — |
| velite (npm registry) | Content pipeline | ✓ (resolvable) | 0.4.0 | — |
| rehype-pretty-code / shiki / remark-gfm / rehype-slug / rehype-autolink-headings (npm registry) | MDX processing pipeline | ✓ (resolvable) | see Standard Stack table | — |

No external services, databases, or CLI tools beyond the Node/npm toolchain and npm-registry-resolvable packages are required for this phase — consistent with the project's $0/month, no-backend constraint.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No auth surface in this phase |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | No access-controlled content (drafts are a build-time content-visibility rule, not an access-control boundary) |
| V5 Input Validation | Yes | Velite's Zod schema (`s.object({...})`) validates all frontmatter at build time; the `/blog/tags/[tag]` route must validate the `tag` URL param against the known, pre-computed tag set (via `generateStaticParams` + `dynamicParams = false`) rather than reflecting arbitrary user-supplied tag strings into a query |
| V6 Cryptography | No | No cryptographic operations in this phase |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|-----------------------|
| Draft content accidentally reachable via direct URL or sitemap (information disclosure of unfinished/private writing) | Information Disclosure | Centralize the `!post.draft` filter in `lib/posts.ts` (Pitfall 6); ensure `generateStaticParams` for `/blog/[slug]` never includes draft slugs, and `dynamicParams = false` so no on-demand path can render an excluded slug |
| Unbounded `/blog/tags/[tag]` — arbitrary tag strings in the URL rendered without validation | Tampering / Denial of Service (arbitrary route generation) | `dynamicParams = false` + `generateStaticParams` restricted to the real tag set computed from published posts means any unknown tag 404s at the CDN edge rather than triggering server-side rendering/computation for arbitrary input |
| MDX body content executed via `new Function()` in `MDXContent` (Pattern 3) treated as if it were untrusted user input | Tampering / Elevation of Privilege | Not a real risk in this project's threat model — `content/posts/*.mdx` is git-committed, single-author (Rasmus) content, not user-submitted at runtime. This pattern would be a genuine XSS/RCE risk only if the site ever accepted MDX from untrusted external contributors (explicitly out of scope per PROJECT.md's "no CMS / non-git content editing") |

## Sources

### Primary (HIGH confidence)
- Context7 `/zce/velite` — `docs/guide/with-nextjs.md` (Next.js integration, Webpack plugin, top-level await patterns for `.mjs`/`.ts`), `docs/guide/using-mdx.md` (`s.mdx()`, `MDXContent` pattern, global component sharing), `docs/guide/velite-schemas.md` (`s.metadata()`, `s.excerpt()`, `s.path()`, `s.slug()`), `docs/guide/define-collections.md` (`context()` file-path pattern, `s.metadata()`/`s.excerpt()` usage), `docs/guide/quick-start.md` (full collection schema shape), `docs/guide/using-collections.md` (tsconfig path alias, query-function accessor pattern), `docs/reference/config.md` (top-level `mdx` vs `markdown` config keys, `prepare` hook), `docs/reference/types.md` (`MarkdownOptions`/`MdxOptions` interfaces)
- `npm view <package> version` — direct registry query for `velite`, `rehype-pretty-code`, `shiki`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `reading-time` (all run 2026-07-13)
- `npm view rehype-pretty-code peerDependencies` / `dependencies`, `npm view velite engines` — direct registry queries confirming Shiki peer-range compatibility and Node engine requirement (`^18.20.0 || >=20.3.0`)
- Context7 `/rehype-pretty/rehype-pretty-code` — dual-theme CSS data-attribute pattern, line/char highlighting meta-string syntax

### Secondary (MEDIUM confidence)
- [velite.js.org/guide/with-nextjs](https://velite.js.org/guide/with-nextjs) (WebFetch) — confirmed exact `next.config.ts`/`next.config.mjs` code, and that the `.ts` variant uses `.then()` (fire-and-forget) rather than a real blocking `await`
- WebSearch, multiple sources cross-referenced — rehype-slug-before-rehype-autolink-headings ordering (rehypejs/rehype-autolink-headings official README usage example); Velite+Turbopack incompatibility of `VeliteWebpackPlugin` and the top-level-await `.mjs` workaround (corroborated across Velite's docs site and community discussion referencing zce/velite#274)
- WebSearch — [vercel/next.js#67765](https://github.com/vercel/next.js/issues/67765) and related discussions on `next.config.ts` top-level-await support tied to Node's native TypeScript resolver (`process.features.typescript`, Node ≥22.18) — MEDIUM confidence, no single canonical Next.js changelog entry located confirming full resolution as of Next 16.2.10

### Tertiary (LOW confidence)
None — all findings in this document were verified via Context7, direct `npm view` registry queries, or cross-referenced WebSearch against official project documentation/GitHub sources.

## Metadata

**Confidence breakdown:**
- Standard stack (package versions, core Velite API surface): HIGH — verified directly via Context7 and `npm view`
- Architecture (Next.js 16/Turbopack wiring, MDX render pattern, related-posts ranking): HIGH for the Velite/Next.js wiring (multi-source corroborated); MEDIUM for the exact slug-transform regex (flagged as Assumption A1, needs a Wave 0 spike-check)
- Pitfalls (Turbopack incompatibility, dark-mode CSS mismatch, plugin ordering): HIGH — each cross-verified against at least two independent sources (official docs + WebSearch, or Context7 + WebSearch)

**Research date:** 2026-07-13
**Valid until:** 30 days (stable ecosystem — Velite, rehype-pretty-code, and Next.js 16 are all past their initial-release churn period; re-verify package versions if planning is delayed past mid-August 2026)
