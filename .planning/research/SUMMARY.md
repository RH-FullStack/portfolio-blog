# Project Research Summary

**Project:** RasmusOS (working name) — Personal developer portfolio + blog
**Domain:** Solo-developer personal portfolio + git-based MDX blog, no backend, $0/month on Vercel Hobby
**Researched:** 2026-07-10
**Confidence:** MEDIUM-HIGH

## Executive Summary

This is a personal developer portfolio + blog built on Next.js 16 (App Router), Tailwind CSS v4, and git-based MDX content, deployed on Vercel's free Hobby tier with a custom domain added post-launch. The pattern is well-established: experienced solo developers (Josh Comeau, Lee Robinson, Swyx-style sites) build exactly this shape — a typed content-query layer over MDX files in git, full static generation with no database, and heavy investment in bespoke visual craft as the actual differentiator versus generic portfolio templates. The stack research recommends Velite as the content layer (typed, Zod-validated, actively maintained) over the abandoned Contentlayer or a bare @next/mdx file-routing approach, since this project explicitly needs tag filtering, related posts, RSS, and a blog index — all of which require querying content as a collection, not just rendering individual pages.

The recommended approach is: build the design system and shared layout first, then static pages (home/about/contact), then the content-query layer (lib/posts.ts via Velite) and blog rendering pipeline, then SEO plumbing (metadata, sitemap, RSS, OG images) last, once real content exists to test against. Table-stakes features (hero, about, curated 3-5 project showcase, blog with tags/reading-time/syntax-highlighting, contact via mailto, responsive/fast/accessible baseline, core SEO) define v1 scope; differentiators like dark mode, dynamic OG images, Now/Uses/Colophon pages, and series/collections are explicitly sequenced to v1.x once the core is live; anti-features (CMS, contact-form backend, newsletter, comments, analytics dashboard, overbuilt taxonomy) are deliberately excluded to protect the $0 budget and the "writing must never be a chore" core value.

The dominant risk is not technical — it's that solo-owned portfolio projects notoriously never ship because "done" keeps moving (perfectionism with no external forcing function). This is compounded by real technical pitfalls: MDX hydration mismatches if the content pipeline isn't pinned early, a silently-broken metadataBase that breaks OG images/canonical URLs with no build error, and a fragile custom-domain migration a month post-launch that can lose SEO signal if redirects/canonicals aren't handled with 301s and a Search Console Change of Address. Mitigation is structural: freeze v1 scope to PROJECT.md's Active list before building, centralize the site URL in an env-var-driven lib/site-config.ts from day one, pick one MDX pipeline (Velite) and stick with it, and treat the domain migration as its own explicit phase with a DNS/redirect/SEO checklist rather than a quick add-on.

## Key Findings

### Recommended Stack

Next.js 16 (App Router only, Pages Router excluded), React 19.2, TypeScript, and Tailwind CSS v4 form the core, all defaulted by create-next-app. Velite is the recommended content layer over @next/mdx or Contentlayer — it's Zod-typed, framework-agnostic, and purpose-built for exactly this "git-based MDX, no CMS" pattern, giving compile-time validation of frontmatter instead of runtime breakage. Supporting libraries are all build-time/zero-runtime-cost: rehype-pretty-code+Shiki for syntax highlighting, remark-gfm for tables, rehype-slug+rehype-autolink-headings for heading anchors/ToC, reading-time for computed reading time, feed for RSS, geist for self-hosted fonts. Built-in Next.js file conventions (sitemap.ts, robots.ts, next/og) are preferred over third-party packages (next-sitemap, @vercel/og) since they're simpler and sufficient at this scale.

**Core technologies:**
- Next.js 16 (App Router): routing, rendering, Metadata API — only actively developed router, needed for generateMetadata/streaming/Server Components
- Tailwind CSS v4: styling via CSS-first @theme config — smaller CSS, near-instant rebuilds, fits iterative design tuning
- Velite: typed content layer for MDX — Zod-validated frontmatter, computed fields (reading time), cross-collection queries (posts<->projects), avoids Contentlayer's abandonment risk
- Vercel Hobby tier: hosting — $0/month, generous limits (100GB bandwidth, 6000 build min) for personal-site traffic, but non-commercial-use only

### Expected Features

Table stakes split across two audiences (recruiters/clients scanning the portfolio, organic blog readers) — missing any of these makes the site feel unfinished. Differentiators center on the explicit Japanese-aesthetic design craft plus low-effort "personality" pages (Now, Uses, Colophon) and cross-pillar narrative connecting software/investing/Aikido content. Anti-features are the classic solo-portfolio overreach: CMS, contact-form backend, newsletter, comments, analytics dashboard, overbuilt tag taxonomy — all explicitly deferred or rejected because they add maintenance burden disproportionate to current audience/traffic.

**Must have (table stakes):**
- Hero/intro, About page, curated 3-5 project showcase, tech stack list, mailto contact, social links
- Blog: list view (title/date/excerpt/reading-time/tags), individual post pages, syntax highlighting, tag archive, related posts
- Responsive/fast/accessible baseline, 404 page, favicon/meta tags per page
- SEO foundation: meta tags, sitemap.xml, robots.txt, OG images (can start static)

**Should have (competitive):**
- Distinctive minimalist Japanese-aesthetic design (the stated #1 differentiator)
- RSS/Atom feed, dynamic per-post OG images, JSON-LD structured data
- Now/Uses/Colophon pages, table of contents on long posts, dark/light mode, series/collections

**Defer (v2+):**
- Static full-text search (Pagefind) — gate on 20-30+ posts
- Public investing goal/progress marker, Aikido training log, newsletter, per-project case study pages, command palette nav

### Architecture Approach

Fully static, database-free architecture: content lives as .mdx files (via Velite, per STACK.md) and typed TS data (projects.ts) outside the app/ route tree; a lib/ layer is the only code allowed to touch content, exposing typed query functions (getAllPosts(), getPostsByTag()) that Server Components call directly at build time. Everything renders via generateStaticParams/SSG with dynamicParams = false — no ISR, no server compute, no database round-trip — since content only changes on git push, which already triggers a full Vercel rebuild.

**Major components:**
1. Content source (content/blog/*.mdx, content/projects.ts) — frontmatter + prose / structured project data, git-committed
2. Content access layer (lib/posts.ts, lib/projects.ts, lib/site-config.ts) — parses/queries content, single source of truth for site URL/name/social links
3. Route segments (app/(site)/...) — thin Server Components calling lib/ functions, generateStaticParams/generateMetadata
4. SEO/metadata layer (sitemap.ts, robots.ts, feed.xml/route.ts, opengraph-image.tsx) — all read the same lib/ functions to stay in sync

### Critical Pitfalls

1. **Project never ships (scope/perfectionism creep)** — freeze v1 scope to PROJECT.md's Active list, set a hard launch date, ship the placeholder brand name rather than perfecting it first
2. **MDX hydration mismatches / silent build breaks** — pin one MDX pipeline (Velite) early, format dates with fixed locale/timezone, avoid Contentlayer entirely
3. **Missing metadataBase silently breaks OG images/canonical URLs** — set it via env var in root layout from day one, since it fails with no build error and only surfaces when someone shares a broken link
4. **Custom domain cutover causes downtime/broken links** — add both apex and www, verify DNS propagation before announcing, never remove the vercel.app domain
5. **Domain migration loses SEO signal** — use 301 (not 302) redirects, update canonicals via the same env var, file Change of Address in Search Console

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation — Design System & Shared Layout
**Rationale:** Every other page depends on the design tokens (Tailwind @theme), root layout, and UI primitives existing first; building pages before this means redoing styling twice (ARCHITECTURE.md build order, step 1-2).
**Delivers:** globals.css design tokens, root layout + (site) route group (header/footer/container), 5-8 UI primitives (Button, Card, Tag, Container, Prose)
**Addresses:** Distinctive minimalist Japanese-aesthetic design (the stated #1 differentiator)
**Avoids:** Pitfall — generic "developer portfolio template" look; front-loading design craft here avoids retrofitting it later

### Phase 2: Static Pages — Home, About, Contact, Projects
**Rationale:** No content-layer dependency; validates the layout/design system end-to-end with real copy before the more complex MDX pipeline is introduced (ARCHITECTURE.md build order, step 3).
**Delivers:** Hero/intro, About page (multi-pillar narrative), curated 3-5 project showcase (lib/projects.ts typed data), contact page (mailto + socials)
**Addresses:** Hero/value-prop, About page, curated project showcase, tech stack list, contact method — all P1 table stakes from FEATURES.md
**Avoids:** Pitfall — perfectionism creep (ship content-complete static pages before touching the harder MDX pipeline)

### Phase 3: Content System — Blog with Velite/MDX
**Rationale:** Highest-complexity piece (frontmatter validation, MDX compilation, static params); build and verify with 1-2 seed posts before building index/tag UI on top (ARCHITECTURE.md build order, step 5-6). This is also where the "writing must never be a chore" core value lives or dies.
**Delivers:** lib/posts.ts via Velite, blog list + individual post pages, syntax highlighting, tag archive, related posts, a low-friction new-post template/script
**Uses:** Velite, rehype-pretty-code/Shiki, remark-gfm, rehype-slug+rehype-autolink-headings, reading-time
**Implements:** Content access layer + MDX rendering pipeline components from ARCHITECTURE.md
**Avoids:** Pitfall 2 (MDX hydration/build breaks — pin Velite, fixed-locale dates) and Pitfall 7 (authoring friction — build the post template/script as an explicit acceptance criterion, not an afterthought)

### Phase 4: SEO Foundation & Launch
**Rationale:** Depends on lib/posts.ts/lib/projects.ts and lib/site-config.ts already returning real data; building SEO plumbing first would mean testing against empty/fake content (ARCHITECTURE.md build order, step 8-9).
**Delivers:** metadataBase-driven generateMetadata per route, sitemap.ts, robots.ts, feed.xml/route.ts, default OG images, deployment on Vercel free tier (vercel.app subdomain)
**Addresses:** SEO foundation, fast performance/Core Web Vitals, RSS feed — P1/P2 features from FEATURES.md
**Avoids:** Pitfall 3 (missing metadataBase breaking OG/canonical silently) — build it as an env var from the start; Pitfall 6 (Vercel Hobby ToS/limits) — awareness check at launch

### Phase 5 (deferred ~1 month): Custom Domain Migration
**Rationale:** Explicitly deferred per PROJECT.md; should be its own small phase with a DNS + redirect + SEO-continuity checklist, not a quick add-on, since it happens on an already-linked live site.
**Delivers:** Custom domain live (apex + www), 301 redirects from vercel.app, Google Search Console Change of Address filed, canonical tags updated
**Avoids:** Pitfall 4 (DNS cutover downtime/broken links) and Pitfall 5 (SEO signal loss from bad migration) — the domain migration checklist from PITFALLS.md is the acceptance criteria for this phase

### Phase Ordering Rationale

- Design tokens/layout must precede all pages (shared dependency, avoids redoing styling)
- Static pages precede the MDX content system because they have no content-layer dependency and let the design system be validated with real copy first, isolating MDX pipeline complexity into its own phase
- SEO plumbing is deliberately last among v1 phases because every SEO artifact (sitemap, RSS, metadata) depends on lib/posts.ts/lib/projects.ts returning real data — building it against empty content would be wasted/retested work
- The custom domain migration is a distinct, later phase (not bundled into launch) because PROJECT.md explicitly defers it a month, and it carries its own DNS/SEO-continuity risk profile that deserves a dedicated checklist rather than being an afterthought tacked onto the launch phase

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Content System):** Velite's Next.js wiring (next.config.mjs integration) is noted as its "one real piece of setup friction" in STACK.md — worth a --research-phase pass to nail the exact wiring pattern and MDX component override conventions before writing real posts
- **Phase 5 (Domain Migration):** DNS/redirect/Search-Console mechanics are one-shot, high-stakes, and easy to get subtly wrong (302 vs 301, missing apex/www pairing) — worth a focused research pass immediately before executing, even though the general pattern is well-documented

Phases with standard patterns (skip research-phase):
- **Phase 1 (Design System):** Tailwind v4 @theme conventions are well-documented, standard Next.js App Router layout patterns
- **Phase 2 (Static Pages):** Standard Server Component pages, no novel patterns
- **Phase 4 (SEO Foundation):** Next.js Metadata API, sitemap.ts/robots.ts file conventions are official, well-documented first-party features

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core framework/versions verified via Context7 + official Next.js/Velite/feed docs; some npm package patch versions MEDIUM (web search only) |
| Features | MEDIUM-HIGH | Table stakes and SEO mechanics HIGH (official docs, multiple corroborating sources); multi-pillar content strategy and "differentiator" judgments MEDIUM (practitioner synthesis, not a single authoritative spec) |
| Architecture | HIGH | Core patterns verified against official Next.js docs; content-collection specifics MEDIUM (several viable approaches exist — Velite chosen in STACK.md over the gray-matter+next-mdx-remote pattern shown in ARCHITECTURE.md's examples) |
| Pitfalls | MEDIUM-HIGH | Technical pitfalls (hydration, metadataBase, domain migration) verified against Next.js/Vercel/Google official docs; "never ships" and content-discipline pitfalls are well-documented community patterns, not officially sourced |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Content pipeline discrepancy:** STACK.md recommends Velite as the content layer; ARCHITECTURE.md's worked code examples use gray-matter + next-mdx-remote (Pattern 1) instead, treating Velite as unaddressed. These are not fully reconciled — during Phase 3 planning, confirm Velite is used end-to-end (it supersedes gray-matter per STACK.md's explicit note) and update lib/posts.ts implementation details accordingly rather than following ARCHITECTURE.md's example code literally.
- **Tailwind v4 exact patch version:** MEDIUM confidence only — verify npm view tailwindcss version at project init time rather than trusting a pinned version in this research.
- **Vercel Portfolio Starter Kit:** referenced by official Next.js docs as a canonical working example of this architecture but not directly inspected in this research — worth cloning/reviewing during Phase 1-2 implementation for concrete patterns.
- **Brand name/domain:** "RasmusOS" is an explicit placeholder per PROJECT.md; treat as content, not architecture — do not let it block Phase 1-4, per the anti-perfectionism guidance in PITFALLS.md.

## Sources

### Primary (HIGH confidence)
- Context7 /vercel/next.js — App Router conventions, next/og, sitemap.ts/robots.ts, next/font
- Context7 /zce/velite — Next.js integration guide, MDX rendering pattern
- Context7 /jpmonette/feed — RSS/Atom/JSON feed generation
- Context7 /rehype-pretty/rehype-pretty-code — Shiki-based syntax highlighting
- nextjs.org official docs — MDX guide, Metadata API, generateMetadata, sitemap/robots file conventions, project structure, hydration error docs
- vercel.com official docs — Hobby plan limits, fair-use guidelines, domain/DNS setup and troubleshooting
- developers.google.com — Site Moves and Migrations (Search Central)

### Secondary (MEDIUM confidence)
- Josh W. Comeau — "How I Built My Blog v2" and "Building an Effective Dev Portfolio" — practitioner-authored, corroborates design/architecture patterns
- Multiple 2026-dated community write-ups on Tailwind v4 adoption, Contentlayer abandonment, RSS feed patterns — corroborated across 3+ independent sources each
- Vercel Community discussions — Hobby plan limit behavior, domain reassignment/canonical conflicts

### Tertiary (LOW confidence)
- dev.to anecdote on "why I no longer have a personal website" — single-perspective, used only to corroborate the perfectionism anti-pattern already seen elsewhere
- Indie Hackers newsletter threads — community opinion on newsletter timing, not authoritative but directionally consistent

---
*Research completed: 2026-07-10*
*Ready for roadmap: yes*
