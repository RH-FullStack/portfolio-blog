# RasmusOS

## What This Is

A personal website that combines a professional software portfolio with a personal blog documenting Rasmus's journey as a developer, entrepreneur, aikidoka, and long-term investor working toward the freedom to live and work from Japan part of the year. It's built as a long-term, compounding personal brand asset — not a static CV.

## Core Value

A live, fast, professional site where Rasmus can showcase his work and keep publishing his journey — if writing a new post is ever a chore, the whole point is lost.

## Requirements

### Validated

- [x] Blog with git-based MDX posts and tag navigation — Validated in Phase 2: Blog & Content System (UAT approved 2026-07-14; 3 real posts live, Velite pipeline, syntax highlighting, related posts, homepage teaser; SEO metadata portion remains in Phase 3)

### Active

- [ ] Homepage that introduces Rasmus and the site's story/brand
- [ ] About page covering his background as a developer, aikidoka, and investor
- [ ] Projects page showcasing software, SaaS, and open-source work
- [ ] Contact page with mailto link and social profile links
- [ ] Responsive design across devices
- [ ] SEO foundation (meta tags, sitemap, OG images)
- [ ] Fast performance (Core Web Vitals-friendly Next.js setup)
- [ ] Live deployment on Vercel free tier

### Out of Scope

- Custom domain at launch — deferred to next month; ship first on the free vercel.app subdomain so DNS/purchase timing never blocks launch
- Headless CMS / non-git content editing — git-based MDX is free and fits a solo developer's workflow; a CMS adds cost and an external dependency for no real benefit yet
- Contact form / backend service — mailto + social links needs no server and zero maintenance, matches the $0/month budget
- Newsletter — no audience yet to justify the setup and ongoing cost
- Interactive timeline of the journey — nice-to-have polish, not needed to launch
- Analytics/goals dashboard — premature before there's real traffic or data to show
- Bilingual (Danish) content — English-only for v1 avoids i18n routing complexity; Danish can be added per-post later without redesigning the IA
- Detailed per-project case-study pages — v1 ships project cards/summaries; deep case studies are a natural v1.1

## Context

- Rasmus is a solo developer building this himself; comfortable with the modern React/Next.js ecosystem.
- Brand identity is still evolving. "RasmusOS" is a placeholder name he may replace once he finds something that fits better — design and copy should avoid baking the name in anywhere that would be expensive to change later.
- Content pillars for the blog: software development & architecture lessons, building products/SaaS and entrepreneurship, the investing/financial-freedom journey (started investing at 30, targeting a 1M DKK portfolio), and Aikido & Japan (trained under the late sensei Shoji Nishio; first trip to Japan was an international Aikido seminar with 8 training partners).
- Design direction: professional, minimalist, technical, personal, inspired by Japanese aesthetics, with real attention to craft — explicitly not a generic developer-portfolio template or a boring CV layout.
- Fully greenfield — no existing codebase.

## Constraints

- **Budget**: $0/month for hosting/infra — Vercel free tier is the target; the only real cost is ~$10-15/year for the domain, added next month, which must not block launch
- **Tech stack**: Next.js (React), Tailwind CSS, MDX for content — chosen so Rasmus can learn from and be comfortable maintaining the stack himself
- **No backend/database for v1**: keeps infra cost and ongoing maintenance at zero
- **Language**: English only for v1 — widest reach for employers/clients/readers, avoids i18n complexity

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| English-only content for v1 | Widest reach (employers, global readers); avoids i18n complexity | — Pending |
| Git-based MDX blog, no CMS | Free, fast, fits a developer's existing workflow; no external service dependency | — Pending |
| Vercel free tier at launch, domain added next month | Keeps cost at $0 at launch; domain purchase timing never blocks shipping | — Pending |
| Mailto + social links instead of a contact form | Zero backend, zero maintenance, matches budget | — Pending |
| "RasmusOS" as placeholder brand name | Real public branding undecided; keep it swappable without a redesign | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-14 after Phase 2 (Blog & Content System) completion*
