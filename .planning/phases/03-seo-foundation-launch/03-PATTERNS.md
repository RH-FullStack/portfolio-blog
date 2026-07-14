# Phase 3: SEO Foundation & Launch - Pattern Map

**Mapped:** 2026-07-14
**Files analyzed:** 19
**Analogs found:** 14 exact/role-match / 19 (5 have no in-repo analog — first-of-their-kind file conventions; RESEARCH.md supplies verified complete code for these instead)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|-----------------|---------------|
| `src/app/layout.tsx` | config (root metadata) | request-response | itself (extend in place) | exact |
| `src/app/(site)/page.tsx` | route (static metadata export) | request-response | `src/app/layout.tsx` (only existing `Metadata` object in repo) | role-match |
| `src/app/(site)/about/page.tsx` | route (static metadata export) | request-response | `src/app/layout.tsx` | role-match |
| `src/app/(site)/projects/page.tsx` | route (static metadata export) | request-response | `src/app/layout.tsx` | role-match |
| `src/app/(site)/contact/page.tsx` | route (static metadata export) | request-response | `src/app/layout.tsx` | role-match |
| `src/app/(site)/blog/page.tsx` | route (static metadata export) | request-response | `src/app/layout.tsx` | role-match |
| `src/app/(site)/blog/[slug]/page.tsx` | route (`generateMetadata`, dynamic) | request-response / CRUD-read | itself — existing `generateStaticParams`/data-lookup pattern | exact (data-source pattern) |
| `src/app/(site)/blog/tags/[tag]/page.tsx` | route (`generateMetadata`, dynamic) | request-response / CRUD-read | `src/app/(site)/blog/[slug]/page.tsx` | exact |
| `src/app/not-found.tsx` | route (static metadata export) | request-response | `src/app/layout.tsx` | role-match |
| `src/app/sitemap.ts` | route (Next.js file convention) | batch/transform | `src/lib/posts.ts` (data source) | no in-repo file-convention analog — RESEARCH.md Pattern 4 |
| `src/app/robots.ts` | route (Next.js file convention) | transform | `src/lib/site-config.ts` (data source) | no in-repo analog — RESEARCH.md Code Examples |
| `src/app/opengraph-image.tsx` | route (`next/og` ImageResponse) | file-I/O / transform | `src/components/layout/Header.tsx` (Monogram SVG geometry + design tokens) | partial — geometry/token analog only, no rendering-route analog |
| `src/app/icon.svg` | static asset | file-I/O | `src/components/layout/Header.tsx` `Monogram()` | exact (source geometry) |
| `src/app/apple-icon.png` | static asset (generated) | file-I/O | `src/components/layout/Header.tsx` `Monogram()` | exact (source geometry, rendered via `sharp`) |
| `src/app/favicon.ico` | static asset (generated, replaces scaffold) | file-I/O | `src/components/layout/Header.tsx` `Monogram()` | exact (source geometry, rendered via `sharp` + `png-to-ico`) |
| `next.config.mjs` | config | transform | itself (currently near-empty, extend in place) | exact |
| `src/app/(site)/page.tsx` (image tags) | component (image perf) | file-I/O | `src/components/ui/Card.tsx` (existing `next/image` usage pattern) | role-match |
| `public/projects/*.png` (4 files, launch-blocker) | static asset | file-I/O | `src/content/projects.ts` (`image.src` references) + `src/components/ui/Card.tsx` (consumer) | no analog — missing assets, flagged as launch blocker |
| `public/Background.jpg` → optimize; `BackgroundOld.jpg`/`heroold.jpg` → relocate | static asset | file-I/O | none (asset relocation, not code) | n/a |

## Pattern Assignments

### `src/app/layout.tsx` (config, root metadata — extend in place)

**Analog:** itself, current state (lines 1-11)

**Current state:**
```typescript
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'RasmusOS',
  description: "Rasmus's personal software portfolio and blog.",
};
```

**Target pattern (RESEARCH.md Pattern 1, D-01/D-02):**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'), // KEEP — already correct (Pitfall 7)
  title: {
    template: '%s — Rasmus Hansen',
    default: 'Rasmus Hansen — Software Developer', // D-02
  },
  description: '...', // site-wide fallback, hand-written per D-03
};
```
Note: `metadataBase` line must be preserved verbatim — it is the one piece of this file already correct per Pitfall 7 in RESEARCH.md; do not touch it beyond what's shown.

---

### Static page metadata exports (`page.tsx` for `/`, `/about`, `/projects`, `/contact`, `/blog`, `/not-found.tsx`)

**Analog:** `src/app/layout.tsx` `Metadata` shape (only existing typed metadata object in the repo) + each page's own existing default export for context.

**Pattern to add** (same shape for every static page, title inherits template from root layout — D-01):
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About', // renders "About — Rasmus Hansen" via root template (D-01)
  description: '...', // one hand-written sentence per D-03; homepage sets NO title (uses root `default`, D-02)
};
```

**Per-file title values** (bare strings — template appends `— Rasmus Hansen` automatically):
| File | `title` value | Note |
|------|---------------|------|
| `src/app/(site)/page.tsx` | *(omit — inherits root `default`: "Rasmus Hansen — Software Developer", D-02)* | Do not set a `title` key at all here |
| `src/app/(site)/about/page.tsx` | `'About'` | existing `<h1>` reads "About {siteConfig.name}" — title should NOT reuse the placeholder brand name (D-01) |
| `src/app/(site)/projects/page.tsx` | `'Projects'` | |
| `src/app/(site)/contact/page.tsx` | `'Contact'` | |
| `src/app/(site)/blog/page.tsx` | `'Blog'` | |
| `src/app/not-found.tsx` | `'Page Not Found'` | RESEARCH.md confirms Next auto-injects `noindex` on 404 responses — no manual robots config needed |

**Description source:** hand-authored per D-03 (no existing analog text to copy — author fresh, one sentence each, matching the tone already established in each page's body copy, e.g. `about/page.tsx` lines 16-52 for voice/tone reference).

---

### `src/app/(site)/blog/[slug]/page.tsx` (`generateMetadata`, dynamic route)

**Analog:** itself — existing `generateStaticParams`/`getPostBySlug` data pattern (lines 1-21 of the file, already read)

**Existing data-lookup pattern to reuse** (`src/app/(site)/blog/[slug]/page.tsx` lines 1-21):
```typescript
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;
```

**New `generateMetadata` to add** (RESEARCH.md Pattern 2, D-03 — reuses `post.excerpt` verbatim, zero new authoring burden):
```typescript
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug); // SAME lookup already used by the page body — no new data path
  if (!post) return {}; // notFound() in the page component still handles the 404

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}
```
Security note (RESEARCH.md ASVS V5): must call `getPostBySlug`, never a raw/unfiltered Velite import — preserves the existing draft-exclusion and unknown-slug-404 properties.

---

### `src/app/(site)/blog/tags/[tag]/page.tsx` (`generateMetadata`, dynamic route)

**Analog:** `src/app/(site)/blog/[slug]/page.tsx` (same file convention, sibling dynamic route) + itself for the existing `getPostsByTag` lookup (lines 1-18, already read)

**Existing data pattern to reuse:**
```typescript
import { getAllTags, getPostsByTag } from '@/lib/posts';

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export const dynamicParams = false;
```

**New `generateMetadata` to add** (hand-authored template — no per-tag excerpt field exists, per RESEARCH.md Pattern 2 note):
```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Posts tagged "${tag}"`,
    description: `Posts tagged "${tag}" — writing on software, aikido, and long-term investing.`,
  };
}
```
Note: no `notFound()`-in-metadata branch needed — the page body's own `getPostsByTag(tag).length === 0` check already 404s; an unknown tag never reaches a static path anyway (`dynamicParams = false`).

---

### `src/app/sitemap.ts` (NEW — no in-repo analog, first file-convention route of its kind)

**Analog:** none in codebase. Data source: `src/lib/posts.ts` (already read in full — draft-filtered `getAllPosts()`/`getAllTags()`, Phase 2 D-11) and `src/lib/site-config.ts` (`siteConfig.siteUrl`).

**Complete pattern** (RESEARCH.md Pattern 4, verified against Context7 `/vercel/next.js` sitemap.mdx):
```typescript
import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/about', '/projects', '/contact', '/blog'].map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  const tagRoutes = getAllTags().map((tag) => ({
    url: `${siteConfig.siteUrl}/blog/tags/${tag}`,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
```
Critical: must call `getAllPosts()`/`getAllTags()` from `src/lib/posts.ts` (already draft-safe) — never import raw Velite `posts` directly (Security Domain: Information Disclosure risk if this rule is bypassed).

---

### `src/app/robots.ts` (NEW — no in-repo analog)

**Analog:** none in codebase. Data source: `src/lib/site-config.ts` (`siteConfig.siteUrl`).

**Complete pattern** (RESEARCH.md Code Examples, D-10 — indexing allowed from launch day):
```typescript
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
```

---

### `src/app/opengraph-image.tsx` (NEW — no in-repo rendering-route analog)

**Analog (geometry + design tokens only):** `src/components/layout/Header.tsx` `Monogram()` (lines 14-33, already read) and `src/app/globals.css` (paper `#FAF9F6`, ink `#1C1B18`, vermillion `#C1440E` — confirmed via grep, lines 7/9/10).

**Monogram source geometry to inline (Header.tsx lines 16-31, converted from Tailwind classes to hex — Satori constraint, no `className`):**
```tsx
<svg viewBox="0 0 32 32" width="120" height="120">
  <path d="M16 5a11 11 0 1 1-7.8 3.2" fill="none" stroke="#1C1B18" strokeWidth="2.5" strokeLinecap="round" />
  <path d="M16 11v10" fill="none" stroke="#C1440E" strokeWidth="2.5" strokeLinecap="round" />
</svg>
```

**Full route pattern** (RESEARCH.md Pattern 3 — verified against Context7 `/vercel/next.js` image-response.mdx, adapted with confirmed local Geist font paths):
```tsx
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs'; // NOT 'edge' — Next.js 16 deprecates Edge for route segments (Pitfall 1); ignore CLAUDE.md/STACK.md's stale "edge recommended" guidance
export const alt = 'Rasmus Hansen — Software Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [geistSemiBold, geistRegular] = await Promise.all([
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf')),
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: '#FAF9F6', fontFamily: 'Geist',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M16 5a11 11 0 1 1-7.8 3.2" fill="none" stroke="#1C1B18" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 11v10" fill="none" stroke="#C1440E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: 64, fontWeight: 600, color: '#1C1B18', marginTop: 32 }}>Rasmus Hansen</div>
        <div style={{ fontSize: 32, color: '#C1440E', marginTop: 12 }}>Software Developer</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Geist', data: geistSemiBold, weight: 600, style: 'normal' },
        { name: 'Geist', data: geistRegular, weight: 400, style: 'normal' },
      ],
    }
  );
}
```
Verified font paths exist (this session): `node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf`, `Geist-Regular.ttf`. Satori bundle-size budget: 500KB total; two `.ttf` weights ≈254KB, comfortable margin.

**Anti-pattern reminder:** No Tailwind `className` anywhere in this file — Satori silently ignores it (already called out in CLAUDE.md, reconfirmed in RESEARCH.md).

---

### `src/app/icon.svg`, `src/app/apple-icon.png`, `src/app/favicon.ico` (favicon set, D-06)

**Analog:** `src/components/layout/Header.tsx` `Monogram()` (lines 14-33) — same path data as the OG image above, this is the canonical rename-proof source geometry (Phase 1 D-09).

**`icon.svg`** — static file, same two `<path>` elements as Header.tsx's Monogram, standalone SVG document (no React/Tailwind wrapper):
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path d="M16 5a11 11 0 1 1-7.8 3.2" fill="none" stroke="#1C1B18" stroke-width="2.5" stroke-linecap="round" />
  <path d="M16 11v10" fill="none" stroke="#C1440E" stroke-width="2.5" stroke-linecap="round" />
</svg>
```
Note: SVG favicons render on a transparent/browser-default background; consider whether a `#FAF9F6` background rect is needed for legibility in browser tab UI at small size — Claude's discretion per CONTEXT.md.

**`apple-icon.png`** (Pitfall 6 — apple-icon slot does NOT support SVG, PNG required): render the same monogram at 180×180 via `sharp` from the SVG above, one-off script, not committed as app code.

**`favicon.ico`** (replaces scaffold default at `src/app/favicon.ico`, currently 25,931 bytes / MS icon resource, 4 icons 16x16+32x32 confirmed via `file`): render 16/32/48px PNGs via `sharp` from the same monogram SVG, then combine via `npx png-to-ico` (RESEARCH.md Standard Stack — no install required, confirmed working this session).

---

### `next.config.mjs` (extend in place, D-12 image performance)

**Analog:** itself, current state (full file, 10 lines, already read):
```javascript
const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: isDev, clean: !isDev, strict: true })
}

/** @type {import('next').NextConfig} */
export default {}
```

**Target change** (RESEARCH.md Pitfall 2/3 — add `images` key, currently absent, defaulting to WebP-only/quality-75-only):
```javascript
/** @type {import('next').NextConfig} */
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [65, 70, 75], // must include whatever explicit `quality` prop is set on Background.jpg's <Image>
  },
};
```
Empirical finding (RESEARCH.md Pitfall 3, verified this session with `sharp` against the actual `public/Background.jpg`): WebP beats AVIF at every comparable quality for this specific textured/painterly image — WebP q70 ≈ 195.5KB, q75 ≈ 208.5KB, vs. AVIF q70 ≈ 293.7KB. Do not assume AVIF wins; this repo's asset is a documented exception.

---

### Hero image `<Image>` usage (`src/app/(site)/page.tsx`, D-12/Pitfall 5)

**Analog:** the file's own current state (lines 29-49, already read).

**Current state (both images have `priority` — Pitfall 5 flags this as a real LCP-competition issue):**
```tsx
<Image src="/Background.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
...
<Image src="/hero.jpg" alt={...} width={200} height={200} priority className="..." />
```

**Target change:** add explicit `quality` prop matching a value in `next.config.mjs`'s new `images.qualities` array to the `Background.jpg` `<Image>` (the confirmed LCP element, larger rendered area); per Pitfall 5, evaluate removing `priority` from the `hero.jpg` portrait `<Image>` — confirm against an actual `largest-contentful-paint-element` Lighthouse audit before making this change (RESEARCH.md notes this specific recommendation is reasoned, not yet empirically confirmed in this session's data).

---

### `public/projects/*.png` — 4 missing files (LAUNCH BLOCKER, Pitfall 4)

**Analog:** `src/components/ui/Card.tsx` lines 27-28 (already read) — the `next/image` consumer:
```tsx
<div className="relative aspect-video w-full">
  <Image src={image.src} alt={image.alt} fill className="object-cover" />
</div>
```

**Referencing source:** `src/content/projects.ts` (full file already read) — 4 `image.src` values point to files that do not exist in `public/`:
- `/projects/rasmusos.png`
- `/projects/portfolio-tracker.png`
- `/projects/dojo-scheduler.png`
- `/projects/devnotes-cli.png`

This is flagged as a launch blocker requiring an explicit planner/user decision (RESEARCH.md Open Question 2) — not silently generated. No code pattern applies until the decision is made on whether to add real screenshots or explicitly-labeled placeholders.

## Shared Patterns

### Metadata title inheritance (site-wide)
**Source:** RESEARCH.md Pattern 1, applied at `src/app/layout.tsx`
**Apply to:** every static page's `metadata` export and every dynamic route's `generateMetadata` return — all set only a bare `title` string (or omit entirely for the homepage), never repeat the `— Rasmus Hansen` suffix manually.

### Draft-safe data access (sitemap + any future metadata reading post lists)
**Source:** `src/lib/posts.ts` (already read in full) — `getAllPosts()`, `getPostBySlug()`, `getPostsByTag()`, `getAllTags()` all route through the single `getPublishedPosts()` draft filter (Phase 2 D-11).
**Apply to:** `src/app/sitemap.ts`, `blog/[slug]/page.tsx` `generateMetadata`, `blog/tags/[tag]/page.tsx` `generateMetadata` — never import raw Velite `posts` directly in any new file this phase touches.
```typescript
// src/lib/posts.ts lines 10-12 — the ONE place drafts are excluded
function getPublishedPosts(): Post[] {
  return allPosts.filter((p) => !p.draft);
}
```

### Design tokens for anything Satori-rendered (OG image, favicon PNG/ICO renders)
**Source:** `src/app/globals.css` lines 7-17 (verified via grep this session)
```css
--color-paper: #FAF9F6;
--color-ink: #1C1B18;
--color-vermillion: #C1440E;
```
**Apply to:** `opengraph-image.tsx` and any `sharp`-rendered favicon PNGs — use these literal hex values (Satori/sharp cannot consume Tailwind CSS variables or classes).

### Monogram source geometry (favicon + OG image)
**Source:** `src/components/layout/Header.tsx` lines 16-31, `Monogram()`
```tsx
<path d="M16 5a11 11 0 1 1-7.8 3.2" fill="none" stroke="#1C1B18" strokeWidth="2.5" strokeLinecap="round" />
<path d="M16 11v10" fill="none" stroke="#C1440E" strokeWidth="2.5" strokeLinecap="round" />
```
**Apply to:** `icon.svg`, `apple-icon.png` (via sharp), `favicon.ico` (via sharp + png-to-ico), `opengraph-image.tsx` inline SVG — all four must use this exact path data, no redrawing, per D-06/D-09 rename-proof requirement.

### `siteConfig.siteUrl` as the only URL source (never hardcode a domain)
**Source:** `src/lib/site-config.ts` line 12: `siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'`
**Apply to:** `sitemap.ts`, `robots.ts`, any `alternates.canonical` value — D-09 requires the vercel.app subdomain stays undetermined until deploy time; every URL-producing file must read from this one config value.

## No Analog Found

Files with no close match in the codebase (planner should use RESEARCH.md's verified complete patterns instead, all already Context7-sourced and reproduced in full above):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/app/sitemap.ts` | route (file convention) | batch/transform | First `MetadataRoute.Sitemap` file in this repo — RESEARCH.md Pattern 4 supplies a complete, verified implementation |
| `src/app/robots.ts` | route (file convention) | transform | First `MetadataRoute.Robots` file in this repo — RESEARCH.md Code Examples supplies a complete implementation |
| `src/app/opengraph-image.tsx` | route (`next/og`) | file-I/O | First `ImageResponse` route in this repo — RESEARCH.md Pattern 3 supplies a complete implementation using confirmed-present Geist font files |
| `src/app/apple-icon.png` / `favicon.ico` generation script | build tooling (one-off) | file-I/O | No prior image-generation script exists in this repo — RESEARCH.md Standard Stack documents the `sharp` + `png-to-ico` CLI pipeline, confirmed working this session |
| `public/projects/*.png` | static asset | file-I/O | Assets were never created (Phase 1 gap) — this is a content/asset gap, not a code pattern; flagged as launch blocker (Pitfall 4), requires explicit decision before planning proceeds |

## Metadata

**Analog search scope:** `src/app/`, `src/app/(site)/`, `src/components/layout/`, `src/components/ui/`, `src/lib/`, `src/content/`, `next.config.mjs`, `node_modules/geist/`, `public/`
**Files scanned:** 27 (all `.ts`/`.tsx` under `src/`) + `next.config.mjs` + `src/app/globals.css` (grep) + `public/` directory listing + `node_modules/geist` font path verification
**Pattern extraction date:** 2026-07-14
