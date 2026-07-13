# Walking Skeleton — RasmusOS

**Phase:** 1
**Generated:** 2026-07-13

## Capability Proven End-to-End

> One sentence: the smallest user-visible capability that exercises the full stack.

A visitor can load `/` served by the built Next.js app, see the Japanese-minimalist hero rendered with self-hosted Geist fonts and `@theme` design tokens (data read from `lib/site-config.ts`), and toggle a persisted light/dark theme — proving scaffold → routing → self-hosted fonts → design tokens → typed data read → one real client UI interaction all work together (plan 01-01).

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16.2.x, App Router only, TypeScript, `src/` dir, `@/*` import alias | Locked in CLAUDE.md; App Router is the only actively developed router and provides Server Components, the Metadata API, and `next/image`/`next/font` this content site needs. Verified `next@16.2.10` in 01-RESEARCH.md. |
| Rendering | Static Server Components (SSG) — no client fetch, no `output: 'export'` | All Phase 1 pages are fixed-path static content; keeping default hybrid mode preserves `next/image` optimization and Node route handlers needed in Phase 3. Only `ThemeToggle`, `ThemeProvider`, and `MobileNav` are `"use client"`. |
| Styling / design tokens | Tailwind CSS v4.x, CSS-first `@theme` in `src/app/globals.css`, NO `tailwind.config.js` | v4 CSS-first config; tokens are real CSS custom properties. Palette "ink & paper + vermillion" (D-01), type scale + spacing per 01-UI-SPEC.md. |
| Data layer (Phase 1) | Plain typed TS: `src/lib/site-config.ts` (object) + `src/content/projects.ts` (typed array), imported directly into Server Components | DB-less by design (CLAUDE.md); no parsing library, no MDX, **no Velite** in Phase 1. Velite/MDX is explicitly deferred to Phase 2's blog (ROADMAP.md). This is the correct minimal-but-real data layer. |
| Theme / dark mode | `next-themes` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`) + Tailwind `@custom-variant dark`, FOUC-safe via `suppressHydrationWarning` | System-preference default (DSGN-02) + persisted manual toggle (D-12) + cross-fade (D-13) off one mechanism. `next-themes@0.4.6` verified. |
| Accessible mobile nav | `@radix-ui/react-dialog` (single headless primitive) for the hamburger overlay | Focus trap / Escape-to-close / focus-return are easy to get wrong hand-rolled; Radix is the correct minimal choice for DSGN-03. Not a UI kit — everything else in `components/ui/*` is hand-rolled Tailwind. |
| Fonts | Geist Sans + Geist Mono via the `geist` package (`next/font` under the hood), CJK fallback stack | Self-hosted, subset, zero Google Fonts request; matches D-02/CLAUDE.md. |
| Icons | `lucide-react` (Sun/Moon, Menu/X, Github/Linkedin/Mail) | Tree-shakeable, geometric/minimal, fits the aesthetic (01-UI-SPEC.md). |
| Metadata baseline | `metadataBase` set in root `layout.tsx` now, backed by `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`) | Root layout is built once, in Phase 1; setting `metadataBase` now avoids Phase 3 rework on OG/canonical URLs (01-RESEARCH.md Pitfall 4). |
| Deployment target | Phase 1: local `npm run dev` / `npm run build` (documented run command). Live Vercel deploy is Phase 3 (DEPL-01). | ROADMAP.md scopes public deployment to Phase 3; Phase 1's "deployment" is a working local full-stack run. |
| Directory layout | `src/app/(site)/*` route group for chrome-wrapped pages; `src/app/not-found.tsx` at root; `src/components/{ui,layout,theme}/`; `src/lib/`; `src/content/` | Directly from 01-RESEARCH.md Recommended Project Structure (subset of project ARCHITECTURE.md). |

## Stack Touched in Phase 1

- [x] Project scaffold (framework, build, lint) — `create-next-app` + ESLint 9 flat config (plan 01-01, Task 1)
- [x] Routing — `/`, `/about`, `/projects`, `/contact`, and custom 404 (`not-found.tsx`) real routes (plans 01-01, 01-03, 01-04)
- [x] "Database" — DB-less by design; the real read/write equivalent is the typed data layer (`lib/site-config.ts`, `content/projects.ts`) read at build time by Server Components (plans 01-01, 01-03)
- [x] UI — interactive theme toggle (next-themes) and accessible mobile nav overlay (Radix Dialog) wired and working (plans 01-01, 01-02)
- [x] Deployment — documented local full-stack run: `npm run dev` (dev) / `npm run build` (production build/SSG). Live Vercel deploy deferred to Phase 3.

## Out of Scope (Deferred to Later Slices)

> Explicit so future phases do not re-litigate Phase 1's minimalism.

- Velite / MDX content pipeline, blog list/post/tag/related pages, syntax highlighting (all Phase 2)
- "Latest writing" homepage teaser (Phase 2 — added once real posts exist; do NOT stub empty now, per CONTEXT.md Deferred Ideas)
- Per-project deep-dive case-study pages (`/projects/[slug]`) — out of scope for v1 (Projects index/card view only)
- Full SEO plumbing: per-page `generateMetadata`, sitemap.xml, robots.txt, OG images, favicon polish, Core Web Vitals tuning (all Phase 3) — only `metadataBase` is set now
- Live public deployment on Vercel + custom domain (Phase 3 / deferred ~1 month)
- The `/blog` nav link resolves to a route that ships in Phase 2 — visible now (D-08) but intentionally 404s until then

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- **Phase 2 — Blog & Content System:** introduce Velite + MDX (`content/posts/*.mdx`), blog list/post/tag-archive/related-posts pages, `rehype-pretty-code` syntax highlighting, low-friction publish workflow; add the `/blog` page behind the nav link already present; reuse this phase's layout, tokens, and `components/ui/*` primitives.
- **Phase 3 — SEO Foundation & Launch:** per-page metadata via the Metadata API (building on the `metadataBase` set here), `sitemap.ts`/`robots.ts`, static OG images (`next/og`), Core Web Vitals tuning with `next/image`, and public deployment to Vercel's free Hobby tier.
