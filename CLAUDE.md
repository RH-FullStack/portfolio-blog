<!-- GSD:project-start source:PROJECT.md -->

## Project

**RasmusOS**

A personal website that combines a professional software portfolio with a personal blog documenting Rasmus's journey as a developer, entrepreneur, aikidoka, and long-term investor working toward the freedom to live and work from Japan part of the year. It's built as a long-term, compounding personal brand asset — not a static CV.

**Core Value:** A live, fast, professional site where Rasmus can showcase his work and keep publishing his journey — if writing a new post is ever a chore, the whole point is lost.

### Constraints

- **Budget**: $0/month for hosting/infra — Vercel free tier is the target; the only real cost is ~$10-15/year for the domain, added next month, which must not block launch
- **Tech stack**: Next.js (React), Tailwind CSS, MDX for content — chosen so Rasmus can learn from and be comfortable maintaining the stack himself
- **No backend/database for v1**: keeps infra cost and ongoing maintenance at zero
- **Language**: English only for v1 — widest reach for employers/clients/readers, avoids i18n complexity

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.2.x (App Router only) | React framework, routing, rendering, image/font optimization, metadata API | Stable since October 2025, current version 16.2.7+ as of June 2026. App Router is the only actively developed router — Pages Router is in maintenance mode and lacks Server Components, streaming, and the native Metadata API this project needs for SEO. Next 16 also ships layout-deduplicated prefetching and stable React Compiler support, both free performance wins for a content site. HIGH confidence (verified via Context7 `/vercel/next.js` and official Next.js 16 blog post). |
| React | 19.2 (bundled with Next 16) | UI library | Installed automatically by `create-next-app`; no separate decision needed. HIGH confidence. |
| TypeScript | 5.x | Type safety | Default in `create-next-app`; pairs with Velite's Zod-generated types for fully typed blog/project content — catches broken frontmatter at build time instead of runtime. HIGH confidence. |
| Tailwind CSS | v4.1.x | Styling | v4's CSS-first config (`@theme` in globals.css, no `tailwind.config.js` needed) and Lightning CSS engine produce ~70% smaller CSS than v3 and near-instant rebuilds — matters for a hand-crafted, minimalist design where you'll be tuning spacing/type scale constantly. `create-next-app --tailwind` has shipped v4 by default since Next 15.2. MEDIUM confidence on exact patch version (verify `npm view tailwindcss version` at project init; v4 major-version choice itself is HIGH confidence). |
| Velite | latest 0.x | Type-safe content layer for MDX (frontmatter validation, computed fields, cross-collection queries) | Turns `content/posts/*.mdx` and `content/projects/*.mdx` into a typed, validated data layer (`.velite` output) using Zod schemas — you get compile-time errors for a missing `title` or malformed date instead of a broken build discovered on Vercel. Framework-agnostic, actively maintained, purpose-built for exactly this "git-based MDX, no CMS" pattern. Verified via Context7 `/zce/velite` (Next.js integration guide, MDX rendering guide). HIGH confidence. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `rehype-pretty-code` | 0.14.x | Syntax highlighting for code blocks in MDX, powered by Shiki | Wire into Velite's `mdx.rehypePlugins` array. Renders highlighted HTML at build time (zero client-side JS for highlighting), uses the same TextMate grammars as VS Code. Unstyled by default — you write your own CSS against its data attributes, which fits a hand-crafted design. |
| `shiki` | v4.x (peer dep of rehype-pretty-code) | Highlighter engine | Usually pulled in transitively by rehype-pretty-code; only add it directly if you want a shared `createHighlighter` instance to speed up builds once you have 20+ code-heavy posts. Not needed at launch. |
| `remark-gfm` | 4.x | GitHub-flavored markdown (tables, strikethrough, task lists, autolinked URLs) | Add to Velite's `mdx.remarkPlugins`. Table stakes for a technical blog — you will want tables and `~~strikethrough~~` eventually. |
| `rehype-slug` + `rehype-autolink-headings` | latest | Auto-generate `id` attributes on headings and clickable anchor links | Add to `mdx.rehypePlugins`. Small craft touch — lets readers link directly to a subsection of a long post. Low effort, matches the "quality craftsmanship" design goal. |
| `reading-time` | 1.5.x | Estimated reading time from word count | Call inside a Velite `transform` on the `posts` schema to add a computed `readingTime` field. Simple, dependency-free, does the job — no need for anything fancier. |
| `feed` (jpmonette/feed) | 4.2.x | RSS / Atom / JSON feed generation | Use inside `app/feed.xml/route.ts` (a Route Handler, not a React component) to build the feed from Velite's `posts` collection at request time (cheap — it's just serializing already-parsed data). Verified via Context7 `/jpmonette/feed`. HIGH confidence. |
| `schema-dts` | latest | TypeScript types for schema.org JSON-LD objects | Optional but recommended: gives you autocomplete/type-checking when hand-writing the `Person`, `WebSite`, and `BlogPosting` JSON-LD objects injected via `<script type="application/ld+json">`. Prevents typos in schema property names that would otherwise only be caught by Google's Rich Results Test after deploy. |
| `geist` (Vercel) | latest | Self-hosted variable font (Geist Sans + Geist Mono) via `next/font` | Recommended default typeface: clean, modern, free, designed by Vercel specifically for products like this. Loads through `next/font`, so it's self-hosted (no request to Google Fonts, no layout shift) and subset automatically. Fits the "minimalist, technical, craft" brief without needing a licensing decision. |
| `next-themes` | latest | Light/dark mode toggle | Only add if dark mode becomes a v1 requirement (currently not listed in PROJECT.md's Active requirements). Skip until it's actually needed — do not pre-install. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint 9 (flat config) | Linting | Shipped by `create-next-app` with the `eslint-config-next` package pinned to your Next.js version. Keep default config; add `eslint-plugin-mdx` only if you want lint coverage inside `.mdx` files themselves. |
| Prettier | Formatting | Optional but recommended for consistent MDX/TSX formatting across writing sessions. `prettier-plugin-tailwindcss` auto-sorts Tailwind classes — worth adding given the design-detail focus of this project. |
| pnpm | Package manager | Recommended over npm for faster installs and disk-efficient node_modules (matters less at this scale, but it's Vercel's own preferred manager and has zero downside). npm works identically if you'd rather not add a new tool to learn. |

## Installation

# Scaffold (Tailwind v4 + TS + App Router are all defaults now)

# Content layer

# MDX processing plugins (wired into velite.config.ts)

# Content utilities

# SEO typing (optional but cheap)

# Fonts

# Dev tooling

- Do **not** additionally `npm install gray-matter` — Velite parses and validates frontmatter itself via its Zod schemas; adding gray-matter on top is redundant unless you deliberately skip Velite (see Alternatives below).
- Do **not** install `@next/mdx` alongside Velite — they're two different content pipelines for the same problem; pick one (this doc recommends Velite).
- No image-optimization package (e.g. `sharp`) needs to be installed manually — Vercel's build environment provides it automatically for `next/image` on deploy.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Velite (typed content layer) | `@next/mdx` + plain filesystem routing (`.mdx` files directly under `app/blog/`) | If you want the absolute simplest setup and don't need computed fields (reading time), typed frontmatter, or cross-collection queries (e.g., "all posts tagged aikido"). Fine for a 3-5 post blog; becomes painful once you want tag pages, related-posts, or a projects index sorted by date. |
| Velite | `contentlayer2` (community fork of the abandoned original Contentlayer) | If you specifically want Contentlayer's API and are already familiar with it. It's a legitimate, maintained fork — but it carries more historical baggage (breaking-change discussions ongoing, heavier build step) than Velite, which was built fresh with the same Zod-first philosophy. |
| Velite | `content-collections` | A newer, actively-discussed alternative in the same space (some teams are migrating *to* it from contentlayer2). Worth a second look if Velite's Next.js integration friction (manual webpack-plugin or `next.config` wiring — see Version Compatibility below) becomes annoying, but it has a smaller community track record than Velite as of this research. LOW confidence on long-term trajectory — not enough evidence to recommend it over Velite today. |
| `next/og` (built-in `ImageResponse` from `next/og`) | `@vercel/og` (standalone package) | Never for a new Next.js 13.3+ project — `@vercel/og` was the original standalone package before its functionality was merged into Next.js core. It is legacy; `next/og` is the same engine (Satori), built in, zero extra dependency. |
| Built-in `app/sitemap.ts` | `next-sitemap` package | Only if you need very large, sharded sitemaps (10,000+ URLs) via `generateSitemaps()`, or need sitemap generation for a `output: 'export'` static site pre-Next-13 style. For a personal site with a few dozen pages, the built-in file convention is simpler and one less dependency. |
| Geist (`next/font` self-hosted) | Any other Google Font via `next/font/google` | If Geist doesn't match the desired "Japanese minimalist" feel, any Google Font works identically well through `next/font/google` — the self-hosting/optimization benefit is the same. Just avoid loading more than 2 font families / 4-5 weights total; each additional weight is a real download-size cost on a performance-focused site. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| Pages Router (`pages/` directory) for new routes | Maintenance mode. No React Server Components, no streaming, no native Metadata API (`generateMetadata`) — you'd have to hand-roll `<Head>` tags for every page's SEO metadata, which is exactly what App Router solves natively. | App Router (`app/` directory) — already the default from `create-next-app`. |
| Original `contentlayer` / `next-contentlayer` (unscoped, not `contentlayer2`) | Abandoned after Netlify's acquisition of the maintainer; unpatched for current Next.js/React versions. | `velite` (recommended) or `contentlayer2` / `next-contentlayer2` if you specifically want the Contentlayer API. |
| `@vercel/og` standalone package | Superseded by the built-in `next/og` export; installing it separately just adds a redundant dependency doing the same job. | `import { ImageResponse } from 'next/og'` |
| Moment.js for date formatting | Unmaintained (project itself recommends against new usage), large bundle for a task this simple. | Native `Intl.DateTimeFormat` for "July 10, 2026"-style formatting, or `date-fns` only if you need relative-time ("3 days ago") formatting later. |
| Headless CMS (Sanity, Contentful, Payload, etc.) | Explicitly out of scope per PROJECT.md — adds hosting cost/complexity and an external dependency for a solo git-based workflow that doesn't need multi-user editing. | Git-based MDX files + Velite, as already decided. |
| `next-sitemap` for a site this size | Extra dependency and a post-build step to remember to run; solves a scale problem (huge dynamic sitemaps) this project doesn't have. | Built-in `app/sitemap.ts` file convention. |
| Tailwind classes inside `next/og` `ImageResponse` JSX | Satori (the engine behind `ImageResponse`) only supports inline styles with flexbox — Tailwind's `className` utilities are silently ignored, which is a common and confusing gotcha. | Write the OG image component with plain inline `style={{ display: 'flex', ... }}` objects. |

## Stack Patterns by Variant

- Do **not** set `output: 'export'` in `next.config.ts`. Leave Next.js in its default hybrid mode.
- Because: static export disables the built-in Image Optimization API (`next/image` would need a custom loader) and restricts Route Handlers that rely on the Node.js runtime (used for `feed.xml` and OG image generation). Vercel's normal build already serves static content from its edge network for free within Hobby-tier limits — there's no benefit to static export here, only lost features.
- Use Velite's ability to define multiple collections (`posts`, `projects`) in one `velite.config.ts` and cross-reference by a shared `tags` or `relatedSlugs` field.
- Because: this is exactly the typed cross-collection querying that justifies choosing Velite over plain `@next/mdx` filesystem parsing in the first place.
- Add a CJK fallback in the Tailwind `@theme` font stack (e.g. `font-family: var(--font-geist-sans), 'Hiragino Sans', 'Noto Sans JP', sans-serif`) rather than bundling a full Japanese font family through `next/font`.
- Because: bundling Noto Sans JP (or similar) via `next/font` adds hundreds of KB even when subset, for what would be a handful of characters in an English-only v1 site. Let the reader's OS-installed CJK font render those glyphs instead.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|------------------|-------|
| `next@16.x` | `react@19.2`, `react-dom@19.2` | Installed automatically together by `create-next-app`; don't pin React independently. |
| `tailwindcss@4.x` | Node.js 20+ | v4's Lightning CSS engine requires Node 20+; confirm Vercel project settings use Node 20 or later (default on new projects). |
| `velite` | Next.js App Router (any recent version) | Velite is framework-agnostic and doesn't hook into Next's build pipeline automatically — you must wire it in yourself via either a top-level-await block in `next.config.mjs` (ESM) or a small custom Webpack plugin (CommonJS), both documented in Velite's official Next.js integration guide. This manual wiring step is Velite's one real piece of setup friction; budget ~30 minutes for it. |
| `rehype-pretty-code@0.14.x` | `shiki@1.x` through `shiki@4.x` | Supports current Shiki majors; no action needed beyond letting npm resolve the peer dependency. |
| `next/og` (`ImageResponse`) | Node.js or Edge runtime | Works in both; Edge runtime is recommended (`export const runtime = 'edge'` in `opengraph-image.tsx`) for faster cold starts on the free tier. |

## Vercel Hobby Tier — What Stays Free (verified MEDIUM confidence via multiple 2026 sources, cross-checked against vercel.com/docs/limits)

| Resource | Hobby (free) limit | Relevance to this project |
|----------|--------------------|-----------------------------|
| Bandwidth | 100 GB/month (includes image optimization egress) | A low-traffic personal portfolio/blog will use a tiny fraction of this — not a realistic concern at launch. |
| Build minutes | 6,000/month, 1 concurrent build | Plenty for a static content site rebuilt on each git push; Velite's build step adds seconds, not minutes. |
| Image transformations | 5,000/month | Each *unique* size/format variant of each image counts once (then cached). A portfolio with a few dozen project screenshots and post cover images will stay well under this — but avoid intentionally generating many arbitrary responsive sizes per image if traffic ever spikes. |
| Serverless/Edge function invocations | 1,000,000/month, 60-second max duration | Route Handlers for `feed.xml`, `sitemap.xml`, and OG image generation are cheap per-invocation; irrelevant at personal-site traffic. |
| Commercial use | **Not permitted** — Hobby is for non-commercial personal projects only | Important nuance: the site *showcasing* SaaS/entrepreneurship work is fine (it's a portfolio, explicitly listed as an allowed Hobby use case), but if the site itself ever starts processing payments, running ads, or directly selling something, that specific functionality would need a Pro plan. A mailto contact link and portfolio content do not trigger this. |

## Sources

- Context7 `/vercel/next.js` — App Router conventions, `next/og`, `sitemap.ts`/`robots.ts` file conventions, `next/font`
- Context7 `/zce/velite` — Next.js integration guide, MDX rendering pattern, project structure example
- Context7 `/jpmonette/feed` — RSS/Atom/JSON feed generation API
- Context7 `/rehype-pretty/rehype-pretty-code` — Shiki-based syntax highlighting configuration
- Context7 `/jonschlinkert/gray-matter` — confirmed as the standard frontmatter parser (used as fallback reference; not part of the recommended path since Velite supersedes it)
- [nextjs.org/blog/next-16](https://nextjs.org/blog/next-16) — Next.js 16 features (Cache Components, async params, React Compiler support) — HIGH confidence, official
- [nextjs.org/docs/app/guides/mdx](https://nextjs.org/docs/app/guides/mdx) — official `@next/mdx` guide, used to confirm the "simpler alternative" path — HIGH confidence
- [nextjs.org/docs/app/api-reference/functions/image-response](https://nextjs.org/docs/app/api-reference/functions/image-response) — `next/og` `ImageResponse` API and Satori inline-style constraint — HIGH confidence
- [vercel.com/docs/plans/hobby](https://vercel.com/docs/plans/hobby) and [vercel.com/docs/limits](https://vercel.com/docs/limits) — Hobby tier limits — HIGH confidence, official
- [vercel.com/docs/limits/fair-use-guidelines](https://vercel.com/docs/limits/fair-use-guidelines) — commercial-use definition — HIGH confidence, official
- WebSearch (multiple 2026-dated sources, cross-checked) — Tailwind v4 adoption in Next.js, Contentlayer abandonment/contentlayer2 fork status, Shiki v4 current version, rehype-pretty-code 0.14.x current version — MEDIUM confidence (community sources, not single-vendor docs, but corroborated across 3+ independent articles each)

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
