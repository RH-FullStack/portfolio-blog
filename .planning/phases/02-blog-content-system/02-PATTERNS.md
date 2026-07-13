# Phase 2: Blog & Content System - Pattern Map

**Mapped:** 2026-07-13
**Files analyzed:** 15 (new) + 3 (modified)
**Analogs found:** 13 / 15

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `velite.config.ts` | config | file-I/O (build-time content pipeline) | none in codebase | no-analog (see RESEARCH.md Pattern 2 for canonical shape) |
| `next.config.mjs` (renamed from `next.config.ts`) | config | file-I/O (build-time trigger) | `next.config.ts` (current) | role-match |
| `tsconfig.json` (path-alias addition) | config | — | `tsconfig.json` (current `@/*` alias) | exact |
| `content/posts/*.mdx` (2-3 launch posts) | content data | file-I/O | `src/content/projects.ts` (structurally: typed frontmatter shape only, NOT the pipeline) | partial (data shape only, not the mechanism — MDX not TS) |
| `src/lib/posts.ts` | service (query layer) | CRUD (read-only, in-memory) | `src/content/projects.ts` (data-shape reference) + `src/lib/site-config.ts` (module export convention) | role-match |
| `src/lib/related-posts.ts` | service (build-time compute) | transform | `src/lib/posts.ts` (sibling, once created) — no prior analog | no-analog (RESEARCH.md Pattern 4 is canonical) |
| `src/components/mdx/MDXContent.tsx` | component (renderer) | transform (code string → JSX) | none — genuinely new rendering mechanism | no-analog (RESEARCH.md Pattern 3 is canonical) |
| `src/components/blog/PostListRow.tsx` | component | request-response (presentational) | `src/components/ui/Card.tsx` | role-match (same "render one item from a typed collection" shape, different visual treatment per D-01/D-17) |
| `src/components/ui/Tag.tsx` (add linkable variant) | component | request-response (presentational) | `src/components/ui/Tag.tsx` (itself, extend) + `src/components/ui/Button.tsx` (Link-vs-anchor branching pattern) | exact (extend existing file) |
| `src/app/(site)/blog/page.tsx` | route/controller (page) | request-response (SSG list) | `src/app/(site)/projects/page.tsx` | exact |
| `src/app/(site)/blog/[slug]/page.tsx` | route/controller (page) | request-response (SSG detail) | `src/app/(site)/projects/page.tsx` (page shape) — no existing `[param]` dynamic route in codebase | role-match (dynamic-route mechanics are new; RESEARCH.md Pattern 3 fills the gap) |
| `src/app/(site)/blog/tags/[tag]/page.tsx` | route/controller (page) | request-response (SSG filtered list) | `src/app/(site)/blog/page.tsx` (once created, sibling list page) | role-match |
| `src/app/(site)/page.tsx` (add latest-writing teaser) | route/controller (page, modify) | request-response (SSG) | itself — existing featured-projects teaser section in the same file | exact |
| `src/app/globals.css` (add code-block dual-theme CSS) | config/style | transform (CSS only) | `src/app/globals.css` itself — existing `.dark`-class-scoped pattern (`@custom-variant dark`) | exact |
| `package.json` (add deps) | config | — | `package.json` itself | exact |
| `src/app/not-found.tsx` (reused, not modified) | — | — | n/a — confirms 404 handling for unknown `/blog/[slug]` and `/blog/tags/[tag]` already exists app-wide via `dynamicParams = false` | n/a |

## Pattern Assignments

### `content/posts/*.mdx` (content data, file-I/O)

**Analog:** `src/content/projects.ts` (lines 1-16) — for frontmatter *field naming/shape* conventions only. Do NOT copy the TS-array mechanism; MDX frontmatter is the actual mechanism (per CONTEXT.md's explicit note: "this phase's content layer is git-based MDX via Velite... Do not reuse the projects.ts pattern for blog posts").

**Frontmatter shape to follow** (per D-09, RESEARCH.md Pattern 2):
```yaml
---
title: "Post Title"
date: "2026-07-01"
tags: ["software", "aikido"]
excerpt: "One or two sentence hook shown in list rows."
draft: false
---
```

**Comment-style precedent** (adapt project's doc-comment convention from `src/content/projects.ts` lines 1-8) — each `.mdx` file doesn't need a header comment (frontmatter YAML doesn't support block comments the same way), but keep authoring notes in `velite.config.ts`'s schema definition instead, mirroring how `projects.ts` documents its own constraints inline.

---

### `velite.config.ts` (config, file-I/O)

**Analog:** None in codebase — canonical implementation is RESEARCH.md Pattern 2 (already fully drafted, Zod-validated, includes `slug` transform and `mdx` plugin wiring). Planner should treat RESEARCH.md's code block verbatim as the starting point, with the Assumption A1 caveat (verify `context().file.path` shape with a throwaway `console.log` before trusting the slug regex).

**Convention alignment:** Match the project's existing doc-comment style seen in `src/content/projects.ts` (lines 1-8) and `src/lib/site-config.ts` (lines 1-7) — a top-of-file block comment explaining the "why," not just the "what."

---

### `next.config.mjs` (config, file-I/O)

**Analog:** current `next.config.ts` (full file, 5 lines):
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

**Migration pattern:** Since this file has zero TypeScript-specific content (empty `NextConfig` object), the rename to `.mjs` is a free conversion. Use RESEARCH.md Pattern 1 verbatim:
```javascript
const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: isDev, clean: !isDev })
}

/** @type {import('next').NextConfig} */
export default {}
```
Delete `next.config.ts` when `next.config.mjs` is added (Next.js only reads one).

---

### `tsconfig.json` (path alias addition)

**Analog:** current `tsconfig.json` (lines 1-30, in full) — existing `paths` block:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

**Pattern:** Add the `#site/content` alias alongside the existing one, per RESEARCH.md:
```json
"paths": {
  "@/*": ["./src/*"],
  "#site/content": ["./.velite"]
}
```

---

### `src/lib/posts.ts` (service, CRUD/query layer)

**Analog 1 (module export convention):** `src/lib/site-config.ts` (full file) — shows the project's convention for a `lib/` module: top-of-file doc comment explaining purpose/invariant, single `const`/function exports, `as const`/type exports at the bottom.

**Analog 2 (typed collection shape):** `src/content/projects.ts` lines 9-16 (the `Project` type) — mirror this style for referencing the Velite-generated `Post` type (imported from `#site/content`, not hand-declared).

**Core pattern to implement** (per RESEARCH.md Pitfall 6 — centralize draft filtering):
```typescript
// src/lib/posts.ts
import { posts as allPosts } from '#site/content';
import type { Post } from '#site/content';

function getPublishedPosts(): Post[] {
  return allPosts.filter((p) => !p.draft);
}

export function getAllPosts(): Post[] {
  return getPublishedPosts().sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPublishedPosts().find((p) => p.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getAllTags(): string[] {
  return Array.from(new Set(getPublishedPosts().flatMap((p) => p.tags))).sort();
}
```
**Error handling:** None needed — pure in-memory array operations over build-time-validated data; no try/catch (Velite's Zod schema already fails the build on bad data, so runtime guards here would be dead code).

---

### `src/lib/related-posts.ts` (service, transform)

**Analog:** None — this is genuinely new logic. Use RESEARCH.md Pattern 4 verbatim (already fully implements D-05/D-06/D-08):
```typescript
import type { Post } from '#site/content';

export function getRelatedPosts(current: Post, allPosts: Post[], limit = 3): Post[] {
  const others = allPosts.filter((p) => p.slug !== current.slug && !p.draft);
  const scored = others
    .map((post) => ({ post, overlap: post.tags.filter((tag) => current.tags.includes(tag)).length }))
    .sort((a, b) => (b.overlap !== a.overlap ? b.overlap - a.overlap : +new Date(b.post.date) - +new Date(a.post.date)));
  const withOverlap = scored.filter((s) => s.overlap > 0).map((s) => s.post);
  if (withOverlap.length >= limit) return withOverlap.slice(0, limit);
  const selectedSlugs = new Set(withOverlap.map((p) => p.slug));
  const backfill = others.filter((p) => !selectedSlugs.has(p.slug)).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return [...withOverlap, ...backfill].slice(0, limit);
}
```
Import this from within `getPostsByTag`/`getAllPosts` consumers in `src/lib/posts.ts` style — keep it a sibling file, not merged in (RESEARCH.md's stated rationale: isolates the ranking algorithm for independent testability).

---

### `src/components/mdx/MDXContent.tsx` (component, transform)

**Analog:** None — new rendering mechanism (Velite's function-body MDX output). Use RESEARCH.md Pattern 3 verbatim:
```tsx
import * as runtime from 'react/jsx-runtime';

const sharedComponents = {};

function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({ code, components }: { code: string; components?: Record<string, React.ComponentType> }) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
```
**Styling wrapper convention:** Follow `src/components/ui/Prose.tsx` (full file, 24 lines) for how this component's output should be wrapped when consumed in `blog/[slug]/page.tsx` — `<Prose><MDXContent code={post.code} /></Prose>`, matching the About page's `<Prose>{...}</Prose>` usage exactly (`src/app/(site)/about/page.tsx` line 14).

---

### `src/components/blog/PostListRow.tsx` (component, request-response/presentational)

**Analog:** `src/components/ui/Card.tsx` (full file, 53 lines) — same architectural role (render one item from a typed collection, imported by both an index page and a homepage teaser), different visual treatment.

**Imports pattern to mirror** (Card.tsx lines 1-4):
```typescript
import Link from 'next/link'; // use instead of next/image — no image in this component (D-01/D-07/D-17)
import { Tag } from '@/components/ui/Tag';
import type { Post } from '#site/content';
```

**Structural pattern to mirror** (Card.tsx lines 22-53 — props destructure, wrapper div, conditional/optional field rendering):
```tsx
type PostListRowProps = {
  post: Post;
  compact?: boolean; // true for related-posts/homepage-teaser (D-07/D-17: title + date only)
};

export function PostListRow({ post, compact = false }: PostListRowProps) {
  const { title, date, slug, excerpt, tags, metadata } = post;
  return (
    <div className="border-b border-secondary py-6 dark:border-secondary-dark">
      <Link href={`/blog/${slug}`} className="text-heading font-semibold hover:underline">
        {title}
      </Link>
      <p className="mt-1 text-label text-ink/70 dark:text-ink-dark/70">
        {formatDate(date)}
        {!compact && ` · ${metadata.readingTime} min read`}
      </p>
      {!compact && (
        <>
          <p className="mt-2 text-body">{excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag} href={`/blog/tags/${tag}`}>{tag}</Tag>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```
This satisfies D-01 (full row: title, date, reading time, tags, divider), D-07/D-17 (compact: title + date only) with one component + a boolean variant, per CONTEXT.md's discretion note and RESEARCH.md's structure rationale.

**Divider pattern:** `border-b border-secondary dark:border-secondary-dark` is a new utility combination in this codebase — no prior "thin divider" analog exists; this is the first list-with-dividers pattern. Reuse the same border-color tokens already established in `Card.tsx`'s `bg-secondary dark:bg-secondary-dark` (just swapped from `bg-` to `border-`) to stay consistent with the existing surface-color vocabulary.

---

### `src/components/ui/Tag.tsx` (extend — component, request-response)

**Analog:** Itself (full file, 21 lines) — extend rather than replace.

**Current implementation** (lines 1-20):
```typescript
type TagProps = {
  children: string;
  className?: string;
};

export function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-label text-ink dark:bg-secondary-dark dark:text-ink-dark ${className}`.trim()}
    >
      {children}
    </span>
  );
}
```

**Linkable-variant pattern to borrow:** `src/components/ui/Button.tsx` lines 63-87 — the `href`-present branching between `<Link>` (internal) and `<a>` (external, with `rel="noopener noreferrer"` auto-injection). Blog tags only ever link internally (`/blog/tags/[tag]`), so the Tag extension needs only the simple internal-`Link` half of that branch, not the full external-link handling:
```typescript
type TagProps = {
  children: string;
  href?: string; // new: D-02 needs a clickable variant for tag-archive navigation
  className?: string;
};

const baseClasses = 'inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-label text-ink dark:bg-secondary-dark dark:text-ink-dark';

export function Tag({ children, href, className = '' }: TagProps) {
  const classes = `${baseClasses} ${className}`.trim();
  if (href) {
    return <Link href={href} className={`${classes} hover:opacity-80`}>{children}</Link>;
  }
  return <span className={classes}>{children}</span>;
}
```
Keeps the existing non-linked usage in `Card.tsx` (project tech-stack tags) working unchanged (no `href` prop passed there).

---

### `src/app/(site)/blog/page.tsx` (route, request-response SSG list)

**Analog:** `src/app/(site)/projects/page.tsx` (full file, 25 lines) — near-identical shape, exact page-component pattern to copy.

**Imports pattern** (projects/page.tsx lines 1-3):
```typescript
import { Container } from '@/components/ui/Container';
import { getAllPosts } from '@/lib/posts';
```

**Core pattern** (projects/page.tsx lines 10-25, adapted):
```tsx
export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-heading font-semibold">Blog</h1>
      <p className="mt-4 max-w-2xl text-body">
        [intro copy]
      </p>
      <div className="mt-12">
        {posts.map((post) => (
          <PostListRow key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
```
Swap `Card` grid (projects) for `PostListRow` plain-list rendering (D-01) — same `Container` wrapper, same Server Component shape, same `.map()` over a typed collection, per CONTEXT.md's explicit "Established Patterns" note.

**Error handling:** None — Server Component reading pre-validated static data, same as `projects/page.tsx` (no try/catch present there either).

---

### `src/app/(site)/blog/[slug]/page.tsx` (route, request-response SSG detail)

**Analog:** `src/app/(site)/projects/page.tsx` for page-component shape (Container wrapper, Server Component); no existing `[param]` dynamic route in the codebase for the SSG mechanics — use RESEARCH.md Pattern 3 verbatim for `generateStaticParams`/`dynamicParams`/`notFound()`:
```tsx
import { notFound } from 'next/navigation';
import { posts } from '#site/content';
import { getPostBySlug } from '@/lib/posts';
import { getRelatedPosts } from '@/lib/related-posts';
import { MDXContent } from '@/components/mdx/MDXContent';
import { PostListRow } from '@/components/blog/PostListRow';
import { Container } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';

export function generateStaticParams() {
  return posts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound(); // mirrors src/app/not-found.tsx's existing app-wide 404 handling

  const related = getRelatedPosts(post, posts);
  return (
    <Container className="py-16 sm:py-24">
      <Prose>
        <h1>{post.title}</h1>
        <MDXContent code={post.code} />
      </Prose>
      <div className="mt-16">
        <h2 className="text-heading font-semibold">Related Posts</h2>
        {related.map((p) => (
          <PostListRow key={p.slug} post={p} compact />
        ))}
      </div>
    </Container>
  );
}
```
`not-found.tsx` (`src/app/not-found.tsx`, full file) already handles the 404 UI app-wide — no per-route 404 component needed, just call `notFound()` from `next/navigation`.

---

### `src/app/(site)/blog/tags/[tag]/page.tsx` (route, request-response SSG filtered list)

**Analog:** `src/app/(site)/blog/page.tsx` (once created, sibling — same list-rendering shape) + RESEARCH.md's `generateStaticParams` mechanics for the tag set:
```tsx
import { Container } from '@/components/ui/Container';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { PostListRow } from '@/components/blog/PostListRow';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}
export const dynamicParams = false;

export default function TagPage({ params }: { params: { tag: string } }) {
  const posts = getPostsByTag(params.tag);
  if (posts.length === 0) notFound();
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-heading font-semibold">Posts tagged &quot;{params.tag}&quot;</h1>
      <div className="mt-12">
        {posts.map((post) => (
          <PostListRow key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
```
Security note (RESEARCH.md V5): `dynamicParams = false` + `generateStaticParams` restricted to the real, pre-computed tag set means any unknown tag in the URL 404s at the CDN edge rather than triggering server-side computation for arbitrary input — do not add a fallback/dynamic branch here.

---

### `src/app/(site)/page.tsx` (modify — add latest-writing teaser)

**Analog:** Itself — the existing featured-projects teaser section in the same file (lines 42-54):
```tsx
<Container className="py-16 sm:py-24">
  <h2 className="text-heading font-semibold">Featured Projects</h2>
  <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {FEATURED_PROJECTS.map((project) => (
      <Card key={project.slug} project={project} />
    ))}
  </div>
  <div className="mt-12 flex justify-center sm:justify-start">
    <Button href="/projects" variant="secondary">
      View all projects
    </Button>
  </div>
</Container>
```

**Pattern to add below it** (D-15..D-18 — same section shape, `PostListRow` list instead of `Card` grid, per D-17's explicit "not the Card component" instruction):
```tsx
<Container className="py-16 sm:py-24">
  <h2 className="text-heading font-semibold">Latest Writing</h2>
  <div className="mt-12">
    {LATEST_POSTS.map((post) => (
      <PostListRow key={post.slug} post={post} compact />
    ))}
  </div>
  <div className="mt-12 flex justify-center sm:justify-start">
    <Button href="/blog" variant="secondary">
      View all posts
    </Button>
  </div>
</Container>
```
Where `const LATEST_POSTS = getAllPosts().slice(0, 3);` mirrors the existing `const FEATURED_PROJECTS = projects.slice(0, 3);` (page.tsx line 8) exactly — same slicing convention, same module-level constant style. Add the `getAllPosts` import alongside the existing `projects` import (page.tsx line 6).

---

### `src/app/globals.css` (modify — add code-block dual-theme CSS)

**Analog:** Itself — existing `.dark`-class-scoped pattern already in the file (lines 3, 40-43):
```css
@custom-variant dark (&:where(.dark, .dark *));
...
.dark body {
  background-color: var(--color-paper-dark);
  color: var(--color-ink-dark);
}
```

**Pattern to add** (per RESEARCH.md Pitfall 3 — adapted from rehype-pretty-code's docs to this project's manual toggle, NOT the `@media (prefers-color-scheme: dark)` form):
```css
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
Place near the existing `.dark`-scoped rules (after the `body`/`.dark body` block) to keep all theme-conditional CSS grouped in one place, matching the file's current organization.

---

## Shared Patterns

### Container/Page-shell pattern
**Source:** `src/components/ui/Container.tsx` (full file) + usage in `src/app/(site)/projects/page.tsx` (lines 10-24) and `src/app/(site)/about/page.tsx` (lines 12-56)
**Apply to:** All new page files (`blog/page.tsx`, `blog/[slug]/page.tsx`, `blog/tags/[tag]/page.tsx`) — always wrap top-level page content in `<Container className="py-16 sm:py-24">`, matching every existing page in `(site)/`.

### Draft-filtering centralization (D-11)
**Source:** RESEARCH.md Pitfall 6 — no codebase precedent (new concern), but the *shape* of "one private base accessor, all public functions build on it" matches this codebase's existing preference for single-source-of-truth modules (`src/lib/site-config.ts`'s `siteConfig` export is the one place nav/social/brand data lives; `src/content/projects.ts`'s `projects` export is the one place project data lives).
**Apply to:** `src/lib/posts.ts` — every exported function (`getAllPosts`, `getPostBySlug`, `getPostsByTag`, `getAllTags`) must route through a single unexported `getPublishedPosts()` filter, never re-implement `!post.draft` filtering ad hoc.

### Color/surface tokens
**Source:** `src/app/globals.css` `@theme` block (lines 5-33) — `--color-secondary`/`--color-secondary-dark` (neutral surfaces), `--color-vermillion`/`--color-vermillion-dark` (accent, interactive-only per Phase 1 D-01), `--text-heading`/`--text-body`/`--text-label` scale.
**Apply to:** All new components (`PostListRow`, extended `Tag`, blog pages) — no new tokens needed; D-02 explicitly requires blog tags reuse the existing neutral `Tag` treatment, not a new color.

### External-link safety (`rel="noopener noreferrer"`)
**Source:** `src/components/ui/Button.tsx` lines 63-80 (`isExternalHref` check + conditional `rel` injection)
**Apply to:** Only relevant if MDX post bodies contain external links inside prose content — the `MDXContent` component's `sharedComponents` map could override the `a` tag globally to reuse this same safety behavior for author-authored external links inside post bodies, though this is optional (RESEARCH.md doesn't flag it as required, and MDX content is trusted single-author git content, not user input).

### Doc-comment convention
**Source:** Every existing `src/components/ui/*.tsx`, `src/lib/site-config.ts`, `src/content/projects.ts` file — each opens with a `/** ... */` block explaining *why* the file/pattern exists (referencing requirement IDs like `PROJ-01`, decision IDs like `D-04`), not just *what* it does.
**Apply to:** All new files in this phase — reference the relevant `BLOG-0X` requirement ID and/or `D-0X` decision ID from CONTEXT.md in each new file's top comment (e.g., `PostListRow.tsx` should cite D-01/D-07/D-17; `related-posts.ts` should cite D-05/D-06/D-08).

## No Analog Found

Files with no close match in the codebase (planner should use RESEARCH.md's fully-worked code examples instead of searching further):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `velite.config.ts` | config | file-I/O | First content-pipeline config in the codebase — Phase 1 used plain TS data (`projects.ts`), not a build-time content processor. RESEARCH.md Pattern 2 is the canonical, fully-specified implementation to use directly. |
| `src/components/mdx/MDXContent.tsx` | component | transform | No prior MDX rendering exists anywhere in the codebase. RESEARCH.md Pattern 3 is canonical. |
| `src/lib/related-posts.ts` | service | transform | No prior ranking/scoring logic exists (Phase 1's `projects.ts` has no cross-item computation). RESEARCH.md Pattern 4 is canonical. |
| `src/app/(site)/blog/[slug]/page.tsx` (dynamic-route mechanics specifically — `generateStaticParams`/`dynamicParams`) | route | request-response | No prior `[param]` dynamic route exists in the codebase (Phase 1's `/projects` and `/about` are both static routes with no slug). Page-shell shape has an analog (`projects/page.tsx`); the SSG mechanics do not — use RESEARCH.md Pattern 3. |

## Metadata

**Analog search scope:** `src/app/(site)/`, `src/components/ui/`, `src/components/layout/`, `src/content/`, `src/lib/`, root config files (`next.config.ts`, `tsconfig.json`, `package.json`, `src/app/globals.css`)
**Files scanned:** 20 (full codebase — project is small enough for exhaustive review rather than sampling)
**Pattern extraction date:** 2026-07-13
