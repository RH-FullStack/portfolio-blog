# Phase 2: Blog & Content System - Context

**Gathered:** 2026-07-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Visitors can browse, read, and discover blog posts written as git-committed MDX files with syntax-highlighted code and tag-based navigation, and Rasmus can publish a new post with zero manual boilerplate. This phase builds the content layer (Velite + MDX pipeline) on top of Phase 1's design system and layout primitives — it does not touch SEO plumbing (Phase 3) or introduce new pages outside the blog + a homepage teaser section.

Requirements covered: BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06.

</domain>

<decisions>
## Implementation Decisions

### Blog Index & Tag Styling
- **D-01:** Blog index (`/blog`) uses a plain text list — no card chrome or images. Large clickable title headline per post, metadata row beneath (date · reading time · tags), thin divider between posts. Deliberately distinct from the image-driven Projects card grid — leans into the "ma" whitespace philosophy (Phase 1 D-04).
- **D-02:** Blog tags are styled neutrally, reusing the existing `Tag` component's visual treatment (neutral secondary surface) — not color-coded per pillar. Vermillion accent stays reserved for interactive/emphasis states only (Phase 1 D-01).
- **D-03:** Tag archive is per-tag pages only (`/blog/tags/[tag]`), reached by clicking a tag on a post or list row. No standalone `/blog/tags` overview/index page — not justified with only 4 pillars at launch.
- **D-04:** A post's frontmatter `tags` field accepts an array — multiple pillar tags per post are allowed (cross-pillar posts, e.g. entrepreneurship + aikido, are a natural fit for this blog's premise and shouldn't be forced into one category).

### Related Posts Behavior
- **D-05:** Show up to 3 related posts at the end of each post, matched by shared tags.
- **D-06:** If a post has fewer than 3 shared-tag matches, fill remaining slots with the most recent other posts (excluding the current one) — the section should never look broken or empty, even with only 2-3 total posts at launch.
- **D-07:** Related-post entries are compact: title + date only. No excerpt/tags repeated — keeps the section visually secondary to the article just read.
- **D-08:** Ranking weights posts by tag-overlap count (more shared tags = higher rank), ties broken by recency. This is a build-time computation (array intersection size), not runtime.

### Post Page & Authoring Workflow
- **D-09:** Frontmatter schema: `title`, `date`, `tags` (array), `excerpt`, `draft` (boolean). No `coverImage` field — consistent with the text-only index/related-posts decisions (D-01, D-07); nothing in this phase needs post imagery.
- **D-10:** Excerpt is a manually-written frontmatter field (not auto-derived from post body) — gives deliberate control over the reader hook shown in the list.
- **D-11:** `draft: true` frontmatter flag excludes a post from all public views (list, tags, related, sitemap) without needing to delete or move the file — per REQUIREMENTS.md's "simple draft flag is enough."
- **D-12:** No byline on post pages ("By Rasmus Hansen") — redundant given the whole site is his; author identity is already established via the About page and header wordmark.
- **D-13:** Add clickable heading anchor links via `rehype-slug` + `rehype-autolink-headings`, wired into Velite's `mdx.rehypePlugins`. Low effort per STACK.md, matches the "quality craftsmanship" design goal.
- **D-14 (launch content plan):** Rasmus will have 2-3 real posts at launch, covering at least 2 different content pillars (so tag filtering and related-posts have genuine matches to exercise, not placeholder/fake text). **Claude drafts the actual MDX content** (structure + prose) grounded in PROJECT.md's developer/aikidoka/investor journey and the four content pillars (software/architecture, SaaS/entrepreneurship, investing, aikido & Japan) — Rasmus reviews, edits, and approves each draft before it's committed as a real (non-draft) post. This is a content-authoring task within the phase plan, not just a technical build task — budget planning time for it accordingly.

### Homepage Latest-Post Teaser
- **D-15:** Add the homepage "latest writing" teaser now (carried forward from Phase 1's deferred D-07 — Phase 1 explicitly stubbed this out, waiting for real post content, which this phase produces).
- **D-16:** Shows 3 posts, placed below the existing featured-projects teaser (Projects section stays the primary portfolio pitch; Blog is the secondary "journey" narrative — mirrors the site's professional-portfolio-first framing).
- **D-17:** Same compact list style as the blog index/related-posts (title + date) — not the `Card` component used by the featured-projects teaser above it. Keeps the homepage from stacking two card grids; Projects keeps sole ownership of the card treatment.
- **D-18:** Includes a "View all posts" link to `/blog`, consistent with the featured-projects teaser's "View all projects" link pattern.

### Claude's Discretion
- Exact component decomposition for the compact list style (D-01, D-07, D-17) — e.g., whether blog-index rows and related-post/homepage-teaser rows share one underlying component or are separate — is an implementation detail for planning, not decided here.
- Velite schema/config wiring specifics (collections, transforms for `readingTime`, cross-collection queries for related posts) — per the Phase 2 research flag in ROADMAP.md, this needs a dedicated research pass during planning.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope & requirements
- `.planning/PROJECT.md` — core value, constraints ($0/month, Next.js/Tailwind/MDX stack, English-only, no backend), content pillars (software/architecture, SaaS/entrepreneurship, investing, aikido & Japan), brand-name-is-placeholder note
- `.planning/REQUIREMENTS.md` — BLOG-01..06 (this phase's requirements), the "keep tags flat and aligned to content pillars" and "simple draft: true flag" Out-of-Scope notes (both directly inform D-04 and D-11)
- `.planning/ROADMAP.md` §"Phase 2: Blog & Content System" — phase goal, success criteria, depends-on Phase 1, and the **Research flag** calling out Velite's Next.js wiring (`next.config.mjs` integration, MDX component override conventions) as needing a deeper research pass during planning — confirm Velite (not gray-matter + next-mdx-remote) is the implementation used end-to-end, per STACK.md

### Research (produced during project init — read before planning)
- `.planning/research/STACK.md` — Velite, rehype-pretty-code/shiki, remark-gfm, rehype-slug + rehype-autolink-headings (D-13), reading-time package — all recommended libraries for this phase's content pipeline
- `.planning/research/ARCHITECTURE.md` — recommended project structure, content-as-data pattern (Pattern 1), suggested build order
- `.planning/research/PITFALLS.md` — Pitfall 1 ("project never ships" — scope discipline); check for any MDX/Velite-specific pitfalls
- `CLAUDE.md` (root) — locked tech stack; explicit "no `output: 'export'`" constraint (relevant since Velite/MDX build-time processing must run in Next's default hybrid mode)

### Prior phase context
- `.planning/phases/01-core-site-design-system/01-CONTEXT.md` — D-01 (color palette), D-02 (Geist Sans/Mono), D-03 (subtle motion), D-04 ("ma" whitespace philosophy), D-07 (explicitly deferred the homepage latest-post teaser to this phase — now resolved as D-15..D-18 above), D-08 (nav already includes Blog link)

### Not yet created
- No SPEC.md exists for this phase — full requirement text lives in REQUIREMENTS.md above, not duplicated here.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Prose.tsx` — long-form prose container already built for the "ma" whitespace philosophy (max-w-2xl, body typography, vertical rhythm) — directly reusable for rendered MDX post body content.
- `src/components/ui/Tag.tsx` — existing neutral tag/badge primitive (currently used for project tech-stack tags). D-02 reuses its visual treatment for blog pillar tags; it's not a link today (project tags are static), so it needs a linkable variant or wrapper for tag-archive navigation.
- `src/components/ui/Container.tsx` — page-level layout wrapper, used by the existing `/projects` page; the blog index/post/tag pages should follow the same pattern.
- `src/components/ui/Button.tsx` — has built-in `rel="noopener noreferrer"` handling for external links; likely not needed for internal blog links but available if posts link out.
- `src/lib/site-config.ts` — nav array already includes `{ href: '/blog', label: 'Blog' }`; no nav changes needed this phase.
- `src/app/globals.css` — `--font-mono` (self-hosted Geist Mono) is already wired via `@theme` and ready to be the syntax-highlighting font for code blocks (BLOG-03) with no additional font loading.

### Established Patterns
- Phase 1 used a content-as-data pattern with plain typed TS (`src/content/projects.ts`) — explicitly *not* applicable here. This phase's content layer is git-based MDX via Velite (per STACK.md/ROADMAP.md), a different pipeline. Do not reuse the projects.ts pattern for blog posts.
- `src/app/(site)/projects/page.tsx` shows the established page-component shape (Server Component, `Container` wrapper, `.map()` over a typed collection) — the blog index page should follow this same shape, swapping the `Card` grid for the D-01 plain-list rendering.
- Color/type tokens (`--color-paper/secondary/ink/vermillion` + light/dark variants, `--text-display/heading/body/label` scale) are fixed in `globals.css` — no new tokens needed for this phase's plain-list/compact-row styling.

### Integration Points
- Homepage (`src/app/(site)/page.tsx`) already has a featured-projects teaser section (Phase 1 D-07) — the new latest-writing teaser (D-15..D-18) is a new section on this same page, positioned below it.
- No `next.config.mjs`/`next.config.ts` Velite wiring exists yet — this is genuinely new integration surface for this phase, flagged for the deeper research pass per ROADMAP.md.
- `package.json` currently has no content-layer dependencies installed (no `velite`, `rehype-pretty-code`, `shiki`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `reading-time`) — all need to be added this phase.

</code_context>

<specifics>
## Specific Ideas

- The four content pillars are fixed: software development & architecture, building products/SaaS & entrepreneurship, investing/financial-freedom journey, Aikido & Japan (per PROJECT.md) — tags should align to these, not introduce a broader ad-hoc taxonomy (REQUIREMENTS.md Out-of-Scope: "overbuilt tag taxonomy").
- Launch posts (D-14) should be grounded in real biographical specifics already captured in PROJECT.md: started investing at 30 targeting 1M DKK portfolio; trained under the late sensei Shoji Nishio; first trip to Japan was an international Aikido seminar with 8 training partners. These are genuine hooks Claude can draft from, not generic filler.
- Related-posts and homepage-teaser rows share the same "compact: title + date" visual spec (D-07, D-17) — worth implementing as one shared presentational pattern even though the discretion note above leaves the exact component boundary to planning.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. The one carried-forward item from Phase 1 (homepage latest-post teaser) was resolved within this phase's decisions (D-15..D-18), not deferred further.

</deferred>

---

*Phase: 2-Blog & Content System*
*Context gathered: 2026-07-13*
