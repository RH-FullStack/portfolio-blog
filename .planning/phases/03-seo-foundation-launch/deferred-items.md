# Deferred Items — Phase 03 (seo-foundation-launch)

Out-of-scope issues discovered during execution but not fixed (per executor scope-boundary rule — only issues directly caused by the current task's changes are auto-fixed).

## From Plan 03-05

- **`npx tsc --noEmit` reports `Cannot find module '#site/content'`** in `src/components/blog/PostListRow.tsx`, `src/lib/posts.ts`, `src/lib/related-posts.ts`, `src/lib/related-posts.test.ts`, plus related implicit-`any` parameter errors. Confirmed pre-existing via `git stash` before this plan's changes — unrelated to `src/content/projects.ts` / `src/components/ui/Card.tsx`. Likely requires a Velite codegen build step (`velite build` / `next build`) to generate the `#site/content` virtual module before `tsc --noEmit` passes cleanly in isolation. Not fixed here; out of scope for SEO-04 (project card image handling).
