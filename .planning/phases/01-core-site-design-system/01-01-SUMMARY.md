---
phase: 01-core-site-design-system
plan: 01
subsystem: ui
tags: [nextjs, tailwindcss-v4, next-themes, geist, typescript, app-router]

# Dependency graph
requires: []
provides:
  - Next.js 16 App Router scaffold (TypeScript, src/ dir, @/* alias, Turbopack default)
  - Tailwind v4 CSS-first @theme design tokens (ink/paper + vermillion palette, type scale, font stacks)
  - FOUC-safe dark/light theming (next-themes, system default + persisted manual toggle, cross-fade)
  - Hand-rolled UI primitives (Container, Button) with baked-in reverse-tabnabbing protection
  - src/lib/site-config.ts as the single source of truth for name/tagline/role/nav/social
  - Live, prerendered "/" homepage hero (name, role, portrait, primary CTA)
affects: [01-02-nav-and-footer, 01-03-projects-and-cards, 01-04-about-contact-404, 01-05-checkpoint]

# Tech tracking
tech-stack:
  added: [next@16.2.10, react@19.2.4, tailwindcss@4.x, next-themes@0.4.6, "@radix-ui/react-dialog@1.1.19", lucide-react@1.24.0, geist@1.7.2]
  patterns:
    - "Tailwind v4 CSS-first @theme tokens in globals.css, no tailwind.config.js"
    - "next-themes class-strategy dark mode with suppressHydrationWarning on <html>"
    - "useSyncExternalStore for hydration-safe client-mount guards (avoids setState-in-effect lint rule)"
    - "Button primitive auto-adds rel=noopener noreferrer on any external target=_blank anchor"
    - "(site) route group for chrome-wrapped pages; root app/layout.tsx stays chrome-free"

key-files:
  created:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/components/theme/ThemeProvider.tsx
    - src/components/theme/ThemeToggle.tsx
    - src/components/ui/Container.tsx
    - src/components/ui/Button.tsx
    - src/lib/site-config.ts
    - src/app/(site)/layout.tsx
    - src/app/(site)/page.tsx
    - public/hero.jpg
  modified: []

key-decisions:
  - "01-PATTERNS.md referenced by the plan does not exist on disk — executed using 01-RESEARCH.md's equivalent code patterns (Pattern 1 FOUC-safe layout, theme toggle example, Pattern 3 typed site-config) as the canonical source instead"
  - "Rewrote the next-themes 'mounted' guard with useSyncExternalStore instead of useState+useEffect — the default ESLint config's react-hooks rule flags synchronous setState-in-effect, so the documented next-themes pattern needed a lint-clean equivalent with identical FOUC-safe behavior"
  - "Generated an 800x800 solid-color placeholder JPEG for public/hero.jpg via sips (no PIL/ImageMagick available) — matches the plan's user_setup expectation that Rasmus swaps in a real portrait later"

patterns-established:
  - "Pattern: any Button href starting with http(s):// is treated as external; target=_blank always gets rel=noopener noreferrer regardless of caller-supplied rel"
  - "Pattern: siteConfig is the only allowed source for name/tagline/nav/social — no component should hardcode these"

requirements-completed: [CORE-01, DSGN-01, DSGN-02, DSGN-03, DSGN-04]

# Metrics
duration: 8min
completed: 2026-07-13
---

# Phase 1 Plan 1: Scaffold, Design Tokens & Homepage Hero Summary

**Next.js 16 App Router scaffold with Tailwind v4 `@theme` ink/paper/vermillion tokens, FOUC-safe next-themes dark mode, and a live prerendered homepage hero reading from a typed `site-config.ts`.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-07-13T07:16:00Z (approx, scaffold step)
- **Completed:** 2026-07-13T07:23:14Z
- **Tasks:** 3/3 completed
- **Files modified:** 21 (12 scaffold + 3 theme/token + 8 hero/primitives, net of 1 deletion)

## Accomplishments
- Working Next.js 16.2.10 App Router project (TypeScript, Tailwind v4, `src/` dir, `@/*` alias) that builds and lints clean
- Tailwind v4 CSS-first `@theme` block encoding the full ink/paper + vermillion design system (exact hex values from UI-SPEC), plus scoped `prefers-reduced-motion` handling
- FOUC-safe dark/light theming: `next-themes` with system-preference default, persisted manual toggle, and a 200ms scoped cross-fade — verified via a raw HTTP smoke test showing the blocking inline theme script present in the served HTML
- Live `/` route (Server Component) rendering the hero: name, tagline, one-line positioning, portrait via `next/image`, and a primary "View My Projects" CTA — confirmed prerendered as static content in the build output

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold project and install verified dependencies** - `4e12d05` (feat)
2. **Task 2: Encode design tokens + FOUC-safe root layout + ThemeProvider** - `78c6058` (feat)
3. **Task 3: Site config, Container + Button primitives, ThemeToggle, and the live home hero** - `2c69b57` (feat)

**Plan metadata:** (this SUMMARY commit, made by the orchestrator in worktree mode)

## Files Created/Modified
- `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`, `README.md`, `postcss.config.mjs`, `package-lock.json` - create-next-app scaffold output
- `src/app/globals.css` - Tailwind v4 `@theme` tokens (colors, type scale, font stacks) + reduced-motion + cross-fade
- `src/app/layout.tsx` - root layout: self-hosted Geist fonts, `metadataBase`, `suppressHydrationWarning`, ThemeProvider wrap
- `src/components/theme/ThemeProvider.tsx` - `'use client'` wrapper around next-themes
- `src/components/theme/ThemeToggle.tsx` - Sun/Moon toggle, hydration-safe via `useSyncExternalStore`
- `src/components/ui/Container.tsx` - centered `max-w-6xl` Server Component wrapper
- `src/components/ui/Button.tsx` - link/button primitive with automatic `rel="noopener noreferrer"` on external `target="_blank"`
- `src/lib/site-config.ts` - single source of truth for name/tagline/role/nav/social
- `src/app/(site)/layout.tsx` - minimal site shell: sticky header, wordmark-as-home-link, ThemeToggle
- `src/app/(site)/page.tsx` - homepage hero Server Component
- `public/hero.jpg` - placeholder portrait (user replaces per `user_setup`)
- `src/app/page.tsx` - deleted (superseded by `src/app/(site)/page.tsx`, since both mapped to `/`)

## Decisions Made
- Scaffolded into a scratch directory first, then merged the generated files into the pre-existing worktree root, because `create-next-app` refuses to run in a directory containing `.planning/`/`CLAUDE.md` — no functional difference from a direct scaffold, just a two-step move.
- Excluded the scaffold's own generated `CLAUDE.md`/`AGENTS.md` (which just `@`-reference each other) since the project already has a comprehensive `CLAUDE.md` that must not be overwritten.
- Removed the default `public/*.svg` marketing assets (Next.js/Vercel logos) since they were only referenced by the marketing copy already being replaced.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `01-PATTERNS.md` referenced by the plan does not exist**
- **Found during:** Task 2 (attempting to read the "canonical source" file listed in `<read_first>`)
- **Issue:** The plan's `<read_first>` and `<context>` sections reference `.planning/phases/01-core-site-design-system/01-PATTERNS.md` for canonical code blocks (globals.css, layout.tsx, site-config.ts, ThemeToggle.tsx), but this file does not exist in the phase directory (confirmed via directory listing — only `01-RESEARCH.md`, `01-UI-SPEC.md`, `01-SKELETON.md`, `01-CONTEXT.md`, `01-DISCUSSION-LOG.md`, and the five `01-0N-PLAN.md` files exist).
- **Fix:** Used `01-RESEARCH.md`'s equivalent "Pattern 1" (FOUC-safe layout + globals.css), "Code Examples" (theme toggle), and "Pattern 3" (typed site-config) sections as the canonical source instead — these contain the same code excerpts the plan describes as living in PATTERNS.md.
- **Files modified:** All Task 2/3 files (no functional impact — same target code, different source document)
- **Verification:** Build, lint, and all plan-specified `grep` verification commands pass
- **Committed in:** `78c6058`, `2c69b57`

**2. [Rule 1 - Bug] next-themes' documented `mounted` guard trips the default ESLint config**
- **Found during:** Task 3, running `npm run lint`
- **Issue:** The plan's canonical `ThemeToggle` pattern (`useState` + `useEffect(() => setMounted(true), [])`) triggers `react-hooks/set-state-in-effect` under `create-next-app`'s default ESLint 9 flat config (React 19.2 stricter hooks rule), failing `npm run lint`, which the plan's overall `<verification>` section requires to pass.
- **Fix:** Replaced the `useState`/`useEffect` mount flag with `useSyncExternalStore(subscribe, () => true, () => false)` — functionally identical (server snapshot `false`, client snapshot `true` post-hydration), same FOUC-avoidance guarantee, but no `setState` call inside an effect body.
- **Files modified:** `src/components/theme/ThemeToggle.tsx`
- **Verification:** `npm run lint` passes with zero errors; `npm run build` passes; manual HTTP smoke test confirmed the toggle's mounted-guard div renders correctly pre-hydration
- **Committed in:** `2c69b57`

---

**Total deviations:** 2 auto-fixed (1 missing referenced file, 1 lint-blocking pattern fix)
**Impact on plan:** Neither affects scope or design intent — the missing-file deviation is a documentation gap (equivalent content existed in RESEARCH.md), and the lint fix preserves the exact behavior the plan specifies while satisfying the project's own generated lint config. No scope creep.

## Issues Encountered
- No Python PIL/ImageMagick available in the environment for generating `public/hero.jpg`; worked around by hand-writing a minimal BMP file (Python `struct`) and converting to JPEG via macOS's built-in `sips` — produces a valid 800x800 JPEG placeholder as required by the plan's acceptance criteria.
- `npm audit` reports 2 moderate-severity advisories (a `postcss` XSS advisory nested inside `next`'s own dependency tree). Not auto-fixed: the only available fix path is `npm audit fix --force`, which would downgrade `next` to a `9.x` canary — a regression far outside this task's scope. Logged here for visibility; not a Phase 1 blocker since it's an upstream framework-level advisory, not code this plan wrote.

## User Setup Required

None blocking this plan's own verification, but one deferred asset swap is required before the site is presentation-ready: replace the placeholder `public/hero.jpg` with a real portrait of Rasmus (~800x800 or larger, square-ish crop) — same path, no code changes needed. This is already documented in the plan's `user_setup` frontmatter.

## Next Phase Readiness
- Architectural backbone (design tokens, ThemeProvider, Container/Button primitives, site-config, `(site)` route group) is in place for plans 01-02 through 01-05 to build on without renegotiation.
- `/blog` nav-link entry exists in `site-config.ts.nav` but has no corresponding route yet — intentional per D-08/RESEARCH.md flag, resolves in Phase 2.
- No blockers for 01-02 (nav + footer + mobile nav via `@radix-ui/react-dialog`, already installed).

---
*Phase: 01-core-site-design-system*
*Completed: 2026-07-13*
