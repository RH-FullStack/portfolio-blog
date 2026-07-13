---
phase: 02-blog-content-system
fixed_at: 2026-07-13T21:09:15Z
review_path: .planning/phases/02-blog-content-system/02-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 02: Code Review Fix Report

**Fixed at:** 2026-07-13T21:09:15Z
**Source review:** .planning/phases/02-blog-content-system/02-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4 (WR-01..WR-04; 0 Critical findings existed; `fix_scope: critical_warning` excludes IN-01..IN-04)
- Fixed: 4
- Skipped: 0

## Fixed Issues

### WR-01: `npm run lint` currently fails on `MDXContent` (react-hooks/static-components)

**Files modified:** `src/components/mdx/MDXContent.tsx`
**Commit:** `f35e6cc`
**Applied fix:** Renamed `useMDXComponent` to `compileMdxComponent` per the
review's suggested Option B. Verification showed the rule
(`react-hooks/static-components`, part of `eslint-plugin-react-hooks@7`'s
bundled React Compiler rules) still fired after the rename — it flags any
capitalized variable assigned from a function call and rendered as JSX during
render, independent of `use*` naming. Adapted the fix: added a scoped
`eslint-disable-next-line react-hooks/static-components` directly above the
JSX return line, with an inline comment explaining why the rule's "component
identity resets across renders" hazard does not apply (Server Component,
rendered once per request, never re-rendered client-side). Converting to a
`useMemo` + `'use client'` client component (the review's Option A) was
rejected as disproportionate — it would move first-party MDX rendering to the
client bundle, against the project's zero-unnecessary-client-JS performance
goal, to suppress a rule whose underlying concern doesn't apply to Server
Components. `npm run lint` now exits 0 (previously 1 error).

### WR-02: Code blocks have no CSS for padding/background/overflow

**Files modified:** `src/app/globals.css`
**Commit:** `3cb9653`
**Applied fix:** Added the `pre[data-theme] { overflow-x: auto; border-radius:
0.5rem; padding: 1rem; }` rule suggested by the review, directly below the
existing syntax-highlighting color rules. Verified via `npx next build` that
the one post with a fenced code block (`why-i-write-code-toward-japan.mdx`)
renders with the new layout styling applied.

### WR-03: Heading anchor links (D-13) render as invisible, keyboard-unreachable dead UI

**Files modified:** `velite.config.ts`, `src/app/globals.css`
**Commit:** `612a2be`
**Applied fix:** Followed the UI-SPEC-mandated treatment (not the review's
generic either/or fix text): configured `rehype-autolink-headings` with
`behavior: 'append'`, `content: { type: 'text', value: '#' }`, and
`properties: { className: ['heading-anchor'], ariaLabel: 'Link to this
heading' }` — dropping the default `ariaHidden`/`tabIndex: -1` so the anchor
is keyboard-reachable and has an accessible name. Added a `.heading-anchor`
CSS rule in `globals.css`: `text-label` (14px) sizing, `ink/40` resting color,
`vermillion`/`vermillion-dark` on hover/focus-visible, a visible
`focus-visible` outline ring (matching the project's established focus
convention), and a 44×44px (`2.75rem`) minimum hit area via `min-width`/
`min-height` on an `inline-flex` box rather than inflating the visible glyph
— matching `Button.tsx`'s `iconOnly` convention per UI-SPEC.
`npx velite --clean` was run to regenerate `.velite/posts.json`, and the
regenerated output was inspected directly to confirm the rendered anchor now
carries `className:"heading-anchor"`, `aria-label:"Link to this heading"`,
visible `#` text content, and no `aria-hidden`/`tabIndex` properties.

### WR-04: Tag and post-title links use weaker focus-visible styling than the rest of the site

**Files modified:** `src/components/ui/Tag.tsx`, `src/components/blog/PostListRow.tsx`
**Commit:** `28a774f`
**Applied fix:** Added the same outline-ring focus-visible classes used by
`Button.tsx`'s `BASE_CLASSES` (`focus-visible:outline
focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-vermillion dark:focus-visible:outline-vermillion-dark`)
to both the clickable `Tag` variant's `Link` and `PostListRow`'s post-title
`Link`, alongside their existing `focus-visible:text-vermillion` color
change, for consistency with the established site convention.

## Skipped Issues

None — all in-scope findings (WR-01..WR-04) were fixed.

## Verification

Ran after all four fixes were committed:
- `npm run lint` — 0 errors (1 pre-existing warning, `IN-04`, out of scope)
- `npm test` — 5 passed (1 test file)
- `npx tsc --noEmit` — no errors
- `npx next build` — compiled successfully, all 16 static pages + dynamic
  blog/tag routes generated without error

---

_Fixed: 2026-07-13T21:09:15Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
