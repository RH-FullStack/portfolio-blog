# Roadmap: RasmusOS

## Overview

RasmusOS goes from an empty repository to a live, publicly-reachable personal site in three vertical slices. Phase 1 ships the complete non-blog site — home, about, projects, contact, 404 — wearing its final Japanese-minimalist design system from day one, so no page gets built twice. Phase 2 adds the blog itself: a git-based MDX content system with list/tag/related-post browsing and a publish workflow so frictionless that writing a new post never becomes a chore. Phase 3 closes the loop — SEO plumbing (meta tags, sitemap, OG images, performance) wired against real content, followed by public deployment on Vercel's free tier. Each phase is a real, visitable slice of the finished site, not a technical layer.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Core Site & Design System** - Home, About, Projects, Contact, and 404 live with the full responsive, dark/light, accessible, Japanese-minimalist design system
- [ ] **Phase 2: Blog & Content System** - Git-based MDX blog with list/tag/related-post browsing and a low-friction publish workflow
- [ ] **Phase 3: SEO Foundation & Launch** - Meta tags, sitemap, OG images, Core Web Vitals performance, and public deployment on Vercel's free tier

## Phase Details

### Phase 1: Core Site & Design System

**Goal**: Visitors can browse a fully designed, responsive, accessible core site (home, about, projects, contact) with a distinctive Japanese-minimalist visual identity, in dark or light mode, and see a custom 404 on bad routes.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: CORE-01, CORE-02, CORE-03, CORE-04, PROJ-01, DSGN-01, DSGN-02, DSGN-03, DSGN-04
**Success Criteria** (what must be TRUE):

  1. Visitor sees a homepage with a clear intro/value proposition (name, role, one-line positioning) understandable without scrolling
  2. Visitor reads an About page where the developer/aikidoka/investor threads read as one coherent story
  3. Visitor browses a curated showcase of 3-5 projects, each with a description, tech stack tags, and links (live demo / code)
  4. Visitor reaches Rasmus via a Contact page with a mailto link and social profile links (GitHub, LinkedIn, etc.)
  5. Site is fully responsive (mobile/tablet/desktop), respects system dark/light preference, follows baseline accessibility practices (semantic HTML, keyboard nav, alt text), looks distinctive rather than template-generic, and shows a custom 404 page on non-existent routes

**Plans**: 5 plans (Walking Skeleton phase — produces SKELETON.md)Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Walking Skeleton: scaffold, design tokens, theme system, live home hero (Wave 1)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Site chrome: header nav, accessible mobile nav, fuller footer (Wave 2)
- [x] 01-03-PLAN.md — Projects showcase + homepage featured-projects teaser (Wave 2)
- [x] 01-04-PLAN.md — About, Contact, and custom 404 pages (Wave 2)

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-05-PLAN.md — Phase verification checkpoint: visual, responsive, theme, accessibility (Wave 3)

**UI hint**: yes

### Phase 2: Blog & Content System

**Goal**: Visitors can browse, read, and discover blog posts written as git-committed MDX files with syntax-highlighted code and tag-based navigation, and Rasmus can publish a new post with zero manual boilerplate.
**Mode:** mvp
**Depends on**: Phase 1 (reuses layout, design tokens, and UI primitives)
**Requirements**: BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06
**Success Criteria** (what must be TRUE):

  1. Visitor browses a blog list view showing title, date, excerpt, reading time, and tags for each post
  2. Visitor reads an individual blog post page rendered from a git-committed MDX file, with code blocks displayed via syntax highlighting
  3. Visitor browses a tag archive to filter posts by topic/pillar
  4. Visitor sees related posts (by shared tags) at the end of a blog post
  5. Rasmus publishes a new post by writing an MDX file with frontmatter and running `git push`, with no manual boilerplate required per post

**Plans**: 6 plans in 3 waves
**Wave 1**

- [x] 02-01-PLAN.md — Velite content-pipeline foundation: config, next.config.mjs wiring, tsconfig alias, code-block CSS (BLOG-03, BLOG-06)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 02-02-PLAN.md — Query & related-posts ranking layer: lib/posts.ts + lib/related-posts.ts (BLOG-04, BLOG-05)
- [x] 02-03-PLAN.md — MDX renderer + presentational primitives: linkable Tag, MDXContent, PostListRow (BLOG-02)
- [x] 02-04-PLAN.md — Launch content authoring: 2-3 real MDX posts + Rasmus approval checkpoint (BLOG-06, D-14)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 02-05-PLAN.md — Blog routes: index, post page (MDX + related), per-tag archive (BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05)
- [x] 02-06-PLAN.md — Homepage latest-writing teaser (BLOG-01, D-15..D-18)

**UI hint**: yes
**Research flag**: research/SUMMARY.md flags this phase's content layer (Velite's Next.js wiring — next.config.mjs integration, MDX component override conventions) as needing a deeper research pass during planning, ahead of writing real posts. Also confirm during planning that Velite (not the gray-matter + next-mdx-remote pattern shown in ARCHITECTURE.md examples) is the implementation used end-to-end, per STACK.md's explicit recommendation. RESOLVED in 02-RESEARCH.md: Velite 0.4.0 end-to-end via `next.config.mjs` top-level-await (Turbopack-safe), `s.metadata()` for reading time (reading-time package dropped), `.dark`-class-scoped syntax-highlighting CSS.

### Phase 3: SEO Foundation & Launch

**Goal**: The site is discoverable by search engines, shares cleanly on social platforms, performs well on Core Web Vitals, and is live at a public URL.
**Mode:** mvp
**Depends on**: Phase 2 (SEO artifacts and metadata are built and tested against real post/project content, not placeholders)
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, DEPL-01
**Success Criteria** (what must be TRUE):

  1. Every page and post has accurate meta tags (title, description) and a favicon appears in the browser tab
  2. Site generates a working sitemap.xml and robots.txt that search engines can crawl
  3. Sharing a page link shows a proper Open Graph image preview (static OG image is acceptable for v1)
  4. Site meets good Core Web Vitals / Lighthouse performance scores, with images optimized via next/image
  5. Site is live and publicly reachable on Vercel's free Hobby tier (vercel.app subdomain)

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|-----------------|--------|-----------|
| 1. Core Site & Design System | 4/5 | In Progress|  |
| 2. Blog & Content System | 0/6 | Planned | - |
| 3. SEO Foundation & Launch | 0/TBD | Not started | - |
