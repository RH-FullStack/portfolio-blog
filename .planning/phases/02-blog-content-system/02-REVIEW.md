---
phase: 02-blog-content-system
reviewed: 2026-07-13T23:15:00Z
depth: standard
files_reviewed: 18
files_reviewed_list:
  - next.config.mjs
  - velite.config.ts
  - tsconfig.json
  - package.json
  - src/app/globals.css
  - src/lib/posts.ts
  - src/lib/related-posts.ts
  - src/lib/related-posts.test.ts
  - src/components/ui/Tag.tsx
  - src/components/mdx/MDXContent.tsx
  - src/components/blog/PostListRow.tsx
  - src/app/(site)/blog/page.tsx
  - src/app/(site)/blog/[slug]/page.tsx
  - src/app/(site)/blog/tags/[tag]/page.tsx
  - src/app/(site)/page.tsx
  - content/posts/starting-to-invest-at-thirty.mdx
  - content/posts/what-aikido-taught-me-about-shipping.mdx
  - content/posts/why-i-write-code-toward-japan.mdx
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-07-13T23:15:00Z
**Depth:** standard
**Files Reviewed:** 18
**Status:** issues_found

## Summary

Reviewed the Velite/MDX content pipeline, the published-post query layer, blog
routes (`/blog`, `/blog/[slug]`, `/blog/tags/[tag]`), the homepage teaser, and
the three launch MDX posts. `npm run build` and `npm test` both succeed, and
`tsc --noEmit` reports no type errors. The draft-exclusion invariant (D-11),
`dynamicParams = false` route hardening (T-02-10/T-02-11), and the related-posts
ranking algorithm (verified against its Vitest suite) are all implemented
correctly and match the documented threat model in `02-RESEARCH.md`.

No critical (security/crash) issues were found. Four warnings surfaced,
centered on two "craft" decisions (D-13 heading anchors, syntax-highlighted
code blocks) that ship with the required plumbing but no supporting CSS,
leaving them either invisible/dead or visually broken on narrow viewports;
plus one real ESLint error (`react-hooks/static-components`) that currently
fails `npm run lint`, and an accessibility/consistency gap in the two new
interactive row/tag components. Info items are minor maintainability/defense-in-depth
notes.

## Warnings

### WR-01: `npm run lint` currently fails on `MDXContent` (react-hooks/static-components)

**File:** `src/components/mdx/MDXContent.tsx:11-24`
**Issue:** `useMDXComponent` is a plain function (not a memoized hook) that calls
`new Function(code)` and returns a fresh component type on every invocation.
Because the function is named with a `use...` prefix, ESLint's
`react-hooks/static-components` rule (enabled via `eslint-config-next`) treats
it as a hook and flags the call site in `MDXContent` as "Cannot create
components during render" — confirmed by running `npm run lint`:
```
src/components/mdx/MDXContent.tsx
  24:11  error  Error: Cannot create components during render
```
This doesn't break `next build` (Next's build step doesn't currently run this
lint rule), but it does fail the project's own `lint` script, which would
block CI/pre-commit gates that shell out to `npm run lint`.
**Fix:** Either memoize the component (`useMemo(() => fn({ ...runtime }).default, [code])`)
and mark the file `'use client'`, or — since `MDXContent` is a Server
Component that only ever runs once per request, not re-rendered — rename the
helper away from the `use*` prefix (e.g. `compileMdxComponent`) so it no
longer trips the hooks lint rule:
```ts
function compileMdxComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}
```

### WR-02: Code blocks have no CSS for padding/background/overflow — will overflow on mobile

**File:** `src/app/globals.css:45-58` (missing rule), reflected in
`content/posts/why-i-write-code-toward-japan.mdx:17-29` (the one post with a
fenced code block)
**Issue:** `rehype-pretty-code` ships intentionally unstyled (per `STACK.md`),
requiring project CSS against its `pre`/`code[data-theme]` attributes.
`globals.css` only defines light/dark text and background color rules for
`code[data-theme*=" "]` — there is no rule at all for the `pre` element
(padding, border-radius, or `overflow-x: auto`). Verified in the built output:
`<pre style="--shiki-...">` carries no layout styling. Since `Prose` constrains
content to `max-w-2xl` and the TypeScript snippet's lines are ~40-60 chars
wide, this happens to fit today, but any future post with longer lines (or a
narrower viewport) will overflow the container with no horizontal scrollbar,
breaking the reading layout.
**Fix:** Add layout styling for the `pre` element, e.g.:
```css
pre[data-theme] {
  overflow-x: auto;
  border-radius: 0.5rem;
  padding: 1rem;
}
```

### WR-03: Heading anchor links (D-13) render as invisible, keyboard-unreachable dead UI

**File:** `velite.config.ts:37-41` (rehype plugin config), `src/app/globals.css`
(no supporting rule)
**Issue:** `rehype-autolink-headings` is wired in with its default options, and
`02-CONTEXT.md` D-13 frames it as "clickable heading anchor links... low
effort, matches the quality craftsmanship design goal." The rendered output
(verified in the built HTML) is:
```html
<a aria-hidden="true" tabIndex="-1" href="#...">
  <span class="icon icon-link"></span>
</a>
```
`globals.css` has no rule for `.icon` or `.icon-link`, so the span renders
with zero visual content. Combined with `aria-hidden="true"` (hidden from
screen readers) and `tabIndex="-1"` (removed from keyboard tab order), the
anchor is unreachable and invisible to every user — sighted, keyboard, and
assistive-tech alike. The only way to reach a heading's fragment URL today is
to already know it and type it manually; the "clickable" part of D-13 is not
actually functional.
**Fix:** Either add a visible icon glyph via CSS (e.g. a `::before`
content/mask-image on `.icon-link`, sized/colored to match `--color-ink`) and
drop `tabIndex="-1"` so keyboard users can reach it, or pass an explicit
`behavior`/`properties`/`content` option to `rehypeAutolinkHeadings` that
renders a visible `#` or link glyph as part of the heading itself.

### WR-04: Tag and post-title links use weaker focus-visible styling than the rest of the site

**File:** `src/components/ui/Tag.tsx:29`, `src/components/blog/PostListRow.tsx:28`
**Issue:** Both the clickable `Tag` variant and the post-title `Link` in
`PostListRow` only change text color on `:focus-visible`
(`focus-visible:text-vermillion`). Every other interactive element in the
codebase — `Button.tsx`'s `BASE_CLASSES`, and the header/footer nav links
(verified in rendered HTML) — uses a visible outline ring:
`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-vermillion dark:focus-visible:outline-vermillion-dark`.
The two new interactive components introduced in this phase (tag badges and
post-list title links, used across `/blog`, `/blog/tags/[tag]`, related posts,
and the homepage teaser) give keyboard users a noticeably weaker focus
indicator than the established site convention.
**Fix:** Add the same outline-ring classes used by `Button.tsx` to both
components' focus-visible state for consistency.

## Info

### IN-01: `related-posts.ts` re-filters drafts, contradicting the "single place" comment in `posts.ts`

**File:** `src/lib/related-posts.ts:8`, cross-referenced with `src/lib/posts.ts:1-6`
**Issue:** `posts.ts`'s header comment states: "D-11: draft posts are excluded
in ONE place — `getPublishedPosts()` — that every exported function builds
on. Never filter drafts elsewhere." `related-posts.ts` line 8 independently
filters `!p.draft` again. In practice this is harmless defense-in-depth (the
production call site in `blog/[slug]/page.tsx` already passes draft-filtered
input from `getAllPosts()`), and it's directly exercised by the "excludes...
any draft posts" Vitest case — but it does drift from the stated single-source
invariant and could confuse future maintainers about where the actual
draft-filtering boundary is.
**Fix:** Either update the `posts.ts` comment to acknowledge
`getRelatedPosts` as an intentional second defensive filter, or drop the
redundant filter and rely solely on callers passing already-published posts
(documenting that expectation in the function's JSDoc instead).

### IN-02: No format validation on frontmatter `tags` — an unusual tag would produce a broken archive link

**File:** `velite.config.ts:20` (`tags: s.array(s.string())`), consumed by
`src/components/ui/Tag.tsx:27-33` and `src/components/blog/PostListRow.tsx:41`
**Issue:** Tag strings are interpolated directly into `href={`/blog/tags/${tag}`}`
with no `encodeURIComponent` and no schema-level constraint (e.g. slug-safe
regex) on the `tags` field. All three launch posts use single lowercase words,
so this isn't an active bug, but a future tag containing a space, slash, or
other URL-significant character would produce a malformed link and/or a
`generateStaticParams` entry that doesn't match the reader-facing URL.
**Fix:** Add a lightweight regex refinement to the `tags` field (e.g.
`s.string().regex(/^[a-z0-9-]+$/)`) or `encodeURIComponent(tag)` at the two
link call sites.

### IN-03: Magic number in title length constraint

**File:** `velite.config.ts:18`
**Issue:** `title: s.string().max(99)` — the `99` cap has no accompanying
comment explaining the rationale (vs. e.g. a round 100, or an SEO-driven
value like 60).
**Fix:** Add a short comment noting why 99 was chosen, or use a named
constant if the same limit is referenced elsewhere.

### IN-04: Anonymous default export in `next.config.mjs`

**File:** `next.config.mjs:12`
**Issue:** ESLint flags this with `import/no-anonymous-default-export`:
```
next.config.mjs
  12:1  warning  Assign object to a variable before exporting as module default
```
Purely stylistic — does not affect Velite's build-gate wiring (lines 1-9),
which was verified working correctly.
**Fix:**
```js
const nextConfig = {}
export default nextConfig
```

---

_Reviewed: 2026-07-13T23:15:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
