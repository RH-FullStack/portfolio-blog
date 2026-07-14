# Phase 3: SEO Foundation & Launch - Research

**Researched:** 2026-07-14
**Domain:** Next.js 16 App Router Metadata API, `next/og` OG-image generation, sitemap/robots file conventions, image performance optimization, Vercel Hobby deployment
**Confidence:** HIGH (Next.js conventions verified via Context7 official docs + live empirical testing against this repo's own production build; Vercel Hobby limits MEDIUM — inherited from project-init research, not re-verified this session)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Titles & Meta Strategy**
- **D-01:** Title template suffix is the real name, not the brand: inner pages/posts render as `{Page/Post Title} — Rasmus Hansen`. "RasmusOS" is an explicit placeholder and must not be baked into every indexed title.
- **D-02:** Homepage title is name + role: `Rasmus Hansen — Software Developer`.
- **D-03:** Meta descriptions: blog posts reuse frontmatter `excerpt` verbatim; each static page (home, about, projects, contact, blog index) gets one hand-written description authored during this phase.

**OG Image & Favicon**
- **D-04:** Site-wide static OG image (1200×630) produced at build time with `next/og` (`ImageResponse`) — code-defined using design tokens (paper background, ink text, vermillion accent, enso monogram). Satori constraint: inline flexbox styles only, no Tailwind classes.
- **D-05:** OG image content: "Rasmus Hansen" + "Software Developer" + the enso monogram.
- **D-06:** Favicon reuses the header's enso monogram (`src/components/layout/Header.tsx`) — SVG favicon with ICO/PNG fallbacks, replacing the default `src/app/favicon.ico`.

**Launch & Indexing**
- **D-07 (HARD GATE):** Nothing is pushed to any git remote and nothing is deployed until Rasmus explicitly says so. All deployment work in plans must be structured as a user-triggered checkpoint — build everything deploy-ready, then STOP and wait for his explicit go signal. Do not create remotes, do not push, do not run `vercel` commands before that signal.
- **D-08:** Deploy flow (once gated go-ahead is given): GitHub → Vercel Git integration, so `git push` auto-deploys.
- **D-09:** Vercel project name / vercel.app subdomain: decided at deploy time. Plans must not hardcode a subdomain; use `NEXT_PUBLIC_SITE_URL` env var (already the pattern in `site-config.ts` and root layout `metadataBase`).
- **D-10:** Search indexing is allowed from launch day on the vercel.app subdomain — robots.txt permits crawling, sitemap is submitted-ready. No noindex holding pattern.
- **D-11:** The `REPLACE_ME` placeholders (GitHub/LinkedIn/email in `src/lib/site-config.ts`, project `code` links in `src/content/projects.ts`) are Rasmus's to edit himself before deploy. The plan's job is only a pre-deploy verification check that no `REPLACE_ME` string remains in shipped code — a launch blocker if found, not something Claude fills in.

**Performance**
- **D-12:** Hero background (`public/Background.jpg`, 412 KB, the LCP element): optimize while keeping the approved look — convert/compress to modern formats (AVIF/WebP, target ~100–150 KB) and serve with priority loading. Visually indistinguishable is the bar; no artistic changes to the approved artwork.
- **D-13:** Verification bar: Lighthouse 90+ in all four categories (Performance, Accessibility, Best Practices, SEO) on both mobile and desktop, measured against the production build.
- **D-14:** Backup image assets (`BackgroundOld.jpg`, `heroold.jpg`) move out of `public/` into a repo folder that doesn't deploy (e.g. `assets/originals/`) — kept in git, no longer publicly served.

### Claude's Discretion
- Exact metadata implementation shape (static `metadata` exports vs `generateMetadata`, title template via `title.template`, per-route wiring) — planner/executor decide following Next.js App Router conventions.
- Tag-archive and 404 page metadata details, canonical URL handling — follow standard practice; user declined to micro-specify.
- Sitemap/robots implementation — built-in `app/sitemap.ts` / `app/robots.ts` file conventions per CLAUDE.md. Draft posts must be excluded from the sitemap (Phase 2 D-11).
- Favicon fallback set specifics (sizes, apple-touch-icon, dark-mode variant) — Claude judges what's needed for quality.
- Exact image-optimization tooling/format choices for D-12, and Lighthouse measurement method (local `next build` + Lighthouse CI vs manual) — planner decides.

### Deferred Ideas (OUT OF SCOPE)
- RSS/Atom feed, dynamic per-post OG images, JSON-LD structured data, custom domain migration — already tracked as v1.x/v2 requirements (BLOGX-01, SEOX-01, SEOX-02, DOMAIN-01); reconfirmed out of scope for this phase.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Every page/post has accurate meta tags (title, description) and a favicon | Metadata API `title.template`/`generateMetadata` patterns (Architecture Patterns), Velite `excerpt` field already exists (verified in `velite.config.ts`), icon file conventions verified via Context7 |
| SEO-02 | Site generates a sitemap.xml and robots.txt | `app/sitemap.ts` / `app/robots.ts` conventions verified via Context7; `getAllPosts()`/`getAllTags()` in `src/lib/posts.ts` already draft-filtered — reuse directly |
| SEO-03 | Pages have Open Graph images (static acceptable) | `next/og` `ImageResponse` + custom Geist font loading verified via Context7; Geist `.ttf` files confirmed present in `node_modules/geist` (no separate font asset needed); Edge Runtime deprecation finding (Common Pitfalls) directly affects this route's config |
| SEO-04 | Good Core Web Vitals / Lighthouse scores, next/image-optimized images | Empirical baseline Lighthouse run against this repo's actual production build (Summary + Common Pitfalls); Next 16 `images.formats`/`images.qualities` defaults verified via Context7; `sharp` confirmed present and working locally |
| DEPL-01 | Live on Vercel free Hobby tier (vercel.app subdomain) | Vercel Hobby limits (research/STACK.md, MEDIUM confidence, not re-verified this session); HARD GATE D-07 — research documents the deploy-ready checklist, not deployment itself |
</phase_requirements>

## Summary

This phase is almost entirely App Router **Metadata API** wiring on top of a codebase that currently has zero per-page metadata (only a root `metadata` export in `src/app/layout.tsx` with `metadataBase` already correctly set from `NEXT_PUBLIC_SITE_URL`). The work is mechanical and well-documented: a `title.template` in the root layout, `generateMetadata` for the two dynamic routes (`blog/[slug]`, `blog/tags/[tag]`) reading directly from Velite's already-draft-filtered `posts` array, static `metadata` exports on every static page, a build-time `next/og` OG image, static icon files, and `app/sitemap.ts` / `app/robots.ts`. All of these are native, zero-dependency Next.js 16 conventions — no new packages are needed for SEO-01/02/03.

The one piece requiring real engineering judgment is SEO-04 (Lighthouse/Core Web Vitals). This research ran the *actual* production build (`next build && next start`) through Lighthouse locally and found the current baseline is **already close to passing**: Desktop scores 99/96/96/100, but Mobile Performance is 89 — one point under the required 90+ bar, driven almost entirely by the unoptimized `Background.jpg` LCP element (LCP 3.7s on mobile). A second, unrelated finding from the same Lighthouse run is a real defect: three project card images (`/projects/*.png`) referenced in `src/content/projects.ts` do not exist in `public/`, causing 400 errors on every request and failing the `errors-in-console` Best Practices audit — this must be fixed in this phase or the Lighthouse gate (D-13) and general launch quality are at risk.

Critically, this research found that **Next.js's built-in image optimizer re-encodes every image at request time regardless of source format** — pre-converting `Background.jpg` to a fixed AVIF/WebP file does not bypass this pipeline. The two real levers are (1) enabling `images.formats: ['image/avif', 'image/webp']` in `next.config.mjs` (currently unset, defaulting to WebP-only per Next 16 docs) and (2) choosing an explicit `quality` value that is present in `images.qualities` (Next 16 changed the default to `[75]` only — an unlisted quality prop is silently coerced). Empirical testing in this session found this specific image (a 1744×902 painterly/textured background) compresses better as WebP than AVIF at comparable visual quality — a genuinely surprising, verified result that should override the generic "AVIF > WebP" assumption baked into `research/STACK.md`.

**Primary recommendation:** Do the Metadata API wiring exactly as documented (title template, per-route `generateMetadata`, static `sitemap.ts`/`robots.ts`, static `icon.svg` + generated `apple-icon.png` + `favicon.ico`, build-time `opengraph-image.tsx` using the Geist `.ttf` files already vendored in `node_modules/geist`, on the Node.js runtime — not Edge, which Next.js has since deprecated for route segments). Fix the missing project images as a launch blocker before final Lighthouse verification. For the hero image, configure `next.config.mjs` image formats/qualities and re-measure actual served bytes rather than chasing a specific pre-conversion file size.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page/post meta tags (title, description) | Frontend Server (SSR) | — | Next.js Metadata API resolves `metadata`/`generateMetadata` exports server-side at build/request time; no client JS involved |
| Sitemap.xml / robots.txt | Frontend Server (SSR) | — | `app/sitemap.ts`/`app/robots.ts` are Route Handler-like file conventions, statically generated at build since all inputs (Velite posts, static routes) are build-time known |
| OG image generation (`next/og`) | Frontend Server (SSR) | — | `ImageResponse` executes as a Node.js route handler; for this fully-static site it renders once at build time and is served as a static asset thereafter |
| Favicon / app icons | CDN / Static | Frontend Server (SSR) | `icon.svg`/`apple-icon.png`/`favicon.ico` are static files served directly by Vercel's CDN; Next.js only injects the `<link>` tags server-side |
| Image optimization (`next/image`) | CDN / Static | API / Backend | Vercel's Image Optimization API is a serverless function (API tier) invoked on cache miss; results are then cached and served from the CDN tier on subsequent requests |
| Deployment / hosting (Vercel Hobby, GitHub integration) | CDN / Static | — | Vercel's platform is the CDN/edge tier for this project; there is no separate "API/Backend" tier in this app (no database, no server-only business logic beyond static generation) |

## Standard Stack

### Core (already installed — verified against `package.json` and `node_modules`)

| Library | Installed Version | Purpose | Confidence |
|---------|---------|---------|--------------|
| next | 16.2.10 | Metadata API, `next/og`, `sitemap.ts`/`robots.ts`, `next/image` | HIGH — verified in `package.json`, build ran successfully in this session |
| react / react-dom | 19.2.4 | Required peer of Next 16 | HIGH |
| geist | ^1.7.2 | Already-vendored Geist `.ttf`/`.woff2` font files; `.ttf` files (`Geist-Regular.ttf`, `Geist-SemiBold.ttf`, ~126KB each) confirmed present in `node_modules/geist/dist/fonts/geist-sans/` — directly usable via `readFile` for `ImageResponse`'s `fonts` option | HIGH — verified via filesystem inspection this session |
| sharp | 0.34.5 (transitive, via `next`'s `optionalDependencies`) | Powers `next/image`'s local production optimization (`next build && next start`) and is available for any one-off image-conversion scripting this phase needs | HIGH — verified present in `node_modules/sharp`, confirmed functional via a live conversion test this session |

**No new runtime dependencies are required for SEO-01, SEO-02, or SEO-03.** All of it is native Next.js file/API conventions.

### Supporting (one-off tooling, not necessarily added to `package.json`)

| Tool | Verified Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `npx png-to-ico` | 3.0.2 (via npx) | Combine one or more PNGs into a multi-resolution `.ico` for the `favicon.ico` fallback | `sharp` cannot write `.ico` directly; use this as a one-shot CLI step (render 16/32/48px PNGs from the monogram SVG via `sharp`, then pipe into `png-to-ico`) — not a dependency the app needs at runtime |
| `npx lighthouse` | 13.4.0 (via npx) | Automated Lighthouse scoring against the local production build for D-13 verification | Run against `next start` (not `next dev`) with `--form-factor=mobile --screenEmulation.mobile` and `--preset=desktop` for the two required passes; confirmed working headlessly against the system's installed Google Chrome.app in this environment |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next/og` `ImageResponse` at build time | A hand-drawn static PNG/JPEG committed to `public/` | Rejected by D-04 (explicitly locked as build-time code-defined, rename-proof); noted only for completeness |
| `png-to-ico` CLI for favicon.ico | Any online favicon generator | Online generators are fine but not scriptable/reproducible in a git-based workflow; `png-to-ico` keeps the whole favicon pipeline as code |
| Pre-converting `Background.jpg` to a single fixed AVIF/WebP file | Configuring `next.config.mjs` `images.formats`/`images.qualities` and letting `next/image` generate per-breakpoint variants | The config-based approach is recommended — `next/image`'s `fill` + `sizes="100vw"` layout already produces a responsive srcset; a single pre-converted file loses that benefit and gets re-encoded by the optimizer anyway (see Common Pitfalls) |

**Installation:** None required — all core capabilities use already-installed packages. If a `favicon.ico`-generation script is added to the repo, it may add `png-to-ico` as a devDependency:
```bash
npm install -D png-to-ico
```

## Architecture Patterns

### System Architecture Diagram

```
Request for any route (/, /about, /blog/[slug], /blog/tags/[tag], ...)
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│ Next.js App Router (Server Components, fully static)        │
│                                                               │
│  layout.tsx (root)                                           │
│   └─ metadata.title.template = "%s — Rasmus Hansen"          │
│   └─ metadata.metadataBase = NEXT_PUBLIC_SITE_URL (existing) │
│        │                                                      │
│        ▼ (inherited + overridden per segment)                │
│  page.tsx / [slug]/page.tsx / [tag]/page.tsx                 │
│   └─ static `metadata` export (static pages)                 │
│   └─ `generateMetadata()` reading Velite `posts`/`tags`      │
│      (blog post → excerpt as description; tag page →         │
│       hand-authored template)                                │
└─────────────────────────────────────────────────────────────┘
        │
        ├──▶ app/sitemap.ts  ──▶ MetadataRoute.Sitemap
        │        reads getAllPosts() (draft-filtered) +
        │        getAllTags() + static routes → /sitemap.xml
        │
        ├──▶ app/robots.ts ──▶ MetadataRoute.Robots
        │        allow: '/', sitemap: `${siteUrl}/sitemap.xml`
        │
        ├──▶ app/opengraph-image.tsx (next/og ImageResponse)
        │        renders once at build time (static route) →
        │        cached PNG served for every page's og:image
        │
        ├──▶ app/icon.svg (static) + app/apple-icon.png (static)
        │        + app/favicon.ico (static, generated via
        │        sharp + png-to-ico) → auto-injected <link> tags
        │
        └──▶ next/image requests (e.g. Background.jpg)
                 │
                 ▼
         Vercel Image Optimization API (or local `sharp`
         in `next start`) — resizes + re-encodes to
         AVIF/WebP per device breakpoint, using
         next.config.mjs `images.formats`/`images.qualities`
                 │
                 ▼
         Cached, served from CDN edge on subsequent requests
```

### Recommended Project Structure

```
src/app/
├── layout.tsx              # add title.template, richer description, openGraph/twitter defaults
├── opengraph-image.tsx     # NEW — next/og ImageResponse, runtime = 'nodejs' (not 'edge')
├── icon.svg                # NEW — static SVG monogram favicon (modern browsers)
├── apple-icon.png           # NEW — static 180×180 PNG (iOS home screen; SVG not supported here)
├── favicon.ico              # REPLACE existing scaffold default — multi-res ICO fallback
├── sitemap.ts                # NEW — MetadataRoute.Sitemap
├── robots.ts                 # NEW — MetadataRoute.Robots
├── not-found.tsx             # ADD metadata export (title/description only — Next auto-injects noindex)
└── (site)/
    ├── page.tsx               # ADD metadata export (D-02 homepage title)
    ├── about/page.tsx         # ADD metadata export
    ├── projects/page.tsx      # ADD metadata export
    ├── contact/page.tsx       # ADD metadata export
    ├── blog/page.tsx          # ADD metadata export
    ├── blog/[slug]/page.tsx   # ADD generateMetadata (reads Velite post.excerpt)
    └── blog/tags/[tag]/page.tsx # ADD generateMetadata (hand-authored template)
```

### Pattern 1: Title template inheritance
**What:** Root layout sets `title: { template: '%s — Rasmus Hansen', default: 'Rasmus Hansen — Software Developer' }`; every child page/post sets only its own bare `title` string, which Next.js interpolates into the template automatically.
**When to use:** Every static page and every `generateMetadata` return value in this phase.
**Example:**
```typescript
// Source: Context7 /vercel/next.js — generate-metadata.mdx
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    template: '%s — Rasmus Hansen',
    default: 'Rasmus Hansen — Software Developer', // D-02, used when a page sets no title (e.g. homepage)
  },
  description: '...', // site-wide fallback description
};

// src/app/(site)/about/page.tsx
export const metadata: Metadata = {
  title: 'About', // renders as "About — Rasmus Hansen" (D-01)
  description: '...', // hand-written per D-03
};
```

### Pattern 2: `generateMetadata` from Velite data (blog post)
**What:** Async function reading the same `getPostBySlug` used by the page body; reuses `post.excerpt` verbatim as the description per D-03.
**When to use:** `blog/[slug]/page.tsx` only (tag pages have no per-tag excerpt field — hand-author a template instead, e.g. `Posts tagged "${tag}"`).
**Example:**
```typescript
// Source: Context7 /vercel/next.js — generate-metadata.mdx (adapted to this repo's Velite data)
import type { Metadata } from 'next';
import { getPostBySlug } from '@/lib/posts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {}; // notFound() in the page component still handles the 404

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}
```
Note: `getPostBySlug` is synchronous (pure in-memory array read over Velite's build-time output) — no `await` needed on the data call itself, only on `params`.

### Pattern 3: Build-time OG image with a custom local font
**What:** `next/og`'s `ImageResponse`, loading the already-vendored Geist `.ttf` files via `readFile`, rendered with inline flexbox styles only (Satori constraint).
**When to use:** `src/app/opengraph-image.tsx` (site-wide static OG image, D-04/D-05).
**Example:**
```tsx
// Source: Context7 /vercel/next.js — image-response.mdx, adapted with this repo's
// design tokens (src/app/globals.css) and vendored Geist font files
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs'; // NOT 'edge' — see Common Pitfalls: Edge Runtime is deprecated in Next.js 16
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
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF9F6', // --color-paper
          fontFamily: 'Geist',
        }}
      >
        {/* enso monogram — same path data as Header.tsx Monogram(), inline SVG, no Tailwind */}
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M16 5a11 11 0 1 1-7.8 3.2" fill="none" stroke="#1C1B18" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 11v10" fill="none" stroke="#C1440E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: 64, fontWeight: 600, color: '#1C1B18', marginTop: 32 }}>
          Rasmus Hansen
        </div>
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
Bundle-size note: Satori's documented limit is 500KB total (JSX + CSS + fonts + images). Two Geist `.ttf` weights ≈ 254KB combined — comfortably within budget with room for the inline SVG.

### Pattern 4: Sitemap reusing existing draft-safe query layer
**What:** `app/sitemap.ts` composes static routes with `getAllPosts()` (already draft-filtered, per Phase 2 D-11) and `getAllTags()` — no new filtering logic needed.
**When to use:** SEO-02.
**Example:**
```typescript
// Source: Context7 /vercel/next.js — sitemap.mdx, adapted to this repo's lib/posts.ts
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

### Anti-Patterns to Avoid
- **Setting `runtime = 'edge'` on `opengraph-image.tsx`:** Next.js 16 docs explicitly state the Edge Runtime is deprecated for route segment config — use the Node.js runtime (the default; omit the export or set it explicitly to `'nodejs'`). `research/STACK.md`'s Version Compatibility table recommends Edge — that guidance is now stale for Next 16 and should not be followed (see Common Pitfalls).
- **Using Tailwind `className` inside `ImageResponse` JSX:** Silently ignored by Satori. Every style must be an inline `style={{ ... }}` object (already correctly called out in `CLAUDE.md`).
- **Pre-converting the hero image to a fixed-size AVIF/WebP file and treating that as "done":** `next/image` still re-optimizes any raster source at request time; a single pre-converted file both loses responsive multi-breakpoint variants and gets re-encoded again. Configure `next.config.mjs` instead (see Common Pitfalls).
- **Assuming AVIF is always smaller than WebP:** Verified false for this specific image in this session (see Common Pitfalls) — always measure both for photographic/textured source images rather than defaulting to "AVIF is best."

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap XML generation | Custom XML string builder | `app/sitemap.ts` returning `MetadataRoute.Sitemap` | Next.js handles XML serialization, content-type headers, and validates the shape at build time |
| robots.txt generation | Static `public/robots.txt` file | `app/robots.ts` returning `MetadataRoute.Robots` | Keeps the sitemap URL in sync with `NEXT_PUBLIC_SITE_URL` automatically (D-09) rather than a second hardcoded string to maintain |
| OG image rendering | Canvas/node-canvas manual pixel drawing, or a design tool export | `next/og` `ImageResponse` (Satori + resvg under the hood) | Already the officially recommended, zero-extra-dependency path (`@vercel/og` is legacy per `CLAUDE.md`) |
| Favicon `.ico` multi-resolution packing | Hand-crafted binary ICO writer | `png-to-ico` (one-off CLI) fed PNGs rendered by `sharp` | ICO is a legacy multi-image container format; a battle-tested library avoids subtle Windows/old-Safari compatibility bugs |
| Responsive image srcset generation | Manually generating N pre-sized files per breakpoint | `next/image` with `fill`/`sizes` (already used in `src/app/(site)/page.tsx`) + `next.config.mjs` `images.formats`/`images.qualities` | This is exactly what the Image Optimization API is for; hand-rolling it duplicates Vercel's free-tier feature |

**Key insight:** Every SEO-01/02/03 requirement in this phase has a native, first-party Next.js file convention — there is no legitimate reason to add a new npm dependency for any of them.

## Common Pitfalls

### Pitfall 1: Edge Runtime is deprecated for route segments in Next.js 16 — `research/STACK.md` guidance is stale
**What goes wrong:** Following the project's own `STACK.md`/`CLAUDE.md` guidance ("Edge runtime is recommended... `export const runtime = 'edge'` in `opengraph-image.tsx`") produces a route using a runtime Next.js 16 now explicitly deprecates.
**Why it happens:** That guidance was accurate for older Next.js versions where Edge had a meaningful cold-start advantage for `ImageResponse`. Next 16's official docs (verified via Context7 this session) now state plainly: *"The Edge Runtime is deprecated and should be removed from route files."* Cache Components (a Next 16 feature) also requires the Node.js runtime and does not support Edge.
**How to avoid:** Omit the `runtime` export entirely (defaults to Node.js) or set `export const runtime = 'nodejs'` explicitly in `opengraph-image.tsx` and any dynamic `icon.tsx`/`apple-icon.tsx` routes.
**Warning signs:** A build warning or deprecation notice mentioning Edge Runtime; any lingering `export const runtime = 'edge'` in a new SEO route file.
**[VERIFIED: Context7 /vercel/next.js — runtime.mdx, migrating-to-cache-components.mdx]**

### Pitfall 2: `next/image` re-encodes every source at request time — pre-converting the hero image doesn't "finish" D-12
**What goes wrong:** Converting `Background.jpg` to a fixed AVIF/WebP file and swapping the `src` feels like it satisfies "optimize to AVIF/WebP," but Next.js's Image Optimization pipeline (`sharp` locally, Vercel's API in production) decodes and re-encodes *any* raster source into the format/quality/width it decides at request time, based on `next.config.mjs`. Two things actually gate the outcome: (1) `images.formats` — this repo's `next.config.mjs` currently sets no `images` key at all, so it uses the Next 16 **default of `['image/webp']` only** (AVIF is opt-in, not default); (2) `images.qualities` — Next 16 changed the default to only allow quality `75`; an explicit `quality` prop on `<Image>` outside that array is silently coerced to the nearest allowed value.
**Why it happens:** The optimizer's job is exactly this — resize + reformat per requesting device — so it operates on whatever source it's given regardless of pre-processing.
**How to avoid:** Add `images: { formats: ['image/avif', 'image/webp'], qualities: [<chosen values>] }` to `next.config.mjs`, and set an explicit `quality` prop on the `Background.jpg` `<Image fill .../>` matching one of those allowed values. Then measure the actual served bytes (Network tab / `curl -sI` the `/_next/image?...` URL) rather than only checking the source file's on-disk size.
**Warning signs:** Lighthouse's "Serve images in next-gen formats" audit still flagging the hero image after a pre-conversion; a `quality` prop value that doesn't match anything in `images.qualities` (silently coerced, no build warning).
**[VERIFIED: Context7 /vercel/next.js — image.mdx, version-16 upgrade guide; confirmed `next.config.mjs` currently has no `images` key via direct file read]**

### Pitfall 3: AVIF is not automatically smaller than WebP for this specific image
**What goes wrong:** Assuming AVIF always wins (a common, generally-true heuristic — including in this project's own `STACK.md`, which states "AVIF generally compresses 20% smaller than WebP") and shipping an AVIF-only or AVIF-first encode without measuring.
**Why it happens:** AVIF's block-based prediction can perform worse than WebP on certain photographic/textured/painterly content (film grain, brush texture, fine noise) — exactly the character of `Background.jpg` (an aikido/programming artwork background per the git history). Empirical test in this session, converting the actual `public/Background.jpg` (1744×902, 412KB JPEG source) with `sharp`:
  | Format | Quality | Effort | Output size |
  |--------|---------|--------|-------------|
  | WebP | 70 | default | 195.5 KB |
  | WebP | 75 | default | 208.5 KB |
  | AVIF | 70 | default | 293.7 KB |
  | AVIF | 75 | default | 322.0 KB |
  | AVIF | 65 | 9 (max) | 266.9 KB |
  | AVIF | 50 | 9 (max) | 163.7 KB |

  WebP beats AVIF at every comparable quality/effort setting tested for this specific source image.
**How to avoid:** Don't assume — generate both formats at a few quality levels for this exact image and compare actual bytes + visual quality before locking a value. Given these results, **WebP at quality ~65–70 is the more realistic path to D-12's ~100–150KB target** (current best empirical result: 195KB at WebP q70 — likely to come down further with a resize or denoise pass, or may simply need the target range treated as approximate, since D-12's real bar is "visually indistinguishable," not an exact byte count).
**Warning signs:** Shipping AVIF at a "safe-looking" quality value without a side-by-side size comparison against WebP for the same source.
**[VERIFIED: empirical test performed this session against the actual project asset using the already-installed `sharp` package — reproducible, not training-data speculation]**

### Pitfall 4: Missing project images will fail Lighthouse's Best Practices audit and are a real launch defect
**What goes wrong:** `src/content/projects.ts` references `image.src` values of `/projects/rasmusos.png`, `/projects/portfolio-tracker.png`, `/projects/dojo-scheduler.png`, `/projects/devnotes-cli.png` — **none of these files exist in `public/`** (confirmed via `find`/`ls`; `public/` only contains `Background.jpg`, `BackgroundOld.jpg`, `hero.jpg`, `heroold.jpg`, and `static/`). Every render of `Card.tsx` (used on both `/projects` and the homepage featured-projects teaser) requests a `next/image` URL that 400s.
**Why it happens:** Pre-existing gap from Phase 1 (project image assets were never added) that has gone unnoticed because the 400 errors are silent in normal browsing (broken image icon, no visible crash).
**How to avoid:** This surfaced directly in this session's Lighthouse run against the actual production build: `errors-in-console` audit scored 0 (three "Failed to load resource: 400" console errors, one per missing project image), on both `/` and `/projects`. It did not (in this single run) drop either page's overall Best Practices category below the 90 threshold, but it is a real, user-visible defect (broken image icons) directly contradicting "the site is discoverable and shares cleanly" and is highly likely to matter once a real 1200×630 OG-image crawl or a different Lighthouse run samples it differently. **Flag this to the planner as a launch blocker requiring a decision**: either add real/placeholder project screenshot images to `public/projects/`, or explicitly get user sign-off to ship with broken project images (unlikely to be acceptable for a portfolio site).
**Warning signs:** Any `next/image` `400` in server logs or browser console for `/projects` or the homepage; broken-image icons in a visual check.
**[VERIFIED: filesystem inspection (`find public -type f`) cross-referenced against `src/content/projects.ts`; confirmed live via `npx lighthouse` run against this repo's actual `next build && next start` output this session]**

### Pitfall 5: Multiple `priority` images compete for the actual LCP element's bandwidth
**What goes wrong:** `src/app/(site)/page.tsx` currently sets `priority` on *both* the full-bleed `Background.jpg` (`fill`, `sizes="100vw"`) and the circular portrait `hero.jpg` (`width={200} height={200}`). Both generate `<link rel="preload">` hints, competing for early network priority; only the actual LCP candidate should be marked `priority`.
**Why it happens:** It's tempting to mark every above-the-fold image `priority` "to be safe," but Next.js's own guidance is that `priority` should be reserved for the genuine LCP element.
**How to avoid:** Given the background covers the full hero section (larger rendered area than the 200×200 portrait), it is the more likely LCP candidate — but confirm with Lighthouse's `largest-contentful-paint-element` audit against the real build rather than assuming. If the background is confirmed as LCP, consider removing `priority` from the portrait image (it's small and already gets a reasonably-sized `next/image` srcset regardless).
**Warning signs:** Lighthouse's "Preload Largest Contentful Paint image" or a network waterfall showing both images fetched with equal early priority.
**[ASSUMED: the recommendation to potentially remove `priority` from the portrait image; NOT verified with an actual `largest-contentful-paint-element` audit result in this session's Lighthouse run — worth confirming during planning/execution before making this change]**

### Pitfall 6: `apple-icon` does not support SVG — a raster PNG is required
**What goes wrong:** Assuming the same `icon.svg` used for the modern-browser favicon can also serve as the `apple-icon`.
**Why it happens:** Next.js's icon file convention supports `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg` for the general `icon` slot, but the `apple-icon` slot **only** supports `.jpg`, `.jpeg`, `.png` (iOS home-screen icons have never supported SVG).
**How to avoid:** Render a 180×180 PNG from the same monogram SVG (via `sharp`) as `app/apple-icon.png`, separate from `app/icon.svg`.
**Warning signs:** An `apple-icon.svg` file silently ignored by Next.js / iOS Safari falling back to a screenshot-based icon.
**[VERIFIED: Context7 /vercel/next.js — app-icons.mdx, "Image files" section]**

### Pitfall 7 (inherited from project-init research): Missing `metadataBase` silently breaks OG images
**Status in this repo:** Already correctly mitigated — `src/app/layout.tsx` already sets `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')` (confirmed via direct file read). This phase only needs to *build on* it, not fix it. Retained here because every new OG/canonical URL this phase adds depends on this being correct — worth a final `curl`/social-preview-debugger check before calling the phase done, per `research/PITFALLS.md` Pitfall 3.
**[CITED: .planning/research/PITFALLS.md Pitfall 3; verified still-correct via direct read of src/app/layout.tsx this session]**

## Code Examples

### robots.ts (D-10 — search indexing allowed from launch day)
```typescript
// Source: Context7 /vercel/next.js — robots.mdx
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
```

### 404 page metadata (Claude's discretion item — resolved)
```typescript
// Source: Context7 /vercel/next.js — not-found.mdx
// src/app/not-found.tsx — Next.js automatically injects
// <meta name="robots" content="noindex"> on any 404-status response;
// no manual robots config needed, just normal title/description.
export const metadata: Metadata = {
  title: 'Page Not Found',
  description: "The page you're looking for doesn't exist or has moved.",
};
```

### Pre-deploy REPLACE_ME verification check (D-11)
```bash
# Confirmed count in this session: 7 occurrences across 2 files
# (src/lib/site-config.ts: github, linkedin, email;
#  src/content/projects.ts: 4 project `code` links)
grep -rn "REPLACE_ME" src/ && echo "LAUNCH BLOCKED: REPLACE_ME still present" && exit 1
echo "No REPLACE_ME strings found — safe to proceed"
```

### Local Lighthouse measurement (D-13) — commands verified working in this session
```bash
# 1. Build and start the production server (Lighthouse must run against
#    `next start`, not `next dev` — dev mode disables real optimization/caching)
NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build
NEXT_PUBLIC_SITE_URL=http://localhost:3000 PORT=3100 npm run start &

# 2. Mobile pass (Performance/A11y/BP/SEO — all 4 categories, default)
npx lighthouse http://localhost:3100/ \
  --output=json --output-path=./lh-mobile.json \
  --chrome-flags="--headless" --form-factor=mobile --screenEmulation.mobile

# 3. Desktop pass
npx lighthouse http://localhost:3100/ \
  --output=json --output-path=./lh-desktop.json \
  --chrome-flags="--headless" --preset=desktop

# Repeat step 2/3 per route that matters (/, /projects, /blog, /blog/[a-real-slug])
```
Chrome discovery confirmed working out-of-the-box against the system's `/Applications/Google Chrome.app` — no separate Chromium install needed in this environment.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `export const runtime = 'edge'` for `next/og`/`ImageResponse` routes | Node.js runtime (default) | Next.js 16 (documented deprecation) | Any OG-image/icon route in this phase must NOT set `runtime = 'edge'`, contradicting `research/STACK.md`'s Version Compatibility table |
| `images.formats` defaulting to negotiate AVIF automatically | Default is `['image/webp']` only; AVIF is opt-in | Next.js (current docs, re-verified for 16.x this session) | `next.config.mjs` must explicitly add `'image/avif'` to get AVIF served at all |
| Arbitrary `quality` values allowed on `next/image` | Next 16 restricts to an explicit `images.qualities` allow-list (default `[75]`) | Next.js 16 upgrade guide | Any custom `quality` prop needs a matching `next.config.mjs` entry or it's silently coerced |
| `@vercel/og` standalone package | Built-in `next/og` export | Merged into Next.js core (pre-16, already reflected correctly in `CLAUDE.md`) | No action needed — project guidance already correct here |

**Deprecated/outdated:**
- Edge Runtime for App Router route segment config (including `next/og` routes) — see Pitfall 1.
- `research/STACK.md`'s specific claim "Edge runtime is recommended... for faster cold starts on the free tier" for `next/og` — superseded by the Next 16 deprecation; do not follow this specific line from the project's own init-time research.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Removing `priority` from the portrait (`hero.jpg`) image (keeping it only on `Background.jpg`) will improve/not harm LCP timing | Common Pitfalls #5 | Low — this is a one-line, easily-reversible change; worst case is no measurable improvement, not a regression, since the portrait image is small regardless |
| A2 | WebP quality ~65–70 (rather than a lower quality needed to strictly hit 100-150KB) is an acceptable reading of D-12's "target ~100-150 KB... visually indistinguishable is the bar" | Common Pitfalls #3, Standard Stack | Low-Medium — if the planner/user insists on the literal byte target over the visual-quality bar, further quality reduction or a resize pass would be needed; recommend re-confirming with the user during planning if 150-200KB is treated as a hard miss vs. "close enough" |

**All other claims in this research were verified via Context7 (official Next.js docs), direct filesystem/codebase inspection, or empirical local testing (build, Lighthouse run, sharp conversion) performed in this session.**

## Open Questions (RESOLVED)

1. **Is the ~150-200KB empirical WebP result for `Background.jpg` "good enough" against D-12's ~100-150KB target?**
   - RESOLVED (orchestrator, per CONTEXT.md intent): the byte figure is approximate; the binding bars are visual indistinguishability (D-12) and Lighthouse ≥90 mobile (D-13). Addressed by 03-04 (conversion/tuning) and 03-06 Task 2 (Lighthouse gate with quality headroom).
   - What we know: D-12's stated bar is "visually indistinguishable... no artistic changes," with the byte figure given as an approximate target, not a hard requirement.
   - What's unclear: Whether the user would accept ~180-200KB (WebP q65-70, visually clean) vs. insisting on further compression (WebP q50-55, which starts showing visible softening/banding on this textured artwork) or a resolution/effort tuning pass to close the gap.
   - Recommendation: Plan for WebP q65-70 as the primary attempt, present the actual before/after byte comparison and a visual diff to the user as part of phase verification, and treat the exact KB figure as negotiable if the visual bar is met.

2. **Should the missing `public/projects/*.png` images be created in this phase, or is this explicitly out of scope (Phase 1 debt)?**
   - What we know: The phase boundary (CONTEXT.md `<domain>`) says SEO artifacts are "verified against the real Phase 1/2 content" — implying existing content defects surfacing during that verification are this phase's problem to catch, if not necessarily to author.
   - What's unclear: Whether Claude should generate placeholder project screenshots, or whether this needs an explicit user checkpoint (similar to D-11's REPLACE_ME pattern) since it's visual/content work, not infrastructure.
   - Recommendation: Treat as a launch-blocker finding requiring explicit planner/user decision — do not silently skip it, and do not silently generate placeholder images without flagging that they're placeholders (same spirit as D-11).
   - RESOLVED (orchestrator, per CONTEXT.md D-11 pattern): fixed technically with a token-based graceful placeholder (03-05 Tasks 1-2, no fabricated screenshots), and "supply real project screenshots" folded into the pre-deploy user checkpoint (03-07 Tasks 1-2).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/dev toolchain | ✓ | v24.13.0 | — |
| npm | Package management | ✓ | 11.6.2 | — |
| `sharp` (image processing) | next/image local optimization, OG-image/favicon asset generation | ✓ (transitive via `next`'s optionalDependencies) | 0.34.5 | — |
| `google-chrome`/Chromium CLI binary | Lighthouse headless runs | ✗ (no CLI binary on PATH) | — | `/Applications/Google Chrome.app` present and auto-discovered by `npx lighthouse` — confirmed working in this session, no fallback needed |
| `png-to-ico` | favicon.ico generation | ✗ (not installed) | 3.0.2 available via npm registry | `npx png-to-ico` (no install required) confirmed working in this session |
| Git remote / Vercel CLI / Vercel account connection | DEPL-01 actual deployment | ✗ (none configured — expected, per HARD GATE D-07) | — | None needed this phase — deployment itself is explicitly out of scope until the user's go-ahead; this phase only prepares deploy-readiness |

**Missing dependencies with no fallback:** None — every dependency this phase needs either exists already or has a confirmed working `npx` fallback.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No auth in this application |
| V3 Session Management | No | No sessions/cookies |
| V4 Access Control | No | Fully static/public content, no access-controlled routes |
| V5 Input Validation | Yes (narrow) | `blog/[slug]` and `blog/tags/[tag]` already use `generateStaticParams()` + `dynamicParams = false` (verified in both page files) — unknown slugs/tags 404 at the CDN edge with no dynamic rendering of arbitrary input. This phase's `generateMetadata` additions must reuse the same `getPostBySlug`/`getPostsByTag` lookups (no new raw param usage) to preserve this property |
| V6 Cryptography | No | Not applicable — no secrets/crypto operations added by this phase |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| Draft/unpublished content leaking into sitemap or search index | Information Disclosure | Already mitigated at the data layer — `getAllPosts()`/`getAllTags()` in `src/lib/posts.ts` filter `draft: true` posts before any consumer (sitemap, tag list) ever sees them (Phase 2 D-11, verified in code this session); `sitemap.ts` must call these functions, not raw Velite `posts` |
| Using `robots.txt` to "hide" sensitive paths | Information Disclosure | Not applicable here (no sensitive paths exist in this public portfolio), but noted as a standard anti-pattern: `robots.txt` is public and crawlable by anyone — never rely on a `Disallow` rule as an access-control mechanism |
| Leaking non-public env vars into the client bundle via the `NEXT_PUBLIC_` prefix | Information Disclosure | Only `NEXT_PUBLIC_SITE_URL` is intentionally public (needed client + server side for `metadataBase`/canonical URLs); no other env vars should ever receive the `NEXT_PUBLIC_` prefix in this phase's work |
| Reflecting unsanitized user input into `<meta>` tags | Tampering / XSS | Not applicable — every metadata source this phase touches (Velite frontmatter, `site-config.ts`, hand-authored strings) is developer-controlled content, not end-user input |

## Sources

### Primary (HIGH confidence)
- Context7 `/vercel/next.js` — `generate-metadata.mdx` (title template inheritance, `generateMetadata`, `alternates.canonical`, `metadataBase` URL composition), `image-response.mdx` (`ImageResponse` API, Satori font/bundle constraints), `app-icons.mdx` (icon/apple-icon/favicon file-type support matrix), `sitemap.mdx` / `robots.mdx` (`MetadataRoute.Sitemap`/`Robots`), `runtime.mdx` + `migrating-to-cache-components.mdx` (Edge Runtime deprecation), `not-found.mdx` (automatic `noindex` on 404, `global-not-found.js` vs `not-found.js`), `image.mdx` (`images.formats`/`images.qualities` defaults), `version-16.mdx` (qualities default change)
- Direct codebase inspection (this session): `src/app/layout.tsx`, `src/lib/site-config.ts`, `src/components/layout/Header.tsx`, `src/app/(site)/page.tsx`, `src/app/(site)/blog/[slug]/page.tsx`, `src/app/(site)/blog/tags/[tag]/page.tsx`, `src/lib/posts.ts`, `src/content/projects.ts`, `src/components/ui/Card.tsx`, `next.config.mjs`, `velite.config.ts`, `package.json`, `package-lock.json`
- Empirical local testing (this session): `npm run build` (Next 16.2.10, Turbopack, succeeded), `npm run start` + `npx lighthouse` (mobile + desktop passes against actual production build), `sharp` conversion tests against the real `public/Background.jpg`, `npx png-to-ico --help`, `npx sharp-cli --version`

### Secondary (MEDIUM confidence)
- `.planning/research/STACK.md` and `.planning/research/PITFALLS.md` (project-init research, 2026-07-10) — Vercel Hobby tier limits, general MDX/metadata pitfalls; not re-verified this session, and the Edge Runtime recommendation within STACK.md is now known-superseded (see Common Pitfalls #1)

### Tertiary (LOW confidence)
- None used directly in this document beyond what's flagged in the Assumptions Log.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every capability maps to a native Next.js 16 file convention, verified via Context7 and confirmed against the actual installed `package.json`/`node_modules`
- Architecture: HIGH — patterns drawn directly from official docs and adapted against this repo's actual existing files (not hypothetical)
- Pitfalls: HIGH for Pitfalls 1, 2, 3, 4, 6 (all independently verified this session via docs and/or live testing); MEDIUM-LOW for Pitfall 5 (reasoned but not measured against an actual LCP-element audit)

**Research date:** 2026-07-14
**Valid until:** ~30 days for the Next.js/Vercel conventions (stable, versioned APIs); the empirical Lighthouse/image-compression numbers in this document are tied to the exact current state of `public/Background.jpg` and will need re-measurement if that source asset changes before implementation.
