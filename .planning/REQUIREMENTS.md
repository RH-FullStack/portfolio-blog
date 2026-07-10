# Requirements: RasmusOS

**Defined:** 2026-07-10
**Core Value:** A live, fast, professional site where Rasmus can showcase his work and keep publishing his journey — if writing a new post is ever a chore, the whole point is lost.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Pages

- [ ] **CORE-01**: Visitor sees a homepage with a clear intro/value proposition (name, role, one-line positioning) understandable without scrolling
- [ ] **CORE-02**: Visitor can read an About page covering Rasmus's background as a developer, aikidoka, and investor, written so the three pillars read as one coherent story
- [ ] **CORE-03**: Visitor can reach Rasmus via a Contact page with a mailto link and social profile links (GitHub, LinkedIn, etc.)
- [ ] **CORE-04**: Visitor sees a custom 404 page when navigating to a non-existent route

### Projects

- [ ] **PROJ-01**: Visitor can view a curated showcase of 3-5 projects, each with a description, tech stack tags, and links (live demo / code)

### Blog

- [ ] **BLOG-01**: Visitor can browse a blog list view showing title, date, excerpt, reading time, and tags for each post
- [ ] **BLOG-02**: Visitor can read an individual blog post page rendered from a git-committed MDX file
- [ ] **BLOG-03**: Code blocks in blog posts render with syntax highlighting
- [ ] **BLOG-04**: Visitor can browse a tag archive to filter posts by topic/pillar
- [ ] **BLOG-05**: Visitor sees related posts (by shared tags) at the end of a blog post
- [ ] **BLOG-06**: Rasmus can publish a new post via a low-friction workflow (write an MDX file with frontmatter, git push) with no manual boilerplate per post

### SEO & Performance

- [ ] **SEO-01**: Every page/post has accurate meta tags (title, description) and a favicon
- [ ] **SEO-02**: Site generates a sitemap.xml and robots.txt
- [ ] **SEO-03**: Pages have Open Graph images (static is acceptable for v1) for link previews
- [ ] **SEO-04**: Site meets good Core Web Vitals / Lighthouse performance scores (fast load, optimized images via next/image)

### Design & Accessibility

- [ ] **DSGN-01**: Site is fully responsive across mobile, tablet, and desktop
- [ ] **DSGN-02**: Site supports dark and light mode with system-preference default, built into the design system from the start
- [ ] **DSGN-03**: Site follows baseline accessibility practices (semantic HTML, keyboard navigation, alt text on images)
- [ ] **DSGN-04**: Site has a distinctive minimalist visual identity influenced by Japanese aesthetics — not a generic developer-portfolio template look

### Deployment

- [ ] **DEPL-01**: Site is live and publicly reachable on Vercel's free Hobby tier (vercel.app subdomain)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Blog Extras (v1.x — fast-follow after launch)

- **BLOGX-01**: RSS/Atom feed
- **BLOGX-02**: Table of contents on long-form posts
- **BLOGX-03**: Series/collections grouping for multi-part content

### SEO Extras (v1.x)

- **SEOX-01**: Dynamic per-post OG images
- **SEOX-02**: JSON-LD structured data (Person, BlogPosting/Article schema)

### Personality Pages (v1.x)

- **PAGEX-01**: Now page (what Rasmus is currently focused on)
- **PAGEX-02**: Uses page (dev setup, editor, hardware)
- **PAGEX-03**: Colophon page (how the site is built)

### Custom Domain (deferred ~1 month per PROJECT.md)

- **DOMAIN-01**: Custom domain live (apex + www), 301 redirects from vercel.app, Google Search Console Change of Address filed, canonicals updated

### Further Future (v2+, gated on real signal)

- **FUT-01**: Static full-text search (Pagefind) — gate on 20-30+ published posts
- **FUT-02**: Public investing goal/progress marker — content/privacy decision, not just technical
- **FUT-03**: Aikido training log/timeline — needs more Aikido content first
- **FUT-04**: Per-project detailed case-study pages
- **FUT-05**: Newsletter — only once readers are explicitly asking for one

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Headless CMS / non-git content editing | Git-based MDX is free, fits a solo developer's workflow; a CMS adds cost and an external dependency for no real benefit yet |
| Contact form with backend | mailto + social links needs no server and zero maintenance, matches the $0/month budget |
| Comments system (Disqus, self-hosted, etc.) | Spam/moderation burden for a solo maintainer; rarely produces real discussion at low traffic; breaks the minimalist aesthetic |
| Analytics dashboard / goal-tracking UI | Premature before there's meaningful traffic; distracts from writing; if curiosity demands it, use a hosted tool's own dashboard rather than building one |
| Bilingual (Danish) content | English-only avoids i18n routing complexity; can add per-post later without a structural rewrite if ever needed |
| Multi-author / editorial workflow tooling | Solo-author site; a simple `draft: true` frontmatter flag is enough |
| Overbuilt tag taxonomy (many nested tags/categories) | Keep tags flat and aligned to the content pillars; avoids empty tag pages and per-post tagging overhead |
| Client-side full-text search before there's an archive | Not justified until tag browsing alone stops being enough (~20-30+ posts) |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | TBD | Pending |
| CORE-02 | TBD | Pending |
| CORE-03 | TBD | Pending |
| CORE-04 | TBD | Pending |
| PROJ-01 | TBD | Pending |
| BLOG-01 | TBD | Pending |
| BLOG-02 | TBD | Pending |
| BLOG-03 | TBD | Pending |
| BLOG-04 | TBD | Pending |
| BLOG-05 | TBD | Pending |
| BLOG-06 | TBD | Pending |
| SEO-01 | TBD | Pending |
| SEO-02 | TBD | Pending |
| SEO-03 | TBD | Pending |
| SEO-04 | TBD | Pending |
| DSGN-01 | TBD | Pending |
| DSGN-02 | TBD | Pending |
| DSGN-03 | TBD | Pending |
| DSGN-04 | TBD | Pending |
| DEPL-01 | TBD | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 0 (pending roadmap creation)
- Unmapped: 20 ⚠️ (expected — roadmapper fills this in next)

---
*Requirements defined: 2026-07-10*
*Last updated: 2026-07-10 after initial definition*
