---
phase: 01-core-site-design-system
plan: 04
subsystem: ui
tags: [nextjs, tailwindcss-v4, app-router, typescript, lucide-react]

# Dependency graph
requires:
  - phase: 01-01
    provides: Container/Button primitives, site-config.ts, design tokens (text-heading/text-body, ink/paper/vermillion colors)
provides:
  - "Prose UI primitive (src/components/ui/Prose.tsx) — max-w-2xl readable long-form container"
  - "/about page — developer/aikidoka/investor told as one coherent narrative (CORE-02)"
  - "/contact page — mailto + visible plain-text email + GitHub/LinkedIn social links, no form (CORE-03)"
  - "Root-level custom 404 (src/app/not-found.tsx) handling all unmatched routes app-wide (CORE-04)"
affects: [01-05-checkpoint]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Prose primitive follows the same typed-props/Tailwind-utility-only shape as Container/Button (sibling-match per 01-PATTERNS.md)"
    - "Hand-rolled inline SVG icon components for brand marks (GitHub/LinkedIn) not available in lucide-react@1.x"
    - "External social anchors use explicit rel=\"noopener noreferrer\" in source (not routed through Button, to keep the mitigation visibly grep-able in the page file)"

key-files:
  created:
    - src/components/ui/Prose.tsx
    - src/app/(site)/about/page.tsx
    - src/app/(site)/contact/page.tsx
    - src/app/not-found.tsx
  modified: []

key-decisions:
  - "lucide-react@1.24.0 (already an installed dependency) no longer exports Github/Linkedin brand icons — hand-rolled two small inline SVG components inside contact/page.tsx instead of adding a new icon package"
  - "Mailto CTA styled via the shared Button primitive; GitHub/LinkedIn social links written as plain <a> tags (not Button) so rel=\"noopener noreferrer\" is explicit and directly verifiable in the page source, matching the plan's automated verification grep"

patterns-established:
  - "Pattern: brand/logo icons not present in lucide-react are hand-rolled as local inline SVG components scoped to the page that needs them, rather than pulling in a new icon package"

requirements-completed: [CORE-02, CORE-03, CORE-04, DSGN-01]

# Metrics
duration: 15min
completed: 2026-07-13
---

# Phase 1 Plan 4: About, Contact & Custom 404 Summary

**Prose-constrained About page telling the developer/aikidoka/investor story as one narrative, a mailto+visible-email+social Contact page, and a root-level custom 404 — completing the core content page set.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-07-13T07:18:00Z (approx)
- **Completed:** 2026-07-13T07:33:49Z
- **Tasks:** 2/2 completed
- **Files modified:** 4 (all new)

## Accomplishments
- `src/components/ui/Prose.tsx` — a `max-w-2xl` readable prose container with Body typography (16/400/1.6) and vertical rhythm between headings/paragraphs, matching the Container/Button primitive shape
- `/about` — a Server Component wrapping static TSX prose in `Prose`, weaving the developer, aikidoka (training under the late sensei Shoji Nishio), and long-term-investor threads into one narrative around the Japan/freedom throughline from PROJECT.md, rather than three siloed sections
- `/contact` — a Server Component with an "Email Me" mailto CTA (via the shared `Button` primitive) plus the plain-text email address always visible alongside it, and GitHub/LinkedIn social icon links (`target="_blank" rel="noopener noreferrer"`); no contact form
- `src/app/not-found.tsx` — root-level custom 404 (outside the `(site)` route group) with the exact "Page Not Found" / "The page you're looking for doesn't exist or has moved." / "Back to Home" copy, auto-handling all unmatched routes app-wide

## Task Commits

Each task was committed atomically:

1. **Task 1: Prose primitive + About page (coherent three-pillar story)** - `c113051` (feat)
2. **Task 2: Contact page (mailto + visible email + social links) and custom 404** - `862ada2` (feat)

**Plan metadata:** (this SUMMARY commit, made by the orchestrator in worktree mode)

## Files Created/Modified
- `src/components/ui/Prose.tsx` - readable `max-w-2xl` long-form prose container (Server Component)
- `src/app/(site)/about/page.tsx` - About page, three pillars as one story, wrapped in `Prose`
- `src/app/(site)/contact/page.tsx` - Contact page: mailto + visible email + GitHub/LinkedIn (hand-rolled inline SVGs)
- `src/app/not-found.tsx` - root-level custom 404, exact UI-SPEC copy, "Back to Home" CTA to `/`

## Decisions Made
- Hand-rolled GitHub/LinkedIn inline SVG icon components in `contact/page.tsx` instead of installing a new brand-icon package, after discovering the already-installed `lucide-react@1.24.0` no longer exports those icons (see Deviations).
- Kept the "Email Me" mailto CTA on the shared `Button` primitive (consistent styling with the rest of the site) but wrote the GitHub/LinkedIn social links as plain anchors with an explicit `rel="noopener noreferrer"` attribute in the page source, rather than routing them through `Button`'s auto-injected `rel` — this keeps the mitigation directly visible/grep-able in the page file per the plan's automated verification.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `lucide-react@1.24.0` does not export `Github`/`Linkedin` icons**
- **Found during:** Task 2, first `npm run build` after writing `contact/page.tsx`
- **Issue:** The plan and 01-UI-SPEC.md list `lucide-react` as the icon library for footer/contact social icons (GitHub, LinkedIn, mail). The already-installed `lucide-react@1.24.0` (pinned in `package.json` from plan 01-01) no longer ships brand/logo icons — only generic glyphs (`GitBranch`, `FolderGit`, `Link`, etc.) remain; `Github` and `Linkedin` are not exported, which fails the Turbopack build with "export not found."
- **Fix:** Hand-rolled two small local inline SVG components (`GithubIcon`, `LinkedinIcon`) scoped inside `contact/page.tsx`, using standard octicon/brand path data at `viewBox="0 0 24 24"`. Kept `Mail` from `lucide-react` (that icon does exist in this version) for the mailto CTA.
- **Files modified:** `src/app/(site)/contact/page.tsx`
- **Verification:** `npm run build` compiles and prerenders `/contact`; `npm run lint` passes with zero errors
- **Committed in:** `862ada2`

---

**Total deviations:** 1 auto-fixed (1 bug — missing icon export in an already-installed dependency)
**Impact on plan:** No scope creep and no new dependency installed — resolved entirely within the existing `lucide-react` install plus two small local SVG components in the one file that needed them. Visual outcome (GitHub/LinkedIn marks, mailto + visible email, social links with `rel="noopener noreferrer"`) matches the plan's intent exactly.

## Issues Encountered
None beyond the lucide-react icon deviation documented above.

## User Setup Required

None blocking this plan's own verification. Two pre-existing placeholder values (unrelated to this plan, set in `src/lib/site-config.ts` by plan 01-01) still need to be swapped by Rasmus before launch: `social.github`, `social.linkedin`, and `social.email` currently read `REPLACE_ME` — the Contact page already reads them correctly via `siteConfig.social`, so updating that one file is the only step needed once real values are available.

## Next Phase Readiness
- `/about`, `/contact`, and the site-wide custom 404 are live and build-verified alongside `/` (from plan 01-01); `npm run build` prerenders all of them as static content.
- No blockers for plan 01-05 (phase checkpoint / visual verification) — Prose, mailto+email+social pattern, and 404 copy are all in place per 01-UI-SPEC.md's Copywriting Contract.
- `Prose.tsx` is now available as a shared primitive for any future long-form content (e.g., Phase 2 blog post bodies).

---
*Phase: 01-core-site-design-system*
*Completed: 2026-07-13*
