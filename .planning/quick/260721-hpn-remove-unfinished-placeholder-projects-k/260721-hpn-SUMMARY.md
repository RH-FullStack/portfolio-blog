---
phase: quick
plan: 260721-hpn
subsystem: content/projects
tags: [projects, content-cleanup, layout]
dependency-graph:
  requires: []
  provides:
    - "Honest single-project portfolio data (rasmusos only)"
    - "Count-aware project grid layout pattern"
  affects:
    - src/content/projects.ts
    - "src/app/(site)/page.tsx"
    - "src/app/(site)/projects/page.tsx"
tech-stack:
  added: []
  patterns:
    - "Count-aware Tailwind grid className via ternary on array length, each branch a complete literal class string (required for Tailwind v4 JIT content scanning)"
key-files:
  created: []
  modified:
    - src/content/projects.ts
    - "src/app/(site)/page.tsx"
    - "src/app/(site)/projects/page.tsx"
decisions: []
metrics:
  duration: "~20 min"
  completed: 2026-07-21
---

# Quick Task 260721-hpn: Remove unfinished placeholder projects Summary

Removed the three AI-generated placeholder project entries (`portfolio-tracker`, `dojo-scheduler`, `devnotes-cli`) with fake `example.com` demo links from `src/content/projects.ts`, leaving only the real `rasmusos` entry, and made both project grid surfaces (homepage teaser and `/projects` index) render a single card as an intentional, constrained layout instead of a stretched or half-empty row.

## What Was Built

**Task 1 — Data removal:** Deleted the three placeholder object literals from the `projects` array in `src/content/projects.ts`, leaving exactly one entry (`slug: 'rasmusos'`) untouched. Re-ran the full-tree reference audit (grep for the three removed slugs across all source, excluding `node_modules`, `.next`, `.git`, `.velite`, `.planning`) — zero matches, confirming no dangling references anywhere (no dynamic routes, no sitemap loop, no tests reference project slugs, as the plan's pre-done audit predicted).

**Task 2 — Grid layout polish:** Both `src/app/(site)/page.tsx` (Featured Projects teaser, driven by `FEATURED_PROJECTS.length`) and `src/app/(site)/projects/page.tsx` (`/projects` index, driven by `projects.length`) now select their grid container className via a ternary: `mt-12 grid grid-cols-1 gap-8 max-w-md` when exactly 1 project, falling back to the original responsive multi-column string (`sm:grid-cols-2 lg:grid-cols-3` / `sm:grid-cols-2`) otherwise. Each branch is a complete literal Tailwind class string (no string interpolation), satisfying Tailwind v4's JIT content scanner. The `Card` component, section headings, buttons, and Latest Writing section were left untouched.

**Task 3 — Verification:** `npm run build`, `npm run lint`, and `npm test` all pass with the one-project data set and count-aware grids in place.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking issue] Hydrated empty `node_modules` in the execution worktree**
- **Found during:** Task 3 (`npm run build`)
- **Issue:** The git worktree this task executed in had a `node_modules/` directory containing only a stray Velite compiled-config artifact — no actual npm packages were installed. `npm run build` failed with `ENOENT` on a Geist font file inside `node_modules/geist/...` because the package simply wasn't present. `package-lock.json` in the worktree was already correct and identical to the committed lockfile (no diff vs. HEAD) — this was a worktree-setup gap, not a dependency change.
- **Fix:** Ran `npm ci` to hydrate `node_modules` strictly from the existing, committed `package-lock.json` (no new packages added, no lockfile changes — this is not a package-manager-install of a new/unverified dependency, so it does not trigger the Rule 3 install exclusion).
- **Files modified:** None (node_modules is gitignored; no tracked files changed by this step).
- **Commit:** N/A (no trackable changes; `git status --short` was clean before and after).

## Auth Gates

None encountered.

## Known Stubs

None. The single remaining `rasmusos` project entry is real content, not a placeholder.

## Threat Flags

None. This change only removes data and adjusts CSS class selection logic; no new network endpoints, auth paths, file access patterns, or schema changes were introduced.

## Verification Results

- `src/content/projects.ts` exports exactly one `Project` entry (`rasmusos`); confirmed via `grep -c "slug: '"` returning `1`.
- Full-tree grep for `portfolio-tracker`, `dojo-scheduler`, `devnotes-cli` returns zero matches outside `.planning/`.
- `grep` confirms `max-w-md` and the length-driven ternary (`FEATURED_PROJECTS.length` / `projects.length`) are present in both page files.
- `npm run build` — succeeded, all 16 routes generated (including `/`, `/projects`, `/opengraph-image`).
- `npm run lint` — 0 errors (1 pre-existing unrelated warning in `next.config.mjs` about anonymous default export, not touched by this task).
- `npm test` (vitest) — 5/5 tests passed (`related-posts.test.ts`, unaffected by this change as predicted).
- Card component, sitemap, routes, and all unrelated pages/content are unmodified — confirmed via `git status --short` showing only the three intended files changed.

## Self-Check: PASSED

- FOUND: src/content/projects.ts (single `rasmusos` entry confirmed)
- FOUND: src/app/(site)/page.tsx (count-aware grid confirmed)
- FOUND: src/app/(site)/projects/page.tsx (count-aware grid confirmed)
- FOUND commit 59d9af5 (Task 1: remove placeholder projects)
- FOUND commit eefd15e (Task 2: count-aware grid layout)
