---
phase: 01-core-site-design-system
plan: 02
subsystem: ui
tags: [nextjs, radix-ui-dialog, lucide-react, tailwindcss-v4, accessibility]

# Dependency graph
requires:
  - phase: 01-core-site-design-system (plan 01)
    provides: Design tokens, ThemeToggle, Container/Button primitives, site-config.ts, (site) route group shell
provides:
  - Desktop horizontal nav (About/Projects/Blog/Contact) with vermillion active-route indicator, hidden below md
  - Accessible mobile hamburger overlay via @radix-ui/react-dialog (focus trap, Escape-to-close, focus-return, sr-only Dialog.Title)
  - Abstract enso-inspired monogram + wordmark home link (D-09, no literal brand-name text baked into the mark)
  - Sticky Header (z-40) composing wordmark/monogram, Nav, ThemeToggle, MobileNav trigger
  - Fuller Footer (secondary surface): secondary nav, GitHub/LinkedIn/Mail 44x44 social icons with rel=noopener noreferrer, copyright, tagline
  - Full site shell wiring: Header + <main> + Footer in src/app/(site)/layout.tsx
affects: [01-03-projects-and-cards, 01-04-about-contact-404, 01-05-checkpoint]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Nav.tsx is a client component (usePathname) — the one exception to 'Server Component by default' in this phase, needed for active-route highlighting"
    - "MobileNav overlay/content use z-50, sticky Header uses z-40, so the overlay always renders above the header (Pitfall 2)"
    - "Brand/logo icons (GitHub, LinkedIn) not available in lucide-react 1.x — hand-rolled as inline SVGs using the standard Simple Icons glyph paths instead of adding a new icon dependency"

key-files:
  created:
    - src/components/layout/Nav.tsx
    - src/components/layout/MobileNav.tsx
    - src/components/layout/Header.tsx
    - src/components/layout/Footer.tsx
  modified:
    - src/app/(site)/layout.tsx

key-decisions:
  - "Made Nav.tsx a client component using usePathname for the active-route accent indicator, rather than splitting a separate small client child — the plan permitted either approach and this keeps the file count matching the plan's declared files_modified list"
  - "Hand-rolled GitHub/LinkedIn SVG icons instead of using lucide-react's Github/Linkedin exports, which do not exist in the installed lucide-react@1.24.0 (brand/logo icons were dropped upstream) — avoids adding a new icon-package dependency, consistent with the project's hand-rolled-primitives philosophy"

patterns-established:
  - "Pattern: social icon links in Footer use a shared ICON_LINK_CLASSES constant for the 44x44 touch target + hover/focus-visible treatment, applied uniformly across hand-rolled and lucide-react icons"

requirements-completed: [DSGN-01, DSGN-03]

# Metrics
duration: 6min
completed: 2026-07-13
---

# Phase 1 Plan 2: Navigation & Footer Chrome Summary

**Responsive site chrome — desktop horizontal nav with active-route accent, Radix-Dialog mobile hamburger overlay (focus trap/Escape/focus-return), abstract enso-monogram home link, and a fuller footer with safe external social links — wired into the (site) shell.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-13T09:28:04+02:00 (approx, base commit)
- **Completed:** 2026-07-13T09:33:16+02:00
- **Tasks:** 2/2 completed
- **Files modified:** 5 (4 created, 1 modified)

## Accomplishments
- Desktop nav (`Nav.tsx`) rendering `siteConfig.nav` (About/Projects/Blog/Contact), hidden below `md`, vermillion accent + `aria-current="page"` on the active route
- Fully accessible mobile hamburger overlay (`MobileNav.tsx`) via `@radix-ui/react-dialog` — no hand-rolled focus trap, Escape handling, or focus-return; `Dialog.Title` is `sr-only`; overlay/content `z-50` sits above the header's `z-40`
- Sticky `Header.tsx` composing an abstract, geometric enso-inspired monogram (one vermillion accent stroke, zero literal brand-name text) + wordmark home link, the desktop `Nav`, `ThemeToggle`, and the `MobileNav` trigger
- Fuller `Footer.tsx` on the secondary surface: secondary nav links, GitHub/LinkedIn/Mail 44x44 social icons (external anchors carry `rel="noopener noreferrer"`), copyright line, and tagline
- `src/app/(site)/layout.tsx` now renders `<Header/><main>{children}</main><Footer/>`, replacing the plan 01-01 inline minimal header

## Task Commits

Each task was committed atomically:

1. **Task 1: Desktop Nav, accessible Radix MobileNav, and composed Header** - `aaf3756` (feat)
2. **Task 2: Fuller footer and wire Header + Footer into the site shell** - `9538b89` (feat)

**Plan metadata:** (this SUMMARY commit, made by the orchestrator in worktree mode)

## Files Created/Modified
- `src/components/layout/Nav.tsx` - client component, desktop horizontal nav reading `siteConfig.nav`, active-route vermillion indicator via `usePathname`
- `src/components/layout/MobileNav.tsx` - `'use client'`, Radix `Dialog`-based hamburger overlay with `sr-only` title, `aria-label="Open menu"`/`"Close menu"`, `z-50`
- `src/components/layout/Header.tsx` - sticky (`z-40`) header composing the abstract monogram+wordmark home link, `Nav`, `ThemeToggle`, `MobileNav`
- `src/components/layout/Footer.tsx` - secondary-surface footer: secondary nav, GitHub/LinkedIn/Mail social icons (hand-rolled SVGs for the first two), copyright, tagline
- `src/app/(site)/layout.tsx` - replaced inline minimal header with `<Header/>` + `<Footer/>` around `<main>{children}</main>`

## Decisions Made
- `Nav.tsx` is a client component (`usePathname`) rather than a Server Component with a split-off client child — simpler, single-file, and the plan explicitly allowed this alternative.
- Hand-rolled GitHub/LinkedIn icon SVGs instead of pulling in a new brand-icon package (see Deviations below).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `lucide-react` 1.24.0 no longer exports `Github`/`Linkedin`**
- **Found during:** Task 2, `npm run build`
- **Issue:** The installed `lucide-react@1.24.0` (pinned by plan 01-01) has dropped brand/logo glyphs (trademark-liability policy change upstream) — `import { Github, Linkedin } from 'lucide-react'` fails to compile ("Export Github doesn't exist in target module"). Confirmed via `node -e "require('lucide-react')"` export enumeration: no `Github`/`Linkedin`/`GithubIcon`/`LinkedinIcon` symbols exist; only generic `Git*` (commit/branch/merge) icons remain.
- **Fix:** Hand-rolled two small inline SVG components (`GithubIcon`, `LinkedinIcon`) in `Footer.tsx` using the standard, widely-used Simple Icons glyph paths, `fill="currentColor"` so they inherit the same hover/focus color treatment as the still-available `Mail` icon. No new dependency added — consistent with the project's existing "hand-roll simple UI, no heavy kit" pattern already established for `Button`/`Container`.
- **Files modified:** `src/components/layout/Footer.tsx`
- **Verification:** `npm run build` and `npm run lint` both pass; the plan's `grep -Eq "Github|Linkedin|Mail"` verification still matches (function names retain the substrings).
- **Committed in:** `9538b89` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 broken upstream export)
**Impact on plan:** No scope creep — same three social icons (GitHub/LinkedIn/Mail), same 44x44 touch targets, same visual intent; only the icon source for two of the three glyphs changed from a package export to an inline SVG.

## Issues Encountered
None beyond the lucide-react deviation documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Full responsive, accessible nav chrome (DSGN-01, DSGN-03) is in place for every page in `(site)` — plans 01-03 and 01-04 render inside this shell without further nav/footer work.
- `/blog` nav item still intentionally 404s until Phase 2 (accepted gap per D-08, unchanged from plan 01-01).
- Manual keyboard/focus-trap and outside-click verification for the mobile overlay is deferred to the phase checkpoint (plan 01-05), per this plan's `<verification>` section.
- No blockers for 01-03/01-04.

---
*Phase: 01-core-site-design-system*
*Completed: 2026-07-13*
