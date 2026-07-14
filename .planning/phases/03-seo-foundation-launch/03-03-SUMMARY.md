---
phase: 03-seo-foundation-launch
plan: 03
subsystem: seo
tags: [favicon, sharp, png-to-ico, next.js, icon-file-convention, monogram]

# Dependency graph
requires:
  - phase: 02-blog-content-system
    provides: src/components/layout/Header.tsx Monogram() geometry (D-06/D-09)
provides:
  - Modern SVG favicon (src/app/icon.svg) using verbatim enso monogram path data
  - 180x180 apple-touch icon (src/app/apple-icon.png) for iOS home-screen saves
  - Multi-resolution favicon.ico (16/32/48) replacing the scaffold default
  - Reproducible scripts/generate-icons.mjs render pipeline (sharp + png-to-ico)
affects: [03-06-launch-verification]

# Tech tracking
tech-stack:
  added: [sharp (already transitive via next, used directly for SVG->PNG rendering), png-to-ico (npx-only, not a dependency)]
  patterns: ["Next.js icon file-convention statics (icon.svg, apple-icon.png, favicon.ico) generated from a single embedded SVG source of truth"]

key-files:
  created:
    - src/app/icon.svg
    - src/app/apple-icon.png
    - scripts/generate-icons.mjs
  modified:
    - src/app/favicon.ico

key-decisions:
  - "Embedded the monogram SVG string directly inside scripts/generate-icons.mjs rather than reading src/app/icon.svg at generation time, so the generator remains a standalone reproducible artifact"
  - "png-to-ico invoked via npx --yes rather than installed as a dependency (matches plan's threat disposition T-03-08: accept, low-value supply-chain target for a static asset)"

patterns-established:
  - "Favicon/icon set generation: single embedded SVG source -> sharp raster renders -> png-to-ico packing, committed as a one-off Node ESM script for reproducibility"

requirements-completed: [SEO-01]

# Metrics
duration: 1min
completed: 2026-07-14
---

# Phase 3 Plan 03: Favicon & Icon Set Summary

**Monogram-based favicon set (icon.svg, apple-icon.png, favicon.ico) generated via a committed sharp + png-to-ico script, replacing the Next.js scaffold default**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-07-14T12:01:00+02:00
- **Completed:** 2026-07-14T12:01:39+02:00
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Standalone `src/app/icon.svg` favicon using the exact enso monogram path data from `Header.tsx` (`M16 5a11 11 0 1 1-7.8 3.2` and `M16 11v10`), on a `#FAF9F6` paper background for legibility in dark browser-tab chrome
- `scripts/generate-icons.mjs` committed generator that renders a 180x180 `apple-icon.png` (iOS home-screen icon; iOS has no SVG icon support) and a multi-resolution `favicon.ico` (16/32/48) via `sharp` + `npx png-to-ico`
- Scaffold-default `favicon.ico` (25.9KB MS icon resource) replaced with the monogram-based icon set
- Verified regeneration is deterministic — re-running the script produces byte-identical output (no unexpected git diff)

## Task Commits

Each task was committed atomically:

1. **Task 1: Static SVG favicon (icon.svg)** - `26d7ccf` (feat)
2. **Task 2: Generate apple-icon.png and favicon.ico via sharp + png-to-ico** - `aabeb44` (feat)

_No TDD tasks in this plan (static asset generation, not testable business logic)._

## Files Created/Modified

- `src/app/icon.svg` - Standalone SVG favicon, enso monogram on paper background, picked up by Next.js's `icon` file convention
- `scripts/generate-icons.mjs` - Committed Node ESM generator: embeds the monogram SVG, renders raster PNGs via `sharp`, packs `favicon.ico` via `npx png-to-ico`
- `src/app/apple-icon.png` - 180x180 PNG, iOS home-screen icon, picked up by Next.js's `apple-icon` file convention
- `src/app/favicon.ico` - Multi-resolution (16/32/48) ICO, replaces the create-next-app scaffold default

## Decisions Made

- Embedded the SVG source string inside `generate-icons.mjs` (rather than reading `icon.svg` at generation time) so the script is a fully self-contained, reproducible artifact independent of the other static file
- Used `npx --yes png-to-ico` rather than adding it as a project dependency — it is a one-off, author-time tool with no runtime footprint, matching the plan's accepted threat disposition (T-03-08)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

The favicon/icon half of SEO-01 is complete. The `<link>` tag injection is automatic via Next.js's file-convention (no manual `<head>` wiring needed), and actual browser-tab/production rendering verification is deferred to plan 03-06 per this plan's `<success_criteria>`. No blockers for subsequent Phase 3 plans.

## Self-Check

- `src/app/icon.svg` — FOUND
- `src/app/apple-icon.png` — FOUND
- `src/app/favicon.ico` — FOUND
- `scripts/generate-icons.mjs` — FOUND
- Commit `26d7ccf` — FOUND
- Commit `aabeb44` — FOUND

---
*Phase: 03-seo-foundation-launch*
*Completed: 2026-07-14*
