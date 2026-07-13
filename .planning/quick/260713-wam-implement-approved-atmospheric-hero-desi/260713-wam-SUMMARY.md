---
phase: quick
plan: 260713-wam
subsystem: ui
tags: [nextjs, tailwind, next-image, hero]

# Dependency graph
requires:
  - phase: 02-blog-content-system
    provides: existing homepage structure (Container, Card, PostListRow teasers) this plan builds on top of
provides:
  - Full-bleed atmospheric hero on the homepage using public/Background.jpg
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Full-bleed <section> with next/image fill+priority background, absolute gradient overlay div, and a relatively-positioned Container layered on top for content"

key-files:
  created: [public/Background.jpg, images/Background-original.jpg (untracked, preserved original)]
  modified: [src/app/(site)/page.tsx]

key-decisions:
  - "Downscaled Background.jpg with macOS sips (2000px long edge, JPEG quality 70) to 409004 bytes, comfortably under the 512000-byte budget"
  - "Kept full-resolution original at images/Background-original.jpg, intentionally left untracked (outside public/, per plan)"

patterns-established:
  - "Photographic hero sections use next/image fill + priority + sizes=100vw with a dedicated aria-hidden absolute overlay div for the dark gradient dim, keeping content in a relative-positioned Container above it"

requirements-completed: [ATMOS-HERO]

# Metrics
duration: 8min
completed: 2026-07-13
---

# Quick Task 260713-wam: Atmospheric Hero Summary

**Full-bleed photographic hero on the homepage using a downscaled Background.jpg with a dark ink-dim gradient overlay and theme-invariant light text**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-07-13T21:10:00Z (approx)
- **Completed:** 2026-07-13T21:18:22Z
- **Tasks:** 2
- **Files modified:** 2 (public/Background.jpg created, src/app/(site)/page.tsx modified)

## Accomplishments
- Downscaled `public/Background.jpg` from 5712x4284 (~2.0 MB) to 2000x1500 (409,004 bytes), well under the 500 KB budget, while preserving the full-resolution original at `images/Background-original.jpg` (untracked, outside `public/`)
- Replaced the homepage's centered hero `Container` with a full-bleed `<section>`: `Background.jpg` rendered via `next/image` (`fill`, `priority`, `sizes="100vw"`, `object-cover`), a dark gradient overlay (`rgba(22,21,15,0.55)` to `rgba(22,21,15,0.78)`, top to bottom), and hero content (portrait, name, tagline, role, CTA) layered above it in the light palette
- Left the Featured Projects and Latest Writing teaser `Container` blocks below the hero byte-for-byte unchanged
- `npx tsc --noEmit` and `npx next build` both pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Downscale Background.jpg and preserve the original** - no code commit (image-only file prep staged in Task 2's commit per plan instructions)
2. **Task 2: Rewrite the hero section as a full-bleed atmospheric hero and commit** - `b4f5031` (feat)

_Note: Per plan instructions, Task 1's downscaled image was committed together with Task 2's page.tsx change in a single commit (`b4f5031`), since Task 1 explicitly says "Do NOT commit yet — Task 2 stages both files in one commit."_

## Files Created/Modified
- `public/Background.jpg` - Downscaled hero background image (2000x1500, 409004 bytes), committed
- `images/Background-original.jpg` - Full-resolution original (5712x4284, ~2.0 MB) preserved outside `public/`, intentionally untracked
- `src/app/(site)/page.tsx` - Hero section rewritten as full-bleed `<section>` with `Background.jpg`, dark gradient overlay, and light-palette theme-invariant hero text; teaser sections below left unchanged

## Decisions Made
- Used macOS `sips` for downscaling (per plan) rather than adding an image-processing dependency — zero new deps, matches the project's zero-cost/no-backend constraint
- Confirmed `.gitignore`, `public/hero.jpg`, and `src/lib/site-config.ts` had pre-existing unrelated modifications in the working tree; left them completely untouched per the staging fence (only `public/Background.jpg` and `src/app/(site)/page.tsx` were staged and committed)

## Deviations from Plan

None - plan executed exactly as written. The reference structure in the plan was used directly for the hero section; all five acceptance criteria from the approved spec were verified.

## Issues Encountered

None. The `sips` downscale in Task 1 hit the ≤500 KB target on the first attempt (409,004 bytes), so no additional quality/size iteration was needed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Homepage hero visually complete per the approved "dark ink dim" spec; no blockers for Phase 2 continuation
- `images/Background-original.jpg` is preserved locally (untracked) in case Rasmus wants to re-derive a different crop/quality later
- No other pages received imagery per the spec's explicit non-goals (About, Projects, Blog, Contact untouched)

---
*Phase: quick/260713-wam*
*Completed: 2026-07-13*

## Self-Check: PASSED

- FOUND: public/Background.jpg
- FOUND: images/Background-original.jpg
- FOUND: src/app/(site)/page.tsx
- FOUND: commit b4f5031
