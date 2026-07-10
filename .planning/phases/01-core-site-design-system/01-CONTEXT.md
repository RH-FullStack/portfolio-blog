# Phase 1: Core Site & Design System - Context

**Gathered:** 2026-07-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Visitors can browse a fully designed, responsive, accessible core site — Home, About, Projects, Contact — with a distinctive Japanese-minimalist visual identity, in dark or light mode, and see a custom 404 on bad routes. This phase establishes the site's design system (tokens, typography, layout, motion) that Phases 2 and 3 will reuse, not just build pages.

Requirements covered: CORE-01, CORE-02, CORE-03, CORE-04, PROJ-01, DSGN-01, DSGN-02, DSGN-03, DSGN-04.

</domain>

<decisions>
## Implementation Decisions

### Visual Identity
- **D-01:** Color palette is "ink & paper + vermillion accent" — near-black/off-white neutrals as the base, with one sharp vermillion/red accent color (hanko-stamp inspired) used sparingly for emphasis (links, CTA, active states).
- **D-02:** Typography is Geist Sans + Geist Mono, self-hosted via `next/font` (matches STACK.md's default recommendation — no separate licensing/font decision needed).
- **D-03:** Motion level is "subtle micro-interactions" — gentle hover states, smooth transitions — not motion-free, not expressive/flashy. This applies to the theme toggle transition too (see D-10).
- **D-04:** Layout/whitespace philosophy is centered, single-column, generous whitespace ("ma") — one focal thing at a time, not an asymmetric/editorial grid.

### Homepage & Hero
- **D-05:** Hero shows name + role + one-line positioning + a photo/avatar (not text-only) — personal/human presentation.
- **D-06:** Homepage has one primary CTA button in the hero (not nav-links-only).
- **D-07 (Claude's discretion, see below):** Homepage structure is Hero + a featured-projects teaser (2-3 projects, linking to the full Projects page). Do NOT stub an empty "latest post" teaser slot for the not-yet-built blog — add that section in Phase 2 when real post content exists, per the "no premature scaffolding for content that doesn't exist yet" principle.

### Nav & Site Chrome
- **D-08:** Top nav is About, Projects, Blog, Contact — no separate "Home" link; the header wordmark/logo doubles as the home link. (Blog nav item is visible now even though the blog page ships in Phase 2 — sets the final nav shape once.)
- **D-09:** Header identity is a text wordmark + a simple monogram/mark. **Constraint:** the mark must be abstract/geometric (e.g., a minimal geometric or kanji-inspired glyph), not a literal rendering of "RasmusOS" — the brand name is an explicit placeholder (PROJECT.md) and the mark must survive a name swap without a redesign.
- **D-10:** Footer is the fuller variant: secondary nav links + social icons + copyright + a short tagline (not the bare-minimum copyright-only version).
- **D-11:** Mobile nav uses a hamburger menu (slide-in or full-screen overlay pattern).

### Dark/Light Mode
- **D-12:** v1 ships a manual light/dark toggle in the header (sun/moon icon), in addition to the system-preference default already locked by DSGN-02. Persist the user's choice (e.g., localStorage) so it sticks across visits. This implies adding `next-themes` (already flagged as optional-until-needed in STACK.md — it's needed now).
- **D-13:** Theme changes use a smooth cross-fade transition (~150-300ms), consistent with the "subtle micro-interactions" motion level (D-03) — not an instant/no-transition swap.

### Claude's Discretion
- Exact homepage section beyond hero (D-07) — user selected "You decide"; Claude's pick and rationale is recorded above. Confirm with user during/after planning if it feels off.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope & requirements
- `.planning/PROJECT.md` — core value, constraints ($0/month, Next.js/Tailwind/MDX stack, English-only, no backend), brand-name-is-placeholder note, content pillars
- `.planning/REQUIREMENTS.md` — CORE-01..04, PROJ-01, DSGN-01..04 (this phase's requirements), Out of Scope list
- `.planning/ROADMAP.md` §"Phase 1: Core Site & Design System" — phase goal, success criteria, depends-on

### Research (produced during project init — read before planning)
- `.planning/research/ARCHITECTURE.md` — recommended project structure (`app/(site)/...`, `components/ui/`, `lib/site-config.ts`), Pattern 1 (content-as-data), suggested build order (design tokens + layout first, then UI primitives, then static pages before dynamic content) — directly informs how Phase 1 should be sequenced
- `.planning/research/FEATURES.md` — table-stakes vs. differentiator features, MVP definition, feature prioritization matrix
- `.planning/research/PITFALLS.md` — Pitfall 1 ("project never ships" — scope discipline), Pitfall 3 (`metadataBase` must be set from day one even though SEO is Phase 3, since it lives in the root layout built in Phase 1), UX Pitfalls (generic-template look, contact page needing visible plain-text email alongside mailto)
- `CLAUDE.md` (root) — locked tech stack: Next.js 16.2.x App Router, Tailwind v4.1.x (`@theme` CSS-first config, no `tailwind.config.js`), Geist via `next/font`, `next-themes` for dark mode when needed (now needed per D-12), no `output: 'export'`

### Not yet created
- No SPEC.md exists for this phase — full requirement text lives in REQUIREMENTS.md above, not duplicated here.
- No prior CONTEXT.md exists — this is the first phase discussed.

</canonical_refs>

<code_context>
## Existing Code Insights

Fully greenfield repository — no application code exists yet (only `.claude/`, `.planning/`, `.git/`, `CLAUDE.md`). No `.planning/codebase/*.md` maps exist. No reusable components, no established patterns, no prior phases to integrate with. The researcher/planner should treat ARCHITECTURE.md's "Recommended Project Structure" and "Suggested Build Order" sections as the starting scaffold, not as existing code to preserve.

</code_context>

<specifics>
## Specific Ideas

- Vermillion accent color should evoke a hanko (traditional Japanese stamp) — a small, sharp, high-contrast red against neutral ink/paper tones, used sparingly (links, CTA, active/focus states), not as a dominant color.
- The header mark/monogram should be abstract enough (geometric or kanji-inspired glyph) to outlive the "RasmusOS" placeholder name — do not hardcode the current name into any visual asset that would be expensive to redo.
- Theme toggle: sun/moon icon in the header, persisted choice, smooth cross-fade on switch.
- Hero needs a real photo/avatar — Rasmus will need to supply this asset (not a placeholder decision for Claude).

</specifics>

<deferred>
## Deferred Ideas

- "Latest writing" teaser section on the homepage — deferred to Phase 2 (Blog & Content System), added once real post content exists rather than stubbed empty now.
- Per-project deep-dive case study pages (`/projects/[slug]`) — already Out of Scope for v1 per PROJECT.md/REQUIREMENTS.md (v1.1 candidate); Phase 1 builds the Projects index/card view only.

None — discussion otherwise stayed within phase scope.

</deferred>

---

*Phase: 1-Core Site & Design System*
*Context gathered: 2026-07-10*
