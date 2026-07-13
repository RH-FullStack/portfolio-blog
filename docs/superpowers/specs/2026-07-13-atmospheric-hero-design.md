# Atmospheric Hero — Design Spec

**Date:** 2026-07-13
**Status:** Approved by Rasmus (brainstormed via visual companion; option "dark ink dim" selected)
**Scope:** Homepage hero section only. No other page gets imagery in this round.
**Implementation route:** `/gsd-quick` task, queued AFTER Phase 2 Wave 3 completes (Wave 3's plan 02-06 modifies the same `src/app/(site)/page.tsx` — this change must land on top, not in parallel).

## Decision summary

The site keeps Phase 1's "ma" minimalist philosophy everywhere except the homepage hero, which becomes a full-bleed photographic section ("atmospheric hero", direction A of 3 explored) using the **dark ink dim** treatment (option B of 3 explored).

## Requirements

1. **Full-bleed photo hero.** The hero section spans the full viewport width. `public/Background.jpg` renders behind the hero content via `next/image` with `fill`, `priority`, `className` including `object-cover`, and `alt=""` (decorative). Hero content stays inside the existing centered `Container`.
2. **Nav untouched.** The header/nav keeps its solid paper background and bottom border; the photo begins below the nav (approved mockup behavior).
3. **Dark overlay for readability.** A gradient overlay sits between photo and content: `linear-gradient(180deg, rgba(22,21,15,0.55), rgba(22,21,15,0.78))` (top → bottom).
4. **Light text palette inside the hero only:**
   - Name (h1): `#F5F2EA` (existing `--color-ink-dark` value)
   - Tagline: `#E2632E` (existing `--color-vermillion-dark` value)
   - Supporting line: muted light tone (approx `#d8d4c8`)
   - Circular portrait (`/hero.jpg`): keeps size/shape; border switches to a light `rgba(245,242,234,0.9)`-style ring
   - CTA button: unchanged (existing vermillion `Button`)
   Use existing CSS variables where they match; do not introduce new tokens.
5. **Theme-invariant.** The treatment is identical in light and dark mode (the overlay is already dark). No `dark:` variants needed inside the hero.
6. **Image budget.** Downscale `public/Background.jpg` to ≤2000px on the long edge, JPEG quality ~70 (target ≤500 KB) before committing. Preserve the original outside `public/` if Rasmus wants it kept.
7. **No motion changes.** D-03 "subtle micro-interactions" stands; no parallax/ken-burns.

## Non-goals

- No imagery on About, Projects, Blog, or Contact pages (explicitly deferred by Rasmus — revisit after living with the hero).
- No change to design tokens, `Tag`, `Card`, `Prose`, or any Phase 1/2 component.
- No text/copy changes in the hero.

## Acceptance criteria

- `src/app/(site)/page.tsx` hero section renders `Background.jpg` full-bleed with the specified overlay; `grep` finds `priority` and `alt=""` on the background image.
- Hero name/tagline meet WCAG AA contrast against the dimmed photo (light text on ≥0.55-opacity dark overlay).
- `public/Background.jpg` ≤500 KB on disk.
- Toggling theme produces no visual change inside the hero section.
- `npx tsc --noEmit` and `next build` pass.
