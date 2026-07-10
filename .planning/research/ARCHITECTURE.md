# Architecture Research

**Domain:** Personal developer portfolio + blog (git-based MDX content, no backend/database, Next.js App Router, Tailwind CSS, Vercel free tier)
**Researched:** 2026-07-10
**Confidence:** HIGH (core patterns verified against official Next.js docs; content-collection specifics MEDIUM — several viable approaches exist, one is recommended)

## Standard Architecture

### System Overview

```
┌───────────────────────────────────────────────────────────────────┐
│                         BUILD TIME (Vercel CI)                      │
├───────────────────────────────────────────────────────────────────┤
│  content/blog/*.mdx      content/projects.ts (or *.mdx)             │
│  (frontmatter + body)    (typed array of project objects)           │
│         │                          │                                │
│         ▼                          ▼                                │
│  lib/posts.ts (gray-matter    lib/projects.ts (direct import,       │
│  parse + cache)                no parsing needed)                   │
│         │                          │                                │
│         ▼                          ▼                                │
│  generateStaticParams()  ──►  Static HTML per route (SSG)           │
│  generateMetadata()      ──►  <head> tags per route                 │
│  sitemap.ts / robots.ts  ──►  sitemap.xml / robots.txt              │
│  feed.xml/route.ts       ──►  RSS/Atom feed                         │
└───────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌───────────────────────────────────────────────────────────────────┐
│                    REQUEST TIME (Vercel Edge/CDN)                   │
├───────────────────────────────────────────────────────────────────┤
│  Pre-rendered static HTML/RSC payload served from CDN.               │
│  No server compute, no database round-trip, no cold start.          │
│  (ISR/ on-demand revalidation not needed — content only changes     │
│  on redeploy, which is fine for a git-based blog.)                  │
└───────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|-------------------------|
| Content source (`content/blog/*.mdx`) | Holds post body + frontmatter (title, date, tags, excerpt, cover image) | Plain `.mdx` files, one per post, committed to git |
| Content source (`content/projects.ts`) | Holds structured project data (no long-form prose needed for v1 cards) | Typed TS array/object — not MDX, since projects are structured data, not prose |
| Content access layer (`lib/posts.ts`, `lib/projects.ts`) | Reads/parses content, exposes typed query functions (`getAllPosts()`, `getPostBySlug()`, `getPostsByTag()`) | Node `fs` + `gray-matter` for MDX frontmatter; direct import for `projects.ts` |
| Route segments (`app/blog/[slug]/page.tsx`, etc.) | Map URL → content, call `generateStaticParams`/`generateMetadata`, render | Server Components (default in App Router) — no `"use client"` needed for content pages |
| MDX rendering pipeline | Compiles `.mdx` body string → React tree, applies custom component mapping (headings, code blocks, images) | `next-mdx-remote` (for MDX stored as data, not routed files) + `mdx-components.tsx` for global styling |
| Shared layout (`app/layout.tsx`, `app/(site)/layout.tsx`) | Nav, footer, theme, base `<html>`/`<body>`, global SEO defaults | Route-group layout wrapping all public pages |
| Design system primitives (`components/ui/*`) | Buttons, cards, tags/badges, containers, prose wrapper | Small, hand-rolled components + Tailwind utility classes, no heavy UI kit needed |
| SEO/metadata layer | Per-page `<title>`, OG tags, JSON-LD, sitemap, robots, RSS | Next.js Metadata API (`generateMetadata`) + `sitemap.ts`/`robots.ts` file conventions + `feed.xml/route.ts` |
| Deployment (Vercel) | Build, host static output, serve via CDN | Git push → Vercel build → static/ISR output, zero server maintenance |

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout: <html>, fonts, global CSS import, theme
│   ├── globals.css                # Tailwind import + @theme design tokens
│   ├── (site)/                    # Route group: shared nav/footer for all public pages
│   │   ├── layout.tsx             # Site chrome (header, footer, container width)
│   │   ├── page.tsx                # / (homepage)
│   │   ├── about/
│   │   │   └── page.tsx            # /about
│   │   ├── contact/
│   │   │   └── page.tsx            # /contact
│   │   ├── projects/
│   │   │   ├── page.tsx            # /projects (index, cards from projects.ts)
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # /projects/[slug] (future: deep case studies)
│   │   └── blog/
│   │       ├── page.tsx            # /blog (list + tag filter UI)
│   │       ├── [slug]/
│   │       │   └── page.tsx        # /blog/[slug] (generateStaticParams over content/blog)
│   │       └── tags/
│   │           └── [tag]/
│   │               └── page.tsx    # /blog/tags/[tag] (optional, or use ?tag= query param)
│   ├── sitemap.ts                  # MetadataRoute.Sitemap — enumerates all static routes + posts
│   ├── robots.ts                   # MetadataRoute.Robots — allow all, points to sitemap
│   ├── feed.xml/
│   │   └── route.ts                # RSS/Atom feed route handler, built from getAllPosts()
│   ├── opengraph-image.tsx         # Default OG image (optional per-route override)
│   └── not-found.tsx               # 404
├── content/
│   ├── blog/
│   │   ├── my-first-post.mdx       # Frontmatter: title, date, tags, excerpt, cover
│   │   └── another-post.mdx
│   └── projects.ts                 # Typed array: { slug, title, summary, tags, links, image }
├── components/
│   ├── ui/                         # Button, Card, Tag/Badge, Container, Prose — dumb, reusable
│   ├── layout/                     # Header, Footer, Nav
│   └── mdx/                        # Custom MDX component overrides (CodeBlock, Callout, etc.)
├── lib/
│   ├── posts.ts                    # getAllPosts(), getPostBySlug(), getPostsByTag(), getAllTags()
│   ├── projects.ts                 # getAllProjects(), getProjectBySlug()
│   ├── seo.ts                      # buildMetadata() helper — shared defaults + per-page overrides
│   └── site-config.ts              # name, description, social links, base URL — single source of truth
├── mdx-components.tsx              # Required by @next/mdx (if using file-based MDX) — global styling map
└── styles/ (optional, or fold into globals.css)
```

### Structure Rationale

- **`content/` sits outside `app/`:** Keeps posts and project data out of the routable tree (avoids accidental filesystem-routing collisions) and makes clear that content is *data*, not application code. It's the natural place for a non-technical future self (or a future CMS migration) to look.
- **`content/blog/*.mdx` as data files, not routed pages:** Two valid approaches exist (see Pattern 1 below). Recommendation is to treat MDX as *data* read via `lib/posts.ts` + `next-mdx-remote`, not as Next.js filesystem-routed pages, because it keeps `generateStaticParams`, tag filtering, and related-posts logic centralized in one place instead of scattered across file-based routing conventions.
- **`content/projects.ts` as TypeScript, not MDX:** Projects in v1 are structured cards (title, summary, tags, links, image) — not long-form prose. A typed data file gives compile-time safety and trivial querying (`.filter()`, `.find()`) with zero parsing overhead. Reserve MDX for `/projects/[slug]` only when deep case studies (explicitly out of scope for v1) are added.
- **`(site)` route group:** Isolates the shared header/footer/container layout for all public-facing pages without leaking into `sitemap.ts`, `robots.ts`, or `feed.xml/route.ts`, which must NOT be wrapped in the site's HTML shell (they return XML, not React trees).
- **`lib/` as the only place that touches the filesystem or parses content:** Route files (`page.tsx`) stay thin — they call `lib/posts.ts` functions and render. This is the seam where a future CMS or database could be swapped in without touching any route or component code.
- **`components/ui/` vs `components/mdx/`:** UI primitives are generic (used in JSX pages). MDX component overrides are specifically the mapping passed to `mdx-components.tsx` / `next-mdx-remote`'s `components` prop (used to render `<h2>`, `<pre>`, `<img>` etc. inside post bodies with site styling).
- **`lib/site-config.ts` as single source of truth:** Site name, base URL, social links, and default OG image live in one file. `generateMetadata`, `sitemap.ts`, `robots.ts`, and `feed.xml` all import from it — avoids the base URL being hardcoded in five places (a common maintenance pitfall).

## Architectural Patterns

### Pattern 1: Content-as-data via gray-matter + next-mdx-remote (recommended over file-based MDX routing)

**What:** Store `.mdx` files in `content/blog/` as plain data (not inside `app/`). A single dynamic route `app/(site)/blog/[slug]/page.tsx` reads the file at build time, parses frontmatter with `gray-matter`, compiles the body with `next-mdx-remote/rsc`, and renders it wrapped in the site's prose layout.

**When to use:** Any blog/content site where you need to *query* content collectively (list all posts, filter by tag, sort by date, generate a sitemap/RSS from all posts) rather than just render individual pages.

**Trade-offs:**
- Pro: One dynamic route handles all posts; tag/date querying is trivial (`lib/posts.ts` just returns arrays you can `.filter()`/`.sort()`).
- Pro: Frontmatter is standard YAML (`gray-matter`), which every markdown tool understands — no vendor lock-in to Next.js-specific `export const metadata` JS syntax inside MDX.
- Con: Requires `next-mdx-remote` as a dependency (vs. zero-dependency `@next/mdx` file routing) — acceptable given the querying benefits.
- Note: `@next/mdx`'s own docs state it does **not** support frontmatter out of the box (confirmed in official Next.js MDX guide, 2026-06-23) — frontmatter requires `gray-matter` or `remark-frontmatter` regardless of which MDX approach is chosen. This is not a drawback unique to Pattern 1.

**Example:**
```typescript
// lib/posts.ts
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content/blog')

export type PostMeta = {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
}

export function getAllPosts(): PostMeta[] {
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8')
      const { data } = matter(raw)
      return { slug: filename.replace(/\.mdx$/, ''), ...(data as Omit<PostMeta, 'slug'>) }
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag))
}

export function getAllTags(): string[] {
  return [...new Set(getAllPosts().flatMap((p) => p.tags))].sort()
}
```

```typescript
// app/(site)/blog/[slug]/page.tsx
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts } from '@/lib/posts'
import { mdxComponents } from '@/components/mdx'

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = fs.readFileSync(path.join(process.cwd(), 'content/blog', `${slug}.mdx`), 'utf8')
  const { data } = matter(raw)
  return { title: data.title, description: data.excerpt /* ...openGraph, etc. */ }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = fs.readFileSync(path.join(process.cwd(), 'content/blog', `${slug}.mdx`), 'utf8')
  const { content, data } = matter(raw)
  return (
    <article className="prose dark:prose-invert">
      <h1>{data.title}</h1>
      <MDXRemote source={content} components={mdxComponents} />
    </article>
  )
}
```

### Pattern 2: Alternative — file-based MDX routing with `@next/mdx` (simpler, but weaker for collections)

**What:** Each post is literally a route file: `app/blog/my-post/page.mdx`, exporting `export const metadata = {...}` inside the MDX itself. Requires `mdx-components.tsx` at project root.

**When to use:** Very small sites (a handful of static pages, e.g. `/about` as MDX) where you never need to programmatically list/filter/sort a collection. Confirmed in official Next.js docs as the zero-extra-dependency path.

**Trade-offs:**
- Pro: Zero extra parsing library; metadata is just a JS export, fully type-checkable.
- Con: To build `/blog` (index page), `/sitemap.xml`, `/feed.xml`, and tag filtering, you still need to enumerate the directory and import each MDX module for its `metadata` export — effectively rebuilding Pattern 1's `lib/posts.ts` anyway, but with awkward dynamic imports instead of cheap frontmatter parsing.
- Verdict: Not recommended as the primary pattern for this project because tags/categories and a blog index are explicit requirements — Pattern 1's centralized query layer serves those needs more directly. Reasonable to use `@next/mdx` file-based routing only for genuinely standalone pages like `/about` if it ever becomes prose-heavy.

### Pattern 3: Static generation with `dynamicParams = false`

**What:** In the `[slug]` route, `generateStaticParams()` returns every known slug at build time; setting `export const dynamicParams = false` makes Next.js 404 any slug not in that list instead of attempting on-demand server rendering.

**When to use:** Always, for this project. There is no backend, no incoming webhook, no reason for a slug to exist that wasn't present at the last git-triggered Vercel build. This keeps the site 100% static output (fastest, cheapest, matches $0/month budget) and fails loudly (404) if a route/content mismatch slips through, rather than silently falling back to server rendering.

**Trade-off:** None meaningful for this project — the only "cost" is that a new post requires a redeploy to appear, which is already true of git-based content and is the desired workflow (push → live).

## Data Flow

### Build-Time Content Flow (the only flow that matters for v1 — no request-time data fetching)

```
Author writes content/blog/my-post.mdx (frontmatter + body)
    ↓ (git push)
Vercel triggers `next build`
    ↓
lib/posts.ts reads content/blog/*.mdx from filesystem
    ↓
generateStaticParams() enumerates slugs → Next.js pre-renders one HTML page per post
    ↓
generateMetadata() reads frontmatter → injects <title>, <meta description>, OG tags per page
    ↓
sitemap.ts calls getAllPosts() + static route list → emits sitemap.xml
    ↓
feed.xml/route.ts calls getAllPosts() → emits RSS/Atom XML (built as a route handler, evaluated
    at request time by default but trivially cacheable/static since content only changes on redeploy)
    ↓
Static HTML + XML artifacts uploaded to Vercel's CDN
    ↓
Visitor requests /blog/my-post → served directly from CDN, zero server compute
```

### Tag/Category Query Flow (no database — derived from frontmatter at build time)

```
content/blog/*.mdx (each has `tags: [...]` in frontmatter)
    ↓
lib/posts.ts: getAllTags() = unique set of all tags across all posts (computed once, in-memory)
    ↓
/blog page renders tag pills; /blog/tags/[tag]/page.tsx (or /blog?tag=x client filter)
    calls getPostsByTag(tag) = getAllPosts().filter(p => p.tags.includes(tag))
    ↓
generateStaticParams() on /blog/tags/[tag] pre-renders one static page per tag
    (small post count → trivial to pre-render every tag combination; no pagination needed at this scale)
```

This is intentionally "database-free": the entire "query layer" is array `.filter()`/`.sort()` over data parsed once per build from the filesystem. This scales comfortably to hundreds of posts before it would ever need to become a real index — well beyond what a personal blog will reach.

### SEO Metadata Flow

```
content/blog/post.mdx frontmatter (title, excerpt, tags, date, coverImage)
    ↓
generateMetadata() in [slug]/page.tsx → Metadata object
    ↓
Next.js Metadata API auto-generates: <title>, <meta name="description">,
    <meta property="og:*">, <meta name="twitter:*">, canonical <link>
    ↓
lib/seo.ts buildMetadata() helper merges per-page fields with site-wide
    defaults from lib/site-config.ts (site name suffix, default OG image, base URL)
    ↓
sitemap.ts / robots.ts / feed.xml/route.ts independently read the same
    lib/posts.ts + lib/site-config.ts to stay in sync with what generateMetadata emits
```

**Key data flow rule:** metadata always flows one direction — frontmatter → `lib/` query functions → route-level `generateMetadata`/`sitemap.ts`/`feed.xml`. No component ever re-derives SEO data independently; this prevents `<title>` and OG tags drifting out of sync with what the sitemap/RSS claim.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|---------------------------|
| 0–50 posts / few dozen visitors a day (this project's actual target) | Exactly the architecture above. Full static generation, `fs`-based content reads at build time, no caching layer needed. |
| 100s of posts | Still fine as pure SSG. Consider adding a build-time search index (e.g., a generated `search-index.json` via a script) if free-text search is ever wanted — still no database. |
| 1000s of posts / need CMS-editable content | This is the point to consider a headless CMS or database-backed content — explicitly out of scope per PROJECT.md, and not a near-term concern for a solo personal blog. |

### Scaling Priorities

1. **First "bottleneck" (not really a bottleneck at this scale): build time.** With `fs.readdirSync` + `gray-matter` parsing all posts on every build, build time grows linearly with post count. At personal-blog scale (tens to low hundreds of posts) this remains sub-second; not worth optimizing pre-emptively.
2. **Second consideration: image assets.** MDX cover images and in-post images should use `next/image` for automatic optimization; store images in `public/` or colocate next to content — this matters more for Core Web Vitals (an explicit requirement) than any data-layer scaling concern.

## Anti-Patterns

### Anti-Pattern 1: Fetching/parsing MDX content in Client Components

**What people do:** Add `"use client"` to a component that reads posts or renders MDX, often to add interactivity like a tag filter.
**Why it's wrong:** `fs` module access is server-only and will fail or require API-route workarounds in Client Components; it also ships unnecessary JS to the browser and forfeits the free static-generation the whole architecture is built around.
**Do this instead:** Keep all content reading and MDX compilation in Server Components (default in App Router). For interactive bits (e.g., a tag filter that updates the URL without reload), pass pre-computed static data down as props to a small, isolated Client Component (e.g., `<TagFilter tags={allTags} />`), or simply use static per-tag routes (`/blog/tags/[tag]`) and skip client interactivity entirely — simpler and still fast.

### Anti-Pattern 2: Hardcoding the site's base URL / metadata defaults in multiple files

**What people do:** Write `https://rasmusos.vercel.app` directly inside `sitemap.ts`, `robots.ts`, `feed.xml/route.ts`, and every `generateMetadata` call.
**Why it's wrong:** The domain is explicitly going to change soon (custom domain added "next month" per PROJECT.md, and the "RasmusOS" name itself is a placeholder). Hardcoding guarantees a multi-file find-and-replace at that point, with a high chance of missing one (broken OG tags or sitemap are hard to notice).
**Do this instead:** Centralize in `lib/site-config.ts` (or a single `NEXT_PUBLIC_SITE_URL` env var read there), and have every metadata-producing file import from it.

### Anti-Pattern 3: Treating `@next/mdx` file-based routing and a content-collection query layer as mutually exclusive, then building both

**What people do:** Start with `@next/mdx` file-based routing for simplicity, then later bolt on a separate `lib/posts.ts` scanning layer for the blog index/tags/sitemap/RSS, ending up with two divergent sources of truth for "what posts exist."
**Why it's wrong:** Frontmatter parsed by `gray-matter` and metadata exported via `export const metadata` inside `.mdx` are two different mechanisms; keeping both means every post's metadata must be correct in two different formats, and tag filtering logic ends up duplicated or inconsistent.
**Do this instead:** Pick one pattern up front (Pattern 1 recommended, per above) and use it everywhere posts are touched — index, individual page, sitemap, RSS, tag pages.

### Anti-Pattern 4: Reaching for ISR/on-demand revalidation

**What people do:** Add `export const revalidate = N` or on-demand revalidation webhooks "to be safe," treating the git-based blog like a CMS-backed site that needs live updates without a redeploy.
**Why it's wrong:** Content only changes when the author pushes to git, which already triggers a full Vercel rebuild. ISR/revalidation solves a problem this architecture doesn't have, and adds complexity (cache invalidation reasoning, potential stale-content confusion) for zero benefit.
**Do this instead:** Full static generation (`dynamicParams = false`, no `revalidate` export). Every deploy is a full, deterministic rebuild from git — simplest possible mental model, and free.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|----------------------|-------|
| Vercel (hosting) | Git push → automatic build & deploy | Free tier covers this project's traffic comfortably; no configuration beyond connecting the repo |
| Vercel Analytics (optional, free tier) | `@vercel/analytics` package, drop-in `<Analytics />` in root layout | Explicitly out of scope per PROJECT.md ("premature before real traffic") — note for later, not v1 |
| Social platforms (OG/Twitter cards) | Consumed passively via Metadata API's `openGraph`/`twitter` fields — no API calls needed | Verify preview rendering with a tool like opengraph.xyz after deploy |
| Mailto / social links (contact) | Plain `<a href="mailto:...">` and external links — no service integration at all | Matches explicit "no backend" decision in PROJECT.md |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|----------------|-------|
| `content/` ↔ `lib/` | Filesystem read (`fs`, `gray-matter`) at build time only | `lib/` is the only layer allowed to touch `content/` directly — routes never read files themselves |
| `lib/` ↔ `app/*/page.tsx` | Direct function calls (`getAllPosts()`, `getProjectBySlug(slug)`) | Server Components call these directly; no fetch/API layer needed since everything is in-process at build time |
| `app/*/page.tsx` ↔ `components/ui/*` | Standard React props | Presentational components stay free of content-fetching logic |
| MDX body ↔ `components/mdx/*` | `components` prop passed into `<MDXRemote components={...} />` | This is how `<h2>`, `<pre>`, `<img>`, custom shortcodes (e.g., `<Callout>`) get site-consistent styling without polluting every post |
| `lib/site-config.ts` ↔ everything SEO-related | Import | Single source of truth for URL/name/social links, consumed by `generateMetadata`, `sitemap.ts`, `robots.ts`, `feed.xml/route.ts` |

## Suggested Build Order (dependency-driven)

1. **Design tokens + base layout first.** Set up `globals.css` with Tailwind v4's `@theme` directive (colors, spacing, fonts as CSS custom properties) and the root/`(site)` layout (header, footer, container). Every other page depends on this shell existing — building pages before the layout means redoing styling twice.
2. **UI primitives (`components/ui/`) next.** Button, Card, Tag/Badge, Container, Prose wrapper — small and few, but every page (home, about, projects, blog) will compose them. Avoid building a "full design system" — 5-8 primitives is enough for a personal site.
3. **Static pages (`/`, `/about`, `/contact`) before dynamic content.** These have no content-layer dependency and validate the layout/design system end-to-end with real copy before the more complex MDX pipeline is introduced.
4. **`lib/site-config.ts` before any SEO work.** Every subsequent metadata/sitemap/RSS task needs this file to exist so there's one place to point at.
5. **`lib/posts.ts` + MDX rendering pipeline (`next-mdx-remote`, `mdx-components.tsx`) before `/blog`.** This is the highest-complexity piece (frontmatter parsing, MDX compilation, static params) — build and verify it with 1-2 seed posts before building the index/tag UI on top of it.
6. **`/blog` index + tag filtering after individual post rendering works.** Listing/filtering is trivial once `getAllPosts()`/`getPostsByTag()` exist and at least one real post renders correctly.
7. **`lib/projects.ts` (typed data) + `/projects` index in parallel with or after blog** — structurally simpler than MDX (no parsing pipeline), can be built any time after step 2. `/projects/[slug]` deep pages are explicitly deferred (out of scope for v1) — build the index/card view only, but the file structure (`app/projects/[slug]/page.tsx`) can be stubbed now to avoid an awkward routing refactor later.
8. **SEO plumbing last: `generateMetadata` per route → `sitemap.ts` → `robots.ts` → `feed.xml/route.ts`.** Each depends on `lib/posts.ts`/`lib/projects.ts` and `lib/site-config.ts` already existing and returning real data; building these first would mean testing against empty/fake content.
9. **OG image generation (`opengraph-image.tsx`) and final Core Web Vitals pass at the end**, once real content and images exist to test against — premature to optimize image loading before there are real images.

This order front-loads the shared, highest-leverage pieces (design tokens, layout, content query layer) and defers anything that's per-page cosmetic or SEO plumbing, which is fast to add once the data flows are correct.

## Sources

- [Next.js: How to use Markdown and MDX](https://nextjs.org/docs/app/guides/mdx) — official guide; confirms `@next/mdx` has no built-in frontmatter support, documents `mdx-components.tsx` requirement, `generateStaticParams` + `dynamicParams = false` pattern for dynamic MDX imports, and Tailwind Typography (`prose`) integration via shared layouts. HIGH confidence (official docs, last updated 2026-06-23).
- [Next.js: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — official docs on colocation, route groups, top-level folder conventions, and metadata file conventions (`sitemap.xml`, `robots.txt`, OG image files). HIGH confidence.
- [Next.js: generateMetadata API reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — official reference for dynamic per-route metadata, parent metadata extension pattern. HIGH confidence.
- [Next.js: sitemap.ts file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — official reference for `MetadataRoute.Sitemap`. HIGH confidence.
- [Next.js: robots.ts file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — official reference for `MetadataRoute.Robots`. HIGH confidence.
- [Vercel Portfolio Starter Kit](https://vercel.com/templates/next.js/portfolio-starter-kit) — referenced directly by official Next.js MDX docs as the canonical working example of this exact architecture (git-based MDX blog + SEO + sitemap + RSS on Next.js). MEDIUM confidence (referenced but not fully inspected; recommend the roadmap/implementation phase clone and review this template directly).
- [Route Groups documentation](https://nextjs.org/docs/14/app/building-your-application/routing/route-groups) and community write-ups (This Dot Labs, GeeksforGeeks) — confirms route groups for shared layouts without affecting URL structure. MEDIUM-HIGH confidence (pattern also present in official current docs).
- [Tailwind CSS v4 theme variables documentation](https://tailwindcss.com/docs/theme) and multiple 2026 migration write-ups (Clearly Design, Mavik Labs, designrevision.com) — confirms Tailwind v4's CSS-first `@theme` directive replaces `tailwind.config.js` for design tokens, tokens exposed as real runtime CSS variables, OKLCH default palette. MEDIUM confidence (WebSearch-sourced, consistent across multiple independent sources, aligns with known Tailwind v4 release direction) — verify exact current Tailwind version compatibility with chosen Next.js version at implementation time.
- RSS feed generation pattern (`app/feed.xml/route.ts` Route Handler returning XML, using the `rss` npm package) — consistent pattern across multiple community tutorials (DEV Community, Space Jelly, hornxengineering.dev). MEDIUM confidence (WebSearch-sourced, no single official Next.js doc page for this since RSS isn't a first-party feature, but the Route Handler mechanism itself is official).
- `gray-matter` and `next-mdx-remote` as the standard frontmatter/MDX-as-data toolchain — corroborated by the official Next.js MDX guide's own suggestion of `gray-matter` for frontmatter, and near-universal use in current Next.js blog tutorials found via WebSearch (Alex Chan, Benito Lopez, Aayush Bharti, DiDoesDigital). MEDIUM-HIGH confidence.

---
*Architecture research for: Personal developer portfolio + blog (Next.js App Router, git-based MDX, no backend)*
*Researched: 2026-07-10*
