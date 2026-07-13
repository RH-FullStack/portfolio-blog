# Phase 2: Blog & Content System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-13
**Phase:** 2-Blog & Content System
**Areas discussed:** Blog index & tag styling, Related posts behavior, Post page & authoring workflow, Homepage latest-post teaser

---

## Blog index & tag styling

| Option | Description | Selected |
|--------|-------------|----------|
| Plain text list | No card chrome/images — large clickable title headline, metadata row beneath, thin divider between posts. | ✓ |
| Card grid | Reuses existing Card component pattern from /projects; needs a cover image per post to look intentional. | |
| Hybrid: list with optional thumbnail | Row-based with small optional thumbnail, falls back to text-only. | |

**User's choice:** Plain text list (recommended)
**Notes:** Leans into the "ma" whitespace philosophy; visually distinct from image-driven Projects cards.

| Option | Description | Selected |
|--------|-------------|----------|
| Neutral, uniform | Same treatment as existing Tag component; vermillion accent stays reserved for interactive states. | ✓ |
| Color-coded per pillar | Distinct accent color per content pillar for at-a-glance scanning. | |

**User's choice:** Neutral, uniform (recommended)
**Notes:** Avoids introducing a second accent-color system alongside vermillion.

| Option | Description | Selected |
|--------|-------------|----------|
| Per-tag pages only | Clicking a tag goes to /blog/tags/[tag], reusing the index layout filtered. | ✓ |
| Tag overview page + per-tag pages | Adds a /blog/tags page listing all pillars with post counts. | |

**User's choice:** Per-tag pages only (recommended)
**Notes:** With only 4 pillars at launch, a separate overview page is an extra click for little benefit.

| Option | Description | Selected |
|--------|-------------|----------|
| Multiple tags allowed | Frontmatter tags field accepts an array; cross-pillar posts allowed. | ✓ |
| One tag per post | Simpler mental model, exactly one pillar per post. | |

**User's choice:** Multiple tags allowed (recommended)
**Notes:** Cross-pillar posts (e.g. entrepreneurship + aikido) are a natural fit for this blog's premise.

---

## Related posts behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Up to 3 | Standard pattern, matches homepage featured-projects teaser count. | ✓ |
| Up to 2 | Tighter/more minimal. | |
| Up to 5 | More discovery surface, better once 20+ posts exist. | |

**User's choice:** Up to 3 (recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Fall back to most recent posts | Fills remaining slots below 3 with most recent other posts. | ✓ |
| Hide section entirely if no tag matches | Stricter "related" semantics, invisible for most early posts. | |
| Show fewer than 3, no fallback | Only true tag matches shown, even if 1 or 2. | |

**User's choice:** Fall back to most recent posts (recommended)
**Notes:** Very likely needed at launch with only a handful of total posts.

| Option | Description | Selected |
|--------|-------------|----------|
| Compact: title + date only | Keeps section visually secondary to the article just read. | ✓ |
| Full card/row: title, date, excerpt, tags | Same treatment as main index rows. | |

**User's choice:** Compact: title + date only (recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Weight by overlap count | More shared tags ranks higher, ties broken by recency. | ✓ |
| Any shared tag counts equally | Ordered by recency only. | |

**User's choice:** Weight by overlap count (recommended)
**Notes:** Cheap to implement — array intersection size at build time.

---

## Post page & authoring workflow

| Option | Description | Selected |
|--------|-------------|----------|
| title, date, tags, excerpt, draft | Draft flag for WIP posts; no cover image field. | ✓ |
| Same, plus optional coverImage | Adds optional cover image for future flexibility. | |

**User's choice:** title, date, tags, excerpt, draft (recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| No byline | Redundant given the whole site is Rasmus's. | ✓ |
| Include byline | Useful if posts get shared/syndicated out of context. | |

**User's choice:** No byline (recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| You write 2-3 real posts | Genuine content covering 2+ pillars, exercises tag/related-post features for real. | ✓ |
| Claude scaffolds placeholder posts | Filler MDX just to exercise features, replaced later. | |

**User's choice:** You write 2-3 real posts (recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Claude drafts, you edit | Claude writes full draft posts grounded in PROJECT.md's journey/pillars; Rasmus reviews and approves. | ✓ |
| You write the prose yourself | Claude scaffolds empty MDX skeleton + frontmatter only. | |

**User's choice:** Claude drafts, you edit (recommended)
**Notes:** Fastest path to real, non-placeholder launch content.

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, add heading anchors | rehype-slug + rehype-autolink-headings, low effort per STACK.md. | ✓ |
| Skip for now | Not required by any BLOG-0X requirement. | |

**User's choice:** Yes, add heading anchors (recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Manual frontmatter field | Deliberate 1-2 sentence hook, author controls it. | ✓ |
| Auto-derived from post body | Velite computes it by truncating rendered plain text. | |

**User's choice:** Manual frontmatter field (recommended)

---

## Homepage latest-post teaser

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, add it now | Real posts will exist by end of phase; build the section that was waiting for content. | ✓ |
| Skip, defer to Phase 3 | Leave homepage as-is until closer to launch. | |

**User's choice:** Yes, add it now (recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| 3 posts, below featured projects | Matches featured-projects count; Blog as secondary narrative after Projects. | ✓ |
| 3 posts, above featured projects | Leads with journey/blog narrative before portfolio pitch. | |
| 1 post (just the latest) | Minimal single-item teaser. | |

**User's choice:** 3 posts, below featured projects (recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Compact list, title + date | Consistent with blog's text-first identity; avoids two card grids stacked. | ✓ |
| Card style, matching featured projects | Visual parity, but needs a text-only card variant since posts have no cover images. | |

**User's choice:** Compact list, title + date (recommended)

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, link to /blog | Consistent with featured-projects teaser's "view all" pattern. | ✓ |
| No link needed | Header nav already has a Blog link. | |

**User's choice:** Yes, link to /blog (recommended)

---

## Claude's Discretion

- Exact component decomposition for the shared "compact: title + date" row style used by related-posts, blog index metadata rows, and the homepage teaser — whether it's one shared component or several similar ones is left to planning.
- Velite schema/config wiring specifics (collections, `readingTime` transform, cross-collection related-posts query) — flagged in ROADMAP.md as needing a dedicated research pass during planning, not decided in this discussion.

## Deferred Ideas

None — discussion stayed within phase scope. The homepage latest-post teaser, carried forward from Phase 1 as a deferred item, was resolved within this phase (not deferred further).
