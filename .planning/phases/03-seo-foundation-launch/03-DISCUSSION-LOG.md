# Phase 3: SEO Foundation & Launch - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-14
**Phase:** 3-SEO Foundation & Launch
**Areas discussed:** Titles & meta strategy, OG image & favicon, Launch & indexing plan, Performance approach

---

## Titles & Meta Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Rasmus Hansen | Real-name title suffix; rename-proof, SEO-friendly | ✓ |
| RasmusOS | Brand suffix; bakes placeholder into indexed titles | |
| Both combined | Long; truncated in search results | |

| Option | Description | Selected |
|--------|-------------|----------|
| Name + role | 'Rasmus Hansen — Software Developer' homepage title | ✓ |
| Name + pillars | 'Developer, Aikidoka, Investor' variant | |
| Brand-led | 'RasmusOS — …' | |

| Option | Description | Selected |
|--------|-------------|----------|
| Excerpt + hand-written | Posts reuse frontmatter excerpt; static pages hand-written this phase | ✓ |
| All hand-written | Dedicated meta descriptions for posts too | |
| You decide | Claude picks during planning | |

**User's choice:** Real-name suffix, name+role homepage title, excerpt-based post descriptions.
**Notes:** Driven by the brand-name-is-placeholder constraint and zero-per-post-friction core value.

---

## OG Image & Favicon

| Option | Description | Selected |
|--------|-------------|----------|
| Build-time next/og | Code-defined 1200×630 from design tokens | ✓ |
| Hand-made static file | Designed PNG in public/ | |
| Photo-based | Hero artwork cropped with text overlay | |

| Option | Description | Selected |
|--------|-------------|----------|
| Name + role | 'Rasmus Hansen' + 'Software Developer' + monogram | ✓ |
| Name + tagline | More personality, more text at preview size | |
| Monogram only | Most minimal, loses who-is-this signal | |

| Option | Description | Selected |
|--------|-------------|----------|
| Enso monogram | Header mark as SVG favicon + fallbacks | ✓ |
| Simplified variant | Bolder strokes for 16×16 legibility | |
| You decide | Claude judges at small sizes | |

**User's choice:** next/og build-time image with name + role + monogram; enso monogram favicon.
**Notes:** Fallback set specifics (sizes, apple-touch-icon, dark variant) left to Claude's discretion.

---

## Launch & Indexing Plan

| Option | Description | Selected |
|--------|-------------|----------|
| GitHub → Vercel | Push-to-deploy Git integration | (eventually) |
| Vercel CLI | Manual deploys from local machine | |

**User's choice (freeform):** "I'm going to add my personal GitHub to this as well but I have not done so yet. So don't push anything to anything until I say so."
**Notes:** Captured as a HARD GATE (D-07): no remote, no push, no deploy until explicit go signal. GitHub→Vercel is the intended flow once gated.

| Option | Description | Selected |
|--------|-------------|----------|
| Name-based subdomain | rasmus-hansen.vercel.app | |
| rasmusos | rasmusos.vercel.app | |
| Decide at deploy time | Left open; picked when connecting Vercel | ✓ |

| Option | Description | Selected |
|--------|-------------|----------|
| Index now | robots.txt allows crawling from launch day | ✓ |
| Noindex until domain | Flip when custom domain lands | |

| Option | Description | Selected |
|--------|-------------|----------|
| I'll supply values | Plan checkpoint collects real links | |
| I'll edit them myself | Rasmus updates REPLACE_ME values; plan only verifies none remain | ✓ |
| Type them now | Provide values in discussion | |

---

## Performance Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Optimize, keep look | AVIF/WebP conversion ~100–150 KB, priority loading, visually indistinguishable | ✓ |
| Aggressive compression | Accept visible quality loss | |
| Touch nothing visual | Lossless only; report if scores suffer | |

| Option | Description | Selected |
|--------|-------------|----------|
| 90+ all categories | Green Lighthouse scores mobile + desktop | ✓ |
| 95+ performance | Stricter craft bar | |
| You decide | Claude sets threshold | |

| Option | Description | Selected |
|--------|-------------|----------|
| Move out of public/ | Backups to non-deployed repo folder | ✓ |
| Keep in public/ | Leave publicly served | |
| Delete them | Rely on git history | |

---

## Claude's Discretion

- Metadata implementation shape (static exports vs generateMetadata, title.template wiring)
- Tag-archive/404 metadata and canonical URL details
- Sitemap/robots implementation via built-in file conventions (locked by CLAUDE.md stack guidance)
- Favicon fallback set specifics
- Image-optimization tooling and Lighthouse measurement method

## Deferred Ideas

- RSS feed, dynamic per-post OG images, JSON-LD, custom domain — already tracked as v1.x/v2 (BLOGX-01, SEOX-01, SEOX-02, DOMAIN-01); reconfirmed out of scope.
